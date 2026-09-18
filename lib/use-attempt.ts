"use client";

import { useState, useTransition } from "react";

/**
 * Show the change at once — and put it back if it did not take.
 *
 * Every one of these small acts goes to a server: a reaction, a prayer held,
 * a reminder ticked off. Waiting for the round trip before moving anything
 * makes a phone on a poor signal feel broken, so the app has always shown the
 * change immediately and sent the request behind it. That part was right.
 *
 * What was wrong was the other half. If the request failed — the signal went,
 * the session expired, somebody had already left the household — the screen
 * went on showing the reaction, the lit ember, the ticked-off reminder, and
 * said nothing. A person walks away believing they prayed for their sister and
 * the record does not have it. Optimism with no way back is not optimism; it
 * is a page telling you something it does not know to be true.
 *
 * So: `attempt` takes the undo alongside the action. If the server refuses or
 * cannot be reached, the change is rolled back where the person can see it and
 * a plain line says so. No toast that vanishes before it is read, no retry
 * loop that hides the failure: the thing you tapped goes back to how it was,
 * which is the only honest picture, and you can tap it again.
 *
 * ── On the shape of the return ───────────────────────────────────────────
 * A thrown error is a network or crash. A server action that returns
 * `{ ok: false }` is a considered refusal — not permitted, no longer there.
 * Both are failures to the person holding the phone, and both roll back.
 * An action that returns nothing is taken at its word, because there is
 * nothing else to go on.
 */
export type Attempted = { ok: boolean } | void | undefined;

export function useAttempt() {
  const [pending, start] = useTransition();
  const [slipped, setSlipped] = useState<string | null>(null);

  /**
   * @param apply   move the screen now
   * @param action  tell the server
   * @param undo    put the screen back if the server did not agree
   * @param message what to say if it did not — written for the person, not the log
   */
  function attempt(
    apply: () => void,
    action: () => Promise<Attempted>,
    undo: () => void,
    message: string,
  ) {
    setSlipped(null);
    apply();
    start(async () => {
      let ok = true;
      try {
        const res = await action();
        if (res && res.ok === false) ok = false;
      } catch {
        ok = false;
      }
      if (!ok) {
        undo();
        setSlipped(message);
      }
    });
  }

  /** Clear the note — call it when the person tries again. */
  function settled() {
    setSlipped(null);
  }

  return { attempt, pending, slipped, settled };
}
