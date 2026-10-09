/**
 * The tick under the thumb.
 *
 * A phone confirms a tap in three ways at once — the control moves, the sound
 * of the tap, and a small knock against the finger. This app has never done
 * the third, and its absence is most of why a control here feels like a link
 * on a page rather than a button on a device. It is the cheapest part of
 * "feels like an app" and the one no amount of visual polish substitutes for.
 *
 * ── Where the knock actually comes from ──────────────────────────────────
 * Three surfaces, and each of them can be missing:
 *
 *   The installed iOS/Android app. Capacitor exposes its plugins on
 *   `window.Capacitor.Plugins`, so we reach for Haptics there rather than
 *   importing `@capacitor/haptics` — the shells load the deployed site rather
 *   than a bundle (see lib/shell.ts), so the web build has no business
 *   depending on a native package it cannot see. If the shipped shell was
 *   built before the plugin was added, the object simply is not there and we
 *   fall through.
 *
 *   Android in a browser. `navigator.vibrate` is real and works, though it is
 *   a blunter instrument than the taptic engine — a motor, not a tap.
 *
 *   iOS in a browser. Nothing. WebKit has never shipped the Vibration API and
 *   shows no sign of it. An iPhone user on the website gets no knock and there
 *   is no trick that changes that; the installed app is the answer, which is
 *   an honest reason to offer one.
 *
 * So every path here is best-effort and every path is allowed to be absent.
 * Nothing in this file may throw: a missing buzz is not worth a broken tap,
 * and this runs inside the handler of every button in the app.
 */

type CapacitorHaptics = {
  impact?: (opts: { style: string }) => Promise<void> | void;
};

type CapacitorGlobal = {
  Plugins?: { Haptics?: CapacitorHaptics };
};

/**
 * A light knock, for a control that has just been committed.
 *
 * Deliberately the lightest thing either platform offers. A tap is meant to be
 * felt and not noticed; anything heavier turns into a toy on the first day and
 * an irritation on the second, and this is an app people open several times a
 * day for years.
 *
 * Call it when the action commits — on the click — not when the finger lands.
 * Pressing and then sliding away to cancel is a real gesture people use to
 * change their mind, and a phone that buzzes for a tap you deliberately
 * abandoned is worse than one that never buzzed at all. Scrolling a list would
 * be the same mistake at fifty times the volume.
 */
export function tap(): void {
  if (typeof window === "undefined") return;

  try {
    const cap = (window as { Capacitor?: CapacitorGlobal }).Capacitor;
    const haptics = cap?.Plugins?.Haptics;
    if (haptics?.impact) {
      // Capacitor's bridge hands back a promise that rejects when the plugin
      // is present in JS but unimplemented on this platform (the web build of
      // the plugin does exactly that). An unhandled rejection from a button
      // press would show up in every error report in the app.
      void Promise.resolve(haptics.impact({ style: "LIGHT" })).catch(() => {});
      return;
    }

    // 8ms is about as short as the hardware will honour. Longer reads as a
    // buzz — a notification — rather than a tap.
    if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
      navigator.vibrate(8);
    }
  } catch {
    // A phone that refuses to vibrate (a permissions policy, a browser that
    // exposes the method and then throws, a shell mid-upgrade) is not an
    // error anybody needs to hear about. The tap still worked.
  }
}

/**
 * A firmer knock, for the moment something is written down.
 *
 * The one step up from `tap`, and it has exactly one job: the end of a
 * deliberate act. Holding to pray until the ember fills is the clearest case —
 * the person did something that took over a second and needs to know it
 * landed. A tap is "heard you"; this is "it is done".
 *
 * Use it sparingly enough that it keeps meaning that. If it starts appearing
 * on ordinary buttons it becomes noise, and then the only honest fix is to
 * turn all of it off.
 */
export function sealed(): void {
  if (typeof window === "undefined") return;

  try {
    const cap = (window as { Capacitor?: CapacitorGlobal }).Capacitor;
    const haptics = cap?.Plugins?.Haptics;
    if (haptics?.impact) {
      void Promise.resolve(haptics.impact({ style: "MEDIUM" })).catch(() => {});
      return;
    }
    if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
      navigator.vibrate(18);
    }
  } catch {
    /* as above — never worth failing the act it was confirming */
  }
}
