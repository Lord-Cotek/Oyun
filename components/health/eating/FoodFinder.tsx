"use client";

import { useState } from "react";
import { FOODS, VERDICT_LABEL, searchFoods, type Verdict } from "@/lib/eating";

const TONE: Record<Verdict, { chip: string; mark: string }> = {
  ok: { chip: "border-positive/50 bg-positive/[0.08] text-positive", mark: "✓" },
  care: { chip: "border-accent/50 bg-accent/[0.08] text-accent", mark: "!" },
  avoid: { chip: "border-negative/50 bg-negative/[0.06] text-negative", mark: "✕" },
};

const FILTERS: { key: Verdict | null; label: string }[] = [
  { key: null, label: "All" },
  { key: "ok", label: VERDICT_LABEL.ok },
  { key: "care", label: VERDICT_LABEL.care },
  { key: "avoid", label: VERDICT_LABEL.avoid },
];

/** How many are shown before she asks for the rest. */
const FIRST = 8;

/**
 * "Can I eat this?" — lib/eating.ts.
 *
 * Typing searches on this device only. What she types is never sent
 * anywhere and never kept: the list is part of the page, and the search is a
 * filter over it. A pregnant woman's cravings are nobody's to log.
 */
export function FoodFinder() {
  const [q, setQ] = useState("");
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [all, setAll] = useState(false);

  const found = searchFoods(q, verdict);
  const filtering = q.trim() !== "" || verdict !== null;
  const shown = filtering || all ? found : found.slice(0, FIRST);

  return (
    <div>
      <label htmlFor="food-q" className="mb-1.5 block font-mono text-[0.62rem] uppercase tracking-widest text-muted">
        Type a food or a drink
      </label>
      <input
        id="food-q"
        type="search"
        inputMode="search"
        autoComplete="off"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="e.g. eggs, tuna, soft cheese, herbal tea"
        className="w-full rounded-lg border border-border bg-bg px-3 py-2.5 prose-serif-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none"
      />
      <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Show">
        {FILTERS.map((f) => (
          <button
            key={f.label}
            type="button"
            aria-pressed={verdict === f.key}
            onClick={() => setVerdict(f.key)}
            className={`inline-flex min-h-9 items-center rounded-full border px-3 font-mono text-[0.62rem] uppercase tracking-widest transition-colors ${
              verdict === f.key ? "border-accent bg-accent/[0.1] text-accent" : "border-border text-muted hover:border-accent hover:text-accent"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <p className="mt-3 font-mono text-[0.6rem] uppercase tracking-widest text-muted" aria-live="polite">
        {filtering ? `${found.length} of ${FOODS.length}` : `${FOODS.length} foods and drinks`}
      </p>

      {found.length === 0 ? (
        <p className="mt-3 max-w-prose prose-serif-sm text-muted">
          Nothing by that name here. Try the plain name of the food, not the dish. If it is still not here, ask your
          midwife, and when in doubt, cook it through and eat it hot.
        </p>
      ) : (
        <ul className="mt-2 divide-y divide-border/70">
          {shown.map((f) => (
            <li key={f.key} className="py-3">
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                <p className="prose-serif-sm font-medium text-ink">{f.name}</p>
                <span
                  className={`rounded-full border px-2 py-0.5 font-mono text-[0.56rem] uppercase tracking-widest ${TONE[f.verdict].chip}`}
                >
                  <span aria-hidden>{TONE[f.verdict].mark} </span>
                  {VERDICT_LABEL[f.verdict]}
                </span>
              </div>
              <p className="mt-1 max-w-prose prose-serif-sm text-ink/85">{f.why}</p>
            </li>
          ))}
        </ul>
      )}

      {!filtering && !all && found.length > FIRST && (
        <button
          type="button"
          onClick={() => setAll(true)}
          className="mt-2 inline-flex min-h-11 items-center font-mono text-[0.62rem] uppercase tracking-widest text-muted underline underline-offset-4 hover:text-accent"
        >
          Show all {found.length}
        </button>
      )}
    </div>
  );
}
