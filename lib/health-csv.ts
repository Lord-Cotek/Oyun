import { prisma } from "@/lib/prisma";
import type { LogAccess } from "@/lib/health-log-db";
import { readingsBetween } from "@/lib/health-log-view";
import { localDay, zonedInstant } from "@/lib/medication";
import { daysIn } from "@/lib/health-report";
import { toCsv } from "@/lib/csv-cell";

export type CsvKind = "readings" | "doses";
const ymd = /^\d{4}-\d{2}-\d{2}$/;
const next = (d: string) => new Date(Date.parse(`${d}T00:00:00Z`) + 86_400_000).toISOString().slice(0, 10);

/** A period from the query string, checked and clipped to today — or why not. */
export function csvPeriod(from: string | null, to: string | null, tz: string, max = 400): { from: string; to: string } | { error: string } {
  const today = localDay(new Date(), tz);
  let f = from ?? "", t = to ?? "";
  if (!ymd.test(f) || !ymd.test(t) || f > t) return { error: "Choose a period" };
  if (t > today) t = today;
  if (f > t) f = t;
  if (daysIn({ from: f, to: t }).length > max) return { error: "Choose a shorter period" };
  return { from: f, to: t };
}

/**
 * Readings or doses as CSV text, in her time zone and units. `a` must carry
 * the mother's time zone (the report's rule: her days, whoever is reading).
 */
export async function healthCsv(a: LogAccess, kind: CsvKind, period: { from: string; to: string }): Promise<string> {
  const tz = a.timeZone;
  const start = zonedInstant(period.from, "00:00", tz);
  const end = zonedInstant(next(period.to), "00:00", tz);
  const dateFmt = new Intl.DateTimeFormat("en-CA", { year: "numeric", month: "2-digit", day: "2-digit", timeZone: tz });
  const timeFmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hourCycle: "h23", timeZone: tz });

  let rows: (string | number | null)[][];
  if (kind === "readings") {
    const rs = (await readingsBetween(a, start, end)).reverse();
    rows = [
      ["Date", "Time", "Reading", "When", "Value", "Also", "Details", "Flag", "Why flagged", "Note"],
      ...rs.map((r) => [r.day, r.time, r.kindLabel, r.slot ? r.slotLabel : "", r.main, r.other ?? "", r.extra ?? "", r.level === "none" || r.level === "ok" ? "" : r.level, r.reasons.join("; "), r.note ?? ""]),
    ];
  } else {
    const ds = await prisma.medicationDose.findMany({
      where: { journeyId: a.journeyId, dueAt: { gte: start, lt: end }, OR: [{ status: { not: "DUE" } }, { dueAt: { lt: new Date() } }] },
      orderBy: { dueAt: "asc" },
      include: { plan: { select: { name: true, strength: true, dose: true } } },
    });
    rows = [
      ["Date", "Due", "Medicine", "Dose", "Status", "Taken at", "Late", "Site", "Units", "Reason skipped", "Note"],
      ...ds.map((d) => [
        dateFmt.format(d.dueAt),
        timeFmt.format(d.dueAt),
        [d.plan.name, d.plan.strength].filter(Boolean).join(" "),
        d.plan.dose ?? "",
        d.status === "DUE" ? "Not marked" : d.status === "TAKEN" ? "Taken" : "Skipped",
        d.takenAt ? `${dateFmt.format(d.takenAt)} ${timeFmt.format(d.takenAt)}` : "",
        d.late ? "yes" : "",
        d.site ?? "",
        d.units ?? "",
        d.skipReason ?? "",
        d.note ?? "",
      ]),
    ];
  }
  return "﻿" + toCsv(rows);
}

/** The file response: named by kind and period, never by person; never cached. */
export function csvResponse(text: string, kind: CsvKind, period: { from: string; to: string }) {
  return new Response(text, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="health-${kind}-${period.from}-to-${period.to}.csv"`,
      "Cache-Control": "private, no-store, max-age=0",
      "X-Content-Type-Options": "nosniff",
      "X-Robots-Tag": "noindex",
    },
  });
}
