"use client";

import { useState, useTransition } from "react";
import {
  SHARED_WORDS,
  SHARE_STATE_LABEL,
  helloCountLabel,
  seenLabel,
  shareState,
  shareWindowLabel,
} from "@/lib/post-share";
import type { SharedRow } from "@/lib/post-share-db";

export type CloseOneFn = (shareId: string) => Promise<{ ok: boolean }>;
export type CloseAllFn = () => Promise<{ ok: boolean; closed: number }>;

/**
 * Every link this family has made, and what became of it.
 *
 * ── Why a page for this exists at all ────────────────────────────────────
 * Because the Close button next to a post only helps somebody who can still
 * find the post. A year in, with two hundred entries, "did I ever share the
 * scan photograph, and is it still up?" is a question that cannot be
 * answered by scrolling. It is also the question people ask at exactly the
 * moment they are least willing to scroll — after somebody mentions having
 * seen something, or after a falling-out. One page, one answer.
 *
 * ── Why the closed ones are shown ────────────────────────────────────────
 * A list of only the live links cannot say "yes, you shared that, and it has
 * been closed since March" — it would just be silent, which reads as "no,
 * you never did", which is a worse answer for being wrong.
 */
export function SharedList({
  rows,
  canCloseAll,
  onClose,
  onCloseAll,
}: {
  rows: SharedRow[];
  /** Closing everything is the household's, not one author's. */
  canCloseAll: boolean;
  onClose: CloseOneFn;
  onCloseAll: CloseAllFn;
}) {
  const [closed, setClosed] = useState<string[]>([]);
  const [allDone, setAllDone] = useState(false);
  const [armed, setArmed] = useState(false);
  const [pending, start] = useTransition();

  const isClosed = (r: SharedRow) =>
    allDone || closed.includes(r.id) || shareState(r) !== "open";
  const openCount = rows.filter((r) => !isClosed(r)).length;

  if (rows.length === 0) {
    return <p className="prose-serif-sm text-muted">{SHARED_WORDS.empty}</p>;
  }

  return (
    <div>
      {openCount > 0 && canCloseAll && (
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <button
            type="button"
            disabled={pending}
            onClick={() => {
              if (!armed) {
                setArmed(true);
                setTimeout(() => setArmed(false), 4000);
                return;
              }
              start(async () => {
                const r = await onCloseAll();
                if (r.ok) setAllDone(true);
                setArmed(false);
              });
            }}
            className="rounded-lg border border-border px-4 py-2 font-mono text-[0.68rem] text-muted transition-colors hover:border-negative hover:text-negative disabled:opacity-50"
          >
            {armed ? SHARED_WORDS.closeAllSure : SHARED_WORDS.closeAll}
          </button>
          <p className="font-mono text-[0.62rem] text-muted">
            {openCount} {openCount === 1 ? "link is" : "links are"} open
          </p>
        </div>
      )}

      {allDone && (
        <p
          role="status"
          className="mb-5 rounded-lg border border-accent/30 bg-accent/[0.06] p-3 prose-serif-xs text-ink"
        >
          {SHARED_WORDS.allClosed}
        </p>
      )}

      <ul className="space-y-3">
        {rows.map((r) => {
          const shut = isClosed(r);
          const state = allDone || closed.includes(r.id) ? "closed" : shareState(r);
          const back = helloCountLabel(r.hellos);
          return (
            <li
              key={r.id}
              className={`rounded-xl border p-4 ${
                shut ? "border-border bg-bg" : "border-accent/30 bg-accent/[0.04]"
              }`}
            >
              <p
                className={`prose-serif-sm ${shut ? "text-muted" : "text-ink"}`}
              >
                {r.excerpt}
                {r.hasMedia && (
                  <span className="text-muted"> · with pictures</span>
                )}
              </p>

              <p className="mt-2 font-mono text-[0.62rem] uppercase tracking-widest text-muted">
                {shut
                  ? SHARE_STATE_LABEL[state as "closed" | "expired"]
                  : shareWindowLabel(r)}
                {" · "}
                {seenLabel(r.views)}
                {back ? ` · ${back}` : ""}
                {" · "}
                by {r.by}
              </p>

              {!shut && (
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() =>
                      start(async () => {
                        const res = await onClose(r.id);
                        if (res.ok) setClosed((c) => [...c, r.id]);
                      })
                    }
                    className="rounded-lg border border-border px-3 py-2 font-mono text-[0.68rem] text-muted transition-colors hover:border-negative hover:text-negative disabled:opacity-50"
                  >
                    Close this link
                  </button>
                  <a
                    href={r.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[0.62rem] uppercase tracking-widest text-accent underline underline-offset-4"
                  >
                    See what they see →
                  </a>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
