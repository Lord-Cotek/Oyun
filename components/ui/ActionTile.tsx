import Link from "next/link";
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
    <Link
      href={href}
      className={`surface-premium group relative flex flex-col rounded-2xl border border-border p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/50 active:translate-y-0 active:scale-[0.97] ${className}`}
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
    </Link>
  );
}
