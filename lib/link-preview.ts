import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

/**
 * Reading a pasted shop link.
 *
 * She pastes a URL from anywhere — Amazon, Noon, Mumzworld, a shop nobody has
 * heard of — and this fetches the page once and takes the name, the picture
 * and the price out of it. Everything it finds is a suggestion: the form is
 * filled in with it and she can change any of it, because these tags are
 * written by shops for social networks and they are frequently wrong.
 *
 * ── This function fetches a URL a user typed, which is the whole problem ──
 * That is server-side request forgery in its plainest form: give an app a URL
 * and it will fetch it from inside its own network, where the metadata
 * service, the database and the internal admin pages live. So, in order:
 *
 *   1. http(s) only — no file:, no gopher:, no data:.
 *   2. The hostname is resolved HERE, and the address checked against every
 *      private range, before any request is made.
 *   3. Redirects are followed by hand, three at most, with the check repeated
 *      on each hop. A redirect to 169.254.169.254 is the classic way past a
 *      check done only on the first URL.
 *   4. A timeout, and a cap on how much is read. A shop page that streams
 *      forever must not hold a connection open forever.
 *   5. Only the <head> matters, so reading stops early.
 *
 * What it does NOT do is scrape a listing — no price history, no stock, no
 * walking somebody's wishlist and pulling the items out of it. That breaks
 * the week a shop changes its markup, and a registry that silently loses its
 * items is worse than one that never had them.
 */

const TIMEOUT_MS = 6000;
const MAX_BYTES = 512 * 1024;
const MAX_REDIRECTS = 3;

export interface LinkPreview {
  url: string;
  title: string | null;
  imageUrl: string | null;
  price: string | null;
  /** True when the link is a whole list rather than one item. */
  wholeList: boolean;
  /** Set when nothing could be read — she types it herself instead. */
  failed?: string;
}

/**
 * Wishlist and registry addresses, which are lists rather than single items.
 *
 * Matched so the form can say "this looks like a whole list" and put it on as
 * one card instead of pretending to be a cot. Missing one is harmless — she
 * can pick the kind herself — so this stays a short list of the obvious ones
 * rather than a regex that tries to be clever about every shop on earth.
 */
const LIST_PATTERNS: { host: RegExp; path: RegExp }[] = [
  { host: /(^|\.)amazon\.[a-z.]+$/i, path: /\/(wishlist|registry|hz\/wishlist|gp\/registry)/i },
  { host: /(^|\.)noon\.com$/i, path: /\/wishlist/i },
  { host: /(^|\.)mumzworld\.com$/i, path: /\/(wishlist|registry)/i },
  { host: /(^|\.)babylist\.com$/i, path: /./ },
  { host: /(^|\.)myregistry\.com$/i, path: /./ },
];

export function looksLikeWholeList(raw: string): boolean {
  try {
    const u = new URL(raw);
    return LIST_PATTERNS.some(
      (p) => p.host.test(u.hostname) && p.path.test(u.pathname),
    );
  } catch {
    return false;
  }
}

/** Every address range that is not the public internet. */
function isPrivateAddress(ip: string): boolean {
  const v = isIP(ip);
  if (v === 4) {
    const [a, b] = ip.split(".").map(Number);
    if (a === 10) return true;
    if (a === 127) return true;
    if (a === 0) return true;
    if (a === 169 && b === 254) return true; // link-local, incl. cloud metadata
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 192 && b === 168) return true;
    if (a === 100 && b >= 64 && b <= 127) return true; // carrier-grade NAT
    if (a >= 224) return true; // multicast and reserved
    return false;
  }
  if (v === 6) return isPrivateV6(ip.toLowerCase());
  return true;
}

/**
 * An IPv6 address as its eight numbers.
 *
 * Written out rather than matched on the text, because the text is not
 * dependable: `new URL("http://[::ffff:127.0.0.1]/")` hands back the hostname
 * as `[::ffff:7f00:1]`, having canonicalised the dotted tail into hex. A
 * check that looks for "127." in the string sees nothing wrong with that, and
 * loopback walks straight through. Expanding first is the only version that
 * holds.
 */
