import { type Role } from "@prisma/client";
import { isHousehold } from "@/lib/roles";

/**
 * The registry's own rules, in one file, so the room, the public page and
 * every server action agree about what is allowed.
 *
 * Nothing in here touches the database — see lib/registry-db.ts for that.
 * This is the vocabulary and the limits.
 */

/** The four sorts of thing a registry can hold. See the schema for why. */
export const ITEM_KINDS = ["THING", "HELP", "CASH", "LIST"] as const;
export type ItemKind = (typeof ITEM_KINDS)[number];

export function isItemKind(v: string): v is ItemKind {
  return (ITEM_KINDS as readonly string[]).includes(v);
}

/**
 * How each kind introduces itself — to her while she is adding it, and to a
 * guest reading the page. Written here rather than in the components so the
 * two can never say different things about the same row.
 */
export const KIND_COPY: Record<
  ItemKind,
  {
    /** The tab in her room. */
    label: string;
    /** What she is being asked for. */
    blurb: string;
    /** The example in the empty box. */
    placeholder: string;
    /** What a guest's button says. */
    claim: string;
    /** What it says once they have. */
    claimed: string;
  }
> = {
  THING: {
    label: "A thing",
    blurb: "Paste a link from any shop — we will read the name and picture, and you can change either.",
    placeholder: "Cot, changing mat, sleepsuits 0–3 months…",
    claim: "I'm getting this",
    claimed: "You're getting this",
  },
  HELP: {
    label: "A hand",
    blurb:
      "Not a thing in a shop. A week of meals, an evening of cooking, a lift to an appointment, someone to hold the baby while you sleep.",
    placeholder: "A week of dinners, a lift to the 34-week scan…",
    claim: "I'll do this",
    claimed: "You're doing this",
  },
  CASH: {
    label: "Money towards it",
    blurb:
      "Something people can put money towards — the cot fund, the hospital bag. They send it to you directly; nothing is paid through this app, and nobody here takes a cut.",
    placeholder: "Towards the cot, the hospital bag…",
    claim: "I'd like to give",
    claimed: "You said you sent something",
  },
  LIST: {
    label: "A whole list",
    blurb:
      "A list you already keep somewhere else — an Amazon wishlist, a shop's own registry. It goes on as one card and opens where it lives.",
    placeholder: "Our Amazon list",
    claim: "I got something from here",
    claimed: "You got something from here",
  },
};

/** How her transfer details read on the page, and what they are called. */
export const PAY_LABEL_MAX = 60;
export const PAY_DETAILS_MAX = 600;
export const PAY_NOTE_MAX = 300;

/**
 * Whether a cash card can be offered at all.
 *
 * A "give money" card with no way to send the money is a dead end dressed up
 * as a gift, so the details come first and the kind is refused until they do.
 */
export function canTakeMoney(r: {
  payDetails: string | null;
}): boolean {
  return (r.payDetails ?? "").trim().length > 0;
}

/**
 * How the public list is laid out, which is the reader's choice rather than
 * the family's.
 *
 * Grid first because it is the default: a registry is mostly pictures of
 * things, and a picture is how somebody recognises the cot they were asked
 * for. List is for the long registry somebody is scanning for a price.
 *
 * The choice lives in the reader's own browser and never reaches the server —
 * see components/registry/ViewToggle.tsx and the .reg-items rules in
 * globals.css.
 */
export const REGISTRY_VIEWS = ["grid", "list"] as const;
export type RegistryView = (typeof REGISTRY_VIEWS)[number];

/** How long an address may be, all of it checked on the server. */
export const SHIP_NAME_MAX = 80;
export const SHIP_ADDRESS_MAX = 400;
export const SHIP_PHONE_MAX = 40;
export const SHIP_NOTE_MAX = 300;

/**
 * Who may ask for the address. See Registry.shipReach in the schema for what
 * each one means and why CIRCLE is the default.
 */
export const SHIP_REACHES = ["CIRCLE", "LINK"] as const;
export type ShipReach = (typeof SHIP_REACHES)[number];

export function isShipReach(v: string): v is ShipReach {
  return (SHIP_REACHES as readonly string[]).includes(v);
}

/**
 * An unrecognised value reads as the narrow one.
 *
 * The column is a string, so a typo, a half-finished migration or a row
 * written by a future version of this app all arrive here. Every one of those
 * should fail towards telling a stranger less, never more.
 */
