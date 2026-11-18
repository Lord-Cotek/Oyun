import Link from "next/link";

/**
 * The Health room's sections. One room, so a family looking for "the
 * medicine" or "the scan results" does not have to remember which of five
 * places it was put. Sections arrive here as they are built.
 */
const TABS = [
  { key: "cards", label: "Cards", href: "/health" },
  { key: "log", label: "Log", href: "/health/log" },
] as const;

export type HealthTab = (typeof TABS)[number]["key"];

export function HealthTabs({ active }: { active: HealthTab }) {
  return (
    <nav aria-label="Health sections" className="mt-6 flex flex-wrap gap-2">
      {TABS.map((t) => (
        <Link
          key={t.key}
          href={t.href}
          aria-current={active === t.key ? "page" : undefined}
          className={`inline-flex min-h-11 items-center rounded-full border px-4 font-mono text-xs transition-colors ${
            active === t.key ? "border-accent bg-accent/[0.1] text-accent" : "border-border text-muted hover:border-accent hover:text-accent"
          }`}
        >
          {t.label}
        </Link>
      ))}
    </nav>
  );
}
