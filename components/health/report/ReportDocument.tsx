import type { Report } from "@/lib/health-report";
import { toMmol } from "@/lib/health-log";

const MARK: Record<string, string> = { high: "▲", low: "▼", urgent: "‼" };
const long = (ymd: string) => new Date(`${ymd}T12:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
const short = (ymd: string) => new Date(`${ymd}T12:00:00Z`).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" });

/**
 * The doctor's report — one document, the same on screen, on paper and
 * behind a link. Plain, black-and-white safe: anything out of range carries
 * a symbol (▲ high, ▼ low, ‼ act now) as well as a colour, so a photocopy
 * loses nothing. No app chrome; it is printed from here as it stands.
 */
export function ReportDocument({ r, fileBase }: { r: Report; fileBase: string }) {
  const h = r.header;
  return (
    <article className="health-report mx-auto max-w-[210mm] bg-white p-6 text-[13px] leading-snug text-black print:p-0">
      <style>{`
        @page { size: A4; margin: 14mm; }
        @media print { html, body { background: #fff !important; } }
        @media print { .health-report { max-width: none; } .hr-avoid { break-inside: avoid; } }
        .health-report table { width: 100%; border-collapse: collapse; }
        .health-report th, .health-report td { border: 1px solid #bbb; padding: 4px 6px; text-align: left; vertical-align: top; }
        .health-report th { background: #f2f2f2; font-weight: 600; }
        .hr-out { color: #b42318; font-weight: 600; }
        .hr-urgent { color: #b42318; font-weight: 700; }
      `}</style>

      <header className="hr-avoid border-b-2 border-black pb-3">
        <p className="text-[11px] uppercase tracking-[0.18em] text-neutral-600">Home health record — for the doctor</p>
        <h1 className="mt-1 text-2xl font-semibold">{h.name}</h1>
        <div className="mt-2 grid grid-cols-2 gap-x-6 gap-y-1 sm:grid-cols-3">
          {h.dob && <Fact k="Date of birth" v={long(h.dob)} />}
          <Fact k="Due date" v={long(h.due)} />
          {h.gaFrom && <Fact k="Gestation" v={h.gaFrom === h.gaTo ? h.gaFrom : `${h.gaFrom} → ${h.gaTo}`} />}
          <Fact k="Period" v={`${long(h.period.from)} – ${long(h.period.to)}`} />
          {h.clinic && <Fact k="Clinic / doctor" v={h.clinic} />}
          {h.bloodGroup && <Fact k="Blood group" v={h.bloodGroup} />}
          {h.allergies && <Fact k="Allergies" v={h.allergies} />}
          <Fact k="Generated" v={new Date(h.generated).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: h.tz })} />
        </div>
        <p className="mt-2 text-[11px] text-neutral-600">Times in {h.tz.replace(/_/g, " ")}. ▲ above target · ▼ below target · ‼ urgent sign.</p>
      </header>

      {r.empty && <p className="mt-6">Nothing was recorded in this period.</p>}

      {r.stats.length > 0 && (
        <Section title="Summary">
          <table>
            <thead>
              <tr><th>Reading</th><th>Count</th><th>Average</th><th>Lowest</th><th>Highest</th><th>Out of range</th><th>Target used</th></tr>
            </thead>
            <tbody>
              {r.stats.map((s) => (
                <tr key={s.label}>
                  <td>{s.label}</td>
                  <td>{s.count}</td>
                  <td>{s.avg ?? "—"}</td>
                  <td>{s.min ?? "—"}</td>
                  <td>{s.max ?? "—"}</td>
                  <td className={s.out ? "hr-out" : ""}>{s.out ? `${s.out} ▲` : "0"}</td>
                  <td>{s.target}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>
      )}

      {r.glucoseGrid.length > 0 && (
        <Section title={`Glucose by day (${h.units.glucose === "MMOL" ? "mmol/L" : "mg/dL"})`}>
          <table>
            <thead>
              <tr><th>Day</th><th>Fasting</th><th>After breakfast</th><th>After lunch</th><th>After dinner</th><th>Other</th></tr>
            </thead>
            <tbody>
              {r.glucoseGrid.map((row) => (
                <tr key={row.day}>
                  <td>{short(row.day)}{row.ga ? <span className="text-neutral-500"> · {row.ga.week}+{row.ga.day}</span> : null}</td>
                  <Cells c={row.fasting} />
                  <Cells c={row.breakfast} />
                  <Cells c={row.lunch} />
                  <Cells c={row.dinner} />
                  <Cells c={row.other} />
                </tr>
              ))}
            </tbody>
          </table>
        </Section>
      )}

      {r.bpGrid.length > 0 && (
        <Section title="Blood pressure by day (mmHg, pulse in brackets)">
          <table>
            <thead>
              <tr><th>Day</th><th>Morning</th><th>Evening</th></tr>
            </thead>
            <tbody>
              {r.bpGrid.map((row) => (
                <tr key={row.day}>
                  <td>{short(row.day)}{row.ga ? <span className="text-neutral-500"> · {row.ga.week}+{row.ga.day}</span> : null}</td>
                  <Cells c={row.morning} />
                  <Cells c={row.evening} />
                </tr>
              ))}
            </tbody>
          </table>
        </Section>
      )}

      {(r.trends.fasting.length > 1 || r.trends.postMeal.length > 1 || r.trends.bp.length > 1) && (
        <Section title="Trends">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {r.trends.fasting.length > 1 && (
              <Chart title="Fasting glucose" from={h.period.from} to={h.period.to} tz={h.tz} series={[{ pts: r.trends.fasting.map((p) => ({ t: p.t, v: conv(p.v, h.units.glucose), out: p.out })) }]} target={conv(r.trends.targets.glucoseFastingMax, h.units.glucose)} />
            )}
            {r.trends.postMeal.length > 1 && (
              <Chart title="Glucose after meals" from={h.period.from} to={h.period.to} tz={h.tz} series={[{ pts: r.trends.postMeal.map((p) => ({ t: p.t, v: conv(p.v, h.units.glucose), out: p.out })) }]} target={conv(r.trends.targets.glucose1hMax, h.units.glucose)} />
            )}
            {r.trends.bp.length > 1 && (
              <Chart
                title="Blood pressure (top and bottom)"
                from={h.period.from}
                to={h.period.to}
                tz={h.tz}
                series={[
                  { pts: r.trends.bp.map((p) => ({ t: p.t, v: p.sys, out: p.sys >= r.trends.targets.bpSysMax })) },
                  { pts: r.trends.bp.map((p) => ({ t: p.t, v: p.dia, out: p.dia >= r.trends.targets.bpDiaMax })), dashed: true },
                ]}
                target={r.trends.targets.bpSysMax}
                target2={r.trends.targets.bpDiaMax}
              />
            )}
          </div>
        </Section>
      )}

      {r.medicines.length > 0 && (
        <Section title="Medicines">
          <table>
            <thead>
              <tr><th>Medicine</th><th>Dose</th><th>Schedule</th><th>In this period</th></tr>
            </thead>
            <tbody>
              {r.medicines.map((m) => (
                <tr key={m.name}>
                  <td>{m.name}{m.stopped ? " (stopped)" : ""}</td>
                  <td>{m.dose || "—"}</td>
                  <td>{m.schedule}</td>
                  <td>
                    {m.asNeeded
                      ? `${m.log.length} taken`
                      : m.tally.due === 0
                        ? "None due yet in this period"
                        : `${m.tally.taken} of ${m.tally.due} taken${m.tally.late ? ` · ${m.tally.late} late` : ""}${m.tally.skipped ? ` · ${m.tally.skipped} skipped` : ""}${m.tally.missing ? ` · ${m.tally.missing} not recorded` : ""}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {r.medicines.filter((m) => m.injected && m.log.some((l) => l.site || l.units != null)).map((m) => (
            <div key={`${m.name}-log`} className="hr-avoid mt-3">
              <p className="font-semibold">{m.name} — injection log</p>
              <table>
                <thead>
                  <tr><th>When</th><th>Status</th><th>Site</th><th>Units</th></tr>
                </thead>
                <tbody>
                  {m.log.map((l, i) => (
                    <tr key={i}>
                      <td>{l.when}</td>
                      <td className={l.status === "not recorded" || l.status.startsWith("skipped") ? "hr-out" : ""}>{l.status}</td>
                      <td>{l.site ?? "—"}</td>
                      <td>{l.units ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </Section>
      )}

      {/* Only what was actually done in the period. What is "due" is a
          typical schedule's guess, not her record, and has no place in a
          report for her doctor. */}
      {r.testsDone.length > 0 && (
        <Section title="Tests and vaccines">
          <table>
            <thead>
              <tr><th>Done in this period</th><th>Date</th><th>Result</th></tr>
            </thead>
            <tbody>
              {r.testsDone.map((t) => (
                <tr key={t.title + t.doneOn}>
                  <td>{t.title}</td>
                  <td>{long(t.doneOn)}</td>
                  <td>{t.result ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>
      )}

      {r.notes.length > 0 && (
        <Section title="Symptoms and notes">
          <table>
            <thead>
              <tr><th>When</th><th>What</th><th>Note</th></tr>
            </thead>
            <tbody>
              {r.notes.map((n, i) => (
                <tr key={i}>
                  <td>{n.when}</td>
                  <td className={n.urgent ? "hr-urgent" : ""}>{n.urgent ? "‼ " : ""}{n.what}</td>
                  <td>{n.note ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>
      )}

      {r.photos.length > 0 && (
        <Section title="Photo appendix">
          <div className="grid grid-cols-3 gap-3">
            {r.photos.map((p) =>
              p.contentType === "application/pdf" ? (
                <a key={p.id} href={`${fileBase}${p.id}`} className="hr-avoid block border border-neutral-300 p-2 text-[11px] underline">
                  PDF — {p.label}
                </a>
              ) : (
                <figure key={p.id} className="hr-avoid">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`${fileBase}${p.id}`} alt={p.label} className="aspect-square w-full border border-neutral-300 object-cover" />
                  <figcaption className="mt-1 text-[10px] text-neutral-600">{p.label}</figcaption>
                </figure>
              ),
            )}
          </div>
        </Section>
      )}

      <footer className="mt-8 border-t border-neutral-400 pt-2 text-[11px] text-neutral-700">
        Recorded at home by the patient&rsquo;s household. Not a diagnosis. Targets are those the household entered from their doctor&rsquo;s advice, or common defaults where none were entered.
      </footer>
    </article>
  );
}

const conv = (mgdl: number, unit: string) => (unit === "MMOL" ? Math.round(toMmol(mgdl) * 10) / 10 : Math.round(mgdl));

function Fact({ k, v }: { k: string; v: string }) {
  return (
    <p>
      <span className="text-[10px] uppercase tracking-wider text-neutral-500">{k}</span>
      <br />
      {v}
    </p>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-6">
      <h2 className="hr-avoid mb-2 border-b border-neutral-400 pb-1 text-[15px] font-semibold">{title}</h2>
      {children}
    </section>
  );
}

function Cells({ c }: { c: { text: string; level: string }[] }) {
  return (
    <td>
      {c.length === 0
        ? "—"
        : c.map((x, i) => (
            <span key={i} className={x.level === "urgent" ? "hr-urgent" : x.level === "high" || x.level === "low" ? "hr-out" : ""}>
              {i > 0 && ", "}
              {x.text}
              {MARK[x.level] ? ` ${MARK[x.level]}` : ""}
            </span>
          ))}
    </td>
  );
}

/**
 * A small line chart as plain SVG: dots in range, filled squares out of
 * range (a shape, not only a colour), a dashed target line, first and last
 * day along the bottom. Drawn on the server so it prints exactly as seen.
 */
function Chart({
  title,
  series,
  target,
  target2,
  from,
  to,
  tz,
}: {
  title: string;
  series: { pts: { t: string; v: number; out: boolean }[]; dashed?: boolean }[];
  target?: number;
  target2?: number;
  from: string;
  to: string;
  tz: string;
}) {
  const W = 320, H = 150, L = 36, R = 8, T = 10, B = 22;
  const t0 = Date.parse(`${from}T00:00:00Z`) - 86_400_000 / 2, t1 = Date.parse(`${to}T23:59:59Z`) + 86_400_000 / 2;
  const all = series.flatMap((s) => s.pts.map((p) => p.v)).concat([target ?? NaN, target2 ?? NaN].filter((x) => !Number.isNaN(x)));
  let lo = Math.min(...all), hi = Math.max(...all);
  const pad = (hi - lo) * 0.15 || 5;
  lo = Math.floor(lo - pad);
  hi = Math.ceil(hi + pad);
  const x = (t: string) => L + ((Date.parse(t) - t0) / (t1 - t0)) * (W - L - R);
  const y = (v: number) => T + (1 - (v - lo) / (hi - lo)) * (H - T - B);
  const ticks = [lo, Math.round((lo + hi) / 2), hi];
  void tz;
  return (
    <figure className="hr-avoid">
      <figcaption className="mb-1 font-semibold">{title}</figcaption>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label={title} className="border border-neutral-300">
        <rect x="0" y="0" width={W} height={H} fill="#fff" />
        {ticks.map((v) => (
          <g key={v}>
            <line x1={L} x2={W - R} y1={y(v)} y2={y(v)} stroke="#e5e5e5" />
            <text x={L - 4} y={y(v) + 3} fontSize="9" textAnchor="end" fill="#555">{v}</text>
          </g>
        ))}
        {[target, target2].filter((v): v is number => typeof v === "number").map((v) => (
          <g key={`t${v}`}>
            <line x1={L} x2={W - R} y1={y(v)} y2={y(v)} stroke="#b42318" strokeDasharray="4 3" strokeWidth="1" />
            <text x={W - R} y={y(v) - 3} fontSize="8" textAnchor="end" fill="#b42318">target {v}</text>
          </g>
        ))}
        {series.map((s, si) => (
          <g key={si}>
            <polyline fill="none" stroke="#111" strokeWidth="1.4" strokeDasharray={s.dashed ? "3 2" : undefined} points={s.pts.map((p) => `${x(p.t)},${y(p.v)}`).join(" ")} />
            {s.pts.map((p, i) =>
              p.out ? (
                <rect key={i} x={x(p.t) - 3} y={y(p.v) - 3} width="6" height="6" fill="#b42318" stroke="#000" strokeWidth="0.6" />
              ) : (
                <circle key={i} cx={x(p.t)} cy={y(p.v)} r="2.6" fill="#fff" stroke="#111" strokeWidth="1.2" />
              ),
            )}
          </g>
        ))}
        <text x={L} y={H - 6} fontSize="9" fill="#555">{short(from)}</text>
        <text x={W - R} y={H - 6} fontSize="9" textAnchor="end" fill="#555">{short(to)}</text>
      </svg>
    </figure>
  );
}
