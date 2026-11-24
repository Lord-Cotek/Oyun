"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { addBagExtra, removeBagExtra, toggleBagExtra, toggleBagItem } from "@/app/health/birth/prep-actions";
import { BAG_EXTRA_MAX, BAG_LABEL_MAX, bagProgress, type BagExtra, type BagSection } from "@/lib/birth-prep";

/**
 * The hospital bag — lib/birth-prep.ts.
 *
 * A tick shows at once and is saved behind it; if saving fails the tick goes
 * back and the page says so. Either of the two can tick, and the list is the
 * same on both their phones the next time it is opened.
 */
export function BagChecklist({
  sections,
  done: done0,
  extras: extras0,
}: {
  sections: BagSection[];
  done: string[];
  extras: BagExtra[];
}) {
  const router = useRouter();
  const [done, setDone] = useState<string[]>(done0);
  const [extras, setExtras] = useState<BagExtra[]>(extras0);
  const [label, setLabel] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const sigDone = done0.join("|");
  const sigExtras = JSON.stringify(extras0);
  useEffect(() => setDone(sigDone ? sigDone.split("|") : []), [sigDone]);
  useEffect(() => setExtras(JSON.parse(sigExtras) as BagExtra[]), [sigExtras]);

  const { packed, total } = bagProgress(sections, done, extras);

  function tick(key: string, on: boolean) {
    setError(null);
    setDone((d) => (on ? [...new Set([...d, key])] : d.filter((k) => k !== key)));
    start(async () => {
      const res = await toggleBagItem(key, on);
      if (!res.ok) {
        setError(res.error);
        setDone((d) => (on ? d.filter((k) => k !== key) : [...d, key]));
      }
    });
  }

  function tickExtra(id: string, on: boolean) {
    setError(null);
    setExtras((xs) => xs.map((x) => (x.id === id ? { ...x, done: on } : x)));
    start(async () => {
      const res = await toggleBagExtra(id, on);
      if (!res.ok) {
        setError(res.error);
        setExtras((xs) => xs.map((x) => (x.id === id ? { ...x, done: !on } : x)));
      }
    });
  }

  function add() {
    const text = label.trim();
    if (!text) return;
    setError(null);
    start(async () => {
      const res = await addBagExtra(text);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setExtras((xs) => [...xs, { id: res.id, label: text, done: false }]);
      setLabel("");
      router.refresh();
    });
  }

  function remove(id: string) {
    setError(null);
    setExtras((xs) => xs.filter((x) => x.id !== id));
    start(async () => {
      const res = await removeBagExtra(id);
      if (!res.ok) setError(res.error);
      router.refresh();
    });
  }

  const row = "flex min-h-11 cursor-pointer items-start gap-3 py-2";
  const box = "mt-1 h-5 w-5 shrink-0 accent-[var(--accent)]";

  return (
    <div>
      <div className="rounded-2xl border border-border bg-surface p-4">
        <div className="flex items-baseline justify-between gap-3">
          <p className="font-serif text-lg text-ink" data-testid="bag-progress">
            {packed} of {total} packed
          </p>
          {packed === total && total > 0 && <p className="font-mono text-[0.62rem] uppercase tracking-widest text-accent">Ready</p>}
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-border/60" aria-hidden>
          <div className="h-full rounded-full bg-accent transition-[width]" style={{ width: `${total ? Math.round((packed / total) * 100) : 0}%` }} />
        </div>
      </div>

      {error && <p className="mt-3 prose-serif-xs text-negative">{error}</p>}

      <div className="mt-5 space-y-5">
        {sections.map((s) => (
          <section key={s.key} aria-labelledby={`bag-${s.key}`} className="rounded-2xl border border-border bg-surface p-5">
            <h2 id={`bag-${s.key}`} className="font-serif text-xl text-ink">
              {s.title}
            </h2>
            {s.blurb && <p className="mt-1 prose-serif-xs text-muted">{s.blurb}</p>}
            <ul className="mt-2 divide-y divide-border/60">
              {s.items.map((i) => {
                const on = done.includes(i.key);
                return (
                  <li key={i.key}>
                    <label className={row}>
                      <input type="checkbox" checked={on} onChange={(e) => tick(i.key, e.target.checked)} className={box} />
                      <span className="min-w-0">
                        <span className={`block prose-serif-sm ${on ? "text-muted line-through" : "text-ink"}`}>{i.label}</span>
                        {i.note && <span className="block prose-serif-xs text-muted">{i.note}</span>}
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}

        <section aria-labelledby="bag-own" className="rounded-2xl border border-border bg-surface p-5">
          <h2 id="bag-own" className="font-serif text-xl text-ink">
            Your own
          </h2>
          <p className="mt-1 prose-serif-xs text-muted">Whatever your hospital asked for, and whatever you would not go without.</p>
          {extras.length > 0 && (
            <ul className="mt-2 divide-y divide-border/60">
              {extras.map((e) => (
                <li key={e.id} className="flex items-start justify-between gap-2">
                  <label className={`${row} min-w-0 flex-1`}>
                    <input type="checkbox" checked={e.done} onChange={(ev) => tickExtra(e.id, ev.target.checked)} className={box} />
                    <span className={`block break-words prose-serif-sm ${e.done ? "text-muted line-through" : "text-ink"}`}>{e.label}</span>
                  </label>
                  <button
                    type="button"
                    aria-label={`Take ${e.label} off the list`}
                    onClick={() => remove(e.id)}
                    className="mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted hover:text-negative"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}
          {extras.length < BAG_EXTRA_MAX && (
            <form
              className="mt-3 flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                add();
              }}
            >
              <label htmlFor="bag-add" className="sr-only">
                Add something of your own
              </label>
              <input
                id="bag-add"
                value={label}
                maxLength={BAG_LABEL_MAX}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="Add something"
                className="min-w-0 flex-1 rounded-lg border border-border bg-bg px-3 py-2 prose-serif-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none"
              />
              <button
                type="submit"
                disabled={pending || !label.trim()}
                className="inline-flex min-h-11 items-center rounded-lg border border-accent/60 px-4 font-mono text-xs text-accent hover:bg-accent/[0.06] disabled:opacity-50"
              >
                Add
              </button>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}
