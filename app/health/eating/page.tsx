import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getActiveMembership } from "@/lib/data";
import { isHousehold } from "@/lib/roles";
import { computePosition } from "@/lib/stage";
import { EATING_SOURCE, EATING_UPDATED, eatingGuide, phaseForWeek, type EatPhase, type EatSection } from "@/lib/eating";
import { SiteHeader } from "@/components/SiteHeader";
import { PageHero } from "@/components/ui/PageHero";
import { HealthTabs } from "@/components/health/HealthTabs";
import { FoodFinder } from "@/components/health/eating/FoodFinder";

export const metadata: Metadata = {
  title: "Eating well",
  description: "What matters at the table each trimester, and a straight answer for each food.",
  robots: { index: false },
};

/**
 * Eating well — lib/eating.ts.
 *
 * A page of words. It reads nothing from the health log and keeps nothing:
 * the only thing it knows about her is how many weeks along she is, which
 * decides which trimester's notes come first. The medical facts are the same
 * for every reader; the one section about fasting is shown only to somebody
 * who chose Oyun with faith.
 */
export default async function EatingPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in?callbackUrl=/health/eating");
  const active = await getActiveMembership(session.user.id);
  if (!active) redirect("/onboarding");
  if (!isHousehold(active.role)) redirect("/journey");

  const journey = active.journey;
  const pos = computePosition(journey.dueDate);
  const phase: EatPhase = journey.status === "LOSS" ? "after-loss" : pos.born ? "after-birth" : phaseForWeek(pos.week);
  const reader = active.role === "MOTHER" ? "MOTHER" : "PARTNER";
  const guide = eatingGuide(phase, reader, session.user.voice, journey.owner.name?.trim() || "her");

  return (
    <>
      <SiteHeader active="health" />
      <main className="mx-auto max-w-3xl px-6 pb-14">
        <PageHero eyebrow="Health" title="Eating well." lede={guide.lede} compact />
        <HealthTabs active="eating" />

        {guide.partnerNote && <p className="mt-6 max-w-prose prose-serif-sm text-muted">{guide.partnerNote}</p>}

        <section aria-labelledby="focus" className="mt-6 rounded-2xl border border-accent/40 bg-accent/[0.05] p-5">
          <p className="eyebrow mb-1 text-accent">{phase === "after-loss" || phase === "after-birth" ? "Now" : "This trimester"}</p>
          <h2 id="focus" className="font-serif text-xl text-ink">
            {guide.focus.title}
          </h2>
          {guide.focus.intro && <p className="mt-1.5 max-w-prose prose-serif-sm text-ink/85">{guide.focus.intro}</p>}
          <Points points={guide.focus.points} />
        </section>

        {guide.showFoods && (
          <section aria-labelledby="foods" className="mt-6 rounded-2xl border border-border bg-surface p-5">
            <h2 id="foods" className="font-serif text-xl text-ink">
              Can I eat this?
            </h2>
            <p className="mb-4 mt-1.5 max-w-prose prose-serif-sm text-muted">
              A straight answer and the reason for it. What you type stays on this phone; it is not sent or kept.
            </p>
            <FoodFinder />
          </section>
        )}

        {guide.plate && <Block s={guide.plate} />}
        {guide.everyday && <Block s={guide.everyday} />}

        {guide.troubles.length > 0 && (
          <section aria-labelledby="troubles" className="mt-6">
            <h2 id="troubles" className="eyebrow mb-3 text-muted">
              When eating is hard
            </h2>
            <div className="space-y-2">
              {guide.troubles.map((t) => (
                <details key={t.key} className="rounded-xl border border-border bg-surface px-4 py-3">
                  <summary className="cursor-pointer prose-serif-sm font-medium text-ink">{t.title}</summary>
                  <Points points={t.points} />
                  {t.key === "sick" && (
                    <p className="mt-2 prose-serif-xs">
                      <Link href="/health/when-to-call" className="text-accent underline underline-offset-4">
                        When to call
                      </Link>
                    </p>
                  )}
                </details>
              ))}
            </div>
          </section>
        )}

        {guide.fasting && <Block s={guide.fasting} />}

        <div className="mt-10 space-y-2 border-t border-border pt-4">
          {guide.closing.map((c) => (
            <p key={c} className="max-w-prose prose-serif-xs text-muted">
              {c}
            </p>
          ))}
          <p className="max-w-prose prose-serif-xs text-muted">
            {EATING_SOURCE} Last gone through {EATING_UPDATED}.
          </p>
        </div>
      </main>
    </>
  );
}

function Points({ points }: { points: string[] }) {
  return (
    <ul className="mt-3 space-y-2">
      {points.map((p) => (
        <li key={p} className="flex gap-2.5 prose-serif-sm text-ink">
          <span aria-hidden className="mt-[0.15em] shrink-0 font-mono text-xs text-muted">
            •
          </span>
          <span>{p}</span>
        </li>
      ))}
    </ul>
  );
}

function Block({ s }: { s: EatSection }) {
  return (
    <section aria-labelledby={`s-${s.key}`} className="mt-6 rounded-2xl border border-border bg-surface p-5">
      <h2 id={`s-${s.key}`} className="font-serif text-xl text-ink">
        {s.title}
      </h2>
      {s.intro && <p className="mt-1.5 max-w-prose prose-serif-sm text-ink/85">{s.intro}</p>}
      <Points points={s.points} />
    </section>
  );
}
