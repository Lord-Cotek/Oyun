"use client";

import { useState, useTransition } from "react";
import { settleConcern } from "@/app/admintc/concern-actions";
import { OUTCOME_MAX } from "@/lib/concerns";

const btn =
  "rounded border border-white/20 px-3 py-2 font-mono text-[0.62rem] uppercase tracking-widest text-white/80 transition-colors hover:border-white/50 hover:text-white disabled:opacity-40";
const field =
  "w-full rounded border border-white/15 bg-[#141416] px-3 py-2 font-mono text-xs text-white placeholder:text-white/30 focus:border-white/40 focus:outline-none";

export interface ConcernItem {
  id: string;
  email: string;
  kindLabel: string;
  urgent: boolean;
  said: string;
  state: string;
  created: string;
  handledBy: string | null;
  handled: string | null;
  outcome: string | null;
}

/**
 * The people who have written to us.
 *
 * ── What is on this screen, and what is not ──────────────────────────────
 * Their words, their address, and when. There is nothing to click through to,
 * because a concern carries no pointer to anything anybody else wrote. If
 * settling one needs more than this, the answer is to write to them or ring
 * them — not to widen what this screen can reach.
 */
export function ConcernQueue({ items, state }: { items: ConcernItem[]; state: string }) {
  const [said, setSaid] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, start] = useTransition();
  const [notes, setNotes] = useState<Record<string, string>>({});

  function settle(id: string, next: string) {
    setSaid(null);
    setError(null);
    start(async () => {
      const r = await settleConcern(id, next, notes[id] ?? "");
      if (r.ok) {
        setSaid(r.said);
        setNotes((n) => ({ ...n, [id]: "" }));
      } else setError(r.error);
    });
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {[
          ["OPEN", "Waiting"],
          ["ANSWERED", "Answered"],
          ["CLOSED", "Closed"],
          ["", "All"],
        ].map(([key, label]) => (
          <a
            key={label}
            href={key ? `/admintc/concerns?state=${key}` : "/admintc/concerns?state=all"}
            className={`rounded border px-3 py-2 font-mono text-[0.62rem] uppercase tracking-widest transition-colors ${
              state === key
                ? "border-amber-400/50 text-amber-300"
                : "border-white/20 text-white/60 hover:border-white/50 hover:text-white"
            }`}
          >
            {label}
          </a>
        ))}
      </div>

      {items.length === 0 ? (
        <p className="mt-5 font-mono text-xs text-white/40">
          Nothing here. That is the good outcome.
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {items.map((c) => (
            <li
              key={c.id}
              className={`rounded border p-4 ${
                c.urgent && c.state === "OPEN"
                  ? "border-red-400/40 bg-red-500/[0.05]"
                  : "border-white/10 bg-[#141416]"
              }`}
            >
              <p className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded border px-1.5 py-0.5 font-mono text-[0.58rem] uppercase tracking-widest ${
                    c.urgent
                      ? "border-red-400/50 text-red-300"
                      : "border-white/25 text-white/50"
                  }`}
                >
                  {c.state === "OPEN" ? "waiting" : c.state.toLowerCase()}
                </span>
                <span className="font-mono text-xs text-white">{c.kindLabel}</span>
              </p>
              <p className="mt-1 font-mono text-[0.58rem] uppercase tracking-widest text-white/35">
                {c.created} · {c.email}
              </p>
              <p className="mt-3 whitespace-pre-wrap break-words font-mono text-xs leading-relaxed text-white/80">
                {c.said}
              </p>

              {c.outcome && (
                <p className="mt-3 border-l-2 border-white/15 pl-3 font-mono text-[0.62rem] leading-relaxed text-white/50">
                  {c.outcome}
                  <span className="mt-0.5 block text-white/30">
                    {c.handledBy} · {c.handled}
                  </span>
                </p>
              )}

              <div className="mt-3 space-y-2">
                <input
                  value={notes[c.id] ?? ""}
                  onChange={(e) => setNotes((n) => ({ ...n, [c.id]: e.target.value }))}
                  maxLength={OUTCOME_MAX}
                  placeholder="What happened — the next person has only this"
                  className={field}
                />
                <div className="flex flex-wrap gap-2">
                  {c.state !== "ANSWERED" && (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => settle(c.id, "ANSWERED")}
                      className={btn}
                    >
                      I have written back
                    </button>
                  )}
                  {c.state !== "CLOSED" && (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => settle(c.id, "CLOSED")}
                      className={btn}
                    >
                      Close it
                    </button>
                  )}
                  {c.state !== "OPEN" && (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => settle(c.id, "OPEN")}
                      className={btn}
                    >
                      Put it back
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {said && <p className="mt-4 font-mono text-xs text-emerald-300">{said}</p>}
      {error && <p className="mt-4 font-mono text-xs text-red-300">{error}</p>}

      <p className="mt-6 font-mono text-[0.58rem] leading-relaxed text-white/30">
        A concern holds only what the person chose to write to us. It carries
        no pointer to an entry and there is nothing here to open, so reading
        this queue is not reading a family. Answer by writing to them; where it
        is serious, suspend the account and ring them.
      </p>
    </div>
  );
}
