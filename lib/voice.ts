/**
 * How Oyun speaks to one person.
 *
 * ── Why this exists ──────────────────────────────────────────────────────
 * Oyun was written as a Christian companion, and for the families who chose
 * it for that, it still is: the daily verse, the prayer points, the worship
 * room and the Scripture journey are unchanged. But doctors and midwives now
 * hand it to patients of every faith and none, and a woman who is not a
 * Christian should not have to scroll past prayers to reach her scan dates.
 *
 * So each person chooses at sign-up:
 *
 *   FAITH     the Christian Oyun, exactly as it was
 *   GENERAL   every feature, with the verses, prayers, worship and Scripture
 *             replaced by words of encouragement written for the same moment
 *
 * ── The rules ────────────────────────────────────────────────────────────
 * 1. FAITH is the default, and anything unreadable counts as FAITH. Every
 *    account that existed before the choice is FAITH, so nobody already
 *    here sees a single word change.
 * 2. It belongs to the PERSON, not the journey. A husband who chose faith
 *    and a wife who did not each see their own Oyun on the same pregnancy.
 * 3. Words the APP writes follow the reader's voice. Words PEOPLE write — a
 *    prayer request, a post, a letter — are shown as they were written. We
 *    never rewrite what somebody said.
 * 4. Features never disappear by voice except the two rooms that are only
 *    worship (Worship and Scripture). Everything else is the same room with
 *    different words.
 */

export type Voice = "FAITH" | "GENERAL";

/** Anything that is not plainly GENERAL is the faith voice — rule 1. */
export function voiceOf(v: string | null | undefined): Voice {
  return v === "GENERAL" ? "GENERAL" : "FAITH";
}

export function isGeneral(v: string | null | undefined): boolean {
  return voiceOf(v) === "GENERAL";
}

/** How each choice is described wherever it is offered. */
export const VOICE_CHOICES: { value: Voice; label: string; detail: string }[] = [
  {
    value: "FAITH",
    label: "With Christian faith",
    detail: "A Bible verse each day, prayer with your circle, family worship and a Scripture reading plan.",
  },
  {
    value: "GENERAL",
    label: "Without religious content",
    detail: "Words of encouragement each day and support from your circle — no verses, prayers or worship.",
  },
];

/**
 * The few app-wide words that change with the voice. Room-specific wording
 * lives with its room; this is what the menu, the bell and shared components
 * need.
 */
export interface VoiceWords {
  /** The /prayer room's name in the menu. */
  prayerRoom: string;
  /** Heading over the stage's prayer point / hope. */
  prayFor: (name: string) => string;
  /** Eyebrow over the daily word or verse. */
  todaysWord: string;
  /** What a circle member does for a request: "I prayed" / "Thinking of you". */
  responded: string;
  respond: string;
  /** "3 people prayed" / "3 people are thinking of you". */
  respondedCount: (n: number) => string;
  /** A prayer request, by name. */
  request: string;
  requests: string;
}

const FAITH_WORDS: VoiceWords = {
  prayerRoom: "Prayer",
  prayFor: (name) => `Pray for ${name}`,
  todaysWord: "Today’s verse",
  responded: "Prayed",
  respond: "I prayed",
  respondedCount: (n) => (n === 1 ? "1 prayed" : `${n} prayed`),
  request: "prayer request",
  requests: "prayer requests",
};

const GENERAL_WORDS: VoiceWords = {
  prayerRoom: "Support",
  prayFor: (name) => `Hold ${name} in mind`,
  todaysWord: "Today’s word",
  responded: "Thinking of you",
  respond: "Thinking of you",
  respondedCount: (n) => (n === 1 ? "1 thinking of you" : `${n} thinking of you`),
  request: "request for support",
  requests: "requests for support",
};

export function wordsForVoice(v: string | null | undefined): VoiceWords {
  return isGeneral(v) ? GENERAL_WORDS : FAITH_WORDS;
}
