"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getActiveMembership } from "@/lib/data";
import { planById } from "@/lib/reading-plans";
import { chapterRef } from "@/lib/bible";
import { Role } from "@prisma/client";

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

/** Add a reflection on a Scripture reading. Shared by default; may be private. */
export async function addReflection(input: {
  bookSlug: string;
  chapter: number;
  body: string;
  isPrivate: boolean;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in?callbackUrl=/worship");
  const active = await getActiveMembership(session.user.id);
  if (!active) redirect("/onboarding");

  const body = input.body.trim();
  if (!body || !input.bookSlug || !input.chapter) return;
  await prisma.readingNote.create({
    data: {
      journeyId: active.journey.id,
      authorId: session.user.id,
      bookSlug: input.bookSlug,
      chapter: input.chapter,
      body: body.slice(0, 4000),
      isPrivate: !!input.isPrivate,
    },
  });

  // Gentle in-app notice to the rest of the pair when a reflection is shared
  // (never for private notes, never a push — just the bell). Best-effort.
  if (!input.isPrivate) {
    try {
      const [author, others] = await Promise.all([
        prisma.user.findUnique({
          where: { id: session.user.id },
          select: { name: true },
        }),
        prisma.membership.findMany({
          where: {
            journeyId: active.journey.id,
            userId: { not: session.user.id },
            role: { in: [Role.MOTHER, Role.PARTNER] },
          },
          select: { userId: true },
        }),
      ]);
      if (others.length) {
        const ref = chapterRef(input.bookSlug, input.chapter);
        const snip = body.length > 90 ? `${body.slice(0, 90)}…` : body;
        await prisma.notification.createMany({
          data: others.map((o) => ({
            userId: o.userId,
            type: "reflection",
            title: `${author?.name ?? "Someone"} shared a reflection`,
            body: `${ref} — “${snip}”`,
            href: "/journal",
          })),
        });
      }
    } catch {
      // A missed notice must never fail the reflection.
    }
  }
  revalidatePath("/worship");
}

/** Edit one of your own reflections. */
export async function updateReflection(input: {
  id: string;
  body: string;
  isPrivate: boolean;
}) {
  const session = await auth();
  if (!session?.user?.id) return;
  const body = input.body.trim();
  if (!body) return;
  // Scope the update to the author so no one can edit another's note.
  await prisma.readingNote.updateMany({
    where: { id: input.id, authorId: session.user.id },
    data: { body: body.slice(0, 4000), isPrivate: !!input.isPrivate },
  });
  revalidatePath("/worship");
}

/** Delete one of your own reflections. */
export async function deleteReflection(id: string) {
  const session = await auth();
  if (!session?.user?.id) return;
  await prisma.readingNote.deleteMany({
    where: { id, authorId: session.user.id },
  });
  revalidatePath("/worship");
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
