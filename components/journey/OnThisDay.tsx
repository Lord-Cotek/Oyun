import { Eyebrow } from "@/components/ui/Eyebrow";
import type { MemoryItem } from "@/lib/data";

function yearsAgoLabel(n: number): string {
  if (n <= 0) return "earlier";
  if (n === 1) return "a year ago today";
  return `${n} years ago today`;
}

/**
 * "On this day" — a quiet home surface that resurfaces a keepsake from an
 * earlier year (a milestone, a letter to the baby) falling on today's date.
 * Renders nothing on days with no memory, so it never adds noise.
 */
export function OnThisDay({ items }: { items: MemoryItem[] }) {
  if (items.length === 0) return null;
  return (
    <div className="surface-premium rounded-2xl border border-accent2/25 bg-accent2/[0.05] p-6 md:p-7">
      <Eyebrow className="mb-4">On this day</Eyebrow>
      <ul className="space-y-3">
        {items.map((m) => (
          <li
            key={m.id}
            className="flex items-start gap-3 rounded-xl border border-border bg-bg/50 p-4"
          >
            {m.imageUrl && (
              <span className="shrink-0 overflow-hidden rounded-lg border border-border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={m.imageUrl}
                  alt=""
                  loading="lazy"
                  className="h-16 w-16 object-cover"
                />
              </span>
            )}
            <div className="min-w-0 flex-1">
              <p className="font-mono text-[0.6rem] uppercase tracking-widest text-accent">
                {m.label} · {yearsAgoLabel(m.yearsAgo)}
              </p>
              <p className="mt-1 font-serif text-base leading-snug text-ink">
                {m.title}
              </p>
              {m.body && (
                <p className="mt-1 line-clamp-3 font-mono text-xs leading-relaxed text-muted">
                  {m.body}
                </p>
              )}
              <p className="mt-1.5 font-mono text-[0.6rem] uppercase tracking-widest text-muted">
                {m.dateLabel}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
