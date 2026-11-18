/**
 * The health log's rules, checked on every deploy.
 *
 * ── Why a script ─────────────────────────────────────────────────────────
 * Because the cost of getting one of these wrong is not a broken page. A
 * blood pressure of 162/104 that reads as "a little high" instead of
 * "contact your maternity unit now" is the whole reason the log exists, and
 * it is exactly the kind of thing a tidy-up of the targets could break in
 * passing. So each rule that matters is written down here as a case, and
 * the build stops if any of them changes.
 *
 * Run with `npm run verify:health`.
 */
import createJiti from "jiti";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const jiti = createJiti(import.meta.url, { alias: { "@": root }, interopDefault: true });
const L = jiti(path.join(root, "lib/health-log.ts"));

let failed = 0;
const check = (ok, what) => {
  if (!ok) failed++;
  console.log(`  ${ok ? "ok  " : "FAIL"} ${what}`);
};
const T = L.readTargets(null).targets;
const ev = (r, ctx) => L.evaluate({ slot: null, valueA: null, valueB: null, valueC: null, detail: null, ...r }, T, ctx);
const MG = L.DEFAULT_UNITS;

console.log("Targets");
check(T.glucoseFastingMax === 95 && T.glucose1hMax === 140 && T.glucose2hMax === 120 && T.bpSysMax === 140 && T.bpDiaMax === 90, "defaults are 95 / 140 / 120 and 140/90");
const own = L.readTargets({ glucoseFastingMax: 90, bpSysMax: 9999, glucose1hMax: "abc" });
check(own.targets.glucoseFastingMax === 90 && own.custom.has("glucoseFastingMax"), "a doctor's own target is used and marked as theirs");
check(own.targets.bpSysMax === 140 && own.targets.glucose1hMax === 140, "an absurd or broken target falls back to the default");

console.log("Blood pressure");
check(ev({ kind: "BP", valueA: 118, valueB: 76 }).level === "ok", "118/76 is in range");
check(ev({ kind: "BP", valueA: 140, valueB: 85 }).level === "high", "140/85 is flagged (target is under 140)");
check(ev({ kind: "BP", valueA: 135, valueB: 90 }).level === "high", "135/90 is flagged on the bottom number");
check(ev({ kind: "BP", valueA: 160, valueB: 95 }).level === "urgent", "160 systolic is urgent");
check(ev({ kind: "BP", valueA: 150, valueB: 110 }).level === "urgent", "110 diastolic is urgent");
check(ev({ kind: "BP", valueA: 145, valueB: 92 }, { ...L.NO_CONTEXT, symptoms: ["HEADACHE"] }).level === "urgent", "raised BP with a headache the same day is urgent");
check(ev({ kind: "BP", valueA: 145, valueB: 92 }, { ...L.NO_CONTEXT, proteinHigh: true }).level === "urgent", "raised BP with protein in the urine is urgent");
check(ev({ kind: "BP", valueA: 125, valueB: 80 }, { ...L.NO_CONTEXT, symptoms: ["HEADACHE"] }).level === "ok", "a headache alone does not make a normal BP urgent");

console.log("Glucose");
check(ev({ kind: "GLUCOSE", slot: "FASTING", valueA: 90 }).level === "ok", "fasting 90 is in range");
check(ev({ kind: "GLUCOSE", slot: "FASTING", valueA: 95 }).level === "high", "fasting 95 is flagged (target is under 95)");
check(ev({ kind: "GLUCOSE", slot: "AFTER_LUNCH", valueA: 130, valueB: 60 }).level === "ok", "1 hour after lunch 130 is in range");
check(ev({ kind: "GLUCOSE", slot: "AFTER_LUNCH", valueA: 130, valueB: 120 }).level === "high", "2 hours after lunch 130 is flagged");
check(ev({ kind: "GLUCOSE", slot: "BEDTIME", valueA: 130 }).level === "none", "bedtime has no target, so no flag");
check(ev({ kind: "GLUCOSE", slot: "FASTING", valueA: 65 }).level === "low", "65 is flagged low");
check(ev({ kind: "GLUCOSE", slot: "FASTING", valueA: 50 }).level === "urgent", "50 is urgent");

