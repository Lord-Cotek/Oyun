"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getActiveMembership } from "@/lib/data";
import { planById } from "@/lib/reading-plans";

function utcToday(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

/** Either parent toggles whether the household kept family worship today. */
export async function markWorship() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in?callbackUrl=/worship");
  const active = await getActiveMembership(session.user.id);
  if (!active) redirect("/onboarding");

  const where = {
    journeyId_day: { journeyId: active.journey.id, day: utcToday() },
  };
  const existing = await prisma.worshipDay.findUnique({ where });
  if (existing) {
    // Toggle off — fixes an accidental tap.
    await prisma.worshipDay.delete({ where });
  } else {
    await prisma.worshipDay.create({
      data: { journeyId: active.journey.id, day: utcToday() },
    });
  }
  revalidatePath("/worship");
  revalidatePath("/journey");
}

/** Choose (or switch to) a Scripture reading plan. Switching starts it fresh. */
export async function chooseReadingPlan(planId: string) {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in?callbackUrl=/worship");
  const active = await getActiveMembership(session.user.id);
  if (!active) redirect("/onboarding");
  const plan = planById(planId);
  if (!plan) return;

  if (active.journey.readingPlanId !== planId) {
    await prisma.journey.update({
      where: { id: active.journey.id },
      data: { readingPlanId: planId, readingProgress: 0, readingUpdatedAt: null },
    });
  }
  revalidatePath("/worship");
}

/** Mark today's reading complete — advances the plan by one (by completion). */
export async function markReadingRead() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in?callbackUrl=/worship");
  const active = await getActiveMembership(session.user.id);
  if (!active) redirect("/onboarding");

  const j = active.journey;
  const plan = planById(j.readingPlanId);
  if (!plan) return;
  if (j.readingProgress >= plan.readings.length) return; // already finished

  await prisma.journey.update({
    where: { id: j.id },
    data: { readingProgress: { increment: 1 }, readingUpdatedAt: new Date() },
  });
  revalidatePath("/worship");
  revalidatePath("/journey");
}

/** Undo the most recent reading — a gentle fix for an accidental tap. */
export async function undoReadingRead() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in?callbackUrl=/worship");
  const active = await getActiveMembership(session.user.id);
  if (!active) redirect("/onboarding");

  const j = active.journey;
  if (j.readingProgress <= 0) return;
  await prisma.journey.update({
    where: { id: j.id },
    data: { readingProgress: { decrement: 1 } },
  });
  revalidatePath("/worship");
  revalidatePath("/journey");
}
