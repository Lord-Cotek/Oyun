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
import { PageHero } from "@/components/ui/PageHero";
import { Icon, type IconName } from "@/components/ui/Icon";
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
  if (active.role === "ACCOUNTABILITY") redirect("/journey");
  if (active.journey.status === "LOSS") redirect("/journey");

  const born = computePosition(active.journey.dueDate).born;
  const { liturgy, hymn, catechism, catechismNumber } = familyWorship();
  const streak = await getWorshipStreak(active.journey.id);

  return (
    <>
      <SiteHeader active="worship" />
      <main className="mx-auto max-w-shell px-6 py-10">
        <PageHero
          eyebrow="Family worship"
          title="A daily altar in your home."
          lede="A few unhurried minutes: read a little, understand a little, pray a little, sing a little. Consistency matters more than length — a short rhythm kept faithfully will shape a household over years."
          aside={
            <WorshipTracker
              doneToday={streak.doneToday}
              streak={streak.streak}
              last7={streak.last7}
              showRing
            />
          }
        />

        <div className="mt-6 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <div className="min-w-0 space-y-4">
            <Card className="p-8">
              <LiturgyHead icon="book">Read together</LiturgyHead>
              <Verse text={liturgy.read.text} reference={liturgy.read.ref} size="lg" />
              <div className="mt-6 border-t border-border pt-6">
                <Eyebrow className="mb-2 text-muted">Reflect</Eyebrow>
                <p className="font-mono text-sm leading-relaxed text-ink/90">
                  {liturgy.reflection}
                </p>
              </div>
            </Card>

            <Card className="p-8">
              <LiturgyHead icon="message">Talk together</LiturgyHead>
              <p className="font-serif text-xl leading-snug text-ink">{liturgy.talk}</p>
              <p className="mt-3 font-mono text-[0.7rem] leading-relaxed text-muted">
                For the two of you now; for the whole table in years to come.
              </p>
            </Card>

            {born && (
              <Card className="p-8">
                <LiturgyHead icon="question">
                  Catechism · Question {catechismNumber}
                </LiturgyHead>
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
              <LiturgyHead icon="flame">Pray together</LiturgyHead>
              <p className="font-mono text-sm leading-relaxed text-muted">{liturgy.pray}</p>
            </Card>
            <Card className="border-accent2/30 bg-accent2/[0.05] p-8">
              <LiturgyHead icon="music" tone="accent2">
                Sing together
              </LiturgyHead>
              <p className="font-serif text-xl leading-snug text-ink">{hymn.title}</p>
              <p className="mt-2 font-mono text-sm leading-relaxed text-muted">
                &ldquo;{hymn.line}&rdquo;
              </p>
            </Card>
            <Card className="p-8">
              <LiturgyHead icon="leaf">A word on keeping it</LiturgyHead>
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

/** A liturgy card header — a small line-icon beside the eyebrow. */
function LiturgyHead({
  icon,
  tone = "accent",
  children,
}: {
  icon: IconName;
  tone?: "accent" | "accent2";
  children: React.ReactNode;
}) {
  const color = tone === "accent2" ? "text-accent2" : "text-accent";
  return (
    <div className={`mb-3 flex items-center gap-2 ${color}`}>
      <Icon name={icon} size={16} />
      <Eyebrow as="span" className={color}>
        {children}
      </Eyebrow>
    </div>
  );
}
