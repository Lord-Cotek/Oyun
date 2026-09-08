import { prisma } from "./prisma";

export interface FeedComment {
  id: string;
  author: string;
  mine: boolean;
  body: string;
  when: string;
}

export interface FeedReaction {
  kind: string;
  count: number;
  mine: boolean;
}

export interface FeedPost {
  id: string;
  kind: string;
  body: string;
  author: string;
  authorId: string;
  mine: boolean;
  when: string;
  reactions: FeedReaction[];
  comments: FeedComment[];
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
export async function loadFeed(
  journeyId: string,
  viewerId: string,
  take = 40,
): Promise<FeedPost[]> {
  const posts = await prisma.post.findMany({
    where: { journeyId },
    orderBy: { createdAt: "desc" },
    take,
    include: {
      author: { select: { id: true, name: true } },
      reactions: { select: { kind: true, userId: true } },
      comments: {
        orderBy: { createdAt: "asc" },
        include: { author: { select: { id: true, name: true } } },
      },
    },
  });
  const now = new Date();

  return posts.map((p) => {
    const byKind = new Map<string, FeedReaction>();
    for (const r of p.reactions) {
      const cur = byKind.get(r.kind) ?? { kind: r.kind, count: 0, mine: false };
      cur.count += 1;
      if (r.userId === viewerId) cur.mine = true;
      byKind.set(r.kind, cur);
    }
    return {
      id: p.id,
      kind: p.kind,
      body: p.body,
      author: p.author.name ?? "Someone",
      authorId: p.authorId,
      mine: p.authorId === viewerId,
      when: relative(p.createdAt, now),
      reactions: [...byKind.values()],
      comments: p.comments.map((c) => ({
        id: c.id,
        author: c.author.name ?? "Someone",
        mine: c.authorId === viewerId,
        body: c.body,
        when: relative(c.createdAt, now),
      })),
    };
  });
}
