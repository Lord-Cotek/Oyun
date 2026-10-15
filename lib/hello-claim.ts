import { prisma } from "@/lib/prisma";
import { postScope } from "@/lib/post-visibility";

/**
 * Moving a word that came from outside into the conversation inside.
 *
 * ── The thing this is for ────────────────────────────────────────────────
 * Before the share page knew who was opening it, people already in the circle
 * were leaving one-line hellos on posts they could have been replying to. So
 * every family has a backlog: words sitting in "from outside" that were
 * written by an aunt who is, and always was, one of them.
 *
 * ── Why this cannot be done automatically ────────────────────────────────
 * A hello stores a name somebody typed, the words, and a cookie. No email, no
 * account, nothing that says WHICH person wrote it — and a reply has to name
 * a real author. There are only three ways to supply one:
 *
 *   the cookie        PROOF that a given browser wrote it. Available on the
 *                     share page, where that cookie is sent. Not proof of a
 *                     PERSON: on a shared family tablet the cookie knows the
 *                     browser and not who is holding it. So it is offered to
 *                     them and they confirm; it is never assumed.
 *   the typed name    a guess. "Femi" matches an account, and a wrong match
 *                     publishes somebody's words under a real person's name
 *                     in a thread that person can read. Not done, at all,
 *                     anywhere in this file.
 *   the household     they are the only people who actually know that this
 *                     is Mama Bisi. One tap, and it is recorded as theirs —
 *                     see attributedById.
 *
 * ── What converting actually changes, which is more than it looks ────────
 * A hello is shown ONLY to the household: ShareOutside renders behind
 * post.canShare. A reply is shown to everybody who can see the post — the
 * whole circle. So this does not merely move a word down the page, it widens
 * who reads it. That is the real reason nothing here happens silently, and
 * the reason the reply says where it came from afterwards.
 *
 * ── Why the hello row is kept ────────────────────────────────────────────
 * It is still the unique key on (share, browser) that stops the same person
 * posting again into an empty slot, and still the reason somebody can come
 * back and change what they said. Deleting it would reopen both.
 */

/** A word this browser wrote, which has not already become a reply. */
export interface ClaimableHello {
  id: string;
  name: string;
  body: string;
}

/**
 * The hello this browser left on this link, if there is one still to move.
 *
 * Keyed on the cookie, which is the only honest half of the proof. Returns
 * nothing for a hello the family took down (it is not theirs to resurrect by
 * another door) or one already converted.
 */
export async function claimableHello(
  shareId: string,
  guestToken: string,
): Promise<ClaimableHello | null> {
  if (!guestToken) return null;
  const h = await prisma.shareHello.findUnique({
    where: { shareId_guestToken: { shareId, guestToken } },
    select: {
      id: true,
      name: true,
      body: true,
      hiddenAt: true,
      convertedAt: true,
    },
  });
  if (!h || h.hiddenAt || h.convertedAt) return null;
  return { id: h.id, name: h.name, body: h.body };
}

export type ClaimResult = { ok: true } | { ok: false; error: string };

/**
 * Turn one hello into a reply by a named member of this journey.
 *
 * Everything that could be wrong is checked here rather than at the two call
 * sites, because one of those call sites is a stranger's browser and the
 * other is a form in a tab that may have been open for a week.
 *
 * `attributedById` is null when somebody claimed their own words, and the id
 * of whoever matched them otherwise. See the note on the column.
 */
export async function convertHello(input: {
  helloId: string;
  journeyId: string;
  authorId: string;
  attributedById: string | null;
}): Promise<ClaimResult> {
  const hello = await prisma.shareHello.findFirst({
    // Scoped to the journey: a hello id from one family must never reach a
    // post in another, however it arrived.
    where: { id: input.helloId, journeyId: input.journeyId },
    select: {
      id: true,
      body: true,
      postId: true,
      createdAt: true,
      hiddenAt: true,
      convertedAt: true,
    },
  });
  if (!hello) return { ok: false, error: "That word is no longer here." };
  if (hello.hiddenAt) {
    return { ok: false, error: "That word was taken down." };
  }
  // Already moved. Reported as success: the caller wanted it in the replies
  // and it is in the replies, and a second tap on a slow connection should
  // not read as a failure.
  if (hello.convertedAt) return { ok: true };

  const member = await prisma.membership.findFirst({
    where: { journeyId: input.journeyId, userId: input.authorId },
    select: { role: true },
  });
  if (!member) {
    return { ok: false, error: "They are not in the circle." };
  }

  // And can they actually see the post they would now be replying to? Same
  // scope every other reader uses — see lib/share-open.ts for why this is
  // asked rather than assumed.
  const post = await prisma.post.findFirst({
    where: { id: hello.postId, ...postScope(member.role) },
    select: { id: true },
  });
  if (!post) return { ok: false, error: "They cannot see that post." };

  /**
   * Claim the word, then write the reply, and let the database arbitrate.
   *
   * ── Why a claim and not a unique index ───────────────────────────────
   * A unique index on a new column is a change `prisma db push` will not make
   * without --accept-data-loss, and that flag has no business anywhere near
   * the build of an app holding families' diaries. So the lock is an
   * `UPDATE … WHERE convertedAt IS NULL`, which is atomic on its own: two
   * taps at the same instant both reach it, exactly one updates a row, and
   * the other is told it lost and changes nothing.
   *
   * ── Why both halves are in one transaction ───────────────────────────
   * Because the failure that matters is the claim sticking while the reply
   * does not: the word would then be hidden from "from outside" and absent
   * from the replies, which is the one outcome worse than doing nothing. A
   * rollback puts it back where it was.
   */
  const moved = await prisma.$transaction(async (tx) => {
    const claimed = await tx.shareHello.updateMany({
      where: { id: hello.id, convertedAt: null },
      data: { convertedAt: new Date() },
    });
    if (claimed.count === 0) return false;
    await tx.postComment.create({
      data: {
        postId: hello.postId,
        authorId: input.authorId,
        body: hello.body,
        // ── The words keep the day they were said ──────────────────────
        // Not now(). These were written in month four, and stamping them
        // with today would put a year-old blessing at the bottom of the
        // thread as though somebody had just said it — and would leave the
        // family reading a conversation that never happened in that order.
        createdAt: hello.createdAt,
        fromHelloId: hello.id,
        attributedById: input.attributedById,
      },
    });
    return true;
  });
  // Lost the race: somebody else moved the same word a moment ago. The reply
  // exists, which is what the caller wanted.
  if (!moved) return { ok: true };

  // ── Deliberately silent ────────────────────────────────────────────────
  // No notification. Nothing was said today; something said months ago was
  // filed where it belonged. Telling the circle "Mama Bisi replied" would be
  // false, and telling them about a backlog of forty at once would be worse.
  return { ok: true };
}

/**
 * The cookie that remembers somebody said "leave it as it is".
 *
 * Per browser and per link, scoped to the share path like the guest token
 * itself, because the question is only ever asked of a browser that can prove
 * it wrote the hello. If it is cleared they are asked once more, which is the
 * right failure: the alternative is a column recording a decision nobody can
 * see or change.
 */
export function claimAskedCookie(token: string): string {
  return `oyun_claim_${token.slice(0, 12)}`;
}
