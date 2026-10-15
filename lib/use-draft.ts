"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Keeping what somebody is in the middle of writing.
 *
 * The family diary already did this: a phone that kills the tab while the
 * camera is open used to lose the post, so the words are written to the device
 * as they are typed and put back when the app returns. Everywhere else — the
 * letter to the baby, the note on a chapter, how the day actually went, typed
 * one-handed at 3am — a lost tab was a lost evening.
 *
 * This is that same idea, pulled out of the feed so any box can have it.
 *
 * What it promises, exactly
 * ────────────────────────
 *  - The text is on THIS device and nowhere else. It is not synced, not sent,
 *    and not visible to anybody else in the house — a half-written letter is
 *    nobody's business until it is finished.
 *  - It is dropped after TTL, so a draft abandoned last spring does not
 *    reappear under somebody's cursor a year later.
 *  - `clear()` is called by the caller on a successful save. Nothing here can
 *    tell whether a save worked, so nothing here guesses.
 *
 * Storage can throw — a private window, cleared site data, a browser with
 * storage switched off — so every call is guarded and a failure degrades to
 * "no draft kept" rather than a broken form.
 */

/** After this long a kept draft is stale and dropped rather than restored. */
export const DRAFT_TTL = 24 * 60 * 60 * 1000;

interface Stored {
  body: string;
  at: number;
}

function read(key: string, ttl: number): string | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const d = JSON.parse(raw) as Stored;
    if (!d?.body?.trim()) return null;
    if (Date.now() - (d.at ?? 0) > ttl) {
      localStorage.removeItem(key);
      return null;
    }
    return d.body;
  } catch {
    return null;
  }
}

export interface KeptDraft {
  /** The current text. Empty until the effect has run, so SSR is stable. */
  value: string;
  setValue: (next: string) => void;
  /** Call on a successful save. Nothing here can tell on its own. */
  clear: () => void;
  /** True when this text came back from a previous session, so a caller can say so. */
  restored: boolean;
}

export function useKeptDraft(key: string, ttl = DRAFT_TTL): KeptDraft {
  const [value, setValueRaw] = useState("");
  const [restored, setRestored] = useState(false);
  // The first render must match the server's, so the restore happens after
  // mount and is deliberately not part of the initial state.
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;
    const kept = read(key, ttl);
    if (kept) {
      setValueRaw(kept);
      setRestored(true);
    }
  }, [key, ttl]);

  const setValue = useCallback(
    (next: string) => {
      setValueRaw(next);
      // Once they have touched it, it is theirs again rather than a restored
      // thing being shown back to them.
      setRestored(false);
      try {
        if (next.trim()) {
          localStorage.setItem(
            key,
            JSON.stringify({ body: next, at: Date.now() } satisfies Stored),
          );
        } else {
          localStorage.removeItem(key);
        }
      } catch {
        // No storage available. The box still works; it just will not survive
        // a closed tab, which is the situation we were in before this existed.
      }
    },
    [key],
  );

  const clear = useCallback(() => {
    setValueRaw("");
    setRestored(false);
    try {
      localStorage.removeItem(key);
    } catch {
      /* see above */
    }
  }, [key]);

  return { value, setValue, clear, restored };
}

/**
 * The line a box shows when text has come back from a previous session.
 *
 * Worth saying out loud: somebody who opens a letter form and finds words
 * already in it should know they are their own from last time, not a template
 * and not somebody else's.
 */
export const RESTORED_NOTE = "Picked up where you left off — this was kept on this device.";
