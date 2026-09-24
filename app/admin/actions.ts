"use server";

import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { audit, requireAdmin, requireSuperAdmin, superAdminEmails } from "@/lib/admin";
import { journeyOwnerName, pendingInvite } from "@/lib/admin-db";
import { sendInviteEmail, sendPasswordResetEmail } from "@/lib/email";

type Result = { ok: true; said: string } | { ok: false; error: string };

/**
 * What an admin can DO, which is the whole of support here.
 *
 * ── Acting on an account, never reading one ──────────────────────────────
 * Every action below either sends the person something, or changes who may
 * open this centre. None of them returns a family's content to the screen,
 * and none of them can: lib/admin-db.ts is the only way to the database from
 * the admin pages and it does not select those columns.
 *
 * Each one writes a line to the audit log before it returns, including the
 * ones that fail, because "I tried to reset her password and it bounced" is
 * exactly the thing somebody needs to find later.
 */

const SITE =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ?? "https://oyun.cotek.app";

/**
 * Send somebody the ordinary "choose a new password" email.
 *
 * Deliberately the same flow a person gets from the forgot-password page: a
 * one-hour token, mailed to the address on the account. An admin never sees
 * the link and cannot set a password themselves, so this cannot be used to
 * take an account over — only to help somebody back into their own.
 */
export async function sendReset(email: string): Promise<Result> {
  const admin = await requireAdmin();
  const to = email.trim().toLowerCase();

  const user = await prisma.user.findFirst({
    where: { email: { equals: to, mode: "insensitive" } },
    select: { email: true },
  });
  if (!user?.email) {
    await audit(admin.email, "tried to send a password reset", to, "no such account");
    return { ok: false, error: "No account with that address." };
  }

  const token = randomBytes(32).toString("base64url");
  await prisma.$transaction([
    prisma.passwordResetToken.deleteMany({ where: { email: user.email } }),
    prisma.passwordResetToken.create({
      data: {
        email: user.email,
        token,
        expires: new Date(Date.now() + 60 * 60 * 1000),
      },
    }),
  ]);

  const sent = await sendPasswordResetEmail({
    to: user.email,
    link: `${SITE}/reset-password?token=${token}`,
  }).catch(() => false);

  await audit(
    admin.email,
    "sent a password reset",
    user.email,
    sent ? "email accepted" : "email did not send",
  );
  revalidatePath("/admin/audit");
  return sent
    ? { ok: true, said: "Sent. The link works for one hour." }
    : { ok: false, error: "The token was made, but the email did not send." };
}

/** Send an unaccepted invitation again, to the address it was made for. */
export async function resendInvite(inviteId: string): Promise<Result> {
  const admin = await requireAdmin();
  const invite = await pendingInvite(inviteId);
  if (!invite) {
    await audit(
      admin.email,
      "tried to resend an invitation",
      inviteId,
      "gone or already accepted",
    );
    return { ok: false, error: "That invitation is gone or has been accepted." };
  }

  const motherName = await journeyOwnerName(invite.journeyId);
  const sent = await sendInviteEmail({
    to: invite.email,
    link: `${SITE}/join/${invite.token}`,
    motherName,
    role: invite.role as Parameters<typeof sendInviteEmail>[0]["role"],
  }).catch(() => false);

  await audit(
    admin.email,
    "resent an invitation",
    invite.email,
    sent ? `role ${invite.role}` : "email did not send",
  );
  revalidatePath("/admin/audit");
  return sent
    ? { ok: true, said: `Sent again to ${invite.email}.` }
    : { ok: false, error: "That did not send." };
}

/** Let somebody else into this centre. Super admins only. */
export async function addAdmin(formData: FormData): Promise<Result> {
  const admin = await requireSuperAdmin();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const label = String(formData.get("label") ?? "").trim().slice(0, 120) || null;

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return { ok: false, error: "That does not look like an email address." };
  }
  if (superAdminEmails().includes(email)) {
    return { ok: false, error: "That address is already a super admin." };
  }

  await prisma.adminUser.upsert({
    where: { email },
    update: { label },
    create: { email, label, addedBy: admin.email },
  });
  await audit(admin.email, "added an admin", email, label);
  revalidatePath("/admin/admins");
  revalidatePath("/admin/audit");
  return { ok: true, said: `${email} can now open this centre.` };
}

/**
 * Take somebody out again. Super admins only.
 *
 * A super admin cannot be removed here at all: the list that lets you in
 * lives in the environment, so getting out of it is a deployment change. An
 * admin centre that can lock out the person who owns the deployment is one
 * mistake away from nobody being able to get in.
 */
export async function removeAdmin(id: string): Promise<Result> {
  const admin = await requireSuperAdmin();
  const row = await prisma.adminUser.findUnique({
    where: { id },
    select: { email: true },
  });
  if (!row) return { ok: false, error: "They are not on the list." };

  await prisma.adminUser.delete({ where: { id } });
  await audit(admin.email, "removed an admin", row.email);
  revalidatePath("/admin/admins");
  revalidatePath("/admin/audit");
  return { ok: true, said: `${row.email} can no longer open this centre.` };
}
