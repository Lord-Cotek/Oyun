import { prisma } from "@/lib/prisma";
import { notify } from "@/lib/notify";
import { morningNote, seatFor } from "@/lib/morning";

/**
 * Sending the morning note, in each person's own morning.
 *
 * ── Why this runs every hour and not once a day ──────────────────────────
 * The other crons here fire at 07:00 UTC, which is a reasonable hour in
 * exactly one band of the world. For a reminder about Tuesday's scan that is
 * survivable. For a note that says "this morning" it is not: it would reach
 * Dubai at eleven, California at midnight, and Auckland the following
 * evening. A devotional that arrives at midnight is worse than none, because
 * it wakes somebody up to tell them about the morning.
 *
 * So this runs hourly and sends to the people for whom it has just become
 * their chosen hour, wherever they are. Everybody gets their own morning.
 *
 * ── How it cannot send twice ─────────────────────────────────────────────
 * By writing a row with a unique key on (person, their local day) BEFORE
 * sending, and treating the clash as "already done". A cron that retries, two
 * regions waking together, a redeploy mid-run — none of them can produce two
 * notes, because the second writer loses the race at the database rather than
 * in our arithmetic.
 *
 * Writing first also means a crash half way costs somebody one note rather
 * than giving them two. Of the two ways to be wrong, a missed morning is much
 * the smaller.
 *
 * ── On size ──────────────────────────────────────────────────────────────
 * It reads every account that wants a note, once an hour, and does the clock
 * arithmetic here rather than in SQL. At this app's size that is one small
 * query an hour. If it ever stops being small the fix is to store each
 * person's next send time and index it; the shape of everything else holds.
 */

export interface MorningRun {
  considered: number;
  sent: number;
  alreadyHad: number;
  silent: number;
  failed: number;
}

/**
 * The hour, and the calendar day, where this person actually is.
 *
 * An unknown or malformed zone falls back to UTC rather than throwing — the
 * note arriving at an odd hour is a smaller fault than the whole run dying
 * because one row holds a typo.
 */
function localNow(now: Date, timeZone: string | null): { hour: number; day: Date } {
  const zone = timeZone || "UTC";
  let parts: Intl.DateTimeFormatPart[];
  try {
    parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: zone,
      hour: "2-digit",
      hour12: false,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(now);
  } catch {
    return localNow(now, "UTC");
  }
  const at = Object.fromEntries(parts.map((p) => [p.type, p.value])) as Record<string, string>;
  return {
    // "24" is a real answer from some locales at midnight; it means hour 0.
    hour: Number(at.hour) % 24,
    // Their day, stamped at midnight UTC so it is one stable value to key on.
    day: new Date(`${at.year}-${at.month}-${at.day}T00:00:00.000Z`),
  };
}

export async function sendMorningNotes(now = new Date()): Promise<MorningRun> {
  const run: MorningRun = { considered: 0, sent: 0, alreadyHad: 0, silent: 0, failed: 0 };

  const people = await prisma.user.findMany({
    where: {
      notifyMorning: true,
      // Somebody suspended is not written to, whatever the reason.
      suspendedAt: null,
      memberships: { some: {} },
    },
    select: {
      id: true,
      timeZone: true,
      morningHour: true,
      memberships: {
        select: {
          role: true,
          journey: { select: { dueDate: true, status: true } },
        },
      },
    },
  });

  for (const person of people) {
    const { hour, day } = localNow(now, person.timeZone);
    if (hour !== person.morningHour) continue;
    run.considered += 1;

    // The journey they are actually in. Somebody in more than one gets the
    // note for the first — a second note the same morning would be the very
    // thing this is trying not to be.
    const membership = person.memberships[0];
    if (!membership?.journey) {
      run.silent += 1;
      continue;
    }

    const note = morningNote({
      seat: seatFor(membership.role),
      dueDate: membership.journey.dueDate,
      status: membership.journey.status,
      now,
    });
    // Silence is an answer — see lib/morning.ts on what happens after a loss.
    if (!note) {
      run.silent += 1;
      continue;
    }

    // Claim the day BEFORE sending, and let the database decide the race.
    //
    // createMany with skipDuplicates rather than create-and-catch: both are
    // atomic, but the catching version makes Prisma log a constraint error
    // every single time it works correctly. An hourly job that prints an
    // error every hour is a job whose logs nobody reads any more, and the
    // one real failure is then invisible among them.
    const claimed = await prisma.morningSent.createMany({
      data: [{ userId: person.id, day }],
      skipDuplicates: true,
    });
    if (claimed.count === 0) {
      run.alreadyHad += 1;
      continue;
    }

    try {
      await notify({
        userId: person.id,
        type: "morning",
        title: note.title,
        body: note.body,
        href: note.href,
        // Never by email. This is a tap on the shoulder, and a daily email is
        // how a well-meant devotional becomes the thing people filter.
        email: false,
      });
      run.sent += 1;
    } catch {
      // The claim stands. One missed note beats a loop that retries all day.
      run.failed += 1;
    }
  }

  return run;
}
