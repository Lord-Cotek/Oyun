import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getActiveMembership } from "@/lib/data";
import { isHousehold } from "@/lib/roles";
import { keptToMother, logAccess } from "@/lib/health-log-db";
import { labourWords } from "@/lib/labour";
import { SiteHeader } from "@/components/SiteHeader";
import { PageHero } from "@/components/ui/PageHero";
import { HealthTabs } from "@/components/health/HealthTabs";
import { ContractionTimer } from "@/components/health/birth/ContractionTimer";

export const metadata: Metadata = {
  title: "Contraction timer",
  description: "How long they last and how far apart they are, ready to tell the midwife.",
  robots: { index: false },
};

/**
 * The contraction timer — lib/labour.ts.
 *
 * Part of the health log and open to the same people. It times and it counts;
 * it never says when to go in. The words for between contractions follow the
 * reader's own faith choice.
 */
export default async function TimerPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in?callbackUrl=/health/birth/timer");
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
          <PageHero eyebrow="Health" title="Contraction timer." lede="" compact />
          <HealthTabs active="birth" />
          <p className="mt-8 max-w-prose prose-serif-sm text-muted">
            {kept
              ? `${active.journey.owner.name?.split(" ")[0] ?? "She"} has chosen to keep her health log to herself for now, and the timer is part of it. She can open it to you in the Log's settings; it takes a moment.`
              : "The timer is not open to you."}
          </p>
        </main>
      </>
    );
  }

  const [rows, settings] = await Promise.all([
    prisma.contraction.findMany({
      where: { journeyId: a.journeyId },
      orderBy: { startedAt: "asc" },
      select: { id: true, startedAt: true, endedAt: true },
    }),
    prisma.healthLogSettings.findUnique({ where: { journeyId: a.journeyId }, select: { labourNote: true } }),
  ]);
  const reader = a.isMother ? "MOTHER" : "PARTNER";

  return (
    <>
      <SiteHeader active="health" />
      <main className="mx-auto max-w-3xl px-6 pb-14">
        <PageHero
          eyebrow="Health"
          title="Contraction timer."
          lede="Press when one starts, press when it eases. How long they last and how far apart they are is worked out for you, ready to tell the midwife."
          compact
        />
        <HealthTabs active="birth" />
        <p className="mt-4 font-mono text-xs">
          <Link href="/health/birth" className="text-muted underline underline-offset-4 hover:text-accent">
            ← Birth
          </Link>
        </p>
        <div className="mt-4">
          <ContractionTimer
            initial={rows.map((r) => ({ id: r.id, startedAt: r.startedAt.toISOString(), endedAt: r.endedAt?.toISOString() ?? null }))}
            note={settings?.labourNote ?? null}
            words={labourWords(session.user.voice, reader)}
            reader={reader}
          />
        </div>
        <p className="mt-10 border-t border-border pt-4 max-w-prose prose-serif-xs text-muted">
          The timer measures; it does not judge. When to ring and when to go in is for {reader === "MOTHER" ? "your" : "her"} own midwife
          or hospital to say.{" "}
          <Link href="/health/when-to-call" className="underline underline-offset-4 hover:text-accent">
            When to call
          </Link>{" "}
          lists the signs that never wait.
        </p>
      </main>
    </>
  );
}
