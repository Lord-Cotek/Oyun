"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getActiveMembership } from "@/lib/data";
import { isHousehold } from "@/lib/roles";

/**
 * Pin the photograph at the top of the journey, or go back to automatic.
 *
 * ── Why the URL is checked at all ────────────────────────────────────────
 * This value is written straight into a `background-image` on the home screen
 * of everybody on the journey. A server action is a public endpoint — anyone
 * signed in can call it with anything — so "the client only ever sends us a
 * blob URL" is a statement about the UI, not about what will arrive.
 *
 * Two things are refused. Anything that is not an https URL on this app's own
 * blob storage, which stops the journey's home screen being pointed at a
 * tracker or at somebody's private image host. And anything longer than is
 * plausible, because a megabyte of `data:` in a CSS property is a denial of
 * service against every member's browser rather than against ours.
 *
 * A picture already stored against this journey is allowed through whatever
 * host it is on: it is already being served on these pages, so refusing it
 * here would only mean a photograph you can see in the feed cannot be chosen
 * as the cover.
 *
 * Only the mother and her partner may set it — the circle sees this journey
 * but does not decorate it.
 */
const BLOB_HOST = /\.public\.blob\.vercel-storage\.com$/i;
const MAX_URL = 2048;

export async function setJourneyCover(
  url: string | null,
): Promise<{ ok: boolean }> {
  const session = await auth();
  if (!session?.user?.id) return { ok: false };

  const active = await getActiveMembership(session.user.id);
  if (!active || !isHousehold(active.role)) return { ok: false };
  const journeyId = active.journey.id;

  let value: string | null = null;
  if (url !== null) {
    const trimmed = url.trim();
    if (!trimmed || trimmed.length > MAX_URL) return { ok: false };

    let host: string;
    try {
      const parsed = new URL(trimmed);
      if (parsed.protocol !== "https:") return { ok: false };
      host = parsed.hostname;
    } catch {
      return { ok: false };
    }

    if (!BLOB_HOST.test(host) && !(await belongsToJourney(journeyId, trimmed))) {
      return { ok: false };
    }
    value = trimmed;
  }

  await prisma.journey.update({
    where: { id: journeyId },
    data: { coverUrl: value },
  });
  revalidatePath("/journey");
  return { ok: true };
}

/** Is this picture already one of the journey's own? */
async function belongsToJourney(journeyId: string, url: string) {
  return (
    // householdOnly excluded for the same reason the picker excludes it: the
    // cover is what the circle sees first, and this is the check a pasted
    // URL has to get past.
    (await prisma.post.count({
      where: { journeyId, householdOnly: false, mediaUrls: { has: url } },
    })) > 0
  );
}
