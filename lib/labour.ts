/**
 * The contraction timer's arithmetic, and the words for between contractions.
 *
 * ── What the timer is for ────────────────────────────────────────────────
 * When a woman rings the labour ward she is asked two things: how long do
 * they last, and how far apart are they. At three in the morning nobody can
 * answer that from memory. This turns a row of taps into those two numbers,
 * in the words a midwife uses.
 *
 * ── What it will not do ──────────────────────────────────────────────────
 * It never says when to go in. Every rule of thumb for that is wrong for
 * somebody: a second baby comes faster than a first, a woman an hour from
 * the hospital leaves sooner than one across the road, and a unit may want
 * a woman with a previous caesarean in at the first contraction. So the page
 * shows the numbers, and beside them what her OWN hospital told her, typed
 * in ahead of time by the family. scripts/verify-care.mjs holds the timer to
 * that: no "go to hospital", no "5-1-1", no "wait".
 *
 * ── The words ────────────────────────────────────────────────────────────
 * Between contractions there is a minute or two with nothing to do but
 * breathe. The breathing prompts are the same for everybody. After them, a
 * reader who chose Oyun with faith is given short Scripture and prayers,
 * which a partner can read aloud; one who chose it without is given plain
 * encouragement (lib/voice.ts). Her partner's screen follows his own choice.
 *
 * No database and no imports that reach one.
 */
import { isGeneral } from "@/lib/voice";

export interface Timed {
  id: string;
  startedAt: Date | string;
  endedAt: Date | string | null;
}

export interface ContractionRow {
  id: string;
  /** Milliseconds since the epoch. */
  start: number;
  end: number | null;
  /** How long it lasted, in seconds. Null while it is still going. */
  lengthSec: number | null;
  /** Start to start, from the one before it, in seconds. Null on the first. */
  gapSec: number | null;
}

/** One still running for longer than this was almost certainly not stopped. */
export const FORGOTTEN_AFTER_SEC = 5 * 60;

/** A gap longer than this is a new stretch of labour, not an interval. */
const BREAK_AFTER_SEC = 60 * 60;

const ms = (d: Date | string) => (d instanceof Date ? d.getTime() : new Date(d).getTime());

/** Oldest first, each with its length and its distance from the one before. */
export function contractionRows(list: Timed[]): ContractionRow[] {
  const sorted = [...list].sort((a, b) => ms(a.startedAt) - ms(b.startedAt));
  return sorted.map((c, i) => {
    const start = ms(c.startedAt);
    const end = c.endedAt ? ms(c.endedAt) : null;
    const prev = i > 0 ? ms(sorted[i - 1].startedAt) : null;
    const gap = prev === null ? null : Math.round((start - prev) / 1000);
    return {
      id: c.id,
      start,
      end,
      lengthSec: end === null ? null : Math.max(0, Math.round((end - start) / 1000)),
      // A gap of more than an hour is not "how far apart": she slept, or it
      // stopped and started again.
      gapSec: gap !== null && gap <= BREAK_AFTER_SEC ? gap : null,
    };
  });
}

export interface LabourSummary {
  /** How many finished contractions began inside the window. */
  count: number;
  avgLengthSec: number | null;
  avgGapSec: number | null;
  windowMin: number;
}

/**
 * The last hour (or whatever window), as a midwife asks for it. Null when
 * there are fewer than two finished contractions in it: one contraction has
 * no "how far apart".
 */
export function summarise(rows: ContractionRow[], nowMs: number, windowMin = 60): LabourSummary | null {
  const from = nowMs - windowMin * 60_000;
  const inWindow = rows.filter((r) => r.start >= from && r.lengthSec !== null);
  if (inWindow.length < 2) return null;
  const mean = (xs: number[]) => (xs.length ? Math.round(xs.reduce((a, b) => a + b, 0) / xs.length) : null);
  return {
    count: inWindow.length,
    avgLengthSec: mean(inWindow.map((r) => r.lengthSec!)),
    // Only gaps between two contractions that are both inside the window.
    avgGapSec: mean(inWindow.slice(1).map((r) => r.gapSec).filter((g): g is number => g !== null)),
    windowMin,
  };
}

