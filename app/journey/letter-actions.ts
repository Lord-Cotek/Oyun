"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getActiveMembership } from "@/lib/data";
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
  await prisma.letter.create({
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
      href: o.role === "MOTHER" ? "/care" : "/journey",
      email: true,
    });
  }

  revalidatePath("/care");
  revalidatePath("/journey");
}
