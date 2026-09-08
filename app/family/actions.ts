"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getActiveMembership } from "@/lib/data";
import { isPostKind, isReactionKind, reactionGlyph, REACTIONS } from "@/lib/feed";
import { mediaTypeFromUrl } from "@/lib/feed-query";
import { notify } from "@/lib/notify";

/** Keep only well-formed Vercel Blob URLs, in order, capped. */
function cleanMediaUrls(urls: unknown): string[] {
  if (!Array.isArray(urls)) return [];
  return urls
    .filter(
      (u): u is string =>
        typeof u === "string" &&
        u.startsWith("https://") &&
        u.includes("vercel-storage.com"),
    )
    .slice(0, 10);
}

async function member() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in?callbackUrl=/family");
  const active = await getActiveMembership(session.user.id);
  if (!active) redirect("/onboarding");
  return { userId: session.user.id, journeyId: active.journey.id };
}

/** Share something with the circle — an update, praise, prayer, or milestone. */
export async function createPost(input: {
  kind: string;
  body: string;
  mediaUrls?: string[];
}) {
  const { userId, journeyId } = await member();
  const body = (input.body ?? "").trim();
  const mediaUrls = cleanMediaUrls(input.mediaUrls);
  // Media on its own (no words) is a perfectly good moment to share.
  if (!body && mediaUrls.length === 0) return;
  const kind = isPostKind(input.kind) ? input.kind : "UPDATE";
  await prisma.post.create({
    data: {
      journeyId,
      authorId: userId,
      kind,
      body: body.slice(0, 4000),
      mediaUrls,
    },
  });

  // Let the rest of the circle know — in the bell and, where enabled, a push.
  try {
    const [author, others] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId }, select: { name: true } }),
      prisma.membership.findMany({
        where: { journeyId, userId: { not: userId } },
        select: { userId: true },
      }),
    ]);
    if (others.length) {
      const hasVideo = mediaUrls.some((u) => mediaTypeFromUrl(u) === "video");
      const mediaWord =
        mediaUrls.length === 0
          ? ""
          : hasVideo
            ? "Shared a video"
            : mediaUrls.length === 1
              ? "Shared a photo"
              : `Shared ${mediaUrls.length} photos`;
      const snip = body
        ? body.length > 90
          ? `${body.slice(0, 90)}…`
          : body
        : mediaWord || "Shared a moment";
      await Promise.all(
        others.map((o) =>
          notify({
            userId: o.userId,
            type: "post",
            title: `${author?.name ?? "Someone"} shared with the family`,
            body: snip,
            href: "/family",
          }),
        ),
      );
    }
  } catch {
    // A missed notice must never fail the post.
  }
  revalidatePath("/family");
  revalidatePath("/journey");
}

export async function editPost(input: {
  id: string;
  body: string;
  removeMedia?: boolean;
}) {
  const { userId } = await member();
  const body = input.body.trim();
  // Keep a media-only post alive even if its caption is cleared.
  await prisma.post.updateMany({
    where: { id: input.id, authorId: userId },
    data: {
      body: body.slice(0, 4000),
      editedAt: new Date(),
      ...(input.removeMedia ? { imageUrl: null, mediaUrls: [] } : {}),
    },
  });
  revalidatePath("/family");
  revalidatePath("/journey");
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
    select: { id: true, authorId: true },
  });
  if (!post) return;
  await prisma.postComment.create({
    data: { postId: post.id, authorId: userId, body: body.slice(0, 2000) },
  });

  // Notify the post's author, and anyone else already in the thread.
  try {
    const me = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true },
    });
    const who = me?.name?.trim() || "Someone";
    const snip = body.length > 90 ? `${body.slice(0, 90)}…` : body;
    const priorComments = await prisma.postComment.findMany({
      where: { postId: post.id },
      select: { authorId: true },
    });
    // Everyone touched by this thread, minus the replier themselves.
    const recipients = new Set<string>();
    if (post.authorId !== userId) recipients.add(post.authorId);
    for (const c of priorComments) {
      if (c.authorId !== userId) recipients.add(c.authorId);
    }
    await Promise.all(
      [...recipients].map((rid) =>
        notify({
          userId: rid,
          type: "comment",
          title:
            rid === post.authorId
              ? `${who} replied to your post`
              : `${who} also replied to a post you're on`,
          body: snip,
          href: "/family",
        }),
      ),
    );
  } catch {
    // A missed notice must never fail the reply.
  }
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
    select: { id: true, authorId: true },
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
    // Let the author know someone responded (only when adding, not removing).
    if (post.authorId !== userId) {
      try {
        const me = await prisma.user.findUnique({
          where: { id: userId },
          select: { name: true },
        });
        const who = me?.name?.trim() || "Someone";
        const label =
          REACTIONS.find((r) => r.kind === input.kind)?.label ?? "reacted";
        await notify({
          userId: post.authorId,
          type: "reaction",
          title: `${who} reacted ${reactionGlyph(input.kind)} ${label.toLowerCase()} to your post`,
          href: "/family",
        });
      } catch {
        // A missed notice must never fail the reaction.
      }
    }
  }
  revalidatePath("/family");
}
