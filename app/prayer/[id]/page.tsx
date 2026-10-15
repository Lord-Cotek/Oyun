import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getActiveMembership, getOnePrayer } from "@/lib/data";
import { SiteHeader } from "@/components/SiteHeader";
import { BackLink } from "@/components/ui/BackLink";
import { PrayerCard } from "@/components/prayer/PrayerCard";

/**
 * One prayer request, on a page of its own.
 *
 * ── Why ──────────────────────────────────────────────────────────────────
 * The room holds the fifty newest and nothing older, and I measured what
 * `/prayer#prayer-…` actually did on a phone: the fifty-first was not on the
 * page at all, and the newest one — which WAS on the page — sat thirteen
 * thousand pixels down a page the browser never scrolled, because a fragment
 * is acted on when the document is parsed and these cards arrive after that.
 *
 * So "Amara asked for prayer" opened a wall of other people's prayers. Here
 * it opens hers.
 *
 * ── Who may open it ──────────────────────────────────────────────────────
 * Anybody in the circle, which is the same rule as the room: a prayer request
 * is the one thing on this journey that is deliberately shared wide, because
 * being prayed for by name is the point of it. Scoped to the viewer's own
 * journey, so an id from another family is not found.
 */

export const dynamic = "force-dynamic";

export function generateMetadata(): Metadata {
  // No title from the request itself. "Please pray — the bleeding is back"
  // has no business in a phone's tab list or a browser's history.
  return { title: "A prayer", robots: { index: false, follow: false } };
}

export default async function OnePrayer({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect(`/sign-in?callbackUrl=/prayer/${params.id}`);
  }
  const active = await getActiveMembership(session.user.id);
  if (!active) redirect("/onboarding");

  const item = await getOnePrayer(
    params.id,
    active.journey.id,
    session.user.id,
    active.role === "MOTHER",
  );
  if (!item) notFound();

  return (
    <>
      <SiteHeader active="prayer" />
      <main className="mx-auto max-w-shell px-6 pb-10">
        <BackLink href="/prayer">All prayer</BackLink>
        <div className="mt-4 max-w-2xl">
          {/* The same card as the room, with the same hold-to-pray and the
              same controls — so somebody who arrived from a notification can
              pray for it right here rather than go looking for it again. */}
          <PrayerCard item={item} />
        </div>
      </main>
    </>
  );
}
