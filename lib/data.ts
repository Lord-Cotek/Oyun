import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { type Role } from "@prisma/client";
import { getReactionsFor } from "@/lib/reactions";
import { computePosition } from "@/lib/stage";
import { appointmentTitle, timeLabel } from "@/lib/appointments";

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
    include: {
      user: { select: { id: true, name: true, email: true, image: true } },
    },
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

/** Keepsake letters written to the baby, newest first, with reactions. */
export async function getBabyLetters(
  journeyId: string,
  viewerId: string,
  opts: { limit?: number } = {},
) {
  const limit = opts.limit ?? 30;
  const letters = await prisma.letter.findMany({
    where: { journeyId, toBaby: true },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: { author: { select: { id: true, name: true } } },
  });
  const reactions = await getReactionsFor(
    "LETTER",
    letters.map((l) => l.id),
    viewerId,
  );
  return letters.map((l) => ({
    id: l.id,
    body: l.body,
    createdAt: l.createdAt.toISOString(),
    authorId: l.authorId,
    authorName: l.author.name ?? null,
    reactions: reactions[l.id] ?? { counts: {}, mine: [] },
  }));
}

export type BabyLetter = Awaited<ReturnType<typeof getBabyLetters>>[number];

export interface MemoryItem {
  id: string;
  kind: "milestone" | "letter";
  label: string;
  title: string;
  body: string | null;
  imageUrl: string | null;
  yearsAgo: number;
  dateLabel: string;
}

const MILESTONE_MEMORY_LABEL: Record<string, string> = {
  FIRST_KICK: "First kicks",
  ULTRASOUND: "A scan",
  HEARTBEAT: "A heartbeat",
  BIRTH: "The day they arrived",
  FIRST_SMILE: "A first smile",
  FIRST_WORD: "A first word",
  FIRST_STEPS: "First steps",
  CUSTOM: "A first",
};

/**
 * "On this day" — keepsakes from earlier years that fall on today's calendar
 * date: milestones (firsts) and letters written to the baby. Returns the most
 * recent few, so the home can quietly resurface a memory. Empty most days.
 */
export async function getOnThisDay(
  journeyId: string,
  limit = 3,
): Promise<MemoryItem[]> {
  const now = new Date();
  const month = now.getUTCMonth();
  const date = now.getUTCDate();
  const thisYear = now.getUTCFullYear();
  const startOfYear = new Date(Date.UTC(thisYear, 0, 1));

  const [milestones, letters] = await Promise.all([
    prisma.milestone.findMany({
      where: { journeyId, occurredAt: { lt: startOfYear } },
      orderBy: { occurredAt: "desc" },
      take: 300,
      include: { child: { select: { name: true } } },
    }),
    prisma.letter.findMany({
      where: { journeyId, toBaby: true, createdAt: { lt: startOfYear } },
      orderBy: { createdAt: "desc" },
      take: 300,
      include: { author: { select: { name: true } } },
    }),
  ]);

  const onDay = (d: Date) =>
    d.getUTCMonth() === month && d.getUTCDate() === date;
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    });

  const items: MemoryItem[] = [];

  for (const m of milestones) {
    if (!onDay(m.occurredAt)) continue;
    items.push({
      id: `m-${m.id}`,
      kind: "milestone",
      label: MILESTONE_MEMORY_LABEL[m.kind] ?? "A first",
      title: m.title?.trim() || MILESTONE_MEMORY_LABEL[m.kind] || "A first",
      body: m.note?.trim() || null,
      imageUrl: m.photoUrls[0] ?? null,
      yearsAgo: thisYear - m.occurredAt.getUTCFullYear(),
      dateLabel: fmt(m.occurredAt),
    });
  }

  for (const l of letters) {
    if (!onDay(l.createdAt)) continue;
    items.push({
      id: `l-${l.id}`,
      kind: "letter",
      label: "A letter to your little one",
      title: l.author.name?.trim()
        ? `${l.author.name.trim().split(/\s+/)[0]} wrote`
        : "A letter",
      body: l.body,
      imageUrl: null,
      yearsAgo: thisYear - l.createdAt.getUTCFullYear(),
      dateLabel: fmt(l.createdAt),
    });
  }

  return items.sort((a, b) => a.yearsAgo - b.yearsAgo).slice(0, limit);
}

export interface UpcomingItem {
  id: string;
  label: string;
  detail: string | null;
  dateLabel: string;
  daysAway: number;
  tone: string;
}

