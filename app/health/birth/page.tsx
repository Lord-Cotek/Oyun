import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getActiveMembership } from "@/lib/data";
import { isHousehold } from "@/lib/roles";
import { computePosition } from "@/lib/stage";
import { SiteHeader } from "@/components/SiteHeader";
import { PageHero } from "@/components/ui/PageHero";
import { HealthTabs } from "@/components/health/HealthTabs";

export const metadata: Metadata = {
  title: "Birth",
  description: "Getting ready for the birth, and the timer for the day.",
  robots: { index: false },
};

/** What is on the Birth page. Each is a page of its own. */
const TOOLS: { href: string; title: string; body: string }[] = [
  {
    href: "/health/birth/timer",
    title: "Contraction timer",
    body: "Press when one starts and when it eases. It works out how long they last and how far apart they are, in the words a midwife asks for.",
  },
];

/**
 * Birth — the tools for getting ready and for the day itself.
 *
 * A short page of doors. Each tool keeps its own rules about who may open
 * it; this page holds nothing of hers.
 */
export default async function BirthPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in?callbackUrl=/health/birth");
  const active = await getActiveMembership(session.user.id);
  if (!active) redirect("/onboarding");
  if (!isHousehold(active.role)) redirect("/journey");

  const pos = computePosition(active.journey.dueDate);
  const after = active.journey.status === "LOSS" || pos.born;

  return (
    <>
      <SiteHeader active="health" />
      <main className="mx-auto max-w-3xl px-6 pb-14">
        <PageHero
          eyebrow="Health"
          title="Birth."
          lede={after ? "What was made ready for the birth is kept here." : "Getting ready for the day, and what to have in your hand when it comes."}
          compact
        />
        <HealthTabs active="birth" />
        <ul className="mt-6 space-y-3">
          {TOOLS.map((t) => (
            <li key={t.href}>
              <Link
                href={t.href}
                className="block rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-accent"
              >
                <span className="flex items-baseline justify-between gap-3">
                  <span className="font-serif text-xl text-ink">{t.title}</span>
                  <span aria-hidden className="font-mono text-xs text-muted">
                    Open →
                  </span>
                </span>
                <span className="mt-1.5 block max-w-prose prose-serif-sm text-muted">{t.body}</span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-8 max-w-prose prose-serif-xs text-muted">
          Bleeding, waters breaking, the baby moving less, or contractions before 37 weeks do not wait for any of this.{" "}
          <Link href="/health/when-to-call" className="text-accent underline underline-offset-4">
            When to call
          </Link>
        </p>
      </main>
    </>
  );
}
