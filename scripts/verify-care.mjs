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

// ── Eating well ────────────────────────────────────────────────────────────
console.log("Eating well");
const EAT = jiti(path.join(root, "lib/eating.ts"));
{
  const EPH = ["t1", "t2", "t3", "after-birth", "after-loss"];
  const g = (ph, r, v) => EAT.eatingGuide(ph, r, v, "Amara Okafor");
  let cleanGeneral = true;
  let sameFacts = true;
  let fastingRight = true;
  for (const ph of EPH) {
    for (const r of ["MOTHER", "PARTNER"]) {
      const gen = g(ph, r, "GENERAL");
      const fai = g(ph, r, "FAITH");
      if (BANNED.test(JSON.stringify(gen))) cleanGeneral = false;
      if (gen.fasting !== null) fastingRight = false;
      const pregnant = ph.startsWith("t");
      if (pregnant !== (fai.fasting !== null)) fastingRight = false;
      const strip = (x) => JSON.stringify({ ...x, fasting: null });
      if (strip(gen) !== strip(fai)) sameFacts = false;
    }
  }
  check(cleanGeneral, "no religious language for somebody who chose Oyun without, in any phase");
  check(BANNED.test(JSON.stringify(EAT.FOODS)) === false, "and none anywhere in 'Can I eat this?'");
  check(sameFacts, "apart from fasting, the page is word for word the same with and without faith");
  check(fastingRight, "fasting is shown only with faith, and only while she is expecting");
  const fast = JSON.stringify(g("t2", "MOTHER", "FAITH").fasting);
  check(/doctor or midwife before any fast/.test(fast) && /Do not go without water/.test(fast) && /Stop, eat and drink at once/.test(fast), "it says: ask the doctor first, never without water, and what ends a fast at once");
  check(/never asks you to fast/.test(fast), "and that Oyun never asks her to fast");
  check(!/\b(fasting|fasted|fasts|a fast|to fast)\b/i.test(read("lib/worship.ts").split("\n").filter((l) => /^\s*(talk|pray|do|act):/.test(l)).join("\n")), "nothing in worship asks anybody to fast");

  check(EAT.phaseForWeek(1) === "t1" && EAT.phaseForWeek(13) === "t1" && EAT.phaseForWeek(14) === "t2" && EAT.phaseForWeek(27) === "t2" && EAT.phaseForWeek(28) === "t3" && EAT.phaseForWeek(41) === "t3", "weeks fall into the right trimester");
  check(/Folate/.test(JSON.stringify(g("t1", "MOTHER", "FAITH").focus)) && /Iron/.test(JSON.stringify(g("t2", "MOTHER", "FAITH").focus)), "folate leads the first trimester and iron the second");
  const loss = g("after-loss", "MOTHER", "FAITH");
  check(!loss.showFoods && loss.troubles.length === 0 && !/\bbaby\b/i.test(JSON.stringify(loss)), "after a loss: no pregnancy food list, and no talk of the baby");
  check(!g("after-birth", "MOTHER", "FAITH").showFoods, "after the birth the pregnancy food list is put away");
  check(/Amara/.test(g("t2", "PARTNER", "GENERAL").partnerNote) && g("t2", "MOTHER", "GENERAL").partnerNote === null, "her partner is told the page is written to her");

  const F = EAT.FOODS;
  const by = (k) => F.find((f) => f.key === k);
  check(new Set(F.map((f) => f.key)).size === F.length && F.every((f) => f.why.length > 20 && ["ok", "care", "avoid"].includes(f.verdict)), "every food has one answer and a reason");
  for (const k of ["alcohol", "raw-meat", "raw-shellfish", "mercury-fish", "raw-milk", "pate", "clay"]) check(by(k)?.verdict === "avoid", `${by(k)?.name}: best avoided`);
  // Where health services differ, nothing is called fine.
  for (const k of ["liver", "eggs-raw", "raw-fish", "soft-cheese-mould", "smoked-fish", "cured-meat", "tuna", "herbal-medicine", "vitamin-a", "caffeine"]) check(by(k)?.verdict === "care", `${by(k)?.name}: with care, never plain 'fine'`);
  check(/differ|Some health services|many health services/i.test(by("liver").why + by("raw-fish").why + by("soft-cheese-mould").why), "and says that services differ where they do");
  const all = JSON.stringify(F) + JSON.stringify(EPH.map((ph) => g(ph, "MOTHER", "FAITH")));
  check(!/\b\d+(\.\d+)?\s?(mg|mcg|µg|iu|g|kcal|calories)\b/i.test(all), "no dose of anything, and no calories");
  check(/what your midwife or doctor advised/.test(all), "supplements are 'what your midwife or doctor advised', nothing more");
  const names = (q, v) => EAT.searchFoods(q, v).map((f) => f.key);
  check(names("sushi").includes("raw-fish") && names("pate").includes("pate") && names("Pâté").includes("pate"), "typing 'sushi' or 'Pâté' finds the answer");
  check(names("garri").includes("staples") && names("nzu").includes("clay") && names("agbo").includes("herbal-medicine") && names("paneer").includes("soft-cheese-plain"), "so do the words of other kitchens");
  check(names("").length === F.length && names("zzzz").length === 0 && names("", "avoid").every((k) => by(k).verdict === "avoid"), "an empty search is the whole list; a filter keeps only its answer");

  const page = read("app/health/eating/page.tsx");
  check(/isHousehold\(active\.role\)\) redirect/.test(page), "only the two of them can open it");
  check(!/prisma|healthReading|logAccess/.test(page), "the page reads nothing from the database or the health log");
  const finder = read("components/health/eating/FoodFinder.tsx");
  check(!/fetch\(|action|sendBeacon|localStorage/.test(finder.replace(/\/\*[\s\S]*?\*\//g, "").replace(/aria-[a-z]+/g, "")), "what she types is not sent or kept anywhere");
  check(!/eating|FOODS|searchFoods/.test(read("app/api/agbebi/route.ts")), "the assistant is not given the page");
}

// ── The registry's essentials ──────────────────────────────────────────────
console.log("The registry's essentials");
const E = jiti(path.join(root, "lib/registry-essentials.ts"));
{
  const faith = E.essentialsFor("FAITH", 1);
  const general = E.essentialsFor("GENERAL", 1);
  const flat = (secs) => secs.flatMap((s) => s.items);
  const keys = (secs) => flat(secs).map((i) => i.key);
  check(new Set(keys(faith)).size === keys(faith).length && new Set(keys(general)).size === keys(general).length, "no starter entry is offered twice");
  check(!BANNED.test(JSON.stringify(general)), "no religious language in the list for somebody who chose Oyun without");
  check(/Bible/.test(JSON.stringify(faith)) && /dedication/i.test(JSON.stringify(faith)), "with faith, a children's Bible and a dedication outfit are offered");
  check(/Naming-day/.test(JSON.stringify(general)) && !/Naming-day/.test(JSON.stringify(faith)), "without, a naming-day outfit is offered in their place");
  const sameElsewhere = (a, b) => JSON.stringify(a.filter((s) => s.key !== "KEEPSAKES")) === JSON.stringify(b.filter((s) => s.key !== "KEEPSAKES"));
  check(sameElsewhere(faith, general), "every other shelf is the same for both");
  check(faith.every((s) => s.category === null || E.isCategory(s.category)), "every section lands on a shelf that exists");
  check(faith.at(-1).key === "HELP" && faith.at(-1).items.every((i) => i.kind === "HELP"), "help is last, and is help, not things");
  check(flat(faith).filter((i) => i.kind !== "HELP").every((i) => i.kind === undefined || i.kind === "THING"), "everything else is a thing");
  check(!/formula/i.test(JSON.stringify(faith)), "infant formula is not suggested");
  check(!/\b(amazon|ikea|pampers|huggies|johnson|chicco|graco|mumzworld|noon)\b/i.test(JSON.stringify(faith)), "no brand or shop is named");
  check(!/[$£€₦]|\b(AED|USD|GBP|NGN)\b/.test(JSON.stringify(faith)), "no price is given");
  check(flat(faith).every((i) => i.quantity >= 1 && i.quantity <= 20 && i.title.length <= 120), "every quantity and title fits the registry's own limits");
  const twins = E.essentialsFor("FAITH", 2);
  const q = (secs, k) => flat(secs).find((i) => i.key === k).quantity;
  check(q(twins, "cot") === 2 && q(twins, "sleepsuits") === 14 && q(twins, "thermometer") === 1, "twins are asked for in twos where it is one each, and not where it is not");
  check(flat(E.essentialsFor("FAITH", 6)).every((i) => i.quantity <= 20), "and never past the limit, however many babies");
  check(flat(faith).filter((i) => i.forgotten).length >= 5 && flat(faith).filter((i) => i.mostNeeded).length <= 14, "a handful are marked essential and a handful often forgotten, not everything");

  // Existing registries: nothing has a shelf, and nothing changes.
  const old = [{ id: "a", category: null }, { id: "b", category: null }, { id: "c", category: null }];
  const g0 = E.groupThings(old);
  check(g0.length === 1 && g0[0].label === null && g0[0].items.map((i) => i.id).join("") === "abc", "a registry with no shelves is one list with no heading, in its own order");
  check(E.groupThings([]).length === 0, "and an empty one is nothing at all");
  const g1 = E.groupThings([{ id: "a", category: null }, { id: "b", category: "FEED" }, { id: "c", category: "SLEEP" }, { id: "d", category: "nonsense" }]);
  check(g1.map((g) => g.key).join(",") === "SLEEP,FEED,OTHER" && g1[2].label === "Everything else" && g1[2].items.map((i) => i.id).join("") === "ad", "with shelves, they come in order and the unsorted are gathered last");
  check(E.cleanCategory("FEED") === "FEED" && E.cleanCategory("x") === null && E.cleanCategory(undefined) === null, "an unknown shelf is no shelf");

  const schema = read("prisma/schema.prisma");
  const model = schema.slice(schema.indexOf("model RegistryItem {"), schema.indexOf("model RegistryClaim {"));
  check(/\n  category\s+String\?/.test(model) && /\n  essential\s+String\?/.test(model) && /\n  haveAt\s+DateTime\?/.test(model), "the three new fields are optional, so every existing item is untouched");
  const db = read("lib/registry-db.ts");
  check(/where: \{ haveAt: null \}/.test(db), "a thing the family already has never reaches a guest");
  const guest = read("app/r/[slug]/actions.ts");
  check(/if \(item\.haveAt\) return \{ ok: false/.test(guest), "and cannot be claimed by one");
  const acts = read("app/registry/actions.ts");
  const setHave = acts.slice(acts.indexOf("export async function setHave"));
  check(/have && item\._count\.claims > 0/.test(setHave), "a thing somebody is already getting cannot be marked as had");
  const addE = acts.slice(acts.indexOf("export async function addEssentials"), acts.indexOf("export async function setHave"));
  check(/essentialsFor\(voice, babyCount\)/.test(addE) && /offered\.has\(k\)/.test(addE), "only entries this reader was offered can be added");
  check(/createMany/.test(addE) && !/update|delete/.test(addE.replace(/\/\*[\s\S]*?\*\//g, "")), "adding from the starter list creates items and changes none");
  check(/input\.category !== undefined/.test(acts), "editing an item without naming a shelf leaves its shelf alone");
}

if (failed) {
  console.error(`\n${failed} check(s) failed — a care page would break a promise.`);
  process.exit(1);
}
console.log("\nThe care pages keep their promises.");
