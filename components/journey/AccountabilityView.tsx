import {
  getLatestMotherCheckIn,
  getOpenNudges,
  getSupportSummary,
  ownsJourney,
} from "@/lib/data";
import { getReactionsFor } from "@/lib/reactions";
import { prisma } from "@/lib/prisma";
import { Reactions } from "@/components/Reactions";
import {
  walkStage,
  dailyWalk,
  weeklyWalk,
  STAGE_LABEL,
} from "@/lib/accountability";
import { type Stage } from "@/lib/journey";
import { MOOD_META } from "@/lib/moods";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Verse } from "@/components/ui/Verse";
import { PageHero } from "@/components/ui/PageHero";
import { Icon } from "@/components/ui/Icon";
import Link from "next/link";
import { type Role } from "@prisma/client";
import { supporterFraming } from "@/lib/roles";
import { type FeedPost } from "@/lib/feed-query";
import { LatestFromFamily } from "@/components/feed/LatestFromFamily";
import { JourneyProgress } from "@/components/JourneyProgress";
import { SupportActions } from "@/components/journey/SupportActions";
import { NudgeList } from "@/components/journey/NudgeList";
import { EncouragementBox } from "@/components/journey/EncouragementBox";

const MOOD_TONE_TEXT: Record<string, string> = {
  negative: "text-negative",
  accent2: "text-accent2",
  muted: "text-ink",
  accent: "text-accent",
  positive: "text-positive",
};

/**
 * The home of everyone walking alongside — an accountability partner, a close
 * relative, a dear friend. They see life as the family shares it, they can
 * rejoice and pray, and they can send a word. They never see the household's
 * private rooms (letters, her care journal, family worship).
 *
 * The welcome is shaped by why they came: an accountability partner is here
 * for spiritual friendship, a grandmother is here to see the baby. Same
 * access, same call to pray — different framing.
 */
