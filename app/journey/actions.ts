"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getActiveMembership } from "@/lib/data";
import { sendInviteEmail } from "@/lib/email";
import { Role } from "@prisma/client";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/** The mother invites a husband / accountability partner by email. */
export async function createInvite(
  formData: FormData,
): Promise<{ ok: true; link: string } | { ok: false; error: string }> {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");

  const active = await getActiveMembership(session.user.id);
  if (!active || active.role !== "MOTHER") {
    return { ok: false, error: "Only the mother can send invites." };
  }

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const roleRaw = String(formData.get("role") ?? "PARTNER");
  if (!email || !email.includes("@")) {
    return { ok: false, error: "Please enter a valid email." };
  }
  const role = roleRaw === "ACCOUNTABILITY" ? Role.ACCOUNTABILITY : Role.PARTNER;

  // A journey has exactly one husband/partner (but any number of accountability
  // partners). Block a second partner invite when one already exists.
  if (role === Role.PARTNER) {
    const [existingPartner, pendingPartner] = await Promise.all([
      prisma.membership.findFirst({
        where: { journeyId: active.journey.id, role: Role.PARTNER },
      }),
      prisma.invite.findFirst({
        where: { journeyId: active.journey.id, role: Role.PARTNER, acceptedAt: null },
      }),
    ]);
    if (existingPartner) {
      return {
        ok: false,
        error: "You already have a husband/partner. Remove them first to invite another.",
      };
    }
    if (pendingPartner) {
      return {
        ok: false,
        error: "You already have a pending husband/partner invite. Cancel it first.",
      };
    }
  }

  const invite = await prisma.invite.create({
    data: { journeyId: active.journey.id, email, role },
  });

  const link = `${siteUrl}/onboarding?invite=${invite.token}`;
  const motherName = active.journey.owner.name ?? "someone";
  await sendInviteEmail({ to: email, link, motherName, role }).catch(() => {
    // Email is best-effort; the shareable link is always returned.
  });

  revalidatePath("/journey");
  return { ok: true, link };
}
