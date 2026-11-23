/**
 * Oyun without religious content — its promises, checked on every deploy.
 *
 * ── Why a script ─────────────────────────────────────────────────────────
 * Somebody who chose Oyun without religious content (lib/voice.ts) was told
 * they would not be handed prayers and verses. One stray "pray for her" in a
 * general stage, one week left without a general version, one partner nudge
 * list a line shorter than its original (which shifts every day after it, so
 * the page and the morning note disagree) — each is a broken promise nobody
 * would notice until the person it was made to does. So each is a case here,
 * and the build stops if one fails.
 *
 * Run with `npm run verify:voice`.
 */
import createJiti from "jiti";
import { fileURLToPath } from "node:url";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const jiti = createJiti(import.meta.url, { alias: { "@": root }, interopDefault: true });

let failed = 0;
const check = (ok, what) => {
  if (!ok) failed++;
  console.log(`  ${ok ? "ok  " : "FAIL"} ${what}`);
};

const VC = jiti(path.join(root, "lib/voice-content.ts"));
const V = jiti(path.join(root, "lib/voice.ts"));
const J = jiti(path.join(root, "lib/journey.ts"));
const GPC = jiti(path.join(root, "lib/general/partner-care.ts"));
const GC = jiti(path.join(root, "lib/general/circle.ts"));
const GD = jiti(path.join(root, "lib/general/daily.ts"));
const GG = jiti(path.join(root, "lib/general/grief.ts"));

console.log("The choice");
check(V.voiceOf(null) === "FAITH" && V.voiceOf(undefined) === "FAITH" && V.voiceOf("nonsense") === "FAITH", "anything unreadable is the faith voice — nobody already here changes");
check(V.voiceOf("GENERAL") === "GENERAL", "GENERAL is read as GENERAL");

console.log("Every stage has a general version");
const missing = VC.generalStageMissing();
check(missing.length === 0, missing.length ? `missing: ${missing.join(", ")}` : `all ${J.STAGES.length} stages`);

console.log("The faith voice is untouched");
const s0 = J.STAGES[10];
check(VC.stageIn(s0, "FAITH") === s0 && VC.stageIn(s0, null) === s0, "a faith reader gets the original stage object, unchanged");

console.log("Rotations line up");
// The rotation is by index, so a general list must match its original
// entry for entry or the page and the morning note pick different days.
const src = readFileSync(path.join(root, "lib/partner-care.ts"), "utf8");
const preg = (src.split("const PREGNANCY_CARE")[1] ?? "").split("];")[0].match(/\{ act:/g)?.length ?? 0;
const inf = (src.split("const INFANCY_CARE")[1] ?? "").split("];")[0].match(/\{ act:/g)?.length ?? 0;
check(GPC.GENERAL_PREGNANCY_CARE.length === preg, `partner nudges in pregnancy: ${GPC.GENERAL_PREGNANCY_CARE.length} / ${preg}`);
check(GPC.GENERAL_INFANCY_CARE.length === inf, `partner nudges in infancy: ${GPC.GENERAL_INFANCY_CARE.length} / ${inf}`);
check([...GPC.GENERAL_PREGNANCY_CARE, ...GPC.GENERAL_INFANCY_CARE].every((n) => !n.ref), "no Bible reference rides along on a general nudge");
const acc = readFileSync(path.join(root, "lib/accountability.ts"), "utf8");
for (const [name, gen] of [["DAILY", GC.GENERAL_CIRCLE_DAILY], ["WEEKLY", GC.GENERAL_CIRCLE_WEEKLY]]) {
  const block = (acc.split(`const ${name}:`)[1] ?? "").split("\n};")[0];
  for (const stage of ["first", "second", "third", "nearly", "newborn", "infancy"]) {
    const part = (block.split(`  ${stage}: [`)[1] ?? "").split("\n  ],")[0];
    const n = part.match(/\{ text:/g)?.length ?? 0;
    check(gen[stage]?.length === n, `circle ${name.toLowerCase()} · ${stage}: ${gen[stage]?.length} / ${n}`);
  }
}
check(GD.GENERAL_DAILY.length >= 30, `daily words: ${GD.GENERAL_DAILY.length}`);
check(GG.GENERAL_GRIEF.length >= 7, `words for grief: ${GG.GENERAL_GRIEF.length}`);

console.log("No religious language in the general words");
// Whole words, case-insensitive. Comments are stripped first: a header that
// explains what the file stands in for may name what it replaces.
const BANNED = /\b(god|gods|lord|pray|prays|prayed|praying|prayer|prayers|bless|blessed|blessing|blessings|miracle|heaven|soul|faith|faithful|divine|sacred|angel|angels|church|psalm|psalms|scripture|bible|jesus|christ|amen|worship|universe|destiny|fate|fearfully|wonderfully made|holy)\b/i;
const dir = path.join(root, "lib/general");
for (const f of readdirSync(dir).filter((x) => x.endsWith(".ts") && x !== "types.ts")) {
  const text = readFileSync(path.join(dir, f), "utf8")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^\s*\/\/.*$/gm, "");
  const hits = text.split("\n").filter((l) => BANNED.test(l));
  check(hits.length === 0, hits.length ? `${f}: ${hits[0].trim().slice(0, 90)}` : f);
}

console.log("What a general reader is shown");
const now = new Date("2026-11-23T08:00:00Z");
const words = [
  VC.dailyWordIn("GENERAL", now),
  VC.griefWordIn("GENERAL", now),
  VC.partnerCareIn("GENERAL", "pregnancy", 20000, 3),
  VC.circleDailyIn("GENERAL", "second", now),
  VC.circleWeeklyIn("GENERAL", "newborn", now),
];
check(words.every((w) => !BANNED.test(JSON.stringify(w))), "the day's word, grief word, partner nudge and circle practice");
const allGeneral = J.STAGES.map((s) => VC.stageIn(s, "GENERAL"));
const bad = allGeneral.filter((s) =>
  BANNED.test([s.title, s.body, s.verse.text, s.reflection, s.newThisStage, s.action, s.partnerFocus, s.prayerPoint].join(" ")),
);
check(bad.length === 0, bad.length ? `stage with faith words: ${bad.map((s) => s.stage).join(", ")}` : "every stage, every field");
check(allGeneral.every((s) => s.verse.ref === ""), "no stage carries a Bible reference");

if (failed) {
  console.error(`\n${failed} check(s) failed — Oyun without religious content would break a promise.`);
  process.exit(1);
}
console.log("\n  ok — Oyun without religious content keeps its word.");
