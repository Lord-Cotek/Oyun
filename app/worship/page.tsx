import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getActiveMembership, getWorshipStreak } from "@/lib/data";
import { computePosition } from "@/lib/stage";
import { familyWorship } from "@/lib/worship";
import { SiteHeader } from "@/components/SiteHeader";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Verse } from "@/components/ui/Verse";
import { WorshipTracker } from "@/components/journey/WorshipTracker";

export const metadata: Metadata = {
  title: "Family worship",
  description: "A daily rhythm for your household.",
  robots: { index: false },
};

export default async function WorshipPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in?callbackUrl=/worship");

  const active = await getActiveMembership(session.user.id);
  if (!active) redirect("/onboarding");
  if (active.journey.status === "LOSS") redirect("/journey");

  const born = computePosition(active.journey.dueDate).born;
  const { liturgy, hymn, catechism, catechismNumber } = familyWorship();
  const streak = await getWorshipStreak(active.journey.id);

  return (
    <>
      <SiteHeader active="worship" />
      <main className="mx-auto max-w-shell px-6 py-10">
        <div className="animate-fade-up">
          <Eyebrow className="mb-3">Family worship</Eyebrow>
          <h1 className="font-serif text-4xl leading-tight text-ink md:text-5xl">
            A daily altar in your home.
          </h1>
          <p className="mt-4 max-w-prose font-mono text-sm leading-relaxed text-muted">
            A few unhurried minutes: read a little, understand a little, pray a
            little, sing a little. Consistency matters more than length — a short
            rhythm kept faithfully will shape a household over years.
          </p>
        </div>

        <div className="mt-8">
          <Card className="border-accent/30 bg-accent/[0.06] p-6">
            <Eyebrow className="mb-4">Keep the rhythm</Eyebrow>
            <WorshipTracker
              doneToday={streak.doneToday}
              streak={streak.streak}
              last7={streak.last7}
            />
          </Card>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <div className="min-w-0 space-y-4">
            <Card className="p-8">
              <Eyebrow className="mb-4">Read together</Eyebrow>
              <Verse text={liturgy.read.text} reference={liturgy.read.ref} size="lg" />
              <div className="mt-6 border-t border-border pt-6">
                <Eyebrow className="mb-2 text-muted">Reflect</Eyebrow>
                <p className="font-mono text-sm leading-relaxed text-ink/90">
                  {liturgy.reflection}
                </p>
              </div>
            </Card>

            <Card className="p-8">
              <Eyebrow className="mb-3">Talk together</Eyebrow>
              <p className="font-serif text-xl leading-snug text-ink">{liturgy.talk}</p>
              <p className="mt-3 font-mono text-[0.7rem] leading-relaxed text-muted">
                For the two of you now; for the whole table in years to come.
              </p>
            </Card>

            {born && (
              <Card className="p-8">
                <Eyebrow className="mb-3">Catechism · Question {catechismNumber}</Eyebrow>
                <p className="font-serif text-xl leading-snug text-ink">{catechism.q}</p>
                <p className="mt-2 font-mono text-sm leading-relaxed text-ink/90">
                  <span className="text-accent">A.</span> {catechism.a}
                </p>
                <p className="mt-4 font-mono text-[0.7rem] leading-relaxed text-muted">
                  Learned by repetition, long before it&rsquo;s fully understood.
                  Say it together; one question a day is plenty.
                </p>
              </Card>
            )}
          </div>

          <div className="space-y-4">
            <Card className="p-8">
              <Eyebrow className="mb-3">Pray together</Eyebrow>
              <p className="font-mono text-sm leading-relaxed text-muted">{liturgy.pray}</p>
            </Card>
            <Card className="border-accent2/30 bg-accent2/[0.05] p-8">
              <Eyebrow className="mb-3 text-accent2">Sing together</Eyebrow>
              <p className="font-serif text-xl leading-snug text-ink">{hymn.title}</p>
              <p className="mt-2 font-mono text-sm leading-relaxed text-muted">
                &ldquo;{hymn.line}&rdquo;
              </p>
            </Card>
            <Card className="p-8">
              <Eyebrow className="mb-3">A word on keeping it</Eyebrow>
              <p className="font-mono text-xs leading-relaxed text-muted">
                Don&rsquo;t aim for perfect; aim for daily. If you miss a day, simply
                begin again the next. The goal is not a performance but a home
                where God is a familiar, welcome presence.
              </p>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}
