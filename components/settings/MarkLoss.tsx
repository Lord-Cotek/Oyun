"use client";

import { useState } from "react";
import { markLoss } from "@/app/lament/actions";
import { Eyebrow } from "@/components/ui/Eyebrow";

const inputClass =
  "w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 font-mono text-sm text-ink focus:border-accent focus:outline-none";

export function MarkLoss() {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <div>
        <p className="mb-4 max-w-prose font-mono text-xs leading-relaxed text-muted">
          If you have lost your baby, we are so deeply sorry. Whenever you are
          ready, Oyun can gently become a place of lament and remembrance instead
          — with Scripture for grief, a space to remember, and your circle drawn
          near. There is no hurry.
        </p>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="font-mono text-xs text-muted underline underline-offset-4 hover:text-accent2"
        >
          My baby has died
        </button>
      </div>
    );
  }

  return (
    <div>
      <p className="mb-5 max-w-prose font-mono text-xs leading-relaxed text-muted">
        We are holding this with you. This will turn your journey into a place of
        remembrance. Nothing you have written is lost, and you can begin a new
        journey later if that day comes.
      </p>
      <form action={markLoss} className="space-y-4">
        <label className="block max-w-xs">
          <span className="eyebrow mb-2 block text-muted">When (if you wish to say)</span>
          <input type="date" name="lossAt" className={inputClass} />
        </label>
        <label className="block max-w-xs">
          <span className="eyebrow mb-2 block text-muted">Your baby&rsquo;s name (optional)</span>
          <input name="babyName" placeholder="If you have named them" className={inputClass} />
        </label>
        <label className="flex items-start gap-2">
          <input
            type="checkbox"
            name="share"
            defaultChecked
            className="mt-0.5 h-4 w-4 accent-[color:var(--accent)]"
          />
          <span className="font-mono text-[0.7rem] leading-relaxed text-muted">
            Let my circle know, so they can come near. (You are not meant to
            carry this alone — but this is your choice.)
          </span>
        </label>
        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="rounded-lg bg-accent2 px-4 py-2.5 font-mono text-sm font-medium text-on-accent transition-opacity hover:opacity-90"
          >
            Enter remembrance
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="font-mono text-xs text-muted hover:text-ink"
          >
            Not now
          </button>
        </div>
      </form>
    </div>
  );
}
