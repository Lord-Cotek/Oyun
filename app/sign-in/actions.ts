"use server";

import { makeSignInCode } from "@/lib/sign-in-code";
import { sendSignInCodeEmail } from "@/lib/email";
import { HOUR, allowAll, callerIp } from "@/lib/rate-limit";

/**
 * Email a sign-in code. The answer is the same whether or not an account
 * has that address, so this cannot be used to find out who is here. Five
 * codes an address and twenty a device in an hour.
 */
export async function requestSignInCode(rawEmail: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const email = String(rawEmail ?? "").trim().toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return { ok: false, error: "Please enter your email address." };
  }
  const ip = callerIp();
  if (
    !(await allowAll([
      [`code:email:${email}`, 5, HOUR],
      [`code:ip:${ip}`, 20, HOUR],
    ]))
  ) {
    return { ok: false, error: "That's a lot of codes in a short while. Please wait a little, or use your password." };
  }
  const made = await makeSignInCode(email);
  if (made) await sendSignInCodeEmail({ to: email, name: made.name, code: made.code }).catch(() => {});
  return { ok: true };
}
