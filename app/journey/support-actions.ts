"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getActiveMembership } from "@/lib/data";
import { notify } from "@/lib/notify";
import { NUDGE_CAP, NUDGE_TEXT_MAX, parseWhen } from "@/lib/nudges";

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

  const existing = await prisma.supportDay.findUnique({
    where: { journeyId_userId_day: { journeyId, userId, day } },
  });
  const alreadyDone = kind === "prayed" ? existing?.prayed : existing?.reachedOut;
  // Toggle: tapping an already-marked action clears it (fixes accidental taps).
  const next = !alreadyDone;
  const flag = kind === "prayed" ? { prayed: next } : { reachedOut: next };

  await prisma.supportDay.upsert({
    where: { journeyId_userId_day: { journeyId, userId, day } },
    create: { journeyId, userId, day, ...flag },
    update: flag,
  });

  // Notify her only when turning an action ON — never on toggling off.
  if (next) {
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

/**
 * Set a reminder for yourself.
 *
 * These are nobody else's business: "ring her mum about Saturday", "order the
 * car seat". Only the person who set it ever sees it or is told about it —
 * which is what separates this from the appointment book, where the whole
 * household is reminded of a date you all have to be at.
 */
export async function setNudge(
  formData: FormData,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const { userId, journeyId } = await requireMember();

  const text = String(formData.get("text") ?? "").trim();
  if (!text) return { ok: false, error: "Write what you want to remember." };
  if (text.length > NUDGE_TEXT_MAX) {
    return { ok: false, error: "Keep it to a line — it is a nudge, not a note." };
  }

  const when = String(formData.get("when") ?? "").trim();
  const dueAt = parseWhen(when);
  if (!dueAt) return { ok: false, error: "Choose a day." };

  const open = await prisma.nudge.count({ where: { journeyId, userId, doneAt: null } });
  if (open >= NUDGE_CAP) {
    return {
      ok: false,
      error: `That's ${NUDGE_CAP} already waiting. Tick one off before adding another.`,
    };
  }

  await prisma.nudge.create({ data: { journeyId, userId, text, dueAt } });
  revalidatePath("/journey");
  return { ok: true };
}

/** Drop a reminder you no longer want. Ticking it off is the usual way out. */
export async function dropNudge(nudgeId: string) {
  const { userId } = await requireMember();
  await prisma.nudge.deleteMany({ where: { id: nudgeId, userId } });
  revalidatePath("/journey");
}

/** A supporter sends a word of encouragement TO the mother (the one carrying the child). */
export async function sendEncouragement(formData: FormData) {
  const { userId, journeyId } = await requireMember();
  const body = String(formData.get("body") ?? "").trim();
  const verseRef = String(formData.get("verseRef") ?? "").trim() || null;
  if (!body) throw new Error("Write a few words first.");
  if (body.length > 1000) throw new Error("That's a little long — keep it short and warm.");

  const encouragement = await prisma.encouragement.create({
    data: { journeyId, authorId: userId, body, verseRef },
  });

  // Encouragements are FOR the mother. Notify only the journey owner (and only
  // when someone other than her wrote it) — supporters never receive these.
  const [journey, actor] = await Promise.all([
    prisma.journey.findUnique({ where: { id: journeyId }, select: { ownerId: true } }),
    prisma.user.findUnique({ where: { id: userId }, select: { name: true } }),
  ]);
  if (journey && journey.ownerId !== userId) {
    const who = actor?.name?.trim() || "Someone in your circle";
    const preview = body.length > 140 ? `${body.slice(0, 140)}…` : body;
    await notify({
      userId: journey.ownerId,
      type: "encouragement",
      title: `${who} sent you a word of encouragement.`,
      body: preview,
      href: `/journey#enc-${encouragement.id}`,
      email: true,
    });
  }

  revalidatePath("/journey");
  revalidatePath("/care");
}
