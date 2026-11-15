"use client";

import type { TagOption } from "@/lib/tags";
import { TAG_MAX } from "@/lib/tags";

/**
 * "Who's in this?" — a row of names to tick. Children and relatives first,
 * as the tree lists them, then members. Somebody who cannot see a "just us"
 * post is shown but cannot be ticked while the post is kept to the family,
 * and says why, rather than vanishing from the list and leaving people
 * wondering where they went.
 *
 * Shared with the sibling app and drift-checked.
 */
export function WhoIsIn({
  options,
  selected,
  onChange,
  justUs,
}: {
  options: TagOption[];
  selected: string[];
  onChange: (keys: string[]) => void;
  justUs: boolean;
}) {
  const full = selected.length >= TAG_MAX;
  const toggle = (key: string) =>
    onChange(selected.includes(key) ? selected.filter((k) => k !== key) : full ? selected : [...selected, key]);
  const told = options.filter((o) => o.hasAccount && selected.includes(o.key)).length;
  return (
    <div className="rounded-xl border border-border bg-bg/50 p-3" role="group" aria-label="Who's in this?">
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => {
          const blocked = justUs && o.outsideJustUs;
          const on = selected.includes(o.key) && !blocked;
          return (
            <button
              key={o.key}
              type="button"
              aria-pressed={on}
              disabled={blocked || (full && !on)}
              title={blocked ? `${o.name} can't see "just us" posts` : undefined}
              onClick={() => toggle(o.key)}
              className={`inline-flex min-h-9 items-center rounded-full border px-3 font-mono text-[0.68rem] transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                on ? "border-accent bg-accent/10 text-accent" : "border-border text-muted hover:text-ink"
              }`}
            >
              {on ? "✓ " : ""}
              {o.name}
            </button>
          );
        })}
      </div>
      <p className="mt-2 font-mono text-[0.6rem] leading-relaxed text-muted">
        {told > 0
          ? `${told === 1 ? "The member" : `The ${told} members`} you tag will be told. Anyone tagged can take their tag off.`
          : "Members you tag are told; children and relatives gather the post on their own page."}
        {justUs && options.some((o) => o.outsideJustUs) ? " Greyed names can't see \"just us\" posts." : ""}
      </p>
    </div>
  );
}
