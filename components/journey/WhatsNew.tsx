import type { StageDiff } from "@/lib/stage-diff";
import type { BabyWords } from "@/lib/babies";

/**
 * What is new this stage, and what it is new compared to.
 *
 * The card above says where the journey has got to. This says what moved.
 * Laid out as then-above-now on purpose: reading downwards is reading
 * forwards, and the older line is set back in muted text so the eye lands on
 * the current one first and takes the comparison second.
 *
 * `bw` carries the grammar for one baby or four — see lib/babies.ts.
 */
export function WhatsNew({
  diff,
  bw,
}: {
  diff: StageDiff;
  bw: BabyWords;
}) {
  const hasSizes = diff.sizeThen && diff.sizeNow;

  return (
    <section
      aria-label="What is new this stage"
      className="rounded-2xl border border-border bg-surface p-6"
    >
      <p className="eyebrow mb-4 text-muted">What is new</p>

      {diff.then && (
        <div className="mb-4 border-l-2 border-border pl-4">
          <p className="mb-1 font-mono text-[0.62rem] uppercase tracking-widest text-muted">
            {diff.thenLabel}
          </p>
          <p className="prose-serif-sm text-muted">{diff.then}</p>
        </div>
      )}

      <div className={diff.then ? "border-l-2 border-accent pl-4" : ""}>
        {diff.then && (
          <p className="mb-1 font-mono text-[0.62rem] uppercase tracking-widest text-accent">
            Now
          </p>
        )}
        <p className="font-serif text-lg leading-snug text-ink">{diff.now}</p>
      </div>

      {hasSizes && (
        <p className="mt-4 border-t border-border pt-3 prose-serif-xs text-muted">
          {/* The size change is the one part of this that is a measurement
              rather than a description, so it is set apart from the prose. */}
          {bw.subject} {bw.plural ? "have" : "has"} {bw.each}grown from about
          the size of {diff.sizeThen} to about the size of {diff.sizeNow}.
        </p>
      )}
    </section>
  );
}
