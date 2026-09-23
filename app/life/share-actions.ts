"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getActiveMembership } from "@/lib/data";
import { isHousehold } from "@/lib/roles";
import { newShareToken } from "@/lib/post-share-db";
import {
  canSharePost,
  expiryFor,
  sharePath,
  SHARE_DAYS_DEFAULT,
  SHARE_WINDOWS,
} from "@/lib/post-share";

async function requireMember() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in?callbackUrl=/life");
  const active = await getActiveMembership(session.user.id);
  if (!active) redirect("/onboarding");
  return {
    userId: session.user.id,
    journeyId: active.journey.id,
    role: active.role as string,
  };
}

export interface ShareResult {
  path: string;
  expiresAt: string | null;
}

/**
 * Put one post on a link.
 *
 * ── Why this re-reads the post instead of trusting the screen ────────────
 * The caller sends a post id and a number of days, and nothing else about it
 * is believed. The post is fetched from this journey — `journeyId` in the
 * where clause, not just the id — so a post id belonging to another family
 * cannot be shared by anybody, however the request was made. Its `householdOnly`
 * and its author are read from the row, not from the client, because those
 * two fields are the whole of the permission and a screen is not a source of
 * truth about them.
 *
 * ── Why an existing live link is reused ──────────────────────────────────
 * Pressing Share twice should give the same address, not a second one. Two
 * live links to one post means closing the one you can see and leaving the
 * one you forgot about open, which is the worst possible behaviour for a
 * control whose entire job is being able to take something back.
 */
export async function sharePost(input: {
  postId: string;
  days?: number;
}): Promise<ShareResult> {
  const { userId, journeyId, role } = await requireMember();

  const post = await prisma.post.findFirst({
    where: { id: input.postId, journeyId },
    select: { id: true, authorId: true, householdOnly: true },
  });
  if (!post) throw new Error("That post is not here any more.");
  if (!canSharePost(isHousehold(role), post, userId)) {
    throw new Error(
      post.householdOnly
        ? "This one is kept to the family. Change who it is for first, if you mean to share it."
        : "Only the two of you, or whoever wrote it, can share a post.",
    );
  }

  const existing = await prisma.postShare.findFirst({
    where: {
      postId: post.id,
      revokedAt: null,
      OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
    },
    select: { token: true, expiresAt: true },
    orderBy: { createdAt: "desc" },
  });
  if (existing) {
    return {
      path: sharePath(existing.token),
      expiresAt: existing.expiresAt?.toISOString() ?? null,
    };
  }

  // Only the windows actually offered. A number typed into a request must not
  // be able to mint a link that lasts a decade.
  const asked = input.days ?? SHARE_DAYS_DEFAULT;
  const days = SHARE_WINDOWS.some((w) => w.days === asked)
    ? asked
    : SHARE_DAYS_DEFAULT;

  const share = await prisma.postShare.create({
    data: {
      postId: post.id,
      journeyId,
      createdById: userId,
      token: newShareToken(),
      expiresAt: expiryFor(days),
    },
    select: { token: true, expiresAt: true },
  });

  revalidatePath("/life");
  return {
    path: sharePath(share.token),
    expiresAt: share.expiresAt?.toISOString() ?? null,
  };
}

/**
 * Take it back.
 *
 * Closes every live link on the post, not just one, so "Close" means what the
 * family think it means even if a link was made twice. The rows stay — a
 * record of what was shared is worth more than a tidy table.
 *
 * Anybody who could have shared the post can close it, and so can the
 * household regardless: being able to stop something must never be harder
 * than being able to start it.
 */
export async function revokeShare(postId: string): Promise<{ ok: boolean }> {
  const { userId, journeyId, role } = await requireMember();

  const post = await prisma.post.findFirst({
    where: { id: postId, journeyId },
    select: { id: true, authorId: true, householdOnly: true },
  });
  if (!post) return { ok: false };

  const mayClose =
    isHousehold(role) ||
    canSharePost(isHousehold(role), { ...post, householdOnly: false }, userId);
  if (!mayClose) return { ok: false };

  await prisma.postShare.updateMany({
    where: { postId: post.id, journeyId, revokedAt: null },
    data: { revokedAt: new Date() },
  });

  revalidatePath("/life");
  return { ok: true };
}

/**
 * Take down a word from outside.
 *
 * Hidden rather than deleted, so the same person cannot post it again into an
 * empty slot — the unique index on (share, guest) is what stops them, and it
 * only stops them while the row is still there.
 */
export async function hideHello(helloId: string): Promise<{ ok: boolean }> {
  const { journeyId, role } = await requireMember();
  if (!isHousehold(role)) return { ok: false };
  await prisma.shareHello.updateMany({
    where: { id: helloId, journeyId },
    data: { hiddenAt: new Date() },
  });
  revalidatePath("/life");
  return { ok: true };
}

/**
 * Close one link from the list, by its own id.
 *
 * `revokeShare` above closes every live link on a POST, which is what the
 * Close button beside a post should do. This closes one row, which is what
 * the list of everything ever shared needs — a post may have been shared,
 * closed, and shared again, and on that page the two are separate lines with
 * separate histories.
 */
export async function closeShare(shareId: string): Promise<{ ok: boolean }> {
  const { journeyId, role, userId } = await requireMember();
  const share = await prisma.postShare.findFirst({
    where: { id: shareId, journeyId },
    select: { id: true, createdById: true },
  });
  if (!share) return { ok: false };
  // Whoever keeps the house, or whoever made this particular link. Being able
  // to stop something must never be harder than being able to start it.
  if (!isHousehold(role) && share.createdById !== userId) return { ok: false };

  await prisma.postShare.updateMany({
    where: { id: share.id, journeyId, revokedAt: null },
    data: { revokedAt: new Date() },
  });
  revalidatePath("/shared");
  revalidatePath("/life");
  return { ok: true };
}

/**
 * Close everything at once.
 *
 * Here because the question people actually arrive with is not "which of
 * these eleven links is the one I am worried about" but "make it all stop".
 * Making them answer the first question before they can do the second is how
 * a safety control becomes something somebody gives up on halfway down.
 */
export async function closeAllShares(): Promise<{ ok: boolean; closed: number }> {
  const { journeyId, role } = await requireMember();
  if (!isHousehold(role)) return { ok: false, closed: 0 };
  const r = await prisma.postShare.updateMany({
    where: { journeyId, revokedAt: null },
    data: { revokedAt: new Date() },
  });
  revalidatePath("/shared");
  revalidatePath("/life");
  return { ok: true, closed: r.count };
}
