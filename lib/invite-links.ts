/**
 * The useful links on an invitation — the rules, with no database in them.
 *
 * ── What these are for ───────────────────────────────────────────────────
 * Guests read the date, tap "I'll be there", and close the page. The map pin,
 * the registry and the potluck sign-up were all in the message, as bare links
 * in a paragraph, and on the day the host was answering "where exactly is
 * it?" one person at a time in the family group. So these are their own
 * things now, shown where people actually look: beside the date, on the
 * thank-you a guest sees the moment they reply, in the message the host sends
 * to the people who said yes, and in the reminder the evening before.
 *
 * Pure, so the host's form, the guest's page and the reminder email all agree
 * about what a link is, what it is called, and whether it is safe to show.
 */

export const LINK_KINDS = ["DIRECTIONS", "REGISTRY", "BRING", "OTHER"] as const;
export type LinkKind = (typeof LINK_KINDS)[number];

/** Enough for the map, the registry, the potluck and a couple more. */
export const LINKS_MAX = 6;
export const LINK_LABEL_MAX = 40;
export const LINK_URL_MAX = 600;
export const THANK_YOU_MAX = 400;

export const LINK_META: Record<
  LinkKind,
  { label: string; hint: string; placeholder: string; mark: string }
> = {
  DIRECTIONS: {
    label: "Directions",
    hint: "The pin from Google Maps or Apple Maps — the exact door, not just the area.",
    placeholder: "https://maps.app.goo.gl/…",
    mark: "📍",
  },
  REGISTRY: {
    label: "The registry",
    hint: "Where the gifts are, if you have a list.",
    placeholder: "https://…",
    mark: "🎁",
  },
  BRING: {
    label: "What to bring",
    hint: "A potluck sign-up, a list of dishes, a shared sheet.",
    placeholder: "https://docs.google.com/…",
    mark: "🍲",
  },
  OTHER: {
    label: "",
    hint: "Parking, a dress code, a livestream — name it below.",
    placeholder: "https://…",
    mark: "🔗",
  },
};

export function isLinkKind(v: string): v is LinkKind {
  return (LINK_KINDS as readonly string[]).includes(v);
}

export function toLinkKind(v: unknown): LinkKind {
  const s = String(v ?? "");
  return isLinkKind(s) ? s : "OTHER";
}

/**
 * A link as typed, made safe to put in front of a guest — or null.
 *
 * People paste "maps.app.goo.gl/abc" without the https, so a bare host is
 * given one. Anything that is not http or https is refused outright: a link
 * a host types is a link a stranger taps, and `javascript:` in a button is
 * not a link. Credentials in the URL are refused too, for the same reason.
 */
export function cleanUrl(raw: unknown): string | null {
  let s = String(raw ?? "").trim();
  if (!s) return null;
  if (s.length > LINK_URL_MAX) return null;
  if (!/^[a-z][a-z0-9+.-]*:/i.test(s)) s = `https://${s}`;
  let u: URL;
  try {
    u = new URL(s);
  } catch {
    return null;
  }
  if (u.protocol !== "https:" && u.protocol !== "http:") return null;
  if (u.username || u.password) return null;
  // A real site has a dot in its name. `localhost` is let through only so
  // the app's own links (the registry) work on a machine it is being built
  // on; it reaches nothing but the guest's own computer.
  if (!u.hostname.includes(".") && u.hostname !== "localhost") return null;
  return u.toString();
}

/**
 * The site a link goes to, shown beside it — "maps.app.goo.gl", "amazon.ae".
 *
 * A button that only says "Directions" asks a guest to trust where it goes.
 * Saying the domain lets them see, which is the same rule as the registry's
 * own cards.
 */
export function linkHost(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

/** What a link is called: the host's own words, or its kind's. */
export function linkLabel(kind: string, label?: string | null): string {
  const named = (label ?? "").trim();
  if (named) return named;
  return LINK_META[toLinkKind(kind)].label || "A link";
}

export interface LinkLike {
  kind: string;
  label: string;
  url: string;
}

/**
 * The thank-you a host sends to the people who said yes, written for them.
 *
 * ── Why this is the app's job at all ─────────────────────────────────────
 * Because the guests who missed the links already replied — the page they
 * would see them on is a page they have closed. The host's own WhatsApp is
 * the one channel that reaches every one of them, phone number or not, so
 * the app writes the message and the host sends it.
 *
 * Warm and short, because it is read on a lock screen, and it ends with the
 * invitation's own link, which holds everything else.
 */
export function thankYouMessage(input: {
  title: string;
  when: string;
  where?: string | null;
  links: LinkLike[];
  inviteUrl: string;
  note?: string | null;
}): string {
  const lines: string[] = [];
  lines.push(`Thank you so much for your RSVP to ${input.title.trim()}! 💛`);
  if (input.note?.trim()) lines.push(input.note.trim());
  lines.push("");
  lines.push(`🗓 ${input.when}`);
  if (input.where?.trim()) lines.push(`📌 ${input.where.trim()}`);
  if (input.links.length > 0) {
    lines.push("");
    lines.push("Everything you might need:");
    for (const l of input.links) {
      const meta = LINK_META[toLinkKind(l.kind)];
      lines.push(`${meta.mark} ${linkLabel(l.kind, l.label)}: ${l.url}`);
    }
  }
  lines.push("");
  lines.push(`Your invitation, any time: ${input.inviteUrl}`);
  return lines.join("\n");
}
