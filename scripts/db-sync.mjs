/**
 * Bring the database up to the schema — but only from a production build.
 *
 * ── Why ──────────────────────────────────────────────────────────────────
 * The build used to run `prisma db push` on every deploy, and a preview
 * deploy (any branch, any pull request) builds with the same DATABASE_URL as
 * production. So an experiment on a branch could change the live database
 * that every family is using, before anybody had decided to ship it.
 *
 * Now: on Vercel, only VERCEL_ENV=production touches the database. A preview
 * builds and runs against whatever the database already is; if its schema is
 * ahead, the preview is what breaks, never production. Off Vercel (a laptop,
 * a CI box) it runs as before, because there the person running it chose to.
 *
 * Any data scripts named on the command line run first, in order, under the
 * same rule — see scripts/move-classes.mjs for why one has to come before
 * the schema push.
 *
 * `prisma db push` is never given --accept-data-loss: a change that would
 * drop a column or a table stops the deploy instead of taking the data.
 */
import { spawnSync } from "node:child_process";

const onVercel = !!process.env.VERCEL;
const env = process.env.VERCEL_ENV ?? "";

if (onVercel && env !== "production") {
  console.log(`[db-sync] ${env || "non-production"} build — leaving the database exactly as it is.`);
  process.exit(0);
}

function run(cmd, args) {
  console.log(`[db-sync] ${cmd} ${args.join(" ")}`);
  const r = spawnSync(cmd, args, { stdio: "inherit", shell: process.platform === "win32" });
  if (r.status !== 0) {
    console.error(`[db-sync] stopped: ${cmd} ${args.join(" ")} failed.`);
    process.exit(r.status ?? 1);
  }
}

for (const script of process.argv.slice(2)) run("node", [script]);
run("npx", ["prisma", "db", "push", "--skip-generate"]);
