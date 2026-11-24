"use client";

import { useEffect, useState } from "react";

/**
 * Count with me — a tap for each movement felt, and a clock beside it.
 *
 * It fills in the two boxes the movements entry already has: how many, over
 * how many minutes. There is deliberately no number to reach and no "that is
 * enough": health services do not agree on one, and what matters is a change
 * from what is usual for this baby — which is what the tick box below it is
 * for. Nothing is saved until she saves the entry as she always did.
 */
export function MovementCounter({ onDone }: { onDone: (count: number, minutes: number) => void }) {
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [count, setCount] = useState(0);
  const [now, setNow] = useState(0);

  useEffect(() => {
    if (startedAt === null) return;
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [startedAt]);

  if (startedAt === null) {
    return (
      <button
        type="button"
        onClick={() => {
          setCount(0);
          setStartedAt(Date.now());
        }}
        className="inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-accent/60 px-4 font-mono text-xs text-accent hover:bg-accent/[0.06]"
      >
        Count with me
      </button>
    );
  }

  const sec = Math.max(0, Math.round((now - startedAt) / 1000));
  const clock = `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;

  return (
    <div className="rounded-xl border border-accent/40 bg-accent/[0.05] p-3">
      <div className="flex items-baseline justify-between gap-3">
        <p className="font-serif text-3xl tabular-nums text-ink" aria-live="polite" data-testid="move-count">
          {count}
        </p>
        <p className="font-mono text-sm tabular-nums text-muted" data-testid="move-clock">
          {clock}
        </p>
      </div>
      <button
        type="button"
        onClick={() => setCount((c) => c + 1)}
        className="mt-2 inline-flex min-h-[4rem] w-full items-center justify-center rounded-xl bg-accent px-4 font-serif text-lg text-on-accent"
      >
        Felt one
      </button>
      <div className="mt-2 flex items-center justify-between gap-3 font-mono text-[0.62rem] uppercase tracking-widest text-muted">
        <button
          type="button"
          onClick={() => {
            onDone(count, Math.max(1, Math.round(sec / 60)));
            setStartedAt(null);
          }}
          className="py-2 underline underline-offset-4 hover:text-accent"
        >
          Done — fill it in
        </button>
        <button type="button" onClick={() => setStartedAt(null)} className="py-2 underline underline-offset-4 hover:text-ink">
          Cancel
        </button>
      </div>
    </div>
  );
}
