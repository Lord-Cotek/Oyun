/**
 * The photographs and videos on a Life post, in the order they were added.
 *
 * ── Why this exists ──────────────────────────────────────────────────────
 * A post keeps its media three ways at once: `mediaUrls` (photographs and
 * videos, in order), `posterUrls` (a still for each video, at the same
 * index), and `imageUrl`, the single picture that posts carried before they
 * could hold more than one. The family's own feed reads all three. The page
 * a doctor sees a shared post on read only the photographs in `mediaUrls`,
 * so a mother who shared a video of a scan, or an older post with one
 * picture, had shared something her doctor could not see — and nothing on
 * either side said so.
 *
 * Anywhere that shows a post's media outside the feed takes it from here, so
 * "what is on this post" has one answer.
 *
 * No database and no imports that reach one (the import below is types
 * only), so scripts/verify-clinician.mjs can check it on every release.
 */
import type { MediaItem, MediaType } from "@/lib/feed-query";

/** Infer whether a blob URL points at a video from its file extension. */
export function mediaTypeFromUrl(url: string): MediaType {
  return /\.(mp4|m4v|mov|webm|ogg)(\?|#|$)/i.test(url) ? "video" : "image";
}

export interface PostMediaFields {
  mediaUrls: string[];
  posterUrls?: string[] | null;
  imageUrl?: string | null;
}

export function mediaOfPost(p: PostMediaFields): MediaItem[] {
  if (p.mediaUrls.length > 0) {
    return p.mediaUrls.map((url, i) => {
      const poster = p.posterUrls?.[i];
      return { url, type: mediaTypeFromUrl(url), ...(poster ? { poster } : {}) };
    });
  }
  return p.imageUrl ? [{ url: p.imageUrl, type: "image" as const }] : [];
}

/** "2 photos · 1 video" — or an empty string when there is nothing. */
export function mediaSummary(media: MediaItem[]): string {
  const videos = media.filter((m) => m.type === "video").length;
  const photos = media.length - videos;
  const n = (count: number, one: string) => `${count} ${one}${count === 1 ? "" : "s"}`;
  return [photos ? n(photos, "photo") : "", videos ? n(videos, "video") : ""].filter(Boolean).join(" · ");
}
