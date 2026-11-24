"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ConfirmButton } from "@/components/ui/Confirm";
import { addBabyLog, clearBabyLog, removeBabyLog } from "@/app/health/after/actions";
import {
  FEED_HOWS,
  HOW_LABEL,
  KIND_LABEL,
  LOG_EXPECT,
  ago,
  countBetween,
  lastFeed,
  type FeedHow,
  type LogEntry,
  type LogKind,
} from "@/lib/after-birth";

const DAY = 86_400_000;

/** Midnight today, on this phone. */
function startOfToday(now: number): number {
  const d = new Date(now);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

const localTime = (iso: string) => new Date(iso).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

/**
 * The baby's log — lib/after-birth.ts.
 *
 * One tap for a feed or a nappy, timed on the phone. Under the buttons:
 * today's counts, how long since the last feed and which side it was, and
 * the lines themselves. Days are the reader's own days, so everything that
 * depends on the clock is drawn once the page is on the phone.
 */
export function BabyLog({
  initial,
  babies,
}: {
  initial: LogEntry[];
  /** More than one only for twins and more; then each line is for one of them. */
  babies: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [entries, setEntries] = useState<LogEntry[]>(initial);
  const [now, setNow] = useState<number | null>(null);
  const [who, setWho] = useState<string | null>(babies.length > 1 ? babies[0].id : null);
  const [earlier, setEarlier] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [, start] = useTransition();

  const sig = JSON.stringify(initial);
  useEffect(() => setEntries(JSON.parse(sig) as LogEntry[]), [sig]);
  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(t);
  }, []);

  // With twins, the counts and the "last feed" are for the baby chosen.
  const mine = useMemo(() => (who ? entries.filter((e) => e.childId === who) : entries), [entries, who]);
  const today = now === null ? null : startOfToday(now);
  const counts = today === null ? null : countBetween(mine, today, today + DAY);
  const yesterday = today === null ? null : countBetween(mine, today - DAY, today);
  const last = lastFeed(mine);
  const shown = today === null ? [] : [...mine].filter((e) => new Date(e.at).getTime() >= today - DAY).sort((a, b) => (a.at < b.at ? 1 : -1));

  // "Last feed 2 h 10 min ago, left breast." The side matters: the next feed starts on the other.
  let lastText = "No feed written down yet.";
  if (now !== null && last) {
    const a = ago(now - new Date(last.at).getTime());
    const side = last.how === "LEFT" ? ", left breast" : last.how === "RIGHT" ? ", right breast" : last.how === "BOTTLE" ? ", bottle" : "";
    lastText = `Last feed ${a === "just now" ? a : `${a} ago`}${side}.`;
  }

  /** The moment to record: now, or the earlier time typed in (today, or yesterday if that would be ahead of now). */
  function when(): string {
    const at = new Date();
    if (earlier) {
      const [h, m] = earlier.split(":").map(Number);
      at.setHours(h, m, 0, 0);
      if (at.getTime() > Date.now() + 60_000) at.setTime(at.getTime() - DAY);
    }
    return at.toISOString();
  }

  function add(kind: LogKind, how: FeedHow | null) {
    setError(null);
    const at = when();
    const temp = `new-${at}-${kind}`;
    setEntries((xs) => [...xs, { id: temp, kind, how, childId: who, at }]);
    setEarlier("");
    start(async () => {
      const res = await addBabyLog({ kind, how, at, childId: who });
      if (!res.ok) {
        setError(res.error);
        setEntries((xs) => xs.filter((x) => x.id !== temp));
      } else {
        setEntries((xs) => xs.map((x) => (x.id === temp ? { ...x, id: res.id, at: res.at } : x)));
      }
      router.refresh();
    });
  }

  function remove(id: string) {
    setEntries((xs) => xs.filter((x) => x.id !== id));
    start(async () => {
      if (!id.startsWith("new-")) {
        const res = await removeBabyLog(id);
        if (!res.ok) setError(res.error);
      }
      router.refresh();
    });
  }

  const btn =
    "inline-flex min-h-[3.25rem] items-center justify-center rounded-xl border border-accent/60 px-3 text-center font-mono text-xs text-accent hover:bg-accent/[0.06]";
  const stat = "rounded-xl border border-border bg-bg/40 px-3 py-2.5 text-center";

  return (
    <div>
      {babies.length > 1 && (
        <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="Which baby">
          {babies.map((b) => (
            <button
              key={b.id}
              type="button"
              aria-pressed={who === b.id}
              onClick={() => setWho(b.id)}
              className={`inline-flex min-h-11 items-center rounded-full border px-4 font-mono text-xs ${
                who === b.id ? "border-accent bg-accent/[0.1] text-accent" : "border-border text-muted hover:border-accent hover:text-accent"
              }`}
            >
              {b.name}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-3 gap-2" data-testid="log-counts">
        <div className={stat}>
          <p className="font-serif text-2xl tabular-nums text-ink">{counts ? counts.feeds : "–"}</p>
          <p className="font-mono text-[0.58rem] uppercase tracking-widest text-muted">Feeds today</p>
        </div>
        <div className={stat}>
          <p className="font-serif text-2xl tabular-nums text-ink">{counts ? counts.wet : "–"}</p>
          <p className="font-mono text-[0.58rem] uppercase tracking-widest text-muted">Wet</p>
        </div>
        <div className={stat}>
          <p className="font-serif text-2xl tabular-nums text-ink">{counts ? counts.dirty : "–"}</p>
          <p className="font-mono text-[0.58rem] uppercase tracking-widest text-muted">Dirty</p>
        </div>
      </div>
      <p className="mt-2 prose-serif-xs text-muted" data-testid="log-last" aria-live="polite">
        {now === null ? " " : lastText}
        {yesterday && yesterday.feeds + yesterday.wet + yesterday.dirty > 0 && ` Yesterday: ${yesterday.feeds} feeds, ${yesterday.wet} wet, ${yesterday.dirty} dirty.`}
      </p>

      <div className="mt-4">
        <p className="mb-2 font-mono text-[0.62rem] uppercase tracking-widest text-muted">A feed</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {FEED_HOWS.map((h) => (
            <button key={h} type="button" onClick={() => add("FEED", h)} className={btn}>
              {HOW_LABEL[h]}
            </button>
          ))}
        </div>
        <p className="mb-2 mt-4 font-mono text-[0.62rem] uppercase tracking-widest text-muted">A nappy</p>
        <div className="grid grid-cols-2 gap-2">
          <button type="button" onClick={() => add("WET", null)} className={btn}>
            Wet
          </button>
          <button type="button" onClick={() => add("DIRTY", null)} className={btn}>
            Dirty
          </button>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <label htmlFor="log-earlier" className="prose-serif-xs text-muted">
            It was earlier, at
          </label>
          <input
            id="log-earlier"
            type="time"
            value={earlier}
            onChange={(e) => setEarlier(e.target.value)}
            className="rounded-lg border border-border bg-bg px-2 py-1.5 font-mono text-sm text-ink focus:border-accent focus:outline-none"
          />
          {earlier && (
            <button type="button" onClick={() => setEarlier("")} className="font-mono text-[0.62rem] uppercase tracking-widest text-muted underline underline-offset-4">
              Now instead
            </button>
          )}
        </div>
      </div>

      {error && <p className="mt-3 prose-serif-xs text-negative">{error}</p>}

      {shown.length > 0 && today !== null && (
        <div className="mt-5">
          <div className="mb-1 flex items-baseline justify-between gap-3">
            <p className="font-mono text-[0.62rem] uppercase tracking-widest text-muted">Today and yesterday</p>
            <ConfirmButton
              press="none"
              word="Clear the log"
              describe="every line in the baby's log"
              onConfirm={async () => {
                const res = await clearBabyLog();
                if (!res.ok) {
                  setError(res.error);
                  return { ok: false };
                }
                setEntries([]);
                router.refresh();
              }}
              className="py-2 font-mono text-[0.62rem] uppercase tracking-widest text-muted underline underline-offset-4 hover:text-negative"
            />
          </div>
          <ul className="overflow-hidden rounded-2xl border border-border bg-surface">
            {shown.map((e) => (
              <li key={e.id} className="flex items-center justify-between gap-3 border-b border-border/60 px-4 py-2 last:border-b-0">
                <span className="min-w-0 prose-serif-sm text-ink">
                  <span className="mr-2 font-mono text-xs tabular-nums text-muted">
                    {new Date(e.at).getTime() < today ? "Yesterday " : ""}
                    {localTime(e.at)}
                  </span>
                  {e.kind === "FEED" ? `Feed · ${HOW_LABEL[(e.how as FeedHow) ?? "BOTH"].toLowerCase()}` : KIND_LABEL[e.kind as LogKind]}
                </span>
                <button
                  type="button"
                  aria-label={`Remove the ${KIND_LABEL[e.kind as LogKind].toLowerCase()} at ${localTime(e.at)}`}
                  onClick={() => remove(e.id)}
                  className="-mr-2 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted hover:text-negative"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="mt-4 max-w-prose prose-serif-xs text-muted">{LOG_EXPECT}</p>
    </div>
  );
}
