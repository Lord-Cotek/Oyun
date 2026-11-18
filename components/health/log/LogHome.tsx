"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lightbox } from "@/components/media/Lightbox";
import { ConfirmButton } from "@/components/ui/Confirm";
import { ReadingSheet, type EditReading } from "@/components/health/log/ReadingSheet";
import { deleteReading, saveTargets, saveUnits, setLogAudience } from "@/app/health/log/actions";
import {
  DEFAULT_TARGETS,
  KINDS,
  TARGET_LABEL,
  URGENT_BODY,
  URGENT_TITLE,
  isKind,
  type Level,
  type ReadingKind,
  type TargetKey,
  type Targets,
  type Units,
} from "@/lib/health-log";
import type { ReadingView } from "@/lib/health-log-view";

type Cell = { main: string; level: Level } | null;
export type Today = {
  glucose: Record<"FASTING" | "AFTER_BREAKFAST" | "AFTER_LUNCH" | "AFTER_DINNER", Cell>;
  bp: Record<"MORNING" | "EVENING", Cell>;
  weight: Cell;
  movements: number;
};

const MARK: Record<Level, string> = { ok: "✓", high: "▲", low: "▼", urgent: "‼", none: "" };
const TONE: Record<Level, string> = {
  ok: "text-positive",
  high: "text-accent",
  low: "text-accent",
  urgent: "text-negative",
  none: "text-muted",
};

/**
 * The health log's home: what has been checked today, one tap to add the
 * next, and the last two weeks below. Urgent readings from the last day sit
 * at the very top until a day has passed — not buried among the rest.
 */
