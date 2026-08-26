"use client";

import { useState, useTransition } from "react";

export interface JournalNote {
  id: string;
  passageRef: string;
  authorName: string;
  mine: boolean;
  isPrivate: boolean;
  body: string;
  when: string;
}

/**
 * The family's reflection journal — every note they've written across the
 * reading plan, newest first. Shared notes from the circle plus the reader's
 * own private ones. Each person can edit or remove their own.
 */
export function ReflectionJournal({
  notes,
  onUpdate,
  onDelete,
}: {
  notes: JournalNote[];
  onUpdate: (input: {
    id: string;
    body: string;
    isPrivate: boolean;
  }) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pending, start] = useTransition();

  return (
    <ul className="space-y-3">
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
            className="surface-premium rounded-xl border border-border p-5"
          >
            <div className="mb-1.5 flex flex-wrap items-center gap-2 font-mono text-[0.62rem] uppercase tracking-widest text-muted">
              <span className="text-accent">{n.passageRef}</span>
              <span aria-hidden>·</span>
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
  );
}

function EditRow({
  note,
  pending,
  onCancel,
  onSave,
}: {
  note: JournalNote;
  pending: boolean;
  onCancel: () => void;
  onSave: (body: string, isPrivate: boolean) => void;
}) {
  const [text, setText] = useState(note.body);
  const [priv, setPriv] = useState(note.isPrivate);
  return (
    <div className="rounded-xl border border-accent/30 bg-bg/60 p-5">
      <div className="mb-2 font-mono text-[0.62rem] uppercase tracking-widest text-accent">
        {note.passageRef}
      </div>
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
