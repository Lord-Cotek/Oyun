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
  const [sealing, setSealing] = useState(false);

  return (
    <form
      ref={formRef}
      action={async (fd) => {
        await addLetter(fd);
        formRef.current?.reset();
        setChildId("all");
        setSealing(false);
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
      {/* ── Sealed until a day ─────────────────────────────────────────
          For the letters meant to wait: "open on your first birthday". An
          envelope to everyone else until then; the writer can always
          reread their own. */}
      <label className="flex items-center gap-2.5 font-mono text-[0.68rem] text-muted">
        <input
          type="checkbox"
          checked={sealing}
          onChange={(e) => setSealing(e.target.checked)}
          className="h-4 w-4 accent-[color:var(--accent)]"
        />
        Seal it until a day
      </label>
      {sealing && (
        <div className="rounded-lg border border-border/80 bg-bg/40 p-3">
          <label htmlFor="letter-open-on" className="mb-1 block font-mono text-[0.6rem] uppercase tracking-widest text-muted">
            Opens on
          </label>
          <input
            id="letter-open-on"
            type="date"
            name="openOn"
            required
            min={new Date(Date.now() + 86_400_000).toISOString().slice(0, 10)}
            className="w-full rounded-lg border border-border bg-bg px-3 py-2 font-mono text-sm text-ink focus:border-accent focus:outline-none"
          />
          <p className="mt-1.5 prose-serif-xs text-muted">
            A first birthday, the first day of school, an eighteenth. Until
            then it is a sealed envelope to everyone but you, and you will
            both be told the morning it opens.
          </p>
        </div>
      )}
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
