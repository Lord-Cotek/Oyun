"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getActiveMembership } from "@/lib/data";
import { notify } from "@/lib/notify";
import { JourneyStatus } from "@prisma/client";

async function requireMother() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in?callbackUrl=/journey");
  const active = await getActiveMembership(session.user.id);
  if (!active || active.role !== "MOTHER") redirect("/journey");
  return { userId: session.user.id, journey: active.journey };
}

async function requireMember() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in?callbackUrl=/journey");
  const active = await getActiveMembership(session.user.id);
  if (!active) redirect("/onboarding");
  return { userId: session.user.id, journeyId: active.journey.id, role: active.role };
}

/**
 * The mother marks the loss of her child. This is never automated. By default
 * her circle is gently told — so they come near rather than fall silent — but
 * she may choose to keep it private.
 */
export async function markLoss(formData: FormData) {
  const { userId, journey } = await requireMother();
  const dateStr = String(formData.get("lossAt") ?? "").trim();
  const babyName = String(formData.get("babyName") ?? "").trim() || journey.babyName;
  const share = String(formData.get("share") ?? "") === "on";

  const lossAt = dateStr ? new Date(dateStr) : new Date();

  await prisma.journey.update({
    where: { id: journey.id },
    data: {
      status: JourneyStatus.LOSS,
      lossAt: Number.isNaN(lossAt.getTime()) ? new Date() : lossAt,
      babyName,
    },
  });

  if (share) {
    const [mother, others] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId }, select: { name: true } }),
      prisma.membership.findMany({
        where: { journeyId: journey.id, userId: { not: userId } },
        select: { userId: true },
      }),
    ]);
    const motherName = mother?.name?.trim() || "Someone you love";
    await Promise.all(
      others.map((m) =>
        notify({
          userId: m.userId,
          type: "encouragement",
          title: `${motherName} is walking through the loss of her baby.`,
          body: "Come near. Don't wait for the right words — a message, a prayer, your presence is enough.",
          href: "/journey",
          email: true,
        }),
      ),
    );
  }

  revalidatePath("/journey");
  redirect("/journey");
}

/** A word in memory — from the mother or the circle grieving with her. */
export async function addRemembrance(formData: FormData) {
  const { userId, journeyId } = await requireMember();
  const body = String(formData.get("body") ?? "").trim();
  if (!body) throw new Error("Write a few words.");
  if (body.length > 4000) throw new Error("That's a little long.");

  await prisma.remembrance.create({
    data: { journeyId, authorId: userId, body },
  });

  // Let the others know a word was left, so grief is shared, not solitary.
  const [author, journey, others] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, select: { name: true } }),
    prisma.journey.findUnique({ where: { id: journeyId }, select: { ownerId: true } }),
    prisma.membership.findMany({
      where: { journeyId, userId: { not: userId } },
      select: { userId: true },
    }),
  ]);
  const who = author?.name?.trim() || "Someone in your circle";
  await Promise.all(
    others.map((m) =>
      notify({
        userId: m.userId,
        type: "encouragement",
        title: `${who} left a word of remembrance.`,
        href: "/journey",
        // Email the mother; keep it quiet for others.
        email: journey?.ownerId === m.userId,
      }),
    ),
  );

  revalidatePath("/journey");
}

/** When, and only when, she is ready — return to an active journey. */
export async function beginAgain(formData: FormData) {
  const { journey } = await requireMother();
  const dateStr = String(formData.get("dueDate") ?? "").trim();
  if (!dateStr) throw new Error("Please choose a date to begin from.");
  const dueDate = new Date(dateStr);
  if (Number.isNaN(dueDate.getTime())) throw new Error("That date isn't valid.");

  await prisma.journey.update({
    where: { id: journey.id },
    data: { status: JourneyStatus.ACTIVE, lossAt: null, dueDate, babyName: null },
  });
  revalidatePath("/journey");
  redirect("/journey");
}
