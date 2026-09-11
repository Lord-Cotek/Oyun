"use client";

import { useState, useTransition } from "react";
import { type AppointmentKind } from "@prisma/client";
import {
  kindVoice,
  APPOINTMENT_KINDS,
  appointmentTitle,
  dayLabel,
  timeLabel,
  daysUntil,
  TITLE_MAX,
  TEXT_MAX,
} from "@/lib/appointments";
import {
  addAppointment,
  editAppointment,
  markAttended,
  reopenAppointment,
  cancelAppointment,
  deleteAppointment,
  askCircleToPray,
} from "@/app/appointments/actions";

/** Mirrors AppointmentView in lib/appointments-db.ts, declared here so this
 *  client component never reaches into a module that opens the database. */
type Appt = {
  id: string;
  kind: AppointmentKind;
  title: string | null;
  at: Date;
  hasTime: boolean;
  where: string | null;
  who: string | null;
  notes: string | null;
  questions: string | null;
  attendedAt: Date | null;
  outcome: string | null;
  cancelledAt: Date | null;
  addedBy: string | null;
  mine: boolean;
};
type Res = { ok: boolean; error?: string };

const TONE: Record<string, string> = {
  amber: "border-tone-amber/40 bg-tone-amber/[0.06] text-tone-amber",
  rose: "border-tone-rose/40 bg-tone-rose/[0.06] text-tone-rose",
  sky: "border-tone-sky/40 bg-tone-sky/[0.06] text-tone-sky",
  gold: "border-tone-gold/40 bg-tone-gold/[0.06] text-tone-gold",
  green: "border-tone-green/40 bg-tone-green/[0.06] text-tone-green",
  plum: "border-tone-plum/40 bg-tone-plum/[0.06] text-tone-plum",
};

/** yyyy-mm-dd / hh:mm from a stored instant, for putting back in the form. */
function dateValue(d: Date): string {
  return new Date(d).toISOString().slice(0, 10);
}
function timeValue(d: Date): string {
  return new Date(d).toISOString().slice(11, 16);
}

