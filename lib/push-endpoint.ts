/**
 * Only the real push services.
 *
 * A browser hands us a "push endpoint" — an address at its maker's push
 * service — and the server later sends to it. Taken on trust, any signed-in
 * person could register any address at all and have this server send
 * requests to it: somewhere on its own network, or anyone's. So an endpoint
 * is accepted, and sent to, only when it is HTTPS on a host one of the
 * browser makers runs.
 */
const SUFFIXES = [
  "fcm.googleapis.com", // Chrome, Edge, Android
  "android.googleapis.com", // older Chrome
  "push.services.mozilla.com", // Firefox
  "push.apple.com", // Safari (web.push.apple.com and friends)
  "notify.windows.com", // older Edge
];

export const ENDPOINT_MAX = 1024;
export const KEY_MAX = 256;

export function isPushEndpoint(raw: string): boolean {
  if (!raw || raw.length > ENDPOINT_MAX) return false;
  let u: URL;
  try {
    u = new URL(raw);
  } catch {
    return false;
  }
  if (u.protocol !== "https:" || u.username || u.password || u.port) return false;
  const host = u.hostname.toLowerCase();
  return SUFFIXES.some((s) => host === s || host.endsWith(`.${s}`));
}
