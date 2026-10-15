import Link from "next/link";

/**
 * The way back out of a page that holds one thing.
 *
 * Every page a notification opens — one post, one letter, one prayer, one
 * word, one check-in, one appointment — needs the same line at the top, and
 * the point of these pages is that somebody arrives on them from outside the
 * app, with no history to go back through. Tapping the system back button
 * would return them to their notifications, not to the room the thing lives
 * in, so the room has to be offered.
 *
 * min-h-11 because this is the first thing a tired thumb reaches for.
 */
export function BackLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="mt-6 inline-flex min-h-11 items-center font-mono text-[0.68rem] uppercase tracking-widest text-muted hover:text-accent"
    >
      ← {children}
    </Link>
  );
}
