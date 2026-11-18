/**
 * A typical schedule of pregnancy checks, tests and vaccines — two of them.
 *
 * "INTL" follows the common international pattern (WHO, NICE, ACOG — what
 * most clinics in the Gulf, Europe and North America offer). "NG" follows
 * routine antenatal care in Nigeria: genotype at booking, PCV, tetanus (Td),
 * malaria prevention (IPTp-SP) and deworming, without the vaccines and swabs
 * that are not routine there. Every family can add, edit or hide anything,
 * and the screen says so: a clinic's own schedule always wins.
 *
 * Nothing here is advice. It is a list of what is usually offered and when,
 * so a family can see what is coming and ask about anything missing.
 *
 * `weeks` is the usual window in completed weeks of pregnancy; `afterBirth`
 * is weeks after the birth. `when` makes an item appear only on a condition:
 * a conditional the family switches on, or a fact from the health cards
 * (rhesus negative, both parents carrying a sickle cell gene).
 */

export type Template = "INTL" | "NG";
export type Category = "BOOKING" | "BLOOD" | "SCAN" | "SCREEN" | "VACCINE" | "MEDICINE" | "SWAB" | "VISIT";

export type ScheduleItem = {
  key: string;
  title: string;
  category: Category;
  weeks?: [number, number];
  afterBirth?: [number, number];
  note?: string;
  templates: Template[];
  /** Only shown when this conditional is on, or this fact is true. */
  when?: { condition?: string; fact?: "RH_NEGATIVE" | "BOTH_CARRIERS" };
  optional?: boolean;
};

const BOTH: Template[] = ["INTL", "NG"];

export const CONDITIONALS: { key: string; label: string; note: string }[] = [
  { key: "CERVIX", label: "Cervical length checks", note: "If you have had a previous early birth or cervical treatment." },
  { key: "GDM", label: "Gestational diabetes follow-up", note: "Diabetes clinic and educator visits, and a glucose test after the birth." },
  { key: "HTN", label: "Blood pressure monitoring", note: "For raised blood pressure before or during pregnancy." },
  { key: "ECHO", label: "Fetal echocardiogram", note: "A detailed scan of the baby's heart, when advised." },
  { key: "GROWTH", label: "Extra growth scans", note: "Serial scans of the baby's growth, when advised." },
];

export const EVERY_VISIT = "At every visit: blood pressure, urine (protein) and usually weight.";

