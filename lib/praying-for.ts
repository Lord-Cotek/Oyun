/**
 * The people a family is praying for by name — inside the family or far
 * outside it — and how they come round in worship.
 *
 * A prayer list grows. Twenty names read out every night become a roll-call,
 * and then a list nobody opens. So worship takes a handful each night and
 * moves on, and over a few nights everyone has been named; a short list is
 * simply prayed in full. The order is stable (oldest first), so nobody is
 * skipped and nobody is named twice before the others have had their turn.
 *
 * There is no count of prayers and no streak. Being named is the point.
 *
 * Shared with the sibling app and drift-checked.
 */

export const NAME_MAX = 80;
export const REQUEST_MAX = 300;
export const LIST_CAP = 100;
/** Names prayed in worship on one night. */
export const TONIGHT = 5;
/** How long an answered prayer is still given thanks for in worship. */
export const THANKS_DAYS = 7;

export type PrayingForView = {
  id: string;
  name: string;
  request: string | null;
  withCircle: boolean;
  /** Written by the person looking — only they may change the words. */
  mine: boolean;
  addedBy: string;
  since: string;
  answeredAt: string | null;
  answerNote: string | null;
  stoppedAt: string | null;
};

const DAY = 86_400_000;

/**
 * Tonight's names from a list already in a stable order. Windows of `n`, one
 * window further each day: consecutive windows of the same size cover the
 * whole ring, so everyone comes round within ceil(length / n) nights.
 */
export function tonight<T>(items: T[], n = TONIGHT, now = new Date()): T[] {
  if (items.length <= n) return items;
  const day = Math.floor(now.getTime() / DAY);
  const start = (day * n) % items.length;
  return Array.from({ length: n }, (_, i) => items[(start + i) % items.length]);
}

/** "Mrs Adebayo — healing after her surgery", or just the name. */
export function prayerLine(p: { name: string; request: string | null }): string {
  return p.request?.trim() ? `${p.name} — ${p.request.trim()}` : p.name;
}

/** Answered within THANKS_DAYS: still thanked for in worship. */
export function stillThanking(answeredAt: Date | null, now = new Date()): boolean {
  return !!answeredAt && now.getTime() - answeredAt.getTime() <= THANKS_DAYS * DAY;
}

/** Tidy what was typed: trimmed, single spaces, within its limit; empty → null. */
export function clean(v: unknown, max: number): string | null {
  const s = String(v ?? "").replace(/\s+/g, " ").trim().slice(0, max);
  return s || null;
}
