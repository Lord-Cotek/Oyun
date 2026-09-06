/**
 * Sharing helpers. A shared link points to a public page that renders the
 * passage from the World English Bible (public domain — safe to publish and to
 * quote outward, unlike the in-app curated translations), with a clear route
 * back to the app. Every shared verse becomes a small invitation.
 *
 * Share slug form: `<bookSlug>-<chapter>[-<verse>[-<verseEnd>]]`
 *   John 3:16      -> john-3-16
 *   Deut 6:6-7     -> deuteronomy-6-6-7
 *   John 4 (chap)  -> john-4
 * Book slugs never contain "-", so the split is unambiguous.
 */
import { BOOKS, bookBySlug, getChapter } from "./bible";

export interface ParsedRef {
  slug: string;
  chapter: number;
  verseStart?: number;
  verseEnd?: number;
}

// name (lowercased) -> book slug, with a couple of gentle aliases.
const NAME_TO_SLUG = new Map<string, string>();
for (const b of BOOKS) NAME_TO_SLUG.set(b.name.toLowerCase(), b.slug);
NAME_TO_SLUG.set("psalm", "psalms");
NAME_TO_SLUG.set("song of songs", "songofsolomon");
NAME_TO_SLUG.set("canticles", "songofsolomon");

/** Parse a human reference like "Philippians 3:8" or "Deuteronomy 6:6-7". */
export function parseRef(ref: string): ParsedRef | null {
  const m = ref
    .trim()
    .match(/^(.+?)\s+(\d+)(?::(\d+)(?:\s*[-–]\s*(\d+))?)?$/);
  if (!m) return null;
  const slug = NAME_TO_SLUG.get(m[1].trim().toLowerCase());
  if (!slug) return null;
  const chapter = parseInt(m[2], 10);
  const verseStart = m[3] ? parseInt(m[3], 10) : undefined;
  const verseEnd = m[4] ? parseInt(m[4], 10) : undefined;
  return { slug, chapter, verseStart, verseEnd };
}

/** A URL slug for a parsed reference. */
export function refToSlug(p: ParsedRef): string {
  let s = `${p.slug}-${p.chapter}`;
  if (p.verseStart) {
    s += `-${p.verseStart}`;
    if (p.verseEnd && p.verseEnd !== p.verseStart) s += `-${p.verseEnd}`;
  }
  return s;
}

/** Convenience: reference string straight to a URL slug (or null). */
export function shareSlug(ref: string): string | null {
  const p = parseRef(ref);
  return p ? refToSlug(p) : null;
}

/** Parse a share slug back into a reference. */
export function parseSlug(slug: string): ParsedRef | null {
  const parts = slug.split("-");
  if (parts.length < 2) return null;
  const [bookSlug, chStr, vStr, vEndStr] = parts;
  if (!bookBySlug(bookSlug)) return null;
  const chapter = parseInt(chStr, 10);
  if (!chapter || Number.isNaN(chapter)) return null;
  const verseStart = vStr ? parseInt(vStr, 10) : undefined;
  const verseEnd = vEndStr ? parseInt(vEndStr, 10) : undefined;
  if (vStr && !verseStart) return null;
  return { slug: bookSlug, chapter, verseStart, verseEnd };
}

/** Display reference, e.g. "John 3:16" or "Deuteronomy 6:6-7" or "Psalms 23". */
export function displayRef(p: ParsedRef): string {
  const name = bookBySlug(p.slug)?.name ?? p.slug;
  let r = `${name} ${p.chapter}`;
  if (p.verseStart) {
    r += `:${p.verseStart}`;
    if (p.verseEnd && p.verseEnd !== p.verseStart) r += `-${p.verseEnd}`;
  }
  return r;
}

export interface ShareVerse {
  ref: string;
  /** The passage text (WEB). For a whole chapter, verses are numbered. */
  text: string;
  /** A short quote for cards/share text — the first verse when it's a chapter. */
  quote: string;
  wholeChapter: boolean;
}

/** Load the WEB text for a parsed reference (server-side). */
export async function getShareVerse(p: ParsedRef): Promise<ShareVerse | null> {
  const chapter = await getChapter(p.slug, p.chapter);
  if (!chapter) return null;
  const ref = displayRef(p);

  if (p.verseStart) {
    const start = p.verseStart;
    const end = p.verseEnd && p.verseEnd >= start ? p.verseEnd : start;
    const slice = chapter.verses.slice(start - 1, end);
    if (!slice.length) return null;
    const text = slice.join(" ").replace(/\n/g, " ");
    return { ref, text, quote: text, wholeChapter: false };
  }

  // Whole chapter — number the verses for the page; quote the first verse.
  const numbered = chapter.verses
    .map((v, i) => `${i + 1} ${v.replace(/\n/g, " ")}`)
    .join("\n");
  const quote = (chapter.verses[0] ?? "").replace(/\n/g, " ");
  return { ref, text: numbered, quote, wholeChapter: true };
}
