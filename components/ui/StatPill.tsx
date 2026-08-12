import { type CSSProperties } from "react";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { type Tone } from "@/components/ui/ActionTile";

/**
 * A compact stat — a big serif number that counts up, a label, and a hint —
 * sized to sit three-across on a phone. Denser than StatCard, for the dashboard
 * header row. A numeric value animates; pass a node to render as-is.
 */
export function StatPill({
  label,
  value,
  hint,
  tone = "amber",
}: {
  label: string;
  value: number | string;
  hint?: string;
  tone?: Tone;
}) {
  return (
    <div
      style={{ ["--tone" as string]: `var(--tone-${tone})` } as CSSProperties}
      className="rounded-2xl border border-border bg-surface px-4 py-3.5 transition-colors hover:border-[color-mix(in_srgb,var(--tone)_45%,transparent)]"
    >
      <p className="font-serif text-3xl leading-none text-[var(--tone)]">
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
