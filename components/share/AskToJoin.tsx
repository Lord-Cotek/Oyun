"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import {
  JOIN_NOTE_MAX,
  JOIN_WORDS,
  HELLO_NAME_MAX,
  RELATIONS,
} from "@/lib/post-share";
import type { GuestResult } from "@/components/share/GuestHello";

/**
 * Asking to be let in.
 *
 * ── The form is a request, and says so ───────────────────────────────────
 * The worst version of this feature is somebody filling in four fields,
 * believing they are now in the circle, and never hearing anything. So the
 * copy names who decides and admits the answer might be no, before the first
 * field rather than after the last one. "They decide — you will hear from
 * them by email if they do."
 *
 * ── Why the relationship is a chip row and not a text box ────────────────
 * Not for validation; nothing is validated by it, because nothing acts on it.
 * It is because this text is shown to a person — the mother, reading a card
 * about a stranger — and she should not be shown a sentence a stranger wrote
 * freely in a field labelled "who are you". Seven choices and "someone else"
 * carries every honest case and none of the dishonest ones.
 */
export function AskToJoin({
  token,
  who,
  asked,
  onAsk,
}: {
  token: string;
  /** "Amara and Chidi" — whose circle this is. */
  who: string;
  /** True when this browser has already asked. */
  asked: boolean;
  onAsk: (token: string, fd: FormData) => Promise<GuestResult>;
}) {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(asked);
  const [relation, setRelation] = useState<string>(RELATIONS[0]);
  const [error, setError] = useState<string | null>(null);

  if (done) {
    return (
      <section className="mt-6 rounded-2xl border border-border p-6 text-center">
        <p className="prose-serif-sm text-muted">
          {asked && !open ? JOIN_WORDS.already : JOIN_WORDS.done}
        </p>
      </section>
    );
  }

  return (
    <section className="mt-6 rounded-2xl border border-border p-6">
      <p className="font-serif text-lg leading-snug text-ink">
        {JOIN_WORDS.title}
      </p>
      <p className="mt-2 prose-serif-sm text-muted">{JOIN_WORDS.body(who)}</p>

      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-4 inline-flex min-h-11 items-center rounded-lg border border-border px-4 font-mono text-[0.68rem] uppercase tracking-widest text-accent hover:border-accent"
        >
          {JOIN_WORDS.send} →
        </button>
      ) : (
        <form
          action={async (fd) => {
            setError(null);
            fd.set("relation", relation);
            const r = await onAsk(token, fd);
            if (!r.ok) {
              setError(r.error ?? "That did not send. Try again?");
              return;
            }
            setDone(true);
          }}
          className="mt-5 space-y-4"
        >
          <label className="block">
            <span className="mb-1.5 block font-mono text-[0.62rem] uppercase tracking-widest text-muted">
              {JOIN_WORDS.nameLabel}
            </span>
            <input
              type="text"
              name="name"
              required
              maxLength={HELLO_NAME_MAX}
              className="w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 prose-serif-sm text-ink focus:border-accent focus:outline-none"
            />
          </label>

          <fieldset>
            <legend className="mb-1.5 font-mono text-[0.62rem] uppercase tracking-widest text-muted">
              {JOIN_WORDS.relationLabel}
            </legend>
            <div className="flex flex-wrap gap-1.5">
              {RELATIONS.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRelation(r)}
                  aria-pressed={relation === r}
                  className={`rounded-full px-3 py-1.5 font-mono text-[0.68rem] transition-colors ${
                    relation === r
                      ? "bg-accent text-on-accent"
                      : "border border-border text-muted hover:text-ink"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </fieldset>

          <label className="block">
            <span className="mb-1.5 block font-mono text-[0.62rem] uppercase tracking-widest text-muted">
              {JOIN_WORDS.emailLabel}
            </span>
            <input
              type="email"
              name="email"
              required
              inputMode="email"
              autoComplete="email"
              className="w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 prose-serif-sm text-ink focus:border-accent focus:outline-none"
            />
            <span className="mt-1 block font-mono text-[0.58rem] leading-relaxed text-muted">
              {JOIN_WORDS.emailHint}
            </span>
          </label>

          <label className="block">
            <span className="mb-1.5 block font-mono text-[0.62rem] uppercase tracking-widest text-muted">
              {JOIN_WORDS.noteLabel}
            </span>
            <textarea
              name="note"
              rows={2}
              maxLength={JOIN_NOTE_MAX}
              className="w-full resize-none rounded-lg border border-border bg-bg px-3.5 py-2.5 prose-serif-sm text-ink focus:border-accent focus:outline-none"
            />
          </label>

          <div className="flex flex-wrap items-center gap-2">
            <Ask />
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2 font-mono text-[0.68rem] text-muted hover:text-ink"
            >
              Not now
            </button>
          </div>
          {error && (
            <p className="font-mono text-[0.62rem] leading-relaxed text-negative">
              {error}
            </p>
          )}
        </form>
      )}
    </section>
  );
}

function Ask() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-accent px-4 py-2 font-mono text-sm font-medium text-on-accent transition-colors hover:bg-accent-deep disabled:opacity-50"
    >
      {pending ? "Sending…" : JOIN_WORDS.send}
    </button>
  );
}
