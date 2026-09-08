import Link from "next/link";
import { Eyebrow } from "@/components/ui/Eyebrow";

export interface LetterPreview {
  authorId: string;
  authorName: string | null;
  body: string;
  createdAtISO: string;
}

function Line({
  label,
  letter,
  viewerId,
}: {
  label: string;
  letter: LetterPreview;
  viewerId: string;
}) {
  const who =
    letter.authorId === viewerId
      ? "You"
      : letter.authorName?.trim().split(/\s+/)[0] || "Someone";
  const snippet =
    letter.body.length > 90 ? `${letter.body.slice(0, 90).trimEnd()}…` : letter.body;
  const when = new Date(letter.createdAtISO).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
  return (
    <div className="rounded-xl border border-border bg-bg/50 p-4">
      <p className="mb-1 font-mono text-[0.6rem] uppercase tracking-widest text-accent">
        {label}
      </p>
      <p className="line-clamp-2 font-serif text-base leading-snug text-ink">
        {snippet}
      </p>
      <p className="mt-1.5 font-mono text-[0.6rem] uppercase tracking-widest text-muted">
        {who} · {when}
      </p>
    </div>
  );
}

/**
 * A quiet home-page summary of letters — the latest one each way — with the
 * full thread, reactions, and writing kept on the Letters page so the home
 * stays calm.
 */
export function LettersSummary({
  couple,
  baby,
  viewerId,
}: {
  couple: LetterPreview | null;
  baby: LetterPreview | null;
  viewerId: string;
}) {
  const empty = !couple && !baby;
  return (
    <div className="surface-premium rounded-2xl border border-border p-6 md:p-7">
      <div className="mb-4 flex items-center justify-between">
        <Eyebrow>Letters</Eyebrow>
        <Link
          href="/letters"
          className="font-mono text-[0.68rem] uppercase tracking-widest text-accent underline underline-offset-4 hover:text-accent-deep"
        >
          Open letters →
        </Link>
      </div>
      {empty ? (
        <p className="font-mono text-sm leading-relaxed text-muted">
          No letters yet.{" "}
          <Link
            href="/letters"
            className="text-accent underline underline-offset-4"
          >
            Write the first →
          </Link>
        </p>
      ) : (
        <div className="space-y-3">
          {couple && (
            <Line label="Between you two" letter={couple} viewerId={viewerId} />
          )}
          {baby && (
            <Line label="To your baby" letter={baby} viewerId={viewerId} />
          )}
        </div>
      )}
    </div>
  );
}
