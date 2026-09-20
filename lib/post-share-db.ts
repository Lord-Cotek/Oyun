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
