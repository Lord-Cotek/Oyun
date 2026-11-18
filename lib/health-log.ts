/**
 * The health log — the rules, with no database in sight.
 *
 * Everything that decides what a reading means lives here: the units, the
 * time-of-day slots, the default targets, what is out of range, and the few
 * signs that cannot wait. Kept free of imports so the verify script can load
 * it on its own and check every rule (scripts/verify-health-log.mjs).
 *
 * ── What this never does ─────────────────────────────────────────────────
 * Diagnose. A reading is shown with its target and, if it is outside it, a
 * quiet flag and "discuss it with your doctor". The only stronger words are
 * for the signs every maternity service tells women to act on at once — and
 * those say who to contact, not what it is.
 */

export type ReadingKind = "GLUCOSE" | "BP" | "WEIGHT" | "MOVEMENTS" | "TEMP" | "SYMPTOMS" | "URINE";

export const KINDS: { kind: ReadingKind; label: string; short: string }[] = [
  { kind: "GLUCOSE", label: "Blood glucose", short: "Glucose" },
  { kind: "BP", label: "Blood pressure", short: "BP" },
  { kind: "WEIGHT", label: "Weight", short: "Weight" },
  { kind: "MOVEMENTS", label: "Baby's movements", short: "Movements" },
  { kind: "TEMP", label: "Temperature", short: "Temp" },
  { kind: "SYMPTOMS", label: "Symptoms", short: "Symptoms" },
  { kind: "URINE", label: "Urine dipstick", short: "Urine" },
];
export const isKind = (v: unknown): v is ReadingKind => KINDS.some((k) => k.kind === v);
export const kindLabel = (k: string) => KINDS.find((x) => x.kind === k)?.label ?? k;

export const GLUCOSE_SLOTS = [
  { slot: "FASTING", label: "Fasting" },
  { slot: "AFTER_BREAKFAST", label: "After breakfast" },
  { slot: "AFTER_LUNCH", label: "After lunch" },
  { slot: "AFTER_DINNER", label: "After dinner" },
  { slot: "BEDTIME", label: "Bedtime" },
  { slot: "OTHER", label: "Other" },
] as const;
export const BP_SLOTS = [
  { slot: "MORNING", label: "Morning" },
  { slot: "EVENING", label: "Evening" },
] as const;
export const slotLabel = (s: string | null | undefined) =>
  [...GLUCOSE_SLOTS, ...BP_SLOTS].find((x) => x.slot === s)?.label ?? "";

/**
 * The slot a reading most likely belongs to, from the hour it was taken in
 * the reader's own day. A guess to save a tap, always changeable.
 */
export function defaultSlot(kind: ReadingKind, hour: number): string | null {
  if (kind === "GLUCOSE") {
    if (hour >= 4 && hour < 9) return "FASTING";
    if (hour >= 9 && hour < 12) return "AFTER_BREAKFAST";
    if (hour >= 12 && hour < 17) return "AFTER_LUNCH";
    if (hour >= 17 && hour < 22) return "AFTER_DINNER";
    return "BEDTIME";
  }
  if (kind === "BP") return hour < 14 ? "MORNING" : "EVENING";
  return null;
}

export type SymptomKey =
  | "HEADACHE"
  | "VISION"
  | "SWELLING"
  | "UPPER_BELLY_PAIN"
  | "TIGHTENING"
  | "REGULAR_CONTRACTIONS"
  | "PELVIC_PRESSURE"
  | "FLUID_LEAK"
  | "BLEEDING"
  | "REDUCED_MOVEMENTS"
  | "BURNING_URINE"
  | "DISCHARGE"
  | "NAUSEA"
  | "OTHER";

/**
 * The symptoms, and which of them are the signs to act on now.
 *
 * `urgent: "always"` — every maternity service says contact them at once.
 * `urgent: "severe"` — only when marked severe (a headache that will not go,
 * pain under the ribs). Regular contractions and tightening are kept apart
 * because the first means "call the unit" and the second usually does not.
 */
