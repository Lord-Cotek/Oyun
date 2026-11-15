import { prisma } from "@/lib/prisma";

/**
 * Every scheduled job, written down.
 *
 * ── Why ──────────────────────────────────────────────────────────────────
 * A job that fails at seven in the morning used to leave no trace anywhere a
 * person would look: no reminder went out, and nobody knew until a family
 * said so. Now each run leaves a row — when it started, when it finished,
 * what it did, and the error if it threw — and the admin centre's health
 * page reads them.
 *
 * ── The time budget ──────────────────────────────────────────────────────
 * A serverless function is killed at its limit, wherever it is. So each job
 * is handed `out()`, which turns true some seconds before the limit; a loop
 * that checks it stops cleanly and the run is recorded as `more`. Because
 * every send is claimed before it is made, the second sweep scheduled half
 * an hour later (vercel.json) finishes the rest without repeating anything.
 */

export type Budget = {
  /** True once there is no longer time to start another piece of work. */
  out: () => boolean;
  /** Set when a loop stopped early, so the run says it left work behind. */
  stopped: () => void;
};

const SUMMARY_MAX = 2000;
const ERROR_MAX = 500;

export async function recordRun<T extends Record<string, unknown>>(
  job: string,
  maxSeconds: number,
  work: (budget: Budget) => Promise<T>,
): Promise<T & { more?: true }> {
  const started = Date.now();
  // Ten seconds of room for the last send in flight and the write below.
  const deadline = started + Math.max(5, maxSeconds - 10) * 1000;
  let more = false;
  const budget: Budget = {
    out: () => Date.now() > deadline,
    stopped: () => {
      more = true;
    },
  };

  const row = await prisma.cronRun
    .create({ data: { job }, select: { id: true } })
    .catch(() => null); // the log must never be why a reminder did not go

  try {
    const result = await work(budget);
    const out = (more ? { ...result, more: true as const } : result) as T & { more?: true };
    if (row) {
      await prisma.cronRun
        .update({
          where: { id: row.id },
          data: {
            finishedAt: new Date(),
            ok: true,
            more,
            summary: JSON.stringify(out).slice(0, SUMMARY_MAX),
          },
        })
        .catch(() => {});
    }
    return out;
  } catch (e) {
    const { jobFailed } = await import("@/lib/health");
    await jobFailed(job, e instanceof Error ? `${e.name}: ${e.message}` : String(e));
    if (row) {
      await prisma.cronRun
        .update({
          where: { id: row.id },
          data: {
            finishedAt: new Date(),
            ok: false,
            more,
            error: (e instanceof Error ? `${e.name}: ${e.message}` : String(e)).slice(0, ERROR_MAX),
          },
        })
        .catch(() => {});
    }
    throw e;
  }
}

/** The Monday a week's email belongs to, as YYYY-MM-DD, in UTC. */
export function weekKey(now = new Date()): string {
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const back = (d.getUTCDay() + 6) % 7;
  d.setUTCDate(d.getUTCDate() - back);
  return d.toISOString().slice(0, 10);
}

/**
 * Take the right to send this person this week's email about one family,
 * once. Somebody in two families gets one for each, so the family is part
 * of the key. Written before the send; `releaseWeekly` gives it back if the
 * provider refuses, so the second sweep tries again rather than skipping.
 */
export async function claimWeekly(userId: string, week: string, scope: string): Promise<boolean> {
  try {
    await prisma.weeklySent.create({ data: { userId, week: `${week}/${scope}` } });
    return true;
  } catch {
    return false;
  }
}

export async function releaseWeekly(userId: string, week: string, scope: string): Promise<void> {
  await prisma.weeklySent.deleteMany({ where: { userId, week: `${week}/${scope}` } }).catch(() => {});
}
