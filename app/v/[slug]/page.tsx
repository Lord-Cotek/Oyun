import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { parseSlug, getShareVerse, displayRef } from "@/lib/share";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { OyunMark } from "@/components/ui/OyunMark";

function truncate(s: string, n: number): string {
  return s.length > n ? `${s.slice(0, n - 1).trimEnd()}…` : s;
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const parsed = parseSlug(params.slug);
  if (!parsed) return { title: "A verse" };
  const ref = displayRef(parsed);
  const verse = await getShareVerse(parsed);
  const desc = verse ? truncate(verse.quote, 180) : "Shared from Oyun.";
  return {
    title: ref,
    description: desc,
    openGraph: {
      title: `${ref} · Oyun`,
      description: desc,
      type: "article",
    },
    twitter: { card: "summary_large_image", title: `${ref} · Oyun`, description: desc },
    alternates: { canonical: `/v/${params.slug}` },
  };
}

export default async function SharedVerse({
  params,
}: {
  params: { slug: string };
}) {
  const parsed = parseSlug(params.slug);
  if (!parsed) notFound();
  const verse = await getShareVerse(parsed);
  if (!verse) notFound();

  return (
    <main className="relative min-h-[100dvh] overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full bg-accent/15 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 bottom-1/4 h-80 w-80 rounded-full bg-accent2/15 blur-3xl"
      />

      <div className="relative z-10 mx-auto flex min-h-[100dvh] max-w-2xl flex-col px-6 py-10">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <OyunMark size={30} className="text-ink" />
          <span className="font-serif text-lg text-ink">Oyun</span>
        </Link>

        <div className="flex flex-1 flex-col justify-center py-12">
          <Eyebrow className="mb-5">A verse to carry</Eyebrow>
          {verse.wholeChapter ? (
            <div className="surface-premium max-h-[52dvh] overflow-y-auto rounded-2xl border border-border p-6">
              <p className="whitespace-pre-line font-mono text-sm leading-relaxed text-ink/90">
                {verse.text}
              </p>
            </div>
          ) : (
            <blockquote className="font-serif text-3xl leading-snug text-ink md:text-4xl">
              &ldquo;{verse.text}&rdquo;
            </blockquote>
          )}
          <p className="mt-5 font-mono text-sm uppercase tracking-widest text-accent">
            {verse.ref}
          </p>
          <p className="mt-2 font-mono text-[0.7rem] text-muted">
            World English Bible (public domain)
          </p>
        </div>

        {/* The invitation back to the app */}
        <div className="surface-raised rounded-2xl border border-accent/25 bg-gradient-to-br from-accent/[0.10] via-surface to-accent2/[0.09] p-6 md:p-8">
          <Eyebrow className="mb-3">A COTEK companion</Eyebrow>
          <h2 className="font-serif text-2xl leading-snug text-ink">
            Family worship, every day.
          </h2>
          <p className="mt-2 max-w-md font-mono text-sm leading-relaxed text-muted">
            Oyun walks a mother and the one beside her from conception through the
            early years — Scripture, prayer, a song, and reflections you keep.
            Read through the whole Bible together, one day at a time.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button href="/">Open Oyun</Button>
            <Button href="/sign-up" variant="ghost">
              Create a free account
            </Button>
          </div>
        </div>

        <p className="mt-6 text-center font-mono text-[0.68rem] text-muted">
          Shared from Oyun · a COTEK app
        </p>
      </div>
    </main>
  );
}
