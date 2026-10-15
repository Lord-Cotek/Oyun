import { prisma } from "@/lib/prisma";

/**
 * The words written back under a letter.
 *
 * Loaded for a whole page of letters in one query rather than one query per
 * letter, the same way reactions are — a thread of thirty letters should cost
 * two round trips, not sixty.
 *
 * Who may see these is decided before the page ever calls this: a letter the
 * viewer is not allowed to read is not in `letterIds` to begin with. See
 * lib/letter-access.ts for the rule itself.
 */
export interface LetterReplyItem {
  id: string;
  body: string;
  createdAt: string;
  authorId: string;
  authorName: string | null;
}

export async function getRepliesFor(
  letterIds: string[],
): Promise<Record<string, LetterReplyItem[]>> {
  const map: Record<string, LetterReplyItem[]> = {};
  for (const id of letterIds) map[id] = [];
  if (letterIds.length === 0) return map;

  try {
    const rows = await prisma.letterReply.findMany({
      where: { letterId: { in: letterIds } },
      // Oldest first: a thread is read downwards, in the order it was said.
      orderBy: { createdAt: "asc" },
      include: { author: { select: { id: true, name: true } } },
    });
    for (const r of rows) {
      (map[r.letterId] ??= []).push({
        id: r.id,
        body: r.body,
        createdAt: r.createdAt.toISOString(),
        authorId: r.authorId,
        authorName: r.author.name ?? null,
      });
    }
  } catch {
    // If the LetterReply table has not been created yet, show the letters with
    // no replies rather than taking the page down. They appear on the next
    // load once the schema is applied. Same bargain reactions make.
  }
  return map;
}
