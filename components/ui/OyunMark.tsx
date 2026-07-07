import { type SVGProps } from "react";

/**
 * The Oyun mark — the quiet brand mark and the assistant trigger.
 * The ring inherits `currentColor` (so it recolors with text/context);
 * the curl uses the accent. Based on the supplied SVG path data.
 */
export function OyunMark({
  size = 40,
  title = "Oyun",
  ...props
}: SVGProps<SVGSVGElement> & { size?: number; title?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      role="img"
      aria-label={title}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g transform="translate(60,60)">
        <path
          d="M 0 -46 C 42 -46 56 -6 56 12 C 56 40 33 52 0 52 C -33 52 -56 40 -56 12 C -56 -6 -42 -46 0 -46"
          fill="none"
          stroke="currentColor"
          strokeWidth={6}
          strokeLinecap="round"
        />
        <path
          d="M -3 -20 C 22 -18 30 8 18 28 C 11 40 -7 43 -17 33 C -26 24 -22 10 -10 10 C -3 10 -1 -4 -3 -20 Z"
          fill="var(--accent)"
        />
      </g>
    </svg>
  );
}
