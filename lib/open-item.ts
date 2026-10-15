/**
 * The address of one thing, for every one of the things a notification can be
 * about.
 *
 * ── Why this file exists ─────────────────────────────────────────────────
 * Every notification used to be a room plus a fragment — `/prayer#prayer-…`,
 * `/journey#enc-…`, `/care#checkin-…`, `/appointments#appt-…` — and I measured
 * all of them rather than trusting them. Half did not work, in two different
 * ways:
 *
 *   not on the page at all   the room draws the five newest words, the fifty
 *                            newest prayers, the one latest check-in. Older
 *                            than that and the element the fragment names was
 *                            never rendered, so the browser had nothing to
 *                            scroll to and the reader got the top of a room.
 *
 *   there, but never jumped  the element existed 13,000 pixels down and the
 *                            page did not move. A browser acts on a fragment
 *                            when it parses the document; anything that
 *                            arrives after that — a client component's first
 *                            render, an image settling, a list hydrating —
 *                            is too late to be scrolled to.
 *
 * Both are the same mistake underneath: a fragment is a bet that the thing you
 * want is already on a page built for everything. A page for one thing is not
 * a bet. It has nothing above it to shift and nothing below it to be cut off
 * by a limit.
 *
 * ── Why the paths live together in one small, pure file ──────────────────
 * Three different kinds of code need to agree on these addresses: the actions
 * that write a notification, the bell that reads one back (see
 * lib/notify-href.ts), and search. When they lived in three places they
 * disagreed — the couple's letter was being announced at `/care#letter-…` to
 * one person and `/journey#letter-…` to the other, and neither room drew a
 * letter anchor.
 *
 * Nothing here touches the database, so a client component can import it
 * without dragging Prisma into the browser bundle.
 */

/** One post of the diary. See app/life/[id]/page.tsx. */
export function postPath(postId: string): string {
  return `/life/${postId}`;
}

/** One letter, to the baby or to each other. app/letters/[id]/page.tsx. */
export function letterPath(letterId: string): string {
  return `/letters/${letterId}`;
}

/** One prayer request, with its count and whatever the circle said. */
export function prayerPath(prayerId: string): string {
  return `/prayer/${prayerId}`;
}

/**
 * One word of encouragement.
 *
 * Under /journey rather than a room of its own because that is where words
 * are read, and the breadcrumb back should say the true thing.
 */
export function wordPath(encouragementId: string): string {
  return `/journey/word/${encouragementId}`;
}

/** One check-in, and how the circle answered it. */
export function checkInPath(checkInId: string): string {
  return `/care/checkin/${checkInId}`;
}

/** One appointment, with everything you can do to it. */
export function appointmentPath(appointmentId: string): string {
  return `/appointments/${appointmentId}`;
}

/**
 * One day of their own — a class, a shower — with whoever has answered.
 *
 * Under /appointments because that is the room days are kept in, even though
 * "your dates" and the appointment book share it.
 */
export function dayPath(eventId: string): string {
  return `/appointments/day/${eventId}`;
}

/**
 * The old fragment names, and what each one means today.
 *
 * ── Why a table and not a list of `if`s in the bell ──────────────────────
 * `href` is a stored column. Rows written a year ago still say
 * `/journey#enc-…`, and rewriting them on the way out (lib/notify-href.ts) is
 * the only way the notifications already sitting in somebody's bell get
 * fixed. That rewriting needs to know every kind there has ever been — and it
 * is a file shared between Ìdílé and Oyun, which do not have the same rooms or
 * quite the same things in them.
 *
 * So the shared half knows the SHAPE of an old address and nothing else; each
 * app declares its own kinds here. Adding a kind is one line in one file, and
 * the bell picks it up with no edit at all.
 *
 * The keys are exactly the prefixes that were written into the column — this
 * is a record of what is out there, so nothing may be renamed, only added to.
 */
export const ITEM_PATHS: Record<string, (id: string) => string> = {
  post: postPath,
  letter: letterPath,
  prayer: prayerPath,
  enc: wordPath,
  checkin: checkInPath,
  appt: appointmentPath,
  day: dayPath,
};
