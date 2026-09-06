"use client";

import { useState } from "react";

/**
 * Share a passage (or a note about one) to WhatsApp, a story, anywhere — via
 * the native share sheet where available, falling back to copy-to-clipboard.
 * `path` is app-relative (e.g. "/v/john-3-16"); the full URL is built from the
 * current origin so it always points back to this deployment.
 */
export function ShareButton({
  path,
  title,
  text,
  label = "Share",
  className = "",
}: {
  path: string;
  title: string;
  text: string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function onShare() {
    const url =
      typeof window !== "undefined" ? `${window.location.origin}${path}` : path;
    const nav = typeof navigator !== "undefined" ? navigator : undefined;
    if (nav?.share) {
      try {
        await nav.share({ title, text, url });
        return;
      } catch {
        // user cancelled or share failed — fall through to copy
      }
    }
    try {
      await nav?.clipboard?.writeText(`${text}\n\n${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // nothing more we can do; stay quiet
    }
  }

  return (
    <button
      type="button"
      onClick={onShare}
      className={`inline-flex items-center gap-1.5 font-mono text-[0.68rem] uppercase tracking-widest text-muted transition-colors hover:text-accent ${className}`}
      aria-label={`Share ${title}`}
    >
      {copied ? (
        <>
          <Check /> Copied
        </>
      ) : (
        <>
          <ShareIcon /> {label}
        </>
      )}
    </button>
  );
}

function ShareIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3v13M12 3l-4 4M12 3l4 4M5 12v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Check() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M20 6L9 17l-5-5"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
