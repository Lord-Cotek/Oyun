import { prisma } from "@/lib/prisma";
import { postPath } from "@/lib/open-item";
import { postScope } from "@/lib/post-visibility";

/**
 * Taking the family inside, and leaving everybody else where they are.
 *
 * ── The problem this exists for ──────────────────────────────────────────
 * A mother shares a post to the family WhatsApp group. Her own sister — who
 * is in the circle, signed in, with Oyun on her phone — taps the link and
 * lands on the page written for strangers, where the only thing she can do
 * is leave a one-line hello under a note explaining who this family is. She
 * cannot reply to anyone. Nobody can reply to her. The people closest to the
 * post get the worst version of it, and they are the ones who open it most.
 *
 * ── Why "has an account" is the wrong question ───────────────────────────
 * It was the obvious test and it would have been a worse bug than the one it
 * fixed. Three different people tap that link:
 *
 *   in this family          the post exists for them in the app — take them
 *   has an account, but     the post does not exist for them anywhere; they
 *     a stranger here       would be dropped into THEIR OWN family's diary,
 *                           which is the wrong house
 *   nobody we know          the page they already get, exactly as before
 *
 * So the question is not "do you have an account", it is "are you in this
 * family". Which is one lookup, because the share row already knows the
 * journey it belongs to.
 *
 * ── Why the role is checked too, when today it cannot matter ─────────────
 * A post that has a link can never be householdOnly — getSharedPost and
 * liveShare both refuse one — and postScope only ever excludes those. So
 * today every member of the journey can see every shared post, and the
 * membership check alone would be enough.
 *
 * It is checked anyway, against the same postScope every other reader uses,
 * because the alternative is an assumption living in a comment. The day
 * somebody adds a third audience ring, this redirect would start handing
 * people a diary with no post in it and nothing would say why. One indexed
 * count buys the guarantee that we only ever send somebody somewhere the
 * post is genuinely waiting for them.
 */

/**
 * The in-app address of one post: its own page.
 *
 * ── Why not an anchor in the diary ───────────────────────────────────────
 * It was one, `/life?year=…#post-…`, with the year on it so that the anchor
 * existed on the page even for an old entry. That part was right and it was
 * not enough. The browser jumps to an anchor the moment it parses it, and
 * then the photographs above it finish loading and push it down — so what
 * the reader tapped ends up off the top of the screen, which is
 * indistinguishable from being dumped at the top of Life. Chasing it with
 * re-scrolls would have been a race nobody could be sure of winning.
 *
 * A page with one post on it has nothing above it to shift. See
 * app/life/[id]/page.tsx.
 *
 * Everything that wants to send somebody to a post comes through here — the
 * notifications and the share link both — so there is one answer to "where
 * does a post live" and the two cannot drift apart.
 *
 * It is written in lib/open-item.ts now, beside the address of every other
 * single thing a notification can be about, and re-exported here so that the
 * share link's callers do not have to know that. That file is pure; this one
 * opens the database, which is why the two are not one.
 */
export { postPath };

/**
 * The door for somebody who has an account but is signed out in THIS browser.
 *
 * ── Why there is a route for this at all ─────────────────────────────────
 * Because most of these links are opened inside WhatsApp's browser, or
 * Instagram's, or Facebook's, and those keep their own cookies. The person is
 * signed in — in Safari, and in the app on the same phone — and signed out
 * here. No automatic check can see them, so without a door to knock on, the
 * fix above would quietly miss a large share of the very people it is for.
 *
 * ── Why the door points here and not straight at /sign-in ────────────────
 * It would have to carry the destination through sign-in, and the destination
 * ends in `#post-…`. A fragment threaded through a callbackUrl, out to
 * NextAuth and back, is a thing that either survives or silently does not,
 * and either way nothing on the page would say which. So the trip comes back
 * to a route of ours instead, which asks the question again now that it has a
 * session, and does the last hop itself.
 *
 * It is also the one answer that is right for all four people who can arrive
 * here — member, stranger with an account, signed out, no account at all —
 * because it decides after sign-in rather than guessing before it.
 */
export function openPath(token: string): string {
  return `/p/${encodeURIComponent(token)}/open`;
}

/** Sign in, then come back here and ask again. */
export function signInToOpen(token: string): string {
  return `/sign-in?callbackUrl=${encodeURIComponent(openPath(token))}`;
}

/** Back to the page for visitors, for somebody this is not their family. */
export function visitorPath(token: string): string {
  return `/p/${encodeURIComponent(token)}`;
}

/**
 * Where this person should be reading this post — or null, meaning the page
 * they are on is already the right one.
 *
 * Null covers every case that is not "take them in", and deliberately does
 * not distinguish them: signed out, signed in as a stranger to this family,
 * a link that has been closed, a post since deleted. The caller's answer to
 * all four is the same, and a single null is harder to get wrong than four
 * booleans.
 *
 * The share row is passed in rather than looked up, because both callers
 * already hold one and a second query for it would be a second chance for
 * the two of them to disagree about which post this is.
 */
export async function inAppPath(
  share: { postId: string; journeyId: string } | null,
  userId: string | null | undefined,
): Promise<string | null> {
  if (!share || !userId) return null;

  const member = await prisma.membership.findFirst({
    where: { journeyId: share.journeyId, userId },
    select: { role: true },
  });
  if (!member) return null;

  // The same scope every other reader of a post uses. See the note above on
  // why this is asked rather than assumed.
  const post = await prisma.post.findFirst({
    where: { id: share.postId, ...postScope(member.role) },
    select: { id: true },
  });
  if (!post) return null;

  return postPath(share.postId);
}

/**
 * The name and email to put in the join form for somebody who is signed in.
 *
 * Read from the database rather than the session, because this is shown to
 * the family as who asked, and the account is the truth about that. Returns
 * null for anybody signed out, which is most people here.
 */
export async function knownAsker(
  userId: string | null | undefined,
): Promise<{ name: string; email: string } | null> {
  if (!userId) return null;
  const u = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true },
  });
  if (!u?.email) return null;
  return { name: u.name ?? "", email: u.email };
}

/*
 * The words these pages use live in lib/post-share.ts — OPEN_WORDS and
 * KNOWN_ASKER_WORDS — and not here, because the join form is a client
 * component and this module imports Prisma. A single `import` of one string
 * from here would drag the database client into the browser bundle.
 */
