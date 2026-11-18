"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getActiveMembership } from "@/lib/data";
import { attachFiles, deleteFiles, logAccess, type LogAccess } from "@/lib/health-log-db";
import { cleanPlan, isLate, SITES } from "@/lib/medication";
import { remakeFutureDoses } from "@/lib/medication-db";

type Result<T = object> = ({ ok: true } & T) | { ok: false; error: string };
const NOPE = { ok: false as const, error: "Medicines are kept by the two of you." };

async function access(): Promise<LogAccess | null> {
  const session = await auth();
  if (!session?.user?.id) return null;
  const active = await getActiveMembership(session.user.id);
  return active ? logAccess(session.user.id, active.journey.id) : null;
}

function refresh() {
  revalidatePath("/health/medicines");
  revalidatePath("/health");
  revalidatePath("/health/card");
}

const asDate = (d: string | null) => (d ? new Date(`${d}T00:00:00.000Z`) : null);

/**
 * Add or change a medicine. Changing its schedule makes its doses still to
 * come again; anything already taken or skipped stays exactly as recorded.
 */
export async function savePlan(raw: Record<string, unknown> & { id?: string; fileIds?: string[]; removeFileIds?: string[] }): Promise<Result<{ id: string }>> {
  const a = await access();
  if (!a) return NOPE;
  const c = cleanPlan(raw);
  if (!c.ok) return c;
  const d = c.data;
  const data = {
    name: d.name,
    form: d.form,
    strength: d.strength,
    dose: d.dose,
    route: d.route,
    scheduleKind: d.scheduleKind,
    times: d.times,
    everyDays: d.everyDays,
    startOn: asDate(d.startOn)!,
    endOn: asDate(d.endOn),
    prescribedBy: d.prescribedBy,
    notes: d.notes,
    remind: d.remind,
    remindPartner: d.remindPartner,
  };
  let id: string;
  if (raw.id) {
    const p = await prisma.medicationPlan.findFirst({ where: { id: String(raw.id), journeyId: a.journeyId }, select: { id: true } });
    if (!p) return { ok: false, error: "That medicine is no longer here." };
    await prisma.medicationPlan.update({ where: { id: p.id }, data });
    id = p.id;
    const remove = (raw.removeFileIds ?? []).filter((x) => typeof x === "string");
    if (remove.length) {
      const mine = await prisma.healthFile.findMany({ where: { id: { in: remove }, entryType: "plan", entryId: id }, select: { id: true } });
      await deleteFiles({ journeyId: a.journeyId, ids: mine.map((m) => m.id) });
    }
  } else {
    const p = await prisma.medicationPlan.create({ data: { ...data, journeyId: a.journeyId, createdById: a.userId }, select: { id: true } });
    id = p.id;
  }
  await remakeFutureDoses(id, a.journeyId);
  await attachFiles(a.journeyId, a.userId, "plan", id, raw.fileIds ?? []);
  refresh();
  return { ok: true, id };
}

/** Stop a medicine from now on. Its history stays, for the report. */
export async function stopPlan(id: string, stop = true): Promise<{ ok: boolean }> {
  const a = await access();
  if (!a) return { ok: false };
  const p = await prisma.medicationPlan.findFirst({ where: { id: String(id), journeyId: a.journeyId }, select: { id: true } });
  if (!p) return { ok: false };
  await prisma.medicationPlan.update({ where: { id: p.id }, data: { stoppedAt: stop ? new Date() : null } });
  if (stop) await prisma.medicationDose.deleteMany({ where: { planId: p.id, status: "DUE", dueAt: { gt: new Date() } } });
  else await remakeFutureDoses(p.id, a.journeyId);
  refresh();
  return { ok: true };
}

/** Delete a medicine entirely — every dose, and every photo, from storage too. */
export async function deletePlan(id: string): Promise<{ ok: boolean }> {
  const a = await access();
  if (!a) return { ok: false };
  const p = await prisma.medicationPlan.findFirst({ where: { id: String(id), journeyId: a.journeyId }, select: { id: true, doses: { select: { id: true } } } });
  if (!p) return { ok: false };
  for (const d of p.doses) await deleteFiles({ journeyId: a.journeyId, entryType: "dose", entryId: d.id });
  await deleteFiles({ journeyId: a.journeyId, entryType: "plan", entryId: p.id });
  await prisma.medicationPlan.delete({ where: { id: p.id } });
  refresh();
  return { ok: true };
}

type DoseInput = {
  id: string;
  status: "TAKEN" | "SKIPPED" | "DUE";
  takenAt?: string;
  skipReason?: string;
  site?: string;
  units?: number | string;
  note?: string;
  fileIds?: string[];
};

