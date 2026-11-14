"use client";

import { useEffect, useState } from "react";
import { thankYouMessage, type LinkLike } from "@/lib/invite-links";

/**
 * "Send a thank-you with the links" — for the guests who have already replied.
 *
 * ── Why the host sends it, and not the app ───────────────────────────────
 * The people who missed the map pin and the potluck sheet are exactly the
 * ones who replied and closed the page, so nothing on that page reaches them
 * again. The app could email them, but most never gave an address, and the
 * ones who did agreed to two reminders and nothing else — a third message
 * they did not ask for is how an app stops being trusted. The host's own
 * WhatsApp reaches all of them, so the app writes the message, warm and
 * complete, and the host sends it to the family group or to each person.
 *
 * The message is shown before it goes, in full, because a host sending words
 * to forty people should see every one of them first.
 */
export function ThankGuests({
  title,
  when,
  where,
  url,
  links,
  note,
  replied,
}: {
  title: string;
  when: string;
  where: string | null;
  url: string;
  links: LinkLike[];
  note: string | null;
  /** How many said yes or maybe — the people this is written for. */
  replied: number;
}) {
  const [open, setOpen] = useState(false);
  const [canShare, setCanShare] = useState(false);
  const [said, setSaid] = useState<string | null>(null);

  useEffect(() => {
    setCanShare(typeof navigator !== "undefined" && !!navigator.share);
  }, []);

  if (replied === 0) return null;

  const text = thankYouMessage({ title, when, where, links, inviteUrl: url, note });

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setSaid("Copied — paste it wherever your guests are.");
    } catch {
      setSaid("Couldn’t copy — press and hold the message to select it.");
    }
    setTimeout(() => setSaid(null), 4000);
  }

  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="font-mono text-[0.68rem] text-accent underline underline-offset-4"
      >
        {open ? "Hide the thank-you" : "Send a thank-you with the links →"}
      </button>

      {open && (
        <div className="mt-2 rounded-xl border border-border bg-bg/60 p-3">
          <p className="prose-serif-xs leading-relaxed text-muted">
            For the {replied === 1 ? "one guest" : `${replied} guests`} who said
            yes or maybe — so the ones who replied and closed the page still
            have the directions{links.length > 0 ? ", the links" : ""} and the
            date. Send it to your group, or to each of them.
          </p>
          {links.length === 0 && (
            <p className="mt-2 font-mono text-[0.66rem] leading-relaxed text-accent">
              Add your useful links below first, and they go in this message too.
            </p>
          )}
          <pre className="mt-3 max-h-64 overflow-auto whitespace-pre-wrap break-words rounded-lg border border-border/70 bg-surface px-3 py-2.5 font-body text-[0.8rem] leading-relaxed text-ink">
            {text}
          </pre>
          <div className="mt-3 flex flex-wrap items-center gap-2">
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
                  navigator.share({ title, text }).catch(() => {
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
              Copy the message
            </button>
          </div>
          {said && (
            <p className="mt-2 font-mono text-[0.66rem] text-muted" role="status">
              {said}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
