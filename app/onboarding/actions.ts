"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Role } from "@prisma/client";

/** Mother creates her journey. `dueDate` is the due date, or the birth date if already born. */
export async function createJourney(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");

  const dateStr = String(formData.get("dueDate") ?? "").trim();
  const babyName = String(formData.get("babyName") ?? "").trim() || null;
  const name = String(formData.get("name") ?? "").trim();

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
    include: { journey: { include: { owner: { select: { name: true } } } } },
  });
  if (!invite) throw new Error("This invite could not be found.");
  if (invite.acceptedAt) throw new Error("This invite has already been used.");

  if (name) {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { name },
    });
  }

  const motherName = invite.journey.owner.name ?? "her";
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

  revalidatePath("/journey");
  redirect("/journey?welcome=1");
}
