"use client";

import { useState, useTransition } from "react";
import { letThemIn, letThemOut } from "@/app/appointments/event-actions";

export interface Housemate {
  userId: string;
  name: string;
}

/**
 * Who else is in on this surprise.
 *
 * ── The one thing this screen must get right ─────────────────────────────
 * It lists everybody in this journey. The person the day is for is somewhere
 * in that list, and the app has no way of knowing which one they are — so
 * nobody is picked for you, and adding somebody is always a deliberate tap on
 * a name. A "select all" here would be a button whose only possible purpose
 * is to ruin the surprise, so there is not one.
 *
 * ── Why the ones already in are shown plainly ────────────────────────────
 * So that the question "who knows?" has an answer on the screen rather than
 * in somebody's memory. That is the question you actually ask yourself before
 * mentioning it at breakfast.
 */
export function InOnIt({
  eventId,
  mine,
  housemates,
  creatorId,
  creatorName,
}: {
  eventId: string;
  /** Ids already in on it, not counting whoever thought of it. */
  mine: string[];
  housemates: Housemate[];
  creatorId: string;
  creatorName: string;
}) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, start] = useTransition();

  const inOn = housemates.filter((h) => mine.includes(h.userId));
  const rest = housemates.filter(
    (h) => !mine.includes(h.userId) && h.userId !== creatorId,
  );

  function run(fn: () => Promise<{ ok: true } | { ok: false; error: string }>) {
    setError(null);
    start(async () => {
      const r = await fn();
      if (!r.ok) setError(r.error);
    });
  }

  return (
    <div className="mt-2">
      <p className="font-mono text-[0.66rem] text-muted">
        In on it: {creatorName}
        {inOn.length > 0 && `, ${inOn.map((h) => h.name).join(", ")}`}
      </p>

      {open ? (
        <div className="mt-2 rounded-lg border border-line p-3">
          {inOn.length > 0 && (
            <ul className="mb-3 space-y-1.5">
              {inOn.map((h) => (
                <li key={h.userId} className="flex items-center justify-between gap-3">
                  <span className="prose-serif-xs">{h.name}</span>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => run(() => letThemOut(eventId, h.userId))}
                    className="font-mono text-[0.62rem] text-muted underline underline-offset-4 hover:text-fg disabled:opacity-40"
                  >
                    Take them out
                  </button>
                </li>
              ))}
            </ul>
          )}

          {rest.length === 0 ? (
            <p className="prose-serif-xs text-muted">
              Everybody else in the circle is already in on it.
            </p>
          ) : (
            <>
              <p className="mb-2 font-mono text-[0.62rem] uppercase tracking-widest text-muted">
                Ask somebody to help
              </p>
              <ul className="space-y-1.5">
                {rest.map((h) => (
                  <li key={h.userId} className="flex items-center justify-between gap-3">
                    <span className="prose-serif-xs">{h.name}</span>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => run(() => letThemIn(eventId, h.userId))}
                      className="min-h-9 rounded-lg border border-line px-3 font-mono text-[0.62rem] text-muted transition-colors hover:border-accent/50 hover:text-fg disabled:opacity-40"
                    >
                      Let them in
                    </button>
                  </li>
                ))}
              </ul>
              <p className="mt-3 font-mono text-[0.6rem] leading-relaxed text-muted/80">
                They are told, and nobody else is. Whoever the day is for is in
                this list too &mdash; so nobody is chosen for you.
              </p>
            </>
          )}

          {error && (
            <p className="mt-2 font-mono text-[0.62rem] text-accent2" role="alert">
              {error}
            </p>
          )}
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="mt-3 font-mono text-[0.62rem] text-muted underline underline-offset-4"
          >
            Done
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-1 font-mono text-[0.62rem] text-accent underline underline-offset-4"
        >
          {inOn.length > 0 ? "Who is in on it" : "Plan it with somebody"}
        </button>
      )}
    </div>
  );
}
