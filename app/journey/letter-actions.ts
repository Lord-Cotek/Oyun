"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getActiveMembership, getCoupleLetters, type CoupleLettersPage } from "@/lib/data";
import { notify } from "@/lib/notify";

/**
 * Write a letter "to each other" — the shared thread between the mother and her
 * husband (PARTNER). Either of them may write; an accountability partner may
 * not. The other spouse is gently notified.
 */
export async function addCoupleLetter(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in?callbackUrl=/journey");
  const active = await getActiveMembership(session.user.id);
  if (!active || (active.role !== "MOTHER" && active.role !== "PARTNER")) {
    redirect("/journey");
  }

  const body = String(formData.get("body") ?? "").trim();
  if (!body) throw new Error("A letter needs a few words.");

  const journeyId = active.journey.id;
  const letter = await prisma.letter.create({
    data: { journeyId, authorId: session.user.id, body, toBaby: false },
  });

  const me = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true },
  });
  const who = me?.name?.trim() || (active.role === "MOTHER" ? "She" : "He");

  const others = await prisma.membership.findMany({
    where: {
      journeyId,
      role: { in: ["MOTHER", "PARTNER"] },
      userId: { not: session.user.id },
    },
    select: { userId: true, role: true },
  });
  for (const o of others) {
    await notify({
      userId: o.userId,
      type: "encouragement",
      title: `${who} wrote you a letter.`,
      href: `${o.role === "MOTHER" ? "/care" : "/journey"}#letter-${letter.id}`,
      email: true,
    });
  }

  revalidatePath("/care");
  revalidatePath("/journey");
}

/**
 * Load an older page of the couple's thread (letters before `beforeISO`), for
 * the "Show earlier letters" control. Scoped to the viewer's own journey and
 * to the couple.
 */
export async function loadEarlierCoupleLetters(
  beforeISO: string,
): Promise<CoupleLettersPage> {
  const session = await auth();
  if (!session?.user?.id) return { items: [], hasMore: false };
  const active = await getActiveMembership(session.user.id);
  if (!active || (active.role !== "MOTHER" && active.role !== "PARTNER")) {
    return { items: [], hasMore: false };
  }
  return getCoupleLetters(active.journey.id, session.user.id, {
    before: beforeISO,
    limit: 10,
  });
}
