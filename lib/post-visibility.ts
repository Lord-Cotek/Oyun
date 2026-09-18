import { type Role } from "@prisma/client";
import { isHousehold } from "@/lib/roles";

/**
 * Who sees a post that has been kept to the family.
 *
 * ── Why the toggle exists ────────────────────────────────────────────────
 * The diary was one room with one audience: everybody invited onto this
 * journey saw everything in it. That is right for most of what a family
 * writes down, and wrong for some of it. A journey with an accountability
 * partner, a friend from church and two grandmothers on it will sooner or
 * later want to put something in the diary for the grandmothers and not for
 * everyone — a hard week, a scan photograph, a body that is not behaving.
 * Without somewhere to put it people do the thing they always do, which is
 * stop writing it down at all.
 *
 * ── The line, and why it falls here ──────────────────────────────────────
 * Family is the mother, the one beside her, and the relatives invited onto
 * the journey. An accountability partner and a friend are the circle:
 * welcome to everything the family shares, and not in this.
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

/** Family: the two at the centre, and the relatives on this journey. */
export function seesFamilyOnly(role: Role | string): boolean {
  return isHousehold(role) || role === "FAMILY";
}

/**
 * The `where` fragment every post query carries.
 *
 * Empty for family — they see everything — and `familyOnly: false` for the
 * circle, which also reads as what it means at the call site.
 */
export function postScope(role: Role | string): { familyOnly?: false } {
  return seesFamilyOnly(role) ? {} : { familyOnly: false };
}

/** What the toggle and the marker say. Written once so they agree. */
export const FAMILY_ONLY = {
  /** On the post itself, for everybody who can see it. */
  badge: "Family only",
  /** The toggle when it is off — the diary as it has always been. */
  offLabel: "Everyone here",
  /** The toggle when it is on. */
  onLabel: "Family only",
  /** One line under the toggle, said in terms of people rather than roles. */
  hint: "Kept to your family. An accountability partner or a friend in your circle will not see it.",
} as const;
