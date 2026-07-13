"use client";

import { useRef } from "react";
import { useFormStatus } from "react-dom";
import { addCoupleLetter } from "@/app/journey/letter-actions";
import { Reactions } from "@/components/Reactions";
import { type CoupleLetter } from "@/lib/data";

/**
 * The shared "to each other" letters between the mother and her husband — a
 * two-way thread. Each of them can write, read, and react. The letters appear
 * on both her Care page and his journey; an accountability partner never sees
 * them.
 */
export function CoupleLetters({
  letters,
  viewerId,
  spouseFallback,
  placeholder,
}: {
  letters: CoupleLetter[];
  viewerId: string;
  spouseFallback: string;
  placeholder: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);

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
        {letters.length === 0 ? (
          <p className="font-mono text-xs text-muted">
            No letters between you yet. A first one can be a single line — a
            thanks, a hope, a Scripture.
          </p>
        ) : (
          letters.map((l) => {
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
          })
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
