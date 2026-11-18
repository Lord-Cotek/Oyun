import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getActiveMembership } from "@/lib/data";
import { isHousehold } from "@/lib/roles";
import { hasAnyHealth } from "@/lib/health-card";
import { loadHealthCards } from "@/lib/health-card-db";
import { SiteHeader } from "@/components/SiteHeader";
import { PageHero } from "@/components/ui/PageHero";
import { HealthCardView } from "@/components/health/HealthCardView";
import { HealthTabs } from "@/components/health/HealthTabs";

export const metadata: Metadata = {
  title: "Health",
  description: "Blood group, genotype, allergies and who to call — kept close, just in case.",
  robots: { index: false },
};

const short = (d: Date) => d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

/**
 * The health cards — hers, her partner's, and each child's.
 *
 * Kept to the two of them, like the appointment book: a blood group or a
 * genotype is nobody else's to read. The circle has no way here, and nothing
 * on these cards is ever put into an email, a notification or a search.
 */
export default async function HealthPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in?callbackUrl=/health");
  const active = await getActiveMembership(session.user.id);
  if (!active) redirect("/onboarding");
  if (!isHousehold(active.role)) redirect("/journey");

  const data = await loadHealthCards(active.journey.id, session.user.id);
  if (!data) redirect("/journey");
  const { people, hints, pregnancy } = data;
  const anyFilled = people.some((p) => hasAnyHealth(p.fields));

  return (
    <>
      <SiteHeader active="health" />
      <main className="mx-auto max-w-3xl px-6 pb-14">
        <PageHero
          eyebrow="Health"
          title="Kept close, just in case."
          lede="Blood group, genotype, allergies, what each of you takes and who to call — for the clinic, the labour ward, or whoever is minding the baby. Kept between the two of you; the circle never sees it."
        />

        <HealthTabs active="cards" />

        {pregnancy && (
          <p className="mt-6 font-mono text-xs text-muted">
            {pregnancy.label} today · due{" "}
            {pregnancy.dueDate.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })}
          </p>
        )}

        {hints.length > 0 && (
          <div className="mt-6 space-y-3">
            {hints.map((h) => (
              <div key={h.key} className="rounded-2xl border border-accent/40 bg-accent/[0.06] p-5">
                <p className="eyebrow mb-1 text-accent">Worth asking about</p>
                <p className="font-serif text-lg text-ink">{h.title}</p>
                <p className="mt-1 max-w-prose prose-serif-sm text-ink/85">{h.body}</p>
              </div>
            ))}
          </div>
        )}

        {anyFilled && (
          <div className="mt-6 flex flex-wrap items-center gap-3 rounded-xl border border-border bg-surface/60 px-4 py-3">
            <p className="min-w-0 flex-1 prose-serif-xs text-muted">
              {pregnancy
                ? "A card for your hospital bag, and one for whoever minds the baby later — printed, or saved as a PDF to send."
                : "Leaving the little one with someone? Their card — allergies, medicines, who to call — on one page to print or send."}
            </p>
            <Link
              href="/health/card"
              className="inline-flex min-h-11 items-center rounded-lg border border-accent/60 px-4 font-mono text-xs text-accent hover:bg-accent/[0.06]"
            >
              Print the cards
            </Link>
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 gap-4">
          {people.map((p) => (
            <HealthCardView
              key={p.target}
              person={{
                target: p.target,
                kind: p.kind,
                name: p.name,
                sub: p.sub,
                fields: p.fields,
                saved: p.saved,
                canEdit: p.canEdit,
                prefill: p.prefill,
                updatedLabel: p.updatedAt ? `${short(p.updatedAt)}${p.updatedBy ? ` by ${p.updatedBy}` : ""}` : null,
                printHref: `/health/card?who=${encodeURIComponent(p.target)}`,
              }}
            />
          ))}
        </div>

        {active.journey.status === "ACTIVE" && !people.some((p) => p.kind === "child") && (
          <p className="mt-6 prose-serif-xs text-muted">
            The baby gets a card of their own once the birth is recorded.
          </p>
        )}
      </main>
    </>
  );
}
