import { type ReactNode } from "react";
import { Arches } from "@/components/ui/Marks";

/**
 * The band every room opens on.
 *
 * ── The rule this enforces ───────────────────────────────────────────────
 * Home is the one photographic room — it is about the people in the house, so
 * it is made of their faces. Every other room opens on a band of colour with
 * the arches drawn across it. That is a hierarchy rather than a saving: it
 * says at a glance whether you are on the front page or somewhere inside the
 * house, and it gives each room a shape of its own instead of a paler copy of
 * the front page.
 *
 * It used to be another surface-coloured card — the same rectangle as
 * everything beneath it, distinguished only by carrying bigger type. That is
 * most of why a page here read as a document: nothing on it was a different
 * KIND of thing from anything else.
 *
 * ── Why `aside` and `children` sit below the band ────────────────────────
 * They come from the page and are coloured for the page's ground — a progress
 * ring, a row of figures, a switch. Dropping arbitrary content onto clay would
 * mean every caller having to know it was on a band. So they go into a lifted
 * card straddling the join instead, on the ordinary surface, where the colours
 * they were written for are the colours they get. That is also the composition
 * the home and worship screens already use, so the whole app keeps one rhythm:
 * band, then the nearest object, then the content.
 *
 * `compact` is for the rooms opened every day. The full band is beautiful the
 * first week and a tax every week after: on a phone it *is* the first screen,
 * which pushes the day's actual action out of sight. Compact keeps the same
 * identity at roughly half the height. No words are dropped; they are only set
 * smaller.
 */
export function PageHero({
  greeting,
  eyebrow,
  title,
  lede,
  aside,
  children,
  compact = false,
  className = "",
}: {
  greeting?: ReactNode;
  eyebrow?: ReactNode;
  title: ReactNode;
  lede?: ReactNode;
  aside?: ReactNode;
  children?: ReactNode;
  /** Half-height variant for the daily rooms — see above. */
  compact?: boolean;
  className?: string;
}) {
  const below = aside ?? children;

  return (
    <>
      <section
        // Full-bleed on a phone, a rounded panel from md up. `-mx-6` cancels
        // the shell's own side padding exactly; the pages that use this drop
        // their top padding so the band meets the header.
        className={`band-1 relative -mx-6 animate-fade-up overflow-hidden md:mx-0 md:rounded-3xl ${
          compact ? "px-6 py-7" : "px-6 py-9"
        } ${below ? "pb-14" : ""} ${className}`}
      >
        <Arches className="on-band" />
        <div className="relative">
          {greeting && (
            <p className="mb-1 font-serif text-lg italic opacity-75 on-band">
              {greeting}
            </p>
          )}
          {eyebrow && (
            <p className="mb-2.5 font-mono text-[0.66rem] uppercase tracking-[0.16em] opacity-70 on-band">
              {eyebrow}
            </p>
          )}
          <h1
            className={`max-w-[15ch] font-serif leading-[1.12] on-band md:max-w-2xl ${
              compact ? "text-[1.9rem] md:text-4xl" : "text-[2.05rem] md:text-5xl"
            }`}
          >
            {title}
          </h1>
          {lede && (
            <div className="mt-3 max-w-prose prose-serif-sm opacity-80 on-band">
              {lede}
            </div>
          )}
        </div>
      </section>

      {below && (
        // `relative z-10` is load-bearing: a static block paints before a
        // positioned one, so without it the band's own layers paint straight
        // over the top of this card and slice it in half.
        <div className="relative z-10 -mt-9">
          <div className="lift rounded-[1.4rem] bg-surface p-4">
            {aside ? (
              <div className="flex items-center gap-4">
                <div className="shrink-0">{aside}</div>
                {children && <div className="min-w-0 flex-1">{children}</div>}
              </div>
            ) : (
              children
            )}
          </div>
        </div>
      )}
    </>
  );
}
