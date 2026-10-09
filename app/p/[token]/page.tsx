import type { Metadata } from "next";
import Link from "next/link";
import {
  getSharedPost,
  countOneView,
  liveShare,
  myHello,
  alreadyAsked,
  helloCookieName,
} from "@/lib/post-share-db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { inAppPath, knownAsker, openPath } from "@/lib/share-open";
import { GuestHello } from "@/components/share/GuestHello";
import { AskToJoin } from "@/components/share/AskToJoin";
import { SharedMedia } from "@/components/share/SharedMedia";
import { sayHello, unsayHello, askToJoin } from "@/app/p/[token]/actions";
import { SHARE_WORDS, OPEN_WORDS } from "@/lib/post-share";
import { KIND_LABEL } from "@/lib/feed";
import { OyunMark } from "@/components/ui/OyunMark";
import { Eyebrow } from "@/components/ui/Eyebrow";

/**
 * One post, for somebody outside the app.
 *
 * ── Never indexed ────────────────────────────────────────────────────────
 * `robots: noindex, nofollow` on every one of these, and it is not a
 * preference. This is a family's child on a public address; it reaches the
 * people it was sent to and stops there. A search engine that had crawled it
 * would keep a copy long after the family closed the link, which would make
 * the Close button a thing that looks like it works and does not.
 *
 * The cost is real — an indexed page would be free reach — and it is the
 * right cost to pay. The reach this feature has is the reach a family chooses
 * to give it by forwarding the link, which is exactly as much as they meant.
 */
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { token: string };
}): Promise<Metadata> {
  const shared = await getSharedPost(params.token);
  const robots = { index: false, follow: false };
  if (!shared) return { title: "This link has been closed", robots };

  // The description is what appears under the card in WhatsApp. It is the
  // post's own first line, which is what the family wrote and meant to send —
  // not a summary the app invented on their behalf.
  const line = shared.body.trim().split("\n")[0].slice(0, 140);
  return {
    title: `${shared.household} shared a moment`,
    description: line,
    robots,
    openGraph: {
      title: `${shared.household} shared a moment`,
      description: line,
      type: "article",
    },
    twitter: { card: "summary_large_image", title: `${shared.household} shared a moment`, description: line },
  };
}

