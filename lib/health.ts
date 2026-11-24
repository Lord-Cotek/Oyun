import { prisma } from "@/lib/prisma";
import { HOUR, allow } from "@/lib/rate-limit";

/**
 * Knowing something is wrong before a family says so.
 *
 * Three things feed this:
 *  - the error screens, which report what broke (a message, a page and
 *    where in the code — cut short and never anybody's words; see
 *    /api/errors);
 *  - every scheduled job, through lib/cron-run.ts, which reports a run that
 *    threw;
 *  - and the health page, which reads all of it together with the email
 *    log and the assistant's use.
 *
 * An alert email goes to the super-admins named in the environment when
 * something breaks — at most one an hour for errors and one an hour per
 * job, so a bad deploy is one email, not four hundred.
 */

export const MESSAGE_MAX = 300;
export const DETAIL_MAX = 900;
export const PATH_MAX = 200;

/** The jobs and how long a gap between runs means something is wrong. */
export const JOBS: { job: string; label: string; staleAfterHours: number }[] = [
  { job: "morning", label: "Morning (hourly)", staleAfterHours: 3 },
  { job: "daily", label: "Daily reminders", staleAfterHours: 27 },
  { job: "weekly", label: "Weekly email", staleAfterHours: 24 * 7 + 6 },
];

function clip(s: string | null | undefined, max: number): string | null {
  if (!s) return null;
  const one = s.replace(/\s+/g, " ").trim();
  return one ? one.slice(0, max) : null;
}

export async function recordError(input: {
  where: "client" | "server" | "job";
  message: string;
  path?: string | null;
  digest?: string | null;
  /** Where in the code — file names and positions. Kept with the message. */
  detail?: string | null;
  /**
   * The page recovered by reloading itself (lib/report-error.ts). Written
   * down like any other, so the health page shows how often it happens, but
   * no alert is sent: nobody saw a broken page, and an email an hour about a
   * fault that mends itself teaches people to ignore the emails.
   */
  recovered?: boolean;
}): Promise<void> {
  try {
    const headline = clip(input.message, MESSAGE_MAX) ?? "(no message)";
    const detail = clip(input.detail, DETAIL_MAX);
    const message = `${input.recovered ? "[recovered by reloading] " : ""}${headline}${detail ? ` — at: ${detail}` : ""}`;
    await prisma.errorEvent.create({
      data: {
        where: input.where,
        message,
        path: clip(input.path, PATH_MAX),
        digest: clip(input.digest, 64),
      },
    });
    if (!input.recovered && (await allow("alert:errors", 1, HOUR))) {
      await alertAdmins(`Something broke: ${headline.slice(0, 80)}`, [
        `Where: ${input.where}${input.path ? ` — ${clip(input.path, PATH_MAX)}` : ""}`,
        `What: ${message}`,
        input.digest ? `Digest (to find it in the server logs): ${input.digest}` : "",
        "More may follow within the hour without another email. The health page has them all.",
      ]);
    }
  } catch {
    // Reporting a failure must never become a second one.
  }
}

/** A scheduled job threw. Called by lib/cron-run.ts. */
export async function jobFailed(job: string, error: string): Promise<void> {
  try {
    await prisma.errorEvent.create({
      data: { where: "job", message: clip(error, MESSAGE_MAX) ?? "(no message)", path: job },
    });
    if (await allow(`alert:job:${job}`, 1, HOUR)) {
      await alertAdmins(`The ${job} job failed`, [
        `Error: ${clip(error, MESSAGE_MAX)}`,
        "Anything it had already sent stays sent; anything it had not, the next run or sweep picks up.",
      ]);
    }
  } catch {
    // As above.
  }
}

async function alertAdmins(subject: string, lines: string[]): Promise<void> {
  const { superAdminEmails } = await import("@/lib/admin");
  const { sendAdminAlert } = await import("@/lib/email");
  for (const to of superAdminEmails()) {
    await sendAdminAlert({ to, subject, lines: lines.filter(Boolean) }).catch(() => false);
  }
}

