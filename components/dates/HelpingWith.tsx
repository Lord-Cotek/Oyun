import { InOnIt, type Housemate } from "@/components/dates/InOnIt";

export interface HelpingDay {
  id: string;
  title: string;
  when: string;
  where: string | null;
  note: string | null;
  createdById: string;
  /** Ids in on it besides whoever thought of it. */
  inOnIt: string[];
}

/**
 * The surprises somebody is helping with, on their own home page.
 *
 * ── Why this is here and not in the diary ────────────────────────────────
 * Because in Oyun the diary belongs to the mother and the one beside her, and
 * the people you would actually ask to help with a shower — her sister, her
 * mother, the friend doing the food — are not in that room. This is the one
 * day at a time they were let in on, and nothing else: not the scans, not the
 * clinics, not the rest of the book.
 *
 * ── Why it says so plainly ───────────────────────────────────────────────
 * Somebody who has been let in on a surprise needs to know, every time they
 * look, that this is the block they must not mention. So it says it.
 */
export function HelpingWith({
  days,
  housemates,
}: {
  days: HelpingDay[];
  housemates: Housemate[];
}) {
  if (days.length === 0) return null;

  return (
    <section className="rounded-xl border border-accent/30 bg-accent/[0.04] p-5">
      <h2 className="font-serif text-xl text-ink">
        {days.length === 1 ? "A surprise you are in on" : "Surprises you are in on"}
      </h2>
      <p className="mt-1 prose-serif-xs text-muted">
        Nobody else can see {days.length === 1 ? "this" : "these"}. That is
        rather the point.
      </p>

      <ul className="mt-4 space-y-4">
        {days.map((d) => (
          <li key={d.id} className="rounded-lg border border-border bg-bg/40 p-4">
            <p className="font-mono text-[0.66rem] text-accent">{d.when}</p>
            <p className="mt-1 font-serif text-lg leading-snug text-ink">
              {d.title}
            </p>
            {d.where && (
              <p className="mt-0.5 font-mono text-[0.7rem] text-muted">{d.where}</p>
            )}
            {d.note && (
              <p className="mt-2 whitespace-pre-wrap prose-serif-xs text-muted">
                {d.note}
              </p>
            )}
            <InOnIt
              eventId={d.id}
              mine={d.inOnIt}
              housemates={housemates}
              creatorId={d.createdById}
              creatorName={
                housemates.find((h) => h.userId === d.createdById)?.name ?? "They"
              }
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
