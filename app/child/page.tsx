import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getActiveMembership } from "@/lib/data";
import { SiteHeader } from "@/components/SiteHeader";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { StatCard } from "@/components/ui/StatCard";
import { PageHero } from "@/components/ui/PageHero";
import { EmptyState } from "@/components/ui/EmptyState";
import { ChildForm } from "@/components/child/ChildForm";
import { ChildCard } from "@/components/child/ChildCard";

export const metadata: Metadata = {
  title: "Nursery",
  description: "Your children's profiles.",
  robots: { index: false },
};

function ageLabel(birthDate: Date | null): string | null {
  if (!birthDate) return null;
  const months =
    (new Date().getFullYear() - birthDate.getFullYear()) * 12 +
    (new Date().getMonth() - birthDate.getMonth());
  if (months < 0) return "on the way";
  if (months < 1) return "newborn";
  if (months < 24) return `${months} month${months === 1 ? "" : "s"} old`;
  const years = Math.floor(months / 12);
  return `${years} year${years === 1 ? "" : "s"} old`;
}

export default async function ChildPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in?callbackUrl=/child");

  const active = await getActiveMembership(session.user.id);
  if (!active) redirect("/onboarding");
  if (active.role !== "MOTHER") redirect("/journey");

  const children = await prisma.child.findMany({
    where: { journeyId: active.journey.id },
    orderBy: { createdAt: "asc" },
    include: { _count: { select: { milestones: true } } },
  });

  const expecting = active.journey.babyCount;
  const firstsKept = children.reduce((n, c) => n + c._count.milestones, 0);

  return (
    <>
      <SiteHeader active="nursery" />
      <main className="mx-auto max-w-shell px-6 py-10">
        <PageHero
          eyebrow="The nursery"
          title={children.length > 0 ? "Your little ones." : "Meet your little one."}
          lede={
            expecting > 1
              ? `You told us you're expecting ${expecting}. Add a profile for each — their name, their firsts, a photo to hold onto.`
              : "Keep their profile here — name, birth day, a photo, and the firsts you don't want to forget."
          }
        />

        {children.length > 0 && (
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <StatCard label="Little ones" value={children.length} hint="in the nursery" />
            <StatCard label="Firsts kept" value={firstsKept} hint="across them all" />
            <StatCard label="Expecting" value={expecting} hint="on your journey" />
          </div>
        )}

        <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_1fr]">
          <div className="min-w-0 space-y-4">
            {children.length === 0 ? (
              <EmptyState
                title="A place is ready for them."
                verse={{
                  text: "Behold, children are a heritage from the Lord, the fruit of the womb a reward.",
                  reference: "Psalm 127:3",
                }}
                action={
                  <p className="font-mono text-[0.68rem] uppercase tracking-widest text-accent">
                    Add their profile &rarr;
                  </p>
                }
              >
                Add your first little one alongside — name, a photo, their firsts.
                You can always come back and add another (twins and multiples
                welcome).
              </EmptyState>
            ) : (
              children.map((c) => (
                <ChildCard
                  key={c.id}
                  child={{
                    id: c.id,
                    name: c.name,
                    sex: c.sex,
                    birthDate: c.birthDate ? c.birthDate.toISOString().slice(0, 10) : null,
                    photoUrl: c.photoUrl,
                    note: c.note,
                    ageLabel: ageLabel(c.birthDate),
                    firsts: c._count.milestones,
                  }}
                />
              ))
            )}
          </div>

          <Card className="h-fit min-w-0 p-8">
            <Eyebrow className="mb-4">Add a child</Eyebrow>
            <ChildForm />
          </Card>
        </div>
      </main>
    </>
  );
}
