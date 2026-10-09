import { Eyebrow } from "@/components/ui/Eyebrow";
import { type StorySoFar as Story } from "@/lib/story";

/**
 * What this family has actually done, in one place.
 *
 * A family three years in has three years of evidence in the database and
 * nowhere to see it. Every room shows the recent end of itself; nothing ever
 * adds up — and the pregnancy, the birth and the first year are exactly the
 * part a family most wants totalled.
 *
 * Three rules this follows, and they are the difference between an encouragement
 * and a scoreboard:
 *
 *  - No streaks, no badges, no percentages, no target. Streaks are law, and law
 *    kills. These are counts of things that happened, and a count of things
 *    that happened cannot be broken.
 *  - Nothing is ever framed as a shortfall. There is no "only", no "just", and
 *    no comparison with any other house or with last year.
 *  - It stays silent until there is a story. A journey three weeks old being
 *    shown "1 entry, 0 answered prayers" has been handed a report card, which
 *    is the opposite of the point — so `worthTelling` keeps this hidden until
 *    there is something worth saying.
 */
export function StorySoFar({ story }: { story: Story }) {
  if (!story.worthTelling) return null;

  const since = story.since.toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });

  // Only the lines that have something in them. A house without letters is not
  // shown a zero and reminded of it.
  const lines: { n: number; label: string }[] = [
    { n: story.worshipDays, label: story.worshipDays === 1 ? "evening of worship kept" : "evenings of worship kept" },
    { n: story.posts, label: story.posts === 1 ? "entry in the diary" : "entries in the diary" },
    { n: story.prayersAnswered, label: story.prayersAnswered === 1 ? "prayer followed to its answer" : "prayers followed to their answer" },
    { n: story.letters, label: story.letters === 1 ? "letter written to keep" : "letters written to keep" },
    { n: story.milestones, label: story.milestones === 1 ? "milestone marked" : "milestones marked" },
    {
      n: story.appointmentsKept,
      label:
        story.appointmentsKept === 1
          ? "appointment been to"
          : "appointments been to",
    },
  ].filter((l) => l.n > 0);

  return (
    <section className="rounded-2xl border border-accent2/25 bg-accent2/[0.05] p-6 md:p-7">
      <Eyebrow className="mb-2">Our story so far</Eyebrow>
      <p className="prose-serif-sm max-w-prose text-muted">
        {story.years >= 1 ? (
          <>
            {story.years === 1 ? "A year" : `${story.years} years`} of this
            journey, kept since {since}.
          </>
        ) : (
          <>Kept since {since}.</>
        )}
      </p>

      <ul className="mt-4 grid gap-x-8 gap-y-2 sm:grid-cols-2">
        {lines.map((l) => (
          // The gap between the number and its label is a flex gap, which
          // renders correctly and concatenates to "900evenings" when read
          // aloud. The whole line is given as one phrase instead.
          <li
            key={l.label}
            aria-label={`${l.n.toLocaleString("en-GB")} ${l.label}`}
            className="flex items-baseline gap-2.5"
          >
            <span aria-hidden="true" className="font-serif text-xl tabular-nums text-ink">
              {l.n.toLocaleString("en-GB")}
            </span>
            <span aria-hidden="true" className="prose-serif-xs text-muted">
              {l.label}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
