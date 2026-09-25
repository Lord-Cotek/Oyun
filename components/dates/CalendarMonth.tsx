"use client";

import { useMemo, useRef } from "react";
import {
  WEEKDAYS,
  addMonths,
  monthGrid,
  monthLabel,
  monthStart,
  ymd,
} from "@/lib/calendar";

export type Marked = {
  /** yyyy-mm-dd in UTC. */
  key: string;
  /** Days this house wrote down itself. Drawn solid. */
  own: number;
  /** Days that came from somewhere else — another house, a clinic letter.
   *  Drawn hollow: different, not louder. */
  guest: number;
};

/**
 * A month you can look at and tap. Shared by both apps — see lib/calendar.ts
 * for why every date in it is UTC.
 *
 * ── Why it is always six rows ────────────────────────────────────────────
 * A month needs five rows or six depending on which weekday it opens on. A
 * grid that changes height as you page through the year makes the page jump
 * under your thumb and moves the button you were about to press. Six always,
 * with the spare days shown faintly.
 */
export function CalendarMonth({
  month,
  onMonthChange,
  marks,
  selected,
  onSelect,
}: {
  /** Midnight UTC on the first of the month being shown. */
  month: Date;
  onMonthChange: (next: Date) => void;
  marks: Map<string, Marked>;
  /** yyyy-mm-dd, or null when nothing is picked. */
  selected: string | null;
  onSelect: (key: string) => void;
}) {
  const cells = useMemo(() => monthGrid(month), [month]);
  const gridRef = useRef<HTMLDivElement>(null);
  const thisMonth = ymd(monthStart(new Date()));
  const showingThisMonth = ymd(month) === thisMonth;

  /**
   * Arrow keys walk the month the way a calendar should, and stepping off
   * either end turns the page rather than stopping dead.
   */
  function onKeyDown(e: React.KeyboardEvent, index: number) {
    const step =
      e.key === "ArrowRight" ? 1
      : e.key === "ArrowLeft" ? -1
      : e.key === "ArrowDown" ? 7
      : e.key === "ArrowUp" ? -7
      : 0;
    if (!step) return;
    e.preventDefault();
    const next = index + step;
    if (next < 0 || next > 41) {
      onMonthChange(addMonths(month, step > 0 ? 1 : -1));
      return;
    }
    const target = gridRef.current?.querySelectorAll("button")[next];
    (target as HTMLButtonElement | undefined)?.focus();
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => onMonthChange(addMonths(month, -1))}
          aria-label="The month before"
          className="rounded-lg border border-border px-3 py-2 font-mono text-sm text-muted transition-colors hover:border-accent hover:text-accent"
        >
          ‹
        </button>
        <p
          aria-live="polite"
          className="min-w-0 flex-1 text-center font-serif text-xl text-ink"
        >
          {monthLabel(month)}
        </p>
        <button
          type="button"
          onClick={() => onMonthChange(addMonths(month, 1))}
          aria-label="The month after"
          className="rounded-lg border border-border px-3 py-2 font-mono text-sm text-muted transition-colors hover:border-accent hover:text-accent"
        >
          ›
        </button>
      </div>

      {!showingThisMonth && (
        <div className="mt-2 text-center">
          <button
            type="button"
            onClick={() => {
              const now = new Date();
              onMonthChange(monthStart(now));
              onSelect(ymd(now));
            }}
            className="font-mono text-[0.68rem] text-accent underline underline-offset-4"
          >
            Back to today
          </button>
        </div>
      )}

      <div className="mt-4 grid grid-cols-7 gap-1">
        {WEEKDAYS.map((w) => (
          <div
            key={w}
            aria-hidden
            className="pb-1 text-center font-mono text-[0.58rem] uppercase tracking-widest text-muted"
          >
            {w.slice(0, 1)}
          </div>
        ))}
      </div>

      <div ref={gridRef} className="grid grid-cols-7 gap-1">
        {cells.map((c, i) => {
          const m = marks.get(c.key);
          const total = (m?.own ?? 0) + (m?.guest ?? 0);
          const isSelected = selected === c.key;
          const label = c.at.toLocaleDateString("en-GB", {
            weekday: "long",
            day: "numeric",
            month: "long",
            timeZone: "UTC",
          });
          return (
            <button
              key={c.key}
              type="button"
              onClick={() => onSelect(c.key)}
              onKeyDown={(e) => onKeyDown(e, i)}
              aria-pressed={isSelected}
              aria-label={
                total
                  ? `${label} — ${total} ${total === 1 ? "thing" : "things"} on`
                  : label
              }
              className={[
                "flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border text-center transition-colors",
                isSelected
                  ? "border-accent bg-accent/[0.14] text-ink"
                  : c.isToday
                    ? "border-accent/60 bg-bg text-ink"
                    : "border-transparent bg-bg/40 hover:border-border",
                c.inMonth ? "" : "opacity-35",
              ].join(" ")}
            >
              <span
                className={`font-mono text-sm leading-none tabular-nums ${
                  c.isToday && !isSelected ? "text-accent" : ""
                } ${c.inMonth ? "" : "text-muted"}`}
              >
                {c.dayOfMonth}
              </span>
              {/* One dot per thing up to three, then a count. A row of eleven
                  dots tells you less than the number eleven does. */}
              <span className="flex h-1.5 items-center gap-0.5" aria-hidden>
                {total === 0 ? null : total <= 3 ? (
                  <>
                    {Array.from({ length: m?.own ?? 0 }).map((_, k) => (
                      <i
                        key={`o${k}`}
                        className="block h-1.5 w-1.5 rounded-full bg-accent"
                      />
                    ))}
                    {Array.from({ length: m?.guest ?? 0 }).map((_, k) => (
                      <i
                        key={`g${k}`}
                        className="block h-1.5 w-1.5 rounded-full border border-accent/60"
                      />
                    ))}
                  </>
                ) : (
                  <i className="block font-mono text-[0.55rem] not-italic leading-none text-accent tabular-nums">
                    {total}
                  </i>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
