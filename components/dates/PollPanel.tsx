"use client";

import { useState } from "react";
import { askWhichDay, settleOnDay } from "@/app/appointments/event-actions";
import {
  MAX_OPTIONS,
  MIN_OPTIONS,
  longDay,
  optionSentence,
  rankOptions,
  tiedWith,
  timeRange,
} from "@/lib/invitations";

export type PollOption = {
  id: string;
  atISO: string;
  hasTime: boolean;
  endsAtISO: string | null;
  votes: number;
};

const inputClass =
  "w-full rounded-lg border border-border bg-bg px-3 py-2.5 font-mono text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none";

/**
 * "Which day suits?" from the host's side.
 *
 * Before anybody answers it is a short list of days to offer. Once they start
 * answering it becomes a result — ordered best first, because the host is
 * trying to answer exactly one question and making them scan a list of dates
 * for the biggest number is the page refusing to do its job.
 */
export function PollPanel({
  eventId,
  options,
  replied,
  settled,
}: {
  eventId: string;
  options: PollOption[];
  /** How many people have answered at all, so "4 of 7" can be said. */
  replied: number;
  settled: boolean;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(options.length === 0);
  const [rows, setRows] = useState<{ date: string; time: string }[]>(() =>
    options.length
      ? options.map((o) => ({
          date: o.atISO.slice(0, 10),
          time: o.hasTime ? o.atISO.slice(11, 16) : "",
        }))
      : [
          { date: "", time: "" },
          { date: "", time: "" },
        ],
  );

  const asLike = options.map((o) => ({
    id: o.id,
    at: new Date(o.atISO),
    hasTime: o.hasTime,
    endsAt: o.endsAtISO ? new Date(o.endsAtISO) : null,
    votes: o.votes,
  }));
  const ranked = rankOptions(asLike);
  const tied = tiedWith(asLike);

  if (settled) {
    return (
      <div className="mt-3 rounded-xl border border-border bg-bg/40 p-4">
        <p className="font-mono text-[0.68rem] uppercase tracking-widest text-muted">
          The day was chosen from {options.length} offered
        </p>
        <ul className="mt-2 space-y-1">
          {ranked.map((o) => (
            <li key={o.id} className="font-mono text-[0.7rem] text-muted">
              {longDay(o.at)} — {optionSentence(o.votes, replied)}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="mt-3 rounded-xl border border-accent/25 bg-accent/[0.04] p-4">
      <p className="font-serif text-lg text-ink">Which day suits?</p>

      {!editing && options.length > 0 && (
        <>
          <p className="mt-0.5 prose-serif-xs text-muted">
            {replied === 0
              ? "Nobody has answered yet. Send them the link."
              : `${replied} ${replied === 1 ? "person has" : "people have"} answered. Best first.`}
          </p>

          <ul className="mt-3 space-y-2">
            {ranked.map((o, idx) => {
              const hours = timeRange(o.at, o.hasTime, o.endsAt);
              const leading = idx === 0 && o.votes > 0;
              return (
                <li
                  key={o.id}
                  className={`rounded-lg border p-3 ${
                    leading ? "border-accent/50 bg-accent/[0.06]" : "border-border bg-bg/60"
                  }`}
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                    <span className="font-serif text-base text-ink">
                      {longDay(o.at)}
                    </span>
                    <span
                      className={`font-mono text-[0.68rem] ${leading ? "text-accent" : "text-muted"}`}
                    >
                      {optionSentence(o.votes, replied)}
                    </span>
                  </div>
                  {hours && (
                    <p className="font-mono text-[0.64rem] text-muted">{hours}</p>
                  )}
                  <button
                    type="button"
                    disabled={busy}
                    onClick={async () => {
                      setBusy(true);
                      setError(null);
                      const res = await settleOnDay(o.id);
                      setBusy(false);
                      if (!res.ok) setError(res.error);
                    }}
                    className="mt-2 font-mono text-[0.68rem] text-accent underline underline-offset-4"
                  >
                    Settle on this one
                  </button>
                </li>
              );
            })}
          </ul>

          {tied.length > 0 && (
            <p className="mt-2 prose-serif-xs text-muted">
              It is a tie — {tied.length + 1} days suit the same number of
              people. Choosing between them is yours, not the app&rsquo;s.
            </p>
          )}

          <p className="mt-3 prose-serif-xs text-muted">
            Settling tells everyone who left an address, including the ones that
            day does not suit — their answer becomes a no, and they can change
            it.
          </p>

          <button
            type="button"
            onClick={() => setEditing(true)}
            className="mt-2 font-mono text-[0.68rem] text-muted underline underline-offset-4 hover:text-ink"
          >
            Change the days offered
          </button>
        </>
      )}

      {editing && (
        <form
          action={async (fd) => {
            setBusy(true);
            setError(null);
            const res = await askWhichDay(fd);
            setBusy(false);
            if (res.ok) setEditing(false);
            else setError(res.error);
          }}
          className="mt-3 space-y-3"
        >
          <input type="hidden" name="eventId" value={eventId} />
          <p className="prose-serif-xs text-muted">
            Offer {MIN_OPTIONS} to {MAX_OPTIONS} days. Guests tick every one
            that works for them, and you choose from what comes back.
          </p>

          {rows.map((r, i) => (
            <div key={i} className="grid grid-cols-[1.4fr_1fr_auto] gap-2">
              <input
                type="date"
                name="optionDate"
                value={r.date}
                onChange={(e) =>
                  setRows((rs) =>
                    rs.map((x, j) => (j === i ? { ...x, date: e.target.value } : x)),
                  )
                }
                className={inputClass}
                aria-label={`Day ${i + 1}`}
              />
              <input
                type="time"
                name="optionTime"
                value={r.time}
                onChange={(e) =>
                  setRows((rs) =>
                    rs.map((x, j) => (j === i ? { ...x, time: e.target.value } : x)),
                  )
                }
                className={inputClass}
                aria-label={`Time for day ${i + 1}`}
              />
              <button
                type="button"
                onClick={() => setRows((rs) => rs.filter((_, j) => j !== i))}
                disabled={rows.length <= MIN_OPTIONS}
                aria-label={`Drop day ${i + 1}`}
                className="px-2 font-mono text-xs text-muted hover:text-negative disabled:opacity-30"
              >
                ×
              </button>
            </div>
          ))}

          {rows.length < MAX_OPTIONS && (
            <button
              type="button"
              onClick={() => setRows((rs) => [...rs, { date: "", time: "" }])}
              className="font-mono text-[0.68rem] text-accent underline underline-offset-4"
            >
              + Another day
            </button>
          )}

          {error && <p className="font-mono text-xs text-negative">{error}</p>}

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={busy}
              className="rounded-lg bg-accent px-4 py-2 font-mono text-sm font-medium text-on-accent transition-colors hover:bg-accent-deep disabled:opacity-50"
            >
              {busy ? "Saving…" : "Ask them"}
            </button>
            {options.length > 0 && (
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="font-mono text-xs text-muted hover:text-ink"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}

      {error && !editing && (
        <p className="mt-2 font-mono text-xs text-negative">{error}</p>
      )}
    </div>
  );
}
