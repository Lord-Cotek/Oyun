import { PrintButton } from "@/components/book/PrintButton";

export type BookEntry = { at: string; author: string; body: string; photos: string[] };
export type BookFirst = { at: string; title: string; who: string | null; note: string | null; photos: string[] };

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const day = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" });

/**
 * A year, made into a book to keep: the cover, then each month's entries in
 * the order they happened, the year's firsts, and a closing word. Built to
 * be printed — or saved as a PDF from the print window and sent to a photo
 * printer. On screen it reads as a long page.
 *
 * Only what the page that builds it may show: the entries come through the
 * same visibility rules as the diary. No papers, health, moods or sealed
 * letters ever reach a book.
 *
 * Shared with the sibling app and drift-checked.
 */
export function YearBook({
  title,
  year,
  cover,
  entries,
  firsts,
  backHref,
  backLabel,
}: {
  title: string;
  year: number;
  cover: string | null;
  entries: BookEntry[];
  firsts: BookFirst[];
  backHref: string;
  backLabel: string;
}) {
  const byMonth = MONTHS.map((name, m) => ({
    name,
    items: entries.filter((e) => new Date(e.at).getUTCMonth() === m),
  })).filter((g) => g.items.length > 0);
  const photoCount = entries.reduce((n, e) => n + e.photos.length, 0) + firsts.reduce((n, f) => n + f.photos.length, 0);

  return (
    <div className="year-book">
      {/* The print window takes only the book: no header, no buttons, plain
          paper, sensible margins, and nothing split across a page edge. */}
      <style>{`
        @media print {
          @page { size: A4; margin: 14mm; }
          body { background: #fff !important; }
          header, nav, footer, .book-chrome { display: none !important; }
          .year-book, .year-book * { color: #1b1712 !important; background: transparent !important; border-color: #d9d2c5 !important; box-shadow: none !important; }
          .book-page { break-before: page; }
          .book-keep { break-inside: avoid; }
        }
      `}</style>

      <div className="book-chrome mb-6 flex flex-wrap items-center justify-between gap-3">
        <a href={backHref} className="font-mono text-xs text-muted underline underline-offset-4 hover:text-accent">
          ← {backLabel}
        </a>
        <PrintButton />
      </div>

      <section className="book-keep flex min-h-[60vh] flex-col items-center justify-center rounded-3xl border border-border bg-surface px-8 py-14 text-center">
        <p className="eyebrow text-muted">Our year</p>
        <h1 className="mt-3 font-serif text-5xl leading-tight text-ink">{title}</h1>
        <p className="mt-2 font-serif text-3xl text-accent">{year}</p>
        {cover && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cover} alt="" className="mt-8 max-h-[42vh] w-auto max-w-full rounded-2xl object-cover" />
        )}
        <p className="mt-8 font-mono text-[0.7rem] text-muted">
          {entries.length} {entries.length === 1 ? "entry" : "entries"}
          {firsts.length > 0 ? ` · ${firsts.length} first${firsts.length === 1 ? "" : "s"}` : ""}
          {photoCount > 0 ? ` · ${photoCount} photograph${photoCount === 1 ? "" : "s"}` : ""}
        </p>
      </section>

      {entries.length === 0 && firsts.length === 0 && (
        <p className="mt-8 prose-serif-sm text-muted">Nothing was kept in {year} yet.</p>
      )}

      {byMonth.map((g) => (
        <section key={g.name} className="book-page mt-12">
          <h2 className="mb-6 border-b border-border pb-2 font-serif text-3xl text-ink">{g.name}</h2>
          <div className="space-y-8">
            {g.items.map((e, i) => (
              <article key={i} className="book-keep">
                <p className="font-mono text-[0.68rem] text-muted">
                  {day(e.at)} · {e.author}
                </p>
                {e.body && <p className="mt-1.5 whitespace-pre-line prose-serif-sm text-ink">{e.body}</p>}
                {e.photos.length > 0 && (
                  <div className={`mt-3 grid gap-2 ${e.photos.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
                    {e.photos.slice(0, 4).map((src) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img key={src} src={src} alt="" loading="lazy" className="max-h-[60vh] w-full rounded-xl object-cover" />
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>
      ))}

      {firsts.length > 0 && (
        <section className="book-page mt-12">
          <h2 className="mb-6 border-b border-border pb-2 font-serif text-3xl text-ink">The year&rsquo;s firsts</h2>
          <ol className="space-y-6">
            {firsts.map((f, i) => (
              <li key={i} className="book-keep">
                <p className="font-serif text-xl text-ink">
                  {f.who ? `${f.who} — ` : ""}
                  {f.title}
                </p>
                <p className="font-mono text-[0.68rem] text-muted">{day(f.at)}</p>
                {f.note && <p className="mt-1 prose-serif-sm text-muted">{f.note}</p>}
                {f.photos.length > 0 && (
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {f.photos.slice(0, 2).map((src) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img key={src} src={src} alt="" loading="lazy" className="max-h-[40vh] w-full rounded-xl object-cover" />
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ol>
        </section>
      )}

      <section className="book-page book-keep mt-12 flex min-h-[30vh] flex-col items-center justify-center text-center">
        <p className="max-w-md font-serif text-xl italic leading-relaxed text-ink">
          “It is because of the LORD’s loving kindnesses that we are not consumed, because his compassion doesn’t
          fail. They are new every morning. Great is your faithfulness.”
        </p>
        <p className="mt-3 font-mono text-xs text-muted">Lamentations 3:22-23</p>
      </section>
    </div>
  );
}