export const SYMPTOMS: { key: SymptomKey; label: string; urgent?: "always" | "severe"; withHighBp?: boolean }[] = [
  { key: "HEADACHE", label: "Headache", urgent: "severe", withHighBp: true },
  { key: "VISION", label: "Vision changes (blurring, flashing lights)", urgent: "always", withHighBp: true },
  { key: "SWELLING", label: "Swelling of face or hands", withHighBp: true },
  { key: "UPPER_BELLY_PAIN", label: "Pain under the ribs / upper belly", urgent: "severe", withHighBp: true },
  { key: "TIGHTENING", label: "Tightening (now and then)" },
  { key: "REGULAR_CONTRACTIONS", label: "Regular contractions", urgent: "always" },
  { key: "PELVIC_PRESSURE", label: "Pelvic pressure" },
  { key: "FLUID_LEAK", label: "Fluid leaking", urgent: "always" },
  { key: "BLEEDING", label: "Bleeding", urgent: "always" },
  { key: "REDUCED_MOVEMENTS", label: "Baby moving less than usual", urgent: "always" },
  { key: "BURNING_URINE", label: "Burning when passing urine" },
  { key: "DISCHARGE", label: "Unusual discharge" },
  { key: "NAUSEA", label: "Nausea or vomiting" },
  { key: "OTHER", label: "Something else" },
];
export const SEVERITIES = ["MILD", "MODERATE", "SEVERE"] as const;
export type Severity = (typeof SEVERITIES)[number];
export const symptomLabel = (k: string) => SYMPTOMS.find((s) => s.key === k)?.label ?? k;

export const DIPSTICK = ["NEG", "TRACE", "1+", "2+", "3+"] as const;
export type Dip = (typeof DIPSTICK)[number];
const dipRank = (d: unknown) => DIPSTICK.indexOf(d as Dip);

/* ── Units ─────────────────────────────────────────────────────────────── */

export const MGDL_PER_MMOL = 18.016;
export const toMmol = (mgdl: number) => mgdl / MGDL_PER_MMOL;
export const fromMmol = (mmol: number) => mmol * MGDL_PER_MMOL;
export const toLb = (kg: number) => kg * 2.20462;
export const fromLb = (lb: number) => lb / 2.20462;
export const toF = (c: number) => (c * 9) / 5 + 32;
export const fromF = (f: number) => ((f - 32) * 5) / 9;

export type Units = { glucose: "MGDL" | "MMOL"; weight: "KG" | "LB"; temp: "C" | "F" };
export const DEFAULT_UNITS: Units = { glucose: "MGDL", weight: "KG", temp: "C" };
export function cleanUnits(v: { glucoseUnit?: string; weightUnit?: string; tempUnit?: string } | null | undefined): Units {
  return {
    glucose: v?.glucoseUnit === "MMOL" ? "MMOL" : "MGDL",
    weight: v?.weightUnit === "LB" ? "LB" : "KG",
    temp: v?.tempUnit === "F" ? "F" : "C",
  };
}

const r1 = (n: number) => Math.round(n * 10) / 10;
/** Glucose as the family reads it, with the other unit beside it. */
export function showGlucose(mgdl: number, u: Units): { main: string; other: string } {
  const mg = `${Math.round(mgdl)} mg/dL`;
  const mm = `${r1(toMmol(mgdl)).toFixed(1)} mmol/L`;
  return u.glucose === "MMOL" ? { main: mm, other: mg } : { main: mg, other: mm };
}
export const showWeight = (kg: number, u: Units) => (u.weight === "LB" ? `${r1(toLb(kg))} lb` : `${r1(kg)} kg`);
export const showTemp = (c: number, u: Units) => (u.temp === "F" ? `${r1(toF(c)).toFixed(1)} °F` : `${r1(c).toFixed(1)} °C`);

