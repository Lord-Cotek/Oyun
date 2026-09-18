"use client";

import { useState } from "react";
import { type AppointmentKind } from "@prisma/client";
import {
  kindVoice,
  APPOINTMENT_KINDS,
  TITLE_MAX,
  TEXT_MAX,
} from "@/lib/appointments";
import { type Appt, dateValue, timeValue } from "@/components/appointments/shared";

/**
 * The appointment form, on its own so more than one place can open it.
 *
 * It began inside the appointment book, which was fine while that was the only
 * way in. Then the calendar arrived: tapping the 14th and being offered only
 * "a class or a shower" — with the scan you were actually trying to write down
 * available nowhere on that screen — is the page knowing what you want and
 * refusing to help. Both entrances now open this same form, so there is one
 * place where an appointment is described and no second version to drift.
 */
export function AppointmentForm({
  a,
  seedKind,
  defaultDate,
  onSubmit,
  onCancel,
  submitLabel,
}: {
  a?: Appt;
  /** Chosen for her by the blank state, so only the date is left to fill in. */
  seedKind?: AppointmentKind;
  /** yyyy-mm-dd, when the form was opened from a day on the calendar. */
  defaultDate?: string | null;
  onSubmit: (fd: FormData) => void;
  onCancel: () => void;
  submitLabel: string;
}) {
  const [kind, setKind] = useState<AppointmentKind>(
    a?.kind ?? seedKind ?? "ANTENATAL",
  );

  return (
    <form action={onSubmit} className="space-y-3">
      <fieldset>
        <legend className="mb-2 font-mono text-[0.66rem] uppercase tracking-widest text-muted">
          What kind
        </legend>
        <div className="flex flex-wrap gap-2">
          {APPOINTMENT_KINDS.map((k) => (
            <label
              key={k}
              className={`cursor-pointer rounded-lg border px-3 py-1.5 font-mono text-[0.68rem] transition-colors ${
                kind === k
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border text-muted hover:text-ink"
              }`}
            >
              <input
                type="radio"
                name="kind"
                value={k}
                checked={kind === k}
                onChange={() => setKind(k)}
                className="sr-only"
              />
              {kindVoice(k).label}
            </label>
          ))}
        </div>
        <p className="mt-2 font-mono text-[0.62rem] leading-relaxed text-muted">
          {kindVoice(kind).hint}
          {kindVoice(kind).weekAhead
            ? " · you'll also be reminded a week ahead"
            : ""}
        </p>
      </fieldset>

      <div className="flex flex-wrap gap-3">
        <label className="flex-1">
          <span className="mb-1 block font-mono text-[0.66rem] uppercase tracking-widest text-muted">
            Date
          </span>
          <input
            type="date"
            name="date"
            required
            defaultValue={a ? dateValue(a.at) : (defaultDate ?? "")}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 font-mono text-sm text-ink focus:border-accent focus:outline-none"
          />
        </label>
        <label className="flex-1">
          <span className="mb-1 block font-mono text-[0.66rem] uppercase tracking-widest text-muted">
            Time (if the letter says)
          </span>
          <input
            type="time"
            name="time"
            defaultValue={a?.hasTime ? timeValue(a.at) : ""}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 font-mono text-sm text-ink focus:border-accent focus:outline-none"
          />
        </label>
      </div>

      <input
        type="text"
        name="title"
        maxLength={TITLE_MAX}
        defaultValue={a?.title ?? ""}
        placeholder="A name of its own (optional) — “20-week anomaly scan”"
        className="prose-serif-sm w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-ink placeholder:text-muted focus:border-accent focus:outline-none"
      />

      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          name="where"
          maxLength={200}
          defaultValue={a?.where ?? ""}
          placeholder="Where — hospital, clinic, ward"
          className="prose-serif-sm min-w-0 flex-1 rounded-lg border border-border bg-surface px-4 py-2.5 text-ink placeholder:text-muted focus:border-accent focus:outline-none"
        />
        <input
          type="text"
          name="who"
          maxLength={200}
          defaultValue={a?.who ?? ""}
          placeholder="Who you're seeing"
          className="prose-serif-sm min-w-0 flex-1 rounded-lg border border-border bg-surface px-4 py-2.5 text-ink placeholder:text-muted focus:border-accent focus:outline-none"
        />
      </div>

      <textarea
        name="notes"
        rows={2}
        maxLength={TEXT_MAX}
        defaultValue={a?.notes ?? ""}
        placeholder="Anything to bring, or to remember (optional)"
        className="prose-serif-sm w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-ink placeholder:text-muted focus:border-accent focus:outline-none"
      />

      <div>
        <textarea
          name="questions"
          rows={3}
          maxLength={TEXT_MAX}
          defaultValue={a?.questions ?? ""}
          placeholder="What you mean to ask — one per line"
          className="prose-serif-sm w-full rounded-lg border border-accent/30 bg-surface px-4 py-2.5 text-ink placeholder:text-muted focus:border-accent focus:outline-none"
        />
        <p className="mt-1 text-[0.62rem] leading-relaxed text-muted">
          Write them down now. Everybody forgets once they are in the room, and
          this is shown to you on the appointment the moment you open it.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="submit"
          className="rounded-lg bg-accent px-4 py-2 font-mono text-xs font-medium text-on-accent hover:bg-accent-deep"
        >
          {submitLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg px-3 py-2 font-mono text-xs text-muted hover:text-ink"
        >
          Not now
        </button>
      </div>
    </form>
  );
}
