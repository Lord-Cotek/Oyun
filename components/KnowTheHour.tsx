"use client";

import { useEffect } from "react";
import { rememberTimeZone } from "@/app/time-zone-actions";

/**
 * Tells the app which morning is yours.
 *
 * Renders nothing and asks nothing. Once per browser session it sends the
 * zone the browser already knows, so the morning note can arrive in your
 * morning rather than at 07:00 in Greenwich.
 *
 * ── Why once per session, and not on every page ──────────────────────────
 * Because this would otherwise fire on every navigation for every person,
 * for a value that changes when somebody gets on a plane. Once a session is
 * often enough to follow somebody who has moved, and rare enough to cost
 * nothing. A new session after landing picks up the new zone.
 */
export function KnowTheHour() {
  useEffect(() => {
    let zone: string | undefined;
    try {
      zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {
      return;
    }
    if (!zone) return;

    try {
      if (sessionStorage.getItem("tz-told") === zone) return;
    } catch {
      // Private browsing, or storage refused. Sending it again is harmless.
    }

    // Marked ONLY once it has actually been stored. The first version marked
    // it before the call, which meant the attempt made on the sign-in page —
    // where nobody is signed in yet and there is nothing to store it against
    // — counted as done. Every new account then kept no zone at all.
    void rememberTimeZone(zone)
      .then((saved) => {
        if (!saved) return;
        try {
          sessionStorage.setItem("tz-told", zone);
        } catch {
          // As above.
        }
      })
      .catch(() => {});
  }, []);

  return null;
}
