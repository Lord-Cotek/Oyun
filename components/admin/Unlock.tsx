"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { unlock } from "@/app/admintc/unlock-actions";

/**
 * The password box that stands in front of the whole centre.
 *
 * Deliberately says almost nothing: somebody who has reached this screen has
 * already passed the 404, so there is no point pretending, but there is also
 * no reason to describe what is behind it.
 */
export function Unlock({ email, minutes }: { email: string; minutes: number }) {
  const [error, setError] = useState<string | null>(null);
  const [busy, start] = useTransition();
  const router = useRouter();

  return (
    <div className="mx-auto max-w-sm py-16">
      <p className="font-mono text-[0.62rem] uppercase tracking-widest text-white/40">
        Confirm it is you
      </p>
      <p className="mt-3 prose-serif-sm text-white/70">
        Signed in as {email}. Type the password on this account to open the
        centre. It stays open for {minutes} minutes.
      </p>

      <form
        action={(fd) =>
          start(async () => {
            setError(null);
            const res = await unlock(fd);
            if (res.ok) router.refresh();
            else setError(res.error);
          })
        }
        className="mt-5 space-y-3"
      >
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          autoFocus
          aria-label="Your password"
          className="w-full rounded border border-white/15 bg-[#141416] px-3 py-2.5 font-mono text-xs text-white focus:border-white/40 focus:outline-none"
        />
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded border border-white/20 px-4 py-2.5 font-mono text-[0.62rem] uppercase tracking-widest text-white/80 hover:border-white/50 hover:text-white disabled:opacity-40"
        >
          {busy ? "Checking…" : "Open the centre"}
        </button>
        {error && <p className="font-mono text-xs text-red-300">{error}</p>}
      </form>
    </div>
  );
}
