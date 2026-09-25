"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SAID_MAX, isConcernKind } from "@/lib/concerns";
import { isOn } from "@/lib/flags";

type Result = { ok: true; said: string } | { ok: false; error: string };

/**
 * Somebody writing to us.
 *
 * ── Why this takes their words and nothing else ──────────────────────────
 * There is no entry id here, no thread, nothing to attach. That is the whole
 * design: a concern is what a person chose to tell us, and an admin reading
 * it is reading something addressed to them. The moment it carries a pointer
 * to somebody else's words, the centre is reading a diary and the promise the
 * app makes to a mother is finished.
 *
 * Everything genuinely serious needs a human conversation anyway. This is how
 * that conversation starts, not a substitute for it.
 */
export async function raiseConcern(formData: FormData): Promise<Result> {
  if (!(await isOn("concerns"))) {
    return { ok: false, error: "This is turned off just now. Please email us." };
  }

  const session = await auth();
  const userId = session?.user?.id ?? null;

  const kind = String(formData.get("kind") ?? "");
  const said = String(formData.get("said") ?? "").trim();
  const typedEmail = String(formData.get("email") ?? "").trim().toLowerCase();

  if (!isConcernKind(kind)) return { ok: false, error: "Choose what this is about." };
  if (!said) return { ok: false, error: "Tell us what is happening." };
  if (said.length > SAID_MAX) {
    return { ok: false, error: `That is longer than we can take — ${SAID_MAX} characters.` };
  }

  // The address on the account when there is one, so a person cannot be
  // written to at an address they do not hold by someone else's report.
  let email = typedEmail;
  if (userId) {
    const me = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    });
    if (me?.email) email = me.email;
  }
  if (!email || !email.includes("@")) {
    return { ok: false, error: "We need an address to write back to." };
  }

  await prisma.concern.create({ data: { userId, email, kind, said } });

  return {
    ok: true,
    said: "Thank you — that has reached us. Somebody will read it and write back to you.",
  };
}
