"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  changeEmail,
  deleteAccountOnRequest,
  restoreAccount,
  suspendAccount,
} from "@/app/admintc/actions";

type Res = { ok: true; said: string } | { ok: false; error: string };

const field =
  "w-full rounded border border-white/15 bg-[#141416] px-3 py-2 font-mono text-xs text-white placeholder:text-white/30 focus:border-white/40 focus:outline-none";
const btn =
  "rounded border border-white/20 px-3 py-2 font-mono text-[0.62rem] uppercase tracking-widest text-white/80 transition-colors hover:border-white/50 hover:text-white disabled:opacity-40";
const danger =
  "rounded border border-red-400/40 px-3 py-2 font-mono text-[0.62rem] uppercase tracking-widest text-red-300 transition-colors hover:border-red-400 disabled:opacity-40";

/**
 * The three things an operator will be asked for that the person cannot undo.
 *
 * Kept in their own box, below the everyday two, and each confirmed by typing
 * the account's own address. Not a "are you sure?" — typing the address means
 * reading it, which is the difference between confirming and clicking.
 */
export function CarefulActions({
  email,
  suspendedAt,
  suspendedReason,
}: {
  email: string;
  suspendedAt: string | null;
  suspendedReason: string | null;
}) {
  const [said, setSaid] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, start] = useTransition();
  const router = useRouter();
  const [open, setOpen] = useState<null | "email" | "delete">(null);
  const [reason, setReason] = useState("");
  const [nextEmail, setNextEmail] = useState("");
  const [typed, setTyped] = useState("");

  /**
   * For suspend and restore, which leave this panel on the screen.
   *
   * Changing an address and deleting are different: this panel belongs to an
   * account that has just moved or stopped existing, so it unmounts and takes
   * any message with it. Those two navigate instead — see `runThenGo`.
   */
  function run(fn: () => Promise<Res>) {
    setSaid(null);
    setError(null);
    start(async () => {
      const r = await fn();
      if (r.ok) {
        setSaid(r.said);
        setOpen(null);
        setTyped("");
        setNextEmail("");
        setReason("");
      } else setError(r.error);
    });
  }

  /** Runs, then goes somewhere that can still report it. */
  function runThenGo(fn: () => Promise<Res>, to: (r: { ok: true; said: string }) => string) {
    setSaid(null);
    setError(null);
    start(async () => {
      const r = await fn();
      if (r.ok) router.replace(to(r));
      else setError(r.error);
    });
  }

  return (
    <section className="rounded border border-red-400/20 bg-[#141416] p-4">
      <h2 className="font-mono text-[0.62rem] uppercase tracking-widest text-red-300/70">
        Careful
      </h2>
      <p className="mt-2 font-mono text-[0.58rem] leading-relaxed text-white/35">
        These three cannot be undone by the person they happen to. Each asks
        you to type their address — reading it is the point.
      </p>

      {/* Suspend or restore */}
      <div className="mt-4 border-t border-white/10 pt-4">
        {suspendedAt ? (
          <>
            <p className="font-mono text-xs text-amber-300">
              Suspended {suspendedAt}
            </p>
            {suspendedReason && (
              <p className="mt-1 font-mono text-[0.62rem] text-white/50">
                {suspendedReason}
              </p>
            )}
            <button
              type="button"
              disabled={busy}
              onClick={() => run(() => restoreAccount(email))}
              className={`${btn} mt-3`}
            >
              Let them back in
            </button>
          </>
        ) : (
          <div className="flex flex-wrap items-end gap-2">
            <label className="flex-1">
              <span className="mb-1 block font-mono text-[0.58rem] uppercase tracking-widest text-white/35">
                Why you are suspending them
              </span>
              <input
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="read months from now, by somebody else"
                className={field}
              />
            </label>
            <button
              type="button"
              disabled={busy || !reason.trim()}
              onClick={() => run(() => suspendAccount(email, reason))}
              className={btn}
            >
              Suspend
            </button>
          </div>
        )}
      </div>

      {/* Change the address */}
      <div className="mt-4 border-t border-white/10 pt-4">
        {open === "email" ? (
          <div className="space-y-2">
            <p className="font-mono text-[0.62rem] leading-relaxed text-white/50">
              Whoever holds an address can reset the password on it. Both
              addresses will be told afterwards.
            </p>
            <input
              value={nextEmail}
              onChange={(e) => setNextEmail(e.target.value)}
              type="email"
              placeholder="the new address"
              className={field}
            />
            <input
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              placeholder={`type ${email} to confirm`}
              className={field}
            />
            <div className="flex gap-2">
              <button
                type="button"
                disabled={busy}
                onClick={() =>
                  runThenGo(
                    () => changeEmail(email, nextEmail, typed),
                    () =>
                      `/admintc/people?done=changed&q=${encodeURIComponent(nextEmail.trim().toLowerCase())}`,
                  )
                }
                className={btn}
              >
                Change it
              </button>
              <button type="button" onClick={() => setOpen(null)} className={btn}>
                Never mind
              </button>
            </div>
          </div>
        ) : (
          <button type="button" onClick={() => setOpen("email")} className={btn}>
            Change their address
          </button>
        )}
      </div>

      {/* Delete */}
      <div className="mt-4 border-t border-white/10 pt-4">
        {open === "delete" ? (
          <div className="space-y-2">
            <p className="font-mono text-[0.62rem] leading-relaxed text-red-300/80">
              This deletes the account and everything that belongs to it,
              including any journey they own — entries, letters, milestones,
              prayers, the registry. Nothing here can put it back.
            </p>
            <input
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              placeholder={`type ${email} to confirm`}
              className={field}
            />
            <div className="flex gap-2">
              <button
                type="button"
                disabled={busy || typed.trim().toLowerCase() !== email.toLowerCase()}
                onClick={() =>
                  runThenGo(
                    () => deleteAccountOnRequest(email, typed),
                    () => "/admintc/people?done=deleted",
                  )
                }
                className={danger}
              >
                Delete it for good
              </button>
              <button type="button" onClick={() => setOpen(null)} className={btn}>
                Never mind
              </button>
            </div>
          </div>
        ) : (
          <button type="button" onClick={() => setOpen("delete")} className={btn}>
            Delete this account, on request
          </button>
        )}
      </div>

      {said && <p className="mt-3 font-mono text-xs text-emerald-300">{said}</p>}
      {error && <p className="mt-3 font-mono text-xs text-red-300">{error}</p>}
    </section>
  );
}
