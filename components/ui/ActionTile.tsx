import { Pressable } from "@/components/ui/Pressable";
import { Icon, type IconName } from "@/components/ui/Icon";

/**
 * A tappable launcher tile — the home screen's app grid.
 *
 * ── Why these are filled now ─────────────────────────────────────────────
 * These used to come in six colours, and a pass removed them all: of the six,
 * one was used nowhere and another once, so it was a leftover rather than a
 * system, and six mid-saturation hues at small sizes is exactly where contrast
 * quietly fails. Correct, and it went one step too far. What was left was four
 * identical white rectangles told apart by a 20px icon — the plainest thing on
 * the home screen, and the app's own face.
 *
 * The answer to six arbitrary hues was never none. It is four, drawn from one
 * warm family so the grid still reads as a single object, each carrying the
 * gloss — a light wash falling off at 55% over the colour — that makes a
 * surface look lit rather than printed. A tile is still told apart by its icon
 * and its label first; the colour is what makes the row worth looking at.
 *
 * The fills live in globals.css so each app supplies its own: Ìdílé's clay,
 * olive, ochre and sage; Oyun's honey, rose, teal and olive. Same material,
 * different hue — which is the whole sibling arrangement in one component.
 *
 * Cream on every fill clears AA for body text, and the hint line at 70% clears
 * it for large text. Measured, not chosen by eye.
 */

/**
 * Written out rather than built from a template literal, because Tailwind and
 * any CSS tooling find classes by reading this file as text. A class assembled
 * at runtime is a class that never reaches the stylesheet.
 */
const FILLS = ["fill-1", "fill-2", "fill-3", "fill-4"] as const;

export function ActionTile({
  href,
  label,
  hint,
  icon,
  tone = 0,
  className = "",
}: {
  href: string;
  label: string;
  hint?: string;
  icon: IconName;
  /** Which of the four fills. Callers pass the index of the tile in its row. */
  tone?: number;
  className?: string;
}) {
  return (
    <Pressable
      href={href}
      press="tile"
      className={`group relative flex min-h-32 flex-col justify-between rounded-[1.4rem] p-4 ${
        FILLS[((tone % 4) + 4) % 4]
      } ${className}`}
    >
      <span className="opacity-85">
        <Icon name={icon} size={26} />
      </span>
      <span>
        <span className="block font-serif text-xl leading-none">{label}</span>
        {hint && (
          <span className="mt-1 block font-serif text-[0.82rem] italic opacity-75">
            {hint}
          </span>
        )}
      </span>
    </Pressable>
  );
}
