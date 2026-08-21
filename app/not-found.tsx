import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { OyunMark } from "@/components/ui/OyunMark";

export const metadata: Metadata = {
  title: "Not found",
  robots: { index: false },
};

/** Branded 404 — a mistyped or expired link lands here, not on Next's default. */
export default function NotFound() {
  return (
    <main className="relative flex min-h-[86dvh] items-center justify-center overflow-hidden px-6">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-accent/15 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 bottom-1/4 h-80 w-80 rounded-full bg-accent2/15 blur-3xl"
      />
      <div className="relative z-10 w-full max-w-md animate-fade-up text-center">
        <OyunMark size={44} className="mx-auto mb-6 text-ink" />
        <Eyebrow className="mb-4">Not found</Eyebrow>
        <h1 className="font-serif text-3xl leading-snug text-ink">
          We couldn&rsquo;t find that page.
        </h1>
        <p className="mx-auto mt-3 max-w-sm font-mono text-sm leading-relaxed text-muted">
          The link may be mistyped or the page may have moved. Let&rsquo;s get you
          back on the path.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button href="/journey">Go to your journey</Button>
          <Button href="/" variant="ghost">
            Home
          </Button>
        </div>
      </div>
    </main>
  );
}