/** 75 → "1:15". */
export function clock(sec: number): string {
  const s = Math.max(0, Math.round(sec));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

/** 75 → "1 minute 15 seconds"; 55 → "55 seconds"; 360 → "6 minutes". */
export function inWords(sec: number): string {
  const s = Math.max(0, Math.round(sec));
  const m = Math.floor(s / 60);
  const r = s % 60;
  const mins = m > 0 ? `${m} minute${m === 1 ? "" : "s"}` : "";
  const secs = r > 0 || m === 0 ? `${r} second${r === 1 ? "" : "s"}` : "";
  return [mins, secs].filter(Boolean).join(" ");
}

/** The sentence to read down the telephone. */
export function spoken(s: LabourSummary): string {
  const parts = [`${s.count} contractions in the last ${s.windowMin === 60 ? "hour" : `${s.windowMin} minutes`}`];
  if (s.avgLengthSec !== null) parts.push(`lasting about ${inWords(s.avgLengthSec)} each`);
  if (s.avgGapSec !== null) parts.push(`about ${inWords(Math.round(s.avgGapSec / 30) * 30)} apart, start to start`);
  return `${parts.join(", ")}.`;
}

/**
 * A time sent by the phone, made safe. The tap is timed on the phone so that
 * a slow connection does not stretch a contraction; but a phone with the
 * wrong clock, or a made-up request, falls back to the server's own time.
 */
export function cleanTapTime(at: string | null | undefined, now: Date): Date {
  if (!at) return now;
  const t = new Date(at).getTime();
  if (!Number.isFinite(t)) return now;
  if (t > now.getTime() + 60_000 || t < now.getTime() - 10 * 60_000) return now;
  return new Date(t);
}

export const LABOUR_NOTE_MAX = 400;

/** Said under the timer, always. These are not about timing and do not wait for it. */
export const LABOUR_ALWAYS =
  "Bleeding, your waters breaking, the baby moving less, or contractions before 37 weeks: call now, whatever the timer says.";

// ── Words for between contractions ──────────────────────────────────────────

export interface LabourWords {
  /** Heading above the words, for this reader. */
  heading: string;
  breathing: string[];
  /** With an empty `ref` it is Oyun's own words. */
  lines: { text: string; ref: string }[];
  /** Short prayers, with faith only. */
  prayers: string[];
}

const BREATHING = [
  "In through the nose for four. Out through the mouth for six.",
  "Loose jaw. Loose shoulders. Loose hands.",
  "Breathe the contraction out, all the way to the end of it.",
  "In the gap, rest. All of the gap is for resting.",
];

const PLAIN: { text: string; ref: string }[] = [
  { text: "This one will end. Every one of them has.", ref: "" },
  { text: "You do not have to do the whole labour. Only this one.", ref: "" },
  { text: "Each one brings the baby closer.", ref: "" },
  { text: "Your body knows this work. Let it.", ref: "" },
  { text: "You are doing it. Right now, you are doing it.", ref: "" },
  { text: "You are not alone in this room.", ref: "" },
];

const SCRIPTURE: { text: string; ref: string }[] = [
  { text: "Don’t you be afraid, for I am with you. Don’t be dismayed, for I am your God. I will strengthen you. Yes, I will help you.", ref: "Isaiah 41:10" },
  { text: "God is our refuge and strength, a very present help in trouble.", ref: "Psalm 46:1" },
  { text: "When I am afraid, I will put my trust in you.", ref: "Psalm 56:3" },
  { text: "Shall I bring to the birth, and not cause to be delivered?” says the LORD.", ref: "Isaiah 66:9" },
  { text: "When you pass through the waters, I will be with you, and through the rivers, they will not overflow you.", ref: "Isaiah 43:2" },
  { text: "He gives power to the weak. He increases the strength of him who has no might.", ref: "Isaiah 40:29" },
  { text: "Be strong and courageous. Don’t be afraid. Don’t be dismayed, for the LORD your God is with you wherever you go.", ref: "Joshua 1:9" },
  { text: "A woman, when she gives birth, has sorrow because her time has come. But when she has delivered the child, she doesn’t remember the anguish any more, for the joy that a human being is born into the world.", ref: "John 16:21" },
];

const PRAYERS_HERS = [
  "Lord, be near in this one.",
  "Give me strength for the next minute, and then the next.",
  "Into your hands, Lord: me, and this child.",
];
const PRAYERS_HIS = [
  "Lord, be near to her in this one.",
  "Give her strength for the next minute, and then the next.",
  "Into your hands, Lord: this mother and this child.",
];

export function labourWords(voice: string | null | undefined, reader: "MOTHER" | "PARTNER"): LabourWords {
  const general = isGeneral(voice);
  const her = reader === "PARTNER";
  return {
    heading: her ? "To say to her, between contractions" : "For between contractions",
    breathing: BREATHING,
    lines: general ? PLAIN : SCRIPTURE,
    prayers: general ? [] : her ? PRAYERS_HIS : PRAYERS_HERS,
  };
}
