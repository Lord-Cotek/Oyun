import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getActiveMembership } from "@/lib/data";
import { isHousehold } from "@/lib/roles";
import { keptToMother, logAccess } from "@/lib/health-log-db";
import { readingsBetween, todayAtAGlance } from "@/lib/health-log-view";
import { dayIn, gestationOn } from "@/lib/health-log";
import { SiteHeader } from "@/components/SiteHeader";
import { PageHero } from "@/components/ui/PageHero";
import { HealthTabs } from "@/components/health/HealthTabs";
import { LogHome } from "@/components/health/log/LogHome";

export const metadata: Metadata = {
  title: "Health log",
  description: "Glucose, blood pressure, weight and the rest — recorded at home, kept for your doctor.",
  robots: { index: false },
};

/**
 * The health log. Kept to the household (or, if she chooses, to her alone),
 * like the appointment book: never the circle, never a share link, never the
 * assistant. It leaves the app only in a report link she makes herself.
 */
export default async function HealthLogPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in?callbackUrl=/health/log");
  const active = await getActiveMembership(session.user.id);
  if (!active) redirect("/onboarding");
  if (!isHousehold(active.role)) redirect("/journey");

  const a = await logAccess(session.user.id, active.journey.id);
  if (!a) {
    // Her partner, after she kept the log to herself: said plainly, in her terms.
    const kept = await keptToMother(active.journey.id);
    return (
      <>
        <SiteHeader active="health" />
        <main className="mx-auto max-w-3xl px-6 pb-14">
          <PageHero eyebrow="Health" title="Her health log." lede="" />
          <HealthTabs active="log" />
          <p className="mt-8 max-w-prose prose-serif-sm text-muted">
            {kept
              ? `${active.journey.owner.name?.split(" ")[0] ?? "She"} has chosen to keep her health log to herself for now. The health cards are still yours to see.`
              : "The health log is not open to you."}
          </p>
        </main>
      </>
    );
  }

  const now = new Date();
  const views = await readingsBetween(a, new Date(now.getTime() - 14 * 86_400_000), new Date(now.getTime() + 15 * 60_000));
  const todayKey = dayIn(now, a.timeZone);
  const urgentRecent = views.filter((v) => v.level === "urgent" && now.getTime() - new Date(v.takenAt).getTime() < 24 * 3600_000);
  const ga = a.journeyActive ? gestationOn(a.dueDate, now) : null;

  return (
    <>
      <SiteHeader active="health" />
      <main className="mx-auto max-w-3xl px-6 pb-14">
        <PageHero
          eyebrow="Health"
          title="The health log."
          lede="Glucose, blood pressure, weight, movements and how you feel — a few seconds each, kept together for your doctor. The app never diagnoses: it shows the number, your target, and when to call."
        />
        <HealthTabs active="log" />
        {ga && ga.week <= 42 && (
          <p className="mt-4 font-mono text-xs text-muted">
            {ga.week}+{ga.day} today
          </p>
        )}
        <Suspense>
          <LogHome
            journeyId={a.journeyId}
            readings={views}
            today={todayAtAGlance(views, todayKey)}
            todayKey={todayKey}
            units={a.units}
            targets={a.targets}
            customTargets={[...a.customTargets]}
            isMother={a.isMother}
            audience={a.audience}
            weeklyEmail={a.weeklyEmail}
            urgentRecent={urgentRecent}
            checkTimes={a.checkTimes}
          />
        </Suspense>
        <p className="mt-10 border-t border-border pt-4 prose-serif-xs text-muted">
          Recorded at home by your household. Not a diagnosis — anything flagged is for discussing with your doctor or midwife.
        </p>
      </main>
    </>
  );
}
