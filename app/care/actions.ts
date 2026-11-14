"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getActiveMembership } from "@/lib/data";
import { notify } from "@/lib/notify";
import { letterHref } from "@/lib/letter-access";
import { MAX_PHOTOS } from "@/lib/photos";
import { babyWords } from "@/lib/babies";
import { Mood, MilestoneKind } from "@prisma/client";
import { postWithId } from "@/app/life/actions";
import { firstPostBody } from "@/lib/firsts";

async function requireMother() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in?callbackUrl=/care");
  const active = await getActiveMembership(session.user.id);
  if (!active || active.role !== "MOTHER") redirect("/journey");
  return { userId: session.user.id, journeyId: active.journey.id };
}

// Letters to the baby are a shared keepsake: either parent may write them.
async function requireParent() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in?callbackUrl=/care");
  const active = await getActiveMembership(session.user.id);
  if (!active || (active.role !== "MOTHER" && active.role !== "PARTNER")) {
    redirect("/journey");
  }
  return { userId: session.user.id, journeyId: active.journey.id };
}

export async function addCheckIn(formData: FormData) {
  const { userId, journeyId } = await requireMother();
  const moodRaw = String(formData.get("mood") ?? "");
  const note = String(formData.get("note") ?? "").trim() || null;
  if (!(moodRaw in Mood)) throw new Error("Please choose how you are.");
  // Only meaningful with a note to share; an empty note shares nothing.
  const shareNote = !!note && formData.get("shareNote") === "on";

  await prisma.checkIn.create({
    data: { journeyId, userId, mood: moodRaw as Mood, note, shareNote },
  });
  revalidatePath("/care");
  revalidatePath("/journey");
}

export async function addLetter(formData: FormData) {
  const { userId, journeyId } = await requireParent();
  const body = String(formData.get("body") ?? "").trim();
  const toBaby = String(formData.get("toBaby") ?? "true") === "true";
  if (!body) throw new Error("A letter needs a few words.");

  /**
   * Which of them it is to, when there is more than one of them.
   *
   * Checked against this journey's own children rather than trusted: the id
   * arrives from a form, and a letter filed under somebody else's child would
   * be both wrong and unreachable. Anything that does not belong here becomes
   * a letter to all of them, which is the safe reading and the old behaviour.
   */
  const asked = String(formData.get("childId") ?? "").trim();
  let childId: string | null = null;
  let childName: string | null = null;
  if (toBaby && asked && asked !== "all") {
    const child = await prisma.child.findFirst({
      where: { id: asked, journeyId },
      select: { id: true, name: true },
    });
    childId = child?.id ?? null;
    childName = child?.name ?? null;
  }

  const written = await prisma.letter.create({
    data: { journeyId, authorId: userId, body, toBaby, childId },
  });

  // Let the other parent know a new keepsake letter is waiting for them.
  if (toBaby) {
    const [author, journey] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: { name: true },
      }),
      prisma.journey.findUnique({
        where: { id: journeyId },
        select: { babyCount: true },
      }),
    ]);
    const who = author?.name?.trim().split(/\s+/)[0] || "Someone";
    // Named when it was to one of them; otherwise the count decides whether
    // it is "your baby" or "your babies" — see lib/babies.ts.
    const toWhom = childName
      ? childName
      : `your ${babyWords(journey?.babyCount ?? 1).noun}`;
    const others = await prisma.membership.findMany({
      where: {
        journeyId,
        role: { in: ["MOTHER", "PARTNER"] },
        userId: { not: userId },
      },
      select: { userId: true, role: true },
    });
    for (const o of others) {
      await notify({
        userId: o.userId,
        type: "encouragement",
        title: `${who} wrote a letter to ${toWhom}.`,
        href: letterHref(written.id),
      });
    }
  }

  revalidatePath("/letters");
  revalidatePath("/care");
  revalidatePath("/journey");
}

async function resolveChildId(journeyId: string, raw: string): Promise<string | null> {
  const childIdRaw = raw.trim();
  if (!childIdRaw) return null;
  const child = await prisma.child.findFirst({
    where: { id: childIdRaw, journeyId },
    select: { id: true },
  });
  return child?.id ?? null;
}

/** The URLs the browser uploaded, trusted only as far as their shape. */
function photoUrlsFrom(formData: FormData): string[] {
  return formData
    .getAll("photoUrls")
    .map((u) => String(u))
    .filter((u) => u.startsWith("http"))
    .slice(0, MAX_PHOTOS);
}

