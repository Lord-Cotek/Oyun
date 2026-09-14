import { type NotificationType } from "@/lib/notify";

/**
 * Choosing what reaches you.
 *
 * Oyun sends eleven different kinds of notification, and a family could
 * control exactly none of them. The only switches were "email me when
 * something happens" and a weekly summary — all or nothing, and nothing in
 * between. So a grandmother who wanted to know when a scan was coming up also
 * got a buzz every time a cousin reacted to a photograph, and her only remedy
 * was to turn the whole thing off. Which is what people do.
 *
 * Eleven switches would be worse. Nobody wants a settings page that reads like
 * a database schema, and "appointment_reminder" is not a thing a person has
 * ever wanted to think about. So the eleven are grouped into five things a
 * family already recognises, and the switch is on the group.
 *
 * What a switch actually does
 * ──────────────────────────
 * It governs what INTERRUPTS you — the push to your phone, and the email.
 * The notification itself is still written down and still appears in the bell,
 * because a record somebody might come looking for is not ours to throw away
 * on the strength of a preference. Turning a row off means "do not tap me on
 * the shoulder about this", not "pretend it never happened", and the settings
 * page says so in those words.
 *
 * Adding a new notification type
 * ─────────────────────────────
 * Put it in CATEGORY_OF. The map is keyed on NotificationType, so a type added
 * to lib/notify.ts and forgotten here is a compile error rather than a silent
 * gap. Even so, `shouldInterrupt` lets an unmapped type through: a family
 * getting one notification they did not expect beats silently missing one they
 * did.
 */

export type NotifyCategory =
  | "circle"
  | "her"
  | "dates"
  | "diary"
  | "house";

/** Which group each notification type belongs to. */
export const CATEGORY_OF: Record<NotificationType, NotifyCategory> = {
  // The circle, praying and writing back
  prayer: "circle",
  encouragement: "circle",
  reached_out: "circle",

  // How she is — the one the husband asked for
  checkin: "her",

  // Dates that are coming
  appointment: "dates",
  appointment_reminder: "dates",
  nudge: "dates",

  // The family diary
  post: "diary",
  comment: "diary",
  reaction: "diary",

  // The journey itself
  invite_accepted: "house",
};

export interface CategoryRow {
  id: NotifyCategory;
  /** The column on User that stores it. */
  field:
    | "notifyCircle"
    | "notifyHer"
    | "notifyDates"
    | "notifyDiary"
    | "notifyHouse";
  /** The switch's own words — what happens, not what it is called. */
  label: string;
  /** One line of what actually lands, in the order a person would meet it. */
  hint: string;
}

/**
 * The five rows, in the order they matter to a family rather than the order
 * they were built in.
 */
export const CATEGORIES: CategoryRow[] = [
  {
    id: "circle",
    field: "notifyCircle",
    label: "When your circle prays or writes back",
    hint: "A prayer request answered, and a word sent to you by somebody carrying you.",
  },
  {
    id: "her",
    field: "notifyHer",
    label: "How she is",
    hint: "When she records how the day has gone. Only ever seen by the two of you.",
  },
  {
    id: "dates",
    field: "notifyDates",
    label: "Appointments and reminders",
    hint: "A scan or check going in the book, the day before, the morning itself, and anything you asked to be reminded of.",
  },
  {
    id: "diary",
    field: "notifyDiary",
    label: "The family diary",
    hint: "New entries, replies and reactions from the people you invited.",
  },
  {
    id: "house",
    field: "notifyHouse",
    label: "Housekeeping",
    hint: "Somebody accepting an invitation to the circle.",
  },
];

/** The user columns this file governs, for a `select`. */
export const CATEGORY_FIELDS = CATEGORIES.map((c) => c.field);

export type CategoryPrefs = Record<CategoryRow["field"], boolean>;

/**
 * Whether a notification of this type should interrupt this person.
 *
 * An unknown type always gets through — see the note at the top on failing in
 * the safe direction.
 */
export function shouldInterrupt(
  type: string,
  prefs: Partial<CategoryPrefs> | null | undefined,
): boolean {
  const category = CATEGORY_OF[type as NotificationType];
  if (!category) return true;
  const row = CATEGORIES.find((c) => c.id === category);
  if (!row) return true;
  const value = prefs?.[row.field];
  // Undefined means a row that predates this preference, or a user we could
  // not read. Both should still be told.
  return value !== false;
}
