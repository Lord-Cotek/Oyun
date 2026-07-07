"use server";

import { prisma } from "@/lib/prisma";
import { hashPassword, passwordProblem } from "@/lib/password";

export async function resetPassword(
  _prev: unknown,
  formData: FormData,
): Promise<{ ok: boolean; error?: string }> {
  const token = String(formData.get("token") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (!token) return { ok: false, error: "This reset link is missing its token." };

  const pwProblem = passwordProblem(password);
  if (pwProblem) return { ok: false, error: pwProblem };
  if (password !== confirm) return { ok: false, error: "Those passwords don't match." };

  const record = await prisma.passwordResetToken.findUnique({ where: { token } });
  if (!record || record.expires < new Date()) {
    return { ok: false, error: "This reset link is invalid or has expired. Please request a new one." };
  }

  const user = await prisma.user.findUnique({ where: { email: record.email } });
  if (!user) {
    return { ok: false, error: "We couldn't find that account. Please sign up instead." };
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: await hashPassword(password) },
    }),
    // Invalidate every outstanding reset token for this account.
    prisma.passwordResetToken.deleteMany({ where: { email: record.email } }),
  ]);

  return { ok: true };
}
