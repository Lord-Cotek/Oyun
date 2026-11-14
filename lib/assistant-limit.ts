import { prisma } from "@/lib/prisma";

/**
 * How often one person may ask the assistant — counted in the database.
 *
 * ── Why there is a limit at all ──────────────────────────────────────────
 * Every message is a paid call against the family's own key. Signing in is
 * the first wall; this is the second, for a script left running, a stuck
 * retry loop, or an account somebody else has got into. The numbers are far
 * above anything a person typing would reach — a long evening's real
 * conversation is twenty messages — so nobody honest ever meets them.
 *
 * ── Why the database and not memory ──────────────────────────────────────
 * Each request may land on a different short-lived server, so a counter in
 * memory resets whenever it likes and limits nothing. A row per message is
 * dull and correct, and old rows are swept as they are counted.
 */
export const PER_HOUR = 40;
export const PER_DAY = 200;

export type LimitAnswer =
  | { ok: true }
  | { ok: false; message: string; retryAfterSeconds: number };

export async function checkAssistantLimit(
  userId: string,
  now = new Date(),
): Promise<LimitAnswer> {
  const hourAgo = new Date(now.getTime() - 3_600_000);
  const dayAgo = new Date(now.getTime() - 86_400_000);
  const [hour, day] = await Promise.all([
    prisma.assistantUse.count({ where: { userId, createdAt: { gte: hourAgo } } }),
    prisma.assistantUse.count({ where: { userId, createdAt: { gte: dayAgo } } }),
  ]);
  if (day >= PER_DAY) {
    return {
      ok: false,
      message: "That is a great deal of talking for one day — let's pick this up again tomorrow.",
      retryAfterSeconds: 6 * 3600,
    };
  }
  if (hour >= PER_HOUR) {
    return {
      ok: false,
      message: "Let's pause for a little while — you can carry on within the hour.",
      retryAfterSeconds: 1800,
    };
  }
  return { ok: true };
}

/** Count one message, and sweep this person's rows older than a day. */
export async function recordAssistantUse(userId: string, now = new Date()): Promise<void> {
  try {
    await prisma.assistantUse.create({ data: { userId } });
    await prisma.assistantUse.deleteMany({
      where: { userId, createdAt: { lt: new Date(now.getTime() - 2 * 86_400_000) } },
    });
  } catch {
    // Counting must never stop somebody being answered.
  }
}
