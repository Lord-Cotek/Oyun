import { ITEM_PATHS } from "@/lib/open-item";

/**
 * Where a notification that was written months ago should go today.
 *
 * ── Why a stored address needs this at all ───────────────────────────────
 * `href` is a column. It is written once, at the moment the notification is
 * made, and it is still sitting there in its original shape long after the
 * app has changed its mind about where things live. So giving posts a page
 * of their own fixed every notification made afterwards and not one of the
 * notifications already in somebody's bell — which, from the bell, looks
 * exactly like nothing having been fixed. Those are the ones people are
 * actually tapping.
 *
 * ── Why rewriting on the way out, rather than a migration ────────────────
 * A migration would have to be run, once, by somebody, against the real
 * database — and would have to be run again for every row written by an
 * instance that had not been redeployed yet. This is a pure function on the
 * way out: every old row is right the first time it is read, there is
 * nothing to remember to run, and nothing to half-finish.
 *
 * It costs one regex per notification shown, twenty at a time.
 *
 * ── What it cannot do ────────────────────────────────────────────────────
 * The oldest notifications say only "/life", with no id in them at all,
 * because at the time there was nothing better to say. There is no post to
 * recover from that and nothing here invents one: they go on opening Life,
 * which is what they have always done.
 */

/**
 * Every old address had the same shape: a room, sometimes a query, and a
 * fragment naming one thing — `#post-abc`, `#enc-abc`, `#letter-abc`.
 *
 * The room is deliberately not checked. It was the half nobody kept straight:
 * one letter was being announced from two different rooms depending on which
 * of the two people was being told, and neither room drew a letter anchor.
 * The fragment is the part that always told the truth about WHAT the
 * notification was about, so that is what is read.
 *
 * The id pattern is narrow on purpose — the characters a cuid can contain,
 * and no hyphen. Every id in both apps is a cuid, and refusing the hyphen is
 * what keeps a two-part name out of the trap: `#letter-reply-abc` is read as
 * no kind at all and passed through untouched, rather than being taken for a
 * letter whose id is "reply-abc". Anything this does not recognise keeps
 * opening the room it has always opened.
 */
const ITEM_ANCHOR = /^\/[^#?]*(?:\?[^#]*)?#([a-z]{1,16})-([A-Za-z0-9_]{1,64})$/;

export function freshHref(href: string | null | undefined): string | null {
  if (!href) return null;

  const m = ITEM_ANCHOR.exec(href);
  if (m) {
    // An unknown kind is left exactly as it was: better the room it has
    // always opened than a path this app has no page for. See ITEM_PATHS in
    // lib/open-item.ts — each app declares its own kinds there.
    const path = ITEM_PATHS[m[1]];
    if (path) return path(m[2]);
  }

  return href;
}
