import { STYLES, headingNames, longDate, verseFor, type AnnouncementData } from "@/lib/announcement";

/**
 * The announcement as people receive it — a keepsake card.
 *
 * It carries its own paper and ink, chosen by the parents, rather than the
 * app's light or dark theme: a card someone saves or screenshots should look
 * the same on every phone. Used by the public page, the editor's live preview
 * and the journey page, so what the parents see is exactly what is sent.
 */
export function AnnouncementCard({ data, preview = false }: { data: AnnouncementData; preview?: boolean }) {
  const s = STYLES[data.style];
  const verse = verseFor(data.verseRef);
  const [cover, ...more] = data.photoUrls;
  const many = data.babies.length > 1;
  const details = [
    { label: "Born", value: longDate(data.bornOn) },
    data.timeOfBirth ? { label: "Time", value: data.timeOfBirth } : null,
    data.weight ? { label: "Weight", value: data.weight } : null,
    data.place ? { label: "Place", value: data.place } : null,
  ].filter((d): d is { label: string; value: string } => !!d);
  const meaningful = data.babies.some((b) => b.names.some((n) => n.meaning));

  return (
    <article
      className="overflow-hidden rounded-[28px] shadow-[0_24px_60px_-28px_rgba(20,14,6,0.55)]"
      style={{ background: s.paper, color: s.ink, border: `1px solid ${s.edge}` }}
      aria-label={`Birth announcement for ${headingNames(data.babies)}`}
    >
      {cover && (
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={cover}
            alt={`${headingNames(data.babies)}`}
            className={`block w-full object-cover ${preview ? "aspect-[4/3]" : "aspect-[4/5] sm:aspect-[4/3]"}`}
          />
          <div
            aria-hidden
            className={`pointer-events-none absolute inset-x-0 bottom-0 ${data.style === "night" ? "h-10" : "h-20"}`}
            style={{ background: `linear-gradient(to bottom, transparent, ${s.paper})` }}
          />
        </div>
      )}

      <div className={`text-center ${cover ? "px-6 pb-9 pt-2 sm:px-12" : "px-6 py-11 sm:px-12"}`}>
        <p className="font-mono text-[0.62rem] uppercase tracking-[0.32em]" style={{ color: s.accent }}>
          With joy and thanksgiving
        </p>
        <p className="mt-3 font-serif text-lg italic" style={{ color: s.soft }}>
          Welcome to the world
        </p>
        <h1
          className="mx-auto mt-1 max-w-[18ch] font-serif text-[2.35rem] leading-[1.08] sm:text-[3rem]"
          style={{ textWrap: "balance" } as React.CSSProperties}
        >
          {data.babies.map((b, i) => (
            <span key={i} className="block">
              {i > 0 && (
                <span className="block font-serif text-2xl italic" style={{ color: s.accent2 }}>
                  &amp;
                </span>
              )}
              {b.fullName}
            </span>
          ))}
        </h1>

        <Flourish color={s.accent} />

        {meaningful && (
          <div className="mx-auto mt-5 max-w-md space-y-5 text-left">
            {data.babies.map((b, i) =>
              b.names.some((n) => n.meaning) ? (
                <div key={i}>
                  {many && (
                    <p className="mb-2 text-center font-mono text-[0.6rem] uppercase tracking-[0.24em]" style={{ color: s.soft }}>
                      {b.fullName}
                    </p>
                  )}
                  <dl className="space-y-2.5">
                    {b.names
                      .filter((n) => n.meaning)
                      .map((n, j) => (
                        <div key={j} className="grid grid-cols-[minmax(0,auto)_1fr] items-baseline gap-x-3">
                          <dt className="font-serif text-xl" style={{ color: s.ink }}>
                            {n.name}
                          </dt>
                          <dd className="font-body text-[0.98rem] italic leading-snug" style={{ color: s.soft }}>
                            {n.meaning}
                          </dd>
                        </div>
                      ))}
                  </dl>
                </div>
              ) : null,
            )}
          </div>
        )}

        <dl
          className={`mx-auto mt-7 grid max-w-md gap-px overflow-hidden rounded-2xl ${details.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}
          style={{ background: s.edge, border: `1px solid ${s.edge}` }}
        >
          {details.map((d, i) => (
            <div
              key={d.label}
              // Three details: the birthday across the top, the other two beneath.
              className={`px-3 py-3 ${details.length === 3 && i === 0 ? "col-span-2" : ""}`}
              style={{ background: s.paper }}
            >
              <dt className="font-mono text-[0.58rem] uppercase tracking-[0.24em]" style={{ color: s.accent }}>
                {d.label}
              </dt>
              <dd className="mt-1 font-serif text-[1.05rem]">{d.value}</dd>
            </div>
          ))}
        </dl>

        {more.length > 0 && (
          <div className={`mx-auto mt-7 grid max-w-md gap-2 ${more.length === 1 ? "grid-cols-1" : more.length === 2 || more.length === 4 ? "grid-cols-2" : "grid-cols-3"}`}>
            {more.map((src) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={src} src={src} alt="" loading="lazy" className="aspect-square w-full rounded-xl object-cover" />
            ))}
          </div>
        )}

        {verse && (
          <blockquote className="mx-auto mt-8 max-w-sm">
            <p className="font-serif text-[1.15rem] italic leading-relaxed">&ldquo;{verse.text}&rdquo;</p>
            <footer className="mt-2 font-mono text-[0.6rem] uppercase tracking-[0.24em]" style={{ color: s.soft }}>
              {verse.ref}
            </footer>
          </blockquote>
        )}

        {(data.message || data.signedAs) && (
          <div className="mx-auto mt-8 max-w-md">
            {data.message && (
              <p className="whitespace-pre-line font-body text-[1.02rem] leading-relaxed" style={{ color: s.ink }}>
                {data.message}
              </p>
            )}
            {data.signedAs && (
              <p className="mt-3 font-serif text-lg italic" style={{ color: s.accent2 }}>
                — {data.signedAs}
              </p>
            )}
          </div>
        )}

        <p className="mt-9 font-mono text-[0.56rem] uppercase tracking-[0.3em]" style={{ color: s.soft, opacity: 0.8 }}>
          Shared with love through Oyun
        </p>
      </div>
    </article>
  );
}

/** A small star between two hairlines. */
function Flourish({ color }: { color: string }) {
  return (
    <svg aria-hidden width="132" height="18" viewBox="0 0 132 18" className="mx-auto mt-5" fill="none">
      <path d="M4 9H52" stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.55" />
      <path d="M80 9H128" stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.55" />
      <path
        d="M66 1.5l2.1 4.6 5 .6-3.7 3.4 1 4.9L66 12.6l-4.4 2.4 1-4.9-3.7-3.4 5-.6z"
        fill={color}
      />
    </svg>
  );
}
