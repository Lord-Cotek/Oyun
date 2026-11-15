/**
 * "Who's in this?" — the people in a Life post.
 *
 * A tag names somebody in the family: a child or relative in the tree, or a
 * member by their account. Keys keep the two apart without the screen
 * needing to know how either app stores people: "p:<person>", "c:<child>",
 * "u:<member>".
 *
 * ── The rules both apps keep ─────────────────────────────────────────────
 * - Only the person who wrote a post says who is in it.
 * - Anyone tagged can take their own tag off.
 * - A member is told when they are tagged, once, and only if they can see the
 *   post: a "just us" post never tags somebody it is hidden from.
 * - Each person's page gathers the posts they are in, under the same rule
 *   that decides who may see each post.
 *
 * Shared with the sibling app and drift-checked.
 */

export const TAG_MAX = 20;

/** Somebody who can be tagged, as the picker shows them. */
export type TagOption = {
  key: string;
  name: string;
  /** A member with an account, who will be told. */
  hasAccount: boolean;
  /** Cannot see a "just us" post, so cannot be tagged in one. */
  outsideJustUs: boolean;
};

/** Somebody tagged in a post, as the post shows them. */
export type PostTagView = {
  key: string;
  name: string;
  /** Their page, where one exists. */
  href: string | null;
  /** The person reading is this tag. */
  isMe: boolean;
};

const KEY = /^[pcu]:[A-Za-z0-9_-]{1,40}$/;

/** Well-formed keys only, each once, capped. */
export function cleanKeys(keys: unknown): string[] {
  if (!Array.isArray(keys)) return [];
  return Array.from(new Set(keys.filter((k): k is string => typeof k === "string" && KEY.test(k)))).slice(0, TAG_MAX);
}

export function splitKey(key: string): { kind: "p" | "c" | "u"; id: string } {
  return { kind: key[0] as "p" | "c" | "u", id: key.slice(2) };
}

/** "Ada", "Ada and Tobi", "Ada, Mama Bisi and Femi" — names as the family wrote them. */
export function withWords(names: string[]): string {
  const all = names.map((n) => n.trim()).filter(Boolean);
  if (all.length <= 1) return all[0] ?? "";
  return `${all.slice(0, -1).join(", ")} and ${all[all.length - 1]}`;
}