/* ── Targets ───────────────────────────────────────────────────────────── */

/**
 * Common defaults — and only that. Every screen that shows one says
 * "default — replace with your doctor's numbers" until the family has.
 * Glucose in mg/dL, blood pressure in mmHg. A value is in range when it is
 * strictly below its "max" (these are "under …" targets) and at or above
 * its "low".
 */
export const DEFAULT_TARGETS = {
  glucoseFastingMax: 95,
  glucose1hMax: 140,
  glucose2hMax: 120,
  glucoseLow: 70,
  bpSysMax: 140,
  bpDiaMax: 90,
} as const;
export type Targets = { -readonly [K in keyof typeof DEFAULT_TARGETS]: number };
export type TargetKey = keyof Targets;

export const TARGET_LABEL: Record<TargetKey, string> = {
  glucoseFastingMax: "Fasting glucose under",
  glucose1hMax: "1 hour after a meal under",
  glucose2hMax: "2 hours after a meal under",
  glucoseLow: "Glucose not below",
  bpSysMax: "Systolic (top number) under",
  bpDiaMax: "Diastolic (bottom number) under",
};
const TARGET_RANGE: Record<TargetKey, [number, number]> = {
  glucoseFastingMax: [60, 200],
  glucose1hMax: [80, 300],
  glucose2hMax: [80, 300],
  glucoseLow: [40, 110],
  bpSysMax: [90, 200],
  bpDiaMax: [50, 130],
};

/** Saved targets, read back safely: anything missing or absurd is the default. */
export function readTargets(saved: unknown): { targets: Targets; custom: Set<TargetKey> } {
  const t = { ...DEFAULT_TARGETS } as Targets;
  const custom = new Set<TargetKey>();
  if (saved && typeof saved === "object") {
    for (const k of Object.keys(DEFAULT_TARGETS) as TargetKey[]) {
      const v = Number((saved as Record<string, unknown>)[k]);
      const [lo, hi] = TARGET_RANGE[k];
      if (Number.isFinite(v) && v >= lo && v <= hi) {
        t[k] = Math.round(v);
        if (t[k] !== DEFAULT_TARGETS[k]) custom.add(k);
      }
    }
  }
  return { targets: t, custom };
}

/** The glucose target a reading is measured against, if it has one. */
export function glucoseMax(slot: string | null | undefined, minutesAfter: number | null | undefined, t: Targets): number | null {
  if (slot === "FASTING") return t.glucoseFastingMax;
  if (slot === "AFTER_BREAKFAST" || slot === "AFTER_LUNCH" || slot === "AFTER_DINNER") {
    if (minutesAfter === 120) return t.glucose2hMax;
    return t.glucose1hMax; // 60, or not said: the gentler of the two
  }
  return null;
}

/* ── Reading in, checked ───────────────────────────────────────────────── */

export type CleanReading = {
  kind: ReadingKind;
  takenAt: Date;
  slot: string | null;
  valueA: number | null;
  valueB: number | null;
  valueC: number | null;
  detail: Record<string, unknown> | null;
  note: string | null;
};

const num = (v: unknown): number | null => {
  if (v === null || v === undefined || v === "") return null;
  const n = typeof v === "number" ? v : Number(String(v).replace(",", "."));
  return Number.isFinite(n) ? n : null;
};
const inRange = (n: number | null, lo: number, hi: number) => n !== null && n >= lo && n <= hi;
const text = (v: unknown, max: number) => {
  const s = typeof v === "string" ? v.trim() : "";
  return s ? s.slice(0, max) : null;
};

/**
 * A reading as typed, in the family's own units, made safe and converted to
 * the stored ones. Refuses — with words a tired person can act on — rather
 * than storing a number that cannot be right.
 */
