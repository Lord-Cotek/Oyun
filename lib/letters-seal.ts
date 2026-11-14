/**
 * Sealed letters — written now, opened on a day chosen when they were written.
 *
 * A letter to the baby is a keepsake for later. Some are meant to wait: "to
 * be opened on your first birthday", "for the day you start school". Until
 * that day the letter is an envelope to everyone but the one who wrote it —
 * who may always reread their own words.
 *
 * ONE rule, applied the way surprises are (lib/surprise.ts): every read of a
 * letter either spreads `letterOpenScope(viewerId)` into its query, or checks
 * `isSealedFor` on the row it holds. The body of a sealed letter must never
 * reach somebody else's page, search result, memory or export.
 */

function startOfToday(now: Date): Date {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

/** A Prisma `where` fragment: letters this person may read today. */
export function letterOpenScope(viewerId: string, now = new Date()) {
  return {
    OR: [
      { openOn: null },
      { openOn: { lte: startOfToday(now) } },
      { authorId: viewerId },
    ],
  };
}

/** For a row already in hand: still an envelope to this person? */
export function isSealedFor(
  l: { openOn: Date | null; authorId: string },
  viewerId: string,
  now = new Date(),
): boolean {
  return !!l.openOn && l.openOn > startOfToday(now) && l.authorId !== viewerId;
}

/** Still sealed at all — for the writer's own "sealed until" line. */
export function stillSealed(openOn: Date | null, now = new Date()): boolean {
  return !!openOn && openOn > startOfToday(now);
}

/** A seal date as typed: yyyy-mm-dd, tomorrow or later, at most 25 years on. */
export function readOpenOn(raw: unknown, now = new Date()): Date | null {
  const s = String(raw ?? "").trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
  const d = new Date(`${s}T00:00:00.000Z`);
  if (Number.isNaN(d.getTime())) return null;
  const today = startOfToday(now);
  if (d <= today) return null;
  if (d.getTime() > today.getTime() + 25 * 366 * 86_400_000) return null;
  return d;
}

export function openOnWords(d: Date | string): string {
  return new Date(d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
