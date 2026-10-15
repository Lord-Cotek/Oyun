import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getActiveMembership, getOneCheckIn } from "@/lib/data";
import { MOOD_META } from "@/lib/moods";
import { SiteHeader } from "@/components/SiteHeader";
import { Card } from "@/components/ui/Card";
import { BackLink } from "@/components/ui/BackLink";
import { Reactions } from "@/components/Reactions";

/**
 * One check-in, and how the circle answered it.
 *
 * ── Why ──────────────────────────────────────────────────────────────────
 * This was the worst of the lot. /care renders the reactions block for the
 * LATEST check-in only, so "Ifeoma responded to how you're feeling" worked
 * until she checked in again — and then pointed at an element that was never
 * drawn. A woman who checks in daily was being told somebody had answered her
 * and sent to a page that did not show it. Measured, not guessed: the anchor
 * for yesterday's check-in is simply not in the document.
 *
 * ── Who may open it ──────────────────────────────────────────────────────
 * The person who wrote it, and the mother whose room this is. Not the circle:
 * they can respond to how she is today from the journey page, which is a
 * deliberate, narrow window — it is not an invitation to read back through
 * every low day she has had.
 */

export const dynamic = "force-dynamic";

export function generateMetadata(): Metadata {
  return { title: "A check-in", robots: { index: false, follow: false } };
}

export default async function OneCheckIn({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect(`/sign-in?callbackUrl=/care/checkin/${params.id}`);
  }
  const active = await getActiveMembership(session.user.id);
  if (!active) redirect("/onboarding");

  const c = await getOneCheckIn(
    params.id,
    active.journey.id,
    session.user.id,
  );
  if (!c) notFound();
  if (active.role !== "MOTHER" && c.userId !== session.user.id) {
    redirect("/journey");
  }

  const mood = MOOD_META[c.mood];
  const mine = c.userId === session.user.id;

  return (
    <>
      <SiteHeader active="care" />
      <main className="mx-auto max-w-shell px-6 pb-10">
        <BackLink href="/care">Back to how you are</BackLink>
        <div className="mt-4 max-w-2xl">
          <Card>
            <p className="eyebrow mb-2 text-muted">
              {mine ? "How you were" : `How ${c.userName ?? "she"} was`}
            </p>
            <p className="font-serif text-2xl leading-snug text-ink">
              {mood.label}
            </p>
            <p className="mt-1 prose-serif-xs text-muted">{mood.blurb}</p>
            {c.note && (
              <p className="mt-4 whitespace-pre-wrap font-serif text-base leading-relaxed text-ink">
                {c.note}
              </p>
            )}
            <p className="mt-4 font-mono text-[0.68rem] uppercase tracking-widest text-muted">
              {c.createdAt.toLocaleDateString(undefined, {
                weekday: "long",
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>

            <div className="mt-6 border-t border-border pt-5">
              <p className="eyebrow mb-3 text-muted">
                {mine ? "How your circle responded" : "How the circle responded"}
              </p>
              <Reactions
                targetType="CHECKIN"
                targetId={c.id}
                initial={c.reactions}
              />
            </div>
          </Card>
        </div>
      </main>
    </>
  );
}
