"use server";

import { redirect } from "next/navigation";
import { makeConfirmLink } from "@/lib/email-confirm";
import { sendConfirmEmail, sendEmailChangeNotice } from "@/lib/email";
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
  // ── A new address waits until it is confirmed ──────────────────────────
  // It used to replace the old one the moment it was typed, which let an
  // address nobody had proved carry admin rights and invitations. Now it is
  // held in pendingEmail, a link goes to it, the OLD address is told, and the
  // account keeps its current email until the link is opened.
  const me = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true, name: true },
  });
  let pendingNote = "";
  if (email && email !== (me?.email ?? "").toLowerCase()) {
    const clash = await prisma.user.findFirst({
      where: { email, id: { not: userId } },
    });
    if (clash) return { ok: false, error: "That email is already in use." };
    await prisma.user.update({ where: { id: userId }, data: { pendingEmail: email } });
    const link = await makeConfirmLink(userId, email, process.env.NEXT_PUBLIC_SITE_URL ?? "https://oyun.cotek.app");
    await sendConfirmEmail({ to: email, name: me?.name, link, change: true }).catch(() => {});
    if (me?.email) await sendEmailChangeNotice({ to: me.email, newEmail: email }).catch(() => {});
    pendingNote = ` We've sent a link to ${email} — your email changes once you open it.`;
  }

  // The browser uploaded any new photo straight to Blob and passed the URL.
  const rawPhoto = String(formData.get("photoUrl") ?? "").trim();
  // Only our own storage: a photo URL from anywhere else is a tracking pixel
  // shown to everybody who sees this person.
  const photoUrl = /^https:\/\/[a-z0-9.-]+\.public\.blob\.vercel-storage\.com\//i.test(rawPhoto) ? rawPhoto : null;

  await prisma.user.update({
    where: { id: userId },
    data: {
      name: name || null,
      ...(photoUrl ? { image: photoUrl } : {}),
    },
  });
  revalidatePath("/settings");
  revalidatePath("/journey");
  revalidatePath("/circle");
  revalidatePath("/life");
  return { ok: true, message: `Profile saved.${pendingNote}` };
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
  // every row.
  const on = (name: string) => formData.get(name) === "on";
  await prisma.user.update({
    where: { id: userId },
    data: {
      notifyByEmail: on("notifyByEmail"),
      weeklyDigest: on("weeklyDigest"),
      ...Object.fromEntries(CATEGORY_FIELDS.map((f) => [f, on(f)])),
      // Clamped rather than trusted: this comes from a form, and an hour of
      // 25 would mean a note that never arrives, silently, for ever.
      // `|| 7` used to turn midnight (0) into 7am; only a missing or
      // unreadable value falls back now.
      morningHour: (() => {
        const h = Number.parseInt(String(formData.get("morningHour") ?? ""), 10);
        return Number.isFinite(h) ? Math.min(23, Math.max(0, h)) : 7;
      })(),
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


/** Send the "confirm your email" link again — for the current address or a pending one. */
export async function resendConfirm(): Promise<Result> {
  const userId = await requireUser();
  const u = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true, pendingEmail: true, name: true, emailVerified: true },
  });
  if (!u) return { ok: false, error: "Account not found." };
  const to = u.pendingEmail ?? (u.emailVerified ? null : u.email);
  if (!to) return { ok: true, message: "Your email is already confirmed." };
  const link = await makeConfirmLink(userId, to, process.env.NEXT_PUBLIC_SITE_URL ?? "https://oyun.cotek.app");
  const sent = await sendConfirmEmail({ to, name: u.name, link, change: !!u.pendingEmail }).catch(() => false);
  return sent
    ? { ok: true, message: `Sent to ${to}. The link works for three days.` }
    : { ok: false, error: "That did not send just now. Try again in a few minutes." };
}
