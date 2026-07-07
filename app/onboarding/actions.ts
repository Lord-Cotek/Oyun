"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { notify } from "@/lib/notify";
import { Role } from "@prisma/client";

/** Mother creates her journey. `dueDate` is the due date, or the birth date if already born. */
export async function createJourney(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");

  const dateStr = String(formData.get("dueDate") ?? "").trim();
  const babyName = String(formData.get("babyName") ?? "").trim() || null;
  const name = String(formData.get("name") ?? "").trim();
  const babyCount = Math.min(4, Math.max(1, parseInt(String(formData.get("babyCount") ?? "1"), 10) || 1));

  if (!dateStr) throw new Error("A due date (or birth date) is required.");
  const dueDate = new Date(dateStr);
  if (Number.isNaN(dueDate.getTime())) throw new Error("That date isn't valid.");

  // Idempotent-ish: if the user already owns a journey, don't duplicate.
  const existing = await prisma.membership.findFirst({
    where: { userId: session.user.id },
  });
  if (existing) redirect("/journey");

  if (name) {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { name },
    });
  }

  const journey = await prisma.journey.create({
    data: {
      ownerId: session.user.id,
      dueDate,
      babyName,
      babyCount,
      memberships: {
        create: { userId: session.user.id, role: Role.MOTHER },
      },
    },
  });

  revalidatePath("/journey");
  redirect(`/journey?welcome=1&j=${journey.id.slice(0, 6)}`);
}

/** Partner / accountability accepts an emailed invite. */
export async function acceptInvite(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");

  const token = String(formData.get("token") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  if (!token) throw new Error("Missing invite token.");

  const invite = await prisma.invite.findUnique({
    where: { token },
    include: { journey: { include: { owner: { select: { id: true, name: true } } } } },
  });
  if (!invite) throw new Error("This invite could not be found.");
  if (invite.acceptedAt) throw new Error("This invite has already been used.");

  const me = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { email: true, name: true },
  });

  // Guard 1: the journey owner can never accept an invite to their own journey.
  if (invite.journey.owner.id === session.user.id) {
    throw new Error("You own this journey — you don't need an invitation to it.");
  }
  // Guard 2: only the person the invite was addressed to may accept it. This
  // stops a signed-in user (e.g. the mother) accepting someone else's invite.
  if (!me?.email || me.email.toLowerCase() !== invite.email.toLowerCase()) {
    throw new Error(
      `This invitation was sent to ${invite.email}. Please sign in with that email to accept it.`,
    );
  }
  // Guard 3: never overwrite an existing role (especially not a MOTHER).
  const existingMembership = await prisma.membership.findUnique({
    where: {
      journeyId_userId: { journeyId: invite.journeyId, userId: session.user.id },
    },
  });
  if (existingMembership) {
    // Already a member — just mark the invite used, don't change their role.
    await prisma.invite.update({ where: { token }, data: { acceptedAt: new Date() } });
    redirect("/journey");
  }

  // A journey may only have one husband/partner.
  if (invite.role === Role.PARTNER) {
    const existingPartner = await prisma.membership.findFirst({
      where: { journeyId: invite.journeyId, role: Role.PARTNER },
    });
    if (existingPartner) {
      throw new Error("This journey already has a husband/partner.");
    }
  }

  if (name) {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { name },
    });
  }

  const motherName = invite.journey.owner.name ?? "her";
  const joinerName = name || session.user.name || "Someone you invited";
  const soon = new Date();
  soon.setDate(soon.getDate() + 1);

  await prisma.$transaction([
    prisma.membership.upsert({
      where: {
        journeyId_userId: { journeyId: invite.journeyId, userId: session.user.id },
      },
      create: {
        journeyId: invite.journeyId,
        userId: session.user.id,
        role: invite.role,
      },
      update: { role: invite.role },
    }),
    prisma.invite.update({
      where: { token },
      data: { acceptedAt: new Date() },
    }),
    // Seed the first gentle nudge for the new supporter.
    prisma.nudge.create({
      data: {
        journeyId: invite.journeyId,
        userId: session.user.id,
        text: `Check in on ${motherName} today — a message, a prayer, a small kindness.`,
        dueAt: soon,
      },
    }),
  ]);

  // Let the mother know her circle grew.
  await notify({
    userId: invite.journey.owner.id,
    type: "invite_accepted",
    title: `${joinerName} joined your journey.`,
    body: "They can now support and pray for you each week.",
    href: "/circle",
    email: true,
  });

  revalidatePath("/journey");
  revalidatePath("/circle");
  redirect("/journey?welcome=1");
}
