"use client";

import { useMemo, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import {
  addCoupleLetter,
  loadEarlierCoupleLetters,
} from "@/app/journey/letter-actions";
import { Reactions } from "@/components/Reactions";
import { type CoupleLetter } from "@/lib/data";

/**
 * The shared "to each other" letters between the mother and her husband — a
 * two-way thread, newest first. Each of them can write, read, and react. The
 * most recent letters show first; older ones load a page at a time, so a couple
 * writing every day never faces an endless wall of text. An accountability
 * partner never sees this.
 */
export function CoupleLetters({
  letters,
  hasMore,
  viewerId,
  spouseFallback,
  placeholder,
}: {
  letters: CoupleLetter[];
  hasMore: boolean;
  viewerId: string;
  spouseFallback: string;
  placeholder: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [older, setOlder] = useState<CoupleLetter[]>([]);
  const [more, setMore] = useState(hasMore);
  const [loading, setLoading] = useState(false);

  // The recent page (`letters`) refreshes when a new letter is written; the
  // older pages accumulate in state. Merge, de-dupe by id, newest first.
  const combined = useMemo(() => {
    const byId = new Map<string, CoupleLetter>();
    for (const l of [...letters, ...older]) byId.set(l.id, l);
    return [...byId.values()].sort((a, b) =>
      a.createdAt < b.createdAt ? 1 : a.createdAt > b.createdAt ? -1 : 0,
    );
  }, [letters, older]);

  async function loadEarlier() {
    if (loading) return;
    setLoading(true);
    try {
      const cursor = combined[combined.length - 1]?.createdAt;
      if (cursor) {
        const res = await loadEarlierCoupleLetters(cursor);
        setOlder((o) => [...o, ...res.items]);
        setMore(res.hasMore);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <form
        ref={formRef}
        action={async (fd) => {
          await addCoupleLetter(fd);
          formRef.current?.reset();
        }}
        className="space-y-3"
      >
        <textarea
          name="body"
          rows={3}
          required
          placeholder={placeholder}
          className="w-full resize-none rounded-lg border border-border bg-bg px-3.5 py-2.5 font-mono text-sm leading-relaxed text-ink placeholder:text-muted focus:border-accent focus:outline-none"
        />
        <Submit />
      </form>

      <div className="mt-6 space-y-3 border-t border-border pt-5">
        {combined.length === 0 ? (
          <p className="font-mono text-xs text-muted">
            No letters between you yet. A first one can be a single line — a
            thanks, a hope, a Scripture.
          </p>
        ) : (
          <>
            {combined.map((l) => {
              const mine = l.authorId === viewerId;
              return (
                <div
                  key={l.id}
                  className={`rounded-lg border p-4 ${
                    mine
                      ? "border-accent/30 bg-accent/[0.05]"
                      : "border-border bg-bg"
                  }`}
                >
                  <p className="whitespace-pre-wrap font-serif text-base leading-relaxed text-ink">
                    {l.body}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                    <p className="font-mono text-[0.68rem] uppercase tracking-widest text-muted">
                      {mine ? "You" : l.authorName?.trim() || spouseFallback} ·{" "}
                      {new Date(l.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                    <Reactions
                      targetType="LETTER"
                      targetId={l.id}
                      initial={l.reactions}
                      align="end"
                    />
                  </div>
                </div>
              );
            })}
            {more && (
              <button
                type="button"
                onClick={loadEarlier}
                disabled={loading}
                className="w-full rounded-lg border border-border py-2.5 font-mono text-xs text-muted transition-colors hover:border-accent hover:text-accent disabled:opacity-50"
              >
                {loading ? "Loading…" : "Show earlier letters"}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-accent px-4 py-2 font-mono text-sm font-medium text-on-accent transition-colors hover:bg-accent-deep disabled:opacity-50"
    >
      {pending ? "Sending…" : "Write to them"}
    </button>
  );
}
