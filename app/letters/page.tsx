import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getActiveMembership, getCoupleLetters, getBabyLetters } from "@/lib/data";
import { SiteHeader } from "@/components/SiteHeader";
import { PageHero } from "@/components/ui/PageHero";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { CoupleLetters } from "@/components/care/CoupleLetters";
import { BabyLetters } from "@/components/care/BabyLetters";

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
  if (active.role === "ACCOUNTABILITY") redirect("/journey");

  const { journey } = active;
  const motherName = journey.owner.name ?? "her";
  const [coupleLetters, babyLetters] = await Promise.all([
    getCoupleLetters(journey.id, session.user.id),
    getBabyLetters(journey.id, session.user.id),
  ]);

  return (
    <>
      <SiteHeader active="letters" />
      <main className="mx-auto max-w-3xl px-6 py-10">
        <PageHero
          eyebrow="Letters"
          title="Words kept."
          lede="Letters between the two of you, and letters to your little one for the years ahead — write, read, and react together."
        />

        <div className="mt-8 space-y-4">
          <Card className="p-8">
            <Eyebrow className="mb-2">Between the two of you</Eyebrow>
            <p className="mb-5 font-mono text-xs leading-relaxed text-muted">
              Letters just between you and {motherName} — hers and yours, a
              two-way thread. Private to the two of you.
            </p>
            <CoupleLetters
              letters={coupleLetters.items}
              hasMore={coupleLetters.hasMore}
              viewerId={session.user.id}
              spouseFallback={motherName}
              placeholder={`Write to ${motherName}…`}
            />
          </Card>

          <Card className="p-8">
            <Eyebrow className="mb-2">Letters to your baby</Eyebrow>
            <p className="mb-5 font-mono text-xs leading-relaxed text-muted">
              Write to your little one — a keepsake for the years ahead. Both of
              you can write, read, and react.
            </p>
            <BabyLetters
              letters={babyLetters}
              viewerId={session.user.id}
              placeholder="Dear little one…"
            />
          </Card>
        </div>
      </main>
    </>
  );
}
