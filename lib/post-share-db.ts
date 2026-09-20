import { randomBytes } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { shareIsLive } from "@/lib/post-share";

/**
 * Reading a shared post from the outside.
 *
 * ── This file is the boundary ────────────────────────────────────────────
 * Everything else in the app reads posts for somebody who has signed in and
 * belongs to the journey. This reads one post for a stranger holding a link,
 * and the difference is the whole point of keeping it separate and small.
 *
 * The rule it exists to enforce: a link shows ONE post and nothing else. Not
 * the diary it sits in, not the other posts, not the journey's name, not the
 * family's other photographs, not who is in the circle, not anybody's email.
 * Every field the guest receives is listed by hand below, so adding something
 * to the Post model can never quietly widen what the world can see — a new
 * column simply does not appear here until somebody types it in.
 */

/** 24 random bytes. Long enough that guessing is not a strategy. */
export function newShareToken(): string {
  return randomBytes(24).toString("base64url");
}

/** What a guest is shown. Nothing here is a secret; that is the test. */
export interface SharedPostView {
  kind: string;
  body: string;
  media: { url: string; type: "image" | "video" }[];
  /** A first name only — "Amara", never a surname and never an email. */
  sharedBy: string;
  /** Whose family it is, in the guest's words: "Amara and Chidi". */
  household: string;
  postedAt: string;
  /** For the count the family sees. Not shown to the guest. */
  token: string;
}

function isVideo(url: string): boolean {
  return /\.(mp4|mov|m4v|webm|3gp|mkv)(\?|$)/i.test(url);
}

function firstName(n: string | null | undefined): string {
  return n?.trim().split(/\s+/)[0] || "They";
}

/**
 * The post behind a link, or null.
 *
 * Null for every reason a guest does not need distinguished: no such token, a
 * closed link, a link that ran out, a post since deleted, or a post whose
 * audience has since been narrowed to the family. That last one matters —
 * somebody who shares a post and then changes their mind about who should see
 * it expects the change to take, and a live link that outlived the decision
 * would make the audience switch a lie. The switch wins, retroactively.
 */
export async function getSharedPost(
  token: string,
): Promise<SharedPostView | null> {
  if (!token || token.length > 64) return null;

  const share = await prisma.postShare.findUnique({
    where: { token },
    select: {
      token: true,
      expiresAt: true,
      revokedAt: true,
      createdBy: { select: { name: true } },
      post: {
        select: {
          kind: true,
          body: true,
          imageUrl: true,
          mediaUrls: true,
          createdAt: true,
          familyOnly: true,
          journey: {
            select: {
              owner: { select: { name: true } },
              memberships: {
                where: { role: "PARTNER" },
                select: { user: { select: { name: true } } },
                take: 1,
              },
            },
          },
        },
      },
    },
  });

  if (!share || !share.post) return null;
  if (!shareIsLive(share)) return null;
  // The audience switch outranks the link. See the note above.
  if (share.post.familyOnly) return null;

  const urls = share.post.mediaUrls.length
    ? share.post.mediaUrls
    : share.post.imageUrl
      ? [share.post.imageUrl]
      : [];

  const mother = firstName(share.post.journey.owner.name);
  const partner = share.post.journey.memberships[0]?.user.name;
  const household = partner ? `${mother} and ${firstName(partner)}` : mother;

  return {
    kind: share.post.kind,
    body: share.post.body,
    media: urls.map((url) => ({
      url,
      type: isVideo(url) ? ("video" as const) : ("image" as const),
    })),
    sharedBy: firstName(share.createdBy.name),
    household,
    postedAt: share.post.createdAt.toISOString(),
    token: share.token,
  };
}

/**
 * One more person opened it.
 *
 * Deliberately not awaited by the page and deliberately swallowing its own
 * errors: a counter is the least important thing on this screen, and a family
 * member's photograph must never fail to load because a write did.
 */
export function countOneView(token: string): void {
  prisma.postShare
    .update({ where: { token }, data: { views: { increment: 1 } } })
    .catch(() => {});
}

/* ────────────────────────────────────────────────────────────────────────
   The guest's own browser
   ──────────────────────────────────────────────────────────────────────── */

