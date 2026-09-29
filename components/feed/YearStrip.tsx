import Link from "next/link";
import { type DiaryYear } from "@/lib/story";

/**
 * Every year the house has written in, so the whole diary is one tap away.
 *
 * Before this, the diary was the last forty entries and nothing else. There was
 * no page two. A family ten years in could reach about six weeks of its own
 * life, and the rest was still in the database, still theirs, and completely
 * unreachable — which is a worse failure than being slow.
 *
 * Deliberately a row of plain links rather than a date picker or an infinite
 * scroll: a year is how people actually remember ("the year Dami was ill"), the
 * links work before any script arrives, and each one is a real URL a person can
 * send to their spouse.
 *
 * It stays out of the way until it is needed. One year of entries means there
 * is nothing to navigate, so nothing is drawn.
 */
export function YearStrip({
  years,
  active,
}: {
  years: DiaryYear[];
  /** The year being shown, or undefined for the latest entries. */
  active?: number;
}) {
  if (years.length < 2) return null;

  const chip = (on: boolean) =>
    `rounded-lg border px-3 py-1.5 font-mono text-xs transition-colors ${
      on
        ? "border-accent bg-accent/10 text-accent"
        : "border-border text-muted hover:border-accent/50 hover:text-ink"
    }`;

  return (
    <nav aria-label="The diary by year" className="mt-5">
      <div className="flex flex-wrap items-center gap-2">
        <Link href="/life" className={chip(active === undefined)}>
          Latest
        </Link>
        {years.map((y) => (
          <Link
            key={y.year}
            href={`/life?year=${y.year}`}
            aria-current={active === y.year ? "page" : undefined}
            // The count sits beside the year with only a margin between them,
            // which reads fine and concatenates to "202697" for a screen
            // reader. The label says it in words instead.
            aria-label={`${y.year} — ${y.posts} ${y.posts === 1 ? "entry" : "entries"}`}
            className={chip(active === y.year)}
          >
            <span aria-hidden="true">{y.year}</span>
            <span aria-hidden="true" className="ml-1.5 text-[0.62rem] opacity-60">
              {y.posts}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
