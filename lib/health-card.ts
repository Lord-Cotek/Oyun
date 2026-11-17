/**
 * Health cards — the rules, with no database in sight.
 *
 * A health card holds the few things worth reaching for in a hurry. It is not
 * a medical record and does not pretend to be one: nothing here is checked by
 * anyone, and the two gentle notes below only ever say "ask your midwife".
 */

export const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;
/** The same list Ìdílé keeps, so a card reads the same on both sides of the handover. */
export const GENOTYPES = ["AA", "AS", "SS", "AC", "SC"] as const;

export type HealthFields = {
  bloodGroup: string | null;
  genotype: string | null;
  allergies: string | null;
  conditions: string | null;
  medicines: string | null;
  careProvider: string | null;
  emergencyContact: string | null;
  notes: string | null;
};

export const EMPTY_HEALTH: HealthFields = {
  bloodGroup: null,
  genotype: null,
  allergies: null,
  conditions: null,
  medicines: null,
  careProvider: null,
  emergencyContact: null,
  notes: null,
};

const LIMITS: Record<keyof HealthFields, number> = {
  bloodGroup: 8,
  genotype: 8,
  allergies: 1000,
  conditions: 1000,
  medicines: 1000,
  careProvider: 300,
  emergencyContact: 300,
  notes: 2000,
};

function text(v: unknown, max: number): string | null {
  const s = typeof v === "string" ? v.trim() : "";
  return s ? s.slice(0, max) : null;
}

/**
 * A card as submitted, made safe. Blood group and genotype must be one of the
 * known values or nothing — a typo there is worse than a blank, because a
 * blank is read as "not known" and a typo is read as an answer.
 */
export function cleanHealth(raw: Record<string, unknown>): HealthFields {
  const out = { ...EMPTY_HEALTH };
  for (const k of Object.keys(LIMITS) as (keyof HealthFields)[]) {
    out[k] = text(raw[k], LIMITS[k]);
  }
  if (out.bloodGroup && !(BLOOD_GROUPS as readonly string[]).includes(out.bloodGroup)) out.bloodGroup = null;
  if (out.genotype && !(GENOTYPES as readonly string[]).includes(out.genotype)) out.genotype = null;
  return out;
}

export function hasAnyHealth(f: HealthFields | null | undefined): boolean {
  return !!f && (Object.keys(EMPTY_HEALTH) as (keyof HealthFields)[]).some((k) => !!f[k]);
}

/** Rhesus negative: the one blood-group fact a pregnancy needs to know. */
export function isRhesusNegative(bloodGroup: string | null | undefined): boolean {
  return !!bloodGroup && bloodGroup.endsWith("-");
}

/** Carries a sickle (S) or C gene — AS, AC, SS, SC. */
export function carriesVariant(genotype: string | null | undefined): boolean {
  return !!genotype && /[SC]/.test(genotype);
}

export type HealthHint = { key: string; title: string; body: string };

/**
 * The notes worth surfacing to the two of them, from what they have entered.
 * Plain, calm, and always ending at the midwife — this app tells you what to
 * ask, never what it means for you.
 */
export function healthHints(input: {
  mother: Pick<HealthFields, "bloodGroup" | "genotype"> | null;
  partner: Pick<HealthFields, "bloodGroup" | "genotype"> | null;
  /** Only while the mother is expecting or newly delivered does the rhesus note apply. */
  pregnancyRelevant: boolean;
}): HealthHint[] {
  const hints: HealthHint[] = [];
  if (input.pregnancyRelevant && isRhesusNegative(input.mother?.bloodGroup)) {
    hints.push({
      key: "rhesus",
      title: "Rhesus negative",
      body: "Make sure your midwife or doctor knows. You may be offered an anti-D injection during pregnancy and after the birth.",
    });
  }
  if (carriesVariant(input.mother?.genotype) && carriesVariant(input.partner?.genotype)) {
    hints.push({
      key: "genotype",
      title: "You both carry a sickle cell gene",
      body: `With ${input.mother!.genotype} and ${input.partner!.genotype}, a baby could inherit sickle cell disease or a related condition. Talk to your midwife or doctor about testing — it can be checked during pregnancy, and a newborn can be tested soon after birth.`,
    });
  }
  return hints;
}
