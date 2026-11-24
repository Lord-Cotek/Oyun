/**
 * The care pages — checked on every deploy.
 *
 * Health in the bottom bar, "When to call", and the pages that came with
 * them. These are the places where a wrong word matters most: a warning sign
 * dropped from a list, a verse shown to somebody who asked not to be shown
 * one, a medical fact that reads differently for two readers. Each promise
 * the pages make is written here as a case, so a later change cannot break
 * one quietly.
 *
 * Run with `npm run verify:care`.
 */
import createJiti from "jiti";
import { fileURLToPath } from "node:url";
import { readFileSync } from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const jiti = createJiti(import.meta.url, { alias: { "@": root }, interopDefault: true });
const read = (f) => readFileSync(path.join(root, f), "utf8");

let failed = 0;
const check = (ok, what) => {
  if (!ok) failed++;
  console.log(`  ${ok ? "ok  " : "FAIL"} ${what}`);
};

// The same list scripts/verify-voice.mjs holds the general words to.
const BANNED = /\b(god|gods|lord|pray|prays|prayed|praying|prayer|prayers|bless|blessed|blessing|blessings|miracle|heaven|soul|faith|faithful|divine|sacred|angel|angels|church|psalm|psalms|scripture|bible|jesus|christ|amen|worship|universe|destiny|fate|fearfully|wonderfully made|holy)\b/i;

