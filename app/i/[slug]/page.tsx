import type { Metadata } from "next";
import { Linked } from "@/components/ui/Linked";
import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getPublicInvitation, guestCookieName } from "@/lib/invitations-db";
import {
  countSentence,
  headCount,
  longDay,
  timeRange,
} from "@/lib/invitations";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { OyunMark } from "@/components/ui/OyunMark";
import { Arches } from "@/components/ui/Marks";
import { GuestReply } from "@/components/invite/GuestReply";
import { GuestPoll } from "@/components/invite/GuestPoll";
import { AddToMyOyun } from "@/components/invite/AddToMyOyun";
import { auth } from "@/lib/auth";
import { getActiveMembership } from "@/lib/data";
import { isHousehold } from "@/lib/roles";

/**
 * The invitation, as somebody who is not in this app sees it.
 *
 * This is the only page in Oyun a person without an account is meant to act
 * on, so two things are true of it and are worth saying out loud:
 *
 *  1. It shows the day, and NOTHING else about the family. Everything on this
 *     page was typed onto this invitation on purpose. There is no link into
 *     the journey, no name that was not put here, and the household's own
 *     note about the day is not fetched at all — see lib/invitations-db.ts,
 *     which is the whole boundary and selects its fields one by one.
 *
 *  2. It is never indexed. `robots` says so here, app/robots.ts says so for
 *     the whole /i path, and the link is unguessable in the first place.
 */

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const i = await getPublicInvitation(params.slug);
  if (!i) return { title: "Invitation", robots: { index: false, follow: false } };
  const when = [longDay(i.event.at), timeRange(i.event.at, i.event.hasTime, i.event.endsAt)]
    .filter(Boolean)
    .join(", ");
  const desc = [when, i.event.where].filter(Boolean).join(" · ");

  /**
   * The card's address is left to the opengraph-image file convention.
   *
   * It was briefly written out here with a token on it, to force a new
   * address whenever the card changed — and a link sent while that was live
   * got a preview with NO picture at all, which is worse than a stale one.
   * The address was never the right lever: the cache header was, and
   * opengraph-image.tsx now sets its own. Back to the path Next knows.
   */
  return {
    title: i.event.title,
    description: desc,
    robots: { index: false, follow: false },
    openGraph: {
      title: i.event.title,
      description: `${desc} — from ${i.hostName}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: i.event.title,
      description: desc,
    },
  };
}

export default async function InvitationPage({
  params,
}: {
  params: { slug: string };
}) {
  const i = await getPublicInvitation(params.slug);
  if (!i) notFound();

  // Their own reply, recognised by the token their browser kept. Looked up by
  // token and invitation together, so a token from one invitation can never
  // surface somebody's answer to another.
  const token = cookies().get(guestCookieName(params.slug))?.value;
  const mine = token
    ? await prisma.invitationReply.findFirst({
        where: { token, invitation: { slug: params.slug } },
        select: {
          name: true,
          answer: true,
          partySize: true,
          note: true,
          email: true,
          votes: { select: { optionId: true } },
        },
      })
    : null;

  /**
   * Is whoever is reading this already keeping a house on Ìdílé?
   *
   * Asked here and nowhere else on the page. A guest who is not signed in is
   * not prompted to be — the invitation works perfectly without an account and
   * saying otherwise would turn somebody's cousin's dinner into a funnel.
   * This only decides whether one extra button appears for the people it can
   * actually help.
   */
  const viewer = await auth();
  const viewerHouse = viewer?.user?.id
    ? await getActiveMembership(viewer.user.id)
    : null;
  const canCopyToDiary = !!viewerHouse && isHousehold(viewerHouse.role);

  const when = longDay(i.event.at);
  const hours = timeRange(i.event.at, i.event.hasTime, i.event.endsAt);
  const count = headCount(i.replies);
  const coming = i.replies.filter((r) => r.answer === "YES");
  const open = i.state === "open" && !i.event.cancelled;

  return (
    <main className="relative min-h-[100dvh]">
      {/* ── The photograph the host chose ────────────────────────────────
          Full width and above everything, because this is the first thing a
          guest sees and an invitation that opens on a picture reads as an
          invitation rather than as a form.

          Three deliberate things about how it is drawn:

          It escapes the page's own padding, so the picture meets the edges
          of the phone. Inset in a rounded card it would read as an
          attachment to a document; full-bleed it reads as the top of an
          invitation.

          It melts into the page rather than stopping at a line. The gradient
          at its foot runs to the page's own background, so there is no hard
          seam between a photograph somebody took on a phone and the cream
          the rest of this page is set on.

          The arches sit on it, as they do on every band in the app, which is
          what makes a stranger's photograph look like it belongs to Oyun.

          `cancelled` suppresses it: a picture of a happy room above the
          words "this has been called off" is a cruel accident, and the one
          case where the nicest version of this feature is the wrong one. */}
      {i.coverUrl && !i.event.cancelled && (
        <div className="relative h-56 w-full overflow-hidden sm:h-72">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={i.coverUrl}
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-bg via-bg/70 to-transparent" />
          <Arches className="on-band" />
        </div>
      )}

      <div
        className={`mx-auto flex min-h-[100dvh] max-w-2xl flex-col px-6 pb-10 ${
          i.coverUrl && !i.event.cancelled ? "pt-6" : "pt-10"
        }`}
      >
        <Link href="/" className="inline-flex items-center gap-2.5">
          <OyunMark size={28} className="text-ink" />
          <span className="font-serif text-base text-ink">Oyun</span>
        </Link>

        <div className="mt-10">
          <Eyebrow className="mb-4">
            {i.event.cancelled ? "This has been called off" : `From ${i.hostName}`}
          </Eyebrow>

          <h1 className="font-serif text-4xl leading-tight text-ink md:text-5xl">
            {i.event.title}
          </h1>

          <div className="mt-5 space-y-1">
            {i.poll ? (
              <>
                <p className="font-serif text-xl text-ink">
                  {i.options.length} days are being offered
                </p>
                <p className="prose-serif-sm text-muted">
                  The day is not settled yet — that is what they are asking you.
                </p>
              </>
            ) : (
              <p className="font-serif text-xl text-ink">{when}</p>
            )}
            {!i.poll && hours && (
              <p className="font-mono text-sm uppercase tracking-widest text-accent">
                {hours}
              </p>
            )}
            {i.event.where && (
              <p className="prose-serif-sm text-muted">
                <Linked text={i.event.where} />
              </p>
            )}
          </div>

          {/* Whatever the host wrote, with any link in it clickable — a map,
              a shop, a page about the venue. Bare links only, shown as the
              address they actually go to; see lib/linkify.ts for why. */}
          {i.message && (
            <p className="mt-6 whitespace-pre-wrap border-l-2 border-accent/40 pl-5 prose-serif-sm text-ink/90">
              <Linked text={i.message} />
            </p>
          )}

          {/* The thing that decides whether anybody actually turns up. A reply
              is a promise made on a bus; a calendar entry is what reminds
              them the following Saturday. */}
          {!i.event.cancelled && !i.poll && (
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <a
                href={`/i/${i.slug}/ics`}
                className="inline-flex items-center gap-2 rounded-lg border border-border px-3.5 py-2 font-mono text-xs text-ink transition-colors hover:border-accent hover:text-accent"
              >
                Put it in my calendar
              </a>
              {canCopyToDiary && <AddToMyOyun slug={i.slug} />}
            </div>
          )}
        </div>

        <div className="mt-10 rounded-2xl border border-border bg-surface p-6 md:p-8">
          {i.event.cancelled ? (
            <p className="prose-serif-sm text-muted">
              This day has been called off. There is nothing to reply to — do
              speak to {i.hostName} if you need to.
            </p>
          ) : i.state === "past" ? (
            <p className="prose-serif-sm text-muted">
              This day has already been. Thank you for looking.
            </p>
          ) : (
            <>
              <Eyebrow className="mb-4">
                {i.poll ? "Which of these suits you?" : "Can you come?"}
              </Eyebrow>
              {i.poll ? (
                <GuestPoll
                  slug={i.slug}
                  options={i.options}
                  mine={
                    mine
                      ? {
                          name: mine.name,
                          note: mine.note,
                          email: mine.email,
                          optionIds: mine.votes.map((v) => v.optionId),
                        }
                      : null
                  }
                  open={open}
                />
              ) : (
                <GuestReply
                  slug={i.slug}
                  mine={mine}
                  allowPlusOnes={i.allowPlusOnes}
                  open={open}
                />
              )}
              {open && i.repliesBy && (
                <p className="mt-4 font-mono text-[0.68rem] text-muted">
                  They would like to know by {longDay(i.repliesBy)}.
                </p>
              )}
              {open && !i.poll && i.capacity != null && (
                <p className="mt-1 font-mono text-[0.68rem] text-muted">
                  Room for {i.capacity} · {Math.max(0, i.capacity - count.coming)}{" "}
                  still free
                </p>
              )}
            </>
          )}
        </div>

        {i.showGuestList && !i.poll && coming.length > 0 && (
          <div className="mt-6 rounded-2xl border border-border bg-surface/60 p-6">
            <Eyebrow className="mb-3">Who is coming</Eyebrow>
            <p className="mb-3 font-mono text-xs text-muted">
              {countSentence(count)}
            </p>
            <ul className="flex flex-wrap gap-x-4 gap-y-1.5">
              {coming.map((r) => (
                <li key={r.id} className="font-serif text-base text-ink">
                  {r.name}
                  {r.partySize > 1 && (
                    <span className="ml-1 font-mono text-[0.66rem] text-muted">
                      +{r.partySize - 1}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* The page already sits inside the site's own footer, which says what
            Ìdílé is. A second card saying the same thing turned an invitation
            into an advert, which is not what somebody's cousin sent them. One
            quiet line, and the mark at the top, is enough. */}
        <p className="prose-serif-xs mt-10 text-center text-muted">
          An invitation sent with Oyun. No account needed to answer it.
        </p>
      </div>
    </main>
  );
}
