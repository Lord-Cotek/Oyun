"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getActiveMembership } from "@/lib/data";
import { attachFiles, deleteFiles, logAccess, type LogAccess } from "@/lib/health-log-db";
import { SCHEDULE, CONDITIONALS } from "@/data/prenatal-schedule";

type Result = { ok: true } | { ok: false; error: string };
const NOPE = { ok: false as const, error: "The checklist is kept by the two of you." };

async function access(): Promise<LogAccess | null> {
  const session = await auth();
  if (!session?.user?.id) return null;
  const active = await getActiveMembership(session.user.id);
  return active ? logAccess(session.user.id, active.journey.id) : null;
}

const refresh = () => revalidatePath("/health/tests");
const txt = (v: unknown, max: number) => {
  const s = typeof v === "string" ? v.trim() : "";
  return s ? s.slice(0, max) : null;
};
const week = (v: unknown) => {
  if (v === "" || v === null || v === undefined) return null;
  const n = Math.round(Number(v));
  return Number.isFinite(n) && n >= 0 && n <= 45 ? n : null;
};

/** The row for an item — the template's (made on first touch) or the family's own. */
async function rowFor(a: LogAccess, key: string | null | undefined, id: string | null | undefined) {
  if (id) return prisma.prenatalCheck.findFirst({ where: { id: String(id), journeyId: a.journeyId } });
  if (key && SCHEDULE.some((i) => i.key === key)) {
    return prisma.prenatalCheck.upsert({
      where: { journeyId_key: { journeyId: a.journeyId, key } },
      create: { journeyId: a.journeyId, key, createdById: a.userId },
      update: {},
    });
  }
  return null;
}

/**
 * Mark an item done (with its date, result, a link to the appointment and
 * any photos or PDFs of the report), or change its title, weeks or notes.
 */
export async function saveCheck(input: {
  key?: string | null;
  id?: string | null;
  done?: boolean;
  doneOn?: string;
  result?: string;
  resultValue?: string;
  appointmentId?: string;
  title?: string;
  weekFrom?: string | number;
  weekTo?: string | number;
  notes?: string;
  fileIds?: string[];
  removeFileIds?: string[];
}): Promise<Result> {
  const a = await access();
  if (!a) return NOPE;
  const r = await rowFor(a, input.key, input.id);
  if (!r) return { ok: false, error: "That item is no longer here." };
  const doneOn = input.done === false ? null : input.doneOn && /^\d{4}-\d{2}-\d{2}$/.test(input.doneOn) ? new Date(`${input.doneOn}T00:00:00.000Z`) : input.done ? new Date(new Date().toISOString().slice(0, 10)) : r.doneOn;
  if (doneOn && doneOn.getTime() > Date.now() + 86_400_000) return { ok: false, error: "That date is in the future." };
  let appointmentId: string | null = r.appointmentId;
  if (input.appointmentId !== undefined) {
    appointmentId = input.appointmentId ? (await prisma.appointment.findFirst({ where: { id: input.appointmentId, journeyId: a.journeyId }, select: { id: true } }))?.id ?? null : null;
  }
  const wf = input.weekFrom !== undefined ? week(input.weekFrom) : r.weekFrom;
  const wt = input.weekTo !== undefined ? week(input.weekTo) : r.weekTo;
  if (wf !== null && wt !== null && wt < wf) return { ok: false, error: "The weeks run the wrong way round." };
  await prisma.prenatalCheck.update({
    where: { id: r.id },
    data: {
      doneOn,
      result: input.result !== undefined ? txt(input.result, 1000) : r.result,
      resultValue: input.resultValue !== undefined ? txt(input.resultValue, 100) : r.resultValue,
      appointmentId,
      title: input.title !== undefined ? txt(input.title, 160) : r.title,
      weekFrom: wf,
      weekTo: wt,
      notes: input.notes !== undefined ? txt(input.notes, 1000) : r.notes,
    },
  });
  const remove = (input.removeFileIds ?? []).filter((x) => typeof x === "string");
  if (remove.length) {
    const mine = await prisma.healthFile.findMany({ where: { id: { in: remove }, entryType: "check", entryId: r.id }, select: { id: true } });
    await deleteFiles({ journeyId: a.journeyId, ids: mine.map((m) => m.id) });
  }
  await attachFiles(a.journeyId, a.userId, "check", r.id, input.fileIds ?? []);
  refresh();
  return { ok: true };
}

/** Hide an item that does not apply at this clinic — or bring it back. */
export async function hideCheck(key: string | null, id: string | null, hidden: boolean): Promise<Result> {
  const a = await access();
  if (!a) return NOPE;
  const r = await rowFor(a, key, id);
  if (!r) return { ok: false, error: "That item is no longer here." };
  await prisma.prenatalCheck.update({ where: { id: r.id }, data: { hidden } });
  refresh();
  return { ok: true };
}

/** One of the family's own: a test their clinic does that the list does not. */
export async function addCheck(input: { title: string; weekFrom?: string; weekTo?: string; notes?: string }): Promise<Result> {
  const a = await access();
  if (!a) return NOPE;
  const title = txt(input.title, 160);
  if (!title) return { ok: false, error: "What is it called?" };
  const wf = week(input.weekFrom), wt = week(input.weekTo);
  if (wf !== null && wt !== null && wt < wf) return { ok: false, error: "The weeks run the wrong way round." };
  await prisma.prenatalCheck.create({ data: { journeyId: a.journeyId, title, weekFrom: wf, weekTo: wt ?? wf, notes: txt(input.notes, 1000), createdById: a.userId } });
  refresh();
  return { ok: true };
}

/** Remove one the family added (template items are hidden, not deleted). */
export async function deleteCheck(id: string): Promise<Result> {
  const a = await access();
  if (!a) return NOPE;
  const r = await prisma.prenatalCheck.findFirst({ where: { id: String(id), journeyId: a.journeyId, key: null } });
  if (!r) return { ok: false, error: "Only items you added can be removed — hide the others." };
  await deleteFiles({ journeyId: a.journeyId, entryType: "check", entryId: r.id });
  await prisma.prenatalCheck.delete({ where: { id: r.id } });
  refresh();
  return { ok: true };
}

/** Which typical schedule to start from. Nothing marked done is lost by switching. */
export async function setTemplate(template: "INTL" | "NG"): Promise<Result> {
  const a = await access();
  if (!a) return NOPE;
  const value = template === "NG" ? "NG" : "INTL";
  await prisma.healthLogSettings.upsert({ where: { journeyId: a.journeyId }, create: { journeyId: a.journeyId, template: value, updatedById: a.userId }, update: { template: value, updatedById: a.userId } });
  refresh();
  return { ok: true };
}

/** Switch an optional group of checks on or off (cervical length, diabetes follow-up…). */
export async function setCondition(key: string, on: boolean): Promise<Result> {
  const a = await access();
  if (!a) return NOPE;
  if (!CONDITIONALS.some((c) => c.key === key)) return { ok: false, error: "Unknown option." };
  const next = on ? [...new Set([...a.conditions, key])] : a.conditions.filter((c) => c !== key);
  await prisma.healthLogSettings.upsert({ where: { journeyId: a.journeyId }, create: { journeyId: a.journeyId, conditions: next, updatedById: a.userId }, update: { conditions: next, updatedById: a.userId } });
  refresh();
  return { ok: true };
}