export const SCHEDULE: ScheduleItem[] = [
  // ── Booking (first visit) ─────────────────────────────────────────────
  { key: "BLOOD_GROUP", title: "Blood group and rhesus (Rh)", category: "BOOKING", weeks: [8, 12], templates: BOTH },
  { key: "ANTIBODY", title: "Antibody screen", category: "BOOKING", weeks: [8, 12], templates: ["INTL"] },
  { key: "FBC", title: "Full blood count", category: "BOOKING", weeks: [8, 12], templates: ["INTL"] },
  { key: "PCV", title: "Packed cell volume (PCV) / haemoglobin", category: "BOOKING", weeks: [8, 14], templates: ["NG"] },
  { key: "GENOTYPE", title: "Haemoglobin genotype (electrophoresis)", category: "BOOKING", weeks: [8, 14], templates: ["NG"] },
  { key: "SICKLE_SCREEN", title: "Sickle cell and thalassaemia screening", category: "BOOKING", weeks: [8, 10], note: "Offered early where available.", templates: ["INTL"], optional: true },
  { key: "RUBELLA", title: "Rubella immunity", category: "BOOKING", weeks: [8, 12], templates: ["INTL"] },
  { key: "HEP_B", title: "Hepatitis B", category: "BOOKING", weeks: [8, 14], templates: BOTH },
  { key: "HIV", title: "HIV", category: "BOOKING", weeks: [8, 14], templates: BOTH },
  { key: "SYPHILIS", title: "Syphilis", category: "BOOKING", weeks: [8, 14], templates: BOTH },
  { key: "TSH", title: "Thyroid (TSH)", category: "BOOKING", weeks: [8, 12], templates: ["INTL"] },
  { key: "URINE_CULTURE", title: "Urine test (culture / urinalysis)", category: "BOOKING", weeks: [8, 14], templates: BOTH },
  { key: "EARLY_GLUCOSE", title: "Early glucose test or HbA1c", category: "BOOKING", weeks: [8, 14], note: "If at higher risk of diabetes.", templates: BOTH, optional: true },

  // ── Scans and screening ───────────────────────────────────────────────
  { key: "DATING_SCAN", title: "Dating scan (and nuchal translucency)", category: "SCAN", weeks: [11, 14], templates: ["INTL"] },
  { key: "FIRST_SCREEN", title: "First-trimester screening", category: "SCREEN", weeks: [11, 14], templates: ["INTL"] },
  { key: "NIPT", title: "NIPT (cell-free DNA) — if chosen", category: "SCREEN", weeks: [10, 20], templates: ["INTL"], optional: true },
  { key: "EARLY_SCAN", title: "Early ultrasound scan", category: "SCAN", weeks: [8, 14], templates: ["NG"] },
  { key: "ANOMALY_SCAN", title: "Anomaly scan", category: "SCAN", weeks: [18, 22], templates: BOTH },
  { key: "GROWTH_SCAN", title: "Growth scan — as advised", category: "SCAN", weeks: [28, 36], templates: BOTH, optional: true },

  // ── Mid and later pregnancy ───────────────────────────────────────────
  { key: "GTT", title: "Glucose tolerance test (GTT)", category: "BLOOD", weeks: [24, 28], templates: ["INTL"] },
  { key: "GTT_NG", title: "Glucose test — if advised", category: "BLOOD", weeks: [24, 28], templates: ["NG"], optional: true },
  { key: "FBC_28", title: "Full blood count and ferritin", category: "BLOOD", weeks: [27, 29], templates: ["INTL"] },
  { key: "PCV_28", title: "PCV / haemoglobin again", category: "BLOOD", weeks: [26, 30], templates: ["NG"] },
  { key: "ANTI_D", title: "Anti-D injection (you are rhesus negative)", category: "MEDICINE", weeks: [28, 30], note: "And again after the birth if the baby is rhesus positive.", templates: BOTH, when: { fact: "RH_NEGATIVE" } },
  { key: "GBS", title: "Group B strep swab", category: "SWAB", weeks: [35, 37], templates: ["INTL"] },
  { key: "BABY_GENOTYPE_TALK", title: "Talk about testing the baby's genotype", category: "SCREEN", weeks: [12, 20], note: "You both carry a sickle cell gene. Ask about testing in pregnancy and newborn screening.", templates: BOTH, when: { fact: "BOTH_CARRIERS" } },

  // ── Medicines given at clinic (Nigeria) ───────────────────────────────
  { key: "IPTP_1", title: "Malaria prevention (IPTp-SP), dose 1", category: "MEDICINE", weeks: [13, 16], note: "Given at the clinic from 13 weeks.", templates: ["NG"] },
  { key: "IPTP_2", title: "Malaria prevention (IPTp-SP), dose 2", category: "MEDICINE", weeks: [18, 24], note: "At least a month after the last dose.", templates: ["NG"] },
  { key: "IPTP_3", title: "Malaria prevention (IPTp-SP), dose 3", category: "MEDICINE", weeks: [26, 32], note: "At least a month after the last dose.", templates: ["NG"] },
  { key: "DEWORM", title: "Deworming — as advised", category: "MEDICINE", weeks: [14, 27], templates: ["NG"], optional: true },

  // ── Vaccines ──────────────────────────────────────────────────────────
  { key: "TD_1", title: "Tetanus-diphtheria (Td), dose 1", category: "VACCINE", weeks: [12, 20], note: "If not fully vaccinated before.", templates: ["NG"] },
  { key: "TD_2", title: "Tetanus-diphtheria (Td), dose 2", category: "VACCINE", weeks: [16, 28], note: "At least four weeks after dose 1.", templates: ["NG"] },
  { key: "TDAP", title: "Whooping cough (Tdap)", category: "VACCINE", weeks: [27, 36], templates: ["INTL"] },
  { key: "FLU", title: "Flu vaccine — in season", category: "VACCINE", weeks: [4, 40], note: "Any trimester, during flu season.", templates: ["INTL"] },
  { key: "RSV", title: "RSV vaccine — where offered", category: "VACCINE", weeks: [32, 36], templates: ["INTL"], optional: true },

  // ── Conditionals the family switches on ───────────────────────────────
  { key: "CERVIX_LENGTH", title: "Cervical length check", category: "SCAN", weeks: [16, 24], templates: BOTH, when: { condition: "CERVIX" } },
  { key: "GDM_CLINIC", title: "Diabetes clinic / educator visit", category: "VISIT", weeks: [24, 40], templates: BOTH, when: { condition: "GDM" } },
  { key: "HTN_CHECKS", title: "Blood pressure monitoring plan", category: "VISIT", weeks: [12, 40], templates: BOTH, when: { condition: "HTN" } },
  { key: "FETAL_ECHO", title: "Fetal echocardiogram", category: "SCAN", weeks: [18, 24], templates: BOTH, when: { condition: "ECHO" } },
  { key: "EXTRA_GROWTH", title: "Extra growth scans", category: "SCAN", weeks: [28, 38], templates: BOTH, when: { condition: "GROWTH" } },

  // ── After the birth ───────────────────────────────────────────────────
  { key: "POSTNATAL", title: "Postnatal check", category: "VISIT", afterBirth: [6, 8], templates: BOTH },
  { key: "PP_BP", title: "Blood pressure check after the birth", category: "VISIT", afterBirth: [0, 2], note: "Raised blood pressure can start after the birth too.", templates: BOTH, when: { condition: "HTN" } },
  { key: "PP_GLUCOSE", title: "Glucose test after gestational diabetes", category: "BLOOD", afterBirth: [6, 13], templates: BOTH, when: { condition: "GDM" } },
];
