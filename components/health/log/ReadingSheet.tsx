"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  BP_SLOTS,
  DIPSTICK,
  GLUCOSE_SLOTS,
  KINDS,
  SEVERITIES,
  SYMPTOMS,
  URGENT_BODY,
  URGENT_TITLE,
  defaultSlot,
  toF,
  toLb,
  toMmol,
  type ReadingKind,
  type Units,
  type Verdict,
} from "@/lib/health-log";
import { discardHealthFile, saveReading } from "@/app/health/log/actions";
import { HealthPhotoPicker } from "@/components/health/HealthPhotoPicker";
import { MovementCounter } from "@/components/health/log/MovementCounter";

export type EditReading = {
  id: string;
  kind: ReadingKind;
  takenAt: string;
  slot: string | null;
  note: string | null;
  raw: { valueA: number | null; valueB: number | null; valueC: number | null; detail: unknown };
  files: { id: string; contentType: string }[];
};


/** "yyyy-mm-ddThh:mm" in the phone's own time — what a datetime-local wants. */
function localInput(d: Date) {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}
const fmt1 = (n: number) => String(Math.round(n * 10) / 10);

/**
 * Add or change one reading. Made for one hand and a tired head: the kind is
 * one tap, the slot is already guessed from the time, the numbers are big,
 * and there is one button. What the reading means comes back from the
 * server and is shown here before the sheet closes — so an urgent one is
 * never just a line in a list.
 */
