import { Eyebrow } from "@/components/ui/Eyebrow";
import type { UpcomingItem } from "@/lib/data";

function awayLabel(n: number): string {
  if (n <= 0) return "today";
  if (n === 1) return "tomorrow";
  if (n < 7) return `in ${n} days`;
  if (n < 14) return "next week";
  const weeks = Math.round(n / 7);
  return `in ${weeks} weeks`;
}

/**
 * A quiet look-ahead — the next few things on the horizon (the due date, the
 * baby's next month, appointment reminders), shown as a horizontally scrolling
 * strip of cards. Renders nothing when the horizon is clear.
 */
export function UpcomingStrip({ items }: { items: UpcomingItem[] }) {
  if (items.length === 0) return null;
  return (
    <div className="surface-premium rounded-2xl border border-border p-6 md:p-7">
      <Eyebrow className="mb-4">The days ahead</Eyebrow>
      <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-1">
        {items.map((u) => (
          <div
            key={u.id}
            className="flex w-44 shrink-0 flex-col rounded-xl border border-border bg-bg/50 p-4"
            style={{
              borderColor: `color-mix(in srgb, var(--tone-${u.tone}) 35%, transparent)`,
            }}
          >
            <span
              className="font-mono text-[0.58rem] uppercase tracking-widest"
              style={{ color: `var(--tone-${u.tone})` }}
            >
              {awayLabel(u.daysAway)}
            </span>
            <span className="mt-1.5 line-clamp-2 font-serif text-base leading-snug text-ink">
              {u.label}
            </span>
            <span className="mt-auto pt-2 font-mono text-[0.6rem] uppercase tracking-widest text-muted">
              {u.dateLabel}
              {u.detail ? ` · ${u.detail}` : ""}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