export function AppointmentBook({
  upcoming,
  past,
}: {
  upcoming: Appt[];
  past: Appt[];
}) {
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, start] = useTransition();

  const run = (fn: () => Promise<Res>) =>
    start(async () => {
      const res = await fn();
      setError(res.ok ? null : (res.error ?? "That didn’t work."));
      if (res.ok) setAdding(false);
    });

  return (
    <div className="space-y-8">
      {error && (
        <p className="font-mono text-xs leading-relaxed text-negative">{error}</p>
      )}

      <div>
        {adding ? (
          <Form
            onSubmit={(fd) => run(() => addAppointment(fd))}
            onCancel={() => setAdding(false)}
            submitLabel="Keep this date"
          />
        ) : (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="rounded-lg bg-accent px-4 py-2 font-mono text-xs font-medium text-on-accent hover:bg-accent-deep"
          >
            + Add an appointment
          </button>
        )}
      </div>

      <section>
        <p className="mb-3 font-mono text-[0.6rem] uppercase tracking-widest text-muted">
          Coming up
        </p>
        {upcoming.length === 0 ? (
          <p className="max-w-prose font-mono text-xs leading-relaxed text-muted">
            Nothing in the book. Put the next one in as soon as the letter
            arrives — you will be reminded the day before, and on the morning
            itself if there is a time on it.
          </p>
        ) : (
          <ul className="space-y-3">
            {upcoming.map((a) => (
              <Row key={a.id} a={a} run={run} />
            ))}
          </ul>
        )}
      </section>

      {past.length > 0 && (
        <section>
          <p className="mb-3 font-mono text-[0.6rem] uppercase tracking-widest text-muted">
            Been and gone
          </p>
          <ul className="space-y-3">
            {past.map((a) => (
              <Row key={a.id} a={a} run={run} past />
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function Row({
  a,
  run,
  past = false,
}: {
  a: Appt;
  run: (fn: () => Promise<Res>) => void;
  past?: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [closing, setClosing] = useState(false);
  const [outcome, setOutcome] = useState("");
  const voice = kindVoice(a.kind);
  const at = new Date(a.at);
  const days = daysUntil(at, new Date());
  const time = timeLabel(at, a.hasTime);
  const soon = !past && days >= 0 && days <= 2;

  if (editing) {
    return (
      <li id={`appt-${a.id}`} className="rounded-xl border border-border bg-bg p-4">
        <Form
          a={a}
          onSubmit={(fd) =>
            run(async () => {
              const res = await editAppointment(a.id, fd);
              if (res.ok) setEditing(false);
              return res;
            })
          }
          onCancel={() => setEditing(false)}
          submitLabel="Save the change"
        />
      </li>
    );
  }

  return (
    <li
      id={`appt-${a.id}`}
      className={`rounded-xl border p-4 ${
        soon
          ? "border-accent/45 bg-accent/[0.05]"
          : a.cancelledAt
            ? "border-border bg-bg/50"
            : "border-border bg-bg"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <span
            className={`inline-block rounded-md border px-2 py-0.5 font-mono text-[0.58rem] uppercase tracking-widest ${TONE[voice.tone]}`}
          >
            {voice.label}
          </span>
          <p className="mt-2 font-serif text-lg leading-snug text-ink">
            {appointmentTitle(a.kind, a.title)}
          </p>
          <p className="mt-0.5 font-mono text-xs text-muted">
            <span className={soon ? "text-accent" : ""}>
              {dayLabel(at)}
              {time ? ` at ${time}` : ""}
            </span>
            {!a.hasTime && !past && (
              <span className="text-muted"> · no time given</span>
            )}
            {a.where && ` · ${a.where}`}
            {a.who && ` · ${a.who}`}
          </p>
        </div>

        {a.attendedAt && (
          <span className="font-mono text-[0.58rem] uppercase tracking-widest text-positive">
            Attended
          </span>
        )}
        {a.cancelledAt && (
          <span className="font-mono text-[0.58rem] uppercase tracking-widest text-muted">
            Cancelled
          </span>
        )}
      </div>

      {a.notes && (
        <p className="mt-2 whitespace-pre-wrap font-mono text-xs leading-relaxed text-muted">
          {a.notes}
        </p>
      )}

      {/* The things you mean to ask and forget the moment you sit down. */}
      {a.questions && (
        <div className="mt-3 rounded-lg border-l-2 border-accent/40 bg-surface px-3 py-2.5">
          <p className="font-mono text-[0.58rem] uppercase tracking-widest text-accent">
            To ask
          </p>
          <p className="mt-1 whitespace-pre-wrap font-mono text-xs leading-relaxed text-ink">
            {a.questions}
          </p>
        </div>
      )}

      {a.outcome && (
        <p className="mt-3 border-l-2 border-positive/40 pl-3 font-serif text-sm italic leading-relaxed text-ink/90">
          {a.outcome}
        </p>
      )}

      {closing ? (
        <div className="mt-3 rounded-lg border border-border bg-surface p-3">
          <p className="mb-2 font-mono text-[0.66rem] leading-relaxed text-muted">
            What came of it? Worth a line while it is fresh — a measurement, a
            word from the midwife, a relief.
          </p>
          <textarea
            rows={3}
            value={outcome}
            maxLength={TEXT_MAX}
            onChange={(e) => setOutcome(e.target.value)}
            placeholder="Optional"
            className="w-full rounded-lg border border-border bg-bg px-3 py-2 font-mono text-xs text-ink placeholder:text-muted focus:border-accent focus:outline-none"
          />
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                const o = outcome;
                setClosing(false);
                setOutcome("");
                run(() => markAttended(a.id, o));
              }}
              className="rounded-lg bg-accent px-3 py-1.5 font-mono text-[0.66rem] font-medium text-on-accent hover:bg-accent-deep"
            >
              We went
            </button>
            <button
              type="button"
              onClick={() => setClosing(false)}
              className="rounded-lg px-3 py-1.5 font-mono text-[0.66rem] text-muted hover:text-ink"
            >
              Back
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-border pt-3">
          {!a.attendedAt && !a.cancelledAt && (
            <>
              <button
                type="button"
                onClick={() => setClosing(true)}
                className="font-mono text-[0.62rem] uppercase tracking-widest text-muted hover:text-positive"
              >
                We went
              </button>
              <button
                type="button"
                onClick={() => run(() => askCircleToPray(a.id))}
                className="font-mono text-[0.62rem] uppercase tracking-widest text-muted hover:text-accent"
              >
                Ask the circle to pray
              </button>
            </>
          )}
          {(a.attendedAt || a.cancelledAt) && (
            <button
              type="button"
              onClick={() => run(() => reopenAppointment(a.id))}
              className="font-mono text-[0.62rem] uppercase tracking-widest text-muted hover:text-accent"
            >
              Put it back
            </button>
          )}
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="font-mono text-[0.62rem] uppercase tracking-widest text-muted hover:text-ink"
          >
            Edit
          </button>
          {!a.attendedAt && !a.cancelledAt && (
            <button
              type="button"
              onClick={() => run(() => cancelAppointment(a.id))}
              className="font-mono text-[0.62rem] uppercase tracking-widest text-muted hover:text-accent2"
            >
              Cancelled
            </button>
          )}
          <button
            type="button"
            onClick={() => run(() => deleteAppointment(a.id))}
            className="ml-auto font-mono text-[0.62rem] uppercase tracking-widest text-muted hover:text-negative"
          >
            Remove
          </button>
        </div>
      )}
    </li>
  );
}

function Form({
  a,
  onSubmit,
  onCancel,
  submitLabel,
}: {
  a?: Appt;
  onSubmit: (fd: FormData) => void;
  onCancel: () => void;
  submitLabel: string;
}) {
  const [kind, setKind] = useState<AppointmentKind>(a?.kind ?? "ANTENATAL");

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
            defaultValue={a ? dateValue(a.at) : ""}
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
        className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 font-mono text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none"
      />

      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          name="where"
          maxLength={200}
          defaultValue={a?.where ?? ""}
          placeholder="Where — hospital, clinic, ward"
          className="min-w-0 flex-1 rounded-lg border border-border bg-surface px-4 py-2.5 font-mono text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none"
        />
        <input
          type="text"
          name="who"
          maxLength={200}
          defaultValue={a?.who ?? ""}
          placeholder="Who you're seeing"
          className="min-w-0 flex-1 rounded-lg border border-border bg-surface px-4 py-2.5 font-mono text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none"
        />
      </div>

      <textarea
        name="notes"
        rows={2}
        maxLength={TEXT_MAX}
        defaultValue={a?.notes ?? ""}
        placeholder="Anything to bring, or to remember (optional)"
        className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 font-mono text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none"
      />

      <div>
        <textarea
          name="questions"
          rows={3}
          maxLength={TEXT_MAX}
          defaultValue={a?.questions ?? ""}
          placeholder="What you mean to ask — one per line"
          className="w-full rounded-lg border border-accent/30 bg-surface px-4 py-2.5 font-mono text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none"
        />
        <p className="mt-1 font-mono text-[0.62rem] leading-relaxed text-muted">
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
