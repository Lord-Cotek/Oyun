/** A quiet progress bar across the whole arc: conception → 24 months. */
export function JourneyProgress({
  progress,
  label,
}: {
  progress: number;
  label: string;
}) {
  const pct = Math.round(Math.min(1, Math.max(0, progress)) * 100);
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <p className="eyebrow text-muted">The whole journey</p>
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
