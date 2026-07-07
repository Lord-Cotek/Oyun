"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export function SignInForm({ callbackUrl }: { callbackUrl?: string }) {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await signIn("email", {
        email: email.trim(),
        redirect: false,
        callbackUrl: callbackUrl ?? "/journey",
      });
      if (res?.error) {
        setError("We couldn't send the link. Check the address and try again.");
        setBusy(false);
      } else {
        window.location.href = "/sign-in?sent=1";
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-3">
      <label className="block">
        <span className="eyebrow mb-2 block text-muted">Email</span>
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full rounded-lg border border-border bg-bg px-4 py-3 font-mono text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none"
        />
      </label>
      {error && <p className="font-mono text-xs text-negative">{error}</p>}
      <button
        type="submit"
        disabled={busy}
        className="w-full rounded-lg bg-accent px-5 py-3 font-mono text-sm font-medium text-[#0B0E14] transition-colors hover:bg-accent-deep hover:text-ink disabled:opacity-50"
      >
        {busy ? "Sending link…" : "Email me a sign-in link"}
      </button>
    </form>
  );
}
