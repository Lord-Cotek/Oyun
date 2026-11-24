/**
 * Recovering from what goes wrong — checked on every deploy.
 *
 * Two small promises, both about things that fail outside Oyun's own code:
 *
 *  - The framework's page router has a known fault (React error #310) that
 *    leaves a page broken until it is reloaded. The error screens reload
 *    once for it, and never loop — lib/report-error.ts.
 *  - The mail provider refuses requests that come too fast (429). Sends are
 *    spaced and a refused one is tried again — lib/email.ts.
 *
 * Run with `npm run verify:recovery`.
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

const R = jiti(path.join(root, "lib/report-error.ts"));

console.log("Which errors a reload cures");
check(R.isRouterFault({ message: "Minified React error #310; visit https://react.dev/errors/310 for the full message" }), "the framework's router fault, as production words it");
check(R.isRouterFault({ message: "Rendered more hooks than during the previous render." }), "and as development words it");
check(!R.isRouterFault({ message: "Minified React error #425; visit https://react.dev/errors/425" }) && !R.isRouterFault({ message: "Cannot read properties of undefined" }) && !R.isRouterFault(null) && !R.isRouterFault({}), "nothing else — every other error still shows its page");

console.log("One reload, never a loop");
const withStorage = (store, fn) => {
  const before = globalThis.sessionStorage;
  globalThis.sessionStorage = store;
  try { return fn(); } finally { globalThis.sessionStorage = before; }
};
const mem = () => { const m = new Map(); return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)) }; };
const t0 = 1_800_000_000_000;
const s1 = mem();
check(withStorage(s1, () => R.claimReload(t0)) === true, "the first time, the page may reload");
check(withStorage(s1, () => R.claimReload(t0 + 5_000)) === false, "if the fault comes straight back, it does not reload again");
check(withStorage(s1, () => R.claimReload(t0 + 29_000)) === false, "nor at any point in the next half minute");
check(withStorage(s1, () => R.claimReload(t0 + 31_000)) === true, "later, a new fault gets its own one reload");
check(withStorage(undefined, () => R.claimReload(t0)) === false, "with nowhere to remember that it reloaded, it does not reload at all");
check(withStorage({ getItem() { throw new Error("blocked"); }, setItem() { throw new Error("blocked"); } }, () => R.claimReload(t0)) === false, "the same when the browser blocks storage");
check(withStorage({ getItem: () => null, setItem() {} }, () => R.claimReload(t0)) === false, "and when storage silently keeps nothing");

console.log("What is reported");
const stack = "Error: Minified React error #310\n    at aH (https://oyun.example/_next/static/chunks/fd9d1056-abc.js?dpl=secret123:1:45000)\n    at Router (https://oyun.example/_next/static/chunks/117-xyz.js:1:1234)";
const short = R.shortStack(stack);
check(short === "aH (chunks/fd9d1056-abc.js:1:45000) < Router (chunks/117-xyz.js:1:1234)", "where in the code, as file and position");
check(!/oyun\.example|secret123|\?/.test(short), "with the site's address and anything after a ? taken off");
check(R.shortStack("x\n" + Array.from({ length: 80 }, (_, i) => `    at fn${i} (https://a.b/_next/static/chunks/c-${"z".repeat(40)}.js:1:${i})`).join("\n")).length <= 900 && R.shortStack(null) === null && R.shortStack("no frames here") === null, "cut short, and nothing when there is no stack");

console.log("How the screens and the server use it");
for (const f of ["app/error.tsx", "app/global-error.tsx"]) {
  const src = read(f);
  const claim = src.indexOf("fault && claimReload()"), reload = src.indexOf("window.location.reload()");
  check(claim > 0 && reload > claim && (src.match(/window\.location\.reload\(\)/g) ?? []).length === 1, `${f}: reloads only for the fault, only once allowed, in one place`);
  check(/reportError\(error, \{ recovered: true \}\)/.test(src) && /if \(fault\) setStuck\(true\)/.test(src), `${f}: says it recovered — and shows the usual page if it could not`);
}
const route = read("app/api/errors/route.ts");
check(/recovered: b\.recovered === true && isRouterFault\(\{ message \}\)/.test(route), "the server believes “recovered” only for that one fault");
check(/split\("\?"\)\[0\]/.test(route), "a reported page is still a path only, never a query string");
const health = read("lib/health.ts");
check(/if \(!input\.recovered && \(await allow\("alert:errors", 1, HOUR\)\)\)/.test(health), "a recovered fault is written down but nobody is emailed; every other error still alerts");

console.log("Email sent too fast");
const email = read("lib/email.ts");
check(/if \(res\.status !== 429 \|\| attempt >= 2\) return res;/.test(email), "only “too many requests” is tried again, and twice at most");
check(/nextMailSlot = Math\.max\(now, nextMailSlot\) \+ MAIL_GAP_MS/.test(email) && /const MAIL_GAP_MS = (\d+)/.test(email) && Number(email.match(/const MAIL_GAP_MS = (\d+)/)[1]) >= 110, "sends are spaced to stay under ten a second");
check((email.match(/await fetch\(/g) ?? []).length === 1 && (email.match(/await postMail\(/g) ?? []).length === 2, "every email, single or batch, goes through that one door");

if (failed) {
  console.error(`\n${failed} check(s) failed — a known outside fault would reach a family again.`);
  process.exit(1);
}
console.log("\n  ok — Oyun recovers from the faults that are not its own.");
