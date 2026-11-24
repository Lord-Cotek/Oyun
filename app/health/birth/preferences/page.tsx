import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getActiveMembership } from "@/lib/data";
import { isHousehold } from "@/lib/roles";
import { isGeneral } from "@/lib/voice";
import { fieldsFor, hasPreferences, preferenceSheet, readPreferences } from "@/lib/birth-prep";
import { SiteHeader } from "@/components/SiteHeader";
import { PageHero } from "@/components/ui/PageHero";
import { HealthTabs } from "@/components/health/HealthTabs";
import { PreferencesEditor } from "@/components/health/birth/PreferencesEditor";
import { PreferenceSheet } from "@/components/health/birth/PreferenceSheet";

export const metadata: Metadata = {
  title: "Birth preferences",
  description: "One page to show the midwife: who will be with you, and what you would like on the day.",
  robots: { index: false },
};

const day = (d: Date) => d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

/**
 * Her birth preferences — lib/birth-prep.ts.
 *
 * She fills them in; her partner reads them, because he is often the one who
 * has to say them for her. Nobody else sees them unless she prints the sheet
 * or switches on showing it to her doctor.
 */
export default async function PreferencesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in?callbackUrl=/health/birth/preferences");
  const active = await getActiveMembership(session.user.id);
  if (!active) redirect("/onboarding");
  if (!isHousehold(active.role)) redirect("/journey");

  const journeyId = active.journey.id;
  const isMother = active.role === "MOTHER";
  const [prep, doctors] = await Promise.all([
    prisma.birthPrep.findUnique({ where: { journeyId }, select: { preferences: true, preferencesAt: true, forDoctorAt: true } }),
    isMother ? prisma.clinicianLink.count({ where: { journeyId, endedAt: null } }) : Promise.resolve(0),
  ]);
  const prefs = readPreferences(prep?.preferences);
  const lines = preferenceSheet(prefs);
  const motherName = active.journey.owner.name?.trim() || "Her";
  const first = motherName.split(/\s+/)[0];

  return (
    <>
      <SiteHeader active="health" />
      <main className="mx-auto max-w-3xl px-6 pb-14">
        <PageHero
          eyebrow="Health"
          title="Birth preferences."
          lede={
            isMother
              ? "One page to show the midwife. Answer what matters to you and leave the rest; none of it is required."
              : `What ${first} would like on the day. You may be the one who has to say it for her.`
          }
          compact
        />
        <HealthTabs active="birth" />
        <p className="mt-4 font-mono text-xs">
          <Link href="/health/birth" className="text-muted underline underline-offset-4 hover:text-accent">
            ← Birth
          </Link>
        </p>

        {hasPreferences(prefs) && (
          <div className="mt-5 flex flex-wrap items-center gap-3 rounded-xl border border-border bg-surface/60 px-4 py-3">
            <p className="min-w-0 flex-1 prose-serif-xs text-muted">On one page, to print or to save as a PDF for the hospital bag.</p>
            <Link
              href="/health/birth/preferences/sheet"
              className="inline-flex min-h-11 items-center rounded-lg border border-accent/60 px-4 font-mono text-xs text-accent hover:bg-accent/[0.06]"
            >
              Print the sheet
            </Link>
          </div>
        )}

        {isMother ? (
          <div className="mt-6 rounded-2xl border border-border bg-surface p-5">
            <p className="mb-5 max-w-prose prose-serif-sm text-muted">
              These are wishes about how things are done, not decisions about your care. A birth does not always go to plan, and
              your midwife or doctor will talk through anything that needs to change.
            </p>
            <PreferencesEditor
              fields={fieldsFor(session.user.voice, prefs)}
              initial={prefs}
              shared={!!prep?.forDoctorAt}
              hasDoctor={doctors > 0}
              general={isGeneral(session.user.voice)}
            />
          </div>
        ) : hasPreferences(prefs) ? (
          <div className="mt-6">
            <PreferenceSheet name={motherName} lines={lines} updated={prep?.preferencesAt ? day(prep.preferencesAt) : null} />
            <p className="mt-3 prose-serif-xs text-muted">Only {first} can change these.</p>
          </div>
        ) : (
          <p className="mt-8 max-w-prose prose-serif-sm text-muted">
            {first} has not written her preferences yet. When she does, they will be here for you to read.
          </p>
        )}
      </main>
    </>
  );
}
