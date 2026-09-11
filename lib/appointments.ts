import { type AppointmentKind } from "@prisma/client";

/**
 * Appointments, and the rules for reminding somebody about them.
 *
 * The reminding is the point. A list of dates nobody is told about is a
 * calendar you have to remember to open, which is the thing that was already
 * failing. But a pregnant woman being pinged five times about one scan is
 * worse than not being told at all — she will turn the notifications off, and
 * then she gets nothing.
 *
 * So: at most three reminders per appointment, usually two, and they taper.
 */

export interface KindVoice {
  label: string;
  /** What it usually is, for the person choosing from a list. */
  hint: string;
  /**
   * Whether this is the sort of appointment worth a week's notice.
   *
   * A routine midwife check needs a day's warning. A scan or a consultant may
   * mean time off work, a lift, or somebody to sit with the other children —
   * and finding that out the night before is not enough. Everything else
   * would just be noise a week out.
   */
  weekAhead: boolean;
  /** A Tailwind tone token from the app's category palette. */
  tone: "amber" | "rose" | "sky" | "gold" | "green" | "plum";
}

const VOICE: Record<AppointmentKind, KindVoice> = {
  ANTENATAL: {
    label: "Antenatal check",
    hint: "The routine midwife or doctor appointment",
    weekAhead: false,
    tone: "rose",
  },
  SCAN: {
    label: "Scan",
    hint: "Dating, anomaly, growth — the ones you want someone with you for",
    weekAhead: true,
    tone: "sky",
  },
  TEST: {
    label: "Tests",
    hint: "Bloods, glucose, swabs",
    weekAhead: false,
    tone: "plum",
  },
  CONSULTANT: {
    label: "Consultant",
    hint: "A specialist — often worth planning around",
    weekAhead: true,
    tone: "amber",
  },
  POSTNATAL: {
    label: "Your own check",
    hint: "The mother's check after the birth — the one most easily skipped",
    weekAhead: false,
    tone: "rose",
  },
  BABY_CHECK: {
    label: "Baby's check",
    hint: "Weight, feeding, development",
    weekAhead: false,
    tone: "gold",
  },
  IMMUNISATION: {
    label: "Immunisation",
    hint: "The jabs, by age",
    weekAhead: false,
    tone: "green",
  },
  CLASS: {
    label: "Class",
    hint: "Antenatal or parenting classes",
    weekAhead: true,
    tone: "green",
  },
  OTHER: {
    label: "Something else",
    hint: "Anything with a date on it",
    weekAhead: false,
    tone: "amber",
  },
};

export function kindVoice(k: AppointmentKind): KindVoice {
  return VOICE[k] ?? VOICE.OTHER;
}

export const APPOINTMENT_KINDS = Object.keys(VOICE) as AppointmentKind[];

export function toKind(value: unknown): AppointmentKind {
  const v = String(value ?? "").toUpperCase();
  return (APPOINTMENT_KINDS as string[]).includes(v)
    ? (v as AppointmentKind)
    : "ANTENATAL";
}

/** What to call one, given it may or may not have been named. */
export function appointmentTitle(
  kind: AppointmentKind,
  title: string | null,
): string {
  return title?.trim() || kindVoice(kind).label;
}

// ── When to remind ────────────────────────────────────────────────────────
/**
 * The three moments, in the order they arrive.
 *
 * `week` only applies to the kinds that warrant it, so a woman with weekly
 * midwife checks in the third trimester is not told about each one twice.
 */
export type ReminderStage = "week" | "day" | "morning";

export const STAGE_DAYS: Record<ReminderStage, number> = {
  week: 7,
  day: 1,
  morning: 0,
};

/** Whole days between two instants, by calendar day in UTC. */
export function daysUntil(at: Date, now: Date): number {
  const d = (x: Date) =>
    Date.UTC(x.getUTCFullYear(), x.getUTCMonth(), x.getUTCDate());
  return Math.round((d(at) - d(now)) / 86_400_000);
}

/**
 * Which reminder, if any, is due for this appointment right now.
 *
 * Returns null far more often than not — that is the design. A stage already
 * stamped is never returned again, and a stage whose day has passed is simply
 * skipped rather than fired late: being told on Thursday morning about a scan
 * that was on Tuesday helps nobody.
 */
export function dueStage(
  a: {
    kind: AppointmentKind;
    at: Date;
    hasTime: boolean;
    attendedAt: Date | null;
    cancelledAt: Date | null;
    remindedWeekAt: Date | null;
    remindedDayAt: Date | null;
    remindedMorningAt: Date | null;
  },
  now: Date,
): ReminderStage | null {
  if (a.attendedAt || a.cancelledAt) return null;
  const days = daysUntil(a.at, now);
  if (days < 0) return null;

  if (days === 0) {
    // No hour on the letter means no morning reminder — there is nothing
    // useful to say beyond "today", which the day-before note already said.
    if (!a.hasTime || a.remindedMorningAt) return null;
    return "morning";
  }
  if (days === 1) return a.remindedDayAt ? null : "day";
  if (days <= 7 && kindVoice(a.kind).weekAhead) {
    return a.remindedWeekAt ? null : "week";
  }
  return null;
}

/** The column to stamp once a reminder has actually been sent. */
export const STAGE_COLUMN: Record<ReminderStage, string> = {
  week: "remindedWeekAt",
  day: "remindedDayAt",
  morning: "remindedMorningAt",
};

// ── Saying when ───────────────────────────────────────────────────────────
/** The clock part, when there is one. */
export function timeLabel(at: Date, hasTime: boolean): string | null {
  if (!hasTime) return null;
  return at.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  });
}

/** The day, said the way a person would say it. */
export function dayLabel(at: Date, now = new Date()): string {
  const days = daysUntil(at, now);
  if (days === 0) return "today";
  if (days === 1) return "tomorrow";
  if (days === -1) return "yesterday";
  const weekday = at.toLocaleDateString("en-GB", {
    weekday: "long",
    timeZone: "UTC",
  });
  if (days > 1 && days < 7) return weekday;
  return at.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  });
}

/** The whole thing, for a notification: "Scan — tomorrow at 09:30". */
export function whenLabel(at: Date, hasTime: boolean, now = new Date()): string {
  const t = timeLabel(at, hasTime);
  const d = dayLabel(at, now);
  return t ? `${d} at ${t}` : d;
}

/** How a reminder should open, by stage. */
export function reminderLead(stage: ReminderStage): string {
  switch (stage) {
    case "week":
      return "A week today";
    case "day":
      return "Tomorrow";
    default:
      return "This morning";
  }
}

export const TITLE_MAX = 120;
export const TEXT_MAX = 2000;
