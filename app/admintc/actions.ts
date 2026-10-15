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
  sendExportLinkEmail,
  sendResetTakenEmail,
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
/**
 * Point somebody at their own copy of everything.
 *
 * ── Why this is a signpost and not a download ────────────────────────────
 * Because the export is a family's whole diary, and this centre does not read
 * a family's content. The temptation, when somebody writes in asking for
 * their data, is to build an admin button that produces the file — and that
 * button would be the one hole in the wall, because the operator pressing it
 * has the file in their hands.
 *
 * So the family exports their own from Settings, as they always could, and
 * the only thing an admin can do is send them the way there. No token, no
 * file, nothing that works without signing in. The audit line records that
 * the signpost was sent, which is all that happened.
 */
/**
 * How long a link somebody is going to paste into a chat should live.
 *
 * Shorter than the hour an emailed one gets, because this one is being
 * handed over immediately and read immediately. A link sitting in a WhatsApp
 * thread for an hour is a link somebody can scroll back to.
 */
const HAND_CARRIED_MINUTES = 15;

type LinkResult =
  | { ok: true; said: string; link: string; until: string }
  | { ok: false; error: string };

/**
 * Take a reset link into your own hands, to send by some other means.
 *
 * ── Be clear about what this is ──────────────────────────────────────────
 * Everything else in this centre acts on an account without reaching into
 * it. This reaches into it. Whoever holds this link can set the password and
 * open that family's diary, their letters, everything — as them. The wall
 * that lib/admin-db.ts and `npm run verify:admin` hold up stops an admin
 * READING a family through this centre; it cannot stop somebody who has made
 * themselves that family.
 *
 * It exists because email genuinely fails — a domain not yet warm, a gulf
 * ISP swallowing the lot, somebody's spam folder — and the operator of a
 * small app often knows the person and can hand it over. Refusing to build
 * it would not stop that; it would push it into a database console, where
 * nothing is written down at all.
 *
 * ── So the cost is made explicit rather than hidden ──────────────────────
 *   · Super admin only. Not every person doing support.
 *   · Never for another admin's account — that is how one admin becomes all
 *     of them, and it is the one case with no honest support reason.
 *   · Fifteen minutes, not an hour.
 *   · A distinct audit line. Not "sent a password reset" among the others —
 *     "took a reset link by hand", which reads differently on purpose.
 *   · THE PERSON IS TOLD. This is the part that matters. It turns a power
 *     nobody can see into one the person it was used on can ask about.
 *
 * The link is returned to the screen once and never stored by the page.
 *
 * admin-reach: power hand-carried-reset — a super admin can take a password
 * reset link and pass it on themselves. It is the one thing here that
 * reaches INTO an account rather than acting on it; it is fifteen minutes,
 * refused for another admin, written down under its own name, and the
 * account holder is emailed to say it happened.
 */
export async function takeResetLink(email: string): Promise<LinkResult> {
  const admin = await requireSuperAdmin();
  const to = email.trim().toLowerCase();

  const user = await prisma.user.findFirst({
    where: { email: { equals: to, mode: "insensitive" } },
    select: { email: true, name: true },
  });
  if (!user?.email) {
    await audit(admin.email, "tried to take a reset link by hand", to, "no such account");
    return { ok: false, error: "No account with that address." };
  }

  // Never for another admin. One admin quietly becoming another is the thing
  // an audit log cannot undo, and there is no support story that needs it —
  // an admin who is locked out can use the ordinary emailed reset like
  // anybody else.
  const others = await prisma.adminUser.count({
    where: { email: { equals: user.email, mode: "insensitive" } },
  });
  const isSuper = superAdminEmails().includes(user.email.toLowerCase());
  if (others > 0 || isSuper) {
    await audit(
      admin.email,
      "tried to take a reset link by hand",
      user.email,
      "refused — that account is an admin",
    );
    return {
      ok: false,
      error:
        "That account is an admin. Send them the ordinary link by email — one admin is not handed another's account.",
    };
  }

  const token = randomBytes(32).toString("base64url");
  const expires = new Date(Date.now() + HAND_CARRIED_MINUTES * 60 * 1000);
  await prisma.$transaction([
    prisma.passwordResetToken.deleteMany({ where: { email: user.email } }),
    prisma.passwordResetToken.create({ data: { email: user.email, token, expires } }),
  ]);

  // Told, not asked. They cannot stop it, but they can see it happened and
  // say something — which is the whole difference between a power and a
  // secret. Best effort: a failed notice must not leave the operator without
  // the link they are standing there waiting for.
  const toldThem = await sendResetTakenEmail({
    to: user.email,
    name: user.name,
    by: admin.email,
    minutes: HAND_CARRIED_MINUTES,
  }).catch(() => false);

  await audit(
    admin.email,
    "took a reset link by hand",
    user.email,
    toldThem
      ? `${HAND_CARRIED_MINUTES} minutes — the account holder was told`
      : `${HAND_CARRIED_MINUTES} minutes — THE ACCOUNT HOLDER COULD NOT BE TOLD`,
  );
  revalidatePath("/admintc/audit");
  revalidatePath("/admintc/people");

  return {
    ok: true,
    link: `${SITE}/reset-password?token=${token}`,
    until: expires.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
    said: toldThem
      ? `Yours for ${HAND_CARRIED_MINUTES} minutes. They have been emailed to say a link was made.`
      : `Yours for ${HAND_CARRIED_MINUTES} minutes. They could NOT be told — the notice did not send.`,
  };
}

export async function sendExportLink(email: string): Promise<Result> {
  const admin = await requireUnlockedAdmin();
  const to = email.trim().toLowerCase();

  const user = await prisma.user.findFirst({
    where: { email: { equals: to, mode: "insensitive" } },
    select: { email: true, name: true },
  });
  if (!user?.email) {
    await audit(admin.email, "tried to send an export link", to, "no such account");
    return { ok: false, error: "No account with that address." };
  }

  const sent = await sendExportLinkEmail({
    to: user.email,
    name: user.name,
    link: `${SITE}/settings`,
  }).catch(() => false);

  await audit(
    admin.email,
    "sent the link to their own copy",
    user.email,
    sent ? "email accepted" : "email did not send",
  );
  revalidatePath("/admintc/audit");
  return sent
    ? { ok: true, said: "Sent. They download it themselves from Settings." }
    : { ok: false, error: "The email did not send." };
}

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
