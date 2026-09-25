import { type Role } from "@prisma/client";
import { isHousehold } from "@/lib/roles";

/**
 * Who sees a post that has been kept back.
 *
 * ── Why the toggle exists ────────────────────────────────────────────────
 * The diary was one room with one audience: everybody invited onto this
 * journey saw everything in it. That is right for most of what a family
 * writes down, and wrong for some of it. A journey with an accountability
 * partner, a friend from church and two grandmothers on it will sooner or
 * later want to put something in the diary that is not for all of them — a
 * hard week, a scan photograph, a body that is not behaving. Without
 * somewhere to put it people do the thing they always do, which is stop
 * writing it down at all.
 *
 * ── The line, and why it falls here ──────────────────────────────────────
 * The two at the centre of the journey, and nobody else.
 *
 * It used to include relatives invited onto the journey — the FAMILY role —
 * on the reading that "family only" naturally meant the family. It does not.
 * A mother writing about her marriage, her body or a fear she has not said
 * out loud means her husband, and a grandmother is exactly one of the people
 * she is keeping it from. Reading it the other way made the private room the
 * least private thing in the app, because it was the one room a person
 * trusted.
 *
 * So: the household. Everybody else on the journey — relatives, an
 * accountability partner, a friend — is outside it.
 *
 * It is deliberately ONE line rather than a picker with names on it. A
 * per-person audience list is the beginning of a social network, and it makes
 * every post a small administrative decision — which is how people end up
 * posting nothing. One toggle, two audiences, and the default is the one the
 * diary has always had.
 *
 * ── Why this is a function and not a condition in eight places ───────────
 * A post is read by the diary, the home page, search, the year counts and the
 * export, and a post that is hidden in four of those and visible in the fifth
 * is not hidden. Every one of them spreads `postScope(role)` into its `where`,
 * so there is one rule and adding a sixth reader is a one-line job.
 */

/** The two who are having this baby. Nobody else, however close. */
export function seesHouseholdOnly(role: Role | string): boolean {
  return isHousehold(role);
}

/**
 * The `where` fragment every post query carries.
 *
 * Empty for the household — they see everything — and `householdOnly: false`
 * for everybody else, which also reads as what it means at the call site.
 *
 * The column behind it is still named `familyOnly` in the database: renaming
 * a column means dropping and recreating it, and nothing on a family's diary
 * is worth that. See the @map in the schema.
 */
export function postScope(role: Role | string): { householdOnly?: false } {
  return seesHouseholdOnly(role) ? {} : { householdOnly: false };
}

/**
 * What the toggle and the marker say. Written once so they agree.
 *
 * "Family only" was the old wording and it was the mistake in a phrase: a
 * grandmother reading "family only" on a post would reasonably think it
 * included her, and a mother writing under it would reasonably think it did
 * not. The words now name the two people they mean.
 */
export const JUST_US = {
  /** On the post itself, for everybody who can see it. */
  badge: "Just us",
  /** The toggle when it is off — the diary as it has always been. */
  offLabel: "Everyone here",
  /** The toggle when it is on. */
  onLabel: "Just us",
  /** One line under the toggle, said in terms of people rather than roles. */
  hint: "Only the two of you. Nobody else on the journey sees it — not the relatives you have invited, and not your circle.",
} as const;
