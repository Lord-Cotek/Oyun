"use server";

import { revalidatePath } from "next/cache";
import { deleteHealthLog } from "@/lib/health-export";
import { Prisma } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getActiveMembership } from "@/lib/data";
import { attachFiles, deleteFiles, logAccess, type LogAccess } from "@/lib/health-log-db";
import { DEFAULT_TARGETS, cleanReading, dayContext, dayIn, evaluate, readTargets, type TargetKey, type Verdict } from "@/lib/health-log";

type Result<T = object> = ({ ok: true } & T) | { ok: false; error: string };

/** The log of the journey in view, if this person may open it. */
async function access(): Promise<LogAccess | null> {
  const session = await auth();
  if (!session?.user?.id) return null;
  const active = await getActiveMembership(session.user.id);
  if (!active) return null;
  return logAccess(session.user.id, active.journey.id);
}

const NOPE = { ok: false as const, error: "The health log is kept by the two of you." };

function refresh() {
  revalidatePath("/health/log");
  revalidatePath("/journey");
}

/**
 * Record a file the browser has just uploaded. The address is checked to be
 * our storage, under this journey's own health folder, before it is kept.
 */
export async function registerHealthFile(input: { url: string; access: string; contentType: string; size: number }): Promise<Result<{ id: string }>> {
  const a = await access();
  if (!a) return NOPE;
  let u: URL;
  try {
    u = new URL(String(input.url));
  } catch {
    return { ok: false, error: "That upload did not arrive." };
  }
  if (u.protocol !== "https:" || !u.hostname.endsWith(".blob.vercel-storage.com") || !u.pathname.startsWith(`/health/${a.journeyId}/`)) {
    return { ok: false, error: "That upload did not arrive." };
  }
  const type = ["image/jpeg", "image/png", "image/webp", "application/pdf"].includes(input.contentType) ? input.contentType : null;
  if (!type) return { ok: false, error: "Only photos and PDFs can be kept here." };
  const f = await prisma.healthFile.create({
    data: {
      journeyId: a.journeyId,
      uploadedById: a.userId,
      url: u.toString(),
      access: input.access === "public" ? "public" : "private",
      contentType: type,
      size: Math.max(0, Math.min(Number(input.size) || 0, 50_000_000)),
    },
    select: { id: true },
  });
  return { ok: true, id: f.id };
}

/** Throw away an upload that never made it onto an entry (the sheet was closed). */
export async function discardHealthFile(id: string): Promise<{ ok: boolean }> {
  const a = await access();
  if (!a) return { ok: false };
  const f = await prisma.healthFile.findFirst({ where: { id, journeyId: a.journeyId, uploadedById: a.userId, entryId: null }, select: { id: true } });
  if (f) await deleteFiles({ journeyId: a.journeyId, ids: [f.id] });
  return { ok: true };
}

/**
 * Save a reading — new, or a change to one already kept. Either of the two
 * may record; a change is for whoever recorded it, or for her, whose health
 * it is. Photos taken off in the editor leave storage too.
 */
export async function saveReading(input: Record<string, unknown> & { id?: string; fileIds?: string[]; removeFileIds?: string[] }): Promise<Result<{ id: string; verdict: Verdict }>> {
  const a = await access();
  if (!a) return NOPE;
  const clean = cleanReading(input, a.units);
  if (!clean.ok) return clean;
  const d = clean.data;
  const data = {
    kind: d.kind,
    takenAt: d.takenAt,
    slot: d.slot,
    valueA: d.valueA,
    valueB: d.valueB,
    valueC: d.valueC,
    // A reading with nothing extra stores SQL NULL, not a JSON null.
    detail: d.detail ? (d.detail as Prisma.InputJsonObject) : Prisma.DbNull,
    note: d.note,
  };
  let id: string;
  if (input.id) {
    const row = await prisma.healthReading.findFirst({ where: { id: String(input.id), journeyId: a.journeyId }, select: { id: true, recordedById: true } });
    if (!row) return { ok: false, error: "That reading is no longer here." };
    if (!a.isMother && row.recordedById !== a.userId) return { ok: false, error: "Only whoever wrote this one down, or Mum, can change it." };
    await prisma.healthReading.update({ where: { id: row.id }, data });
    id = row.id;
    const remove = (input.removeFileIds ?? []).filter((x) => typeof x === "string");
    if (remove.length) {
      const mine = await prisma.healthFile.findMany({ where: { id: { in: remove }, entryType: "reading", entryId: id }, select: { id: true } });
      await deleteFiles({ journeyId: a.journeyId, ids: mine.map((m) => m.id) });
    }
  } else {
    const made = await prisma.healthReading.create({ data: { ...data, journeyId: a.journeyId, recordedById: a.userId }, select: { id: true } });
    id = made.id;
  }
  await attachFiles(a.journeyId, a.userId, "reading", id, input.fileIds ?? []);
  refresh();
  return { ok: true, id, verdict: await verdictFor(a, id) };
}

/**
 * What the reading just saved means, read with the rest of its day — a
 * blood pressure entered after a headache is judged with the headache.
 */
