import { NextResponse, type NextRequest } from "next/server";

/**
 * Somebody who is already signed in should not be shown the front door.
 *
 * ── The thing this fixes ─────────────────────────────────────────────────
 * The app added to an iPhone's home screen opens on the marketing page, and
 * a mother who uses this every day has to scroll past "what Oyun is" and tap
 * "I already have an account" to reach her own journey. Every single time.
 *
 * The manifest's start_url has said /journey for a long time, which is
 * right — but iOS pins the start URL when the app is ADDED to the home
 * screen and never reads the manifest again. Everybody who installed it
 * before is stuck on whatever page they installed from, for ever, and no
 * change to the manifest reaches them. So the fix has to be at the door
 * itself rather than in the manifest.
 *
 * ── Why middleware, and not a redirect inside the page ───────────────────
 * Because "/" is a static marketing page with its own metadata and canonical
 * URL, and calling auth() in it would make it dynamic for everybody —
 * rendering it per request, for every stranger and every crawler, to answer
 * a question only signed-in people ask.
 *
 * Here, the only requests that cost anything are the ones carrying a session
 * cookie. A crawler has none, a first-time visitor has none, and both are
 * served the same static page as before.
 *
 * ── Why the cookie is only looked AT, never opened ───────────────────────
 * This decides where to send somebody, not what they may see. Every page it
 * can send them to checks the session properly for itself, so the worst a
 * forged or stale cookie earns is a redirect to /journey, which bounces
 * straight to /sign-in. That means no secret, no token verification and no
 * database on this path — which matters, because this runs before every
 * request for the front page.
 */

/**
 * NextAuth's session cookie, under any of its names: plain over http in
 * development, `__Secure-` prefixed over https, and `.0`/`.1` suffixed when
 * the token is long enough to be split across several cookies.
 */
const SESSION_COOKIE = /^(?:__Secure-)?next-auth\.session-token(?:\.\d+)?$/;

/** Where a signed-in person actually wants to be. */
const HOME = "/journey";

/**
 * How somebody signed in gets to the front page anyway — to read it, or to
 * copy the address for a friend. Without this there would be no way back to
 * it at all once you have an account, which is a small trap to set.
 */
const STAY = "stay";

export function middleware(req: NextRequest) {
  if (req.nextUrl.searchParams.has(STAY)) return NextResponse.next();

  const signedIn = req.cookies
    .getAll()
    .some((c) => SESSION_COOKIE.test(c.name) && c.value.length > 0);
  if (!signedIn) return NextResponse.next();

  const to = req.nextUrl.clone();
  to.pathname = HOME;
  to.search = "";
  return NextResponse.redirect(to);
}

/**
 * The front page and nothing else.
 *
 * Deliberately narrow: this runs before a request is served, so every path
 * added here is a cost paid on every visit to it. Nothing else in the app
 * needs it — each page already guards itself.
 */
export const config = { matcher: ["/"] };
