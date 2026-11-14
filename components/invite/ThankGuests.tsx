"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { thankYouMessage, type LinkLike } from "@/lib/invite-links";

/**
 * "Send a thank-you with the links" — for the guests who have already replied.
 *
 * ── Why the host sends it, and not the app ───────────────────────────────
 * The people who missed the map pin and the potluck sheet are exactly the
 * ones who replied and closed the page, so nothing on that page reaches them
 * again. Most never gave an address, so the host's own WhatsApp is the one
 * channel that reaches all of them: the app writes the message, warm and
 * complete, and the host sends it to the family group or to each person.
 *
 * ── And by email, for the ones who left one ──────────────────────────────
 * Below it, one button emails the same thank-you — links as buttons — to
 * every guest who said yes or maybe and gave an address. The host is told
 * how many, never who: those addresses were given to the app to be reminded,
 * not handed to the host. Each guest gets it once; pressing it again later
 * reaches only people who have replied since.
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
  emailWaiting = 0,
  emailSent = 0,
  onEmail,
}: {
  title: string;
  when: string;
  where: string | null;
  url: string;
  links: LinkLike[];
  note: string | null;
  /** How many said yes or maybe — the people this is written for. */
  replied: number;
  /** Of those, how many left an email and have not been sent it yet. */
  emailWaiting?: number;
  /** How many have already been emailed it. */
  emailSent?: number;
  onEmail?: () => Promise<
    { ok: true; sent: number; failed: number } | { ok: false; error: string }
  >;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [mailing, startMail] = useTransition();
  const [confirming, setConfirming] = useState(false);
  const [mailSaid, setMailSaid] = useState<{ ok: boolean; text: string } | null>(null);
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

          {/* ── By email, to the ones who left an address ──────────────── */}
          {onEmail && (emailWaiting > 0 || emailSent > 0) && (
            <div className="mt-4 border-t border-border/70 pt-3">
              <p className="font-mono text-[0.6rem] uppercase tracking-widest text-muted">
                By email
              </p>
              <p className="mt-1 prose-serif-xs leading-relaxed text-muted">
                {emailWaiting > 0
                  ? emailSent > 0
                    ? `Already emailed to ${emailSent}. ${emailWaiting === 1 ? "One more guest has" : `${emailWaiting} more have`} replied with an email since.`
                    : `${emailWaiting === 1 ? "One guest" : `${emailWaiting} guests`} who said yes or maybe left an email. They can have this thank-you there, with the links as buttons.`
                  : `Emailed to ${emailSent === 1 ? "the one guest" : `all ${emailSent} guests`} who left an address. Anybody who replies with one from now on can be sent it too.`}
              </p>
              {emailWaiting > 0 && !confirming && (
                <button
                  type="button"
                  disabled={mailing}
                  onClick={() => {
                    setConfirming(true);
                    setMailSaid(null);
                  }}
                  className="mt-2 rounded-lg border border-accent/60 px-3.5 py-2 font-mono text-xs text-accent transition-colors hover:bg-accent/[0.06] disabled:opacity-60"
                >
                  {emailSent > 0
                    ? `Email the ${emailWaiting === 1 ? "new one" : `${emailWaiting} new ones`}`
                    : `Email it to ${emailWaiting === 1 ? "them" : `all ${emailWaiting}`}`}
                </button>
              )}
              {confirming && (
                <div className="mt-2 rounded-lg border border-accent/40 bg-accent/[0.05] p-3">
                  <p className="prose-serif-xs text-ink">
                    Send the thank-you to {emailWaiting === 1 ? "1 guest" : `${emailWaiting} guests`} now?
                    Each gets it once, from Oyun, with your note and the links.
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      disabled={mailing}
                      onClick={() =>
                        startMail(async () => {
                          const res = await onEmail();
                          setConfirming(false);
                          if (res.ok) {
                            setMailSaid({
                              ok: true,
                              text:
                                res.failed > 0
                                  ? `Sent to ${res.sent}. ${res.failed} could not be delivered — try again later and only they will be sent it.`
                                  : `Sent to ${res.sent === 1 ? "1 guest" : `${res.sent} guests`}.`,
                            });
                          } else {
                            setMailSaid({ ok: false, text: res.error });
                          }
                          router.refresh();
                        })
                      }
                      className="rounded-lg bg-accent px-3.5 py-2 font-mono text-xs font-medium text-on-accent hover:bg-accent-deep disabled:opacity-60"
                    >
                      {mailing ? "Sending…" : "Yes, send it"}
                    </button>
                    <button
                      type="button"
                      disabled={mailing}
                      onClick={() => setConfirming(false)}
                      className="rounded-lg px-3 py-2 font-mono text-xs text-muted hover:text-ink"
                    >
                      Not yet
                    </button>
                  </div>
                </div>
              )}
              {mailSaid && (
                <p
                  role="status"
                  className={`mt-2 font-mono text-[0.66rem] leading-relaxed ${mailSaid.ok ? "text-positive" : "text-negative"}`}
                >
                  {mailSaid.text}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
