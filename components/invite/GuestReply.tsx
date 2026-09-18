"use client";

import { useState } from "react";
import { reply, withdraw } from "@/app/i/[slug]/actions";
import {
  ANSWERS,
  GUEST_NAME_MAX,
  GUEST_NOTE_MAX,
  PARTY_MAX,
  type Answer,
} from "@/lib/invitations";

const inputClass =
  "w-full rounded-lg border border-border bg-bg px-3.5 py-3 font-mono text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none";

/**
 * A guest saying whether they are coming.
 *
 * ── What this form is not ────────────────────────────────────────────────
 * It is not a sign-up. There is no password, no email, no account made
 * quietly in the background, and no way for this page to become one. Somebody
 * opened a link their cousin sent them; they should be able to answer it in
 * ten seconds on a bus and close the tab.
 *
 * ── Two fields, and everything else folded away ──────────────────────────
 * It had five fields on show, which is three too many. A form that looks long
 * gets abandoned, and an abandoned form is a guest the host never counts.
 *
 * At rest it is now: which of the three, your name, send. How many you are
 * bringing, an address for reminders and a word to the host are all real and
 * all useful — and all optional — so they sit behind one line that says what
 * is under it. Anybody who wants them opens it; nobody who does not has to
 * scroll past them to reach the button.
 *
 * The three answers are one tap each and are real buttons, not a select — a
 * select hides two of the three behind an interaction, and one of those two is
 * "I can't come", which is the answer people most need permission to give.
 */
export function GuestReply({
  slug,
  mine,
  allowPlusOnes,
  open,
}: {
  slug: string;
  /** Their existing answer, recognised by the token in their browser. */
  mine: {
    name: string;
    answer: string;
    partySize: number;
    note: string | null;
    email: string | null;
  } | null;
  allowPlusOnes: boolean;
  open: boolean;
}) {
  const [answer, setAnswer] = useState<Answer | null>(
    (mine?.answer as Answer | undefined) ?? null,
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  /**
   * What we just did, not what state we are now in.
   *
   * `mine` comes from the server, and sending a reply revalidates the page —
   * so by the time the confirmation paints, `mine` is already set and reading
   * it would tell a first-time guest "Changed — thank you" about the answer
   * they had only just sent. Whether it was their first is decided before the
   * action runs, and kept.
   */
  const [saved, setSaved] = useState<"sent" | "changed" | null>(null);
  /**
   * Opened for somebody who has already filled one of them in, so a returning
   * guest sees their own details rather than having to go looking for them.
   */
  const [more, setMore] = useState(
    !!(mine && (mine.email || mine.note || mine.partySize > 1)),
  );

  if (!open) {
    return mine ? (
      <p className="prose-serif-sm text-muted">
        You said: <span className="text-ink">{labelFor(mine.answer)}</span>
        {mine.partySize > 1 ? `, ${mine.partySize} of you` : ""}. Replies are
        closed now — speak to them directly if that has changed.
      </p>
    ) : (
      <p className="prose-serif-sm text-muted">
        Replies are closed. Do speak to them directly — they will not mind.
      </p>
    );
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
      <input type="hidden" name="answer" value={answer ?? ""} />

      <div className="grid gap-2 sm:grid-cols-3">
        {ANSWERS.map((a) => {
          const on = answer === a.value;
          return (
            <button
              key={a.value}
              type="button"
              onClick={() => {
                setAnswer(a.value);
                setSaved(null);
              }}
              aria-pressed={on}
              className={`rounded-xl border px-4 py-3.5 font-serif text-base transition-colors ${
                on
                  ? "border-accent bg-accent/[0.12] text-ink"
                  : "border-border bg-bg text-muted hover:border-accent/40 hover:text-ink"
              }`}
            >
              {a.label}
            </button>
          );
        })}
      </div>

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
          + Bringing others, a reminder, or a word to them
        </button>
      )}

      {more && (
        <div className="space-y-4 rounded-xl border border-border bg-bg/40 p-4">
          {/* Asking "how many of you" of somebody who has just said they
              cannot come is the app not listening. */}
          {allowPlusOnes && answer !== "NO" && (
            <label className="block">
              <span className="mb-1.5 block font-mono text-[0.6rem] uppercase tracking-widest text-muted">
                How many of you, counting yourself
              </span>
              <input
                type="number"
                name="partySize"
                min={1}
                max={PARTY_MAX}
                defaultValue={mine?.partySize ?? 1}
                className={inputClass}
              />
            </label>
          )}

          {/* Only offered to somebody who is actually coming. Asking for an
              address from a person who has said they cannot make it is the
              app collecting something it has no use for. */}
          {answer !== "NO" && (
            <label className="block">
              <span className="mb-1.5 block font-mono text-[0.6rem] uppercase tracking-widest text-muted">
                Email, if you want reminding
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
                Two messages and nothing else: the evening before and on the
                morning — and a word if the day moves. No account, no list.
                Taking your reply back removes it.
              </span>
            </label>
          )}

          <label className="block">
            <span className="mb-1.5 block font-mono text-[0.6rem] uppercase tracking-widest text-muted">
              Anything to say
            </span>
            <textarea
              name="note"
              rows={2}
              maxLength={GUEST_NOTE_MAX}
              defaultValue={mine?.note ?? ""}
              placeholder="We'll be a little late — coming straight from church."
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
          disabled={busy || !answer}
          className="rounded-xl bg-accent px-5 py-3 font-mono text-sm font-medium text-on-accent transition-colors hover:bg-accent-deep disabled:opacity-40"
        >
          {busy ? "Sending…" : mine ? "Change my answer" : "Send my answer"}
        </button>
        {!answer && (
          <span className="font-mono text-[0.68rem] text-muted">
            Choose one above first.
          </span>
        )}
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

function labelFor(v: string): string {
  return ANSWERS.find((a) => a.value === v)?.label ?? v;
}
