/**
 * The day's and the stage's words, in the reader's own voice.
 *
 * Every page, email and morning note that shows a verse, a prayer point, a
 * daily devotion, a partner's nudge or a lament asks here instead of reading
 * the faith-voiced original directly. For the faith voice the answer IS the
 * original, untouched — same object, same rotation, same day. For the general
 * voice it is the matching piece from lib/general/, written for the same
 * moment. See lib/voice.ts for the rules.
 *
 * ── One shape, two voices ────────────────────────────────────────────────
 * Callers render a `verse` in big serif with a small `ref` under it. In the
 * general voice the "verse" is a short line of encouragement and the "ref"
 * is its theme ("On rest") — so a page needs no second layout, and nobody
 * reading it sees a Bible reference that is not there.
 */
import { STAGES, type Stage } from "@/lib/journey";
import { dailyDevotion, type Devotion } from "@/lib/daily";
import { dailyLament, type Lament } from "@/lib/lament";
import { partnerDailyCare, type CareNudge } from "@/lib/partner-care";
import { dailyWalk, weeklyWalk, type WalkStage, type WalkPractice } from "@/lib/accountability";
import { isGeneral } from "@/lib/voice";
import type { GeneralStage } from "@/lib/general/types";
import { GENERAL_WEEKS_1_20 } from "@/lib/general/stages-weeks-1-20";
import { GENERAL_WEEKS_21_40 } from "@/lib/general/stages-weeks-21-40";
import { GENERAL_MONTHS } from "@/lib/general/stages-months";
import { GENERAL_DAILY } from "@/lib/general/daily";
import { GENERAL_PREGNANCY_CARE, GENERAL_INFANCY_CARE } from "@/lib/general/partner-care";
import { GENERAL_GRIEF } from "@/lib/general/grief";
import { GENERAL_CIRCLE_DAILY, GENERAL_CIRCLE_WEEKLY } from "@/lib/general/circle";

const GENERAL_STAGES: Record<string, GeneralStage> = {
  ...GENERAL_WEEKS_1_20,
  ...GENERAL_WEEKS_21_40,
  ...GENERAL_MONTHS,
};

/**
 * A stage in the reader's voice. Same shape as the original so every caller
 * renders it unchanged; in the general voice `verse.ref` is empty, because
 * there is no reference to give, and `prayerPoint` carries the stage's hope.
 */
export function stageIn(stage: Stage, voice: string | null | undefined): Stage {
  if (!isGeneral(voice)) return stage;
  const g = GENERAL_STAGES[stage.stage];
  // Every stage has a general version (scripts/verify-voice.mjs proves it);
  // this fallback only keeps a page standing if one were ever missing, and
  // even then it never shows the faith words — it shows the facts alone.
  if (!g) {
    return {
      ...stage,
      verse: { text: stage.newThisStage, ref: "" },
      reflection: "",
      partnerFocus: "",
      prayerPoint: "",
    };
  }
  return {
    ...stage,
    title: g.title ?? stage.title,
    body: g.body,
    verse: { text: g.thought, ref: "" },
    reflection: g.reflection,
    newThisStage: g.newThisStage ?? stage.newThisStage,
    action: g.action,
    partnerFocus: g.partnerFocus,
    prayerPoint: g.hope,
  };
}

/** Every stage has a general version — used by the verify script. */
export function generalStageMissing(): string[] {
  return STAGES.filter((s) => !GENERAL_STAGES[s.stage]).map((s) => s.stage);
}

function dayNumber(date: Date): number {
  return Math.floor(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) / 86_400_000,
  );
}

/** The day's word: the verse and its reflection, or the general word and its theme. */
export function dailyWordIn(voice: string | null | undefined, date: Date = new Date()): Devotion {
  if (!isGeneral(voice)) return dailyDevotion(date);
  const g = GENERAL_DAILY[dayNumber(date) % GENERAL_DAILY.length];
  return { text: g.text, ref: g.theme, reflection: g.reflection };
}

/** The morning's word after a loss. */
export function griefWordIn(voice: string | null | undefined, date: Date = new Date()): Lament {
  if (!isGeneral(voice)) return dailyLament(date);
  const g = GENERAL_GRIEF[dayNumber(date) % GENERAL_GRIEF.length];
  return { text: g.text, ref: g.theme, reflection: g.reflection };
}

/**
 * The partner's one thing today. The general lists are the same length and
 * order as the originals, so the rotation lands on the same day's act in
 * either voice — and the page and the notification still agree.
 */
export function partnerCareIn(
  voice: string | null | undefined,
  phase: "pregnancy" | "infancy",
  key: number,
  offset = 0,
): CareNudge {
  if (!isGeneral(voice)) return partnerDailyCare(phase, key, offset);
  const pool = phase === "infancy" ? GENERAL_INFANCY_CARE : GENERAL_PREGNANCY_CARE;
  const i = (((key + offset) % pool.length) + pool.length) % pool.length;
  return pool[i];
}

/** The circle's practice for today, with `verse` carrying the why in the general voice. */
export function circleDailyIn(
  voice: string | null | undefined,
  stage: WalkStage,
  date: Date = new Date(),
): WalkPractice {
  if (!isGeneral(voice)) return dailyWalk(stage, date);
  const list = GENERAL_CIRCLE_DAILY[stage];
  const p = list[dayNumber(date) % list.length];
  return { text: p.text, verse: { text: p.why, ref: "" } };
}

/** The circle's bigger focus for this week. */
export function circleWeeklyIn(
  voice: string | null | undefined,
  stage: WalkStage,
  date: Date = new Date(),
): WalkPractice {
  if (!isGeneral(voice)) return weeklyWalk(stage, date);
  const list = GENERAL_CIRCLE_WEEKLY[stage];
  const p = list[Math.floor(dayNumber(date) / 7) % list.length];
  return { text: p.text, verse: { text: p.why, ref: "" } };
}
