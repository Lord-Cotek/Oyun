import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";

/**
 * What a room that is only worship shows someone who chose Oyun without
 * religious content — see lib/voice.ts.
 *
 * The menu does not offer these rooms to them, but an old link, a bookmark
 * or a notification from before they switched can still land here. A
 * redirect would leave them wondering where the page went; this says it
 * plainly, without a single verse on it, and shows the way back.
 */
export function FaithOnlyRoom({ room }: { room: string }) {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-xl px-6 pb-16 pt-12">
        <div className="rounded-2xl border border-border bg-surface p-8">
          <p className="eyebrow text-muted">{room}</p>
          <h1 className="mt-2 font-serif text-2xl leading-snug text-ink">
            This room is part of Oyun with Christian faith.
          </h1>
          <p className="mt-3 prose-serif-sm text-muted">
            You chose Oyun without religious content, so it isn’t in your menu. Everything else — your
            journey, your circle, your appointments and health — is all here.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Link
              href="/journey"
              className="inline-flex min-h-11 items-center rounded-lg bg-accent px-5 font-mono text-xs font-medium text-on-accent hover:bg-accent-deep"
            >
              Back to your journey
            </Link>
            <Link
              href="/settings#voice"
              className="inline-flex min-h-11 items-center rounded-lg border border-border px-5 font-mono text-xs text-ink hover:border-accent"
            >
              Change in Settings
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
