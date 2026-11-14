import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

/**
 * A simple, honest limit on how often one person — or one address, or one
 * device — may knock: signing in, asking for a code, a reset email, a guest
 * reply.
 *
 * ── Why ──────────────────────────────────────────────────────────────────
 * Without it, anybody could guess passwords without end, send reset emails
 * to any address as often as they liked, or fill an invitation's reply list
 * so real guests were turned away. The numbers sit far above what a person
 * does by hand, so nobody honest meets them.
 *
 * ── Why the database ─────────────────────────────────────────────────────
 * Requests land on different short-lived servers; a counter in memory resets
 * whenever it likes and limits nothing. One row per knock, swept as it goes.
 *
 * Shared with the sibling app and drift-checked.
 */

/** The caller's IP as the platform reports it, or "unknown". */
export function callerIp(h?: { get(name: string): string | null }): string {
  let src = h;
  if (!src) {
    try {
      src = headers();
    } catch {
      return "unknown";
    }
  }
  const fwd = src.get("x-forwarded-for") ?? "";
  return fwd.split(",")[0]?.trim() || src.get("x-real-ip") || "unknown";
}

/**
 * Count one knock against `key`, unless it is already over `limit` within
 * `windowMs`. True means go ahead. A database that is not answering lets the
 * knock through: a limit must never lock everybody out.
 */
export async function allow(key: string, limit: number, windowMs: number): Promise<boolean> {
  const since = new Date(Date.now() - windowMs);
  try {
    const n = await prisma.rateHit.count({ where: { key, at: { gte: since } } });
    if (n >= limit) return false;
    await prisma.rateHit.create({ data: { key } });
    // Sweep this key's old knocks now and then — cheap, and keeps the table small.
    if (Math.random() < 0.05) {
      await prisma.rateHit.deleteMany({ where: { key, at: { lt: since } } });
    }
    return true;
  } catch {
    return true;
  }
}

/** Several limits at once (by address AND by device); all must allow. */
export async function allowAll(checks: [key: string, limit: number, windowMs: number][]): Promise<boolean> {
  for (const [k, l, w] of checks) {
    if (!(await allow(k, l, w))) return false;
  }
  return true;
}

export const MINUTE = 60_000;
export const HOUR = 3_600_000;
