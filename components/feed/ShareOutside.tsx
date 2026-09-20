"use client";

import { useState } from "react";
import { Pressable } from "@/components/ui/Pressable";
import {
  SHARE_WINDOWS,
  SHARE_WORDS,
  SHARE_DAYS_DEFAULT,
  shareWindowLabel,
  seenLabel,
} from "@/lib/post-share";

export interface LiveShare {
  path: string;
  expiresAt: string | null;
  views: number;
}

export type SharePostFn = (input: {
  postId: string;
  days?: number;
}) => Promise<{ path: string; expiresAt: string | null }>;
export type RevokeShareFn = (postId: string) => Promise<{ ok: boolean }>;

/**
 * Sharing one post with somebody who is not in the app.
 *
 * ── Why the warning comes before the link and not after ──────────────────
 * The sheet opens on the sentence, with the buttons underneath. Nothing has
 * been created at that point and no address exists yet, so the choice is
 * still genuinely open. A warning shown next to a link that already exists is
 * not information, it is an apology — by then the only question left is
 * whether to paste it.
 *
 * ── Why the window is chosen before the link is made ─────────────────────
 * Same reason. "How long should this be open?" is a question people answer
 * thoughtfully when it is the thing in front of them, and ignore entirely
 * when it appears as a setting beside an address they are already copying.
 * Thirty days is preselected; nobody has to think if they do not want to.
 */
export function ShareOutside({
  postId,
  live,
  onShare,
  onRevoke,
}: {
  postId: string;
  /** The link this post already has, if it has a live one. */
  live: LiveShare | null;
  onShare: SharePostFn;
  onRevoke: RevokeShareFn;
}) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [days, setDays] = useState<number>(SHARE_DAYS_DEFAULT);
  const [made, setMade] = useState<{ path: string; expiresAt: string | null } | null>(
    live ? { path: live.path, expiresAt: live.expiresAt } : null,
  );
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const url =
    made && typeof window !== "undefined"
      ? `${window.location.origin}${made.path}`
      : made?.path ?? "";

  async function make() {
    setBusy(true);
    setError(null);
    try {
      const res = await onShare({ postId, days });
      setMade(res);
    } catch (e) {
      setError((e as Error)?.message || "That did not work. Try again?");
    } finally {
      setBusy(false);
    }
  }

  async function send() {
    const nav = typeof navigator !== "undefined" ? navigator : undefined;
    // The text that travels WITH the link carries the ask too, because plenty
    // of people decide whether to forward something from the message alone,
    // without ever opening it.
    const text = `Sharing this with you — please keep it between us.`;
    if (nav?.share) {
      try {
        await nav.share({ title: "A moment from our family", text, url });
        return;
      } catch {
        /* cancelled — fall through to copy */
      }
    }
    try {
      await nav?.clipboard?.writeText(`${text}\n\n${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* nothing more to do */
    }
  }

  async function close() {
    setBusy(true);
    try {
      await onRevoke(postId);
      setMade(null);
      setOpen(false);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Pressable
        press="none"
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="py-2.5 underline underline-offset-4 hover:text-accent"
      >
        {live ? "Shared ·" : "Share"} {live ? shareWindowLabel({ expiresAt: live.expiresAt, revokedAt: null }) : "outside"}
      </Pressable>

      {open && (
        <div className="mt-2 w-full rounded-xl border border-border bg-bg p-4">
          <p className="mb-3 prose-serif-xs text-muted">
            {SHARE_WORDS.warning}
          </p>

          {!made ? (
            <>
              <p className="mb-2 font-mono text-[0.62rem] uppercase tracking-widest text-muted">
                How long should it stay open?
              </p>
              <div className="mb-3 flex flex-wrap gap-1.5">
                {SHARE_WINDOWS.map((w) => (
                  <button
                    key={w.days}
                    type="button"
                    onClick={() => setDays(w.days)}
                    aria-pressed={days === w.days}
                    className={`rounded-full px-3 py-1.5 font-mono text-[0.68rem] transition-colors ${
                      days === w.days
                        ? "bg-accent text-on-accent"
                        : "border border-border text-muted hover:text-ink"
                    }`}
                  >
                    {w.label}
                  </button>
                ))}
              </div>
              <button
                type="button"
                disabled={busy}
                onClick={make}
                className="rounded-lg bg-accent px-4 py-2 font-mono text-sm font-medium text-on-accent transition-colors hover:bg-accent-deep disabled:opacity-50"
              >
                {busy ? "Making a link…" : "Make a link"}
              </button>
            </>
          ) : (
            <>
              <p className="mb-2 break-all rounded-lg border border-border bg-surface p-2.5 font-mono text-[0.62rem] text-ink">
                {url}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={send}
                  className="rounded-lg bg-accent px-4 py-2 font-mono text-sm font-medium text-on-accent transition-colors hover:bg-accent-deep"
                >
                  {copied ? "Copied" : "Send it"}
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={close}
                  className="rounded-lg border border-border px-3 py-2 font-mono text-[0.68rem] text-muted transition-colors hover:border-negative hover:text-negative disabled:opacity-50"
                >
                  Close the link
                </button>
              </div>
              <p className="mt-3 font-mono text-[0.62rem] leading-relaxed text-muted">
                {shareWindowLabel({
                  expiresAt: made.expiresAt,
                  revokedAt: null,
                })}
                {live ? ` · ${seenLabel(live.views)}` : ""}
              </p>
            </>
          )}

          {error && (
            <p className="mt-3 font-mono text-[0.62rem] leading-relaxed text-negative">
              {error}
            </p>
          )}
        </div>
      )}
    </>
  );
}
