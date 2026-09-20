"use client";

import { useState } from "react";
import { Lightbox } from "@/components/media/Lightbox";
import type { MediaItem } from "@/lib/feed-query";

/**
 * The photographs and videos on a shared post.
 *
 * ── Why this is not just a grid of <img> ─────────────────────────────────
 * It was, and it meant the one thing the link exists for was the one thing
 * you could not do properly. A grandmother sent a scan photograph got a
 * postage stamp in a two-column grid, cropped square by `object-cover`, with
 * no way to make it bigger — while the family who sent it could tap the same
 * picture in the app and see the whole of it. The person the link was made
 * for had the worst view of it of anybody.
 *
 * So the same Lightbox the app uses: tap to open, pinch and double-tap to
 * zoom, swipe or arrow between them, escape or the backdrop to come back.
 *
 * ── The video already played; it just did not look like it would ─────────
 * `controls` was there from the start, so a video was always playable. What
 * was missing was any sign of it before you touched the thing — no poster
 * frame, nothing to say which of these squares moves. `preload="metadata"`
 * makes the browser fetch enough to draw the first frame, and the label in
 * the corner says so outright, because an ambiguous tap target on somebody
 * else's phone is a tap that never happens.
 */
export function SharedMedia({
  media,
  alt,
}: {
  media: MediaItem[];
  /** What these are, in one phrase — "Shared by Amara and Chidi". */
  alt: string;
}) {
  const [at, setAt] = useState<number | null>(null);
  if (media.length === 0) return null;

  const one = media.length === 1;

  return (
    <>
      <div className={`mt-5 grid gap-2 ${one ? "grid-cols-1" : "grid-cols-2"}`}>
        {media.map((m, i) =>
          m.type === "video" ? (
            <div key={i} className="relative overflow-hidden rounded-xl bg-bg">
              <video
                src={m.url}
                controls
                playsInline
                preload="metadata"
                className="w-full"
              />
              <span
                aria-hidden
                className="pointer-events-none absolute left-2 top-2 rounded-md bg-ink/70 px-2 py-0.5 font-mono text-[0.58rem] uppercase tracking-widest text-bg"
              >
                Video
              </span>
            </div>
          ) : (
            <button
              key={i}
              type="button"
              onClick={() => setAt(i)}
              aria-label={`${alt} — open picture ${i + 1} of ${media.length}`}
              className="group relative overflow-hidden rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={m.url}
                alt={alt}
                // `contain` on a lone picture: a single scan photograph cropped
                // to a square by `cover` loses the head, which is the picture.
                // In a grid of several, `cover` is right — even edges matter
                // more than any one crop.
                className={
                  one
                    ? "max-h-[70vh] w-full object-contain"
                    : "aspect-square w-full object-cover transition-transform group-hover:scale-[1.02]"
                }
              />
            </button>
          ),
        )}
      </div>

      {at !== null && (
        <Lightbox
          items={media}
          alts={media.map(() => alt)}
          index={at}
          onIndex={setAt}
          onClose={() => setAt(null)}
        />
      )}
    </>
  );
}
