import { weekMark, type MarkStage } from "@/lib/week-mark";

/**
 * The week, drawn, at the top of the card that says how the baby is.
 *
 * A server component with no state and no client JavaScript: the whole
 * picture is worked out from one number while the page is being rendered,
 * and arrives as part of the HTML. Nothing here animates — see the note in
 * lib/week-mark.ts about what the last full-screen effect on this screen did
 * to the frame rate.
 *
 * It is `aria-hidden` on purpose. The week, the count and the size are all
 * said in words immediately underneath, so reading the picture out as well
 * would be repeating the card to somebody who has already heard it.
 */
export function WeekMark({
  stage,
  /** Unique per instance, because the halo's gradient is referenced by id. */
  id = "mark",
  className = "",
}: {
  stage: MarkStage;
  id?: string;
  className?: string;
}) {
  const m = weekMark(stage);
  const haloId = `wm-halo-${id}`;

  return (
    <div className={`band-1 relative h-32 w-full overflow-hidden ${className}`}>
      <svg
        viewBox={`0 0 ${m.width} ${m.height}`}
        // `slice` rather than `meet`: the weave is a field, and a field should
        // fill its frame at any width rather than letterboxing itself on a
        // narrow phone.
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
        aria-hidden
        focusable="false"
      >
        <defs>
          <radialGradient id={haloId}>
            <stop offset="0" stopColor="#efb35c" stopOpacity="0.62" />
            <stop offset="0.5" stopColor="#efb35c" stopOpacity="0.22" />
            <stop offset="1" stopColor="#efb35c" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* The ground: threads gathering, bending around the clearing. */}
        {m.threads.map((t, i) => (
          <path
            key={i}
            d={t.d}
            fill="none"
            stroke={t.amber ? "#efb35c" : "#fbf8f2"}
            strokeWidth={t.width}
            strokeLinecap="round"
            opacity={t.opacity}
          />
        ))}

        {/* The air inside it. */}
        <ellipse
          cx={m.halo.cx}
          cy={m.halo.cy}
          rx={m.halo.rx}
          ry={m.halo.ry}
          fill={`url(#${haloId})`}
        />
        {m.rays.map((r, i) => (
          <line
            key={i}
            x1={r.x1}
            y1={r.y1}
            x2={r.x2}
            y2={r.y2}
            stroke="#fbf8f2"
            strokeWidth={1}
            strokeLinecap="round"
            opacity={r.opacity}
          />
        ))}

        {/* The forms — one for each of them — with a month ago behind. */}
        {m.forms.map((f, n) => (
          <g key={n} transform={`translate(${f.cx} ${f.cy})`}>
            <path
              d={f.ghost}
              fill="none"
              stroke="#fbf8f2"
              strokeWidth={1}
              strokeDasharray="3 5"
              opacity={0.5}
            />
            <path d={f.d} fill="#fbf8f2" opacity={0.9} />
            {/* A hairline just inside the edge, so the fill reads as a form
                with light on it rather than a sticker laid on the weave. */}
            <path
              d={f.inner}
              fill="none"
              stroke="#8a5e18"
              strokeWidth={1}
              opacity={0.13}
            />
            {f.ribs.map((d, i) => (
              <path
                key={i}
                d={d}
                fill="none"
                stroke="#8a5e18"
                strokeWidth={1}
                opacity={0.2}
              />
            ))}
          </g>
        ))}
      </svg>
    </div>
  );
}
