"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getActiveMembership } from "@/lib/data";
import { notify } from "@/lib/notify";

/** Midnight UTC for "today" — matches Prisma's @db.Date storage. */
function utcToday(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

async function requireMember() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in?callbackUrl=/journey");
  const active = await getActiveMembership(session.user.id);
  if (!active) redirect("/onboarding");
  return { userId: session.user.id, journeyId: active.journey.id, role: active.role };
}

/** Supporter marks that they prayed for / reached out to her today. Idempotent. */
export async function markSupport(kind: "prayed" | "reachedOut") {
  const { userId, journeyId } = await requireMember();
  const day = utcToday();
  const flag = kind === "prayed" ? { prayed: true } : { reachedOut: true };

  const existing = await prisma.supportDay.findUnique({
    where: { journeyId_userId_day: { journeyId, userId, day } },
  });
  const alreadyDone = kind === "prayed" ? existing?.prayed : existing?.reachedOut;

  await prisma.supportDay.upsert({
    where: { journeyId_userId_day: { journeyId, userId, day } },
    create: { journeyId, userId, day, ...flag },
    update: flag,
  });

  // Notify her once per day per kind — never on repeat taps.
  if (!alreadyDone) {
    const [journey, actor] = await Promise.all([
      prisma.journey.findUnique({ where: { id: journeyId }, select: { ownerId: true } }),
      prisma.user.findUnique({ where: { id: userId }, select: { name: true } }),
    ]);
    if (journey && journey.ownerId !== userId) {
      const who = actor?.name?.trim() || "Someone in your circle";
      await notify({
        userId: journey.ownerId,
        type: kind === "prayed" ? "prayer" : "reached_out",
        title:
          kind === "prayed"
            ? `${who} prayed for you today.`
            : `${who} is reaching out to you today.`,
        href: "/journey",
      });
    }
  }

  revalidatePath("/journey");
}

/** Mark one of this week's nudges as done. */
export async function completeNudge(nudgeId: string) {
  const { userId } = await requireMember();
  // Only the nudge's owner can complete it.
  await prisma.nudge.updateMany({
    where: { id: nudgeId, userId, doneAt: null },
    data: { doneAt: new Date() },
  });
  revalidatePath("/journey");
}

/** Send a short word of encouragement to the rest of the journey. */
export async function sendEncouragement(formData: FormData) {
  const { userId, journeyId } = await requireMember();
  const body = String(formData.get("body") ?? "").trim();
  const verseRef = String(formData.get("verseRef") ?? "").trim() || null;
  if (!body) throw new Error("Write a few words first.");
  if (body.length > 1000) throw new Error("That's a little long — keep it short and warm.");

  await prisma.encouragement.create({
    data: { journeyId, authorId: userId, body, verseRef },
  });

  // Notify the other member(s) — this is an intentional message, so email too.
  const [others, actor] = await Promise.all([
    prisma.membership.findMany({
      where: { journeyId, userId: { not: userId } },
      select: { userId: true },
    }),
    prisma.user.findUnique({ where: { id: userId }, select: { name: true } }),
  ]);
  const who = actor?.name?.trim() || "Someone in your circle";
  const preview = body.length > 140 ? `${body.slice(0, 140)}…` : body;
  await Promise.all(
    others.map((m) =>
      notify({
        userId: m.userId,
        type: "encouragement",
        title: `${who} sent you a word of encouragement.`,
        body: preview,
        href: "/journey",
        email: true,
      }),
    ),
  );

  revalidatePath("/journey");
  revalidatePath("/care");
}
