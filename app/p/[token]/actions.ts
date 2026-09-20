"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { notify } from "@/lib/notify";
import {
  liveShare,
  helloCookieName,
  newGuestToken,
} from "@/lib/post-share-db";
import {
  HELLO_BODY_MAX,
  HELLO_NAME_MAX,
  HELLOS_PER_SHARE_MAX,
  JOIN_NOTE_MAX,
  REQUESTS_PER_JOURNEY_MAX,
  isRelation,
  sharePath,
} from "@/lib/post-share";

/**
 * The only place in either app where somebody who is not signed in writes
 * anything to the database.
 *
 * ── What that means for everything below ─────────────────────────────────
 * Every one of these starts from a token in a URL that anybody could be
 * holding, so nothing that arrives is trusted and nothing that arrives is
 * looked up by anything except that token:
 *
 *   — The link must be live. `liveShare` re-checks revoked, expired, and the
 *     post's audience on every single call, so closing a link stops writes as
 *     well as reads, immediately.
 *   — Length is capped before anything is stored, not trimmed afterwards.
 *   — One hello and one request per browser, enforced by a unique index and a
 *     lookup rather than by the form being hidden. The form being hidden is a
 *     courtesy; the constraint is the rule.
 *   — A hard ceiling per link and per journey, for somebody clearing cookies
 *     in a loop. Past it the writes simply stop, silently, because telling an
 *     abuser which wall they have hit is the one thing that helps them.
 *
 * None of this is a moderation system, and it is not meant to be. What makes
 * this safe is upstream: a hello is only ever shown to the family and to the
 * person who wrote it, so nothing a stranger types is ever put in front of
 * another stranger.
 */

const HOUR = 60 * 60;
const YEAR = 365 * 24 * HOUR;

/** The guest's own mark on this link, minted on first use. */
function guestTokenFor(token: string): string {
  const jar = cookies();
  const name = helloCookieName(token);
  const existing = jar.get(name)?.value;
  if (existing) return existing;
  const fresh = newGuestToken();
  jar.set(name, fresh, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: sharePath(token),
    maxAge: YEAR,
  });
  return fresh;
}

function clean(v: FormDataEntryValue | null, max: number): string {
  return String(v ?? "").replace(/\s+/g, " ").trim().slice(0, max);
}

export interface GuestResult {
  ok: boolean;
  error?: string;
}

/**
 * A word back from outside.
 *
 * Saved against the share AND the post, so it outlives the link: somebody's
 * kind sentence in month four should still be there in year ten, long after
 * the link that carried it was closed.
 */
export async function sayHello(
  token: string,
  formData: FormData,
): Promise<GuestResult> {
  const share = await liveShare(token);
  if (!share) return { ok: false, error: "This link has been closed." };

  const name = clean(formData.get("name"), HELLO_NAME_MAX);
  const body = clean(formData.get("body"), HELLO_BODY_MAX);
  if (!name) return { ok: false, error: "Please put your name, so they know who it is from." };
  if (!body) return { ok: false, error: "Write a line and it will reach them." };

  const guestToken = guestTokenFor(token);

  const already = await prisma.shareHello.findUnique({
    where: { shareId_guestToken: { shareId: share.id, guestToken } },
    select: { id: true },
  });

  if (!already) {
    const count = await prisma.shareHello.count({ where: { shareId: share.id } });
    // Silently. See the note at the top of this file.
    if (count >= HELLOS_PER_SHARE_MAX) return { ok: true };

    await prisma.shareHello.create({
      data: {
        shareId: share.id,
        postId: share.postId,
        journeyId: share.journeyId,
        name,
        body,
        guestToken,
      },
    });

    // Told once, on the first hello from this person — not on every edit, and
    // not once per guest per visit. A family should hear that somebody wrote
    // to them; they should not be pinged because a cousin fixed a typo.
    await tellTheFamily(share.journeyId, name);
  } else {
    await prisma.shareHello.update({
      where: { id: already.id },
      data: { name, body, hiddenAt: null },
    });
  }

  revalidatePath(sharePath(token));
  return { ok: true };
}

/** Take back what you said. */
export async function unsayHello(token: string): Promise<GuestResult> {
  const share = await liveShare(token);
  if (!share) return { ok: false, error: "This link has been closed." };
  const guestToken = cookies().get(helloCookieName(token))?.value;
  if (!guestToken) return { ok: false };

  await prisma.shareHello.deleteMany({
    where: { shareId: share.id, guestToken },
  });
  revalidatePath(sharePath(token));
  return { ok: true };
}

/**
 * Asking to be let in.
 *
 * ── This grants nothing ──────────────────────────────────────────────────
 * It writes a row with a status of PENDING and tells the family. No
 * membership, no invite, no access, no role — the `relation` field is what
 * the person SAYS they are and the app never reads it as anything else. The
 * household decides, by hand, and picks the real role themselves. A link can
 * be forwarded; anything typed into one is a claim.
 */
export async function askToJoin(
  token: string,
  formData: FormData,
): Promise<GuestResult> {
  const share = await liveShare(token);
  if (!share) return { ok: false, error: "This link has been closed." };

  const name = clean(formData.get("name"), HELLO_NAME_MAX);
  const relationRaw = clean(formData.get("relation"), 40);
  const email = clean(formData.get("email"), 160).toLowerCase();
  const note = clean(formData.get("note"), JOIN_NOTE_MAX);

  if (!name) return { ok: false, error: "Please put your name." };
  if (!email.includes("@") || email.length < 5) {
    return { ok: false, error: "Please put an email they can reach you on." };
  }
  // An unknown claim becomes the vaguest true one rather than being stored as
  // whatever was posted. Nothing acts on this field, but it is shown to a
  // person, and a person should not be shown text a stranger chose freely.
  const relation = isRelation(relationRaw) ? relationRaw : "Someone else";

  const guestToken = guestTokenFor(token);

  const already = await prisma.joinRequest.count({
    where: {
      journeyId: share.journeyId,
      guestToken,
      status: { in: ["PENDING", "INVITED"] },
    },
  });
  if (already > 0) return { ok: true };

  const total = await prisma.joinRequest.count({
    where: { journeyId: share.journeyId, status: "PENDING" },
  });
  if (total >= REQUESTS_PER_JOURNEY_MAX) return { ok: true };

  await prisma.joinRequest.create({
    data: {
      journeyId: share.journeyId,
      shareId: share.id,
      name,
      relation,
      email,
      note: note || null,
      guestToken,
    },
  });

  await tellTheFamily(share.journeyId, name, true);
  revalidatePath(sharePath(token));
  return { ok: true };
}

/**
 * Let the household know, and nobody else.
 *
 * Deliberately not the whole circle: a word from outside, and certainly a
 * request to come in, is for the two people whose journey it is to answer.
 * Best-effort — a notification that fails must never lose the hello itself.
 */
async function tellTheFamily(
  journeyId: string,
  who: string,
  asking = false,
): Promise<void> {
  try {
    const household = await prisma.membership.findMany({
      // Both of them, for both kinds of news. The circle page is theirs
      // together, so either can answer a request, and neither should hear
      // about their own family second-hand.
      where: { journeyId, role: { in: ["MOTHER", "PARTNER"] } },
      select: { userId: true },
    });
    for (const h of household) {
      await notify({
        userId: h.userId,
        type: "encouragement",
        title: asking
          ? `${who} would like to join your circle.`
          : `${who} sent you a word from outside.`,
        href: asking ? "/circle" : "/life",
      });
    }
  } catch {
    /* best effort */
  }
}