export function LogHome({
  journeyId,
  readings,
  today,
  todayKey,
  units,
  targets,
  customTargets,
  isMother,
  audience,
  urgentRecent,
}: {
  journeyId: string;
  readings: ReadingView[];
  today: Today;
  todayKey: string;
  units: Units;
  targets: Targets;
  customTargets: string[];
  isMother: boolean;
  audience: "HOUSEHOLD" | "MOTHER";
  urgentRecent: ReadingView[];
}) {
  const params = useSearchParams();
  const router = useRouter();
  const [sheet, setSheet] = useState<{ kind: ReadingKind; edit?: EditReading | null } | null>(null);
  const [lightbox, setLightbox] = useState<{ items: { url: string; type: "image" }[]; index: number } | null>(null);

  // One tap from home: /health/log?add=GLUCOSE opens the sheet ready.
  useEffect(() => {
    const k = params.get("add");
    if (k) {
      setSheet({ kind: isKind(k) ? k : "GLUCOSE" });
      router.replace("/health/log", { scroll: false });
    }
  }, [params, router]);

  const days = groupByDay(readings);

  return (
    <div className="mt-6 space-y-6">
      {urgentRecent.length > 0 && (
        <div role="alert" className="rounded-2xl border-2 border-negative bg-negative/[0.07] p-5">
          <p className="font-mono text-[0.62rem] font-semibold uppercase tracking-widest text-negative">In the last day</p>
          <p className="mt-1 font-serif text-xl leading-snug text-ink">{URGENT_TITLE}</p>
          <ul className="mt-2 space-y-1">
            {urgentRecent.map((r) => (
              <li key={r.id} className="prose-serif-xs text-ink">
                ‼ {r.kindLabel} at {r.time}: {r.reasons.join(" ")}
              </li>
            ))}
          </ul>
          <p className="mt-2 prose-serif-xs text-muted">{URGENT_BODY}</p>
        </div>
      )}

      <section className="rounded-2xl border border-border bg-surface p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="eyebrow text-muted">Today</p>
          <p className="font-mono text-[0.62rem] text-muted">{todayKey}</p>
        </div>
        <p className="mb-2 mt-3 font-mono text-[0.6rem] uppercase tracking-widest text-muted">Glucose</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {(
            [
              ["FASTING", "Fasting"],
              ["AFTER_BREAKFAST", "Breakfast"],
              ["AFTER_LUNCH", "Lunch"],
              ["AFTER_DINNER", "Dinner"],
            ] as const
          ).map(([k, l]) => (
            <Slot key={k} label={l} cell={today.glucose[k]} onAdd={() => setSheet({ kind: "GLUCOSE" })} />
          ))}
        </div>
        <p className="mb-2 mt-4 font-mono text-[0.6rem] uppercase tracking-widest text-muted">Blood pressure</p>
        <div className="grid grid-cols-2 gap-2">
          <Slot label="Morning" cell={today.bp.MORNING} onAdd={() => setSheet({ kind: "BP" })} />
          <Slot label="Evening" cell={today.bp.EVENING} onAdd={() => setSheet({ kind: "BP" })} />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Slot label="Last weight" cell={today.weight} onAdd={() => setSheet({ kind: "WEIGHT" })} />
          <Slot
            label="Movements today"
            cell={today.movements ? { main: `${today.movements} logged`, level: "none" } : null}
            onAdd={() => setSheet({ kind: "MOVEMENTS" })}
          />
        </div>
      </section>

      <section>
        <button
          type="button"
          onClick={() => setSheet({ kind: "GLUCOSE" })}
          className="min-h-12 w-full rounded-xl bg-accent font-mono text-sm font-medium text-on-accent hover:bg-accent-deep"
        >
          + Add a reading
        </button>
        <div className="mt-3 flex flex-wrap gap-2">
          {KINDS.map((k) => (
            <button
              key={k.kind}
              type="button"
              onClick={() => setSheet({ kind: k.kind })}
              className="min-h-11 rounded-full border border-border px-3.5 font-mono text-xs text-muted hover:border-accent hover:text-accent"
            >
              + {k.short}
            </button>
          ))}
        </div>
      </section>

      <section>
        <p className="eyebrow mb-3 text-muted">The last two weeks</p>
        {days.length === 0 ? (
          <p className="prose-serif-sm text-muted">Nothing recorded yet. The first one takes about ten seconds.</p>
        ) : (
          <div className="space-y-5">
            {days.map(([day, list]) => (
              <div key={day}>
                <p className="mb-2 font-mono text-[0.62rem] uppercase tracking-widest text-muted">{day === todayKey ? "Today" : niceDay(day)}</p>
                <ul className="space-y-2">
                  {list.map((r) => (
                    <ReadingRow
                      key={r.id}
                      r={r}
                      onEdit={() =>
                        setSheet({
                          kind: r.kind as ReadingKind,
                          edit: { id: r.id, kind: r.kind as ReadingKind, takenAt: r.takenAt, slot: r.slot, note: r.note, raw: r.raw, files: r.files },
                        })
                      }
                      onOpen={(i) =>
                        setLightbox({
                          items: r.files.filter((f) => f.contentType !== "application/pdf").map((f) => ({ url: `/api/health/file/${f.id}`, type: "image" as const })),
                          index: i,
                        })
                      }
                    />
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </section>

      <TargetsPanel targets={targets} custom={customTargets} />
      <SettingsPanel units={units} isMother={isMother} audience={audience} />

      {sheet && <ReadingSheet startKind={sheet.kind} edit={sheet.edit} units={units} journeyId={journeyId} onClose={() => setSheet(null)} />}
      {lightbox && (
        <Lightbox
          items={lightbox.items}
          index={lightbox.index}
          onClose={() => setLightbox(null)}
          onIndex={(i) => setLightbox((l) => (l ? { ...l, index: i } : l))}
          alts={lightbox.items.map(() => "Photo kept with a health reading")}
        />
      )}
    </div>
  );
}

function Slot({ label, cell, onAdd }: { label: string; cell: Cell; onAdd: () => void }) {
  return (
    <button type="button" onClick={onAdd} className="min-h-14 rounded-xl border border-border bg-bg px-3 py-2 text-left hover:border-accent">
      <span className="block font-mono text-[0.58rem] uppercase tracking-widest text-muted">{label}</span>
      {cell ? (
        <span className={`block font-serif text-base ${TONE[cell.level]}`}>
          {cell.main} <span aria-label={cell.level === "ok" ? "in range" : cell.level}>{MARK[cell.level]}</span>
        </span>
      ) : (
        <span className="block font-serif text-base text-muted/70">—</span>
      )}
    </button>
  );
}

function ReadingRow({ r, onEdit, onOpen }: { r: ReadingView; onEdit: () => void; onOpen: (i: number) => void }) {
  const [pending, start] = useTransition();
  const images = r.files.filter((f) => f.contentType !== "application/pdf");
  const pdfs = r.files.filter((f) => f.contentType === "application/pdf");
  const flagged = r.level === "high" || r.level === "low" || r.level === "urgent";
  return (
    <li className={`rounded-xl border p-3.5 ${r.level === "urgent" ? "border-negative/60 bg-negative/[0.05]" : "border-border bg-surface"}`}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <p className="font-mono text-[0.62rem] uppercase tracking-widest text-muted">
          {r.time} · {r.kindLabel}
          {r.slotLabel ? ` · ${r.slotLabel}` : ""}
        </p>
        {flagged && (
          <span className={`font-mono text-[0.62rem] ${TONE[r.level]}`}>
            {MARK[r.level]} {r.level === "urgent" ? "Act now" : r.level === "low" ? "Below target" : "Above target"}
          </span>
        )}
      </div>
      <p className={`mt-1 font-serif text-lg leading-snug ${flagged ? TONE[r.level] : "text-ink"}`}>
        {r.main}
        {r.level === "ok" && <span className="ml-1.5 text-sm text-positive" aria-label="in range">✓</span>}
        {r.other && <span className="ml-2 font-mono text-[0.68rem] text-muted">{r.other}</span>}
      </p>
      {r.extra && <p className="font-mono text-[0.68rem] text-muted">{r.extra}</p>}
      {flagged && r.reasons.length > 0 && <p className="mt-1 prose-serif-xs text-muted">{r.reasons.join(" ")} Discuss it with your doctor.</p>}
      {r.note && <p className="mt-1 whitespace-pre-wrap prose-serif-xs text-ink">{r.note}</p>}
      {(images.length > 0 || pdfs.length > 0) && (
        <div className="mt-2 flex flex-wrap gap-2">
          {images.map((f, i) => (
            <button key={f.id} type="button" onClick={() => onOpen(i)} className="h-14 w-14 overflow-hidden rounded-lg border border-border" aria-label="Open the photo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/api/health/file/${f.id}`} alt="" loading="lazy" className="h-full w-full object-cover" />
            </button>
          ))}
          {pdfs.map((f) => (
            <a key={f.id} href={`/api/health/file/${f.id}`} target="_blank" rel="noopener noreferrer" className="flex h-14 w-14 items-center justify-center rounded-lg border border-border font-mono text-[0.6rem] text-accent">
              PDF
            </a>
          ))}
        </div>
      )}
      <div className="mt-2 flex flex-wrap items-center gap-x-4 font-mono text-[0.62rem] text-muted">
        {r.recordedBy && <span>by {r.recordedBy}</span>}
        {r.canEdit && (
          <>
            <button type="button" onClick={onEdit} className="min-h-9 underline-offset-4 hover:text-accent hover:underline">
              Edit
            </button>
            <ConfirmButton
              press="none"
              describe="this reading and its photos"
              onConfirm={async () => {
                start(async () => {
                  await deleteReading(r.id);
                });
              }}
              className={`min-h-9 hover:text-negative ${pending ? "opacity-50" : ""}`}
            />
          </>
        )}
      </div>
    </li>
  );
}

function TargetsPanel({ targets, custom }: { targets: Targets; custom: string[] }) {
  const router = useRouter();
  const [msg, setMsg] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const keys = Object.keys(DEFAULT_TARGETS) as TargetKey[];
  return (
    <details className="rounded-2xl border border-border bg-surface p-5">
      <summary className="cursor-pointer font-serif text-lg text-ink">Targets</summary>
      <p className="mt-2 prose-serif-xs text-muted">
        Replace these with the numbers your doctor gave you. Until you do, each one is a common default — and says so.
      </p>
      <form
        className="mt-4 space-y-3"
        action={(fd) =>
          start(async () => {
            const raw: Record<string, unknown> = {};
            fd.forEach((v, k) => (raw[k] = String(v)));
            const r = await saveTargets(raw);
            setMsg(r.ok ? "Saved." : r.error);
            router.refresh();
          })
        }
      >
        {keys.map((k) => (
          <label key={k} className="flex flex-wrap items-center justify-between gap-2">
            <span className="prose-serif-xs text-ink">
              {TARGET_LABEL[k]}
              <span className={`ml-2 font-mono text-[0.58rem] ${custom.includes(k) ? "text-positive" : "text-muted"}`}>
                {custom.includes(k) ? "your doctor's" : "default — replace with your doctor's numbers"}
              </span>
            </span>
            <span className="flex items-center gap-2">
              <input
                id={`tg-${k}`}
                name={k}
                inputMode="numeric"
                defaultValue={targets[k]}
                className="w-20 rounded-lg border border-border bg-bg px-2 py-2 text-center font-mono text-sm text-ink"
              />
              <span className="w-12 font-mono text-[0.62rem] text-muted">{k.startsWith("bp") ? "mmHg" : "mg/dL"}</span>
            </span>
          </label>
        ))}
        <div className="flex items-center gap-3 pt-1">
          <button type="submit" disabled={pending} className="min-h-11 rounded-lg bg-accent px-4 font-mono text-xs text-on-accent disabled:opacity-60">
            {pending ? "Saving…" : "Save targets"}
          </button>
          {msg && <span className="font-mono text-[0.62rem] text-muted">{msg}</span>}
        </div>
      </form>
    </details>
  );
}

function SettingsPanel({ units, isMother, audience }: { units: Units; isMother: boolean; audience: "HOUSEHOLD" | "MOTHER" }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const set = (patch: Partial<{ glucoseUnit: string; weightUnit: string; tempUnit: string }>) =>
    start(async () => {
      await saveUnits({ glucoseUnit: units.glucose, weightUnit: units.weight, tempUnit: units.temp, ...patch });
      router.refresh();
    });
  const opt = (on: boolean) => `min-h-10 rounded-full border px-3 font-mono text-xs ${on ? "border-accent bg-accent/[0.1] text-accent" : "border-border text-muted"}`;
  return (
    <details className="rounded-2xl border border-border bg-surface p-5">
      <summary className="cursor-pointer font-serif text-lg text-ink">Units and privacy</summary>
      <div className={`mt-4 space-y-3 ${pending ? "opacity-60" : ""}`}>
        <Row label="Glucose">
          <button type="button" className={opt(units.glucose === "MGDL")} onClick={() => set({ glucoseUnit: "MGDL" })}>mg/dL</button>
          <button type="button" className={opt(units.glucose === "MMOL")} onClick={() => set({ glucoseUnit: "MMOL" })}>mmol/L</button>
        </Row>
        <Row label="Weight">
          <button type="button" className={opt(units.weight === "KG")} onClick={() => set({ weightUnit: "KG" })}>kg</button>
          <button type="button" className={opt(units.weight === "LB")} onClick={() => set({ weightUnit: "LB" })}>lb</button>
        </Row>
        <Row label="Temperature">
          <button type="button" className={opt(units.temp === "C")} onClick={() => set({ tempUnit: "C" })}>°C</button>
          <button type="button" className={opt(units.temp === "F")} onClick={() => set({ tempUnit: "F" })}>°F</button>
        </Row>
        <div className="border-t border-border pt-3">
          <p className="font-mono text-[0.6rem] uppercase tracking-widest text-muted">Who sees this log</p>
          {isMother ? (
            <div className="mt-2 flex flex-wrap gap-2">
              <button type="button" className={opt(audience === "HOUSEHOLD")} onClick={() => start(async () => { await setLogAudience("HOUSEHOLD"); router.refresh(); })}>
                Me and my partner
              </button>
              <button type="button" className={opt(audience === "MOTHER")} onClick={() => start(async () => { await setLogAudience("MOTHER"); router.refresh(); })}>
                Only me
              </button>
            </div>
          ) : (
            <p className="mt-1 prose-serif-xs text-muted">The two of you. Mum can choose to keep it to herself.</p>
          )}
          <p className="mt-2 prose-serif-xs text-muted">Never the circle, and never Agbebi. It leaves the app only in a report link you make yourself.</p>
        </div>
      </div>
    </details>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <span className="prose-serif-xs text-ink">{label}</span>
      <span className="flex gap-2">{children}</span>
    </div>
  );
}

function groupByDay(rs: ReadingView[]): [string, ReadingView[]][] {
  const m = new Map<string, ReadingView[]>();
  for (const r of rs) m.set(r.day, [...(m.get(r.day) ?? []), r]);
  return [...m.entries()];
}

function niceDay(ymd: string) {
  const d = new Date(`${ymd}T12:00:00Z`);
  return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" });
}
