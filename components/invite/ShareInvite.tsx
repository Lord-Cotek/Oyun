"use client";

import { useEffect, useState } from "react";
import { shareText } from "@/lib/invitations";

/**
 * Getting the link out of the app and into somebody's hand.
 *
 * Three ways, because the one that works depends on the phone:
 *
 *  - WhatsApp, named, because that is where this is actually going. `wa.me`
 *    opens the app where it is installed and the web client where it is not,
 *    so it works on a laptop too.
 *  - The phone's own share sheet, where there is one — that is the route to
 *    Signal, Messages, email and everything else, and it is one tap.
 *  - Copy, which never fails and is what is left on a desktop browser with no
 *    share sheet.
 *
 * `navigator.share` only exists in a secure context and only on some devices,
 * so the button is rendered after mount from a real check rather than guessed
 * — a share button that does nothing is worse than no share button.
 */
export function ShareInvite({
  url,
  title,
  when,
  where,
}: {
  url: string;
  title: string;
  /** Already-worded, e.g. "Saturday 26 September 2026, 18:00 – 21:00". */
  when: string;
  where: string | null;
}) {
  const [canShare, setCanShare] = useState(false);
  const [said, setSaid] = useState<string | null>(null);

  useEffect(() => {
    setCanShare(typeof navigator !== "undefined" && !!navigator.share);
  }, []);

  const text = shareText(title, when, where, url);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setSaid("Link copied.");
    } catch {
      // Clipboard is blocked in plenty of places. Say so rather than pretend.
      setSaid("Couldn't copy — press and hold the link to copy it.");
    }
    setTimeout(() => setSaid(null), 4000);
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <a
          href={`https://wa.me/?text=${encodeURIComponent(text)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg bg-accent px-3.5 py-2 font-mono text-xs font-medium text-on-accent transition-colors hover:bg-accent-deep"
        >
          Send on WhatsApp
        </a>
        {canShare && (
          <button
            type="button"
            onClick={() =>
              navigator
                .share({ title, text, url })
                .catch(() => {
                  /* they closed the sheet; that is not an error */
                })
            }
            className="rounded-lg border border-border px-3.5 py-2 font-mono text-xs text-ink transition-colors hover:border-accent hover:text-accent"
          >
            Share another way
          </button>
        )}
        <button
          type="button"
          onClick={copy}
          className="rounded-lg border border-border px-3.5 py-2 font-mono text-xs text-ink transition-colors hover:border-accent hover:text-accent"
        >
          Copy link
        </button>
      </div>

      <p className="mt-2 break-all font-mono text-[0.62rem] text-muted">{url}</p>

      {said && (
        <p role="status" className="mt-1 font-mono text-[0.66rem] text-accent">
          {said}
        </p>
      )}
    </div>
  );
}
