import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getActiveMembership } from "@/lib/data";
import { isHousehold } from "@/lib/roles";
import { hasPreferences, preferenceSheet, readPreferences } from "@/lib/birth-prep";
import { PrintButton } from "@/components/health/report/PrintButton";
import { PreferenceSheet } from "@/components/health/birth/PreferenceSheet";

export const metadata: Metadata = { title: "Birth preferences — to print", robots: { index: false } };

const day = (d: Date) => d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

/**
 * The sheet to print — or save as a PDF from the same dialog. No menus on
 * it: a page meant for a midwife's hand carries nothing but her words.
 */
export default async function PreferenceSheetPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in?callbackUrl=/health/birth/preferences/sheet");
  const active = await getActiveMembership(session.user.id);
  if (!active) redirect("/onboarding");
  if (!isHousehold(active.role)) redirect("/journey");

  const prep = await prisma.birthPrep.findUnique({
    where: { journeyId: active.journey.id },
    select: { preferences: true, preferencesAt: true },
  });
  const prefs = readPreferences(prep?.preferences);
  if (!hasPreferences(prefs)) redirect("/health/birth/preferences");

  return (
    <main className="mx-auto max-w-3xl px-6 pb-12 pt-8 print:max-w-none print:px-0 print:pt-0">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3 print:hidden">
        <Link href="/health/birth/preferences" className="font-mono text-xs text-muted underline underline-offset-4 hover:text-accent">
          ← Back
        </Link>
        <PrintButton />
      </div>
      <PreferenceSheet
        name={active.journey.owner.name?.trim() || "Birth preferences"}
        lines={preferenceSheet(prefs)}
        updated={prep?.preferencesAt ? day(prep.preferencesAt) : null}
      />
    </main>
  );
}
