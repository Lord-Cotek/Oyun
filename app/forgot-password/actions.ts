"use server";

import { randomBytes } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/email";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const TTL_MS = 60 * 60 * 1000; // 1 hour

/**
 * Always returns a generic success — we never reveal whether an email is
 * registered (no account enumeration). A reset link is only actually sent when
 * a matching account exists.
 */
export async function requestPasswordReset(
  _prev: unknown,
  formData: FormData,
): Promise<{ ok: boolean; error?: string }> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!email || !email.includes("@")) {
    return { ok: false, error: "Please enter a valid email address." };
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (user) {
    const token = randomBytes(32).toString("hex");
    await prisma.$transaction([
      prisma.passwordResetToken.deleteMany({ where: { email } }),
      prisma.passwordResetToken.create({
        data: { email, token, expires: new Date(Date.now() + TTL_MS) },
      }),
    ]);
    const link = `${siteUrl}/reset-password?token=${token}`;
    await sendPasswordResetEmail({ to: email, link }).catch(() => {});
  }

  return { ok: true };
}
