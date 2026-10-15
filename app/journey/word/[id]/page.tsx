import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getActiveMembership, getOneWord } from "@/lib/data";
import { SiteHeader } from "@/components/SiteHeader";
import { BackLink } from "@/components/ui/BackLink";
import { Encouragements } from "@/components/journey/Encouragements";

/**
 * One word of encouragement, on a page of its own.
 *
 * ── Why ──────────────────────────────────────────────────────────────────
 * The journey page shows the five newest words. Measured: the newest landed
 * and the twelfth was not on the page at all — so "Femi wrote you a word"
 * worked for about a week and then quietly stopped, which is the worst way
 * for it to fail. These are the notifications people most want to open, and
 * the oldest ones are the ones they go back to.
 *
 * ── Who may open it ──────────────────────────────────────────────────────
 * Anybody in the circle, as in the room. A word is written into the journey
 * for the mother, and the people walking with her can see what has been said
 * — that is how a circle knows she is being held and not left to one person.
 */

export const dynamic = "force-dynamic";

export function generateMetadata(): Metadata {
  return { title: "A word for you", robots: { index: false, follow: false } };
}

export default async function OneWord({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect(`/sign-in?callbackUrl=/journey/word/${params.id}`);
  }
  const active = await getActiveMembership(session.user.id);
  if (!active) redirect("/onboarding");

  const word = await getOneWord(params.id, active.journey.id, session.user.id);
  if (!word) notFound();

  return (
    <>
      <SiteHeader active="journey" />
      <main className="mx-auto max-w-shell px-6 pb-10">
        <BackLink href="/journey">Back to the journey</BackLink>
        <div className="mt-4 max-w-2xl">
          {/* The room's own component, given one item. Same card, same
              reactions, nothing to keep in step. */}
          <Encouragements items={[word]} emptyHint="" />
        </div>
      </main>
    </>
  );
}
