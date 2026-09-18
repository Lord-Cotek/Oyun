import { type Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getActiveMembership } from "@/lib/data";
import { SiteHeader } from "@/components/SiteHeader";
import { PageHero } from "@/components/ui/PageHero";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Icon } from "@/components/ui/Icon";
import {
  search,
  roomsSearched,
  whenWritten,
  MIN_QUERY,
  type SearchHit,
} from "@/lib/search";

export const metadata: Metadata = { title: "Search" };

/**
 * One box for the whole journey.
 *
 * This is a route, not a modal, on purpose: a search you can bookmark, send to
 * your husband, and reach with the back button is worth more than one that
 * evaporates when you look away. The form is a plain GET, so it works before
 * any script arrives and on a phone with a bad signal.
 */
export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in?callbackUrl=/search");
  const active = await getActiveMembership(session.user.id);
  if (!active) redirect("/onboarding");

  const q = (searchParams.q ?? "").trim();
  const ctx = {
    journeyId: active.journey.id,
    userId: session.user.id,
    role: active.role,
  };

  const tooShort = q.length > 0 && q.length < MIN_QUERY;
  const hits = tooShort || !q ? [] : await search(q, ctx);
  const rooms = roomsSearched(ctx);
  const isMother = active.role === "MOTHER";

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-shell px-6 pb-10">
        <PageHero
          compact
          eyebrow="Search"
          title="Find what you wrote."
          lede="Everything written on this journey, in one place — and nothing you could not already reach."
        />

        <form method="get" action="/search" role="search" className="mt-6">
          <label htmlFor="q" className="sr-only">
            What are you looking for?
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Icon
                name="search"
                size={18}
                aria-hidden="true"
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
              />
              <input
                id="q"
                name="q"
                type="search"
                defaultValue={q}
                autoFocus
                autoComplete="off"
                placeholder="A name, a word, a chapter…"
                className="w-full rounded-xl border border-border bg-surface py-3 pl-11 pr-4 text-ink placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25"
              />
            </div>
            <button
              type="submit"
              className="shrink-0 rounded-xl bg-accent px-5 py-3 font-mono text-xs uppercase tracking-widest text-white transition-opacity hover:opacity-90"
            >
              Search
            </button>
          </div>
        </form>

        {!q && <Blank rooms={rooms} isMother={isMother} />}
        {tooShort && (
          <p className="prose-serif-sm mt-8 max-w-prose text-muted">
            A little more to go on — {MIN_QUERY} letters at least. One letter
            would match nearly everything you have written.
          </p>
        )}
        {q && !tooShort && hits.length === 0 && (
          <Nothing q={q} rooms={rooms} isMother={isMother} />
        )}

        {hits.length > 0 && (
          <>
            <p className="prose-serif-sm mt-8 text-muted">
              {hits.length} {hits.length === 1 ? "thing" : "things"} mentioning{" "}
              <span className="text-ink">{q}</span>, newest first.
            </p>
            <ul className="mt-4 space-y-2.5">
              {hits.map((h) => (
                <li key={`${h.kind}-${h.id}`}>
                  <Result hit={h} q={q} />
                </li>
              ))}
            </ul>
            <Boundaries isMother={isMother} />
          </>
        )}
      </main>
    </>
  );
}

/** One result: where it came from, what it says, and when. */
function Result({ hit, q }: { hit: SearchHit; q: string }) {
  return (
    <Link
      href={hit.href}
      className="group block rounded-xl border border-border bg-surface px-4 py-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent hover:bg-accent/[0.05]"
    >
      <div className="flex items-baseline justify-between gap-3">
        <span className="font-serif text-[1.05rem] leading-snug text-ink">
          <Marked text={hit.title} q={q} />
        </span>
        <span className="shrink-0 font-mono text-[0.6rem] uppercase tracking-widest text-muted">
          {hit.room}
        </span>
      </div>
      <p className="prose-serif-xs mt-1.5 text-muted">
        <Marked text={hit.snippet} q={q} />
      </p>
      <p className="mt-2 font-mono text-[0.62rem] uppercase tracking-widest text-muted/70">
        {whenWritten(hit.at)}
        {hit.who ? ` · ${hit.who}` : ""}
      </p>
    </Link>
  );
}

