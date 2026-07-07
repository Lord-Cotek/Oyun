"use client";

import { useState } from "react";
import Link from "next/link";
import { requestPasswordReset } from "@/app/forgot-password/actions";
import { Eyebrow } from "@/components/ui/Eyebrow";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    const fd = new FormData();
    fd.set("email", email);
    const res = await requestPasswordReset(null, fd);
    setBusy(false);
    if (res.ok) setSent(true);
    else setError(res.error ?? "Something went wrong. Please try again.");
  }

  if (sent) {
    return (
      <div>
        <Eyebrow className="mb-4">Check your inbox</Eyebrow>
        <h1 className="font-serif text-3xl leading-snug text-ink">
          If that email has an account, a reset link is on its way.
        </h1>
        <p className="mt-4 font-mono text-sm leading-relaxed text-muted">
          Open it and choose a new password. The link expires in one hour. Don&rsquo;t
          see it? Check spam, or{" "}
          <button
            type="button"
            onClick={() => setSent(false)}
            className="text-accent underline underline-offset-4"
          >
            try another email
          </button>
          .
        </p>
        <Link
          href="/sign-in"
          className="mt-6 inline-block font-mono text-xs text-accent underline underline-offset-4"
        >
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <>
      <Eyebrow className="mb-4">Reset your password</Eyebrow>
      <h1 className="font-serif text-3xl leading-snug text-ink">
        Forgot your password?
      </h1>
      <p className="mt-3 font-mono text-sm leading-relaxed text-muted">
        Enter your email and we&rsquo;ll send you a secure link to set a new one.
      </p>
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
          className="w-full rounded-lg bg-accent px-5 py-3 font-mono text-sm font-medium text-on-accent transition-colors hover:bg-accent-deep disabled:opacity-50"
        >
          {busy ? "Sending link…" : "Email me a reset link"}
        </button>
        <p className="pt-1 text-center font-mono text-xs text-muted">
          Remembered it?{" "}
          <Link href="/sign-in" className="text-accent underline underline-offset-4">
            Sign in
          </Link>
        </p>
      </form>
    </>
  );
}
