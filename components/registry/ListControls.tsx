"use client";

import { useEffect, useState } from "react";
import { Pressable } from "@/components/ui/Pressable";
import { Icon } from "@/components/ui/Icon";
import {
  REGISTRY_SORTS,
  REGISTRY_VIEWS,
  SORT_LABEL,
  isRegistrySort,
  type RegistrySort,
  type RegistryView,
} from "@/lib/registry";

const VIEW_KEY = "oyun-registry-view";
const SORT_KEY = "oyun-registry-sort";
const TAKEN_KEY = "oyun-registry-taken";

/**
 * How the reader wants to read it: grid or list, in what order, and whether
 * to bother showing what somebody has already taken.
 *
 * ── Why none of this is React state ──────────────────────────────────────
 * Every one of the three is an attribute on <html>, applied by a blocking
 * script at the top of the page before a single card exists in the document,
 * and read by CSS — see globals.css. This component sets the attribute,
 * remembers the choice, and shows which one is on.
 *
 * That buys three things. A reader who chose "list" and "cheapest first" last
 * week does not watch the page assemble itself the wrong way and then jump.
 * Changing the order moves the cards without re-rendering one of them, which
 * on a registry of a hundred things is the difference between instant and
 * visibly not. And with no JavaScript at all nothing here applies, leaving
 * the order the family arranged — which is the right fallback, since that is
 * the only order on the list that carries anybody's judgement.
 *
 * ── Why it renders nothing until it has read the attributes ──────────────
 * The server cannot know what is in this browser's storage. Guessing would
 * mean the wrong control looked active for a frame, which is precisely the
 * flicker the whole arrangement exists to avoid.
 */
export function ListControls({
  canSortByPrice,
  total,
  stillNeeded,
}: {
  canSortByPrice: boolean;
  /** How many are on the list, and how many nobody has taken yet. */
  total: number;
  stillNeeded: number;
}) {
  const [view, setView] = useState<RegistryView | null>(null);
  const [sort, setSort] = useState<RegistrySort | null>(null);
  const [hideTaken, setHideTaken] = useState<boolean | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    const read = (key: string): string | null => {
      try {
        return localStorage.getItem(key);
      } catch {
        return null;
      }
    };

    // The page's own script normally settles these before the first paint. If
    // it did not run — a soft navigation, a browser that blocked it — read
    // them here and apply them, so a control can never show one thing while
    // the list shows another.
    const v = root.getAttribute("data-rview");
    const nextView: RegistryView =
      v === "grid" || v === "list" ? v : read(VIEW_KEY) === "list" ? "list" : "grid";
    root.setAttribute("data-rview", nextView);
    setView(nextView);

    const s = root.getAttribute("data-sort");
    const storedSort = read(SORT_KEY);
    const nextSort: RegistrySort =
      s && isRegistrySort(s)
        ? s
        : storedSort && isRegistrySort(storedSort)
          ? storedSort
          : "needed";
    root.setAttribute("data-sort", nextSort);
    setSort(nextSort);

    const t = root.getAttribute("data-taken");
    const nextHide = t === "hide" || (t === null && read(TAKEN_KEY) === "hide");
    root.setAttribute("data-taken", nextHide ? "hide" : "show");
    setHideTaken(nextHide);
  }, []);

  function remember(key: string, value: string) {
    try {
      localStorage.setItem(key, value);
    } catch {
      /* A browser with storage switched off still gets the change, just not
         the memory of it. Never a reason to fail the tap. */
    }
  }

  function chooseView(next: RegistryView) {
    setView(next);
    document.documentElement.setAttribute("data-rview", next);
    remember(VIEW_KEY, next);
  }

  function chooseSort(next: RegistrySort) {
    setSort(next);
    document.documentElement.setAttribute("data-sort", next);
    remember(SORT_KEY, next);
  }

  function toggleTaken() {
    const next = !hideTaken;
    setHideTaken(next);
    document.documentElement.setAttribute("data-taken", next ? "hide" : "show");
    remember(TAKEN_KEY, next ? "hide" : "show");
  }

  // A price sort is only offered where there are prices to sort by. A control
  // that cannot change anything is worse than no control: the reader presses
  // it, nothing moves, and they stop trusting the rest of the page.
  const sorts = REGISTRY_SORTS.filter(
    (s) => canSortByPrice || (s !== "low" && s !== "high"),
  );
  const onPrice = sort === "low" || sort === "high";

  return (
    <div className="mt-6">
      {/*
        Both counts are rendered and CSS shows one, for the same reason as
        everything else on this page: a number that says "9 things" over six
        visible cards is worse than no number, and the alternative is asking
        React to recount on every tap.
      */}
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-[0.62rem] uppercase tracking-widest text-muted">
          <span className="reg-count-all">
            {total} {total === 1 ? "thing" : "things"} on the list
          </span>
          <span className="reg-count-left">
            {stillNeeded} still wanted of {total}
          </span>
        </p>

        <div
          role="group"
          aria-label="How the list is laid out"
          className="flex shrink-0 items-center gap-1"
        >
          {REGISTRY_VIEWS.map((v) => {
            const on = view === v;
            return (
              <Pressable
                key={v}
                press="none"
                type="button"
                onClick={() => chooseView(v)}
                aria-pressed={view === null ? undefined : on}
                aria-label={v === "grid" ? "Show as a grid" : "Show as a list"}
                title={v === "grid" ? "Grid" : "List"}
                className={`inline-flex h-11 w-11 items-center justify-center rounded-lg border transition-colors ${
                  on
                    ? "border-accent/50 bg-accent/[0.08] text-accent"
                    : "border-border text-muted hover:text-ink"
                }`}
              >
                <Icon name={v === "grid" ? "grid" : "rows"} size={16} aria-hidden />
              </Pressable>
            );
          })}
        </div>
      </div>

      {/* Two rows on purpose, measured rather than guessed. On a 393px phone
          the sort and the filter want 330px; sharing a line with the toggle
          left them 241px, so the filter dropped half-way onto a second line
          and read as an accident. The toggle sits with the count instead — it
          describes the whole list, as the count does — and the two controls
          that act on the list get the width to sit together. */}
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <label className="sr-only" htmlFor="reg-sort">
          What order to show them in
        </label>
        <select
          id="reg-sort"
          value={sort ?? "needed"}
          onChange={(e) => {
            const v = e.target.value;
            if (isRegistrySort(v)) chooseSort(v);
          }}
          className="min-h-11 rounded-lg border border-border bg-bg px-3 font-mono text-[0.62rem] uppercase tracking-widest text-muted focus:border-accent focus:outline-none"
        >
          {sorts.map((s) => (
            <option key={s} value={s}>
              {SORT_LABEL[s]}
            </option>
          ))}
        </select>

        <Pressable
          press="none"
          type="button"
          onClick={toggleTaken}
          aria-pressed={hideTaken === null ? undefined : hideTaken}
          className={`inline-flex min-h-11 items-center rounded-lg border px-3 font-mono text-[0.62rem] uppercase tracking-widest transition-colors ${
            hideTaken
              ? "border-accent/50 bg-accent/[0.08] text-accent"
              : "border-border text-muted hover:text-ink"
          }`}
        >
          Only what&rsquo;s left
        </Pressable>
      </div>

      {/* Said where the choice is made, not buried in a help page. A list
          holding both dirhams and naira sorted this way is sorted by the
          digits, and the page should not let anybody believe otherwise. */}
      {onPrice && (
        <p className="mt-2 prose-serif-xs text-muted">
          By the number written on each one. Nothing is converted between
          currencies, and anything without a number goes last.
        </p>
      )}
    </div>
  );
}
