"use client";

import { useState, useTransition } from "react";
import { sendReset } from "@/app/admintc/actions";

/**
 * Send somebody a reset link without looking their account up first.
 *
 * ── Why this is separate from the search ─────────────────────────────────
 * Because the commonest support request there is — "I cannot get in" — needs
 * one thing done and nothing read. Making an operator find the account first
 * puts a screenful of somebody's memberships in front of them on the way to
 * pressing a button that never needed any of it. The less an admin has to
 * look at to help, the better.
 *
 * ── What it cannot do ────────────────────────────────────────────────────
 * Make a password, see a link, or reach an account. It asks the app to send
 * the same one-hour email a person gets from the forgot-password page, to the
 * address on the account and nowhere else. An address with no account is
 * refused and the attempt is still written down.
 */
export function ResetAnyone() {
  const [email, setEmail] = useState("");
  const [said, setSaid] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, start] = useTransition();

  return (
    <section className="rounded border border-white/10 bg-[#141416] p-4">
      <h2 className="font-mono text-[0.62rem] uppercase tracking-widest text-white/40">
        Send a reset link
      </h2>
      <p className="mt-1 font-mono text-[0.58rem] leading-relaxed text-white/35">
        For &ldquo;I cannot get in&rdquo;, which is most of them. Any address
        with an account &mdash; no need to find them first.
      </p>
      <form
        className="mt-3 flex flex-wrap gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          setSaid(null);
          setError(null);
          start(async () => {
            const r = await sendReset(email);
            if (r.ok) {
              setSaid(r.said);
              setEmail("");
            } else setError(r.error);
          });
        }}
      >
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="their email address"
          aria-label="Address to send a reset link to"
          className="min-w-[16rem] flex-1 rounded border border-white/15 bg-[#0f0f10] px-3 py-2 font-mono text-xs text-white placeholder:text-white/30 focus:border-white/40 focus:outline-none"
        />
        <button
          type="submit"
          disabled={busy || !email}
          className="rounded border border-white/20 px-4 py-2 font-mono text-[0.62rem] uppercase tracking-widest text-white/80 transition-colors hover:border-white/50 hover:text-white disabled:opacity-40"
        >
          {busy ? "Sending…" : "Send it"}
        </button>
      </form>

      {said && <p className="mt-3 font-mono text-xs text-emerald-300">{said}</p>}
      {error && <p className="mt-3 font-mono text-xs text-red-300">{error}</p>}

      <p className="mt-3 font-mono text-[0.58rem] leading-relaxed text-white/30">
        The link goes to the address on the account and is never shown here, so
        this cannot be used to take an account over &mdash; only to help
        somebody back into their own. It lasts one hour, and every send is
        written down under &ldquo;What was done&rdquo;.
      </p>
    </section>
  );
}
