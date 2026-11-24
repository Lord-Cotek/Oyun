"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getActiveMembership } from "@/lib/data";
import { isHousehold } from "@/lib/roles";
import { LOG_MAX, cleanLogTime, isFeedHow, isLogKind } from "@/lib/after-birth";

type Result<T = object> = ({ ok: true } & T) | { ok: false; error: string };

/** The baby's log is the two of theirs to keep. The circle has no way in. */
async function household() {
  const session = await auth();
  if (!session?.user?.id) return null;
  const active = await getActiveMembership(session.user.id);
  if (!active || !isHousehold(active.role)) return null;
  // After a loss there is no log to keep.
  if (active.journey.status === "LOSS") return null;
  return { userId: session.user.id, journeyId: active.journey.id };
}

const NOPE = { ok: false as const, error: "The baby's log is kept by the two of you." };

/**
 * A feed or a nappy. `at` is the moment on the phone, or a time earlier
 * today that was typed in — see cleanLogTime. `childId` must be one of this
 * journey's own children, or it is left off.
 */
export async function addBabyLog(input: {
  kind: string;
  how?: string | null;
  at?: string | null;
  childId?: string | null;
}): Promise<Result<{ id: string; at: string }>> {
  const a = await household();
  if (!a) return NOPE;
  if (!isLogKind(input.kind)) return { ok: false, error: "That is not something the log keeps." };
  const how = input.kind === "FEED" && isFeedHow(input.how) ? input.how : null;
  if (input.kind === "FEED" && !how) return { ok: false, error: "Which side, or a bottle?" };
  let childId: string | null = null;
  if (input.childId) {
    const child = await prisma.child.findFirst({ where: { id: input.childId, journeyId: a.journeyId }, select: { id: true } });
    childId = child?.id ?? null;
  }
  const count = await prisma.babyLog.count({ where: { journeyId: a.journeyId } });
  if (count >= LOG_MAX) return { ok: false, error: "The log is full. Clear the old lines to carry on." };
  const row = await prisma.babyLog.create({
    data: { journeyId: a.journeyId, childId, kind: input.kind, how, at: cleanLogTime(input.at, new Date()), recordedById: a.userId },
    select: { id: true, at: true },
  });
  revalidatePath("/health/after");
  return { ok: true, id: row.id, at: row.at.toISOString() };
}

export async function removeBabyLog(id: string): Promise<Result> {
  const a = await household();
  if (!a) return NOPE;
  await prisma.babyLog.deleteMany({ where: { id, journeyId: a.journeyId } });
  revalidatePath("/health/after");
  return { ok: true };
}

/** Starting afresh. */
export async function clearBabyLog(): Promise<Result> {
  const a = await household();
  if (!a) return NOPE;
  await prisma.babyLog.deleteMany({ where: { journeyId: a.journeyId } });
  revalidatePath("/health/after");
  return { ok: true };
}
