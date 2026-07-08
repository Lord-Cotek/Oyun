import { prisma } from "@/lib/prisma";
import { type ReactionData } from "@/lib/reaction-emojis";

export type ReactionTarget = "ENCOURAGEMENT" | "CHECKIN";

/** Aggregated reactions for a set of targets, plus which ones the viewer made. */
export async function getReactionsFor(
  targetType: ReactionTarget,
  targetIds: string[],
  viewerId: string,
): Promise<Record<string, ReactionData>> {
  const map: Record<string, ReactionData> = {};
  for (const id of targetIds) map[id] = { counts: {}, mine: [] };
  if (targetIds.length === 0) return map;

  const rows = await prisma.reaction.findMany({
    where: { targetType, targetId: { in: targetIds } },
  });
  for (const r of rows) {
    const d = map[r.targetId] ?? (map[r.targetId] = { counts: {}, mine: [] });
    d.counts[r.emoji] = (d.counts[r.emoji] ?? 0) + 1;
    if (r.userId === viewerId) d.mine.push(r.emoji);
  }
  return map;
}
