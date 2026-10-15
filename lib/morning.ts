import { computePosition } from "@/lib/stage";
import { dailyDevotion } from "@/lib/daily";
import { dailyLament } from "@/lib/lament";

/**
 * One note each morning, written for the seat you are actually sitting in.
 *
 * ── Why three notes and not one ──────────────────────────────────────────
 * A mother, the man beside her and a grandmother in the circle are living
 * three different days. Sending all three the same line makes it useful to
 * none of them: she does not need telling how to care for herself, and a
 * friend four hundred miles away cannot act on "rest when you can".
 *
 * The content for all three is already written, per week, in lib/journey.ts
 * — every stage carries an `action` (the one thing to do), a `partnerFocus`
 * (how to care for her THIS week) and a `prayerPoint` (how to pray for them).
 * Nothing here is invented. This only chooses which of the three to send, and
 * to whom, and pairs it with the day's verse.
 *
 * ── What it must never do ────────────────────────────────────────────────
 * Send a family who have just lost a baby a cheerful note about week
 * fourteen. A journey that is marked LOSS does not get stage content at all:
 * the two who are grieving get the day's lament, which is written for exactly
 * this and is careful not to rush anybody to a resolution, and the circle
 * gets NOTHING — a friend being prompted each morning to pray about a
 * pregnancy that has ended would be a wound delivered daily, by us, on a
 * schedule.
 *
 * That is the whole reason this file returns `null` as a first-class answer.
 * Silence is a thing a morning note has to be able to say.
 */

/** The three seats. Everybody in a journey is in one of them. */
export type Seat = "mother" | "partner" | "circle";

export function seatFor(role: string): Seat {
  if (role === "MOTHER") return "mother";
  if (role === "PARTNER") return "partner";
  return "circle";
}

export interface MorningNote {
  /** The lock screen's first line. Short, and always names the Scripture. */
  title: string;
  /** The substance — the one line written for this seat, this week. */
  body: string;
  href: string;
}

/**
 * A phone's lock screen gives a notification roughly two lines before it cuts
 * the sentence off mid-word. Better to stop at a word ourselves and say so.
 */
const BODY_MAX = 140;

function trim(s: string, max = BODY_MAX): string {
  const clean = s.trim().replace(/\s+/g, " ");
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[,;:.—-]+$/, "")}…`;
}

export interface MorningInput {
  seat: Seat;
  /** The journey's due date — what the whole stage calculation hangs on. */
  dueDate: Date;
  /** "ACTIVE" or "LOSS". Anything else is treated as a loss, which is the
   *  safer way to be wrong: silence rather than a cheerful week count. */
  status: string;
  now?: Date;
}

/**
 * The note this person should get this morning, or null for silence.
 */
export function morningNote(input: MorningInput): MorningNote | null {
  const now = input.now ?? new Date();

  if (input.status !== "ACTIVE") {
    // ── After a loss ──────────────────────────────────────────────────────
    // No stage, no week number, nothing to do today. The circle is not
    // written to at all; see the note at the top of this file.
    if (input.seat === "circle") return null;
    const lament = dailyLament(now);
    return {
      title: `This morning · ${lament.ref}`,
      body: trim(lament.text),
      href: "/lament",
    };
  }

  const { stage } = computePosition(input.dueDate, now);
  const verse = dailyDevotion(now);

  if (input.seat === "mother") {
    return {
      title: `This morning · ${verse.ref}`,
      body: trim(verse.text),
      href: "/journey",
    };
  }

  if (input.seat === "partner") {
    return {
      // Named for what it is, so it is worth opening even on a busy morning:
      // this is the one thing he can do for her today.
      title: `For her today · ${verse.ref}`,
      body: trim(stage.partnerFocus),
      href: "/journey",
    };
  }

  return {
    title: `Pray for them · ${verse.ref}`,
    body: trim(stage.prayerPoint),
    href: "/journey",
  };
}
