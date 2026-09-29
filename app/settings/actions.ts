"use server";

import { redirect } from "next/navigation";
import { CATEGORY_FIELDS } from "@/lib/notify-prefs";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { isHousehold } from "@/lib/roles";
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

  // The browser uploaded any new photo straight to Blob and passed the URL.
  const rawPhoto = String(formData.get("photoUrl") ?? "").trim();
  const photoUrl = rawPhoto.startsWith("http") ? rawPhoto : null;

  await prisma.user.update({
    where: { id: userId },
    data: {
      name: name || null,
      ...(email ? { email } : {}),
      ...(photoUrl ? { image: photoUrl } : {}),
    },
  });
  revalidatePath("/settings");
  revalidatePath("/journey");
  revalidatePath("/circle");
  revalidatePath("/life");
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
  // An unchecked checkbox sends nothing at all, so every switch has to be read
  // as "absent means off" — which is only safe because the form always renders
  // all five rows.
  const on = (name: string) => formData.get(name) === "on";
  await prisma.user.update({
    where: { id: userId },
    data: {
      notifyByEmail: on("notifyByEmail"),
      weeklyDigest: on("weeklyDigest"),
      ...Object.fromEntries(CATEGORY_FIELDS.map((f) => [f, on(f)])),
    },
  });
  revalidatePath("/settings");
  return { ok: true, message: "Saved. This takes effect from the next one." };
}

export async function updateJourney(_prev: unknown, formData: FormData): Promise<Result> {
  const userId = await requireUser();
  const active = await getActiveMembership(userId);
  // The due date and the babies' names belong to both of them, not to her
  // alone — a husband correcting a date should not have to ask her to do it.
  if (!active || !isHousehold(active.role)) {
    return { ok: false, error: "Only the two of you can edit journey details." };
  }

  const dateStr = String(formData.get("dueDate") ?? "").trim();
  const babyName = String(formData.get("babyName") ?? "").trim() || null;
  const babyCount = Math.min(4, Math.max(1, parseInt(String(formData.get("babyCount") ?? "1"), 10) || 1));
  if (!dateStr) return { ok: false, error: "A due or birth date is required." };
  const dueDate = new Date(dateStr);
  if (Number.isNaN(dueDate.getTime())) return { ok: false, error: "That date isn't valid." };

  await prisma.journey.update({
    where: { id: active.journey.id },
    data: { dueDate, babyName, babyCount },
  });
  revalidatePath("/journey");
  revalidatePath("/settings");
  return { ok: true, message: "Journey updated." };
}

/**
 * Permanently delete the signed-in user's account and ALL of their data.
 * Cascading deletes remove any owned journey/household (with its check-ins,
 * letters, milestones, prayers, worship days, children, catechism, keepsakes…)
 * plus this user's memberships, reactions, notifications, and devices.
 * Irreversible. Required for App Store Guideline 5.1.1(v).
 */
export async function deleteAccount(): Promise<void> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true },
  });
  if (user?.email) {
    await prisma.passwordResetToken.deleteMany({ where: { email: user.email } });
  }
  await prisma.user.delete({ where: { id: userId } });
}
