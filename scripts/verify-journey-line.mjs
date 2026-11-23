/**
 * "The whole journey" line, and the baby drawn above it — checked on every deploy.
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

console.log("The baby in the picture");
// The drawn baby (lib/growth-figure.ts). It once lay with its face pointing
// along the ground out of the top of its head, swapped ends at three months,
// and kept its eyes shut while walking. These hold what was put right.
const F = jiti(path.join(root, "lib/growth-figure.ts"));
const born = (month) => F.rigAt({ born: true, week: 40, month }).rig;
const months = Array.from({ length: 25 }, (_, m) => m);
check(months.every((m) => born(m).head[0] > born(m).hip[0]), "the head is at the same end at every age — no swapping ends when they roll over");
check(Math.abs(born(0).look + Math.PI / 2) < 0.01 && born(0).look < -1.2, "a newborn on their back faces up at the sky");
check(months.filter((m) => m >= 3).every((m) => Math.abs(born(m).look) < 0.35), "from tummy time on they look ahead");
check(F.figurePaths(born(0)).eye === null && F.figurePaths(born(1)).eye === null, "a newborn is asleep");
check(months.filter((m) => m >= 2).every((m) => F.figurePaths(born(m)).eye !== null), "from two months the eyes are open, at every age after");
check([8, 12, 20, 28, 34, 40].every((w) => F.figurePaths(F.rigAt({ born: false, week: w, month: 0 }).rig).eye === null), "in the womb the eyes stay closed");
check([15, 18, 24].every((m) => born(m).farLeg[0] < -8), "walking, the far leg is behind the near one — a stride, not a lean");
const face0 = F.figurePaths(born(0)), head0 = born(0).head;
check(face0.blush && face0.blush[1] < head0[1] && face0.blush[0] < head0[0], "the newborn's cheek is on the upper side of the head, towards the body");

// Drawn as one body, not as parts pinned together.
const everyAge = [...[8, 12, 20, 28, 34, 40].map((w) => F.rigAt({ born: false, week: w, month: 0 }).rig), ...months.map(born)];
const nearLayers = (rig) => F.figurePaths(rig).layers.filter((l) => l.strokes);
check(everyAge.every((rig) => nearLayers(rig).length === 2 && nearLayers(rig).every((l) => !l.strokes[0].trim().endsWith("Z"))),
  "the near arm and leg are left open where they join the body — no round cap drawn inside the torso");
check(everyAge.every((rig) => nearLayers(rig).every((l) => l.paths.every((d) => d.trim().endsWith("Z")))), "and still filled as whole shapes");
const hairAt = (m) => F.figurePaths(born(m), Math.min(1, Math.max(0, (m - 2) / 5)) + Math.min(1, Math.max(0, (m - 10) / 12))).face.length;
check(hairAt(24) > hairAt(8) && hairAt(8) > hairAt(1), "the hair grows: none as a newborn, a curl by eight months, more by two years");

if (failed) {
  console.error(`\n${failed} check(s) failed — the journey line or its picture would be wrong.`);
  process.exit(1);
}
console.log("\n  ok — the journey line reaches each label when the family does, and the baby faces the right way.");
