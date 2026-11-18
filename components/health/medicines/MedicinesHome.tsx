"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ConfirmButton } from "@/components/ui/Confirm";
import { HealthPhotoPicker } from "@/components/health/HealthPhotoPicker";
import { FORMS, SITES } from "@/lib/medication";
import { deletePlan, logDose, markDose, savePlan, stopPlan } from "@/app/health/medicines/actions";
import type { DoseView, PlanView } from "@/lib/medication-db";

const inputCls = "w-full rounded-lg border border-border bg-bg px-3 py-2.5 font-mono text-sm text-ink";
const lab = "mb-1.5 block font-mono text-[0.62rem] uppercase tracking-widest text-muted";

/** "yyyy-mm-ddThh:mm" in the phone's own time — for a datetime-local. */
function localInput(d: Date) {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}

/**
 * Medicines: today's doses first — one tap for "taken" — then anything from
 * the last week still unrecorded, then the medicines themselves with how the
 * week has gone. An injection suggests the next site; insulin asks for units.
 */
export function MedicinesHome({
  journeyId,
  todays,
  earlier,
  asNeededLog,
  plans,
}: {
  journeyId: string;
  todays: DoseView[];
  earlier: DoseView[];
  asNeededLog: DoseView[];
  plans: PlanView[];
}) {
  const [planSheet, setPlanSheet] = useState<PlanView | "new" | null>(null);
  const [doseSheet, setDoseSheet] = useState<{ dose?: DoseView; plan?: PlanView } | null>(null);
  const active = plans.filter((p) => !p.stopped);
  const asNeeded = active.filter((p) => p.scheduleKind === "AS_NEEDED");

  return (
    <div className="mt-6 space-y-6">
      <section className="rounded-2xl border border-border bg-surface p-5">
        <p className="eyebrow mb-3 text-muted">Today&rsquo;s doses</p>
        {todays.length === 0 ? (
          <p className="prose-serif-xs text-muted">{active.length ? "Nothing scheduled today." : "Add a medicine below and its doses appear here."}</p>
        ) : (
          <ul className="space-y-2">
            {todays.map((d) => (
              <DoseRow key={d.id} d={d} onDetail={() => setDoseSheet({ dose: d })} />
            ))}
          </ul>
        )}
        {asNeeded.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-3">
            {asNeeded.map((p) => (
              <button key={p.id} type="button" onClick={() => setDoseSheet({ plan: p })} className="min-h-11 rounded-full border border-border px-3.5 font-mono text-xs text-muted hover:border-accent hover:text-accent">
                + Took {p.name}
              </button>
            ))}
          </div>
        )}
      </section>

      {earlier.length > 0 && (
        <section className="rounded-2xl border border-accent/40 bg-accent/[0.04] p-5">
          <p className="eyebrow mb-1 text-accent">Not recorded yet</p>
          <p className="mb-3 prose-serif-xs text-muted">From the last week. Mark each one taken (with the time) or skipped — or leave it, and the report will say it was not recorded.</p>
          <ul className="space-y-2">
            {earlier.map((d) => (
              <DoseRow key={d.id} d={d} withDate onDetail={() => setDoseSheet({ dose: d })} />
            ))}
          </ul>
        </section>
      )}

      <section>
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="eyebrow text-muted">Medicines</p>
          <button type="button" onClick={() => setPlanSheet("new")} className="min-h-11 rounded-lg bg-accent px-4 font-mono text-xs font-medium text-on-accent hover:bg-accent-deep">
            + Add a medicine
          </button>
        </div>
        {plans.length === 0 ? (
          <p className="prose-serif-sm text-muted">None yet. Add what your doctor prescribed — the name, the dose, and when — and the reminders and the log follow.</p>
        ) : (
          <ul className="space-y-3">
            {plans.map((p) => (
              <PlanCard key={p.id} p={p} onEdit={() => setPlanSheet(p)} />
            ))}
          </ul>
        )}
      </section>

      {asNeededLog.length > 0 && (
        <section>
          <p className="eyebrow mb-2 text-muted">As-needed doses, this week</p>
          <ul className="space-y-1">
            {asNeededLog.map((d) => (
              <li key={d.id} className="font-mono text-xs text-muted">
                {new Date(d.dueAt).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })} {d.takenTime} — {d.name}
                {d.site ? ` · ${d.site}` : ""}
                {d.units != null ? ` · ${d.units} units` : ""}
              </li>
            ))}
          </ul>
        </section>
      )}

      {planSheet && <PlanSheet journeyId={journeyId} plan={planSheet === "new" ? null : planSheet} onClose={() => setPlanSheet(null)} />}
      {doseSheet && <DoseSheet journeyId={journeyId} dose={doseSheet.dose} plan={doseSheet.plan} onClose={() => setDoseSheet(null)} />}
    </div>
  );
}

