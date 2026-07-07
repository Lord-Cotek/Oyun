"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getActiveMembership } from "@/lib/data";

/** Midnight UTC for "today" — matches Prisma's @db.Date storage. */
function utcToday(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

async function requireMember() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in?callbackUrl=/journey");
  const active = await getActiveMembership(session.user.id);
  if (!active) redirect("/onboarding");
  return { userId: session.user.id, journeyId: active.journey.id, role: active.role };
}

/** Supporter marks that they prayed for / reached out to her today. Idempotent. */
export async function markSupport(kind: "prayed" | "reachedOut") {
  const { userId, journeyId } = await requireMember();
  const day = utcToday();
  const flag = kind === "prayed" ? { prayed: true } : { reachedOut: true };
  await prisma.supportDay.upsert({
    where: { journeyId_userId_day: { journeyId, userId, day } },
    create: { journeyId, userId, day, ...flag },
    update: flag,
  });
  revalidatePath("/journey");
}

/** Mark one of this week's nudges as done. */
export async function completeNudge(nudgeId: string) {
  const { userId } = await requireMember();
  // Only the nudge's owner can complete it.
  await prisma.nudge.updateMany({
    where: { id: nudgeId, userId, doneAt: null },
    data: { doneAt: new Date() },
  });
  revalidatePath("/journey");
}

/** Send a short word of encouragement to the rest of the journey. */
export async function sendEncouragement(formData: FormData) {
  const { userId, journeyId } = await requireMember();
  const body = String(formData.get("body") ?? "").trim();
  const verseRef = String(formData.get("verseRef") ?? "").trim() || null;
  if (!body) throw new Error("Write a few words first.");
  if (body.length > 1000) throw new Error("That's a little long — keep it short and warm.");

  await prisma.encouragement.create({
    data: { journeyId, authorId: userId, body, verseRef },
  });
  revalidatePath("/journey");
  revalidatePath("/care");
}
