import { prisma } from "@/lib/prisma";

/**
 * Built for the third year, not the first week.
 *
 * The family diary loaded the most recent forty entries and stopped. In the
 * first month that is the whole diary. By the time a child turns two it is
 * about six weeks of a family's life, and everything before it — the whole
 * pregnancy, the birth, the first year — is not merely slow to reach, it is
 * unreachable. There was no page two, no date jump, no search by year.
 *
 * Two things here fix that.
 *
 * `diaryYears` gives every year the house has written in, with a count, so the
 * whole diary is reachable in one tap from a strip of years. It is one grouped
 * query rather than a walk through the rows, so it stays cheap whether a house
 * has forty entries or four thousand.
 *
 * `storySoFar` is the other half: what a decade actually adds up to, said in
 * one place. Not a scoreboard — there are no streaks in this app and there
 * never will be — but an answer to "what have we actually done here", which
 * is a fair question after three years and one the app could not previously
 * answer at all.
 */

export interface DiaryYear {
  year: number;
  posts: number;
}

/**
 * Every year this house has written a diary entry in, newest first, with how
 * many entries are in each.
 */
export async function diaryYears(journeyId: string): Promise<DiaryYear[]> {
  const rows = await prisma.$queryRaw<{ year: number; n: bigint }[]>`
    SELECT EXTRACT(YEAR FROM "createdAt")::int AS year, COUNT(*) AS n
    FROM "Post"
    WHERE "journeyId" = ${journeyId}
    GROUP BY 1
    ORDER BY 1 DESC
  `;
  return rows.map((r) => ({ year: r.year, posts: Number(r.n) }));
}

/** The window a year covers, in the server's own time — see the note below. */
export function yearBounds(year: number): { gte: Date; lt: Date } {
  // Deliberately local rather than UTC, to match EXTRACT(YEAR ...) above and
  // the dates a family sees printed on their own entries. A post made at
  // 23:30 on 31 December belongs to the year the family thinks it does.
  return { gte: new Date(year, 0, 1), lt: new Date(year + 1, 0, 1) };
}

export interface StorySoFar {
  /** Whole years since the journey was started, rounded down. */
  years: number;
  since: Date;
  posts: number;
  worshipDays: number;
  prayersAnswered: number;
  letters: number;
  milestones: number;
  appointmentsKept: number;
  /** True once there is enough here to be worth saying out loud. */
  worthTelling: boolean;
}

/**
 * What this family has actually done, counted rather than guessed.
 *
 * Everything is a count, in parallel, with no rows loaded — a journey with
 * four thousand entries pays the same as one with four.
 */
export async function storySoFar(
  journeyId: string,
  createdAt: Date,
  now = new Date(),
): Promise<StorySoFar> {
  const [posts, worshipDays, prayersAnswered, letters, milestones, appointmentsKept] =
    await Promise.all([
      prisma.post.count({ where: { journeyId } }),
      prisma.worshipDay.count({ where: { journeyId } }),
      prisma.prayerRequest.count({
        where: { journeyId, answeredAt: { not: null } },
      }),
      prisma.letter.count({ where: { journeyId } }),
      prisma.milestone.count({ where: { journeyId } }),
      prisma.appointment.count({
        where: { journeyId, attendedAt: { not: null } },
      }),
    ]);

  const years = Math.floor(
    (now.getTime() - createdAt.getTime()) / (365.2425 * 86_400_000),
  );

  return {
    years,
    since: createdAt,
    posts,
    worshipDays,
    prayersAnswered,
    letters,
    milestones,
    appointmentsKept,
    // A journey three weeks old being told it has "1 entry, 0 answered prayers"
    // is being handed a report card, which is the opposite of the point. This
    // waits until there is a story to tell.
    worthTelling: posts + worshipDays + prayersAnswered + letters >= 12,
  };
}
