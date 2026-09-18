"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A number that counts up the first time it scrolls into view.
 *
 * ── The number is data, and the animation may not outvote it ──────────────
 * It used to hold `0` in state and only reach the real figure if an
 * IntersectionObserver fired. Two things followed, both bad.
 *
 * The first: the server-rendered HTML said `0`. Before hydration, with
 * JavaScript off, or anywhere the observer did not fire, the page stated a
 * figure that was untrue. For "how many catechism questions has this child
 * learned", a confident wrong number is far worse than no animation.
 *
 * The second is the one people actually hit. A `started` flag latched true
 * after the first run and the callback returned early ever after — so a value
 * that CHANGED was ignored. Tick a catechism question, the page revalidates,
 * the prop goes 0 → 1, and the ring went on saying 0 while the tracker
 * underneath it said 1 of 55. Only a full reload made the page agree with
 * itself. The same held for every stat pill, and for the worship ring after
 * sealing a day.
 *
 * So the real figure is now the initial state, the resting state, and where
 * any change goes at once. The count-up is laid over the top: it can delay the
 * truth, never replace it.
 *
 * ── Why it does not count up when it is already on screen ────────────────
 * The server has already painted the real number, so a count-up from zero has
 * to drop back to zero first — a visible flinch on a figure you were already
 * reading. The flourish belongs to something arriving as you scroll to it,
 * which is exactly where it costs nothing. Already in view at mount: no
 * animation, just the number.
 */
export function AnimatedNumber({
  value,
  duration = 1100,
  className = "",
}: {
  value: number;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  /** The newest figure, readable from inside a running animation. */
  const latest = useRef(value);
  /** True only while the count-up is driving the display. */
  const animating = useRef(false);
  const frame = useRef<number | null>(null);
  // The truth, from the very first render — the server's included.
  const [display, setDisplay] = useState(value);

  // Follow the value whenever it changes. The one exception is mid-animation,
  // where the count-up is driving and reads `latest`, so it lands on the new
  // figure rather than the one it set off towards.
  useEffect(() => {
    latest.current = value;
    if (!animating.current) setDisplay(value);
  }, [value]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return; // the real number is already on screen

    // Already in view: it has been read. Do not flinch it back to zero.
    const box = el.getBoundingClientRect();
    if (box.bottom > 0 && box.top < (window.innerHeight || 0) && box.height > 0) {
      return;
    }

    const run = () => {
      animating.current = true;
      const t0 = performance.now();
      setDisplay(0);
      const tick = (now: number) => {
        const p = Math.min(1, (now - t0) / duration);
        const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
        setDisplay(Math.round(eased * latest.current));
        if (p < 1) {
          frame.current = requestAnimationFrame(tick);
        } else {
          animating.current = false;
          setDisplay(latest.current); // whatever it has become by now
        }
      };
      frame.current = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        run();
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (frame.current) cancelAnimationFrame(frame.current);
      animating.current = false;
    };
  }, [duration]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
