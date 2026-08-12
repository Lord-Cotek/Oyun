import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getActiveMembership } from "@/lib/data";
import { SiteHeader } from "@/components/SiteHeader";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { StatCard } from "@/components/ui/StatCard";
import { MilestoneForm } from "@/components/care/MilestoneForm";
import { FirstsTimeline } from "@/components/firsts/FirstsTimeline";

export const metadata: Metadata = {
  title: "The firsts",
  description: "Every first, remembered.",
  robots: { index: false },
};

export default async function FirstsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in?callbackUrl=/firsts");

  const active = await getActiveMembership(session.user.id);
  if (!active) redirect("/onboarding");
  if (active.role !== "MOTHER") redirect("/journey");

  const journeyId = active.journey.id;

  const [milestones, children] = await Promise.all([
    prisma.milestone.findMany({
      where: { journeyId },
      orderBy: { occurredAt: "desc" },
      include: { child: { select: { id: true, name: true } } },
    }),
    prisma.child.findMany({
      where: { journeyId },
      orderBy: { createdAt: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  const withPhotos = milestones.filter((m) => m.photoUrls.length > 0).length;
  const photoCount = milestones.reduce((n, m) => n + m.photoUrls.length, 0);

  const items = milestones.map((m) => ({
    id: m.id,
    kind: m.kind,
    title: m.title,
    note: m.note,
    occurredAt: m.occurredAt.toISOString(),
    photoUrls: m.photoUrls,
    childId: m.child?.id ?? null,
    childName: m.child?.name ?? null,
  }));

  return (
    <>
      <SiteHeader active="firsts" />
      <main className="mx-auto max-w-shell px-6 py-10">
        <div className="animate-fade-up">
          <Eyebrow className="mb-3">The firsts</Eyebrow>
          <h1 className="font-serif text-4xl leading-tight text-ink md:text-5xl">
            Every first, remembered.
          </h1>
          <p className="mt-4 max-w-prose font-mono text-sm leading-relaxed text-muted">
            The little moments go by quickly — the first kick, the first cry, the
            first smile. Keep them here with a date, a note, and a photo you can
            open and hold onto.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <StatCard label="Firsts logged" value={milestones.length} hint="moments kept" />
          <StatCard label="With photos" value={withPhotos} hint="have a picture" />
          <StatCard label="Photos saved" value={photoCount} hint="tap any to view" />
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-[1.5fr_1fr]">
          <Card className="p-8">
            <Eyebrow className="mb-5">The timeline</Eyebrow>
            <FirstsTimeline milestones={items} children={children} />
          </Card>

          <Card className="h-fit p-8">
            <Eyebrow className="mb-4">Remember a first</Eyebrow>
            <MilestoneForm children={children} />
          </Card>
        </div>
      </main>
    </>
  );
}
