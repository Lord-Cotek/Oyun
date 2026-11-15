"use client";

import { useState, useTransition } from "react";
import { EditInPlace } from "@/components/ui/EditInPlace";
import { NAME_MAX, REQUEST_MAX, type PrayingForView } from "@/lib/praying-for";

type Result = { ok: boolean; error?: string } | void;

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

/**
 * The people this family is praying for by name, with what they asked for.
 * Kept by those who keep the house; the circle sees only the names the
 * family chose to share with them, and never changes them.
 *
 * Shared with the sibling app and drift-checked.
 */
export function PrayingFor({
  items,
  suggestions,
  canKeep,
  circleWord,
  onAdd,
  onEdit,
  onAnswer,
  onStop,
  onResume,
  onRemove,
}: {
  items: PrayingForView[];
  /** Names already in the family, offered as the name is typed. */
  suggestions: string[];
  canKeep: boolean;
  /** What this app calls the wider circle: "the circle". */
  circleWord: string;
  onAdd: (fd: FormData) => Promise<Result>;
  onEdit: (fd: FormData) => Promise<Result>;
  onAnswer: (fd: FormData) => Promise<Result>;
  onStop: (id: string) => Promise<Result>;
  onResume: (id: string) => Promise<Result>;
  onRemove: (id: string) => Promise<Result>;
}) {
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const [formKey, setFormKey] = useState(0);
  const active = items.filter((i) => !i.stoppedAt && !i.answeredAt);
  const finished = items.filter((i) => i.stoppedAt || i.answeredAt);
  const input =
    "w-full rounded-lg border border-border bg-bg px-3 py-2 font-mono text-sm text-ink focus:border-accent focus:outline-none";
  const quiet = "font-mono text-[0.68rem] text-muted underline-offset-2 hover:text-accent hover:underline disabled:opacity-50";
  const run = (fn: () => Promise<Result>) =>
    start(async () => {
      setError(null);
      const r = await fn().catch(() => ({ ok: false, error: "That did not save. Please try again." }));
      if (r && r.ok === false) setError(r.error ?? "That did not save. Please try again.");
    });

  return (
    <div className="rounded-2xl border border-border bg-surface p-6">
      <h2 className="font-serif text-xl leading-tight text-ink">People we&rsquo;re praying for</h2>
      <p className="mt-1 max-w-prose prose-serif-xs text-muted">
        {canKeep
          ? `Anyone, in the family or far outside it, with what they asked for. A few are named in worship each day, and everyone comes round in turn. Kept to your house unless you share a name with ${circleWord}.`
          : "The names this family has asked you to carry with them. A few are named in worship each day."}
      </p>

      {active.length === 0 ? (
        <p className="mt-4 prose-serif-sm text-muted">
          {canKeep ? "Nobody yet. Add the first name below." : "Nobody has been shared with you yet."}
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {active.map((p) => (
            <li key={p.id} className="rounded-xl border border-border bg-bg/50 p-4">
              <p className="font-serif text-base text-ink">{p.name}</p>
              {p.request && <p className="mt-0.5 prose-serif-xs text-muted">{p.request}</p>}
              <p className="mt-1 font-mono text-[0.62rem] text-muted">
                Since {fmt(p.since)}
                {canKeep ? ` · added by ${p.addedBy}` : ""}
                {canKeep && p.withCircle ? ` · shared with ${circleWord}` : ""}
              </p>
              {canKeep && (
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
                  {p.mine && (
                    <EditInPlace
                      describe={`what we pray for ${p.name}`}
                      hidden={{ id: p.id }}
                      action={onEdit}
                      fields={[
                        { name: "name", label: "Name", kind: "text", value: p.name, max: NAME_MAX, required: true },
                        { name: "request", label: "What to pray for", kind: "textarea", rows: 2, value: p.request ?? "", max: REQUEST_MAX },
                        {
                          name: "withCircle",
                          label: `Share with ${circleWord}?`,
                          kind: "select",
                          value: p.withCircle ? "yes" : "no",
                          options: [
                            { value: "no", label: "No — just our house" },
                            { value: "yes", label: `Yes — ${circleWord} can pray too` },
                          ],
                        },
                      ]}
                    />
                  )}
                  <EditInPlace
                    word="Answered"
                    describe={`the prayer for ${p.name} as answered`}
                    hidden={{ id: p.id }}
                    action={onAnswer}
                    fields={[
                      {
                        name: "note",
                        label: "How it was answered (optional)",
                        kind: "textarea",
                        rows: 2,
                        value: "",
                        max: REQUEST_MAX,
                        hint: "Thanked for in worship for a week.",
                      },
                    ]}
                  />
                  <button type="button" className={quiet} disabled={pending} onClick={() => run(() => onStop(p.id))}>
                    Stop praying
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {canKeep && (
        <form
          key={formKey}
          className="mt-5 space-y-3 rounded-xl border border-dashed border-border p-4"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            run(async () => {
              const r = await onAdd(fd);
              if (!r || r.ok) setFormKey((k) => k + 1);
              return r;
            });
          }}
        >
          <p className="eyebrow text-muted">Add someone</p>
          <label htmlFor="pf-name" className="block">
            <span className="sr-only">Name</span>
            <input id="pf-name" name="name" required maxLength={NAME_MAX} list="pf-names" placeholder="Their name" className={input} />
            <datalist id="pf-names">
              {suggestions.map((n) => (
                <option key={n} value={n} />
              ))}
            </datalist>
          </label>
          <label htmlFor="pf-request" className="block">
            <span className="sr-only">What to pray for</span>
            <textarea
              id="pf-request"
              name="request"
              rows={2}
              maxLength={REQUEST_MAX}
              placeholder="What to pray for (optional)"
              className={`${input} resize-y`}
            />
          </label>
          <label className="flex items-start gap-2 font-mono text-xs text-muted">
            <input type="checkbox" name="withCircle" className="mt-0.5 h-4 w-4 accent-[var(--accent)]" />
            Share this name with {circleWord}, so they can pray too
          </label>
          <button
            type="submit"
            disabled={pending}
            className="rounded-lg bg-accent px-4 py-2 font-mono text-xs font-medium text-on-accent transition-colors hover:bg-accent-deep disabled:opacity-50"
          >
            {pending ? "Adding…" : "Add to our prayers"}
          </button>
        </form>
      )}

      {error && (
        <p role="alert" className="mt-3 font-mono text-xs text-negative">
          {error}
        </p>
      )}

      {canKeep && finished.length > 0 && (
        <details className="mt-5">
          <summary className="cursor-pointer font-mono text-xs text-muted marker:text-muted">
            Answered and finished ({finished.length})
          </summary>
          <ul className="mt-3 space-y-2">
            {finished.map((p) => (
              <li key={p.id} className="border-t border-border pt-2">
                <p className="prose-serif-sm text-ink">
                  {p.name}
                  {p.request ? <span className="text-muted"> — {p.request}</span> : null}
                </p>
                <p className="font-mono text-[0.62rem] text-muted">
                  {p.answeredAt ? `Answered ${fmt(p.answeredAt)}` : `Finished ${fmt(p.stoppedAt!)}`}
                  {p.answerNote ? ` — ${p.answerNote}` : ""}
                </p>
                <div className="mt-1 flex gap-4">
                  <button type="button" className={quiet} disabled={pending} onClick={() => run(() => onResume(p.id))}>
                    Pray again
                  </button>
                  {p.mine && (
                    <button type="button" className={quiet} disabled={pending} onClick={() => run(() => onRemove(p.id))}>
                      Remove for good
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}
