import { prisma } from "@/lib/prisma";
import { readingsBetween, type ReadingView } from "@/lib/health-log-view";
import { filesFor, logAccess, type LogAccess } from "@/lib/health-log-db";
import { cleanUnits, gestationOn, glucoseMax, readTargets, showGlucose, showWeight, symptomLabel } from "@/lib/health-log";
import { adherence, localDay, scheduleSummary, zonedInstant } from "@/lib/medication";
import { ensureDoses, motherTimeZone } from "@/lib/medication-db";
import { loadChecklist } from "@/lib/prenatal-db";

/**
 * Everything a doctor's report holds, for one journey and one period.
 *
 * Built the same way whether the mother is looking at it in the app or a
 * doctor has opened her link — the only difference is who was allowed in.
 * Days are hers: the period and every row are counted in the mother's own
 * time zone, whoever is reading.
 */

export type Period = { from: string; to: string };

const shift = (ymd: string, n: number) => new Date(Date.parse(`${ymd}T12:00:00Z`) + n * 86_400_000).toISOString().slice(0, 10);
export function daysIn(p: Period): string[] {
  const out: string[] = [];
  for (let d = p.from; d <= p.to && out.length < 400; d = shift(d, 1)) out.push(d);
  return out;
}

/** "This week" and the rest, as the builder offers them — ending today, in her days. */
export function presetPeriod(preset: string, today: string, since?: string | null): Period {
  if (preset === "2w") return { from: shift(today, -13), to: today };
  if (preset === "4w") return { from: shift(today, -27), to: today };
  if (preset === "since" && since && /^\d{4}-\d{2}-\d{2}$/.test(since) && since <= today) return { from: since, to: today };
  return { from: shift(today, -6), to: today };
}

type Stat = { label: string; count: number; avg: string | null; min: string | null; max: string | null; out: number; target: string };

/**
 * A stand-in for the mother's own access — the report reads her log, in her
 * time zone, with her targets, whoever asked for it.
 */
export async function asMother(journeyId: string): Promise<LogAccess> {
  const j = await prisma.journey.findUnique({ where: { id: journeyId }, select: { ownerId: true } });
  const a = await logAccess(j!.ownerId, journeyId);
  return { ...a!, timeZone: await motherTimeZone(journeyId) };
}