function expandV6(ip: string): number[] | null {
  let text = ip;
  // A dotted IPv4 tail, if it survived, becomes two more hextets.
  const dotted = text.match(/(\d{1,3}(?:\.\d{1,3}){3})$/);
  if (dotted) {
    const q = dotted[1].split(".").map(Number);
    if (q.some((n) => !Number.isInteger(n) || n < 0 || n > 255)) return null;
    const hi = ((q[0] << 8) | q[1]).toString(16);
    const lo = ((q[2] << 8) | q[3]).toString(16);
    text = text.slice(0, -dotted[1].length) + `${hi}:${lo}`;
  }

  const halves = text.split("::");
  if (halves.length > 2) return null;
  const part = (t: string) => (t ? t.split(":").filter(Boolean) : []);
  const head = part(halves[0]);
  const tail = halves.length === 2 ? part(halves[1]) : [];
  const gap = 8 - head.length - tail.length;
  if (halves.length === 1 && head.length !== 8) return null;
  if (halves.length === 2 && gap < 0) return null;
  const groups =
    halves.length === 2
      ? [...head, ...Array(gap).fill("0"), ...tail]
      : head;
  const out = groups.map((g) => Number.parseInt(g, 16));
  return out.length === 8 && out.every((n) => Number.isInteger(n) && n >= 0 && n <= 0xffff)
    ? out
    : null;
}

function isPrivateV6(ip: string): boolean {
  const g = expandV6(ip);
  // Unparseable is refused: this is a guard, and "I do not understand this
  // address" is not a reason to go and fetch it.
  if (!g) return true;

  // ::ffff:a.b.c.d — an IPv4 address carried inside an IPv6 one. The four
  // bytes are the real destination, so they are what gets judged.
  if (g[0] === 0 && g[1] === 0 && g[2] === 0 && g[3] === 0 && g[4] === 0 && g[5] === 0xffff) {
    const v4 = `${g[6] >> 8}.${g[6] & 0xff}.${g[7] >> 8}.${g[7] & 0xff}`;
    return isPrivateAddress(v4);
  }
  // ::1, ::, and the deprecated IPv4-compatible ::a.b.c.d, all of which point
  // back inside.
  if (g.slice(0, 7).every((n) => n === 0)) return true;
  if (g.slice(0, 5).every((n) => n === 0) && g[5] === 0) return true;

  if ((g[0] & 0xffc0) === 0xfe80) return true; // link-local fe80::/10
  if ((g[0] & 0xfe00) === 0xfc00) return true; // unique-local fc00::/7
  if ((g[0] & 0xff00) === 0xff00) return true; // multicast ff00::/8
  return false;
}

/** Is this address safe to fetch from a server? Resolved, not trusted. */
async function reachable(u: URL): Promise<boolean> {
  if (u.protocol !== "https:" && u.protocol !== "http:") return false;
  const host = u.hostname.replace(/^\[|\]$/g, "");
  if (isIP(host)) return !isPrivateAddress(host);
  try {
    const all = await lookup(host, { all: true });
    if (all.length === 0) return false;
    // Every address it resolves to, not just the first: a host that answers
    // with one public and one private address must not be fetched at all.
    return all.every((a) => !isPrivateAddress(a.address));
  } catch {
    return false;
  }
}

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/gi, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
}

/** Pull one meta tag's content, whichever order the attributes are written in. */
function meta(html: string, name: string): string | null {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const patterns = [
    new RegExp(
      `<meta[^>]+(?:property|name)=["']${escaped}["'][^>]*content=["']([^"']*)["']`,
      "i",
    ),
    new RegExp(
      `<meta[^>]+content=["']([^"']*)["'][^>]*(?:property|name)=["']${escaped}["']`,
      "i",
    ),
  ];
  for (const re of patterns) {
    const m = html.match(re);
    if (m?.[1]) return decodeEntities(m[1]).trim() || null;
  }
  return null;
}

function titleTag(html: string): string | null {
  const m = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  return m?.[1] ? decodeEntities(m[1]).trim() || null : null;
}

