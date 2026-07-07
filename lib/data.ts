import { prisma } from "@/lib/prisma";
import { type Role } from "@prisma/client";

/**
 * The current user's active journey and their role in it.
 * A user may own a journey (MOTHER) or belong to one via membership
 * (PARTNER / ACCOUNTABILITY). We return the first membership found.
 */
export async function getActiveMembership(userId: string) {
  const membership = await prisma.membership.findFirst({
    where: { userId },
    orderBy: { createdAt: "asc" },
    include: {
      journey: {
        include: {
          owner: { select: { id: true, name: true, email: true } },
        },
      },
    },
  });

  if (!membership) return null;
  return {
    role: membership.role as Role,
    journey: membership.journey,
    membership,
  };
}

export async function getJourneyMembers(journeyId: string) {
  return prisma.membership.findMany({
    where: { journeyId },
    include: { user: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: "asc" },
  });
}

/** The mother's most recent check-in — shown to partners only if shared. */
export async function getLatestMotherCheckIn(journeyId: string) {
  const journey = await prisma.journey.findUnique({
    where: { id: journeyId },
    select: { ownerId: true },
  });
  if (!journey) return null;

  return prisma.checkIn.findFirst({
    where: { journeyId, userId: journey.ownerId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getOpenNudges(journeyId: string, userId: string) {
  return prisma.nudge.findMany({
    where: { journeyId, userId, doneAt: null },
    orderBy: { dueAt: "asc" },
    take: 10,
  });
}

/** Recent encouragements written by someone OTHER than the viewer. */
export async function getEncouragementsForViewer(
  journeyId: string,
  viewerId: string,
  take = 5,
) {
  return prisma.encouragement.findMany({
    where: { journeyId, authorId: { not: viewerId } },
    orderBy: { createdAt: "desc" },
    take,
    include: { author: { select: { name: true } } },
  });
}

function utcDay(d: Date): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

/** Today's support state plus a faithfulness streak of consecutive prayed days. */
export async function getSupportSummary(journeyId: string, userId: string) {
  const since = new Date();
  since.setUTCDate(since.getUTCDate() - 60);
  const days = await prisma.supportDay.findMany({
    where: { journeyId, userId, day: { gte: utcDay(since) } },
    orderBy: { day: "desc" },
  });

  const today = utcDay(new Date());
  const todayRow = days.find((d) => d.day.getTime() === today.getTime());

  // Count consecutive days (ending today or yesterday) with prayed = true.
  const prayedSet = new Set(
    days.filter((d) => d.prayed).map((d) => d.day.getTime()),
  );
  let streak = 0;
  const cursor = new Date(today);
  // Allow the streak to be "alive" if they prayed today or yesterday.
  if (!prayedSet.has(today.getTime())) cursor.setUTCDate(cursor.getUTCDate() - 1);
  while (prayedSet.has(cursor.getTime())) {
    streak += 1;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }

  const last7 = new Set<number>();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setUTCDate(d.getUTCDate() - i);
    if (prayedSet.has(d.getTime())) last7.add(d.getTime());
  }

  return {
    prayedToday: !!todayRow?.prayed,
    reachedOutToday: !!todayRow?.reachedOut,
    streak,
    prayedLast7: last7.size,
  };
}
