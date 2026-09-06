import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { hymnBySlug, hymnaryUrl } from "@/lib/hymns";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { OyunMark } from "@/components/ui/OyunMark";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const hymn = hymnBySlug(params.id);
  if (!hymn) return { title: "A hymn" };
  return {
    title: hymn.title,
    description: `“${hymn.line}” — ${hymn.author}`,
    openGraph: {
      title: `${hymn.title} · Oyun`,
      description: `“${hymn.line}” — ${hymn.author}`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${hymn.title} · Oyun`,
      description: `“${hymn.line}”`,
    },
    alternates: { canonical: `/h/${params.id}` },
  };
}

export default function SharedHymn({ params }: { params: { id: string } }) {
  const hymn = hymnBySlug(params.id);
  if (!hymn) notFound();

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

        <div className="flex-1 py-12">
          <Eyebrow className="mb-4">A hymn to sing</Eyebrow>
          <h1 className="font-serif text-4xl leading-tight text-ink md:text-5xl">
            {hymn.title}
          </h1>
          <p className="mt-3 font-serif text-base italic text-muted">
            {hymn.author}
          </p>

          <div className="surface-premium mt-7 space-y-5 rounded-2xl border border-border p-6">
            {hymn.lyrics.map((stanza, i) => {
              const refrain = stanza.startsWith("Refrain:");
              const body = refrain ? stanza.replace(/^Refrain:\n?/, "") : stanza;
              return (
                <div key={i}>
                  {refrain && (
                    <p className="mb-1 font-mono text-[0.6rem] uppercase tracking-widest text-accent">
                      Refrain
                    </p>
                  )}
                  <p
                    className={`whitespace-pre-line font-mono text-sm leading-relaxed ${
                      refrain ? "text-ink/80 italic" : "text-ink/90"
                    }`}
                  >
                    {body}
                  </p>
                </div>
              );
            })}
          </div>

          <a
            href={hymnaryUrl(hymn.title)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-block font-mono text-xs text-muted underline underline-offset-4 hover:text-accent"
          >
            Listen on Hymnary ↗
          </a>
        </div>

        {/* The invitation back to the app */}
        <div className="surface-raised rounded-2xl border border-accent/25 bg-gradient-to-br from-accent/[0.10] via-surface to-accent2/[0.09] p-6 md:p-8">
          <Eyebrow className="mb-3">A COTEK companion</Eyebrow>
          <h2 className="font-serif text-2xl leading-snug text-ink">
            Sing it in family worship.
          </h2>
          <p className="mt-2 max-w-md font-mono text-sm leading-relaxed text-muted">
            Oyun brings a mother and the one beside her a daily rhythm —
            Scripture, prayer, a hymn to sing, and a reading plan through the
            whole Bible. A little altar in your home.
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
