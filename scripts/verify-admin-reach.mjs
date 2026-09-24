/**
 * The admin centre must not be able to read what a family wrote.
 *
 * ── Why a script and not a code review ───────────────────────────────────
 * Because the way this promise breaks is not somebody deciding to break it.
 * It is a support request on a Tuesday — "can you just check what she put in
 * that entry" — and one word added to a select that nobody reads again. The
 * promise is in the product's own words to a mother, so it gets a check that
 * fails out loud.
 *
 * Run with `npm run verify:admin`.
 *
 * It reads lib/admin-db.ts, which is the only file the admin pages may query
 * through, and refuses any mention of a column that holds something a person
 * wrote. It also refuses raw SQL there, because a raw query can name any
 * column it likes and this check would not see it.
 */
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/**
 * Columns that hold a person's own words, or something as private as them.
 * A count of any of these is fine; the value never is.
 */
const CONTENT = [
  "body",
  "note",
  "message",
  "content",
  "title",
  "shipAddress",
  "shipName",
  "shipPhone",
  "shipNote",
  "payDetails",
  "payLabel",
  "payNote",
  "passwordHash:true",
  "mediaUrls",
  "imageUrl",
  "photoUrls",
  "posterUrls",
];

/** Where an admin page is allowed to get its data. */
const FILE = "lib/admin-db.ts";

const problems = [];
const allowed = [];

/**
 * A file may allow ONE named column, with a reason, by carrying a line like:
 *
 *   // admin-reach: allow passwordHash — compared against the admin's own
 *
 * There has to be a way to say "this one is different", or the first time
 * somebody needs it they will delete the check instead. The rule is that an
 * allowance is written next to the code, names the column, gives a reason,
 * and is PRINTED on every run — so it can be argued with, and cannot quietly
 * become normal.
 */
function allowancesIn(src, where) {
  const out = new Map();
  for (const m of src.matchAll(/admin-reach:\s*allow\s+(\w+)\s*[-—:]*\s*(.*)/g)) {
    out.set(m[1], (m[2] || "").trim());
    allowed.push(`${where}: ${m[1]} — ${(m[2] || "no reason given").trim()}`);
  }
  return out;
}
const full = path.join(root, FILE);
if (!existsSync(full)) {
  console.error(`  ${FILE} is missing — the admin centre has no data layer.`);
  process.exit(1);
}

const src = readFileSync(full, "utf8");
const dbAllows = allowancesIn(src, FILE);
// Comments explain the rule and naturally name the things it forbids.
const code = src
  .replace(/\/\*[\s\S]*?\*\//g, "")
  .replace(/^\s*\/\/.*$/gm, "");

for (const bad of CONTENT) {
  if (dbAllows.has(bad.split(":")[0])) continue;
  // `passwordHash: true` is listed as a pair because reading whether a
  // password EXISTS is legitimate; reading the hash is not. The select below
  // takes the field and the file converts it to a boolean immediately.
  const needle = bad.includes(":") ? bad.replace(":", ":\\s*") : `${bad}:\\s*true`;
  const re = new RegExp(needle);
  if (re.test(code)) {
    problems.push(`selects "${bad.split(":")[0]}" — that is a family's own words`);
  }
}

if (/\$queryRaw|\$executeRaw/.test(code)) {
  problems.push(
    "uses raw SQL — a raw query can name any column and this check cannot see it",
  );
}

// ── Two different rules for two different kinds of file ────────────────
// A PAGE renders to a screen, so a page that queries the database at all is
// a page that can put anything on it. Pages go through lib/admin-db.ts and
// nowhere else.
//
// An ACTION writes: a reset token, an admin row, a line in the audit log.
// Those are not a family's content and it needs prisma to write them. So it
// is allowed the client, and held to the same rule about what it may READ.
const { execSync } = await import("node:child_process");

const pagesDir = path.join(root, "app/admintc");
if (existsSync(pagesDir)) {
  const hits = execSync(
    `grep -rn "prisma\\." ${JSON.stringify(pagesDir)} --include=page.tsx --include=layout.tsx || true`,
    { encoding: "utf8" },
  ).trim();
  if (hits) {
    for (const line of hits.split("\n")) {
      problems.push(
        `${line.split(":").slice(0, 2).join(":")} queries the database from a page — go through ${FILE}`,
      );
    }
  }

  // Every other file under app/admintc gets the content scan.
  const others = execSync(
    `find ${JSON.stringify(pagesDir)} -name "*.ts" -o -name "*.tsx" | grep -v "page.tsx" | grep -v "layout.tsx" || true`,
    { encoding: "utf8" },
  ).trim();
  for (const f of others ? others.split("\n") : []) {
    const raw = readFileSync(f, "utf8");
    const allows = allowancesIn(raw, path.relative(root, f));
    const body = raw
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/^\s*\/\/.*$/gm, "");
    for (const bad of CONTENT) {
      if (allows.has(bad.split(":")[0])) continue;
      const needle = bad.includes(":") ? bad.replace(":", ":\\s*") : `${bad}:\\s*true`;
      if (new RegExp(needle).test(body)) {
        problems.push(`${path.relative(root, f)} selects "${bad.split(":")[0]}"`);
      }
    }
    if (/\$queryRaw|\$executeRaw/.test(body)) {
      problems.push(`${path.relative(root, f)} uses raw SQL`);
    }
  }
}

if (allowed.length > 0) {
  console.log(`  ${allowed.length} allowance(s) in force:`);
  for (const a of allowed) console.log(`   ·  ${a}`);
  console.log("");
}

if (problems.length === 0) {
  console.log(`  ok — the admin centre reads accounts, never what a family wrote.`);
  console.log(`  (${CONTENT.length} content columns checked in ${FILE})`);
} else {
  console.log(`  ${problems.length} problem(s):`);
  for (const p of problems) console.log(`   FAIL ${p}`);
  process.exitCode = 1;
}
