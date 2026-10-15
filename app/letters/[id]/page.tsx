import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getActiveMembership, getOneLetter } from "@/lib/data";
import { isHousehold } from "@/lib/roles";
import { SiteHeader } from "@/components/SiteHeader";
import { Card } from "@/components/ui/Card";
import { Reactions } from "@/components/Reactions";
import { LetterReplies } from "@/components/letters/LetterReplies";

/**
 * One letter, on a page of its own.
 *
 * ── Why ──────────────────────────────────────────────────────────────────
 * Same reason a post has one. `/letters#letter-…` needs four things to line
 * up before it works — the right tab open, the letter inside the page's
 * limit, an anchor drawn for it, and the scroll surviving whatever loads
 * afterwards — and it was failing at least two of them: letters older than
 * the page limit were never on the page, and a letter to the baby had no
 * anchor at all. So the notification opened the top of the room and left the
 * reader to find it.
 *
 * None of those four exist here.
 *
 * ── Who may open it ──────────────────────────────────────────────────────
 * The same two people the room is for. Letters are the one place in this app
 * the circle cannot follow, and a link is not a way round that: anybody else
 * is sent to the journey exactly as they are at /letters.
 */

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  // Deliberately says nothing about the letter. This title reaches a phone's
  // tab list and a browser's history, which are places a letter between two
  // people has no business appearing.
  return { title: "A letter", robots: { index: false, follow: false } };
}

export default async function OneLetter({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect(`/sign-in?callbackUrl=/letters/${params.id}`);
  }
  const active = await getActiveMembership(session.user.id);
  if (!active) redirect("/onboarding");
  if (!isHousehold(active.role)) redirect("/journey");

  const letter = await getOneLetter(
    params.id,
    active.journey.id,
    session.user.id,
  );
  if (!letter) notFound();

  const mine = letter.authorId === session.user.id;
  const who = mine
    ? "You"
    : letter.authorName?.trim().split(/\s+/)[0] || "Someone";

  return (
    <>
      <SiteHeader active="letters" />
      <main className="mx-auto max-w-shell px-6 pb-10">
        <Link
          href="/letters"
          className="mt-6 inline-flex min-h-11 items-center font-mono text-[0.68rem] uppercase tracking-widest text-muted hover:text-accent"
        >
          ← All letters
        </Link>

        <div className="mt-4 max-w-2xl">
          <Card>
            <div
              className={`rounded-lg border p-4 ${
                mine
                  ? "border-accent/30 bg-accent/[0.05]"
                  : "border-border bg-bg"
              }`}
            >
              <p className="whitespace-pre-wrap font-serif text-base leading-relaxed text-ink">
                {letter.body}
              </p>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                <p className="font-mono text-[0.68rem] uppercase tracking-widest text-muted">
                  {who} ·{" "}
                  {new Date(letter.createdAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                  {letter.toBaby ? " · to the baby" : ""}
                </p>
                <Reactions
                  targetType="LETTER"
                  targetId={letter.id}
                  initial={letter.reactions}
                  align="end"
                />
              </div>
              <LetterReplies
                letterId={letter.id}
                replies={letter.replies}
                viewerId={session.user.id}
                fallbackName={who}
              />
            </div>
          </Card>
        </div>
      </main>
    </>
  );
}
