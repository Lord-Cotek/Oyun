"use server";

import { prisma } from "@/lib/prisma";
import { hashPassword, passwordProblem } from "@/lib/password";
import { sendWelcomeEmail } from "@/lib/email";

export async function registerUser(
  _prev: unknown,
  formData: FormData,
): Promise<{ ok: boolean; error?: string }> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !email.includes("@")) {
    return { ok: false, error: "Please enter a valid email address." };
  }
  const pwProblem = passwordProblem(password);
  if (pwProblem) return { ok: false, error: pwProblem };

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    if (existing.passwordHash) {
      return { ok: false, error: "An account with this email already exists. Try signing in." };
    }
    // A shell user (e.g. from a prior invite) — set the password now.
    await prisma.user.update({
      where: { id: existing.id },
      data: { passwordHash: await hashPassword(password), name: name || existing.name },
    });
  } else {
    await prisma.user.create({
      data: {
        email,
        name: name || null,
        passwordHash: await hashPassword(password),
      },
    });
  }

  // Best-effort welcome email — never blocks account creation.
  await sendWelcomeEmail({ to: email, name }).catch(() => {});

  return { ok: true };
}
