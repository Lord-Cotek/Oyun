"use client";

import { useState, type ReactNode } from "react";
import { Eyebrow } from "@/components/ui/Eyebrow";

type Key = "baby" | "couple";

/**
 * A segmented switcher over the two letter threads so neither buries the other.
 * "To your baby" and "To each other" are shown one at a time — she can reach
 * the letters between the two of them without scrolling past every keepsake to
 * the baby. Both panels are pre-rendered on the server and passed in; we simply
 * toggle which one is visible.
 */
export function LettersPanel({
  baby,
  couple,
  babyIntro,
  coupleIntro,
  babyCount,
}: {
  baby: ReactNode;
  couple: ReactNode;
  babyIntro: ReactNode;
  coupleIntro: ReactNode;
  babyCount?: number;
}) {
  const [tab, setTab] = useState<Key>("baby");

  const TabBtn = ({ id, label }: { id: Key; label: string }) => {
    const active = tab === id;
    return (
      <button
        type="button"
        onClick={() => setTab(id)}
        aria-pressed={active}
        className={`flex-1 rounded-lg px-3 py-2 font-mono text-xs tracking-wide transition-colors ${
          active
            ? "bg-accent2/15 text-accent2"
            : "text-muted hover:text-ink"
        }`}
      >
        {label}
        {id === "baby" && babyCount ? (
          <span className="ml-1.5 opacity-70">{babyCount}</span>
        ) : null}
      </button>
    );
  };

  return (
    <div>
      <Eyebrow className="mb-3">Letters</Eyebrow>
      <div className="mb-4 flex gap-1 rounded-xl border border-border bg-bg/60 p-1">
        <TabBtn id="couple" label="To each other" />
        <TabBtn id="baby" label="To your baby" />
      </div>

      <p className="mb-5 font-mono text-xs leading-relaxed text-muted">
        {tab === "baby" ? babyIntro : coupleIntro}
      </p>

      <div className={tab === "baby" ? "" : "hidden"}>{baby}</div>
      <div className={tab === "couple" ? "" : "hidden"}>{couple}</div>
    </div>
  );
}