async function verdictFor(a: LogAccess, id: string): Promise<Verdict> {
  const r = await prisma.healthReading.findUnique({ where: { id } });
  if (!r) return { level: "none", reasons: [] };
  const day = dayIn(r.takenAt, a.timeZone);
  const around = await prisma.healthReading.findMany({
    where: { journeyId: a.journeyId, takenAt: { gte: new Date(r.takenAt.getTime() - 36 * 3600_000), lte: new Date(r.takenAt.getTime() + 36 * 3600_000) } },
  });
  const sameDay = around.filter((x) => dayIn(x.takenAt, a.timeZone) === day);
  return evaluate(r, a.targets, dayContext(sameDay.filter((x) => x.id !== r.id), a.targets));
}

/** Delete a reading and its photos — from storage too, not just the list. */
export async function deleteReading(id: string): Promise<{ ok: boolean }> {
  const a = await access();
  if (!a) return { ok: false };
  const row = await prisma.healthReading.findFirst({ where: { id: String(id), journeyId: a.journeyId }, select: { id: true, recordedById: true } });
  if (!row || (!a.isMother && row.recordedById !== a.userId)) return { ok: false };
  await deleteFiles({ journeyId: a.journeyId, entryType: "reading", entryId: row.id });
  await prisma.healthReading.delete({ where: { id: row.id } });
  refresh();
  return { ok: true };
}

/** The doctor's numbers. A value left blank goes back to the default. */
export async function saveTargets(raw: Record<string, unknown>): Promise<Result> {
  const a = await access();
  if (!a) return NOPE;
  const picked: Record<string, number> = {};
  for (const k of Object.keys(DEFAULT_TARGETS) as TargetKey[]) {
    const v = raw[k];
    if (v === "" || v === null || v === undefined) continue;
    picked[k] = Number(v);
  }
  const { targets, custom } = readTargets(picked);
  const keep = Object.fromEntries([...custom].map((k) => [k, targets[k as TargetKey]]));
  await prisma.healthLogSettings.upsert({
    where: { journeyId: a.journeyId },
    create: { journeyId: a.journeyId, targets: keep, updatedById: a.userId },
    update: { targets: keep, updatedById: a.userId },
  });
  refresh();
  return { ok: true };
}

/** How the numbers are shown. What is stored never changes. */
export async function saveUnits(input: { glucoseUnit?: string; weightUnit?: string; tempUnit?: string }): Promise<Result> {
  const a = await access();
  if (!a) return NOPE;
  const data = {
    glucoseUnit: input.glucoseUnit === "MMOL" ? "MMOL" : "MGDL",
    weightUnit: input.weightUnit === "LB" ? "LB" : "KG",
    tempUnit: input.tempUnit === "F" ? "F" : "C",
    updatedById: a.userId,
  };
  await prisma.healthLogSettings.upsert({ where: { journeyId: a.journeyId }, create: { journeyId: a.journeyId, ...data }, update: data });
  refresh();
  return { ok: true };
}

/** Hers to decide: the two of them, or her alone. */
/** Her Sunday-evening "your week's report is ready" email. Hers alone to switch. */
export async function setWeeklyEmail(on: boolean): Promise<Result> {
  const a = await access();
  if (!a) return NOPE;
  if (!a.isMother) return { ok: false, error: "Only Mum can choose this." };
  await prisma.healthLogSettings.upsert({
    where: { journeyId: a.journeyId },
    create: { journeyId: a.journeyId, weeklyEmail: on === true, updatedById: a.userId },
    update: { weeklyEmail: on === true, updatedById: a.userId },
  });
  refresh();
  return { ok: true };
}

/**
 * Delete the whole health log — readings, medicines, checklist, report links
 * and every photo and PDF, from storage too. Hers alone, and final.
 */
export async function deleteWholeHealthLog(): Promise<Result> {
  const a = await access();
  if (!a) return NOPE;
  if (!a.isMother) return { ok: false, error: "Only Mum can delete her health log." };
  await deleteHealthLog(a.journeyId);
  for (const p of ["/health", "/health/log", "/health/medicines", "/health/tests", "/health/report", "/journey"]) revalidatePath(p);
  return { ok: true };
}

export async function setLogAudience(audience: "HOUSEHOLD" | "MOTHER"): Promise<Result> {
  const a = await access();
  if (!a) return NOPE;
  if (!a.isMother) return { ok: false, error: "Only Mum can choose who sees her health log." };
  const value = audience === "MOTHER" ? "MOTHER" : "HOUSEHOLD";
  await prisma.healthLogSettings.upsert({
    where: { journeyId: a.journeyId },
    create: { journeyId: a.journeyId, audience: value, updatedById: a.userId },
    update: { audience: value, updatedById: a.userId },
  });
  // Keeping it to herself means her partner's doctor links stop too.
  if (value === "MOTHER") {
    await prisma.healthReportLink.updateMany({ where: { journeyId: a.journeyId, revokedAt: null, NOT: { createdById: a.userId } }, data: { revokedAt: new Date() } });
    revalidatePath("/health/report");
  }
  refresh();
  revalidatePath("/health");
  return { ok: true };
}