/** Read at most MAX_BYTES, and stop at </head> — the tags are all up there. */
async function readHead(res: Response): Promise<string> {
  const reader = res.body?.getReader();
  if (!reader) return "";
  const decoder = new TextDecoder("utf-8", { fatal: false });
  let html = "";
  let bytes = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      html += decoder.decode(value, { stream: true });
      if (bytes >= MAX_BYTES || /<\/head>/i.test(html)) break;
    }
  } finally {
    await reader.cancel().catch(() => {});
  }
  return html;
}


/**
 * What a page says about itself, taken out of its head.
 *
 * Separate from the fetching because the two fail in completely different
 * ways and are worth checking separately: this half has no network in it at
 * all, so a shop's real markup can be run through it directly.
 */
export function previewFromHtml(
  html: string,
  base: URL,
): { url: string; title: string | null; imageUrl: string | null; price: string | null } {
  const image = meta(html, "og:image") ?? meta(html, "twitter:image");
  let imageUrl: string | null = null;
  if (image) {
    try {
      const abs = new URL(image, base);
      // Rendered later in an <img>; anything but http(s) has no business
      // reaching a browser from here.
      if (abs.protocol === "https:" || abs.protocol === "http:") {
        imageUrl = abs.toString();
      }
    } catch {
      /* a malformed image URL is simply no image */
    }
  }

  const amount =
    meta(html, "product:price:amount") ?? meta(html, "og:price:amount");
  const currency =
    meta(html, "product:price:currency") ?? meta(html, "og:price:currency");

  return {
    url: base.toString(),
    title: (meta(html, "og:title") ?? titleTag(html))?.slice(0, 120) ?? null,
    imageUrl,
    price: amount
      ? [currency, amount].filter(Boolean).join(" ").slice(0, 40)
      : null,
  };
}

/** Exposed so the address guard can be checked directly. It is the one piece
 *  here whose failure is a security bug rather than a blank form field. */
export async function addressIsPublic(u: URL): Promise<boolean> {
  return reachable(u);
}

export async function readLink(raw: string): Promise<LinkPreview> {
  const trimmed = raw.trim();
  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    return {
      url: trimmed,
      title: null,
      imageUrl: null,
      price: null,
      wholeList: false,
      failed: "That does not look like a web address.",
    };
  }

  const wholeList = looksLikeWholeList(trimmed);
  const bare: LinkPreview = {
    url: url.toString(),
    title: null,
    imageUrl: null,
    price: null,
    wholeList,
  };

  if (url.protocol !== "https:" && url.protocol !== "http:") {
    return { ...bare, failed: "Only web links, please." };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    let current = url;
    let html = "";
    for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
      if (!(await reachable(current))) {
        return { ...bare, failed: "That address could not be opened." };
      }
      const res = await fetch(current.toString(), {
        redirect: "manual",
        signal: controller.signal,
        headers: {
          // Shops serve their social tags to anything that looks like a
          // browser and a stub to anything that does not.
          "user-agent":
            "Mozilla/5.0 (compatible; OyunRegistry/1.0; +https://oyun.cotek.app)",
          accept: "text/html,application/xhtml+xml",
          "accept-language": "en",
        },
      });

      if (res.status >= 300 && res.status < 400) {
        const next = res.headers.get("location");
        if (!next) break;
        // Resolved against the URL we actually asked for, and then checked
        // again at the top of the loop. This is the hop that matters.
        current = new URL(next, current);
        continue;
      }
      if (!res.ok) {
        return { ...bare, failed: "That shop did not answer." };
      }
      const type = res.headers.get("content-type") ?? "";
      if (!type.includes("html")) {
        return { ...bare, failed: "There was no page to read there." };
      }
      html = await readHead(res);
      break;
    }

    if (!html) return { ...bare, failed: "Nothing could be read from that link." };

    return { ...bare, ...previewFromHtml(html, current) };
  } catch {
    // A timeout, a refused connection, a shop behind a wall. None of these is
    // an error a person needs explaining — she types the name herself and the
    // item is just as good.
    return { ...bare, failed: "That link could not be read. Type it in yourself?" };
  } finally {
    clearTimeout(timer);
  }
}
