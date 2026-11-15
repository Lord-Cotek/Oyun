import { prisma } from "@/lib/prisma";
import { notify } from "@/lib/notify";
import type { Budget } from "@/lib/cron-run";

/**
 * The second birthday: where Oyun's road ends.
 *
 * Oyun walks from the first weeks to the second birthday. After that the
 * stage content stops at "month 24", and until now it simply repeated —
 * the same morning note, the same weekly email — for as long as anyone
 * stayed. On the birthday the journey is marked complete, the two who keep
 * it get one warm word, and everything they wrote stays here to read.
 */

const DAY = 86_400_000;

/** How long "two years today" stays true enough to say. */
export const FRESH_DAYS = 7;

/**
 * The day they were born: the earliest child's birthday where one is
 * recorded, otherwise the due date (which recording the birth turns into the
 * day they arrived).
 */
export function bornOn(j: { dueDate: Date; children: { birthDate: Date | null }[] }): Date {
  const days = j.children.map((c) => c.birthDate).filter((d): d is Date => !!d);
  if (days.length === 0) return j.dueDate;
  return new Date(Math.min(...days.map((d) => d.getTime())));
}

/** The second birthday, as a UTC midnight. 29 February falls on 1 March. */
export function secondBirthday(born: Date): Date {
  const d = new Date(Date.UTC(born.getUTCFullYear(), born.getUTCMonth(), born.getUTCDate()));
  d.setUTCFullYear(d.getUTCFullYear() + 2);
  return d;
}

/** "Ada", "Ada and Tobi", "Ada, Tobi and Kemi" — or the journey's own name for them. */
export function namesOf(children: { name: string }[], babyName: string | null): string | null {
  const first = children.map((c) => c.name.trim().split(/\s+/)[0]).filter(Boolean);
  if (first.length === 1) return first[0];
  if (first.length > 1) return `${first.slice(0, -1).join(", ")} and ${first[first.length - 1]}`;
  return babyName?.trim() || null;
}

export async function completeJourneys(now: Date, budget?: Budget): Promise<{ completed: number; told: number }> {
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  // A cheap first cut — nobody under about 21 months — then the exact date.
  const journeys = await prisma.journey.findMany({
    where: { status: "ACTIVE", completedAt: null, dueDate: { lte: new Date(today.getTime() - 640 * DAY) } },
    select: {
      id: true,
      dueDate: true,
      babyName: true,
      babyCount: true,
      children: { select: { name: true, birthDate: true }, orderBy: { createdAt: "asc" } },
      memberships: { where: { role: { in: ["MOTHER", "PARTNER"] } }, select: { userId: true } },
    },
  });

  let completed = 0;
  let told = 0;
  for (const j of journeys) {
    if (budget?.out()) { budget.stopped(); break; }
    const birthday = secondBirthday(bornOn(j));
    if (birthday.getTime() > today.getTime()) continue;

    // Claimed first: only the run that fills completedAt says anything.
    const claim = await prisma.journey.updateMany({
      where: { id: j.id, completedAt: null },
      data: { completedAt: now },
    });
    if (claim.count === 0) continue;
    completed += 1;

    // A birthday long past is marked quietly — "two years today" in March
    // for a birthday in July would be the app not paying attention.
    if (today.getTime() - birthday.getTime() > FRESH_DAYS * DAY) continue;

    const names = namesOf(j.children, j.babyName);
    const plural = j.children.length > 1 || j.babyCount > 1;
    const title = names
      ? `Two years. Happy birthday, ${names}! 🎂`
      : `Two years. Happy birthday to your little ${plural ? "ones" : "one"}! 🎂`;
    const body =
      "Oyun has walked with you since the first weeks, and this is where its road ends. " +
      "Everything you wrote stays here to read whenever you like. When you are ready, Ìdílé carries the family on.";
    for (const m of j.memberships) {
      await notify({ userId: m.userId, type: "membership", title, body, href: "/journey", email: true });
    }
    told += 1;
  }
  return { completed, told };
}
