import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getActiveMembership } from "@/lib/data";
import { getReactionsFor } from "@/lib/reactions";
import { MOOD_META } from "@/lib/moods";
import { Reactions } from "@/components/Reactions";
import { SiteHeader } from "@/components/SiteHeader";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { CheckInForm } from "@/components/care/CheckInForm";
import { LetterForm } from "@/components/care/LetterForm";
import { MilestoneForm } from "@/components/care/MilestoneForm";
import { MilestoneItem } from "@/components/care/MilestoneItem";
import { MoodChart, type MoodPoint } from "@/components/care/MoodChart";

export const metadata: Metadata = {
  title: "Care",
  description: "Your heart, your letters, your firsts.",
  robots: { index: false },
};

export default async function CarePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in?callbackUrl=/care");

  const active = await getActiveMembership(session.user.id);
  if (!active) redirect("/onboarding");
  if (active.role !== "MOTHER") redirect("/journey");

  const journeyId = active.journey.id;

  const [checkIns, letters, milestones, children] = await Promise.all([
    prisma.checkIn.findMany({
      where: { journeyId },
      orderBy: { createdAt: "asc" },
      take: 60,
    }),
    prisma.letter.findMany({
      where: { journeyId },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    prisma.milestone.findMany({
      where: { journeyId },
      orderBy: { occurredAt: "desc" },
      take: 20,
      include: { child: { select: { id: true, name: true } } },
    }),
    prisma.child.findMany({
      where: { journeyId },
      orderBy: { createdAt: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  const points: MoodPoint[] = checkIns.map((c) => ({
    date: c.createdAt.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    value: MOOD_META[c.mood].value,
    label: MOOD_META[c.mood].label,
  }));

  // Her most recent check-in and how her circle has responded to it.
  const latestCheckIn = checkIns.length ? checkIns[checkIns.length - 1] : null;
  const latestReactions = latestCheckIn
    ? (await getReactionsFor("CHECKIN", [latestCheckIn.id], session.user.id))[
        latestCheckIn.id
      ]
    : null;
  const reactionTotal = latestReactions
    ? Object.values(latestReactions.counts).reduce((a, b) => a + b, 0)
    : 0;

  return (
    <>
      <SiteHeader active="care" />
      <main className="mx-auto max-w-shell px-6 py-10">
        <div className="animate-fade-up">
          <Eyebrow className="mb-3">Care</Eyebrow>
          <h1 className="font-serif text-4xl leading-tight text-ink md:text-5xl">
            Your heart, your letters, your firsts.
          </h1>
          <p className="mt-4 max-w-prose font-mono text-sm leading-relaxed text-muted">
            A quiet, private place. What you write here stays yours — your check-in
            mood can be shared with the one supporting you; your notes and letters
            are kept for you.
          </p>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          {/* Check-ins + chart */}
          <Card className="lg:col-span-2">
            <Eyebrow className="mb-4">How is your heart today?</Eyebrow>
            <CheckInForm />
            <div className="mt-8 border-t border-border pt-6">
              <p className="eyebrow mb-4 text-muted">Over time</p>
              <MoodChart data={points} />
            </div>
            {latestCheckIn && latestReactions && (
              <div className="mt-8 border-t border-border pt-6">
                <p className="eyebrow mb-2 text-muted">
                  How your circle responded
                </p>
                <p className="mb-4 font-mono text-xs leading-relaxed text-muted">
                  {reactionTotal > 0
                    ? "They saw how you're feeling and left you these — you're not carrying it alone."
                    : "When someone who's walking with you sees your latest check-in, their response will show here."}
                </p>
                <Reactions
                  targetType="CHECKIN"
                  targetId={latestCheckIn.id}
                  initial={latestReactions}
                />
              </div>
            )}
          </Card>

          {/* Letters */}
          <Card>
            <Eyebrow className="mb-4">Letters</Eyebrow>
            <LetterForm />
            <div className="mt-6 space-y-3 border-t border-border pt-5">
              {letters.length === 0 ? (
                <p className="font-mono text-xs text-muted">
                  No letters yet. The first can be one line.
                </p>
              ) : (
                letters.map((l) => (
                  <div key={l.id} className="rounded-lg border border-border bg-bg p-4">
                    <p className="whitespace-pre-wrap font-serif text-base leading-relaxed text-ink">
                      {l.body}
                    </p>
                    <p className="mt-3 font-mono text-[0.68rem] uppercase tracking-widest text-muted">
                      {l.toBaby ? "To the baby" : "To each other"} ·{" "}
                      {l.createdAt.toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Milestones */}
          <Card>
            <Eyebrow className="mb-4">The firsts</Eyebrow>
            <MilestoneForm children={children} />
            <div className="mt-6 border-t border-border pt-5">
              {milestones.length === 0 ? (
                <p className="font-mono text-xs text-muted">
                  Nothing logged yet. The firsts go by quickly — catch them here.
                </p>
              ) : (
                <ol className="relative space-y-4 border-l border-border pl-5">
                  {milestones.map((m) => (
                    <MilestoneItem
                      key={m.id}
                      children={children}
                      m={{
                        id: m.id,
                        kind: m.kind,
                        title: m.title,
                        note: m.note,
                        occurredAt: m.occurredAt.toISOString(),
                        photoUrls: m.photoUrls,
                        childId: m.child?.id ?? null,
                        childName: m.child?.name ?? null,
                      }}
                    />
                  ))}
                </ol>
              )}
            </div>
          </Card>
        </div>
      </main>
    </>
  );
}
