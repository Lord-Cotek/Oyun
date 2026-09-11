"use client";

import { useState, useTransition } from "react";
import {
  completeNudge,
  dropNudge,
  setNudge,
} from "@/app/journey/support-actions";
import { NUDGE_TEXT_MAX, NUDGE_WHENS } from "@/lib/nudges";

type NudgeItem = { id: string; text: string; dueAt: string };

/** "Today" / "Tomorrow" / "Sat 13 Sep" — and plainly late when it is late. */
function dayLabel(iso: string): { text: string; late: boolean } {
  const d = new Date(iso);
  const startOf = (x: Date) =>
    new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const days = Math.round((startOf(d) - startOf(new Date())) / 86_400_000);
  if (days < 0) return { text: "Still waiting", late: true };
  if (days === 0) return { text: "Today", late: false };
  if (days === 1) return { text: "Tomorrow", late: false };
  return {
    text: d.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    }),
    late: false,
  };
}

/**
 * Reminders you set for yourself.
 *
 * Not the appointment book: these are the small things nobody else needs to
 * know about — ring her mum, order the car seat, take Friday off. Only you
 * see them, and only you are told.
 */
export function NudgeList({
  nudges,
  motherName,
}: {
  nudges: NudgeItem[];
  motherName: string;
}) {
  const [pending, start] = useTransition();
  const [adding, setAdding] = useState(false);
  const [when, setWhen] = useState<string>("tomorrow");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const inputClass =
    "w-full rounded-lg border border-border bg-bg px-3 py-2 font-mono text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none";

  return (
    <div>
      {nudges.length === 0 ? (
        <p className="font-mono text-xs leading-relaxed text-muted">
          Nothing set for yourself yet. The simplest thing still holds: check in
          on {motherName} today.
        </p>
      ) : (
        <ul className="space-y-3">
          {nudges.map((n) => {
            const day = dayLabel(n.dueAt);
            return (
              <li key={n.id} className="group flex items-start gap-2.5">
                <button
                  type="button"
                  aria-label={`Mark done: ${n.text}`}
                  disabled={pending}
                  onClick={() => start(() => completeNudge(n.id))}
                  className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-border transition-colors hover:border-accent hover:bg-accent/10 disabled:opacity-50"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-accent opacity-0 transition-opacity hover:opacity-100" />
                </button>
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-sm leading-snug text-ink">
                    {n.text}
                  </p>
                  <p
                    className={`font-mono text-[0.68rem] ${
                      day.late ? "text-muted/70" : "text-muted"
                    }`}
                  >
                    {day.text}
                  </p>
                </div>
                <button
                  type="button"
                  aria-label={`Remove: ${n.text}`}
                  disabled={pending}
                  onClick={() => start(() => dropNudge(n.id))}
                  className="shrink-0 font-mono text-[0.68rem] text-muted opacity-0 transition-opacity hover:text-ink focus:opacity-100 group-hover:opacity-100 disabled:opacity-50"
                >
                  Remove
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {!adding ? (
        <button
          type="button"
          onClick={() => {
            setAdding(true);
            setError(null);
          }}
          className="mt-4 font-mono text-xs text-accent underline underline-offset-4 hover:text-accent-deep"
        >
          Set a reminder →
        </button>
      ) : (
        <form
          action={async (fd) => {
            setBusy(true);
            setError(null);
            // "Pick a day" hands the date field over as the when.
            if (fd.get("when") === "pick") {
              fd.set("when", String(fd.get("date") ?? ""));
            }
            const res = await setNudge(fd);
            setBusy(false);
            if (res.ok) {
              setAdding(false);
              setWhen("tomorrow");
            } else {
              setError(res.error);
            }
          }}
          className="mt-4 space-y-2.5 border-t border-border pt-4"
        >
          <input
            name="text"
            required
            maxLength={NUDGE_TEXT_MAX}
            autoFocus
            placeholder="Ring her mum about Saturday"
            className={inputClass}
          />
          <div className="flex flex-wrap gap-1.5">
            {NUDGE_WHENS.map((w) => (
              <label
                key={w.value}
                className={`cursor-pointer rounded-lg border px-2.5 py-1.5 font-mono text-[0.68rem] transition-colors ${
                  when === w.value
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border text-muted hover:text-ink"
                }`}
              >
                <input
                  type="radio"
                  name="when"
                  value={w.value}
                  checked={when === w.value}
                  onChange={() => setWhen(w.value)}
                  className="sr-only"
                />
                {w.label}
              </label>
            ))}
          </div>
          {when === "pick" && (
            <input
              type="date"
              name="date"
              required
              className={`${inputClass} [color-scheme:dark]`}
            />
          )}
          <p className="font-mono text-[0.62rem] leading-relaxed text-muted">
            You&rsquo;ll be told once, that morning — a notification, and an
            email if you have those on. Nobody else sees it.
          </p>
          {error && (
            <p className="font-mono text-[0.68rem] text-negative">{error}</p>
          )}
          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={busy}
              className="rounded-lg bg-accent px-3 py-1.5 font-mono text-xs font-medium text-on-accent transition-colors hover:bg-accent-deep disabled:opacity-50"
            >
              {busy ? "Setting…" : "Remind me"}
            </button>
            <button
              type="button"
              onClick={() => {
                setAdding(false);
                setError(null);
              }}
              className="font-mono text-xs text-muted hover:text-ink"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
