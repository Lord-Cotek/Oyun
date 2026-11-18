import { prisma } from "@/lib/prisma";
import { notify } from "@/lib/notify";
import { sendNotificationEmail } from "@/lib/email";
import { ensureDoses } from "@/lib/medication-db";
import { localDay, zonedInstant } from "@/lib/medication";

/**
 * Dose and reading reminders, from the hourly job.
 *
 * ── When ─────────────────────────────────────────────────────────────────
 * The job runs on the hour, so each dose is told at the run just before it
 * is due — never after, and at most an hour early — and the reminder says
 * the time: "A dose is due at 20:30". Each dose is stamped the moment its
 * reminder goes, so it goes once however often the job runs.
 *
 * ── What it never says ───────────────────────────────────────────────────
 * The name of the medicine. A lock screen is read by whoever is nearby, and
 * "progesterone" or "insulin" is her health, not theirs. Open the app for it.
 *
 * ── Quiet hours ──────────────────────────────────────────────────────────
 * Dose reminders follow the times she set — a pessary at 23:00 is reminded
 * at 23:00, because she chose it. Reading reminders keep quiet between
 * 22:00 and 06:00, and are skipped when she has just taken a reading.
 */
const WINDOW_BEFORE = 5 * 60_000;
const WINDOW_AFTER = 55 * 60_000;

export async function sendHealthReminders(now = new Date()) {
  const doses = await remindDoses(now).catch(() => 0);
  const checks = await remindChecks(now).catch(() => 0);
  const weekly = await weeklyReportEmails(now).catch(() => 0);
  return { doses, checks, weekly };
}

/** Sunday, 18:00–18:59 where she is. */
export function isWeeklyReportHour(now: Date, tz: string): boolean {
  const parts = new Intl.DateTimeFormat("en-GB", { weekday: "short", hour: "2-digit", hourCycle: "h23", timeZone: tz }).formatToParts(now);
  const get = (t: string) => parts.find((p) => p.type === t)?.value;
  return get("weekday") === "Sun" && Number(get("hour")) === 18;
}

/**
 * Her Sunday-evening email, only if she turned it on: the week's report is
 * ready. A link to the report page, which asks her to sign in — never a
 * number, a medicine or a symptom in the email itself, because email is not
 * a private place. Sent once (the same once-only record as the reading
 * reminders), only while the journey is active, and only if she still has
 * email notifications on (the email's own unsubscribe link turns those off).
 */
async function weeklyReportEmails(now: Date): Promise<number> {
  const rows = await prisma.healthLogSettings.findMany({
    where: { weeklyEmail: true },
    select: { journeyId: true, journey: { select: { status: true, ownerId: true, owner: { select: { timeZone: true, email: true, name: true, notifyByEmail: true } } } } },
  });
  let sent = 0;
  for (const r of rows) {
    const o = r.journey.owner;
    if (r.journey.status !== "ACTIVE" || !o.email || !o.notifyByEmail) continue;
    const tz = o.timeZone || "UTC";
    if (!isWeeklyReportHour(now, tz)) continue;
    const slotKey = `weekly-report ${localDay(now, tz)}`;
    if (await prisma.healthCheckSent.findUnique({ where: { journeyId_slotKey: { journeyId: r.journeyId, slotKey } }, select: { id: true } })) continue;
    try {
      await prisma.healthCheckSent.create({ data: { journeyId: r.journeyId, slotKey } });
    } catch {
      continue; // a run racing this one sent it
    }
    await sendNotificationEmail({
      to: o.email,
      userId: r.journey.ownerId,
      name: o.name,
      title: "Your week's health report is ready",
      body: "Open it in Oyun to look over the week, print it, or send it to your doctor. For your privacy, nothing from your log is put in this email.",
      href: "/health/report?p=week",
    }).catch(() => false);
    sent++;
  }
  return sent;
}

