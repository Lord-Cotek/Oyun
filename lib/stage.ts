import { STAGES, type Stage, stageBySlug } from "@/lib/journey";

const MS_PER_DAY = 1000 * 60 * 60 * 24;
const DAYS_PER_WEEK = 7;
const DAYS_PER_MONTH = 30.436875; // average Gregorian month
const TERM_WEEKS = 40;

export interface JourneyPosition {
  stage: Stage;
  /** true once the child has arrived (now is on/after the due/birth date). */
  born: boolean;
  /** completed weeks of pregnancy, 1..40 (undefined after birth) */
  week?: number;
  /** days into the current gestational week, 0..6 (undefined after birth) */
  dayInWeek?: number;
  /** whole days remaining until the due date (0 if past) */
  daysToGo: number;
  /** completed months since birth, 0..24 (undefined during pregnancy) */
  month?: number;
  /** 0..1 progress across the whole tracked arc (conception → 24 months) */
  progress: number;
}

/**
 * Compute the current position from `dueDate`.
 *
 * The `dueDate` field is the pivot: it is the estimated due date during
 * pregnancy, and doubles as the birth date once the child has arrived
 * (onboarding stores the birth date here when the baby is already born).
 * Pregnancy stage = 40 − weeks-remaining; after birth = months since birth.
 */
export function computePosition(dueDate: Date, now: Date = new Date()): JourneyPosition {
  const diffDays = (dueDate.getTime() - now.getTime()) / MS_PER_DAY;

  if (diffDays > 0) {
    // Still expecting. Gestational age in days (40 weeks = 280 days to the due
    // date), split into completed weeks + days for an accurate "X weeks and Y
    // days" reading.
    const termDays = TERM_WEEKS * DAYS_PER_WEEK;
    const gaDays = clamp(Math.round(termDays - diffDays), 0, termDays);
    const week = clamp(Math.floor(gaDays / DAYS_PER_WEEK), 1, TERM_WEEKS);
    const dayInWeek = gaDays % DAYS_PER_WEEK;
    const stage = stageBySlug(`week-${week}`) ?? STAGES[0];
    return {
      stage,
      born: false,
      week,
      dayInWeek,
      daysToGo: Math.max(0, Math.ceil(diffDays)),
      progress: clamp(gaDays / (termDays + 24 * DAYS_PER_MONTH), 0, 1),
    };
  }

  // The child has arrived.
  const daysSince = -diffDays;
  const month = clamp(Math.floor(daysSince / DAYS_PER_MONTH), 0, 24);
  const stage = stageBySlug(`month-${month}`) ?? STAGES[STAGES.length - 1];
  const totalArc = TERM_WEEKS * DAYS_PER_WEEK + 24 * DAYS_PER_MONTH;
  const elapsed = TERM_WEEKS * DAYS_PER_WEEK + daysSince;
  return {
    stage,
    born: true,
    month,
    daysToGo: 0,
    progress: clamp(elapsed / totalArc, 0, 1),
  };
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, n));
}

/** "24 weeks and 3 days" — the natural pregnancy reading. */
export function gestationLabel(week: number, dayInWeek: number): string {
  const w = `${week} week${week === 1 ? "" : "s"}`;
  if (!dayInWeek) return w;
  return `${w} and ${dayInWeek} day${dayInWeek === 1 ? "" : "s"}`;
}
