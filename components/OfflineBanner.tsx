"use client";

import { useEffect, useState } from "react";

/**
 * Saying so when the connection has gone.
 *
 * Oyun is used on phones, in hospital corridors, in waiting rooms, on the way
 * home. It is exactly the app somebody opens where the signal is worst. When the connection drops, every Save in the app fails the
 * same silent way: the button spins, the server action never lands, and the
 * words a person just wrote are still on screen looking saved. They close the
 * tab and the evening is gone.
 *
 * This is the honest half of the fix — say the connection has gone, before
 * they press anything. The other half is `useKeptDraft`, which writes what
 * they are typing to the device so that closing the tab costs nothing.
 *
 * What this deliberately does NOT claim
 * ────────────────────────────────────
 * It does not say "we will send this when you are back". Nothing here queues
 * a write and retries it: a prayer request that silently posts itself forty
 * minutes later, to a circle who have moved on, is worse than one that plainly
 * did not send. So the banner promises exactly what is true — the words are
 * kept on this device, and sending waits for them.
 *
 * It also stays out of the way. One line, under the header, dismissible by
 * coming back online and by nothing else, because a person who dismissed it
 * would still be offline.
 */
export function OfflineBanner() {
  // Start optimistic. `navigator.onLine` is not readable during the server
  // render, and flashing a false alarm on every page load would be worse than
  // a moment's delay before a true one.
  const [offline, setOffline] = useState(false);
  const [justBack, setJustBack] = useState(false);

  useEffect(() => {
    const goOffline = () => {
      setOffline(true);
      setJustBack(false);
    };
    const goOnline = () => {
      setOffline((was) => {
        if (was) {
          setJustBack(true);
          window.setTimeout(() => setJustBack(false), 4000);
        }
        return false;
      });
    };

    if (typeof navigator !== "undefined" && navigator.onLine === false) {
      goOffline();
    }
    window.addEventListener("offline", goOffline);
    window.addEventListener("online", goOnline);
    return () => {
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("online", goOnline);
    };
  }, []);

  if (!offline && !justBack) return null;

  return (
    <div
      // Polite, not assertive: this is worth knowing, not worth interrupting
      // whatever a screen reader is in the middle of.
      role="status"
      aria-live="polite"
      className={`sticky top-16 z-20 border-b px-4 py-2.5 text-center ${
        offline
          ? "border-accent/30 bg-accent/[0.12]"
          : "border-positive/30 bg-positive/[0.10]"
      }`}
    >
      <p className="prose-serif-xs mx-auto max-w-prose text-ink">
        {offline ? (
          <>
            No connection. Keep writing — what you type is kept on this device.
            <span className="text-muted">
              {" "}
              It will not send until you are back.
            </span>
          </>
        ) : (
          <>Back online. Anything you were writing is still here.</>
        )}
      </p>
    </div>
  );
}
