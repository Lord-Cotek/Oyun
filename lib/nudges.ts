/**
 * Reminders somebody sets for themselves.
 *
 * Not the appointment book. The book holds dates the whole household has to
 * be at, and reminds all of them; these are the small private things — ring
 * her mum, order the car seat, take Friday off — and only the person who set
 * one is ever told about it.
 *
 * Pure rules, no database, so both the form and the daily run agree on what
 * "tomorrow" means.
 */

/** At most this many open at once — a list, not a backlog. */
export const NUDGE_CAP = 12;
export const NUDGE_TEXT_MAX = 160;

/** The hour of the morning a reminder is due, in UTC. */
const REMIND_HOUR = 7;

export const NUDGE_WHENS = [
  { value: "today", label: "Today" },
  { value: "tomorrow", label: "Tomorrow" },
  { value: "week", label: "In a week" },
  { value: "pick", label: "Pick a day" },
] as const;

/**
 * "today", "tomorrow", "week", or a yyyy-mm-dd from the picker — always
 * resolved to the morning of that day, because that is the hour the daily run
 * looks. Null for anything it does not recognise.
 */
export function parseWhen(when: string, now = new Date()): Date | null {
  const morningOf = (d: Date) =>
    new Date(
      Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), REMIND_HOUR),
    );
  const plusDays = (n: number) => {
    const d = new Date(now);
    d.setUTCDate(d.getUTCDate() + n);
    return morningOf(d);
  };

  if (when === "today") return morningOf(now);
  if (when === "tomorrow") return plusDays(1);
  if (when === "week") return plusDays(7);
  if (/^\d{4}-\d{2}-\d{2}$/.test(when)) {
    const d = new Date(
      `${when}T${String(REMIND_HOUR).padStart(2, "0")}:00:00.000Z`,
    );
    return Number.isNaN(d.getTime()) ? null : d;
  }
  return null;
}

/**
 * Whether this reminder should be told this morning.
 *
 * Only on the day itself, and only once. The "only on the day" part matters
 * for a reason that has nothing to do with taste: every reminder that existed
 * before this worked has a due date months in the past and no stamp. A window
 * of "anything overdue" would greet those people with a pile of reminders on
 * the first morning — which is exactly the pestering this is meant to avoid.
 */
export function nudgeDueToday(
  n: { dueAt: Date; doneAt: Date | null; remindedAt: Date | null },
  now = new Date(),
): boolean {
  if (n.doneAt || n.remindedAt) return false;
  const sameDay =
    n.dueAt.getUTCFullYear() === now.getUTCFullYear() &&
    n.dueAt.getUTCMonth() === now.getUTCMonth() &&
    n.dueAt.getUTCDate() === now.getUTCDate();
  return sameDay;
}
