"use server";

import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import {
  audit,
  mintUnlock,
  requireAdmin,
  UNLOCK_COOKIE_NAME,
  UNLOCK_MINUTES,
} from "@/lib/admin";
import { verifyPassword } from "@/lib/password";

/**
 * Confirming the password to open the centre.
 *
 * ── Why this exists when they are already signed in ──────────────────────
 * Because the one thing an admin can do that outlasts them is add another
 * admin. Somebody who reaches an unlocked laptop with a live session could
 * leave themselves a way back in that survives the owner changing their
 * password. Asking once, for thirty minutes, closes that door.
 *
 * It is the account's own password, checked against the same hash the
 * sign-in uses — not a second shared secret to be written on something. An
 * admin with no password set (an account made another way) is told so and
 * sent to set one, rather than being quietly let in.
 */
export async function unlock(
  formData: FormData,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const admin = await requireAdmin();
  const password = String(formData.get("password") ?? "");

  // admin-reach: allow passwordHash — compared against the admin's OWN
  // password, for their own account, and never rendered or returned. This is
  // the door to the centre, not a way through it: the hash is read, handed
  // to bcrypt, and dropped.
  const user = await prisma.user.findFirst({
    where: { email: { equals: admin.email, mode: "insensitive" } },
    select: { passwordHash: true },
  });

  if (!user?.passwordHash) {
    await audit(admin.email, "could not unlock the admin centre", admin.email, "no password set");
    return {
      ok: false,
      error:
        "This account has no password set. Set one in Settings, then come back.",
    };
  }

  if (!(await verifyPassword(password, user.passwordHash))) {
    // Written down: a wrong password at this door is worth being able to see
    // afterwards, and it is the one failure here somebody might need to
    // count.
    await audit(admin.email, "got the admin password wrong", admin.email);
    return { ok: false, error: "That is not the password on this account." };
  }

  const { value, expires } = mintUnlock(admin.email);
  cookies().set(UNLOCK_COOKIE_NAME, value, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/admintc",
    expires,
  });
  await audit(admin.email, "unlocked the admin centre", admin.email, `${UNLOCK_MINUTES} minutes`);
  return { ok: true };
}

/**
 * Close it again, without signing out of the app.
 *
 * Deleted at the SAME path it was set on. `cookies().delete(name)` removes a
 * cookie at "/", which is not where this one lives, so the first version of
 * this left the centre open and only looked like it had closed — a lock that
 * does nothing is worse than no lock, because somebody trusts it.
 */
export async function lock(): Promise<void> {
  const admin = await requireAdmin();
  cookies().set(UNLOCK_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/admintc",
    expires: new Date(0),
  });
  await audit(admin.email, "locked the admin centre", admin.email);
}
