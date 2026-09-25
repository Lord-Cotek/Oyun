"use client";

import { useMemo, useState } from "react";
import { addEvent, editEvent, removeEvent } from "@/app/appointments/event-actions";
import { addAppointment } from "@/app/appointments/actions";
import { AppointmentForm } from "@/components/appointments/AppointmentForm";
import { monthStart, ymd } from "@/lib/calendar";
import { CalendarMonth, type Marked } from "@/components/dates/CalendarMonth";
import { InvitePanel, type InviteRow } from "@/components/dates/InvitePanel";
import { ConfirmAction } from "@/components/ui/Confirm";

export type DayRow = {
  key: string;
  source: "appointment" | "event";
  sourceId: string;
  atISO: string;
  endsAtISO: string | null;
  hasTime: boolean;
  label: string;
  where: string | null;
  note: string | null;
  kind: string | null;
  editable: boolean;
  daysAway: number;
  /** Set only where somebody made this day shareable. */
  invite: InviteRow | null;
};

const inputClass =
  "w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 font-mono text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none";

const KINDS = [
  { value: "CLASS", label: "A class" },
  { value: "SHOWER", label: "A baby shower" },
  { value: "GATHERING", label: "People coming" },
  { value: "CHURCH", label: "Church" },
  { value: "CELEBRATION", label: "A celebration" },
  { value: "OTHER", label: "Something else" },
];

function dayWords(days: number): string {
  if (days < 0) return "Gone";
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  if (days < 7) return `In ${days} days`;
  if (days === 7) return "A week today";
  if (days < 14) return "Next week";
  return `In ${Math.round(days / 7)} weeks`;
}

function clockRange(atISO: string, endsAtISO: string | null): string {
  const t = (iso: string) =>
    new Date(iso).toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
    });
  return endsAtISO ? `${t(atISO)} – ${t(endsAtISO)}` : t(atISO);
}

function longDate(iso: string, hasTime: boolean, endsAtISO: string | null): string {
  const day = new Date(iso).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  });
  return hasTime ? `${day} · ${clockRange(iso, endsAtISO)}` : day;
}

function whenWords(atISO: string, hasTime: boolean, endsAtISO: string | null): string {
  const day = new Date(atISO).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
  return hasTime ? `${day}, ${clockRange(atISO, endsAtISO)}` : day;
}

function inviteSummary(i: InviteRow): string {
  if (i.options.length > 0 && !i.settled) {
    const answered = i.replies.length;
    return answered === 0
      ? `Asking which of ${i.options.length} days suits — no replies yet`
      : `Asking which of ${i.options.length} days suits — ${answered} answered`;
  }
  const coming = i.replies
    .filter((r) => r.answer === "YES")
    .reduce((n, r) => n + Math.max(1, r.partySize), 0);
  const hoping = i.replies
    .filter((r) => r.answer === "MAYBE")
    .reduce((n, r) => n + Math.max(1, r.partySize), 0);
  const head =
    i.replies.length === 0
      ? "Invitation sent — no replies yet"
      : [coming ? `${coming} coming` : null, hoping ? `${hoping} hoping to` : null]
          .filter(Boolean)
          .join(" · ") || "Replies in";
  return i.closed ? `${head} · replies closed` : head;
}

/**
 * The months, and the days on them.
 *
 * ── Why the scans and the shower share a calendar ────────────────────────
 * They are different rows for good reasons — an appointment has a midwife to
 * ask for and a list of questions; a shower has guests — but a woman looking
 * at October wants to see both at once, because the question she is asking is
 * "what is that week like", not "what kind of thing is this".
 *
 * So the grid shows everything. The clinic letters are drawn hollow and can
 * only be changed where they live, in the appointment book below; the days she
 * wrote down herself are solid, and those are the ones that can carry an
 * invitation. Nobody RSVPs to a growth scan.
 */
