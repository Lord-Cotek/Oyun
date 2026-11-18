import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getActiveMembership } from "@/lib/data";
import { logAccess } from "@/lib/health-log-db";
import { readingsBetween } from "@/lib/health-log-view";
import { localDay, zonedInstant } from "@/lib/medication";
import { motherTimeZone } from "@/lib/medication-db";
import { daysIn } from "@/lib/health-report";
import { toCsv } from "@/lib/csv-cell";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ymd = /^\d{4}-\d{2}-\d{2}$/;
const next = (d: string) => new Date(Date.parse(`${d}T00:00:00Z`) + 86_400_000).toISOString().slice(0, 10);

/**
 * The raw numbers, for a doctor's spreadsheet or her own records: readings
 * or doses, for the period on the report. Only to someone the log is open
 * to, in her own time zone and units, and never named after anybody.
 */
export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return new Response("Not found", { status: 404 });
  const active = await getActiveMembership(session.user.id);
  if (!active) return new Response("Not found", { status: 404 });
  const base = await logAccess(session.user.id, active.journey.id);
  if (!base) return new Response("Not found", { status: 404 });

  const u = new URL(req.url);
  const kind = u.searchParams.get("kind") === "doses" ? "doses" : "readings";
  const tz = await motherTimeZone(base.journeyId);
  const today = localDay(new Date(), tz);
  let from = u.searchParams.get("from") ?? "";
  let to = u.searchParams.get("to") ?? "";
  if (!ymd.test(from) || !ymd.test(to) || from > to) return new Response("Choose a period", { status: 400 });
  if (to > today) to = today;
  if (from > to) from = to;
  if (daysIn({ from, to }).length > 400) return new Response("Choose a shorter period", { status: 400 });

  const a = { ...base, timeZone: tz };
  const start = zonedInstant(from, "00:00", tz);
  const end = zonedInstant(next(to), "00:00", tz);
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

  return new Response("﻿" + toCsv(rows), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="health-${kind}-${from}-to-${to}.csv"`,
      "Cache-Control": "private, no-store, max-age=0",
      "X-Content-Type-Options": "nosniff",
      "X-Robots-Tag": "noindex",
    },
  });
}
