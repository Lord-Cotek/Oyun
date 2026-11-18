/**
 * A typical schedule of pregnancy checks, tests and vaccines — one complete
 * list, everything commonly offered somewhere in the world, so nobody has to
 * pick a country to find their clinic's tests. Some are offered almost
 * everywhere; some only in some places (malaria prevention where malaria is
 * common, vaccines and swabs where they are routine) and say so in their
 * note. Each family keeps their own list: mark a check done, mark it "not
 * doing this", add what their clinic does. A clinic's own schedule always
 * wins.
 *
 * Nothing here is advice. It is a list of what is usually offered and when,
 * so a family can see what is coming and ask about anything missing.
 *
 * `weeks` is the usual window in completed weeks of pregnancy; `afterBirth`
 * is weeks after the birth. `when` makes an item appear only on a condition:
 * a conditional the family switches on, or a fact from the health cards
 * (rhesus negative, both parents carrying a sickle cell gene).
 *
 * `retired` marks a key that has been folded into another item (the two
 * lists this used to be had overlaps). It is never offered again, but a row
 * already marked done under it is still shown, so no result is ever lost.
 * Keys are stored in the database: never rename one, retire it.
 */

export type Category = "BOOKING" | "BLOOD" | "SCAN" | "SCREEN" | "VACCINE" | "MEDICINE" | "SWAB" | "VISIT";

