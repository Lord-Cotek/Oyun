"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getActiveMembership } from "@/lib/data";
import { isHousehold } from "@/lib/roles";
import { cleanHealth } from "@/lib/health-card";

type Result = { ok: true } | { ok: false; error: string };

/**
 * Save a health card.
 *
 * `target` is "me" for your own card, or a child's id. Nobody writes another
 * adult's card — her partner can read hers, and she his, but each one's
 * words are their own. Nothing is sent to anyone when a card changes.
 */
export async function saveHealthCard(target: string, raw: Record<string, unknown>): Promise<Result> {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: "Please sign in again." };
  const userId = session.user.id;
  const active = await getActiveMembership(userId);
  if (!active || !isHousehold(active.role)) {
    return { ok: false, error: "Health cards are kept by the two of you." };
  }
  const journeyId = active.journey.id;
  const data = { ...cleanHealth(raw && typeof raw === "object" ? raw : {}), updatedById: userId };

  if (target === "me") {
    await prisma.healthRecord.upsert({
      where: { journeyId_userId: { journeyId, userId } },
      create: { journeyId, userId, ...data },
      update: data,
    });
  } else {
    const child = await prisma.child.findFirst({ where: { id: String(target).slice(0, 64), journeyId }, select: { id: true } });
    if (!child) return { ok: false, error: "That child is no longer on this journey." };
    await prisma.healthRecord.upsert({
      where: { childId: child.id },
      create: { journeyId, childId: child.id, ...data },
      update: data,
    });
  }
  revalidatePath("/health");
  revalidatePath("/health/card");
  return { ok: true };
}
