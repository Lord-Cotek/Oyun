import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getActiveMembership } from "@/lib/data";
import { isHousehold } from "@/lib/roles";
import { computePosition } from "@/lib/stage";
import { MOOD_ATTRIBUTION, moodIntro, moodResult, moodResultForPartner, type MoodPhase } from "@/lib/mood-check";
import { MoodResultView } from "@/components/health/mood/MoodResultView";
import { SiteHeader } from "@/components/SiteHeader";
import { PageHero } from "@/components/ui/PageHero";
import { HealthTabs } from "@/components/health/HealthTabs";
import { MoodCheckForm } from "@/components/health/mood/MoodCheckForm";
import { KeptMoodControls } from "@/components/health/mood/KeptMood";

export const metadata: Metadata = {
  title: "Mood check",
  description: "Eleven questions about the last two weeks, for her alone.",
  robots: { index: false },
};

const day = (d: Date) => d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

/**
 * The mood check — lib/mood-check.ts.
 *
 * Hers alone. Her partner is told that plainly, and is shown only a result
 * she has chosen to show him, in words written to him; nobody else can reach
 * the page at all. Nothing here reminds her to take it, and nothing is kept
 * unless she presses "Keep this result".
 */
export default async function MoodPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in?callbackUrl=/health/mood");
  const active = await getActiveMembership(session.user.id);
  if (!active) redirect("/onboarding");
  if (!isHousehold(active.role)) redirect("/journey");

  const journey = active.journey;
  const first = journey.owner.name?.trim().split(/\s+/)[0] || "her";

  const pos = computePosition(journey.dueDate);
  const phase: MoodPhase = journey.status === "LOSS" ? "after-loss" : pos.born ? "after-birth" : "pregnancy";

  if (active.role !== "MOTHER") {
    // Only what she chose to show him. The condition is in the query, so a
    // result she has not shared is never fetched for his page at all.
    const shown = await prisma.moodCheck.findMany({
      where: { journeyId: journey.id, forPartnerAt: { not: null } },
      orderBy: { takenAt: "desc" },
      select: { id: true, low: true, worry: true, selfHarm: true, takenAt: true },
    });
    return (
      <>
        <SiteHeader active="health" />
        <main className="mx-auto max-w-3xl px-6 pb-14">
          <PageHero eyebrow="Health" title="Mood check." lede={`A few private questions for ${first}, about how the last two weeks have been.`} compact />
          <HealthTabs active="mood" />
          <div className="mt-8 max-w-prose space-y-3 prose-serif-sm text-muted">
            <p>
              This one is {first}&rsquo;s alone. Whether she has taken it, and anything she answered, is not shown to you or to
              anybody else unless she chooses to show you a result.
            </p>
            {shown.length === 0 && (
              <p>
                If you are worried about how she is,{" "}
                <Link href="/health/when-to-call" className="text-accent underline underline-offset-4">
                  When to call
                </Link>{" "}
                lists what to look for and what to do. Asking her, and listening, is the best thing on that list.
              </p>
            )}
          </div>

          {shown.length > 0 && (
            <section aria-labelledby="shown" className="mt-8">
              <h2 id="shown" className="eyebrow mb-3 text-muted">
                What {first} chose to show you
              </h2>
              <ul className="space-y-6">
                {shown.map((k) => (
                  <li key={k.id}>
                    <p className="mb-2 font-mono text-[0.62rem] uppercase tracking-widest text-muted">{day(k.takenAt)}</p>
                    <MoodResultView r={moodResultForPartner({ low: k.low, worry: k.worry, selfHarm: k.selfHarm }, phase, session.user.voice, first)} />
                  </li>
                ))}
              </ul>
              <p className="mt-4 max-w-prose prose-serif-xs text-muted">
                A screening questionnaire, not a diagnosis. You see what her answers came to, not the answers themselves, and
                only for as long as she leaves it shown.
              </p>
            </section>
          )}
        </main>
      </>
    );
  }

  const [kept, doctors, partner] = await Promise.all([
    prisma.moodCheck.findMany({
      where: { journeyId: journey.id, userId: session.user.id },
      orderBy: { takenAt: "desc" },
      select: { id: true, low: true, worry: true, selfHarm: true, takenAt: true, forDoctorAt: true, forPartnerAt: true },
    }),
    prisma.clinicianLink.count({ where: { journeyId: journey.id, endedAt: null } }),
    prisma.membership.findFirst({ where: { journeyId: journey.id, role: "PARTNER" }, select: { user: { select: { name: true } } } }),
  ]);
  const partnerName = partner ? partner.user.name?.trim().split(/\s+/)[0] || "my partner" : null;

  return (
    <>
      <SiteHeader active="health" />
      <main className="mx-auto max-w-3xl px-6 pb-14">
        <PageHero eyebrow="Health" title="Mood check." lede="How the last two weeks have been, for you alone." compact />
        <HealthTabs active="mood" />

        <div className="mt-6 max-w-prose space-y-2">
          {moodIntro(phase).map((p) => (
            <p key={p} className="prose-serif-sm text-ink/90">
              {p}
            </p>
          ))}
        </div>

        <section aria-label="The questions" className="mt-6 rounded-2xl border border-border bg-surface p-5">
          <MoodCheckForm phase={phase} voice={session.user.voice ?? null} />
        </section>

        {kept.length > 0 && (
          <section aria-labelledby="kept" className="mt-8">
            <h2 id="kept" className="eyebrow mb-3 text-muted">
              Results you kept
            </h2>
            <ul className="space-y-3">
              {kept.map((k) => {
                const r = moodResult({ low: k.low, worry: k.worry, selfHarm: k.selfHarm }, phase, session.user.voice);
                return (
                  <li key={k.id} className="rounded-2xl border border-border bg-surface p-4">
                    <p className="font-mono text-[0.62rem] uppercase tracking-widest text-muted">{day(k.takenAt)}</p>
                    <p className="mt-1 prose-serif-sm font-medium text-ink">{r.title}</p>
                    <p className="mt-1 font-mono text-[0.62rem] uppercase tracking-widest text-muted">{r.figures}</p>
                    <KeptMoodControls
                      id={k.id}
                      forDoctor={k.forDoctorAt !== null}
                      forPartner={k.forPartnerAt !== null}
                      hasDoctor={doctors > 0}
                      partnerName={partnerName}
                    />
                  </li>
                );
              })}
            </ul>
            {doctors === 0 && (
              <p className="mt-2 prose-serif-xs text-muted">
                You have not linked a doctor or midwife in Oyun. If you would like to show one a result, link them under Your
                doctor.
              </p>
            )}
          </section>
        )}

        <div className="mt-10 space-y-2 border-t border-border pt-4">
          <p className="max-w-prose prose-serif-xs text-muted">{MOOD_ATTRIBUTION}</p>
          <p className="max-w-prose prose-serif-xs text-muted">
            If you are in danger of harming yourself, do not wait for a questionnaire:{" "}
            <Link href="/health/when-to-call" className="underline underline-offset-4 hover:text-accent">
              When to call
            </Link>
            .
          </p>
        </div>
      </main>
    </>
  );
}
