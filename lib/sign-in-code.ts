import { createHash, randomInt, timingSafeEqual } from "node:crypto";
import { prisma } from "@/lib/prisma";

/**
 * Signing in with a code sent by email — an option, never a requirement.
 *
 * ── Why ──────────────────────────────────────────────────────────────────
 * Grandparents abroad open the app at a birthday and have forgotten the
 * password they set a year ago. A six-digit code to the address they already
 * read is gentler than a reset. The password stays the ordinary way in; the
 * code is a link under it.
 *
 * ── The rules ────────────────────────────────────────────────────────────
 * Six digits, ten minutes, five tries, one code per address at a time (a new
 * request replaces the old). Stored hashed with the address, so a copy of
 * the database opens nothing. Asking for a code never says whether an
 * account exists. Using one proves the address, so it marks it confirmed.
 *
 * Shared with the sibling app and drift-checked.
 */
export const CODE_TTL_MS = 10 * 60 * 1000;
export const CODE_TRIES = 5;

function hashCode(email: string, code: string): string {
  return createHash("sha256").update(`${email.trim().toLowerCase()}:${code}`).digest("hex");
}

/**
 * Make a code for this address, if it belongs to an account that may sign in.
 * Returns the code to email, or null — and the caller says the same thing to
 * the person either way.
 */
export async function makeSignInCode(rawEmail: string): Promise<{ code: string; name: string | null } | null> {
  const email = rawEmail.trim().toLowerCase();
  if (!email.includes("@")) return null;
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, name: true, suspendedAt: true },
  });
  if (!user || user.suspendedAt) return null;
  const code = String(randomInt(0, 1_000_000)).padStart(6, "0");
  await prisma.signInCode.deleteMany({ where: { email } });
  await prisma.signInCode.create({
    data: { email, codeHash: hashCode(email, code), expires: new Date(Date.now() + CODE_TTL_MS) },
  });
  return { code, name: user.name };
}

/** Check a code. On success the code is spent and the account returned. */
export async function redeemSignInCode(
  rawEmail: string,
  rawCode: string,
): Promise<{ id: string; email: string; name: string | null } | null> {
  const email = rawEmail.trim().toLowerCase();
  const code = rawCode.replace(/\D/g, "");
  if (!email || code.length !== 6) return null;
  const row = await prisma.signInCode.findFirst({ where: { email }, orderBy: { createdAt: "desc" } });
  if (!row) return null;
  if (row.expires < new Date() || row.attempts >= CODE_TRIES) {
    await prisma.signInCode.deleteMany({ where: { email } });
    return null;
  }
  const want = Buffer.from(row.codeHash, "hex");
  const got = Buffer.from(hashCode(email, code), "hex");
  if (want.length !== got.length || !timingSafeEqual(want, got)) {
    await prisma.signInCode.update({ where: { id: row.id }, data: { attempts: { increment: 1 } } });
    return null;
  }
  await prisma.signInCode.deleteMany({ where: { email } });
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, name: true, suspendedAt: true },
  });
  if (!user || !user.email || user.suspendedAt) return null;
  // The code reached this inbox, so the address is theirs.
  await prisma.user.updateMany({ where: { id: user.id, emailVerified: null }, data: { emailVerified: new Date() } });
  return { id: user.id, email: user.email, name: user.name };
}
