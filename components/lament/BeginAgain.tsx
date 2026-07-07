"use client";

import { useState } from "react";
import { beginAgain } from "@/app/lament/actions";
import { Eyebrow } from "@/components/ui/Eyebrow";

const inputClass =
  "w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 font-mono text-sm text-ink focus:border-accent focus:outline-none";

export function BeginAgain() {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="font-mono text-xs text-muted underline underline-offset-4 hover:text-ink"
      >
        When you are ready — begin a new journey
      </button>
    );
  }

  return (
    <div>
      <Eyebrow className="mb-3">Only when you are ready</Eyebrow>
      <p className="mb-4 max-w-prose font-mono text-xs leading-relaxed text-muted">
        There is no timeline for grief, and no pressure here. If and when a new
        season begins, you can set a new due date — or birth date — and Oyun will
        walk with you again. What you have written in memory will not be lost.
      </p>
      <form action={beginAgain} className="flex flex-wrap items-end gap-3">
        <label className="block">
          <span className="eyebrow mb-2 block text-muted">A new due or birth date</span>
          <input type="date" name="dueDate" required className={inputClass} />
        </label>
        <button
          type="submit"
          className="rounded-lg border border-border px-4 py-2.5 font-mono text-sm text-ink transition-colors hover:border-accent hover:text-accent"
        >
          Begin again
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="font-mono text-xs text-muted hover:text-ink"
        >
          Not now
        </button>
      </form>
    </div>
  );
}
