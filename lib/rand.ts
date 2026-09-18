/**
 * An id that does not depend on a secure context.
 *
 * `crypto.randomUUID` is only defined where the page is a secure context —
 * https, or localhost. It is undefined over plain http on a LAN address, which
 * is exactly how somebody tests the app on their own phone against a laptop,
 * and it is missing altogether before Safari 15.4. In both cases calling it
 * throws, and because the two call sites are in the photo picker, the throw
 * takes the whole compose flow down: you choose a picture and nothing happens.
 *
 * These ids are never security-bearing. They key a React list and name an
 * uploaded file; uniqueness is all that is asked of them. So the fallback is
 * plain Math.random, which is fine for that and is not pretending otherwise.
 */
export function randomId(): string {
  const c = typeof globalThis !== "undefined" ? globalThis.crypto : undefined;
  if (c && typeof c.randomUUID === "function") return c.randomUUID();
  if (c && typeof c.getRandomValues === "function") {
    const b = new Uint8Array(16);
    c.getRandomValues(b);
    return Array.from(b, (n) => n.toString(16).padStart(2, "0")).join("");
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
