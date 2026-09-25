"use client";

import { useTransition } from "react";
import { Pressable } from "@/components/ui/Pressable";
import { setThanked } from "@/app/registry/actions";

export interface ThankYou {
  id: string;
  name: string | null;
  note: string | null;
  item: string;
  when: string;
  thanked: boolean;
}

/**
 * Who gave what — the list thank-you notes are written from.
 *
 * This is the honest half of "tracking". Nobody here knows what was bought:
 * no shop tells you that, and a registry that claimed to would be lying to a
 * mother about whether her baby has a cot. What is known is who SAID they
 * were getting something, and that is exactly the list she needs at the other
 * end, when the shower is over and there are fourteen notes to write and she
 * cannot remember who brought the muslins.
 *
 * The tick is hers. Nobody is told they have been thanked or not thanked.
 */
export function ThankYous({ rows }: { rows: ThankYou[] }) {
  const [pending, start] = useTransition();
  if (rows.length === 0) return null;

  const left = rows.filter((r) => !r.thanked).length;

  return (
    <div>
      <p className="mb-3 prose-serif-sm text-muted">
        {left === 0
          ? "Everybody has been thanked."
          : `${left} still to thank, of ${rows.length}.`}
      </p>
      <ul className="space-y-2">
        {rows.map((r) => (
          <li
            key={r.id}
            className="flex items-start gap-3 rounded-xl border border-border bg-bg p-3"
          >
            <input
              id={`thanked-${r.id}`}
              type="checkbox"
              checked={r.thanked}
              disabled={pending}
              onChange={(e) =>
                start(() => setThanked(r.id, e.target.checked).then(() => {}))
              }
              className="mt-1 h-4 w-4 shrink-0 accent-[var(--accent)]"
            />
            <label htmlFor={`thanked-${r.id}`} className="min-w-0 flex-1">
              <span
                className={`block prose-serif-sm ${
                  r.thanked ? "text-muted line-through" : "text-ink"
                }`}
              >
                {r.name?.trim() || "Someone"} — {r.item}
              </span>
              {r.note && (
                <span className="mt-0.5 block prose-serif-xs text-muted">
                  &ldquo;{r.note}&rdquo;
                </span>
              )}
              <span className="mt-0.5 block font-mono text-[0.58rem] uppercase tracking-widest text-muted">
                {r.when}
              </span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** A second control, for when she has thanked everybody at once. */
export function ThankAll({ ids }: { ids: string[] }) {
  const [pending, start] = useTransition();
  if (ids.length === 0) return null;
  return (
    <Pressable
      type="button"
      disabled={pending}
      onClick={() =>
        start(async () => {
          for (const id of ids) await setThanked(id, true);
        })
      }
      className="mt-3 rounded-lg border border-border px-3 py-2 font-mono text-xs text-muted transition-colors hover:border-accent hover:text-accent disabled:opacity-50"
    >
      {pending ? "Ticking…" : "Tick them all off"}
    </Pressable>
  );
}
