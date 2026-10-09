import { prisma } from "@/lib/prisma";

/**
 * Whether a picture may be pinned somewhere people will see it.
 *
 * ── Why a URL from the app's own UI is checked at all ────────────────────
 * Because a server action is a public endpoint. Anybody signed in can call
 * one with anything, so "the client only ever sends us a blob URL" is a
 * statement about the UI and not about what will arrive. The value ends up
 * in an <img src> on a page other people open — and, for an invitation, in a
 * link preview WhatsApp fetches on their behalf.
 *
 * Two things are refused:
 *
 *   Anything that is not https on this app's own blob storage, which stops a
 *   cover being pointed at a tracking pixel or at somebody's private image
 *   host. For an invitation that matters more than anywhere else: the OG
 *   image is fetched by WhatsApp's servers for every person the link reaches,
 *   so a foreign URL there would be a beacon with a guest list attached.
 *
 *   Anything longer than is plausible, because a megabyte of `data:` is a
 *   denial of service against every reader's browser rather than ours.
 *
 * A picture already stored against this journey is allowed through whatever
 * host it is on: it is already being served on these pages, so refusing it
 * would only mean a photograph you can see in the diary cannot be chosen.
 *
 * Extracted from app/journey/cover-actions.ts, which had it first, so that
 * the invitation cover cannot drift into a weaker version of the same rule.
 */

const BLOB_HOST = /\.public\.blob\.vercel-storage\.com$/i;
const MAX_URL = 2048;

/**
 * The URL to store, or null for "none" — or `false`, meaning refuse.
 *
 * Three outcomes rather than two because null is a real answer here: it is
 * how somebody takes a cover off again, and a caller must not confuse that
 * with being turned down.
 */
export async function checkCoverUrl(
  url: string | null,
  journeyId: string,
): Promise<string | null | false> {
  if (url === null) return null;

  const trimmed = url.trim();
  if (!trimmed || trimmed.length > MAX_URL) return false;

  let host: string;
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== "https:") return false;
    host = parsed.hostname;
  } catch {
    return false;
  }

  if (BLOB_HOST.test(host)) return trimmed;
  return (await belongsToJourney(journeyId, trimmed)) ? trimmed : false;
}

/** Is this picture already one of the journey's own? */
async function belongsToJourney(
  journeyId: string,
  url: string,
): Promise<boolean> {
  return (
    // householdOnly excluded for the same reason the picker excludes it: a
    // cover is what people outside the household see first, and this is the
    // check a pasted URL has to get past.
    (await prisma.post.count({
      where: { journeyId, householdOnly: false, mediaUrls: { has: url } },
    })) > 0
  );
}
