"use client";

import { useEffect, useId, useState, type ReactNode } from "react";

/**
 * The second half of a home page, behind one tap.
 *
 * A home page that never ends is one people stop scrolling. The day's
 * things stay above; the rest — the family feed, what happened on this day,
 * family worship — sits under this heading, closed until asked for, and
 * remembered open or closed on this device. Nothing is removed: everything
 * is rendered, only hidden, so it is one tap away and never fetched late.
 */
export function MoreFold({
  storageKey,
  title,
  hint,
  children,
}: {
  storageKey: string;
  title: string;
  hint?: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const id = useId();
  useEffect(() => {
    try {
      if (localStorage.getItem(`fold:${storageKey}`) === "open") setOpen(true);
    } catch {
      // Private browsing: it simply starts closed.
    }
  }, [storageKey]);

  function toggle() {
    const next = !open;
    setOpen(next);
    try {
      localStorage.setItem(`fold:${storageKey}`, next ? "open" : "closed");
    } catch {
      // As above.
    }
  }

  return (
    <section className="mt-10" aria-labelledby={`${id}-h`}>
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-controls={`${id}-body`}
        className="flex min-h-11 w-full items-center justify-between gap-4 rounded-2xl border border-border bg-surface/60 px-5 py-4 text-left transition-colors hover:border-accent"
      >
        <span>
          <span id={`${id}-h`} className="block font-serif text-lg text-ink">
            {title}
          </span>
          {hint && <span className="mt-0.5 block font-mono text-xs text-muted">{hint}</span>}
        </span>
        <span aria-hidden className="shrink-0 font-mono text-sm text-accent">
          {open ? "Hide" : "Show"}
        </span>
      </button>
      <div id={`${id}-body`} hidden={!open}>
        {children}
      </div>
    </section>
  );
}
