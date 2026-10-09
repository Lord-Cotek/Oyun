"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { liveShare, helloCookieName } from "@/lib/post-share-db";
import { claimableHello, convertHello, claimAskedCookie } from "@/lib/hello-claim";

/**
 * Claiming your own words, from the one place the proof exists.
 *
 * ── Why these live under /p and not under /life ──────────────────────────
 * The guest cookie is written with `path: /p/<token>`, so it is sent on
 * requests to the share page and nowhere else. That is correct and worth
 * keeping — it is a token for one link, not an identity — but it means the
 * question "did this browser write that hello?" can only be answered here.
 *
 * The alternative was to answer it here, sign the answer, and carry it to the
 * post page as a ticket. That is more moving parts and one more thing to get
 * wrong, for a question that is asked of each person at most once.
 */

const YEAR = 365 * 24 * 60 * 60;

/** Remember the answer, so nobody is asked about the same words twice. */
function rememberAsked(token: string): void {
  cookies().set(claimAskedCookie(token), "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: `/p/${token}`,
    maxAge: YEAR,
  });
}

export type ClaimReply = { ok: boolean; error?: string };

/**
 * Yes, those were my words — move them into the replies.
 *
 * Re-checks everything rather than trusting that the page which rendered the
 * button was right: the session, the link being live, the cookie matching a
 * hello, and (inside convertHello) membership of the journey that owns it.
 */
export async function claimMine(token: string): Promise<ClaimReply> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { ok: false, error: "You are not signed in." };

  const share = await liveShare(token);
  if (!share) return { ok: false, error: "This link has been closed." };

  const guestToken = cookies().get(helloCookieName(token))?.value ?? "";
  const hello = await claimableHello(share.id, guestToken);
  if (!hello) return { ok: true };

  const r = await convertHello({
    helloId: hello.id,
    journeyId: share.journeyId,
    authorId: userId,
    // Their own words, claimed by them. Nobody attributed anything.
    attributedById: null,
  });
  if (!r.ok) return r;

  rememberAsked(token);
  revalidatePath("/life");
  return { ok: true };
}

/** Leave it where it is. Asked once, then never again on this browser. */
export async function notMine(token: string): Promise<ClaimReply> {
  rememberAsked(token);
  return { ok: true };
}
