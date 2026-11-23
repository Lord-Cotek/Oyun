import Link from "next/link";

/**
 * Scripture Journey, in a few lines on the Worship page — the plan, today's
 * chapter and how far along — with the way through to its own page.
 *
 * ── Why the journey has its own page now ─────────────────────────────────
 * It used to sit in full under the prayer list, and a family that prays for
 * many people pushed their own Bible reading half a screen down every day.
 * The reading, the reflections on it and the journal are a room of their
 * own (app/scripture); this card keeps it one tap from the altar, placed
 * straight after the day's liturgy so nothing above it can grow.
 */
export function ScriptureCard({
  plan,
  nextRef,
  pct,
  done,
  total,
  readToday,
  finished,
  reflections,
}: {
  /** The plan being followed, or null before one is chosen. */
  plan: string | null;
  nextRef: string | null;
  pct: number;
  done: number;
  total: number;
  readToday: boolean;
  finished: boolean;
  /** How many reflections the reader has in the journal. */
  reflections: number;
}) {
  return (
    <section aria-labelledby="scripture-card" className="rounded-2xl border border-border bg-surface p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="eyebrow text-muted">Scripture Journey</p>
          <h2 id="scripture-card" className="mt-1 font-serif text-xl leading-tight text-ink">
            {!plan
              ? "Choose a reading plan"
              : finished
                ? "Plan complete"
                : readToday
                  ? "Read today"
                  : nextRef ?? "Today’s reading"}
          </h2>
          <p className="mt-0.5 prose-serif-xs text-muted">
            {!plan
              ? "Walk through the Bible a chapter a day — alone, or together."
              : finished
                ? `You finished ${plan}. Start another whenever you are ready.`
                : readToday
                  ? `${plan} · next: ${nextRef ?? "—"}`
                  : plan}
          </p>
        </div>
        {plan && !finished && (
          <span className="shrink-0 font-mono text-xs text-muted">
            {done}/{total}
          </span>
        )}
      </div>
      {plan && (
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-border" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Progress through the plan">
          <div className="h-full rounded-full bg-accent" style={{ width: `${Math.min(100, Math.max(0, pct))}%` }} />
        </div>
      )}
      <div className="mt-4 flex flex-wrap gap-2">
        <Link href="/scripture" className="inline-flex min-h-11 items-center rounded-lg bg-accent px-4 font-mono text-xs font-medium text-on-accent hover:bg-accent-deep">
          {!plan ? "Choose a plan →" : readToday || finished ? "Open Scripture →" : "Continue reading →"}
        </Link>
        <Link href="/journal" className="inline-flex min-h-11 items-center rounded-lg border border-border px-4 font-mono text-xs text-ink hover:border-accent">
          Reflection journal{reflections > 0 ? ` (${reflections})` : ""} →
        </Link>
      </div>
    </section>
  );
}
