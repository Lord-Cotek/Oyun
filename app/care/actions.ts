"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getActiveMembership } from "@/lib/data";
import { uploadImages } from "@/lib/blob";
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

async function resolveChildId(journeyId: string, raw: string): Promise<string | null> {
  const childIdRaw = raw.trim();
  if (!childIdRaw) return null;
  const child = await prisma.child.findFirst({
    where: { id: childIdRaw, journeyId },
    select: { id: true },
  });
  return child?.id ?? null;
}

export async function addMilestone(formData: FormData) {
  const { journeyId } = await requireMother();
  const kindRaw = String(formData.get("kind") ?? "");
  const title = String(formData.get("title") ?? "").trim() || null;
  const note = String(formData.get("note") ?? "").trim() || null;
  const dateStr = String(formData.get("occurredAt") ?? "").trim();
  if (!(kindRaw in MilestoneKind)) throw new Error("Please choose a kind.");
  if (kindRaw === "CUSTOM" && !title) {
    throw new Error("Please name this first.");
  }
  const occurredAt = dateStr ? new Date(dateStr) : new Date();
  if (Number.isNaN(occurredAt.getTime())) throw new Error("That date isn't valid.");

  const photoUrls = await uploadImages(formData.getAll("photo"), "milestones");
  const childId = await resolveChildId(journeyId, String(formData.get("childId") ?? ""));

  await prisma.milestone.create({
    data: { journeyId, kind: kindRaw as MilestoneKind, title, note, occurredAt, photoUrls, childId },
  });
  revalidatePath("/care");
  revalidatePath("/journey");
}

export async function updateMilestone(formData: FormData) {
  const { journeyId } = await requireMother();
  const id = String(formData.get("id") ?? "");
  const kindRaw = String(formData.get("kind") ?? "");
  const title = String(formData.get("title") ?? "").trim() || null;
  const note = String(formData.get("note") ?? "").trim() || null;
  const dateStr = String(formData.get("occurredAt") ?? "").trim();
  if (!(kindRaw in MilestoneKind)) throw new Error("Please choose a kind.");
  if (kindRaw === "CUSTOM" && !title) throw new Error("Please name this first.");
  const occurredAt = dateStr ? new Date(dateStr) : new Date();
  if (Number.isNaN(occurredAt.getTime())) throw new Error("That date isn't valid.");

  const childId = await resolveChildId(journeyId, String(formData.get("childId") ?? ""));

  // Compute the new photo set: keep existing minus any removed, then append new uploads.
  const existing = await prisma.milestone.findFirst({
    where: { id, journeyId },
    select: { photoUrls: true },
  });
  const removeUrls = new Set(
    formData.getAll("removePhoto").map((v) => String(v)),
  );
  const kept = (existing?.photoUrls ?? []).filter((u) => !removeUrls.has(u));
  const added = await uploadImages(formData.getAll("photo"), "milestones");
  const photoUrls = [...kept, ...added].slice(0, 8);

  await prisma.milestone.updateMany({
    where: { id, journeyId },
    data: {
      kind: kindRaw as MilestoneKind,
      title,
      note,
      occurredAt,
      childId,
      photoUrls,
    },
  });
  revalidatePath("/care");
  revalidatePath("/journey");
}

export async function deleteMilestone(formData: FormData) {
  const { journeyId } = await requireMother();
  const id = String(formData.get("id") ?? "");
  await prisma.milestone.deleteMany({ where: { id, journeyId } });
  revalidatePath("/care");
  revalidatePath("/journey");
}
