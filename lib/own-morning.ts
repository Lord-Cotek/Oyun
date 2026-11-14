import { prisma } from "@/lib/prisma";
import { notify } from "@/lib/notify";
import { sendNotificationEmail } from "@/lib/email";
import { CATEGORY_FIELDS, shouldInterrupt } from "@/lib/notify-prefs";
import { nudgeDueToday } from "@/lib/nudges";
import { appointmentTitle, timeLabel } from "@/lib/appointments";
import { appointmentPath } from "@/lib/open-item";
import { localNow } from "@/lib/morning-send";

/**
 * The reminders that belong to a person's own morning — at their hour, in
 * their time zone — rather than to one fixed moment for the whole world.
 *
 * ── Why ──────────────────────────────────────────────────────────────────
 * The daily run fires once, at 07:00 UTC: eleven in the morning in Dubai,
 * after a nine o'clock scan has already happened; three in the morning in
 * Toronto. A reminder that arrives after the thing is not a reminder. The
 * hourly run already reaches each person at the hour they chose for the
 * morning note, so these ride with it:
 *
 *  - the reminders somebody set for themselves (nudges), and
 *  - "your appointment is today at 10:00" — only while it is still ahead.
 *
 * The week-ahead and day-before reminders stay in the daily run; an hour
 * either way does not change what anybody does with them.
 *
 * Once each, per person, by the OwnMorningSent ledger — and never twice on
 * the day this changed over, because anything the daily run already
 * stamped is left alone.
 */
const PREF_SELECT = Object.fromEntries(CATEGORY_FIELDS.map((f) => [f, true])) as Record<
  (typeof CATEGORY_FIELDS)[number],
  true
>;

async function once(userId: string, key: string): Promise<boolean> {
  try {
    await prisma.ownMorningSent.create({ data: { userId, key } });
    return true;
  } catch {
    return false; // already told — the unique (userId, key) said so
  }
}

export async function sendOwnMornings(now = new Date()) {
  const run = { people: 0, nudges: 0, appointments: 0 };
  const people = await prisma.user.findMany({
    where: { suspendedAt: null, memberships: { some: {} } },
    select: {
      id: true,
      name: true,
      email: true,
      notifyByEmail: true,
      timeZone: true,
      morningHour: true,
      ...PREF_SELECT,
      memberships: {
        select: { role: true, journeyId: true, journey: { select: { status: true } } },
      },
    },
  });

  for (const p of people) {
    const { hour, day } = localNow(now, p.timeZone);
    if (hour !== p.morningHour) continue;
    run.people += 1;
    const dayKey = day.toISOString().slice(0, 10);
    // Their own date, at noon UTC — the stored dates are calendar days kept
    // in UTC, so this compares their today with the day written down.
    const theirNoon = new Date(`${dayKey}T12:00:00.000Z`);

    // ── Their own reminders ──────────────────────────────────────────────
    const nudges = await prisma.nudge.findMany({
      where: {
        userId: p.id,
        doneAt: null,
        remindedAt: null,
        dueAt: { gte: new Date(theirNoon.getTime() - 3 * 86_400_000), lte: new Date(theirNoon.getTime() + 86_400_000) },
        journey: { status: "ACTIVE" },
      },
      select: { id: true, text: true, dueAt: true, doneAt: true, remindedAt: true },
    });
    for (const n of nudges) {
      if (!nudgeDueToday(n, theirNoon)) continue;
      if (!(await once(p.id, `nudge:${n.id}`))) continue;
      await notify({
        userId: p.id,
        type: "nudge",
        title: n.text,
        body: "You asked to be reminded of this today.",
        href: "/journey",
      });
      if (p.email && p.notifyByEmail && shouldInterrupt("nudge", p)) {
        await sendNotificationEmail({
          to: p.email,
          name: p.name,
          title: n.text,
          body: "You asked to be reminded of this today.",
          href: "/journey",
        }).catch(() => {});
      }
      await prisma.nudge.update({ where: { id: n.id }, data: { remindedAt: new Date() } });
      run.nudges += 1;
    }

    // ── "Today at 10:00" ─────────────────────────────────────────────────
    const household = p.memberships.filter(
      (m) => (m.role === "MOTHER" || m.role === "PARTNER") && m.journey.status === "ACTIVE",
    );
    if (household.length === 0) continue;
    const appts = await prisma.appointment.findMany({
      where: {
        journeyId: { in: household.map((m) => m.journeyId) },
        hasTime: true,
        attendedAt: null,
        cancelledAt: null,
        // The day the daily run already said "this morning" is left alone.
        remindedMorningAt: null,
        at: { gte: new Date(`${dayKey}T00:00:00.000Z`), lt: new Date(`${dayKey}T23:59:59.999Z`) },
      },
      select: { id: true, kind: true, title: true, at: true, hasTime: true, where: true },
    });
    // Times are kept as the wall-clock time on the letter, so "still ahead"
    // compares it with their own wall clock.
    const nowMinutes = hour * 60 + 15;
    for (const a of appts) {
      if (a.at.getUTCHours() * 60 + a.at.getUTCMinutes() <= nowMinutes) continue;
      if (!(await once(p.id, `appt:${a.id}:${dayKey}`))) continue;
      const name = appointmentTitle(a.kind, a.title);
      const t = timeLabel(a.at, a.hasTime);
      await notify({
        userId: p.id,
        type: "appointment_reminder",
        title: `${name} today${t ? ` at ${t}` : ""}.`,
        body: a.where ? `At ${a.where}.` : undefined,
        href: appointmentPath(a.id),
      });
      run.appointments += 1;
    }
  }

  // The ledger only has to remember a fortnight.
  await prisma.ownMorningSent
    .deleteMany({ where: { sentAt: { lt: new Date(now.getTime() - 14 * 86_400_000) } } })
    .catch(() => {});
  return run;
}
