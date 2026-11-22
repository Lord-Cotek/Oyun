import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getActiveMembership } from "@/lib/data";
import { computePosition } from "@/lib/stage";
import { STAGES, type Stage } from "@/lib/journey";
import { SiteHeader } from "@/components/SiteHeader";
import { PageHero } from "@/components/ui/PageHero";
import { WeekMark } from "@/components/journey/WeekMark";
import type { MarkStage } from "@/components/journey/WeekMark";
import { PlayJourney } from "@/components/journey/PlayJourney";
import { SkinTonePicker } from "@/components/journey/SkinTonePicker";
import { toneOf } from "@/lib/growth-scene";
import { isHousehold } from "@/lib/roles";
import { prisma } from "@/lib/prisma";
import { milestoneTitle } from "@/lib/firsts";
import type { PlayMoment } from "@/components/journey/JourneyPlayer";

export const metadata: Metadata = {
  title: "The whole journey",
  description: "Every stage so far, and what changed at each one.",
  robots: { index: false },
};

/**
 * Every stage they have actually lived, newest first.
 *
 * ── Nothing ahead, ever ──────────────────────────────────────────────────
 * This page only ever draws stages that have already happened. Not because
 * a grid of future weeks would spoil anything — though it would — but
 * because Oyun carries families through loss, and a column of empty squares
 * waiting to be filled is the cruellest thing this app could put in front of
 * somebody whose journey stopped. `lived()` below is the whole guard, and it
 * counts forward from the beginning to where they are and then stops.
 *
 * ── Why rows of prose and not a grid of squares ──────────────────────────
 * Because sixty small tiles filling up over two years is a streak wearing a
 * different coat, and this app does not do streaks. A row carrying a mark, a
 * label and a sentence about what changed reads as a record of what happened.
 * A grid of squares reads as a score out of forty. Same data; only one of
 * them is something a family would want to look at in ten years.
 */
export default async function WeeksPage({ searchParams }: { searchParams?: { play?: string } }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in?callbackUrl=/journey/weeks");
  const active = await getActiveMembership(session.user.id);
  if (!active) redirect("/onboarding");

  const { journey } = active;
  // A journey walking through loss has a grief companion, not a timeline.
  if (journey.status === "LOSS") redirect("/journey");

  const position = computePosition(journey.dueDate);
  const entries = lived(
    position.born,
    position.week ?? 0,
    position.month ?? 0,
    journey.babyCount,
  );

  // The family's own firsts, for the player's slider. Household only — the
  // same people who can see them in Firsts.
  const moments: PlayMoment[] = isHousehold(active.role) ? await playMoments(journey.id, journey.dueDate, position.born) : [];

  return (
    <>
      <SiteHeader active="journey" />
      <main className="mx-auto max-w-3xl px-6 pb-10">
        <PageHero
          eyebrow="The whole journey"
          title="Where you have been."
          lede="Every stage you have walked so far, and what changed at each one. Newest first — scroll back towards the beginning."
        />

        <div className="mt-6">
          <PlayJourney
            autoOpen={searchParams?.play === "1"}
            count={journey.babyCount}
            tone={toneOf(journey.skinTone)}
            name={journey.babyName}
            moments={moments}
            entries={[...entries].reverse().map((e) => ({
              label: e.label,
              text: e.stage.newThisStage,
              born: e.mark.born,
              week: e.mark.week,
              month: e.mark.month,
            }))}
          />
          {isHousehold(active.role) && <SkinTonePicker value={toneOf(journey.skinTone)} chosen={!!journey.skinTone} />}
        </div>

        <ol className="mt-8 space-y-3">
          {entries.map((e, i) => (
            <li
              key={e.stage.stage}
              className="flex gap-4 rounded-2xl border border-border bg-surface p-4"
            >
              <div className="shrink-0">
                <WeekMark
                  stage={{ ...e.mark, tone: journey.skinTone }}
                  id={e.stage.stage}
                  detail="thumb"
                  className="h-20 w-20 rounded-xl"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-baseline gap-2">
                  <p className="font-mono text-[0.68rem] uppercase tracking-widest text-muted">
                    {e.label}
                  </p>
                  {i === 0 && (
                    <span className="font-mono text-[0.62rem] uppercase tracking-widest text-accent">
                      Now
                    </span>
                  )}
                </div>
                <p className="prose-serif-sm text-ink">
                  {e.stage.newThisStage}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <p className="mt-8 border-t border-border pt-5 prose-serif-xs text-muted">
          Each picture is drawn from the stage itself, to show growth rather
          than to scale. Nothing here is ahead of you —{" "}
          {entries.length === 1
            ? "this is where you are"
            : `these are the ${entries.length} stages you have walked`}
          .
        </p>
      </main>
    </>
  );
}

interface Entry {
  stage: Stage;
  label: string;
  mark: MarkStage;
}

/**
 * The stages already walked, newest first.
 *
 * Weeks start at 4 because that is where the stages begin describing a body
 * at all, and because the drawn mark is only defined from week 4 up. Once the
 * child has arrived the whole pregnancy stays on the page — it happened — and
 * the months are added after it.
 */
function lived(
  born: boolean,
  week: number,
  month: number,
  count: number,
): Entry[] {
  const byStage = new Map(STAGES.map((s) => [s.stage, s]));
  const out: Entry[] = [];

  const lastWeek = born ? 40 : Math.min(40, Math.max(4, week));
  for (let w = 4; w <= lastWeek; w++) {
    const s = byStage.get(`week-${w}`);
    if (s) {
      out.push({
        stage: s,
        label: `Week ${w}`,
        mark: { born: false, week: w, month: 0, count },
      });
    }
  }

  if (born) {
    for (let m = 0; m <= Math.min(24, Math.max(0, month)); m++) {
      const s = byStage.get(`month-${m}`);
      if (!s) continue;
      out.push({
        stage: s,
        label: m === 0 ? "Newborn" : `Month ${m}`,
        mark: { born: true, week: 40, month: m, count },
      });
    }
  }

  return out.reverse();
}

/**
 * Firsts placed on the journey: before the birth by week, after it by month.
 * The due date becomes the birth day once the birth is recorded, so it is
 * the line between the two. Nothing after today; the birth itself is the
 * player's own moment, so it is left out here.
 */
async function playMoments(journeyId: string, due: Date, born: boolean): Promise<PlayMoment[]> {
  const now = new Date();
  const rows = await prisma.milestone.findMany({
    where: { journeyId, occurredAt: { lte: now }, kind: { not: "BIRTH" } },
    orderBy: { occurredAt: "asc" },
    select: { kind: true, title: true, occurredAt: true },
    take: 40,
  });
  const DAY = 86_400_000;
  const out: PlayMoment[] = [];
  for (const r of rows) {
    const date = r.occurredAt.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
    const title = milestoneTitle(r.kind, r.title);
    if (!born || r.occurredAt < due) {
      const week = 40 - (due.getTime() - r.occurredAt.getTime()) / (7 * DAY);
      if (week < 4) continue;
      out.push({ title, date, born: false, week: Math.min(40, week), month: 0 });
    } else {
      const month = (r.occurredAt.getTime() - due.getTime()) / (30.4375 * DAY);
      out.push({ title, date, born: true, week: 40, month: Math.min(24, Math.max(0, month)) });
    }
  }
  return out;
}
