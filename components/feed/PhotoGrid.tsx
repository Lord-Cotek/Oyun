"use client";

import { useState } from "react";
import { Lightbox } from "@/components/media/Lightbox";
import type { MediaItem } from "@/lib/feed-query";
import { mediaAlt } from "@/lib/alt";

export type GridPost = {
  id: string;
  body: string;
  author: string;
  when: string;
  media: MediaItem[];
};

/**
 * Every photograph and film from the entries this person can already see,
 * as a grid — for the grandparent who came for the pictures. Built from the
 * same feed the diary reads, so nothing appears here that the diary would
 * not show them. Tap one to see it large and move through the rest.
 */
export function PhotoGrid({ posts }: { posts: GridPost[] }) {
  const items: { m: MediaItem; alt: string }[] = [];
  for (const p of posts) {
    p.media.forEach((m, i) =>
      items.push({
        m,
        alt: mediaAlt({ said: p.body, author: p.author, when: p.when, index: i + 1, total: p.media.length, isVideo: m.type === "video" }),
      }),
    );
  }
  const [open, setOpen] = useState<number | null>(null);

  if (items.length === 0) {
    return <p className="prose-serif-sm text-muted">No photographs here yet.</p>;
  }

  return (
    <>
      <ul className="grid grid-cols-3 gap-1.5 sm:grid-cols-4 md:gap-2">
        {items.map(({ m, alt }, i) => (
          <li key={`${m.url}-${i}`}>
            <button
              type="button"
              onClick={() => setOpen(i)}
              aria-label={`Open: ${alt}`}
              className="relative block aspect-square w-full overflow-hidden rounded-lg border border-border bg-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
            >
              {m.type === "video" && !m.poster ? (
                <span className="flex h-full w-full items-center justify-center font-mono text-xs text-muted">▶ Film</span>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={m.type === "video" ? m.poster : m.url} alt="" loading="lazy" className="h-full w-full object-cover" />
              )}
              {m.type === "video" && (
                <span aria-hidden className="absolute bottom-1 right-1 rounded bg-black/60 px-1.5 py-0.5 font-mono text-[0.6rem] text-white">
                  ▶
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>
      {open !== null && (
        <Lightbox
          items={items.map((x) => x.m)}
          alts={items.map((x) => x.alt)}
          index={open}
          onIndex={setOpen}
          onClose={() => setOpen(null)}
        />
      )}
    </>
  );
}