function DoseRow({ d, onDetail, withDate = false }: { d: DoseView; onDetail: () => void; withDate?: boolean }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const quick = (status: "TAKEN" | "DUE") =>
    start(async () => {
      await markDose({ id: d.id, status, site: d.injected ? d.suggestedSite ?? undefined : undefined });
      router.refresh();
    });
  const done = d.status !== "DUE";
  return (
    <li className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border p-3 ${done ? "border-border bg-bg/40" : "border-border bg-bg"}`}>
      <div className="min-w-0">
        <p className="font-mono text-[0.62rem] uppercase tracking-widest text-muted">
          {withDate ? `${new Date(d.dueAt).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })} · ` : ""}
          {d.time}
        </p>
        <p className="font-serif text-base text-ink">
          {d.name}
          {d.doseText && <span className="text-muted"> · {d.doseText}</span>}
        </p>
        {d.status === "TAKEN" && (
          <p className="font-mono text-[0.66rem] text-positive">
            ✓ Taken {d.takenTime}
            {d.late ? " · late" : ""}
            {d.site ? ` · ${d.site}` : ""}
            {d.units != null ? ` · ${d.units} units` : ""}
          </p>
        )}
        {d.status === "SKIPPED" && <p className="font-mono text-[0.66rem] text-accent">Skipped{d.skipReason ? ` — ${d.skipReason}` : ""}</p>}
        {d.status === "DUE" && d.injected && d.suggestedSite && <p className="font-mono text-[0.66rem] text-muted">Suggested site: {d.suggestedSite}</p>}
      </div>
      <div className={`flex flex-wrap gap-2 ${pending ? "opacity-50" : ""}`}>
        {d.status === "DUE" ? (
          <>
            {!d.insulin && (
              <button type="button" onClick={() => quick("TAKEN")} className="min-h-11 rounded-lg bg-accent px-4 font-mono text-xs font-medium text-on-accent">
                Taken
              </button>
            )}
            <button type="button" onClick={onDetail} className="min-h-11 rounded-lg border border-border px-3 font-mono text-xs text-ink">
              {d.insulin ? "Record units" : "Details…"}
            </button>
          </>
        ) : (
          <button type="button" onClick={() => quick("DUE")} className="min-h-11 rounded-lg px-3 font-mono text-xs text-muted hover:text-ink">
            Undo
          </button>
        )}
      </div>
    </li>
  );
}

function PlanCard({ p, onEdit }: { p: PlanView; onEdit: () => void }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const w = p.week;
  return (
    <li className={`rounded-2xl border border-border bg-surface p-4 ${p.stopped ? "opacity-70" : ""}`}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-serif text-lg text-ink">
            {p.name}
            {p.strength && <span className="text-muted"> {p.strength}</span>}
          </p>
          <p className="font-mono text-[0.66rem] text-muted">
            {p.formLabel}
            {p.dose ? ` · ${p.dose}` : ""}
            {p.route ? ` · ${p.route}` : ""} · {p.schedule}
          </p>
          <p className="font-mono text-[0.62rem] text-muted">
            From {p.startOn}
            {p.endOn ? ` to ${p.endOn}` : ""}
            {p.prescribedBy ? ` · prescribed by ${p.prescribedBy}` : ""}
            {p.stopped ? " · stopped" : ""}
          </p>
        </div>
        {p.scheduleKind !== "AS_NEEDED" && w.due > 0 && (
          <span className="rounded-full border border-border px-2.5 py-1 font-mono text-[0.62rem] text-ink" title="Doses due in the last 7 days">
            {w.taken} of {w.due} taken this week
            {w.late ? ` · ${w.late} late` : ""}
            {w.skipped ? ` · ${w.skipped} skipped` : ""}
          </span>
        )}
      </div>
      {p.notes && <p className="mt-1 whitespace-pre-wrap prose-serif-xs text-ink">{p.notes}</p>}
      {p.files.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {p.files.map((f) =>
            f.contentType === "application/pdf" ? (
              <a key={f.id} href={`/api/health/file/${f.id}`} target="_blank" rel="noopener noreferrer" className="flex h-12 w-12 items-center justify-center rounded-lg border border-border font-mono text-[0.6rem] text-accent">
                PDF
              </a>
            ) : (
              <a key={f.id} href={`/api/health/file/${f.id}`} target="_blank" rel="noopener noreferrer" className="h-12 w-12 overflow-hidden rounded-lg border border-border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/api/health/file/${f.id}`} alt="" className="h-full w-full object-cover" />
              </a>
            ),
          )}
        </div>
      )}
      <div className={`mt-2 flex flex-wrap gap-x-4 font-mono text-[0.66rem] text-muted ${pending ? "opacity-50" : ""}`}>
        <button type="button" onClick={onEdit} className="min-h-9 hover:text-accent">
          Edit
        </button>
        <button type="button" onClick={() => start(async () => { await stopPlan(p.id, !p.stopped); router.refresh(); })} className="min-h-9 hover:text-accent">
          {p.stopped ? "Start again" : "Stop"}
        </button>
        <ConfirmButton press="none" describe={`${p.name}, its doses and photos`} onConfirm={async () => { start(async () => { await deletePlan(p.id); router.refresh(); }); }} className="min-h-9 hover:text-negative" />
      </div>
    </li>
  );
}

