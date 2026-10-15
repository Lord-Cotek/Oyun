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
 * `/life?year=2026#post-abc` and `/life#post-abc` both became `/life/abc`.
 *
 * The id pattern is deliberately narrow — cuid characters only — so that a
 * stored value that is not one of ours is passed through untouched rather
 * than being spliced into a path.
 */
const POST_ANCHOR = /^\/life(?:\?[^#]*)?#post-([A-Za-z0-9_-]{1,64})$/;

export function freshHref(href: string | null | undefined): string | null {
  if (!href) return null;
  const post = POST_ANCHOR.exec(href);
  if (post) return `/life/${post[1]}`;
  return href;
}