/**
 * Keep only what is needed. Run once a day by the daily job.
 *
 * Operational logs only — never anything a family wrote. Email addresses
 * (guests' among them) leave the email log after 90 days.
 */
export async function tidyLogs(now = new Date()): Promise<Record<string, number>> {
  const ago = (days: number) => new Date(now.getTime() - days * 86_400_000);
  const r = await Promise.all([
    prisma.cronRun.deleteMany({ where: { startedAt: { lt: ago(90) } } }),
    prisma.errorEvent.deleteMany({ where: { at: { lt: ago(30) } } }),
    prisma.rateHit.deleteMany({ where: { at: { lt: ago(2) } } }),
    prisma.weeklySent.deleteMany({ where: { sentAt: { lt: ago(120) } } }),
    prisma.emailDelivery.deleteMany({ where: { createdAt: { lt: ago(90) } } }),
  ]);
  return { runs: r[0].count, errors: r[1].count, rateHits: r[2].count, weekly: r[3].count, emails: r[4].count };
}

export type HealthSnapshot = Awaited<ReturnType<typeof healthSnapshot>>;

export async function healthSnapshot(now = new Date()) {
  const day = new Date(now.getTime() - 86_400_000);
  const week = new Date(now.getTime() - 7 * 86_400_000);

  const jobs = await Promise.all(
    JOBS.map(async (j) => {
      const [last, lastOk, failures, running] = await Promise.all([
        prisma.cronRun.findFirst({ where: { job: j.job }, orderBy: { startedAt: "desc" } }),
        prisma.cronRun.findFirst({ where: { job: j.job, ok: true }, orderBy: { startedAt: "desc" } }),
        prisma.cronRun.count({ where: { job: j.job, ok: false, startedAt: { gte: week } } }),
        prisma.cronRun.count({ where: { job: j.job, ok: null, startedAt: { lt: new Date(now.getTime() - 10 * 60_000), gte: week } } }),
      ]);
      const stale = !lastOk || now.getTime() - lastOk.startedAt.getTime() > j.staleAfterHours * HOUR;
      return { ...j, last, lastOk, failures, killed: running, stale };
    }),
  );

  const [emailRows, assistantDay, assistantWeek, assistantPeople, errorsDay, errorGroups] = await Promise.all([
    prisma.emailDelivery.groupBy({
      by: ["kind", "ok"],
      where: { createdAt: { gte: week } },
      _count: { _all: true },
    }),
    prisma.assistantUse.count({ where: { createdAt: { gte: day } } }),
    prisma.assistantUse.count({ where: { createdAt: { gte: week } } }),
    prisma.assistantUse.groupBy({ by: ["userId"], where: { createdAt: { gte: week } } }).then((r) => r.length),
    prisma.errorEvent.count({ where: { at: { gte: day } } }),
    prisma.errorEvent.groupBy({
      by: ["where", "message"],
      where: { at: { gte: week } },
      _count: { _all: true },
      _max: { at: true, path: true },
      orderBy: { _max: { at: "desc" } },
      take: 15,
    }),
  ]);

  const kinds = new Map<string, { kind: string; sent: number; failed: number }>();
  for (const r of emailRows) {
    const k = kinds.get(r.kind) ?? { kind: r.kind, sent: 0, failed: 0 };
    if (r.ok) k.sent += r._count._all;
    else k.failed += r._count._all;
    kinds.set(r.kind, k);
  }
  const email = Array.from(kinds.values()).sort((a, b) => b.failed - a.failed || b.sent - a.sent);

  return {
    jobs,
    email,
    assistant: { day: assistantDay, week: assistantWeek, people: assistantPeople },
    errors: {
      day: errorsDay,
      groups: errorGroups.map((g) => ({
        where: g.where,
        message: g.message,
        count: g._count._all,
        lastAt: g._max.at,
        path: g._max.path,
      })),
    },
  };
}
