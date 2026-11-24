import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getActiveMembership } from "@/lib/data";
import { isHousehold } from "@/lib/roles";
import { bagFor, readBagExtras } from "@/lib/birth-prep";
import { SiteHeader } from "@/components/SiteHeader";
import { PageHero } from "@/components/ui/PageHero";
import { HealthTabs } from "@/components/health/HealthTabs";
import { BagChecklist } from "@/components/health/birth/BagChecklist";

export const metadata: Metadata = {
  title: "Hospital bag",
  description: "What to pack for the birth: for her, for the baby, and for whoever goes with her.",
  robots: { index: false },
};

/**
 * The hospital bag — lib/birth-prep.ts. The two of theirs to pack; the
 * suggestions follow the reader's own choice of how Oyun speaks to them.
 */
export default async function BagPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in?callbackUrl=/health/birth/bag");
  const active = await getActiveMembership(session.user.id);
  if (!active) redirect("/onboarding");
  if (!isHousehold(active.role)) redirect("/journey");

  const prep = await prisma.birthPrep.findUnique({
    where: { journeyId: active.journey.id },
    select: { bagDone: true, bagExtras: true },
  });

  return (
    <>
      <SiteHeader active="health" />
      <main className="mx-auto max-w-3xl px-6 pb-14">
        <PageHero
          eyebrow="Health"
          title="The hospital bag."
          lede="Packed by about 36 weeks is the usual advice, sooner with twins. Tick things off as they go in; either of you can."
          compact
        />
        <HealthTabs active="birth" />
        <p className="mt-4 font-mono text-xs">
          <Link href="/health/birth" className="text-muted underline underline-offset-4 hover:text-accent">
            ← Birth
          </Link>
        </p>
        <div className="mt-4">
          <BagChecklist
            sections={bagFor(session.user.voice, active.journey.babyCount)}
            done={prep?.bagDone ?? []}
            extras={readBagExtras(prep?.bagExtras)}
          />
        </div>
        <p className="mt-8 max-w-prose prose-serif-xs text-muted">
          Hospitals differ in what they provide. Ask yours, and add what they tell you under &ldquo;Your own&rdquo;. The two printed
          pages are a tap away:{" "}
          <Link href="/health/card" className="underline underline-offset-4 hover:text-accent">
            health card
          </Link>
          {" · "}
          <Link href="/health/birth/preferences" className="underline underline-offset-4 hover:text-accent">
            birth preferences
          </Link>
          .
        </p>
      </main>
    </>
  );
}
