"use client";

import { useState } from "react";

/** A value with a Copy button beside it — a clinic code, a link. */
export function CopyText({ value, label = "Copy" }: { value: string; label?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setDone(true);
          setTimeout(() => setDone(false), 1800);
        } catch {
          // The page still shows the value; a clipboard refusal costs nothing.
        }
      }}
      className="inline-flex min-h-11 items-center rounded-lg border border-border px-4 font-mono text-xs text-ink hover:border-accent"
    >
      {done ? "Copied" : label}
    </button>
  );
}
