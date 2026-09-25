import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getActiveMembership } from "@/lib/data";
import { loadFeed } from "@/lib/feed-query";
import { YearStrip } from "@/components/feed/YearStrip";
import { StorySoFar } from "@/components/journey/StorySoFar";
import { diaryYears, storySoFar } from "@/lib/story";
import { seesHouseholdOnly } from "@/lib/post-visibility";
import { isHousehold } from "@/lib/roles";
import { SiteHeader } from "@/components/SiteHeader";
import { Arches } from "@/components/ui/Marks";
import { Feed } from "@/components/feed/Feed";
import { sharePost, revokeShare, hideHello } from "@/app/life/share-actions";
import {
  createPost,
  editPost,
  deletePost,
  addComment,
  deleteComment,
  toggleReaction,
  toggleCommentReaction,
  setPostAudience,
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

  // ── Why "Our story so far" is the household's alone ───────────────────
  // Six numbers, and only one of them — the diary count — was ever scoped to
  // who was reading. The other five counted rooms a supporter cannot open:
  // an accountability partner was told "33 letters written to keep" about
  // letters they cannot read, and "1 appointment been to" about a room they
  // cannot enter. Not content, but the volume and rhythm of a family's life,
  // handed to somebody under a heading that says "Our story" — which, from
  // their side of it, was not true either.
  //
  // Not computed at all for them, rather than computed and hidden: six counts
  // nobody will see is six queries nobody needs.
  const ours = isHousehold(active.role);

  const [posts, years, story] = await Promise.all([
    loadFeed(active.journey.id, session.user.id, active.role, 40, year),
    diaryYears(active.journey.id, active.role),
    ours
      ? storySoFar(active.journey.id, active.journey.createdAt, active.role)
      : null,
  ]);

  return (
    <>
      <SiteHeader active="life" />
      <main className="mx-auto max-w-shell px-6 pb-10">
        {/* ── Life, on a band ───────────────────────────────────────────
            Every room but home opens on a band; this one is the exception
            that proves the rule. It is FULL of photographs already — they
            are the content, a few inches below — so putting one more at the
            top would be the app competing with the family for the same
            screen. The band steps back and lets the pictures be the colour.

            Kept short on purpose: the diary is opened daily and the compose
            box is the action, and a tall hero pushes it off a phone. */}
        <section className="band-1 relative -mx-6 animate-fade-up overflow-hidden px-6 py-7 md:mx-0 md:rounded-3xl">
          <Arches className="on-band" />
          <div className="relative">
            <p className="font-serif text-lg italic opacity-75 on-band">Life</p>
            <h1 className="mt-1 max-w-[15ch] font-serif text-[1.9rem] leading-[1.12] on-band md:max-w-xl md:text-4xl">
              Shared, as it happens.
            </h1>
            <p className="mt-2.5 max-w-prose prose-serif-sm opacity-80 on-band">
              A quiet place for the ones walking with you — how you are, a praise, a prayer to be carried, a small moment worth keeping.
            </p>
          </div>
        </section>

        <YearStrip years={years} active={year} />

        {story?.worthTelling && (
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
            onReactToComment={toggleCommentReaction}
            onSetAudience={setPostAudience}
            onSharePost={sharePost}
            onRevokeShare={revokeShare}
            onHideHello={hideHello}
            canKeepToHousehold={seesHouseholdOnly(active.role)}
            composerPlaceholder="Share something with your circle…"
          />
        </div>
      </main>
    </>
  );
}
