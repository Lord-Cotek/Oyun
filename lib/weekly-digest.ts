/**
 * The words of the weekly email, for one reader.
 *
 * ── Why this is its own file ─────────────────────────────────────────────
 * The weekly email is the one thing Oyun sends, unprompted, to everybody on
 * a journey at once: the mother, her partner, and each friend and relative
 * in her circle. Each of them chose for themselves how Oyun should speak to
 * them (lib/voice.ts), so one journey can send a verse and "Pray for her" to
 * a grandmother and plain encouragement to a colleague in the same minute.
 *
 * That promise used to live in the middle of the job that sends the email,
 * where nothing could check it without a database and a mail server. Here it
 * is a function of plain facts — who is reading, what stage the journey is
 * at, what happened this week — so scripts/verify-voice.mjs can ask for
 * every stage, for every kind of reader, in both voices, and stop a release
 * that would send a prayer point to somebody who asked not to be sent one.
 *
 * ── The rule ─────────────────────────────────────────────────────────────
 * Everything Oyun itself says follows the READER: the greeting, the subject,
 * the headings, the stage's words, the line where the verse sits. What
 * people did is described truthfully whoever reads it — somebody who chose
 * Oyun without religious content "held her in mind", they did not pray, and
 * a faith reader is told exactly that. What people wrote (the title of an
 * answered request) is shown as they wrote it.
 *
 * No database and no imports that reach one: only the stage and the voice.
 */
import type { Stage } from "@/lib/journey";
import { stageIn } from "@/lib/voice-content";
import { isGeneral } from "@/lib/voice";

export interface DigestSection {
  heading: string;
  lines: string[];
}

export type DigestRole = "MOTHER" | "PARTNER" | "CIRCLE";

/** What happened on one journey this week — the same facts for every reader. */
export interface WeekFacts {
  /** The mother's name, as the others should read it. */
  motherName: string;
  /** Every time somebody marked that they prayed for her or held her in mind. */
  supportAll: number;
  /** Of those, the ones marked by people who chose Oyun without religious content. */
  supportHeld: number;
  encouragements: number;
  /** Appointments in the next seven days — for the two of them only. */
  comingLines: string[];
  /** Titles of requests marked answered this week, as their authors wrote them. */
  answeredLines: string[];
  /** Photographs shared this week that the household may see. */
  photosAll: number;
  /** Of those, the ones the wider circle may see. */
  photosCircle: number;
  /** Her latest mood this week, only if she lets her partner see it. */
  moodForPartner: string | null;
  /** Her latest mood this week, only if she lets her circle see it. */
  moodForCircle: string | null;
}

export interface WeeklyDigest {
  subject: string;
  intro: string;
  /** With an empty `ref` it is Oyun's own words, set without quotation marks. */
  verse: { text: string; ref: string };
  sections: DigestSection[];
}

/** How the weekly email opens. */
export function weeklyGreeting(voice: string | null | undefined, name: string | null | undefined): string {
  return `${isGeneral(voice) ? "Hello" : "Peace to you"}, ${name?.trim() || "friend"}.`;
}

const times = (n: number) => `${n} time${n === 1 ? "" : "s"}`;

/**
 * The weekly email for one reader.
 *
 * @param stage the journey's stage as lib/journey.ts has it; this function
 *   puts it into the reader's voice itself, so a caller cannot forget to.
 */
export function weeklyDigestFor(
  reader: { role: DigestRole; voice: string | null | undefined },
  stage: Stage,
  facts: WeekFacts,
): WeeklyDigest {
  const general = isGeneral(reader.voice);
  const s = stageIn(stage, reader.voice);
  const sections: DigestSection[] = [];
  let subject: string;
  let intro: string;

  if (reader.role === "MOTHER") {
    subject = `This week on your journey — ${s.title}`;
    intro = `Here's where you are, and a word for the week ahead.`;
    sections.push({ heading: "This week", lines: [s.body, s.reflection, `One thing to do: ${s.action}`] });

    const circle: string[] = [];
    const all = facts.supportAll;
    const held = Math.min(all, facts.supportHeld);
    const prayed = all - held;
    if (general && all > 0) {
      circle.push(`Your circle held you in mind ${times(all)} this week.`);
    } else if (!general) {
      if (prayed > 0) circle.push(`Your circle prayed for you ${times(prayed)} this week.`);
      if (held > 0) circle.push(`Your circle held you in mind ${times(held)} this week.`);
    }
    if (facts.encouragements > 0) {
      circle.push(`You received ${facts.encouragements} word${facts.encouragements === 1 ? "" : "s"} of encouragement.`);
    }
    if (circle.length === 0) {
      circle.push("Invite someone to walk with you — you were not meant to carry this alone.");
    }
    sections.push({ heading: "Your circle", lines: circle });
    if (facts.comingLines.length) sections.push({ heading: "Coming this week", lines: facts.comingLines });
  } else if (reader.role === "PARTNER") {
    subject = `Walking with ${facts.motherName} this week`;
    intro = `Here's how to carry ${facts.motherName} in the days ahead.`;
    sections.push({ heading: "How to carry her", lines: [s.partnerFocus] });
    sections.push({ heading: general ? "Hold her in mind" : "Pray for her", lines: [s.prayerPoint] });
    if (facts.comingLines.length) sections.push({ heading: "Coming this week", lines: facts.comingLines });
    if (facts.moodForPartner) {
      sections.push({ heading: "Her heart, lately", lines: [`${facts.moodForPartner} — a good moment to reach out.`] });
    }
  } else {
    // The wider circle: not her partner's words, and no appointments.
    subject = general ? `Walking with ${facts.motherName} this week` : `Praying for ${facts.motherName} this week`;
    intro = `A word for walking alongside ${facts.motherName} in the days ahead.`;
    sections.push({ heading: general ? "Hold her in mind" : "Pray for her", lines: [s.prayerPoint] });
    if (facts.moodForCircle) {
      sections.push({ heading: "Her heart, lately", lines: [`${facts.moodForCircle} — a good moment to send a word.`] });
    }
  }

  // For everybody: requests marked answered, and what was shared.
  if (facts.answeredLines.length) {
    sections.push({ heading: general ? "Resolved this week" : "Answered this week", lines: facts.answeredLines });
  }
  const photos = reader.role === "CIRCLE" ? facts.photosCircle : facts.photosAll;
  if (photos > 0) {
    sections.push({ heading: "In Life", lines: [`${photos} new photograph${photos === 1 ? "" : "s"} shared this week.`] });
  }

  return { subject, intro, verse: { text: s.verse.text, ref: s.verse.ref }, sections };
}
