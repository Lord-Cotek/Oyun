"use client";

import { useState, useTransition } from "react";
import { sendReset, takeResetLink } from "@/app/admintc/actions";

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
 * ── Sending: what it cannot do ───────────────────────────────────────────
 * Make a password, see a link, or reach an account. It asks the app to send
 * the same one-hour email a person gets from the forgot-password page, to the
 * address on the account and nowhere else. An address with no account is
 * refused and the attempt is still written down.
 *
 * ── Taking the link: what it CAN do ──────────────────────────────────────
 * Everything the other one cannot. A super admin may take the link into
 * their own hands to pass on by some other means, because email genuinely
 * fails and the operator of a small app often knows the person. Whoever
 * holds that link can become that family.
 *
 * So the two are not dressed the same. Sending is the plain button and comes
 * first; taking is marked, second, gated on super admin, fifteen minutes,
 * refused for another admin's account, and emails the person to say it
 * happened. The whole of that sits in takeResetLink — this file only has to
 * avoid making it look ordinary.
 */
export function ResetAnyone({ isSuper }: { isSuper: boolean }) {
  const [email, setEmail] = useState("");
  const [said, setSaid] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, start] = useTransition();
  // Held in state and nowhere else: not in the URL, not in storage, gone the
  // moment this panel re-renders for anything else.
  const [link, setLink] = useState<{ url: string; until: string } | null>(null);
  const [copied, setCopied] = useState(false);

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
          setLink(null);
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
        {/* Deliberately the plainer of the two, and second. Sending is the
            ordinary thing; taking the link into your own hands is not. */}
        {isSuper && (
          <button
            type="button"
            disabled={busy || !email}
            onClick={() => {
              setSaid(null);
              setError(null);
              setLink(null);
              setCopied(false);
              start(async () => {
                const r = await takeResetLink(email);
                if (r.ok) {
                  setSaid(r.said);
                  setLink({ url: r.link, until: r.until });
                } else setError(r.error);
              });
            }}
            className="rounded border border-amber-400/40 px-4 py-2 font-mono text-[0.62rem] uppercase tracking-widest text-amber-300/90 transition-colors hover:border-amber-400 disabled:opacity-40"
          >
            Give me the link
          </button>
        )}
      </form>

      {link && (
        <div className="mt-3 rounded border border-amber-400/40 bg-amber-400/[0.05] p-3">
          <p className="font-mono text-[0.58rem] uppercase tracking-widest text-amber-300">
            Yours until {link.until} — then it is dead
          </p>
          <p className="mt-2 break-all rounded border border-white/10 bg-[#0f0f10] p-2 font-mono text-[0.62rem] text-white/80">
            {link.url}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => {
                navigator.clipboard?.writeText(link.url).then(
                  () => setCopied(true),
                  () => setCopied(false),
                );
              }}
              className="rounded border border-white/20 px-3 py-1.5 font-mono text-[0.6rem] uppercase tracking-widest text-white/80 hover:border-white/50 hover:text-white"
            >
              {copied ? "Copied" : "Copy it"}
            </button>
            <button
              type="button"
              onClick={() => setLink(null)}
              className="font-mono text-[0.6rem] uppercase tracking-widest text-white/40 underline underline-offset-4 hover:text-white/70"
            >
              Done with it
            </button>
          </div>
          <p className="mt-2 font-mono text-[0.58rem] leading-relaxed text-white/40">
            Whoever holds this can set the password and open that family&rsquo;s
            diary and letters as them. Send it to the person it belongs to and
            nobody else, and do not leave it in a thread.
          </p>
        </div>
      )}

      {said && <p className="mt-3 font-mono text-xs text-emerald-300">{said}</p>}
      {error && <p className="mt-3 font-mono text-xs text-red-300">{error}</p>}

      <p className="mt-3 font-mono text-[0.58rem] leading-relaxed text-white/30">
        Sending puts the link in their inbox and nowhere else, so that button
        cannot be used to take an account over &mdash; only to help somebody
        back into their own. It lasts one hour, and every send is written down
        under &ldquo;What was done&rdquo;.
        {isSuper && (
          <>
            {" "}
            <span className="text-amber-300/70">
              Taking the link instead puts it in your hands: it lasts fifteen
              minutes, it is refused for another admin&rsquo;s account, and the
              person is emailed to say you made one.
            </span>
          </>
        )}
      </p>
    </section>
  );
}