export async function buildReport(journeyId: string, period: Period, opts: { photos: boolean; dob?: string | null; clinic?: string | null }) {
  const a = await asMother(journeyId);
  const tz = a.timeZone;
  const start = zonedInstant(period.from, "00:00", tz);
  const end = zonedInstant(shift(period.to, 1), "00:00", tz);
  const now = new Date();
  const days = daysIn(period);

  const [journey, card, settings] = await Promise.all([
    prisma.journey.findUnique({ where: { id: journeyId }, select: { dueDate: true, owner: { select: { name: true } } } }),
    prisma.healthRecord.findFirst({ where: { journeyId, user: { memberships: { some: { journeyId, role: "MOTHER" } } } }, select: { careProvider: true, bloodGroup: true, genotype: true, allergies: true } }),
    prisma.healthLogSettings.findUnique({ where: { journeyId } }),
  ]);
  const units = cleanUnits(settings);
  const { targets } = readTargets(settings?.targets);
  const readings = (await readingsBetween(a, start, end)).slice().reverse(); // oldest first
  const gaOf = (day: string) => gestationOn(journey!.dueDate, zonedInstant(day, "12:00", tz));
  const g = (v: number) => showGlucose(v, units).main;

  /* ── Summary ── */
  const stats: Stat[] = [];
  const glu = readings.filter((r) => r.kind === "GLUCOSE");
  const groups: [string, (r: ReadingView) => boolean, string][] = [
    ["Glucose — fasting", (r) => r.slot === "FASTING", `under ${g(targets.glucoseFastingMax)}`],
    ["Glucose — 1 hour after meals", (r) => !!r.slot?.startsWith("AFTER_") && r.raw.valueB !== 120, `under ${g(targets.glucose1hMax)}`],
    ["Glucose — 2 hours after meals", (r) => !!r.slot?.startsWith("AFTER_") && r.raw.valueB === 120, `under ${g(targets.glucose2hMax)}`],
    ["Glucose — bedtime / other", (r) => r.slot === "BEDTIME" || r.slot === "OTHER", `not below ${g(targets.glucoseLow)}`],
  ];
  for (const [label, pick, target] of groups) {
    const rs = glu.filter(pick);
    if (!rs.length) continue;
    const vs = rs.map((r) => r.raw.valueA ?? 0);
    stats.push({ label, count: rs.length, avg: g(vs.reduce((x, y) => x + y, 0) / vs.length), min: g(Math.min(...vs)), max: g(Math.max(...vs)), out: rs.filter((r) => r.level === "high" || r.level === "low" || r.level === "urgent").length, target });
  }
  const bp = readings.filter((r) => r.kind === "BP");
  if (bp.length) {
    const sys = bp.map((r) => r.raw.valueA ?? 0), dia = bp.map((r) => r.raw.valueB ?? 0);
    const avg = (xs: number[]) => Math.round(xs.reduce((x, y) => x + y, 0) / xs.length);
    stats.push({ label: "Blood pressure", count: bp.length, avg: `${avg(sys)}/${avg(dia)}`, min: `${Math.min(...sys)}/${Math.min(...dia)}`, max: `${Math.max(...sys)}/${Math.max(...dia)}`, out: bp.filter((r) => r.level === "high" || r.level === "urgent").length, target: `under ${targets.bpSysMax}/${targets.bpDiaMax}` });
  }
  const wt = readings.filter((r) => r.kind === "WEIGHT");
  if (wt.length) {
    const first = wt[0].raw.valueA ?? 0, last = wt[wt.length - 1].raw.valueA ?? 0;
    const diff = last - first;
    stats.push({ label: "Weight", count: wt.length, avg: null, min: showWeight(first, units), max: showWeight(last, units), out: 0, target: wt.length > 1 ? `change ${diff >= 0 ? "+" : "−"}${showWeight(Math.abs(diff), units)}` : "—" });
  }
  const temps = readings.filter((r) => r.kind === "TEMP");
  if (temps.length) stats.push({ label: "Temperature", count: temps.length, avg: null, min: null, max: temps.map((r) => r.main).sort().pop() ?? null, out: temps.filter((r) => r.level === "urgent").length, target: "under 38 °C" });
  const mv = readings.filter((r) => r.kind === "MOVEMENTS");
  if (mv.length) stats.push({ label: "Baby's movements", count: mv.length, avg: null, min: null, max: null, out: mv.filter((r) => r.level === "urgent").length, target: "fewer than usual flagged" });

  /* ── Daily grids ── */
  const byDay = new Map<string, ReadingView[]>();
  for (const r of readings) byDay.set(r.day, [...(byDay.get(r.day) ?? []), r]);
  const cell = (rs: ReadingView[]) => (rs.length ? rs.map((r) => ({ text: r.kind === "BP" ? `${r.raw.valueA}/${r.raw.valueB}${r.raw.valueC ? ` (${r.raw.valueC})` : ""}` : r.main.replace(/ mg\/dL| mmol\/L/, ""), level: r.level })) : []);
  const glucoseGrid = days
    .map((day) => {
      const rs = (byDay.get(day) ?? []).filter((r) => r.kind === "GLUCOSE");
      return { day, ga: gaOf(day), fasting: cell(rs.filter((r) => r.slot === "FASTING")), breakfast: cell(rs.filter((r) => r.slot === "AFTER_BREAKFAST")), lunch: cell(rs.filter((r) => r.slot === "AFTER_LUNCH")), dinner: cell(rs.filter((r) => r.slot === "AFTER_DINNER")), other: cell(rs.filter((r) => r.slot === "BEDTIME" || r.slot === "OTHER")) };
    })
    .filter((row) => row.fasting.length || row.breakfast.length || row.lunch.length || row.dinner.length || row.other.length);
  const bpGrid = days
    .map((day) => {
      const rs = (byDay.get(day) ?? []).filter((r) => r.kind === "BP");
      return { day, ga: gaOf(day), morning: cell(rs.filter((r) => r.slot === "MORNING")), evening: cell(rs.filter((r) => r.slot !== "MORNING")) };
    })
    .filter((row) => row.morning.length || row.evening.length);

  /* ── Trends ── */
  const trends = {
    fasting: glu.filter((r) => r.slot === "FASTING").map((r) => ({ t: r.takenAt, v: r.raw.valueA ?? 0, out: r.level !== "ok" && r.level !== "none" })),
    postMeal: glu.filter((r) => r.slot?.startsWith("AFTER_")).map((r) => ({ t: r.takenAt, v: r.raw.valueA ?? 0, out: r.level !== "ok" && r.level !== "none", max: glucoseMax(r.slot, r.raw.valueB, targets) })),
    bp: bp.map((r) => ({ t: r.takenAt, sys: r.raw.valueA ?? 0, dia: r.raw.valueB ?? 0 })),
    glucoseUnit: units.glucose,
    targets,
  };

  /* ── Medicines ── */
  await ensureDoses(journeyId, period.from, localDay(now, tz) < period.to ? localDay(now, tz) : period.to, tz);
  const plans = await prisma.medicationPlan.findMany({
    where: { journeyId, startOn: { lte: new Date(`${period.to}T00:00:00Z`) }, OR: [{ endOn: null }, { endOn: { gte: new Date(`${period.from}T00:00:00Z`) } }] },
    orderBy: { createdAt: "asc" },
    include: { doses: { where: { dueAt: { gte: start, lt: end } }, orderBy: { dueAt: "asc" } } },
  });
  const fmtT = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: tz });
  const medicines = plans
    .filter((p) => !p.stoppedAt || p.stoppedAt >= start)
    .map((p) => ({
      name: p.name,
      dose: [p.strength, p.dose, p.route].filter(Boolean).join(" · "),
      schedule: scheduleSummary({ scheduleKind: p.scheduleKind, times: p.times, everyDays: p.everyDays, startOn: "", endOn: null }),
      stopped: !!p.stoppedAt,
      asNeeded: p.scheduleKind === "AS_NEEDED",
      tally: adherence(p.doses, now),
      log: p.doses
        .filter((d) => d.status !== "DUE" || d.dueAt < now)
        .map((d) => ({
          when: fmtT.format(d.takenAt ?? d.dueAt),
          status: d.status === "TAKEN" ? (d.late ? "taken late" : "taken") : d.status === "SKIPPED" ? `skipped${d.skipReason ? ` — ${d.skipReason}` : ""}` : "not recorded",
          site: d.site,
          units: d.units,
        })),
      injected: p.form === "INJECTION" || p.form === "INSULIN",
    }));

  /* ── Tests ── */
  const checklist = await loadChecklist(a);
  const testsDone = [...checklist.items, ...checklist.hidden].filter((i) => i.doneOn && i.doneOn >= period.from && i.doneOn <= period.to).map((i) => ({ title: i.title, doneOn: i.doneOn!, result: [i.resultValue, i.result].filter(Boolean).join(" — ") || null }));

  /* ── Symptoms and notes ── */
  const notes = readings
    .filter((r) => r.kind === "SYMPTOMS" || r.note)
    .map((r) => ({
      when: `${r.day} ${r.time}`,
      what: r.kind === "SYMPTOMS" ? `${((r.raw.detail as { list?: string[] })?.list ?? []).map(symptomLabel).join(", ")}${(r.raw.detail as { severity?: string })?.severity ? ` (${String((r.raw.detail as { severity?: string }).severity).toLowerCase()})` : ""}` : `${r.kindLabel} ${r.main}`,
      note: r.note,
      urgent: r.level === "urgent",
    }));

  /* ── Photos ── */
  let photos: { id: string; contentType: string; label: string }[] = [];
  if (opts.photos) {
    const rf = await filesFor("reading", readings.map((r) => r.id));
    const doseIds = plans.flatMap((p) => p.doses.map((d) => d.id));
    const df = await filesFor("dose", doseIds);
    const checks = await prisma.prenatalCheck.findMany({ where: { journeyId, doneOn: { gte: new Date(`${period.from}T00:00:00Z`), lte: new Date(`${period.to}T00:00:00Z`) } }, select: { id: true } });
    const cf = await filesFor("check", checks.map((c) => c.id));
    for (const r of readings) for (const f of rf.get(r.id) ?? []) photos.push({ ...f, label: `${r.day} ${r.time} · ${r.kindLabel} ${r.main}` });
    for (const p of plans) for (const d of p.doses) for (const f of df.get(d.id) ?? []) photos.push({ ...f, label: `${fmtT.format(d.takenAt ?? d.dueAt)} · ${p.name}` });
    for (const i of checklist.items) if (i.id) for (const f of cf.get(i.id) ?? []) photos.push({ ...f, label: `${i.doneOn} · ${i.title}` });
    photos = photos.slice(0, 60);
  }

  const gaFrom = gaOf(period.from), gaTo = gaOf(period.to);
  return {
    header: {
      name: journey!.owner.name?.trim() || "—",
      dob: opts.dob && /^\d{4}-\d{2}-\d{2}$/.test(opts.dob) ? opts.dob : null,
      due: journey!.dueDate.toISOString().slice(0, 10),
      gaFrom: gaFrom ? `${gaFrom.week}+${gaFrom.day}` : null,
      gaTo: gaTo ? `${gaTo.week}+${gaTo.day}` : null,
      clinic: opts.clinic?.trim() || card?.careProvider || null,
      bloodGroup: card?.bloodGroup ?? null,
      allergies: card?.allergies ?? null,
      period,
      generated: new Date().toISOString(),
      tz,
      units,
    },
    stats,
    glucoseGrid,
    bpGrid,
    trends,
    medicines,
    testsDone,
    notes,
    photos,
    empty: readings.length === 0 && medicines.length === 0 && testsDone.length === 0,
  };
}

