/**
 * Midnight at the start of this day.
 *
 * Its own copy rather than an import from lib/events-db.ts, which imports this
 * file — a cycle here would be a rule that sometimes loads and sometimes does
 * not, which is the worst possible shape for a rule like this one.
 *
 * It must stay IDENTICAL to the one in lib/events-db.ts, UTC and all. If the
 * two disagreed about when a day starts, a surprise would appear an hour
 * early somewhere in the world, and that is the one hour it matters.
 */
function startOfDay(d: Date): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

/**
 * A day kept from the rest of the household until it has happened.
 *
 * ── What this is for ─────────────────────────────────────────────────────
 * A baby shower she is not supposed to know about. Oyun shows the household
 * everything by design — which is right for a pregnancy the two of them are
 * walking through together, and exactly wrong for the one day somebody is
 * arranging FOR her. Without this the only way to plan it is somewhere else,
 * and then the guest list, the replies and the reminders are somewhere else
 * too.
 *
 * It is planned with whoever else is helping — her sister, her mother, the
 * friend organising the food — and hidden from the one it is for.
 *
 * ── Why it un-hides itself ───────────────────────────────────────────────
 * The morning after, it simply joins the journey like any other day. That is
 * the difference between a SURPRISE and a SECRET, and it is deliberate: this
 * should help somebody throw a shower nobody saw coming, and should not
 * quietly become a place to keep things from the person you are carrying a
 * child with. It also means the day ends up where it belongs — in the
 * family's own record of these months, with the photographs.
 *
 * ── The one rule ─────────────────────────────────────────────────────────
 * Spread surpriseScope(viewerId) into EVERY query that reads events for
 * somebody. There is no second rule and no place that is "obviously fine" —
 * the export is the one people forget, and the export is precisely where a
 * spouse who downloads "everything" would find the party.
 *
 * `npm run verify:surprise` refuses a query that has not got it.
 */

/**
 * The where-fragment that hides other people's surprises.
 *
 * Three ways a day is visible: it is not a surprise at all; it is yours; or
 * the day itself is behind us. Written as an OR so one comparison does all
 * three, and meant to be placed inside an explicit AND — several of these
 * queries already carry an OR of their own, and two ORs at the same level
 * would quietly widen each other.
 */
export function surpriseScope(viewerId: string, now = new Date()) {
  return {
    OR: [
      { surprise: false },
      { createdById: viewerId },
      // Whoever was let in on it. The join is deliberate: the test belongs in
      // the query with everything else, so a read path that forgets it fails
      // loudly rather than quietly showing somebody their own party.
      { planners: { some: { userId: viewerId } } },
      { at: { lt: startOfDay(now) } },
    ],
  };
}

/**
 * True while this day is still being kept from the house.
 *
 * For the screen rather than the query — what the row says about itself, and
 * whether to draw the marker.
 */
export function stillASurprise(
  e: { surprise: boolean; at: Date },
  now = new Date(),
): boolean {
  return e.surprise && e.at >= startOfDay(now);
}

/**
 * Whether this person may see a day at all.
 *
 * The same three tests as the query, for the places that already hold a row
 * and need to check it — editing, deleting, a reminder about to be sent.
 */
export function maySee(
  e: {
    surprise: boolean;
    at: Date;
    createdById: string;
    planners?: { userId: string }[];
  },
  viewerId: string,
  now = new Date(),
): boolean {
  if (!stillASurprise(e, now)) return true;
  return (
    e.createdById === viewerId ||
    (e.planners ?? []).some((p) => p.userId === viewerId)
  );
}

/**
 * Everyone who is in on this day: the one who thought of it and the ones they
 * asked for help.
 *
 * The reminder loop addresses on this, and so does anything else that needs to
 * tell the people planning something without telling the person it is for.
 */
export function inOnIt(e: {
  createdById: string;
  planners?: { userId: string }[];
}): string[] {
  return [e.createdById, ...(e.planners ?? []).map((p) => p.userId)];
}

/** How many may be let in besides the one who started it. */
export const PLANNERS_MAX = 8;

/**
 * Why a surprise may not repeat every year.
 *
 * A repeating day keeps its original date for ever, so `at` is always in the
 * past and the rule above would show it to everybody on the second year —
 * the surprise would hold for one birthday and silently fail on the next.
 * Rather than special-case that, the two are refused together.
 */
export const SURPRISE_CANNOT_REPEAT =
  "A surprise cannot repeat every year — make it a single day, and add next year's when it comes.";

/** And it is nobody else's business, so it never goes to the compound. */
export const SURPRISE_CANNOT_BE_SHARED =
  "A surprise is not shared with the compound.";
