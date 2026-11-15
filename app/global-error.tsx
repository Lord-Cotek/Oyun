"use client";

import { useEffect } from "react";
import { reportError } from "@/lib/report-error";

/**
 * The last screen: shown only when the layout itself has failed, so nothing
 * of the app's own styling can be relied on and everything here is inline.
 * It reports what broke and offers the two ways forward a person has.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
    reportError(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#111",
          color: "#eee",
          fontFamily: "Georgia, 'Times New Roman', serif",
          padding: "24px",
        }}
      >
        <main style={{ maxWidth: 420, textAlign: "center" }}>
          <p style={{ fontFamily: "ui-monospace, Menlo, monospace", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: "#bbb" }}>
            Oyun
          </p>
          <h1 style={{ fontSize: 28, fontWeight: 400, margin: "12px 0" }}>Something didn&rsquo;t load.</h1>
          <p style={{ fontSize: 16, lineHeight: 1.6, color: "#bbb" }}>
            Nothing you had saved is lost. We have been told, and you can try again.
          </p>
          <p style={{ marginTop: 24, display: "flex", gap: 16, justifyContent: "center", fontFamily: "ui-monospace, Menlo, monospace", fontSize: 14 }}>
            <button
              type="button"
              onClick={reset}
              style={{ background: "#eee", color: "#111", border: 0, borderRadius: 8, padding: "10px 18px", cursor: "pointer", font: "inherit" }}
            >
              Try again
            </button>
            <a href="/" style={{ color: "#eee", padding: "10px 4px" }}>
              Go home
            </a>
          </p>
        </main>
      </body>
    </html>
  );
}
