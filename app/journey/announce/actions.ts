"use server";

import { revalidatePath } from "next/cache";
import { MilestoneKind } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getActiveMembership } from "@/lib/data";
import { cleanAnnouncement, lifeBody } from "@/lib/announcement";
import { liveShareToken } from "@/lib/announcement-db";
import { newShareToken } from "@/lib/post-share-db";
import { sharePath } from "@/lib/post-share";
import { isGeneral } from "@/lib/voice";

type Result = { ok: true; path: string } | { ok: false; error: string };

/**
 * Make or change the birth announcement.
 *
 * The first save posts it to Life — the circle is told the usual way — and
 * makes one private link that lasts until the family closes it. Later saves
 * change that same post and page; the link never changes, so nothing already
 * sent goes stale. A family who announced before this existed has their
 * earlier post adopted rather than a second one made.
 */
export async function saveAnnouncement(payload: unknown): Promise<Result> {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: "Please sign in again." };
  const userId = session.user.id;
  const active = await getActiveMembership(userId);
  if (!active || (active.role !== "MOTHER" && active.role !== "PARTNER")) {
    return { ok: false, error: "Only the two of you can announce the birth." };
  }
  const journeyId = active.journey.id;
  const birth = await prisma.milestone.findFirst({
    where: { journeyId, kind: MilestoneKind.BIRTH },
    orderBy: { occurredAt: "desc" },
    select: { id: true, postId: true },
  });
  if (!birth) return { ok: false, error: "Record the birth first, from your journey page." };

  const clean = cleanAnnouncement(payload);
  if (!clean.ok) return clean;
  const existing = await prisma.birthAnnouncement.findUnique({ where: { journeyId }, select: { postId: true, verseRef: true } });
  // Somebody who chose Oyun without religious content is not offered a verse
  // (lib/voice.ts), so one cannot arrive from them either. The card may
  // already carry the other parent's choice: that they may keep, or take
  // off — never add, and never swap for another.
  const d = isGeneral(session.user.voice)
    ? { ...clean.data, verseRef: clean.data.verseRef && clean.data.verseRef === existing?.verseRef ? clean.data.verseRef : null }
    : clean.data;
  const fields = {
    babies: d.babies,
    bornOn: new Date(`${d.bornOn}T00:00:00.000Z`),
    timeOfBirth: d.timeOfBirth,
    weight: d.weight,
    place: d.place,
    message: d.message,
    signedAs: d.signedAs,
    verseRef: d.verseRef,
    photoUrls: d.photoUrls,
    style: d.style,
  };

  // The post it belongs to: its own, or the one the birth was announced with
  // before cards existed — as long as it is still there and still this family's.
  const candidate = existing?.postId ?? birth.postId;
  const post = candidate
    ? await prisma.post.findFirst({ where: { id: candidate, journeyId }, select: { id: true } })
    : null;

  let postId: string;
  const body = lifeBody(d);
  if (post) {
    await prisma.post.update({
      where: { id: post.id },
      data: {
        body,
        mediaUrls: d.photoUrls,
        posterUrls: d.photoUrls.map(() => ""),
        householdOnly: false,
        editedAt: new Date(),
      },
    });
    postId = post.id;
  } else {
    const { postWithId } = await import("@/app/life/actions");
    const made = await postWithId({ kind: "MILESTONE", body, mediaUrls: d.photoUrls });
    if (!made) return { ok: false, error: "That did not save. Try again in a moment." };
    postId = made.id;
  }

  await prisma.birthAnnouncement.upsert({
    where: { journeyId },
    create: { journeyId, postId, createdById: userId, ...fields },
    update: { postId, ...fields },
  });
  if (birth.postId !== postId) {
    await prisma.milestone.update({ where: { id: birth.id }, data: { postId } });
  }

  // One link, until they close it. Made the first time; found every time after.
  let token = await liveShareToken(postId);
  if (!token) {
    const share = await prisma.postShare.create({
      data: { postId, journeyId, createdById: userId, token: newShareToken(), expiresAt: null },
      select: { token: true },
    });
    token = share.token;
  }

  revalidatePath("/journey");
  revalidatePath("/journey/announce");
  revalidatePath("/life");
  revalidatePath(`/life/${postId}`);
  revalidatePath(sharePath(token));
  return { ok: true, path: sharePath(token) };
}
