"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { MediaItem } from "@/lib/feed-query";

/**
 * Looking at a photograph — or a video — properly.
 *
 * Tapping a picture in the feed used to do nothing. This is the rest of that
 * gesture: the full frame, on a dimmed ground, with a way back that is
 * obvious. Escape and the backdrop close it, arrow keys and a sideways swipe
 * move through the set, and the page behind is frozen so a stray drag doesn't
 * carry the feed away underneath. Nothing is scaled past its own size.
 *
 * Videos live here too, playing with their own controls, so one gesture works
 * for everything in a post rather than photographs behaving one way and a clip
 * another.
 */
export function Lightbox({
  items,
  index,
  onClose,
  onIndex,
}: {
  items: MediaItem[];
  index: number;
  onClose: () => void;
  onIndex: (next: number) => void;
}) {
  const touch = useRef<{ x: number; y: number } | null>(null);
  const [loaded, setLoaded] = useState(false);

  const go = useCallback(
    (delta: number) => {
      if (items.length < 2) return;
      const next = (index + delta + items.length) % items.length;
      setLoaded(false);
      onIndex(next);
    },
    [index, items.length, onIndex],
  );

  useEffect(() => {
    function key(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    }
    window.addEventListener("keydown", key);
    // The feed behind must not scroll while this is open.
    const had = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", key);
      document.body.style.overflow = had;
    };
  }, [go, onClose]);

  // Fetch the next photograph while this one is being looked at, so moving
  // through a set doesn't flash between every frame.
  useEffect(() => {
    const next = items[(index + 1) % items.length];
    if (!next || next.type !== "image") return;
    const img = new Image();
    img.src = next.url;
  }, [index, items]);

  const item = items[index];
  if (!item) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={item.type === "video" ? "Video" : "Photograph"}
      onClick={onClose}
      onTouchStart={(e) => {
        touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }}
      onTouchEnd={(e) => {
        if (!touch.current) return;
        const dx = e.changedTouches[0].clientX - touch.current.x;
        const dy = e.changedTouches[0].clientY - touch.current.y;
        touch.current = null;
        // Sideways only — a vertical flick is someone trying to scroll.
        if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.5) {
          go(dx < 0 ? 1 : -1);
        }
      }}
      className="fixed inset-0 z-[80] flex flex-col bg-black/92 backdrop-blur-sm"
    >
      {/* Bar */}
      <div className="flex h-14 flex-none items-center justify-between gap-4 px-4 safe-top sm:px-6">
        <p className="font-mono text-[0.68rem] uppercase tracking-widest text-white/55">
          {items.length > 1 ? `${index + 1} of ${items.length}` : ""}
        </p>
        <div className="flex items-center gap-1">
          <a
            href={`${item.url}?download=1`}
            onClick={(e) => e.stopPropagation()}
            aria-label="Save this"
            className="grid h-10 w-10 place-items-center rounded-full font-mono text-base text-white/60 transition-colors hover:bg-white/10 hover:text-white"
          >
            ↓
          </a>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-10 w-10 place-items-center rounded-full font-mono text-lg text-white/60 transition-colors hover:bg-white/10 hover:text-white"
          >
            ✕
          </button>
        </div>
      </div>

      {/* The frame */}
      <div className="flex min-h-0 flex-1 items-center justify-center px-3 pb-4 sm:px-14">
        {item.type === "video" ? (
          <video
            key={item.url}
            src={item.url}
            controls
            autoPlay
            playsInline
            onClick={(e) => e.stopPropagation()}
            className="max-h-full max-w-full rounded-lg"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={item.url}
            src={item.url}
            alt=""
            onClick={(e) => e.stopPropagation()}
            onLoad={() => setLoaded(true)}
            className={`max-h-full max-w-full rounded-lg object-contain transition-opacity duration-300 ${
              loaded ? "opacity-100" : "opacity-0"
            }`}
          />
        )}
      </div>

      {/* Moving through them */}
      {items.length > 1 && (
        <>
          {(
            [
              ["left", -1, "‹"],
              ["right", 1, "›"],
            ] as const
          ).map(([side, delta, glyph]) => (
            <button
              key={side}
              type="button"
              aria-label={delta < 0 ? "Previous" : "Next"}
              onClick={(e) => {
                e.stopPropagation();
                go(delta);
              }}
              className={`absolute top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full font-serif text-3xl leading-none text-white/55 transition-colors hover:bg-white/10 hover:text-white ${
                side === "left" ? "left-1 sm:left-3" : "right-1 sm:right-3"
              }`}
            >
              {glyph}
            </button>
          ))}
        </>
      )}
    </div>
  );
}
