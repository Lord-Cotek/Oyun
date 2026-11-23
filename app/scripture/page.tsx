import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getActiveMembership } from "@/lib/data";
import { isHousehold } from "@/lib/roles";
import { READING_PLANS, planById, planState, planPace } from "@/lib/reading-plans";
import { bookBySlug, getChapter } from "@/lib/bible";
import { bookIntro } from "@/lib/book-intros";
import { chooseReadingPlan, markReadingRead, undoReadingRead, addReflection, updateReflection, deleteReflection } from "@/app/worship/actions";
import { ScriptureJourney, type JourneyState, type ChapterPayload } from "@/components/worship/ScriptureJourney";
import { Reflections, type NoteView } from "@/components/worship/Reflections";
import { SiteHeader } from "@/components/SiteHeader";
import { PageHero } from "@/components/ui/PageHero";
import { Verse } from "@/components/ui/Verse";

export const metadata: Metadata = {
  title: "Scripture Journey",
  description: "A chapter a day through the Bible, and what it said to you.",
  robots: { index: false },
};

const isSameUtcDay = (a: Date | null | undefined, b: Date) =>
  !!a && a.getUTCFullYear() === b.getUTCFullYear() && a.getUTCMonth() === b.getUTCMonth() && a.getUTCDate() === b.getUTCDate();
const formatWhen = (d: Date) => d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

/**
 * Scripture Journey: the reading plan, today's chapter, the reflections on
 * it, and the way into the journal — a room of its own.
 *
 * It used to sit in full on the Worship page under the prayer list, and a
 * family praying for many people found its Bible reading pushed half a screen
 * down every day. Worship keeps a small card pointing here (ScriptureCard),
 * straight after the day's liturgy.
 *
 * The rules are the ones the Worship page had, unchanged: the shared plan
 * only for mum and her partner; everyone else has their own; the circle sees
 * its own reflections and never the family's.
 */
export default async function ScripturePage({ searchParams }: { searchParams: { track?: string } }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in?callbackUrl=/scripture");
  const active = await getActiveMembership(session.user.id);
  if (!active) redirect("/onboarding");

  const { journey, membership } = active;
  // Mum and her partner share a "together" plan; the circle has its own.
  const canMark = isHousehold(active.role);

  // The shared plan, or this member's own; ?track= switches.
  const sharedPlan = canMark ? planById(journey.readingPlanId) : null;
  const myPlan = planById(membership.readingPlanId);
  const requested = searchParams.track;
  const track: "shared" | "me" = !canMark
    ? "me"
    : requested === "me" && myPlan
      ? "me"
      : requested === "shared" && sharedPlan
        ? "shared"
        : myPlan
          ? "me"
          : "shared";
  const plan = track === "me" ? myPlan : sharedPlan;
  const activeProgress = track === "me" ? membership.readingProgress : journey.readingProgress;
  const activeUpdatedAt = track === "me" ? membership.readingUpdatedAt : journey.readingUpdatedAt;

  const st = plan ? planState(plan, activeProgress) : null;
  const chapterText = st && st.next ? await getChapter(st.next.slug, st.next.chapter) : null;
  const readToday = isSameUtcDay(activeUpdatedAt, new Date());

  const otherExists = track === "me" ? !!sharedPlan : !!myPlan;
  const switchTo = otherExists
    ? { label: track === "me" ? "Follow the shared journey" : "Go to my own journey", href: track === "me" ? "/scripture?track=shared" : "/scripture?track=me" }
    : undefined;

  const journeyState: JourneyState | null =
    plan && st ? { planId: plan.id, title: plan.title, scope: plan.scope, done: st.done, total: st.total, pct: st.pct, finished: st.finished, nextRef: st.nextRef, readToday } : null;
  const chapterPayload: ChapterPayload | null =
    chapterText && st?.nextRef && st.next
      ? { ref: st.nextRef, verses: chapterText.verses, bookName: bookBySlug(st.next.slug)?.name ?? st.next.slug, intro: bookIntro(st.next.slug) }
      : null;
  const planOptions = READING_PLANS.map((p) => ({ id: p.id, title: p.title, blurb: p.blurb, scope: p.scope, total: p.readings.length, pace: planPace(p.readings.length) }));

  // Reflections on today's chapter: the two of them share theirs; the
  // circle sees only its own.
  const [notes, myReflections] = await Promise.all([
    st && st.next
      ? prisma.readingNote.findMany({
          where: {
            journeyId: journey.id,
            bookSlug: st.next.slug,
            chapter: st.next.chapter,
            ...(canMark ? { OR: [{ isPrivate: false }, { authorId: session.user.id }] } : { authorId: session.user.id }),
          },
          include: { author: { select: { id: true, name: true } } },
          orderBy: { createdAt: "asc" },
        })
      : Promise.resolve([]),
    prisma.readingNote.count({ where: { journeyId: journey.id, authorId: session.user.id } }),
  ]);
  const noteViews: NoteView[] = notes.map((n) => ({
    id: n.id,
    authorName: n.author.name ?? "Someone",
    mine: n.authorId === session.user!.id,
    isPrivate: n.isPrivate,
    body: n.body,
    when: formatWhen(n.createdAt),
  }));

  return (
    <>
      <SiteHeader active="scripture" />
      <main className="mx-auto max-w-shell px-6 pb-10">
        <PageHero
          eyebrow="Scripture Journey"
          title="A chapter a day."
          lede="Walk through the Bible at your own pace — alone, or together with the one beside you — and write down what each chapter said to you."
        />

        <section className="mt-8">
          <ScriptureJourney
            state={journeyState}
            chapter={chapterPayload}
            plans={planOptions}
            onChoose={chooseReadingPlan}
            onRead={markReadingRead}
            onUndo={undoReadingRead}
            track={track}
            canChooseShared={canMark}
            scopeLabels={{
              shared: { label: "Together", blurb: "You and the one beside you, on the same plan." },
              me: { label: canMark ? "Just me" : "Your journey", blurb: "Your own journey, at your own pace." },
            }}
            switchTo={switchTo}
            sharePath={st?.next ? `/v/${st.next.slug}-${st.next.chapter}` : undefined}
          />
        </section>

        {st?.next && st.nextRef && (
          <section className="mt-6">
            <Reflections
              passageRef={st.nextRef}
              bookSlug={st.next.slug}
              chapter={st.next.chapter}
              notes={noteViews}
              privateOnly={!canMark}
              onAdd={addReflection}
              onUpdate={updateReflection}
              onDelete={deleteReflection}
            />
          </section>
        )}

        {/* The journal is reachable whatever is being read — a family between
            plans must never be locked out of what it has already written. */}
        <Link href="/journal" className="mt-6 flex items-center justify-between gap-4 rounded-2xl border border-border bg-surface p-5 hover:border-accent">
          <span>
            <span className="block font-serif text-lg text-ink">The reflection journal</span>
            <span className="block prose-serif-xs text-muted">
              {myReflections > 0 ? `Everything you have written as you read — ${myReflections} ${myReflections === 1 ? "reflection" : "reflections"} so far.` : "Everything you write as you read, kept in one place."}
            </span>
          </span>
          <span className="font-mono text-sm text-accent">→</span>
        </Link>

        <p className="mt-6 text-center prose-serif-xs text-muted">
          Today&rsquo;s liturgy and the people you pray for are in{" "}
          <Link href="/worship" className="text-accent underline underline-offset-4">Worship</Link>.
        </p>

        <section className="mt-10">
          <Verse text="Your word is a lamp to my feet, and a light for my path." reference="Psalm 119:105" />
        </section>
      </main>
    </>
  );
}
