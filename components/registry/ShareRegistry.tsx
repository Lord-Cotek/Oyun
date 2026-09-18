"use client";

import { useState } from "react";
import { Pressable } from "@/components/ui/Pressable";

/**
 * Handing the link out.
 *
 * Three ways, because people share three ways: the phone's own share sheet
 * (WhatsApp, which is how this will actually travel), a copy button for
 * everything else, and a square of ink for the times a link is no use at all
 * — a shower invitation, a church noticeboard, the back of a card.
 *
 * The QR is drawn on the server and handed here as finished SVG. A QR
 * encoder in the bundle would be forty kilobytes shipped to every phone for
 * a picture that never changes.
 */
export function ShareRegistry({
  url,
  title,
  qrSvg,
}: {
  url: string;
  title: string;
  /** Server-rendered SVG. Ours, not a user's — see the page that makes it. */
  qrSvg: string;
}) {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard refused — an old browser, or no permission. The address is
      // on the screen and selectable, which is the fallback that always works.
      setCopied(false);
    }
  }

  async function share() {
    const nav = navigator as Navigator & {
      share?: (d: { title?: string; text?: string; url?: string }) => Promise<void>;
    };
    if (!nav.share) {
      void copy();
      return;
    }
    try {
      await nav.share({ title, text: `${title} — our registry`, url });
    } catch {
      /* they closed the sheet; nothing to say about that */
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-bg p-4">
      <p className="font-mono text-[0.62rem] uppercase tracking-widest text-muted">
        The link to share
      </p>
      <p className="mt-2 break-all font-mono text-xs text-ink">{url}</p>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Pressable
          type="button"
          onClick={share}
          className="btn-primary rounded-lg px-4 py-2 font-mono text-xs font-medium text-on-accent"
        >
          Share
        </Pressable>
        <Pressable
          type="button"
          onClick={copy}
          className="rounded-lg border border-border px-3 py-2 font-mono text-xs text-muted transition-colors hover:border-accent hover:text-accent"
        >
          {copied ? "Copied" : "Copy"}
        </Pressable>
        <Pressable
          type="button"
          onClick={() => setShowQr((v) => !v)}
          aria-expanded={showQr}
          className="rounded-lg border border-border px-3 py-2 font-mono text-xs text-muted transition-colors hover:border-accent hover:text-accent"
        >
          {showQr ? "Hide the code" : "QR code"}
        </Pressable>
      </div>

      {showQr && (
        <div className="mt-4 flex flex-col items-center gap-2">
          <div
            className="w-44 rounded-xl border border-border bg-white p-3 [&>svg]:h-auto [&>svg]:w-full"
            // The SVG is generated on our own server from our own URL — see
            // app/registry/page.tsx. No user text reaches it.
            dangerouslySetInnerHTML={{ __html: qrSvg }}
          />
          <p className="prose-serif-xs text-center text-muted">
            Point a phone at it. Good on a shower invitation, or a card.
          </p>
        </div>
      )}
    </div>
  );
}
