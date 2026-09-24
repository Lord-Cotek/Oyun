"use client";

import { useState, useTransition } from "react";
import { addAdmin, removeAdmin } from "@/app/admintc/actions";

const btn =
  "rounded border border-white/20 px-3 py-2 font-mono text-[0.62rem] uppercase tracking-widest text-white/80 transition-colors hover:border-white/50 hover:text-white disabled:opacity-40";

/** Ordinary admins — the ones a super admin has let in. */
export function AdminList({
  rows,
  canManage,
}: {
  rows: { id: string; email: string; label: string | null; addedBy: string | null; when: string }[];
  canManage: boolean;
}) {
  const [said, setSaid] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState<string | null>(null);
  const [busy, start] = useTransition();

  return (
    <section>
      <h2 className="font-mono text-[0.62rem] uppercase tracking-widest text-white/40">
        Admins
      </h2>

      {rows.length === 0 ? (
        <p className="mt-2 font-mono text-xs text-white/40">Nobody yet.</p>
      ) : (
        <ul className="mt-3 divide-y divide-white/10 rounded border border-white/10">
          {rows.map((r) => (
            <li key={r.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
              <div>
                <p className="font-mono text-xs text-white">{r.email}</p>
                <p className="mt-0.5 font-mono text-[0.58rem] text-white/35">
                  added {r.when}
                  {r.addedBy && ` by ${r.addedBy}`}
                  {r.label && ` · ${r.label}`}
                </p>
              </div>
              {canManage &&
                (confirming === r.id ? (
                  <span className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() =>
                        start(async () => {
                          const res = await removeAdmin(r.id);
                          setConfirming(null);
                          if (res.ok) setSaid(res.said);
                          else setError(res.error);
                        })
                      }
                      className="rounded border border-red-400/40 px-3 py-2 font-mono text-[0.62rem] uppercase tracking-widest text-red-300 hover:border-red-400"
                    >
                      Yes, remove {r.email}
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirming(null)}
                      className={btn}
                    >
                      Keep
                    </button>
                  </span>
                ) : (
                  <button type="button" onClick={() => setConfirming(r.id)} className={btn}>
                    Remove
                  </button>
                ))}
            </li>
          ))}
        </ul>
      )}

      {canManage && (
        <form
          action={async (fd) => {
            setSaid(null);
            setError(null);
            const res = await addAdmin(fd);
            if (res.ok) setSaid(res.said);
            else setError(res.error);
          }}
          className="mt-4 flex flex-wrap gap-2"
        >
          <input
            name="email"
            type="email"
            required
            placeholder="email address"
            aria-label="Email address"
            className="min-w-[14rem] flex-1 rounded border border-white/15 bg-[#141416] px-3 py-2 font-mono text-xs text-white placeholder:text-white/30 focus:border-white/40 focus:outline-none"
          />
          <input
            name="label"
            placeholder="what for (optional)"
            aria-label="What for"
            className="min-w-[10rem] rounded border border-white/15 bg-[#141416] px-3 py-2 font-mono text-xs text-white placeholder:text-white/30 focus:border-white/40 focus:outline-none"
          />
          <button type="submit" className={btn}>
            Let them in
          </button>
        </form>
      )}

      {said && <p className="mt-3 font-mono text-xs text-emerald-300">{said}</p>}
      {error && <p className="mt-3 font-mono text-xs text-red-300">{error}</p>}
    </section>
  );
}