export function ReadingSheet({
  startKind,
  edit,
  units,
  journeyId,
  onClose,
}: {
  startKind: ReadingKind;
  edit?: EditReading | null;
  units: Units;
  journeyId: string;
  onClose: () => void;
}) {
  const router = useRouter();
  const raw = edit?.raw;
  const d0 = (raw?.detail ?? {}) as Record<string, unknown>;
  const [kind, setKind] = useState<ReadingKind>(edit?.kind ?? startKind);
  const [when, setWhen] = useState(() => localInput(edit ? new Date(edit.takenAt) : new Date()));
  const [slot, setSlot] = useState<string | null>(edit?.slot ?? defaultSlot(edit?.kind ?? startKind, new Date().getHours()));
  const [slotTouched, setSlotTouched] = useState(!!edit);
  const conv = (k: ReadingKind, v: number | null | undefined) => {
    if (v === null || v === undefined) return "";
    if (k === "GLUCOSE") return units.glucose === "MMOL" ? toMmol(v).toFixed(1) : String(Math.round(v));
    if (k === "WEIGHT") return fmt1(units.weight === "LB" ? toLb(v) : v);
    if (k === "TEMP") return (units.temp === "F" ? toF(v) : v).toFixed(1);
    return String(v);
  };
  const [a, setA] = useState(edit ? conv(edit.kind, raw?.valueA) : "");
  const [b, setB] = useState(edit && raw?.valueB != null ? String(raw.valueB) : "");
  const [c, setC] = useState(edit && raw?.valueC != null ? String(raw.valueC) : "");
  const [food, setFood] = useState(String(d0.food ?? ""));
  const [arm, setArm] = useState<string | null>((d0.arm as string) ?? null);
  const [fewer, setFewer] = useState(d0.fewer === true);
  const [symptoms, setSymptoms] = useState<string[]>(Array.isArray(d0.list) ? (d0.list as string[]) : []);
  const [severity, setSeverity] = useState<string>((d0.severity as string) ?? "MILD");
  const [dip, setDip] = useState<Record<string, string | undefined>>({
    protein: d0.protein as string | undefined,
    glucose: d0.glucose as string | undefined,
    ketones: d0.ketones as string | undefined,
  });
  const [note, setNote] = useState(edit?.note ?? "");
  const [files, setFiles] = useState({ fileIds: [] as string[], removeFileIds: [] as string[], uploading: false });
  const [error, setError] = useState<string | null>(null);
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [saving, start] = useTransition();
  const firstInput = useRef<HTMLInputElement>(null);

  // The slot follows the clock until somebody picks one themselves.
  useEffect(() => {
    if (slotTouched) return;
    const h = new Date(when).getHours();
    setSlot(defaultSlot(kind, Number.isNaN(h) ? new Date().getHours() : h));
  }, [kind, when, slotTouched]);
  useEffect(() => {
    firstInput.current?.focus({ preventScroll: true });
  }, [kind]);
  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  });

  const uploading = files.uploading;

  function close() {
    // Anything uploaded for a reading that was never saved goes straight back out.
    if (!verdict) for (const id of files.fileIds) void discardHealthFile(id);
    onClose();
  }

  function save() {
    setError(null);
    const detail =
      kind === "GLUCOSE" ? { food } : kind === "BP" ? { arm } : kind === "MOVEMENTS" ? { fewer } : kind === "SYMPTOMS" ? { list: symptoms, severity } : kind === "URINE" ? dip : undefined;
    start(async () => {
      const r = await saveReading({
        id: edit?.id,
        kind,
        takenAt: new Date(when).toISOString(),
        slot,
        a,
        b,
        c,
        detail,
        note,
        fileIds: files.fileIds,
        removeFileIds: files.removeFileIds,
      });
      if (!r.ok) {
        setError(r.error);
        return;
      }
      router.refresh();
      if (r.verdict.level === "ok" || r.verdict.level === "none") {
        onClose();
        return;
      }
      setVerdict(r.verdict);
    });
  }

  const unit = kind === "GLUCOSE" ? (units.glucose === "MMOL" ? "mmol/L" : "mg/dL") : kind === "WEIGHT" ? (units.weight === "LB" ? "lb" : "kg") : kind === "TEMP" ? (units.temp === "F" ? "°F" : "°C") : "";
  const big = "w-full rounded-xl border border-border bg-bg px-4 py-3 text-center font-serif text-3xl text-ink placeholder:text-muted/60 focus:border-accent focus:outline-none";
  const pill = (on: boolean) =>
    `min-h-11 rounded-full border px-3.5 font-mono text-xs transition-colors ${on ? "border-accent bg-accent/[0.12] text-accent" : "border-border text-muted hover:border-accent"}`;
  const kindName = useMemo(() => KINDS.find((k) => k.kind === kind)?.label ?? "", [kind]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center" role="dialog" aria-modal="true" aria-label={edit ? "Change a reading" : "Add a reading"}>
      <div className="max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-border bg-surface p-5 pb-8 shadow-2xl sm:rounded-3xl">
        <div className="flex items-center justify-between gap-3">
          <p className="font-serif text-xl text-ink">{edit ? `Change: ${kindName.toLowerCase()}` : "Add a reading"}</p>
          <button type="button" onClick={close} className="min-h-11 rounded-full px-3 font-mono text-xs text-muted hover:text-ink" aria-label="Close">
            Close
          </button>
        </div>

        {verdict ? (
          <VerdictPanel verdict={verdict} onDone={onClose} />
        ) : (
          <div className="mt-4 space-y-5">
            {!edit && (
              <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="What are you recording?">
                {KINDS.map((k) => (
                  <button key={k.kind} type="button" role="radio" aria-checked={kind === k.kind} onClick={() => { if (k.kind !== kind) { setA(""); setB(""); setC(""); } setKind(k.kind); }} className={pill(kind === k.kind)}>
                    {k.short}
                  </button>
                ))}
              </div>
            )}

            {kind === "GLUCOSE" && (
              <>
                <label className="block">
                  <span className="mb-1.5 block font-mono text-[0.62rem] uppercase tracking-widest text-muted">Glucose ({unit})</span>
                  <input ref={firstInput} id="hl-a" inputMode="decimal" value={a} onChange={(e) => setA(e.target.value)} placeholder={units.glucose === "MMOL" ? "5.2" : "92"} className={big} />
                </label>
                <Pills label="When" value={slot} onChange={(v) => { setSlot(v); setSlotTouched(true); }} options={GLUCOSE_SLOTS.map((s) => ({ v: s.slot, l: s.label }))} pill={pill} />
                {slot?.startsWith("AFTER_") && (
                  <Pills label="How long after the meal" value={b || null} onChange={(v) => setB(v ?? "")} options={[{ v: "60", l: "1 hour" }, { v: "120", l: "2 hours" }]} pill={pill} />
                )}
                {slot?.startsWith("AFTER_") && (
                  <label className="block">
                    <span className="mb-1.5 block font-mono text-[0.62rem] uppercase tracking-widest text-muted">What you ate (optional)</span>
                    <input id="hl-food" value={food} onChange={(e) => setFood(e.target.value)} placeholder="e.g. rice and stew" className="w-full rounded-lg border border-border bg-bg px-3 py-2.5 font-mono text-sm text-ink" />
                  </label>
                )}
              </>
            )}

            {kind === "BP" && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <label className="block">
                    <span className="mb-1.5 block font-mono text-[0.62rem] uppercase tracking-widest text-muted">Top (systolic)</span>
                    <input ref={firstInput} id="hl-a" inputMode="numeric" value={a} onChange={(e) => setA(e.target.value)} placeholder="118" className={big} />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block font-mono text-[0.62rem] uppercase tracking-widest text-muted">Bottom (diastolic)</span>
                    <input id="hl-b" inputMode="numeric" value={b} onChange={(e) => setB(e.target.value)} placeholder="76" className={big} />
                  </label>
                </div>
                <label className="block">
                  <span className="mb-1.5 block font-mono text-[0.62rem] uppercase tracking-widest text-muted">Pulse (optional)</span>
                  <input id="hl-c" inputMode="numeric" value={c} onChange={(e) => setC(e.target.value)} placeholder="72" className="w-full rounded-lg border border-border bg-bg px-3 py-2.5 font-mono text-lg text-ink" />
                </label>
                <Pills label="When" value={slot} onChange={(v) => { setSlot(v); setSlotTouched(true); }} options={BP_SLOTS.map((s) => ({ v: s.slot, l: s.label }))} pill={pill} />
                <Pills label="Arm (optional)" value={arm} onChange={setArm} options={[{ v: "LEFT", l: "Left" }, { v: "RIGHT", l: "Right" }]} pill={pill} allowNone />
              </>
            )}

            {(kind === "WEIGHT" || kind === "TEMP") && (
              <label className="block">
                <span className="mb-1.5 block font-mono text-[0.62rem] uppercase tracking-widest text-muted">
                  {kind === "WEIGHT" ? "Weight" : "Temperature"} ({unit})
                </span>
                <input ref={firstInput} id="hl-a" inputMode="decimal" value={a} onChange={(e) => setA(e.target.value)} placeholder={kind === "WEIGHT" ? (units.weight === "LB" ? "150" : "68.5") : units.temp === "F" ? "98.6" : "36.8"} className={big} />
              </label>
            )}

            {kind === "MOVEMENTS" && (
              <>
                <p className="prose-serif-xs text-muted">
                  Get to know your baby&rsquo;s own pattern. There is no number to reach — what matters is a change from what is usual for your baby.
                </p>
                {/* A tap for each one, and a clock: it fills in the two boxes below. */}
                <MovementCounter
                  onDone={(count, minutes) => {
                    setA(String(count));
                    setB(String(minutes));
                  }}
                />
                <div className="grid grid-cols-2 gap-3">
                  <label className="block">
                    <span className="mb-1.5 block font-mono text-[0.62rem] uppercase tracking-widest text-muted">Movements felt (optional)</span>
                    <input ref={firstInput} id="hl-a" inputMode="numeric" value={a} onChange={(e) => setA(e.target.value)} placeholder="10" className={big} />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block font-mono text-[0.62rem] uppercase tracking-widest text-muted">Over minutes (optional)</span>
                    <input id="hl-b" inputMode="numeric" value={b} onChange={(e) => setB(e.target.value)} placeholder="30" className={big} />
                  </label>
                </div>
                <label className={`flex min-h-11 cursor-pointer items-start gap-3 rounded-xl border px-3 py-2.5 ${fewer ? "border-negative/60 bg-negative/[0.06]" : "border-border"}`}>
                  <input type="checkbox" id="hl-fewer" checked={fewer} onChange={(e) => setFewer(e.target.checked)} className="mt-1 h-4 w-4 accent-[var(--accent)]" />
                  <span className="prose-serif-xs text-ink">
                    Baby is moving less than usual
                    <span className="block text-muted">If so, do not wait until tomorrow — contact your maternity unit now.</span>
                  </span>
                </label>
              </>
            )}

            {kind === "SYMPTOMS" && (
              <>
                <fieldset>
                  <legend className="mb-2 font-mono text-[0.62rem] uppercase tracking-widest text-muted">Tick any you have</legend>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {SYMPTOMS.map((s) => {
                      const on = symptoms.includes(s.key);
                      return (
                        <label key={s.key} className={`flex min-h-11 cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2 ${on ? "border-accent bg-accent/[0.06]" : "border-border"}`}>
                          <input
                            type="checkbox"
                            checked={on}
                            onChange={(e) => setSymptoms((l) => (e.target.checked ? [...l, s.key] : l.filter((x) => x !== s.key)))}
                            className="h-4 w-4 shrink-0 accent-[var(--accent)]"
                          />
                          <span className="prose-serif-xs text-ink">{s.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>
                <Pills label="How bad" value={severity} onChange={(v) => setSeverity(v ?? "MILD")} options={SEVERITIES.map((s) => ({ v: s, l: s[0] + s.slice(1).toLowerCase() }))} pill={pill} />
              </>
            )}

            {kind === "URINE" && (
              <div className="space-y-3">
                {(["protein", "glucose", "ketones"] as const).map((k) => (
                  <Pills
                    key={k}
                    label={k[0].toUpperCase() + k.slice(1)}
                    value={dip[k] ?? null}
                    onChange={(v) => setDip((d) => ({ ...d, [k]: v ?? undefined }))}
                    options={DIPSTICK.map((x) => ({ v: x, l: x === "NEG" ? "Negative" : x === "TRACE" ? "Trace" : x }))}
                    pill={pill}
                    allowNone
                  />
                ))}
              </div>
            )}

            <label className="block">
              <span className="mb-1.5 block font-mono text-[0.62rem] uppercase tracking-widest text-muted">Taken at</span>
              <input id="hl-when" type="datetime-local" value={when} max={localInput(new Date())} onChange={(e) => setWhen(e.target.value)} className="w-full rounded-lg border border-border bg-bg px-3 py-2.5 font-mono text-sm text-ink" />
            </label>

            <label className="block">
              <span className="mb-1.5 block font-mono text-[0.62rem] uppercase tracking-widest text-muted">Note (optional)</span>
              <textarea id="hl-note" rows={2} value={note} onChange={(e) => setNote(e.target.value)} className="w-full resize-y rounded-lg border border-border bg-bg px-3 py-2.5 font-mono text-sm text-ink" />
            </label>

            <HealthPhotoPicker journeyId={journeyId} existing={edit?.files} onChange={setFiles} />

            {error && (
              <p role="alert" className="font-mono text-xs text-negative">
                {error}
              </p>
            )}
            <button
              type="button"
              onClick={save}
              disabled={saving || uploading}
              className="min-h-12 w-full rounded-xl bg-accent font-mono text-sm font-medium text-on-accent hover:bg-accent-deep disabled:opacity-60"
            >
              {uploading ? "Uploading the photo…" : saving ? "Saving…" : edit ? "Save the change" : "Save"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Pills({
  label,
  value,
  onChange,
  options,
  pill,
  allowNone = false,
}: {
  label: string;
  value: string | null;
  onChange: (v: string | null) => void;
  options: { v: string; l: string }[];
  pill: (on: boolean) => string;
  allowNone?: boolean;
}) {
  return (
    <div role="radiogroup" aria-label={label}>
      <span className="mb-1.5 block font-mono text-[0.62rem] uppercase tracking-widest text-muted">{label}</span>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o.v}
            type="button"
            role="radio"
            aria-checked={value === o.v}
            onClick={() => onChange(allowNone && value === o.v ? null : o.v)}
            className={pill(value === o.v)}
          >
            {o.l}
          </button>
        ))}
      </div>
    </div>
  );
}

/** What the reading just saved means — urgent first and loudest. */
export function VerdictPanel({ verdict, onDone }: { verdict: Verdict; onDone: () => void }) {
  if (verdict.level === "urgent") {
    return (
      <div role="alert" className="mt-4 rounded-2xl border-2 border-negative bg-negative/[0.08] p-5">
        <p className="font-mono text-[0.62rem] font-semibold uppercase tracking-widest text-negative">Saved — and this one cannot wait</p>
        <p className="mt-2 font-serif text-2xl leading-snug text-ink">{URGENT_TITLE}</p>
        <ul className="mt-3 space-y-1">
          {verdict.reasons.map((r) => (
            <li key={r} className="prose-serif-sm text-ink">‼ {r}</li>
          ))}
        </ul>
        <p className="mt-3 prose-serif-xs text-muted">{URGENT_BODY}</p>
        <button type="button" onClick={onDone} className="mt-4 min-h-11 rounded-lg border border-negative/60 px-4 font-mono text-xs text-negative">
          I understand
        </button>
      </div>
    );
  }
  return (
    <div className="mt-4 rounded-2xl border border-accent/40 bg-accent/[0.06] p-5">
      <p className="font-mono text-[0.62rem] uppercase tracking-widest text-accent">Saved</p>
      <ul className="mt-2 space-y-1">
        {verdict.reasons.map((r) => (
          <li key={r} className="prose-serif-sm text-ink">{verdict.level === "low" ? "▼" : "▲"} {r}</li>
        ))}
      </ul>
      <p className="mt-2 prose-serif-xs text-muted">Not a diagnosis — discuss it with your doctor or midwife.</p>
      <button type="button" onClick={onDone} className="mt-4 min-h-11 rounded-lg border border-accent/60 px-4 font-mono text-xs text-accent">
        Done
      </button>
    </div>
  );
}