/**
 * The searched-for words, picked out of the text. Split on the term rather
 * than rewriting the string, so nothing a family wrote can ever be interpreted
 * as markup.
 */
function Marked({ text, q }: { text: string; q: string }) {
  const lower = text.toLowerCase();
  const needle = q.toLowerCase();
  const parts: { s: string; hit: boolean }[] = [];
  let i = 0;
  for (;;) {
    const at = lower.indexOf(needle, i);
    if (at < 0 || !needle) {
      parts.push({ s: text.slice(i), hit: false });
      break;
    }
    if (at > i) parts.push({ s: text.slice(i, at), hit: false });
    parts.push({ s: text.slice(at, at + needle.length), hit: true });
    i = at + needle.length;
  }
  return (
    <>
      {parts.map((p, n) =>
        p.hit ? (
          <mark key={n} className="rounded bg-accent/20 px-0.5 text-ink">
            {p.s}
          </mark>
        ) : (
          <span key={n}>{p.s}</span>
        ),
      )}
    </>
  );
}

/** Before anything has been typed: what this box actually reaches. */
function Blank({ rooms, isMother }: { rooms: string[]; isMother: boolean }) {
  return (
    <div className="mt-8">
      <Eyebrow className="mb-2">What this searches</Eyebrow>
      <p className="prose-serif-sm max-w-prose text-muted">{rooms.join(" · ")}</p>
      <p className="prose-serif-sm mt-4 max-w-prose text-muted">
        Try a word you remember writing, a midwife&rsquo;s name, or a book of
        the Bible. Searching <span className="text-ink">scan</span> will find
        the appointment, the diary entry and the prayer from that week,
        together.
      </p>
      <Boundaries isMother={isMother} />
    </div>
  );
}

/** Nothing found — say what was looked through, so the answer means something. */
function Nothing({
  q,
  rooms,
  isMother,
}: {
  q: string;
  rooms: string[];
  isMother: boolean;
}) {
  return (
    <div className="mt-8">
      <p className="prose-serif-sm max-w-prose text-muted">
        Nothing mentions <span className="text-ink">{q}</span>. Searched{" "}
        {rooms.length} rooms: {rooms.join(" · ")}.
      </p>
      <p className="prose-serif-sm mt-3 max-w-prose text-muted">
        Whole words only — <span className="text-ink">pray</span> will not find{" "}
        <span className="text-ink">praying</span> unless the letters run
        together. Try a shorter piece of the word.
      </p>
      <Boundaries isMother={isMother} />
    </div>
  );
}

/**
 * What search does not reach, said plainly.
 *
 * A family that cannot see why something is missing will assume it is broken,
 * or worse, assume it is not missing. Both are private by design, and naming
 * them here is part of keeping that promise visible.
 */
function Boundaries({ isMother }: { isMother: boolean }) {
  return (
    <div className="mt-10 rounded-xl border border-border bg-bg px-4 py-3.5">
      <Eyebrow className="mb-1.5">Not searched</Eyebrow>
      <p className="prose-serif-xs max-w-prose text-muted">
        {isMother ? (
          <>
            Your care journal is searched, and only ever by you — not by your
            husband, not by anyone in the circle.{" "}
          </>
        ) : (
          <>
            Her care journal is hers alone and is never searched by anyone else.{" "}
          </>
        )}
        Remembrances are not searched either: what a family writes after a loss
        is not something to meet by accident, so it stays on{" "}
        <Link
          href="/journey"
          className="text-ink underline decoration-border underline-offset-4"
        >
          the journey
        </Link>
        , where you go to find it. The weekly liturgy and the guide are not
        searched — those are Oyun&rsquo;s words, not yours.
      </p>
    </div>
  );
}
