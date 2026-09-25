"use client";

import { useState, useTransition } from "react";
import { askedAgo } from "@/lib/post-share";

export interface JoinAsk {
  id: string;
  name: string;
  /** What they SAY they are. A hint, never a grant — see lib/post-share.ts. */
  relation: string;
  email: string;
  note: string | null;
  createdAt: string;
  /** The first words of the post that brought them, for context. */
  from: string | null;
}

export type WelcomeFn = (input: {
  id: string;
  role: string;
}) => Promise<{ ok: boolean; error?: string }>;
export type DeclineFn = (id: string) => Promise<{ ok: boolean }>;

/**
 * People who followed a shared link and asked to come in.
 *
 * ── Why the role is chosen here, on this card ────────────────────────────
 * Because this is the one moment somebody who knows the family is looking at
 * the name. "Grandparent" on the card is what a stranger typed into a form
 * reached through a link that may have been forwarded twice; it tells her who
 * to expect and it decides nothing. She reads the name, recognises it or does
 * not, and taps the role herself.
 *
 * Husband/partner is not offered, anywhere, on purpose. Everything else can
 * be undone by removing a member; that one is the place beside her.
 *
 * ── Why declining is quiet ───────────────────────────────────────────────
 * No email goes out. Somebody who asked and was turned down — a colleague, a
 * distant acquaintance, somebody who tapped out of curiosity — does not need
 * to be told, and a family should be able to say no without having a
 * conversation about it.
 */
export function JoinRequests({
  asks,
  roles,
  onWelcome,
  onDecline,
}: {
  asks: JoinAsk[];
  /** The roles a stranger may be welcomed as, in the app's own words. */
  roles: { value: string; label: string }[];
  onWelcome: WelcomeFn;
  onDecline: DeclineFn;
}) {
  const [gone, setGone] = useState<string[]>([]);
  const left = asks.filter((a) => !gone.includes(a.id));
  if (left.length === 0) return null;

  return (
    <div>
      <p className="eyebrow mb-1 text-accent">
        {left.length === 1
          ? "Someone would like to join"
          : `${left.length} people would like to join`}
      </p>
      <p className="mb-4 prose-serif-xs text-muted">
        They followed a link you shared. What they say about themselves is
        their word for it — add them only if you know the name.
      </p>
      <ul className="space-y-3">
        {left.map((a) => (
          <Ask
            key={a.id}
            ask={a}
            roles={roles}
            onWelcome={onWelcome}
            onDecline={onDecline}
            onDone={() => setGone((g) => [...g, a.id])}
          />
        ))}
      </ul>
    </div>
  );
}

function Ask({
  ask,
  roles,
  onWelcome,
  onDecline,
  onDone,
}: {
  ask: JoinAsk;
  roles: { value: string; label: string }[];
  onWelcome: WelcomeFn;
  onDecline: DeclineFn;
  onDone: () => void;
}) {
  const [pending, start] = useTransition();
  const [role, setRole] = useState(roles[0]?.value ?? "FAMILY");
  const [error, setError] = useState<string | null>(null);
  // Declining is two taps. It is the one action here that cannot be walked
  // back, and it sits next to a row of buttons somebody is tapping quickly.
  const [armed, setArmed] = useState(false);

  return (
    <li className="rounded-xl border border-border bg-bg p-4">
      <div className="flex flex-wrap items-baseline gap-2">
        <p className="font-serif text-lg leading-snug text-ink">{ask.name}</p>
        <span className="font-mono text-[0.62rem] uppercase tracking-widest text-muted">
          {ask.relation} · {askedAgo(ask.createdAt)}
        </span>
      </div>
      <p className="mt-1 break-all font-mono text-[0.62rem] text-muted">
        {ask.email}
      </p>
      {ask.note && (
        <p className="mt-2 whitespace-pre-wrap prose-serif-sm text-ink/85">
          “{ask.note}”
        </p>
      )}
      {ask.from && (
        <p className="mt-2 font-mono text-[0.58rem] leading-relaxed text-muted">
          Came from: {ask.from}
        </p>
      )}

      <div className="mt-4">
        <p className="mb-2 font-mono text-[0.62rem] uppercase tracking-widest text-muted">
          Add them as
        </p>
        <div className="flex flex-wrap gap-1.5">
          {roles.map((r) => (
            <button
              key={r.value}
              type="button"
              onClick={() => setRole(r.value)}
              aria-pressed={role === r.value}
              className={`rounded-full px-3 py-1.5 font-mono text-[0.68rem] transition-colors ${
                role === r.value
                  ? "bg-accent text-on-accent"
                  : "border border-border text-muted hover:text-ink"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={pending}
          onClick={() =>
            start(async () => {
              setError(null);
              const r = await onWelcome({ id: ask.id, role });
              if (!r.ok) {
                setError(r.error ?? "That did not work. Try again?");
                return;
              }
              onDone();
            })
          }
          className="rounded-lg bg-accent px-4 py-2 font-mono text-sm font-medium text-on-accent transition-colors hover:bg-accent-deep disabled:opacity-50"
        >
          {pending ? "Sending…" : "Send them an invitation"}
        </button>
        <button
          type="button"
          disabled={pending}
          aria-label={armed ? `Yes, turn down ${ask.name}` : `Turn down ${ask.name}`}
          onClick={() => {
            if (!armed) {
              setArmed(true);
              setTimeout(() => setArmed(false), 4000);
              return;
            }
            start(async () => {
              await onDecline(ask.id);
              onDone();
            });
          }}
          className="rounded-lg border border-border px-3 py-2 font-mono text-[0.68rem] text-muted transition-colors hover:border-negative hover:text-negative disabled:opacity-50"
        >
          {armed ? "Sure?" : "Not this time"}
        </button>
      </div>

      <p className="mt-3 font-mono text-[0.58rem] leading-relaxed text-muted">
        They will get the ordinary invitation by email and still have to make
        an account. Turning somebody down sends them nothing.
      </p>

      {error && (
        <p className="mt-2 font-mono text-[0.62rem] leading-relaxed text-negative">
          {error}
        </p>
      )}
    </li>
  );
}
