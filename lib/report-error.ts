/**
 * Tell the server an error screen was shown — see /api/errors. Best-effort,
 * and fire-and-forget: the person in front of the screen must never wait on
 * this, and a report that does not arrive costs nothing.
 */
export function reportError(error: Error & { digest?: string }): void {
  try {
    const body = JSON.stringify({
      message: `${error.name || "Error"}: ${error.message || ""}`.slice(0, 300),
      digest: error.digest ?? null,
      path: typeof location !== "undefined" ? location.pathname : null,
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
