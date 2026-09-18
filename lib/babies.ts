/**
 * How to talk about one baby, or two, or four.
 *
 * ── Why this is a file rather than a ternary in each place ───────────────
 * Because there are a dozen places that say something about the baby, and a
 * mother carrying twins should not meet "Ebun and Tobi is about the size of a
 * coconut" on her home screen. Each of those places got the singular written
 * into it by hand, which means each of them is a separate chance to forget —
 * and the person who finds out is the one it is wrong for.
 *
 * So the words live here, they are chosen from `babyCount`, and every surface
 * asks the same function. Adding a fifth place to mention the baby is then a
 * matter of asking, not of remembering.
 *
 * ── On the name ──────────────────────────────────────────────────────────
 * `babyName` is one free-text field and stays one: a mother expecting twins
 * types "Ebun and Tobi" into it and that is exactly right — it is her phrase,
 * not a list we should be parsing into parts and reassembling with commas in
 * a language we may have guessed wrong. What the count decides is the grammar
 * around it, which is the half she cannot type.
 */

export interface BabyWords {
  /** True for twins and up. */
  plural: boolean;
  /** "Ebun", "Ebun and Tobi", "Your little one", "Your little ones". */
  subject: string;
  /** Lower case, for mid-sentence: "your little one". */
  subjectLower: string;
  /** The verb that follows the subject: "is" / "are". */
  is: string;
  /**
   * "" or "each ", so a size reads truthfully: two babies are not together
   * the size of one coconut, they are each the size of one.
   */
  each: string;
  /** "little one" / "little ones", when the sentence supplies its own article. */
  littleOne: string;
  /** "them" — the same either way, and here so callers stop thinking about it. */
  them: string;
  /** What to call the name field: "Baby's name" / "Their names". */
  nameLabel: string;
  /** "baby" / "babies", for counting things rather than addressing them. */
  noun: string;
}

export function babyWords(
  count: number,
  name?: string | null,
): BabyWords {
  const plural = (count ?? 1) > 1;
  const given = name?.trim() || null;
  const fallback = plural ? "Your little ones" : "Your little one";

  return {
    plural,
    subject: given || fallback,
    subjectLower: given || fallback.toLowerCase(),
    is: plural ? "are" : "is",
    each: plural ? "each " : "",
    littleOne: plural ? "little ones" : "little one",
    them: "them",
    nameLabel: plural ? "Their names" : "Baby's name",
    noun: plural ? "babies" : "baby",
  };
}

/**
 * What the registry should call itself, before she edits it.
 *
 * "For baby Ebun and Tobi" is the sort of thing an app says when it has not
 * been told there are two of them.
 */
export function registryTitleFor(
  count: number,
  name?: string | null,
): string {
  const given = name?.trim();
  if (given) return count > 1 ? `For ${given}` : `For baby ${given}`;
  if (count === 2) return "For our twins";
  if (count === 3) return "For our triplets";
  if (count > 3) return "For our babies";
  return "For our baby";
}