async function remindDoses(now: Date): Promise<number> {
  const plans = await prisma.medicationPlan.findMany({
    where: { remind: true, stoppedAt: null, scheduleKind: { not: "AS_NEEDED" }, OR: [{ endOn: null }, { endOn: { gte: new Date(now.getTime() - 2 * 86_400_000) } }] },
    select: { journeyId: true, journey: { select: { status: true, owner: { select: { timeZone: true } } } } },
  });
  const journeys = new Map<string, string>();
  for (const p of plans) if (p.journey.status === "ACTIVE") journeys.set(p.journeyId, p.journey.owner.timeZone || "UTC");
  let told = 0;
  for (const [journeyId, tz] of journeys) {
    const today = localDay(now, tz);
    const tomorrow = localDay(new Date(now.getTime() + 86_400_000), tz);
    await ensureDoses(journeyId, today, tomorrow, tz);
    const due = await prisma.medicationDose.findMany({
      where: {
        journeyId,
        status: "DUE",
        remindedAt: null,
        dueAt: { gte: new Date(now.getTime() - WINDOW_BEFORE), lt: new Date(now.getTime() + WINDOW_AFTER) },
        plan: { remind: true, stoppedAt: null },
      },
      select: { id: true, dueAt: true, plan: { select: { remindPartner: true } } },
      orderBy: { dueAt: "asc" },
    });
    if (!due.length) continue;
    // Claimed before anything is sent: a second run racing this one finds nothing.
    const claimed = await prisma.medicationDose.updateMany({ where: { id: { in: due.map((d) => d.id) }, remindedAt: null }, data: { remindedAt: now } });
    if (claimed.count === 0) continue;
    const people = await recipients(journeyId, due.some((d) => d.plan.remindPartner));
    const fmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: tz });
    const title = due.length === 1 ? `A dose is due at ${fmt.format(due[0].dueAt)}` : `${due.length} doses are due by ${fmt.format(due[due.length - 1].dueAt)}`;
    for (const userId of people) {
      await notify({ userId, type: "dose_reminder", title, body: "Open Oyun to mark it taken.", href: "/health/medicines" });
    }
    told += due.length;
  }
  return told;
}

/** Her, and her partner too when asked for and only while she shares the log. */
async function recipients(journeyId: string, withPartner: boolean): Promise<string[]> {
  const [members, settings] = await Promise.all([
    prisma.membership.findMany({ where: { journeyId, role: { in: ["MOTHER", "PARTNER"] } }, select: { userId: true, role: true } }),
    prisma.healthLogSettings.findUnique({ where: { journeyId }, select: { audience: true } }),
  ]);
  const shared = settings?.audience !== "MOTHER";
  return members.filter((m) => m.role === "MOTHER" || (withPartner && shared)).map((m) => m.userId);
}

async function remindChecks(now: Date): Promise<number> {
  const rows = await prisma.healthLogSettings.findMany({
    where: { NOT: { checkTimes: { isEmpty: true } } },
    select: { journeyId: true, checkTimes: true, journey: { select: { status: true, ownerId: true, owner: { select: { timeZone: true } } } } },
  });
  let told = 0;
  for (const r of rows) {
    if (r.journey.status !== "ACTIVE") continue;
    const tz = r.journey.owner.timeZone || "UTC";
    const today = localDay(now, tz);
    for (const time of r.checkTimes) {
      const hour = Number(time.slice(0, 2));
      if (hour >= 22 || hour < 6) continue;
      const at = zonedInstant(today, time, tz);
      if (at.getTime() < now.getTime() - WINDOW_BEFORE || at.getTime() >= now.getTime() + WINDOW_AFTER) continue;
      // Already measured in the hour and a half before? Then there is nothing to remind.
      const recent = await prisma.healthReading.count({ where: { journeyId: r.journeyId, takenAt: { gte: new Date(at.getTime() - 90 * 60_000), lte: now } } });
      if (recent) continue;
      const slotKey = `${today} ${time}`;
      if (await prisma.healthCheckSent.findUnique({ where: { journeyId_slotKey: { journeyId: r.journeyId, slotKey } }, select: { id: true } })) continue;
      try {
        await prisma.healthCheckSent.create({ data: { journeyId: r.journeyId, slotKey } });
      } catch {
        continue; // a run racing this one sent it
      }
      await notify({ userId: r.journey.ownerId, type: "health_check", title: `Time for your ${time} reading`, body: "Open the health log to record it.", href: "/health/log" });
      told++;
    }
  }
  return told;
}
