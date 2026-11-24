"use client";

import { useEffect, useRef, useState } from "react";
import { ErrorNav } from "@/components/ErrorNav";
import { claimReload, isRouterFault, reportError } from "@/lib/report-error";
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
  // The framework's router fault is cured by reloading the page, so that is
  // done for the person, once — see lib/report-error.ts. Until we know
  // whether a reload is allowed, a quiet "one moment" is shown and not the
  // stumble page, which would only flash before the page came back.
  const fault = isRouterFault(error);
  const [stuck, setStuck] = useState(false);
  const handled = useRef<unknown>(null);
  useEffect(() => {
    if (handled.current === error) return;
    handled.current = error;
    // Surface for logs without leaking details to the reader, and tell the
    // server so somebody knows before a family has to say so.
    console.error(error);
    if (fault && claimReload()) {
      reportError(error, { recovered: true });
      window.location.reload();
      return;
    }
    reportError(error);
    if (fault) setStuck(true);
  }, [error, fault]);

  if (fault && !stuck) {
    return (
      <main className="flex min-h-[86dvh] items-center justify-center px-6" aria-live="polite">
        <p className="font-mono text-xs text-muted">One moment…</p>
      </main>
    );
  }

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
        <p className="mx-auto mt-3 max-w-sm prose-serif-sm text-muted">
          The step you tried didn&rsquo;t complete. It&rsquo;s not you — try
          again, or head home and pick the journey back up.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button onClick={() => reset()}>Try again</Button>
          <Button href="/" variant="ghost">
            Go home
          </Button>
        </div>
        <ErrorNav />
      </div>
    </main>
  );
}
