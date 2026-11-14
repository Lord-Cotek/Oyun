import { createHash, randomBytes } from "node:crypto";
import { prisma } from "@/lib/prisma";

/**
 * Proving somebody owns the email address on their account.
 *
 * ── Why it matters here ──────────────────────────────────────────────────
 * Admin rights are granted by address, and invitations are matched by
 * address. Until this existed, an address was believed the moment somebody
 * typed it — at sign-up, or in Settings — so an address nobody had proved
 * could carry those rights. Now an address counts once a link sent to it has
 * been opened, a sign-in code sent to it has been used, or an invitation
 * sent to it has been accepted.
 *
 * ── Changing an address ──────────────────────────────────────────────────
 * The new address waits in `pendingEmail` and only becomes the account's
 * email when its link is opened. Until then everything — signing in, admin,
 * invitations — still runs on the old one.
 *
 * Tokens are stored hashed, so a copy of the database holds nothing that
 * opens a link. Shared with the sibling app and drift-checked.
 */
export const CONFIRM_TTL_MS = 3 * 24 * 60 * 60 * 1000;

/**
 * Accounts made before this rule existed are trusted as they always were,
 * for everything except admin rights — those need a confirmed address
 * whenever the account was made.
 */
export const CONFIRMED_BEFORE = new Date("2026-11-15T00:00:00.000Z");

export function hashToken(raw: string): string {
  return createHash("sha256").update(raw).digest("hex");
}

/** Has this account's address been proved (or is it from before the rule)? */
export function isConfirmed(u: { emailVerified: Date | null; createdAt: Date }): boolean {
  return !!u.emailVerified || u.createdAt < CONFIRMED_BEFORE;
}

/** A fresh link for this account and address; any older link for it stops working. */
export async function makeConfirmLink(userId: string, email: string, base: string): Promise<string> {
  const raw = randomBytes(24).toString("base64url");
  await prisma.verificationToken.deleteMany({ where: { identifier: { startsWith: `confirm:${userId}:` } } });
  await prisma.verificationToken.create({
    data: {
      identifier: `confirm:${userId}:${email.trim().toLowerCase()}`,
      token: hashToken(raw),
      expires: new Date(Date.now() + CONFIRM_TTL_MS),
    },
  });
  return `${base.replace(/\/+$/, "")}/confirm-email?t=${encodeURIComponent(raw)}`;
}

export type ConfirmResult =
  | { ok: true; email: string; changed: boolean }
  | { ok: false; error: string };

/** Open a link: the address is proved, and a pending change takes effect. */
export async function redeemConfirmLink(raw: string): Promise<ConfirmResult> {
  if (!raw) return { ok: false, error: "That link is incomplete." };
  const row = await prisma.verificationToken.findUnique({ where: { token: hashToken(raw) } });
  if (!row || !row.identifier.startsWith("confirm:")) {
    return { ok: false, error: "That link has already been used, or a newer one was sent." };
  }
  await prisma.verificationToken.deleteMany({ where: { token: row.token } });
  if (row.expires < new Date()) return { ok: false, error: "That link has expired. Send a new one from Settings." };

  const [, userId, ...rest] = row.identifier.split(":");
  const email = rest.join(":");
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, pendingEmail: true },
  });
  if (!user) return { ok: false, error: "That account is no longer here." };

  const changing = (user.email ?? "").toLowerCase() !== email;
  if (changing) {
    // Only the change this account actually asked for, and only while it is
    // still the one waiting.
    if ((user.pendingEmail ?? "").toLowerCase() !== email) {
      return { ok: false, error: "That change was replaced by a newer one." };
    }
    const taken = await prisma.user.findFirst({ where: { email, id: { not: user.id } }, select: { id: true } });
    if (taken) return { ok: false, error: "That address now belongs to another account." };
  }
  await prisma.user.update({
    where: { id: user.id },
    data: { email, emailVerified: new Date(), pendingEmail: null },
  });
  return { ok: true, email, changed: changing };
}

/** The address was proved some other way: a sign-in code, an accepted invitation. */
export async function markConfirmed(userId: string): Promise<void> {
  await prisma.user
    .updateMany({ where: { id: userId, emailVerified: null }, data: { emailVerified: new Date() } })
    .catch(() => {});
}
