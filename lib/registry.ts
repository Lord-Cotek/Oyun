import { type Role } from "@prisma/client";
import { isHousehold } from "@/lib/roles";

/**
 * The registry's own rules, in one file, so the room, the public page and
 * every server action agree about what is allowed.
 *
 * Nothing in here touches the database — see lib/registry-db.ts for that.
 * This is the vocabulary and the limits.
 */

/** The three sorts of thing a registry can hold. See the schema for why. */
export const ITEM_KINDS = ["THING", "HELP", "LIST"] as const;
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
  LIST: {
    label: "A whole list",
    blurb:
      "A list you already keep somewhere else — an Amazon wishlist, a shop's own registry. It goes on as one card and opens where it lives.",
    placeholder: "Our Amazon list",
    claim: "I got something from here",
    claimed: "You got something from here",
  },
};

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
