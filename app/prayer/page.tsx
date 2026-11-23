import type { Metadata } from "next";
import { isGeneral } from "@/lib/voice";
import { myVoice } from "@/lib/voice-server";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getActiveMembership, getPrayerRequests } from "@/lib/data";
import { getReactionsFor } from "@/lib/reactions";
import { SiteHeader } from "@/components/SiteHeader";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { StatCard } from "@/components/ui/StatCard";
import { PageHero } from "@/components/ui/PageHero";
import { EmptyState } from "@/components/ui/EmptyState";
import { FirstStepFocus } from "@/components/ui/FirstStep";
import { Icon } from "@/components/ui/Icon";
import { PrayerForm } from "@/components/prayer/PrayerForm";
import { PrayerCard, type PrayerItem } from "@/components/prayer/PrayerCard";

export async function generateMetadata(): Promise<Metadata> {
  // The tab says the room's name in the reader's own voice — lib/voice.ts.
  const general = (await myVoice()) === "GENERAL";
  return {
    title: general ? "Support" : "Prayer",
    description: general ? "Requests your circle is holding with you." : "Requests your circle is praying against.",
    robots: { index: false },
  };
}

export default async function PrayerPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in?callbackUrl=/prayer");

  const active = await getActiveMembership(session.user.id);
  if (!active) redirect("/onboarding");

  const requests = await getPrayerRequests(active.journey.id, session.user.id);
  const isMother = active.role === "MOTHER";

  // Praying for something and having a word about it are two different things.
  // "Hold to pray" says I carried this; a reaction says I read it and I'm here.
  const reactions = await getReactionsFor(
    "PRAYER",
    requests.map((r) => r.id),
    session.user.id,
  );

  const items: PrayerItem[] = requests.map((r) => ({
    id: r.id,
    title: r.title,
    body: r.body,
    authorName: r.authorName,
    answered: !!r.answeredAt,
    answeredAt: r.answeredAt ? r.answeredAt.toISOString() : null,
    createdAt: r.createdAt.toISOString(),
    prayerCount: r.prayerCount,
    heldCount: r.heldCount,
    didIPray: r.didIPray,
    canManage: r.authorId === session.user.id || isMother,
    mine: r.authorId === session.user.id,
    reactions: reactions[r.id] ?? { counts: {}, mine: [] },
  }));

  const open = items.filter((i) => !i.answered);
  const answered = items.filter((i) => i.answered);
  const timesPrayed = items.reduce((n, i) => n + i.prayerCount, 0);
  // The same room, in plain words, for someone who chose Oyun without
  // religious content — see lib/voice.ts. What people wrote is shown as is.
  const general = isGeneral(session.user.voice);

  return (
    <>
      <SiteHeader active="prayer" />
      <main className="mx-auto max-w-shell px-6 pb-10">
        <PageHero
          eyebrow={general ? "Support" : "Prayer"}
          title="Named, specific, shared."
          lede={
            general
              ? "Bring a real need into the light — a scan, a fear, a decision. Your circle holds it with you by name, and you can tell them how it turned out."
              : "Bring a real need into the light — a scan, a fear, a decision. Your circle prays against it by name, and together you watch for God's answer."
          }
        />

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard label="Open" value={open.length} hint="on the wall now" />
          <StatCard
            label={general ? "Times held" : "Times prayed"}
            value={timesPrayed}
            deltaTone="accent"
            hint={general ? "by your circle" : "offered by your circle"}
          />
          <StatCard label={general ? "Resolved" : "Answered"} value={answered.length} hint={general ? "worth remembering" : "give thanks"} />
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1.3fr_1fr]">
          <div className="min-w-0 space-y-4">
            {open.length === 0 ? (
              <EmptyState
                icon={<Icon name="flame" size={40} />}
                title="Nothing on the wall right now."
                verse={
                  general
                    ? undefined
                    : {
                        text: "In nothing be anxious, but in everything, by prayer and petition with thanksgiving, let your requests be made known to God.",
                        reference: "Philippians 4:6",
                      }
                }
                action={
                  <FirstStepFocus htmlFor="prayer-title">
                    {general ? "Ask them to keep the next appointment in mind" : "Ask them to pray about the next appointment"}
                  </FirstStepFocus>
                }
              >
                Nothing needs to be tidy before you ask. Name the thing that is
                actually on your mind and your circle will carry it by name.
              </EmptyState>
            ) : (
              open.map((item) => <PrayerCard key={item.id} item={item} general={general} />)
            )}

            {answered.length > 0 && (
              <div className="rounded-2xl border border-positive/30 bg-positive/[0.06] p-6">
                <div className="mb-4 flex items-center gap-2 text-positive">
                  <Icon name="sparkles" size={18} />
                  <span className="eyebrow text-positive">
                    {general ? "Resolved — worth remembering" : "Answered — give thanks"}
                  </span>
                </div>
                <div className="space-y-4">
                  {answered.map((item) => (
                    <PrayerCard key={item.id} item={item} general={general} />
                  ))}
                </div>
              </div>
            )}
          </div>

          <Card className="h-fit min-w-0 p-8">
            <Eyebrow className="mb-4">{general ? "Ask for support" : "Ask for prayer"}</Eyebrow>
            <PrayerForm general={general} />
          </Card>
        </div>
      </main>
    </>
  );
}
