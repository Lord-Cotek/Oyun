import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getActiveMembership, getCoupleLetters } from "@/lib/data";
import { getReactionsFor } from "@/lib/reactions";
import { MOOD_META } from "@/lib/moods";
import { Reactions } from "@/components/Reactions";
import { SiteHeader } from "@/components/SiteHeader";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { CheckInForm } from "@/components/care/CheckInForm";
import { BabyLetters } from "@/components/care/BabyLetters";
import { MoodChart, type MoodPoint } from "@/components/care/MoodChart";
import { CoupleLetters } from "@/components/care/CoupleLetters";

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

  const [checkIns, letters, coupleLetters] = await Promise.all([
    prisma.checkIn.findMany({
      where: { journeyId },
      orderBy: { createdAt: "asc" },
      take: 60,
    }),
    prisma.letter.findMany({
      where: { journeyId, toBaby: true },
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

  return (
    <>
      <SiteHeader active="care" />
      <main className="mx-auto max-w-shell px-6 py-10">
        <div className="animate-fade-up">
          <Eyebrow className="mb-3">Care</Eyebrow>
          <h1 className="font-serif text-4xl leading-tight text-ink md:text-5xl">
            Your heart, your letters.
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
              <div
                id={`checkin-${latestCheckIn.id}`}
                className="notif-target mt-8 border-t border-border pt-6"
              >
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

          {/* Letters to the baby — a keepsake both parents can write */}
          <Card>
            <Eyebrow className="mb-2">Letters to your baby</Eyebrow>
            <p className="mb-5 font-mono text-xs leading-relaxed text-muted">
              A keepsake for your little one. Your husband can write here too,
              from his journey — you&rsquo;ll both see every letter.
            </p>
            <BabyLetters
              letters={letters.map((l) => ({
                id: l.id,
                body: l.body,
                createdAt: l.createdAt.toISOString(),
                authorName: l.author?.name ?? null,
                authorId: l.authorId,
              }))}
              viewerId={session.user.id}
            />
          </Card>

          {/* Letters to each other — the shared thread with her husband */}
          <Card>
            <Eyebrow className="mb-2">Between the two of you</Eyebrow>
            <p className="mb-5 font-mono text-xs leading-relaxed text-muted">
              A shared place for you and your husband to write to each other —
              he sees these on his journey, and can write back. Anyone else in
              your circle can&rsquo;t.
            </p>
            <CoupleLetters
              letters={coupleLetters.items}
              hasMore={coupleLetters.hasMore}
              viewerId={session.user.id}
              spouseFallback="Your husband"
              placeholder="Words to keep between the two of you…"
            />
          </Card>
        </div>
      </main>
    </>
  );
}
