import Link from "next/link";
import { logAccess } from "@/lib/health-log-db";
import { readingsBetween, todayAtAGlance } from "@/lib/health-log-view";
import { dayIn } from "@/lib/health-log";

/**
 * The health log, one tap from home — for the two of them, and only once
 * they have started using it or have something to watch (a reading today).
 * Shows today's glucose and blood pressure at a glance, anything urgent
 * from the last day, and a button that opens the sheet ready to type.
 */
export async function HealthLogStrip({ userId, journeyId }: { userId: string; journeyId: string }) {
  const a = await logAccess(userId, journeyId);
  if (!a) return null;
  const now = new Date();
  const views = await readingsBetween(a, new Date(now.getTime() - 30 * 86_400_000), now);
  if (views.length === 0) {
    return (
      <Link href="/health/log?add=GLUCOSE" className="flex min-h-12 items-center justify-between gap-3 rounded-2xl border border-border bg-surface px-4 py-3 hover:border-accent">
        <span className="prose-serif-xs text-ink">
          Checking glucose or blood pressure at home? <span className="text-muted">Keep it in the health log for your doctor.</span>
        </span>
        <span className="shrink-0 font-mono text-xs text-accent">Start →</span>
      </Link>
    );
  }
  const t = todayAtAGlance(views, dayIn(now, a.timeZone));
  const urgent = views.some((v) => v.level === "urgent" && now.getTime() - new Date(v.takenAt).getTime() < 24 * 3600_000);
  // Glucose is the reading taken most often; the sheet guesses the slot
  // from the clock, and every other kind is one tap away inside it.
  const next = "GLUCOSE";
  const cells: [string, { main: string; level: string } | null][] = [
    ["Fasting", t.glucose.FASTING],
    ["BP", t.bp.MORNING ?? t.bp.EVENING],
  ];
  return (
    <section className={`rounded-2xl border px-4 py-3 ${urgent ? "border-negative/60 bg-negative/[0.06]" : "border-border bg-surface"}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/health/log" className="min-w-0">
          <span className="block font-mono text-[0.6rem] uppercase tracking-widest text-muted">Health log · today</span>
          <span className="block font-serif text-base text-ink">
            {cells.map(([l, c], i) => (
              <span key={l}>
                {i > 0 && <span className="text-muted"> · </span>}
                {l} <span className={c?.level === "urgent" ? "text-negative" : c?.level === "high" || c?.level === "low" ? "text-accent" : ""}>{c ? c.main : "—"}</span>
              </span>
            ))}
          </span>
          {urgent && <span className="block font-mono text-[0.62rem] text-negative">‼ An urgent sign in the last day — open the log</span>}
        </Link>
        <Link href={`/health/log?add=${next}`} className="inline-flex min-h-11 shrink-0 items-center rounded-lg bg-accent px-4 font-mono text-xs font-medium text-on-accent hover:bg-accent-deep">
          + Log a reading
        </Link>
      </div>
    </section>
  );
}
