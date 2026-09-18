/**
 * What a family's own photograph is "of".
 *
 * Every photograph in Ìdílé shipped with `alt=""`, which tells a screen reader
 * the image is decorative — that there is nothing there worth describing. For a
 * border or a gradient that is the right answer. For a picture of somebody's
 * daughter it is simply false, and it means a blind grandmother in the circle
 * scrolls past her grandchildren without being told they are there.
 *
 * We cannot describe what is in the picture; only the family knows that, and
 * asking every parent to write alt text for every photo would be a tax on the
 * thing this app exists to make easy. But we are not empty-handed either. We
 * know who posted it, when, how many there were, and — most usefully — what
 * they wrote alongside it. A person writing "Simi read Psalm 23 to her brother
 * tonight" and attaching two photographs has already described them better than
 * any generated caption would.
 *
 * So: the words the family wrote, attributed and placed. Where they wrote
 * nothing, we say plainly that it is a photograph from their diary and give the
 * date, which is honest about knowing nothing more, rather than inventing.
 *
 * Three rules this follows, from WCAG and from sense:
 *
 *  - Never start with "Image of" or "Photo of". A screen reader already says
 *    "image"; repeating it wastes the listener's time. We do use "Photo" where
 *    it distinguishes one of several, or a photo from a video.
 *  - Never leave it empty for content. Empty means decorative, and a family
 *    photograph is never decorative.
 *  - Keep it short enough to hear. A long body is trimmed at a sentence
 *    boundary where there is one.
 */

/** As much of the family's own words as is worth hearing before the point is made. */
const MAX_CHARS = 180;

function trim(text: string): string {
  const flat = text.replace(/\s+/g, " ").trim();
  if (flat.length <= MAX_CHARS) return flat;
  const cut = flat.slice(0, MAX_CHARS);
  // Prefer to stop at the end of a sentence, then at a word, then anywhere.
  const sentence = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("? "), cut.lastIndexOf("! "));
  if (sentence > MAX_CHARS * 0.5) return cut.slice(0, sentence + 1);
  const space = cut.lastIndexOf(" ");
  return (space > 0 ? cut.slice(0, space) : cut) + "…";
}

export interface MediaAltInput {
  /** What the family wrote alongside it — a post body, a note, a title. */
  said?: string | null;
  /** Who wrote it, where the surface names an author. */
  author?: string | null;
  /** A date in words, for the case where nothing was written. */
  when?: string | null;
  /** 1-based, when there are several. */
  index?: number;
  total?: number;
  /** Videos get described as videos. */
  isVideo?: boolean;
  /**
   * What kind of thing this was attached to, in the family's words —
   * "entry", "keepsake", "milestone". Used only when nothing was written.
   */
  kind?: string;
}

/** "a keepsake", "an entry" — the kind words vary, so the article has to. */
function article(word: string): string {
  return /^[aeiou]/i.test(word) ? "an" : "a";
}

export function mediaAlt({
  said,
  author,
  when,
  index,
  total,
  isVideo = false,
  kind = "entry",
}: MediaAltInput): string {
  const noun = isVideo ? "Video" : "Photo";
  const which =
    total && total > 1 && index ? `${noun} ${index} of ${total}` : noun;

  const words = said?.trim() ? trim(said) : "";
  const whose = author ? `${author}'s ${kind}` : `${article(kind)} ${kind}`;

  if (words) return `${which} from ${whose}: ${words}`;

  // Nothing was written. Say what we actually know and stop.
  return when ? `${which} from ${whose}, ${when}` : `${which} from ${whose}`;
}
