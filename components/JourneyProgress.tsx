import Link from "next/link";
import { BIRTH_AT } from "@/lib/stage";

/**
 * A quiet progress bar across the whole arc: conception → birth → 24 months.
 * Pregnancy fills the first half and the two years after it the second, so
 * the birth is the middle of the line — lib/stage.ts says why.
 *
 * `href` turns the heading into the way through to the record of every stage
 * so far. It stayed unlinked for a long time while there was nothing behind
 * it; the bar itself is deliberately not the target, because a progress bar
 * that can be tapped invites being tapped to change something.
 */
export function JourneyProgress({
  progress,
  label,
  href,
}: {
  progress: number;
  label: string;
  /** Where "The whole journey" leads. Plain text when there is nowhere. */
  href?: string;
}) {
  const pct = Math.round(Math.min(1, Math.max(0, progress)) * 100);
  const birthPct = BIRTH_AT * 100;
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        {href ? (
          <Link
            href={href}
            className="eyebrow text-accent underline-offset-4 hover:underline"
          >
            The whole journey →
          </Link>
        ) : (
          <p className="eyebrow text-muted">The whole journey</p>
        )}
        <p className="font-mono text-xs text-muted">{label}</p>
      </div>
      {/* The mark and the word "Birth" are both placed at BIRTH_AT, the same
          number the line's length is worked out from (lib/stage.ts), so the
          three can never drift apart again. */}
      <div className="relative">
        <div
          className="h-1.5 w-full overflow-hidden rounded-full bg-border"
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full rounded-full bg-accent transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
        <span
          aria-hidden
          className={`absolute top-1/2 h-3 w-0.5 -translate-x-1/2 -translate-y-1/2 rounded-full ${pct >= birthPct ? "bg-accent" : "bg-muted/60"}`}
          style={{ left: `${birthPct}%` }}
        />
      </div>
      <div className="relative mt-1.5 flex justify-between font-mono text-[0.62rem] uppercase tracking-widest text-muted">
        <span>Conception</span>
        {/* Placed by position, not by spacing: between two labels of
            different widths, "space-between" sat it off-centre. */}
        <span className="absolute -translate-x-1/2" style={{ left: `${birthPct}%` }}>
          Birth
        </span>
        <span>2 years</span>
      </div>
    </div>
  );
}
