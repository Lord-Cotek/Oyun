import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getActiveMembership } from "@/lib/data";
import { getOneAppointment } from "@/lib/appointments-db";
import { appointmentTitle, dayLabel, timeLabel } from "@/lib/appointments";
import { SiteHeader } from "@/components/SiteHeader";
import { BackLink } from "@/components/ui/BackLink";
import { OneAppointment } from "@/components/appointments/AppointmentBook";

/**
 * One appointment, on a page of its own.
 *
 * ── Why ──────────────────────────────────────────────────────────────────
 * Every appointment reminder is about something still ahead, and the upcoming
 * list sits below the add button and the rest of the book. Measured on a
 * phone, arriving from a notification: the element was two thousand pixels
 * down and the page never scrolled — the browser acts on a fragment while it
 * parses the document, and this book renders after that. So "Tomorrow: your
 * 20-week scan, 09:40" opened the top of the book.
 *
 * ── Who may open it ──────────────────────────────────────────────────────
 * The mother and her partner, the same two as the book. An appointment names
 * a hospital, a consultant and often a reason, and the circle is not told any
 * of that unless she chooses to ask them to pray.
 */

export const dynamic = "force-dynamic";

export function generateMetadata(): Metadata {
  // Not the kind or the clinic. A tab list is read over shoulders.
  return { title: "An appointment", robots: { index: false, follow: false } };
}

export default async function OneAppointmentPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect(`/sign-in?callbackUrl=/appointments/${params.id}`);
  }
  const active = await getActiveMembership(session.user.id);
  if (!active) redirect("/onboarding");
  if (active.role !== "MOTHER" && active.role !== "PARTNER") {
    redirect("/journey");
  }

  const a = await getOneAppointment(
    params.id,
    active.journey.id,
    session.user.id,
  );
  if (!a) notFound();

  return (
    <>
      <SiteHeader active="appointments" />
      <main className="mx-auto max-w-shell px-6 pb-10">
        <BackLink href="/appointments">The whole book</BackLink>
        <div className="mt-4 max-w-2xl">
          {/* Said once in plain words above the card, because somebody who
              opened a reminder wants the answer to "when is it" before they
              have read anything else. */}
          <p className="font-serif text-xl leading-snug text-ink">
            {appointmentTitle(a.kind, a.title)}
          </p>
          <p className="mt-1 mb-5 font-mono text-[0.68rem] uppercase tracking-widest text-muted">
            {dayLabel(new Date(a.at), new Date())}
            {timeLabel(new Date(a.at), a.hasTime)
              ? ` · ${timeLabel(new Date(a.at), a.hasTime)}`
              : ""}
          </p>
          <OneAppointment a={a} />
        </div>
      </main>
    </>
  );
}
