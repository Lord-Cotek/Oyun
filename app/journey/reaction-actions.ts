"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { notify } from "@/lib/notify";
import { letterAccess, letterHref } from "@/lib/letter-access";
import { isReactionEmoji } from "@/lib/reaction-emojis";
import { type ReactionTarget } from "@/lib/reactions";

const EMOJI_WORD: Record<string, string> = {
  "❤️": "a heart",
  "🙏": "a prayer",
  "🙌": "praise",
  "😂": "laughter",
  "🤗": "a hug",
  "🌱": "hope",
};

/**
 * Toggle the viewer's emoji reaction on anything in the journey that carries
 * one — an encouragement, a check-in, a letter, a prayer request.
 *
 * Returns whether it took. The screen has already moved by the time this is
 * called — see lib/use-attempt.ts — so a silent `return` would leave a
 * reaction showing that was never recorded. Every refusal below is a real one
 * a person can hit: the session ran out while the tab sat open, or they were
 * taken out of the circle between the page rendering and the tap.
 */
export async function toggleReaction(
  targetType: ReactionTarget,
  targetId: string,
  emoji: string,
): Promise<{ ok: boolean }> {
  const session = await auth();
  if (!session?.user?.id) return { ok: false };
  if (!isReactionEmoji(emoji)) return { ok: false };
  const userId = session.user.id;

  // Resolve the journey this target belongs to (and the author to notify).
  let journeyId: string | null = null;
  let authorId: string | null = null;
  if (targetType === "ENCOURAGEMENT") {
    const e = await prisma.encouragement.findUnique({
      where: { id: targetId },
      select: { journeyId: true, authorId: true },
    });
    if (!e) return { ok: false };
    journeyId = e.journeyId;
    authorId = e.authorId;
  } else if (targetType === "LETTER") {
    const l = await prisma.letter.findUnique({
      where: { id: targetId },
      select: { journeyId: true, authorId: true },
    });
    if (!l) return { ok: false };
    journeyId = l.journeyId;
    authorId = l.authorId;
  } else if (targetType === "PRAYER") {
    const r = await prisma.prayerRequest.findUnique({
      where: { id: targetId },
      select: { journeyId: true, authorId: true },
    });
    if (!r) return { ok: false };
    journeyId = r.journeyId;
    authorId = r.authorId;
  } else {
    const c = await prisma.checkIn.findUnique({
      where: { id: targetId },
      select: { journeyId: true },
    });
    if (!c) return { ok: false };
    journeyId = c.journeyId;
  }

  // The reactor must belong to this journey.
  const member = await prisma.membership.findFirst({
    where: { journeyId, userId },
    select: { role: true },
  });
  if (!member) return { ok: false };
  /**
   * Letters are the two of them — never an accountability partner or a friend.
   * This is the same line /letters draws with `isHousehold`, kept here because
   * a server action is reachable without the page that renders it.
   *
   * It used to draw a second line as well: letters `toBaby` were refused
   * outright. But both of them see those letters, the page invites them to
   * "write, read, and react", and BabyLetters has always rendered the row — so
   * every heart put on a letter to the baby appeared, failed, rolled back, and
   * said "That didn't reach them. Tap again?", which no amount of tapping could
   * fix. Tested: it never once saved. The refusal was the bug, not the row.
   */
  if (targetType === "LETTER") {
    // The rule itself lives in lib/letter-access.ts, because replies need the
    // identical one and two copies of a permission check is one rule and one
    // bug waiting — the day somebody tightens who may read a letter and
    // forgets who may answer it, this app leaks in the room where the words
    // are most private. It repeats the membership lookup done above, which is
    // one indexed query and worth it to keep the rule in a single place.
    const access = await letterAccess(userId, targetId);
    if (!access.ok) return { ok: false };
  }

  const where = {
    targetType_targetId_userId_emoji: { targetType, targetId, userId, emoji },
  };
  const existing = await prisma.reaction.findUnique({ where });

  if (existing) {
    await prisma.reaction.delete({ where });
  } else {
    await prisma.reaction.create({
      data: { targetType, targetId, userId, emoji },
    });

    // Gentle in-app notification when a reaction is added.
    const me = await prisma.user.findUnique({ where: { id: userId }, select: { name: true } });
    const who = me?.name?.trim() || "Someone in your circle";
    const word = EMOJI_WORD[emoji] ?? "a reaction";
    if (targetType === "LETTER" && authorId && authorId !== userId) {
      // One destination for anything that happens to a letter. This used to
      // send the mother to /care and her partner to /journey, from the days
      // before letters had a room of their own; a reaction and a reply landing
      // in two different places for the same letter is the kind of small
      // wrongness nobody reports and everybody feels.
      await notify({
        userId: authorId,
        type: "encouragement",
        title: `${who} responded with ${word} ${emoji} to your letter.`,
        href: letterHref(),
      });
    } else if (targetType === "PRAYER" && authorId && authorId !== userId) {
      await notify({
        userId: authorId,
        type: "prayer",
        title: `${who} responded with ${word} ${emoji} to your prayer request.`,
        href: `/prayer#prayer-${targetId}`,
      });
    } else if (targetType === "ENCOURAGEMENT" && authorId && authorId !== userId) {
      await notify({
        userId: authorId,
        type: "encouragement",
        title: `${who} responded with ${word} ${emoji} to your encouragement.`,
        href: `/journey#enc-${targetId}`,
      });
    } else if (targetType === "CHECKIN" && journeyId) {
      const journey = await prisma.journey.findUnique({
        where: { id: journeyId },
        select: { ownerId: true },
      });
      if (journey && journey.ownerId !== userId) {
        await notify({
          userId: journey.ownerId,
          type: "checkin",
          title: `${who} responded with ${word} ${emoji} to how you're feeling.`,
          href: `/care#checkin-${targetId}`,
        });
      }
    }
  }

  revalidatePath("/journey");
  revalidatePath("/care");
  revalidatePath("/letters");
  revalidatePath("/prayer");
  return { ok: true };
}
