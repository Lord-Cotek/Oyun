import { prisma } from "@/lib/prisma";
import { sendBroadcastEmail } from "@/lib/email";

/**
 * Sending one email to everybody.
 *
 * ── The thing that makes this different from every other action ──────────
 * It cannot be undone. A password reset sent by mistake is an apology; a
 * broadcast sent by mistake is in three thousand inboxes for ever. So the
 * shape of this is built around three facts:
 *
 *   1. It must be hard to start by accident — the admin centre asks for the
 *      recipient count to be typed, after a test has been sent.
 *   2. It must never send twice. startedAt is claimed in a conditional
 *      update, so a second press finds the row already started and stops.
 *   3. It must survive not finishing. A few thousand emails will not go out
 *      inside one request, so it walks accounts in id order, remembers the
 *      cursor, and can be pressed on again.
 *
 * ── Who gets it ──────────────────────────────────────────────────────────
 * OPTED_IN, the default, is everybody who accepts email from us — the right
 * audience for news, a new feature, a word before Christmas. ALL is every
 * account regardless, which is right for the things a person is entitled to
 * be told whether they want our emails or not: a change to the privacy
 * policy, a security notice, the app closing. The distinction is real and
 * the centre makes the operator choose it rather than defaulting to reach.
 */

/** How many go out in one pass. Kept small enough to finish inside a request. */
export const BATCH = 50;

export type Audience = "OPTED_IN" | "ALL";

export function isAudience(v: string): v is Audience {
  return v === "OPTED_IN" || v === "ALL";
}

export function audienceWhere(audience: Audience) {
  return {
    email: { not: null },
    // Nobody who is suspended: whatever the reason, they are not to be
    // written to as though nothing happened.
    suspendedAt: null,
    ...(audience === "ALL" ? {} : { notifyByEmail: true }),
  };
}

/** How many it would reach, for the count an operator has to type. */
export async function audienceCount(audience: Audience): Promise<number> {
  return prisma.user.count({ where: audienceWhere(audience) });
}

export interface SendPass {
  done: boolean;
  sent: number;
  failed: number;
  /** Total handed over so far, across every pass. */
  sentTotal: number;
}

/**
 * One pass of at most BATCH.
 *
 * Returns `done` when it ran out of people, so the caller can stop pressing.
 * Failures are counted and do not stop the walk: one bad address must not
 * hold up everybody after it.
 */
export async function sendOnePass(broadcastId: string): Promise<SendPass> {
  const b = await prisma.broadcast.findUnique({ where: { id: broadcastId } });
  if (!b) throw new Error("no such broadcast");
  if (b.finishedAt) {
    return { done: true, sent: 0, failed: 0, sentTotal: b.sentCount };
  }

  const audience: Audience = isAudience(b.audience) ? b.audience : "OPTED_IN";
  const people = await prisma.user.findMany({
    where: {
      ...audienceWhere(audience),
      ...(b.cursor ? { id: { gt: b.cursor } } : {}),
    },
    orderBy: { id: "asc" },
    take: BATCH,
    select: { id: true, email: true, name: true },
  });

  if (people.length === 0) {
    await prisma.broadcast.update({
      where: { id: broadcastId },
      data: { finishedAt: new Date() },
    });
    return { done: true, sent: 0, failed: 0, sentTotal: b.sentCount };
  }

  let sent = 0;
  let failed = 0;
  for (const p of people) {
    if (!p.email) continue;
    const ok = await sendBroadcastEmail({
      to: p.email,
      name: p.name,
      subject: b.subject,
      body: b.body,
    }).catch(() => false);
    if (ok) sent++;
    else failed++;
  }

  // A short batch means we have reached the end of the list, so this is the
  // last pass and the broadcast is finished HERE. The first version only set
  // finishedAt on a pass that found nobody at all, which never happens when
  // the total is not an exact multiple of the batch — so a finished
  // broadcast sat recorded as unfinished for ever, and the desk went on
  // offering to send a batch that would do nothing.
  const done = people.length < BATCH;

  const updated = await prisma.broadcast.update({
    where: { id: broadcastId },
    data: {
      cursor: people[people.length - 1].id,
      sentCount: { increment: sent },
      failedCount: { increment: failed },
      ...(done ? { finishedAt: new Date() } : {}),
    },
  });

  return { done, sent, failed, sentTotal: updated.sentCount };
}
