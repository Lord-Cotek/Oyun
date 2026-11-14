import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { notify } from "@/lib/notify";
import { letterHref } from "@/lib/letter-access";
import { CATEGORY_FIELDS, shouldInterrupt } from "@/lib/notify-prefs";

/** The notification switches, so an email can respect them as the push does. */
const PREF_SELECT = Object.fromEntries(CATEGORY_FIELDS.map((f) => [f, true])) as Record<
  (typeof CATEGORY_FIELDS)[number],
  true
>;
import { sendNotificationEmail, sendGuestDayEmail } from "@/lib/email";
import {
  dueStage,
  reminderLead,
  appointmentTitle,
  whenLabel,
  type ReminderStage,
} from "@/lib/appointments";
import { inviteAudience, inviteUrl } from "@/lib/invitations-db";
import { countForHost, headCount, whenWords } from "@/lib/invitations";
import { appointmentPath, dayPath } from "@/lib/open-item";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * The daily reminder run.
 *
 * Vercel Cron calls this each morning with `Authorization: Bearer
 * $CRON_SECRET`; anything else is refused.
 *
 * ── Why this can be run twice without harm ───────────────────────────────
 * Every send stamps its own column on the appointment, and `dueStage` returns
 * null for a stage already stamped. So a retry, a double-schedule, or a
 * manual poke sends nothing a second time. That matters more here than in
 * most jobs: the failure mode of a reminder system is not silence, it is
 * pestering somebody until they turn it off — and then they get nothing at
 * all, including the one that mattered.
 *
 * ── Who is told ──────────────────────────────────────────────────────────
 * The mother and whoever walks beside her, and nobody else. A scan date is
 * health information; the wider circle sees it only if she puts it on the
 * prayer wall herself.
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  const authz = req.headers.get("authorization");
  if (!secret || authz !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  // A generous window either side of today, then `dueStage` decides precisely.
  const from = new Date(now.getTime() - 2 * 86_400_000);
  const to = new Date(now.getTime() + 9 * 86_400_000);

  const appointments = await prisma.appointment.findMany({
    where: {
      at: { gte: from, lte: to },
      attendedAt: null,
      cancelledAt: null,
    },
    select: {
      id: true,
      kind: true,
      title: true,
      at: true,
      hasTime: true,
      where: true,
      attendedAt: true,
      cancelledAt: true,
      remindedWeekAt: true,
      remindedDayAt: true,
      remindedMorningAt: true,
      journey: {
        select: {
          id: true,
          status: true,
          memberships: {
            where: { role: { in: ["MOTHER", "PARTNER"] } },
            select: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  notifyByEmail: true,
                  ...PREF_SELECT,
                },
              },
            },
          },
        },
      },
    },
  });

  const STAMP: Record<ReminderStage, "remindedWeekAt" | "remindedDayAt" | "remindedMorningAt"> =
    {
      week: "remindedWeekAt",
      day: "remindedDayAt",
      morning: "remindedMorningAt",
    };

  let sent = 0;
  let people = 0;

  for (const a of appointments) {
    // A journey that ended in loss is left entirely alone. Reminding a
    // grieving mother about next Tuesday's antenatal check would be a cruelty
    // no feature is worth.
    if (a.journey.status !== "ACTIVE") continue;

    const stage = dueStage(a, now);
    if (!stage) continue;
    // "This morning" is sent by the hourly run at each person's own morning,
    // in their own time zone — see lib/own-morning.ts. At 07:00 UTC it
    // arrived after a nine o'clock scan in Dubai.
    if (stage === "morning") continue;

    const name = appointmentTitle(a.kind, a.title);
    const when = whenLabel(a.at, a.hasTime, now);
    const title = `${reminderLead(stage)}: ${name}, ${when}.`;
    const body = a.where ? `At ${a.where}.` : undefined;

    for (const m of a.journey.memberships) {
      await notify({
        userId: m.user.id,
        type: "appointment_reminder",
        title,
        body,
        href: appointmentPath(a.id),
      });
      people += 1;

      // Email only where somebody asked for email, and only for the two
      // stages where an email is genuinely useful. A "this morning" email
      // arrives after they have already left the house.
      // And only if they have not switched these reminders off — the email
      // used to skip the check notify() makes for the push.
      if (
        m.user.email &&
        m.user.notifyByEmail &&
        shouldInterrupt("appointment_reminder", m.user)
      ) {
        await sendNotificationEmail({
          to: m.user.email,
          name: m.user.name,
          title,
          body,
          href: appointmentPath(a.id),
        }).catch(() => {});
      }
    }

    // Stamp last: if anything above threw, the next run tries again rather
    // than silently swallowing the reminder.
    await prisma.appointment.update({
      where: { id: a.id },
      data: { [STAMP[stage]]: new Date() },
    });
    sent += 1;
  }

  // ── Reminders people set for themselves ─────────────────────────────────
  // Told at each person's own morning, in their own time zone, by the hourly
  // run — see lib/own-morning.ts. Not here any more.

  const guests = await remindGuests(now);
  const hosts = await tellTheHosts(now);
  const lettersOpened = await tellLettersOpening(now);
  const afterNudges = await nudgeAfterTheDay(now);

  return NextResponse.json({
    ok: true,
    reminders: sent,
    notified: people,
    ...guests,
    hostDigests: hosts,
    lettersOpened,
    afterNudges,
  });
}

