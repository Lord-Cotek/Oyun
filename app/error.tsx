"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { OyunMark } from "@/components/ui/OyunMark";

/**
 * Branded, recoverable error screen. Catches thrown errors from server actions
 * and components (e.g. an invite that can't be accepted) so a stumble lands on
 * a warm page with a way forward — never Next's bare 500.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface for logs without leaking details to the reader.
    console.error(error);
  }, [error]);

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
        <Eyebrow className="mb-4">A small stumble</Eyebrow>
        <h1 className="font-serif text-3xl leading-snug text-ink">
          Something didn&rsquo;t go through.
        </h1>
        <p className="mx-auto mt-3 max-w-sm font-mono text-sm leading-relaxed text-muted">
          The step you tried didn&rsquo;t complete. It&rsquo;s not you — try
          again, or head home and pick the journey back up.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button onClick={() => reset()}>Try again</Button>
          <Button href="/" variant="ghost">
            Go home
          </Button>
        </div>
      </div>
    </main>
  );
}
