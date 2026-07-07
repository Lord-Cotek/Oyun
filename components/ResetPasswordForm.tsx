"use client";

import { useState } from "react";
import { resetPassword } from "@/app/reset-password/actions";

export function ResetPasswordForm({ token }: { token: string }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    const fd = new FormData();
    fd.set("token", token);
    fd.set("password", password);
    fd.set("confirm", confirm);
    const res = await resetPassword(null, fd);
    if (res.ok) {
      window.location.href = "/sign-in?reset=1";
    } else {
      setError(res.error ?? "Something went wrong. Please try again.");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-3">
      <label className="block">
        <span className="eyebrow mb-2 block text-muted">New password</span>
        <input
          type="password"
          required
          autoComplete="new-password"
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 8 characters"
          className="w-full rounded-lg border border-border bg-bg px-4 py-3 font-mono text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none"
        />
      </label>
      <label className="block">
        <span className="eyebrow mb-2 block text-muted">Confirm password</span>
        <input
          type="password"
          required
          autoComplete="new-password"
          minLength={8}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Type it again"
          className="w-full rounded-lg border border-border bg-bg px-4 py-3 font-mono text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none"
        />
      </label>
      {error && <p className="font-mono text-xs text-negative">{error}</p>}
      <button
        type="submit"
        disabled={busy}
        className="w-full rounded-lg bg-accent px-5 py-3 font-mono text-sm font-medium text-on-accent transition-colors hover:bg-accent-deep disabled:opacity-50"
      >
        {busy ? "Saving…" : "Set new password"}
      </button>
    </form>
  );
}