/**
 * The morning after an invited day: one gentle word to the hosts — "How was
 * it?" — pointing at the place to add photos and say thank you. Only if
 * somebody said yes, only once, and to the same people who were told about
 * the replies (a surprise's planners, until it has passed — which by now it
 * has).
 */
async function nudgeAfterTheDay(now: Date) {
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const yesterday = new Date(today.getTime() - 86_400_000);
  const invitations = await prisma.invitation.findMany({
    where: {
      revokedAt: null,
      afterNudgedAt: null,
      event: { cancelledAt: null, at: { gte: yesterday, lt: today } },
      replies: { some: { answer: "YES" } },
    },
    select: { id: true, event: { select: { id: true, title: true } } },
  });
  let nudged = 0;
  for (const inv of invitations) {
    for (const userId of await inviteAudience(inv.event.id, now)) {
      await notify({
        userId,
        type: "appointment",
        title: `How was ${inv.event.title}? 💛`,
        body: "Add a few photos and a thank-you for coming — the guests can see them on the invitation, and you can send them on.",
        href: dayPath(inv.event.id),
      });
    }
    await prisma.invitation.update({ where: { id: inv.id }, data: { afterNudgedAt: new Date() } });
    nudged += 1;
  }
  return nudged;
}

/**
 * The morning a sealed letter opens, the two of them are told — once.
 *
 * Today or yesterday only, so a missed run still says it the next morning
 * and nothing older is suddenly announced. Not to a family after a loss:
 * the letter still opens, quietly, but the app does not announce it.
 */
async function tellLettersOpening(now: Date) {
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const letters = await prisma.letter.findMany({
    where: {
      openOn: { lte: today, gte: new Date(today.getTime() - 86_400_000) },
      openedToldAt: null,
    },
    select: {
      id: true,
      createdAt: true,
      journeyId: true,
      author: { select: { name: true } },
      child: { select: { name: true } },
      journey: { select: { status: true } },
    },
  });
  let told = 0;
  for (const l of letters) {
    if (l.journey.status === "ACTIVE") {
      const keepers = await prisma.membership.findMany({
        where: { journeyId: l.journeyId, role: { in: ["MOTHER", "PARTNER"] } },
        select: { userId: true },
      });
      const who = l.author.name?.trim().split(/\s+/)[0] || "Someone";
      for (const k of keepers) {
        await notify({
          userId: k.userId,
          type: "encouragement",
          title: `A letter opens today${l.child?.name ? ` — to ${l.child.name}` : ""} ✉︎`,
          body: `${who} sealed it on ${l.createdAt.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })}.`,
          href: letterHref(l.id),
        });
      }
      told += 1;
    }
    await prisma.letter.update({ where: { id: l.id }, data: { openedToldAt: new Date() } });
  }
  return told;
}

/**
 * A word to the guests, who are not in this app and cannot be notified in it.
 *
 * ── Why guests get different days from the household ─────────────────────
 * The household is reminded a week out, the day before and on the morning,
 * because they are the ones arranging it.
 *
 * A guest is a different person with a different problem. They said yes on a
 * bus three days ago; what they need is "it is tomorrow" — the one that
 * changes what they do that evening — and "it is today". Two, and only two:
 * a reminder every day is how people learn to ignore all of them, and that
 * does not stop being true because somebody is a guest.
 *
 * ── Why it is safe to run twice ──────────────────────────────────────────
 * Each stage is stamped on the invitation the moment it is sent, the same
 * shape Appointment already uses. A second run today finds the stamp and sends
 * nothing. One stamp covers everybody on the invitation, so a single address
 * that bounces does not hold the rest back and is not retried — the same
 * bargain the appointment reminders make, and the right one: the cost of a
 * retry loop here is somebody getting the same email four times.
 */
