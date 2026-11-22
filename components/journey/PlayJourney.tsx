"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import type { PlayEntry } from "@/components/journey/JourneyPlayer";

// Loaded only when somebody presses play: the page itself carries none of it.
const JourneyPlayer = dynamic(() => import("@/components/journey/JourneyPlayer").then((m) => m.JourneyPlayer), { ssr: false });

/** "Play the journey" — opens the player. `autoOpen` when arriving from the home screen's play button. */
export function PlayJourney({ entries, count = 1, autoOpen = false }: { entries: PlayEntry[]; count?: number; autoOpen?: boolean }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (autoOpen && entries.length > 0) setOpen(true);
  }, [autoOpen, entries.length]);
  if (entries.length === 0) return null;
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group relative inline-flex min-h-12 items-center gap-3 overflow-hidden rounded-full bg-gradient-to-r from-[#b8742d] via-[#d9914a] to-[#efb35c] py-2 pl-2 pr-5 font-mono text-sm text-white shadow-[0_10px_30px_-10px_rgba(154,90,34,0.8)] transition-transform active:scale-[0.98]"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/25 text-base">▶</span>
        Play the journey
      </button>
      {open && (
        <JourneyPlayer
          entries={entries}
          count={count}
          onClose={() => {
            setOpen(false);
            // Arrived with ?play=1: leave the page as a plain page behind.
            if (autoOpen && typeof window !== "undefined") window.history.replaceState(null, "", window.location.pathname);
          }}
        />
      )}
    </>
  );
}