export async function AccountabilityView({
  journeyId,
  userId,
  role,
  motherName,
  stage,
  stageLabel,
  progress,
  born,
  week,
  month,
  familyPosts = [],
  todayLabel,
}: {
  journeyId: string;
  userId: string;
  role: Role;
  motherName: string;
  stage: Stage;
  stageLabel: string;
  progress: number;
  born: boolean;
  week?: number;
  month?: number;
  familyPosts?: FeedPost[];
  todayLabel?: string;
}) {
  const [latest, nudges, support, me, hasOwnJourney] = await Promise.all([
    getLatestMotherCheckIn(journeyId),
    getOpenNudges(journeyId, userId),
    getSupportSummary(journeyId, userId),
    prisma.user.findUnique({ where: { id: userId }, select: { name: true } }),
    ownsJourney(userId),
  ]);
  const idileUrl = process.env.NEXT_PUBLIC_IDILE_URL;
  const mood = latest ? MOOD_META[latest.mood] : null;
  const latestReactions = latest
    ? (await getReactionsFor("CHECKIN", [latest.id], userId))[latest.id]
    : null;
  const stageKey = walkStage({ born, week, month });
  const today = dailyWalk(stageKey);
  const thisWeek = weeklyWalk(stageKey);
  const firstName = me?.name?.trim().split(/\s+/)[0] ?? null;
  const framing = supporterFraming(role, motherName);

  return (
    <main className="mx-auto max-w-shell px-6 py-10">
      <PageHero
        greeting={firstName ? `Hello, ${firstName}.` : undefined}
        eyebrow={`${framing.eyebrow} · ${stageLabel}`}
        title={framing.title}
      >
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-bg/50 p-6">
            <Eyebrow className="mb-3">How {motherName} is</Eyebrow>
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
                      Let them know you saw
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
                you&rsquo;ll see it here — a cue to reach out.
              </p>
            )}
          </div>

          <div className="rounded-xl border border-accent/30 bg-accent/[0.08] p-6">
            <p className="eyebrow mb-2 text-accent">
              Today · {STAGE_LABEL[stageKey]}
            </p>
            <p className="font-serif text-xl leading-snug text-ink">
              {today.text}
            </p>
            <p className="mt-3 border-t border-accent/20 pt-3 font-mono text-[0.68rem] leading-relaxed text-muted">
              “{today.verse.text}”
              <span className="mt-1 block uppercase tracking-widest text-accent">
                {today.verse.ref}
              </span>
            </p>
          </div>
        </div>
      </PageHero>

      <div className="mt-6">
        <JourneyProgress progress={progress} label={stageLabel} />
      </div>

      <Card className="mt-4 border-accent2/30 bg-accent2/[0.05] p-8">
        <Eyebrow className="mb-3">This week</Eyebrow>
        <p className="font-serif text-xl leading-snug text-ink">
          {thisWeek.text}
        </p>
        <div className="mt-5 border-t border-border pt-5">
          <Verse text={thisWeek.verse.text} reference={thisWeek.verse.ref} />
        </div>
      </Card>

      {/* Life as the family shares it — the reason most people are here. */}
      <div className="mt-6">
        <LatestFromFamily posts={familyPosts} greeting={todayLabel} />
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Link
          href="/life"
          className="surface-premium flex items-center justify-between rounded-2xl border border-border p-5 transition-colors hover:border-accent/50"
        >
          <div>
            <p className="font-serif text-lg text-ink">Life</p>
            <p className="font-mono text-[0.66rem] uppercase tracking-widest text-muted">
              Share, react, and reply
            </p>
          </div>
          <span className="font-mono text-accent">→</span>
        </Link>
        <Link
          href="/prayer"
          className="surface-premium flex items-center justify-between rounded-2xl border border-border p-5 transition-colors hover:border-accent/50"
        >
          <div>
            <p className="font-serif text-lg text-ink">Prayer wall</p>
            <p className="font-mono text-[0.66rem] uppercase tracking-widest text-muted">
              What to carry for them
            </p>
          </div>
          <span className="font-mono text-accent">→</span>
        </Link>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        <div className="min-w-0 space-y-4">
          <Card className="p-8">
            <Eyebrow className="mb-3">Send them a word</Eyebrow>
            <p className="mb-4 font-mono text-xs leading-relaxed text-muted">
              A sentence of Scripture or encouragement, sent to {motherName}. Keep
              pointing them past yourself, to the Lord.
            </p>
            <EncouragementBox toName={motherName} verseRef={stage.verse.ref} />
          </Card>

          <Card className="p-8">
            <Eyebrow className="mb-3">Pray for them</Eyebrow>
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

          {(idileUrl || !hasOwnJourney) && (
            <Card className="border-accent2/30 bg-accent2/[0.05]">
              <Eyebrow className="mb-3">And your own home</Eyebrow>
              <p className="mb-4 font-mono text-xs leading-relaxed text-muted">
                You are carrying someone else&rsquo;s season well. Your own
                family is worth tending too.
              </p>
              <div className="space-y-2">
                {idileUrl && (
                  <a
                    href={idileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between gap-3 rounded-lg border border-border bg-bg px-4 py-3 transition-colors hover:border-accent"
                  >
                    <span className="min-w-0">
                      <span className="block font-serif text-base text-ink">
                        Ìdílé — for your household
                      </span>
                      <span className="block font-mono text-[0.62rem] uppercase tracking-widest text-muted">
                        Family worship, prayer &amp; discipleship
                      </span>
                    </span>
                    <span className="shrink-0 font-mono text-accent">→</span>
                  </a>
                )}
                {!hasOwnJourney && (
                  <Link
                    href="/onboarding"
                    className="flex items-center justify-between gap-3 rounded-lg border border-border bg-bg px-4 py-3 transition-colors hover:border-accent"
                  >
                    <span className="min-w-0">
                      <span className="block font-serif text-base text-ink">
                        Expecting yourself?
                      </span>
                      <span className="block font-mono text-[0.62rem] uppercase tracking-widest text-muted">
                        Start your own journey in Oyun
                      </span>
                    </span>
                    <span className="shrink-0 font-mono text-accent">→</span>
                  </Link>
                )}
              </div>
            </Card>
          )}

          <Card>
            <div className="mb-3 flex items-center gap-2 text-accent">
              <Icon name="church" size={16} />
              <span className="eyebrow">Point them to the Body</span>
            </div>
            <p className="font-mono text-xs leading-relaxed text-muted">
              {born ? "This family" : "This couple"} was made for the church, not
              just for you. Keep encouraging them toward their local congregation,
              their pastor, and the ordinary means of grace.
            </p>
          </Card>
        </div>
      </div>
    </main>
  );
}
