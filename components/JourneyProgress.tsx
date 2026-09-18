import Link from "next/link";

/**
 * A quiet progress bar across the whole arc: conception → 24 months.
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
      <div className="mt-1.5 flex justify-between font-mono text-[0.62rem] uppercase tracking-widest text-muted">
        <span>Conception</span>
        <span>Birth</span>
        <span>2 years</span>
      </div>
    </div>
  );
}
