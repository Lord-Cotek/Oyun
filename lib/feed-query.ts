import { yearBounds } from "./story";
import { prisma } from "./prisma";
import { postScope } from "./post-visibility";
import { isHousehold } from "./roles";
import { canSharePost, sharePath } from "./post-share";
import { type Role } from "@prisma/client";

export interface FeedComment {
  id: string;
  author: string;
  mine: boolean;
  body: string;
  when: string;
  /** A reply can be answered the same way a post can. */
  reactions: FeedReaction[];
}

export interface FeedReaction {
  kind: string;
  count: number;
  mine: boolean;
}

export type MediaType = "image" | "video";

export interface MediaItem {
  url: string;
  type: MediaType;
}

/** Infer whether a blob URL points at a video from its file extension. */
export function mediaTypeFromUrl(url: string): MediaType {
  return /\.(mp4|m4v|mov|webm|ogg)(\?|#|$)/i.test(url) ? "video" : "image";
}

export interface FeedPost {
  id: string;
  kind: string;
  body: string;
  media: MediaItem[];
  author: string;
  authorId: string;
  authorImage: string | null;
  mine: boolean;
  when: string;
  reactions: FeedReaction[];
  comments: FeedComment[];
  /**
   * Kept to the family. Carried through to the screen so a post that the
   * circle cannot see says so — somebody who chose a smaller audience should
   * be able to tell at a glance that it took, rather than trusting it.
   */
  familyOnly: boolean;
  /**
   * May this viewer put it on a link anybody can open? Decided on the server
   * by lib/post-share.ts and carried here, rather than the screen working it
   * out from a role it would have to be handed — a control that appears is a
   * control the server has already agreed to.
   */
  canShare: boolean;
  /** The live link it already has, for the family's eyes only. */
  share: { path: string; expiresAt: string | null; views: number } | null;
}

function relative(d: Date, now = new Date()): string {
  const s = Math.max(0, Math.round((now.getTime() - d.getTime()) / 1000));
  if (s < 60) return "just now";
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const days = Math.round(h / 24);
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

/** Load the family feed for a journey, from one member's point of view. */
/** Group reactions by kind, and note which are the viewer's own. */
function tally(
  rows: { kind: string; userId: string }[],
  viewerId: string,
): FeedReaction[] {
  const byKind = new Map<string, FeedReaction>();
  for (const r of rows) {
    const cur = byKind.get(r.kind) ?? { kind: r.kind, count: 0, mine: false };
    cur.count += 1;
    if (r.userId === viewerId) cur.mine = true;
    byKind.set(r.kind, cur);
  }
  return [...byKind.values()];
}

/**
 * `role` is required and sits before the optional arguments on purpose: it
 * decides whether the family-only posts are in this list at all, and a
 * parameter with a default is a parameter somebody forgets to pass. See
 * lib/post-visibility.ts.
 */
export async function loadFeed(
  journeyId: string,
  viewerId: string,
  role: Role | string,
  take = 40,
  year?: number,
): Promise<FeedPost[]> {
  const posts = await prisma.post.findMany({
    where: {
      journeyId,
      ...postScope(role),
      ...(year ? { createdAt: yearBounds(year) } : {}),
    },
    orderBy: { createdAt: "desc" },
    // A year is a bounded thing a family asked to see in full, so it is not
    // cut short at the usual page size.
    take: year ? 400 : take,
    include: {
      author: { select: { id: true, name: true, image: true } },
      reactions: { select: { kind: true, userId: true } },
      comments: {
        orderBy: { createdAt: "asc" },
        include: {
          author: { select: { id: true, name: true } },
          reactions: { select: { kind: true, userId: true } },
        },
      },
      // Only the live ones. A closed or expired link is history, and showing
      // it beside a post would say the post is out there when it is not.
      shares: {
        where: {
          revokedAt: null,
          OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
        },
        select: { token: true, expiresAt: true, views: true },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });
  const now = new Date();

  return posts.map((p) => {
    return {
      id: p.id,
      kind: p.kind,
      body: p.body,
      media:
        p.mediaUrls.length > 0
          ? p.mediaUrls.map((url) => ({ url, type: mediaTypeFromUrl(url) }))
          : p.imageUrl
            ? [{ url: p.imageUrl, type: "image" as const }]
            : [],
      author: p.author.name ?? "Someone",
      authorId: p.authorId,
      authorImage: p.author.image ?? null,
      mine: p.authorId === viewerId,
      when: relative(p.createdAt, now),
      familyOnly: p.familyOnly,
      canShare: canSharePost(isHousehold(role), p, viewerId),
      // The link is the family's business, not the circle's: somebody who can
      // see the post but could not have shared it has no need to know it is
      // out there, and no way to act on it if they did.
      share:
        canSharePost(isHousehold(role), p, viewerId) && p.shares[0]
          ? {
              path: sharePath(p.shares[0].token),
              expiresAt: p.shares[0].expiresAt?.toISOString() ?? null,
              views: p.shares[0].views,
            }
          : null,
      reactions: tally(p.reactions, viewerId),
      comments: p.comments.map((c) => ({
        id: c.id,
        author: c.author.name ?? "Someone",
        mine: c.authorId === viewerId,
        body: c.body,
        when: relative(c.createdAt, now),
        reactions: tally(c.reactions, viewerId),
      })),
    };
  });
}
