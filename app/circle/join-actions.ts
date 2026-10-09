"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getActiveMembership } from "@/lib/data";
import { isHousehold } from "@/lib/roles";
import { sendInviteEmail } from "@/lib/email";
import { Role } from "@prisma/client";

/**
 * Answering somebody who asked to come in.
 *
 * ── The request is evidence, not an instruction ──────────────────────────
 * Nothing the guest typed decides anything here. The role comes from what the
 * mother taps, checked against a list that deliberately does not include
 * PARTNER — a link that was forwarded round a WhatsApp group must not be able
 * to end with somebody standing in the place of her husband, however the form
 * was filled in. What the person claimed to be is shown on the card and is
 * never read by this function at all.
 *
 * ── Why it ends in the ordinary invitation ───────────────────────────────
 * Accepting does not create a membership. It creates exactly the invitation
 * either of them would have created from the circle page, sent to the
 * email she has just read, and the person still has to open it and make an
 * account. One way in, one thing to audit, and nothing about this path is a
 * shortcut past the path that already existed.
 */

/** What a stranger may be welcomed as. PARTNER is not on this list. */
const WELCOME_ROLES: Role[] = [Role.ACCOUNTABILITY, Role.FAMILY, Role.FRIEND];

async function requireHousehold() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in?callbackUrl=/circle");
  const active = await getActiveMembership(session.user.id);
  if (!active) redirect("/onboarding");
  // Either of the two of them. See the note in app/circle/page.tsx.
  if (!isHousehold(active.role)) redirect("/journey");
  return { userId: session.user.id, journey: active.journey };
}

export async function welcomeRequest(input: {
  id: string;
  role: string;
}): Promise<{ ok: boolean; error?: string }> {
  const { journey } = await requireHousehold();

  const req = await prisma.joinRequest.findFirst({
    where: { id: input.id, journeyId: journey.id, status: "PENDING" },
    select: { id: true, email: true, name: true },
  });
  if (!req) return { ok: false, error: "That request is no longer waiting." };

  const role = (WELCOME_ROLES as string[]).includes(input.role)
    ? (input.role as Role)
    : Role.FAMILY;

  // Already in, or already invited: answer the request without making a
  // second invitation, so a double tap cannot fill somebody's inbox.
  const [member, invited] = await Promise.all([
    prisma.membership.findFirst({
      where: { journeyId: journey.id, user: { email: req.email } },
      select: { id: true },
    }),
    prisma.invite.findFirst({
      where: { journeyId: journey.id, email: req.email, acceptedAt: null },
      select: { token: true },
    }),
  ]);

  let token = invited?.token ?? null;
  if (!member && !token) {
    const invite = await prisma.invite.create({
      data: { journeyId: journey.id, email: req.email, role },
      select: { token: true },
    });
    token = invite.token;
  }

  if (token) {
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ??
      "https://oyun.cotek.app";
    await sendInviteEmail({
      to: req.email,
      link: `${siteUrl}/onboarding?invite=${token}`,
      motherName: journey.owner.name ?? "someone",
      role,
    }).catch(() => {
      // Best effort. The invitation exists either way and it can be
      // resent from the circle page.
    });
  }

  await prisma.joinRequest.update({
    where: { id: req.id },
    data: { status: "INVITED", decidedAt: new Date() },
  });

  revalidatePath("/circle");
  return { ok: true };
}

/**
 * No.
 *
 * Marked rather than deleted, and nothing is sent: somebody who is turned
 * down should not receive an email telling them so, and the row is what stops
 * the same browser asking again and again.
 */
export async function declineRequest(id: string): Promise<{ ok: boolean }> {
  const { journey } = await requireHousehold();
  await prisma.joinRequest.updateMany({
    where: { id, journeyId: journey.id, status: "PENDING" },
    data: { status: "DECLINED", decidedAt: new Date() },
  });
  revalidatePath("/circle");
  return { ok: true };
}
