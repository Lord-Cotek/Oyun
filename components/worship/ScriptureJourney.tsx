"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ShareButton } from "@/components/ShareButton";

export type Track = "shared" | "me";

export interface PlanOption {
  id: string;
  title: string;
  blurb: string;
  scope: string;
  total: number;
  pace: string;
}

export interface ChapterPayload {
  ref: string;
  verses: string[];
}

export interface JourneyState {
  planId: string;
  title: string;
  scope: string;
  done: number;
  total: number;
  pct: number;
  finished: boolean;
  nextRef: string | null;
  readToday: boolean;
}

export interface ScopeLabel {
  label: string;
  blurb: string;
}

/**
 * The Scripture Journey — a chosen reading plan that moves forward through the
 * Bible and finishes. A journey can be walked TOGETHER (the shared plan) or on
 * your OWN (a personal plan) — the reader chooses when they begin. Sits above
 * the daily liturgy; advances only when the passage is actually read.
 */
export function ScriptureJourney({
  state,
  chapter,
  plans,
  onChoose,
  onRead,
  onUndo,
  track,
  canChooseShared = true,
  scopeLabels,
  switchTo,
  sharePath,
}: {
  state: JourneyState | null;
  chapter: ChapterPayload | null;
  plans: PlanOption[];
  onChoose: (planId: string, scope: Track) => Promise<void>;
  onRead: (track: Track) => Promise<void>;
  onUndo: (track: Track) => Promise<void>;
  track: Track;
  canChooseShared?: boolean;
  scopeLabels: { shared: ScopeLabel; me: ScopeLabel };
  switchTo?: { label: string; href: string };
  sharePath?: string;
}) {
  const [picking, setPicking] = useState(!state);
  const [scope, setScope] = useState<Track>(
    canChooseShared ? track : "me",
  );
  const [pending, start] = useTransition();

  // A personal journey is always the reader's to advance; the shared one only
  // if they keep it (a parent/guardian, or the couple in Oyun).
  const canAdvance = track === "me" || canChooseShared;
  const trackName = track === "me" ? scopeLabels.me.label : scopeLabels.shared.label;

  function choose(id: string) {
    const chosen: Track = canChooseShared ? scope : "me";
    start(async () => {
      await onChoose(id, chosen);
      setPicking(false);
    });
  }

  // ── Plan picker ────────────────────────────────────────────────────────
  if (picking || !state) {
    return (
      <div className="rounded-2xl shadow-[var(--shadow-2)] border border-accent/25 bg-gradient-to-br from-accent/[0.08] via-surface to-accent2/[0.07] p-6 md:p-8">
        <Eyebrow className="mb-3">Scripture Journey</Eyebrow>
        <h3 className="font-serif text-2xl leading-snug text-ink">
          {state ? "Choose a new journey." : "Read through the Scriptures."}
        </h3>
        <p className="mt-2 max-w-xl font-mono text-sm leading-relaxed text-muted">
          Pick a path through God&rsquo;s Word. It moves forward only when you
          read — miss a day and it simply waits. However long it takes, you
          finish the whole thing.
        </p>

        {/* Who is this journey for? */}
        {canChooseShared ? (
          <div className="mt-5">
            <div className="inline-flex rounded-xl border border-border bg-bg/60 p-1">
              {(["shared", "me"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setScope(s)}
                  className={`rounded-lg px-4 py-2 font-mono text-xs transition-colors ${
                    scope === s
                      ? "bg-accent text-on-accent"
                      : "text-muted hover:text-ink"
                  }`}
                >
                  {scopeLabels[s].label}
                </button>
              ))}
            </div>
            <p className="mt-2 font-mono text-[0.7rem] leading-relaxed text-muted">
              {scopeLabels[scope].blurb}
            </p>
          </div>
        ) : (
          <p className="mt-4 rounded-lg border border-border bg-bg/60 px-4 py-3 font-mono text-[0.72rem] leading-relaxed text-muted">
            The shared journey is set by a parent or guardian — this begins{" "}
            <span className="text-ink">your own</span>.
          </p>
        )}

        <div className="mt-5 grid gap-3">
          {plans.map((p) => {
            const current = state?.planId === p.id;
            return (
              <button
                key={p.id}
                type="button"
                disabled={pending}
                onClick={() => choose(p.id)}
                className="group flex items-start justify-between gap-4 rounded-xl border border-border bg-bg/60 p-4 text-left transition-colors hover:border-accent disabled:opacity-50"
              >
                <span className="min-w-0">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="font-serif text-lg text-ink">{p.title}</span>
                    <span className="font-mono text-[0.6rem] uppercase tracking-widest text-accent">
                      {p.scope}
                    </span>
                    {current && (
                      <span className="rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 font-mono text-[0.55rem] uppercase tracking-widest text-accent">
                        Current
                      </span>
                    )}
                  </span>
                  <span className="mt-1 block font-mono text-xs leading-relaxed text-muted">
                    {p.blurb}
                  </span>
                  <span className="mt-2 block font-mono text-[0.65rem] uppercase tracking-widest text-muted/80">
                    {p.total} readings · {p.pace}
                  </span>
                </span>
                <span
                  aria-hidden
                  className="mt-1 shrink-0 font-mono text-lg text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-accent"
                >
                  →
                </span>
              </button>
            );
          })}
        </div>

        {state && (
          <button
            type="button"
            onClick={() => setPicking(false)}
            className="mt-5 font-mono text-xs text-muted underline underline-offset-4 hover:text-ink"
          >
            ← Keep my current journey
          </button>
        )}
      </div>
    );
  }

  // ── Finished ───────────────────────────────────────────────────────────
  if (state.finished) {
    return (
      <div className="rounded-2xl shadow-[var(--shadow-2)] border border-accent/30 bg-gradient-to-br from-accent/[0.12] via-surface to-accent2/[0.10] p-6 text-center md:p-10">
        <Eyebrow className="mb-3">Scripture Journey · Complete</Eyebrow>
        <h3 className="font-serif text-3xl leading-snug text-ink">
          You finished {state.title}.
        </h3>
        <p className="mx-auto mt-3 max-w-md font-mono text-sm leading-relaxed text-muted">
          All {state.total} readings, {state.scope} — every chapter, to the end.
          &ldquo;Your word is a lamp to my feet and a light to my path.&rdquo;
        </p>
        <button
          type="button"
          onClick={() => setPicking(true)}
          className="mt-6 rounded-lg bg-accent px-5 py-3 font-mono text-sm font-medium text-on-accent transition-colors hover:bg-accent-deep"
        >
          Begin another journey
        </button>
      </div>
    );
  }

  // ── Active reading ─────────────────────────────────────────────────────
  return (
    <div className="rounded-2xl shadow-[var(--shadow-2)] border border-accent/25 bg-gradient-to-br from-accent/[0.07] via-surface to-accent2/[0.06] p-6 md:p-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Eyebrow className="mb-2">Scripture Journey · {trackName}</Eyebrow>
          <h3 className="font-serif text-xl leading-snug text-ink">{state.title}</h3>
        </div>
        <button
          type="button"
          onClick={() => setPicking(true)}
          className="font-mono text-[0.68rem] uppercase tracking-widest text-muted underline underline-offset-4 hover:text-accent"
        >
          Change
        </button>
      </div>

      {switchTo && (
        <Link
          href={switchTo.href}
          className="mt-3 inline-block font-mono text-[0.7rem] text-accent underline underline-offset-4 hover:text-accent-deep"
        >
          {switchTo.label} →
        </Link>
      )}

      {/* progress */}
      <div className="mt-4">
        <div className="mb-1.5 flex items-center justify-between font-mono text-[0.68rem] uppercase tracking-widest text-muted">
          <span>
            {state.done} of {state.total} · {state.scope}
          </span>
          <span className="text-accent">{state.pct}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-border">
          <div
            className="h-full rounded-full bg-gradient-to-r from-accent to-accent2 transition-[width] duration-700"
            style={{ width: `${Math.max(2, state.pct)}%` }}
          />
        </div>
      </div>

      {/* today's reading */}
      {chapter && (
        <div className="mt-6 rounded-xl border border-border bg-bg/70 p-5">
          <div className="mb-3 flex items-baseline justify-between gap-3">
            <span className="font-serif text-lg text-ink">{chapter.ref}</span>
            {sharePath ? (
              <ShareButton
                path={sharePath}
                title={chapter.ref}
                text={`${chapter.ref} — today's reading.`}
              />
            ) : (
              <span className="font-mono text-[0.6rem] uppercase tracking-widest text-muted">
                Today&rsquo;s reading
              </span>
            )}
          </div>
          <ChapterText verses={chapter.verses} />
        </div>
      )}

      {/* action */}
      <div className="mt-5 flex flex-wrap items-center gap-3">
        {!canAdvance ? (
          <span className="font-mono text-xs text-muted">
            Read along; a parent or guardian keeps this journey moving — or start
            your own above.
          </span>
        ) : (
          <>
            <button
              type="button"
              disabled={pending}
              onClick={() => start(() => onRead(track))}
              className="btn-primary inline-flex items-center gap-2 rounded-lg px-5 py-3 font-mono text-sm font-medium text-on-accent transition-transform active:scale-[0.98] disabled:opacity-60"
            >
              {pending ? "Saving…" : "We read this — next"}
            </button>
            {state.done > 0 && (
              <button
                type="button"
                disabled={pending}
                onClick={() => start(() => onUndo(track))}
                className="font-mono text-xs text-muted underline underline-offset-4 hover:text-ink disabled:opacity-50"
              >
                Undo last
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

/** A chapter's verses, collapsed to a readable opening with a full-text toggle. */
function ChapterText({ verses }: { verses: string[] }) {
  const [open, setOpen] = useState(verses.length <= 16);
  const shown = open ? verses : verses.slice(0, 8);
  return (
    <div>
      <div className="space-y-1.5 whitespace-pre-line font-mono text-[0.82rem] leading-relaxed text-ink/90">
        {shown.map((v, i) => (
          <p key={i}>
            <span className="mr-1 select-none align-super font-sans text-[0.6rem] text-accent">
              {i + 1}
            </span>
            {v}
          </p>
        ))}
      </div>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-3 font-mono text-xs text-accent underline underline-offset-4"
        >
          Read all {verses.length} verses
        </button>
      )}
    </div>
  );
}
