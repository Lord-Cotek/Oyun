"use client";

import { useId, useState, useTransition } from "react";

export type EditField = {
  name: string;
  label: string;
  kind: "text" | "textarea" | "date" | "select";
  value: string;
  max?: number;
  required?: boolean;
  rows?: number;
  options?: { value: string; label: string }[];
  hint?: string;
};

type Result = { ok: boolean; error?: string } | void;

/**
 * Change something in place, instead of deleting it and typing it again.
 *
 * Delete-and-retype loses the date it happened, the photographs, the
 * reactions and the replies. This opens the thing's own words where they
 * stand, saves them through an action that checks the same rules its delete
 * does, and closes again. Nothing else about the thing changes.
 *
 * The action returns `{ ok: false, error }` to say what was wrong, in words
 * for the person; a throw is shown as a plain "did not save".
 */
export function EditInPlace({
  fields,
  hidden = {},
  action,
  word = "Edit",
  describe,
  className = "font-mono text-[0.68rem] text-muted underline-offset-2 hover:text-accent hover:underline",
}: {
  fields: EditField[];
  hidden?: Record<string, string>;
  action: (fd: FormData) => Promise<Result>;
  word?: string;
  /** For the screen reader: "this prayer request", "Tolu's first tooth". */
  describe: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const id = useId();

  if (!open) {
    return (
      <button type="button" className={className} aria-label={`${word} ${describe}`} onClick={() => setOpen(true)}>
        {word}
      </button>
    );
  }

  const input =
    "w-full rounded-lg border border-border bg-bg px-3 py-2 font-mono text-sm text-ink focus:border-accent focus:outline-none";

  return (
    <form
      className="mt-3 w-full space-y-3 rounded-xl border border-accent/30 bg-surface/60 p-4"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        setError(null);
        start(async () => {
          try {
            const r = await action(fd);
            if (r && r.ok === false) setError(r.error ?? "That did not save. Please try again.");
            else setOpen(false);
          } catch {
            setError("That did not save. Please try again.");
          }
        });
      }}
    >
      {Object.entries(hidden).map(([k, v]) => (
        <input key={k} type="hidden" name={k} value={v} />
      ))}
      {fields.map((f, i) => {
        const fid = `${id}-${f.name}`;
        return (
          <label key={f.name} htmlFor={fid} className="block">
            <span className="eyebrow mb-1.5 block text-muted">{f.label}</span>
            {f.kind === "textarea" ? (
              <textarea
                id={fid}
                name={f.name}
                defaultValue={f.value}
                maxLength={f.max}
                required={f.required}
                rows={f.rows ?? 4}
                autoFocus={i === 0}
                className={`${input} resize-y`}
              />
            ) : f.kind === "select" ? (
              <select id={fid} name={f.name} defaultValue={f.value} className={input}>
                {(f.options ?? []).map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                id={fid}
                name={f.name}
                type={f.kind}
                defaultValue={f.value}
                maxLength={f.max}
                required={f.required}
                autoFocus={i === 0}
                className={input}
              />
            )}
            {f.hint && <span className="mt-1 block font-mono text-[0.62rem] text-muted">{f.hint}</span>}
          </label>
        );
      })}
      {error && <p className="font-mono text-xs text-negative" role="alert">{error}</p>}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-accent px-4 py-2 font-mono text-xs font-medium text-on-accent transition-colors hover:bg-accent-deep disabled:opacity-50"
        >
          {pending ? "Saving…" : "Save"}
        </button>
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            setError(null);
          }}
          className="font-mono text-xs text-muted underline underline-offset-4 hover:text-accent"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

/** A date as the value a date input wants, from a Date or ISO string. */
export function dateInputValue(d: Date | string | null | undefined): string {
  if (!d) return "";
  const x = typeof d === "string" ? new Date(d) : d;
  return Number.isNaN(x.getTime()) ? "" : x.toISOString().slice(0, 10);
}
