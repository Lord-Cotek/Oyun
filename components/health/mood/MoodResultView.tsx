import Link from "next/link";
import { HELPLINE_DIRECTORY } from "@/lib/when-to-call";
import type { MoodResult } from "@/lib/mood-check";

/**
 * One mood-check result, in words — lib/mood-check.ts.
 *
 * The order is deliberate and is the same for every reader: anything urgent
 * first, then what her answers come to and what to do, then (with faith) the
 * line that asking for help is not a lack of faith, and last the door to her
 * circle. Help is never placed after encouragement.
 */
export function MoodResultView({ r }: { r: MoodResult }) {
  const tone = r.level === "clear" ? "border-border bg-surface" : "border-accent/50 bg-accent/[0.05]";
  return (
    <div className="space-y-4" data-testid="mood-result">
      {r.urgent && (
        <section className="rounded-2xl border border-negative/60 bg-negative/[0.05] p-5" aria-labelledby="mood-urgent">
          <p className="eyebrow mb-1 text-negative">Today</p>
          <h3 id="mood-urgent" className="font-serif text-xl text-ink">
            {r.urgent.title}
          </h3>
          <div className="mt-2 space-y-2">
            {r.urgent.body.map((b) => (
              <p key={b} className="max-w-prose prose-serif-sm text-ink">
                {b}
              </p>
            ))}
          </div>
          <p className="mt-3 prose-serif-xs text-ink/85">
            <Link href="/health/when-to-call" className="text-negative underline underline-offset-4">
              Who to call
            </Link>
            {" · "}Crisis lines for every country:{" "}
            <a href={HELPLINE_DIRECTORY.href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
              {HELPLINE_DIRECTORY.label}
            </a>
          </p>
        </section>
      )}

      <section className={`rounded-2xl border p-5 ${tone}`} aria-labelledby="mood-title">
        <h3 id="mood-title" className="font-serif text-xl text-ink">
          {r.title}
        </h3>
        <div className="mt-2 space-y-2">
          {r.body.map((b) => (
            <p key={b} className="max-w-prose prose-serif-sm text-ink/90">
              {b}
            </p>
          ))}
        </div>
        {r.faithLine && <p className="mt-3 max-w-prose border-t border-border/70 pt-3 prose-serif-sm text-ink/90">{r.faithLine}</p>}
        <p className="mt-3 font-mono text-[0.62rem] uppercase tracking-widest text-muted">{r.figures}</p>
        {r.level !== "clear" && (
          <p className="mt-3 prose-serif-xs">
            <Link href={r.room.href} className="text-accent underline underline-offset-4">
              {r.room.label}
            </Link>
          </p>
        )}
      </section>
    </div>
  );
}
