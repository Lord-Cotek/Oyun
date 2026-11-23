import type { Metadata } from "next";
import { appointmentTitle } from "@/lib/appointments";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  getActiveMembership,
  getWorshipStreak,
  getOwnWorshipStreak,
} from "@/lib/data";
import { computePosition } from "@/lib/stage";
import { familyWorship, hymnaryUrl } from "@/lib/worship";
import { griefWorship } from "@/lib/grief-liturgy";
import { planById, planState } from "@/lib/reading-plans";
import { shareSlug } from "@/lib/share";
import { hymnSlug } from "@/lib/hymns";
import { isHousehold } from "@/lib/roles";
import {
  markWorship,
  markOwnWorship,
} from "@/app/worship/actions";
import { ScriptureCard } from "@/components/worship/ScriptureCard";
import { SiteHeader } from "@/components/SiteHeader";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Verse } from "@/components/ui/Verse";
import { Arches, Rays } from "@/components/ui/Marks";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { LiturgyRail, type Station } from "@/components/worship/LiturgyRail";
import { PrayingFor } from "@/components/worship/PrayingFor";
import { prayingScope } from "@/lib/praying-scope";
import { loadPrayingFor } from "@/lib/praying-for-db";
import {
  addPrayingFor,
  answerPrayingFor,
  editPrayingFor,
  removePrayingFor,
  resumePrayingFor,
  stopPrayingFor,
} from "@/app/worship/praying-actions";

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

