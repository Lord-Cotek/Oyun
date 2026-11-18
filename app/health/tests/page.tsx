import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getActiveMembership } from "@/lib/data";
import { isHousehold } from "@/lib/roles";
import { keptToMother, logAccess } from "@/lib/health-log-db";
import { loadChecklist } from "@/lib/prenatal-db";
import { SiteHeader } from "@/components/SiteHeader";
import { PageHero } from "@/components/ui/PageHero";
import { HealthTabs } from "@/components/health/HealthTabs";
import { TestsHome } from "@/components/health/tests/TestsHome";

export const metadata: Metadata = { title: "Tests and vaccines", robots: { index: false } };

/**
 * The tests and vaccines checklist — one full list of what is usually
 * offered, by week; the family chooses what is on theirs. Kept by the same
 * rule as the health log.
 */
export default async function TestsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in?callbackUrl=/health/tests");
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
          <PageHero eyebrow="Health" title="Tests and vaccines." lede="" />
          <HealthTabs active="tests" />
          <p className="mt-8 max-w-prose prose-serif-sm text-muted">
            {kept ? `${active.journey.owner.name?.split(" ")[0] ?? "She"} has chosen to keep her health log, tests included, to herself for now.` : "The checklist is not open to you."}
          </p>
        </main>
      </>
    );
  }
  const c = await loadChecklist(a);
  const stageLabel = c.stage.born ? `${c.stage.weeksAfter} weeks after the birth.` : `You are ${c.stage.week} weeks.`;
  return (
    <>
      <SiteHeader active="health" />
      <main className="mx-auto max-w-3xl px-6 pb-14">
        <PageHero
          eyebrow="Health"
          title="Tests and vaccines."
          lede="What is usually checked, week by week — with the date, the result and the report kept with each one when it is done."
        />
        <HealthTabs active="tests" />
        <TestsHome
          journeyId={a.journeyId}
          touched={c.touched}
          stageLabel={stageLabel}
          everyVisit={c.everyVisit}
          facts={c.facts}
          conditionals={c.conditionals}
          items={c.items}
          hidden={c.hidden}
          appointments={c.appointments}
        />
        <p className="mt-10 border-t border-border pt-4 prose-serif-xs text-muted">
          A typical schedule, not medical advice. Your doctor or midwife decides what you need and when.
        </p>
      </main>
    </>
  );
}
