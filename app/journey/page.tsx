import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  getActiveMembership,
  getLatestMotherCheckIn,
  getOpenNudges,
  getEncouragementsForViewer,
  getSupportSummary,
  getWorshipStreak,
  getCoupleLetters,
} from "@/lib/data";
import { computePosition, gestationLabel } from "@/lib/stage";
import { babySizeFor } from "@/lib/babySize";
import { partnerDailyCare, dayKey } from "@/lib/partner-care";
import { getReactionsFor } from "@/lib/reactions";
import { MOOD_META } from "@/lib/moods";
import { SiteHeader } from "@/components/SiteHeader";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { Verse } from "@/components/ui/Verse";
import { Button } from "@/components/ui/Button";
import { JourneyProgress } from "@/components/JourneyProgress";
import { SupportActions } from "@/components/journey/SupportActions";
import { NudgeList } from "@/components/journey/NudgeList";
import { EncouragementBox } from "@/components/journey/EncouragementBox";
import { CoupleLetters } from "@/components/care/CoupleLetters";
import { BabyLetters } from "@/components/care/BabyLetters";
import { Encouragements } from "@/components/journey/Encouragements";
import { Reactions } from "@/components/Reactions";
import { DailyVerse } from "@/components/journey/DailyVerse";
import { FamilyWorship } from "@/components/journey/FamilyWorship";
import { BirthMoment } from "@/components/journey/BirthMoment";
import { AccountabilityView } from "@/components/journey/AccountabilityView";
import { LamentView } from "@/components/lament/LamentView";
import { LamentPartnerView } from "@/components/lament/LamentPartnerView";

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

  // When a journey is walking through loss, it becomes a grief companion.
  if (journey.status === "LOSS") {
    const me = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { name: true },
    });
    return (
      <>
        <SiteHeader active="journey" />
        {role === "MOTHER" ? (
          <LamentView
            journeyId={journey.id}
            babyName={journey.babyName}
            lossAt={journey.lossAt}
            viewerName={me?.name ?? null}
          />
        ) : (
          <LamentPartnerView
            journeyId={journey.id}
            motherName={journey.owner.name ?? "She"}
          />
        )}
      </>
    );
  }

  const position = computePosition(journey.dueDate);
  const { stage } = position;
  const worship = await getWorshipStreak(journey.id);

  const stageLabel = position.born
    ? `Month ${position.month}`
    : gestationLabel(position.week ?? 0, position.dayInWeek ?? 0);

  if (role === "MOTHER") {
    const [milestoneCount, supporterCount, encouragements, birthRecorded] =
      await Promise.all([
        prisma.milestone.count({ where: { journeyId: journey.id } }),
        prisma.membership.count({
          where: { journeyId: journey.id, role: { in: ["PARTNER", "ACCOUNTABILITY"] } },
        }),
        getEncouragementsForViewer(journey.id, session.user.id),
        prisma.milestone.count({
          where: { journeyId: journey.id, kind: "BIRTH" },
        }),
      ]);

    // Reactions the mother (or others) have left on the words sent to her.
    const encReactions = await getReactionsFor(
      "ENCOURAGEMENT",
      encouragements.map((e) => e.id),
      session.user.id,
    );

    // Offer the birth moment once she's near/past due and hasn't recorded the
    // birth yet — recording it corrects the timeline and starts the nursery.
    const showBirth =
      birthRecorded === 0 && (position.born || position.daysToGo <= 21);

    // Once the little one has arrived, offer to continue in Ìdílé — the sibling
    // app for family discipleship. Loose link only (no shared data); pre-fills
    // the child's name + birthday. Shown only when NEXT_PUBLIC_IDILE_URL is set.
    const idileUrl = process.env.NEXT_PUBLIC_IDILE_URL;
    const idileHandoff =
      idileUrl && position.born
        ? `${idileUrl}/welcome?name=${encodeURIComponent(journey.babyName ?? "")}&born=${encodeURIComponent(journey.dueDate.toISOString().slice(0, 10))}`
        : null;

    // Warm hero details.
    const motherName = journey.owner.name?.trim().split(/\s+/)[0] ?? null;
    const babyLabel = journey.babyName?.trim() || null;
    const sizePhrase = position.born ? null : babySizeFor(position.week ?? 0);
    const ringProgress = position.born
      ? (position.month ?? 0) / 24
      : ((position.week ?? 0) + (position.dayInWeek ?? 0) / 7) / 40;
    const months = position.month ?? 0;
    const heroSubtitle: React.ReactNode = position.born ? (
      `${babyLabel ?? (journey.babyCount > 1 ? "Your little ones" : "Your little one")} — ${months} month${months === 1 ? "" : "s"} into the world. Welcome.`
    ) : sizePhrase ? (
      <>
        {babyLabel ? `${babyLabel} is` : "Your little one is"} about the size of{" "}
        {sizePhrase} this week —{" "}
        <span className="text-ink">fearfully and wonderfully made.</span>
      </>
    ) : (
      <>
        {babyLabel ? `${babyLabel} — ` : ""}a hidden, holy beginning, fearfully
        and wonderfully made.
      </>
    );

    return (
      <>
        <SiteHeader active="journey" />
        <main className="mx-auto max-w-shell px-6 py-10">
          {showBirth && (
            <div className="mb-6 animate-fade-up">
              <BirthMoment babyCount={journey.babyCount} overdue={position.born} />
            </div>
          )}
          <section className="animate-fade-up overflow-hidden rounded-2xl border border-accent/25 bg-gradient-to-br from-accent/[0.10] via-surface to-accent2/[0.09] p-8 md:p-10">
            <div className="flex flex-col-reverse items-start gap-8 md:flex-row md:items-center md:justify-between">
              <div className="min-w-0">
                {motherName && (
                  <p className="mb-3 font-serif text-lg italic text-muted">
                    Hello, {motherName}.
                  </p>
                )}
                <Eyebrow className="mb-3">
                  {position.born ? "Infancy" : "Pregnancy"} · {stageLabel}
                </Eyebrow>
                <h1 className="max-w-2xl font-serif text-4xl leading-tight text-ink md:text-5xl">
                  {stage.title}
                </h1>
                <p className="mt-4 max-w-prose font-mono text-sm leading-relaxed text-muted">
                  {heroSubtitle}
                </p>
              </div>

              <div className="flex flex-col items-center gap-2.5 md:pl-6">
                <ProgressRing
                  progress={ringProgress}
                  value={position.born ? months : position.week ?? 0}
                  unit={position.born ? "months old" : "of 40 weeks"}
                />
                <p className="font-mono text-xs text-muted">
                  {position.born
                    ? journey.babyCount > 1
                      ? "welcome, little ones"
                      : "welcome, little one"
                    : `${position.daysToGo} day${position.daysToGo === 1 ? "" : "s"} to go`}
                </p>
              </div>
            </div>
          </section>

          <div className="mt-6">
            <JourneyProgress progress={position.progress} label={stageLabel} />
          </div>

          <div className="mt-4">
            <DailyVerse />
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-[1.5fr_1fr]">
            <Card className="p-8">
              <Verse text={stage.verse.text} reference={stage.verse.ref} size="lg" />
              <div className="mt-8 space-y-6 border-t border-border pt-6">
                <Block eyebrow="This stage">{stage.body}</Block>
                <Block eyebrow="A reflection">{stage.reflection}</Block>
              </div>
              <div className="mt-7 rounded-xl border border-accent/30 bg-accent/[0.07] p-5">
                <Eyebrow className="mb-2">One thing to do</Eyebrow>
                <p className="font-serif text-xl leading-snug text-ink">
                  {stage.action}
                </p>
              </div>
              <div className="mt-5 border-t border-border pt-5">
                <Eyebrow className="mb-2">Pray</Eyebrow>
                <p className="font-mono text-sm leading-relaxed text-muted">
                  {stage.prayerPoint}
                </p>
              </div>
            </Card>

            <div className="space-y-4">
              {(encouragements.length > 0 || supporterCount > 0) && (
                <Card className="border-accent2/30 bg-accent2/[0.05]">
                  <Encouragements
                    items={encouragements.map((e) => ({
                      id: e.id,
                      body: e.body,
                      verseRef: e.verseRef,
                      createdAt: e.createdAt,
                      authorName: e.author.name,
                      reactions: encReactions[e.id] ?? { counts: {}, mine: [] },
                    }))}
                    emptyHint="When your partner sends you a word of encouragement, it will appear here."
                  />
                </Card>
              )}

              <div className="grid grid-cols-3 gap-3">
                <QuickTile href="/care" label="Care" hint="Your heart" />
                <QuickTile
                  href="/child"
                  label="Nursery"
                  hint={journey.babyCount > 1 ? `${journey.babyCount} profiles` : "Profile"}
                />
                <QuickTile href="/firsts" label="Firsts" hint={`${milestoneCount} kept`} />
              </div>

              {idileHandoff && (
                <Card className="border-accent/30 bg-accent/[0.06]">
                  <Eyebrow className="mb-3">As they grow</Eyebrow>
                  <p className="mb-4 font-mono text-xs leading-relaxed text-muted">
                    Ìdílé — Oyun&rsquo;s sibling — carries the family on through
                    childhood: family worship, catechism, Scripture memory, and
                    shepherding the heart. Bring{" "}
                    {journey.babyName ?? "your little one"} home to start.
                  </p>
                  <Button
                    href={idileHandoff}
                    variant="ghost"
                    className="w-full"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Continue in Ìdílé
                  </Button>
                </Card>
              )}
            </div>
          </div>

          <div className="mt-4">
            <FamilyWorship showCatechism={position.born} streak={worship} />
          </div>
        </main>
      </>
    );
  }

  // ── Accountability partner — a distinct, non-household view ─────────────
  if (role === "ACCOUNTABILITY") {
    return (
      <>
        <SiteHeader active="journey" />
        <AccountabilityView
          journeyId={journey.id}
          userId={session.user.id}
          motherName={journey.owner.name ?? "her"}
          stage={stage}
          stageLabel={stageLabel}
          progress={position.progress}
          born={position.born}
        />
      </>
    );
  }

  // ── Husband / Partner view ─────────────────────────────────────────────
  const [latest, nudges, support, coupleLetters, babyLetters] = await Promise.all([
    getLatestMotherCheckIn(journey.id),
    getOpenNudges(journey.id, session.user.id),
    getSupportSummary(journey.id, session.user.id),
    getCoupleLetters(journey.id, session.user.id),
    prisma.letter.findMany({
      where: { journeyId: journey.id, toBaby: true },
      orderBy: { createdAt: "desc" },
      take: 20,
      include: { author: { select: { id: true, name: true } } },
    }),
  ]);
  const motherName = journey.owner.name ?? "her";
  const mood = latest ? MOOD_META[latest.mood] : null;
  const latestReactions = latest
    ? (await getReactionsFor("CHECKIN", [latest.id], session.user.id))[latest.id]
    : null;
  const care = partnerDailyCare(
    position.born ? "infancy" : "pregnancy",
    dayKey(),
    stage.index,
  );
  const partnerFirst = session.user.name?.trim().split(/\s+/)[0] ?? null;

  return (
    <>
      <SiteHeader active="journey" showCare={false} />
      <main className="mx-auto max-w-shell px-6 py-10">
        <section className="animate-fade-up overflow-hidden rounded-2xl border border-accent/25 bg-gradient-to-br from-accent/[0.10] via-surface to-accent2/[0.09] p-8 md:p-10">
          {partnerFirst && (
            <p className="mb-3 font-serif text-lg italic text-muted">
              Hello, {partnerFirst}.
            </p>
          )}
          <Eyebrow className="mb-3">
            Supporting {motherName} · {stageLabel}
          </Eyebrow>
          <h1 className="max-w-3xl font-serif text-4xl leading-tight text-ink md:text-5xl">
            {stage.title}
          </h1>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-border bg-bg/50 p-6">
              <Eyebrow className="mb-3">How she is</Eyebrow>
              {mood ? (
                <>
                  <p className={`font-serif text-2xl ${MOOD_TONE_TEXT[mood.tone]}`}>
                    {mood.label}
                  </p>
                  <p className="mt-2 font-mono text-xs leading-relaxed text-muted">
                    {latest?.note?.trim() ? `"${latest.note}"` : mood.blurb}
                  </p>
                  {latest && latestReactions && (
                    <div className="mt-4 border-t border-border pt-4">
                      <p className="mb-2 font-mono text-[0.68rem] uppercase tracking-widest text-muted">
                        Let her know you saw
                      </p>
                      <Reactions
                        targetType="CHECKIN"
                        targetId={latest.id}
                        initial={latestReactions}
                      />
                    </div>
                  )}
                </>
              ) : (
                <p className="font-mono text-xs leading-relaxed text-muted">
                  {motherName} hasn&rsquo;t shared a check-in yet. When she does,
                  you&rsquo;ll see how she&rsquo;s doing here — a cue to reach out.
                </p>
              )}
            </div>

            <div className="rounded-xl border border-accent/30 bg-accent/[0.08] p-6">
              <p className="eyebrow mb-2 text-accent">Today — one small thing</p>
              <p className="font-serif text-xl leading-snug text-ink">{care.act}</p>
              {care.ref && (
                <p className="mt-3 font-mono text-[0.68rem] uppercase tracking-widest text-muted">
                  {care.ref}
                </p>
              )}
            </div>
          </div>
        </section>

        <div className="mt-6">
          <JourneyProgress progress={position.progress} label={stageLabel} />
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-4">
            <Card className="border-accent/30 bg-accent/[0.06] p-8">
              <Eyebrow className="mb-3">How to carry her this stage</Eyebrow>
              <p className="font-serif text-xl leading-snug text-ink">
                {stage.partnerFocus}
              </p>
            </Card>

            <Card className="p-8">
              <Eyebrow className="mb-3">Send her a word</Eyebrow>
              <p className="mb-4 font-mono text-xs leading-relaxed text-muted">
                A single sentence of Scripture or encouragement, sent straight to
                her. She&rsquo;ll see it on her journey.
              </p>
              <EncouragementBox toName={motherName} verseRef={stage.verse.ref} />
            </Card>

            <Card className="p-8">
              <Eyebrow className="mb-2">Between the two of you</Eyebrow>
              <p className="mb-5 font-mono text-xs leading-relaxed text-muted">
                Letters just between you and {motherName} — hers to you, and yours
                to her. Private to the two of you.
              </p>
              <CoupleLetters
                letters={coupleLetters.items}
                hasMore={coupleLetters.hasMore}
                viewerId={session.user.id}
                spouseFallback={motherName}
                placeholder={`Write to ${motherName}…`}
              />
            </Card>

            <Card className="p-8">
              <Eyebrow className="mb-2">Letters to your baby</Eyebrow>
              <p className="mb-5 font-mono text-xs leading-relaxed text-muted">
                Write to your little one — a keepsake for the years ahead.{" "}
                {motherName} sees these too, and can add her own.
              </p>
              <BabyLetters
                letters={babyLetters.map((l) => ({
                  id: l.id,
                  body: l.body,
                  createdAt: l.createdAt.toISOString(),
                  authorName: l.author?.name ?? null,
                  authorId: l.authorId,
                }))}
                viewerId={session.user.id}
                placeholder="Dear little one…"
              />
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
            <Card className="p-8">
              <SupportActions
                prayedToday={support.prayedToday}
                reachedOutToday={support.reachedOutToday}
                streak={support.streak}
                prayedLast7={support.prayedLast7}
                motherName={motherName}
              />
            </Card>

            <Card>
              <Eyebrow className="mb-3">This week</Eyebrow>
              <NudgeList
                motherName={motherName}
                nudges={nudges.map((n) => ({
                  id: n.id,
                  text: n.text,
                  dueAt: n.dueAt.toISOString(),
                }))}
              />
            </Card>
          </div>
        </div>

        <div className="mt-4">
          <FamilyWorship showCatechism={position.born} streak={worship} />
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

/** A compact, tappable shortcut tile for the journey rail. */
function QuickTile({
  href,
  label,
  hint,
}: {
  href: string;
  label: string;
  hint: string;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col rounded-xl border border-border bg-surface p-4 transition-colors hover:border-accent/50"
    >
      <span className="font-serif text-lg leading-none text-ink">{label}</span>
      <span className="mt-1.5 font-mono text-[0.64rem] leading-tight text-muted">
        {hint}
      </span>
      <span className="mt-3 font-mono text-[0.64rem] text-accent opacity-0 transition-opacity group-hover:opacity-100">
        Open &rarr;
      </span>
    </Link>
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
