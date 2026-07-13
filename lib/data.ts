import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { type Role } from "@prisma/client";
import { getReactionsFor } from "@/lib/reactions";

/** Remembers which journey a supporter is currently viewing. */
export const ACTIVE_JOURNEY_COOKIE = "oyun_journey";

/**
 * The current user's active journey and their role in it. A user may own a
 * journey (MOTHER) or accompany several others (PARTNER / ACCOUNTABILITY). We
 * honour the selected-journey cookie when it points at one they belong to;
 * otherwise we prefer the journey they own, then the oldest membership.
 */
export async function getActiveMembership(userId: string) {
  const memberships = await prisma.membership.findMany({
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

  if (memberships.length === 0) return null;

  const selectedId = cookies().get(ACTIVE_JOURNEY_COOKIE)?.value;
  const chosen =
    (selectedId && memberships.find((m) => m.journeyId === selectedId)) ||
    memberships.find((m) => m.journey.ownerId === userId) ||
    memberships[0];

  return {
    role: chosen.role as Role,
    journey: chosen.journey,
    membership: chosen,
    membershipCount: memberships.length,
  };
}

/** Every journey a user belongs to — for the switcher. Owned journey first. */
export async function getMyJourneys(userId: string) {
  const memberships = await prisma.membership.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
    include: {
      journey: {
        select: { id: true, ownerId: true, babyName: true, owner: { select: { name: true } } },
      },
    },
  });
  return memberships
    .map((m) => {
      const isOwner = m.journey.ownerId === userId;
      return {
        id: m.journey.id,
        label: isOwner
          ? "Your journey"
          : `${m.journey.owner.name ?? "Her"}${m.journey.babyName ? ` · ${m.journey.babyName}` : ""}`,
        role: m.role as Role,
        isOwner,
      };
    })
    .sort((a, b) => Number(b.isOwner) - Number(a.isOwner));
}

/** Whether the user already owns a journey (a mother owns only one at a time). */
export async function ownsJourney(userId: string): Promise<boolean> {
  const owned = await prisma.journey.findFirst({
    where: { ownerId: userId },
    select: { id: true },
  });
  return !!owned;
}

export async function getJourneyMembers(journeyId: string) {
  return prisma.membership.findMany({
    where: { journeyId },
    include: { user: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: "asc" },
  });
}

/** The mother's most recent check-in — shown to partners only if shared. */
/**
 * A page of the shared "to each other" thread between the mother and her
 * husband — newest first, each with its emoji reactions for the viewer. Pass
 * `before` (an ISO timestamp) to fetch the letters older than that, so the
 * thread loads a page at a time instead of rendering years of letters at once.
 */
export async function getCoupleLetters(
  journeyId: string,
  viewerId: string,
  opts: { before?: string; limit?: number } = {},
) {
  const limit = opts.limit ?? 10;
  const letters = await prisma.letter.findMany({
    where: {
      journeyId,
      toBaby: false,
      ...(opts.before ? { createdAt: { lt: new Date(opts.before) } } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: limit + 1,
    include: { author: { select: { id: true, name: true } } },
  });
  const hasMore = letters.length > limit;
  const page = hasMore ? letters.slice(0, limit) : letters;
  const reactions = await getReactionsFor(
    "LETTER",
    page.map((l) => l.id),
    viewerId,
  );
  return {
    items: page.map((l) => ({
      id: l.id,
      body: l.body,
      createdAt: l.createdAt.toISOString(),
      authorId: l.authorId,
      authorName: l.author.name ?? null,
      reactions: reactions[l.id] ?? { counts: {}, mine: [] },
    })),
    hasMore,
  };
}

export type CoupleLettersPage = Awaited<ReturnType<typeof getCoupleLetters>>;
export type CoupleLetter = CoupleLettersPage["items"][number];

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

/** Prayer requests for a journey, with prayer counts and whether the viewer prayed. */
export async function getPrayerRequests(journeyId: string, viewerId: string) {
  const requests = await prisma.prayerRequest.findMany({
    where: { journeyId },
    orderBy: [{ createdAt: "desc" }],
    include: {
      author: { select: { name: true } },
      _count: { select: { prayers: true } },
      prayers: { where: { userId: viewerId }, select: { id: true }, take: 1 },
    },
    take: 50,
  });
  return requests.map((r) => ({
    id: r.id,
    title: r.title,
    body: r.body,
    authorId: r.authorId,
    authorName: r.author.name,
    answeredAt: r.answeredAt,
    createdAt: r.createdAt,
    prayerCount: r._count.prayers,
    didIPray: r.prayers.length > 0,
  }));
}

/** The household's family-worship streak (journey-level, shared by both parents). */
export async function getWorshipStreak(journeyId: string) {
  const since = new Date();
  since.setUTCDate(since.getUTCDate() - 60);
  const days = await prisma.worshipDay.findMany({
    where: { journeyId, day: { gte: utcDay(since) } },
    orderBy: { day: "desc" },
  });

  const today = utcDay(new Date());
  const set = new Set(days.map((d) => d.day.getTime()));
  const doneToday = set.has(today.getTime());

  let streak = 0;
  const cursor = new Date(today);
  if (!doneToday) cursor.setUTCDate(cursor.getUTCDate() - 1);
  while (set.has(cursor.getTime())) {
    streak += 1;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }

  let last7 = 0;
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setUTCDate(d.getUTCDate() - i);
    if (set.has(d.getTime())) last7 += 1;
  }

  return { doneToday, streak, last7 };
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
