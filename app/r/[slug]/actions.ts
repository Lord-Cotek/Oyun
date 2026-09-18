"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { notify } from "@/lib/notify";
import { guestCookieName, newGuestToken } from "@/lib/registry-db";
import {
  CLAIMS_MAX,
  GUEST_NAME_MAX,
  GUEST_NOTE_MAX,
  QUANTITY_MAX,
  remaining,
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

  const jar = cookies();
  const cookieName = guestCookieName(slug);
  let token = jar.get(cookieName)?.value ?? null;
  if (!token) {
    token = newGuestToken();
    jar.set(cookieName, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
  }

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
        name: name || null,
        note: note || null,
        quantity: item.kind === "LIST" ? 1 : wanted,
      },
    });
  } else {
    await prisma.registryClaim.create({
      data: {
        itemId: item.id,
        token,
        name: name || null,
        note: note || null,
        quantity: item.kind === "LIST" ? 1 : wanted,
      },
    });
    await tellTheFamily(item.registry, item.title, name);
  }

  revalidatePath(`/r/${slug}`);
  revalidatePath("/registry");
  return { ok: true };
}

/** Changing their mind. Their own claim only — the token decides that. */
export async function release(formData: FormData): Promise<Result> {
  const slug = String(formData.get("slug") ?? "");
  const itemId = String(formData.get("itemId") ?? "");
  const token = cookies().get(guestCookieName(slug))?.value;
  if (!token) return { ok: false, error: "We cannot tell which was yours." };

  const item = await prisma.registryItem.findFirst({
    where: { id: itemId, registry: { slug } },
    select: { id: true, registry: { select: { closedAt: true } } },
  });
  if (!item) return { ok: false, error: "That is no longer on the list." };
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
