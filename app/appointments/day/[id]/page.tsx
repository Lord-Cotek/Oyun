import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getActiveMembership } from "@/lib/data";
import { getOneDay } from "@/lib/events-db";
import { getHostInvitations } from "@/lib/invitations-db";
import { toInviteRow, toDayRow } from "@/lib/day-rows";
import { whenWords } from "@/lib/day-words";
import { SiteHeader } from "@/components/SiteHeader";
import { Card } from "@/components/ui/Card";
import { BackLink } from "@/components/ui/BackLink";
import { InvitePanel } from "@/components/dates/InvitePanel";

/**
 * One day of their own, on a page of its own.
 *
 * ── Why ──────────────────────────────────────────────────────────────────
 * Two kinds of notification pointed at `/appointments#day-…`: the morning
 * reminder, and — far more often — somebody answering the invitation. The
 * diary draws only the days still ahead, so the morning after the shower the
 * element simply was not there, and a reply that arrived late opened the top
 * of the book forever after. The replies to a day that has been are the ones
 * people go back to read.
 *
 * ── Who may open it ──────────────────────────────────────────────────────
 * Whoever may see the day. Not a role check: the question is asked of the day
 * itself, by getOneDay, which carries surpriseScope — so a shower arranged
 * for her is still not hers to find, and a supporter let in on it can open
 * the one day they were let in on and nothing else. See lib/surprise.ts.
 */

export const dynamic = "force-dynamic";

export function generateMetadata(): Metadata {
  // Never the day's own name. "Amara's baby shower" in a tab list, on the
  // phone of the person it is being kept from, would undo the whole rule.
  return { title: "A day", robots: { index: false, follow: false } };
}

export default async function OneDay({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect(`/sign-in?callbackUrl=/appointments/day/${params.id}`);
  }
  const active = await getActiveMembership(session.user.id);
  if (!active) redirect("/onboarding");

  const day = await getOneDay(params.id, active.journey.id, session.user.id);
  if (!day) notFound();

  // The host's own view of the invitation, when this day has one. Same shape
  // as the book's, through the same mapping.
  const invite =
    (await getHostInvitations(active.journey.id))
      .filter((i) => i.eventId === day.sourceId)
      .map(toInviteRow)[0] ?? null;
  const row = toDayRow(day, invite);

  return (
    <>
      <SiteHeader active="appointments" />
      <main className="mx-auto max-w-shell px-6 pb-10">
        <BackLink href="/appointments">The whole book</BackLink>
        <div className="mt-4 max-w-2xl">
          <Card>
            {row.surprise && (
              <p className="eyebrow mb-2 text-accent">
                Still a surprise — only the people planning it can see this
              </p>
            )}
            <p className="font-serif text-2xl leading-snug text-ink">
              {row.label}
            </p>
            <p className="mt-2 font-mono text-[0.68rem] uppercase tracking-widest text-muted">
              {whenWords(row.atISO, row.hasTime, row.endsAtISO)}
              {row.where ? ` · ${row.where}` : ""}
            </p>
            {row.note && (
              <p className="mt-4 whitespace-pre-wrap font-serif text-base leading-relaxed text-ink">
                {row.note}
              </p>
            )}
          </Card>

          {/* The invitation and everyone who answered it — which is what the
              notification that brought them here was about. Only for a day
              that has one; a day nobody was invited to shows just itself. */}
          {invite && (
            <div className="mt-6">
              <InvitePanel
                eventId={row.sourceId}
                title={row.label}
                when={whenWords(row.atISO, row.hasTime, row.endsAtISO)}
                where={row.where}
                invite={invite}
              />
            </div>
          )}
        </div>
      </main>
    </>
  );
}
