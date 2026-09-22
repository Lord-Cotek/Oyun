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
 *   5. Reading stops as soon as the head has given us a picture, and at the
 *      cap otherwise — see readDocument for why it can no longer stop at
 *      </head> and still read most shops.
 *
 * What it does NOT do is scrape a listing — no price history, no stock, no
 * walking somebody's wishlist and pulling the items out of it. That breaks
 * the week a shop changes its markup, and a registry that silently loses its
 * items is worse than one that never had them.
 */

const TIMEOUT_MS = 9000;
const MAX_BYTES = 512 * 1024;
const MAX_REDIRECTS = 3;

/**
 * What we tell a shop we are.
 *
 * This used to name the app honestly — "OyunRegistry/1.0" — and that is why
 * so many links came back with nothing. A shop's own comment two lines up
 * had it right: the social tags are served to things that look like a
 * browser, and a stub to everything else. Most large retailers sit behind a
 * CDN that blocks or degrades anything it does not recognise, and a Gulf
 * retailer on Salesforce Commerce Cloud or Akamai is exactly that case.
 *
 * So the request looks like the browser the person pasting the link is
 * holding. Nothing about it is hidden: it is one GET of a public product
 * page, no crawling, no session, no cookies kept, and the page is read for
 * the three things the shop published for this purpose.
 */
const BROWSER_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

/**
 * Gulf storefronts serve an Arabic page to a request that asks for one, and
 * their English product names are what a family here is pasting. Asking for
 * English first, with Arabic still acceptable, gets the page they saw.
 */
const ACCEPT_LANGUAGE = "en-AE,en-GB;q=0.9,en;q=0.8,ar;q=0.6";

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

/**
 * A product's name, read out of its own address.
 *
 * ── Why this is worth having ─────────────────────────────────────────────
 * Some shops will not be read at all. A large retailer behind bot protection
 * answers a request from a datacentre with a refusal no matter how the
 * request is dressed, and trying harder than this becomes an arms race that
 * a family app has no business being in.
 *
 * But the address itself usually carries the name — /juniors-twin-stroller/p/
 * — because shops put it there for search engines. So a link that cannot be
 * opened still arrives with something in the box, and she corrects a word
 * instead of typing the lot. It is offered as a guess and said to be one.
 *
 * Deliberately conservative: it takes the longest word-like segment, ignores
 * the parts that are plainly machinery, and gives back nothing rather than
 * something silly.
 */
const PATH_NOISE =
  /^(p|product|products|item|items|dp|gp|shop|store|buy|c|cat|category|en|ar|ae|uae|sa|ksa|qa|kw|bh|om|eg|us|uk|gb|en-ae|en-gb|en-us|ar-ae|home|index)$/i;

export function nameFromUrl(raw: string): string | null {
  let u: URL;
  try {
    u = new URL(raw);
  } catch {
    return null;
  }
  const best = u.pathname
    .split("/")
    .map((s) => decodeURIComponent(s).trim())
    .filter(Boolean)
    .filter((s) => !PATH_NOISE.test(s))
    // Machinery: ids, SKUs, anything that is mostly not letters.
    .filter((s) => /[a-z]{3}/i.test(s))
    .filter((s) => !/^[0-9a-f]{16,}$/i.test(s))
    .filter((s) => (s.match(/\d/g)?.length ?? 0) < s.length / 2)
    .map((s) => s.replace(/\.(html?|php|aspx?)$/i, ""))
    .sort((a, b) => b.length - a.length)[0];
  if (!best) return null;

  const words = best
    .replace(/[-_+]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean);
  if (words.length === 0) return null;
  // One long unbroken token is a slug we have not understood, not a name.
  if (words.length === 1 && !/[-_]/.test(best) && best.length > 24) return null;

  const name = words
    .map((w) => (w.length > 2 ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ")
    .slice(0, 120);
  return name.length >= 3 ? name : null;
}

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

/**
 * Read at most MAX_BYTES of the page.
 *
 * ── Why this no longer stops at </head> ──────────────────────────────────
 * It used to, on the reasoning that "the tags are all up there". They are
 * not. A large retailer — Centrepoint, Noon, Mothercare, most of the Gulf —
 * describes its product in a JSON-LD block, and that block is very often in
 * the body. Stopping at the head meant we read the one place the picture
 * was not and reported that the link could not be read.
 *
 * So it keeps reading, and stops early only when the head is closed AND the
 * head already gave us a picture — the common, fast case, unchanged. The cap
 * is what protects us, not the </head>, and the cap was always there.
 *
 * The charset comes from the response where the response states one. A Gulf
 * shop serving windows-1256 used to arrive as mojibake, which is a product
 * name no family would keep.
 */
async function readDocument(res: Response): Promise<string> {
  const reader = res.body?.getReader();
  if (!reader) return "";
  const decoder = decoderFor(res.headers.get("content-type"));
  let html = "";
  let bytes = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      html += decoder.decode(value, { stream: true });
      if (bytes >= MAX_BYTES) break;
      if (/<\/head>/i.test(html) && /og:image|twitter:image/i.test(html)) break;
    }
  } finally {
    await reader.cancel().catch(() => {});
  }
  return html;
}

