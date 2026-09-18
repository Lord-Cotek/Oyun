import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getActiveMembership, getCoupleLetters, getBabyLetters } from "@/lib/data";
import { HOUSEHOLD_ROLES, isHousehold } from "@/lib/roles";
import { babyWords } from "@/lib/babies";
import { SiteHeader } from "@/components/SiteHeader";
import { PageHero } from "@/components/ui/PageHero";
import { Card } from "@/components/ui/Card";
import { CoupleLetters } from "@/components/care/CoupleLetters";
import { BabyLetters } from "@/components/care/BabyLetters";
import { LettersPanel } from "@/components/care/LettersPanel";

export const metadata: Metadata = {
  title: "Letters",
  description: "Letters between you, and to your little one.",
  robots: { index: false },
};

export default async function LettersPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in?callbackUrl=/letters");
  const active = await getActiveMembership(session.user.id);
  if (!active) redirect("/onboarding");
  // Letters are for the mother and the one beside her — not the wider circle.
  if (!isHousehold(active.role)) redirect("/journey");

  const { journey } = active;
  /**
   * The OTHER one of the two — not the owner of the journey.
   *
   * This page is the same page for both of them, and it used to name the
   * journey's owner either way. So the mother opened her own letters and was
   * told they were "between you and Amara", with a box that offered to write
   * to herself. A page that does not know who is reading it is a page that
   * feels like it was written for somebody else.
   *
   * So: whoever of the two is not the person signed in. Null while she is on
   * her own — a journey often starts before the partner has accepted — and
   * every line below reads sensibly without a name rather than falling back
   * to somebody's.
   */
  const other = await prisma.membership.findFirst({
    where: {
      journeyId: journey.id,
      role: { in: HOUSEHOLD_ROLES },
      userId: { not: session.user.id },
    },
    select: { user: { select: { name: true } } },
  });
  const otherName = other?.user.name?.trim().split(/\s+/)[0] || null;
  // One baby or four, said the same way everywhere — see lib/babies.ts.
  const bw = babyWords(journey.babyCount, journey.babyName);

  const [coupleLetters, babyLetters] = await Promise.all([
    getCoupleLetters(journey.id, session.user.id),
    getBabyLetters(journey.id, session.user.id),
  ]);

  return (
    <>
      <SiteHeader active="letters" />
      <main className="mx-auto max-w-3xl px-6 pb-10">
        <PageHero
          eyebrow="Letters"
          title="Words kept."
          lede={`Letters between the two of you, and letters to your ${bw.littleOne} for the years ahead — write, read, and react together.`}
        />

        <div className="mt-8">
          <Card className="p-8">
            <LettersPanel
              babyCount={babyLetters.length}
              coupleIntro={
                otherName ? (
                  <>
                    Letters just between you and {otherName} — yours and theirs,
                    a two-way thread. Private to the two of you.
                  </>
                ) : (
                  <>
                    Letters between the two of you. Write now and they will be
                    here when whoever is beside you joins the journey.
                  </>
                )
              }
              babyIntro={
                <>
                  Write to your {bw.littleOne} — a keepsake for the years
                  ahead. Both of you can write, read, and react.
                </>
              }
              couple={
                <CoupleLetters
                  letters={coupleLetters.items}
                  hasMore={coupleLetters.hasMore}
                  viewerId={session.user.id}
                  spouseFallback={otherName ?? "Them"}
                  placeholder={
                    otherName ? `Write to ${otherName}…` : "Write to them…"
                  }
                />
              }
              baby={
                <BabyLetters
                  letters={babyLetters}
                  viewerId={session.user.id}
                  placeholder={`Dear ${bw.littleOne}…`}
                  toWhom={`to the ${bw.noun}`}
                />
              }
            />
          </Card>
        </div>
      </main>
    </>
  );
}
