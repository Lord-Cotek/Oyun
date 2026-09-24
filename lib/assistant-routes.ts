/**
 * Where Agbebi does not appear.
 *
 * ── Why a list and not a permission check ────────────────────────────────
 * Agbebi is mounted once, in the root layout, which is right: every page
 * inside the app gets her without remembering to ask. The cost of that is
 * that she also appeared on the pages that are not inside the app at all —
 * a registry link forwarded to a grandmother, a single shared post, an
 * invitation. Those pages exist to show one thing to one person who has no
 * account and wants none, and a floating companion on them is at best a
 * distraction and at worst an invitation to spend somebody else's money.
 *
 * The real stop is on the server: /api/agbebi answers nobody without a
 * session, so a stranger with the link cannot spend a token whatever they
 * tap. This list is the other half — it means they are not offered
 * something that would only turn them away.
 *
 * ── Why these routes ─────────────────────────────────────────────────────
 * Every one of them is a door rather than a room: a page somebody lands on
 * from outside, holding a link. /p a shared post, /r a registry, /i an
 * invitation, /v a verse, /h a hymn, and the four sign-in screens. The
 * marketing page is deliberately not here — somebody weighing up Oyun may
 * open Agbebi and be told, plainly, that she walks with families inside it.
 *
 * ── Why the match is strict ──────────────────────────────────────────────
 * A bare `startsWith("/h")` would swallow Ìdílé's /health, which is as
 * inside the app as a page gets. An entry matches its own path exactly, or
 * a path beneath it, and nothing else.
 *
 * This is not a drift-tracked file: the two apps have different doors.
 */
export const GUEST_ROUTES = [
  // The admin centre. Not a door — the opposite, a back office — but it
  // belongs on the same list for the same practical reason: it is not one of
  // the family's rooms, and a floating companion in a back office is a
  // companion somebody forgets they are being watched by. The name of this
  // list is now a little narrow for what it holds; the rule it encodes is
  // "everywhere Agbebi does not appear", which the file's own title says.
  "/admin",
  "/p",
  "/r",
  "/i",
  "/v",
  "/h",
  "/sign-in",
  "/sign-up",
  "/forgot-password",
  "/reset-password",
];

export function isGuestRoute(pathname: string): boolean {
  return GUEST_ROUTES.some(
    (r) => pathname === r || pathname.startsWith(`${r}/`),
  );
}
