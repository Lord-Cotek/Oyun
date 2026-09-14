import { type ReactNode } from "react";

/**
 * A soft radial progress ring with a warm amber→rose gradient stroke and a
 * serif value at its centre. The visual anchor for the journey hero — "week 24
 * of 40", "5 months old". Pure SVG, theme-aware (track uses --border).
 */
export function ProgressRing({
  progress,
  value,
  unit,
  size = 176,
  stroke = 12,
}: {
  progress: number;
  value: ReactNode;
  unit?: string;
  size?: number;
  stroke?: number;
}) {
  const pct = Math.min(1, Math.max(0, progress));
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = circ * pct;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <linearGradient id="oyun-ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--accent)" />
            <stop offset="100%" stopColor="var(--accent2)" />
          </linearGradient>
        </defs>
        <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="var(--border)"
            strokeWidth={stroke}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="url(#oyun-ring)"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circ}`}
            className="transition-[stroke-dasharray] duration-700"
          />
        </g>
      </svg>
      {/* The label scales with the ring. At the default size these were fixed
          at text-5xl / 0.66rem, which overflowed the stroke as soon as a caller
          asked for a smaller ring. Both now derive from `size`, and the unit is
          held inside the inner circle so it can never cross the arc. */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-2">
        <span
          className="font-serif leading-none text-ink"
          style={{ fontSize: Math.round(size * 0.3) }}
        >
          {value}
        </span>
        {unit && (
          <span
            className="mt-1.5 text-center font-mono uppercase text-muted"
            style={{
              fontSize: Math.max(9, Math.round(size * 0.058 * 10) / 10),
              letterSpacing: size < 140 ? "0.14em" : "0.2em",
              maxWidth: size - stroke * 2 - 12,
            }}
          >
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}
