import { prisma } from "@/lib/prisma";
import { isHousehold } from "@/lib/roles";
import { seesHouseholdOnly } from "@/lib/post-visibility";
import { cleanKeys, splitKey, withWords, type PostTagView, type TagOption } from "@/lib/tags";

/**
 * Who's in a Life post, for a journey: its children, and its members by
 * account. See lib/tags.ts for the rules both apps keep.
 */

/** Everyone the viewer could tag — never themselves. */
export async function tagOptions(journeyId: string, viewerId: string): Promise<TagOption[]> {
  const [children, members] = await Promise.all([
    prisma.child.findMany({ where: { journeyId }, orderBy: { createdAt: "asc" }, select: { id: true, name: true } }),
    prisma.membership.findMany({
      where: { journeyId, userId: { not: viewerId } },
      orderBy: { createdAt: "asc" },
      select: { role: true, userId: true, user: { select: { name: true } } },
    }),
  ]);
  return [
    ...children.map((c) => ({ key: `c:${c.id}`, name: c.name, hasAccount: false, outsideJustUs: false })),
    ...members.map((m) => ({
      key: `u:${m.userId}`,
      name: m.user.name ?? "Someone",
      hasAccount: true,
      outsideJustUs: !seesHouseholdOnly(m.role),
    })),
  ];
}

export type SetTagsResult = { ok: true; told: string[] } | { ok: false; error: string };

/**
 * Say who is in a post. Only its author may; anyone not in this journey is
 * dropped; somebody who cannot see a "just us" post is refused by name.
 * Returns the members newly tagged, to be told.
 */
export async function setTags(journeyId: string, postId: string, actorId: string, keys: unknown): Promise<SetTagsResult> {
  const post = await prisma.post.findFirst({
    where: { id: postId, journeyId },
    select: { authorId: true, householdOnly: true, tags: { select: { childId: true, userId: true } } },
  });
  if (!post) return { ok: false, error: "That post is no longer here." };
  if (post.authorId !== actorId) return { ok: false, error: "Only the person who shared this can say who is in it." };

  const options = new Map((await tagOptions(journeyId, actorId)).map((o) => [o.key, o]));
  const wanted = cleanKeys(keys).filter((k) => options.has(k));
  if (post.householdOnly) {
    const hidden = wanted.map((k) => options.get(k)!).filter((o) => o.outsideJustUs);
    if (hidden.length) {
      return {
        ok: false,
        error: `${withWords(hidden.map((o) => o.name))} can't see "just us" posts, so can't be tagged in this one.`,
      };
    }
  }

  const have = new Set(post.tags.map((t) => (t.childId ? `c:${t.childId}` : `u:${t.userId}`)));
  const add = wanted.filter((k) => !have.has(k));
  const drop = Array.from(have).filter((k) => !wanted.includes(k));
  await prisma.$transaction([
    ...drop.map((k) => {
      const { kind, id } = splitKey(k);
      return prisma.postTag.deleteMany({ where: { postId, ...(kind === "c" ? { childId: id } : { userId: id }) } });
    }),
    prisma.postTag.createMany({
      data: add.map((k) => {
        const { kind, id } = splitKey(k);
        return { postId, addedById: actorId, ...(kind === "c" ? { childId: id } : { userId: id }) };
      }),
      skipDuplicates: true,
    }),
  ]);
  return { ok: true, told: add.filter((k) => k.startsWith("u:")).map((k) => splitKey(k).id) };
}

/** The tags on these posts, as the viewer sees them. */
export async function loadTags(postIds: string[], viewerId: string, role: string): Promise<Map<string, PostTagView[]>> {
  const out = new Map<string, PostTagView[]>();
  if (postIds.length === 0) return out;
  const tags = await prisma.postTag.findMany({
    where: { postId: { in: postIds } },
    orderBy: { createdAt: "asc" },
    select: { postId: true, childId: true, userId: true, child: { select: { name: true } }, user: { select: { name: true } } },
  });
  // A child's page is the household's; the circle sees the name, not a link.
  const links = isHousehold(role);
  for (const t of tags) {
    const view: PostTagView = t.childId
      ? { key: `c:${t.childId}`, name: t.child?.name ?? "", href: links ? `/child/${t.childId}` : null, isMe: false }
      : { key: `u:${t.userId}`, name: t.user?.name ?? "Someone", href: null, isMe: t.userId === viewerId };
    if (!view.name) continue;
    out.set(t.postId, [...(out.get(t.postId) ?? []), view]);
  }
  return out;
}

/** Take your own tag off a post. */
export async function untagMe(journeyId: string, postId: string, userId: string): Promise<boolean> {
  const r = await prisma.postTag.deleteMany({ where: { postId, userId, post: { journeyId } } });
  return r.count > 0;
}
