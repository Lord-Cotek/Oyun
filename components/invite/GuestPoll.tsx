"use client";

import { useState } from "react";
import { reply, withdraw } from "@/app/i/[slug]/actions";
import { GUEST_NAME_MAX, GUEST_NOTE_MAX, longDay, timeRange } from "@/lib/invitations";

const inputClass =
  "w-full rounded-lg border border-border bg-bg px-3.5 py-3 font-mono text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none";

/**
 * "Which of these suits you?" — the other half of an invitation.
 *
 * ── Why this is not the ordinary form with checkboxes bolted on ──────────
 * The question is genuinely different. On a settled day the question is "are
 * you coming"; here it is "which of these could you do", and whether they are
 * coming is not a second thing to ask — ticking any day at all is the yes, and
 * ticking none is "none of these work", which is a real and useful answer.
 * Asking both would let somebody say two contradictory things on one screen.
 *
 * So: the days, your name, send. Everything else folded away, and no head
 * count asked for — how many are coming is a question for after there is a day
 * to come to.
 *
 * ── Tick every one that works, not your favourite ────────────────────────
 * Said plainly above the list, because it is the whole difference between a
 * poll that finds a day everybody can do and one that finds nothing. Left
 * unsaid, people tick one.
 */
export function GuestPoll({
  slug,
  options,
  mine,
  open,
}: {
  slug: string;
  options: { id: string; at: Date; hasTime: boolean; endsAt: Date | null }[];
  mine: {
    name: string;
    note: string | null;
    email: string | null;
    optionIds: string[];
  } | null;
  open: boolean;
}) {
  const [ticked, setTicked] = useState<Set<string>>(
    () => new Set(mine?.optionIds ?? []),
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<"sent" | "changed" | null>(null);
  const [more, setMore] = useState(!!(mine && (mine.email || mine.note)));

  if (!open) {
    return (
      <p className="prose-serif-sm text-muted">
        {mine
          ? `You answered for ${mine.optionIds.length} of these. Replies are closed now — speak to them directly if that has changed.`
          : "Replies are closed. Do speak to them directly — they will not mind."}
      </p>
    );
  }

  function toggle(id: string) {
    setSaved(null);
    setTicked((t) => {
      const next = new Set(t);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <form
      action={async (fd) => {
        const wasChange = !!mine;
        setBusy(true);
        setError(null);
        const res = await reply(fd);
        setBusy(false);
        if (res.ok) setSaved(wasChange ? "changed" : "sent");
        else setError(res.error);
      }}
      className="space-y-4"
    >
      <input type="hidden" name="slug" value={slug} />
      {[...ticked].map((id) => (
        <input key={id} type="hidden" name="option" value={id} />
      ))}

      <p className="prose-serif-xs text-muted">
        Tick every one that could work — not just the one you like best. The
        more you tick, the likelier they are to find a day everybody can do.
      </p>

      <div className="space-y-2">
        {options.map((o) => {
          const on = ticked.has(o.id);
          const hours = timeRange(o.at, o.hasTime, o.endsAt);
          return (
            <button
              key={o.id}
              type="button"
              onClick={() => toggle(o.id)}
              aria-pressed={on}
              className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition-colors ${
                on
                  ? "border-accent bg-accent/[0.12]"
                  : "border-border bg-bg hover:border-accent/40"
              }`}
            >
              <span
                aria-hidden
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border font-mono text-xs leading-none ${
                  on
                    ? "border-accent bg-accent text-on-accent"
                    : "border-border text-transparent"
                }`}
              >
                ✓
              </span>
              <span className="min-w-0">
                <span
                  className={`block font-serif text-base ${on ? "text-ink" : "text-muted"}`}
                >
                  {longDay(o.at)}
                </span>
                {hours && (
                  <span className="block font-mono text-[0.66rem] text-muted">
                    {hours}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      {ticked.size === 0 && (
        <p className="font-mono text-[0.68rem] text-muted">
          Nothing ticked — sending now tells them none of these suit you, which
          is worth knowing too.
        </p>
      )}

      <label className="block">
        <span className="mb-1.5 block font-mono text-[0.6rem] uppercase tracking-widest text-muted">
          Your name
        </span>
        <input
          name="name"
          required
          maxLength={GUEST_NAME_MAX}
          defaultValue={mine?.name ?? ""}
          placeholder="Who shall we say?"
          className={inputClass}
        />
      </label>

      {!more && (
        <button
          type="button"
          onClick={() => setMore(true)}
          className="font-mono text-[0.68rem] text-accent underline underline-offset-4"
        >
          + Tell me which day they choose, or leave a word
        </button>
      )}

      {more && (
        <div className="space-y-4 rounded-xl border border-border bg-bg/40 p-4">
          <label className="block">
            <span className="mb-1.5 block font-mono text-[0.6rem] uppercase tracking-widest text-muted">
              Email, if you want telling
            </span>
            <input
              type="email"
              name="email"
              autoComplete="email"
              defaultValue={mine?.email ?? ""}
              placeholder="you@example.com"
              className={inputClass}
            />
            <span className="mt-1.5 block prose-serif-xs text-muted">
              One message, when they settle on a day — and a word if it then
              moves or is called off. Nothing else, no account, no list. Taking
              your reply back removes it.
            </span>
          </label>

          <label className="block">
            <span className="mb-1.5 block font-mono text-[0.6rem] uppercase tracking-widest text-muted">
              Anything to say
            </span>
            <textarea
              name="note"
              rows={2}
              maxLength={GUEST_NOTE_MAX}
              defaultValue={mine?.note ?? ""}
              placeholder="Any of those, but the earlier the better for the children."
              className={inputClass}
            />
          </label>
        </div>
      )}

      {error && <p className="font-mono text-sm text-negative">{error}</p>}
      {saved && (
        <p role="status" className="font-mono text-sm text-positive">
          {saved === "changed" ? "Changed — thank you." : "Sent. They will see it."}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={busy}
          className="rounded-xl bg-accent px-5 py-3 font-mono text-sm font-medium text-on-accent transition-colors hover:bg-accent-deep disabled:opacity-40"
        >
          {busy ? "Sending…" : mine ? "Change my answer" : "Send my answer"}
        </button>
        {mine && (
          <button
            type="button"
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              await withdraw(slug);
              setBusy(false);
            }}
            className="font-mono text-[0.68rem] text-muted underline underline-offset-4 hover:text-ink"
          >
            Take my reply back
          </button>
        )}
      </div>
    </form>
  );
}
