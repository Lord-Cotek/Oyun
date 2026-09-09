import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getActiveMembership } from "@/lib/data";
import { chapterRef } from "@/lib/bible";
import { isHousehold } from "@/lib/roles";
import { SiteHeader } from "@/components/SiteHeader";
import { PageHero } from "@/components/ui/PageHero";
import {
  ReflectionJournal,
  type JournalNote,
} from "@/components/worship/ReflectionJournal";
import { updateReflection, deleteReflection } from "@/app/worship/actions";

export const metadata: Metadata = {
  title: "Reflection journal",
  description: "Every reflection your family has written.",
  robots: { index: false },
};

function formatWhen(d: Date): string {
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function JournalPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in?callbackUrl=/journal");
  const active = await getActiveMembership(session.user.id);
  if (!active) redirect("/onboarding");
  // The reflections journal belongs to the household, not the wider circle.
  if (!isHousehold(active.role)) redirect("/journey");

  const rows = await prisma.readingNote.findMany({
    where: {
      journeyId: active.journey.id,
      OR: [{ isPrivate: false }, { authorId: session.user.id }],
    },
    include: { author: { select: { id: true, name: true } } },
    orderBy: { createdAt: "desc" },
  });

  const notes: JournalNote[] = rows.map((n) => ({
    id: n.id,
    passageRef: chapterRef(n.bookSlug, n.chapter),
    authorName: n.author.name ?? "Someone",
    mine: n.authorId === session.user!.id,
    isPrivate: n.isPrivate,
    body: n.body,
    when: formatWhen(n.createdAt),
  }));

  return (
    <>
      <SiteHeader active="worship" />
      <main className="mx-auto max-w-shell px-6 py-10">
        <PageHero
          eyebrow="Reflection journal"
          title="What God has shown you."
          lede={
            notes.length
              ? `${notes.length} reflection${notes.length === 1 ? "" : "s"} across your reading — newest first.`
              : "As you read and reflect, your notes gather here — a family journal through the Scriptures."
          }
        />

        <div className="mt-8">
          {notes.length ? (
            <ReflectionJournal
              notes={notes}
              onUpdate={updateReflection}
              onDelete={deleteReflection}
            />
          ) : (
            <div className="surface-premium rounded-2xl border border-border p-8 text-center">
              <p className="font-mono text-sm leading-relaxed text-muted">
                No reflections yet. Open{" "}
                <Link
                  href="/worship"
                  className="text-accent underline underline-offset-4"
                >
                  today&rsquo;s reading
                </Link>{" "}
                and write the first one.
              </p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
