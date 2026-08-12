"use client";

import { useCallback, useEffect } from "react";
import { useState } from "react";

/**
 * A gallery of photo thumbnails that open into a full-screen lightbox on tap —
 * with prev/next, a counter, backdrop-to-close, and keyboard control (Esc, ← →).
 * Used for milestone ("firsts") attachments so they're easy to actually look at.
 */
export function PhotoGallery({
  urls,
  alt,
  thumbClassName = "h-28 w-28 sm:h-32 sm:w-32",
}: {
  urls: string[];
  alt: string;
  thumbClassName?: string;
}) {
  const [open, setOpen] = useState<number | null>(null);

  const close = useCallback(() => setOpen(null), []);
  const go = useCallback(
    (dir: number) =>
      setOpen((i) => (i === null ? i : (i + dir + urls.length) % urls.length)),
    [urls.length],
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, close, go]);

  if (urls.length === 0) return null;

  return (
    <>
      <div className="mt-2 flex flex-wrap gap-2">
        {urls.map((url, i) => (
          <button
            key={url}
            type="button"
            onClick={() => setOpen(i)}
            aria-label="View photo"
            className={`group relative overflow-hidden rounded-lg border border-border ${thumbClassName}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt={alt}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <span className="pointer-events-none absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
          </button>
        ))}
      </div>

      {open !== null && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={close}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm animate-fade-up"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={urls[open]}
            alt={alt}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[88dvh] max-w-full rounded-lg object-contain shadow-2xl"
          />

          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-lg text-white transition-colors hover:bg-white/20"
          >
            ✕
          </button>

          {urls.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  go(-1);
                }}
                aria-label="Previous photo"
                className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-2xl text-white transition-colors hover:bg-white/20 sm:left-6"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  go(1);
                }}
                aria-label="Next photo"
                className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-2xl text-white transition-colors hover:bg-white/20 sm:right-6"
              >
                ›
              </button>
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 font-mono text-[0.7rem] text-white">
                {open + 1} / {urls.length}
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
