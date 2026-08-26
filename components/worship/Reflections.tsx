"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Eyebrow } from "@/components/ui/Eyebrow";

export interface NoteView {
  id: string;
  authorName: string;
  mine: boolean;
  isPrivate: boolean;
  body: string;
  when: string;
}

/**
 * Reflections on a Scripture reading — a family journal that grows with the
 * plan. Shared with the household by default; the author can keep one private
 * (visible only to them). Everyone can add; you can edit or remove your own.
 */
export function Reflections({
  passageRef,
  bookSlug,
  chapter,
  notes,
  onAdd,
  onUpdate,
  onDelete,
}: {
  passageRef: string;
  bookSlug: string;
  chapter: number;
  notes: NoteView[];
  onAdd: (input: {
    bookSlug: string;
    chapter: number;
    body: string;
    isPrivate: boolean;
  }) => Promise<void>;
  onUpdate: (input: {
    id: string;
    body: string;
    isPrivate: boolean;
  }) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [body, setBody] = useState("");
  const [isPrivate, setPrivate] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function submit() {
    const text = body.trim();
    if (!text || pending) return;
    start(async () => {
      await onAdd({ bookSlug, chapter, body: text, isPrivate });
      setBody("");
      setPrivate(false);
    });
  }

  return (
    <div className="surface-premium rounded-2xl border border-border p-6 md:p-8">
      <div className="flex items-baseline justify-between gap-3">
        <Eyebrow>Reflections</Eyebrow>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[0.6rem] uppercase tracking-widest text-muted">
            {passageRef}
          </span>
          <Link
            href="/journal"
            className="font-mono text-[0.6rem] uppercase tracking-widest text-accent underline underline-offset-4 hover:text-accent-deep"
          >
            Journal →
          </Link>
        </div>
      </div>
      <p className="mt-2 font-mono text-xs leading-relaxed text-muted">
        What is God showing your family here? Notes are shared with your circle
        unless you keep them private.
      </p>

      {/* existing reflections */}
      {notes.length > 0 && (
        <ul className="mt-5 space-y-3">
          {notes.map((n) =>
            editingId === n.id ? (
              <li key={n.id}>
                <EditRow
                  note={n}
                  pending={pending}
                  onCancel={() => setEditingId(null)}
                  onSave={(text, priv) =>
                    start(async () => {
                      await onUpdate({ id: n.id, body: text, isPrivate: priv });
                      setEditingId(null);
                    })
                  }
                />
              </li>
            ) : (
              <li
                key={n.id}
                className="rounded-xl border border-border bg-bg/60 p-4"
              >
                <div className="mb-1.5 flex flex-wrap items-center gap-2 font-mono text-[0.62rem] uppercase tracking-widest text-muted">
                  <span className="text-ink/80">{n.authorName}</span>
                  <span aria-hidden>·</span>
                  <span>{n.when}</span>
                  {n.isPrivate && (
                    <span className="rounded-full border border-border px-1.5 py-0.5 text-[0.55rem] text-muted">
                      Private
                    </span>
                  )}
                </div>
                <p className="whitespace-pre-line font-mono text-sm leading-relaxed text-ink/90">
                  {n.body}
                </p>
                {n.mine && (
                  <div className="mt-2 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setEditingId(n.id)}
                      className="font-mono text-[0.68rem] text-muted underline underline-offset-4 hover:text-accent"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      disabled={pending}
                      onClick={() => start(() => onDelete(n.id))}
                      className="font-mono text-[0.68rem] text-muted underline underline-offset-4 hover:text-negative disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </li>
            ),
          )}
        </ul>
      )}

      {/* composer */}
      <div className="mt-5">
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={3}
          placeholder="Write a reflection…"
          className="w-full resize-y rounded-xl border border-border bg-bg px-4 py-3 font-mono text-sm leading-relaxed text-ink placeholder:text-muted focus:border-accent focus:outline-none"
        />
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <label className="flex items-center gap-2 font-mono text-xs text-muted">
            <input
              type="checkbox"
              checked={isPrivate}
              onChange={(e) => setPrivate(e.target.checked)}
              className="h-4 w-4 accent-[color:var(--accent)]"
            />
            Keep private (just me)
          </label>
          <button
            type="button"
            disabled={pending || !body.trim()}
            onClick={submit}
            className="btn-primary rounded-lg px-5 py-2.5 font-mono text-sm font-medium text-on-accent transition-transform active:scale-[0.98] disabled:opacity-40"
          >
            {pending ? "Saving…" : "Save reflection"}
          </button>
        </div>
      </div>
    </div>
  );
}

function EditRow({
  note,
  pending,
  onCancel,
  onSave,
}: {
  note: NoteView;
  pending: boolean;
  onCancel: () => void;
  onSave: (body: string, isPrivate: boolean) => void;
}) {
  const [text, setText] = useState(note.body);
  const [priv, setPriv] = useState(note.isPrivate);
  return (
    <div className="rounded-xl border border-accent/30 bg-bg/60 p-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        className="w-full resize-y rounded-lg border border-border bg-bg px-3 py-2 font-mono text-sm leading-relaxed text-ink focus:border-accent focus:outline-none"
      />
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <label className="flex items-center gap-2 font-mono text-xs text-muted">
          <input
            type="checkbox"
            checked={priv}
            onChange={(e) => setPriv(e.target.checked)}
            className="h-4 w-4 accent-[color:var(--accent)]"
          />
          Private
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg px-3 py-2 font-mono text-xs text-muted hover:text-ink"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={pending || !text.trim()}
            onClick={() => onSave(text.trim(), priv)}
            className="btn-primary rounded-lg px-4 py-2 font-mono text-xs font-medium text-on-accent disabled:opacity-40"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
