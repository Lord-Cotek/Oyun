"use client";

import { useState } from "react";
import { CLAIM_WORDS } from "@/lib/post-share";

export type ClaimFn = (token: string) => Promise<{ ok: boolean; error?: string }>;

/**
 * The one question asked of somebody in the circle who once wrote in from
 * outside — and the only thing standing between them and the post.
 *
 * ── Why this is a whole page and not a banner on the post ────────────────
 * Because the cookie that proves this browser wrote those words is sent to
 * the share page and nowhere else (see claim-actions.ts). Carrying the proof
 * onward would mean signing it and verifying it again, which is more to get
 * wrong than a question somebody is asked at most once.
 *
 * ── Why both buttons leave ───────────────────────────────────────────────
 * Nobody is held here to get an answer. "Leave it as it is" is a real choice
 * with a real button, the same size as the other one, and there is a third
 * way out that answers nothing at all. A page that only lets you past if you
 * say yes is not asking.
 */
export function ClaimYours({
  token,
  hello,
  to,
  onClaim,
  onLeave,
}: {
  token: string;
  hello: { name: string; body: string };
  /** The post, where every one of these buttons ends up. */
  to: string;
  onClaim: ClaimFn;
  onLeave: ClaimFn;
}) {
  const [busy, setBusy] = useState<"yes" | "no" | null>(null);
  const [error, setError] = useState<string | null>(null);

  // A full page load rather than a router push: the destination carries
  // `#post-…`, and the browser is the thing that reliably honours a fragment.
  function go() {
    window.location.href = to;
  }

  async function answer(which: "yes" | "no") {
    setBusy(which);
    setError(null);
    const r = await (which === "yes" ? onClaim(token) : onLeave(token));
    if (!r.ok) {
      setError(r.error ?? "That did not work. Try again?");
      setBusy(null);
      return;
    }
    go();
  }

  return (
    <main className="mx-auto flex min-h-[100dvh] max-w-md flex-col justify-center px-6 py-10">
      <p className="font-mono text-[0.62rem] uppercase tracking-widest text-accent">
        {CLAIM_WORDS.title}
      </p>
      <h1 className="mt-3 font-serif text-2xl leading-snug text-ink">
        {CLAIM_WORDS.lede}
      </h1>

      <blockquote className="mt-5 rounded-xl border border-border bg-surface p-4">
        <p className="whitespace-pre-wrap font-serif text-lg leading-relaxed text-ink">
          {hello.body}
        </p>
        <p className="mt-2 font-mono text-[0.58rem] uppercase tracking-widest text-muted">
          {hello.name}
        </p>
      </blockquote>

      <p className="mt-4 prose-serif-sm text-muted">{CLAIM_WORDS.audience}</p>

      <div className="mt-6 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={busy !== null}
          onClick={() => answer("yes")}
          className="min-h-11 rounded-lg bg-accent px-4 font-mono text-sm font-medium text-on-accent transition-colors hover:bg-accent-deep disabled:opacity-50"
        >
          {busy === "yes" ? "Moving it…" : CLAIM_WORDS.yes}
        </button>
        <button
          type="button"
          disabled={busy !== null}
          onClick={() => answer("no")}
          className="min-h-11 rounded-lg border border-border px-4 font-mono text-sm text-muted transition-colors hover:text-ink disabled:opacity-50"
        >
          {busy === "no" ? "…" : CLAIM_WORDS.no}
        </button>
      </div>

      <button
        type="button"
        onClick={go}
        className="mt-5 self-start font-mono text-[0.62rem] uppercase tracking-widest text-muted underline underline-offset-4 hover:text-accent"
      >
        {CLAIM_WORDS.skip} →
      </button>

      {error && (
        <p className="mt-4 font-mono text-[0.62rem] leading-relaxed text-negative">
          {error}
        </p>
      )}
    </main>
  );
}
