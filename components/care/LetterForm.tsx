"use client";

import { useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { addLetter } from "@/app/care/actions";
import { DraftTextarea } from "@/components/ui/DraftTextarea";

/**
 * Writing a keepsake letter.
 *
 * ── Who it is to ─────────────────────────────────────────────────────────
 * With one baby there is nothing to choose between, so there is no chooser:
 * the letter is to them and the form stays the one calm box it has always
 * been. With two or more, and only once they have arrived and have names,
 * a row appears — all of them, or one by name.
 *
 * "All of them" is the default and stays the default. A parent of twins
 * writing at two in the morning is usually writing to both, and a picker
 * that made them choose every time would be a toll on the thing the app most
 * wants them to do.
 */
export function LetterForm({
  placeholder,
  babies = [],
}: {
  placeholder?: string;
  /**
   * Their children, once they have arrived. Empty or one means no choice to
   * make. Not called `children`: that name belongs to React on a component,
   * and a prop that shadows it is a trap for whoever edits this next.
   */
  babies?: { id: string; name: string }[];
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [childId, setChildId] = useState("all");

  return (
    <form
      ref={formRef}
      action={async (fd) => {
        await addLetter(fd);
        formRef.current?.reset();
        setChildId("all");
      }}
      className="space-y-3"
    >
      <input type="hidden" name="toBaby" value="true" />
      <input type="hidden" name="childId" value={childId} />

      {babies.length > 1 && (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1 font-mono text-[0.62rem] uppercase tracking-widest text-muted">
            To
          </span>
          <Who on={childId === "all"} onClick={() => setChildId("all")}>
            {babies.length === 2 ? "Both of them" : "All of them"}
          </Who>
          {babies.map((c) => (
            <Who
              key={c.id}
              on={childId === c.id}
              onClick={() => setChildId(c.id)}
            >
              {c.name}
            </Who>
          ))}
        </div>
      )}
      <DraftTextarea
        draftKey="letter:baby"
        id="letter-box"
        name="body"
        rows={4}
        required
        placeholder={placeholder ?? "Dear little one…"}
        className="w-full resize-none rounded-lg border border-border bg-bg px-3.5 py-2.5 prose-serif-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none"
      />
      <Submit />
    </form>
  );
}

function Who({
  on,
  onClick,
  children,
}: {
  on: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={`rounded-full px-3 py-1.5 font-mono text-[0.68rem] transition-colors ${
        on
          ? "bg-accent text-on-accent"
          : "border border-border text-muted hover:text-ink"
      }`}
    >
      {children}
    </button>
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
      {pending ? "Keeping…" : "Keep this letter"}
    </button>
  );
}