export type Report = Awaited<ReturnType<typeof buildReport>>;

/** Is this file part of what a report link shows? Its entry must fall in the period. */
export async function fileInReport(file: { journeyId: string; entryType: string | null; entryId: string | null }, link: { journeyId: string; fromDay: Date; toDay: Date; withPhotos: boolean }): Promise<boolean> {
  if (!link.withPhotos || file.journeyId !== link.journeyId || !file.entryId) return false;
  const tz = await motherTimeZone(link.journeyId);
  const from = zonedInstant(link.fromDay.toISOString().slice(0, 10), "00:00", tz);
  const to = zonedInstant(shift(link.toDay.toISOString().slice(0, 10), 1), "00:00", tz);
  if (file.entryType === "reading") return !!(await prisma.healthReading.findFirst({ where: { id: file.entryId, journeyId: link.journeyId, takenAt: { gte: from, lt: to } }, select: { id: true } }));
  if (file.entryType === "dose") return !!(await prisma.medicationDose.findFirst({ where: { id: file.entryId, journeyId: link.journeyId, dueAt: { gte: from, lt: to } }, select: { id: true } }));
  if (file.entryType === "check") return !!(await prisma.prenatalCheck.findFirst({ where: { id: file.entryId, journeyId: link.journeyId, doneOn: { gte: link.fromDay, lte: link.toDay } }, select: { id: true } }));
  return false;
}
