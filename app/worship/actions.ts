"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getActiveMembership } from "@/lib/data";

function utcToday(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

/** Either parent toggles whether the household kept family worship today. */
export async function markWorship() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in?callbackUrl=/worship");
  const active = await getActiveMembership(session.user.id);
  if (!active) redirect("/onboarding");

  const where = {
    journeyId_day: { journeyId: active.journey.id, day: utcToday() },
  };
  const existing = await prisma.worshipDay.findUnique({ where });
  if (existing) {
    // Toggle off — fixes an accidental tap.
    await prisma.worshipDay.delete({ where });
  } else {
    await prisma.worshipDay.create({
      data: { journeyId: active.journey.id, day: utcToday() },
    });
  }
  revalidatePath("/worship");
  revalidatePath("/journey");
}
