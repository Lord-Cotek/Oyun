/**
 * A surprise must stay a surprise.
 *
 * ── Why a script and not a code review ───────────────────────────────────
 * Because of how this breaks. Nobody decides to leak somebody's party. What
 * happens is that in eight months a new screen needs the diary, somebody
 * writes `prisma.journeyEvent.findMany({ where: { householdId } })` because
 * that is obviously what you write, and a wife opens the app and sees her own
 * surprise fortieth sitting in the list.
 *
 * The same shape of mistake already took the diary down in production once,
 * in this codebase, on the day a read path was missed. So this refuses any
 * query on journeyEvent that has not got the rule in it.
 *
 * Run with `npm run verify:surprise`.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const LOOK_IN = ["app", "lib", "components"];
const SKIP = new Set(["node_modules", ".next", ".git"]);

/** Reading a single row by id, then checking it in code, is a different shape. */
const SINGLE = /journeyEvent\.(findUnique|findFirst|count|create|update|updateMany|deleteMany|delete)\b/;
const MANY = /journeyEvent\.findMany\b/;

const problems = [];
const allowed = [];

function walk(dir) {
  for (const name of readdirSync(dir)) {
    if (SKIP.has(name)) continue;
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) walk(full);
    else if (/\.(ts|tsx)$/.test(full)) check(full);
  }
}

function check(file) {
  const rel = path.relative(root, file);
  if (rel === "lib/surprise.ts") return;
  const code = readFileSync(file, "utf8");
  const lines = code.split("\n");

  lines.forEach((line, i) => {
    if (!MANY.test(line)) return;
    // The query and its where-clause: enough of the call to see the rule.
    const window = lines.slice(i, i + 30).join("\n");
    // An allowance is written ABOVE the query, the way a comment explaining a
    // query always is — so look back a few lines as well as forward.
    const around = lines.slice(Math.max(0, i - 5), i + 30).join("\n");
    const no = around.match(/\/\/\s*surprise-ok:\s*(.+)/);
    if (no) {
      allowed.push(`${rel}:${i + 1} — ${no[1].trim()}`);
      return;
    }
    if (/surpriseScope\(/.test(window)) return;
    // The reminder cron is allowed to see every surprise, but only if it
    // routes each one on `onlyFor`. Anything else is a leak with an option
    // name on it.
    if (/everySurprise:\s*true/.test(window)) {
      if (/onlyFor/.test(code)) return;
      problems.push(
        `${rel}:${i + 1} asks for everySurprise but never routes on onlyFor.`,
      );
      return;
    }
    problems.push(
      `${rel}:${i + 1} reads journeyEvent without surpriseScope(viewerId).`,
    );
  });

  // A single-row read that then acts on the row should check maySee.
  if (SINGLE.test(code) && /journeyEvent\.(findUnique|findFirst)/.test(code)) {
    const usesRule = /maySee\(|surpriseScope\(/.test(code);
    const reads = /select:\s*\{[^}]*\bsurprise\b/.test(code);
    if (!usesRule && reads) {
      problems.push(
        `${rel} selects surprise on a single row but never calls maySee().`,
      );
    }
  }
}

for (const d of LOOK_IN) walk(path.join(root, d));

if (allowed.length) {
  console.log(`\n  ${allowed.length} allowance(s) in force:`);
  for (const a of allowed) console.log(`   ·  ${a}`);
}

if (problems.length) {
  console.error("\n  A surprise could leak:\n");
  for (const p of problems) console.error(`   ✗  ${p}`);
  console.error(
    "\n  Every read of journeyEvent must spread surpriseScope(viewerId) — see\n" +
      "  lib/surprise.ts. If a query genuinely does not need it, say why on the\n" +
      "  line above with `// surprise-ok: <reason>`, and the reason gets printed\n" +
      "  on every run so it stays an argument somebody can disagree with.\n",
  );
  process.exit(1);
}

console.log("\n  ok — nobody else sees a surprise until the day has passed.\n");
