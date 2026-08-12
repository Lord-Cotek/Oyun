import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getActiveMembership, getPrayerRequests } from "@/lib/data";
import { SiteHeader } from "@/components/SiteHeader";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { StatCard } from "@/components/ui/StatCard";
import { PageHero } from "@/components/ui/PageHero";
import { EmptyState } from "@/components/ui/EmptyState";
import { Icon } from "@/components/ui/Icon";
import { PrayerForm } from "@/components/prayer/PrayerForm";
import { PrayerCard, type PrayerItem } from "@/components/prayer/PrayerCard";

export const metadata: Metadata = {
  title: "Prayer",
  description: "Requests your circle is praying against.",
  robots: { index: false },
};

export default async function PrayerPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in?callbackUrl=/prayer");

  const active = await getActiveMembership(session.user.id);
  if (!active) redirect("/onboarding");

  const requests = await getPrayerRequests(active.journey.id, session.user.id);
  const isMother = active.role === "MOTHER";

  const items: PrayerItem[] = requests.map((r) => ({
    id: r.id,
    title: r.title,
    body: r.body,
    authorName: r.authorName,
    answered: !!r.answeredAt,
    answeredAt: r.answeredAt ? r.answeredAt.toISOString() : null,
    createdAt: r.createdAt.toISOString(),
    prayerCount: r.prayerCount,
    didIPray: r.didIPray,
    canManage: r.authorId === session.user.id || isMother,
  }));

  const open = items.filter((i) => !i.answered);
  const answered = items.filter((i) => i.answered);
  const timesPrayed = items.reduce((n, i) => n + i.prayerCount, 0);

  return (
    <>
      <SiteHeader active="prayer" />
      <main className="mx-auto max-w-shell px-6 py-10">
        <PageHero
          eyebrow="Prayer"
          title="Named, specific, shared."
          lede="Bring a real need into the light — a scan, a fear, a decision. Your circle prays against it by name, and together you watch for God's answer."
        />

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <StatCard label="Open" value={open.length} hint="on the wall now" />
          <StatCard
            label="Times prayed"
            value={timesPrayed}
            deltaTone="accent"
            hint="offered by your circle"
          />
          <StatCard label="Answered" value={answered.length} hint="give thanks" />
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1.3fr_1fr]">
          <div className="min-w-0 space-y-4">
            {open.length === 0 ? (
              <EmptyState
                icon={<Icon name="flame" size={40} />}
                title="Nothing on the wall right now."
                verse={{
                  text: "Do not be anxious about anything, but in everything by prayer and petition, present your requests to God.",
                  reference: "Philippians 4:6",
                }}
              >
                When something is on your heart, ask — no need to carry it
                silently. Your circle is ready to pray.
              </EmptyState>
            ) : (
              open.map((item) => <PrayerCard key={item.id} item={item} />)
            )}

            {answered.length > 0 && (
              <div className="rounded-2xl border border-positive/30 bg-positive/[0.06] p-6">
                <div className="mb-4 flex items-center gap-2 text-positive">
                  <Icon name="sparkles" size={18} />
                  <span className="eyebrow text-positive">
                    Answered — give thanks
                  </span>
                </div>
                <div className="space-y-4">
                  {answered.map((item) => (
                    <PrayerCard key={item.id} item={item} />
                  ))}
                </div>
              </div>
            )}
          </div>

          <Card className="h-fit min-w-0 p-8">
            <Eyebrow className="mb-4">Ask for prayer</Eyebrow>
            <PrayerForm />
          </Card>
        </div>
      </main>
    </>
  );
}
