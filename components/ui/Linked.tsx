import { Fragment } from "react";
import { displayUrl, linkPieces, safeHref } from "@/lib/linkify";

/**
 * Text as written, with any link in it clickable.
 *
 * Opens in a new tab so a guest who taps a shop link does not lose the
 * invitation they were reading, and carries noreferrer so the shop is never
 * told which invitation sent them. The rules about what may become a link at
 * all live in lib/linkify.ts.
 */
export function Linked({ text }: { text: string | null | undefined }) {
  if (!text) return null;
  const parts = linkPieces(text);
  return (
    <>
      {parts.map((p, i) => {
        const href = p.url ? safeHref(p.url) : null;
        if (!href) return <Fragment key={i}>{p.text}</Fragment>;
        return (
          <a
            key={i}
            href={href}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="break-words underline decoration-accent/50 underline-offset-2 transition-colors hover:decoration-accent"
          >
            {displayUrl(p.url!)}
          </a>
        );
      })}
    </>
  );
}
