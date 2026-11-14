"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getActiveMembership } from "@/lib/data";
import { cookies } from "next/headers";
import { INVITABLE_ROLES, ROLE_LABEL, SUPPORTER_ROLES, isHousehold } from "@/lib/roles";
import { ACTIVE_JOURNEY_COOKIE } from "@/lib/data";
import { notify } from "@/lib/notify";

/**
 * Either of the two of them.
 *
 * `removeMember` below is still safe with a wider door: it only ever deletes
 * a membership whose role is in INVITABLE_ROLES and whose user is not the
 * caller, so the mother cannot be removed by anybody and neither of them can
 * remove themselves.
 */
async function requireHousehold() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in?callbackUrl=/circle");
  const active = await getActiveMembership(session.user.id);
  if (!active || !isHousehold(active.role)) redirect("/journey");
  return { userId: session.user.id, journeyId: active.journey.id };
}

/** Cancel a pending invite. */
export async function revokeInvite(formData: FormData) {
  const { journeyId } = await requireHousehold();
  const inviteId = String(formData.get("inviteId") ?? "");
  await prisma.invite.deleteMany({ where: { id: inviteId, journeyId } });
  revalidatePath("/circle");
}

/**
 * Take somebody's seat away, and what that seat alone gave them: a place
 * planning a surprise here, so a helper who has gone is not still told who
 * is coming. What they wrote stays where it is.
 */
async function endSeat(journeyId: string, membershipId: string, userId: string) {
  await prisma.$transaction([
    prisma.surprisePlanner.deleteMany({ where: { userId, event: { journeyId } } }),
    prisma.membership.deleteMany({ where: { id: membershipId, journeyId, role: { in: INVITABLE_ROLES } } }),
  ]);
}

/** Remove a supporter from the journey (never the mother, never yourself). */
export async function removeMember(formData: FormData) {
  const { userId, journeyId } = await requireHousehold();
  const membershipId = String(formData.get("membershipId") ?? "");
  const m = await prisma.membership.findFirst({
    where: {
      id: membershipId,
      journeyId,
      role: { in: INVITABLE_ROLES },
      userId: { not: userId },
    },
    select: { id: true, userId: true },
  });
  if (m) await endSeat(journeyId, m.id, m.userId);
  revalidatePath("/circle");
}

/**
 * What somebody is in the circle — a friend who has become family, an
 * accountability partner who is now simply a friend.
 *
 * Either of the two of them may move somebody between the circle's roles.
 * Making somebody her PARTNER, or taking that from them, is the mother's
 * alone: it opens or closes the most private rooms she has. Nobody changes
 * the mother, and nobody changes themselves.
 */
export async function changeMemberRole(
  membershipId: string,
  role: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: "Please sign in again." };
  const active = await getActiveMembership(session.user.id);
  if (!active || !isHousehold(active.role)) {
    return { ok: false, error: "Only the two of you can do that." };
  }
  const journeyId = active.journey.id;
  if (!(INVITABLE_ROLES as string[]).includes(role)) {
    return { ok: false, error: "Choose one of the roles." };
  }
  const m = await prisma.membership.findFirst({
    where: { id: membershipId, journeyId },
    select: { id: true, userId: true, role: true },
  });
  if (!m) return { ok: false, error: "They are no longer in the circle." };
  if (m.role === "MOTHER") return { ok: false, error: "It is her journey; her place does not change." };
  if (m.userId === session.user.id) return { ok: false, error: "Your own place is changed by the other of you." };
  if (m.role === role) return { ok: true };
  const touchesPartner = m.role === "PARTNER" || role === "PARTNER";
  if (touchesPartner && active.role !== "MOTHER") {
    return { ok: false, error: "Only she can make somebody her partner, or change that." };
  }
  if (!touchesPartner && !(SUPPORTER_ROLES as string[]).includes(role)) {
    return { ok: false, error: "Choose one of the roles." };
  }

  await prisma.membership.update({
    where: { id: m.id },
    data: { role: role as (typeof INVITABLE_ROLES)[number] },
  });
  await notify({
    userId: m.userId,
    type: "membership",
    title: `You are now ${ROLE_LABEL[role] ?? role} in ${active.journey.owner?.name ?? "her"}'s circle.`,
    href: "/journey",
  }).catch(() => {});
  revalidatePath("/circle");
  revalidatePath("/journey");
  return { ok: true };
}

/**
 * Go. Anyone but the mother, any time, without asking — from Settings, never
 * this page, which is the two of them deciding who else is in.
 */
export async function leaveCircle(): Promise<{ ok: true } | { ok: false; error: string }> {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: "Please sign in again." };
  const active = await getActiveMembership(session.user.id);
  if (!active) return { ok: false, error: "There is no circle open." };
  if (active.role === "MOTHER") {
    return { ok: false, error: "This is your own journey, so it cannot be left." };
  }
  const journeyId = active.journey.id;
  const me = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true },
  });
  await endSeat(journeyId, active.membership.id, session.user.id);

  // The two of them hear it from the app rather than notice an empty chair.
  const two = await prisma.membership.findMany({
    where: { journeyId, role: { in: ["MOTHER", "PARTNER"] } },
    select: { userId: true },
  });
  for (const t of two) {
    await notify({
      userId: t.userId,
      type: "membership",
      title: `${me?.name ?? me?.email ?? "Someone"} has left the circle.`,
      href: "/circle",
    }).catch(() => {});
  }
  cookies().delete(ACTIVE_JOURNEY_COOKIE);
  revalidatePath("/", "layout");
  return { ok: true };
}
