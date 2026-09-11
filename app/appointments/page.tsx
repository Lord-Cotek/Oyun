import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getActiveMembership } from "@/lib/data";
import { getUpcoming, getPast } from "@/lib/appointments-db";
import { SiteHeader } from "@/components/SiteHeader";
import { PageHero } from "@/components/ui/PageHero";
import { Card } from "@/components/ui/Card";
import { Verse } from "@/components/ui/Verse";
import { AppointmentBook } from "@/components/appointments/AppointmentBook";

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

  const [upcoming, past] = await Promise.all([
    getUpcoming(active.journey.id, session.user.id),
    getPast(active.journey.id, session.user.id),
  ]);

  return (
    <>
      <SiteHeader active="appointments" />
      <main className="mx-auto max-w-shell px-6 py-10">
        <PageHero
          eyebrow="Appointments"
          title="Every date, and what to ask when you get there."
          lede="Scans, checks, tests and clinics in one place — with the questions you mean to ask written down before you walk in. You will be reminded the day before, and on the morning itself when there is a time on the letter."
        />

        <Card className="mt-8 p-8">
          <AppointmentBook upcoming={upcoming} past={past} />
        </Card>

        <div className="mt-6 rounded-2xl border border-border bg-surface/60 p-6">
          <p className="font-mono text-[0.6rem] uppercase tracking-widest text-muted">
            About the reminders
          </p>
          <ul className="mt-2 space-y-1.5 font-mono text-xs leading-relaxed text-muted">
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
            text="Commit your deeds to Yahweh, and your plans shall succeed."
            reference="Proverbs 16:3"
          />
        </div>
      </main>
    </>
  );
}
