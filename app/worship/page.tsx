import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getActiveMembership, getWorshipStreak } from "@/lib/data";
import { computePosition } from "@/lib/stage";
import { familyWorship, hymnaryUrl } from "@/lib/worship";
import {
  READING_PLANS,
  planById,
  planState,
  planPace,
} from "@/lib/reading-plans";
import { getChapter } from "@/lib/bible";
import { shareSlug } from "@/lib/share";
import { hymnSlug } from "@/lib/hymns";
import { isHousehold } from "@/lib/roles";
import {
  markWorship,
  chooseReadingPlan,
  markReadingRead,
  undoReadingRead,
  addReflection,
  updateReflection,
  deleteReflection,
} from "@/app/worship/actions";
import {
  ScriptureJourney,
  type JourneyState,
  type ChapterPayload,
} from "@/components/worship/ScriptureJourney";
import { Reflections, type NoteView } from "@/components/worship/Reflections";
import { SiteHeader } from "@/components/SiteHeader";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Verse } from "@/components/ui/Verse";
import { Pressable } from "@/components/ui/Pressable";
import { Arches, Rays } from "@/components/ui/Marks";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { LiturgyRail, type Station } from "@/components/worship/LiturgyRail";
import { bookBySlug } from "@/lib/bible";
import { bookIntro } from "@/lib/book-intros";

export const metadata: Metadata = {
  title: "Family worship",
  description: "A daily rhythm for your household.",
  robots: { index: false },
};

function isSameUtcDay(a: Date | null | undefined, b: Date): boolean {
  if (!a) return false;
  return (
    a.getUTCFullYear() === b.getUTCFullYear() &&
    a.getUTCMonth() === b.getUTCMonth() &&
    a.getUTCDate() === b.getUTCDate()
  );
}

