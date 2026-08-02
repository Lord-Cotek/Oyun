import { LetterForm } from "@/components/care/LetterForm";

export type BabyLetterView = {
  id: string;
  body: string;
  createdAt: string; // ISO
  authorName: string | null;
  authorId: string;
};

/**
 * The keepsake letters written to the baby. Both the mother and her husband
 * can write here, and both see every letter — so each entry is stamped with
 * who wrote it ("You" for the viewer, otherwise the author's first name).
 */
export function BabyLetters({
  letters,
  viewerId,
  placeholder,
}: {
  letters: BabyLetterView[];
  viewerId: string;
  placeholder?: string;
}) {
  return (
    <>
      <LetterForm placeholder={placeholder} />
      <div className="mt-6 space-y-3 border-t border-border pt-5">
        {letters.length === 0 ? (
          <p className="font-mono text-xs text-muted">
            No letters yet. The first can be one line.
          </p>
        ) : (
          letters.map((l) => {
            const who =
              l.authorId === viewerId
                ? "You"
                : l.authorName?.trim().split(/\s+/)[0] || "Someone";
            return (
              <div key={l.id} className="rounded-lg border border-border bg-bg p-4">
                <p className="whitespace-pre-wrap font-serif text-base leading-relaxed text-ink">
                  {l.body}
                </p>
                <p className="mt-3 font-mono text-[0.68rem] uppercase tracking-widest text-muted">
                  {who} · to the baby ·{" "}
                  {new Date(l.createdAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            );
          })
        )}
      </div>
    </>
  );
}
