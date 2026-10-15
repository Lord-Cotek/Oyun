import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getActiveMembership } from "@/lib/data";
import { loadOnePost } from "@/lib/feed-query";
import { seesHouseholdOnly } from "@/lib/post-visibility";
import { isHousehold } from "@/lib/roles";
import { SiteHeader } from "@/components/SiteHeader";
import { Feed } from "@/components/feed/Feed";
import {
  createPost,
  editPost,
  deletePost,
  addComment,
  deleteComment,
  toggleReaction,
  toggleCommentReaction,
  setPostAudience,
} from "@/app/life/actions";
import {
  sharePost,
  revokeShare,
  hideHello,
  attributeHello,
} from "@/app/life/share-actions";

/**
 * One entry from the diary, on a page of its own.
 *
 * ── Why this exists ──────────────────────────────────────────────────────
 * So that a notification can land on the thing it is about.
 *
 * It used to point at `/life#post-…`, which is the right idea and does not
 * survive contact with a real diary. The browser jumps to the anchor the
 * moment it parses it, and then every photograph above it finishes loading
 * and pushes the page down — so by the time the reader is looking, what they
 * tapped is somewhere off the top of the screen. From the outside that is
 * indistinguishable from being dumped at the top of Life and told to go and
 * find a comment, which is exactly what people reported.
 *
 * Scroll could have been chased — wait for images, re-scroll, watch for
 * layout shift — and it would have been a race nobody could ever be sure
 * had been won. A page holding one post has nothing above it to shift. The
 * problem is not solved here so much as removed.
 *
 * ── It is the same post, not a second rendering of one ──────────────────
 * loadOnePost goes through loadFeed, so the replies, the reactions, the live
 * link and the words from outside are all the ones the diary would show,
 * refused to the same people for the same reasons. A separate query here
 * would be the one that quietly rots, because it is the one read less often.
 */

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const session = await auth();
  if (!session?.user?.id) return { title: "Life" };
  const active = await getActiveMembership(session.user.id);
  if (!active) return { title: "Life" };
  const post = await loadOnePost(
    active.journey.id,
    session.user.id,
    active.role,
    params.id,
  );
  if (!post) return { title: "Life" };
  const line = post.body.trim().split("\n")[0].slice(0, 60);
  return { title: line || "A moment", robots: { index: false, follow: false } };
}

export default async function OnePost({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();
  if (!session?.user?.id) redirect(`/sign-in?callbackUrl=/life/${params.id}`);
  const active = await getActiveMembership(session.user.id);
  if (!active) redirect("/onboarding");

  const post = await loadOnePost(
    active.journey.id,
    session.user.id,
    active.role,
    params.id,
  );
  // Not this family's, kept to the two of them, or since deleted. All three
  // are the same answer to somebody holding the address: there is nothing
  // here. Which of the three it is, is none of their business.
  if (!post) notFound();

  const ours = isHousehold(active.role);
  const circle = ours
    ? await prisma.membership.findMany({
        where: { journeyId: active.journey.id },
        orderBy: { createdAt: "asc" },
        select: { user: { select: { id: true, name: true } } },
      })
    : null;

  return (
    <>
      <SiteHeader active="life" />
      <main className="mx-auto max-w-shell px-6 pb-10">
        <Link
          href="/life"
          className="mt-6 inline-flex min-h-11 items-center font-mono text-[0.68rem] uppercase tracking-widest text-muted hover:text-accent"
        >
          ← All of Life
        </Link>

        <div className="mt-4">
          <Feed
            alone
            posts={[post]}
            onCreate={createPost}
            onEdit={editPost}
            onDelete={deletePost}
            onComment={addComment}
            onDeleteComment={deleteComment}
            onReact={toggleReaction}
            onReactToComment={toggleCommentReaction}
            onSetAudience={setPostAudience}
            onSharePost={sharePost}
            onRevokeShare={revokeShare}
            onHideHello={hideHello}
            onAttributeHello={ours ? attributeHello : undefined}
            circle={
              circle?.map((m) => ({
                id: m.user.id,
                name: m.user.name ?? "Someone",
              })) ?? []
            }
            canKeepToHousehold={seesHouseholdOnly(active.role)}
          />
        </div>
      </main>
    </>
  );
}
