/**
 * "The whole journey" line — checked on every deploy.
 *
 * The line under a family's journey is labelled Conception, Birth, 2 years.
 * It once stood at 28% on the day of the birth while "Birth" was printed
 * under the middle, because its length was plain time elapsed and pregnancy
 * is the short part. These cases hold the line to its own labels.
 *
 * Run with `npm run verify:line`.
 */
import createJiti from "jiti";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const jiti = createJiti(import.meta.url, { alias: { "@": root }, interopDefault: true });
const S = jiti(path.join(root, "lib/stage.ts"));

let failed = 0;
const check = (ok, what) => {
  if (!ok) failed++;
  console.log(`  ${ok ? "ok  " : "FAIL"} ${what}`);
};

const now = new Date("2026-11-23T12:00:00Z");
const DAY = 86_400_000;
const due = (daysFromNow) => new Date(now.getTime() + daysFromNow * DAY);
const at = (daysFromNow) => S.computePosition(due(daysFromNow), now).progress;
const near = (a, b, tol = 0.01) => Math.abs(a - b) <= tol;

console.log("The whole journey line");
check(S.BIRTH_AT === 0.5, "the birth is the middle of the line");
check(near(at(280), 0), "at conception the line is empty");
check(near(at(140), 0.25), "halfway through pregnancy it is a quarter of the way along");
check(near(at(1), S.BIRTH_AT), "the day before the due date it is just short of the birth mark");
check(at(1) <= S.BIRTH_AT, "and never past it while she is still expecting");
check(near(at(-0.5), S.BIRTH_AT) && at(-0.5) >= S.BIRTH_AT, "on the day of the birth it touches the birth mark");
check(S.computePosition(due(-0.5), now).stage.stage === "month-0", "which is month 0");
check(near(at(-365.2425), 0.75), "at the first birthday it is three quarters of the way along");
check(near(at(-730.485), 1) && at(-2000) === 1, "at the second birthday it is full, and stays full");
let rising = true;
for (let d = 279, last = at(280); d >= -760; d -= 7) {
  const v = at(d);
  if (v < last - 1e-9) rising = false;
  last = v;
}
check(rising, "it only ever moves forward, week by week, across the whole journey");

if (failed) {
  console.error(`\n${failed} check(s) failed — the journey line would disagree with its own labels.`);
  process.exit(1);
}
console.log("\n  ok — the journey line reaches each label when the family does.");
