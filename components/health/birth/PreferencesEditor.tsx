"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { savePreferences, setPreferencesForDoctor } from "@/app/health/birth/prep-actions";
import type { PrefField, Preferences } from "@/lib/birth-prep";

/**
 * Her birth preferences, to fill in — lib/birth-prep.ts.
 *
 * Every question is optional. What she leaves empty is simply not on her
 * sheet. Only she is ever shown this form.
 */
export function PreferencesEditor({
  fields,
  initial,
  shared,
  hasDoctor,
  general,
}: {
  fields: PrefField[];
  initial: Preferences;
  /** Whether her preferences are shown to her linked doctor. */
  shared: boolean;
  hasDoctor: boolean;
  /** She chose Oyun without religious content — see the note on a kept line. */
  general: boolean;
}) {
  const router = useRouter();
  const [v, setV] = useState<Preferences>(initial);
  const [said, setSaid] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  // The tick moves at once and is put back if saving it fails.
  const [sharedNow, setSharedNow] = useState(shared);
  useEffect(() => setSharedNow(shared), [shared]);

  const text = (k: string) => (typeof v[k] === "string" ? (v[k] as string) : "");
  const many = (k: string) => (Array.isArray(v[k]) ? (v[k] as string[]) : []);
  const set = (k: string, val: string | string[]) => {
    setSaid(null);
    setV((p) => ({ ...p, [k]: val }));
  };

  function save() {
    setError(null);
    setSaid(null);
    start(async () => {
      const res = await savePreferences(v);
      if (!res.ok) setError(res.error);
      else {
        setSaid("Saved.");
        router.refresh();
      }
    });
  }

  const label = "mb-1.5 block font-mono text-[0.62rem] uppercase tracking-widest text-muted";
  const field =
    "w-full rounded-lg border border-border bg-bg px-3 py-2 prose-serif-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none";
  const choice = (on: boolean) =>
    `flex min-h-11 cursor-pointer items-start gap-3 rounded-xl border px-3 py-2.5 ${on ? "border-accent bg-accent/[0.06]" : "border-border"}`;

  return (
    <div className="space-y-6">
      {fields.map((f) => (
        <div key={f.key}>
          {f.kind === "text" ? (
            <>
              <label htmlFor={`pref-${f.key}`} className={label}>
                {f.label}
              </label>
              <textarea
                id={`pref-${f.key}`}
                rows={f.max && f.max > 300 ? 4 : 2}
                maxLength={f.max}
                value={text(f.key)}
                onChange={(e) => set(f.key, e.target.value)}
                placeholder={f.hint}
                // A line she wrote before choosing Oyun without religious
                // content: hers to keep or to take off, not to rewrite here.
                readOnly={f.faithOnly && general}
                className={field}
              />
              {f.faithOnly && general && (
                <p className="mt-1.5 prose-serif-xs text-muted">
                  You wrote this earlier. It stays on your sheet as it is.{" "}
                  <button type="button" onClick={() => set(f.key, "")} className="text-accent underline underline-offset-4">
                    Take it off
                  </button>
                </p>
              )}
            </>
          ) : (
            <fieldset>
              <legend className={label}>{f.label}</legend>
              <div className="space-y-2">
                {f.options!.map((o) => {
                  const on = f.kind === "one" ? v[f.key] === o.key : many(f.key).includes(o.key);
                  return (
                    <label key={o.key} className={choice(on)}>
                      <input
                        type={f.kind === "one" ? "radio" : "checkbox"}
                        name={`pref-${f.key}`}
                        checked={on}
                        onChange={(e) => {
                          if (f.kind === "one") set(f.key, o.key);
                          else set(f.key, e.target.checked ? [...many(f.key), o.key] : many(f.key).filter((k) => k !== o.key));
                        }}
                        className="mt-1 h-4 w-4 shrink-0 accent-[var(--accent)]"
                      />
                      <span className="prose-serif-sm text-ink">{o.label}</span>
                    </label>
                  );
                })}
              </div>
              {f.kind === "one" && typeof v[f.key] === "string" && (
                <button
                  type="button"
                  onClick={() => set(f.key, "")}
                  className="mt-1.5 inline-flex min-h-9 items-center font-mono text-[0.62rem] uppercase tracking-widest text-muted underline underline-offset-4 hover:text-accent"
                >
                  Leave this out
                </button>
              )}
            </fieldset>
          )}
        </div>
      ))}

      {error && <p className="prose-serif-xs text-negative">{error}</p>}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={save}
          disabled={pending}
          className="inline-flex min-h-11 items-center rounded-lg bg-accent px-5 font-mono text-xs text-on-accent disabled:opacity-50"
        >
          {pending ? "Saving…" : "Save my preferences"}
        </button>
        {said && <p className="prose-serif-xs text-accent" role="status">{said}</p>}
      </div>

      <div className="rounded-xl border border-border bg-bg/40 p-4">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={sharedNow}
            disabled={pending || !hasDoctor}
            onChange={(e) => {
              const want = e.target.checked;
              setSharedNow(want);
              start(async () => {
                setError(null);
                const res = await setPreferencesForDoctor(want);
                if (!res.ok) {
                  setError(res.error);
                  setSharedNow(!want);
                }
                router.refresh();
              });
            }}
            className="mt-1 h-4 w-4 shrink-0 accent-[var(--accent)]"
          />
          <span>
            <span className="block prose-serif-sm text-ink">Show these to my doctor or midwife</span>
            <span className="block prose-serif-xs text-muted">
              {hasDoctor
                ? "Off until you turn it on. They see the sheet as it is saved, and stop seeing it when you turn this off."
                : "You have not linked a doctor or midwife in Oyun. You can still print the sheet, or link one under Your doctor."}
            </span>
          </span>
        </label>
      </div>
    </div>
  );
}