export function shipReachOf(r: { shipReach: string }): ShipReach {
  return isShipReach(r.shipReach) ? r.shipReach : "CIRCLE";
}

/** Whether there is an address to ask for at all. */
export function hasShipping(r: { shipAddress: string | null }): boolean {
  return (r.shipAddress ?? "").trim().length > 0;
}

/**
 * Which sorts of gift get posted.
 *
 * Only a thing. A week of meals is not put in the post, money is sent the way
 * the pay details say, and a whole list kept at a shop is checked out at that
 * shop, which asks for the address itself. Offering it on those three would
 * put the address in front of guests who have no use for it, which is the one
 * thing this feature must not do.
 */
export function kindTakesPost(kind: ItemKind): boolean {
  return kind === "THING";
}

/** Limits, all of them checked on the server. */
export const TITLE_MAX = 120;
export const NOTE_MAX = 500;
export const PRICE_MAX = 40;
export const MESSAGE_MAX = 800;
export const HOST_MAX = 80;
export const GUEST_NAME_MAX = 60;
export const GUEST_NOTE_MAX = 300;
export const QUANTITY_MAX = 20;
/**
 * A cap on the list itself. Not a business rule — a floor under the page: a
 * guest on a slow phone should not be handed nine hundred cards, and a
 * registry that long has stopped being a registry.
 */
export const ITEMS_MAX = 120;
/** Claims on one item, so a public endpoint cannot be used to fill a table. */
export const CLAIMS_MAX = 60;

/**
 * Whose registry it is.
 *
 * The mother and the one beside her. Not the circle — a grandmother is who
 * the list is FOR, and a list anybody in the circle could edit is a list
 * nobody trusts. They get the same public page as everybody else.
 */
export function canKeepRegistry(role: Role | string): boolean {
  return isHousehold(role);
}

/**
 * Whether the circle sees this list inside the app.
 *
 * ── Why both halves ──────────────────────────────────────────────────────
 * Shared, and not finished. The share is the family saying the list is ready
 * for the people who love them; closing it is them saying it is over. A
 * closed list is still worth reading on a link a year later — somebody
 * wondering what they gave — but it has no business sitting in a
 * grandmother's nav asking to be looked at.
 */
export function circleSeesRegistry(r: {
  sharedWithCircleAt: Date | null;
  closedAt: Date | null;
}): boolean {
  return r.sharedWithCircleAt !== null && r.closedAt === null;
}

/** What is left to take, given what the list asks for and what is spoken for. */
export function remaining(
  quantity: number,
  claimed: number,
): number {
  return Math.max(0, quantity - claimed);
}

/**
 * Whether a registry is still taking claims.
 *
 * Closed is not deleted and not hidden: the page still opens and still reads,
 * because somebody will follow that link a year later wondering what they
 * gave. It simply stops asking.
 */
export type RegistryState = "open" | "closed";

export function registryState(r: { closedAt: Date | null }): RegistryState {
  return r.closedAt ? "closed" : "open";
}

/**
 * Whether she may see who has taken what, yet.
 *
 * Surprise mode is `showClaims: false`, and it holds until the registry is
 * closed. It has to give way at the end: the same list she did not want to
 * see beforehand is the list she needs to write thank-you notes from.
 */
export function claimsVisibleToHost(r: {
  showClaims: boolean;
  closedAt: Date | null;
}): boolean {
  return r.showClaims || r.closedAt !== null;
}

/**
 * What the button to the shop says.
 *
 * ── Why the shop is named in the label ───────────────────────────────────
 * "See it" tells somebody nothing about what is about to happen to them. A
 * guest on a phone, holding a link a cousin forwarded, is deciding whether a
 * tap is safe — and "Open on amazon.ae" answers that before they commit, in
 * the one way that matters: it names where they are going. It also means a
 * shop they do not recognise is visible as such rather than hidden behind a
 * polite phrase.
 *
 * ── Why a whole list gets its own words ──────────────────────────────────
 * For a LIST item the link IS the item — there is nothing else on that card
 * worth looking at — so it says so, rather than sharing a label with a single
 * cot that happens to have a link attached to it.
 */
export function shopLabel(kind: ItemKind, url: string): string {
  const where = shopHost(url);
  return kind === "LIST"
    ? `Open the full list on ${where}`
    : `Open on ${where}`;
}

/** "amazon.ae" — the bit of an address a person recognises. */
export function shopHost(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "the shop";
  }
}
