"use client";

import { useState, useTransition } from "react";
import { setMoodAudience } from "@/app/care/actions";

const CHOICES = [
  {
    value: "HOUSEHOLD",
    label: "Just my partner",
    hint: "The one beside you sees your mood. Nobody else does.",
  },
  {
    value: "CIRCLE",
    label: "My partner and my circle",
    hint: "Everyone walking with you sees your mood, so they know when to pray or check in.",
  },
  {
    value: "ME",
    label: "Just me",
    hint: "Your check-ins stay here with you. Nobody sees your mood.",
  },
] as const;

/**
 * Who sees how she is. Only the mood, and any note she ticks to share —
 * never her other notes, which stay hers whatever she chooses here.
 */
export function MoodAudience({ initial }: { initial: string }) {
  const [value, setValue] = useState(initial);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function choose(next: string) {
    if (next === value || pending) return;
    const before = value;
    setValue(next);
    setSaved(false);
    setError(null);
    start(async () => {
      const r = await setMoodAudience(next).catch(() => ({ ok: false as const }));
      if (r.ok) setSaved(true);
      else {
        setValue(before);
        setError("That didn't save. Please try again.");
      }
    });
  }

  return (
    <fieldset className="space-y-2" aria-describedby="mood-audience-note">
      <legend className="eyebrow mb-3 text-muted">Who sees how you are</legend>
      {CHOICES.map((c) => {
        const on = value === c.value;
        return (
          <label
            key={c.value}
            className={`flex cursor-pointer items-start gap-3 rounded-lg border px-4 py-3 transition-colors ${
              on ? "border-accent bg-accent/5" : "border-border hover:border-accent/50"
            }`}
          >
            <input
              type="radio"
              name="moodAudience"
              id={`mood-audience-${c.value.toLowerCase()}`}
              value={c.value}
              checked={on}
              disabled={pending}
              onChange={() => choose(c.value)}
              className="mt-1 h-4 w-4 shrink-0 accent-[color:var(--accent)]"
            />
            <span>
              <span className="block font-mono text-sm text-ink">{c.label}</span>
              <span className="block prose-serif-xs text-muted">{c.hint}</span>
            </span>
          </label>
        );
      })}
      <p id="mood-audience-note" className="pt-1 font-mono text-xs text-muted" aria-live="polite">
        {error ? (
          <span className="text-negative">{error}</span>
        ) : saved ? (
          "Saved. You can change this whenever you like."
        ) : (
          "Your notes stay yours unless you tick “share this note” on a check-in."
        )}
      </p>
    </fieldset>
  );
}
