import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getActiveMembership } from "@/lib/data";
import { isHousehold } from "@/lib/roles";
import { letterOpenScope } from "@/lib/letters-seal";
import { letterHref } from "@/lib/letter-access";
import { milestoneTitle } from "@/lib/firsts";
import { appointmentTitle } from "@/lib/appointments";
import { SiteHeader } from "@/components/SiteHeader";
import { BackLink } from "@/components/ui/BackLink";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Avatar } from "@/components/ui/Avatar";
import { PhotoGrid } from "@/components/feed/PhotoGrid";

export function generateMetadata(): Metadata {
  return { title: "A child", robots: { index: false, follow: false } };
}

/** "4 months, 2 days" — how old, exactly, for a first or for today. */
function exactAge(birth: Date, at: Date): string | null {
  if (at.getTime() < birth.getTime()) return null;
  let months = (at.getUTCFullYear() - birth.getUTCFullYear()) * 12 + (at.getUTCMonth() - birth.getUTCMonth());
  let anchor = new Date(Date.UTC(birth.getUTCFullYear(), birth.getUTCMonth() + months, birth.getUTCDate()));
  if (anchor.getTime() > at.getTime()) {
    months -= 1;
    anchor = new Date(Date.UTC(birth.getUTCFullYear(), birth.getUTCMonth() + months, birth.getUTCDate()));
  }
  const days = Math.floor((at.getTime() - anchor.getTime()) / 86_400_000);
  if (months >= 24) {
    const y = Math.floor(months / 12);
    return `${y} year${y === 1 ? "" : "s"}`;
  }
  const parts = [];
  if (months > 0) parts.push(`${months} month${months === 1 ? "" : "s"}`);
  if (days > 0 || months === 0) parts.push(`${days} day${days === 1 ? "" : "s"}`);
  return parts.join(", ");
}

const fmt = (d: Date) => d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

/**
 * One child, in one place: their firsts, their photographs, the letters
 * written to them, and their own checks. The two of them only — the same
 * people the Nursery is for. A sealed letter is listed only once it opens.
 */
export default async function OneChild({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) redirect(`/sign-in?callbackUrl=/child/${params.id}`);
  const active = await getActiveMembership(session.user.id);
  if (!active) redirect("/onboarding");
  if (!isHousehold(active.role)) redirect("/journey");

  const child = await prisma.child.findFirst({ where: { id: params.id, journeyId: active.journey.id } });
  if (!child) notFound();

  const [firsts, letters, checks] = await Promise.all([
    prisma.milestone.findMany({
      where: { journeyId: active.journey.id, childId: child.id },
      orderBy: { occurredAt: "desc" },
      take: 100,
    }),
    prisma.letter.findMany({
      where: { journeyId: active.journey.id, childId: child.id, AND: [letterOpenScope(session.user.id)] },
      orderBy: { createdAt: "desc" },
      take: 50,
      include: { author: { select: { name: true } } },
    }),
    // Their own checks. Not tied to one child in the book, so only shown
    // where there is one child to be sure they are theirs.
    prisma.child.count({ where: { journeyId: active.journey.id } }).then((n) =>
      n === 1
        ? prisma.appointment.findMany({
            where: { journeyId: active.journey.id, kind: { in: ["BABY_CHECK", "IMMUNISATION"] }, cancelledAt: null },
            orderBy: { at: "desc" },
            take: 10,
            select: { id: true, kind: true, title: true, at: true, attendedAt: true },
          })
        : [],
    ),
  ]);

  const born = child.birthDate && child.birthDate.getTime() <= Date.now() ? child.birthDate : null;
  const age = born ? exactAge(born, new Date()) : null;
  const photoPosts = firsts
    .filter((f) => f.photoUrls.length > 0)
    .map((f) => ({
      id: f.id,
      body: milestoneTitle(f.kind, f.title),
      author: child.name,
      when: fmt(f.occurredAt),
      media: f.photoUrls.map((url) => ({ url, type: "image" as const })),
    }));

  return (
    <>
      <SiteHeader active="nursery" />
      <main className="mx-auto max-w-shell px-6 pb-10">
        <BackLink href="/child">Back to the Nursery</BackLink>

        <div className="mt-4 flex items-center gap-4">
          <Avatar name={child.name} photoUrl={child.photoUrl} tone="accent2" size={72} />
          <div className="min-w-0">
            <h1 className="font-serif text-3xl leading-tight text-ink">{child.name}</h1>
            <p className="mt-1 font-mono text-xs text-muted">
              {born ? `Born ${fmt(born)}${age ? ` · ${age} old` : ""}` : "On the way"}
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <div className="min-w-0 space-y-4">
            <Card>
              <Eyebrow className="mb-4">Their firsts</Eyebrow>
              {firsts.length === 0 ? (
                <p className="prose-serif-sm text-muted">
                  None kept yet. <Link href="/firsts" className="text-accent underline underline-offset-4">Keep a first →</Link>
                </p>
              ) : (
                <ol className="space-y-3">
                  {firsts.map((f) => (
                    <li key={f.id} className="rounded-lg border border-border bg-bg/50 p-3">
                      <p className="font-serif text-base text-ink">{milestoneTitle(f.kind, f.title)}</p>
                      <p className="mt-0.5 font-mono text-[0.68rem] text-muted">
                        {fmt(f.occurredAt)}
                        {born && exactAge(born, f.occurredAt) ? ` · at ${exactAge(born, f.occurredAt)}` : ""}
                      </p>
                      {f.note && <p className="mt-1.5 prose-serif-xs text-muted">{f.note}</p>}
                    </li>
                  ))}
                </ol>
              )}
            </Card>

            {photoPosts.length > 0 && (
              <Card>
                <Eyebrow className="mb-4">Photographs</Eyebrow>
                <PhotoGrid posts={photoPosts} />
              </Card>
            )}
          </div>

          <div className="min-w-0 space-y-4">
            <Card>
              <Eyebrow className="mb-4">Letters to {child.name.split(" ")[0]}</Eyebrow>
              {letters.length === 0 ? (
                <p className="prose-serif-sm text-muted">
                  None yet. <Link href="/letters" className="text-accent underline underline-offset-4">Write one →</Link>
                </p>
              ) : (
                <ul className="space-y-2">
                  {letters.map((l) => (
                    <li key={l.id}>
                      <Link href={letterHref(l.id)} className="block rounded-lg border border-border bg-bg/50 p-3 transition-colors hover:border-accent">
                        <p className="line-clamp-2 prose-serif-sm text-ink">{l.body}</p>
                        <p className="mt-1 font-mono text-[0.62rem] uppercase tracking-widest text-muted">
                          {l.author?.name?.split(" ")[0] ?? "A parent"} · {fmt(l.createdAt)}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </Card>

            {checks.length > 0 && (
              <Card>
                <Eyebrow className="mb-4">Checks and jabs</Eyebrow>
                <ul className="space-y-2">
                  {checks.map((a) => (
                    <li key={a.id} className="flex items-baseline justify-between gap-3 font-mono text-xs">
                      <span className="text-ink">{appointmentTitle(a.kind, a.title)}</span>
                      <span className="shrink-0 text-muted">
                        {fmt(a.at)}
                        {a.attendedAt ? " · done" : ""}
                      </span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
