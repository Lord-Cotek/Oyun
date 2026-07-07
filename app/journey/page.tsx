import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  getActiveMembership,
  getLatestMotherCheckIn,
  getOpenNudges,
} from "@/lib/data";
import { computePosition } from "@/lib/stage";
import { MOOD_META } from "@/lib/moods";
import { SiteHeader } from "@/components/SiteHeader";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { StatCard } from "@/components/ui/StatCard";
import { Verse } from "@/components/ui/Verse";
import { Button } from "@/components/ui/Button";
import { JourneyProgress } from "@/components/JourneyProgress";
import { InvitePanel } from "@/components/InvitePanel";

// Static so Tailwind can extract these classes.
const MOOD_TONE_TEXT: Record<string, string> = {
  negative: "text-negative",
  accent2: "text-accent2",
  muted: "text-ink",
  accent: "text-accent",
  positive: "text-positive",
};

export const metadata: Metadata = {
  title: "Journey",
  description: "Where you are today.",
  robots: { index: false },
};

export default async function JourneyPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in?callbackUrl=/journey");

  const active = await getActiveMembership(session.user.id);
  if (!active) return <EmptyState />;

  const { role, journey } = active;
  const position = computePosition(journey.dueDate);
  const { stage } = position;

  const stageLabel = position.born
    ? `Month ${position.month}`
    : `Week ${position.week} of 40`;

  if (role === "MOTHER") {
    const [milestoneCount, supporterCount] = await Promise.all([
      prisma.milestone.count({ where: { journeyId: journey.id } }),
      prisma.membership.count({
        where: { journeyId: journey.id, role: { in: ["PARTNER", "ACCOUNTABILITY"] } },
      }),
    ]);

    return (
      <>
        <SiteHeader active="journey" />
        <main className="mx-auto max-w-shell px-6 py-10">
          <div className="animate-fade-up">
            <Eyebrow className="mb-3">
              {position.born ? "Infancy" : "Pregnancy"} · {stageLabel}
            </Eyebrow>
            <h1 className="max-w-3xl font-serif text-4xl leading-tight text-ink md:text-5xl">
              {stage.title}
            </h1>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <StatCard
              label={position.born ? "Age" : "Week"}
              value={position.born ? position.month : position.week}
              hint={position.born ? "months old" : "of 40 weeks"}
            />
            <StatCard
              label={position.born ? "Since birth" : "Days to go"}
              value={position.born ? "—" : position.daysToGo}
              deltaTone="accent"
              hint={position.born ? "welcome, little one" : "until the due date"}
            />
            <StatCard
              label="Firsts logged"
              value={milestoneCount}
              hint="milestones remembered"
            />
          </div>

          <div className="mt-8">
            <JourneyProgress progress={position.progress} label={stageLabel} />
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
            <Card className="p-8">
              <Verse text={stage.verse.text} reference={stage.verse.ref} size="lg" />
              <div className="mt-8 space-y-6 border-t border-border pt-6">
                <Block eyebrow="This stage">{stage.body}</Block>
                <Block eyebrow="A reflection">{stage.reflection}</Block>
              </div>
            </Card>

            <div className="space-y-4">
              <Card className="border-accent/30 bg-accent/[0.06]">
                <Eyebrow className="mb-3">One thing to do</Eyebrow>
                <p className="font-serif text-xl leading-snug text-ink">
                  {stage.action}
                </p>
              </Card>
              <Card>
                <Eyebrow className="mb-3">Pray</Eyebrow>
                <p className="font-mono text-sm leading-relaxed text-muted">
                  {stage.prayerPoint}
                </p>
              </Card>
              <Card>
                <Eyebrow className="mb-3">Care</Eyebrow>
                <p className="mb-4 font-mono text-xs leading-relaxed text-muted">
                  Log how your heart is today, write a letter, or remember a
                  first.
                </p>
                <Button href="/care" variant="ghost" className="w-full">
                  Open Care
                </Button>
              </Card>
              <Card>
                <InvitePanel hasSupporter={supporterCount > 0} />
              </Card>
            </div>
          </div>
        </main>
      </>
    );
  }

  // ── Partner / Accountability view ──────────────────────────────────────
  const [latest, nudges] = await Promise.all([
    getLatestMotherCheckIn(journey.id),
    getOpenNudges(journey.id, session.user.id),
  ]);
  const motherName = journey.owner.name ?? "her";
  const mood = latest ? MOOD_META[latest.mood] : null;

  return (
    <>
      <SiteHeader active="journey" showCare={false} />
      <main className="mx-auto max-w-shell px-6 py-10">
        <div className="animate-fade-up">
          <Eyebrow className="mb-3">
            Supporting {motherName} · {stageLabel}
          </Eyebrow>
          <h1 className="max-w-3xl font-serif text-4xl leading-tight text-ink md:text-5xl">
            {stage.title}
          </h1>
        </div>

        <div className="mt-8">
          <JourneyProgress progress={position.progress} label={stageLabel} />
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-4">
            <Card className="border-accent/30 bg-accent/[0.06] p-8">
              <Eyebrow className="mb-3">How to carry her this stage</Eyebrow>
              <p className="font-serif text-xl leading-snug text-ink">
                {stage.partnerFocus}
              </p>
            </Card>
            <Card className="p-8">
              <Eyebrow className="mb-3">Pray for her</Eyebrow>
              <p className="font-mono text-sm leading-relaxed text-muted">
                {stage.prayerPoint}
              </p>
              <div className="mt-6 border-t border-border pt-5">
                <Verse text={stage.verse.text} reference={stage.verse.ref} />
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <Eyebrow className="mb-3">Her heart, lately</Eyebrow>
              {mood ? (
                <>
                  <p className={`font-serif text-2xl ${MOOD_TONE_TEXT[mood.tone]}`}>
                    {mood.label}
                  </p>
                  <p className="mt-2 font-mono text-xs leading-relaxed text-muted">
                    {latest?.note?.trim() ? `"${latest.note}"` : mood.blurb}
                  </p>
                </>
              ) : (
                <p className="font-mono text-xs leading-relaxed text-muted">
                  {motherName} hasn&rsquo;t shared a check-in yet. When she does,
                  you&rsquo;ll see how she&rsquo;s doing here — a cue to reach
                  out.
                </p>
              )}
            </Card>

            <Card>
              <Eyebrow className="mb-3">This week</Eyebrow>
              {nudges.length > 0 ? (
                <ul className="space-y-3">
                  {nudges.map((n) => (
                    <li key={n.id} className="flex gap-2.5">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      <div>
                        <p className="font-mono text-sm text-ink">{n.text}</p>
                        <p className="font-mono text-[0.68rem] text-muted">
                          {n.dueAt.toLocaleDateString(undefined, {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="font-mono text-xs leading-relaxed text-muted">
                  No reminders right now. The simplest nudge still holds: check
                  in on {motherName} today.
                </p>
              )}
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}

function Block({
  eyebrow,
  children,
}: {
  eyebrow: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Eyebrow className="mb-2">{eyebrow}</Eyebrow>
      <p className="font-mono text-sm leading-relaxed text-ink/90">{children}</p>
    </div>
  );
}

function EmptyState() {
  return (
    <>
      <SiteHeader active="journey" showCare={false} />
      <main className="mx-auto flex min-h-[70dvh] max-w-shell items-center justify-center px-6">
        <div className="max-w-lg text-center animate-fade-up">
          <Eyebrow className="mb-4">No journey yet</Eyebrow>
          <h1 className="font-serif text-4xl leading-tight text-ink">
            Let&rsquo;s begin where you are.
          </h1>
          <p className="mt-4 font-mono text-sm leading-relaxed text-muted">
            Set your due date — or your baby&rsquo;s birth date if they&rsquo;ve
            already arrived — and Oyun will meet you at the right stage, with
            Scripture, a reflection, and one thing to do.
          </p>
          <div className="mt-8 flex justify-center">
            <Button href="/onboarding">Begin the journey</Button>
          </div>
        </div>
      </main>
    </>
  );
}
