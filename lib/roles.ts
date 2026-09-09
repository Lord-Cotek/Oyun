import { type Role } from "@prisma/client";

/**
 * Who is who in a journey — the single source of truth.
 *
 * Two circles, and the difference matters:
 *
 *  - The HOUSEHOLD (the mother and the one beside her) share the intimate
 *    spaces: letters, family worship, her care journal.
 *  - The CIRCLE around them — an accountability partner, a close relative, a
 *    dear friend — are here to see life, rejoice, and pray. They are welcome
 *    everywhere the family shares life, and nowhere the family keeps private.
 *
 * Gate on `isHousehold`, never on a single role name: that way adding a role
 * can never quietly open a door that was meant to stay shut.
 */

export const ROLE_LABEL: Record<string, string> = {
  MOTHER: "Mother",
  PARTNER: "Husband / Partner",
  ACCOUNTABILITY: "Accountability partner",
  FAMILY: "Family",
  FRIEND: "Friend",
};

/** A short word for the role, for chips and switchers. */
export const ROLE_SHORT: Record<string, string> = {
  MOTHER: "Your journey",
  PARTNER: "Partner",
  ACCOUNTABILITY: "Accountability",
  FAMILY: "Family",
  FRIEND: "Friend",
};

export const HOUSEHOLD_ROLES: Role[] = ["MOTHER", "PARTNER"];
export const SUPPORTER_ROLES: Role[] = ["ACCOUNTABILITY", "FAMILY", "FRIEND"];
/** Everyone in the journey except the mother — the circle she can invite. */
export const INVITABLE_ROLES: Role[] = [
  "PARTNER",
  "ACCOUNTABILITY",
  "FAMILY",
  "FRIEND",
];

/** The mother and the one beside her — the intimate spaces are theirs. */
export function isHousehold(role: Role | string): boolean {
  return role === "MOTHER" || role === "PARTNER";
}

/** Someone walking alongside: accountability partner, relative, or friend. */
export function isSupporter(role: Role | string): boolean {
  return (SUPPORTER_ROLES as string[]).includes(role);
}

export function isRole(v: string): v is Role {
  return ["MOTHER", "PARTNER", "ACCOUNTABILITY", "FAMILY", "FRIEND"].includes(v);
}

/**
 * How a supporter's own home should read. An accountability partner came for
 * spiritual friendship; a grandmother came to see the baby. Same access, and
 * the same call to pray — different welcome.
 */
export function supporterFraming(role: Role | string, motherName: string): {
  eyebrow: string;
  title: string;
  blurb: string;
} {
  switch (role) {
    case "FAMILY":
      return {
        eyebrow: "Family",
        title: `Close to ${motherName}, wherever you are.`,
        blurb: `Life as it happens — and a standing invitation to pray for ${motherName} and the little one.`,
      };
    case "FRIEND":
      return {
        eyebrow: "Friend",
        title: `Walking with ${motherName}.`,
        blurb: `The updates that matter, shared with the few — rejoice, pray, and send a word.`,
      };
    default:
      return {
        eyebrow: "Accountability partner",
        title: `Walking faithfully alongside ${motherName}.`,
        blurb: `Pray, encourage, and keep pointing them past yourself, to the Lord.`,
      };
  }
}
