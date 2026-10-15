/**
 * A month, as a grid you can look at and tap.
 *
 * Kept apart from the rest of the date rules because it is the one piece with
 * no opinion about what a day is FOR — it lays out squares and says which of
 * them is today. That is why both apps can share it: a scan, a baby shower, a
 * christening and a school play are all just a square with a dot on it.
 *
 * ── Everything here is UTC, and that is not an accident ──────────────────
 * Both apps store an hour exactly as it was typed, as UTC: 18:00 means six in
 * the evening where the family lives. If this grid were built in the browser's
 * local time, somebody in Lagos tapping the 26th would hand back a local
 * midnight that is the 25th at 23:00 UTC, and the day would be written down
 * wrong. So the grid, and the key every day is looked up by, is UTC end to end.
 *
 * Weeks start on Monday, because these are British-English apps and somebody
 * asking "what is on this weekend" wants Saturday and Sunday side by side at
 * the end of the row, not split across two.
 */

const MS_PER_DAY = 86_400_000;

/** Midnight UTC of a date. */
function dayStart(d: Date): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

/** yyyy-mm-dd in UTC — the key a day is looked up by. */
export function ymd(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** Midnight UTC on the first of the month `d` falls in. */
export function monthStart(d: Date): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1));
}

/** `n` months on from the first of this one. Negative goes back. */
export function addMonths(d: Date, n: number): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + n, 1));
}

/** "September 2026" */
export function monthLabel(d: Date): string {
  return d.toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export type GridDay = {
  /** Midnight UTC. */
  at: Date;
  key: string;
  dayOfMonth: number;
  /** False for the days either side that fill out the first and last rows. */
  inMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
};

/**
 * Six weeks of days covering `month`, always 42 cells.
 *
 * Always six rows, never five-or-six: a grid that changes height as you page
 * through the year makes the whole page jump under your thumb, and the button
 * you were about to press moves.
 */
export function monthGrid(month: Date, now = new Date()): GridDay[] {
  const first = monthStart(month);
  // getUTCDay is 0 for Sunday; we want 0 for Monday.
  const lead = (first.getUTCDay() + 6) % 7;
  const todayKey = ymd(dayStart(now));
  const out: GridDay[] = [];
  for (let i = 0; i < 42; i += 1) {
    const at = new Date(first.getTime() + (i - lead) * MS_PER_DAY);
    const weekday = at.getUTCDay();
    out.push({
      at,
      key: ymd(at),
      dayOfMonth: at.getUTCDate(),
      inMonth: at.getUTCMonth() === first.getUTCMonth(),
      isToday: ymd(at) === todayKey,
      isWeekend: weekday === 0 || weekday === 6,
    });
  }
  return out;
}