const MS_PER_DAY = 86_400_000;
const DAYS_PER_MONTH = 30.436875;

function daysBetween(from: Date, to: Date): number {
  return Math.round((to.getTime() - from.getTime()) / MS_PER_DAY);
}

function upcomingDateLabel(d: Date): string {
  return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
}

/**
 * A gentle look-ahead for the home — the next handful of things coming up:
 * the due date (or the baby's next month milestone once born), the real
 * appointments in the book, and any private nudges this member has set.
 * Sorted soonest-first; empty when nothing is on the horizon.
 *
 * `withAppointments` must be true only for the household. A scan date is
 * health information, and this strip is rendered on the supporter home too.
 */
export async function getUpcoming(
  journeyId: string,
  userId: string,
  dueDate: Date,
  withAppointments = false,
  windowDays = 45,
): Promise<UpcomingItem[]> {
  const now = new Date();
  const horizon = new Date(now.getTime() + windowDays * MS_PER_DAY);
  const pos = computePosition(dueDate, now);
  const items: UpcomingItem[] = [];

  if (!pos.born) {
    // The due date itself — always worth keeping in view while expecting.
    items.push({
      id: "due",
      label: "Due date",
      detail:
        pos.daysToGo > 0
          ? `${pos.daysToGo} day${pos.daysToGo === 1 ? "" : "s"} to go`
          : "any day now",
      dateLabel: upcomingDateLabel(dueDate),
      daysAway: daysBetween(now, dueDate),
      tone: "rose",
    });
    // The next trimester, if it falls within the window.
    const term = new Date(dueDate.getTime() - 280 * MS_PER_DAY); // week 0
    for (const [week, name] of [
      [13, "Second trimester"],
      [28, "Third trimester"],
    ] as const) {
      const at = new Date(term.getTime() + week * 7 * MS_PER_DAY);
      if (at > now && at <= horizon) {
        items.push({
          id: `tri-${week}`,
          label: name,
          detail: `week ${week}`,
          dateLabel: upcomingDateLabel(at),
          daysAway: daysBetween(now, at),
          tone: "plum",
        });
      }
    }
  } else if (typeof pos.month === "number" && pos.month < 24) {
    // The baby's next month milestone.
    const next = pos.month + 1;
    const at = new Date(dueDate.getTime() + next * DAYS_PER_MONTH * MS_PER_DAY);
    const birthday =
      next === 12 ? "First birthday" : next === 24 ? "Second birthday" : null;
    items.push({
      id: `age-${next}`,
      label: birthday ?? `${next} months old`,
      detail: birthday ? `${next} months` : null,
      dateLabel: upcomingDateLabel(at),
      daysAway: daysBetween(now, at),
      tone: birthday ? "gold" : "green",
    });
  }

  // The real appointment book — scans, checks, clinics. Household only.
  if (withAppointments) {
    // From the start of today, not from this minute: a 09:00 appointment is
    // still "today" when you open the app at lunchtime.
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);
    const appts = await prisma.appointment.findMany({
      where: {
        journeyId,
        attendedAt: null,
        cancelledAt: null,
        at: { gte: startOfToday, lte: horizon },
      },
      orderBy: { at: "asc" },
      take: 6,
      select: { id: true, kind: true, title: true, at: true, hasTime: true, where: true },
    });
    for (const a of appts) {
      const time = timeLabel(a.at, a.hasTime);
      items.push({
        id: `appt-${a.id}`,
        label: appointmentTitle(a.kind, a.title),
        detail: [time, a.where].filter(Boolean).join(" · ") || null,
        dateLabel: upcomingDateLabel(a.at),
        daysAway: daysBetween(now, a.at),
        tone: "sky",
      });
    }
  }

  // Private nudges this member has set for themselves, coming up soon.
  const nudges = await prisma.nudge.findMany({
    where: { journeyId, userId, doneAt: null, dueAt: { gte: now, lte: horizon } },
    orderBy: { dueAt: "asc" },
    take: 6,
  });
  for (const n of nudges) {
    items.push({
      id: `nudge-${n.id}`,
      label: n.text,
      detail: "note to self",
      dateLabel: upcomingDateLabel(n.dueAt),
      daysAway: daysBetween(now, n.dueAt),
      tone: "sky",
    });
  }

  return items.sort((a, b) => a.daysAway - b.daysAway).slice(0, 6);
}

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
