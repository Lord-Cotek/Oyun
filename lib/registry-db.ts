import { randomBytes } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { type ItemKind } from "@/lib/registry";

/**
 * ── Why these are not `randomId()` ───────────────────────────────────────
 * lib/rand.ts says of itself, in its own comment, that its ids are "never
 * security-bearing" and that it falls back to `Math.random`. That is fine for
 * keying a React list. It is not fine for the only thing standing between a
 * guessed URL and a list of what a family owns, what they cannot afford, and
 * who their friends are.
 *
 * So these come from `node:crypto`, server-side, and they are long. The same
 * reasoning, and the same numbers, as lib/invitations-db.ts.
 */
const SLUG_BYTES = 18;
const TOKEN_BYTES = 24;

function secret(bytes: number): string {
  return randomBytes(bytes).toString("base64url");
}

export function newSlug(): string {
  return secret(SLUG_BYTES);
}

export function newGuestToken(): string {
  return secret(TOKEN_BYTES);
}

/** The cookie a guest's browser keeps, so they can release their own claim. */
export function guestCookieName(slug: string): string {
  return `oyun_gift_${slug}`;
}

/** Where a registry lives, for sharing and for the QR code. */
export function registryUrl(slug: string): string {
  const site =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ??
    "https://oyun.cotek.app";
  return `${site}/r/${slug}`;
}

export interface PublicItem {
  id: string;
  kind: ItemKind;
  title: string;
  note: string | null;
  url: string | null;
  imageUrl: string | null;
  price: string | null;
  quantity: number;
  mostNeeded: boolean;
  /** How many are spoken for. Never who by — see below. */
  claimed: number;
  /** How many this guest has taken, recognised by their own token. */
  mine: number;
}

export interface PublicRegistry {
  slug: string;
  title: string;
  hostName: string;
  message: string | null;
  closed: boolean;
  /**
   * Whether there is a way to send money, NOT what it is.
   *
   * The details themselves never travel with the page — a guest asks for them
   * and `revealPayDetails` fetches them then. All this says is whether the
   * card should offer to show anything, which is what the page needs in order
   * to render and is not worth hiding.
   */
  takesMoney: boolean;
  items: PublicItem[];
}

/**
 * The registry as somebody without an account sees it.
 *
 * ── This function is the boundary ────────────────────────────────────────
 * Everything a stranger can learn about this family is in the shape below,
 * and every field of it was typed onto the registry on purpose. There is no
 * due date here, no baby's name unless she put one in the title, no
 * photograph from the journey, no member list, and no id that leads anywhere
 * else. The fields are selected one by one rather than spread, so adding a
 * column to the schema cannot quietly add it to a public page.
 *
 * ── What one guest may learn about another ───────────────────────────────
 * That a thing is taken, and nothing else. Not who took it. A registry that
 * shows the names makes a competition out of a gift, and a friend who can
 * only afford the muslin squares should not be reading that the cot came from
 * somebody else. The host may see the names — that is what thank-you notes
 * are written from — and even she may not until the end if she has asked to
 * be surprised. See claimsVisibleToHost in lib/registry.ts.
 */
export async function getPublicRegistry(
  slug: string,
  guestToken: string | null,
): Promise<PublicRegistry | null> {
  const r = await prisma.registry.findUnique({
    where: { slug },
    select: {
      slug: true,
      title: true,
      hostName: true,
      message: true,
      closedAt: true,
      // Selected only to answer "is there one" — see takesMoney below. The
      // string itself is dropped before anything leaves this function.
      payDetails: true,
      items: {
        orderBy: [
          { mostNeeded: "desc" },
          { position: "asc" },
          { createdAt: "asc" },
        ],
        select: {
          id: true,
          kind: true,
          title: true,
          note: true,
          url: true,
          imageUrl: true,
          price: true,
          quantity: true,
          mostNeeded: true,
          claims: { select: { quantity: true, token: true } },
        },
      },
    },
  });
  if (!r) return null;

  return {
    slug: r.slug,
    title: r.title,
    hostName: r.hostName,
    message: r.message,
    closed: r.closedAt !== null,
    takesMoney: (r.payDetails ?? "").trim().length > 0,
    items: r.items.map((i) => ({
      id: i.id,
      kind: i.kind as ItemKind,
      title: i.title,
      note: i.note,
      url: i.url,
      imageUrl: i.imageUrl,
      price: i.price,
      quantity: i.quantity,
      mostNeeded: i.mostNeeded,
      claimed: i.claims.reduce((n, c) => n + c.quantity, 0),
      mine: guestToken
        ? i.claims
            .filter((c) => c.token === guestToken)
            .reduce((n, c) => n + c.quantity, 0)
        : 0,
    })),
  };
}
