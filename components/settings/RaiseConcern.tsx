"use client";

import { useState, useTransition } from "react";
import { raiseConcern } from "@/app/settings/concern-actions";
import { CONCERN_KINDS, SAID_MAX } from "@/lib/concerns";

/**
 * A way to reach a person, from inside the app.
 *
 * ── Why it opens closed ──────────────────────────────────────────────────
 * Because most people will never need it, and a form sitting open in
 * Settings invites the idle "something is a bit odd" that buries the one
 * message that mattered. It is one line until somebody means it.
 *
 * ── Why the safety option is first ───────────────────────────────────────
 * The list is ordered by how badly somebody needs an answer, not by how often
 * each is picked. Whoever is frightened should find their words at the top.
 */
export function RaiseConcern() {
  const [open, setOpen] = useState(false);
  const [said, setSaid] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [left, setLeft] = useState(SAID_MAX);
  const [busy, start] = useTransition();

  if (said) {
    return (
      <p className="prose-serif-sm text-accent" role="status">
        {said}
      </p>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex min-h-11 items-center rounded-lg border border-line px-4 font-mono text-xs text-muted transition-colors hover:border-accent/50 hover:text-fg"
      >
        Write to us
      </button>
    );
  }

  return (
    <form
      action={(fd) => {
        setError(null);
        start(async () => {
          const r = await raiseConcern(fd);
          if (r.ok) setSaid(r.said);
          else setError(r.error);
        });
      }}
      className="space-y-4"
    >
      <fieldset>
        <legend className="mb-2 font-mono text-xs text-muted">
          What is this about?
        </legend>
        <div className="space-y-2">
          {CONCERN_KINDS.map((k, i) => (
            <label
              key={k.key}
              className="flex min-h-11 items-center gap-3 rounded-lg border border-line px-3 py-2"
            >
              <input
                type="radio"
                name="kind"
                value={k.key}
                defaultChecked={i === 0}
                className="h-4 w-4 shrink-0"
              />
              <span className="prose-serif-sm">{k.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="concern-said" className="mb-1.5 block font-mono text-xs text-muted">
          Tell us what is happening
        </label>
        <textarea
          id="concern-said"
          name="said"
          rows={6}
          required
          maxLength={SAID_MAX}
          onChange={(e) => setLeft(SAID_MAX - e.target.value.length)}
          placeholder="In your own words. We only see what you write here."
          className="w-full rounded-lg border border-line bg-transparent px-3 py-2 prose-serif-sm placeholder:text-muted/60 focus:border-accent/60 focus:outline-none"
        />
        <p className="mt-1 text-right font-mono text-[0.62rem] text-muted">
          {left.toLocaleString("en-GB")} left
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="submit"
          disabled={busy}
          className="inline-flex min-h-11 items-center rounded-lg border border-accent/50 px-4 font-mono text-xs text-accent transition-colors hover:bg-accent/[0.06] disabled:opacity-40"
        >
          {busy ? "Sending…" : "Send it"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="inline-flex min-h-11 items-center rounded-lg border border-line px-4 font-mono text-xs text-muted transition-colors hover:text-fg"
        >
          Not now
        </button>
      </div>

      {error && (
        <p className="font-mono text-xs text-accent2" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
