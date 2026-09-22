"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { notify } from "@/lib/notify";
import {
  guestCookieName,
  isJourneyMember,
  newGuestToken,
  memberClaimToken,
} from "@/lib/registry-db";
import {
  CLAIMS_MAX,
  GUEST_NAME_MAX,
  GUEST_NOTE_MAX,
  QUANTITY_MAX,
  remaining,
  shipReachOf,
} from "@/lib/registry";
import { HOUSEHOLD_ROLES } from "@/lib/roles";

type Result = { ok: true } | { ok: false; error: string };

/**
 * A guest saying they are getting something. No account, and there will never
 * be one.
 *
 * ── What stands in for a login ───────────────────────────────────────────
 * The guest's browser keeps a long random token in a cookie, exactly as an
 * invitation reply does. It is how the same person changes their mind instead
 * of leaving two claims behind, and it is why one guest cannot release
 * another's. Lose the cookie and you get a new row — the right failure, since
 * the alternative is trusting a typed name, where anybody could release
 * anybody's.
 *
 * ── Everything is checked here ───────────────────────────────────────────
 * This is a public endpoint and the page in front of it is not a wall. A
 * closed registry, an item already fully spoken for, a party of forty, a wall
 * of text, a five-hundredth claim — each is turned away with a sentence
 * saying which.
 */
/**
 * The token this request should claim under, and the name to put on it.
 *
 * Signed-in members of this journey are themselves; everybody else is the
 * browser they are holding. See memberClaimToken for why that matters.
 *
 * `mint` is false on a read and true on a write: somebody who only looks at
 * a registry should not be handed a cookie to carry, exactly as on a shared
 * post.
 */
