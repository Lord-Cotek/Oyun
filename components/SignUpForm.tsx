"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { registerUser } from "@/app/sign-up/actions";

export function SignUpForm({
  callbackUrl,
  initialEmail,
}: {
  callbackUrl?: string;
  initialEmail?: string;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState(initialEmail ?? "");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);

    const fd = new FormData();
    fd.set("name", name);
    fd.set("email", email);
    fd.set("password", password);

    const res = await registerUser(null, fd);
    if (!res.ok) {
      setError(res.error ?? "We couldn't create your account.");
      setBusy(false);
      return;
    }

    // Account created + welcome email sent — sign them straight in.
    const signInRes = await signIn("credentials", {
      email: email.trim(),
      password,
      redirect: false,
      callbackUrl: callbackUrl ?? "/onboarding",
    });
    if (signInRes?.error) {
      // Account exists; send them to sign in manually.
      window.location.href = "/sign-in";
      return;
    }
    window.location.href = signInRes?.url ?? callbackUrl ?? "/onboarding";
  }

  const signInHref = callbackUrl
    ? `/sign-in?callbackUrl=${encodeURIComponent(callbackUrl)}`
    : "/sign-in";

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-3">
      <label className="block">
        <span className="eyebrow mb-2 block text-muted">Your name</span>
        <input
          type="text"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="What Agbebi should call you"
          className="w-full rounded-lg border border-border bg-bg px-4 py-3 font-mono text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none"
        />
      </label>
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
          autoComplete="new-password"
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 8 characters"
          className="w-full rounded-lg border border-border bg-bg px-4 py-3 font-mono text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none"
        />
      </label>
      {error && <p className="font-mono text-xs text-negative">{error}</p>}
      <button
        type="submit"
        disabled={busy}
        className="w-full rounded-lg bg-accent px-5 py-3 font-mono text-sm font-medium text-on-accent transition-colors hover:bg-accent-deep disabled:opacity-50"
      >
        {busy ? "Creating your account…" : "Create account"}
      </button>
      <p className="pt-1 text-center font-mono text-xs text-muted">
        Already have an account?{" "}
        <Link href={signInHref} className="text-accent underline underline-offset-4">
          Sign in
        </Link>
      </p>
    </form>
  );
}