export function cleanReading(raw: Record<string, unknown>, units: Units, now = new Date()): { ok: true; data: CleanReading } | { ok: false; error: string } {
  const kind = raw.kind;
  if (!isKind(kind)) return { ok: false, error: "Choose what you are recording." };
  const at = new Date(String(raw.takenAt ?? ""));
  if (Number.isNaN(at.getTime())) return { ok: false, error: "When was it taken?" };
  if (at.getTime() > now.getTime() + 10 * 60_000) return { ok: false, error: "That time is in the future." };
  if (at.getTime() < now.getTime() - 400 * 86_400_000) return { ok: false, error: "That is more than a year ago." };
  const note = text(raw.note, 1000);
  const base = { kind, takenAt: at, note, slot: null, valueA: null, valueB: null, valueC: null, detail: null } as CleanReading;

  switch (kind) {
    case "GLUCOSE": {
      let v = num(raw.a);
      if (v !== null && units.glucose === "MMOL") v = fromMmol(v);
      if (!inRange(v, 20, 600)) return { ok: false, error: units.glucose === "MMOL" ? "Glucose should be between 1.1 and 33.3 mmol/L." : "Glucose should be between 20 and 600 mg/dL." };
      const slot = GLUCOSE_SLOTS.some((s) => s.slot === raw.slot) ? String(raw.slot) : "OTHER";
      const after = num(raw.b);
      const minutes = slot.startsWith("AFTER_") && (after === 60 || after === 120) ? after : null;
      const food = text((raw.detail as Record<string, unknown> | undefined)?.food, 200);
      return { ok: true, data: { ...base, slot, valueA: Math.round(v! * 10) / 10, valueB: minutes, detail: food ? { food } : null } };
    }
    case "BP": {
      const sys = num(raw.a), dia = num(raw.b), pulse = num(raw.c);
      if (!inRange(sys, 60, 260) || !inRange(dia, 30, 160)) return { ok: false, error: "Enter both numbers — the top (60–260) and the bottom (30–160)." };
      if (dia! >= sys!) return { ok: false, error: "The top number should be bigger than the bottom one." };
      if (pulse !== null && !inRange(pulse, 30, 220)) return { ok: false, error: "Pulse should be between 30 and 220." };
      const slot = BP_SLOTS.some((s) => s.slot === raw.slot) ? String(raw.slot) : "MORNING";
      const arm = (raw.detail as Record<string, unknown> | undefined)?.arm;
      return { ok: true, data: { ...base, slot, valueA: Math.round(sys!), valueB: Math.round(dia!), valueC: pulse === null ? null : Math.round(pulse), detail: arm === "LEFT" || arm === "RIGHT" ? { arm } : null } };
    }
    case "WEIGHT": {
      let v = num(raw.a);
      if (v !== null && units.weight === "LB") v = fromLb(v);
      if (!inRange(v, 25, 250)) return { ok: false, error: units.weight === "LB" ? "Weight should be between 55 and 550 lb." : "Weight should be between 25 and 250 kg." };
      return { ok: true, data: { ...base, valueA: Math.round(v! * 10) / 10 } };
    }
    case "TEMP": {
      let v = num(raw.a);
      if (v !== null && units.temp === "F") v = fromF(v);
      if (!inRange(v, 33, 43)) return { ok: false, error: units.temp === "F" ? "Temperature should be between 91 and 109 °F." : "Temperature should be between 33 and 43 °C." };
      return { ok: true, data: { ...base, valueA: Math.round(v! * 10) / 10 } };
    }
    case "MOVEMENTS": {
      const count = num(raw.a), minutes = num(raw.b);
      if (count !== null && !inRange(count, 0, 500)) return { ok: false, error: "That count does not look right." };
      if (minutes !== null && !inRange(minutes, 0, 720)) return { ok: false, error: "Minutes should be under 12 hours." };
      const fewer = (raw.detail as Record<string, unknown> | undefined)?.fewer === true;
      if (count === null && !fewer && !note) return { ok: false, error: "Add a count, a note, or tick “fewer than usual”." };
      return { ok: true, data: { ...base, valueA: count === null ? null : Math.round(count), valueB: minutes === null ? null : Math.round(minutes), detail: fewer ? { fewer: true } : null } };
    }
    case "SYMPTOMS": {
      const d = (raw.detail as Record<string, unknown> | undefined) ?? {};
      const list = Array.isArray(d.list) ? [...new Set(d.list.filter((k) => SYMPTOMS.some((s) => s.key === k)))].slice(0, 14) : [];
      if (list.length === 0) return { ok: false, error: "Tick at least one symptom." };
      const severity = SEVERITIES.includes(d.severity as Severity) ? (d.severity as Severity) : "MILD";
      return { ok: true, data: { ...base, detail: { list, severity } } };
    }
    case "URINE": {
      const d = (raw.detail as Record<string, unknown> | undefined) ?? {};
      const pick = (v: unknown) => (DIPSTICK.includes(v as Dip) ? (v as Dip) : undefined);
      const out = { protein: pick(d.protein), glucose: pick(d.glucose), ketones: pick(d.ketones) };
      if (!out.protein && !out.glucose && !out.ketones) return { ok: false, error: "Choose at least one result." };
      return { ok: true, data: { ...base, detail: Object.fromEntries(Object.entries(out).filter(([, v]) => v)) } };
    }
  }
}

