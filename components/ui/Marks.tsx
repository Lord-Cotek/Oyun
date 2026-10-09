/**
 * Drawn marks, for the bands.
 *
 * Three of them, and deliberately only three. A band of flat colour is better
 * than a white card and still not much to look at; one line drawing behind the
 * words gives it somewhere for the eye to rest and, more usefully, makes the
 * app look like somebody made it rather than assembled it.
 *
 * They are drawn in one line weight, in the cream that sits on the band, at
 * low opacity, and they never carry meaning — a screen reader is told nothing
 * because there is nothing to tell. Anything that has to be understood is
 * written in words somewhere else.
 *
 * Geometry rather than illustration, on purpose: arches, rings, rays. It is
 * what can be drawn honestly in code and held consistent across two apps and
 * a hundred screens, and it does not pretend to be a hand that is not there.
 */

/** A row of arches — a chapel window. For the hero band. */
export function Arches({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 300 120"
      className={`pointer-events-none absolute -right-8 -top-6 h-40 w-auto opacity-[0.16] ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      {[0, 70, 140, 210].map((x) => (
        <path
          key={x}
          d={`M${x + 8} 118 L${x + 8} 56 A26 26 0 0 1 ${x + 60} 56 L${x + 60} 118`}
        />
      ))}
    </svg>
  );
}

/** Concentric rings — a circle drawn around a name. For the second band. */
export function Rings({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 160 160"
      className={`pointer-events-none absolute -right-10 -top-12 h-52 w-52 opacity-[0.18] ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      {[26, 44, 62, 80].map((r) => (
        <circle key={r} cx="80" cy="80" r={r} />
      ))}
    </svg>
  );
}

/** Light from a point. For the verse that closes a page. */
export function Rays({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 200 120"
      className={`pointer-events-none absolute inset-x-0 top-0 mx-auto h-28 w-full opacity-[0.15] ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      {Array.from({ length: 11 }, (_, i) => {
        const a = (-90 + (i - 5) * 13) * (Math.PI / 180);
        return (
          <line
            key={i}
            x1="100"
            y1="118"
            x2={100 + Math.cos(a) * 120}
            y2={118 + Math.sin(a) * 120}
          />
        );
      })}
    </svg>
  );
}
