"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { switchJourney } from "@/app/journey/switch-actions";

type JourneyItem = {
  id: string;
  label: string;
  role: string;
  isOwner: boolean;
};

const ROLE_LABEL: Record<string, string> = {
  MOTHER: "Your journey",
  PARTNER: "Partner",
  ACCOUNTABILITY: "Accountability",
};

export function JourneySwitcher({
  journeys,
  activeId,
  canStartOwn,
}: {
  journeys: JourneyItem[];
  activeId: string | null;
  canStartOwn: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [, start] = useTransition();
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  // Nothing to offer: a single journey they own → the brand already says it.
  if (journeys.length <= 1 && !canStartOwn) return null;

  const active = journeys.find((j) => j.id === activeId) ?? journeys[0];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex max-w-[9rem] items-center gap-1 rounded-lg border border-border bg-surface px-2.5 py-1.5 font-mono text-xs text-ink transition-colors hover:border-accent sm:max-w-[12rem]"
      >
        <span className="truncate">{active?.label ?? "Journey"}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 z-50 mt-2 w-64 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-border bg-surface shadow-2xl">
          <p className="border-b border-border px-4 py-2.5 font-mono text-[0.6rem] uppercase tracking-widest text-muted">
            Your journeys
          </p>
          <ul className="max-h-72 overflow-y-auto py-1">
            {journeys.map((j) => (
              <li key={j.id}>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    if (j.id !== activeId) start(() => switchJourney(j.id));
                  }}
                  className={`flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left transition-colors hover:bg-bg ${
                    j.id === activeId ? "bg-accent/[0.06]" : ""
                  }`}
                >
                  <span className="min-w-0">
                    <span className="block truncate font-mono text-sm text-ink">
                      {j.label}
                    </span>
                    <span className="font-mono text-[0.6rem] uppercase tracking-widest text-muted">
                      {j.isOwner ? "Your journey" : ROLE_LABEL[j.role] ?? j.role}
                    </span>
                  </span>
                  {j.id === activeId && (
                    <span className="shrink-0 font-mono text-[0.6rem] text-accent">✓</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
          {canStartOwn && (
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                router.push("/onboarding");
              }}
              className="block w-full border-t border-border px-4 py-3 text-left font-mono text-xs text-accent transition-colors hover:bg-bg"
            >
              + Start your own journey
            </button>
          )}
        </div>
      )}
    </div>
  );
}
