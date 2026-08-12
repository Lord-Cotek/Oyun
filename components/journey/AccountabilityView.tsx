import {
  getLatestMotherCheckIn,
  getOpenNudges,
  getSupportSummary,
} from "@/lib/data";
import { getReactionsFor } from "@/lib/reactions";
import { prisma } from "@/lib/prisma";
import { Reactions } from "@/components/Reactions";
import { dailyAccountabilityPractice } from "@/lib/accountability";
import { type Stage } from "@/lib/journey";
import { MOOD_META } from "@/lib/moods";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Verse } from "@/components/ui/Verse";
import { PageHero } from "@/components/ui/PageHero";
import { Icon } from "@/components/ui/Icon";
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
 * The accountability partner's view — prayer, encouragement, and faithful
 * presence, framed for a spiritual friend rather than a spouse. No household
 * intimacy (no co-parenting instructions, no family-worship rhythm).
 */
export async function AccountabilityView({
  journeyId,
  userId,
  motherName,
  stage,
  stageLabel,
  progress,
  born,
}: {
  journeyId: string;
  userId: string;
  motherName: string;
  stage: Stage;
  stageLabel: string;
  progress: number;
  born: boolean;
}) {
  const [latest, nudges, support, me] = await Promise.all([
    getLatestMotherCheckIn(journeyId),
    getOpenNudges(journeyId, userId),
    getSupportSummary(journeyId, userId),
    prisma.user.findUnique({ where: { id: userId }, select: { name: true } }),
  ]);
  const mood = latest ? MOOD_META[latest.mood] : null;
  const latestReactions = latest
    ? (await getReactionsFor("CHECKIN", [latest.id], userId))[latest.id]
    : null;
  const practice = dailyAccountabilityPractice();
  const firstName = me?.name?.trim().split(/\s+/)[0] ?? null;

  return (
    <main className="mx-auto max-w-shell px-6 py-10">
      <PageHero
        greeting={firstName ? `Hello, ${firstName}.` : undefined}
        eyebrow={`Accountability partner · ${stageLabel}`}
        title={`Walking faithfully alongside ${motherName}.`}
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
            <p className="eyebrow mb-2 text-accent">A way to walk with them today</p>
            <p className="font-serif text-xl leading-snug text-ink">{practice}</p>
          </div>
        </div>
      </PageHero>

      <div className="mt-6">
        <JourneyProgress progress={progress} label={stageLabel} />
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
