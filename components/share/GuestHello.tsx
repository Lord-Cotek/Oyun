"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import {
  HELLO_BODY_MAX,
  HELLO_NAME_MAX,
  HELLO_WORDS,
} from "@/lib/post-share";

export interface GuestResult {
  ok: boolean;
  error?: string;
}

/**
 * A word back, from somebody outside.
 *
 * ── Why "only they will read this" is the most important line here ───────
 * A guest who believes they are posting a public comment writes a different
 * thing from one who knows they are sending a private note — the first is
 * partly a performance, the second is just a message. And it happens to be
 * true: a hello is shown to the family and to the person who wrote it, and to
 * nobody else, including other people holding the same link. So it is said
 * plainly, above the box, before anybody starts typing.
 *
 * ── Why there is no list of other people's hellos ────────────────────────
 * Because that is a comment section, and a comment section under a forwarded
 * photograph of somebody's child is the exact thing this whole feature is
 * shaped to avoid. It also means nothing written here needs moderating: the
 * worst a stranger can do is send one unpleasant sentence to one family, who
 * can take it down, rather than publish it to everyone the link reached.
 */
export function GuestHello({
  token,
  mine,
  onSay,
  onUnsay,
}: {
  token: string;
  /** What this person already said, if they have been here before. */
  mine: { name: string; body: string } | null;
  onSay: (token: string, fd: FormData) => Promise<GuestResult>;
  onUnsay: (token: string) => Promise<GuestResult>;
}) {
  const [said, setSaid] = useState(mine);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (said && !editing) {
    return (
      <section
        aria-label="What you said"
        className="mt-6 rounded-2xl border border-border bg-surface p-6"
      >
        <p className="font-mono text-[0.62rem] uppercase tracking-widest text-accent">
          {HELLO_WORDS.sent}
        </p>
        <p className="mt-3 prose-serif-xs text-muted">{HELLO_WORDS.yours}</p>
        <p className="mt-1 whitespace-pre-wrap font-serif text-lg leading-snug text-ink">
          {said.body}
        </p>
        <p className="mt-2 font-mono text-[0.62rem] uppercase tracking-widest text-muted">
          — {said.name}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="rounded-lg border border-border px-3 py-2 font-mono text-[0.68rem] text-muted hover:border-accent hover:text-accent"
          >
            {HELLO_WORDS.change}
          </button>
          <button
            type="button"
            onClick={async () => {
              const r = await onUnsay(token);
              if (r.ok) {
                setSaid(null);
                setEditing(false);
              }
            }}
            className="rounded-lg border border-border px-3 py-2 font-mono text-[0.68rem] text-muted hover:border-negative hover:text-negative"
          >
            {HELLO_WORDS.remove}
          </button>
        </div>
      </section>
    );
  }

  return (
    <section
      aria-label="Say something to them"
      className="mt-6 rounded-2xl border border-border bg-surface p-6"
    >
      <p className="font-serif text-lg leading-snug text-ink">
        {HELLO_WORDS.prompt}
      </p>
      <p className="mt-1 prose-serif-xs text-muted">{HELLO_WORDS.onlyThem}</p>

      <form
        action={async (fd) => {
          setError(null);
          const r = await onSay(token, fd);
          if (!r.ok) {
            setError(r.error ?? "That did not send. Try again?");
            return;
          }
          setSaid({
            name: String(fd.get("name") ?? ""),
            body: String(fd.get("body") ?? ""),
          });
          setEditing(false);
        }}
        className="mt-4 space-y-3"
      >
        <input
          type="text"
          name="name"
          id="hello-name"
          required
          defaultValue={said?.name ?? ""}
          maxLength={HELLO_NAME_MAX}
          placeholder="Your name"
          className="w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 prose-serif-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none"
        />
        <textarea
          name="body"
          id="hello-body"
          required
          rows={3}
          defaultValue={said?.body ?? ""}
          maxLength={HELLO_BODY_MAX}
          placeholder={HELLO_WORDS.placeholder}
          className="w-full resize-none rounded-lg border border-border bg-bg px-3.5 py-2.5 prose-serif-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none"
        />
        <div className="flex flex-wrap items-center gap-2">
          <Send />
          {editing && (
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="rounded-lg px-3 py-2 font-mono text-[0.68rem] text-muted hover:text-ink"
            >
              Cancel
            </button>
          )}
        </div>
        {error && (
          <p className="font-mono text-[0.62rem] leading-relaxed text-negative">
            {error}
          </p>
        )}
      </form>
    </section>
  );
}

function Send() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-accent px-4 py-2 font-mono text-sm font-medium text-on-accent transition-colors hover:bg-accent-deep disabled:opacity-50"
    >
      {pending ? "Sending…" : "Send it to them"}
    </button>
  );
}
