import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getActiveMembership } from "@/lib/data";
import { isHousehold } from "@/lib/roles";
import { keptToMother, logAccess } from "@/lib/health-log-db";
import { loadMedicines } from "@/lib/medication-db";
import { SiteHeader } from "@/components/SiteHeader";
import { PageHero } from "@/components/ui/PageHero";
import { HealthTabs } from "@/components/health/HealthTabs";
import { MedicinesHome } from "@/components/health/medicines/MedicinesHome";

export const metadata: Metadata = { title: "Medicines", robots: { index: false } };

/**
 * Medicines and the doses they make — kept by the same rule as the health
 * log: the two of them, or her alone if she chooses. Times are hers.
 */
export default async function MedicinesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in?callbackUrl=/health/medicines");
  const active = await getActiveMembership(session.user.id);
  if (!active) redirect("/onboarding");
  if (!isHousehold(active.role)) redirect("/journey");
  const a = await logAccess(session.user.id, active.journey.id);
  if (!a) {
    const kept = await keptToMother(active.journey.id);
    return (
      <>
        <SiteHeader active="health" />
        <main className="mx-auto max-w-3xl px-6 pb-14">
          <PageHero eyebrow="Health" title="Medicines." lede="" />
          <HealthTabs active="medicines" />
          <p className="mt-8 max-w-prose prose-serif-sm text-muted">
            {kept ? `${active.journey.owner.name?.split(" ")[0] ?? "She"} has chosen to keep her health log, medicines included, to herself for now.` : "Medicines are not open to you."}
          </p>
        </main>
      </>
    );
  }
  const m = await loadMedicines(a);
  return (
    <>
      <SiteHeader active="health" />
      <main className="mx-auto max-w-3xl px-6 pb-14">
        <PageHero
          eyebrow="Health"
          title="Medicines."
          lede="What the doctor prescribed and when — every dose taken, late or skipped, kept for the next appointment. Reminders arrive at each dose and never name the medicine."
        />
        <HealthTabs active="medicines" />
        <p className="mt-4 font-mono text-[0.66rem] text-muted">Times are in {m.tz.replace(/_/g, " ")}.</p>
        <MedicinesHome journeyId={a.journeyId} todays={m.todays} earlier={m.earlier} asNeededLog={m.asNeededLog} plans={m.plans} />
        <p className="mt-10 border-t border-border pt-4 prose-serif-xs text-muted">
          A record kept at home, not medical advice. Never change or stop a medicine without speaking to your doctor.
        </p>
      </main>
    </>
  );
}