async function remindGuests(now: Date) {
  const startOfToday = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );
  const horizon = new Date(startOfToday.getTime() + 2 * 86_400_000);

  const invitations = await prisma.invitation.findMany({
    where: {
      revokedAt: null,
      /**
       * Nothing that ever asked "which day suits?".
       *
       * While it is still a question there is no day to remind anybody of —
       * the event carries a placeholder, the earliest day offered, so an
       * unsettled poll whose first option fell tomorrow would email every
       * guest about a day nobody had chosen. And once it is settled they have
       * already had the one message that matters: the day, sent the moment it
       * was decided, which is both the news and the reminder.
       */
      options: { none: {} },
      event: { cancelledAt: null, at: { gte: startOfToday, lt: horizon } },
    },
    select: {
      id: true,
      slug: true,
      hostName: true,
      remindedDayBeforeAt: true,
      remindedMorningAt: true,
      // The map pin and the potluck sheet, which is what somebody looks for
      // the evening before.
      links: {
        orderBy: [{ position: "asc" }, { createdAt: "asc" }],
        select: { kind: true, label: true, url: true },
      },
      event: {
        select: {
          id: true,
          title: true,
          at: true,
          hasTime: true,
          endsAt: true,
          where: true,
        },
      },
      replies: {
        // Somebody who said they cannot come is not reminded of it. That is
        // not a reminder, it is a reproach.
        where: { answer: { in: ["YES", "MAYBE"] }, email: { not: null } },
        select: { name: true, email: true, answer: true },
      },
    },
  });

  let stages = 0;
  let guests = 0;

  for (const inv of invitations) {
    const away = Math.round(
      (Date.UTC(
        inv.event.at.getUTCFullYear(),
        inv.event.at.getUTCMonth(),
        inv.event.at.getUTCDate(),
      ) -
        startOfToday.getTime()) /
        86_400_000,
    );
    if (away !== 0 && away !== 1) continue;
    const today = away === 0;
    if (today ? inv.remindedMorningAt : inv.remindedDayBeforeAt) continue;

    if (inv.replies.length > 0) {
      const when = whenWords(inv.event.at, inv.event.hasTime, inv.event.endsAt);
      for (const r of inv.replies) {
        if (!r.email) continue;
        await sendGuestDayEmail({
          to: r.email,
          name: r.name,
          lead: today ? "Today" : "Tomorrow",
          title: inv.event.title,
          when,
          where: inv.event.where,
          hostName: inv.hostName,
          url: inviteUrl(inv.slug),
          links: inv.links,
          note:
            r.answer === "MAYBE"
              ? "You said you hoped to come. If you now know either way, the invitation still takes a change."
              : null,
        });
        guests += 1;
      }
    }

    // Stamped last, so anything that threw above is tried again tomorrow
    // rather than being silently marked as done.
    await prisma.invitation.update({
      where: { id: inv.id },
      data: today
        ? { remindedMorningAt: new Date() }
        : { remindedDayBeforeAt: new Date() },
    });
    stages += 1;
  }

  return { guestReminders: stages, guestsEmailed: guests };
}

/**
 * The evening before, to the household whose day it is.
 *
 * A guest needs one fact: it is tomorrow. She needs a number, and needs it the
 * night before rather than on the morning, because that is when the shopping
 * gets done and the chairs get counted.
 *
 * The test here is NOT the guests' one. A settled poll absolutely gets a
 * digest — somebody who has just chosen a day is exactly who needs the count.
 * What must not go out is a digest for an invitation whose placeholder date
 * happens to fall tomorrow while nobody has chosen anything.
 */
async function tellTheHosts(now: Date) {
  const startOfTomorrow = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1),
  );
  const endOfTomorrow = new Date(startOfTomorrow.getTime() + 86_400_000);

  const invitations = await prisma.invitation.findMany({
    where: {
      revokedAt: null,
      hostDigestAt: null,
      OR: [{ options: { none: {} } }, { settledAt: { not: null } }],
      event: {
        cancelledAt: null,
        at: { gte: startOfTomorrow, lt: endOfTomorrow },
      },
    },
    select: {
      id: true,
      event: {
        select: { id: true, journeyId: true, title: true, where: true },
      },
      replies: { select: { answer: true, partySize: true, name: true, note: true } },
    },
  });

  let sent = 0;
  for (const inv of invitations) {
    const c = headCount(inv.replies);
    // The household — or, on a day still being kept as a surprise, only the
    // people in on it. See inviteAudience.
    const keepers = (await inviteAudience(inv.event.id, now)).map((userId) => ({ userId }));

    // The things guests actually wrote, which is where "we'll be late" and
    // "I'm bringing the cake" live. Capped, because this is a nudge.
    const words = inv.replies
      .filter((r) => r.note && r.answer !== "NO")
      .slice(0, 5)
      .map((r) => `${r.name}: ${r.note}`);

    // People and replies, each named — the same wording as the invitation
    // panel, so the digest and the screen it opens can never seem to differ.
    const said = countForHost(c);
    const body = [
      c.replied === 0
        ? "Nobody has replied to the invitation."
        : [said.headline, said.detail].filter(Boolean).join(" — ") + ".",
      said.rest && c.replied > 0 ? `${said.rest}.` : null,
      inv.event.where ? `At ${inv.event.where}.` : null,
      ...words,
    ]
      .filter(Boolean)
      .join("\n");

    for (const k of keepers) {
      await notify({
        userId: k.userId,
        type: "appointment",
        title: `Tomorrow: ${inv.event.title} — ${
          c.coming ? `${c.coming} coming` : "nobody has said yes yet"
        }`,
        body,
        href: dayPath(inv.event.id),
        email: true,
      });
    }

    await prisma.invitation.update({
      where: { id: inv.id },
      data: { hostDigestAt: new Date() },
    });
    sent += 1;
  }
  return sent;
}
