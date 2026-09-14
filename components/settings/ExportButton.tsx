"use client";

/**
 * The link that hands a family their years back.
 *
 * It is a plain `<a>` on the web, because that is the thing browsers are best
 * at. Inside the installed app it is not: the shell is a WKWebView with no
 * download delegate, so a link to a file either does nothing at all or leaves
 * the app sitting on a blank page — exactly the failure the lightbox's save
 * button had. There, as here, the answer is to hand the address to the system
 * browser, which knows what to do with a file.
 *
 * The wait is the other thing worth saying out loud. Gathering a whole house
 * takes a few seconds, and a button that looks unpressed for five seconds is a
 * button people press again. So it says what it is doing.
 */
import { useEffect, useState } from "react";
import { isNativeShell } from "@/lib/shell";

const HREF = "/api/export";

export function ExportButton() {
  const [inShell, setInShell] = useState(false);
  const [working, setWorking] = useState(false);

  // Read the user agent after mounting: the server has no idea which shell
  // this is, and rendering one answer then the other would flash.
  useEffect(() => setInShell(isNativeShell()), []);

  // The browser gives no event for "the download started", so let the notice
  // stand for a few seconds and then clear itself.
  useEffect(() => {
    if (!working) return;
    const t = setTimeout(() => setWorking(false), 6000);
    return () => clearTimeout(t);
  }, [working]);

  return (
    <div>
      <a
        href={HREF}
        download={inShell ? undefined : ""}
        target={inShell ? "_blank" : undefined}
        rel={inShell ? "noopener noreferrer" : undefined}
        onClick={() => setWorking(true)}
        className="inline-block rounded-lg border border-border px-4 py-2 font-mono text-xs text-ink hover:border-accent hover:text-accent"
      >
        {inShell ? "Download everything ↗" : "Download everything ↓"}
      </a>
      <p
        aria-live="polite"
        className="mt-3 min-h-4 font-mono text-[0.7rem] leading-relaxed text-muted"
      >
        {working
          ? "Gathering everything — a large house takes a few seconds."
          : ""}
      </p>
    </div>
  );
}
