"use client";

import { useState, useTransition } from "react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ShareButton } from "@/components/ShareButton";

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

/**
 * The Scripture Journey — a chosen reading plan that moves forward through the
 * Bible and finishes. Sits above the daily liturgy: the liturgy meditates on a
 * verse; this walks the family through the whole Book, one reading at a time,
 * advancing only when they actually read.
 */
export function ScriptureJourney({
  state,
  chapter,
  plans,
  onChoose,
  onRead,
  onUndo,
  canManage = true,
  sharePath,
}: {
  state: JourneyState | null;
  chapter: ChapterPayload | null;
  plans: PlanOption[];
  onChoose: (planId: string) => Promise<void>;
  onRead: () => Promise<void>;
  onUndo: () => Promise<void>;
  canManage?: boolean;
  sharePath?: string;
}) {
  const [picking, setPicking] = useState(canManage && !state);
  const [pending, start] = useTransition();

  // A member who follows along but doesn't keep the home's rhythm (e.g. a
  // mentor) sees the journey and reads, but can't choose or advance it.
  if (!canManage && !state) {
    return (
      <div className="rounded-2xl shadow-[var(--shadow-2)] border border-border bg-surface p-6 md:p-8">
        <Eyebrow className="mb-2">Scripture Journey</Eyebrow>
        <p className="font-mono text-sm leading-relaxed text-muted">
          A parent or guardian hasn&rsquo;t chosen a reading plan yet. Once they
          do, the passage will appear here to read along.
        </p>
      </div>
    );
  }

  function choose(id: string) {
    start(async () => {
      await onChoose(id);
      setPicking(false);
    });
  }

  // ── Plan picker ────────────────────────────────────────────────────────
  if (picking || !state) {
    return (
      <div className="rounded-2xl shadow-[var(--shadow-2)] border border-accent/25 bg-gradient-to-br from-accent/[0.08] via-surface to-accent2/[0.07] p-6 md:p-8">
        <Eyebrow className="mb-3">Scripture Journey</Eyebrow>
        <h3 className="font-serif text-2xl leading-snug text-ink">
          {state ? "Choose a new journey." : "Read through the Scriptures, together."}
        </h3>
        <p className="mt-2 max-w-xl font-mono text-sm leading-relaxed text-muted">
          Pick a path through God&rsquo;s Word. It moves forward only when you
          read — miss a day and it simply waits. However long it takes, you
          finish the whole thing.
        </p>

        <div className="mt-6 grid gap-3">
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
          All {state.total} readings, {state.scope} — read together, all the way
          through. &ldquo;Your word is a lamp to my feet and a light to my
          path.&rdquo;
        </p>
        {canManage && (
          <button
            type="button"
            onClick={() => setPicking(true)}
            className="mt-6 rounded-lg bg-accent px-5 py-3 font-mono text-sm font-medium text-on-accent transition-colors hover:bg-accent-deep"
          >
            Begin another journey
          </button>
        )}
      </div>
    );
  }

  // ── Active reading ─────────────────────────────────────────────────────
  return (
    <div className="rounded-2xl shadow-[var(--shadow-2)] border border-accent/25 bg-gradient-to-br from-accent/[0.07] via-surface to-accent2/[0.06] p-6 md:p-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Eyebrow className="mb-2">Scripture Journey</Eyebrow>
          <h3 className="font-serif text-xl leading-snug text-ink">{state.title}</h3>
        </div>
        {canManage && (
          <button
            type="button"
            onClick={() => setPicking(true)}
            className="font-mono text-[0.68rem] uppercase tracking-widest text-muted underline underline-offset-4 hover:text-accent"
          >
            Change
          </button>
        )}
      </div>

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
                text={`${chapter.ref} — today's family reading.`}
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
        {!canManage ? (
          <span className="font-mono text-xs text-muted">
            Read along; a parent or guardian keeps the plan moving.
          </span>
        ) : (
          <>
            <button
              type="button"
              disabled={pending}
              onClick={() => start(() => onRead())}
              className="btn-primary inline-flex items-center gap-2 rounded-lg px-5 py-3 font-mono text-sm font-medium text-on-accent transition-transform active:scale-[0.98] disabled:opacity-60"
            >
              {pending ? "Saving…" : "We read this — next"}
            </button>
            {state.done > 0 && (
              <button
                type="button"
                disabled={pending}
                onClick={() => start(() => onUndo())}
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
