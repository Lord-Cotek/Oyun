"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { HealthPhotoPicker } from "@/components/health/HealthPhotoPicker";
import { addCheck, deleteCheck, hideCheck, saveCheck, setCondition, setOnList } from "@/app/health/tests/actions";
import type { CheckView } from "@/lib/prenatal-db";
import type { Status } from "@/lib/prenatal";

const inputCls = "w-full rounded-lg border border-border bg-bg px-3 py-2.5 font-mono text-sm text-ink";
const lab = "mb-1.5 block font-mono text-[0.62rem] uppercase tracking-widest text-muted";

const GROUPS: { status: Status; title: string }[] = [
  { status: "due", title: "Due around now" },
  { status: "upcoming", title: "Coming up" },
  { status: "anytime", title: "Any time" },
  { status: "past", title: "Past the usual window — worth asking your clinic" },
  { status: "done", title: "Done" },
];

/**
 * The tests and vaccines checklist. One full list of what is usually offered
 * somewhere in the world — no country to pick. The family chooses what is on
 * theirs (all at once, or "not doing this" one at a time), turns on the
 * checks that apply to them and adds what their clinic does. Each item, when
 * done, keeps its date, result and the report itself.
 */
export function TestsHome({
  journeyId,
  touched,
  stageLabel,
  everyVisit,
  facts,
  conditionals,
  items,
  hidden,
  appointments,
}: {
  journeyId: string;
  touched: boolean;
  stageLabel: string;
  everyVisit: string;
  facts: { rhNegative: boolean; bothCarriers: boolean };
  conditionals: { key: string; label: string; note: string; on: boolean }[];
  items: CheckView[];
  hidden: CheckView[];
  appointments: { id: string; label: string }[];
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [editing, setEditing] = useState<CheckView | null>(null);
  const [adding, setAdding] = useState(false);
  const run = (fn: () => Promise<unknown>) => start(async () => { await fn(); router.refresh(); });

  return (
    <div className={`mt-6 space-y-6 ${pending ? "opacity-70" : ""}`}>
      <section className="rounded-2xl border border-border bg-surface p-5">
        <p className="eyebrow text-accent">Typical schedule — your clinic&rsquo;s may differ</p>
        <p className="mt-1 prose-serif-xs text-muted">
          Everything commonly offered in pregnancy, wherever you are. Some tests are offered almost everywhere, some only in some places — each one says. Keep the ones that are part of your care, mark the rest &ldquo;not doing this&rdquo;, and add anything your clinic does that is missing. {stageLabel}
        </p>
        <p className="mt-3 font-mono text-[0.66rem] text-muted">{everyVisit}</p>
        {(facts.rhNegative || facts.bothCarriers) && (
          <p className="mt-2 prose-serif-xs text-ink">
            From your health cards:
            {facts.rhNegative && " anti-D is on the list because you are rhesus negative."}
            {facts.bothCarriers && " a talk about the baby's genotype is on the list because you both carry a sickle cell gene."}
          </p>
        )}
      </section>

      <Chooser all={[...items, ...hidden].filter((i) => !i.custom)} open={!touched} />

      {GROUPS.map((g) => {
        const list = items.filter((i) => i.status === g.status);
        if (!list.length) return null;
        const rows = (
          <ul className="space-y-2">
            {list.map((i) => (
              <Item key={i.key ?? i.id} i={i} onEdit={() => setEditing(i)} onHide={() => run(() => hideCheck(i.key, i.id, true))} onRemove={() => run(() => deleteCheck(i.id!))} onDone={() => run(() => saveCheck({ key: i.key, id: i.id, done: true }))} />
            ))}
          </ul>
        );
        // Earlier checks fold away: a family starting at 28 weeks should not
        // open the page to a wall of booking tests. One line, and the count.
        if (g.status === "past") {
          return (
            <details key={g.status} className="rounded-2xl border border-border bg-surface p-4">
              <summary className="cursor-pointer prose-serif-sm text-ink">
                {list.length} earlier {list.length === 1 ? "check" : "checks"} not marked done
                <span className="block font-mono text-[0.62rem] text-muted">Open to add the ones you have had, with their dates — or ask your clinic about any you have not.</span>
              </summary>
              <div className="mt-3">{rows}</div>
            </details>
          );
        }
        return (
          <section key={g.status}>
            <p className={`eyebrow mb-2 ${g.status === "due" ? "text-accent" : "text-muted"}`}>{g.title}</p>
            {rows}
          </section>
        );
      })}

      <section className="rounded-2xl border border-border bg-surface p-5">
        <p className="eyebrow mb-2 text-muted">If these apply to you</p>
        <ul className="space-y-2">
          {conditionals.map((c) => (
            <li key={c.key}>
              <ConditionToggle c={c} />
            </li>
          ))}
        </ul>
      </section>

      <section>
        {adding ? (
          <form
            className="space-y-3 rounded-2xl border border-border bg-surface p-5"
            action={(fd) => run(async () => { const r = await addCheck({ title: String(fd.get("title") ?? ""), weekFrom: String(fd.get("weekFrom") ?? ""), weekTo: String(fd.get("weekTo") ?? ""), notes: String(fd.get("notes") ?? "") }); if (r.ok) setAdding(false); })}
          >
            <label className="block">
              <span className={lab}>What is it?</span>
              <input id="tc-title" name="title" required placeholder="e.g. Vitamin D level" className={inputCls} />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className={lab}>From week</span>
                <input id="tc-from" name="weekFrom" inputMode="numeric" className={inputCls} />
              </label>
              <label className="block">
                <span className={lab}>To week</span>
                <input id="tc-to" name="weekTo" inputMode="numeric" className={inputCls} />
              </label>
            </div>
            <label className="block">
              <span className={lab}>Notes</span>
              <input id="tc-notes" name="notes" className={inputCls} />
            </label>
            <div className="flex gap-2">
              <button type="submit" className="min-h-11 rounded-lg bg-accent px-4 font-mono text-xs text-on-accent">Add it</button>
              <button type="button" onClick={() => setAdding(false)} className="min-h-11 px-3 font-mono text-xs text-muted">Cancel</button>
            </div>
          </form>
        ) : (
          <button type="button" onClick={() => setAdding(true)} className="min-h-11 rounded-lg border border-dashed border-border px-4 font-mono text-xs text-muted hover:border-accent hover:text-accent">
            + Add a test your clinic does
          </button>
        )}
      </section>

      {hidden.length > 0 && (
        <details className="rounded-2xl border border-border bg-surface p-5">
          <summary className="cursor-pointer font-serif text-lg text-ink">
            Not doing ({hidden.length})
            <span className="block font-mono text-[0.62rem] text-muted">Not part of your care, not offered, or you chose not to. Put any back at any time.</span>
          </summary>
          <ul className="mt-3 space-y-1">
            {hidden.map((i) => (
              <li key={i.key ?? i.id} className="flex items-center justify-between gap-3">
                <span className="prose-serif-xs text-muted">
                  {i.title}
                  {i.doneOn ? ` · done ${i.doneOn}` : ""}
                </span>
                <button type="button" onClick={() => run(() => hideCheck(i.key, i.id, false))} className="min-h-9 shrink-0 font-mono text-[0.66rem] text-accent">
                  Put it back
                </button>
              </li>
            ))}
          </ul>
        </details>
      )}

      {editing && <CheckSheet journeyId={journeyId} i={editing} appointments={appointments} onClose={() => setEditing(null)} />}
    </div>
  );
}

const CATEGORY: Record<string, string> = {
  BOOKING: "First visit (booking)",
  BLOOD: "Blood tests",
  SCAN: "Scans",
  SCREEN: "Screening",
  VACCINE: "Vaccines",
  MEDICINE: "Given at the clinic",
  SWAB: "Swabs",
  VISIT: "Visits",
};

/**
 * The whole list on one screen, a tick for each: ticked is on her list,
 * unticked is "not doing this". Opens by itself the first time, so a family
 * starts by choosing rather than by scrolling past tests that are not theirs.
 * Only what changed is saved; an unticked item keeps anything already
 * recorded against it.
 */
function Chooser({ all, open }: { all: CheckView[]; open: boolean }) {
  const router = useRouter();
  const id = (i: CheckView) => i.key ?? i.id ?? i.title;
  const initial = () => Object.fromEntries(all.map((i) => [id(i), !i.hidden]));
  const [on, setOn] = useState<Record<string, boolean>>(initial);
  // Open by itself only on the first visit; after that the family decides.
  const [startOpen] = useState(open);
  // When the list changes underneath (an item marked "not doing this" or put
  // back elsewhere on the page), start again from what is saved.
  const sig = all.map((i) => `${id(i)}:${i.hidden ? 0 : 1}`).join("|");
  useEffect(() => {
    setOn(Object.fromEntries(all.map((i) => [id(i), !i.hidden])));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sig]);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const changed = all.filter((i) => (on[id(i)] ?? !i.hidden) === i.hidden);
  const cats = Object.keys(CATEGORY).filter((c) => all.some((i) => i.category === c));
  const sorted = (xs: CheckView[]) => xs.slice().sort((x, y) => (x.weeks ?? x.afterBirth ?? [99])[0] - (y.weeks ?? y.afterBirth ?? [99])[0]);
  return (
    <details open={startOpen} className="rounded-2xl border border-border bg-surface p-5">
      <summary className="cursor-pointer font-serif text-lg text-ink">
        Choose your list
        <span className="block font-mono text-[0.62rem] text-muted">
          {all.filter((i) => !i.hidden).length} of {all.length} on your list · tick what is part of your care, untick what is not
        </span>
      </summary>
      <div className="mt-4 space-y-5">
        <div className="flex flex-wrap gap-2 font-mono text-[0.66rem]">
          <button type="button" onClick={() => setOn(Object.fromEntries(all.map((i) => [id(i), true])))} className="min-h-9 rounded-full border border-border px-3 text-muted hover:border-accent">
            Tick all
          </button>
          <button type="button" onClick={() => setOn(Object.fromEntries(all.map((i) => [id(i), !i.optional])))} className="min-h-9 rounded-full border border-border px-3 text-muted hover:border-accent">
            Untick the optional ones
          </button>
        </div>
        {cats.map((c) => (
          <fieldset key={c}>
            <legend className="eyebrow mb-1.5 text-muted">{CATEGORY[c]}</legend>
            <ul className="space-y-0.5">
              {sorted(all.filter((i) => i.category === c)).map((i) => (
                <li key={id(i)}>
                  <label className="flex min-h-11 cursor-pointer items-start gap-3 py-1">
                    <input
                      type="checkbox"
                      checked={on[id(i)] ?? !i.hidden}
                      onChange={(e) => { setSaved(false); setOn((m) => ({ ...m, [id(i)]: e.target.checked })); }}
                      className="mt-1 h-4 w-4 shrink-0 accent-[var(--accent)]"
                    />
                    <span className="min-w-0 prose-serif-xs text-ink">
                      {i.title}
                      {i.doneOn && <span className="text-positive"> · done</span>}
                      <span className="block font-mono text-[0.6rem] text-muted">
                        {i.label}
                        {i.optional ? " · optional" : ""}
                        {i.note ? ` · ${i.note}` : ""}
                      </span>
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </fieldset>
        ))}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            disabled={pending || !changed.length}
            onClick={() =>
              start(async () => {
                setError(null);
                const r = await setOnList(changed.map((i) => ({ key: i.key, id: i.id, on: !!on[id(i)] })));
                if (!r.ok) return setError(r.error);
                setSaved(true);
                router.refresh();
              })
            }
            className="min-h-11 rounded-lg bg-accent px-4 font-mono text-xs font-medium text-on-accent disabled:opacity-50"
          >
            {pending ? "Saving…" : changed.length ? `Save my list (${changed.length} ${changed.length === 1 ? "change" : "changes"})` : "Save my list"}
          </button>
          {saved && !changed.length && <span className="font-mono text-[0.66rem] text-positive" role="status">Saved.</span>}
          {error && <span role="alert" className="font-mono text-xs text-negative">{error}</span>}
        </div>
      </div>
    </details>
  );
}

/** One optional group of checks — answers the tap at once, then saves. */
function ConditionToggle({ c }: { c: { key: string; label: string; note: string; on: boolean } }) {
  const router = useRouter();
  const [on, setOn] = useState(c.on);
  const [, start] = useTransition();
  return (
    <label className="flex min-h-11 cursor-pointer items-start gap-3">
      <input
        type="checkbox"
        checked={on}
        onChange={(e) => {
          const next = e.target.checked;
          setOn(next);
          start(async () => {
            const r = await setCondition(c.key, next);
            if (!r.ok) setOn(!next);
            router.refresh();
          });
        }}
        className="mt-1 h-4 w-4 accent-[var(--accent)]"
      />
      <span className="prose-serif-xs text-ink">
        {c.label}
        <span className="block text-muted">{c.note}</span>
      </span>
    </label>
  );
}

function Item({ i, onEdit, onHide, onRemove, onDone }: { i: CheckView; onEdit: () => void; onHide: () => void; onRemove: () => void; onDone: () => void }) {
  const done = i.status === "done";
  return (
    <li className={`rounded-xl border p-3.5 ${i.status === "due" ? "border-accent/50 bg-accent/[0.04]" : "border-border bg-surface"}`}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p className={`font-serif text-base ${done ? "text-muted" : "text-ink"}`}>
            {done && <span className="mr-1 text-positive" aria-label="done">✓</span>}
            {i.title}
          </p>
          <p className="font-mono text-[0.62rem] text-muted">
            {i.label}
            {i.optional ? " · optional" : ""}
            {i.custom ? " · added by you" : ""}
          </p>
          {i.note && !done && <p className="mt-0.5 prose-serif-xs text-muted">{i.note}</p>}
          {done && (
            <p className="mt-1 font-mono text-[0.66rem] text-ink">
              Done {i.doneOn}
              {i.resultValue ? ` · ${i.resultValue}` : ""}
              {i.appointment ? ` · ${i.appointment.label}` : ""}
            </p>
          )}
          {i.result && <p className="mt-0.5 whitespace-pre-wrap prose-serif-xs text-ink">{i.result}</p>}
          {i.notes && <p className="mt-0.5 prose-serif-xs text-muted">{i.notes}</p>}
          {i.files.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {i.files.map((f) => (
                <a key={f.id} href={`/api/health/file/${f.id}`} target="_blank" rel="noopener noreferrer" className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg border border-border font-mono text-[0.6rem] text-accent">
                  {f.contentType === "application/pdf" ? (
                    "PDF"
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={`/api/health/file/${f.id}`} alt="" className="h-full w-full object-cover" />
                  )}
                </a>
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {/* "Done today" only where today is likely; an earlier check opens
              the sheet so its real date is recorded, not today's. */}
          {!done && i.status !== "past" && (
            <button type="button" onClick={onDone} className="min-h-10 rounded-lg bg-accent px-3 font-mono text-[0.68rem] text-on-accent">
              Done today
            </button>
          )}
          <button type="button" onClick={onEdit} className={`min-h-10 rounded-lg px-3 font-mono text-[0.68rem] ${!done && i.status === "past" ? "bg-accent text-on-accent" : "border border-border text-ink"}`}>
            {done ? "Edit" : i.status === "past" ? "Mark done…" : "Add result…"}
          </button>
        </div>
      </div>
      <div className="mt-1 font-mono text-[0.62rem] text-muted">
        {i.custom ? (
          <button type="button" onClick={onRemove} className="min-h-9 hover:text-negative">Remove</button>
        ) : (
          <button type="button" onClick={onHide} className="min-h-9 hover:text-accent">Not doing this</button>
        )}
      </div>
    </li>
  );
}

function CheckSheet({ journeyId, i, appointments, onClose }: { journeyId: string; i: CheckView; appointments: { id: string; label: string }[]; onClose: () => void }) {
  const router = useRouter();
  const [done, setDone] = useState(true);
  const [files, setFiles] = useState({ fileIds: [] as string[], removeFileIds: [] as string[], uploading: false });
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center" role="dialog" aria-modal="true" aria-label={i.title}>
      <div className="max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-border bg-surface p-5 pb-8 shadow-2xl sm:rounded-3xl">
        <div className="flex items-center justify-between gap-3">
          <p className="font-serif text-xl text-ink">{i.title}</p>
          <button type="button" onClick={onClose} className="min-h-11 px-3 font-mono text-xs text-muted">Close</button>
        </div>
        <form
          className="mt-4 space-y-4"
          action={(fd) =>
            start(async () => {
              const r = await saveCheck({
                key: i.key,
                id: i.id,
                done,
                doneOn: String(fd.get("doneOn") ?? ""),
                result: String(fd.get("result") ?? ""),
                resultValue: String(fd.get("resultValue") ?? ""),
                appointmentId: String(fd.get("appointmentId") ?? ""),
                title: String(fd.get("title") ?? ""),
                weekFrom: String(fd.get("weekFrom") ?? ""),
                weekTo: String(fd.get("weekTo") ?? ""),
                notes: String(fd.get("notes") ?? ""),
                ...files,
              });
              if (!r.ok) return setError(r.error);
              router.refresh();
              onClose();
            })
          }
        >
          <label className="flex min-h-11 items-center gap-2.5 font-mono text-xs text-ink">
            <input type="checkbox" checked={done} onChange={(e) => setDone(e.target.checked)} className="h-4 w-4 accent-[var(--accent)]" />
            Done
          </label>
          {done && (
            <>
              <label className="block">
                <span className={lab}>Date</span>
                <input id="ck-date" type="date" name="doneOn" defaultValue={i.doneOn ?? new Date().toISOString().slice(0, 10)} className={inputCls} />
              </label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <label className="block sm:col-span-2">
                  <span className={lab}>Result (in words)</span>
                  <input id="ck-result" name="result" defaultValue={i.result ?? ""} placeholder="e.g. normal, low-risk, O positive" className={inputCls} />
                </label>
                <label className="block">
                  <span className={lab}>Number (optional)</span>
                  <input id="ck-value" name="resultValue" defaultValue={i.resultValue ?? ""} placeholder="Hb 11.2" className={inputCls} />
                </label>
              </div>
              {appointments.length > 0 && (
                <label className="block">
                  <span className={lab}>At which appointment (optional)</span>
                  <select id="ck-appt" name="appointmentId" defaultValue={i.appointment?.id ?? ""} className={inputCls}>
                    <option value="">—</option>
                    {appointments.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.label}
                      </option>
                    ))}
                  </select>
                </label>
              )}
              <HealthPhotoPicker journeyId={journeyId} existing={i.files} onChange={setFiles} label="The report — photo or PDF (optional)" />
            </>
          )}
          <label className="block">
            <span className={lab}>Notes</span>
            <input id="ck-notes" name="notes" defaultValue={i.notes ?? ""} className={inputCls} />
          </label>
          <details>
            <summary className="cursor-pointer font-mono text-[0.66rem] text-muted">Change the title or weeks</summary>
            <div className="mt-3 space-y-3">
              <input id="ck-title" name="title" defaultValue={i.title} className={inputCls} aria-label="Title" />
              <div className="grid grid-cols-2 gap-3">
                <input id="ck-from" name="weekFrom" inputMode="numeric" defaultValue={i.weeks?.[0] ?? ""} placeholder="From week" aria-label="From week" className={inputCls} />
                <input id="ck-to" name="weekTo" inputMode="numeric" defaultValue={i.weeks?.[1] ?? ""} placeholder="To week" aria-label="To week" className={inputCls} />
              </div>
            </div>
          </details>
          {error && <p role="alert" className="font-mono text-xs text-negative">{error}</p>}
          <button type="submit" disabled={pending || files.uploading} className="min-h-12 w-full rounded-xl bg-accent font-mono text-sm font-medium text-on-accent disabled:opacity-60">
            {files.uploading ? "Uploading…" : pending ? "Saving…" : "Save"}
          </button>
        </form>
      </div>
    </div>
  );
}
