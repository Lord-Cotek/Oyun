import type { Metadata } from "next";
import Link from "next/link";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { OyunMark } from "@/components/ui/OyunMark";
import { ThemeToggle } from "@/components/ThemeToggle";
import { redeemConfirmLink } from "@/lib/email-confirm";

export const metadata: Metadata = {
  title: "Confirm your email",
  robots: { index: false },
};
export const dynamic = "force-dynamic";

/**
 * Where the "Confirm my email" link lands.
 *
 * Opening it is the proof, so the work happens on arrival — there is no
 * button to press. A mail scanner that opens the link first has only proved
 * the same thing, since it read it from that inbox.
 */
export default async function ConfirmEmail({
  searchParams,
}: {
  searchParams: { t?: string };
}) {
  const result = await redeemConfirmLink(searchParams.t?.trim() ?? "");

  return (
    <main className="mx-auto flex min-h-[86dvh] max-w-shell items-center justify-center px-6 py-16">
      <ThemeToggle className="fixed right-5 top-5 z-30" />
      <div className="w-full max-w-md animate-fade-up">
        <Link href="/" className="mb-8 inline-flex items-center gap-3">
          <OyunMark size={40} className="text-ink" />
          <span className="font-serif text-xl text-ink">Oyun</span>
        </Link>
        <div className="rounded-2xl border border-border bg-surface p-8">
          {result.ok ? (
            <>
              <Eyebrow className="mb-4">Confirmed</Eyebrow>
              <h1 className="font-serif text-3xl leading-snug text-ink">
                {result.changed ? "Your new email is in place." : "Thank you — that’s your address confirmed."}
              </h1>
              <p className="mt-3 prose-serif-sm text-muted">
                {result.changed
                  ? `From now on you sign in with ${result.email}.`
                  : "Nothing else to do."}
              </p>
            </>
          ) : (
            <>
              <Eyebrow className="mb-4">Not this time</Eyebrow>
              <h1 className="font-serif text-3xl leading-snug text-ink">That link didn’t work.</h1>
              <p className="mt-3 prose-serif-sm text-muted">{result.error}</p>
            </>
          )}
          <Link
            href="/settings"
            className="mt-6 inline-block rounded-lg bg-accent px-5 py-3 font-mono text-sm font-medium text-on-accent transition-colors hover:bg-accent-deep"
          >
            Go to Settings
          </Link>
        </div>
      </div>
    </main>
  );
}
