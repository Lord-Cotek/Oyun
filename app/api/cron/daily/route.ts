import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { notify } from "@/lib/notify";
import { sendNotificationEmail } from "@/lib/email";
import {
  dueStage,
  reminderLead,
  appointmentTitle,
  whenLabel,
  timeLabel,
  type ReminderStage,
} from "@/lib/appointments";
import { nudgeDueToday } from "@/lib/nudges";

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

    const name = appointmentTitle(a.kind, a.title);
    const when = whenLabel(a.at, a.hasTime, now);
    const title =
      stage === "morning"
        ? `${name} today${timeLabel(a.at, a.hasTime) ? ` at ${timeLabel(a.at, a.hasTime)}` : ""}.`
        : `${reminderLead(stage)}: ${name}, ${when}.`;
    const body = a.where ? `At ${a.where}.` : undefined;

    for (const m of a.journey.memberships) {
      await notify({
        userId: m.user.id,
        type: "appointment_reminder",
        title,
        body,
        href: "/appointments",
      });
      people += 1;

      // Email only where somebody asked for email, and only for the two
      // stages where an email is genuinely useful. A "this morning" email
      // arrives after they have already left the house.
      if (m.user.email && m.user.notifyByEmail && stage !== "morning") {
        await sendNotificationEmail({
          to: m.user.email,
          name: m.user.name,
          title,
          body,
          href: "/appointments",
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
  // Only the one who set it is told, and only on the morning it is due. See
  // `nudgeDueToday` for why "anything overdue" would have been a cruelty to
  // every account that predates this working.
  const nudges = await prisma.nudge.findMany({
    where: {
      doneAt: null,
      remindedAt: null,
      dueAt: { gte: new Date(now.getTime() - 86_400_000), lte: new Date(now.getTime() + 86_400_000) },
    },
    select: {
      id: true,
      text: true,
      dueAt: true,
      doneAt: true,
      remindedAt: true,
      journey: { select: { status: true } },
      user: { select: { id: true, name: true, email: true, notifyByEmail: true } },
    },
  });

  let nudgesSent = 0;
  for (const n of nudges) {
    if (n.journey.status !== "ACTIVE") continue;
    if (!nudgeDueToday(n, now)) continue;

    await notify({
      userId: n.user.id,
      type: "nudge",
      title: n.text,
      body: "You asked to be reminded of this today.",
      href: "/journey",
    });
    if (n.user.email && n.user.notifyByEmail) {
      await sendNotificationEmail({
        to: n.user.email,
        name: n.user.name,
        title: n.text,
        body: "You asked to be reminded of this today.",
        href: "/journey",
      }).catch(() => {});
    }

    // Stamped last, for the same reason as the appointments above.
    await prisma.nudge.update({
      where: { id: n.id },
      data: { remindedAt: new Date() },
    });
    nudgesSent += 1;
  }

  return NextResponse.json({
    ok: true,
    reminders: sent,
    notified: people,
    nudges: nudgesSent,
  });
}
