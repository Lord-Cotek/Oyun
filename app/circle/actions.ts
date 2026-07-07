"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getActiveMembership } from "@/lib/data";

async function requireMother() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in?callbackUrl=/circle");
  const active = await getActiveMembership(session.user.id);
  if (!active || active.role !== "MOTHER") redirect("/journey");
  return { userId: session.user.id, journeyId: active.journey.id };
}

/** Cancel a pending invite. */
export async function revokeInvite(formData: FormData) {
  const { journeyId } = await requireMother();
  const inviteId = String(formData.get("inviteId") ?? "");
  await prisma.invite.deleteMany({ where: { id: inviteId, journeyId } });
  revalidatePath("/circle");
}

/** Remove a supporter from the journey (never the mother herself). */
export async function removeMember(formData: FormData) {
  const { userId, journeyId } = await requireMother();
  const membershipId = String(formData.get("membershipId") ?? "");
  await prisma.membership.deleteMany({
    where: {
      id: membershipId,
      journeyId,
      role: { in: ["PARTNER", "ACCOUNTABILITY"] },
      userId: { not: userId },
    },
  });
  revalidatePath("/circle");
}
