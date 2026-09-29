"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getActiveMembership } from "@/lib/data";
import { INVITABLE_ROLES, isHousehold } from "@/lib/roles";

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

/** Remove a supporter from the journey (never the mother, never yourself). */
export async function removeMember(formData: FormData) {
  const { userId, journeyId } = await requireHousehold();
  const membershipId = String(formData.get("membershipId") ?? "");
  await prisma.membership.deleteMany({
    where: {
      id: membershipId,
      journeyId,
      role: { in: INVITABLE_ROLES },
      userId: { not: userId },
    },
  });
  revalidatePath("/circle");
}
