import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getActiveMembership } from "@/lib/data";
import { isHousehold } from "@/lib/roles";
import { computePosition } from "@/lib/stage";
import {
  CALL_SOURCE,
  CALL_UPDATED,
  HELPLINE_DIRECTORY,
  phoneParts,
  whenToCall,
  type CallGroup,
  type CallPhase,
  type CallTone,
} from "@/lib/when-to-call";
import { SiteHeader } from "@/components/SiteHeader";
import { PageHero } from "@/components/ui/PageHero";
import { HealthTabs } from "@/components/health/HealthTabs";

export const metadata: Metadata = {
  title: "When to call",
  description: "The signs in pregnancy and after a birth that should not wait.",
  robots: { index: false },
};

const TONE: Record<CallTone, { box: string; label: string; chip: string; mark: string }> = {
  now: {
    box: "border-negative/60 bg-negative/[0.05]",
    label: "text-negative",
    chip: "Now",
    mark: "text-negative",
  },
  today: {
    box: "border-accent/50 bg-accent/[0.05]",
    label: "text-accent",
    chip: "Today",
    mark: "text-accent",
  },
  soon: {
    box: "border-border bg-surface",
    label: "text-muted",
    chip: "This week",
    mark: "text-muted",
  },
};

/**
 * When to call — the signs that should not wait.
 *
 * For the two of them only, like everything in Health. It shows nothing from
 * the health log, so her partner can open it even when she keeps her log to
 * herself: the only thing of hers on it is who to call, from the health card
 * they both already see.
 *
 * The words are in lib/when-to-call.ts and are the same for every reader's
 * faith choice. There is no verse here for anybody.
 */
export default async function WhenToCallPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in?callbackUrl=/health/when-to-call");
  const active = await getActiveMembership(session.user.id);
  if (!active) redirect("/onboarding");
  if (!isHousehold(active.role)) redirect("/journey");

  const journey = active.journey;
  const pos = computePosition(journey.dueDate);
  const phase: CallPhase = journey.status === "LOSS" ? "after-loss" : pos.born ? "after-birth" : "pregnancy";
  const reader = active.role === "MOTHER" ? "MOTHER" : "PARTNER";
  const motherName = journey.owner.name?.trim() || "her";
  const page = whenToCall(phase, reader, motherName);

  // Who to call: what the family wrote on her card. Nothing is invented here.
  const card = await prisma.healthRecord.findUnique({
    where: { journeyId_userId: { journeyId: journey.id, userId: journey.ownerId } },
    select: { careProvider: true, emergencyContact: true },
  });
  const people = [
    { label: "Hospital, midwife or doctor", value: card?.careProvider?.trim() || "" },
    { label: "Emergency contact", value: card?.emergencyContact?.trim() || "" },
  ].filter((p) => p.value);

  // While she is expecting, the other half of the page is a tap away: the
  // week before a due date is exactly when somebody wants to read ahead.
  const other: CallPhase | null = phase === "pregnancy" ? "after-birth" : null;
  const ahead = other ? whenToCall(other, reader, motherName) : null;

  return (
    <>
      <SiteHeader active="health" />
      <main className="mx-auto max-w-3xl px-6 pb-14">
        <PageHero eyebrow="Health" title="When to call." lede={page.lede} compact />
        <HealthTabs active="call" />

        <section aria-labelledby="who" className="mt-6 rounded-2xl border border-border bg-surface p-5">
          <h2 id="who" className="eyebrow mb-2 text-muted">
            Who to call
          </h2>
          {people.length > 0 ? (
            <dl className="space-y-3">
              {people.map((p) => (
                <div key={p.label}>
                  <dt className="font-mono text-[0.62rem] uppercase tracking-widest text-muted">{p.label}</dt>
                  <dd className="mt-0.5 whitespace-pre-line break-words font-serif text-lg text-ink">
                    {phoneParts(p.value).map((part, i) =>
                      part.tel ? (
                        <a key={i} href={`tel:${part.tel}`} className="text-accent underline underline-offset-4">
                          {part.text}
                        </a>
                      ) : (
                        <span key={i}>{part.text}</span>
                      ),
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="max-w-prose prose-serif-sm text-ink/85">
              The maternity unit&apos;s number is not written down here yet. Put it on{" "}
              {reader === "MOTHER" ? "your" : "her"} health card today, with somebody to ring in an emergency, so it is
              on this page the day it is needed.
            </p>
          )}
          <p className="mt-3 prose-serif-xs text-muted">
            <Link href="/health" className="underline underline-offset-4 hover:text-accent">
              {people.length > 0 ? "Change these on the health card" : "Open the health card"}
            </Link>
            {" · "}Anywhere in the world, the local emergency number will also answer.
          </p>
        </section>

        <div className="mt-6 space-y-4">
          {page.groups.map((g) => (
            <Group key={g.key} g={g} />
          ))}
        </div>

        {page.groups.some((g) => g.key === "mind-now") && (
          <p className="mt-4 max-w-prose prose-serif-xs text-muted">
            Crisis lines for every country are listed at{" "}
            <a href={HELPLINE_DIRECTORY.href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-accent">
              {HELPLINE_DIRECTORY.label}
            </a>
            . Opening it tells them nothing about you.
          </p>
        )}

        {ahead && (
          <details className="mt-8 rounded-2xl border border-border bg-surface/60 p-5">
            <summary className="cursor-pointer font-serif text-lg text-ink">After the birth: read ahead</summary>
            <p className="mt-2 max-w-prose prose-serif-sm text-muted">
              This page changes by itself once the birth is recorded. These are the signs it will show then.
            </p>
            <div className="mt-4 space-y-4">
              {ahead.groups
                .filter((g) => !g.key.startsWith("mind-"))
                .map((g) => (
                  <Group key={g.key} g={g} />
                ))}
            </div>
          </details>
        )}

        <div className="mt-10 space-y-2 border-t border-border pt-4">
          {page.closing.map((c) => (
            <p key={c} className="max-w-prose prose-serif-xs text-muted">
              {c}
            </p>
          ))}
          <p className="max-w-prose prose-serif-xs text-muted">
            {CALL_SOURCE} Last gone through {CALL_UPDATED}.
          </p>
        </div>
      </main>
    </>
  );
}

function Group({ g }: { g: CallGroup }) {
  const t = TONE[g.tone];
  return (
    <section aria-labelledby={`g-${g.key}`} className={`rounded-2xl border p-5 ${t.box}`}>
      <p className={`eyebrow mb-1 ${t.label}`}>
        {t.chip} · {g.about}
      </p>
      <h2 id={`g-${g.key}`} className="font-serif text-xl text-ink">
        {g.title}
      </h2>
      {g.intro && <p className="mt-1.5 max-w-prose prose-serif-sm text-ink/85">{g.intro}</p>}
      <ul className="mt-3 space-y-2">
        {g.signs.map((s) => (
          <li key={s} className="flex gap-2.5 prose-serif-sm text-ink">
            <span aria-hidden className={`mt-[0.15em] shrink-0 font-mono text-xs ${t.mark}`}>
              {g.tone === "now" ? "‼" : "•"}
            </span>
            <span>{s}</span>
          </li>
        ))}
      </ul>
      {g.after && <p className="mt-3 max-w-prose prose-serif-sm text-ink/85">{g.after}</p>}
    </section>
  );
}
