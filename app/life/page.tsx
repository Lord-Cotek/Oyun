import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getActiveMembership } from "@/lib/data";
import { loadFeed } from "@/lib/feed-query";
import { YearStrip } from "@/components/feed/YearStrip";
import { StorySoFar } from "@/components/journey/StorySoFar";
import { diaryYears, storySoFar } from "@/lib/story";
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
  title: "Life",
  description: "Life shared with your circle.",
  robots: { index: false },
};

export default async function LifePage({
  searchParams,
}: {
  searchParams: { year?: string };
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in?callbackUrl=/life");
  const active = await getActiveMembership(session.user.id);
  if (!active) redirect("/onboarding");

  // A year out of the URL is a number or it is nothing — anything else falls
  // back to the latest entries rather than showing an empty diary.
  const asked = Number(searchParams.year);
  const year =
    Number.isInteger(asked) && asked > 1900 && asked < 2200 ? asked : undefined;

  const [posts, years, story] = await Promise.all([
    loadFeed(active.journey.id, session.user.id, 40, year),
    diaryYears(active.journey.id),
    storySoFar(active.journey.id, active.journey.createdAt),
  ]);

  return (
    <>
      <SiteHeader active="life" />
      <main className="mx-auto max-w-shell px-6 py-10">
        {/* Compact: the diary is opened daily and the compose box is the
            action — a full-height band put it below the fold on a phone. */}
        <PageHero
          compact
          eyebrow="Life"
          title="Shared, as it happens."
          lede="A quiet place for the ones walking with you — how you are, a praise, a prayer to be carried, a small moment worth keeping."
        />
        <YearStrip years={years} active={year} />

        {story.worthTelling && (
          <div className="mt-5 max-w-2xl">
            <StorySoFar story={story} />
          </div>
        )}

        <div className="mt-8 max-w-2xl">
          {year && (
            <p className="mb-4 prose-serif-sm text-muted">
              {posts.length === 0 ? (
                <>Nothing was written in {year}.</>
              ) : (
                <>
                  {posts.length}{" "}
                  {posts.length === 1 ? "entry" : "entries"} from {year}, newest
                  first.
                </>
              )}
            </p>
          )}
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
