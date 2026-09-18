/**
 * Checks every quoted verse in the app against the Scripture text we ship.
 *
 * There are well over a thousand quotations across the liturgies, the marriage
 * devotions, the memory verses and the rest. They were written by hand, and
 * until now nothing had ever compared a single one of them against the actual
 * text of the passage it claims to be. An app that puts words in God's mouth
 * and asks a family to read them aloud to their children owes them better than
 * "we were careful".
 *
 * The comparison is against the World English Bible under `data/bible/web/` —
 * the same public-domain text the reading plans already serve, so a verse in a
 * devotion and the same verse in the Bible reader are held to one standard.
 *
 * Every quotation is read out of the source with the TypeScript parser rather
 * than with a regular expression, so escapes, apostrophes and multi-line
 * strings are handled by the thing that already knows how.
 *
 * A quotation is allowed to be shorter than its reference: we often begin
 * mid-sentence or skip a clause with an ellipsis. What is NOT allowed is a
 * word that is not in the passage, a verse number that does not hold the
 * words, or a book and chapter that do not exist. Those are the three things
 * this looks for.
 *
 *   node scripts/verify-scripture.js            # summary + anything wrong
 *   node scripts/verify-scripture.js --all      # every entry, including the fine ones
 *   node scripts/verify-scripture.js --json     # machine-readable, for CI
 *
 * Exit code is 1 if anything is wrong, so it can stand in a pipeline.
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const ts = require(path.join(ROOT, "node_modules", "typescript"));
const BIBLE_DIR = path.join(ROOT, "data", "bible", "web");
const { BOOKS } = loadBooks();

/* ── where the quotations live ──────────────────────────────────────────── */

const SEARCH_DIRS = ["lib", "app", "components"];
const SKIP = new Set(["node_modules", ".next", "data"]);

function sources(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) sources(full, out);
    else if (/\.tsx?$/.test(entry.name)) out.push(full);
  }
  return out;
}

/* ── pulling {text, ref} pairs out of the source ─────────────────────────── */

const REF_KEYS = new Set(["ref", "reference"]);
const TEXT_KEYS = new Set(["text"]);

/**
 * Walks the file's syntax tree for object literals carrying both a reference
 * and a text, each written out in full as a string. A quotation built at run
 * time from variables is not something this can check, and is not something
 * the content files do.
 */
