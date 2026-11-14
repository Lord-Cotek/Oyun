"use server";

import { prisma } from "@/lib/prisma";
import { HOUR, allowAll, callerIp } from "@/lib/rate-limit";
import { hashPassword, passwordProblem } from "@/lib/password";
import { sendConfirmEmail, sendWelcomeEmail } from "@/lib/email";
import { makeConfirmLink } from "@/lib/email-confirm";

const SITE_DEFAULT = "https://oyun.cotek.app";

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
  // Ten new accounts a device an hour — far past a family signing up together.
  if (!(await allowAll([[`signup:ip:${callerIp()}`, 10, HOUR]]))) {
    return { ok: false, error: "Too many new accounts from here just now. Please try again in a little while." };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    // Never set a password on an account that already exists, even one with
    // no password yet: typing an address at sign-up proves nothing about
    // owning it. The owner can sign in with an emailed code, or reset.
    return {
      ok: false,
      error: existing.passwordHash
        ? "An account with this email already exists. Try signing in."
        : "An account with this email already exists. Sign in with an emailed code, or reset your password.",
    };
  }
  const made = await prisma.user.create({
    data: {
      email,
      name: name || null,
      passwordHash: await hashPassword(password),
    },
    select: { id: true },
  });

  // "Is this really your address?" — the account works straight away; the
  // link proves the address is theirs, which admin rights depend on. Opening
  // an emailed invitation or signing in with an emailed code proves it too.
  // See lib/email-confirm.ts.
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? SITE_DEFAULT;
  await makeConfirmLink(made.id, email, site)
    .then((link) => sendConfirmEmail({ to: email, name, link }))
    .catch(() => {});

  await sendWelcomeEmail({ to: email, name }).catch(() => {});

  return { ok: true };
}
