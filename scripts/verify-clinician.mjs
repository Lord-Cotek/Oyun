/**
 * The clinician's room — its promises, checked on every deploy.
 *
 * ── Why a script ─────────────────────────────────────────────────────────
 * A doctor sees what a patient chose to share and nothing else (see
 * lib/clinician.ts). The way that breaks is not dramatic: somebody adds a
 * "how is she feeling" line to the patient page next year, and a mother's
 * moods are in front of her consultant without her ever having been asked.
 * So the rooms a clinician can open are read here, and the build stops if
 * one of them reaches for something that is not clinical — or for any
 * record without first asking clinicianAccess whether this doctor may.
 *
 * Run with `npm run verify:clinician`.
 */
import createJiti from "jiti";
import { fileURLToPath } from "node:url";
import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const jiti = createJiti(import.meta.url, { alias: { "@": root }, interopDefault: true });
let failed = 0;
const check = (ok, what) => {
  if (!ok) failed++;
  console.log(`  ${ok ? "ok  " : "FAIL"} ${what}`);
};

console.log("Clinic codes");
const C = jiti(path.join(root, "lib/clinician.ts"));
check(C.normaliseCode("k7q3pm") === "K7Q-3PM", "typed in lower case without the dash");
check(C.normaliseCode(" K7Q - 3PM ") === "K7Q-3PM", "spaces and a dash");
check(C.normaliseCode("K7Q3P") === null && C.normaliseCode("K7Q3PMX") === null, "too short or too long is refused");
check(C.normaliseCode("O0I1L5") === null, "letters that are never in a code are refused, not guessed");
check(C.normaliseCode("") === null, "empty is refused");

console.log("What a clinician's pages may read");
// Every file a clinician can reach: the /doctor room and its file route.
const files = [];
const walk = (d) => {
  for (const f of readdirSync(d)) {
    const p = path.join(d, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(ts|tsx)$/.test(f)) files.push(p);
  }
};
walk(path.join(root, "app/doctor"));
walk(path.join(root, "app/api/doctor"));
files.push(path.join(root, "lib/clinician-db.ts"));
// Never clinical, never theirs: a family's words, moods, prayers and circle.
const FORBIDDEN = /prisma\.(letter|letterReply|checkIn|prayerRequest|prayerPray|encouragement|remembrance|nudge|supportDay|postComment|readingNote|worshipDay|personalWorshipDay|registry|journeyEvent|invite)\b/;
for (const f of files) {
  const rel = path.relative(root, f);
  const src = readFileSync(f, "utf8");
  check(!FORBIDDEN.test(src), `${rel} reads nothing that is not clinical`);
}
for (const rel of ["app/doctor/p/[link]/page.tsx", "app/api/doctor/file/[link]/[id]/route.ts"]) {
  const src = readFileSync(path.join(root, rel), "utf8");
  check(/clinicianAccess\(/.test(src), `${rel} asks clinicianAccess before reading anything`);
}
const page = readFileSync(path.join(root, "app/doctor/p/[link]/page.tsx"), "utf8");
check(/forDoctorAt: \{ not: null \}/.test(page), "the patient page shows only posts she chose for her doctor");
check(/withAppointments/.test(page) && /shared=\{link\.withAppointments\}/.test(page), "appointments only when she left them on");
check(/clinicianView\.create/.test(page), "every opening is recorded for her to see");
const access = readFileSync(path.join(root, "lib/clinician.ts"), "utf8");
check(/link\.endedAt/.test(access) && /clinician\.userId !== userId/.test(access), "an ended link, or another clinician's, grants nothing");
const fileRoute = readFileSync(path.join(root, "app/api/doctor/file/[link]/[id]/route.ts"), "utf8");
check(/withPhotos/.test(fileRoute) && /file\.journeyId !== link\.journeyId/.test(fileRoute), "photographs only when she allowed them, and only her own");

console.log("Only the mother shares");
const actions = readFileSync(path.join(root, "app/health/doctor/actions.ts"), "utf8");
check(/active\.role !== "MOTHER"/.test(actions), "sharing, changing and stopping are hers alone");
check(/if \(!input\.agreed\)/.test(actions), "nothing is shared without her ticking the agreement");

if (failed) {
  console.error(`\n${failed} check(s) failed — a clinician could see more than a patient chose.`);
  process.exit(1);
}
console.log("\n  ok — a clinician sees only what a patient chose.");
