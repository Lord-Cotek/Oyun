/**
 * What the error screens do with an error: report it, and — for one known
 * fault — recover from it without the person seeing a broken page.
 *
 * ── The fault this recovers from ─────────────────────────────────────────
 * React error #310, "Rendered more hooks than during the previous render",
 * thrown from inside the framework's own page router. It is a known fault in
 * the version Oyun runs (Next.js issue 63121): if the server's answer to a
 * tap arrives at the wrong moment while the page is changing, the router
 * trips over itself. Nothing in Oyun's code is wrong when it happens and the
 * tap itself has usually already been saved. The page is simply left broken,
 * and reloading it puts everything right.
 *
 * So the error screens do that reload themselves, once, and report that
 * they did. If the same fault comes straight back the reload is not
 * repeated: the ordinary "a small stumble" page is shown with its buttons,
 * so nobody is ever caught in a loop of reloads.
 */

const FAULT = /Minified React error #310|Rendered more hooks than during the previous render/;
const RELOADED_AT = "oyun:reloaded-after-fault";
/** A second fault this soon after a reload means the reload did not help. */
const NOT_AGAIN_WITHIN_MS = 30_000;

/** Is this the framework's router fault — the one a reload cures? */
export function isRouterFault(error: { message?: string } | null | undefined): boolean {
  return FAULT.test(error?.message ?? "");
}

/**
 * May the page reload itself now? Yes once; no if it already did a moment
 * ago, and no if the browser gives us nowhere to remember that it did —
 * without that there is no way to be sure of not looping.
 */
export function claimReload(now: number = Date.now()): boolean {
  try {
    const last = Number(sessionStorage.getItem(RELOADED_AT) || 0);
    if (last && now - last < NOT_AGAIN_WITHIN_MS) return false;
    sessionStorage.setItem(RELOADED_AT, String(now));
    return sessionStorage.getItem(RELOADED_AT) === String(now);
  } catch {
    return false;
  }
}

/**
 * Where in the code it happened, in one short line: the first few places,
 * as file and position, with the site's address taken off. No words anybody
 * typed are in a stack — only the names of files and functions — and it is
 * what tells a framework fault from one of ours.
 */
export function shortStack(stack: string | null | undefined): string | null {
  if (!stack) return null;
  const frames = stack
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.startsWith("at ") || /@/.test(l))
    .slice(0, 7)
    .map((l) => l.replace(/^at /, "").replace(/https?:\/\/[^/\s)]+/g, "").replace(/\/_next\/static\//g, "").replace(/\?[^:)\s]*/g, ""));
  return frames.length ? frames.join(" < ").slice(0, 900) : null;
}

/**
 * Tell the server an error screen was shown — see /api/errors. Best-effort,
 * and fire-and-forget: the person in front of the screen must never wait on
 * this, and a report that does not arrive costs nothing.
 *
 * `recovered` says the page is reloading itself to put it right, so the
 * server records it without waking anybody with an email.
 */
export function reportError(error: Error & { digest?: string }, opts: { recovered?: boolean } = {}): void {
  try {
    const body = JSON.stringify({
      message: `${error.name || "Error"}: ${error.message || ""}`.slice(0, 300),
      digest: error.digest ?? null,
      path: typeof location !== "undefined" ? location.pathname : null,
      stack: shortStack(error.stack),
      recovered: opts.recovered === true,
    });
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      navigator.sendBeacon("/api/errors", new Blob([body], { type: "application/json" }));
    } else {
      void fetch("/api/errors", { method: "POST", body, keepalive: true }).catch(() => {});
    }
  } catch {
    // Never a second error.
  }
}
