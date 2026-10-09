/**
 * What Oyun says it is.
 *
 * ── Why this is a file and not a sentence typed seven times ──────────────
 * It was typed seven times — in the footer, on both halves of the sign-in
 * and sign-up screens, in the onboarding consent, on the terms page and in
 * the invitation email — and they had already drifted into three different
 * claims. That matters more here than anywhere else in the app: the
 * onboarding one is the closest thing to an agreement somebody makes, and an
 * app that describes itself one way in the thing you tick and another way in
 * the footer has not really told you anything.
 *
 * So there is one claim, in three lengths, and every surface takes the length
 * that fits rather than writing its own.
 *
 * ── Why the medical line is an instruction, not a disclaimer ─────────────
 * "Not medical advice" is a sentence written for the app's protection. "Take
 * anything to do with your health, or your baby's, to your doctor or midwife"
 * is the same fact written for the person reading it, and it tells her what
 * to actually do. For an app used during a pregnancy that is the only version
 * worth printing.
 */

/** The whole of it. Home, settings, the marketing page. */
export const PROMISE_FULL =
  "Oyun is a help for a family, and a place to keep family life private in an age that keeps nothing private. It is never a replacement for your church, those who shepherd you, or the friends who keep you honest. Agbebi offers Scripture, prayer and encouragement, never medical advice: take anything to do with your health, or your baby’s, to your doctor or midwife.";

/** One sentence, where a paragraph would be in the way. */
export const PROMISE_SHORT =
  "Oyun is a help for a family — never a replacement for your church, those who shepherd you, or your doctor or midwife.";

/**
 * What somebody agrees to at onboarding.
 *
 * First person, because a consent written in the third person is a notice
 * pretending to be an agreement.
 */
export const PROMISE_CONSENT =
  "I understand Oyun and Agbebi offer Scripture, prayer and encouragement — never medical advice — and are never a replacement for my church, those who shepherd me, or my doctor or midwife.";

/**
 * Where the whole thing is shown.
 *
 * ── Why not everywhere ───────────────────────────────────────────────────
 * Because a paragraph at the foot of every screen is three lines of a phone
 * given permanently to something that only needs saying where somebody is
 * deciding what this app is: the page that sells it, the home they open every
 * morning, and the settings where they go to change what it does. On every
 * other screen it is a wall between the last thing they were reading and the
 * bottom of the page.
 *
 * Elsewhere it is not deleted — it is hidden on phones and kept on wider
 * screens, where the room it takes costs nobody anything.
 */
export const PROMISE_ROUTES = ["/", "/journey", "/settings"];

export function showsFullPromise(pathname: string): boolean {
  return PROMISE_ROUTES.includes(pathname);
}
