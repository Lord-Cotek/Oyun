"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getActiveMembership } from "@/lib/data";
import { isPostKind, isReactionKind, reactionGlyph, REACTIONS } from "@/lib/feed";
import { mediaTypeFromUrl } from "@/lib/feed-query";
import { notify } from "@/lib/notify";
import { postScope, seesHouseholdOnly } from "@/lib/post-visibility";

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

/**
 * Poster frames, lined up with the media they belong to.
 *
 * Padded and trimmed to exactly the length of mediaUrls, because the two
 * arrays are read by index. An entry that is not a blob URL becomes an empty
 * string rather than being dropped — dropping one would shunt every poster
 * after it onto the wrong video, which is worse than having none.
 */
function cleanPosterUrls(urls: unknown, mediaCount: number): string[] {
  const raw = Array.isArray(urls) ? urls : [];
  const out: string[] = [];
  for (let i = 0; i < mediaCount; i++) {
    const u = raw[i];
    out.push(
      typeof u === "string" &&
        u.startsWith("https://") &&
        u.includes("vercel-storage.com")
        ? u
        : "",
    );
  }
  return out;
}

async function member() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in?callbackUrl=/life");
  const active = await getActiveMembership(session.user.id);
  if (!active) redirect("/onboarding");
  // The role comes back with it because every one of these actions touches a
  // post, and whether a post is even there to touch depends on who is asking.
  return {
    userId: session.user.id,
    journeyId: active.journey.id,
    role: active.role,
  };
}

/** Share something with the circle — an update, praise, prayer, or milestone. */
export async function createPost(input: {
  kind: string;
  body: string;
  mediaUrls?: string[];
  /** One per mediaUrl, same order; "" where there is none. */
  posterUrls?: string[];
  householdOnly?: boolean;
}) {
  const { userId, journeyId, role } = await member();
  const body = (input.body ?? "").trim();
  const mediaUrls = cleanMediaUrls(input.mediaUrls);
  const posterUrls = cleanPosterUrls(input.posterUrls, mediaUrls.length);
  // Media on its own (no words) is a perfectly good moment to share.
  if (!body && mediaUrls.length === 0) return;
  const kind = isPostKind(input.kind) ? input.kind : "UPDATE";
  // Only somebody who can read family-only posts can write one. A friend in
  // the circle ticking the box would be posting into a room they cannot see.
  const householdOnly = input.householdOnly === true && seesHouseholdOnly(role);
  await prisma.post.create({
    data: {
      journeyId,
      authorId: userId,
      kind,
      body: body.slice(0, 4000),
      mediaUrls,
      posterUrls,
      householdOnly,
    },
  });

  // Let the rest of the circle know — in the bell and, where enabled, a push.
  try {
    const [author, others] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId }, select: { name: true } }),
      prisma.membership.findMany({
        where: { journeyId, userId: { not: userId } },
        select: { userId: true, role: true },
      }),
    ]);
    // A notification carries the opening words of the post in it. Telling the
    // circle about a post they cannot open would be the leak the toggle
    // exists to prevent, said out loud on their lock screen.
    const told = householdOnly
      ? others.filter((o) => seesHouseholdOnly(o.role))
      : others;
    if (told.length) {
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
        told.map((o) =>
          notify({
            userId: o.userId,
            type: "post",
            title: `${author?.name ?? "Someone"} shared with the family`,
            body: snip,
            href: "/life",
          }),
        ),
      );
    }
  } catch {
    // A missed notice must never fail the post.
  }
  revalidatePath("/life");
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
      ...(input.removeMedia
        ? { imageUrl: null, mediaUrls: [], posterUrls: [] }
        : {}),
    },
  });
  revalidatePath("/life");
  revalidatePath("/journey");
}

export async function deletePost(id: string) {
  const { userId } = await member();
  await prisma.post.deleteMany({ where: { id, authorId: userId } });
  revalidatePath("/life");
  revalidatePath("/journey");
}

