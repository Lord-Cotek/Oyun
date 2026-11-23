"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { requestSignInCode } from "@/app/sign-in/actions";
import { sayIn, type Words } from "@/lib/i18n";

/**
 * Only somewhere inside this app. A callback URL arrives in the address bar,
 * and sending somebody wherever it says after they sign in would let a link
 * bounce them to another site that looks like this one.
 */
function safeNext(url: string | null | undefined, fallback: string): string {
  if (!url) return fallback;
  if (url.startsWith("/") && !url.startsWith("//")) return url;
  try {
    const u = new URL(url, window.location.origin);
    return u.origin === window.location.origin ? u.pathname + u.search + u.hash : fallback;
  } catch {
    return fallback;
  }
}

export function SignInForm({
  callbackUrl,
  initialEmail,
  words,
  createHref,
}: {
  callbackUrl?: string;
  initialEmail?: string;
  /** The reader's language, when it is not English — see lib/i18n.ts. */
  words?: Words;
  /** Where "Create an account" leads, when it is not the ordinary sign-up. */
  createHref?: string;
}) {
  const w = (en: string) => sayIn(words, en);
  const [email, setEmail] = useState(initialEmail ?? "");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // The password is the ordinary way in; a code by email is the option for
  // whoever has forgotten it.
  const [mode, setMode] = useState<"password" | "code">("password");
  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState("");
  const home = callbackUrl ?? "/journey";

  async function sendCode() {
    if (!email.trim() || busy) return;
    setBusy(true);
    setError(null);
    const r = await requestSignInCode(email.trim()).catch(() => ({ ok: false as const, error: w("Something went wrong. Please try again.") }));
    setBusy(false);
    if (r.ok) setCodeSent(true);
    else setError(r.error);
  }

  async function signInWithCode(e: React.FormEvent) {
    e.preventDefault();
    if (!codeSent) return sendCode();
    if (code.replace(/\D/g, "").length !== 6 || busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await signIn("email-code", {
        email: email.trim(),
        code,
        redirect: false,
        callbackUrl: home,
      });
      if (res?.error) {
        setError(w("That code didn't work. Check it, or send a new one."));
        setBusy(false);
      } else {
        window.location.href = safeNext(res?.url, home);
      }
    } catch {
      setError(w("Something went wrong. Please try again."));
      setBusy(false);
    }
  }

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
        setError(w("That email or password doesn't match. Please try again."));
        setBusy(false);
      } else {
        window.location.href = safeNext(res?.url, home);
      }
    } catch {
      setError(w("Something went wrong. Please try again."));
      setBusy(false);
    }
  }

  const signUpHref =
    createHref ??
    (callbackUrl ? `/sign-up?callbackUrl=${encodeURIComponent(callbackUrl)}` : "/sign-up");

  if (mode === "code") {
    return (
      <form onSubmit={signInWithCode} className="mt-6 space-y-3">
        <label className="block">
          <span className="eyebrow mb-2 block text-muted">{w("Email")}</span>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setCodeSent(false);
            }}
            placeholder="you@example.com"
            className="prose-serif-sm w-full rounded-lg border border-border bg-bg px-4 py-3 text-ink placeholder:text-muted focus:border-accent focus:outline-none"
          />
        </label>
        {codeSent && (
          <label className="block">
            <span className="eyebrow mb-2 block text-muted">{w("The 6-digit code")}</span>
            <input
              id="sign-in-code"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9 ]*"
              maxLength={7}
              required
              autoFocus
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="123 456"
              className="prose-serif-sm w-full rounded-lg border border-border bg-bg px-4 py-3 tracking-[0.3em] text-ink placeholder:text-muted focus:border-accent focus:outline-none"
            />
            <span className="mt-1.5 block font-mono text-xs text-muted">
              If {email.trim()} has an account, a code is on its way. It works for ten minutes.
            </span>
          </label>
        )}
        {error && <p className="font-mono text-xs text-negative">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-lg bg-accent px-5 py-3 font-mono text-sm font-medium text-on-accent transition-colors hover:bg-accent-deep disabled:opacity-50"
        >
          {busy ? w("One moment…") : codeSent ? w("Sign in") : w("Email me a code")}
        </button>
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <button
            type="button"
            onClick={() => {
              setMode("password");
              setError(null);
            }}
            className="font-mono text-xs text-accent underline underline-offset-4"
          >
            {w("Use my password instead")}
          </button>
          {codeSent && (
            <button
              type="button"
              disabled={busy}
              onClick={sendCode}
              className="font-mono text-xs text-muted underline underline-offset-4 hover:text-accent"
            >
              {w("Send a new code")}
            </button>
          )}
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-3">
      <label className="block">
        <span className="eyebrow mb-2 block text-muted">{w("Email")}</span>
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="prose-serif-sm w-full rounded-lg border border-border bg-bg px-4 py-3 text-ink placeholder:text-muted focus:border-accent focus:outline-none"
        />
      </label>
      <label className="block">
        <span className="eyebrow mb-2 block text-muted">{w("Password")}</span>
        <input
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={w("Your password")}
          className="prose-serif-sm w-full rounded-lg border border-border bg-bg px-4 py-3 text-ink placeholder:text-muted focus:border-accent focus:outline-none"
        />
      </label>
      {error && <p className="font-mono text-xs text-negative">{error}</p>}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => {
            setMode("code");
            setError(null);
          }}
          className="font-mono text-xs text-muted underline underline-offset-4 hover:text-accent"
        >
          {w("Email me a code instead")}
        </button>
        <Link
          href="/forgot-password"
          className="font-mono text-xs text-muted underline underline-offset-4 hover:text-accent"
        >
          {w("Forgot password?")}
        </Link>
      </div>
      <button
        type="submit"
        disabled={busy}
        className="w-full rounded-lg bg-accent px-5 py-3 font-mono text-sm font-medium text-on-accent transition-colors hover:bg-accent-deep disabled:opacity-50"
      >
        {busy ? w("Signing in…") : w("Sign in")}
      </button>
      <p className="pt-1 text-center font-mono text-xs text-muted">
        {w("New to Oyun?")}{" "}
        <Link href={signUpHref} className="text-accent underline underline-offset-4">
          {w("Create an account")}
        </Link>
      </p>
    </form>
  );
}
