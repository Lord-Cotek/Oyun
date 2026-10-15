import { type ReactNode } from "react";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";

/**
 * A compact figure — a serif number that counts up, a label, and a hint.
 *
 * These were three cards in a row: three borders, three surfaces, three
 * shadows, for three small numbers. That is a lot of furniture around "3
 * praying with you", and on a screen that now carries a photograph, two bands
 * and four filled tiles, it was the row that made the page feel padded.
 *
 * So they stopped being cards. Three figures set on the paper itself, divided
 * by a hairline — which is how a figure is set in a book, and this app is much
 * closer to a book than to a dashboard. Nothing is lost: the numbers are the
 * same size and they read better without a box each.
 *
 * (The number used to come in one of six category colours. A row of three
 * stats in three different hues tells a reader nothing except that somebody
 * had six colours available. One accent, and the row reads as one row.)
 */
export function StatPill({
  label,
  value,
  hint,
}: {
  label: string;
  value: number | string;
  hint?: string;
}) {
  return (
    <div className="flex-1 px-3 first:pl-0 last:pr-0">
      <p className="font-serif text-[1.7rem] leading-none text-accent">
        {typeof value === "number" ? <AnimatedNumber value={value} /> : value}
      </p>
      <p className="mt-1 font-serif text-[0.82rem] leading-tight text-ink/70">
        {label}
        {hint && <span className="block italic opacity-70">{hint}</span>}
      </p>
    </div>
  );
}

/**
 * The row they sit in.
 *
 * Exported alongside because the hairlines belong to the row, not to the
 * figure: a divider drawn by the child is a divider that turns up before the
 * first one or after the last one the moment somebody reorders them.
 */
export function StatRow({ children }: { children: ReactNode }) {
  return <div className="flex divide-x divide-border">{children}</div>;
}
