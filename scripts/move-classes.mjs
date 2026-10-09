/**
 * A one-off move: classes stop being appointments and become days of her own.
 *
 * ── Why this cannot simply be a schema change ────────────────────────────
 * CLASS was in AppointmentKind and is now only in JourneyEventKind. Dropping a
 * value from a Postgres enum while rows still use it either fails the deploy
 * or, worse, takes the rows with it. So every class already written down has to
 * move BEFORE the enum loses the value — which is why this runs in the build,
 * ahead of `prisma db push`.
 *
 * ── Nothing is lost ──────────────────────────────────────────────────────
 * An appointment carries things a day of her own does not: who to ask for, the
 * questions to take into the room, what happened afterwards. Those columns have
 * nowhere to go, so rather than drop them they are folded into the new day's
 * note, each under its own word. A class she wrote three questions on still has
 * those three questions after this runs; they are prose now instead of a field.
 *
 * ── Safe to run again, and on a database that has never seen a class ─────
 * It matches on `kind::text`, which stays valid after the enum value is gone
 * and simply matches nothing. The insert ignores an id it has already written,
 * and the delete only removes what was copied, inside one transaction. On a
 * brand-new database, where the tables do not exist yet, it does nothing at all
 * rather than failing the first deploy.
 *
 * Once this has run against production it is doing nothing on every build, and
 * the line in `package.json` can come out.
 */
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

try {
  const [{ ready }] = await db.$queryRawUnsafe(`
    SELECT (to_regclass('public."Appointment"') IS NOT NULL
        AND to_regclass('public."JourneyEvent"') IS NOT NULL) AS ready
  `);
  if (!ready) {
    console.log("[move-classes] tables not there yet — nothing to do.");
  } else {
    const [{ count }] = await db.$queryRawUnsafe(
      `SELECT count(*)::int AS count FROM "Appointment" WHERE kind::text = 'CLASS'`,
    );
    if (count === 0) {
      console.log("[move-classes] no classes filed as appointments.");
    } else {
      await db.$transaction([
        db.$executeRawUnsafe(`
          INSERT INTO "JourneyEvent"
            (id, "journeyId", "createdById", kind, title, at, "hasTime",
             "where", note, "cancelledAt", "createdAt", "updatedAt")
          SELECT
            a.id,
            a."journeyId",
            a."createdById",
            'CLASS'::"JourneyEventKind",
            COALESCE(NULLIF(btrim(a.title), ''), 'Class'),
            a.at,
            a."hasTime",
            a."where",
            NULLIF(concat_ws(E'\\n\\n',
              NULLIF(btrim(a.notes), ''),
              CASE WHEN NULLIF(btrim(a.who), '') IS NOT NULL
                   THEN 'Who: ' || btrim(a.who) END,
              CASE WHEN NULLIF(btrim(a.questions), '') IS NOT NULL
                   THEN 'Questions you meant to ask: ' || btrim(a.questions) END,
              CASE WHEN a."attendedAt" IS NOT NULL
                   THEN 'Went on ' || to_char(a."attendedAt", 'DD Mon YYYY') END,
              CASE WHEN NULLIF(btrim(a.outcome), '') IS NOT NULL
                   THEN 'Afterwards: ' || btrim(a.outcome) END
            ), ''),
            a."cancelledAt",
            a."createdAt",
            now()
          FROM "Appointment" a
          WHERE a.kind::text = 'CLASS'
          ON CONFLICT (id) DO NOTHING
        `),
        db.$executeRawUnsafe(
          `DELETE FROM "Appointment" WHERE kind::text = 'CLASS'`,
        ),
      ]);
      console.log(`[move-classes] moved ${count} class(es) to days of her own.`);
    }
  }
} catch (err) {
  // Loud, and fatal. Dropping the enum value after a failed move is how the
  // days would actually be lost, so the build must stop here instead.
  console.error("[move-classes] FAILED — not safe to continue.", err);
  process.exit(1);
} finally {
  await db.$disconnect();
}
