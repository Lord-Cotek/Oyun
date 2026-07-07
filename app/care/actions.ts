"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getActiveMembership } from "@/lib/data";
import { Mood, MilestoneKind } from "@prisma/client";

async function requireMother() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in?callbackUrl=/care");
  const active = await getActiveMembership(session.user.id);
  if (!active || active.role !== "MOTHER") redirect("/journey");
  return { userId: session.user.id, journeyId: active.journey.id };
}

export async function addCheckIn(formData: FormData) {
  const { userId, journeyId } = await requireMother();
  const moodRaw = String(formData.get("mood") ?? "");
  const note = String(formData.get("note") ?? "").trim() || null;
  if (!(moodRaw in Mood)) throw new Error("Please choose how you are.");

  await prisma.checkIn.create({
    data: { journeyId, userId, mood: moodRaw as Mood, note },
  });
  revalidatePath("/care");
  revalidatePath("/journey");
}

export async function addLetter(formData: FormData) {
  const { userId, journeyId } = await requireMother();
  const body = String(formData.get("body") ?? "").trim();
  const toBaby = String(formData.get("toBaby") ?? "true") === "true";
  if (!body) throw new Error("A letter needs a few words.");

  await prisma.letter.create({
    data: { journeyId, authorId: userId, body, toBaby },
  });
  revalidatePath("/care");
}

export async function addMilestone(formData: FormData) {
  const { journeyId } = await requireMother();
  const kindRaw = String(formData.get("kind") ?? "");
  const note = String(formData.get("note") ?? "").trim() || null;
  const dateStr = String(formData.get("occurredAt") ?? "").trim();
  if (!(kindRaw in MilestoneKind)) throw new Error("Please choose a kind.");
  const occurredAt = dateStr ? new Date(dateStr) : new Date();
  if (Number.isNaN(occurredAt.getTime())) throw new Error("That date isn't valid.");

  await prisma.milestone.create({
    data: { journeyId, kind: kindRaw as MilestoneKind, note, occurredAt },
  });
  revalidatePath("/care");
  revalidatePath("/journey");
}
