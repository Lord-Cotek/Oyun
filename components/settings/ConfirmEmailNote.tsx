"use client";

import { useState, useTransition } from "react";

/**
 * Under the email field in Settings: whether the address is confirmed, a
 * change still waiting, and a way to send the link again.
 *
 * Said plainly and only when there is something to say: a confirmed address
 * with nothing pending shows nothing at all.
 */
export function ConfirmEmailNote({
  email,
  pending,
  confirmed,
  onResend,
}: {
  email: string;
  pending: string | null;
  confirmed: boolean;
  onResend: () => Promise<{ ok: boolean; message?: string; error?: string }>;
}) {
  const [said, setSaid] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, start] = useTransition();
  if (confirmed && !pending) return null;

  return (
    <div className="mt-4 rounded-lg border border-accent/40 bg-accent/[0.05] px-4 py-3">
      <p className="prose-serif-xs text-ink">
        {pending
          ? `Waiting for ${pending} to be confirmed. Until you open the link we sent there, you still sign in with ${email}.`
          : `Please confirm ${email} is yours — open the link we emailed you. It keeps your account safe.`}
      </p>
      <button
        type="button"
        disabled={busy}
        onClick={() =>
          start(async () => {
            const r = await onResend();
            setSaid({ ok: r.ok, text: r.ok ? r.message ?? "Sent." : r.error ?? "That did not send." });
          })
        }
        className="mt-2 font-mono text-[0.7rem] text-accent underline underline-offset-4 disabled:opacity-60"
      >
        {busy ? "Sending…" : "Send the link again"}
      </button>
      {said && (
        <p role="status" className={`mt-1 font-mono text-[0.66rem] ${said.ok ? "text-positive" : "text-negative"}`}>
          {said.text}
        </p>
      )}
    </div>
  );
}
