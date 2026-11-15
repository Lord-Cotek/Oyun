import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Stopping an email from the email itself.
 *
 * Every optional email — the weekly one, the notification emails, the
 * announcements people opted into — carries a link and the List-Unsubscribe
 * headers mail apps read, so "Unsubscribe" sits beside the sender in Gmail
 * and Apple Mail. Email law asks for it, and providers file mail without it
 * as spam more readily.
 *
 * The link is signed (an HMAC of the person and the kind of email) so it can
 * only ever switch off that one kind of email for that one person. It cannot
 * be guessed from somebody's id, and it changes nothing else.
 *
 * Emails about the account itself — a sign-in code, a password reset, an
 * address confirmation — carry no such link. They are not optional.
 */

export const UNSUB_KINDS = {
  /** The Monday email. Turns off User.weeklyDigest. */
  weekly: "weeklyDigest",
  /** Notification emails and the announcements sent to those who opted in.
   *  Turns off User.notifyByEmail. */
  email: "notifyByEmail",
} as const;

export type UnsubKind = keyof typeof UNSUB_KINDS;

export function isUnsubKind(v: unknown): v is UnsubKind {
  return typeof v === "string" && Object.prototype.hasOwnProperty.call(UNSUB_KINDS, v);
}

function secret(): string {
  const s = process.env.UNSUBSCRIBE_SECRET || process.env.NEXTAUTH_SECRET;
  if (!s) throw new Error("No secret to sign unsubscribe links with.");
  return s;
}

export function unsubToken(userId: string, kind: UnsubKind): string {
  return createHmac("sha256", secret()).update(`unsub:${userId}:${kind}`).digest("base64url");
}

export function checkUnsubToken(userId: string, kind: UnsubKind, token: string): boolean {
  try {
    const want = Buffer.from(unsubToken(userId, kind));
    const got = Buffer.from(token);
    return want.length === got.length && timingSafeEqual(want, got);
  } catch {
    return false;
  }
}

function query(userId: string, kind: UnsubKind): string {
  return `u=${encodeURIComponent(userId)}&k=${kind}&t=${unsubToken(userId, kind)}`;
}

/** The page a person lands on from the link in the email. */
export function unsubPageUrl(base: string, userId: string, kind: UnsubKind): string {
  return `${base.replace(/\/+$/, "")}/unsubscribe?${query(userId, kind)}`;
}

/** Where a mail app POSTs a one-click unsubscribe (RFC 8058). */
export function unsubPostUrl(base: string, userId: string, kind: UnsubKind): string {
  return `${base.replace(/\/+$/, "")}/api/unsubscribe?${query(userId, kind)}`;
}

/** The headers mail apps read to show their own Unsubscribe button. */
export function unsubHeaders(base: string, userId: string, kind: UnsubKind): Record<string, string> {
  return {
    "List-Unsubscribe": `<${unsubPostUrl(base, userId, kind)}>`,
    "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
  };
}

/** Switch it off. Returns false if the link was not genuine. */
export async function applyUnsubscribe(userId: string, kind: UnsubKind, token: string): Promise<boolean> {
  if (!checkUnsubToken(userId, kind, token)) return false;
  const { prisma } = await import("@/lib/prisma");
  await prisma.user.updateMany({ where: { id: userId }, data: { [UNSUB_KINDS[kind]]: false } });
  return true;
}
