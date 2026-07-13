"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { notify } from "@/lib/notify";
import { isReactionEmoji } from "@/lib/reaction-emojis";
import { type ReactionTarget } from "@/lib/reactions";

const EMOJI_WORD: Record<string, string> = {
  "❤️": "a heart",
  "🙏": "a prayer",
  "🙌": "praise",
  "🌱": "hope",
};

/** Toggle the viewer's emoji reaction on an encouragement or a check-in. */
export async function toggleReaction(
  targetType: ReactionTarget,
  targetId: string,
  emoji: string,
) {
  const session = await auth();
  if (!session?.user?.id) return;
  if (!isReactionEmoji(emoji)) return;
  const userId = session.user.id;

  // Resolve the journey this target belongs to (and the author to notify).
  let journeyId: string | null = null;
  let authorId: string | null = null;
  if (targetType === "ENCOURAGEMENT") {
    const e = await prisma.encouragement.findUnique({
      where: { id: targetId },
      select: { journeyId: true, authorId: true },
    });
    if (!e) return;
    journeyId = e.journeyId;
    authorId = e.authorId;
  } else if (targetType === "LETTER") {
    const l = await prisma.letter.findUnique({
      where: { id: targetId },
      select: { journeyId: true, authorId: true, toBaby: true },
    });
    // Only the shared "to each other" letters carry reactions.
    if (!l || l.toBaby) return;
    journeyId = l.journeyId;
    authorId = l.authorId;
  } else {
    const c = await prisma.checkIn.findUnique({
      where: { id: targetId },
      select: { journeyId: true },
    });
    if (!c) return;
    journeyId = c.journeyId;
  }

  // The reactor must belong to this journey.
  const member = await prisma.membership.findFirst({
    where: { journeyId, userId },
    select: { role: true },
  });
  if (!member) return;
  // Letters between the couple are theirs alone — never an accountability partner.
  if (targetType === "LETTER" && member.role !== "MOTHER" && member.role !== "PARTNER") {
    return;
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
      // Notify the letter's author, wherever they read (mother → care).
      const authorMember = await prisma.membership.findFirst({
        where: { journeyId, userId: authorId },
        select: { role: true },
      });
      await notify({
        userId: authorId,
        type: "encouragement",
        title: `${who} responded with ${word} ${emoji} to your letter.`,
        href: authorMember?.role === "MOTHER" ? "/care" : "/journey",
      });
    } else if (targetType === "ENCOURAGEMENT" && authorId && authorId !== userId) {
      await notify({
        userId: authorId,
        type: "encouragement",
        title: `${who} responded with ${word} ${emoji} to your encouragement.`,
        href: "/journey",
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
          href: "/care",
        });
      }
    }
  }

  revalidatePath("/journey");
  revalidatePath("/care");
}