export async function addMilestone(formData: FormData) {
  const { journeyId } = await requireParent();
  const kindRaw = String(formData.get("kind") ?? "");
  const title = String(formData.get("title") ?? "").trim() || null;
  const note = String(formData.get("note") ?? "").trim() || null;
  const dateStr = String(formData.get("occurredAt") ?? "").trim();
  if (!(kindRaw in MilestoneKind)) throw new Error("Please choose a kind.");
  if (kindRaw === "CUSTOM" && !title) {
    throw new Error("Please name this first.");
  }
  const occurredAt = dateStr ? new Date(dateStr) : new Date();
  if (Number.isNaN(occurredAt.getTime())) throw new Error("That date isn't valid.");

  // The browser has already put these in Blob storage and is handing us the
  // URLs. They used to arrive as FILES inside this server action's body, which
  // next.config caps at 8 MB — three phone photographs and the whole request
  // was rejected. See lib/photos.ts.
  const photoUrls = photoUrlsFrom(formData);
  const childId = await resolveChildId(journeyId, String(formData.get("childId") ?? ""));

  await prisma.milestone.create({
    data: { journeyId, kind: kindRaw as MilestoneKind, title, note, occurredAt, photoUrls, childId },
  });
  revalidatePath("/firsts");
  revalidatePath("/journey");
}

export async function updateMilestone(formData: FormData) {
  const { journeyId } = await requireParent();
  const id = String(formData.get("id") ?? "");
  const kindRaw = String(formData.get("kind") ?? "");
  const title = String(formData.get("title") ?? "").trim() || null;
  const note = String(formData.get("note") ?? "").trim() || null;
  const dateStr = String(formData.get("occurredAt") ?? "").trim();
  if (!(kindRaw in MilestoneKind)) throw new Error("Please choose a kind.");
  if (kindRaw === "CUSTOM" && !title) throw new Error("Please name this first.");
  const occurredAt = dateStr ? new Date(dateStr) : new Date();
  if (Number.isNaN(occurredAt.getTime())) throw new Error("That date isn't valid.");

  const childId = await resolveChildId(journeyId, String(formData.get("childId") ?? ""));

  // Compute the new photo set: keep existing minus any removed, then append new uploads.
  const existing = await prisma.milestone.findFirst({
    where: { id, journeyId },
    select: { photoUrls: true },
  });
  const removeUrls = new Set(
    formData.getAll("removePhoto").map((v) => String(v)),
  );
  const kept = (existing?.photoUrls ?? []).filter((u) => !removeUrls.has(u));
  const added = photoUrlsFrom(formData);
  const photoUrls = [...kept, ...added].slice(0, MAX_PHOTOS);

  await prisma.milestone.updateMany({
    where: { id, journeyId },
    data: {
      kind: kindRaw as MilestoneKind,
      title,
      note,
      occurredAt,
      childId,
      photoUrls,
    },
  });
  revalidatePath("/firsts");
  revalidatePath("/journey");
}

export async function deleteMilestone(formData: FormData) {
  const { journeyId } = await requireParent();
  const id = String(formData.get("id") ?? "");
  await prisma.milestone.deleteMany({ where: { id, journeyId } });
  revalidatePath("/firsts");
  revalidatePath("/journey");
}

/**
 * Tell the circle about a first — one tap, from the Firsts page.
 *
 * A first is the household's: the Firsts page is theirs alone, and the
 * grandparents never saw one unless somebody retyped it into Life. This makes
 * it a Life post of kind MILESTONE, with its note and its photographs, sent
 * through the ordinary post path so the circle is told exactly as they are
 * for any other post. The card asks before it shares, and says afterwards
 * that it has.
 *
 * Once only: a first already shared, whose post still exists, is not shared
 * again. If that post was deleted, sharing it again is allowed.
 */
export async function shareMilestone(
  milestoneId: string,
): Promise<{ ok: true; postId: string } | { ok: false; error: string }> {
  const { journeyId } = await requireParent();
  const m = await prisma.milestone.findFirst({
    where: { id: milestoneId, journeyId },
    select: {
      id: true,
      kind: true,
      title: true,
      note: true,
      occurredAt: true,
      photoUrls: true,
      postId: true,
      child: { select: { name: true } },
    },
  });
  if (!m) return { ok: false, error: "That first is no longer here." };
  if (m.postId) {
    const still = await prisma.post.findFirst({
      where: { id: m.postId, journeyId },
      select: { id: true },
    });
    if (still) return { ok: true, postId: still.id };
  }

  const made = await postWithId({
    kind: "MILESTONE",
    body: firstPostBody({
      kind: m.kind,
      title: m.title,
      note: m.note,
      childName: m.child?.name,
      occurredAt: m.occurredAt,
    }),
    mediaUrls: m.photoUrls,
  });
  if (!made) return { ok: false, error: "That didn’t share. Try again in a moment." };

  await prisma.milestone.update({ where: { id: m.id }, data: { postId: made.id } });
  revalidatePath("/firsts");
  return { ok: true, postId: made.id };
}
