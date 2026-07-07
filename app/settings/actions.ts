"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getActiveMembership } from "@/lib/data";
import { hashPassword, verifyPassword, passwordProblem } from "@/lib/password";

type Result = { ok: boolean; error?: string; message?: string };

async function requireUser() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in?callbackUrl=/settings");
  return session.user.id;
}

export async function updateProfile(_prev: unknown, formData: FormData): Promise<Result> {
  const userId = await requireUser();
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  if (email && !email.includes("@")) {
    return { ok: false, error: "Please enter a valid email." };
  }
  if (email) {
    const clash = await prisma.user.findFirst({
      where: { email, id: { not: userId } },
    });
    if (clash) return { ok: false, error: "That email is already in use." };
  }

  await prisma.user.update({
    where: { id: userId },
    data: { name: name || null, ...(email ? { email } : {}) },
  });
  revalidatePath("/settings");
  return { ok: true, message: "Profile saved." };
}

export async function changePassword(_prev: unknown, formData: FormData): Promise<Result> {
  const userId = await requireUser();
  const current = String(formData.get("current") ?? "");
  const next = String(formData.get("next") ?? "");

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return { ok: false, error: "Account not found." };

  const ok = await verifyPassword(current, user.passwordHash);
  if (!ok) return { ok: false, error: "Your current password isn't right." };

  const problem = passwordProblem(next);
  if (problem) return { ok: false, error: problem };

  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash: await hashPassword(next) },
  });
  return { ok: true, message: "Password updated." };
}

export async function updateNotifications(_prev: unknown, formData: FormData): Promise<Result> {
  const userId = await requireUser();
  await prisma.user.update({
    where: { id: userId },
    data: {
      notifyByEmail: formData.get("notifyByEmail") === "on",
      weeklyDigest: formData.get("weeklyDigest") === "on",
    },
  });
  revalidatePath("/settings");
  return { ok: true, message: "Notification preferences saved." };
}

export async function updateJourney(_prev: unknown, formData: FormData): Promise<Result> {
  const userId = await requireUser();
  const active = await getActiveMembership(userId);
  if (!active || active.role !== "MOTHER") {
    return { ok: false, error: "Only the mother can edit journey details." };
  }

  const dateStr = String(formData.get("dueDate") ?? "").trim();
  const babyName = String(formData.get("babyName") ?? "").trim() || null;
  if (!dateStr) return { ok: false, error: "A due or birth date is required." };
  const dueDate = new Date(dateStr);
  if (Number.isNaN(dueDate.getTime())) return { ok: false, error: "That date isn't valid." };

  await prisma.journey.update({
    where: { id: active.journey.id },
    data: { dueDate, babyName },
  });
  revalidatePath("/journey");
  revalidatePath("/settings");
  return { ok: true, message: "Journey updated." };
}
