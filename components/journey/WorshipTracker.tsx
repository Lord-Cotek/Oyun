"use client";

import { useTransition } from "react";
import { markWorship } from "@/app/worship/actions";

export function WorshipTracker({
  doneToday,
  streak,
  last7,
}: {
  doneToday: boolean;
  streak: number;
  last7: number;
}) {
  const [pending, start] = useTransition();

  return (
    <div className="flex flex-wrap items-center gap-4">
      <button
        type="button"
        disabled={pending}
        onClick={() => start(() => markWorship())}
        title={doneToday ? "Tap to undo" : undefined}
        className={`flex items-center gap-2 rounded-lg border px-4 py-2 font-mono text-xs transition-colors disabled:opacity-50 ${
          doneToday
            ? "border-accent/50 bg-accent/10 text-accent"
            : "border-border text-ink hover:border-accent hover:text-accent"
        }`}
      >
        {doneToday ? (
          <>
            <CheckIcon /> We worshipped today
          </>
        ) : (
          "We worshipped today"
        )}
      </button>
      <div className="flex items-center gap-3">
        <span className="font-serif text-2xl leading-none text-accent">{streak}</span>
        <span className="font-mono text-[0.68rem] uppercase tracking-widest text-muted">
          day{streak === 1 ? "" : "s"} in a row
          {last7 > 0 ? ` · ${last7}/7 this week` : ""}
        </span>
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}
