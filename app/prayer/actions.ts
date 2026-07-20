"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getActiveMembership } from "@/lib/data";
import { notify } from "@/lib/notify";

async function requireMember() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in?callbackUrl=/prayer");
  const active = await getActiveMembership(session.user.id);
  if (!active) redirect("/onboarding");
  return { userId: session.user.id, journeyId: active.journey.id, role: active.role };
}

export async function addPrayerRequest(formData: FormData) {
  const { userId, journeyId } = await requireMember();
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim() || null;
  if (!title) throw new Error("Give your request a short title.");
  if (title.length > 200) throw new Error("Keep the title short.");

  const request = await prisma.prayerRequest.create({
    data: { journeyId, authorId: userId, title, body },
  });

  const [others, actor] = await Promise.all([
    prisma.membership.findMany({
      where: { journeyId, userId: { not: userId } },
      select: { userId: true },
    }),
    prisma.user.findUnique({ where: { id: userId }, select: { name: true } }),
  ]);
  const who = actor?.name?.trim() || "Someone in your circle";
  await Promise.all(
    others.map((m) =>
      notify({
        userId: m.userId,
        type: "encouragement",
        title: `${who} asked for prayer: ${title}`,
        href: `/prayer#prayer-${request.id}`,
      }),
    ),
  );

  revalidatePath("/prayer");
  revalidatePath("/journey");
  return { id: request.id };
}

export async function prayForRequest(requestId: string) {
  const { userId, journeyId } = await requireMember();
  // Ensure the request belongs to the viewer's journey.
  const req = await prisma.prayerRequest.findFirst({
    where: { id: requestId, journeyId },
    select: { id: true },
  });
  if (!req) return;

  await prisma.prayerPray.upsert({
    where: { requestId_userId: { requestId, userId } },
    create: { requestId, userId },
    update: {},
  });
  revalidatePath("/prayer");
  revalidatePath("/journey");
}

export async function markAnswered(formData: FormData) {
  const { userId, journeyId, role } = await requireMember();
  const requestId = String(formData.get("requestId") ?? "");
  const req = await prisma.prayerRequest.findFirst({
    where: { id: requestId, journeyId },
    include: { author: { select: { name: true } } },
  });
  if (!req) return;
  // Author or the mother can mark answered.
  if (req.authorId !== userId && role !== "MOTHER") return;

  await prisma.prayerRequest.update({
    where: { id: requestId },
    data: { answeredAt: new Date() },
  });

  // Celebrate with the circle.
  const others = await prisma.membership.findMany({
    where: { journeyId, userId: { not: userId } },
    select: { userId: true },
  });
  await Promise.all(
    others.map((m) =>
      notify({
        userId: m.userId,
        type: "encouragement",
        title: `Answered prayer: ${req.title}`,
        body: "Give thanks — God has heard.",
        href: `/prayer#prayer-${req.id}`,
      }),
    ),
  );

  revalidatePath("/prayer");
}

export async function deletePrayerRequest(formData: FormData) {
  const { userId, journeyId, role } = await requireMember();
  const requestId = String(formData.get("requestId") ?? "");
  const req = await prisma.prayerRequest.findFirst({
    where: { id: requestId, journeyId },
    select: { authorId: true },
  });
  if (!req) return;
  if (req.authorId !== userId && role !== "MOTHER") return;
  await prisma.prayerRequest.delete({ where: { id: requestId } });
  revalidatePath("/prayer");
}
