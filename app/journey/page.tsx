import type { Metadata } from "next";
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
  getOnThisDay,
  getUpcoming,
} from "@/lib/data";
import { computePosition, gestationLabel } from "@/lib/stage";
import { setJourneyCover } from "@/app/journey/cover-actions";
import { babySizeFor } from "@/lib/babySize";
import { partnerDailyCare, dayKey } from "@/lib/partner-care";
import { getReactionsFor } from "@/lib/reactions";
import { MOOD_META } from "@/lib/moods";
import { loadFeed } from "@/lib/feed-query";
import { INVITABLE_ROLES, isSupporter, isHousehold } from "@/lib/roles";
import { LatestFromFamily } from "@/components/feed/LatestFromFamily";
import { OnThisDay } from "@/components/journey/OnThisDay";
import { UpcomingStrip } from "@/components/journey/UpcomingStrip";
import { SiteHeader } from "@/components/SiteHeader";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { ComingUp } from "@/components/appointments/ComingUp";
import { getNextFew } from "@/lib/appointments-db";
import { Verse } from "@/components/ui/Verse";
import { Button } from "@/components/ui/Button";
import { ActionTile } from "@/components/ui/ActionTile";
import { Reveal } from "@/components/ui/Reveal";
import { CoverPicker } from "@/components/ui/CoverPicker";
import { Arches, Rays } from "@/components/ui/Marks";
import { JourneyProgress } from "@/components/JourneyProgress";
import { SupportActions } from "@/components/journey/SupportActions";
import { NudgeList } from "@/components/journey/NudgeList";
import { EncouragementBox } from "@/components/journey/EncouragementBox";
import { LettersSummary } from "@/components/care/LettersSummary";
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

  const todayLabel = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  /**
   * Everything this page needs, asked for at once.
   *
   * Only the two lookups above genuinely come first — who is signed in, and
   * which journey they are in. The rest depend on those and on nothing else,
   * yet each used to sit on its own `await`, so the page waited for round-trip
   * after round-trip before rendering anything at all.
   */
  const [familyPosts, memories, upcoming, nextAppointments, worship] =
    await Promise.all([
      // The family feed's newest few, surfaced on the home page.
      loadFeed(journey.id, session.user.id, 3),
      // Keepsakes from earlier years falling on today's date (usually empty).
      getOnThisDay(journey.id),
      // A gentle look-ahead — due date, next month, and (household only) the
      // real appointments in the book.
      getUpcoming(journey.id, session.user.id, journey.dueDate, isHousehold(role)),
      // The next date or two. Supporters see nothing of this: a scan date is
      // health information, not circle news.
      isHousehold(role)
        ? getNextFew(journey.id, session.user.id)
        : Promise.resolve([]),
      getWorshipStreak(journey.id),
    ]);

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

  /**
   * What the hero is made of — the newest photograph anybody on this journey
   * shared. A journey with nothing uploaded yet gets a band of amber instead,
   * which is a deliberate fallback rather than an empty frame.
   */
  const autoPhoto =
    familyPosts.flatMap((p) => p.media).find((m) => m.type === "image")?.url ??
    null;
  const heroPhoto = journey.coverUrl ?? autoPhoto;
  /** What the picker offers — the photographs already on this journey. */
  const coverChoices = Array.from(
    new Set(
      familyPosts
        .flatMap((p) => p.media)
        .filter((m) => m.type === "image")
        .map((m) => m.url),
    ),
  ).slice(0, 18);
  const canSetCover = isHousehold(role);

  const position = computePosition(journey.dueDate);
  const { stage } = position;

  const stageLabel = position.born
    ? `Month ${position.month}`
    : gestationLabel(position.week ?? 0, position.dayInWeek ?? 0);

  if (role === "MOTHER") {
    const [milestoneCount, supporterCount, encouragements, birthRecorded] =
      await Promise.all([
        prisma.milestone.count({ where: { journeyId: journey.id } }),
        prisma.membership.count({
          where: { journeyId: journey.id, role: { in: INVITABLE_ROLES } },
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
        <main className="mx-auto max-w-shell px-6 pb-10">
          {showBirth && (
            <div className="mb-6 animate-fade-up">
              <BirthMoment babyCount={journey.babyCount} overdue={position.born} />
            </div>
          )}
          {/* ── The way in ──────────────────────────────────────────────
              A photograph from this journey, warmed into the palette, in
              place of another surface-coloured card. Same composition as
              Ìdílé's home, in Oyun's own hues — amber and rose where Ìdílé
              has clay and olive. That is the whole sibling arrangement: one
              material, two families of colour.

              Nothing to upload yet gives the amber band instead, shorter. A
              first week should not be the emptiest version of the app. */}
          <section
            className={`band-1 relative -mx-6 animate-fade-up overflow-hidden md:mx-0 md:rounded-3xl ${
              heroPhoto ? "h-[21rem]" : "h-[16rem]"
            }`}
          >
            {heroPhoto && (
              <>
                {/* A background, not an <img>. The photograph here is pure
                    decoration — no information, no alt text — and an <img>
                    whose source has gone (a deleted blob, an expired URL)
                    paints a broken-image icon in the corner of the hero. A
                    background that fails paints nothing, and the band
                    underneath simply shows through. */}
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url("${encodeURI(heroPhoto)}")` }}
                />
                <div className="absolute inset-0 bg-[#2e1f08]/22" />
                <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-[#241806] via-[#2e1f08]/65 to-transparent" />
              </>
            )}
            <Arches className="on-band" />

            {canSetCover && (
              <div className="absolute right-4 top-4 z-10">
                <CoverPicker
                  current={journey.coverUrl ?? null}
                  choices={coverChoices}
                  action={setJourneyCover}
                />
              </div>
            )}

            <div className="absolute inset-x-0 bottom-0 p-6 pb-14">
              {motherName && (
                <p className="font-serif text-lg italic opacity-75 on-band">
                  Hello, {motherName}.
                </p>
              )}
              <p className="mt-1 font-mono text-[0.66rem] uppercase tracking-[0.16em] opacity-70 on-band">
                {position.born ? "Infancy" : "Pregnancy"} · {stageLabel}
              </p>
              <h1 className="mt-2.5 max-w-[16ch] font-serif text-[1.95rem] leading-[1.12] on-band md:max-w-2xl md:text-4xl">
                {stage.title}
              </h1>
            </div>
          </section>

          {/* ── The ring, straddling the join ────────────────────────────
              The emotional centre of this app — a week of forty is real news,
              not a score — so it gets the lifted card that Ìdílé gives to the
              day's worship. Set beside its own words rather than stacked
              above them, which is what let it come off the top of the screen
              without being shrunk to a badge.

              `relative z-10` is load-bearing: a static block paints before a
              positioned one, so without it the hero's scrims paint over this
              card and slice it in half. */}
          <div className="relative z-10 -mt-9">
            <div className="lift flex items-center gap-4 rounded-[1.4rem] bg-surface p-4">
              <ProgressRing
                progress={ringProgress}
                value={position.born ? months : position.week ?? 0}
                unit={position.born ? "months old" : "of 40 weeks"}
                size={96}
                stroke={8}
              />
              <div className="min-w-0 flex-1">
                <p className="prose-serif-sm text-ink">{heroSubtitle}</p>
                <p className="mt-1 font-serif text-[0.86rem] italic text-muted">
                  {position.born
                    ? journey.babyCount > 1
                      ? "welcome, little ones"
                      : "welcome, little one"
                    : `${position.daysToGo} day${position.daysToGo === 1 ? "" : "s"} to go`}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <ComingUp appointments={nextAppointments} />
          </div>

          <div className="mt-6">
            <JourneyProgress progress={position.progress} label={stageLabel} />
          </div>

          {/* Colorful launcher — the journey's app grid */}
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            <Reveal>
              <ActionTile tone={0} href="/worship" label="Worship" hint="Daily altar" icon="flame" />
            </Reveal>
            <Reveal delay={60}>
              <ActionTile tone={1} href="/prayer" label="Prayer" hint="Requests" icon="hands" />
            </Reveal>
            <Reveal delay={120}>
              <ActionTile tone={2} href="/care" label="Care" hint="Your heart" icon="heart" />
            </Reveal>
            <Reveal delay={180}>
              <ActionTile tone={3}
                href="/child"
                label="Nursery"
                hint={journey.babyCount > 1 ? `${journey.babyCount} profiles` : "Profile"}
                icon="star"
              />
            </Reveal>
            <Reveal delay={240}>
              <ActionTile tone={4} href="/firsts" label="Firsts" hint={`${milestoneCount} kept`} icon="sparkles" />
            </Reveal>
            <Reveal delay={300}>
              <ActionTile tone={5} href="/circle" label="Circle" hint="Who’s praying" icon="users" />
            </Reveal>
          </div>

          {upcoming.length > 0 && (
            <div className="mt-6">
              <UpcomingStrip items={upcoming} />
            </div>
          )}

          <div className="mt-6">
            <LatestFromFamily posts={familyPosts} greeting={todayLabel} />
          </div>

          {memories.length > 0 && (
            <div className="mt-6">
              <OnThisDay items={memories} />
            </div>
          )}

          <div className="mt-4">
            <DailyVerse />
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-[1.5fr_1fr]">
            <Card className="overflow-hidden p-8">
              {/* The stage's scripture, on a band that bleeds to the card's
                  own edges. It was set on the same surface as the reflection
                  underneath it, which made the one set-apart thing on the
                  page look like the introduction to a paragraph. */}
              <div className="band-1 relative -mx-8 -mt-8 mb-8 overflow-hidden px-8 py-9 text-center">
                <Rays className="on-band" />
                <Verse
                  onBand
                  text={stage.verse.text}
                  reference={stage.verse.ref}
                  size="lg"
                />
              </div>
              <div className="space-y-6">
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
                <p className="prose-serif-sm text-muted">
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

              {idileHandoff && (
                <Card className="border-accent/30 bg-accent/[0.06]">
                  <Eyebrow className="mb-3">As they grow</Eyebrow>
                  <p className="mb-4 prose-serif-xs text-muted">
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
  if (isSupporter(role)) {
    return (
      <>
        <SiteHeader active="journey" />
        <AccountabilityView
          journeyId={journey.id}
          userId={session.user.id}
          role={role}
          motherName={journey.owner.name ?? "her"}
          stage={stage}
          stageLabel={stageLabel}
          progress={position.progress}
          born={position.born}
          week={position.week}
          month={position.month}
          familyPosts={familyPosts}
          todayLabel={todayLabel}
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
      <main className="mx-auto max-w-shell px-6 pb-10">
        {/* The same way in as the mother sees, from the other side of it.
            A partner opens this app as often as she does, and leaving this
            view on the old surface-coloured card would have meant half the
            household getting the new home screen and half not. */}
        <section
          className={`band-1 relative -mx-6 animate-fade-up overflow-hidden md:mx-0 md:rounded-3xl ${
            heroPhoto ? "h-[21rem]" : "h-[16rem]"
          }`}
        >
          {heroPhoto && (
            <>
              {/* A background, not an <img>. The photograph here is pure
                  decoration — no information, no alt text — and an <img>
                  whose source has gone (a deleted blob, an expired URL)
                  paints a broken-image icon in the corner of the hero. A
                  background that fails paints nothing, and the band
                  underneath simply shows through. */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url("${encodeURI(heroPhoto)}")` }}
              />
              <div className="absolute inset-0 bg-[#2e1f08]/22" />
              <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-[#241806] via-[#2e1f08]/65 to-transparent" />
            </>
          )}
          <Arches className="on-band" />

          {canSetCover && (
            <div className="absolute right-4 top-4 z-10">
              <CoverPicker
                current={journey.coverUrl ?? null}
                choices={coverChoices}
                action={setJourneyCover}
              />
            </div>
          )}

          <div className="absolute inset-x-0 bottom-0 p-6 pb-8">
            {partnerFirst && (
              <p className="font-serif text-lg italic opacity-75 on-band">
                Hello, {partnerFirst}.
              </p>
            )}
            <p className="mt-1 font-mono text-[0.66rem] uppercase tracking-[0.16em] opacity-70 on-band">
              Supporting {motherName} · {stageLabel}
            </p>
            <h1 className="mt-2.5 max-w-[16ch] font-serif text-[1.95rem] leading-[1.12] on-band md:max-w-3xl md:text-4xl">
              {stage.title}
            </h1>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-border bg-surface p-6 md:p-8">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-border bg-bg/50 p-6">
              <Eyebrow className="mb-3">How she is</Eyebrow>
              {mood ? (
                <>
                  <p className={`font-serif text-2xl ${MOOD_TONE_TEXT[mood.tone]}`}>
                    {mood.label}
                  </p>
                  <p className="mt-2 prose-serif-xs text-muted">
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
                <p className="prose-serif-xs text-muted">
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

        {/* The same book she keeps. He is not a visitor to these dates. */}
        <div className="mt-4">
          <ComingUp appointments={nextAppointments} />
        </div>

        {upcoming.length > 0 && (
          <div className="mt-6">
            <UpcomingStrip items={upcoming} />
          </div>
        )}

        <div className="mt-6">
          <LatestFromFamily posts={familyPosts} greeting={todayLabel} />
        </div>

        {memories.length > 0 && (
          <div className="mt-6">
            <OnThisDay items={memories} />
          </div>
        )}

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
              <p className="mb-4 prose-serif-xs text-muted">
                A single sentence of Scripture or encouragement, sent straight to
                her. She&rsquo;ll see it on her journey.
              </p>
              <EncouragementBox toName={motherName} verseRef={stage.verse.ref} />
            </Card>

            <LettersSummary
              viewerId={session.user.id}
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
                babyLetters[0]
                  ? {
                      authorId: babyLetters[0].authorId,
                      authorName: babyLetters[0].author?.name ?? null,
                      body: babyLetters[0].body,
                      createdAtISO: babyLetters[0].createdAt.toISOString(),
                    }
                  : null
              }
            />

            <Card className="p-8">
              <Eyebrow className="mb-3">Pray for her</Eyebrow>
              <p className="prose-serif-sm text-muted">
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
              <Eyebrow className="mb-3">Your reminders</Eyebrow>
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
      <p className="prose-serif-sm text-ink/90">{children}</p>
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
          <p className="mt-4 prose-serif-sm text-muted">
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