/**
 * Change who a post is for, after it is written.
 *
 * People post first and think afterwards — "I shouldn't have put that where
 * the whole circle can read it" is a thought that arrives ten minutes later,
 * and the only remedy without this is to delete the thing entirely. Whoever
 * wrote it may narrow it or open it again.
 *
 * Narrowing works properly: the post leaves the circle's diary, their search
 * and their export the moment this returns. What it cannot do is unsee — a
 * notification already sent has been read, and somebody may have seen the
 * post. The screen says so rather than promising otherwise.
 */
export async function setPostAudience(input: {
  id: string;
  householdOnly: boolean;
}): Promise<{ ok: boolean }> {
  const { userId, journeyId, role } = await member();
  // Only somebody who can see family-only posts may put one out of reach —
  // otherwise a friend could hide their own post from themselves.
  if (input.householdOnly && !seesHouseholdOnly(role)) return { ok: false };
  const done = await prisma.post.updateMany({
    where: { id: input.id, journeyId, authorId: userId, ...postScope(role) },
    data: { householdOnly: input.householdOnly },
  });
  revalidatePath("/life");
  revalidatePath("/journey");
  return { ok: done.count > 0 };
}

export async function addComment(input: { postId: string; body: string }) {
  const { userId, journeyId, role } = await member();
  const body = input.body.trim();
  if (!body) return;
  // Only comment on a post in your own circle — and only one you can see. A
  // server action is reachable without the page in front of it, so somebody
  // holding a post id must be refused here as plainly as the diary refused to
  // show it to them.
  const post = await prisma.post.findFirst({
    where: { id: input.postId, journeyId, ...postScope(role) },
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
          href: "/life",
        }),
      ),
    );
  } catch {
    // A missed notice must never fail the reply.
  }
  revalidatePath("/life");
}

export async function deleteComment(id: string) {
  const { userId } = await member();
  await prisma.postComment.deleteMany({ where: { id, authorId: userId } });
  revalidatePath("/life");
}

/** Add or remove one reaction of a kind on a post. */
export async function toggleReaction(input: { postId: string; kind: string }) {
  const { userId, journeyId, role } = await member();
  if (!isReactionKind(input.kind)) return;
  const post = await prisma.post.findFirst({
    where: { id: input.postId, journeyId, ...postScope(role) },
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
          href: "/life",
        });
      } catch {
        // A missed notice must never fail the reaction.
      }
    }
  }
  revalidatePath("/life");
}

/**
 * React to somebody's REPLY, not to the post.
 *
 * Same kinds, same toggle, same silence when it is not allowed — a reply is
 * answered the way a post is. The membership check goes through the comment's
 * post, so a reply can only be reacted to by somebody who can see the post it
 * belongs to.
 */
export async function toggleCommentReaction(input: {
  commentId: string;
  kind: string;
}) {
  const { userId, journeyId, role } = await member();
  if (!isReactionKind(input.kind)) return;
  const comment = await prisma.postComment.findFirst({
    where: { id: input.commentId, post: { journeyId, ...postScope(role) } },
    select: { id: true, authorId: true },
  });
  if (!comment) return;

  const existing = await prisma.postCommentReaction.findFirst({
    where: { commentId: comment.id, userId, kind: input.kind },
    select: { id: true },
  });
  if (existing) {
    await prisma.postCommentReaction.delete({ where: { id: existing.id } });
  } else {
    try {
      await prisma.postCommentReaction.create({
        data: { commentId: comment.id, userId, kind: input.kind },
      });
    } catch {
      // A double-tap race hit the unique index — it is already there.
    }
    if (comment.authorId !== userId) {
      try {
        const me = await prisma.user.findUnique({
          where: { id: userId },
          select: { name: true },
        });
        const who = me?.name?.trim() || "Someone";
        const label =
          REACTIONS.find((r) => r.kind === input.kind)?.label ?? "reacted";
        await notify({
          userId: comment.authorId,
          type: "reaction",
          title: `${who} reacted ${reactionGlyph(input.kind)} ${label.toLowerCase()} to your reply`,
          href: "/life",
        });
      } catch {
        // A missed notice must never fail the reaction.
      }
    }
  }
  revalidatePath("/life");
}
