"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { addEssentials } from "@/app/registry/actions";
import type { EssentialSection } from "@/lib/registry-essentials";

type Choice = "want" | "have";

/**
 * The essentials, to pick from — lib/registry-essentials.ts.
 *
 * Shelf by shelf, with how many, and two answers for each thing: "Want" puts
 * it on the list for guests; "Have" keeps it on the family's own list, ticked,
 * where no guest sees it. Nothing is added until she presses the button at
 * the bottom, and everything added is an ordinary item she can then rename,
 * link to a shop, price or take off.
 *
 * Closed until opened: a family that already knows what it wants is not made
 * to scroll past ninety suggestions to reach its own list.
 */
export function Essentials({
  sections,
  onList,
  roomLeft,
}: {
  sections: EssentialSection[];
  /** Starter entries already on the registry, and whether they are had or wanted. */
  onList: Record<string, Choice>;
  /** How many more things the registry can hold. */
  roomLeft: number;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [picked, setPicked] = useState<Record<string, Choice>>({});
  const [said, setSaid] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const choose = (key: string, c: Choice) =>
    setPicked((p) => {
      const next = { ...p };
      if (next[key] === c) delete next[key];
      else next[key] = c;
      return next;
    });

  const wantKeys = Object.keys(picked).filter((k) => picked[k] === "want");
  const haveKeys = Object.keys(picked).filter((k) => picked[k] === "have");
  const total = wantKeys.length + haveKeys.length;
  const forgotten = sections.flatMap((s) => s.items).filter((i) => i.forgotten && !onList[i.key]);

  function save() {
    setError(null);
    setSaid(null);
    start(async () => {
      const res = await addEssentials({ add: wantKeys, have: haveKeys });
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setPicked({});
      setSaid(
        res.added === 0
          ? "Those were already on your list."
          : `${res.added} added${res.skipped > 0 ? `, ${res.skipped} left off (already there, or the list is full)` : ""}. Each one is yours to edit below.`,
      );
      router.refresh();
    });
  }

  const pill = (on: boolean) =>
    `inline-flex min-h-9 items-center rounded-full border px-3 font-mono text-[0.62rem] uppercase tracking-widest transition-colors ${
      on ? "border-accent bg-accent/[0.12] text-accent" : "border-border text-muted hover:border-accent hover:text-accent"
    }`;

  return (
    <div className="surface-premium rounded-2xl border border-border p-4 md:p-5">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="essentials-list"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-start justify-between gap-3 text-left"
      >
        <span>
          <span className="block font-serif text-lg text-ink">Pick from the essentials</span>
          <span className="mt-0.5 block prose-serif-xs text-muted">
            What a baby needs, shelf by shelf, with how many. Tick what you want; nothing is added until you say.
          </span>
        </span>
        <span aria-hidden className="mt-1 font-mono text-xs text-muted">
          {open ? "Close" : "Open"}
        </span>
      </button>

      {said && !open && <p className="mt-3 prose-serif-xs text-accent">{said}</p>}

      {open && (
        <div id="essentials-list" className="mt-4">
          <p className="prose-serif-xs text-muted">
            <strong className="font-medium text-ink">Want</strong> puts it on the list for the people you share it with.{" "}
            <strong className="font-medium text-ink">Have</strong> keeps it on your own list, ticked, where nobody else sees
            it.
          </p>

          {forgotten.length > 0 && (
            <div className="mt-4 rounded-xl border border-accent/30 bg-accent/[0.05] p-3">
              <p className="font-mono text-[0.62rem] uppercase tracking-widest text-accent">Often forgotten</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {forgotten.map((i) => (
                  <button
                    key={i.key}
                    type="button"
                    aria-pressed={picked[i.key] === "want"}
                    onClick={() => choose(i.key, "want")}
                    className={pill(picked[i.key] === "want")}
                  >
                    {picked[i.key] === "want" ? "✓ " : "+ "}
                    {i.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4 space-y-2">
            {sections.map((s) => {
              const there = s.items.filter((i) => onList[i.key]).length;
              const chosen = s.items.filter((i) => picked[i.key]).length;
              return (
                <details key={s.key} className="rounded-xl border border-border bg-bg/40 px-3.5 py-2.5">
                  <summary className="flex cursor-pointer items-baseline justify-between gap-3">
                    <span className="prose-serif-sm font-medium text-ink">{s.title}</span>
                    <span className="shrink-0 font-mono text-[0.6rem] uppercase tracking-widest text-muted">
                      {chosen > 0 ? `${chosen} chosen` : there > 0 ? `${there} on your list` : `${s.items.length}`}
                    </span>
                  </summary>
                  {s.blurb && <p className="mt-2 prose-serif-xs text-muted">{s.blurb}</p>}
                  <ul className="mt-2 divide-y divide-border/60">
                    {s.items.map((i) => {
                      const state = onList[i.key];
                      return (
                        <li key={i.key} className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 py-2.5">
                          <div className="min-w-0 flex-1 basis-48">
                            <p className="prose-serif-sm text-ink">
                              {i.title}
                              {i.quantity > 1 && <span className="text-muted"> × {i.quantity}</span>}
                              {i.mostNeeded && (
                                <span className="ml-2 rounded-full border border-accent/40 px-1.5 py-0.5 align-middle font-mono text-[0.52rem] uppercase tracking-widest text-accent">
                                  Essential
                                </span>
                              )}
                            </p>
                            {i.note && <p className="mt-0.5 prose-serif-xs text-muted">{i.note}</p>}
                          </div>
                          {state ? (
                            <span className="font-mono text-[0.6rem] uppercase tracking-widest text-muted">
                              {state === "have" ? "✓ You have it" : "✓ On your list"}
                            </span>
                          ) : (
                            <div className="flex shrink-0 gap-2" role="group" aria-label={i.title}>
                              <button
                                type="button"
                                aria-pressed={picked[i.key] === "want"}
                                onClick={() => choose(i.key, "want")}
                                className={pill(picked[i.key] === "want")}
                              >
                                Want
                              </button>
                              <button
                                type="button"
                                aria-pressed={picked[i.key] === "have"}
                                onClick={() => choose(i.key, "have")}
                                className={pill(picked[i.key] === "have")}
                              >
                                Have
                              </button>
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </details>
              );
            })}
          </div>

          {error && <p className="mt-3 prose-serif-xs text-negative">{error}</p>}
          {said && <p className="mt-3 prose-serif-xs text-accent">{said}</p>}
          {/* Room for the fixed button, so the last shelf is not hidden under it. */}
          {total > 0 && <div aria-hidden className="h-24" />}

          {/* Once something is chosen the button follows her down the list:
              fixed above the bottom bar, clear of the assistant's button on
              the right. With nothing chosen it simply sits at the end. */}
          <div
            className={
              total > 0
                ? "fixed inset-x-4 bottom-[5.75rem] z-20 mr-16 flex flex-wrap items-center gap-3 rounded-xl border border-accent/40 bg-surface p-3 shadow-lg lg:inset-x-auto lg:bottom-6 lg:left-1/2 lg:mr-0 lg:w-[34rem] lg:-translate-x-1/2"
                : "mt-4 flex flex-wrap items-center gap-3 rounded-xl border border-border bg-surface p-3"
            }
          >
            <button
              type="button"
              disabled={pending || total === 0}
              onClick={save}
              className="inline-flex min-h-11 items-center rounded-lg bg-accent px-4 font-mono text-xs text-on-accent disabled:opacity-50"
            >
              {pending ? "Adding…" : total === 0 ? "Choose something" : `Add ${total} to your list`}
            </button>
            <p className="min-w-0 flex-1 prose-serif-xs text-muted">
              {total === 0
                ? "No brands and no prices here: add a link or a price to any of them afterwards."
                : `${wantKeys.length} wanted${haveKeys.length ? `, ${haveKeys.length} you already have` : ""}.`}
              {total > roomLeft && ` Only ${Math.max(0, roomLeft)} more will fit on the list.`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
