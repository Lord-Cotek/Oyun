"use client";

import { VOICE_CHOICES, type Voice } from "@/lib/voice";
import { sayIn, type Words } from "@/lib/i18n";

/**
 * The one choice of how Oyun speaks to you — at sign-up and in Settings.
 *
 * Two equal cards, neither pre-selected at sign-up: whichever a person
 * picks, it should be because they picked it, not because it was already
 * ticked. Neither is described as the "normal" one. See lib/voice.ts.
 */
export function VoicePicker({
  value,
  onChange,
  name = "voice",
  words,
}: {
  value: Voice | null;
  onChange: (v: Voice) => void;
  name?: string;
  words?: Words;
}) {
  const w = (en: string) => sayIn(words, en);
  return (
    <fieldset className="space-y-2">
      <legend className="eyebrow mb-2 block text-muted">{w("How should Oyun speak to you?")}</legend>
      {VOICE_CHOICES.map((c) => {
        const on = value === c.value;
        return (
          <label
            key={c.value}
            className={`flex cursor-pointer items-start gap-3 rounded-lg border px-4 py-3 transition-colors ${
              on ? "border-accent bg-accent/5" : "border-border bg-bg hover:border-accent/60"
            }`}
          >
            <input
              type="radio"
              name={name}
              value={c.value}
              checked={on}
              onChange={() => onChange(c.value)}
              required
              className="mt-1 h-4 w-4 shrink-0 accent-[var(--accent)]"
            />
            <span className="min-w-0">
              <span className="block font-serif text-base text-ink">{w(c.label)}</span>
              <span className="mt-0.5 block prose-serif-xs text-muted">{w(c.detail)}</span>
            </span>
          </label>
        );
      })}
      <p className="prose-serif-xs text-muted">{w("You can change this any time in Settings.")}</p>
    </fieldset>
  );
}
