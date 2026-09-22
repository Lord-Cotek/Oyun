import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import {
  getPublicRegistry,
  memberClaimToken,
  readerTokenFor,
} from "@/lib/registry-db";
import { auth } from "@/lib/auth";
import { OyunMark } from "@/components/ui/OyunMark";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { GuestItem } from "@/components/registry/GuestItem";
import { ShipReveal } from "@/components/registry/ShipReveal";

/**
 * The registry, as somebody who is not in this app sees it.
 *
 * This is the second page in Oyun a person without an account is meant to act
 * on, and the same two things are true of it as of an invitation:
 *
 *  1. It shows the list, and NOTHING else about the family. Every word on
 *     this page was typed onto this registry on purpose. There is no due
 *     date, no baby's name unless she put one in the title, no photograph
 *     from the journey, no member list, and no link into the app. The
 *     boundary is lib/registry-db.ts, which selects its fields one by one, so
 *     a column added to the schema cannot quietly turn up here.
 *
 *     The one exception is the way back, and it is not really an exception:
 *     once the family opens the list to their circle, this page IS the
 *     circle's registry — they are sent here from /registry, and without a
 *     header or a tab bar they arrive at a dead end with only the browser's
 *     back button. So a single "Back to Oyun" appears, and only when the
 *     reader is signed in AND already a member of this journey. A stranger
 *     is told nothing new: no account, no membership, no link. See `insider`.
 *
 *  2. It is never indexed. This page says noindex for itself, app/robots.ts
 *     says so for the whole /r path, and the address is unguessable to start
 *     with — eighteen bytes from node:crypto.
 *
 * ── On money ─────────────────────────────────────────────────────────────
 * Nothing is bought here and nothing is paid here. Every link leaves for the
 * shop that sells the thing. Oyun never sees a card, never holds a penny, and
 * takes no cut — which is said out loud at the bottom of the page, because a
 * stranger being asked to spend money deserves to know exactly what the app
 * in the middle is doing. It is doing a list.
 */

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const r = await getPublicRegistry(params.slug, null);
  if (!r) return { title: "Registry", robots: { index: false, follow: false } };
  return {
    title: r.title,
    description: `A registry from ${r.hostName}.`,
    robots: { index: false, follow: false },
    openGraph: {
      title: r.title,
      description: `A registry from ${r.hostName}.`,
      type: "website",
    },
    twitter: { card: "summary_large_image", title: r.title },
  };
}

