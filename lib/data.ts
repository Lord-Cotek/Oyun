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