/**
 * The cookie a guest keeps so they can come back to what they wrote.
 *
 * Per link, not per browser, so somebody who is sent two posts by two
 * different families leaves two separate traces and neither can be used to
 * follow them from one to the other. It is a name in a cookie jar, not an
 * identity: nothing is ever looked up by it except that person's own hello
 * and their own request on that one link.
 */
export function helloCookieName(token: string): string {
  return `oyun_hello_${token.slice(0, 12)}`;
}

export function newGuestToken(): string {
  return randomBytes(18).toString("base64url");
}

/** The share row behind a token, if the link is still live. */
export async function liveShare(token: string): Promise<{
  id: string;
  postId: string;
  journeyId: string;
} | null> {
  if (!token || token.length > 64) return null;
  const s = await prisma.postShare.findUnique({
    where: { token },
    select: {
      id: true,
      postId: true,
      journeyId: true,
      expiresAt: true,
      revokedAt: true,
      post: { select: { familyOnly: true } },
    },
  });
  if (!s || !shareIsLive(s) || s.post.familyOnly) return null;
  return { id: s.id, postId: s.postId, journeyId: s.journeyId };
}

/** What this guest has already said on this link, if anything. */
export async function myHello(
  shareId: string,
  guestToken: string,
): Promise<{ name: string; body: string } | null> {
  if (!guestToken) return null;
  const h = await prisma.shareHello.findUnique({
    where: { shareId_guestToken: { shareId, guestToken } },
    select: { name: true, body: true, hiddenAt: true },
  });
  // A hello the family took down is not shown back as "you said", which would
  // invite writing it again. It simply reads as not having said anything.
  if (!h || h.hiddenAt) return null;
  return { name: h.name, body: h.body };
}

/** Whether this guest has already asked to join this journey. */
export async function alreadyAsked(
  journeyId: string,
  guestToken: string,
): Promise<boolean> {
  if (!guestToken) return false;
  const n = await prisma.joinRequest.count({
    where: { journeyId, guestToken, status: { in: ["PENDING", "INVITED"] } },
  });
  return n > 0;
}

/* ────────────────────────────────────────────────────────────────────────
   Everything this family has shared
   ──────────────────────────────────────────────────────────────────────── */

export interface SharedRow {
  id: string;
  path: string;
  /** The post's first line, or a word about what it is if there are none. */
  excerpt: string;
  hasMedia: boolean;
  expiresAt: string | null;
  revokedAt: string | null;
  createdAt: string;
  views: number;
  hellos: number;
  /** A first name — who made this link. Two people can now share. */
  by: string;
}

/**
 * Every link this family has ever made, newest first.
 *
 * ── Why the closed ones are still here ───────────────────────────────────
 * A list of only the open links answers "what is out there?" and nothing
 * else. This page also has to answer "did I ever share that?", which comes
 * up months later, usually anxiously, and usually about something that was
 * closed long ago. Showing only live links would leave that question
 * permanently unanswerable — and an empty page would read as proof that
 * nothing was ever shared, which is a different and worse thing than a page
 * that says it was shared and then closed.
 *
 * Links for deleted posts are genuinely gone, not hidden: deleting a post
 * cascades to its shares, which is the behaviour anybody would expect.
 */
export async function listShares(
  journeyId: string,
  take = 200,
): Promise<SharedRow[]> {
  const rows = await prisma.postShare.findMany({
    where: { journeyId },
    orderBy: { createdAt: "desc" },
    take,
    select: {
      id: true,
      token: true,
      expiresAt: true,
      revokedAt: true,
      createdAt: true,
      views: true,
      createdBy: { select: { name: true } },
      post: { select: { body: true, mediaUrls: true, imageUrl: true } },
      _count: { select: { hellos: { where: { hiddenAt: null } } } },
    },
  });

  return rows.map((r) => {
    const line = r.post.body.trim().split("\n")[0].slice(0, 90);
    const hasMedia = r.post.mediaUrls.length > 0 || !!r.post.imageUrl;
    return {
      id: r.id,
      path: `/p/${r.token}`,
      excerpt: line || (hasMedia ? "A photograph, with no words" : "A post"),
      hasMedia,
      expiresAt: r.expiresAt?.toISOString() ?? null,
      revokedAt: r.revokedAt?.toISOString() ?? null,
      createdAt: r.createdAt.toISOString(),
      views: r.views,
      hellos: r._count.hellos,
      by: firstName(r.createdBy.name),
    };
  });
}
