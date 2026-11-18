/**
 * Telling the native shell apart from the web.
 *
 * The iOS and Android apps are thin Capacitor wrappers around the live site,
 * and each appends its own token to the user agent (`appendUserAgent` in
 * mobile/capacitor.config.ts). Because they load the deployed site rather than
 * a bundle, anything decided here reaches an installed app on the next page
 * load — no new build, no store review.
 *
 * Used sparingly. The web app should behave the same everywhere; this exists
 * for the few places where the shell genuinely differs.
 */

/** The tokens our own shells append. Nothing else may claim to be one. */
const SHELL_TOKENS = ["IdileNative", "OyunNative"];

export function isNativeShell(ua?: string): boolean {
  const agent = ua ?? (typeof navigator === "undefined" ? "" : navigator.userAgent);
  return SHELL_TOKENS.some((t) => agent.includes(t));
}

/**
 * The installed iOS app specifically.
 *
 * Why this is asked at all: a file input in the iOS shell offers "Take Photo"
 * in a sheet that WebKit draws, and until the shipped build carries
 * NSCameraUsageDescription that choice terminates the app. The row cannot be
 * removed from web code — the sheet is not ours — so the app says plainly
 * which one to choose instead. Delete this and its use once a build carrying
 * the key is out.
 */
export function isIosNativeShell(ua?: string): boolean {
  const agent = ua ?? (typeof navigator === "undefined" ? "" : navigator.userAgent);
  return isNativeShell(agent) && /iPhone|iPad|iPod/.test(agent);
}

/**
 * Any iPhone or iPad — Safari, the home-screen app or our shell. iPadOS
 * describes itself as a Mac, so a Mac with a touch screen counts too.
 *
 * Used to leave out "take a photo" buttons on iOS: opening the camera
 * straight from the app is not allowed there yet (and in the installed app
 * iOS can end the app while the camera is up), so iOS gets the photo
 * library picker only — which still offers the camera itself.
 */
export function isIos(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  return /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && (navigator.maxTouchPoints ?? 0) > 1);
}
