import { Eyebrow } from "@/components/ui/Eyebrow";

type Item = {
  id: string;
  body: string;
  verseRef: string | null;
  createdAt: Date;
  authorName: string | null;
};

/** Displays words of encouragement received from the other member(s). */
export function Encouragements({
  items,
  emptyHint,
}: {
  items: Item[];
  emptyHint: string;
}) {
  return (
    <div>
      <Eyebrow className="mb-3">Words for you</Eyebrow>
      {items.length === 0 ? (
        <p className="font-mono text-xs leading-relaxed text-muted">{emptyHint}</p>
      ) : (
        <ul className="space-y-3">
          {items.map((e) => (
            <li key={e.id} className="rounded-lg border border-border bg-bg p-4">
              <p className="font-serif text-base leading-relaxed text-ink">
                &ldquo;{e.body}&rdquo;
              </p>
              <p className="mt-2 font-mono text-[0.68rem] uppercase tracking-widest text-muted">
                {e.authorName ?? "Your companion"}
                {e.verseRef ? ` · ${e.verseRef}` : ""} ·{" "}
                {e.createdAt.toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
