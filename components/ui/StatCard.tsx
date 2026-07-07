import { type ReactNode } from "react";
import { Card } from "./Card";

type Tone = "positive" | "negative" | "accent" | "accent2" | "muted";

const toneClass: Record<Tone, string> = {
  positive: "text-positive",
  negative: "text-negative",
  accent: "text-accent",
  accent2: "text-accent2",
  muted: "text-muted",
};

/** Label + serif value + toned delta. */
export function StatCard({
  label,
  value,
  delta,
  deltaTone = "muted",
  hint,
}: {
  label: string;
  value: ReactNode;
  delta?: ReactNode;
  deltaTone?: Tone;
  hint?: string;
}) {
  return (
    <Card className="p-5">
      <p className="eyebrow mb-3">{label}</p>
      <p className="font-serif text-4xl leading-none text-ink">{value}</p>
      {delta !== undefined && (
        <p className={`mt-3 font-mono text-xs ${toneClass[deltaTone]}`}>
          {delta}
        </p>
      )}
      {hint && <p className="mt-2 font-mono text-xs text-muted">{hint}</p>}
    </Card>
  );
}
