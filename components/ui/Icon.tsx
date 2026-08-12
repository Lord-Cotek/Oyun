import { type SVGProps } from "react";

/**
 * A small, consistent line-icon vocabulary for Oyun — 24×24, inherits
 * `currentColor`, hairline stroke. Kept intentionally simple and geometric so
 * every icon reads as a sibling of the others (and of the OyunMark).
 */
export type IconName =
  | "book"
  | "message"
  | "question"
  | "flame"
  | "music"
  | "church"
  | "sparkles"
  | "clock"
  | "star"
  | "users"
  | "heart"
  | "ring"
  | "pulse"
  | "home"
  | "hands"
  | "settings"
  | "leaf";

const PATHS: Record<IconName, string> = {
  book: "M3 5c3-1 6-1 9 1 3-2 6-2 9-1v13c-3-1-6-1-9 1-3-2-6-2-9-1V5z M12 7v13",
  message: "M4 5h16v11H9l-4 4v-4H4z",
  question: "M9 9a3 3 0 1 1 4 2.8c-.8.4-1 .9-1 1.7v.5 M12 17h.01",
  flame:
    "M12 3c1.2 3 4 4.2 4 7.8A4 4 0 0 1 8 11c0-1.8 1-3 2.2-4 .3 1.8 1.8 2 1.8 3.4 0 .8-.4 1.2-.4 1.2",
  music: "M9 18a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0V6l10-2v10",
  church:
    "M12 2v3 M10 4h4 M5 21V11l7-4 7 4v10 M9.5 21v-5h5v5",
  sparkles:
    "M12 3l1.7 4.6L18 9l-4.3 1.4L12 15l-1.7-4.6L6 9l4.3-1.4L12 3z M18 15l.7 1.8L20.5 17l-1.8.6L18 19l-.7-1.4L15.5 17l1.8-.2L18 15z",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M12 7v5l3 2",
  star: "M12 3l2.7 5.7 6.3.8-4.6 4.3 1.2 6.2L12 17.7 6.4 20.3l1.2-6.2L3 9.8l6.3-.8L12 3z",
  users:
    "M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z M2.5 20a6.5 6.5 0 0 1 13 0 M16 4.2a3.5 3.5 0 0 1 0 6.6 M17.5 13.6A6.5 6.5 0 0 1 21.5 20",
  heart:
    "M12 20s-7-4.3-9.2-8.4C1.3 8.6 3.2 5 6.6 5c2 0 3.3 1.3 5.4 3 2.1-1.7 3.4-3 5.4-3 3.4 0 5.3 3.6 3.8 6.6C19 15.7 12 20 12 20z",
  ring: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  pulse: "M3 12h4l2-6 4 12 2-6h6",
  home: "M4 11l8-6 8 6 M6 10v10h12V10 M10 20v-6h4v6",
  hands:
    "M6 12l3-3 3 3 3-3 3 3 M4 12v4a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4v-4",
  settings:
    "M20 7h-8 M8 7H4 M16 4a3 3 0 1 0 0 6 3 3 0 0 0 0-6z M20 17h-4 M12 17H4 M8 14a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
  leaf: "M4 20c0-9 6-15 16-15 0 10-6 15-16 15z M9 15c2-3 5-5 8-6",
};

export function Icon({
  name,
  size = 20,
  ...props
}: SVGProps<SVGSVGElement> & { name: IconName; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
