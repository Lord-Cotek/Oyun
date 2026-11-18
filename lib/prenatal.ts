/**
 * The tests checklist — the rules, with no database in sight. Which items
 * apply to this family, and where each one stands this week.
 */
import { SCHEDULE, type ScheduleItem, type Template } from "../data/prenatal-schedule";

export type Facts = { rhNegative: boolean; bothCarriers: boolean };

/** The items this family's schedule holds: their template, their switches, their facts. */
export function itemsFor(template: Template, conditions: string[], facts: Facts): ScheduleItem[] {
  return SCHEDULE.filter((i) => {
    if (!i.templates.includes(template)) return false;
    if (i.when?.condition) return conditions.includes(i.when.condition);
    if (i.when?.fact === "RH_NEGATIVE") return facts.rhNegative;
    if (i.when?.fact === "BOTH_CARRIERS") return facts.bothCarriers;
    return true;
  });
}

export type Stage = { born: false; week: number } | { born: true; weeksAfter: number };
export type Status = "done" | "due" | "upcoming" | "past" | "anytime";

/**
 * Where an item stands. "past" is gentle on purpose — its usual window has
 * gone by without it being marked done, which is a reason to ask the clinic,
 * not a failure.
 */
export function statusOf(item: { weeks?: [number, number] | null; afterBirth?: [number, number] | null }, stage: Stage, done: boolean): Status {
  if (done) return "done";
  const w = stage.born ? item.afterBirth : item.weeks;
  if (stage.born && item.weeks && !item.afterBirth) return "past";
  if (!stage.born && item.afterBirth && !item.weeks) return "upcoming";
  if (!w) return "anytime";
  const now = stage.born ? stage.weeksAfter : stage.week;
  if (now < w[0]) return "upcoming";
  if (now <= w[1]) return "due";
  return "past";
}

export const weeksLabel = (item: { weeks?: [number, number] | null; afterBirth?: [number, number] | null }) =>
  item.weeks ? `${item.weeks[0]}–${item.weeks[1]} weeks` : item.afterBirth ? `${item.afterBirth[0]}–${item.afterBirth[1]} weeks after birth` : "Any time";

/** Sort: due now, then coming, then past-window, then done; each by week. */
export function order(a: { status: Status; start: number }, b: { status: Status; start: number }) {
  const rank: Record<Status, number> = { due: 0, upcoming: 1, anytime: 2, past: 3, done: 4 };
  return rank[a.status] - rank[b.status] || a.start - b.start;
}
