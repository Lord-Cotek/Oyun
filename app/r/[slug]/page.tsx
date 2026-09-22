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
import { ListControls } from "@/components/registry/ListControls";
import { priceValue, remaining } from "@/lib/registry";
import type { PublicItem } from "@/lib/registry-db";

/**
 * What each card needs in order to be moved or hidden without being touched
 * by React: where it sits in every order the reader can ask for, and whether
 * it is spoken for.
 *
 * What counts as gone is isGone above, used by the count as well, so the
 * number over the list and the cards under it can never disagree.
 */
function isGone(item: PublicItem): boolean {
  // Neither a whole list nor a fund is ever "taken" — several people may give
  // towards the same cot, and several may buy from the same Amazon list. And
  // a card this reader took themselves is never treated as gone: hiding it
  // would take away the only way they have of handing it back.
  if (item.kind === "LIST" || item.kind === "CASH") return false;
  if (item.mine > 0) return false;
  return remaining(item.quantity, item.claimed) <= 0;
}

function rowProps(item: PublicItem) {
  return {
    ...(isGone(item) ? { "data-gone": "" } : {}),
    style: {
      "--o-low": item.ranks.low,
      "--o-high": item.ranks.high,
      "--o-recent": item.ranks.recent,
    } as React.CSSProperties,
  };
}

/**
 * Grid or list, in what order, and whether to show what is gone — all three
 * settled before the page paints.
 *
 * The same device as the theme in app/layout.tsx and for the same reason: the
 * reader's choice lives in their own browser, the server cannot know it, and a
 * list that rearranges itself into a grid one frame after it appears looks
 * broken. A blocking script at the top of the page puts the answer on <html>
 * and the CSS in globals.css does the rest.
 *
 * It is here rather than in the root layout because this is the only page it
 * means anything on, and every other page in the app should not be paying for
 * it. The defaults are grid, the family's own order, and showing everything —
 * anything it cannot read falls back to those rather than to nothing.
 */
const viewInit = `(function(){var r=document.documentElement;var v='grid',s='needed',t='show';try{var a=localStorage.getItem('oyun-registry-view');if(a==='list')v='list';var b=localStorage.getItem('oyun-registry-sort');if(b==='low'||b==='high'||b==='recent')s=b;if(localStorage.getItem('oyun-registry-taken')==='hide')t='hide';}catch(e){}r.setAttribute('data-rview',v);r.setAttribute('data-sort',s);r.setAttribute('data-taken',t);})();`;

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
  // Offering "cheapest first" on a list where one thing has a price is a
  // control that cannot do anything. See ListControls.
  const pricedItems = r.items.filter((i) => priceValue(i.price) !== null).length;
  // The same rule the cards are hidden by, so the number and the list can
  // never disagree.
  const stillNeeded = r.items.filter((i) => !isGone(i)).length;

  return (
    <main className="mx-auto max-w-2xl px-6 py-10 pb-20">
      <script dangerouslySetInnerHTML={{ __html: viewInit }} />
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
        Only worth offering once there is enough on the list for the shape to
        matter. Two cards look the same either way, and a control that changes
        nothing visible is a control that makes a reader doubt they pressed it.
      */}
      {r.items.length > 2 && <ListControls
          canSortByPrice={pricedItems > 1}
          total={r.items.length}
          stillNeeded={stillNeeded}
        />}

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
        <section className="reg-section mt-10">
          <Eyebrow className="mb-4">Things</Eyebrow>
          <ul className="reg-items">
            {things.map((i) => (
              <li key={i.id} {...rowProps(i)}>
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
        <section className="reg-section mt-10">
          <Eyebrow className="mb-2">A hand</Eyebrow>
          <p className="mb-4 prose-serif-sm text-muted">
            Not things, and usually the ones remembered longest.
          </p>
          <ul className="reg-items">
            {help.map((i) => (
              <li key={i.id} {...rowProps(i)}>
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
        <section className="reg-section mt-10">
          <Eyebrow className="mb-2">Money towards it</Eyebrow>
          <p className="mb-4 prose-serif-sm text-muted">
            Sent straight to the family. Nothing is paid through this page, and
            nobody here takes a cut. Any amount at all, and nothing is expected.
          </p>
          <ul className="reg-items">
            {funds.map((i) => (
              <li key={i.id} {...rowProps(i)}>
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
        <section className="reg-section mt-10">
          <Eyebrow className="mb-2">Kept elsewhere</Eyebrow>
          <p className="mb-4 prose-serif-sm text-muted">
            Whole lists that live on another site. The shop keeps its own
            record of what has been bought from them.
          </p>
          <ul className="reg-items">
            {lists.map((i) => (
              <li key={i.id} {...rowProps(i)}>
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
