"use client";

import { useState, useTransition } from "react";
import { confirmUnsubscribe } from "./actions";

export function UnsubscribeButton({ u, k, t }: { u: string; k: string; t: string }) {
  const [done, setDone] = useState<null | boolean>(null);
  const [pending, start] = useTransition();
  if (done) {
    return (
      <p className="mt-6 rounded-lg border border-border bg-surface px-4 py-3 font-mono text-sm text-ink" role="status">
        Done. You will not get these any more.
      </p>
    );
  }
  return (
    <div className="mt-6">
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          start(async () => {
            const fd = new FormData();
            fd.set("u", u);
            fd.set("k", k);
            fd.set("t", t);
            const r = await confirmUnsubscribe(fd).catch(() => ({ ok: false }));
            setDone(r.ok);
          })
        }
        className="rounded-lg bg-accent px-5 py-3 font-mono text-sm font-medium text-on-accent transition-colors hover:bg-accent-deep disabled:opacity-50"
      >
        {pending ? "One moment…" : "Yes, stop them"}
      </button>
      {done === false && (
        <p className="mt-3 font-mono text-xs text-negative">That did not work. Please try again, or change it in Settings.</p>
      )}
    </div>
  );
}
