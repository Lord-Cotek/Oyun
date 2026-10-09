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
  /**
   * These words arrived through a share link before the person who wrote them
   * was known to be in the circle, and were moved in afterwards.
   *
   * Shown on the reply, because otherwise it is a reply from a year ago with
   * no reactions and no explanation — and because a hello is read by the
   * family alone while a reply is read by everyone, which is a change worth
   * being able to see. See PostComment.fromHelloId.
   */
  fromOutside: boolean;
  /**
   * Answers to THIS reply, oldest first.
   *
   * Only ever one level deep — addComment attaches an answer to an answer to
   * the same parent — so this array is always empty on anything inside it.
   * Nested rather than flat because the page has to draw it nested, and
   * working that out in the component would mean every card re-deriving a
   * shape the query already knows.
   */
  replies: FeedComment[];
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
  /**
   * A still to show before a video has loaded a frame of its own.
   *
   * Absent for every photograph, for a video uploaded by a browser that
   * could not make one, and for everything posted before posters existed.
   * Treat it as an ordinary absence, never as a fault.
   */
  poster?: string;
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
  householdOnly: boolean;
  /**
   * May this viewer put it on a link anybody can open? Decided on the server
   * by lib/post-share.ts and carried here, rather than the screen working it
   * out from a role it would have to be handed — a control that appears is a
   * control the server has already agreed to.
   */
  canShare: boolean;
  /** The live link it already has, for the family's eyes only. */
  share: { path: string; expiresAt: string | null; views: number } | null;
  /**
   * Words sent back through a link, by people outside the app.
   *
   * Only ever carried for somebody who could have shared the post — the same
   * test as `share` — because a hello is a message to the family, and the
   * circle has no part in it. Empty for everybody else, always.
   */
  hellos: { id: string; name: string; body: string; when: string }[];
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

/** What the query hands back for one reply, before it is threaded. */
interface CommentRow {
  id: string;
  authorId: string;
  author: { name: string | null };
  body: string;
  createdAt: Date;
  parentId: string | null;
  fromHelloId: string | null;
  reactions: { kind: string; userId: string }[];
}

/**
 * Lay a flat list of replies out as a conversation.
 *
 * ── Why in one pass over one query ───────────────────────────────────────
 * Because the alternative is a second query per comment, and a photograph
 * with forty replies would then cost forty-one. Everything needed is already
 * in the rows; this only arranges them.
 *
 * ── Why an answer whose parent is missing comes back to the top ──────────
 * Somebody can take down their own comment, and PostComment.parentId is
 * SetNull rather than Cascade so that doing so never deletes the answers
 * other people gave it. But a row could still name a parent that is not in
 * this list — a post filtered mid-page, an old row. Those are shown as
 * ordinary replies rather than dropped: losing a little context is a shame,
 * and silently losing somebody's words is not a thing this file may do.
 */
function thread(
  rows: CommentRow[],
  viewerId: string,
  now: Date,
): FeedComment[] {
  const shape = (c: CommentRow): FeedComment => ({
    id: c.id,
    author: c.author.name ?? "Someone",
    mine: c.authorId === viewerId,
    body: c.body,
    when: relative(c.createdAt, now),
    reactions: tally(c.reactions, viewerId),
    fromOutside: c.fromHelloId !== null,
    replies: [],
  });

  const byId = new Map<string, FeedComment>();
  const top: FeedComment[] = [];
  // Two passes, because the rows are in time order and an answer always
  // follows its parent — but only always, not provably, and a single pass
  // would quietly drop the day that stops being true.
  for (const c of rows) byId.set(c.id, shape(c));
  for (const c of rows) {
    const made = byId.get(c.id)!;
    const parent = c.parentId ? byId.get(c.parentId) : undefined;
    if (parent && parent !== made) parent.replies.push(made);
    else top.push(made);
  }
  return top;
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
      // Every reply to the post, answers included, in one query and one
      // order. They are threaded below rather than fetched twice.
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
      // Not scoped to the live link: a hello outlives the link that carried
      // it, and a family closing a link must not lose the kind words that
      // came through it.
      hellos: {
        // Not the ones that have become replies. They are still rows — they
        // remain the rate limit for that browser — but they are now in the
        // conversation, and showing them in both places would read as the
        // same person having said it twice.
        where: { hiddenAt: null, convertedAt: null },
        select: { id: true, name: true, body: true, createdAt: true },
        orderBy: { createdAt: "desc" },
        take: 50,
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
          ? p.mediaUrls.map((url, i) => {
              const poster = p.posterUrls?.[i];
              return {
                url,
                type: mediaTypeFromUrl(url),
                ...(poster ? { poster } : {}),
              };
            })
          : p.imageUrl
            ? [{ url: p.imageUrl, type: "image" as const }]
            : [],
      author: p.author.name ?? "Someone",
      authorId: p.authorId,
      authorImage: p.author.image ?? null,
      mine: p.authorId === viewerId,
      when: relative(p.createdAt, now),
      householdOnly: p.householdOnly,
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
      hellos: canSharePost(isHousehold(role), p, viewerId)
        ? p.hellos.map((h) => ({
            id: h.id,
            name: h.name,
            body: h.body,
            when: relative(h.createdAt, now),
          }))
        : [],
      reactions: tally(p.reactions, viewerId),
      comments: thread(p.comments, viewerId, now),
    };
  });
}
