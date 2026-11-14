import {
  LINK_META,
  cleanUrl,
  linkHost,
  linkLabel,
  toLinkKind,
} from "@/lib/invite-links";

/**
 * The host's useful links, as a guest sees them: one large button each, with
 * the site it goes to written underneath.
 *
 * Every link is checked again here, at the moment it is drawn, even though it
 * was checked when the host saved it. This is the one place a host's typing
 * becomes a stranger's tap, so it does not lean on an earlier promise.
 */
export function GuestLinks({
  links,
  className = "",
}: {
  links: { id: string; kind: string; label: string; url: string }[];
  className?: string;
}) {
  const safe = links
    .map((l) => ({ ...l, href: cleanUrl(l.url) }))
    .filter((l): l is typeof l & { href: string } => l.href !== null);
  if (safe.length === 0) return null;

  return (
    <ul className={`grid gap-2 sm:grid-cols-2 ${className}`}>
      {safe.map((l) => {
        const meta = LINK_META[toLinkKind(l.kind)];
        return (
          <li key={l.id}>
            <a
              href={l.href}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="flex h-full items-center gap-3 rounded-xl border border-border bg-bg/50 px-4 py-3 transition-colors hover:border-accent"
            >
              <span aria-hidden="true" className="text-xl leading-none">
                {meta.mark}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-serif text-base text-ink">
                  {linkLabel(l.kind, l.label)}
                </span>
                <span className="block truncate font-mono text-[0.62rem] text-muted">
                  {linkHost(l.href)}
                </span>
              </span>
              <span aria-hidden="true" className="font-mono text-sm text-accent">
                ↗
              </span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