export default async function SharedPost({
  params,
}: {
  params: { token: string };
}) {
  const shared = await getSharedPost(params.token);

  if (!shared) {
    return (
      <Gone />
    );
  }

  const share = await liveShare(params.token);
  const session = await auth();
  const viewerId = session?.user?.id ?? null;

  /**
   * The family never sees this page at all.
   *
   * Somebody in this journey, signed in, goes straight to the post in the
   * diary — where there are real comments and replies, instead of a single
   * line under a note explaining who this family is. See lib/share-open.ts
   * for why this turns on membership rather than on having an account.
   *
   * ── Why this sits above countOneView and not below it ────────────────
   * The number beside a link is the only sense a family has of how far it
   * travelled, and until now the largest thing in it was them: every time
   * the mother checked her own link, or an aunt in the circle opened it
   * twice, the count went up. Leaving before counting makes that number
   * mean what the family always read it as — people outside.
   */
  const inApp = await inAppPath(share, viewerId);
  if (inApp) redirect(inApp);

  // Counted, not awaited — see countOneView.
  countOneView(params.token);

  /**
   * What this particular browser has already done here.
   *
   * The cookie is read but never minted on a plain visit: somebody who only
   * reads the post and leaves is given nothing to carry, and a token appears
   * only when they choose to write something. See guestTokenFor in actions.
   */
  const guestToken = cookies().get(helloCookieName(params.token))?.value ?? "";
  const [mine, asked, me] = share
    ? await Promise.all([
        myHello(share.id, guestToken),
        alreadyAsked(share.journeyId, guestToken, viewerId),
        knownAsker(viewerId),
      ])
    : [null, false, null];

  const when = new Date(shared.postedAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <main className="mx-auto min-h-[100dvh] max-w-2xl px-6 pb-16">
      <header className="flex items-center gap-2 py-6">
        <OyunMark className="h-7 w-7" />
        <span className="font-mono text-[0.68rem] uppercase tracking-widest text-muted">
          Oyun
        </span>
      </header>

      {/* ── The note, above the post and not below it ──────────────────────
          A request that arrives after somebody has already seen, saved and
          forwarded the picture is not a request. See SHARE_WORDS. */}
      <section
        aria-label="How to treat this"
        className="rounded-2xl border border-accent/30 bg-accent/[0.07] p-5"
      >
        <p className="font-serif text-lg leading-snug text-ink">
          {SHARE_WORDS.trustTitle}
        </p>
        <p className="mt-2 prose-serif-sm text-muted">
          {SHARE_WORDS.trustBody(shared.household)}
        </p>
      </section>

      <article className="mt-6 rounded-2xl border border-border bg-surface p-6">
        <div className="mb-3 flex flex-wrap items-baseline gap-2">
          <Eyebrow className="text-muted">
            {KIND_LABEL[shared.kind] ?? "An update"}
          </Eyebrow>
          <span className="font-mono text-[0.62rem] uppercase tracking-widest text-muted">
            · {when}
          </span>
        </div>

        <p className="whitespace-pre-wrap font-serif text-xl leading-relaxed text-ink">
          {shared.body}
        </p>

        <SharedMedia
          media={shared.media}
          alt={`Shared by ${shared.household}`}
        />

        <p className="mt-5 border-t border-border pt-4 font-mono text-[0.62rem] leading-relaxed text-muted">
          {SHARE_WORDS.trustFoot}
        </p>
      </article>

      {/* ── For the member who is signed out IN THIS BROWSER ──────────────
          Which is most of them. A link tapped from WhatsApp opens in
          WhatsApp's own browser, with its own cookies, so somebody signed in
          on the same phone arrives here as a stranger and no check above can
          tell. This is the only thing that reaches them — see openPath.

          Directly above the hello box on purpose: it is the alternative to
          the thing immediately below it, offered at the moment somebody is
          deciding to write. Shown only when there is no session, because for
          anybody already signed in it is either unnecessary or untrue. */}
      {!viewerId && (
        <section className="mt-6 rounded-2xl border border-accent/30 bg-accent/[0.05] p-5">
          <p className="font-serif text-lg leading-snug text-ink">
            {OPEN_WORDS.title}
          </p>
          <p className="mt-2 prose-serif-sm text-muted">{OPEN_WORDS.body}</p>
          <Link
            href={openPath(params.token)}
            className="mt-4 inline-flex min-h-11 items-center rounded-lg bg-accent px-4 font-mono text-[0.68rem] uppercase tracking-widest text-on-accent transition-colors hover:bg-accent-deep"
          >
            {OPEN_WORDS.cta} →
          </Link>
        </section>
      )}

      {/* A word back — read by the family and by nobody else. */}
      <GuestHello
        token={params.token}
        mine={mine}
        onSay={sayHello}
        onUnsay={unsayHello}
      />

      {/* And the door. It asks; it does not open. */}
      <AskToJoin
        token={params.token}
        who={shared.household}
        asked={asked}
        me={me}
        onAsk={askToJoin}
      />

      <section className="mt-6 text-center">
        <p className="prose-serif-xs text-muted">
          {shared.household} keep the rest of this in Oyun — a quiet place for
          a family walking through pregnancy and the first years, with
          Scripture, prayer, and the people who love them.
        </p>
        <Link
          href="/"
          className="mt-4 inline-flex min-h-11 items-center rounded-lg px-4 font-mono text-[0.68rem] uppercase tracking-widest text-accent hover:underline"
        >
          What Oyun is →
        </Link>
      </section>
    </main>
  );
}

/**
 * A closed link.
 *
 * Worded so that nobody feels caught out. The overwhelmingly likely reason
 * somebody lands here is that the window ran out exactly as it was meant to,
 * and the second most likely is that they were forwarded a link that had
 * already been closed — neither of which is their fault, and neither of which
 * should read like an accusation.
 */
function Gone() {
  return (
    <main className="mx-auto flex min-h-[100dvh] max-w-md flex-col items-center justify-center px-6 text-center">
      <OyunMark className="h-9 w-9" />
      <h1 className="mt-6 font-serif text-2xl leading-snug text-ink">
        {SHARE_WORDS.goneTitle}
      </h1>
      <p className="mt-3 prose-serif-sm text-muted">{SHARE_WORDS.goneBody}</p>
      <Link
        href="/"
        className="mt-8 inline-flex min-h-11 items-center rounded-lg border border-border px-4 font-mono text-[0.68rem] uppercase tracking-widest text-accent hover:border-accent"
      >
        What Oyun is →
      </Link>
    </main>
  );
}