console.log("Signs that cannot wait");
for (const k of ["BLEEDING", "FLUID_LEAK", "REGULAR_CONTRACTIONS", "REDUCED_MOVEMENTS", "VISION"]) {
  check(ev({ kind: "SYMPTOMS", detail: { list: [k], severity: "MILD" } }).level === "urgent", `${k.toLowerCase()} is urgent even when mild`);
}
check(ev({ kind: "SYMPTOMS", detail: { list: ["HEADACHE"], severity: "MILD" } }).level === "none", "a mild headache alone is not urgent");
check(ev({ kind: "SYMPTOMS", detail: { list: ["HEADACHE"], severity: "SEVERE" } }).level === "urgent", "a severe headache is urgent");
check(ev({ kind: "SYMPTOMS", detail: { list: ["TIGHTENING"], severity: "MODERATE" } }).level === "none", "occasional tightening is not urgent");
check(ev({ kind: "SYMPTOMS", detail: { list: ["SWELLING"], severity: "MILD" } }, { ...L.NO_CONTEXT, bpHigh: true }).level === "urgent", "face/hand swelling on a raised-BP day is urgent");
check(ev({ kind: "MOVEMENTS", detail: { fewer: true } }).level === "urgent", "fewer movements than usual is urgent");
check(ev({ kind: "MOVEMENTS", valueA: 10 }).level === "none", "a movement count is never judged against a number");
check(ev({ kind: "TEMP", valueA: 38.2 }).level === "urgent", "38.2 °C is urgent");
check(ev({ kind: "TEMP", valueA: 37.4 }).level === "none", "37.4 °C is not flagged");
check(ev({ kind: "URINE", detail: { protein: "2+" } }).level === "high", "protein 2+ is flagged");
check(ev({ kind: "URINE", detail: { protein: "1+" } }).level === "none", "protein 1+ alone is not");

console.log("Entering a reading");
const now = new Date("2026-11-18T10:00:00Z");
const ok = (raw, u = MG) => L.cleanReading(raw, u, now);
const g = ok({ kind: "GLUCOSE", takenAt: "2026-11-18T07:00:00Z", slot: "FASTING", a: "5.2" }, { ...MG, glucose: "MMOL" });
check(g.ok && Math.abs(g.data.valueA - 93.7) < 0.2, "mmol/L is stored as mg/dL (5.2 → 93.7)");
check(!ok({ kind: "GLUCOSE", takenAt: "2026-11-18T07:00:00Z", slot: "FASTING", a: "900" }).ok, "an impossible glucose is refused");
check(!ok({ kind: "BP", takenAt: "2026-11-18T07:00:00Z", a: "80", b: "120" }).ok, "a BP with the numbers swapped is refused");
check(!ok({ kind: "BP", takenAt: "2026-11-19T07:00:00Z", a: "120", b: "80" }).ok, "a reading in the future is refused");
const w = ok({ kind: "WEIGHT", takenAt: "2026-11-18T07:00:00Z", a: "154" }, { ...MG, weight: "LB" });
check(w.ok && Math.abs(w.data.valueA - 69.9) < 0.2, "pounds are stored as kilograms");
const t = ok({ kind: "TEMP", takenAt: "2026-11-18T07:00:00Z", a: "100.4" }, { ...MG, temp: "F" });
check(t.ok && Math.abs(t.data.valueA - 38) < 0.05, "°F is stored as °C (100.4 → 38.0)");
const s = ok({ kind: "SYMPTOMS", takenAt: "2026-11-18T07:00:00Z", detail: { list: ["BLEEDING", "made-up"], severity: "MILD" } });
check(s.ok && s.data.detail.list.length === 1, "unknown symptoms are dropped");
check(L.defaultSlot("GLUCOSE", 7) === "FASTING" && L.defaultSlot("GLUCOSE", 13) === "AFTER_LUNCH" && L.defaultSlot("BP", 20) === "EVENING", "the slot follows the time of day");

console.log("Pregnancy dates");
const due = new Date("2027-02-10T00:00:00Z");
const ga = L.gestationOn(due, new Date("2026-11-18T00:00:00Z"));
check(ga && ga.week === 28 && ga.day === 0, "18 Nov 2026 is 28+0 for a 10 Feb 2027 due date");
const jr = jiti(path.join(root, "lib/stage.ts"));
const at = new Date("2026-11-18T15:30:00Z"), due2 = new Date("2027-02-10T18:52:34Z");
const pos = jr.computePosition(due2, at), mine = L.gestationOn(due2, at);
check(pos.week === mine.week && pos.dayInWeek === mine.day, "the log agrees with the journey page about the week and day");

console.log("Kept from the assistant");
{
  const { readFileSync, readdirSync, statSync, existsSync } = await import("node:fs");
  const files = [];
  const walk = (d) => {
    if (!existsSync(d)) return;
    for (const n of readdirSync(d)) {
      const f = path.join(d, n);
      statSync(f).isDirectory() ? walk(f) : /\.(ts|tsx)$/.test(f) && files.push(f);
    }
  };
  walk(path.join(root, "app/api/agbebi"));
  for (const f of ["lib/agbebi.ts", "components/AssistantChat.tsx"]) if (existsSync(path.join(root, f))) files.push(path.join(root, f));
  const HEALTH = /\b(healthReading|healthFile|healthLogSettings|healthRecord|medicationPlan|medicationDose|prenatalCheck|healthReport)\b|health-log|health-card/;
  const touching = files.filter((f) => HEALTH.test(readFileSync(f, "utf8")));
  check(files.length > 0 && touching.length === 0, `the assistant's code never reads health records (${files.length} files checked${touching.length ? `; touched in ${touching.map((f) => path.relative(root, f)).join(", ")}` : ""})`);
}

if (failed) {
  console.error(`\n${failed} health-log rule(s) broke. These decide what a reading means — fix them before shipping.`);
  process.exit(1);
}
console.log("\n  ok — every health-log rule holds.");
