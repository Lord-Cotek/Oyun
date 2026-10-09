"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PROMISE_FULL, showsFullPromise } from "@/lib/promise";

/**
 * The quiet footer that keeps Oyun in its place.
 *
 * ── Why it reads the route rather than taking a prop ─────────────────────
 * It is mounted once, in the root layout, which is the right place for it —
 * every page gets the legal links without remembering to. But "say the whole
 * thing here, and only the links there" is a per-page decision, and a layout
 * has no way to be told. Reading the pathname is the one thing this needs a
 * client for; it holds no state, fetches nothing, and is three lines.
 *
 * Where the paragraph shows and why is written down in lib/promise.ts, beside
 * the words themselves, so the sentence and the decision about where it
 * appears cannot drift apart.
 */
export function Disclaimer() {
  const pathname = usePathname() ?? "";

  // The admin centre is not one of the family's rooms and is not offered to
  // anybody: a promise about what Oyun is for, and a row of marketing links,
  // belong in front of families rather than in a back office.
  if (pathname === "/admintc" || pathname.startsWith("/admintc/")) return null;

  const full = showsFullPromise(pathname);

  return (
    <footer className="safe-bottom relative z-10 border-t border-border/60 bg-bg/60 px-6 py-5">
      <div className="mx-auto max-w-shell space-y-3">
        <p
          className={`prose-serif-xs max-w-prose text-muted ${
            full ? "" : "hidden md:block"
          }`}
        >
          {PROMISE_FULL}
        </p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[0.7rem] text-muted">
          <Link href="/privacy" className="transition-colors hover:text-accent">
            Privacy
          </Link>
          <Link href="/terms" className="transition-colors hover:text-accent">
            Terms
          </Link>
          <Link href="/contact" className="transition-colors hover:text-accent">
            Contact
          </Link>
          <span className="text-muted/70">© cotek app FZ-LLC</span>
        </div>
      </div>
    </footer>
  );
}
