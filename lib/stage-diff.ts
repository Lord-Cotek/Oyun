import { STAGES, type Stage } from "@/lib/journey";
import { babySizeFor } from "@/lib/babySize";
import type { JourneyPosition } from "@/lib/stage";

/**
 * What has changed since last time.
 *
 * ── Why this exists ──────────────────────────────────────────────────────
 * The stage card tells her where she is. It has never told her what is new.
 * Those are different questions, and the second is the one people actually
 * turn to another person to answer — "they can hear me now" is a thing you
 * say out loud; "you are at week 23" is not.
 *
 * ── Why four weeks back, and not one ─────────────────────────────────────
 * The same reason the drawn mark carries a month-old ghost rather than a
 * week-old one: a week of change is too small to read. Held against four
 * weeks ago, the difference is a real difference, and the comparison is
 * worth the room it takes on the screen.
 *
 * ── Why it can return null ───────────────────────────────────────────────
 * Early on there is no "before" to compare with, and a card that invents one
 * is worse than a card that says nothing. Weeks 1–4 and month 0 get the
 * current line alone; the comparison appears when there is something honest
 * to compare against.
 */
export interface StageDiff {
  /** What is new now. Always present. */
  now: string;
  /** "A month ago" / "Four weeks ago" — how to introduce `then`. */
  thenLabel: string;
  /** Where they were. Null when there is no honest comparison yet. */
  then: string | null;
  /** "a lime" → "a mango", during pregnancy only and only when both are known. */
  sizeThen: string | null;
  sizeNow: string | null;
}

function stageAt(slug: string): Stage | undefined {
  return STAGES.find((s) => s.stage === slug);
}

export function stageDiff(position: JourneyPosition): StageDiff {
  const now = position.stage.newThisStage;

  if (position.born) {
    const month = position.month ?? 0;
    // Months are already a month apart, so one step back is the right step.
    const back = month - 1;
    const then = back >= 0 ? stageAt(`month-${back}`)?.newThisStage ?? null : null;
    return {
      now,
      thenLabel: "A month ago",
      then,
      sizeThen: null,
      sizeNow: null,
    };
  }

  const week = position.week ?? 1;
  const back = week - 4;
  // Week 4 is where the stages start describing a body at all, so nothing
  // before it is a useful "before".
  const then = back >= 4 ? stageAt(`week-${back}`)?.newThisStage ?? null : null;
  const sizeThen = back >= 4 ? babySizeFor(back) : null;
  const sizeNow = babySizeFor(week);

  return {
    now,
    thenLabel: "Four weeks ago",
    then,
    // Both or neither: "grown from nothing to a mango" is not a sentence
    // worth printing, and a single size here is already on the card above.
    sizeThen: sizeThen && sizeNow ? sizeThen : null,
    sizeNow: sizeThen && sizeNow ? sizeNow : null,
  };
}