function formatWhen(d: Date): string {
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function WorshipPage({
  searchParams,
}: {
  searchParams: { track?: string };
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in?callbackUrl=/worship");

  const active = await getActiveMembership(session.user.id);
  if (!active) redirect("/onboarding");
  if (!isHousehold(active.role)) redirect("/journey");
  if (active.journey.status === "LOSS") redirect("/journey");

  const born = computePosition(active.journey.dueDate).born;
  const { liturgy, hymn, catechism, catechismNumber } = familyWorship();
  const streak = await getWorshipStreak(active.journey.id);

  // Scripture Journey — the shared plan (together), or this member's own.
  const { journey, membership } = active;
  const sharedPlan = planById(journey.readingPlanId);
  const myPlan = planById(membership.readingPlanId);
  const requested = searchParams.track;
  const track: "shared" | "me" =
    requested === "me" && myPlan
      ? "me"
      : requested === "shared" && sharedPlan
        ? "shared"
        : myPlan
          ? "me"
          : "shared";
  const plan = track === "me" ? myPlan : sharedPlan;
  const activeProgress =
    track === "me" ? membership.readingProgress : journey.readingProgress;
  const activeUpdatedAt =
    track === "me" ? membership.readingUpdatedAt : journey.readingUpdatedAt;

  const st = plan ? planState(plan, activeProgress) : null;
  const chapterText =
    st && st.next ? await getChapter(st.next.slug, st.next.chapter) : null;
  const readToday = isSameUtcDay(activeUpdatedAt, new Date());

  const otherExists = track === "me" ? !!sharedPlan : !!myPlan;
  const switchTo = otherExists
    ? {
        label:
          track === "me" ? "Follow the shared journey" : "Go to my own journey",
        href: track === "me" ? "/worship?track=shared" : "/worship?track=me",
      }
    : undefined;

  const journeyState: JourneyState | null =
    plan && st
      ? {
          planId: plan.id,
          title: plan.title,
          scope: plan.scope,
          done: st.done,
          total: st.total,
          pct: st.pct,
          finished: st.finished,
          nextRef: st.nextRef,
          readToday,
        }
      : null;
  const chapterPayload: ChapterPayload | null =
    chapterText && st?.nextRef && st.next
      ? {
          ref: st.nextRef,
          verses: chapterText.verses,
          bookName: bookBySlug(st.next.slug)?.name ?? st.next.slug,
          intro: bookIntro(st.next.slug),
        }
      : null;
  const planOptions = READING_PLANS.map((p) => ({
    id: p.id,
    title: p.title,
    blurb: p.blurb,
    scope: p.scope,
    total: p.readings.length,
    pace: planPace(p.readings.length),
  }));

  // Reflections on the current reading — shared with the journey, plus my own
  // private notes.
  const noteViews: NoteView[] =
    st && st.next
      ? (
          await prisma.readingNote.findMany({
            where: {
              journeyId: active.journey.id,
              bookSlug: st.next.slug,
              chapter: st.next.chapter,
              OR: [{ isPrivate: false }, { authorId: session.user.id }],
            },
            include: { author: { select: { id: true, name: true } } },
            orderBy: { createdAt: "asc" },
          })
        ).map((n) => ({
          id: n.id,
          authorName: n.author.name ?? "Someone",
          mine: n.authorId === session.user!.id,
          isPrivate: n.isPrivate,
          body: n.body,
          when: formatWhen(n.createdAt),
        }))
      : [];

  const readSlug = shareSlug(liturgy.read.ref);
  const readShare = readSlug
    ? {
        path: `/v/${readSlug}`,
        title: liturgy.read.ref,
        text: `“${liturgy.read.text}” — ${liturgy.read.ref}`,
      }
    : undefined;

  const stations: Station[] = [
    {
      id: "read",
      icon: "book",
      eyebrow: "Read together",
      verse: { text: liturgy.read.text, ref: liturgy.read.ref },
      share: readShare,
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
      share: {
        path: `/h/${hymnSlug(hymn.title)}`,
        title: hymn.title,
        text: `Singing “${hymn.title}” — ${hymn.line} (${hymn.author}). Sing along in family worship with Oyun.`,
      },
      tone: "accent2",
    },
  ];

  return (
    <>
      <SiteHeader active="worship" />
      <main className="mx-auto max-w-shell px-6 pb-10">
        {/* ── The altar, on a band ──────────────────────────────────────
            The journey's home screen leads with a photograph. This room does
            not, and should not: it is the one place in the app that is not
            about them. A band of amber with the arches drawn across it says
            "set apart" without borrowing a picture, and gives every room that
            is not home a shape of its own rather than a paler copy of it.
            Same composition as Ìdílé's altar, in Oyun's own hue. */}
        <section className="band-1 relative -mx-6 animate-fade-up overflow-hidden px-6 pb-14 pt-8 md:mx-0 md:rounded-3xl">
          <Arches className="on-band" />
          <div className="relative">
            <p className="font-serif text-lg italic opacity-75 on-band">
              Family worship
            </p>
            <h1 className="mt-2 max-w-[15ch] font-serif text-[2.05rem] leading-[1.12] on-band md:max-w-xl md:text-4xl">
              A daily altar in your home.
            </h1>
            <p className="mt-3 max-w-prose prose-serif-sm opacity-80 on-band">
              A few unhurried minutes, walked together — read a little,
              understand a little, pray a little, sing a little. Consistency
              matters more than length.
            </p>
          </div>
        </section>

        {/* The record, straddling the join — the same lifted card, in the
            same place, as the ring on the journey's home screen. It only
            appears once there is something to record: a large "0 of the last
            7" on a first screen is a reprimand, and nothing here reprimands
            anyone. `relative z-10` keeps the band's layers from painting
            over it. */}
        {streak.last7 > 0 && (
          <div className="relative z-10 -mt-9">
            <div className="lift flex items-center gap-4 rounded-[1.4rem] bg-surface p-4">
              <ProgressRing
                progress={Math.min(1, streak.last7 / 7)}
                value={<AnimatedNumber value={streak.last7} />}
                unit="of the last 7"
                size={96}
                stroke={8}
              />
              <div className="min-w-0 flex-1">
                <p className="font-serif text-[1.15rem] leading-tight text-ink">
                  {streak.doneToday
                    ? "Worship kept today"
                    : "The altar is waiting"}
                </p>
                <p className="mt-0.5 font-serif text-[0.86rem] italic text-muted">
                  {streak.last7} of the last seven days kept
                </p>
              </div>
            </div>
          </div>
        )}

        {/* The day's actual action, first. Everything below it is for the
            family that wants more than the evening rhythm. */}
        <section className="mt-8">
          <div className="mb-5">
            <h2 className="font-serif text-xl leading-tight text-ink">
              Today’s liturgy
            </h2>
            <p className="font-serif text-sm italic text-muted">
              {stations.length} stations, and an amen
            </p>
          </div>

          <LiturgyRail stations={stations} doneToday={streak.doneToday} onSeal={markWorship} />
        </section>

        <section className="mt-10">
          <ScriptureJourney
            state={journeyState}
            chapter={chapterPayload}
            plans={planOptions}
            onChoose={chooseReadingPlan}
            onRead={markReadingRead}
            onUndo={undoReadingRead}
            track={track}
            canChooseShared
            scopeLabels={{
              shared: {
                label: "Together",
                blurb: "You and the one beside you, on the same plan.",
              },
              me: {
                label: "Just me",
                blurb: "Your own journey, at your own pace.",
              },
            }}
            switchTo={switchTo}
            sharePath={
              st?.next ? `/v/${st.next.slug}-${st.next.chapter}` : undefined
            }
          />
        </section>

        {/* The journal is reachable from here whatever is being read — a
            journey between plans must never be locked out of reflections it
            has already written. */}
        <div className="mt-4 flex justify-end">
          <Pressable
            href="/journal"
            press="control"
            className="inline-flex min-h-11 items-center rounded-full border border-border px-4 font-serif text-sm text-accent hover:border-accent"
          >
            The reflection journal →
          </Pressable>
        </div>

        {st?.next && st.nextRef && (
          <section className="mt-4">
            <Reflections
              passageRef={st.nextRef}
              bookSlug={st.next.slug}
              chapter={st.next.chapter}
              notes={noteViews}
              onAdd={addReflection}
              onUpdate={updateReflection}
              onDelete={deleteReflection}
            />
          </section>
        )}

        <section className="band-1 relative -mx-6 mt-10 overflow-hidden px-7 py-10 text-center md:mx-0 md:rounded-3xl">
          <Rays className="on-band" />
          <Verse
            onBand
            text="But as for me and my house, we will serve the LORD."
            reference="Joshua 24:15"
          />
        </section>
      </main>
    </>
  );
}