export function DiaryBook({ rows: days, canEdit }: { rows: DayRow[]; canEdit: boolean }) {
  /**
   * What the day panel is currently offering to add, if anything.
   *
   * ── Why this is a choice and not one button ──────────────────────────
   * The calendar shows both kinds of day, and for a while tapping one only
   * offered to add the social kind — so a woman tapping the 14th to write down
   * her scan was shown "a class, a shower, people coming" and nothing else,
   * with the appointment form sitting further down the page knowing nothing
   * about the day she had just tapped. The page could see what she wanted and
   * declined to help.
   *
   * Now the day asks which, and either answer opens the right form with that
   * date already in it.
   */
  const [adding, setAdding] = useState<null | "event" | "appointment">(null);
  const [addDate, setAddDate] = useState<string | null>(null);
  const [apptError, setApptError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [invitingId, setInvitingId] = useState<string | null>(null);
  const [month, setMonth] = useState(() => monthStart(new Date()));
  const [picked, setPicked] = useState<string | null>(() => ymd(new Date()));

  const marks = useMemo(() => {
    const m = new Map<string, Marked>();
    for (const d of days) {
      const key = d.atISO.slice(0, 10);
      const cur = m.get(key) ?? { key, own: 0, guest: 0 };
      if (d.source === "event") cur.own += 1;
      else cur.guest += 1;
      m.set(key, cur);
    }
    return m;
  }, [days]);

  const onPicked = useMemo(
    () => days.filter((d) => d.atISO.slice(0, 10) === picked),
    [days, picked],
  );
  /** The list below is about what is still to come; the grid holds the past. */
  const upcoming = useMemo(() => days.filter((d) => d.daysAway >= 0), [days]);
  const mine = useMemo(() => upcoming.filter((d) => d.source === "event"), [upcoming]);

  return (
    <div>
      <CalendarMonth
        month={month}
        onMonthChange={(next) => {
          setMonth(next);
          setAdding(null);
        }}
        marks={marks}
        selected={picked}
        onSelect={(key) => {
          setPicked(key);
          setAdding(null);
          setEditingId(null);
        }}
      />

      {picked && (
        <div className="mt-5 rounded-xl border border-border bg-bg/40 p-4">
          <p className="font-serif text-lg text-ink">
            {new Date(`${picked}T00:00:00.000Z`).toLocaleDateString("en-GB", {
              weekday: "long",
              day: "numeric",
              month: "long",
              timeZone: "UTC",
            })}
          </p>

          {onPicked.length === 0 ? (
            <p className="mt-1 prose-serif-xs text-muted">Nothing on this day.</p>
          ) : (
            <ul className="mt-2 space-y-1.5">
              {onPicked.map((d) => (
                <li key={d.key} className="flex flex-wrap items-baseline gap-x-2">
                  <span
                    className={`font-serif text-base ${d.source === "event" ? "text-ink" : "text-muted"}`}
                  >
                    {d.label}
                  </span>
                  {d.hasTime && (
                    <span className="font-mono text-[0.66rem] text-accent">
                      {clockRange(d.atISO, d.endsAtISO)}
                    </span>
                  )}
                  {d.where && (
                    <span className="font-mono text-[0.66rem] text-muted">
                      {d.where}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}

          {canEdit && !adding && (
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setAddDate(picked);
                  setAdding("appointment");
                  setEditingId(null);
                }}
                className="rounded-lg border border-border px-3 py-2 font-mono text-[0.68rem] text-ink transition-colors hover:border-accent hover:text-accent"
              >
                + An appointment
              </button>
              <button
                type="button"
                onClick={() => {
                  setAddDate(picked);
                  setAdding("event");
                  setEditingId(null);
                }}
                className="rounded-lg border border-border px-3 py-2 font-mono text-[0.68rem] text-ink transition-colors hover:border-accent hover:text-accent"
              >
                + A day of your own
              </button>
            </div>
          )}

          {canEdit && adding === "appointment" && (
            <div className="mt-4 rounded-xl border border-accent/30 bg-accent/[0.05] p-4">
              <p className="mb-3 font-mono text-[0.6rem] uppercase tracking-widest text-muted">
                A scan, a check, a clinic
              </p>
              {apptError && (
                <p className="mb-2 font-mono text-xs text-negative">{apptError}</p>
              )}
              <AppointmentForm
                defaultDate={addDate}
                onSubmit={async (fd) => {
                  const res = await addAppointment(fd);
                  if (res.ok) {
                    setAdding(null);
                    setApptError(null);
                  } else {
                    setApptError(res.error ?? "That didn't work.");
                  }
                }}
                onCancel={() => {
                  setAdding(null);
                  setApptError(null);
                }}
                submitLabel="Keep this date"
              />
            </div>
          )}

          {canEdit && adding === "event" && (
            <div className="mt-4 rounded-xl border border-accent/30 bg-accent/[0.05] p-4">
              <p className="mb-3 font-mono text-[0.6rem] uppercase tracking-widest text-muted">
                A class, a shower, people coming
              </p>
              <EventForm
                onDone={() => setAdding(null)}
                defaultDate={addDate}
                submitLabel="Put it in the diary"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}


function EventForm({
  day,
  onDone,
  submitLabel,
  defaultDate,
}: {
  day?: DayRow;
  onDone: () => void;
  submitLabel: string;
  /** yyyy-mm-dd, when the form was opened from a day on the calendar. */
  defaultDate?: string | null;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const at = day ? new Date(day.atISO) : null;

  return (
    <form
      action={async (fd) => {
        setBusy(true);
        setError(null);
        const res = day ? await editEvent(fd) : await addEvent(fd);
        setBusy(false);
        if (res.ok) onDone();
        else setError(res.error);
      }}
      className="space-y-3"
    >
      {day && <input type="hidden" name="id" value={day.sourceId} />}

      <input
        name="title"
        required
        maxLength={120}
        defaultValue={day?.label ?? ""}
        placeholder="Baby shower at Ifeoma's"
        className={inputClass}
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <label className="block">
          <span className="mb-1.5 block font-mono text-[0.6rem] uppercase tracking-widest text-muted">
            The day
          </span>
          <input
            type="date"
            name="date"
            required
            defaultValue={at ? at.toISOString().slice(0, 10) : (defaultDate ?? "")}
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block font-mono text-[0.6rem] uppercase tracking-widest text-muted">
            From (blank if none)
          </span>
          <input
            type="time"
            name="time"
            defaultValue={at && day?.hasTime ? at.toISOString().slice(11, 16) : ""}
            className={inputClass}
          />
        </label>
        {/* An end matters most for the thing you are inviting people to: it is
            what makes the entry in their own calendar the right length, rather
            than a two-hour guess. */}
        <label className="block">
          <span className="mb-1.5 block font-mono text-[0.6rem] uppercase tracking-widest text-muted">
            Until (optional)
          </span>
          <input
            type="time"
            name="endTime"
            defaultValue={day?.endsAtISO ? day.endsAtISO.slice(11, 16) : ""}
            className={inputClass}
          />
        </label>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block font-mono text-[0.6rem] uppercase tracking-widest text-muted">
            What kind of day
          </span>
          <select
            name="kind"
            defaultValue={day?.kind ?? "GATHERING"}
            className={inputClass}
          >
            {KINDS.map((k) => (
              <option key={k.value} value={k.value}>
                {k.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block font-mono text-[0.6rem] uppercase tracking-widest text-muted">
            Where
          </span>
          <input
            name="where"
            defaultValue={day?.where ?? ""}
            placeholder="Ifeoma's flat"
            className={inputClass}
          />
        </label>
      </div>

      <textarea
        name="note"
        rows={2}
        defaultValue={day?.note ?? ""}
        placeholder="Anything worth remembering about the day"
        className={inputClass}
      />

      {error && <p className="font-mono text-xs text-negative">{error}</p>}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={busy}
          className="rounded-lg bg-accent px-4 py-2 font-mono text-sm font-medium text-on-accent transition-colors hover:bg-accent-deep disabled:opacity-50"
        >
          {busy ? "Saving…" : submitLabel}
        </button>
        <button
          type="button"
          onClick={onDone}
          className="font-mono text-xs text-muted hover:text-ink"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

/**
 * The days she arranged herself, apart from the ones she was called to.
 *
 * On its own card, and named to match the button that makes one, because the
 * two kinds of day really are different things and a page that mixed them into
 * one list made people ask which was which. The calendar above still shows
 * both — that is the whole point of a calendar — but here they are separated,
 * and only these can carry an invitation.
 */
export function OwnDays({ days, canEdit }: { days: DayRow[]; canEdit: boolean }) {
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [invitingId, setInvitingId] = useState<string | null>(null);

  const mine = useMemo(
    () => days.filter((d) => d.source === "event" && d.daysAway >= 0),
    [days],
  );

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-serif text-2xl text-ink">Days of your own</h2>
        {!adding && canEdit && (
          <button
            type="button"
            onClick={() => {
              setAdding(true);
              setEditingId(null);
            }}
            className="shrink-0 rounded-lg border border-border px-3 py-2 font-mono text-xs text-ink transition-colors hover:border-accent hover:text-accent"
          >
            Add a day
          </button>
        )}
      </div>
      <p className="prose-serif-xs mt-1.5 text-muted">
        A class, a shower, a morning with the other mothers — the days you
        arrange rather than the ones you are called to. These are the ones you
        can send a link to.
      </p>

      {adding && (
        <div className="mt-5 rounded-xl border border-accent/30 bg-accent/[0.05] p-5">
          <EventForm
            onDone={() => setAdding(false)}
            defaultDate={null}
            submitLabel="Put it in the diary"
          />
        </div>
      )}

      {mine.length === 0 ? (
        <p className="mt-5 prose-serif-sm text-muted">
          Nothing yet. A class, a shower, a morning with the other mothers — put
          it here and you can send a link to whoever you want at it.
        </p>
      ) : (
        <ul className="mt-5 space-y-3">
          {mine.map((d) => (
            <li
              key={d.key}
              id={`day-${d.sourceId}`}
              className="notif-target rounded-xl border border-border bg-bg/40 p-4"
            >
              {editingId === d.sourceId ? (
                <EventForm
                  day={d}
                  onDone={() => setEditingId(null)}
                  submitLabel="Save the change"
                />
              ) : (
                <>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                    <p
                      className={`font-mono text-xs ${d.daysAway <= 1 ? "text-accent" : "text-muted"}`}
                    >
                      {dayWords(d.daysAway)}
                    </p>
                    <p className="font-mono text-[0.66rem] text-muted">
                      {longDate(d.atISO, d.hasTime, d.endsAtISO)}
                    </p>
                  </div>
                  <p className="mt-1 font-serif text-xl leading-snug text-ink">
                    {d.label}
                  </p>
                  {d.where && (
                    <p className="mt-0.5 font-mono text-[0.7rem] text-muted">
                      {d.where}
                    </p>
                  )}
                  {d.note && (
                    <p className="mt-2 whitespace-pre-wrap prose-serif-xs text-muted">
                      {d.note}
                    </p>
                  )}

                  {d.invite && !d.invite.revoked && (
                    <p className="mt-1.5 font-mono text-[0.66rem] text-accent">
                      {inviteSummary(d.invite)}
                    </p>
                  )}

                  {canEdit && (
                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(d.sourceId);
                          setAdding(false);
                        }}
                        className="font-mono text-[0.68rem] text-accent underline underline-offset-4"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setInvitingId(invitingId === d.sourceId ? null : d.sourceId)
                        }
                        aria-expanded={invitingId === d.sourceId}
                        className="font-mono text-[0.68rem] text-accent underline underline-offset-4"
                      >
                        {d.invite ? "Invitation" : "Invite people"}
                      </button>
                      {/* Was a bare submit. This takes the day, its
                          invitation and every reply already given. */}
                      <ConfirmAction
                        action={removeEvent}
                        fields={{ id: d.sourceId }}
                        describe={`${d.label} from the diary`}
                        dialog={{
                          title: `Remove “${d.label}”?`,
                          body: d.invite
                            ? "The invitation goes with it, and so does every reply already given. Anyone holding the link will find it gone. This cannot be undone."
                            : "This cannot be undone.",
                          confirmWord: "Remove the day",
                        }}
                        className="font-mono text-[0.68rem] text-muted underline underline-offset-4 hover:text-ink"
                      />
                    </div>
                  )}

                  {invitingId === d.sourceId && canEdit && (
                    <InvitePanel
                      eventId={d.sourceId}
                      title={d.label}
                      when={whenWords(d.atISO, d.hasTime, d.endsAtISO)}
                      where={d.where}
                      invite={d.invite}
                    />
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
