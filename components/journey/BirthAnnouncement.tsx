import Link from "next/link";

/**
 * On the journey page, for the first weeks after the birth: an invitation to
 * make the announcement, and once it is made, a way back to it. The card
 * itself is made at /journey/announce — see components/announce.
 */
export function BirthAnnouncement({
  names,
  made,
  link,
  cover,
}: {
  names: string;
  made: boolean;
  /** The private link, once there is one. */
  link: string | null;
  cover: string | null;
}) {
  if (!made) {
    return (
      <section className="rounded-2xl border border-accent/40 bg-accent/[0.06] p-6">
        <p className="eyebrow mb-2 text-accent">Tell people</p>
        <h2 className="font-serif text-2xl text-ink">Announce {names ? names : "the birth"}</h2>
        <p className="mt-1 max-w-prose prose-serif-sm text-muted">
          A beautiful card with their names and what each one means, the day, your photographs and your own words —
          for your circle in Life, and a private link for everyone else.
        </p>
        <Link
          href="/journey/announce"
          className="mt-4 inline-flex min-h-11 items-center rounded-lg bg-accent px-5 font-mono text-sm font-medium text-on-accent hover:bg-accent-deep"
        >
          Make the announcement
        </Link>
      </section>
    );
  }
  return (
    <section className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-4">
      {cover && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={cover} alt="" className="h-16 w-16 shrink-0 rounded-xl object-cover" />
      )}
      <div className="min-w-0 flex-1">
        <p className="eyebrow text-muted">Your announcement</p>
        <p className="truncate font-serif text-lg text-ink">{names}</p>
        <div className="mt-1 flex flex-wrap gap-x-4 font-mono text-[0.68rem]">
          {link && (
            <a href={link} target="_blank" rel="noopener noreferrer" className="text-accent underline-offset-4 hover:underline">
              Open the card
            </a>
          )}
          <Link href="/journey/announce" className="text-muted underline-offset-4 hover:text-accent hover:underline">
            Edit or share
          </Link>
        </div>
      </div>
    </section>
  );
}
