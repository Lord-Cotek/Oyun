import { prisma } from "@/lib/prisma";

/**
 * Who may read, react to, and now reply to a letter.
 *
 * ── Why this is a function and not a paragraph in two places ─────────────
 * The rule already existed, written out inside the reaction action. Adding
 * replies meant either writing it a second time or lifting it out. Two copies
 * of a permission rule is one rule and one bug waiting: the day somebody
 * tightens reading and forgets replying, the app leaks — quietly, and in the
 * one room where the words are most private. So it lives here, and both
 * callers ask it the same question.
 *
 * ── The rule ─────────────────────────────────────────────────────────────
 * The mother and her partner, and nobody else.
 *
 * Both kinds of letter here are theirs: the ones they write to each other,
 * and the ones they write to the baby. The circle can be wide on this journey
 * — a mother, a sister, a friend, an accountability partner — and none of
 * them belong in these two. A letter to a child who cannot read yet is still
 * a letter between the people keeping it for them.
 *
 * Checked even when the page has already rendered the letter, because a server
 * action is reachable without the page in front of it: a signed-in supporter
 * can call it with any id they can guess.
 */
export type LetterAccess =
  | { ok: false }
  | { ok: true; journeyId: string; authorId: string; toBaby: boolean };

export async function letterAccess(
  userId: string,
  letterId: string,
): Promise<LetterAccess> {
  const letter = await prisma.letter.findUnique({
    where: { id: letterId },
    select: { journeyId: true, authorId: true, toBaby: true },
  });
  if (!letter) return { ok: false };

  const member = await prisma.membership.findFirst({
    where: { journeyId: letter.journeyId, userId },
    select: { role: true },
  });
  if (!member) return { ok: false };
  if (member.role !== "MOTHER" && member.role !== "PARTNER") return { ok: false };

  return {
    ok: true,
    journeyId: letter.journeyId,
    authorId: letter.authorId,
    toBaby: letter.toBaby,
  };
}

/** Both kinds of letter are read in the same room. */
export function letterHref(): string {
  return "/letters";
}