/** Record what happened to a dose — or undo it back to not yet recorded. */
export async function markDose(input: DoseInput): Promise<Result> {
  const a = await access();
  if (!a) return NOPE;
  const d = await prisma.medicationDose.findFirst({ where: { id: String(input.id), journeyId: a.journeyId }, select: { id: true, dueAt: true, plan: { select: { scheduleKind: true } } } });
  if (!d) return { ok: false, error: "That dose is no longer here." };
  const now = new Date();
  // An as-needed dose was never due: undoing it takes the entry away
  // rather than leaving a dose "due" at the moment it was logged.
  if (input.status === "DUE" && d.plan.scheduleKind === "AS_NEEDED") {
    await deleteFiles({ journeyId: a.journeyId, entryType: "dose", entryId: d.id });
    await prisma.medicationDose.delete({ where: { id: d.id } });
    refresh();
    return { ok: true };
  }
  if (input.status === "DUE") {
    await prisma.medicationDose.update({ where: { id: d.id }, data: { status: "DUE", takenAt: null, late: false, skipReason: null, site: null, units: null, recordedById: a.userId } });
    await deleteFiles({ journeyId: a.journeyId, entryType: "dose", entryId: d.id });
    refresh();
    return { ok: true };
  }
  let takenAt: Date | null = null;
  if (input.status === "TAKEN") {
    takenAt = input.takenAt ? new Date(input.takenAt) : now;
    if (Number.isNaN(takenAt.getTime()) || takenAt.getTime() > now.getTime() + 10 * 60_000) return { ok: false, error: "That time does not look right." };
  }
  const units = input.units === undefined || input.units === "" ? null : Number(input.units);
  if (units !== null && (!Number.isFinite(units) || units < 0 || units > 300)) return { ok: false, error: "Units should be between 0 and 300." };
  await prisma.medicationDose.update({
    where: { id: d.id },
    data: {
      status: input.status === "SKIPPED" ? "SKIPPED" : "TAKEN",
      takenAt,
      late: takenAt ? isLate(d.dueAt, takenAt) : false,
      skipReason: input.status === "SKIPPED" ? String(input.skipReason ?? "").trim().slice(0, 200) || null : null,
      site: input.site && (SITES as readonly string[]).includes(input.site) ? input.site : null,
      units,
      note: String(input.note ?? "").trim().slice(0, 500) || null,
      recordedById: a.userId,
    },
  });
  await attachFiles(a.journeyId, a.userId, "dose", d.id, input.fileIds ?? []);
  refresh();
  return { ok: true };
}

/** An as-needed medicine, taken now (or at a time given). */
export async function logDose(input: Omit<DoseInput, "id" | "status"> & { planId: string }): Promise<Result> {
  const a = await access();
  if (!a) return NOPE;
  const p = await prisma.medicationPlan.findFirst({ where: { id: String(input.planId), journeyId: a.journeyId }, select: { id: true } });
  if (!p) return { ok: false, error: "That medicine is no longer here." };
  const takenAt = input.takenAt ? new Date(input.takenAt) : new Date();
  if (Number.isNaN(takenAt.getTime()) || takenAt.getTime() > Date.now() + 10 * 60_000) return { ok: false, error: "That time does not look right." };
  const units = input.units === undefined || input.units === "" ? null : Number(input.units);
  if (units !== null && (!Number.isFinite(units) || units < 0 || units > 300)) return { ok: false, error: "Units should be between 0 and 300." };
  const made = await prisma.medicationDose.upsert({
    where: { planId_dueAt: { planId: p.id, dueAt: takenAt } },
    create: {
      planId: p.id,
      journeyId: a.journeyId,
      dueAt: takenAt,
      status: "TAKEN",
      takenAt,
      site: input.site && (SITES as readonly string[]).includes(input.site) ? input.site : null,
      units,
      note: String(input.note ?? "").trim().slice(0, 500) || null,
      recordedById: a.userId,
      remindedAt: new Date(),
    },
    update: {},
    select: { id: true },
  });
  await attachFiles(a.journeyId, a.userId, "dose", made.id, input.fileIds ?? []);
  refresh();
  return { ok: true };
}

/** Times of day to be reminded to take a reading. Hers only. */
export async function saveCheckTimes(times: string[]): Promise<Result> {
  const a = await access();
  if (!a) return NOPE;
  if (!a.isMother) return { ok: false, error: "Reading reminders go to Mum, so she sets them." };
  const clean = [...new Set((times ?? []).map(String).filter((t) => /^([01]\d|2[0-3]):[0-5]\d$/.test(t)))].sort().slice(0, 6);
  await prisma.healthLogSettings.upsert({
    where: { journeyId: a.journeyId },
    create: { journeyId: a.journeyId, checkTimes: clean, updatedById: a.userId },
    update: { checkTimes: clean, updatedById: a.userId },
  });
  revalidatePath("/health/log");
  return { ok: true };
}
