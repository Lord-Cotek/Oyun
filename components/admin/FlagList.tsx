"use client";

import { useState, useTransition } from "react";
import { setFlag } from "@/app/admintc/flag-actions";

const btn =
  "rounded border px-3 py-2 font-mono text-[0.62rem] uppercase tracking-widest transition-colors disabled:opacity-40";

export interface FlagRow {
  key: string;
  label: string;
  what: string;
  on: boolean;
  /** False when nothing is stored, so the state shown is the code's default. */
  stored: boolean;
  changedBy: string | null;
  changed: string | null;
}

/**
 * The switches, with what each one actually does written beside it.
 *
 * The sentence matters more than the switch. Six months from now the person
 * reading this will not have been here when the flag was added, and a row
 * that says only "link-preview · on" gives them no way to decide anything.
 */
export function FlagList({ rows }: { rows: FlagRow[] }) {
  const [said, setSaid] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, start] = useTransition();

  function move(key: string, on: boolean) {
    setSaid(null);
    setError(null);
    start(async () => {
      const r = await setFlag(key, on);
      if (r.ok) setSaid(r.said);
      else setError(r.error);
    });
  }

  return (
    <div>
      <ul className="space-y-3">
        {rows.map((f) => (
          <li key={f.key} className="rounded border border-white/10 bg-[#141416] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="font-mono text-xs text-white">
                  {f.label}
                  <span
                    className={`ml-2 rounded border px-1.5 py-0.5 text-[0.58rem] uppercase tracking-widest ${
                      f.on
                        ? "border-emerald-400/40 text-emerald-300"
                        : "border-white/25 text-white/50"
                    }`}
                  >
                    {f.on ? "on" : "off"}
                  </span>
                </p>
                <p className="mt-1 font-mono text-[0.58rem] leading-relaxed text-white/40">
                  {f.what}
                </p>
                <p className="mt-1.5 font-mono text-[0.58rem] text-white/30">
                  {f.stored
                    ? `last moved by ${f.changedBy} · ${f.changed}`
                    : "never moved — this is what the code does by default"}
                </p>
              </div>
              <button
                type="button"
                disabled={busy}
                onClick={() => move(f.key, !f.on)}
                className={`${btn} ${
                  f.on
                    ? "border-white/20 text-white/80 hover:border-white/50 hover:text-white"
                    : "border-emerald-400/50 text-emerald-300 hover:border-emerald-400"
                }`}
              >
                {f.on ? "Turn it off" : "Turn it on"}
              </button>
            </div>
          </li>
        ))}
      </ul>

      {said && <p className="mt-4 font-mono text-xs text-emerald-300">{said}</p>}
      {error && <p className="mt-4 font-mono text-xs text-red-300">{error}</p>}

      <p className="mt-6 font-mono text-[0.58rem] leading-relaxed text-white/30">
        These are the only flags this app has. They are declared in code, so a
        switch here always matches something the app actually asks about — a
        name typed by hand could never do that, and would read as off for ever
        without an error anywhere.
      </p>
    </div>
  );
}
