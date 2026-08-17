import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getActiveMembership, getWorshipStreak } from "@/lib/data";
import { computePosition } from "@/lib/stage";
import { familyWorship, hymnaryUrl } from "@/lib/worship";
import { markWorship } from "@/app/worship/actions";
import { SiteHeader } from "@/components/SiteHeader";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Verse } from "@/components/ui/Verse";
import { PageHero } from "@/components/ui/PageHero";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { LiturgyRail, type Station } from "@/components/worship/LiturgyRail";

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

  const stations: Station[] = [
    {
      id: "read",
      icon: "book",
      eyebrow: "Read together",
      verse: { text: liturgy.read.text, ref: liturgy.read.ref },
    },
    {
      id: "reflect",
      icon: "sparkles",
      eyebrow: "Reflect",
      body: liturgy.reflection,
    },
    ...(born
      ? [
          {
            id: "catechism",
            icon: "question" as const,
            eyebrow: `Catechism · Question ${catechismNumber}`,
            title: catechism.q,
            answer: catechism.a,
            note: "Learned by repetition, long before it’s fully understood. Say it together; one question a day is plenty.",
          },
        ]
      : []),
    {
      id: "talk",
      icon: "message",
      eyebrow: "Talk together",
      title: liturgy.talk,
      note: "For the two of you now; for the whole table in years to come.",
    },
    {
      id: "pray",
      icon: "flame",
      eyebrow: "Pray together",
      body: liturgy.pray,
    },
    {
      id: "sing",
      icon: "music",
      eyebrow: "Sing together",
      title: hymn.title,
      body: `“${hymn.line}”`,
      author: hymn.author,
      lyrics: hymn.lyrics,
      link: { href: hymnaryUrl(hymn.title), label: "Listen on Hymnary" },
      tone: "accent2",
    },
  ];

  return (
    <>
      <SiteHeader active="worship" />
      <main className="mx-auto max-w-shell px-6 py-10">
        <PageHero
          eyebrow="Family worship"
          title="A daily altar in your home."
          lede="A few unhurried minutes, walked together — read a little, understand a little, pray a little, sing a little. Consistency matters more than length."
          aside={
            <div className="flex flex-col items-center gap-2">
              <ProgressRing
                progress={Math.min(1, streak.last7 / 7)}
                value={<AnimatedNumber value={streak.last7} />}
                unit="of the last 7"
                size={150}
                stroke={11}
              />
              <p className="font-mono text-[0.68rem] uppercase tracking-widest text-muted">
                {streak.streak > 0
                  ? `${streak.streak}-day streak`
                  : "begin again today"}
              </p>
            </div>
          }
        />

        <section className="mt-8">
          <div className="mb-5 flex items-center justify-between">
            <Eyebrow>Today’s liturgy</Eyebrow>
            <span className="font-mono text-[0.68rem] uppercase tracking-widest text-muted">
              {stations.length} stations · Amen
            </span>
          </div>

          <LiturgyRail stations={stations} doneToday={streak.doneToday} onSeal={markWorship} />
        </section>

        <div className="mt-10 border-t border-border pt-8">
          <Verse
            text="But as for me and my house, we will serve the LORD."
            reference="Joshua 24:15"
          />
        </div>
      </main>
    </>
  );
}
