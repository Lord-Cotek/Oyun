"use client";

import { useState, useTransition } from "react";
import { resendInvite, sendExportLink, sendReset } from "@/app/admintc/actions";

const btn =
  "rounded border border-white/20 px-3 py-2 font-mono text-[0.62rem] uppercase tracking-widest text-white/80 transition-colors hover:border-white/50 hover:text-white disabled:opacity-40";

/**
 * The everyday things support actually needs to do for somebody.
 *
 * Every one of them sends the person an email and none shows the admin
 * anything: the reset link goes to the address on the account and is never
 * rendered here, so this cannot be used to take an account over — only to
 * help somebody back into their own. The export is the same shape on purpose:
 * a signpost to Settings, where the family downloads it themselves.
 */
export function PersonActions({
  email,
  pending,
}: {
  email: string;
  pending: { id: string; role: string; when: string }[];
}) {
  const [said, setSaid] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, start] = useTransition();

  function run(fn: () => Promise<{ ok: true; said: string } | { ok: false; error: string }>) {
    setSaid(null);
    setError(null);
    start(async () => {
      const r = await fn();
      if (r.ok) setSaid(r.said);
      else setError(r.error);
    });
  }

  return (
    <section className="rounded border border-white/10 bg-[#141416] p-4">
      <h2 className="font-mono text-[0.62rem] uppercase tracking-widest text-white/40">
        What you can do for them
      </h2>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={busy || !email}
          onClick={() => run(() => sendReset(email))}
          className={btn}
        >
          {busy ? "Working…" : "Send a password reset"}
        </button>
        <button
          type="button"
          disabled={busy || !email}
          onClick={() => run(() => sendExportLink(email))}
          className={btn}
        >
          Send them their own copy
        </button>
      </div>
      <p className="mt-2 font-mono text-[0.58rem] leading-relaxed text-white/30">
        &ldquo;Their own copy&rdquo; emails them the way to Settings, where the
        download is. It does not make the file and it does not work for anybody
        who is not signed in as them.
      </p>

      {pending.length > 0 && (
        <div className="mt-5">
          <p className="font-mono text-[0.58rem] uppercase tracking-widest text-white/35">
            Invitations to this address that nobody has accepted
          </p>
          <ul className="mt-2 space-y-2">
            {pending.map((p) => (
              <li key={p.id} className="flex flex-wrap items-center gap-3">
                <span className="font-mono text-xs text-white/70">
                  {p.role} · sent {p.when}
                </span>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => run(() => resendInvite(p.id))}
                  className={btn}
                >
                  Send it again
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {said && <p className="mt-3 font-mono text-xs text-emerald-300">{said}</p>}
      {error && <p className="mt-3 font-mono text-xs text-red-300">{error}</p>}

      <p className="mt-4 font-mono text-[0.58rem] leading-relaxed text-white/30">
        There is nothing here that opens their diary, their letters or their
        address, and there is no way to add one from this screen — see
        lib/admin-db.ts.
      </p>
    </section>
  );
}
