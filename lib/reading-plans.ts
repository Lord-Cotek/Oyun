/**
 * Scripture reading plans — the "Scripture Journey" a family chooses and walks
 * through over months and years, one reading at a time. Unlike the daily
 * liturgy (which meditates on a single verse), a plan moves FORWARD through the
 * Bible and has a finish line.
 *
 * Progress advances by COMPLETION, never by the calendar: a family that misses
 * a week doesn't skip Scripture — the plan simply waits. However many years it
 * takes, they finish the whole thing.
 */
import { BOOKS, bookBySlug, chapterRef } from "./bible";

export interface Reading {
  slug: string;
  chapter: number;
}

export interface ReadingPlan {
  id: string;
  title: string;
  blurb: string;
  scope: string;
  readings: Reading[];
}

function chaptersOf(slugs: string[]): Reading[] {
  const out: Reading[] = [];
  for (const slug of slugs) {
    const book = bookBySlug(slug);
    if (!book) continue;
    for (let c = 1; c <= book.chapters; c++) out.push({ slug, chapter: c });
  }
  return out;
}

function allChapters(testament?: "OT" | "NT"): Reading[] {
  return chaptersOf(
    BOOKS.filter((b) => !testament || b.testament === testament).map(
      (b) => b.slug,
    ),
  );
}

export const READING_PLANS: ReadingPlan[] = [
  {
    id: "gospels",
    title: "The Gospels",
    blurb:
      "The life of Jesus, told four ways — Matthew, Mark, Luke, and John. The gentlest place to begin, and the heart of everything.",
    scope: "Matthew → John",
    readings: chaptersOf(["matthew", "mark", "luke", "john"]),
  },
  {
    id: "luke-acts",
    title: "Luke & Acts",
    blurb:
      "One unbroken story from the birth of Christ to the birth of the Church — Luke's Gospel flowing straight into Acts.",
    scope: "Luke → Acts",
    readings: chaptersOf(["luke", "acts"]),
  },
  {
    id: "psalms-proverbs",
    title: "Psalms & Proverbs",
    blurb:
      "The prayer book and the wisdom book of God's people — comfort for the heart and wisdom for the day, side by side.",
    scope: "Psalms → Proverbs",
    readings: chaptersOf(["psalms", "proverbs"]),
  },
  {
    id: "new-testament",
    title: "The New Testament",
    blurb:
      "From the Gospels through the letters to Revelation — the whole story of Christ and His Church.",
    scope: "Matthew → Revelation",
    readings: allChapters("NT"),
  },
  {
    id: "whole-bible",
    title: "The Whole Story",
    blurb:
      "The entire Bible, Genesis to Revelation, a chapter at a time. The pilgrimage of a lifetime — read together, it can shape a whole family.",
    scope: "Genesis → Revelation",
    readings: allChapters(),
  },
];

export function planById(id: string | null | undefined): ReadingPlan | undefined {
  if (!id) return undefined;
  return READING_PLANS.find((p) => p.id === id);
}

export interface PlanState {
  plan: ReadingPlan;
  total: number;
  done: number;
  pct: number;
  finished: boolean;
  /** The next unread reading, or null when the plan is complete. */
  next: Reading | null;
  nextRef: string | null;
}

export function planState(plan: ReadingPlan, progress: number): PlanState {
  const total = plan.readings.length;
  const done = Math.max(0, Math.min(progress, total));
  const finished = done >= total;
  const next = finished ? null : plan.readings[done];
  return {
    plan,
    total,
    done,
    pct: total ? Math.round((done / total) * 100) : 0,
    finished,
    next,
    nextRef: next ? chapterRef(next.slug, next.chapter) : null,
  };
}

/** A gentle, non-guilt estimate of how long a plan takes at a few reads a week. */
export function planPace(total: number): string {
  const perWeek = 4;
  const weeks = total / perWeek;
  if (weeks <= 6) return "a few weeks";
  const months = weeks / 4.33;
  if (months < 18) return `about ${Math.round(months)} months`;
  const years = months / 12;
  return years < 2.2 ? "about 2 years" : `about ${Math.round(years)} years`;
}
