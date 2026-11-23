import Link from "next/link";

/**
 * A way on from the error screen, which replaces the page — header and all.
 * Only rooms everybody has, so it needs nothing from the server that may be
 * what just failed; a room a person cannot open says so itself.
 */
const ROOMS = [
  { href: "/journey", label: "Home" },
  { href: "/life", label: "Life" },
  // Rooms every reader has under the same name, whichever way they chose
  // Oyun to speak to them — this screen cannot ask (see lib/voice.ts).
  { href: "/help", label: "Help" },
  { href: "/settings", label: "Settings" },
];

export function ErrorNav() {
  return (
    <nav aria-label="Rooms" className="mt-10 border-t border-border pt-6">
      <ul className="flex flex-wrap justify-center gap-2">
        {ROOMS.map((r) => (
          <li key={r.href}>
            <Link
              href={r.href}
              className="inline-flex min-h-11 items-center rounded-lg border border-border px-4 font-mono text-xs text-muted transition-colors hover:border-accent hover:text-ink"
            >
              {r.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
