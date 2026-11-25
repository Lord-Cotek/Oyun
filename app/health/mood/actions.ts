"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getActiveMembership } from "@/lib/data";
import { MOOD_KEPT_MAX, cleanAnswers, scoreMood } from "@/lib/mood-check";
import { notify } from "@/lib/notify";

type Result<T = object> = ({ ok: true } & T) | { ok: false; error: string };

/**
 * The mood check is the mother's alone — lib/mood-check.ts. Every action
 * here is hers, on her own results, in the journey she is in.
 */
async function her() {
  const session = await auth();
  if (!session?.user?.id) return null;
  const active = await getActiveMembership(session.user.id);
  if (!active || active.role !== "MOTHER") return null;
  return { userId: session.user.id, journeyId: active.journey.id, name: active.journey.owner.name?.trim().split(/\s+/)[0] || "She" };
}

const NOPE = { ok: false as const, error: "The mood check is hers alone." };

/**
 * Keeping a result she has just been shown. The score is worked out again
 * here from her answers, never taken from the phone. Past the limit, the
 * oldest kept results are let go.
 */
export async function keepMoodCheck(answers: unknown): Promise<Result<{ id: string }>> {
  const a = await her();
  if (!a) return NOPE;
  const clean = cleanAnswers(answers);
  if (!clean) return { ok: false, error: "Answer every question first." };
  const s = scoreMood(clean);
  const row = await prisma.moodCheck.create({
    data: { journeyId: a.journeyId, userId: a.userId, answers: clean, low: s.low, worry: s.worry, selfHarm: s.selfHarm },
    select: { id: true },
  });
  const old = await prisma.moodCheck.findMany({
    where: { journeyId: a.journeyId, userId: a.userId },
    orderBy: { takenAt: "desc" },
    skip: MOOD_KEPT_MAX,
    select: { id: true },
  });
  if (old.length) await prisma.moodCheck.deleteMany({ where: { id: { in: old.map((o) => o.id) }, userId: a.userId } });
  revalidatePath("/health/mood");
  return { ok: true, id: row.id };
}

/** Showing one result to her linked doctor, or not. Off until she says. */
export async function setMoodForDoctor(id: string, share: boolean): Promise<Result> {
  const a = await her();
  if (!a) return NOPE;
  const r = await prisma.moodCheck.updateMany({
    where: { id, journeyId: a.journeyId, userId: a.userId },
    data: { forDoctorAt: share ? new Date() : null },
  });
  if (r.count === 0) return { ok: false, error: "That result is no longer kept." };
  revalidatePath("/health/mood");
  return { ok: true };
}

/**
 * Showing one result to her partner, or not. Off until she says.
 *
 * He is told that she has shared something, and nothing more: the bell says
 * where to look, never what is there. He is told once, the first time she
 * switches it on for that result.
 */
export async function setMoodForPartner(id: string, share: boolean): Promise<Result> {
  const a = await her();
  if (!a) return NOPE;
  const row = await prisma.moodCheck.findFirst({
    where: { id, journeyId: a.journeyId, userId: a.userId },
    select: { id: true, forPartnerAt: true },
  });
  if (!row) return { ok: false, error: "That result is no longer kept." };
  const partners = await prisma.membership.findMany({ where: { journeyId: a.journeyId, role: "PARTNER" }, select: { userId: true } });
  if (share && partners.length === 0) return { ok: false, error: "There is no partner on this journey to show it to." };
  await prisma.moodCheck.update({ where: { id: row.id }, data: { forPartnerAt: share ? new Date() : null } });
  if (share && !row.forPartnerAt) {
    for (const p of partners) {
      await notify({
        userId: p.userId,
        type: "health_shared",
        title: `${a.name} has shared a mood check with you`,
        body: "Open Health, then Mood, to read it.",
        href: "/health/mood",
      });
    }
  }
  revalidatePath("/health/mood");
  return { ok: true };
}

export async function removeMoodCheck(id: string): Promise<Result> {
  const a = await her();
  if (!a) return NOPE;
  await prisma.moodCheck.deleteMany({ where: { id, journeyId: a.journeyId, userId: a.userId } });
  revalidatePath("/health/mood");
  return { ok: true };
}
