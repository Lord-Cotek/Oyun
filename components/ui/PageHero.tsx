import { type ReactNode } from "react";
import { Eyebrow } from "@/components/ui/Eyebrow";

/**
 * The signature warm hero band — a soft amber→rose gradient panel with an
 * optional serif-italic greeting, an eyebrow, a serif title, an optional
 * lede, and an optional right-side aside (a ProgressRing, a stat row…). Shared
 * across the app so every page opens in the same warm register as the Journey.
 *
 * `compact` is for the rooms a family opens every day. The full band is
 * beautiful the first week and a tax every week after: on a phone it *is* the
 * first screen, which pushes the day's actual action out of sight. Compact
 * keeps the same identity — same gradient, same eyebrow and serif title — at
 * roughly half the height, so the thing you came to do is reachable without
 * scrolling. No words are dropped; they are only set smaller.
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
  /** Full-width content rendered below the header row (e.g. a tile row). */
  children?: ReactNode;
  /** Half-height variant for the daily rooms — see above. */
  compact?: boolean;
  className?: string;
}) {
  return (
    <section
      // The same material as every other surface — one shadow over a ground it
      // can be told apart from. It used to be a three-stop accent gradient with
      // an accent-tinted border, and on the new ground that recipe landed
      // almost exactly on the page colour: the hero had no edge at all while a
      // plain card beside it read fine. A hero earns its place with type and
      // space, not with a different background; the ambient warmth lives on
      // <body>, once, where it belongs.
      className={`surface-raised animate-fade-up overflow-hidden rounded-2xl border border-border bg-surface ${
        compact ? "p-6 md:p-7" : "p-8 md:p-10"
      } ${className}`}
    >
      <div
        className={
          aside
            ? `flex flex-col-reverse items-start md:flex-row md:items-center md:justify-between ${
                compact ? "gap-5" : "gap-8"
              }`
            : ""
        }
      >
        <div className="min-w-0">
          {greeting && (
            <p className="mb-3 font-serif text-lg italic text-muted">{greeting}</p>
          )}
          {eyebrow && (
            <Eyebrow className={compact ? "mb-2" : "mb-3"}>{eyebrow}</Eyebrow>
          )}
          <h1
            className={`max-w-2xl font-serif leading-tight text-ink ${
              compact ? "text-[1.75rem] md:text-4xl" : "text-4xl md:text-5xl"
            }`}
          >
            {title}
          </h1>
          {lede && (
            <div
              className={`prose-serif-sm max-w-prose text-muted ${
                compact ? "mt-2" : "mt-4"
              }`}
            >
              {lede}
            </div>
          )}
        </div>
        {aside && <div className="shrink-0 md:pl-6">{aside}</div>}
      </div>
      {children}
    </section>
  );
}