async function claimerFor(
  slug: string,
  journeyId: string,
  mint: boolean,
): Promise<{ token: string | null; name: string | null; member: boolean }> {
  const session = await auth();
  if (session?.user?.id) {
    const member = await prisma.membership.findFirst({
      where: { journeyId, userId: session.user.id },
      select: { id: true },
    });
    if (member) {
      return {
        token: memberClaimToken(session.user.id),
        name: session.user.name ?? null,
        member: true,
      };
    }
  }

  const jar = cookies();
  const cookieName = guestCookieName(slug);
  let token = jar.get(cookieName)?.value ?? null;
  if (!token && mint) {
    token = newGuestToken();
    jar.set(cookieName, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
  }
  return { token, name: null, member: false };
}

export async function claim(formData: FormData): Promise<Result> {
  const slug = String(formData.get("slug") ?? "");
  const itemId = String(formData.get("itemId") ?? "");
  const name = String(formData.get("name") ?? "").trim().slice(0, GUEST_NAME_MAX);
  const note = String(formData.get("note") ?? "").trim().slice(0, GUEST_NOTE_MAX);
  const wanted = Math.min(
    QUANTITY_MAX,
    Math.max(1, Math.trunc(Number(formData.get("quantity") ?? 1) || 1)),
  );

  const item = await prisma.registryItem.findFirst({
    where: { id: itemId, registry: { slug } },
    select: {
      id: true,
      title: true,
      kind: true,
      quantity: true,
      registry: {
        select: {
          id: true,
          slug: true,
          title: true,
          closedAt: true,
          showClaims: true,
          journeyId: true,
        },
      },
      claims: { select: { id: true, token: true, quantity: true } },
    },
  });
  if (!item) return { ok: false, error: "That is no longer on the list." };
  if (item.registry.closedAt) {
    return { ok: false, error: "This registry is finished. Thank you all the same." };
  }
  if (item.claims.length >= CLAIMS_MAX) {
    return { ok: false, error: "This one has had a lot of answers already." };
  }

  const who = await claimerFor(slug, item.registry.journeyId, true);
  const token = who.token!;
  // A member who left the name box alone is not "Someone": the account
  // already says who they are, and the family would rather read that.
  const claimName = name || who.name || "";

  const mine = item.claims.find((c) => c.token === token);
  const othersHave = item.claims
    .filter((c) => c.token !== token)
    .reduce((n, c) => n + c.quantity, 0);

  // A whole list is never "taken" — several people may get something from the
  // same Amazon list, and the shop keeps its own record of what.
  if (item.kind !== "LIST") {
    const left = remaining(item.quantity, othersHave);
    if (left <= 0) {
      return {
        ok: false,
        error: "Somebody has just taken this one. Have a look at the rest?",
      };
    }
    if (wanted > left) {
      return { ok: false, error: `Only ${left} of these are still wanted.` };
    }
  }

  if (mine) {
    await prisma.registryClaim.update({
      where: { id: mine.id },
      data: {
        name: claimName || null,
        note: note || null,
        quantity: item.kind === "LIST" ? 1 : wanted,
      },
    });
  } else {
    await prisma.registryClaim.create({
      data: {
        itemId: item.id,
        token,
        name: claimName || null,
        note: note || null,
        quantity: item.kind === "LIST" ? 1 : wanted,
      },
    });
    await tellTheFamily(item.registry, item.title, claimName);
  }

  revalidatePath(`/r/${slug}`);
  revalidatePath("/registry");
  return { ok: true };
}

/**
 * Handing a guest the transfer details, when they ask for them.
 *
 * ── Why this is an action and not a field on the page ────────────────────
 * Because the alternative is a bank account printed into the HTML of every
 * visit. Anybody who opens the link would have it; so would a screenshot of
 * the page passed round a group chat, so would a browser's saved copy, and so
 * would whatever fetches the link to build a preview card.
 *
 * Fetching it on a tap does not make it secret — anybody holding the link can
 * tap, and that is said plainly in the room where she types it. What it does
 * is shrink the blast radius from "everybody who ever saw the page" to
 * "everybody who asked to give", which is a real difference and the honest
 * amount of protection to claim.
 *
 * It is refused on a registry that does not offer money at all, so this
 * cannot be used to probe whether a slug exists.
 */
export async function revealPayDetails(slug: string): Promise<
  { ok: true; label: string; details: string; note: string | null } | { ok: false }
> {
  const r = await prisma.registry.findUnique({
    where: { slug },
    select: { payLabel: true, payDetails: true, payNote: true },
  });
  const details = (r?.payDetails ?? "").trim();
  if (!details) return { ok: false };
  return {
    ok: true,
    label: (r?.payLabel ?? "").trim() || "Transfer",
    details,
    note: (r?.payNote ?? "").trim() || null,
  };
}

/**
 * Handing somebody the address a parcel goes to, when they ask for it.
 *
 * ── Why this is stricter than the transfer details above ─────────────────
 * Because it is where the family sleeps. The reveal-on-tap reasoning from
 * revealPayDetails applies here too and is not repeated; what is added is
 * that a tap is not enough on its own.
 *
 * CIRCLE, the default, means the answer is given only to somebody signed in
 * and in this journey. A stranger holding a forwarded link is refused — and
 * refused with `reason: "circle"`, so the page can tell them to ask the
 * family rather than leaving them staring at a dead button.
 *
 * LINK means the family has pressed a switch that says, in as many words,
 * that whoever holds the link may read it. Then a tap is enough, exactly as
 * it is for the bank details.
 *
 * ── What it will not do ──────────────────────────────────────────────────
 * It refuses a registry with no address at all with the same shape it refuses
 * everything else, so it cannot be used to work out whether a slug exists, or
 * which of two slugs belongs to a family that posts things.
 */
export async function revealShipping(slug: string): Promise<
  | {
      ok: true;
      name: string | null;
      address: string;
      phone: string | null;
      note: string | null;
    }
  | { ok: false; reason: "none" | "circle" }
> {
  const r = await prisma.registry.findUnique({
    where: { slug },
    select: {
      journeyId: true,
      shipName: true,
      shipAddress: true,
      shipPhone: true,
      shipNote: true,
      shipReach: true,
    },
  });
  const address = (r?.shipAddress ?? "").trim();
  if (!r || !address) return { ok: false, reason: "none" };

  if (shipReachOf(r) !== "LINK") {
    const member = await isJourneyMember(r.journeyId, await auth());
    if (!member) return { ok: false, reason: "circle" };
  }

  const tidy = (v: string | null) => {
    const s = (v ?? "").trim();
    return s.length > 0 ? s : null;
  };
  return {
    ok: true,
    name: tidy(r.shipName),
    address,
    phone: tidy(r.shipPhone),
    note: tidy(r.shipNote),
  };
}

/** Changing their mind. Their own claim only — the token decides that. */
export async function release(formData: FormData): Promise<Result> {
  const slug = String(formData.get("slug") ?? "");
  const itemId = String(formData.get("itemId") ?? "");
  const item = await prisma.registryItem.findFirst({
    where: { id: itemId, registry: { slug } },
    select: {
      id: true,
      registry: { select: { closedAt: true, journeyId: true } },
    },
  });
  if (!item) return { ok: false, error: "That is no longer on the list." };

  // Resolved the same way as the claim, so a member can take a thing back
  // from a different phone than the one they took it on.
  const who = await claimerFor(slug, item.registry.journeyId, false);
  const token = who.token;
  if (!token) return { ok: false, error: "We cannot tell which was yours." };
  if (item.registry.closedAt) {
    return { ok: false, error: "This registry is finished." };
  }

  await prisma.registryClaim.deleteMany({ where: { itemId: item.id, token } });
  revalidatePath(`/r/${slug}`);
  revalidatePath("/registry");
  return { ok: true };
}

/**
 * Telling the family somebody has taken something.
 *
 * Silent while she has asked to be surprised — a notification that says
 * "Ngozi is getting the cot" is the surprise, spoiled, on a lock screen. It
 * goes to the two who keep the journey and to nobody else: a gift is between
 * the giver and the family, and the rest of the circle has no business
 * knowing who gave what.
 *
 * Best-effort throughout. A missed notice must never cost somebody their
 * claim.
 */
async function tellTheFamily(
  registry: {
    journeyId: string;
    slug: string;
    title: string;
    showClaims: boolean;
  },
  itemTitle: string,
  guestName: string,
): Promise<void> {
  if (!registry.showClaims) return;
  try {
    const keepers = await prisma.membership.findMany({
      where: { journeyId: registry.journeyId, role: { in: HOUSEHOLD_ROLES } },
      select: { userId: true },
    });
    const who = guestName.trim() || "Someone";
    await Promise.all(
      keepers.map((k) =>
        notify({
          userId: k.userId,
          type: "registry",
          title: `${who} is getting ${itemTitle}.`,
          href: "/registry",
        }),
      ),
    );
  } catch {
    /* a missed notice must never fail the gift */
  }
}
