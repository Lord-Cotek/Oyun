"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getActiveMembership } from "@/lib/data";
import { isHousehold } from "@/lib/roles";
import { checkCoverUrl } from "@/lib/cover-url";

/**
 * Pin the photograph at the top of the journey, or go back to automatic.
 *
 * What may be pinned, and why it is checked when it came from our own UI, is
 * in lib/cover-url.ts — shared with the invitation cover so the two cannot
 * drift into different rules about the same question.
 *
 * Only the mother and her partner may set it — the circle sees this journey
 * but does not decorate it.
 */
export async function setJourneyCover(
  url: string | null,
): Promise<{ ok: boolean }> {
  const session = await auth();
  if (!session?.user?.id) return { ok: false };

  const active = await getActiveMembership(session.user.id);
  if (!active || !isHousehold(active.role)) return { ok: false };
  const journeyId = active.journey.id;

  const value = await checkCoverUrl(url, journeyId);
  if (value === false) return { ok: false };

  await prisma.journey.update({
    where: { id: journeyId },
    data: { coverUrl: value },
  });
  revalidatePath("/journey");
  return { ok: true };
}
