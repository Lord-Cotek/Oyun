import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getActiveMembership } from "@/lib/data";
import {
  getUpcomingAppointments,
  getPastAppointments,
} from "@/lib/appointments-db";
import { SiteHeader } from "@/components/SiteHeader";
import { PageHero } from "@/components/ui/PageHero";
import { Card } from "@/components/ui/Card";
import { Verse } from "@/components/ui/Verse";
import { AppointmentBook } from "@/components/appointments/AppointmentBook";
import { DiaryBook, OwnDays, type DayRow } from "@/components/dates/DiaryBook";
import { getDiary } from "@/lib/events-db";
import { getHostInvitations, inviteUrl } from "@/lib/invitations-db";
import { type InviteRow } from "@/components/dates/InvitePanel";

export const metadata: Metadata = {
  title: "Appointments",
  description: "Scans, checks and clinics — kept, and remembered for you.",
  robots: { index: false },
};

export default async function AppointmentsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in?callbackUrl=/appointments");
  const active = await getActiveMembership(session.user.id);
  if (!active) redirect("/onboarding");

  // The appointment book is the household's. A scan date is health
  // information, and the wider circle sees it only if she names it herself on
  // the prayer wall.
  if (active.role !== "MOTHER" && active.role !== "PARTNER") {
    redirect("/journey");
  }

  const [upcoming, past, diary, invitations] = await Promise.all([
    getUpcomingAppointments(active.journey.id, session.user.id),
    getPastAppointments(active.journey.id, session.user.id),
    getDiary(active.journey.id),
    getHostInvitations(active.journey.id),
  ]);

  const byEvent = new Map<string, InviteRow>(
    invitations.map((i) => [
      i.eventId,
      {
        slug: i.slug,
        url: inviteUrl(i.slug),
        hostName: i.hostName,
        message: i.message,
        showGuestList: i.showGuestList,
        allowPlusOnes: i.allowPlusOnes,
        capacity: i.capacity,
        repliesByISO: i.repliesBy ? i.repliesBy.toISOString() : null,
        closed: i.closedAt !== null,
        revoked: i.revokedAt !== null,
        settled: i.settledAt !== null,
        emailsSent: i.emailsSentCount,
        options: i.options.map((o) => ({
          id: o.id,
          atISO: o.at.toISOString(),
          hasTime: o.hasTime,
          endsAtISO: o.endsAt ? o.endsAt.toISOString() : null,
          votes: o._count.votes,
        })),
        replies: i.replies.map((r) => ({
          id: r.id,
          name: r.name,
          answer: r.answer,
          partySize: r.partySize,
          note: r.note,
        })),
      },
    ]),
  );

  const rows: DayRow[] = diary.map((d) => ({
    key: d.key,
    source: d.source,
    sourceId: d.sourceId,
    atISO: d.at.toISOString(),
    endsAtISO: d.endsAt ? d.endsAt.toISOString() : null,
    hasTime: d.hasTime,
    label: d.label,
    where: d.where,
    note: d.note,
    kind: d.kind,
    editable: d.editable,
    daysAway: d.daysAway,
    // Only a day she wrote down can be invited to. Nobody RSVPs to a scan.
    invite: d.source === "event" ? (byEvent.get(d.sourceId) ?? null) : null,
  }));

  return (
    <>
      <SiteHeader active="appointments" />
      <main className="mx-auto max-w-shell px-6 pb-10">
        <PageHero
          eyebrow="Your dates"
          title="Every day that is coming, and what to ask when you get there."
          lede="Scans, checks and clinics — with the questions you mean to ask written down before you walk in. And the days you arrange yourself: a class, a shower, a morning with the other mothers, which you can send a link to. You will be reminded the day before, and on the morning itself when there is a time."
        />

        {/* ── Three parts, in the order the questions get asked ──────────
            The month first, because "what is that week like" is the question
            a calendar exists to answer, and both kinds of day are on it.
            Then the two kinds, each in its own place with its own name: the
            ones she is called to, and the ones she arranges. Holding both in
            one list was what made people ask which was which. */}
        <Card className="mt-8 p-8">
          <DiaryBook rows={rows} canEdit />
        </Card>

        <Card className="mt-6 p-8">
          <h2 className="font-serif text-2xl text-ink">Appointments</h2>
          <p className="prose-serif-xs mb-5 mt-1.5 text-muted">
            Scans, checks, tests and clinics — the days somebody else set, with
            the questions you mean to ask written down before you walk in.
          </p>
          <AppointmentBook upcoming={upcoming} past={past} />
        </Card>

        <Card className="mt-6 p-8">
          <OwnDays days={rows} canEdit />
        </Card>

        <div className="mt-6 rounded-2xl border border-border bg-surface/60 p-6">
          <p className="font-mono text-[0.6rem] uppercase tracking-widest text-muted">
            About the reminders
          </p>
          <ul className="mt-2 space-y-1.5 prose-serif-xs text-muted">
            <li>
              <span className="text-ink">The day before</span>, for everything —
              the one that actually saves a morning.
            </li>
            <li>
              <span className="text-ink">On the morning</span>, only when the
              letter gave a time. Otherwise there is nothing useful to add.
            </li>
            <li>
              <span className="text-ink">A week ahead</span>, only for scans,
              consultants and classes — the ones that may need time off, a lift,
              or somebody to sit with the children.
            </li>
            <li>
              Three at most, and usually two. Push and email both, unless you
              have turned email off in settings. Move a date and its reminders
              start again from the new one.
            </li>
            <li>
              Only you and whoever is walking beside you are told. Nobody else
              in the circle sees any of this.
            </li>
          </ul>
        </div>

        <div className="mt-8">
          <Verse
            text="Commit your deeds to the LORD, and your plans shall succeed."
            reference="Proverbs 16:3"
          />
        </div>
      </main>
    </>
  );
}
