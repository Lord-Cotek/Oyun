"use client";

import { useState } from "react";
import { createInvite } from "@/app/journey/actions";
import { Eyebrow } from "@/components/ui/Eyebrow";

export function InvitePanel({ hasSupporter }: { hasSupporter: boolean }) {
  const [link, setLink] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  return (
    <div>
      <Eyebrow className="mb-3">
        {hasSupporter ? "Invite another" : "Invite your partner"}
      </Eyebrow>
      <p className="mb-4 font-mono text-xs leading-relaxed text-muted">
        Bring your husband or an accountability partner alongside. They&rsquo;ll
        get their own view — how to support and pray for you, right where you are.
      </p>

      <form
        action={async (fd) => {
          setBusy(true);
          setError(null);
          setCopied(false);
          const res = await createInvite(fd);
          setBusy(false);
          if (res.ok) setLink(res.link);
          else setError(res.error);
        }}
        className="space-y-3"
      >
        <input
          type="email"
          name="email"
          required
          placeholder="their@email.com"
          className="w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 font-mono text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none"
        />
        <select
          name="role"
          defaultValue="PARTNER"
          className="w-full rounded-lg border border-border bg-bg px-3 py-2.5 font-mono text-sm text-ink focus:border-accent focus:outline-none"
        >
          <option value="PARTNER">Husband / Partner</option>
          <option value="ACCOUNTABILITY">Accountability partner</option>
        </select>
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-lg border border-border bg-transparent px-4 py-2.5 font-mono text-sm text-ink transition-colors hover:border-accent hover:text-accent disabled:opacity-50"
        >
          {busy ? "Preparing invite…" : "Send invite"}
        </button>
      </form>

      {error && <p className="mt-3 font-mono text-xs text-negative">{error}</p>}

      {link && (
        <div className="mt-4 rounded-lg border border-accent/30 bg-accent/[0.06] p-3">
          <p className="font-mono text-[0.68rem] text-muted">
            Invite ready. We&rsquo;ve emailed it — or share this link directly:
          </p>
          <div className="mt-2 flex items-center gap-2">
            <code className="min-w-0 flex-1 truncate rounded bg-bg px-2 py-1.5 font-mono text-[0.68rem] text-ink">
              {link}
            </code>
            <button
              type="button"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(link);
                  setCopied(true);
                } catch {
                  /* clipboard may be unavailable */
                }
              }}
              className="shrink-0 rounded px-2 py-1.5 font-mono text-[0.68rem] text-accent hover:underline"
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
