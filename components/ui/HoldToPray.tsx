"use client";

import { useRef, useState, useTransition } from "react";

/**
 * Prayer as an act, not a click. Press and *hold* — a warm ember fills as you
 * dwell; let go early and it recedes, nothing counted. Hold to the end and the
 * prayer is recorded, the ember stays lit, and (on a phone) a soft haptic
 * confirms it. Keyboard users press Enter/Space to pray at once.
 *
 * `action` is the server action that records the prayer (e.g. prayForRequest /
 * togglePray, already bound to the request id).
 */
export function HoldToPray({
  prayed,
  count,
  action,
  holdMs = 1100,
}: {
  prayed: boolean;
  count: number;
  action: () => Promise<void>;
  holdMs?: number;
}) {
  const [progress, setProgress] = useState(prayed ? 1 : 0);
  const [done, setDone] = useState(prayed);
  const [holding, setHolding] = useState(false);
  const [bloom, setBloom] = useState(false);
  const [c, setC] = useState(count);
  const [pending, start] = useTransition();

  const raf = useRef<number | null>(null);
  const t0 = useRef(0);
  const active = useRef(false);

  function finish() {
    if (raf.current) cancelAnimationFrame(raf.current);
    active.current = false;
    setHolding(false);
    setDone(true);
    setProgress(1);
    setBloom(true);
    setC((n) => n + 1);
    try {
      navigator.vibrate?.(18);
    } catch {
      /* no haptics here */
    }
    setTimeout(() => setBloom(false), 1400);
    start(async () => {
      try {
        await action();
      } catch {
        /* server reconciles on next load */
      }
    });
  }

  function tick(now: number) {
    if (!active.current) return;
    const p = Math.min(1, (now - t0.current) / holdMs);
    setProgress(p);
    if (p >= 1) finish();
    else raf.current = requestAnimationFrame(tick);
  }

  function begin(e: React.PointerEvent) {
    if (done || pending) return;
    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    active.current = true;
    setHolding(true);
    t0.current = performance.now();
    raf.current = requestAnimationFrame(tick);
  }
  function cancel() {
    if (!active.current || done) return;
    active.current = false;
    setHolding(false);
    if (raf.current) cancelAnimationFrame(raf.current);
    setProgress(0); // eases back via the CSS transition
  }

  return (
    <button
      type="button"
      disabled={pending}
      onPointerDown={begin}
      onPointerUp={cancel}
      onPointerLeave={cancel}
      onPointerCancel={cancel}
      onContextMenu={(e) => e.preventDefault()}
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === " ") && !done && !pending) {
          e.preventDefault();
          finish();
        }
      }}
      aria-pressed={done}
      aria-label={done ? "You are praying for this" : "Hold to pray"}
      style={{ touchAction: "none" }}
      className={`group relative select-none overflow-hidden rounded-full border px-4 py-2 font-mono text-xs transition-colors disabled:opacity-70 ${
        done
          ? "border-accent/50 text-accent"
          : "border-border text-ink hover:border-accent"
      } ${done && !holding ? "animate-pulse-soft" : ""}`}
    >
      {/* the ember filling as you dwell */}
      <span
        aria-hidden
        className={`absolute inset-y-0 left-0 bg-gradient-to-r from-accent2/40 to-accent/55 ${
          holding ? "" : "transition-[width] duration-500 ease-out"
        }`}
        style={{ width: `${progress * 100}%` }}
      />
      {/* bloom of light the moment it's sealed */}
      {bloom && (
        <span
          aria-hidden
          className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/50"
          style={{ animation: "pray-bloom 1.3s ease-out forwards" }}
        />
      )}
      <span className="relative flex items-center gap-2">
        <Flame lit={done || progress > 0.02} />
        <span>
          {done
            ? `Praying${c > 0 ? ` · ${c}` : ""}`
            : holding
              ? "Praying…"
              : "Hold to pray"}
        </span>
      </span>

      <style>{`
        @keyframes pray-bloom {
          0% { transform: translate(-50%,-50%) scale(1); opacity: 0.6; }
          100% { transform: translate(-50%,-50%) scale(16); opacity: 0; }
        }
      `}</style>
    </button>
  );
}

function Flame({ lit }: { lit: boolean }) {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill={lit ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={lit ? "text-accent" : "text-muted"}
      aria-hidden
    >
      <path d="M12 3c1.2 3 4 4.2 4 7.8A4 4 0 0 1 8 11c0-1.8 1-3 2.2-4 .3 1.8 1.8 2 1.8 3.4 0 .8-.4 1.2-.4 1.2" />
    </svg>
  );
}
