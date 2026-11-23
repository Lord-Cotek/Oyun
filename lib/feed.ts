/**
 * The family feed — life shared and carried together. Not a social wall: a
 * warm, private place for the people walking this road with you.
 */

export const POST_KINDS = [
  { kind: "UPDATE", label: "An update", hint: "How you are, what's been happening." },
  { kind: "PRAISE", label: "A praise", hint: "Something God has done." },
  { kind: "PRAYER", label: "A prayer", hint: "Something for the family to carry." },
  { kind: "MILESTONE", label: "A milestone", hint: "A moment worth keeping." },
] as const;

export type PostKind = (typeof POST_KINDS)[number]["kind"];

/**
 * The same four kinds in plain words, for a reader who chose the app without
 * religious content (Oyun's lib/voice.ts). Only the words: a post written as
 * a praise is still stored as one, and a reader who chose faith still sees
 * "Praise" on it.
 */
export const PLAIN_POST_KINDS: readonly { kind: PostKind; label: string; hint: string }[] = [
  { kind: "UPDATE", label: "An update", hint: "How you are, what's been happening." },
  { kind: "PRAISE", label: "Good news", hint: "Something to celebrate." },
  { kind: "PRAYER", label: "A request", hint: "Something for the family to carry." },
  { kind: "MILESTONE", label: "A milestone", hint: "A moment worth keeping." },
];

export const KIND_LABEL: Record<string, string> = {
  UPDATE: "Update",
  PRAISE: "Praise",
  PRAYER: "Prayer",
  MILESTONE: "Milestone",
};

/** The chip on a post, in plain words — see PLAIN_POST_KINDS. */
export const PLAIN_KIND_LABEL: Record<string, string> = {
  UPDATE: "Update",
  PRAISE: "Good news",
  PRAYER: "Request",
  MILESTONE: "Milestone",
};

export function isPostKind(v: string): v is PostKind {
  return POST_KINDS.some((k) => k.kind === v);
}

/**
 * What a family can say back without typing.
 *
 * These were all reverent — amen, praying, love, rejoicing, thankful — and a
 * household is not only reverent. Somebody posts that the baby has put beans
 * up her nose again and the only honest answers available were a prayer and a
 * bunch of herbs. A house where you can pray together and not laugh together
 * is not the house this is for.
 *
 * So laughter, and a hug for the days that need one rather than a verdict.
 * Nothing was taken away: a kind string already written against somebody's
 * post would simply stop being drawn, and a reaction somebody gave three years
 * ago is theirs.
 */
export const REACTIONS = [
  { kind: "AMEN", glyph: "🙏", label: "Amen" },
  { kind: "PRAYING", glyph: "🤲", label: "Praying" },
  { kind: "HEART", glyph: "❤️", label: "Love" },
  { kind: "LAUGH", glyph: "😂", label: "That is funny" },
  { kind: "REJOICING", glyph: "🎉", label: "Rejoicing" },
  { kind: "HUG", glyph: "🤗", label: "A hug" },
  { kind: "THANKFUL", glyph: "🌿", label: "Thankful" },
] as const;

export type ReactionKind = (typeof REACTIONS)[number]["kind"];

export function isReactionKind(v: string): boolean {
  return REACTIONS.some((r) => r.kind === v);
}

export function reactionGlyph(kind: string): string {
  return REACTIONS.find((r) => r.kind === kind)?.glyph ?? "•";
}
