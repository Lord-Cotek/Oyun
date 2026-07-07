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

/** Either parent marks that the household kept family worship today. Idempotent. */
export async function markWorship() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in?callbackUrl=/worship");
  const active = await getActiveMembership(session.user.id);
  if (!active) redirect("/onboarding");

  await prisma.worshipDay.upsert({
    where: { journeyId_day: { journeyId: active.journey.id, day: utcToday() } },
    create: { journeyId: active.journey.id, day: utcToday() },
    update: {},
  });
  revalidatePath("/worship");
  revalidatePath("/journey");
}
