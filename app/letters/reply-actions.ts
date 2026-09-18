"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { letterAccess, letterHref } from "@/lib/letter-access";
import { notify } from "@/lib/notify";

/**
 * Writing back to a letter.
 *
 * Letters took emoji and nothing else. An emoji is the right weight for "I saw
 * this" and the wrong one for answering it — a letter to somebody is a
 * conversation, and it had a doorbell and no door. A husband who finds a
 * letter waiting from his wife should be able to answer it in words, in the
 * same place, instead of tapping a heart and saying the rest somewhere else.
 *
 * It applies to the letters written to the baby too. Those become a thread
 * over months — one parent writes, the other adds to it — and a child reading
 * the whole of it years later gets a conversation between two people who were
 * waiting for them, rather than two separate monologues.
 *
 * Who may write one is decided in lib/letter-access.ts, by the same function
 * the reaction action calls, so the two can never drift.
 */
const MAX = 2000;

export async function replyToLetter(
  letterId: string,
  body: string,
): Promise<{ ok: boolean }> {
  const session = await auth();
  if (!session?.user?.id) return { ok: false };

  const text = body.trim();
  // Nothing, or a novel. Generous, because this is a place for a proper
  // answer rather than a comment box — but not unbounded.
  if (!text || text.length > MAX) return { ok: false };

  const access = await letterAccess(session.user.id, letterId);
  if (!access.ok) return { ok: false };

  await prisma.letterReply.create({
    data: { letterId, authorId: session.user.id, body: text },
  });

  // The author hears about it, unless they are answering themselves — which
  // people do, adding a second thought a day later.
  if (access.authorId !== session.user.id) {
    const me = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { name: true },
    });
    const who = me?.name?.trim() || "Someone on this journey";
    await notify({
      userId: access.authorId,
      type: "letter_reply",
      title: `${who} wrote back to your letter.`,
      href: letterHref(),
    });
  }

  revalidatePath("/letters");
  revalidatePath("/care");
  return { ok: true };
}

/**
 * Taking it back.
 *
 * Your own words only — not the letter author's power to prune the thread
 * under their letter. Somebody who wrote something they regret can remove it;
 * nobody else can remove it for them.
 */
export async function deleteLetterReply(
  replyId: string,
): Promise<{ ok: boolean }> {
  const session = await auth();
  if (!session?.user?.id) return { ok: false };

  const reply = await prisma.letterReply.findUnique({
    where: { id: replyId },
    select: { authorId: true },
  });
  if (!reply || reply.authorId !== session.user.id) return { ok: false };

  await prisma.letterReply.delete({ where: { id: replyId } });

  revalidatePath("/letters");
  revalidatePath("/care");
  return { ok: true };
}