export type ScheduleItem = {
  key: string;
  title: string;
  category: Category;
  weeks?: [number, number];
  afterBirth?: [number, number];
  note?: string;
  /** Folded into this other item; kept only so old results still show. */
  retired?: string;
  /** Only shown when this conditional is on, or this fact is true. */
  when?: { condition?: string; fact?: "RH_NEGATIVE" | "BOTH_CARRIERS" };
  optional?: boolean;
};

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
  { key: "BLOOD_GROUP", title: "Blood group and rhesus (Rh)", category: "BOOKING", weeks: [8, 12] },
  { key: "ANTIBODY", title: "Antibody screen", category: "BOOKING", weeks: [8, 12] },
  { key: "FBC", title: "Full blood count (haemoglobin / PCV)", category: "BOOKING", weeks: [8, 14], note: "Checks for anaemia. Some clinics call it PCV or Hb." },
  { key: "PCV", title: "Packed cell volume (PCV) / haemoglobin", category: "BOOKING", weeks: [8, 14], retired: "FBC" },
  { key: "GENOTYPE", title: "Sickle cell and thalassaemia screening (Hb genotype)", category: "BOOKING", weeks: [8, 14], note: "Haemoglobin electrophoresis. Offered early, especially where these genes are common." },
  { key: "SICKLE_SCREEN", title: "Sickle cell and thalassaemia screening", category: "BOOKING", weeks: [8, 10], retired: "GENOTYPE" },
  { key: "RUBELLA", title: "Rubella immunity", category: "BOOKING", weeks: [8, 12] },
  { key: "HEP_B", title: "Hepatitis B", category: "BOOKING", weeks: [8, 14] },
  { key: "HIV", title: "HIV", category: "BOOKING", weeks: [8, 14] },
  { key: "SYPHILIS", title: "Syphilis", category: "BOOKING", weeks: [8, 14] },
  { key: "TSH", title: "Thyroid (TSH)", category: "BOOKING", weeks: [8, 12] },
  { key: "URINE_CULTURE", title: "Urine test (culture / urinalysis)", category: "BOOKING", weeks: [8, 14] },
  { key: "HEP_C", title: "Hepatitis C", category: "BOOKING", weeks: [8, 14], note: "Routine in some countries, offered on request in others.", optional: true },
  { key: "STI_SWAB", title: "Chlamydia and gonorrhoea", category: "BOOKING", weeks: [8, 14], note: "Routine in some countries.", optional: true },
  { key: "TOXO_CMV", title: "Toxoplasma and CMV", category: "BOOKING", weeks: [8, 14], note: "Offered at some clinics.", optional: true },
  { key: "VARICELLA", title: "Chickenpox (varicella) immunity", category: "BOOKING", weeks: [8, 14], note: "If you are not sure you have had it.", optional: true },
  { key: "VIT_D", title: "Vitamin D level", category: "BOOKING", weeks: [8, 14], note: "Often checked where many people are low in it, such as the Gulf.", optional: true },
  { key: "CERVICAL_SCREEN", title: "Cervical screening (smear) — if due", category: "BOOKING", weeks: [8, 14], note: "Only if you are due one; many clinics wait until after the birth.", optional: true },
  { key: "EARLY_GLUCOSE", title: "Early glucose test or HbA1c", category: "BOOKING", weeks: [8, 14], note: "If at higher risk of diabetes.", optional: true },

  // ── Scans and screening ───────────────────────────────────────────────
  { key: "DATING_SCAN", title: "Early / dating scan", category: "SCAN", weeks: [8, 14], note: "Confirms the dates; between 11 and 14 weeks it can include the nuchal translucency measurement." },
  { key: "FIRST_SCREEN", title: "First-trimester screening (combined test)", category: "SCREEN", weeks: [11, 14], note: "Your choice — offered where available.", optional: true },
  { key: "NIPT", title: "NIPT (cell-free DNA) — if chosen", category: "SCREEN", weeks: [10, 20], optional: true },
  { key: "EARLY_SCAN", title: "Early ultrasound scan", category: "SCAN", weeks: [8, 14], retired: "DATING_SCAN" },
  { key: "ANOMALY_SCAN", title: "Anomaly scan", category: "SCAN", weeks: [18, 22] },
  { key: "GROWTH_SCAN", title: "Growth scan — as advised", category: "SCAN", weeks: [28, 36], optional: true },

  // ── Mid and later pregnancy ───────────────────────────────────────────
  { key: "GTT", title: "Glucose tolerance test (GTT)", category: "BLOOD", weeks: [24, 28], note: "For gestational diabetes. Offered to everyone at some clinics, to those at higher risk at others." },
  { key: "GTT_NG", title: "Glucose test — if advised", category: "BLOOD", weeks: [24, 28], retired: "GTT" },
  { key: "FBC_28", title: "Full blood count again (haemoglobin / PCV, ferritin)", category: "BLOOD", weeks: [26, 30] },
  { key: "PCV_28", title: "PCV / haemoglobin again", category: "BLOOD", weeks: [26, 30], retired: "FBC_28" },
  { key: "ANTI_D", title: "Anti-D injection (you are rhesus negative)", category: "MEDICINE", weeks: [28, 30], note: "And again after the birth if the baby is rhesus positive.", when: { fact: "RH_NEGATIVE" } },
  { key: "GBS", title: "Group B strep swab", category: "SWAB", weeks: [35, 37], note: "Routine in some countries, offered if at risk in others." },
  { key: "BABY_GENOTYPE_TALK", title: "Talk about testing the baby's genotype", category: "SCREEN", weeks: [12, 20], note: "You both carry a sickle cell gene. Ask about testing in pregnancy and newborn screening.", when: { fact: "BOTH_CARRIERS" } },

  // ── Medicines given at the clinic ─────────────────────────────────────
  { key: "IPTP_1", title: "Malaria prevention (IPTp-SP), dose 1", category: "MEDICINE", weeks: [13, 16], note: "Where malaria is common. Given at the clinic from 13 weeks." },
  { key: "IPTP_2", title: "Malaria prevention (IPTp-SP), dose 2", category: "MEDICINE", weeks: [18, 24], note: "Where malaria is common. At least a month after the last dose." },
  { key: "IPTP_3", title: "Malaria prevention (IPTp-SP), dose 3", category: "MEDICINE", weeks: [26, 32], note: "Where malaria is common. At least a month after the last dose." },
  { key: "DEWORM", title: "Deworming — as advised", category: "MEDICINE", weeks: [14, 27], note: "Where it is routine.", optional: true },

  // ── Vaccines ──────────────────────────────────────────────────────────
  { key: "TD_1", title: "Tetanus-diphtheria (Td), dose 1", category: "VACCINE", weeks: [12, 20], note: "If not fully vaccinated before. Some clinics give whooping cough (Tdap) instead." },
  { key: "TD_2", title: "Tetanus-diphtheria (Td), dose 2", category: "VACCINE", weeks: [16, 28], note: "At least four weeks after dose 1." },
  { key: "TDAP", title: "Whooping cough (Tdap)", category: "VACCINE", weeks: [27, 36], note: "Protects the baby in the first weeks." },
  { key: "FLU", title: "Flu vaccine — in season", category: "VACCINE", weeks: [4, 40], note: "Any trimester, during flu season." },
  { key: "RSV", title: "RSV vaccine — where offered", category: "VACCINE", weeks: [32, 36], note: "Some places protect the baby with an injection after birth instead.", optional: true },

  // ── Conditionals the family switches on ───────────────────────────────
  { key: "CERVIX_LENGTH", title: "Cervical length check", category: "SCAN", weeks: [16, 24], when: { condition: "CERVIX" } },
  { key: "GDM_CLINIC", title: "Diabetes clinic / educator visit", category: "VISIT", weeks: [24, 40], when: { condition: "GDM" } },
  { key: "HTN_CHECKS", title: "Blood pressure monitoring plan", category: "VISIT", weeks: [12, 40], when: { condition: "HTN" } },
  { key: "FETAL_ECHO", title: "Fetal echocardiogram", category: "SCAN", weeks: [18, 24], when: { condition: "ECHO" } },
  { key: "EXTRA_GROWTH", title: "Extra growth scans", category: "SCAN", weeks: [28, 38], when: { condition: "GROWTH" } },

  // ── After the birth ───────────────────────────────────────────────────
  { key: "POSTNATAL", title: "Postnatal check", category: "VISIT", afterBirth: [6, 8] },
  { key: "PP_BP", title: "Blood pressure check after the birth", category: "VISIT", afterBirth: [0, 2], note: "Raised blood pressure can start after the birth too.", when: { condition: "HTN" } },
  { key: "PP_GLUCOSE", title: "Glucose test after gestational diabetes", category: "BLOOD", afterBirth: [6, 13], when: { condition: "GDM" } },
];
