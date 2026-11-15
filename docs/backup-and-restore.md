# Backup and restore

Both apps keep everything a family has written in one Postgres database on
Neon, and every photograph in Vercel Blob. This page says what protects each,
how to get a family's data back, and a drill to rehearse it before it is ever
needed for real.

Check the specifics against your own Neon and Vercel dashboards. Plan names,
retention windows and menu wording change over time; the steps below were
written from Neon's branching model and should be confirmed the first time
the drill is run.

## What protects what

| What | Where | What protects it |
| --- | --- | --- |
| Everything written: journeys, houses, letters, prayers, papers, invitations | Neon Postgres | Neon's point-in-time restore (history retention), plus the export below |
| Photographs and videos | Vercel Blob | Nothing automatic. Deleting a post deletes its files |
| Papers (Ìdílé): scans | Vercel Blob, encrypted with `PAPERS_KEY` | As above, and unreadable without `PAPERS_KEY` |
| Secrets (`NEXTAUTH_SECRET`, `PAPERS_KEY`, `CRON_SECRET`, mail and push keys) | Vercel project settings | Keep a copy in a password manager. **Losing `PAPERS_KEY` loses every scanned paper for good.** |

## Restoring the database to a moment before something went wrong

Use this for a bad deploy, a mistaken bulk change, or a deletion that must be
undone for everyone.

1. Note the time just before the problem, in UTC. The health page
   (`/admintc/health`) shows when each job ran, which often pins it down.
2. In Neon, open the project, then **Branches**, and create a branch from the
   production branch **at that point in time**. This copies nothing and
   touches nothing in production.
3. Connect to the new branch with its own connection string and check the
   data is what you expect.
4. To go back for real, either:
   - **restore the production branch** to that moment from Neon's restore
     screen (everything written since is lost), or
   - **copy only what was lost** from the new branch into production with SQL,
     keeping everything written since. Prefer this when only one family or
     one table was affected.
5. Redeploy nothing. The apps read whatever the database holds.
6. Write down what happened in **What was done** in the admin centre.

## Getting back one family's things

Every family can download everything themselves from **Settings → Take
everything with you**. For a family that cannot, use step 2 above to make a
branch at a time before their loss, then copy their rows across with SQL.

## The drill: once a quarter, about 20 minutes

1. Pick any time from the last 24 hours.
2. Make a Neon branch at that time (step 2 above).
3. Point a local copy of the app at the branch (`DATABASE_URL` in
   `.env.local`) and run `npm run dev`.
4. Sign in as a demo account and confirm the latest entries before that time
   are there.
5. Delete the branch.
6. Record the date, who did it and how long it took in **What was done**.

If any step fails or surprises you, fix this page before the next drill.

## Before any risky change

- Schema changes are additive only and are applied by a production deploy
  (`scripts/db-sync.mjs`); previews never touch the database.
- `prisma db push` is never run with `--accept-data-loss`.
- For a data script, make a Neon branch first. It takes seconds and is the
  undo button.
