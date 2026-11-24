import Link from "next/link";

/**
 * The Health room's sections. One room, so a family looking for "the
 * medicine" or "the scan results" does not have to remember which of five
 * places it was put. Sections arrive here as they are built.
 *
 * Two rows, because there are two kinds of thing in the room. The first row
 * is what the family keeps: cards, readings, medicines, tests, the report,
 * the doctor they share with. The second is what Oyun offers them: guides
 * and tools for eating, for the birth, for the weeks after, and the signs
 * that should not wait. Twelve pills in one row read as a wall; two short
 * rows with a word between them read as a room with two shelves.
 */
const RECORDS = [
  { key: "cards", label: "Cards", href: "/health" },
  { key: "log", label: "Log", href: "/health/log" },
  { key: "medicines", label: "Medicines", href: "/health/medicines" },
  { key: "tests", label: "Tests", href: "/health/tests" },
  { key: "report", label: "Report", href: "/health/report" },
  // Sharing with her own doctor or midwife — lib/clinician.ts.
  { key: "doctor", label: "Your doctor", href: "/health/doctor" },
] as const;

const GUIDES = [
  // What to eat and what to leave — lib/eating.ts.
  { key: "eating", label: "Eating", href: "/health/eating" },
  // The contraction timer and getting ready — lib/labour.ts.
  { key: "birth", label: "Birth", href: "/health/birth" },
  // The signs that should not wait — lib/when-to-call.ts. Marked apart from
  // the rest, because it is the one tab somebody opens frightened.
  { key: "call", label: "When to call", href: "/health/when-to-call" },
] as const;

export type HealthTab = (typeof RECORDS)[number]["key"] | (typeof GUIDES)[number]["key"];

function pillClass(key: string, on: boolean): string {
  const tone =
    key === "call"
      ? on
        ? "border-negative bg-negative/[0.1] text-negative"
        : "border-negative/50 text-negative hover:bg-negative/[0.06]"
      : on
        ? "border-accent bg-accent/[0.1] text-accent"
        : "border-border text-muted hover:border-accent hover:text-accent";
  return `inline-flex min-h-11 items-center rounded-full border px-4 font-mono text-xs transition-colors ${tone}`;
}

export function HealthTabs({ active }: { active: HealthTab }) {
  return (
    <nav aria-label="Health sections" className="mt-6 space-y-2.5">
      <div className="flex flex-wrap gap-2">
        {RECORDS.map((t) => (
          <Link key={t.key} href={t.href} aria-current={active === t.key ? "page" : undefined} className={pillClass(t.key, active === t.key)}>
            {t.label}
          </Link>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 font-mono text-[0.58rem] uppercase tracking-widest text-muted">Guides</span>
        {GUIDES.map((t) => (
          <Link key={t.key} href={t.href} aria-current={active === t.key ? "page" : undefined} className={pillClass(t.key, active === t.key)}>
            {t.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