export default async function WorshipPage({
  searchParams,
}: {
  searchParams: { track?: string };
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in?callbackUrl=/worship");

  const active = await getActiveMembership(session.user.id);
  if (!active) redirect("/onboarding");

  /**
   * After a loss, nobody is turned away.
   *
   * This room used to close for everyone: the circle got nothing at all,
   * and the family were sent to the lament companion on their home screen
   * and no further. The worry was that a liturgy about a coming baby would
   * wound them, which was true of those particular words and not of the
   * room — grief is not a reason to stop drawing near to God, it is most of
   * the reason the psalms exist.
   *
   * So the words change instead. Everyone here reads the same passage on
   * the same day; the prayer and the thing for today are written twice,
   * once for the two people it happened to and once for those standing
   * beside them. See lib/grief-liturgy.
   */
  const grieving = active.journey.status === "LOSS";

  /**
   * Whose altar this is.
   *
   * ── Why the circle is here at all now ────────────────────────────────────
   * This room used to turn everyone but the two of them away, which meant a
   * grandmother invited into a circle got the photographs and the prayer
   * list and none of the daily rhythm the app is actually built around. She
   * lost the best of it for no reason: her own morning is her own business,
   * and nothing about it needs to touch theirs.
   *
   * ── And why almost nothing below is shared ───────────────────────────────
   * The liturgy is the same, deliberately — the circle prays the day the
   * family prays. Everything that is a *record* is separate: her own kept
   * days, her own reading plan, her own reflections. She never writes to
   * the family's, never reads the family's, and the server actions enforce
   * that on their own rather than trusting this page to hide a button.
   */
  const keeper = isHousehold(active.role);

  // This family's own week, for "Pray together": the open prayer requests
  // everyone here can already see on the prayer wall, and — for the two of
  // them only, because a scan date is health information — the next seven
  // days' appointments.
  const weekAhead = new Date(Date.now() + 7 * 86_400_000);
  const [openRequests, weekAppointments] = await Promise.all([
    prisma.prayerRequest.findMany({
      where: { journeyId: active.journey.id, answeredAt: null },
      orderBy: { createdAt: "desc" },
      take: 4,
      select: { title: true },
    }),
    // Never after a loss: a leftover scan date is the last thing to name here.
    keeper && active.journey.status === "ACTIVE"
      ? prisma.appointment.findMany({
          where: { journeyId: active.journey.id, cancelledAt: null, at: { gte: new Date(), lte: weekAhead } },
          orderBy: { at: "asc" },
          take: 3,
          select: { kind: true, title: true, at: true },
        })
      : Promise.resolve([]),
  ]);
  // The people this family prays for by name — see lib/praying-for.ts. A
  // few each day in "Pray together", everyone in turn.
  const scope = await prayingScope();
  const [praying, familyNames] = await Promise.all([
    scope ? loadPrayingFor(scope) : null,
    scope?.canKeep ? Promise.all([
          prisma.child.findMany({ where: { journeyId: active.journey.id }, select: { name: true } }),
          prisma.membership.findMany({ where: { journeyId: active.journey.id }, select: { user: { select: { name: true } } } }),
        ]).then(([kids, people]) =>
          Array.from(
            new Set(
              [...kids.map((k) => k.name), active.journey.babyName ?? "", ...people.map((m) => m.user.name ?? "")]
                .map((n) => n.trim())
                .filter(Boolean),
            ),
          ),
        ) : Promise.resolve([] as string[]),
  ]);
  const prayPoints = [
    ...openRequests.map((r) => r.title),
    ...weekAppointments.map(
      (a) => `${appointmentTitle(a.kind, a.title)} — ${a.at.toLocaleDateString("en-GB", { weekday: "long", timeZone: "UTC" })}`,
    ),
  ];
  // Only used to address the circle warmly. A journey whose owner never set a
  // name gets a phrase rather than a blank or a guess.
  const motherName = active.journey.owner?.name?.trim() || "the family";

  const born = computePosition(active.journey.dueDate).born;
  const { liturgy, hymn, catechism, catechismNumber } = familyWorship();
  const grief = grieving
    ? griefWorship(keeper ? "bereaved" : "beside")
    : null;
  const streak = keeper
    ? await getWorshipStreak(active.journey.id)
    : await getOwnWorshipStreak(session.user.id);

  // Scripture Journey — the shared plan (together), or this member's own.
  const { journey, membership } = active;
  // The family's plan is not offered to the circle at all — not hidden behind
  // a disabled control, not read and then discarded. Somebody in the circle
  // has one track, their own, and `track` below can only ever be "me".
  const sharedPlan = keeper ? planById(journey.readingPlanId) : null;
  const myPlan = planById(membership.readingPlanId);
  const requested = searchParams.track;
  const track: "shared" | "me" = !keeper
    ? "me"
    : requested === "me" && myPlan
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
  const readToday = isSameUtcDay(activeUpdatedAt, new Date());
  // The Scripture Journey itself lives on its own page now (app/scripture);
  // here it is a small card after the liturgy — see ScriptureCard.
  const myReflections = await prisma.readingNote.count({ where: { journeyId: active.journey.id, authorId: session.user.id } });

  const readSlug = shareSlug(liturgy.read.ref);
  const readShare = readSlug
    ? {
        path: `/v/${readSlug}`,
        title: liturgy.read.ref,
        text: `“${liturgy.read.text}” — ${liturgy.read.ref}`,
      }
    : undefined;

  /**
   * The circle's stations when a journey has ended in loss.
   *
   * Five, and two of them are different in kind. "Pray for them" rather than
   * "pray together", because this person is interceding for a grief that is
   * not theirs and often doing it alone. And "carry", which is the one thing
   * this page exists for: the honest problem around a bereaved family is not
   * unwillingness but not knowing what to do, so every day names one small
   * concrete act that asks the family for nothing.
   *
   * No catechism — that station belongs to children in a home — and nothing
   * anywhere that offers an explanation.
   */
  const griefStations: Station[] = grief
    ? [
        {
          id: "read",
          icon: "book",
          eyebrow: "Read",
          verse: { text: grief.lament.text, ref: grief.lament.ref },
          share: (() => {
            const slug = shareSlug(grief.lament.ref);
            return slug
              ? {
                  path: `/v/${slug}`,
                  title: grief.lament.ref,
                  text: `“${grief.lament.text}” — ${grief.lament.ref}`,
                }
              : undefined;
          })(),
        },
        {
          id: "reflect",
          icon: "sparkles",
          eyebrow: "Reflect",
          body: grief.lament.reflection,
        },
        {
          id: "pray",
          icon: "flame",
          // The bereaved are not interceding for anybody; it would be a
          // strange thing to tell a mother to pray for herself by name.
          eyebrow: keeper ? "Pray" : `Pray for ${motherName}`,
          body: grief.station.pray,
        },
        {
          id: "carry",
          icon: "message",
          eyebrow: keeper ? "For today" : "Carry this today",
          title: grief.station.carry,
          note: keeper
            ? "One thing, and it is a permission rather than a task. There is nothing here you can fail at today."
            : "One small thing, today, that asks nothing of them. Grieving people rarely have the strength to ask \u2014 so do not wait to be asked.",
        },
        {
          id: "sing",
          icon: "music",
          eyebrow: "Sing",
          title: grief.hymn.title,
          body: `“${grief.hymn.line}”`,
          author: grief.hymn.author,
          lyrics: grief.hymn.lyrics,
          link: { href: hymnaryUrl(grief.hymn.title), label: "Listen on Hymnary" },
          tone: "accent2",
        },
      ]
    : [];

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
      points: [
        { heading: "Today, by name", items: praying?.tonightLines ?? [] },
        { heading: "Give thanks", items: praying?.thanksLines ?? [] },
        { heading: "And today, for this family", items: prayPoints },
      ],
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
              {grieving
                ? keeper
                  ? "Worship, in grief"
                  : "Standing with them"
                : keeper
                  ? "Family worship"
                  : "Daily worship"}
            </p>
            <h1 className="mt-2 max-w-[15ch] font-serif text-[2.05rem] leading-[1.12] on-band md:max-w-xl md:text-4xl">
              {grieving
                ? keeper
                  ? "Draw near anyway."
                  : "Stay with them."
                : keeper
                  ? "A daily altar in your home."
                  : "A daily altar in your own home."}
            </h1>
            <p className="mt-3 max-w-prose prose-serif-sm opacity-80 on-band">
              {grieving
                ? keeper
                  ? "Nothing here will mend it and nothing here will explain it. But the door to God has not shut, and you do not have to arrive composed. A passage, a prayer you can borrow when you have none of your own, and one thing for today that you cannot fail at."
                  : `${motherName} has lost their child. There is nothing here that will mend it and nothing that will explain it. What there is: the passage they are reading today, a prayer to carry them to God, and one small thing you can do before the day is out.`
                : keeper
                  ? "A few unhurried minutes, walked together — read a little, understand a little, pray a little, sing a little. Consistency matters more than length."
                  : `The same words ${motherName} is praying today, wherever you are. Read a little, pray a little, sing a little — and carry them with you while you do.`}
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
                    ? keeper
                      ? "Worship kept today"
                      : "Kept today"
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
              {grieving
                ? keeper
                  ? "Today"
                  : "Today, for them"
                : "Today’s liturgy"}
            </h2>
            <p className="font-serif text-sm italic text-muted">
              {(grieving ? griefStations : stations).length} stations, and an amen
            </p>
          </div>

          {/* Same rail, different book. A keeper's amen goes on the family's
              record; the circle's goes on their own — see markOwnWorship. */}
          <LiturgyRail
            stations={grieving ? griefStations : stations}
            doneToday={streak.doneToday}
            onSeal={keeper ? markWorship : markOwnWorship}
            sealPrompt={
              grieving
                ? keeper
                  ? "When you have said what you can say, seal the day. Showing up counts, even when it was all you managed."
                  : "When you have prayed for them, seal the day — and come back tomorrow. Staying is the gift."
                : undefined
            }
          />
        </section>

        {/* Scripture Journey has its own page; this keeps it one tap away,
            above the prayer list so a long list never pushes it down. */}
        <div className="mt-6">
          <ScriptureCard
            plan={plan?.title ?? null}
            nextRef={st?.nextRef ?? null}
            pct={st?.pct ?? 0}
            done={st?.done ?? 0}
            total={st?.total ?? 0}
            readToday={readToday}
            finished={!!st?.finished}
            reflections={myReflections}
          />
        </div>

        {praying && scope && (scope.canKeep || praying.views.length > 0) && (
          <section className="mt-6" id="praying-for">
            <PrayingFor
              items={praying.views}
              suggestions={familyNames}
              canKeep={scope.canKeep}
              circleWord="the circle"
              onAdd={addPrayingFor}
              onEdit={editPrayingFor}
              onAnswer={answerPrayingFor}
              onStop={stopPrayingFor}
              onResume={resumePrayingFor}
              onRemove={removePrayingFor}
            />
          </section>
        )}

        <section className="band-1 relative -mx-6 mt-10 overflow-hidden px-7 py-10 text-center md:mx-0 md:rounded-3xl">
          <Rays className="on-band" />
          {/* The closing word. "Me and my house" is the right note for a
              household keeping its own altar and the wrong one entirely for
              somebody standing outside a house that has just lost a child. */}
          {grieving ? (
            keeper ? (
              <Verse
                onBand
                text="Trust in him at all times, you people. Pour out your heart before him. God is a refuge for us."
                reference="Psalm 62:8"
              />
            ) : (
              <Verse
                onBand
                text="Rejoice with those who rejoice. Weep with those who weep."
                reference="Romans 12:15"
              />
            )
          ) : (
            <Verse
              onBand
              text="But as for me and my house, we will serve the LORD."
              reference="Joshua 24:15"
            />
          )}
        </section>
      </main>
    </>
  );
}
