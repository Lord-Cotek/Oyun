import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getActiveMembership, getPrayerRequests } from "@/lib/data";
import { SiteHeader } from "@/components/SiteHeader";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
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

  return (
    <>
      <SiteHeader active="prayer" />
      <main className="mx-auto max-w-shell px-6 py-10">
        <div className="animate-fade-up">
          <Eyebrow className="mb-3">Prayer</Eyebrow>
          <h1 className="font-serif text-4xl leading-tight text-ink md:text-5xl">
            Named, specific, shared.
          </h1>
          <p className="mt-4 max-w-prose font-mono text-sm leading-relaxed text-muted">
            Bring a real need into the light — a scan, a fear, a decision. Your
            circle prays against it by name, and together you watch for God&rsquo;s
            answer.
          </p>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-[1.3fr_1fr]">
          <div className="min-w-0 space-y-4">
            {open.length === 0 ? (
              <Card className="p-8">
                <p className="font-mono text-sm leading-relaxed text-muted">
                  No open requests right now. When something is on your heart, ask
                  — no need to carry it silently.
                </p>
              </Card>
            ) : (
              open.map((item) => <PrayerCard key={item.id} item={item} />)
            )}

            {answered.length > 0 && (
              <div className="pt-4">
                <Eyebrow className="mb-3">Answered — give thanks</Eyebrow>
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
