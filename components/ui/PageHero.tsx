import { type ReactNode } from "react";
import { Eyebrow } from "@/components/ui/Eyebrow";

/**
 * The signature warm hero band — a soft amber→rose gradient panel with an
 * optional serif-italic greeting, an eyebrow, a serif title, an optional
 * lede, and an optional right-side aside (a ProgressRing, a stat row…). Shared
 * across the app so every page opens in the same warm register as the Journey.
 */
export function PageHero({
  greeting,
  eyebrow,
  title,
  lede,
  aside,
  children,
  className = "",
}: {
  greeting?: ReactNode;
  eyebrow?: ReactNode;
  title: ReactNode;
  lede?: ReactNode;
  aside?: ReactNode;
  /** Full-width content rendered below the header row (e.g. a tile row). */
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`animate-fade-up overflow-hidden rounded-2xl border border-accent/25 bg-gradient-to-br from-accent/[0.10] via-surface to-accent2/[0.09] p-8 md:p-10 ${className}`}
    >
      <div
        className={
          aside
            ? "flex flex-col-reverse items-start gap-8 md:flex-row md:items-center md:justify-between"
            : ""
        }
      >
        <div className="min-w-0">
          {greeting && (
            <p className="mb-3 font-serif text-lg italic text-muted">{greeting}</p>
          )}
          {eyebrow && <Eyebrow className="mb-3">{eyebrow}</Eyebrow>}
          <h1 className="max-w-2xl font-serif text-4xl leading-tight text-ink md:text-5xl">
            {title}
          </h1>
          {lede && (
            <div className="mt-4 max-w-prose font-mono text-sm leading-relaxed text-muted">
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
