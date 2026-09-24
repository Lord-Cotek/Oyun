"use server";

import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import {
  audit,
  requireSuperAdmin,
  requireUnlockedAdmin,
  superAdminEmails,
  unlockedFor,
} from "@/lib/admin";
import { journeyOwnerName, pendingInvite } from "@/lib/admin-db";
import {
  sendAddressChangedEmail,
  sendInviteEmail,
  sendPasswordResetEmail,
} from "@/lib/email";

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
  const admin = await requireUnlockedAdmin();
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
  revalidatePath("/admintc/audit");
  return sent
    ? { ok: true, said: "Sent. The link works for one hour." }
    : { ok: false, error: "The token was made, but the email did not send." };
}

/** Send an unaccepted invitation again, to the address it was made for. */
export async function resendInvite(inviteId: string): Promise<Result> {
  const admin = await requireUnlockedAdmin();
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
  revalidatePath("/admintc/audit");
  return sent
    ? { ok: true, said: `Sent again to ${invite.email}.` }
    : { ok: false, error: "That did not send." };
}

/** Let somebody else into this centre. Super admins only. */
export async function addAdmin(formData: FormData): Promise<Result> {
  const admin = await requireSuperAdmin();
  if (!unlockedFor(admin.email)) {
    return { ok: false, error: "The centre has locked. Open it again." };
  }
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
  revalidatePath("/admintc/admins");
  revalidatePath("/admintc/audit");
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
  if (!unlockedFor(admin.email)) {
    return { ok: false, error: "The centre has locked. Open it again." };
  }
  const row = await prisma.adminUser.findUnique({
    where: { id },
    select: { email: true },
  });
  if (!row) return { ok: false, error: "They are not on the list." };

  await prisma.adminUser.delete({ where: { id } });
  await audit(admin.email, "removed an admin", row.email);
  revalidatePath("/admintc/admins");
  revalidatePath("/admintc/audit");
  return { ok: true, said: `${row.email} can no longer open this centre.` };
}

/**
 * ── The careful half ─────────────────────────────────────────────────────
 * Suspending, changing an address and deleting. These are the three things
 * an operator will be asked for that cannot be undone by the person asking,
 * so each one is confirmed by typing the account's own address, and each
 * writes down what was done before it does it.
 *
 * None of them reads a family's content, and none of them needs to.
 */

/**
 * Stop an account being used.
 *
 * Bites immediately, on sessions already open as well as at the next sign-in
 * — see the session callback in lib/auth.ts. Nothing is deleted: a suspension
 * is a pause, and the reason is kept so whoever picks this up next month can
 * see why.
 *
 * Deliberately sends no email. The usual reason to suspend an account is
 * something happening to somebody else right now, and an operator may need to
 * speak to the family before the person knows. Telling them is a decision for
 * a human, not a side effect.
 */
export async function suspendAccount(
  email: string,
  reason: string,
): Promise<Result> {
  const admin = await requireUnlockedAdmin();
  const to = email.trim().toLowerCase();
  const why = reason.trim().slice(0, 300);
  if (!why) return { ok: false, error: "Say why. It will be read months from now." };

  const user = await prisma.user.findFirst({
    where: { email: { equals: to, mode: "insensitive" } },
    select: { id: true, email: true, suspendedAt: true },
  });
  if (!user) return { ok: false, error: "No account with that address." };
  if (user.suspendedAt) return { ok: false, error: "That account is already suspended." };

  await prisma.user.update({
    where: { id: user.id },
    data: { suspendedAt: new Date(), suspendedReason: why },
  });
  await audit(admin.email, "suspended an account", user.email, why);
  revalidatePath("/admintc/people");
  revalidatePath("/admintc/audit");
  return { ok: true, said: "Suspended. They are signed out everywhere, now." };
}

