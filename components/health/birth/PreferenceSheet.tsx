import { PREF_PREAMBLE, type SheetLine } from "@/lib/birth-prep";

/**
 * Her birth preferences, set out to be read — on her own page, on the page
 * she prints, and for her doctor if she chose to show them. Only what she
 * answered, in her words. See lib/birth-prep.ts.
 */
export function PreferenceSheet({ name, lines, updated }: { name: string; lines: SheetLine[]; updated: string | null }) {
  return (
    <article className="rounded-2xl border-2 border-ink/80 bg-surface p-5 print:rounded-lg print:border-black print:bg-white print:text-black">
      <p className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-muted print:text-black/70">Birth preferences</p>
      <p className="mt-1 border-b border-border pb-2 font-serif text-2xl text-ink print:border-black/30 print:text-black">{name}</p>
      <p className="mt-3 prose-serif-sm italic text-ink/85 print:text-black">{PREF_PREAMBLE}</p>
      <dl className="mt-4 space-y-4">
        {lines.map((l) => (
          <div key={l.label} className="break-inside-avoid">
            <dt className="font-mono text-[0.62rem] uppercase tracking-widest text-muted print:text-black/70">{l.label}</dt>
            {l.text && <dd className="mt-1 whitespace-pre-line break-words prose-serif-sm text-ink print:text-black">{l.text}</dd>}
            {l.list && (
              <dd className="mt-1">
                <ul className="space-y-1">
                  {l.list.map((x) => (
                    <li key={x} className="flex gap-2 prose-serif-sm text-ink print:text-black">
                      <span aria-hidden>•</span>
                      <span>{x}</span>
                    </li>
                  ))}
                </ul>
              </dd>
            )}
          </div>
        ))}
      </dl>
      {updated && <p className="mt-5 border-t border-border pt-2 font-mono text-[0.6rem] text-muted print:border-black/30 print:text-black/70">Written {updated}</p>}
    </article>
  );
}
