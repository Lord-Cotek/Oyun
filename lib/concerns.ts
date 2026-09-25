/**
 * Somebody writing to us from inside the app.
 *
 * ── The line this feature exists to not cross ────────────────────────────
 * The obvious build is a report button on every entry, feeding a queue that
 * shows an admin the entry that was reported. That is the moment the promise
 * ends — and it always ends for the best possible reason, which is somebody
 * needing to check just this one thing.
 *
 * So a concern carries the reporter's OWN WORDS and nothing else. No pointer
 * to an entry, no copy of what upset them, nothing to open. The difference is
 * consent: these are words a person chose to write to us. What their sister
 * wrote in the diary is not.
 *
 * ── Then what use is it? ─────────────────────────────────────────────────
 * It is the difference between a family in trouble having somewhere to turn
 * and having an unanswered support address. An admin can read what the person
 * chose to say, write back, and — where it is serious — suspend an account
 * and pick up the phone. Everything genuinely serious needs a human
 * conversation anyway; none of it needs the diary.
 */

export const CONCERN_KINDS = [
  { key: "SAFETY", label: "I am worried about somebody's safety" },
  { key: "SOMEONE", label: "Somebody in my circle should not be here" },
  { key: "WRONG", label: "Something in the app is wrong or broken" },
  { key: "ACCOUNT", label: "I cannot get into my account" },
  { key: "OTHER", label: "Something else" },
] as const;

export type ConcernKind = (typeof CONCERN_KINDS)[number]["key"];

export const CONCERN_STATES = ["OPEN", "ANSWERED", "CLOSED"] as const;
export type ConcernState = (typeof CONCERN_STATES)[number];

export const SAID_MAX = 2000;
export const OUTCOME_MAX = 500;

export function isConcernKind(v: string): v is ConcernKind {
  return CONCERN_KINDS.some((k) => k.key === v);
}

export function isConcernState(v: string): v is ConcernState {
  return (CONCERN_STATES as readonly string[]).includes(v);
}

export function concernLabel(key: string): string {
  return CONCERN_KINDS.find((k) => k.key === key)?.label ?? key;
}

/**
 * Safety concerns go to the top of the queue and stay there.
 *
 * Not a cleverness — an ordering. Everything else can wait a day; this one
 * is why the feature has a button at all.
 */
export function isUrgent(kind: string): boolean {
  return kind === "SAFETY" || kind === "SOMEONE";
}
