"use client";

import { useEffect, useState } from "react";
import { Pressable } from "@/components/ui/Pressable";
import { Icon } from "@/components/ui/Icon";
import { REGISTRY_VIEWS, type RegistryView } from "@/lib/registry";

const STORAGE_KEY = "oyun-registry-view";

/**
 * Grid or list, for whoever is reading.
 *
 * ── Why this changes an attribute and not a piece of React state ─────────
 * Because the layout is CSS reading `data-rview` on <html> — see globals.css
 * — and the choice is applied by a blocking script in the page before the
 * first paint. That is the same arrangement as the theme, and it is the only
 * one where a reader who chose "list" last week does not watch a grid appear
 * and rearrange itself.
 *
 * So this component owns no layout. It flips the attribute, remembers the
 * choice, and shows which one is on.
 *
 * ── Why it renders nothing until it has read the attribute ───────────────
 * The server does not know what is in this browser's storage. Rendering a
 * guess would mean the wrong button looked pressed for one frame, which is
 * exactly the flicker the whole arrangement exists to avoid.
 */
export function ViewToggle() {
  const [view, setView] = useState<RegistryView | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    const set = root.getAttribute("data-rview");
    if (set === "grid" || set === "list") {
      setView(set);
      return;
    }
    // The page's own script normally settles this before the first paint. If
    // it did not run — a soft navigation, a browser that blocked it — read
    // the choice here instead and apply it, so the toggle can never end up
    // showing one thing while the page shows another.
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch {
      /* storage may be unavailable */
    }
    const now: RegistryView = stored === "list" ? "list" : "grid";
    root.setAttribute("data-rview", now);
    setView(now);
  }, []);

  function choose(next: RegistryView) {
    setView(next);
    document.documentElement.setAttribute("data-rview", next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* A browser with storage switched off still gets the change, just not
         the memory of it. Never a reason to fail the tap. */
    }
  }

  return (
    <div
      role="group"
      aria-label="How the list is laid out"
      className="flex items-center gap-1"
    >
      {REGISTRY_VIEWS.map((v) => {
        const on = view === v;
        return (
          <Pressable
            key={v}
            press="none"
            type="button"
            onClick={() => choose(v)}
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
  );
}
