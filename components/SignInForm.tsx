"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";

export function SignInForm({
  callbackUrl,
  initialEmail,
}: {
  callbackUrl?: string;
  initialEmail?: string;
}) {
  const [email, setEmail] = useState(initialEmail ?? "");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password || busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await signIn("credentials", {
        email: email.trim(),
        password,
        redirect: false,
        callbackUrl: callbackUrl ?? "/journey",
      });
      if (res?.error) {
        setError("That email or password doesn't match. Please try again.");
        setBusy(false);
      } else {
        window.location.href = res?.url ?? callbackUrl ?? "/journey";
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setBusy(false);
    }
  }

  const signUpHref = callbackUrl
    ? `/sign-up?callbackUrl=${encodeURIComponent(callbackUrl)}`
    : "/sign-up";

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
      <label className="block">
        <span className="eyebrow mb-2 block text-muted">Password</span>
        <input
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Your password"
          className="w-full rounded-lg border border-border bg-bg px-4 py-3 font-mono text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none"
        />
      </label>
      {error && <p className="font-mono text-xs text-negative">{error}</p>}
      <div className="flex justify-end">
        <Link
          href="/forgot-password"
          className="font-mono text-xs text-muted underline underline-offset-4 hover:text-accent"
        >
          Forgot password?
        </Link>
      </div>
      <button
        type="submit"
        disabled={busy}
        className="w-full rounded-lg bg-accent px-5 py-3 font-mono text-sm font-medium text-on-accent transition-colors hover:bg-accent-deep disabled:opacity-50"
      >
        {busy ? "Signing in…" : "Sign in"}
      </button>
      <p className="pt-1 text-center font-mono text-xs text-muted">
        New to Oyun?{" "}
        <Link href={signUpHref} className="text-accent underline underline-offset-4">
          Create an account
        </Link>
      </p>
    </form>
  );
}