/* ── What a reading means ──────────────────────────────────────────────── */

export type Level = "ok" | "high" | "low" | "urgent" | "none";
export type Verdict = { level: Level; reasons: string[] };

export type ReadingLike = {
  kind: string;
  slot: string | null;
  valueA: number | null;
  valueB: number | null;
  valueC: number | null;
  detail: unknown;
};

/** What else happened that day, for the signs that only matter together. */
export type DayContext = {
  /** Symptoms recorded the same day. */
  symptoms: SymptomKey[];
  /** A blood pressure at or over the target the same day. */
  bpHigh: boolean;
  /** Protein 2+ or more on a dipstick the same day. */
  proteinHigh: boolean;
};
export const NO_CONTEXT: DayContext = { symptoms: [], bpHigh: false, proteinHigh: false };

export const URGENT_TITLE = "Contact your maternity unit or go to hospital now.";
export const URGENT_BODY =
  "If you cannot reach them, call your local emergency number. This is not a diagnosis — it is one of the signs every maternity service asks women to act on straight away.";

/**
 * Flag one reading against the targets. `none` means there is nothing to
 * measure it against (a weight, a bedtime glucose), not that it is fine.
 */
export function evaluate(r: ReadingLike, t: Targets, ctx: DayContext = NO_CONTEXT): Verdict {
  const d = (r.detail ?? {}) as Record<string, unknown>;
  switch (r.kind) {
    case "BP": {
      const sys = r.valueA ?? 0, dia = r.valueB ?? 0;
      if (sys >= 160 || dia >= 110) return { level: "urgent", reasons: [`Blood pressure of 160/110 or higher (${sys}/${dia}).`] };
      const high = sys >= t.bpSysMax || dia >= t.bpDiaMax;
      if (high) {
        const signs = ctx.symptoms.filter((k) => SYMPTOMS.find((s) => s.key === k)?.withHighBp);
        if (signs.length || ctx.proteinHigh) {
          return {
            level: "urgent",
            reasons: [
              `Raised blood pressure (${sys}/${dia}) together with ${
                signs.length ? signs.map((k) => symptomLabel(k).toLowerCase()).join(", ") : "protein in the urine"
              } the same day.`,
            ],
          };
        }
        return { level: "high", reasons: [`Above your target of under ${t.bpSysMax}/${t.bpDiaMax}.`] };
      }
      return { level: "ok", reasons: [] };
    }
    case "GLUCOSE": {
      const v = r.valueA ?? 0;
      if (v < 54) return { level: "urgent", reasons: ["Very low glucose (under 54 mg/dL). Treat it as you were taught and get help now."] };
      if (v < t.glucoseLow) return { level: "low", reasons: [`Below ${t.glucoseLow} mg/dL. If you take insulin or feel unwell, treat it as you were taught and tell your doctor.`] };
      const max = glucoseMax(r.slot, r.valueB, t);
      if (max === null) return { level: "none", reasons: [] };
      return v >= max ? { level: "high", reasons: [`Above your target of under ${max} mg/dL.`] } : { level: "ok", reasons: [] };
    }
    case "TEMP": {
      const c = r.valueA ?? 0;
      if (c >= 38) return { level: "urgent", reasons: [`A temperature of 38 °C (100.4 °F) or more (${c.toFixed(1)} °C).`] };
      return { level: "none", reasons: [] };
    }
    case "MOVEMENTS":
      return d.fewer === true ? { level: "urgent", reasons: ["Baby moving less than usual."] } : { level: "none", reasons: [] };
    case "SYMPTOMS": {
      const list = (Array.isArray(d.list) ? d.list : []) as SymptomKey[];
      const severe = d.severity === "SEVERE";
      const now = list.filter((k) => {
        const s = SYMPTOMS.find((x) => x.key === k);
        return s?.urgent === "always" || (s?.urgent === "severe" && severe);
      });
      if (now.length) return { level: "urgent", reasons: now.map((k) => `${symptomLabel(k)}${SYMPTOMS.find((s) => s.key === k)?.urgent === "severe" ? " (severe)" : ""}.`) };
      const withBp = ctx.bpHigh ? list.filter((k) => SYMPTOMS.find((s) => s.key === k)?.withHighBp) : [];
      if (withBp.length) return { level: "urgent", reasons: [`${withBp.map(symptomLabel).join(", ")} on a day of raised blood pressure.`] };
      return { level: "none", reasons: [] };
    }
    case "URINE": {
      if (dipRank(d.protein) >= 3) {
        if (ctx.bpHigh) return { level: "urgent", reasons: ["Protein in the urine on a day of raised blood pressure."] };
        return { level: "high", reasons: ["Protein 2+ or more."] };
      }
      if (dipRank(d.ketones) >= 3 || dipRank(d.glucose) >= 3) return { level: "high", reasons: ["2+ or more on the dipstick."] };
      return { level: "none", reasons: [] };
    }
    default:
      return { level: "none", reasons: [] };
  }
}

