import { AnimatedNumber } from "@/components/ui/AnimatedNumber";

/**
 * A compact stat — a big serif number that counts up, a label, and a hint —
 * sized to sit three-across on a phone. Denser than StatCard, for the
 * dashboard header row. A numeric value animates; pass a node to render as-is.
 *
 * The number used to come in one of six category colours. A row of three stats
 * in three different hues tells a reader nothing except that somebody had six
 * colours available — the figures are already distinguished by their labels.
 * One accent, and the row reads as one row.
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
    <div className="surface-premium rounded-2xl border border-border px-4 py-3.5 transition-colors hover:border-accent/50">
      <p className="font-serif text-3xl leading-none text-accent">
        {typeof value === "number" ? <AnimatedNumber value={value} /> : value}
      </p>
      <p className="mt-2 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-ink">
        {label}
      </p>
      {hint && (
        <p className="mt-0.5 font-mono text-[0.6rem] leading-tight text-muted">
          {hint}
        </p>
      )}
    </div>
  );
}
