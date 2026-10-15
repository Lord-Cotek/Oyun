#!/usr/bin/env node
/**
 * Are Ìdílé and Oyun still saying the same thing?
 *
 * The two apps are siblings, built from the same parts, and living in two
 * repositories. Thirty-five files are byte-identical today — the feed, the
 * photo lightbox, the draft-keeping box, the icon set, the share helpers.
 * Nothing stops that from quietly stopping being true. A bug gets fixed in one
 * app and not the other; a component grows a prop on one side; a comment
 * explaining why something is the way it is survives in one file and is lost
 * from the other. Six months later nobody can tell which version is the
 * considered one.
 *
 * This is not a monorepo and this script does not pretend to make one. It does
 * the one thing that actually stops the rot: it fails loudly the moment a file
 * that is supposed to be shared stops matching its twin.
 *
 *   npm run drift                 # against ../idile (or ../Oyun)
 *   npm run drift -- --other ../somewhere-else
 *
 * ── How "the same" is judged ──────────────────────────────────────────────
 * Not byte equality. The two apps have different names, nouns and routes, and
 * pretending otherwise would make the check useless. Each entry in
 * shared-files.json may declare substitutions — household ↔ journey, Ìdílé ↔
 * Oyun — that are applied to BOTH sides before comparing. A file passes when
 * the normalised texts match exactly.
 *
 * An entry may also be marked `"code": true`, which strips comments from both
 * sides first. That is the usual case here, because these files are heavily
 * commented on purpose and the comments are written for each app's own reader
 * — Oyun's draft-keeping talks about a letter to the baby, Ìdílé's about a
 * letter to a child, and both are right. Stripping them protects what the file
 * DOES while leaving how it explains itself alone.
 *
 * A difference the substitutions do not explain is a real difference, and is
 * either a bug in one app or a decision worth writing down. The script prints
 * the diff and exits non-zero so CI, or a person, has to look at it.
 */
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const HERE = path.resolve(fileURLToPath(import.meta.url), "..", "..");
const args = process.argv.slice(2);
const flag = (name) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? (args[i + 1] ?? true) : undefined;
};

const MANIFEST = path.join(HERE, "shared-files.json");
if (!fs.existsSync(MANIFEST)) {
  console.error(`No shared-files.json at ${MANIFEST}.`);
  process.exit(2);
}
const manifest = JSON.parse(fs.readFileSync(MANIFEST, "utf8"));

/**
 * Where the sibling lives. Worked out from this repo's own name rather than
 * stored in the manifest, so the two manifests are byte-identical and can
 * check each other.
 */
function siblingOf(dir) {
  const me = path.basename(dir).toLowerCase();
  return me === "oyun" ? "../idile" : "../Oyun";
}

const other = path.resolve(HERE, flag("other") ?? siblingOf(HERE));
if (!fs.existsSync(other)) {
  // Only one of the pair is checked out. That is an ordinary thing to do and
  // is not a failure — say where it looked and stop.
  console.log(`Sibling app not found at ${other} — nothing to compare.`);
  console.log(`Pass --other <path> if it lives somewhere else.`);
  process.exit(0);
}

const require = createRequire(import.meta.url);
const ts = require("typescript");

/**
 * The file with its comments taken out.
 *
 * Scanned with the TypeScript tokeniser rather than a regular expression,
 * because "// not a comment" inside a string literal is exactly the sort of
 * thing a regular expression gets wrong and a tokeniser cannot.
 */
function stripComments(text) {
  const scanner = ts.createScanner(
    ts.ScriptTarget.Latest,
    /* skipTrivia */ false,
    ts.LanguageVariant.JSX,
    text,
  );
  let out = "";
  let kind;
  while ((kind = scanner.scan()) !== ts.SyntaxKind.EndOfFileToken) {
    if (
      kind === ts.SyntaxKind.SingleLineCommentTrivia ||
      kind === ts.SyntaxKind.MultiLineCommentTrivia
    ) {
      continue;
    }
    out += text.slice(scanner.getTokenStart(), scanner.getTokenEnd());
  }
  // Comments leave blank lines behind; collapse them so their absence does not
  // itself read as a difference.
  return out.replace(/\n\s*\n+/g, "\n").trim();
}

/** Apply a file's declared substitutions to one side, both directions. */
function normalise(text, subs) {
  let out = text;
  for (const [a, b] of subs) {
    // Both sides are folded onto the first spelling, so the comparison does
    // not care which app it is reading.
    out = out.split(b).join(a);
  }
  return out;
}

const GLOBAL = manifest.substitutions ?? [];
let failed = 0;
let checked = 0;
const missing = [];

for (const entry of manifest.files) {
  // A pair names both spellings of a file that exists under a different name
  // in each app. Whichever one is here is "mine"; the other is the twin. Said
  // this way round so the two manifests stay byte-identical and can check each
  // other — an asymmetric entry would make that impossible.
  const pair = typeof entry !== "string" ? entry.pair : undefined;
  const rel = pair
    ? (fs.existsSync(path.join(HERE, pair[0])) ? pair[0] : pair[1])
    : typeof entry === "string"
      ? entry
      : entry.path;
  const subs = [...GLOBAL, ...((typeof entry === "string" ? [] : entry.substitutions) ?? [])];
  const mine = path.join(HERE, rel);
  // A twin may live under another name: Ìdílé calls them reminders and Oyun
  // calls them nudges, and each file is named for what its own app calls the
  // thing. The substitutions below make the two read the same.
  const theirRel = pair ? pair.find((x) => x !== rel) ?? rel : rel;
  const theirs = path.join(other, theirRel);

  if (!fs.existsSync(mine) || !fs.existsSync(theirs)) {
    missing.push(theirRel === rel ? rel : `${rel} ↔ ${theirRel}`);
    continue;
  }
  checked += 1;

  const codeOnly = typeof entry !== "string" && entry.code === true;
  const read = (f) => {
    const raw = fs.readFileSync(f, "utf8");
    return normalise(codeOnly ? stripComments(raw) : raw, subs);
  };
  const a = read(mine);
  const b = read(theirs);
  if (a === b) continue;

  failed += 1;
  console.log(`\n✗ ${rel}${codeOnly ? "  (code only — comments are allowed to differ)" : ""}`);
  const al = a.split("\n");
  const bl = b.split("\n");
  let shown = 0;
  for (let i = 0; i < Math.max(al.length, bl.length) && shown < 6; i++) {
    if (al[i] === bl[i]) continue;
    shown += 1;
    console.log(`    line ${i + 1}`);
    if (al[i] !== undefined) console.log(`      here:  ${al[i].trim().slice(0, 100)}`);
    if (bl[i] !== undefined) console.log(`      there: ${bl[i].trim().slice(0, 100)}`);
  }
  const total = al.filter((l, i) => l !== bl[i]).length;
  if (total > shown) console.log(`    …and ${total - shown} more differing line(s)`);
}

console.log(
  `\n${checked} shared file(s) checked against ${path.relative(path.dirname(HERE), other)}.`,
);
if (missing.length) {
  console.log(`\n${missing.length} listed file(s) missing on one side:`);
  for (const m of missing) console.log(`    ${m}`);
}

if (failed) {
  console.log(
    `\n${failed} file(s) have drifted.\n` +
      `Either put the fix in both apps, or — if the difference is deliberate —\n` +
      `add a substitution for it in shared-files.json so the reason is written\n` +
      `down rather than rediscovered in six months.`,
  );
  process.exit(1);
}
if (missing.length) process.exit(1);
console.log("Everything shared is still in step.");
