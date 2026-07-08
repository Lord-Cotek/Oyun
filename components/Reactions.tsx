"use client";

import { useState, useTransition } from "react";
import { REACTION_EMOJIS, type ReactionData } from "@/lib/reaction-emojis";
import { toggleReaction } from "@/app/journey/reaction-actions";
import { type ReactionTarget } from "@/lib/reactions";

/**
 * A gentle row of emoji reactions. Both the mother (on encouragements she
 * receives) and her circle (on how she's feeling) can respond here. State is
 * optimistic so a tap feels immediate; the server reconciles behind it.
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
  const [, startTransition] = useTransition();

  function toggle(emoji: string) {
    const has = mine.includes(emoji);
    // Optimistic update.
    setMine((m) => (has ? m.filter((e) => e !== emoji) : [...m, emoji]));
    setCounts((c) => {
      const next = { ...c };
      next[emoji] = Math.max(0, (next[emoji] ?? 0) + (has ? -1 : 1));
      return next;
    });
    startTransition(async () => {
      await toggleReaction(targetType, targetId, emoji);
    });
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
    </div>
  );
}