function quotationsIn(file) {
  const src = fs.readFileSync(file, "utf8");
  const tree = ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true);
  const found = [];

  const literal = (node) =>
    node && (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node))
      ? node.text
      : null;

  const keep = (node, ref, text) => {
    if (!ref || !text) return;
    found.push({
      file: path.relative(ROOT, file),
      line: tree.getLineAndCharacterOfPosition(node.getStart(tree)).line + 1,
      ref,
      text,
    });
  };

  const visit = (node) => {
    // `{ text: "…", ref: "…" }` — how the content pools are written.
    if (ts.isObjectLiteralExpression(node)) {
      let ref = null;
      let text = null;
      for (const prop of node.properties) {
        if (!ts.isPropertyAssignment(prop) || !prop.name) continue;
        const key = prop.name.getText(tree).replace(/['"]/g, "");
        if (REF_KEYS.has(key)) ref = literal(prop.initializer) ?? ref;
        if (TEXT_KEYS.has(key)) text = literal(prop.initializer) ?? text;
      }
      keep(node, ref, text);
    }

    // `<Verse text="…" reference="…" />` — how a page quotes one directly.
    // These are just as much Scripture as the pools, and were invisible until
    // this arm existed.
    if (ts.isJsxSelfClosingElement(node) || ts.isJsxOpeningElement(node)) {
      let ref = null;
      let text = null;
      for (const attr of node.attributes.properties) {
        if (!ts.isJsxAttribute(attr) || !attr.name || !attr.initializer) continue;
        const key = attr.name.getText(tree);
        const value = ts.isJsxExpression(attr.initializer)
          ? literal(attr.initializer.expression)
          : literal(attr.initializer);
        if (REF_KEYS.has(key)) ref = value ?? ref;
        if (TEXT_KEYS.has(key)) text = value ?? text;
      }
      keep(node, ref, text);
    }

    ts.forEachChild(node, visit);
  };

  visit(tree);
  return found;
}

/* ── the Scripture text ──────────────────────────────────────────────────── */

function loadBooks() {
  const books = new Map();
  if (!fs.existsSync(BIBLE_DIR)) {
    console.error(`No Scripture text at ${BIBLE_DIR}.`);
    process.exit(2);
  }
  for (const f of fs.readdirSync(BIBLE_DIR)) {
    if (!f.endsWith(".json")) continue;
    const book = JSON.parse(fs.readFileSync(path.join(BIBLE_DIR, f), "utf8"));
    if (book && book.name && Array.isArray(book.chapters)) {
      books.set(book.name.toLowerCase(), book);
    }
  }
  return { BOOKS: books };
}

/** The spellings people actually write, mapped to the book file's own name. */
const ALIASES = {
  psalms: "psalm",
  psalm: "psalm",
  "song of songs": "song of solomon",
  canticles: "song of solomon",
  ecclesiastes: "ecclesiastes",
  revelations: "revelation",
  "the revelation": "revelation",
};

function findBook(name) {
  const key = name.toLowerCase().replace(/\s+/g, " ").trim();
  const alias = ALIASES[key] ?? key;
  if (BOOKS.has(alias)) return BOOKS.get(alias);
  // "1st Samuel", "I Samuel", "1 Sam"
  const numbered = alias
    .replace(/^(i{1,3})\s+/, (_, n) => `${n.length} `)
    .replace(/^(\d)(st|nd|rd|th)\s+/, "$1 ");
  if (BOOKS.has(numbered)) return BOOKS.get(numbered);
  // A unique prefix is good enough: "Eph" → Ephesians, but "Jo" is ambiguous.
  const hits = [...BOOKS.keys()].filter((b) => b.startsWith(numbered));
  return hits.length === 1 ? BOOKS.get(hits[0]) : null;
}

/**
 * Turns "Romans 8:38-39", "John 1:1, 14", "Psalm 23" or "Matthew 5:3–10" into
 * the list of verses it names. Returns null with a reason when it cannot.
 */
function resolve(ref) {
  // "Matthew 10:37; Colossians 1:18" — two passages read as one. Resolve each
  // and hand back the verses end to end, in the order they are printed.
  if (ref.includes(";")) {
    const parts = ref.split(";").map((p) => p.trim()).filter(Boolean);
    const all = [];
    const names = [];
    for (const part of parts) {
      const one = resolve(part);
      if (one.error) return one;
      all.push(...one.verses);
      names.push(one.book);
    }
    return { book: names.join(" + "), verses: all };
  }

  const clean = ref.replace(/[‐-―]/g, "-").replace(/\s+/g, " ").trim();
  const m = clean.match(/^((?:\d\s*)?[A-Za-z][A-Za-z\s.]*?)\s+(\d[\d:,\-\s]*)$/);
  if (!m) return { error: "could not read the reference" };

  const book = findBook(m[1].replace(/\./g, "").trim());
  if (!book) return { error: `no book called "${m[1].trim()}"` };

  const verses = [];
  const note = (chapter, verse) => {
    const ch = book.chapters[chapter - 1];
    if (!ch) return `${book.name} has no chapter ${chapter}`;
    const v = ch[verse - 1];
    if (v === undefined) {
      return `${book.name} ${chapter} has ${ch.length} verses, not ${verse}`;
    }
    verses.push({ chapter, verse, text: v });
    return null;
  };

  let chapter = null;
  for (const part of m[2].split(",")) {
    const piece = part.trim();
    if (!piece) continue;

    // "3:15-18" or "3:15-4:2" or, after a comma, a bare "18" or "18-20"
    const span = piece.match(/^(?:(\d+):)?(\d+)(?:\s*-\s*(?:(\d+):)?(\d+))?$/);
    if (!span) return { error: `could not read "${piece}"` };

    const hasColon = piece.includes(":");
    if (span[1]) chapter = Number(span[1]);

    if (!hasColon && chapter === null) {
      // A whole chapter: "Psalm 23"
      chapter = Number(span[2]);
      const ch = book.chapters[chapter - 1];
      if (!ch) return { error: `${book.name} has no chapter ${chapter}` };
      const last = span[4] ? Number(span[4]) : chapter;
      for (let c = chapter; c <= last; c++) {
        const rows = book.chapters[c - 1];
        if (!rows) return { error: `${book.name} has no chapter ${c}` };
        rows.forEach((text, i) => verses.push({ chapter: c, verse: i + 1, text }));
      }
      continue;
    }

    const from = Number(span[2]);
    const toChapter = span[3] ? Number(span[3]) : chapter;
    const to = span[4] ? Number(span[4]) : from;

    if (toChapter === chapter) {
      for (let v = from; v <= to; v++) {
        const bad = note(chapter, v);
        if (bad) return { error: bad };
      }
    } else {
      const rows = book.chapters[chapter - 1];
      if (!rows) return { error: `${book.name} has no chapter ${chapter}` };
      for (let v = from; v <= rows.length; v++) {
        const bad = note(chapter, v);
        if (bad) return { error: bad };
      }
      for (let c = chapter + 1; c < toChapter; c++) {
        const mid = book.chapters[c - 1];
        if (!mid) return { error: `${book.name} has no chapter ${c}` };
        mid.forEach((text, i) => verses.push({ chapter: c, verse: i + 1, text }));
      }
      for (let v = 1; v <= to; v++) {
        const bad = note(toChapter, v);
        if (bad) return { error: bad };
      }
      chapter = toChapter;
    }
  }

  if (!verses.length) return { error: "no verses named" };
  return { book: book.name, verses };
}

/* ── comparing the words ─────────────────────────────────────────────────── */

/** Down to bare words, so punctuation and curly quotes cannot cause a fuss. */
function words(s) {
  return s
    .replace(/[‘’ʼ]/g, "'")
    .replace(/[“”]/g, '"')
    .toLowerCase()
    .replace(/[^a-z0-9']+/g, " ")
    .replace(/'/g, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

/** How much of the quote appears in the passage, in the passage's own order. */
function coverage(quote, passage) {
  // Longest common subsequence, over words. The passages are short enough that
  // the straightforward table is fast and obviously right.
  const a = quote;
  const b = passage;
  let prev = new Array(b.length + 1).fill(0);
  for (let i = 1; i <= a.length; i++) {
    const row = new Array(b.length + 1).fill(0);
    for (let j = 1; j <= b.length; j++) {
      row[j] = a[i - 1] === b[j - 1] ? prev[j - 1] + 1 : Math.max(prev[j], row[j - 1]);
    }
    prev = row;
  }
  return a.length ? prev[b.length] / a.length : 1;
}

/** Is every run of the quote present, in order, as a run of the passage? */
function runsInOrder(segments, passage) {
  let at = 0;
  for (const seg of segments) {
    if (!seg.length) continue;
    let found = -1;
    for (let i = at; i + seg.length <= passage.length; i++) {
      let same = true;
      for (let k = 0; k < seg.length; k++) {
        if (passage[i + k] !== seg[k]) {
          same = false;
          break;
        }
      }
      if (same) {
        found = i + seg.length;
        break;
      }
    }
    if (found < 0) return false;
    at = found;
  }
  return true;
}

/** Curly quotes that open and never close, or close and never open. */
function looseQuoteMarks(text) {
  let depth = 0;
  for (const ch of text) {
    if (ch === "“") depth++;
    else if (ch === "”") depth--;
    if (depth < 0) return true;
  }
  return depth !== 0;
}

function judge(entry) {
  const resolved = resolve(entry.ref);
  if (resolved.error) return { ...entry, verdict: "bad-reference", why: resolved.error };

  const passage = words(resolved.verses.map((v) => v.text).join(" "));
  const segments = entry.text
    .split(/…|\.\.\./)
    .map(words)
    .filter((s) => s.length);
  const quote = segments.flat();

  const loose = looseQuoteMarks(entry.text);

  if (runsInOrder(segments, passage)) {
    return { ...entry, verdict: loose ? "stray-quote-mark" : "ok" };
  }

  const share = coverage(quote, passage);
  if (share >= 0.92) {
    return {
      ...entry,
      verdict: "reworded",
      why: `${Math.round(share * 100)}% of the words are there, but not as one run`,
    };
  }
  if (share >= 0.5) {
    return {
      ...entry,
      verdict: "drifted",
      why: `only ${Math.round(share * 100)}% of the quoted words are in ${entry.ref}`,
      passage: resolved.verses.map((v) => v.text).join(" "),
    };
  }
  return {
    ...entry,
    verdict: "wrong-passage",
    why: `${Math.round(share * 100)}% match — ${entry.ref} does not say this`,
    passage: resolved.verses.map((v) => v.text).join(" "),
  };
}

/* ── running it ──────────────────────────────────────────────────────────── */

const ORDER = [
  "bad-reference",
  "wrong-passage",
  "drifted",
  "reworded",
  "stray-quote-mark",
  "ok",
];
const HEADINGS = {
  "bad-reference": "The reference itself does not resolve",
  "wrong-passage": "The passage does not say this",
  drifted: "Some of this is not in the passage",
  reworded: "The words are there but rearranged — another translation, probably",
  "stray-quote-mark": "Quotation marks that open and never close",
  ok: "Faithful to the passage",
};
/** Anything above this line is a real problem and fails the run. */
const FAILING = new Set(["bad-reference", "wrong-passage", "drifted"]);

function main() {
  const args = process.argv.slice(2);
  const asJson = args.includes("--json");
  const showAll = args.includes("--all");

  const files = SEARCH_DIRS.flatMap((d) => sources(path.join(ROOT, d)));
  const entries = files.flatMap(quotationsIn);
  const judged = entries.map(judge);

  const byVerdict = new Map(ORDER.map((v) => [v, []]));
  for (const r of judged) byVerdict.get(r.verdict).push(r);

  if (asJson) {
    console.log(JSON.stringify({ checked: judged.length, results: judged }, null, 2));
  } else {
    console.log(`\nScripture check — ${judged.length} quotations in ${files.length} files\n`);
    for (const verdict of ORDER) {
      const rows = byVerdict.get(verdict);
      if (!rows.length) continue;
      const label = `${HEADINGS[verdict]} — ${rows.length}`;
      if (verdict === "ok" && !showAll) {
        console.log(`  ${label}`);
        continue;
      }
      console.log(`\n${label}\n${"─".repeat(label.length)}`);
      for (const r of rows) {
        console.log(`  ${r.file}:${r.line}  ${r.ref}`);
        if (r.why) console.log(`      ${r.why}`);
        if (verdict !== "ok") {
          console.log(`      quoted:  ${r.text.slice(0, 150)}`);
        }
        if (r.passage) console.log(`      passage: ${r.passage.slice(0, 150)}`);
      }
    }
  }

  const broken = judged.filter((r) => FAILING.has(r.verdict)).length;
  if (!asJson) {
    console.log(
      broken
        ? `\n${broken} quotation${broken === 1 ? "" : "s"} need a person to look at ${broken === 1 ? "it" : "them"}.\n`
        : "\nEvery quotation matches the passage it names.\n",
    );
  }
  process.exit(broken ? 1 : 0);
}

main();
