"use client";

import { useEffect, useState, useTransition } from "react";
import { shareText, EMAIL_BATCH_MAX, sentSentence } from "@/lib/invitations";

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
 *  - Email, two ways. "Write it myself" opens their own mail app with the
 *    whole thing drafted, which is the right route when they want to add a
 *    line or send it from an address the guest will recognise. And straight
 *    from the app, for the aunt who has an email address and no messaging
 *    app at all — until now she was the person you had to remember to write
 *    to separately, which is to say the person who got forgotten.
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
  eventId,
  onEmail,
  sentCount = 0,
}: {
  url: string;
  title: string;
  /** Already-worded, e.g. "Saturday 26 September 2026, 18:00 – 21:00". */
  when: string;
  where: string | null;
  /** Omit both of these to leave the send-by-app route out entirely. */
  eventId?: string;
  onEmail?: (
    fd: FormData,
  ) => Promise<
    { ok: true; sent: number; failed: number } | { ok: false; error: string }
  >;
  /** How many have already gone from this link, for the quiet line beneath. */
  sentCount?: number;
}) {
  const [canShare, setCanShare] = useState(false);
  const [said, setSaid] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [addresses, setAddresses] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const [pending, start] = useTransition();

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
        <a
          href={`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(text)}`}
          className="rounded-lg border border-border px-3.5 py-2 font-mono text-xs text-ink transition-colors hover:border-accent hover:text-accent"
        >
          Write it myself
        </a>
        <button
          type="button"
          onClick={copy}
          className="rounded-lg border border-border px-3.5 py-2 font-mono text-xs text-ink transition-colors hover:border-accent hover:text-accent"
        >
          Copy link
        </button>
      </div>

      {onEmail && eventId && (
        <div className="mt-3">
          {!open ? (
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="font-mono text-xs text-accent underline underline-offset-4 hover:text-accent-deep"
            >
              Or send it by email for me →
            </button>
          ) : (
            <form
              action={(fd) =>
                start(async () => {
                  setResult(null);
                  const r = await onEmail(fd);
                  if (r.ok) {
                    setFailed(false);
                    setAddresses("");
                    setResult(
                      r.failed > 0
                        ? `${sentSentence(r.sent)} ${r.failed} could not be delivered.`
                        : sentSentence(r.sent),
                    );
                  } else {
                    setFailed(true);
                    setResult(r.error);
                  }
                })
              }
              className="rounded-xl border border-border bg-bg/60 p-4"
            >
              <input type="hidden" name="eventId" value={eventId} />
              <label
                htmlFor="invite-addresses"
                className="block font-mono text-[0.6rem] uppercase tracking-widest text-muted"
              >
                Email addresses
              </label>
              <textarea
                id="invite-addresses"
                name="addresses"
                value={addresses}
                onChange={(e) => setAddresses(e.target.value)}
                rows={3}
                placeholder={"bisi@example.com\ntunde@example.com"}
                className="mt-1.5 w-full resize-y rounded-lg border border-border bg-bg px-3 py-2 font-mono text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none"
              />
              <p className="mt-2 font-mono text-[0.62rem] leading-relaxed text-muted">
                One per line, or separated by commas. Up to {EMAIL_BATCH_MAX} at
                a time. Each person is written to on their own, so nobody sees
                anybody else&rsquo;s address — and the app does not keep them.
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <button
                  type="submit"
                  disabled={pending || addresses.trim().length === 0}
                  className="rounded-lg bg-accent px-3.5 py-2 font-mono text-xs font-medium text-on-accent transition-colors hover:bg-accent-deep disabled:opacity-40"
                >
                  {pending ? "Sending…" : "Send the invitation"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    setResult(null);
                  }}
                  className="rounded-lg border border-border px-3.5 py-2 font-mono text-xs text-ink transition-colors hover:border-accent hover:text-accent"
                >
                  Not now
                </button>
              </div>
              {result && (
                <p
                  role="status"
                  className={`mt-2 font-mono text-[0.66rem] ${
                    failed ? "text-ink" : "text-accent"
                  }`}
                >
                  {result}
                </p>
              )}
              {sentCount > 0 && !result && (
                <p className="mt-2 font-mono text-[0.62rem] text-muted">
                  {sentSentence(sentCount)} Sending again writes to them twice.
                </p>
              )}
            </form>
          )}
        </div>
      )}

      <p className="mt-2 break-all font-mono text-[0.62rem] text-muted">{url}</p>

      {said && (
        <p role="status" className="mt-1 font-mono text-[0.66rem] text-accent">
          {said}
        </p>
      )}
    </div>
  );
}
