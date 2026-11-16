import { prisma } from "@/lib/prisma";
import { cleanAnnouncement, type AnnouncementData } from "@/lib/announcement";

type Row = {
  babies: unknown;
  bornOn: Date;
  timeOfBirth: string | null;
  weight: string | null;
  place: string | null;
  message: string | null;
  signedAs: string | null;
  verseRef: string | null;
  photoUrls: string[];
  style: string;
};

/** A stored announcement, read back through the same checks it went in by. */
export function toData(row: Row): AnnouncementData | null {
  const r = cleanAnnouncement({ ...row, bornOn: row.bornOn.toISOString().slice(0, 10) });
  return r.ok ? r.data : null;
}

export async function getAnnouncement(journeyId: string) {
  return prisma.birthAnnouncement.findUnique({ where: { journeyId } });
}

/** A live, public share link for this post, if there is one. */
export async function liveShareToken(postId: string): Promise<string | null> {
  const s = await prisma.postShare.findFirst({
    where: { postId, revokedAt: null, OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }] },
    orderBy: { createdAt: "desc" },
    select: { token: true },
  });
  return s?.token ?? null;
}

/**
 * The announcement behind a share link — only when the link is live and the
 * post is not kept to the family, the same two rules every shared post keeps.
 */
export async function announcementForToken(token: string): Promise<AnnouncementData | null> {
  if (!token || token.length > 64) return null;
  const share = await prisma.postShare.findUnique({
    where: { token },
    select: { postId: true, revokedAt: true, expiresAt: true, post: { select: { householdOnly: true } } },
  });
  if (!share || share.revokedAt || (share.expiresAt && share.expiresAt.getTime() < Date.now())) return null;
  if (!share.post || share.post.householdOnly) return null;
  const row = await prisma.birthAnnouncement.findUnique({ where: { postId: share.postId } });
  return row ? toData(row) : null;
}
