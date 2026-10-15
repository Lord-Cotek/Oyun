/**
 * Finding the links in something a person typed, on a page anybody may be
 * forwarded.
 *
 * ── Why bare links only, and never [text](url) ───────────────────────────
 * An invitation is a public page that gets forwarded round a family twenty
 * times. Link syntax where the visible words can differ from the destination
 * is the whole mechanism of a phishing link: "the venue map" pointing
 * somewhere else entirely. So only a URL a person actually typed becomes a
 * link, and the words you read are the address you go to.
 *
 * ── Why the scheme is parsed and not just trusted ────────────────────────
 * `javascript:` in an href runs code. So does `data:`. Every candidate goes
 * through the URL parser and anything that is not http or https comes back
 * null, so a caller that forgets to check still cannot produce a dangerous
 * href. This is not belt-and-braces; it is the difference between a family's
 * invitation and a way into whoever opens it.
 *
 * ── Why the address is shortened but the host never is ───────────────────
 * A shop link runs to two hundred characters and wrecks the page. But the
 * host is the part that tells a reader where they are about to go, so it is
 * kept whole and only the path after it is trimmed. A link that hid its own
 * host would be worse than no link at all.
 *
 * ── Where this is deliberately NOT used ──────────────────────────────────
 * The admin centre. A concern is typed by somebody we have never met and read
 * by an operator with a session open; turning that into something clickable
 * would hand a stranger a link into the back office. It stays plain there on
 * purpose.
 */

/**
 * Only ever http, https, or www. Stops at whitespace and at the characters
 * that cannot sit in an href without escaping — which is also what stops a
 * quote in somebody's note from reaching an attribute.
 */
const LINK = /\b(?:https?:\/\/|www\.)[^\s<>"'`‘’“”]+/gi;

/** Punctuation that ends a sentence rather than a URL. */
const TRAILING = /[.,;:!?'"’”]+$/;

/** How long a link may be on the page before its path is trimmed. */
const SHOWN = 44;

/** Where the link actually goes, or null if it is not plainly http(s). */
export function safeHref(raw: string): string | null {
  const withScheme = /^www\./i.test(raw) ? `https://${raw}` : raw;
  let parsed: URL;
  try {
    parsed = new URL(withScheme);
  } catch {
    return null;
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;
  return parsed.toString();
}

/**
 * What the reader sees: the host in full, and as much of the path as fits.
 *
 * The scheme and a leading www. come off because they tell a reader nothing.
 * The host never does.
 */
export function displayUrl(raw: string): string {
  const href = safeHref(raw);
  if (!href) return raw;
  let parsed: URL;
  try {
    parsed = new URL(href);
  } catch {
    return raw;
  }
  const host = parsed.host.replace(/^www\./i, "");
  const rest = `${parsed.pathname}${parsed.search}${parsed.hash}`.replace(/\/$/, "");
  if (!rest) return host;
  const room = SHOWN - host.length;
  if (room <= 1) return host;
  return rest.length <= room ? `${host}${rest}` : `${host}${rest.slice(0, room - 1)}…`;
}

export interface Piece {
  text: string;
  /** Set when this run is a link. */
  url?: string;
}

/** Split text into the runs between links and the links themselves. */
export function linkPieces(text: string): Piece[] {
  const out: Piece[] = [];
  let last = 0;
  for (const m of text.matchAll(LINK)) {
    const at = m.index ?? 0;
    let found = m[0].replace(TRAILING, "");
    // A closing bracket comes off unless the URL opened one itself — so a
    // link inside brackets works, and so does a Wikipedia_(title).
    while (found.endsWith(")") && !found.includes("(")) found = found.slice(0, -1);
    while (found.endsWith("]") && !found.includes("[")) found = found.slice(0, -1);
    if (!found || !safeHref(found)) continue;
    if (at > last) out.push({ text: text.slice(last, at) });
    out.push({ text: found, url: found });
    last = at + found.length;
  }
  if (last < text.length) out.push({ text: text.slice(last) });
  return out;
}

/** True when there is at least one link in here. */
export function hasLink(text: string | null | undefined): boolean {
  if (!text) return false;
  return linkPieces(text).some((p) => !!p.url);
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * The same thing for an email, where there is no React.
 *
 * Everything is escaped and the href is the PARSED url, so a stray quote in
 * somebody's note cannot break out of the attribute it sits in. Returns HTML,
 * so a caller must not escape it again.
 */
export function autolinkHtml(text: string | null | undefined, colour = "#C9A227"): string {
  if (!text) return "";
  return linkPieces(text)
    .map((p) => {
      if (!p.url) return escapeHtml(p.text);
      const href = safeHref(p.url);
      if (!href) return escapeHtml(p.text);
      return `<a href="${escapeHtml(href)}" style="color:${colour};" target="_blank" rel="noopener noreferrer nofollow">${escapeHtml(displayUrl(p.url))}</a>`;
    })
    .join("");
}

/**
 * The same text with each link written the short way, and no markup.
 *
 * For the places a link cannot be tapped — an open-graph image, a plain-text
 * email — where a two-hundred-character shop address is only ever noise.
 */
export function plainLinks(text: string | null | undefined): string {
  if (!text) return "";
  return linkPieces(text)
    .map((p) => (p.url ? displayUrl(p.url) : p.text))
    .join("");
}