/** Build each day's context from that day's readings (pass one day's worth). */
export function dayContext(rows: ReadingLike[], t: Targets): DayContext {
  const symptoms: SymptomKey[] = [];
  let bpHigh = false, proteinHigh = false;
  for (const r of rows) {
    const d = (r.detail ?? {}) as Record<string, unknown>;
    if (r.kind === "SYMPTOMS" && Array.isArray(d.list)) symptoms.push(...(d.list as SymptomKey[]));
    if (r.kind === "BP" && ((r.valueA ?? 0) >= t.bpSysMax || (r.valueB ?? 0) >= t.bpDiaMax)) bpHigh = true;
    if (r.kind === "URINE" && dipRank(d.protein) >= 3) proteinHigh = true;
  }
  return { symptoms, bpHigh, proteinHigh };
}

/** "yyyy-mm-dd" of an instant in a time zone — how readings are grouped into days. */
export function dayIn(at: Date, timeZone: string): string {
  try {
    return new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).format(at);
  } catch {
    return at.toISOString().slice(0, 10);
  }
}

/**
 * Completed weeks and days of pregnancy at an instant, from the due date —
 * the same sum as computePosition in lib/stage.ts, so the log and the
 * journey page never disagree about which day of which week it is.
 */
export function gestationOn(dueDate: Date, on: Date): { week: number; day: number } | null {
  const ga = Math.round(280 - (dueDate.getTime() - on.getTime()) / 86_400_000);
  if (ga < 0 || ga > 300) return null;
  return { week: Math.floor(ga / 7), day: ga % 7 };
}
