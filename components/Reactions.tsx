"use client";

import { useState } from "react";
import { REACTION_EMOJIS, type ReactionData } from "@/lib/reaction-emojis";
import { toggleReaction } from "@/app/journey/reaction-actions";
import { type ReactionTarget } from "@/lib/reactions";
import { useAttempt } from "@/lib/use-attempt";

/**
 * A gentle row of emoji reactions. Both the mother (on encouragements she
 * receives) and her circle (on how she's feeling) can respond here.
 *
 * The tap lands at once — waiting on the server for something this small makes
 * a phone feel broken — and if the server turns out not to have heard, the
 * emoji goes back to how it was and a line underneath says so. Somebody should
 * never be left believing they answered a mother's check-in when nothing was
 * written down.
 */
export function Reactions({
  targetType,
  targetId,
  initial,
  align = "start",
}: {
  targetType: ReactionTarget;
  targetId: string;
  initial: ReactionData;
  align?: "start" | "end";
}) {
  const [counts, setCounts] = useState<Record<string, number>>(
    () => ({ ...initial.counts }),
  );
  const [mine, setMine] = useState<string[]>(() => [...initial.mine]);
  const { attempt, slipped } = useAttempt();

  function toggle(emoji: string) {
    const has = mine.includes(emoji);
    const step = (d: number) => (c: Record<string, number>) => ({
      ...c,
      [emoji]: Math.max(0, (c[emoji] ?? 0) + d),
    });
    attempt(
      () => {
        setMine((m) => (has ? m.filter((e) => e !== emoji) : [...m, emoji]));
        setCounts(step(has ? -1 : 1));
      },
      () => toggleReaction(targetType, targetId, emoji),
      () => {
        setMine((m) => (has ? [...m, emoji] : m.filter((e) => e !== emoji)));
        setCounts(step(has ? 1 : -1));
      },
      "That didn’t reach them. Tap again?",
    );
  }

  return (
    <div
      className={`flex flex-wrap items-center gap-1.5 ${
        align === "end" ? "justify-end" : ""
      }`}
    >
      {REACTION_EMOJIS.map((emoji) => {
        const count = counts[emoji] ?? 0;
        const active = mine.includes(emoji);
        return (
          <button
            key={emoji}
            type="button"
            onClick={() => toggle(emoji)}
            aria-pressed={active}
            aria-label={`React with ${emoji}`}
            className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 font-mono text-xs leading-none transition-colors ${
              active
                ? "border-accent/50 bg-accent/[0.12] text-ink"
                : "border-border bg-bg text-muted hover:border-accent/30 hover:text-ink"
            }`}
          >
            <span className="text-sm leading-none">{emoji}</span>
            {count > 0 && <span className="tabular-nums">{count}</span>}
          </button>
        );
      })}
      {slipped && (
        <p role="status" className="w-full font-mono text-[0.68rem] text-muted">
          {slipped}
        </p>
      )}
    </div>
  );
}