/** Whatever the shop said it was encoded in, falling back to UTF-8. */
function decoderFor(contentType: string | null): TextDecoder {
  const label = contentType?.match(/charset=["']?([\w-]+)/i)?.[1];
  if (label) {
    try {
      return new TextDecoder(label, { fatal: false });
    } catch {
      /* an encoding this runtime does not know is no reason to give up */
    }
  }
  return new TextDecoder("utf-8", { fatal: false });
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
  const ld = productFromJsonLd(html);

  // Each of these is tried in turn, best-supported first. Open Graph is what
  // a shop writes for a social network and is usually right; JSON-LD is what
  // it writes for a search engine and is what most large retailers — and
  // nearly every Gulf storefront — actually fill in; the rest are older
  // conventions that some shops still carry and cost nothing to look at.
  const image =
    meta(html, "og:image") ??
    meta(html, "og:image:secure_url") ??
    meta(html, "twitter:image") ??
    meta(html, "twitter:image:src") ??
    ld.image ??
    linkHref(html, "image_src") ??
    itemprop(html, "image") ??
    meta(html, "thumbnail");

  const title =
    meta(html, "og:title") ??
    meta(html, "twitter:title") ??
    ld.name ??
    itemprop(html, "name") ??
    titleTag(html);

  const amount =
    meta(html, "product:price:amount") ??
    meta(html, "og:price:amount") ??
    meta(html, "product:price") ??
    ld.price ??
    itemprop(html, "price");
  const currency =
    meta(html, "product:price:currency") ??
    meta(html, "og:price:currency") ??
    ld.currency ??
    itemprop(html, "priceCurrency");

  return {
    url: base.toString(),
    title: cleanTitle(title)?.slice(0, 120) ?? null,
    imageUrl: absoluteImage(image, base),
    price: amount
      ? [currency, amount].filter(Boolean).join(" ").trim().slice(0, 40)
      : null,
  };
}

/** Rendered later in an <img>, so anything but http(s) is simply no image. */
function absoluteImage(raw: string | null, base: URL): string | null {
  if (!raw) return null;
  try {
    const abs = new URL(raw, base);
    return abs.protocol === "https:" || abs.protocol === "http:"
      ? abs.toString()
      : null;
  } catch {
    return null;
  }
}

/**
 * Shops put the site's name on the end of every product title — "Baby Cot |
 * Centrepoint UAE", "… - Noon". She can edit it, but starting her off with
 * the shop's marketing appended is starting her off with something to delete.
 * Only trimmed when there is a real name in front of it.
 */
function cleanTitle(raw: string | null): string | null {
  if (!raw) return null;
  const head = raw.split(/\s+[|–—]\s+|\s+-\s+/)[0]?.trim();
  return head && head.length >= 12 ? head : raw.trim() || null;
}

/** <link rel="image_src" href="…"> — older, and still out there. */
function linkHref(html: string, rel: string): string | null {
  const patterns = [
    new RegExp(`<link[^>]+rel=["']${rel}["'][^>]*href=["']([^"']+)["']`, "i"),
    new RegExp(`<link[^>]+href=["']([^"']+)["'][^>]*rel=["']${rel}["']`, "i"),
  ];
  for (const re of patterns) {
    const m = html.match(re);
    if (m?.[1]) return decodeEntities(m[1]).trim() || null;
  }
  return null;
}

/** Microdata: <span itemprop="price" content="249">. */
function itemprop(html: string, name: string): string | null {
  const re = new RegExp(
    `itemprop=["']${name}["'][^>]*content=["']([^"']*)["']`,
    "i",
  );
  const m = html.match(re);
  return m?.[1] ? decodeEntities(m[1]).trim() || null : null;
}

/**
 * What the shop told a search engine.
 *
 * ── Why this is worth the trouble ────────────────────────────────────────
 * It is the difference between reading most links and reading some. Open
 * Graph is optional and plenty of retailers skip it; structured product data
 * is not optional if you want to appear in a search result, so almost every
 * real shop has it — including the ones whose links were coming back blank.
 *
 * The shapes in the wild are varied: a bare object, an array, a @graph, an
 * image that is a string or a list or an object with a url, offers that are
 * one object or several. So this walks whatever it is given and takes the
 * first product-shaped thing it finds. Anything it cannot parse is skipped
 * without a word — a shop with broken JSON on its page is not a failure a
 * family needs explaining, and the fields below it still apply.
 */
function productFromJsonLd(html: string): {
  name: string | null;
  image: string | null;
  price: string | null;
  currency: string | null;
} {
  const empty = { name: null, image: null, price: null, currency: null };
  const blocks = html.match(
    /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
  );
  if (!blocks) return empty;

  for (const block of blocks) {
    const body = block.replace(/^<script[^>]*>/i, "").replace(/<\/script>$/i, "");
    let parsed: unknown;
    try {
      parsed = JSON.parse(body);
    } catch {
      continue;
    }
    const found = walkForProduct(parsed);
    if (found) return found;
  }
  return empty;
}

function walkForProduct(
  node: unknown,
  depth = 0,
): { name: string | null; image: string | null; price: string | null; currency: string | null } | null {
  if (depth > 6 || node === null || typeof node !== "object") return null;

  if (Array.isArray(node)) {
    for (const child of node) {
      const hit = walkForProduct(child, depth + 1);
      if (hit) return hit;
    }
    return null;
  }

  const o = node as Record<string, unknown>;
  const types = ([] as unknown[])
    .concat(o["@type"] ?? [])
    .map((t) => String(t).toLowerCase());
  const isProduct = types.some((t) => t === "product" || t === "productgroup");

  if (isProduct || (typeof o.name === "string" && (o.image || o.offers))) {
    const offer = firstOffer(o.offers);
    const price =
      firstString(offer?.price) ??
      firstString(offer?.lowPrice) ??
      firstString(offer?.highPrice);
    const result = {
      name: firstString(o.name),
      image: firstImage(o.image),
      price,
      currency: firstString(offer?.priceCurrency),
    };
    if (result.name || result.image || result.price) return result;
  }

  for (const key of ["@graph", "mainEntity", "itemListElement", "hasVariant"]) {
    const hit = walkForProduct(o[key], depth + 1);
    if (hit) return hit;
  }
  return null;
}

function firstOffer(offers: unknown): Record<string, unknown> | null {
  if (Array.isArray(offers)) return firstOffer(offers[0]);
  if (offers && typeof offers === "object") return offers as Record<string, unknown>;
  return null;
}

function firstString(v: unknown): string | null {
  if (typeof v === "string") return v.trim() || null;
  if (typeof v === "number") return String(v);
  if (Array.isArray(v)) return firstString(v[0]);
  return null;
}

/** image: "…" | ["…"] | { url: "…" } | [{ url: "…" }] */
function firstImage(v: unknown): string | null {
  if (typeof v === "string") return v.trim() || null;
  if (Array.isArray(v)) return firstImage(v[0]);
  if (v && typeof v === "object") {
    const o = v as Record<string, unknown>;
    return firstString(o.url) ?? firstString(o.contentUrl);
  }
  return null;
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
          "user-agent": BROWSER_UA,
          accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "accept-language": ACCEPT_LANGUAGE,
          // A CDN's bot check reads the whole set of headers, not the
          // user-agent alone: a browser string arriving without any of the
          // fetch-metadata a browser always sends is exactly the pattern it
          // looks for. These are what Chrome sends when a person types an
          // address and presses enter.
          "sec-fetch-dest": "document",
          "sec-fetch-mode": "navigate",
          "sec-fetch-site": "none",
          "sec-fetch-user": "?1",
          "upgrade-insecure-requests": "1",
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
        // 403 and 429 are a shop's bot protection turning us away, which no
        // amount of dressing up the request reliably gets past — and chasing
        // it is an arms race a family app should stay out of. Said plainly,
        // with the name guessed from the address so she is not left with an
        // empty form.
        const refused = res.status === 403 || res.status === 429;
        return {
          ...bare,
          title: nameFromUrl(current.toString()),
          failed: refused
            ? "That shop would not let us read the page. We have guessed the name from the address — change it, and add a picture if you like."
            : "That shop did not answer. Type the name in yourself?",
        };
      }
      const type = res.headers.get("content-type") ?? "";
      if (!type.includes("html")) {
        return {
          ...bare,
          title: nameFromUrl(current.toString()),
          failed: "There was no page to read there.",
        };
      }
      html = await readDocument(res);
      break;
    }

    if (!html) {
      return {
        ...bare,
        title: nameFromUrl(current.toString()),
        failed: "Nothing could be read from that link.",
      };
    }

    const read = previewFromHtml(html, current);
    // A page that opened but said nothing useful about itself still has an
    // address, and the address usually has the name in it.
    return { ...bare, ...read, title: read.title ?? nameFromUrl(current.toString()) };
  } catch {
    // A timeout, a refused connection, a shop behind a wall. None of these is
    // an error a person needs explaining — she types the name herself and the
    // item is just as good.
    return {
      ...bare,
      title: nameFromUrl(trimmed),
      failed: "That link could not be read. We have guessed the name from the address.",
    };
  } finally {
    clearTimeout(timer);
  }
}
