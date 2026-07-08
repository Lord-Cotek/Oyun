// Client-safe (no prisma import) so both server and client can use it.
export const REACTION_EMOJIS = ["❤️", "🙏", "🙌", "🌱"] as const;
export type ReactionEmoji = (typeof REACTION_EMOJIS)[number];

export type ReactionData = { counts: Record<string, number>; mine: string[] };

export function isReactionEmoji(v: string): v is ReactionEmoji {
  return (REACTION_EMOJIS as readonly string[]).includes(v);
}
