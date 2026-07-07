import { Mood } from "@prisma/client";

export const MOOD_ORDER: Mood[] = [
  Mood.HEAVY,
  Mood.LOW,
  Mood.STEADY,
  Mood.BRIGHT,
  Mood.RADIANT,
];

export const MOOD_META: Record<
  Mood,
  { label: string; value: number; tone: "negative" | "accent2" | "muted" | "accent" | "positive"; blurb: string }
> = {
  HEAVY: { label: "Heavy", value: 1, tone: "negative", blurb: "A hard day. Carried anyway." },
  LOW: { label: "Low", value: 2, tone: "accent2", blurb: "Tender and tired." },
  STEADY: { label: "Steady", value: 3, tone: "muted", blurb: "Holding, quiet." },
  BRIGHT: { label: "Bright", value: 4, tone: "accent", blurb: "Grateful today." },
  RADIANT: { label: "Radiant", value: 5, tone: "positive", blurb: "Full of joy." },
};

export function moodValue(m: Mood): number {
  return MOOD_META[m].value;
}
