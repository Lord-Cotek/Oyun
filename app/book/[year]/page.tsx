import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getActiveMembership } from "@/lib/data";
import { isHousehold } from "@/lib/roles";
import { postScope } from "@/lib/post-visibility";
import { yearBounds } from "@/lib/story";
import { mediaTypeFromUrl } from "@/lib/feed-query";
import { milestoneTitle } from "@/lib/firsts";
import { SiteHeader } from "@/components/SiteHeader";
import { YearBook } from "@/components/book/YearBook";

export const metadata: Metadata = { title: "Our year", robots: { index: false } };

/**
 * A year of the journey as a book — the two who keep it only. Entries come
 * through the diary's own visibility rule; firsts are the year's milestones.
 * Nothing else: no appointments, moods, letters or check-ins.
 */
export default async function BookPage({ params }: { params: { year: string } }) {
  const year = Number(params.year);
  if (!Number.isInteger(year) || year < 1900 || year > 2200) notFound();
  const session = await auth();
  if (!session?.user?.id) redirect(`/sign-in?callbackUrl=/book/${year}`);
  const active = await getActiveMembership(session.user.id);
  if (!active) redirect("/onboarding");
  if (!isHousehold(active.role)) redirect("/life");
  const j = active.journey;

  const [posts, firsts] = await Promise.all([
    prisma.post.findMany({
      where: { journeyId: j.id, ...postScope(active.role), createdAt: yearBounds(year) },
      orderBy: { createdAt: "asc" },
      take: 1000,
      select: { body: true, mediaUrls: true, imageUrl: true, createdAt: true, author: { select: { name: true } } },
    }),
    prisma.milestone.findMany({
      where: { journeyId: j.id, occurredAt: yearBounds(year) },
      orderBy: { occurredAt: "asc" },
      select: { kind: true, title: true, note: true, occurredAt: true, photoUrls: true, child: { select: { name: true } } },
    }),
  ]);

  const images = (p: { mediaUrls: string[]; imageUrl: string | null }) =>
    (p.mediaUrls.length ? p.mediaUrls : p.imageUrl ? [p.imageUrl] : []).filter((u) => mediaTypeFromUrl(u) === "image");
  const entries = posts.map((p) => ({
    at: p.createdAt.toISOString(),
    author: p.author.name ?? "Someone",
    body: p.body,
    photos: images(p),
  }));
  const cover = j.coverUrl ?? entries.find((e) => e.photos.length)?.photos[0] ?? null;

  return (
    <>
      <SiteHeader active="life" />
      <main className="mx-auto max-w-3xl px-6 pb-16">
        <YearBook
          general={session.user.voice === "GENERAL"}
          title={j.babyName?.trim() || "Our journey"}
          year={year}
          cover={cover}
          entries={entries}
          firsts={firsts.map((f) => ({
            at: f.occurredAt.toISOString(),
            title: milestoneTitle(f.kind, f.title),
            who: f.child?.name.split(/\s+/)[0] ?? null,
            note: f.note,
            photos: f.photoUrls.filter((u) => mediaTypeFromUrl(u) === "image"),
          }))}
          backHref={`/life?year=${year}`}
          backLabel={`Back to ${year} in Life`}
        />
      </main>
    </>
  );
}
