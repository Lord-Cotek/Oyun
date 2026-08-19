"use client";

import { useState, useTransition } from "react";
import { signOut } from "next-auth/react";
import { deleteAccount } from "@/app/settings/actions";
import { Eyebrow } from "@/components/ui/Eyebrow";

/**
 * In-app account deletion (App Store Guideline 5.1.1(v)). Opens a clear,
 * type-to-confirm step, permanently deletes the account and all its data on the
 * server, then signs the (now-gone) user out.
 */
export function DeleteAccount({ email }: { email: string }) {
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const ready = confirm.trim().toUpperCase() === "DELETE";

  function run() {
    if (!ready || pending) return;
    setError(null);
    start(async () => {
      try {
        await deleteAccount();
        await signOut({ callbackUrl: "/" });
      } catch {
        setError("Something went wrong. Please try again.");
      }
    });
  }

  return (
    <div>
      <Eyebrow className="mb-2 text-negative">Delete account</Eyebrow>
      <p className="mb-4 max-w-prose font-mono text-xs leading-relaxed text-muted">
        Permanently delete your account and everything tied to it — your profile,
        your journey, check-ins, letters, prayers, and photos. This can&rsquo;t be
        undone.
      </p>

      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-lg border border-negative/50 px-4 py-2 font-mono text-xs text-negative transition-colors hover:bg-negative/10"
        >
          Delete my account
        </button>
      ) : (
        <div className="space-y-3 rounded-xl border border-negative/40 bg-negative/[0.06] p-4">
          <p className="font-mono text-xs leading-relaxed text-ink">
            This will permanently erase everything for{" "}
            <span className="text-ink">{email}</span>. To confirm, type{" "}
            <span className="font-medium text-negative">DELETE</span> below.
          </p>
          <input
            type="text"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Type DELETE"
            autoComplete="off"
            aria-label="Type DELETE to confirm"
            className="w-full rounded-lg border border-border bg-bg px-4 py-2.5 font-mono text-sm text-ink placeholder:text-muted focus:border-negative focus:outline-none"
          />
          {error && (
            <p className="font-mono text-xs text-negative">{error}</p>
          )}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={!ready || pending}
              onClick={run}
              className="rounded-lg bg-negative px-4 py-2.5 font-mono text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {pending ? "Deleting…" : "Permanently delete account"}
            </button>
            <button
              type="button"
              disabled={pending}
              onClick={() => {
                setOpen(false);
                setConfirm("");
                setError(null);
              }}
              className="rounded-lg px-4 py-2.5 font-mono text-sm text-muted transition-colors hover:text-ink"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
