import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getActiveMembership } from "@/lib/data";
import { isHousehold } from "@/lib/roles";
import { listShares } from "@/lib/post-share-db";
import { SHARED_WORDS } from "@/lib/post-share";
import { SiteHeader } from "@/components/SiteHeader";
import { PageHero } from "@/components/ui/PageHero";
import { Card } from "@/components/ui/Card";
import { SharedList } from "@/components/share/SharedList";
import { closeShare, closeAllShares } from "@/app/life/share-actions";

export const metadata: Metadata = {
  title: "What you have shared",
  description: "Every link you have made, and what became of it.",
  robots: { index: false },
};

/**
 * The record of everything that has left the app.
 *
 * ── Why this is the household's page and not the circle's ────────────────
 * A supporter who wrote a post they were allowed to share can close that
 * one from the post itself. This page is the whole of it — every link the
 * family has ever made, including ones made by the other of the two — and
 * that overview belongs to the people whose journey it is, not to everyone
 * who can see the diary.
 */
export default async function SharedPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in?callbackUrl=/shared");
  const active = await getActiveMembership(session.user.id);
  if (!active) redirect("/onboarding");
  if (!isHousehold(active.role)) redirect("/journey");

  const rows = await listShares(active.journey.id);

  return (
    <>
      <SiteHeader active="shared" />
      <main className="mx-auto max-w-3xl px-6 pb-10">
        <PageHero
          eyebrow="Shared outside"
          title={SHARED_WORDS.title}
          lede={SHARED_WORDS.lede}
        />
        <div className="mt-8">
          <Card className="p-6 md:p-8">
            <SharedList
              rows={rows}
              canCloseAll
              onClose={closeShare}
              onCloseAll={closeAllShares}
            />
          </Card>
        </div>
      </main>
    </>
  );
}
