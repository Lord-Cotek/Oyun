"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getActiveMembership } from "@/lib/data";
import { uploadImage } from "@/lib/blob";

async function requireMother() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in?callbackUrl=/child");
  const active = await getActiveMembership(session.user.id);
  if (!active || active.role !== "MOTHER") redirect("/journey");
  return { journeyId: active.journey.id };
}

function parseSex(v: string): string | null {
  return v === "boy" || v === "girl" ? v : null;
}

export async function addChild(formData: FormData) {
  const { journeyId } = await requireMother();
  const name = String(formData.get("name") ?? "").trim();
  if (!name) throw new Error("Please give your child a name.");
  const sex = parseSex(String(formData.get("sex") ?? ""));
  const dateStr = String(formData.get("birthDate") ?? "").trim();
  const birthDate = dateStr ? new Date(dateStr) : null;
  const note = String(formData.get("note") ?? "").trim() || null;
  const photoUrl = await uploadImage(formData.get("photo"), "children");

  await prisma.child.create({
    data: {
      journeyId,
      name,
      sex,
      birthDate: birthDate && !Number.isNaN(birthDate.getTime()) ? birthDate : null,
      note,
      photoUrl,
    },
  });
  revalidatePath("/child");
  revalidatePath("/care");
}

export async function updateChild(formData: FormData) {
  const { journeyId } = await requireMother();
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  if (!name) throw new Error("Please give your child a name.");
  const sex = parseSex(String(formData.get("sex") ?? ""));
  const dateStr = String(formData.get("birthDate") ?? "").trim();
  const birthDate = dateStr ? new Date(dateStr) : null;
  const note = String(formData.get("note") ?? "").trim() || null;
  const newPhoto = await uploadImage(formData.get("photo"), "children");

  await prisma.child.updateMany({
    where: { id, journeyId },
    data: {
      name,
      sex,
      birthDate: birthDate && !Number.isNaN(birthDate.getTime()) ? birthDate : null,
      note,
      ...(newPhoto ? { photoUrl: newPhoto } : {}),
    },
  });
  revalidatePath("/child");
  revalidatePath("/care");
}

export async function deleteChild(formData: FormData) {
  const { journeyId } = await requireMother();
  const id = String(formData.get("id") ?? "");
  await prisma.child.deleteMany({ where: { id, journeyId } });
  revalidatePath("/child");
  revalidatePath("/care");
}