function PlanSheet({ journeyId, plan, onClose }: { journeyId: string; plan: PlanView | null; onClose: () => void }) {
  const router = useRouter();
  const today = new Date().toISOString().slice(0, 10);
  const [kind, setKind] = useState(plan?.scheduleKind ?? "TIMES");
  const [times, setTimes] = useState<string[]>(plan?.times.length ? plan.times : ["09:00"]);
  const [files, setFiles] = useState({ fileIds: [] as string[], removeFileIds: [] as string[], uploading: false });
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  return (
    <Sheet title={plan ? `Change ${plan.name}` : "Add a medicine"} onClose={onClose}>
      <form
        className="mt-4 space-y-4"
        action={(fd) =>
          start(async () => {
            const raw: Record<string, unknown> = {};
            fd.forEach((v, k) => (raw[k] = String(v)));
            const r = await savePlan({ ...raw, id: plan?.id, scheduleKind: kind, times, remind: fd.get("remind") === "on", remindPartner: fd.get("remindPartner") === "on", ...files });
            if (!r.ok) return setError(r.error);
            router.refresh();
            onClose();
          })
        }
      >
        <label className="block">
          <span className={lab}>Medicine</span>
          <input id="mp-name" name="name" required defaultValue={plan?.name} placeholder="e.g. Progesterone" className={inputCls} />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className={lab}>Form</span>
            <select id="mp-form" name="form" defaultValue={plan?.form ?? "TABLET"} className={inputCls}>
              {FORMS.map((f) => (
                <option key={f.form} value={f.form}>
                  {f.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className={lab}>Strength</span>
            <input id="mp-strength" name="strength" defaultValue={plan?.strength ?? ""} placeholder="400 mg" className={inputCls} />
          </label>
          <label className="block">
            <span className={lab}>Dose</span>
            <input id="mp-dose" name="dose" defaultValue={plan?.dose ?? ""} placeholder="1 pessary" className={inputCls} />
          </label>
          <label className="block">
            <span className={lab}>How it is taken</span>
            <input id="mp-route" name="route" defaultValue={plan?.route ?? ""} placeholder="vaginal, by mouth…" className={inputCls} />
          </label>
        </div>
        <div>
          <span className={lab}>When</span>
          <div className="flex flex-wrap gap-2">
            {(
              [
                ["TIMES", "Every day"],
                ["EVERY_N_DAYS", "Every few days"],
                ["AS_NEEDED", "As needed"],
              ] as const
            ).map(([k, l]) => (
              <button key={k} type="button" onClick={() => setKind(k)} aria-pressed={kind === k} className={`min-h-11 rounded-full border px-3.5 font-mono text-xs ${kind === k ? "border-accent bg-accent/[0.12] text-accent" : "border-border text-muted"}`}>
                {l}
              </button>
            ))}
          </div>
          {kind === "EVERY_N_DAYS" && (
            <label className="mt-2 flex items-center gap-2 font-mono text-xs text-ink">
              Every <input id="mp-every" name="everyDays" inputMode="numeric" defaultValue={plan?.everyDays ?? 2} className="w-16 rounded-lg border border-border bg-bg px-2 py-2 text-center" /> days
            </label>
          )}
          {kind !== "AS_NEEDED" && (
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {times.map((t, i) => (
                <span key={i} className="flex items-center gap-1">
                  <input type="time" aria-label={`Time ${i + 1}`} value={t} onChange={(e) => setTimes((l) => l.map((x, j) => (j === i ? e.target.value : x)))} className="rounded-lg border border-border bg-bg px-2 py-2 font-mono text-sm text-ink" />
                  {times.length > 1 && (
                    <button type="button" aria-label="Remove this time" onClick={() => setTimes((l) => l.filter((_, j) => j !== i))} className="h-9 w-9 font-mono text-muted">
                      ×
                    </button>
                  )}
                </span>
              ))}
              {times.length < 8 && (
                <button type="button" onClick={() => setTimes((l) => [...l, "21:00"])} className="min-h-10 rounded-lg border border-dashed border-border px-3 font-mono text-xs text-muted">
                  + Another time
                </button>
              )}
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className={lab}>Starts</span>
            <input id="mp-start" type="date" name="startOn" required defaultValue={plan?.startOn ?? today} className={inputCls} />
          </label>
          <label className="block">
            <span className={lab}>Ends (optional)</span>
            <input id="mp-end" type="date" name="endOn" defaultValue={plan?.endOn ?? ""} className={inputCls} />
          </label>
        </div>
        <label className="block">
          <span className={lab}>Prescribed by (optional)</span>
          <input id="mp-by" name="prescribedBy" defaultValue={plan?.prescribedBy ?? ""} className={inputCls} />
        </label>
        <label className="block">
          <span className={lab}>Notes (optional)</span>
          <textarea id="mp-notes" name="notes" rows={2} defaultValue={plan?.notes ?? ""} className={`${inputCls} resize-y`} />
        </label>
        <label className="flex min-h-11 items-center gap-2.5 font-mono text-xs text-ink">
          <input type="checkbox" name="remind" defaultChecked={plan?.remind ?? true} className="h-4 w-4 accent-[var(--accent)]" />
          Remind me at each dose (the reminder never names the medicine)
        </label>
        <label className="flex min-h-11 items-center gap-2.5 font-mono text-xs text-ink">
          <input type="checkbox" name="remindPartner" defaultChecked={plan?.remindPartner ?? false} className="h-4 w-4 accent-[var(--accent)]" />
          Remind my partner too
        </label>
        <HealthPhotoPicker journeyId={journeyId} existing={plan?.files} onChange={setFiles} label="Photo of the box or prescription (optional)" />
        {error && <p role="alert" className="font-mono text-xs text-negative">{error}</p>}
        <button type="submit" disabled={pending || files.uploading} className="min-h-12 w-full rounded-xl bg-accent font-mono text-sm font-medium text-on-accent disabled:opacity-60">
          {files.uploading ? "Uploading the photo…" : pending ? "Saving…" : plan ? "Save the change" : "Add the medicine"}
        </button>
      </form>
    </Sheet>
  );
}

function DoseSheet({ journeyId, dose, plan, onClose }: { journeyId: string; dose?: DoseView; plan?: PlanView; onClose: () => void }) {
  const router = useRouter();
  const injected = dose ? dose.injected : plan ? plan.form === "INJECTION" || plan.form === "INSULIN" : false;
  const insulin = dose ? dose.insulin : plan?.form === "INSULIN";
  const [status, setStatus] = useState<"TAKEN" | "SKIPPED">("TAKEN");
  const [when, setWhen] = useState(localInput(new Date()));
  const [site, setSite] = useState<string>(dose?.suggestedSite ?? SITES[0]);
  const [files, setFiles] = useState({ fileIds: [] as string[], removeFileIds: [] as string[], uploading: false });
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const name = dose?.name ?? plan?.name ?? "";
  return (
    <Sheet title={dose ? `${name} · ${dose.time}` : `Took ${name}`} onClose={onClose}>
      <form
        className="mt-4 space-y-4"
        action={(fd) =>
          start(async () => {
            const common = {
              takenAt: new Date(when).toISOString(),
              site: injected ? site : undefined,
              units: insulin ? String(fd.get("units") ?? "") : undefined,
              note: String(fd.get("note") ?? ""),
              fileIds: files.fileIds,
            };
            const r = dose
              ? await markDose({ id: dose.id, status, skipReason: String(fd.get("skipReason") ?? ""), ...common })
              : await logDose({ planId: plan!.id, ...common });
            if (!r.ok) return setError(r.error);
            router.refresh();
            onClose();
          })
        }
      >
        {dose && (
          <div className="flex gap-2">
            {(["TAKEN", "SKIPPED"] as const).map((s) => (
              <button key={s} type="button" onClick={() => setStatus(s)} aria-pressed={status === s} className={`min-h-11 rounded-full border px-4 font-mono text-xs ${status === s ? "border-accent bg-accent/[0.12] text-accent" : "border-border text-muted"}`}>
                {s === "TAKEN" ? "Taken" : "Skipped"}
              </button>
            ))}
          </div>
        )}
        {status === "TAKEN" ? (
          <>
            <label className="block">
              <span className={lab}>Taken at</span>
              <input id="md-when" type="datetime-local" value={when} max={localInput(new Date())} onChange={(e) => setWhen(e.target.value)} className={inputCls} />
              {dose && new Date(when).getTime() - new Date(dose.dueAt).getTime() > 3600_000 && <span className="mt-1 block font-mono text-[0.62rem] text-accent">More than an hour after it was due — it will be marked late.</span>}
            </label>
            {injected && (
              <div>
                <span className={lab}>Site{dose?.suggestedSite ? ` — suggested: ${dose.suggestedSite}` : ""}</span>
                <div className="flex flex-wrap gap-2">
                  {SITES.map((s) => (
                    <button key={s} type="button" onClick={() => setSite(s)} aria-pressed={site === s} className={`min-h-10 rounded-full border px-3 font-mono text-[0.68rem] ${site === s ? "border-accent bg-accent/[0.12] text-accent" : "border-border text-muted"}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {insulin && (
              <label className="block">
                <span className={lab}>Units given</span>
                <input id="md-units" name="units" inputMode="decimal" required className="w-full rounded-xl border border-border bg-bg px-4 py-3 text-center font-serif text-3xl text-ink" placeholder="8" />
              </label>
            )}
          </>
        ) : (
          <label className="block">
            <span className={lab}>Why was it skipped? (optional)</span>
            <input id="md-skip" name="skipReason" placeholder="e.g. felt sick, ran out" className={inputCls} />
          </label>
        )}
        <label className="block">
          <span className={lab}>Note (optional)</span>
          <input id="md-note" name="note" className={inputCls} />
        </label>
        {status === "TAKEN" && <HealthPhotoPicker journeyId={journeyId} onChange={setFiles} label="Photo (optional) — the pen, the dose window" />}
        {error && <p role="alert" className="font-mono text-xs text-negative">{error}</p>}
        <button type="submit" disabled={pending || files.uploading} className="min-h-12 w-full rounded-xl bg-accent font-mono text-sm font-medium text-on-accent disabled:opacity-60">
          {files.uploading ? "Uploading the photo…" : pending ? "Saving…" : "Save"}
        </button>
      </form>
    </Sheet>
  );
}

function Sheet({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center" role="dialog" aria-modal="true" aria-label={title}>
      <div className="max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-border bg-surface p-5 pb-8 shadow-2xl sm:rounded-3xl">
        <div className="flex items-center justify-between gap-3">
          <p className="font-serif text-xl text-ink">{title}</p>
          <button type="button" onClick={onClose} className="min-h-11 rounded-full px-3 font-mono text-xs text-muted hover:text-ink">
            Close
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
