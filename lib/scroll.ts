/**
 * Moving the page, at a speed the person has already asked for.
 *
 * Two things were wrong before this file existed.
 *
 * The first: `scrollIntoView({ behavior: "smooth" })` was written out by hand
 * in the liturgy rail and the notification bell. A hardcoded behaviour is not
 * covered by the `prefers-reduced-motion` block in globals.css — that rule can
 * shorten a CSS transition, but it cannot reach into an argument passed to a
 * DOM method. Somebody who has told their phone that motion makes them ill was
 * getting a smooth scroll anyway, from the two places in the app most likely to
 * fire without them asking.
 *
 * The second: arriving at a deep link from a notification — `/circle#prayer-x`
 * — was a hard jump. You tap a line that says somebody prayed for you, the
 * page loads, and you are somewhere in the middle of a list with no sense of
 * where you came from. The pulse ring tells you which item; it does not tell
 * you where it sits.
 *
 * ── Why not just `html { scroll-behavior: smooth }` ───────────────────────
 * Because it would make every tab change worse. Next's App Router scrolls back
 * to the top on navigation, and in Next 14 it does not neutralise
 * `scroll-behavior` first. On a long room that turns an instant tab switch
 * into a second of the whole page sliding past. Smooth belongs on the two
 * movements a person asked for — following a link to an anchor, stepping
 * through the liturgy — and nowhere else.
 */

/** Has this person asked their system for less movement? */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    // An engine without this media query is one that predates the setting.
    return false;
  }
}

/**
 * Bring an element into view at the speed the viewer has asked for.
 *
 * Read fresh each time rather than cached, because the setting can be changed
 * while the app is open — on iOS it is two taps away in Accessibility.
 */
export function scrollToElement(
  el: Element | null | undefined,
  block: ScrollLogicalPosition = "center",
) {
  if (!el) return;
  el.scrollIntoView({
    behavior: prefersReducedMotion() ? "auto" : "smooth",
    block,
  });
}
