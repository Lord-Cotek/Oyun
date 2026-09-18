import { LetterForm } from "@/components/care/LetterForm";
import { FirstStep, FirstStepFocus } from "@/components/ui/FirstStep";
import { Reactions } from "@/components/Reactions";
import { LetterReplies } from "@/components/letters/LetterReplies";
import { type BabyLetter } from "@/lib/data";

export type BabyLetterView = BabyLetter;

/**
 * The keepsake letters written to the baby. Both the mother and her husband
 * can write here, and both see every letter — so each entry is stamped with
 * who wrote it ("You" for the viewer, otherwise the author's first name).
 * Either parent can react to a letter.
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
          <FirstStep
            action={
              <FirstStepFocus htmlFor="letter-box">
                Tell them what you hoped for them today
              </FirstStepFocus>
            }
          >
            One line is a letter. These are kept for the child to read years
            from now, so write the thing you would want them to hear in your
            own voice — not the tidy version.
          </FirstStep>
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
                <div className="mt-3">
                  <Reactions
                    targetType="LETTER"
                    targetId={l.id}
                    initial={l.reactions}
                  />
                </div>
                {/* A letter to the baby becomes a thread over months — one
                    parent writes, the other adds to it — and the child reading
                    the whole of it later gets a conversation rather than two
                    monologues. */}
                <LetterReplies
                  letterId={l.id}
                  replies={l.replies}
                  viewerId={viewerId}
                />
              </div>
            );
          })
        )}
      </div>
    </>
  );
}
