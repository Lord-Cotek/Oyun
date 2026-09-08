"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getActiveMembership } from "@/lib/data";
import { isPostKind, isReactionKind } from "@/lib/feed";

async function member() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in?callbackUrl=/family");
  const active = await getActiveMembership(session.user.id);
  if (!active) redirect("/onboarding");
  return { userId: session.user.id, journeyId: active.journey.id };
}

/** Share something with the circle — an update, praise, prayer, or milestone. */
export async function createPost(input: { kind: string; body: string }) {
  const { userId, journeyId } = await member();
  const body = input.body.trim();
  if (!body) return;
  const kind = isPostKind(input.kind) ? input.kind : "UPDATE";
  await prisma.post.create({
    data: { journeyId, authorId: userId, kind, body: body.slice(0, 4000) },
  });

  // A gentle in-app notice to the rest of the circle (no push, no email).
  try {
    const [author, others] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId }, select: { name: true } }),
      prisma.membership.findMany({
        where: { journeyId, userId: { not: userId } },
        select: { userId: true },
      }),
    ]);
    if (others.length) {
      const snip = body.length > 90 ? `${body.slice(0, 90)}…` : body;
      await prisma.notification.createMany({
        data: others.map((o) => ({
          userId: o.userId,
          type: "post",
          title: `${author?.name ?? "Someone"} shared with the family`,
          body: snip,
          href: "/family",
        })),
      });
    }
  } catch {
    // A missed notice must never fail the post.
  }
  revalidatePath("/family");
  revalidatePath("/journey");
}

export async function editPost(input: { id: string; body: string }) {
  const { userId } = await member();
  const body = input.body.trim();
  if (!body) return;
  await prisma.post.updateMany({
    where: { id: input.id, authorId: userId },
    data: { body: body.slice(0, 4000), editedAt: new Date() },
  });
  revalidatePath("/family");
}

export async function deletePost(id: string) {
  const { userId } = await member();
  await prisma.post.deleteMany({ where: { id, authorId: userId } });
  revalidatePath("/family");
  revalidatePath("/journey");
}

export async function addComment(input: { postId: string; body: string }) {
  const { userId, journeyId } = await member();
  const body = input.body.trim();
  if (!body) return;
  // Only comment on a post in your own circle.
  const post = await prisma.post.findFirst({
    where: { id: input.postId, journeyId },
    select: { id: true },
  });
  if (!post) return;
  await prisma.postComment.create({
    data: { postId: post.id, authorId: userId, body: body.slice(0, 2000) },
  });
  revalidatePath("/family");
}

export async function deleteComment(id: string) {
  const { userId } = await member();
  await prisma.postComment.deleteMany({ where: { id, authorId: userId } });
  revalidatePath("/family");
}

/** Add or remove one reaction of a kind on a post. */
export async function toggleReaction(input: { postId: string; kind: string }) {
  const { userId, journeyId } = await member();
  if (!isReactionKind(input.kind)) return;
  const post = await prisma.post.findFirst({
    where: { id: input.postId, journeyId },
    select: { id: true },
  });
  if (!post) return;
  const existing = await prisma.postReaction.findFirst({
    where: { postId: post.id, userId, kind: input.kind },
    select: { id: true },
  });
  if (existing) {
    await prisma.postReaction.delete({ where: { id: existing.id } });
  } else {
    try {
      await prisma.postReaction.create({
        data: { postId: post.id, userId, kind: input.kind },
      });
    } catch {
      // A double-tap race hit the unique index — the reaction already exists.
    }
  }
  revalidatePath("/family");
}
