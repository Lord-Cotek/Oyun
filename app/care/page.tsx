import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getActiveMembership } from "@/lib/data";
import { MOOD_META } from "@/lib/moods";
import { SiteHeader } from "@/components/SiteHeader";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { CheckInForm } from "@/components/care/CheckInForm";
import { LetterForm } from "@/components/care/LetterForm";
import { MilestoneForm } from "@/components/care/MilestoneForm";
import { MoodChart, type MoodPoint } from "@/components/care/MoodChart";

export const metadata: Metadata = {
  title: "Care",
  description: "Your heart, your letters, your firsts.",
  robots: { index: false },
};

const KIND_LABEL: Record<string, string> = {
  FIRST_KICK: "First kick",
  ULTRASOUND: "Ultrasound",
  HEARTBEAT: "Heartbeat",
  BIRTH: "Birth",
  FIRST_SMILE: "First smile",
  FIRST_WORD: "First word",
  FIRST_STEPS: "First steps",
  CUSTOM: "A first",
};

export default async function CarePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in?callbackUrl=/care");

  const active = await getActiveMembership(session.user.id);
  if (!active) redirect("/onboarding");
  if (active.role !== "MOTHER") redirect("/journey");

  const journeyId = active.journey.id;

  const [checkIns, letters, milestones, children] = await Promise.all([
    prisma.checkIn.findMany({
      where: { journeyId },
      orderBy: { createdAt: "asc" },
      take: 60,
    }),
    prisma.letter.findMany({
      where: { journeyId },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    prisma.milestone.findMany({
      where: { journeyId },
      orderBy: { occurredAt: "desc" },
      take: 20,
      include: { child: { select: { name: true } } },
    }),
    prisma.child.findMany({
      where: { journeyId },
      orderBy: { createdAt: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  const points: MoodPoint[] = checkIns.map((c) => ({
    date: c.createdAt.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    value: MOOD_META[c.mood].value,
    label: MOOD_META[c.mood].label,
  }));

  return (
    <>
      <SiteHeader active="care" />
      <main className="mx-auto max-w-shell px-6 py-10">
        <div className="animate-fade-up">
          <Eyebrow className="mb-3">Care</Eyebrow>
          <h1 className="font-serif text-4xl leading-tight text-ink md:text-5xl">
            Your heart, your letters, your firsts.
          </h1>
          <p className="mt-4 max-w-prose font-mono text-sm leading-relaxed text-muted">
            A quiet, private place. What you write here stays yours — your check-in
            mood can be shared with the one supporting you; your notes and letters
            are kept for you.
          </p>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          {/* Check-ins + chart */}
          <Card className="lg:col-span-2">
            <Eyebrow className="mb-4">How is your heart today?</Eyebrow>
            <CheckInForm />
            <div className="mt-8 border-t border-border pt-6">
              <p className="eyebrow mb-4 text-muted">Over time</p>
              <MoodChart data={points} />
            </div>
          </Card>

          {/* Letters */}
          <Card>
            <Eyebrow className="mb-4">Letters</Eyebrow>
            <LetterForm />
            <div className="mt-6 space-y-3 border-t border-border pt-5">
              {letters.length === 0 ? (
                <p className="font-mono text-xs text-muted">
                  No letters yet. The first can be one line.
                </p>
              ) : (
                letters.map((l) => (
                  <div key={l.id} className="rounded-lg border border-border bg-bg p-4">
                    <p className="whitespace-pre-wrap font-serif text-base leading-relaxed text-ink">
                      {l.body}
                    </p>
                    <p className="mt-3 font-mono text-[0.68rem] uppercase tracking-widest text-muted">
                      {l.toBaby ? "To the baby" : "To each other"} ·{" "}
                      {l.createdAt.toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Milestones */}
          <Card>
            <Eyebrow className="mb-4">The firsts</Eyebrow>
            <MilestoneForm children={children} />
            <div className="mt-6 border-t border-border pt-5">
              {milestones.length === 0 ? (
                <p className="font-mono text-xs text-muted">
                  Nothing logged yet. The firsts go by quickly — catch them here.
                </p>
              ) : (
                <ol className="relative space-y-4 border-l border-border pl-5">
                  {milestones.map((m) => (
                    <li key={m.id} className="relative">
                      <span className="absolute -left-[1.4rem] top-1.5 h-2 w-2 rounded-full bg-accent ring-4 ring-bg" />
                      <p className="font-mono text-sm text-ink">
                        {KIND_LABEL[m.kind] ?? "A first"}
                        {m.child && (
                          <span className="ml-2 rounded-full bg-accent/15 px-2 py-0.5 font-mono text-[0.6rem] text-accent">
                            {m.child.name}
                          </span>
                        )}
                      </p>
                      {m.note && (
                        <p className="mt-0.5 font-mono text-xs leading-relaxed text-muted">
                          {m.note}
                        </p>
                      )}
                      <p className="mt-0.5 font-mono text-[0.68rem] uppercase tracking-widest text-muted">
                        {m.occurredAt.toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                      {m.photoUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={m.photoUrl}
                          alt={`${KIND_LABEL[m.kind] ?? "A first"} — photo`}
                          className="mt-2 max-h-48 w-auto rounded-lg border border-border object-cover"
                          loading="lazy"
                        />
                      )}
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </Card>
        </div>
      </main>
    </>
  );
}
