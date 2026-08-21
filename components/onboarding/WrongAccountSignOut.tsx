"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";

/**
 * On the onboarding screen, an invite may be opened while signed in as the
 * wrong account. This signs the current account out and returns to the very
 * same invite link — where, now logged out, they're routed to sign in (or
 * sign up) with the invited email already filled in. One tap, no dead-end.
 */
export function WrongAccountSignOut({ returnTo }: { returnTo: string }) {
  const [busy, setBusy] = useState(false);
  return (
    <button
      type="button"
      disabled={busy}
      onClick={() => {
        setBusy(true);
        signOut({ callbackUrl: returnTo });
      }}
      className="mt-6 w-full rounded-lg bg-accent px-5 py-3 font-mono text-sm font-medium text-on-accent transition-colors hover:bg-accent-deep disabled:opacity-50"
    >
      {busy ? "Signing out…" : "Sign out & use the right email"}
    </button>
  );
}