export default async function PublicRegistryPage({
  params,
}: {
  params: { slug: string };
}) {
  // Resolved the same way the claim action does — a signed-in member is
  // themselves, everybody else is their browser. See readerTokenFor.
  const session = await auth();
  const token = await readerTokenFor(params.slug, session);
  const r = await getPublicRegistry(params.slug, token);
  if (!r) notFound();

  // Only true for somebody signed in who is already in this journey —
  // readerTokenFor mints that token after checking the membership, and falls
  // back to the guest cookie otherwise. Compared rather than sniffed for a
  // prefix, so a cookie can never be mistaken for a member.
  const insider =
    !!session?.user?.id && token === memberClaimToken(session.user.id);

  // Every kind gets a section. A kind with no section is an item that exists
  // in her room and nowhere a guest can see it — which is how the first
  // version of this page silently swallowed the funds.
  const things = r.items.filter((i) => i.kind === "THING");
  const help = r.items.filter((i) => i.kind === "HELP");
  const funds = r.items.filter((i) => i.kind === "CASH");
  const lists = r.items.filter((i) => i.kind === "LIST");
  const mine = r.items.filter((i) => i.mine > 0).length;

  return (
    <main className="mx-auto max-w-2xl px-6 py-10 pb-20">
      {insider && (
        <Link
          href="/journey"
          className="-ml-2 mb-6 inline-flex min-h-11 items-center gap-2 rounded-lg px-2 font-mono text-[0.62rem] uppercase tracking-widest text-muted transition-colors hover:text-ink"
        >
          <span aria-hidden="true">&larr;</span> Back to Oyun
        </Link>
      )}

      <div className="flex items-center gap-2.5">
        <OyunMark size={24} className="text-ink" />
        <span className="font-mono text-[0.62rem] uppercase tracking-widest text-muted">
          A registry
        </span>
      </div>

      <h1 className="mt-6 font-serif text-4xl leading-tight text-ink md:text-5xl">
        {r.title}
      </h1>
      <p className="mt-2 font-mono text-[0.68rem] uppercase tracking-widest text-muted">
        From {r.hostName}
      </p>

      {r.message && (
        <p className="mt-5 whitespace-pre-wrap border-l-2 border-border pl-4 font-serif text-base leading-relaxed text-ink">
          {r.message}
        </p>
      )}

      {r.closed ? (
        <p className="mt-6 rounded-xl border border-border bg-bg p-4 prose-serif-sm text-muted">
          This registry is finished — thank you to everybody who gave. It is
          kept here as a record.
        </p>
      ) : (
        <p className="mt-6 prose-serif-sm text-muted">
          Tap <span className="text-ink">I&rsquo;m getting this</span> on
          anything you take, so nobody buys the same cot twice. You do not need
          an account, and nothing is paid here — every link goes to the shop
          itself.
          {mine > 0 && (
            <>
              {" "}
              <span className="text-accent">
                You have taken {mine} {mine === 1 ? "thing" : "things"}.
              </span>
            </>
          )}
        </p>
      )}

      {/*
        Near the top, because somebody who came here to buy a cot wants the
        address before they start, not after they have scrolled past forty
        cards. Only when there is something to post: a list of nothing but
        meals and a fund has no parcel in it, and the address should not be
        offered to guests who have no use for it. Not on a finished registry
        either — by then nothing more is coming.
      */}
      {!r.closed && r.shipsTo && things.length > 0 && (
        <ShipReveal slug={r.slug} reach={r.shipReach} />
      )}

      {r.items.length === 0 && (
        <p className="mt-8 prose-serif-sm text-muted">
          Nothing on the list yet. Do check back.
        </p>
      )}

      {things.length > 0 && (
        <section className="mt-10">
          <Eyebrow className="mb-4">Things</Eyebrow>
          <ul className="space-y-3">
            {things.map((i) => (
              <li key={i.id}>
                <GuestItem
                  slug={r.slug}
                  item={i}
                  closed={r.closed}
                  shipsTo={r.shipsTo}
                  shipReach={r.shipReach}
                />
              </li>
            ))}
          </ul>
        </section>
      )}

      {help.length > 0 && (
        <section className="mt-10">
          <Eyebrow className="mb-2">A hand</Eyebrow>
          <p className="mb-4 prose-serif-sm text-muted">
            Not things, and usually the ones remembered longest.
          </p>
          <ul className="space-y-3">
            {help.map((i) => (
              <li key={i.id}>
                <GuestItem
                  slug={r.slug}
                  item={i}
                  closed={r.closed}
                  shipsTo={r.shipsTo}
                  shipReach={r.shipReach}
                />
              </li>
            ))}
          </ul>
        </section>
      )}

      {funds.length > 0 && (
        <section className="mt-10">
          <Eyebrow className="mb-2">Money towards it</Eyebrow>
          <p className="mb-4 prose-serif-sm text-muted">
            Sent straight to the family. Nothing is paid through this page, and
            nobody here takes a cut. Any amount at all, and nothing is expected.
          </p>
          <ul className="space-y-3">
            {funds.map((i) => (
              <li key={i.id}>
                <GuestItem
                  slug={r.slug}
                  item={i}
                  closed={r.closed}
                  shipsTo={r.shipsTo}
                  shipReach={r.shipReach}
                />
              </li>
            ))}
          </ul>
        </section>
      )}

      {lists.length > 0 && (
        <section className="mt-10">
          <Eyebrow className="mb-2">Kept elsewhere</Eyebrow>
          <p className="mb-4 prose-serif-sm text-muted">
            Whole lists that live on another site. The shop keeps its own
            record of what has been bought from them.
          </p>
          <ul className="space-y-3">
            {lists.map((i) => (
              <li key={i.id}>
                <GuestItem
                  slug={r.slug}
                  item={i}
                  closed={r.closed}
                  shipsTo={r.shipsTo}
                  shipReach={r.shipReach}
                />
              </li>
            ))}
          </ul>
        </section>
      )}

      <footer className="mt-14 border-t border-border pt-5">
        <p className="prose-serif-xs text-muted">
          Made with Oyun. No money passes through this page — every link goes
          to the shop that sells the thing, and nobody here takes a cut. Your
          name is only ever seen by the family who made this list.
        </p>
        {/* Again at the bottom: a long list is a long way back to the top. */}
        {insider && (
          <Link
            href="/journey"
            className="-ml-2 mt-3 inline-flex min-h-11 items-center gap-2 rounded-lg px-2 font-mono text-[0.62rem] uppercase tracking-widest text-muted transition-colors hover:text-ink"
          >
            <span aria-hidden="true">&larr;</span> Back to Oyun
          </Link>
        )}
      </footer>
    </main>
  );
}
