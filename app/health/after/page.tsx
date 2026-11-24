import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getActiveMembership } from "@/lib/data";
import { isHousehold } from "@/lib/roles";
import { computePosition } from "@/lib/stage";
import { AFTER_SOURCE, AFTER_UPDATED, afterGuide, type AfterPhase, type AfterSection } from "@/lib/after-birth";
import { SiteHeader } from "@/components/SiteHeader";
import { PageHero } from "@/components/ui/PageHero";
import { HealthTabs } from "@/components/health/HealthTabs";
import { BabyLog } from "@/components/health/after/BabyLog";

export const metadata: Metadata = {
  title: "After the birth",
  description: "Her recovery in the first weeks, and a log for the baby's feeds and nappies.",
  robots: { index: false },
};

/**
 * After the birth — lib/after-birth.ts.
 *
 * Her recovery, in plain words, for the two of them; and the baby's log,
 * which is the two of theirs to keep. Before the birth it can be read ahead,
 * and the log waits. After a loss there is no log and no word of a baby.
 */
export default async function AfterPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in?callbackUrl=/health/after");
  const active = await getActiveMembership(session.user.id);
  if (!active) redirect("/onboarding");
  if (!isHousehold(active.role)) redirect("/journey");

  const journey = active.journey;
  const pos = computePosition(journey.dueDate);
  const phase: AfterPhase = journey.status === "LOSS" ? "after-loss" : pos.born ? "after-birth" : "before";
  const reader = active.role === "MOTHER" ? "MOTHER" : "PARTNER";
  const guide = afterGuide(phase, reader, session.user.voice, journey.owner.name?.trim() || "her");

  const showLog = phase === "after-birth";
  const [entries, children] = showLog
    ? await Promise.all([
        prisma.babyLog.findMany({
          // Three days back covers "today" and "yesterday" in any time zone.
          where: { journeyId: journey.id, at: { gte: new Date(Date.now() - 3 * 86_400_000) } },
          orderBy: { at: "asc" },
          select: { id: true, kind: true, how: true, childId: true, at: true },
        }),
        prisma.child.findMany({ where: { journeyId: journey.id }, orderBy: [{ birthDate: "asc" }, { createdAt: "asc" }], select: { id: true, name: true } }),
      ])
    : [[], []];

  return (
    <>
      <SiteHeader active="health" />
      <main className="mx-auto max-w-3xl px-6 pb-14">
        <PageHero eyebrow="Health" title={phase === "after-loss" ? "The weeks after." : "After the birth."} lede={guide.lede} compact />
        <HealthTabs active="after" />

        {showLog && (
          <section aria-labelledby="baby-log" className="mt-6 rounded-2xl border border-border bg-surface p-5">
            <h2 id="baby-log" className="font-serif text-xl text-ink">
              Feeds and nappies
            </h2>
            <p className="mb-4 mt-1 prose-serif-xs text-muted">One tap each. Either of you can write them down, and both of you see them.</p>
            <BabyLog
              initial={entries.map((e) => ({ id: e.id, kind: e.kind, how: e.how, childId: e.childId, at: e.at.toISOString() }))}
              babies={children.length > 1 ? children : []}
            />
          </section>
        )}
        {phase === "before" && (
          <p className="mt-6 rounded-xl border border-border bg-surface/60 px-4 py-3 prose-serif-xs text-muted">
            A log for the baby&rsquo;s feeds and nappies opens here once the birth is recorded.
          </p>
        )}

        {guide.partner && <Block s={guide.partner} tone="accent" />}
        {guide.sections.map((s) => (
          <Block key={s.key} s={s} />
        ))}
        <Block s={guide.check} />
        <p className="mt-3 prose-serif-xs">
          <Link href="/appointments" className="text-accent underline underline-offset-4">
            Write your questions in the appointment
          </Link>
        </p>

        {guide.welcome && (
          <section aria-labelledby="welcome" className="mt-6 rounded-2xl border border-accent/40 bg-accent/[0.05] p-5">
            <h2 id="welcome" className="font-serif text-xl text-ink">
              {guide.welcome.title}
            </h2>
            {guide.welcome.verse && (
              <figure className="mt-2 border-l-2 border-accent/50 pl-4">
                <blockquote className="font-serif text-lg leading-relaxed text-ink">&ldquo;{guide.welcome.verse.text}&rdquo;</blockquote>
                <figcaption className="mt-1 font-mono text-[0.62rem] uppercase tracking-widest text-muted">{guide.welcome.verse.ref}</figcaption>
              </figure>
            )}
            <p className="mt-2 max-w-prose prose-serif-sm text-ink/90">{guide.welcome.body}</p>
            <p className="mt-2 prose-serif-xs">
              <Link href={guide.welcome.link.href} className="text-accent underline underline-offset-4">
                {guide.welcome.link.label}
              </Link>
            </p>
          </section>
        )}

        <div className="mt-10 space-y-2 border-t border-border pt-4">
          <p className="max-w-prose prose-serif-xs text-muted">
            {guide.closing}{" "}
            <Link href="/health/when-to-call" className="underline underline-offset-4 hover:text-accent">
              When to call
            </Link>
          </p>
          <p className="max-w-prose prose-serif-xs text-muted">
            {AFTER_SOURCE} Last gone through {AFTER_UPDATED}. This page is general; your own midwife or doctor&rsquo;s advice comes first.
          </p>
        </div>
      </main>
    </>
  );
}

function Block({ s, tone }: { s: AfterSection; tone?: "accent" }) {
  return (
    <section
      aria-labelledby={`a-${s.key}`}
      className={`mt-6 rounded-2xl border p-5 ${tone === "accent" ? "border-accent/40 bg-accent/[0.05]" : "border-border bg-surface"}`}
    >
      <h2 id={`a-${s.key}`} className="font-serif text-xl text-ink">
        {s.title}
      </h2>
      {s.intro && <p className="mt-1.5 max-w-prose prose-serif-sm text-ink/85">{s.intro}</p>}
      <ul className="mt-3 space-y-2">
        {s.points.map((p) => (
          <li key={p} className="flex gap-2.5 prose-serif-sm text-ink">
            <span aria-hidden className="mt-[0.15em] shrink-0 font-mono text-xs text-muted">
              •
            </span>
            <span>{p}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
