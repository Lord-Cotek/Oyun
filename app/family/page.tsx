import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getActiveMembership } from "@/lib/data";
import { loadFeed } from "@/lib/feed-query";
import { SiteHeader } from "@/components/SiteHeader";
import { PageHero } from "@/components/ui/PageHero";
import { Feed } from "@/components/feed/Feed";
import {
  createPost,
  editPost,
  deletePost,
  addComment,
  deleteComment,
  toggleReaction,
} from "./actions";

export const metadata: Metadata = {
  title: "Family",
  description: "Life shared with your circle.",
  robots: { index: false },
};

export default async function FamilyPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in?callbackUrl=/family");
  const active = await getActiveMembership(session.user.id);
  if (!active) redirect("/onboarding");

  const posts = await loadFeed(active.journey.id, session.user.id);

  return (
    <>
      <SiteHeader active="family" />
      <main className="mx-auto max-w-shell px-6 py-10">
        <PageHero
          eyebrow="Family"
          title="Life, shared."
          lede="A quiet place for the ones walking with you — how you are, a praise, a prayer to be carried, a small moment worth keeping."
        />
        <div className="mt-8 max-w-2xl">
          <Feed
            posts={posts}
            onCreate={createPost}
            onEdit={editPost}
            onDelete={deletePost}
            onComment={addComment}
            onDeleteComment={deleteComment}
            onReact={toggleReaction}
            composerPlaceholder="Share something with your circle…"
          />
        </div>
      </main>
    </>
  );
}
