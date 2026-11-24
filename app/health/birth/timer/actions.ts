"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getActiveMembership } from "@/lib/data";
import { logAccess, type LogAccess } from "@/lib/health-log-db";
import { LABOUR_NOTE_MAX, cleanTapTime } from "@/lib/labour";

type Result<T = object> = ({ ok: true } & T) | { ok: false; error: string };

/**
 * The contraction timer is part of the health log and is open to the same
 * people: her, and her partner unless she keeps the log to herself.
 */
async function access(): Promise<LogAccess | null> {
  const session = await auth();
  if (!session?.user?.id) return null;
  const active = await getActiveMembership(session.user.id);
  if (!active) return null;
  return logAccess(session.user.id, active.journey.id);
}

const NOPE = { ok: false as const, error: "The health log is kept by the two of you." };

/** More than anybody times by hand; past it, the oldest must be cleared first. */
const MAX_KEPT = 600;

function refresh() {
  revalidatePath("/health/birth/timer");
  revalidatePath("/health/birth");
}

/**
 * A contraction has begun. `at` is when the button was pressed on the phone,
 * so a slow connection does not stretch it — see cleanTapTime.
 *
 * If one is already running (the other phone pressed first), that one is
 * returned and nothing new is made: two people timing the same contraction
 * must not turn it into two.
 */
export async function startContraction(at?: string): Promise<Result<{ id: string; startedAt: string }>> {
  const a = await access();
  if (!a) return NOPE;
  const running = await prisma.contraction.findFirst({
    where: { journeyId: a.journeyId, endedAt: null },
    orderBy: { startedAt: "desc" },
    select: { id: true, startedAt: true },
  });
  if (running) return { ok: true, id: running.id, startedAt: running.startedAt.toISOString() };
  const count = await prisma.contraction.count({ where: { journeyId: a.journeyId } });
  if (count >= MAX_KEPT) return { ok: false, error: "The list is full. Clear the old ones to start again." };
  const c = await prisma.contraction.create({
    data: { journeyId: a.journeyId, recordedById: a.userId, startedAt: cleanTapTime(at, new Date()) },
    select: { id: true, startedAt: true },
  });
  refresh();
  return { ok: true, id: c.id, startedAt: c.startedAt.toISOString() };
}

/** It has eased. Never ends before it began. */
export async function stopContraction(id: string, at?: string): Promise<Result> {
  const a = await access();
  if (!a) return NOPE;
  const c = await prisma.contraction.findFirst({ where: { id, journeyId: a.journeyId }, select: { id: true, startedAt: true, endedAt: true } });
  if (!c) return { ok: false, error: "That one is no longer on the list." };
  if (c.endedAt) return { ok: true };
  const end = cleanTapTime(at, new Date());
  await prisma.contraction.update({
    where: { id: c.id },
    data: { endedAt: new Date(Math.max(end.getTime(), c.startedAt.getTime() + 1000)) },
  });
  refresh();
  return { ok: true };
}

/** Taking one off: a mis-tap, or one that was never stopped. */
export async function removeContraction(id: string): Promise<Result> {
  const a = await access();
  if (!a) return NOPE;
  await prisma.contraction.deleteMany({ where: { id, journeyId: a.journeyId } });
  refresh();
  return { ok: true };
}

/** Starting afresh: yesterday's false start should not sit in today's averages. */
export async function clearContractions(): Promise<Result> {
  const a = await access();
  if (!a) return NOPE;
  await prisma.contraction.deleteMany({ where: { journeyId: a.journeyId } });
  refresh();
  return { ok: true };
}

/**
 * What her own hospital told her about when to come in, in their words.
 * The only "when to go" this page ever shows.
 */
export async function saveLabourNote(text: string): Promise<Result> {
  const a = await access();
  if (!a) return NOPE;
  const note = String(text ?? "").replace(/\r\n?/g, "\n").trim().slice(0, LABOUR_NOTE_MAX) || null;
  await prisma.healthLogSettings.upsert({
    where: { journeyId: a.journeyId },
    create: { journeyId: a.journeyId, labourNote: note, updatedById: a.userId },
    update: { labourNote: note, updatedById: a.userId },
  });
  refresh();
  return { ok: true };
}
