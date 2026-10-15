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
  const [busyQr, setBusyQr] = useState(false);
  const [qrSaid, setQrSaid] = useState<string | null>(null);

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

  /** The PNG from /registry/qr — the same code, as a file. */
  async function qrFile(): Promise<File | null> {
    const res = await fetch("/registry/qr", { cache: "no-store" });
    if (!res.ok) return null;
    const blob = await res.blob();
    return new File([blob], "registry-qr.png", { type: "image/png" });
  }

  /**
   * Saving it.
   *
   * An anchor with `download` rather than opening the endpoint in a tab: the
   * response is an attachment either way, but a new tab on a phone flashes up
   * and closes itself, which reads as something having gone wrong.
   */
  async function downloadQr() {
    setQrSaid(null);
    setBusyQr(true);
    try {
      const a = document.createElement("a");
      a.href = "/registry/qr";
      a.download = "registry-qr.png";
      document.body.appendChild(a);
      a.click();
      a.remove();
      setQrSaid("Saved to your downloads.");
    } catch {
      setQrSaid("That did not save. Long-press the code to keep it instead.");
    } finally {
      setBusyQr(false);
    }
  }

  /**
   * Sending the code itself, not a link to it.
   *
   * Where the browser can share files — Android Chrome, iOS 16 and later — the
   * picture goes straight into WhatsApp, which is the whole point: whoever is
   * making the shower invitation wants the square, not another URL. Everywhere
   * else this falls back to saving it, and says so rather than failing quietly.
   */
  async function shareQr() {
    setQrSaid(null);
    setBusyQr(true);
    try {
      const nav = navigator as Navigator & {
        share?: (d: { title?: string; text?: string; files?: File[] }) => Promise<void>;
        canShare?: (d: { files?: File[] }) => boolean;
      };
      const file = await qrFile();
      if (file && nav.share && nav.canShare?.({ files: [file] })) {
        await nav.share({ title, text: `${title} — our registry`, files: [file] });
      } else {
        await downloadQr();
        setQrSaid("This browser cannot send pictures — saved it instead.");
      }
    } catch {
      /* they closed the sheet, or the browser refused; nothing to say */
    } finally {
      setBusyQr(false);
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
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Pressable
              type="button"
              disabled={busyQr}
              onClick={shareQr}
              className="rounded-lg border border-border px-3 py-2 font-mono text-xs text-muted transition-colors hover:border-accent hover:text-accent disabled:opacity-40"
            >
              Send the code
            </Pressable>
            <Pressable
              type="button"
              disabled={busyQr}
              onClick={downloadQr}
              className="rounded-lg border border-border px-3 py-2 font-mono text-xs text-muted transition-colors hover:border-accent hover:text-accent disabled:opacity-40"
            >
              Save as a picture
            </Pressable>
            <a
              href="/registry/qr?format=svg"
              className="rounded-lg px-2 py-2 font-mono text-[0.62rem] uppercase tracking-widest text-muted underline underline-offset-4 hover:text-accent"
            >
              SVG for printing
            </a>
          </div>
          {qrSaid && (
            <p role="status" className="prose-serif-xs text-center text-muted">
              {qrSaid}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
