import type { Metadata } from "next";
import Link from "next/link";
import { getSharedPost, countOneView } from "@/lib/post-share-db";
import { SHARE_WORDS } from "@/lib/post-share";
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

  // Counted, not awaited — see countOneView.
  countOneView(params.token);

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

        {shared.media.length > 0 && (
          <div
            className={`mt-5 grid gap-2 ${shared.media.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}
          >
            {shared.media.map((m, i) =>
              m.type === "video" ? (
                <video
                  key={i}
                  src={m.url}
                  controls
                  playsInline
                  preload="metadata"
                  className="w-full rounded-xl bg-bg"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={i}
                  src={m.url}
                  alt={`Shared by ${shared.household}`}
                  className="w-full rounded-xl object-cover"
                />
              ),
            )}
          </div>
        )}

        <p className="mt-5 border-t border-border pt-4 font-mono text-[0.62rem] leading-relaxed text-muted">
          {SHARE_WORDS.trustFoot}
        </p>
      </article>

      {/* The invitation. Phase 3 turns this into asking to join; for now it is
          an honest signpost rather than a button that does nothing. */}
      <section className="mt-6 rounded-2xl border border-border p-6 text-center">
        <p className="prose-serif-sm text-muted">
          {shared.household} keep the rest of this in Oyun — a quiet place for
          a family walking through pregnancy and the first years, with
          Scripture, prayer, and the people who love them.
        </p>
        <Link
          href="/"
          className="mt-4 inline-flex min-h-11 items-center rounded-lg border border-border px-4 font-mono text-[0.68rem] uppercase tracking-widest text-accent hover:border-accent"
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
