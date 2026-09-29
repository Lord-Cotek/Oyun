// Client-safe (no prisma import) so both server and client can use it.
/**
 * These were love, prayer, praise and a seedling — all of them reverent, and a
 * family is not only reverent. Laughter and a hug were added so there is
 * something to say to a story that is funny, and something to offer a day that
 * needs holding rather than answering.
 *
 * Only added to. An emoji already written against somebody's encouragement
 * three years ago stays exactly where it is.
 */
export const REACTION_EMOJIS = ["❤️", "🙏", "🙌", "😂", "🤗", "🌱"] as const;
export type ReactionEmoji = (typeof REACTION_EMOJIS)[number];

export type ReactionData = { counts: Record<string, number>; mine: string[] };

export function isReactionEmoji(v: string): v is ReactionEmoji {
  return (REACTION_EMOJIS as readonly string[]).includes(v);
}
