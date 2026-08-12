import Link from "next/link";
import { type CSSProperties } from "react";
import { Icon, type IconName } from "@/components/ui/Icon";

/** The category launcher palette. Each maps to a --tone-* token in globals.css,
 *  so the whole colorful system re-themes from one place. */
export type Tone = "amber" | "rose" | "gold" | "plum" | "sky" | "green";

/**
 * A colorful, tappable launcher tile — the home screen's app grid. The `tone`
 * washes the whole card (background, border, icon chip) from a single token,
 * and the tile presses in when tapped. Warm and maternal, but still on-brand.
 */
export function ActionTile({
  href,
  label,
  hint,
  icon,
  tone,
  className = "",
}: {
  href: string;
  label: string;
  hint?: string;
  icon: IconName;
  tone: Tone;
  className?: string;
}) {
  return (
    <Link
      href={href}
      style={{ ["--tone" as string]: `var(--tone-${tone})` } as CSSProperties}
      className={`group relative flex flex-col overflow-hidden rounded-2xl border p-4 transition-all duration-300 border-[color-mix(in_srgb,var(--tone)_28%,transparent)] bg-[color-mix(in_srgb,var(--tone)_13%,var(--surface))] hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--tone)_50%,transparent)] hover:shadow-lg hover:shadow-black/10 active:translate-y-0 active:scale-[0.97] ${className}`}
    >
      {/* soft corner glow */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-6 -top-8 h-20 w-20 rounded-full bg-[color-mix(in_srgb,var(--tone)_45%,transparent)] blur-2xl opacity-60 transition-opacity duration-300 group-hover:opacity-90"
      />
      <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--tone)_22%,transparent)] text-[var(--tone)]">
        <Icon name={icon} size={20} />
      </span>
      <span className="relative mt-3 font-serif text-lg leading-none text-ink">
        {label}
      </span>
      {hint && (
        <span className="relative mt-1.5 font-mono text-[0.64rem] leading-tight text-muted">
          {hint}
        </span>
      )}
    </Link>
  );
}
