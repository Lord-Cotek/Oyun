/**
 * Which four rooms sit in the phone's bottom bar.
 *
 * ── The rule ─────────────────────────────────────────────────────────────
 * The bar holds four rooms and "More". A fifth room does not fit: on a small
 * phone each slot would be about a thumb's width and the labels would touch.
 * So a room earns a place by being opened often, not by being loved.
 *
 * For the mother and her partner, Health is one of the four. A mother
 * measuring glucose or blood pressure opens it several times a day, at set
 * times, usually with one hand. Letters gave up its place for it: a letter is
 * written on a quiet evening, and is the first thing under More.
 *
 *   with faith      Home · Life · Worship · Health
 *   without         Home · Life · Health · Support   (the prayer room's plain name)
 *
 * Friends and relatives never see Health, so their bar is simply the first
 * four rooms they have, as it always was.
 *
 * Settings is never one of the four: it lives in the More sheet so that the
 * sheet — and Install and Sign out inside it — is always there to open.
 *
 * Plain data in, plain data out, so scripts/verify-care.mjs can hold it to
 * the table above on every deploy.
 */
const HOUSEHOLD_FAITH = ["/journey", "/life", "/worship", "/health"];
const HOUSEHOLD_GENERAL = ["/journey", "/life", "/health", "/prayer"];

export function pickTabs(
  hrefs: string[],
  who: { household: boolean; general: boolean },
): { primary: string[]; rest: string[] } {
  const pool = hrefs.filter((h) => h !== "/settings");
  let primary: string[];
  if (who.household && pool.includes("/health")) {
    const wanted = who.general ? HOUSEHOLD_GENERAL : HOUSEHOLD_FAITH;
    primary = wanted.filter((h) => pool.includes(h));
    // A room that is not offered today (none is, at the time of writing)
    // leaves its place to the next room in the menu's own order.
    for (const h of pool) {
      if (primary.length >= 4) break;
      if (!primary.includes(h)) primary.push(h);
    }
  } else {
    primary = pool.slice(0, 4);
  }
  const rest = pool.filter((h) => !primary.includes(h));
  return { primary, rest };
}
