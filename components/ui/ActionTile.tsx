import { Pressable } from "@/components/ui/Pressable";
import { Icon, type IconName } from "@/components/ui/Icon";

/**
 * A tappable launcher tile — the home screen's app grid.
 *
 * These used to come in six colours. The file above this one said "one accent
 * that earns it" and then declared six category tones directly underneath, and
 * of those six, `sky` was used nowhere at all and `plum` once. It was not a
 * system, it was a leftover — and six mid-saturation hues at small sizes on
 * tinted washes is exactly where contrast quietly fails.
 *
 * A tile is told apart by its icon and its label, which is how a person finds
 * "Worship" — not by remembering that worship is the amber one. So every tile
 * is the same surface now, and the one accent does the work of marking the
 * icon. The press stays: a control that answers the thumb is worth more than a
 * control that is a different colour.
 *
 * The press now comes from Pressable rather than from an `active:` utility.
 * These are the first things a thumb lands on after the app opens, and on an
 * iPhone `:active` arrives a beat late or not at all while the browser decides
 * whether the finger meant to scroll. They are also the shortest surfaces on
 * the home screen, so `min-h-24` holds the row even where a tile has no hint.
 */
export function ActionTile({
  href,
  label,
  hint,
  icon,
  className = "",
}: {
  href: string;
  label: string;
  hint?: string;
  icon: IconName;
  className?: string;
}) {
  return (
    <Pressable
      href={href}
      press="tile"
      className={`surface-premium group relative flex min-h-24 flex-col rounded-2xl border border-border p-4 hover:-translate-y-0.5 hover:border-accent/50 ${className}`}
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/[0.12] text-accent transition-colors duration-300 group-hover:bg-accent/20">
        <Icon name={icon} size={20} />
      </span>
      <span className="mt-3 font-serif text-lg leading-none text-ink">
        {label}
      </span>
      {hint && (
        <span className="mt-1.5 font-mono text-[0.64rem] leading-tight text-muted">
          {hint}
        </span>
      )}
    </Pressable>
  );
}
