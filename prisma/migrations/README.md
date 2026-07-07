# Database migrations

The Oyun database is managed with a **DB-free, paste-into-Neon** workflow, so
schema changes never require a local Postgres connection.

## Files

- `0_init/migration.sql` — the baseline: the full DDL that created the initial
  schema. Already applied to production (run once in the Neon SQL Editor).
- `applied.prisma` — a snapshot of `prisma/schema.prisma` **as it currently
  exists in the database**. Used to compute DB-free deltas. Keep it committed.
- `migration_lock.toml` — standard Prisma lock (provider = postgresql).

## Changing the schema (the one-liner workflow)

1. Edit `prisma/schema.prisma`.
2. Generate the delta SQL (no database needed):
   ```bash
   npm run db:diff
   ```
   This prints only the incremental SQL (e.g. `ALTER TABLE …`).
3. Paste that SQL into the **Neon SQL Editor** and run it.
4. Record the new applied state so the next diff is correct:
   ```bash
   npm run db:snapshot   # copies schema.prisma -> migrations/applied.prisma
   ```
5. Commit `prisma/schema.prisma` and `prisma/migrations/applied.prisma`
   (optionally add the delta SQL as a new `migrations/<n>_<name>/migration.sql`
   for history).

## Other commands

- `npm run db:baseline` — regenerate the **full** DDL from empty (for standing
  up a brand-new database from scratch). Paste the whole thing into Neon.
- `npm run db:push` — if you ever have a direct `DATABASE_URL`, push the schema
  directly instead of pasting.

The app reads `DATABASE_URL`; the Neon SQL Editor connects directly, so pooled
vs. unpooled connection strings don't matter for these migration steps.
