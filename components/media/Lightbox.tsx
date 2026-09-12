"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { MediaItem } from "@/lib/feed-query";

const MAX_SCALE = 5;
const DOUBLE_TAP_SCALE = 2.5;

/**
 * Looking at a photograph — or a video — properly.
 *
 * The full frame on a dimmed ground, with a way back that is obvious. Escape
 * and the backdrop close it, arrow keys and a sideways swipe move through the
 * set, and the page behind is frozen so a stray drag doesn't carry the feed
 * away underneath.
 *
 * ── Pinch, pan, double tap ───────────────────────────────────────────────
 * A picture of a face is worth leaning into, and on a phone leaning in means
 * pinching. The browser's own pinch cannot help here: this is a fixed overlay,
 * so page zoom magnifies the whole screen and leaves the photograph exactly as
 * it was. So the gesture is handled here, on the frame itself. While zoomed a
 * drag pans instead of turning the page, and neither a pan nor a pinch is
 * mistaken for the tap that closes it.
 *
 * ── Why the bar is min-height and not height ─────────────────────────────
 * It carries `safe-top`, which is `padding-top: env(safe-area-inset-top)`. On
 * an iPhone that inset is around fifty pixels; with a fixed `h-14` and
 * border-box sizing it ate almost the whole bar, and the close and save
 * buttons were pushed out of it and under the status bar — present in the
 * markup, unreachable with a thumb. That is what "there is no way to close it"
 * looked like.
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
  const [loaded, setLoaded] = useState(false);
  const [zoom, setZoom] = useState({ scale: 1, x: 0, y: 0 });
  const [canShare, setCanShare] = useState(false);
  const [saving, setSaving] = useState<"idle" | "working" | "done" | "failed">(
    "idle",
  );

  // Live gesture state. Refs, not state: these change on every pointer move
  // and must not re-render the photograph mid-pinch.
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const start = useRef<{
    dist: number;
    scale: number;
    x: number;
    y: number;
    cx: number;
    cy: number;
  } | null>(null);
  const moved = useRef(0);
  const lastTap = useRef(0);
  const frame = useRef<HTMLDivElement | null>(null);

  const item = items[index];
  const zoomed = zoom.scale > 1.01;

  const reset = useCallback(() => setZoom({ scale: 1, x: 0, y: 0 }), []);

  const go = useCallback(
    (delta: number) => {
      if (items.length < 2) return;
      const next = (index + delta + items.length) % items.length;
      setLoaded(false);
      reset();
      onIndex(next);
    },
    [index, items.length, onIndex, reset],
  );

  useEffect(() => {
    function key(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "0") reset();
    }
    window.addEventListener("keydown", key);
    const had = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", key);
      document.body.style.overflow = had;
    };
  }, [go, onClose, reset]);

  // Can this device hand the picture to the photo library, the way a phone
  // expects? Checked once, because iOS has no download folder to save into.
  useEffect(() => {
    setCanShare(
      typeof navigator !== "undefined" && typeof navigator.share === "function",
    );
  }, []);

  useEffect(() => {
    const next = items[(index + 1) % items.length];
    if (!next || next.type !== "image") return;
    const img = new Image();
    img.src = next.url;
  }, [index, items]);

  /** Keep the picture from being dragged off the screen entirely. */
  const clamp = useCallback((scale: number, x: number, y: number) => {
    const box = frame.current?.getBoundingClientRect();
    const limitX = box ? (box.width * (scale - 1)) / 2 : 0;
    const limitY = box ? (box.height * (scale - 1)) / 2 : 0;
    return {
      scale,
      x: Math.max(-limitX, Math.min(limitX, x)),
      y: Math.max(-limitY, Math.min(limitY, y)),
    };
  }, []);

  const centreOf = () => {
    const ps = [...pointers.current.values()];
    const n = ps.length || 1;
    return {
      cx: ps.reduce((s, p) => s + p.x, 0) / n,
      cy: ps.reduce((s, p) => s + p.y, 0) / n,
    };
  };

  const spread = () => {
    const ps = [...pointers.current.values()];
    if (ps.length < 2) return 0;
    return Math.hypot(ps[0].x - ps[1].x, ps[0].y - ps[1].y);
  };

  function onPointerDown(e: React.PointerEvent) {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    moved.current = 0;
    const { cx, cy } = centreOf();
    start.current = {
      dist: spread(),
      scale: zoom.scale,
      x: zoom.x,
      y: zoom.y,
      cx,
      cy,
    };
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!pointers.current.has(e.pointerId)) return;
    const before = pointers.current.get(e.pointerId)!;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    moved.current += Math.abs(e.clientX - before.x) + Math.abs(e.clientY - before.y);
    const s = start.current;
    if (!s) return;

    if (pointers.current.size >= 2 && s.dist > 0) {
      // Pinching: scale about the point between the fingers.
      const ratio = spread() / s.dist;
      const scale = Math.max(1, Math.min(MAX_SCALE, s.scale * ratio));
      const { cx, cy } = centreOf();
      setZoom(clamp(scale, s.x + (cx - s.cx), s.y + (cy - s.cy)));
    } else if (pointers.current.size === 1 && zoomed) {
      // One finger while zoomed in is a pan, never a page turn.
      const { cx, cy } = centreOf();
      setZoom(clamp(zoom.scale, s.x + (cx - s.cx), s.y + (cy - s.cy)));
    }
  }

  function onPointerUp(e: React.PointerEvent) {
    const was = pointers.current.get(e.pointerId);
    pointers.current.delete(e.pointerId);

    // A flick sideways turns the page — but only at rest, so panning a zoomed
    // photograph never skips to the next one.
    if (!zoomed && was && start.current && pointers.current.size === 0) {
      const dx = e.clientX - start.current.cx;
      const dy = e.clientY - start.current.cy;
      if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.5) {
        go(dx < 0 ? 1 : -1);
        start.current = null;
        return;
      }
    }

    if (pointers.current.size === 0) {
      start.current = null;
      // A tap that did not travel: either a double tap to zoom, or — on the
      // ground around the picture — the way out.
      if (moved.current < 10) {
        const now = Date.now();
        const onPicture = (e.target as Element)?.closest?.("[data-frame]");
        if (onPicture) {
          if (now - lastTap.current < 300) {
            setZoom((z) =>
              z.scale > 1.01 ? { scale: 1, x: 0, y: 0 } : clamp(DOUBLE_TAP_SCALE, 0, 0),
            );
            lastTap.current = 0;
          } else {
            lastTap.current = now;
          }
        } else if (!zoomed) {
          onClose();
        }
      }
    }
  }

  /** Trackpad pinch and ctrl-scroll on a desktop. */
  function onWheel(e: React.WheelEvent) {
    if (!e.ctrlKey) return;
    const scale = Math.max(
      1,
      Math.min(MAX_SCALE, zoom.scale * (1 - e.deltaY / 200)),
    );
    setZoom(clamp(scale, zoom.x, zoom.y));
  }

  /**
   * Saving, the way each device actually does it.
   *
   * iOS has no downloads folder: a link with `download` opens the picture in a
   * tab and leaves the person to long-press it. The share sheet is the real
   * answer there — "Save Image" is the first thing in it — so we hand over the
   * file itself where the browser will take one, and fall back to a plain
   * download everywhere else.
   */
  async function save() {
    if (!item) return;
    setSaving("working");
    const name = item.url.split("/").pop()?.split("?")[0] || "photo";
    try {
      if (canShare) {
        const res = await fetch(item.url);
        const blob = await res.blob();
        const file = new File([blob], name, { type: blob.type });
        // Not every browser that has share() will take a file.
        if (navigator.canShare?.({ files: [file] })) {
          await navigator.share({ files: [file] });
          setSaving("done");
          return;
        }
      }
      const a = document.createElement("a");
      a.href = `${item.url}?download=1`;
      a.download = name;
      a.rel = "noopener";
      a.target = "_blank";
      document.body.appendChild(a);
      a.click();
      a.remove();
      setSaving("done");
    } catch (err) {
      // A share the person dismissed is not a failure worth shouting about.
      const aborted = err instanceof Error && err.name === "AbortError";
      setSaving(aborted ? "idle" : "failed");
    } finally {
      setTimeout(() => setSaving("idle"), 2500);
    }
  }

  if (!item) return null;

  const chip =
    "grid h-11 w-11 place-items-center rounded-full bg-black/45 text-white/85 backdrop-blur-sm transition-colors hover:bg-white/20 hover:text-white active:bg-white/25";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={item.type === "video" ? "Video" : "Photograph"}
      className="fixed inset-0 z-[80] flex flex-col bg-black/92 backdrop-blur-sm"
    >
      {/* The bar. min-h, never h: it also carries the safe-area inset, and a
          fixed height would swallow the buttons under the status bar. */}
      <div className="flex min-h-14 flex-none items-center justify-between gap-4 px-3 safe-top sm:px-6">
        <p className="font-mono text-[0.68rem] uppercase tracking-widest text-white/55">
          {items.length > 1 ? `${index + 1} of ${items.length}` : ""}
        </p>
        <div className="flex items-center gap-2">
          {zoomed && (
            <button
              type="button"
              onClick={reset}
              aria-label="Fit to screen"
              className={`${chip} font-mono text-[0.6rem]`}
            >
              1:1
            </button>
          )}
          {item.type === "image" && (
            <button
              type="button"
              onClick={save}
              disabled={saving === "working"}
              aria-label={canShare ? "Share or save this photo" : "Save this photo"}
              className={`${chip} font-mono text-base disabled:opacity-50`}
            >
              {saving === "working" ? "…" : saving === "failed" ? "!" : "↓"}
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className={`${chip} font-mono text-lg`}
          >
            ✕
          </button>
        </div>
      </div>

      {/* The frame. touch-action: none so the gestures are ours to read. */}
      <div
        ref={frame}
        data-frame
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onWheel={onWheel}
        className="flex min-h-0 flex-1 touch-none select-none items-center justify-center overflow-hidden px-3 pb-4 sm:px-14"
      >
        {item.type === "video" ? (
          <video
            key={item.url}
            src={item.url}
            controls
            autoPlay
            playsInline
            className="max-h-full max-w-full rounded-lg"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={item.url}
            src={item.url}
            alt=""
            draggable={false}
            onLoad={() => setLoaded(true)}
            style={{
              transform: `translate(${zoom.x}px, ${zoom.y}px) scale(${zoom.scale})`,
              transition: pointers.current.size ? "none" : "transform 180ms ease-out",
            }}
            className={`max-h-full max-w-full rounded-lg object-contain ${
              loaded ? "opacity-100" : "opacity-0"
            }`}
          />
        )}
      </div>

      {/* How it works, once, quietly — and out of the way when zoomed in. */}
      {item.type === "image" && !zoomed && (
        <p className="pointer-events-none absolute inset-x-0 bottom-0 pb-3 text-center font-mono text-[0.6rem] text-white/35 safe-bottom">
          Pinch or double-tap to zoom
          {items.length > 1 ? " · swipe for the next" : ""}
        </p>
      )}

      {items.length > 1 && !zoomed && (
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
              onClick={() => go(delta)}
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