// ── The bottom bar ─────────────────────────────────────────────────────────
console.log("The phone's bottom bar");
const N = jiti(path.join(root, "lib/nav-tabs.ts"));
const HOUSE_FAITH = ["/journey", "/life", "/letters", "/worship", "/scripture", "/prayer", "/appointments", "/care", "/health", "/child", "/firsts", "/circle", "/registry", "/shared", "/help", "/settings"];
const HOUSE_GENERAL = HOUSE_FAITH.filter((h) => h !== "/worship" && h !== "/scripture");
const CIRCLE_FAITH = ["/journey", "/life", "/worship", "/scripture", "/prayer", "/registry", "/help", "/settings"];
const CIRCLE_GENERAL = ["/journey", "/life", "/prayer", "/help", "/settings"];
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
{
  const f = N.pickTabs(HOUSE_FAITH, { household: true, general: false });
  check(same(f.primary, ["/journey", "/life", "/worship", "/health"]), "with faith, the two of them get Home, Life, Worship, Health");
  check(f.rest[0] === "/letters", "and Letters is the first thing under More");
  const g = N.pickTabs(HOUSE_GENERAL, { household: true, general: true });
  check(same(g.primary, ["/journey", "/life", "/health", "/prayer"]), "without, they get Home, Life, Health, Support");
  check(g.rest[0] === "/letters", "and Letters is first under More there too");
  for (const [name, hrefs, who] of [
    ["faith household", HOUSE_FAITH, { household: true, general: false }],
    ["general household", HOUSE_GENERAL, { household: true, general: true }],
    ["faith circle", CIRCLE_FAITH, { household: false, general: false }],
    ["general circle", CIRCLE_GENERAL, { household: false, general: true }],
  ]) {
    const t = N.pickTabs(hrefs, who);
    const all = [...t.primary, ...t.rest].sort();
    check(
      t.primary.length <= 4 && same(all, hrefs.filter((h) => h !== "/settings").sort()) && !t.primary.includes("/settings"),
      `${name}: at most four tabs, no room lost, none shown twice, Settings never a tab`,
    );
  }
  const c = N.pickTabs(CIRCLE_FAITH, { household: false, general: false });
  check(same(c.primary, CIRCLE_FAITH.slice(0, 4)), "friends and relatives keep the bar they had");
  check(!c.primary.includes("/health") && !c.rest.includes("/health"), "and are never offered Health");
  const header = read("components/SiteHeader.tsx");
  check(/pickTabs\(/.test(header) && !/primaryPool\.slice\(0, 4\)/.test(header), "the header takes its tabs from this rule and nowhere else");
}

// ── When to call ───────────────────────────────────────────────────────────
console.log("When to call");
const W = jiti(path.join(root, "lib/when-to-call.ts"));
const PHASES = ["pregnancy", "after-birth", "after-loss"];
const READERS = ["MOTHER", "PARTNER"];
const textOf = (p) => JSON.stringify(p);
{
  let clean = true;
  let complete = true;
  let sameSigns = true;
  for (const ph of PHASES) {
    const pages = READERS.map((r) => W.whenToCall(ph, r, "Amara Okafor"));
    for (const p of pages) {
      if (BANNED.test(textOf(p))) clean = false;
      const tones = p.groups.map((g) => g.tone);
      if (!tones.includes("now") || !tones.includes("today")) complete = false;
      if (p.groups.some((g) => g.signs.length === 0 || !g.title)) complete = false;
      if (!p.groups.some((g) => g.key === "mind-now") || !p.groups.some((g) => g.key === "mind-soon")) complete = false;
    }
    // Her body's signs are the same list for her and for him.
    const bodyKeys = pages[0].groups.filter((g) => !g.key.startsWith("mind-")).map((g) => g.key);
    for (const k of bodyKeys) {
      const a = pages[0].groups.find((g) => g.key === k).signs.length;
      const b = pages[1].groups.find((g) => g.key === k)?.signs.length;
      if (a !== b) sameSigns = false;
    }
  }
  check(clean, "no religious language on the page, for any reader, at any time");
  check(complete, "every version has a 'now' list, a 'today' list and both lists about feelings");
  check(sameSigns, "her partner is shown exactly as many signs as she is");

  const preg = textOf(W.whenToCall("pregnancy", "MOTHER", "Amara"));
  for (const [re, what] of [
    [/bleeding/i, "bleeding"],
    [/moving less/i, "the baby moving less"],
    [/headache/i, "a headache that will not lift"],
    [/vision/i, "changes in vision"],
    [/fluid leaking/i, "leaking fluid"],
    [/38°C \(100\.4°F\)/, "a fever, with the figure in both scales"],
    [/before 37 weeks/i, "contractions before 37 weeks"],
    [/fit \(seizure\)/i, "a fit"],
    [/harming yourself/i, "thoughts of self-harm"],
  ]) check(re.test(preg), `in pregnancy it names ${what}`);

  const after = textOf(W.whenToCall("after-birth", "MOTHER", "Amara"));
  for (const [re, what] of [
    [/soaks a pad in an hour/i, "heavy bleeding, measured the way every service measures it"],
    [/wound or stitches/i, "a wound going wrong"],
    [/breast/i, "a breast infection"],
    [/leg swollen/i, "a swollen leg"],
    [/harming yourself or the baby/i, "thoughts of harming herself or the baby"],
    [/Not feeding well/i, "a baby who is not feeding"],
    [/blue or grey/i, "a baby turning blue"],
    [/Yellow skin/i, "jaundice in the first day"],
  ]) check(re.test(after), `after the birth it names ${what}`);

  const loss = W.whenToCall("after-loss", "MOTHER", "Amara");
  check(!/\bbaby\b/i.test(textOf(loss)), "after a loss the page does not speak of the baby");
  check(!loss.groups.some((g) => g.key.startsWith("baby-")), "and has no list about a baby");
  check(/Grief is not an illness/.test(textOf(loss)), "and says grief is not an illness");

  const his = textOf(W.whenToCall("after-birth", "PARTNER", "Amara Okafor"));
  check(/Amara/.test(his) && !/Okafor/.test(his), "her partner reads her first name, not 'you'");
  check(/Stay with her/.test(his), "and is told to stay with her");
  check(!/\byour body\b/i.test(his), "and is not told the signs are in his own body");

  // No telephone number of the app's own: it is used in many countries.
  check(!/\b(911|999|112|000|111|199)\b/.test(PHASES.map((ph) => READERS.map((r) => textOf(W.whenToCall(ph, r, "A"))).join("")).join("")), "the page gives no telephone number of its own");

  const pp = W.phoneParts("St Mary's, Dr Bello 0803 555 0101, ward 12");
  check(pp.filter((x) => x.tel).length === 1 && pp.find((x) => x.tel).tel === "08035550101", "a number typed on the card can be tapped to call");
  check(W.phoneParts("Room 2024, floor 12").every((x) => !x.tel), "a room number or a year is not turned into a call");
  check(W.phoneParts("+44 20 7946 0958").some((x) => x.tel === "+442079460958"), "an international number keeps its plus");

  const page = read("app/health/when-to-call/page.tsx");
  check(/isHousehold\(active\.role\)\) redirect/.test(page), "only the two of them can open it");
  check(!/Verse|verse\b|voice/.test(page.replace(/\/\*[\s\S]*?\*\//g, "")), "the page has no verse and does not ask the reader's faith choice");
  check(!/healthReading|logAccess/.test(page), "it reads nothing from the health log, so a log kept to her stays kept");
  check(/key: "call"/.test(read("components/health/HealthTabs.tsx")), "it is one tap away from every page in Health");
}

if (failed) {
  console.error(`\n${failed} check(s) failed — a care page would break a promise.`);
  process.exit(1);
}
console.log("\nThe care pages keep their promises.");
