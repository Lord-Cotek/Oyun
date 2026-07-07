"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getActiveMembership } from "@/lib/data";
import { notify } from "@/lib/notify";
import { MilestoneKind } from "@prisma/client";

/**
 * The "birth moment" — one step that ties everything together:
 * records the actual birth date (correcting the timeline), creates a profile
 * for each baby, logs the BIRTH milestone, and — if chosen — tells the circle.
 */
export async function recordBirth(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in?callbackUrl=/journey");
  const active = await getActiveMembership(session.user.id);
  if (!active || active.role !== "MOTHER") redirect("/journey");

  const journeyId = active.journey.id;
  const dateStr = String(formData.get("birthDate") ?? "").trim();
  if (!dateStr) throw new Error("Please enter the birth date.");
  const birthDate = new Date(dateStr);
  if (Number.isNaN(birthDate.getTime())) throw new Error("That date isn't valid.");

  const babyCount = Math.max(1, active.journey.babyCount);
  const names: string[] = [];
  for (let i = 0; i < babyCount; i++) {
    const n = String(formData.get(`name${i}`) ?? "").trim();
    if (n) names.push(n);
  }
  const share = String(formData.get("share") ?? "") === "on";

  await prisma.$transaction([
    // The due date doubles as the pivot — set it to the true arrival so the
    // journey's month count is accurate from here on.
    prisma.journey.update({
      where: { id: journeyId },
      data: {
        dueDate: birthDate,
        babyName: names[0] ?? active.journey.babyName,
      },
    }),
    prisma.milestone.create({
      data: { journeyId, kind: MilestoneKind.BIRTH, occurredAt: birthDate },
    }),
    ...names.map((name) =>
      prisma.child.create({
        data: { journeyId, name, birthDate },
      }),
    ),
  ]);

  if (share) {
    const who = names.length
      ? names.join(" & ")
      : babyCount > 1
        ? "The babies"
        : "The baby";
    const others = await prisma.membership.findMany({
      where: { journeyId, userId: { not: session.user.id } },
      select: { userId: true },
    });
    await Promise.all(
      others.map((m) =>
        notify({
          userId: m.userId,
          type: "invite_accepted",
          title: `${who} ${names.length > 1 ? "have" : "has"} arrived! 🎉`,
          body: "Rejoice and give thanks — a new life is here.",
          href: "/journey",
          email: true,
        }),
      ),
    );
  }

  revalidatePath("/journey");
  revalidatePath("/child");
  revalidatePath("/care");
  redirect("/journey?born=1");
}
