/**
 * How a day is said, in the one place both sides can read it.
 *
 * ── Why it is not in DiaryBook any more ──────────────────────────────────
 * It was, and the page for one day imported it from there — which built
 * cleanly and then threw `is not a function` on every request. DiaryBook is a
 * client component, so what a server component imports from it is a
 * reference for the browser to resolve, not a function to call. The build
 * cannot catch that; only opening the page does, which is why the page was
 * opened before this was called finished.
 *
 * Pure, server-safe, no React. The diary and the day's own page both read it,
 * so "Saturday 18 October, 15:00" is phrased identically wherever it appears.
 *
 * Only the two the diary and the page agree on word for word live here. The
 * shorter form the diary uses inside a month it has already named stays in
 * the diary, because the two apps punctuate it differently and quietly
 * changing one of them was not part of fixing a notification.
 *
 * Everything is formatted in UTC on purpose: a day in this diary is a day,
 * not an instant, and shifting it into the reader's zone is how "Saturday"
 * becomes "Friday night" for somebody travelling.
 */

export function clockRange(atISO: string, endsAtISO: string | null): string {
  const t = (iso: string) =>
    new Date(iso).toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
    });
  return endsAtISO ? `${t(atISO)} – ${t(endsAtISO)}` : t(atISO);
}

/**
 * "Saturday 18 October 2026, 15:00" — with the year, for an invitation and
 * for the page a notification opens, where there is nothing around it to say
 * which year is meant.
 */
export function whenWords(
  atISO: string,
  hasTime: boolean,
  endsAtISO: string | null,
): string {
  const day = new Date(atISO).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
  return hasTime ? `${day}, ${clockRange(atISO, endsAtISO)}` : day;
}
