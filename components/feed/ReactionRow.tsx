"use client";

import { useState } from "react";
import { REACTIONS } from "@/lib/feed";
import type { FeedReaction } from "@/lib/feed-query";
import { useAttempt, type Attempted } from "@/lib/use-attempt";

/**
 * The row of things you can say back without typing — on a post, and now on a
 * reply to one.
 *
 * ── Why a reply shows fewer of them ──────────────────────────────────────
 * A post is the event on the page and can carry all seven. A reply is one
 * line, and there may be six of them under a single post; seven chips beneath
 * each would bury the conversation under its own furniture. So a reply shows
 * only what has actually been said — the chips people have already tapped —
 * and keeps the rest behind one small button until somebody wants them.
 *
 * ── The counting ─────────────────────────────────────────────────────────
 * `mine` is what this viewer has changed since the page was rendered, layered
 * over what the server sent rather than replacing it. When the page
 * revalidates the two agree and nothing jumps; and a reaction somebody else
 * added in the meantime is not wiped by our stale snapshot.
 */
export function ReactionRow({
  reactions,
  onToggle,
  compact = false,
  label = "the family",
}: {
  reactions: FeedReaction[];
  onToggle: (kind: string) => Promise<Attempted>;
  /** A reply: only what has been said, with the rest one tap away. */
  compact?: boolean;
  /** Who did not hear about it, for the line shown when one does not land. */
  label?: string;
}) {
  const [mine, setMine] = useState<Record<string, boolean>>({});
  const [open, setOpen] = useState(false);
  const { attempt, slipped } = useAttempt();

  function stateOf(kind: string) {
    const server = reactions.find((x) => x.kind === kind);
    const serverMine = server?.mine ?? false;
    const on = mine[kind] ?? serverMine;
    const count = (server?.count ?? 0) + (on === serverMine ? 0 : on ? 1 : -1);
    return { on, count: Math.max(0, count) };
  }

  function react(kind: string) {
    const { on } = stateOf(kind);
    attempt(
      () => setMine((m) => ({ ...m, [kind]: !on })),
      () => onToggle(kind),
      () => setMine((m) => ({ ...m, [kind]: on })),
      `That didn’t reach ${label}. Tap again?`,
    );
  }

  // On a reply, show what is already there until the picker is opened.
  const shown =
    compact && !open
      ? REACTIONS.filter((r) => stateOf(r.kind).count > 0 || stateOf(r.kind).on)
      : REACTIONS;

  return (
    <div className={compact ? "mt-1.5" : "mt-4"}>
      <div className="flex flex-wrap items-center gap-1.5">
        {shown.map((r) => {
          const { on, count } = stateOf(r.kind);
          return (
            <button
              key={r.kind}
              type="button"
              onClick={() => react(r.kind)}
              aria-pressed={on}
              aria-label={r.label}
              className={`inline-flex items-center gap-1 rounded-full border font-mono transition-colors ${
                compact ? "px-2 py-0.5 text-[0.66rem]" : "px-2.5 py-1 text-xs"
              } ${
                on
                  ? "border-accent/50 bg-accent/10 text-ink"
                  : "border-border text-muted hover:border-accent/40"
              }`}
            >
              <span aria-hidden>{r.glyph}</span>
              {count > 0 && (
                <span className={compact ? "text-[0.6rem]" : "text-[0.68rem]"}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
        {compact && !open && (
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Say something back to this reply"
            className="inline-flex items-center rounded-full border border-border px-2 py-0.5 font-mono text-[0.66rem] text-muted transition-colors hover:border-accent/40 hover:text-ink"
          >
            {/* aria-label on the button already names it; an sr-only word
                inside would be dead text a screen reader never reaches. */}
            <span aria-hidden>☺</span>
          </button>
        )}
      </div>
      {slipped && (
        <p role="status" className="mt-1 font-mono text-[0.66rem] text-muted">
          {slipped}
        </p>
      )}
    </div>
  );
}