/** Let them back in. */
export async function restoreAccount(email: string): Promise<Result> {
  const admin = await requireUnlockedAdmin();
  const to = email.trim().toLowerCase();
  const user = await prisma.user.findFirst({
    where: { email: { equals: to, mode: "insensitive" } },
    select: { id: true, email: true, suspendedAt: true },
  });
  if (!user) return { ok: false, error: "No account with that address." };
  if (!user.suspendedAt) return { ok: false, error: "That account is not suspended." };

  await prisma.user.update({
    where: { id: user.id },
    data: { suspendedAt: null, suspendedReason: null },
  });
  await audit(admin.email, "restored an account", user.email);
  revalidatePath("/admintc/people");
  revalidatePath("/admintc/audit");
  return { ok: true, said: "Restored. They can sign in again." };
}

/**
 * Change the address on an account.
 *
 * ── Why this is the most dangerous thing here ────────────────────────────
 * Because the address IS the account: whoever holds it can reset the
 * password and walk in. So it is confirmed by typing the current address,
 * and BOTH addresses are told afterwards — the old one especially, because
 * if this was not asked for, that message is the only warning its owner will
 * get.
 *
 * The person is not signed out: they asked for this, usually because they
 * typed it wrong at sign-up and cannot receive anything.
 */
export async function changeEmail(
  currentEmail: string,
  nextEmail: string,
  typed: string,
): Promise<Result> {
  const admin = await requireUnlockedAdmin();
  const from = currentEmail.trim().toLowerCase();
  const to = nextEmail.trim().toLowerCase();

  if (typed.trim().toLowerCase() !== from) {
    return { ok: false, error: "Type the current address exactly, to confirm." };
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(to)) {
    return { ok: false, error: "That new address does not look like one." };
  }
  if (to === from) return { ok: false, error: "That is the same address." };

  const user = await prisma.user.findFirst({
    where: { email: { equals: from, mode: "insensitive" } },
    select: { id: true },
  });
  if (!user) return { ok: false, error: "No account with that address." };

  const taken = await prisma.user.findFirst({
    where: { email: { equals: to, mode: "insensitive" } },
    select: { id: true },
  });
  if (taken) return { ok: false, error: "Another account already uses that address." };

  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      // The new address is unverified until they prove it, exactly as a new
      // one would be.
      data: { email: to, emailVerified: null },
    }),
    // Any reset link in flight was minted for the old address.
    prisma.passwordResetToken.deleteMany({ where: { email: from } }),
  ]);

  await audit(admin.email, "changed an account's address", from, `now ${to}`);
  await Promise.all([
    sendAddressChangedEmail({ to: from, from, next: to, wasOld: true }).catch(() => false),
    sendAddressChangedEmail({ to, from, next: to, wasOld: false }).catch(() => false),
  ]);
  revalidatePath("/admintc/people");
  revalidatePath("/admintc/audit");
  return { ok: true, said: `Changed to ${to}. Both addresses have been told.` };
}

/**
 * Delete an account and everything that belongs to it, because they asked.
 *
 * The same thing the person can do themselves in Settings, for when they
 * cannot get in to do it. Cascades take the journey they own with them —
 * entries, letters, milestones, prayers, worship days, the registry — so
 * this is the end of it, and nothing here can put it back.
 *
 * Confirmed by typing the address. The audit line is written BEFORE the
 * delete, because afterwards there is no account to name.
 */
export async function deleteAccountOnRequest(
  email: string,
  typed: string,
): Promise<Result> {
  const admin = await requireUnlockedAdmin();
  const to = email.trim().toLowerCase();
  if (typed.trim().toLowerCase() !== to) {
    return { ok: false, error: "Type the address exactly, to confirm." };
  }

  const user = await prisma.user.findFirst({
    where: { email: { equals: to, mode: "insensitive" } },
    select: { id: true, email: true, _count: { select: { memberships: true } } },
  });
  if (!user) return { ok: false, error: "No account with that address." };

  await audit(
    admin.email,
    "deleted an account, on request",
    user.email,
    `${user._count.memberships} membership(s) went with it`,
  );
  if (user.email) {
    await prisma.passwordResetToken.deleteMany({ where: { email: user.email } });
  }
  await prisma.user.delete({ where: { id: user.id } });

  revalidatePath("/admintc/people");
  revalidatePath("/admintc/audit");
  return { ok: true, said: "Deleted. There is nothing left to restore." };
}
