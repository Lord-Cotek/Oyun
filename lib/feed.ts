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

export const KIND_LABEL: Record<string, string> = {
  UPDATE: "Update",
  PRAISE: "Praise",
  PRAYER: "Prayer",
  MILESTONE: "Milestone",
};

/** The tone for a post kind's badge — tones shared by both apps' palettes. */
export const KIND_TONE: Record<string, string> = {
  UPDATE: "sky",
  PRAISE: "gold",
  PRAYER: "plum",
  MILESTONE: "green",
};

export function isPostKind(v: string): v is PostKind {
  return POST_KINDS.some((k) => k.kind === v);
}

export const REACTIONS = [
  { kind: "AMEN", glyph: "🙏", label: "Amen" },
  { kind: "PRAYING", glyph: "🤲", label: "Praying" },
  { kind: "HEART", glyph: "❤️", label: "Love" },
  { kind: "REJOICING", glyph: "🎉", label: "Rejoicing" },
  { kind: "THANKFUL", glyph: "🌿", label: "Thankful" },
] as const;

export type ReactionKind = (typeof REACTIONS)[number]["kind"];

export function isReactionKind(v: string): boolean {
  return REACTIONS.some((r) => r.kind === v);
}

export function reactionGlyph(kind: string): string {
  return REACTIONS.find((r) => r.kind === kind)?.glyph ?? "•";
}
