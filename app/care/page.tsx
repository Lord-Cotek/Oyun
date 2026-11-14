import type { Metadata } from "next";
import { letterOpenScope } from "@/lib/letters-seal";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getActiveMembership, getCoupleLetters } from "@/lib/data";
import { getReactionsFor } from "@/lib/reactions";
import { MOOD_META } from "@/lib/moods";
import { babyWords } from "@/lib/babies";
import { Reactions } from "@/components/Reactions";
import { SiteHeader } from "@/components/SiteHeader";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { StatCard } from "@/components/ui/StatCard";
import { PageHero } from "@/components/ui/PageHero";
import { CheckInForm } from "@/components/care/CheckInForm";
import { MoodAudience } from "@/components/care/MoodAudience";
import { MoodChart, type MoodPoint } from "@/components/care/MoodChart";
import { LettersSummary } from "@/components/care/LettersSummary";

export const metadata: Metadata = {
  title: "Care",
  description: "Your heart, your letters.",
  robots: { index: false },
};

export default async function CarePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in?callbackUrl=/care");

  const active = await getActiveMembership(session.user.id);
  if (!active) redirect("/onboarding");
  if (active.role !== "MOTHER") redirect("/journey");

  const journeyId = active.journey.id;
  // One baby or four, said the same way everywhere — see lib/babies.ts.
  const bw = babyWords(active.journey.babyCount, active.journey.babyName);

  const [checkIns, letters, coupleLetters] = await Promise.all([
    // The newest sixty, put back in date order for the chart. This used to
    // take the OLDEST sixty, so after two months the chart, "Latest" and the
    // circle's reactions all stopped moving.
    prisma.checkIn
      .findMany({
        where: { journeyId },
        orderBy: { createdAt: "desc" },
        take: 60,
      })
      .then((rows) => rows.reverse()),
    prisma.letter.findMany({
      where: { journeyId, toBaby: true, AND: [letterOpenScope(session.user.id)] },
      orderBy: { createdAt: "desc" },
      take: 20,
      include: { author: { select: { id: true, name: true } } },
    }),
    getCoupleLetters(journeyId, session.user.id),
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

  const latestMood = latestCheckIn ? MOOD_META[latestCheckIn.mood] : null;
  const moodToneClass: Record<string, string> = {
    negative: "text-negative",
    accent2: "text-accent2",
    muted: "text-ink",
    accent: "text-accent",
    positive: "text-positive",
  };
  const daysTracked = new Set(
    checkIns.map((c) => c.createdAt.toDateString()),
  ).size;

  return (
    <>
      <SiteHeader active="care" />
      <main className="mx-auto max-w-shell px-6 pb-10">
        <PageHero
          eyebrow="Care"
          title="Your heart, your letters."
          lede={
            active.journey.moodAudience === "ME"
              ? "A quiet, private place. Your moods, notes and letters are kept for you — nobody else sees how you are."
              : active.journey.moodAudience === "CIRCLE"
                ? "A quiet, private place. Your mood is seen by your partner and your circle; your notes and letters are kept for you."
                : "A quiet, private place. Your mood is seen by your partner only; your notes and letters are kept for you."
          }
        />

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <StatCard
            label="Latest"
            value={
              latestMood ? (
                <span className={moodToneClass[latestMood.tone]}>
                  {latestMood.label}
                </span>
              ) : (
                "—"
              )
            }
            hint={latestMood ? "your last check-in" : "no check-in yet"}
          />
          <StatCard label="Check-ins" value={checkIns.length} hint="moments noted" />
          <StatCard label="Days tracked" value={daysTracked} hint="across your journey" />
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {/* Check-ins + chart */}
          <Card className="lg:col-span-2">
            <Eyebrow className="mb-4">How is your heart today?</Eyebrow>
            <CheckInForm shareable={active.journey.moodAudience !== "ME"} />
            <div className="mt-8 border-t border-border pt-6">
              <MoodAudience initial={active.journey.moodAudience} />
            </div>
            <div className="mt-8 border-t border-border pt-6">
              <p className="eyebrow mb-4 text-muted">Over time</p>
              <MoodChart data={points} />
            </div>
            {latestCheckIn && latestReactions && (
              <div
                id={`checkin-${latestCheckIn.id}`}
                className="notif-target mt-8 border-t border-border pt-6"
              >
                <p className="eyebrow mb-2 text-muted">
                  How your circle responded
                </p>
                <p className="mb-4 prose-serif-xs text-muted">
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

          {/* Letters live on their own page now — a quiet summary here links
              across, so Care stays about her heart. */}
          <div className="lg:col-span-2">
            <LettersSummary
              viewerId={session.user.id}
              babyLabel={`To your ${bw.noun}`}
              couple={
                coupleLetters.items[0]
                  ? {
                      authorId: coupleLetters.items[0].authorId,
                      authorName: coupleLetters.items[0].authorName,
                      body: coupleLetters.items[0].body,
                      createdAtISO: coupleLetters.items[0].createdAt,
                    }
                  : null
              }
              baby={
                letters[0]
                  ? {
                      authorId: letters[0].authorId,
                      authorName: letters[0].author?.name ?? null,
                      body: letters[0].body,
                      createdAtISO: letters[0].createdAt.toISOString(),
                    }
                  : null
              }
            />
          </div>
        </div>
      </main>
    </>
  );
}
