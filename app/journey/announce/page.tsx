import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getActiveMembership } from "@/lib/data";
import { getAnnouncement, liveShareToken, toData } from "@/lib/announcement-db";
import { BIRTH_VERSES, type AnnouncementData } from "@/lib/announcement";
import { sharePath } from "@/lib/post-share";
import { SiteHeader } from "@/components/SiteHeader";
import { BackLink } from "@/components/ui/BackLink";
import { AnnouncementEditor } from "@/components/announce/AnnouncementEditor";

export const metadata: Metadata = { title: "Announce the birth", robots: { index: false } };

const first = (n: string | null | undefined) => n?.trim().split(/\s+/)[0] ?? "";

/** The announcement, made or changed — for the two who keep the journey. */
export default async function AnnouncePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in?callbackUrl=/journey/announce");
  const active = await getActiveMembership(session.user.id);
  if (!active) redirect("/onboarding");
  if (active.role !== "MOTHER" && active.role !== "PARTNER") redirect("/journey");
  const j = active.journey;

  const birth = await prisma.milestone.findFirst({
    where: { journeyId: j.id, kind: "BIRTH" },
    orderBy: { occurredAt: "desc" },
    select: { occurredAt: true },
  });

  if (!birth) {
    return (
      <>
        <SiteHeader active="journey" />
        <main className="mx-auto max-w-xl px-6 pb-12">
          <BackLink href="/journey">Back to your journey</BackLink>
          <h1 className="mt-6 font-serif text-3xl text-ink">Announce the birth</h1>
          <p className="mt-3 prose-serif-sm text-muted">
            Once the little one has arrived, record the birth from your journey page — then come back here to make the card.
          </p>
          <Link href="/journey" className="mt-6 inline-block font-mono text-xs text-accent underline underline-offset-4">
            Go to your journey →
          </Link>
        </main>
      </>
    );
  }

  const [row, children, partner] = await Promise.all([
    getAnnouncement(j.id),
    prisma.child.findMany({ where: { journeyId: j.id }, orderBy: { createdAt: "asc" }, select: { name: true, birthDate: true } }),
    prisma.membership.findFirst({ where: { journeyId: j.id, role: "PARTNER" }, select: { user: { select: { name: true } } } }),
  ]);

  const stored = row ? toData(row) : null;
  // A first draft from what the journey already knows: each child's name, each
  // word of it as a name to give a meaning to (the surname left out when there
  // is one), the day they came, and the two of them signing it.
  const signedAs = [first(j.owner.name), first(partner?.user.name)].filter(Boolean).join(" & ") || null;
  const babies = (children.length ? children.map((c) => c.name) : [j.babyName ?? ""]).map((full) => {
    const words = full.trim().split(/\s+/).filter(Boolean);
    const given = words.length > 2 ? words.slice(0, -1) : words.length === 2 ? words.slice(0, 1) : words;
    return { fullName: full.trim(), names: (given.length ? given : [""]).map((name) => ({ name, meaning: "" })) };
  });
  const bornOn = (children.find((c) => c.birthDate)?.birthDate ?? birth.occurredAt).toISOString().slice(0, 10);
  const initial: AnnouncementData = stored ?? {
    babies,
    bornOn,
    timeOfBirth: null,
    weight: null,
    place: null,
    message: null,
    signedAs,
    // No verse for someone who chose Oyun without religious content —
    // lib/voice.ts. The editor does not offer one to them either.
    verseRef: session.user.voice === "GENERAL" ? null : BIRTH_VERSES[0].ref,
    photoUrls: [],
    style: "dawn",
  };
  const token = row?.postId ? await liveShareToken(row.postId) : null;

  return (
    <>
      <SiteHeader active="journey" />
      <main className="mx-auto max-w-shell px-6 pb-16">
        <BackLink href="/journey">Back to your journey</BackLink>
        <p className="eyebrow mb-2 mt-6 text-accent">Tell people</p>
        <h1 className="font-serif text-3xl leading-snug text-ink sm:text-4xl">
          {stored ? "Your announcement" : "Announce the birth"}
        </h1>
        <p className="mb-8 mt-2 max-w-prose prose-serif-sm text-muted">
          A card with their names and what each one means, the day, your photographs and your own words. Your circle sees it
          in Life; anyone else gets a private link — where they can send a word of welcome and ask to join your circle.
        </p>
        <AnnouncementEditor
          initial={initial}
          link={token ? sharePath(token) : null}
          general={session.user.voice === "GENERAL"}
        />
      </main>
    </>
  );
}
