"use server";

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getActiveMembership } from "@/lib/data";
import { prisma } from "@/lib/prisma";
import { computePosition } from "@/lib/stage";
import { createPass, handoverReady, idileBase } from "@/lib/handover";

/**
 * Make a pass and go to Ìdílé with it. Only the mother whose journey it is:
 * the family is hers to move, and the Ìdílé household will be hers to keep.
 */
export async function startHandover(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in?callbackUrl=/handover");
  const userId = session.user.id;
  const active = await getActiveMembership(userId);
  if (!active || active.journey.ownerId !== userId || active.journey.status !== "ACTIVE") redirect("/journey");
  if (!computePosition(active.journey.dueDate).born) redirect("/journey");
  const base = idileBase();
  if (!handoverReady() || !base) redirect("/handover");

  const forEmail = String(formData.get("forEmail") ?? "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forEmail) || forEmail.length > 254) {
    redirect("/handover?error=email");
  }

  // Only people who really are in this circle can be chosen, whatever the form says.
  const asked = formData.getAll("circle").map(String);
  const members = await prisma.membership.findMany({
    where: { journeyId: active.journey.id, role: { in: ["FAMILY", "FRIEND", "ACCOUNTABILITY"] }, userId: { in: asked } },
    select: { userId: true },
  });

  const pass = await createPass(active.journey.id, userId, {
    forEmail,
    withPartner: formData.get("withPartner") === "on",
    withLetters: formData.get("withLetters") === "on",
    withFirsts: formData.get("withFirsts") === "on",
    withHealth: formData.get("withHealth") === "on",
    circleUserIds: members.map((m) => m.userId),
  });
  redirect(`${base}/welcome/oyun?pass=${encodeURIComponent(pass)}`);
}
