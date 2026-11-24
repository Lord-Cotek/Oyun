import { prisma } from "@/lib/prisma";
import { makeZip, type ZipEntry } from "@/lib/zip";
import { toCsv } from "@/lib/csv-cell";
import { asMother } from "@/lib/health-report";
import { healthCsv } from "@/lib/health-csv";
import { loadChecklist } from "@/lib/prenatal-db";
import { localDay, scheduleSummary } from "@/lib/medication";
import { readHealthFile } from "@/lib/health-file-stream";

/** Enough for a pregnancy's photos of reports; more than this and the README says so. */
const MAX_FILES = 300;
const MAX_BYTES = 150 * 1024 * 1024;
const EXT: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "application/pdf": "pdf" };

/**
 * Her whole health log as one ZIP: readings, doses, medicines and the tests
 * checklist as spreadsheets, and every photo and PDF she kept with them.
 * In her time zone and units. Named by date, never by person.
 */
export async function buildHealthExport(journeyId: string): Promise<{ filename: string; body: Buffer }> {
  const a = await asMother(journeyId);
  const tz = a.timeZone;
  const today = localDay(new Date(), tz);
  const first = await prisma.healthReading.findFirst({ where: { journeyId }, orderBy: { takenAt: "asc" }, select: { takenAt: true } });
  const firstDose = await prisma.medicationDose.findFirst({ where: { journeyId }, orderBy: { dueAt: "asc" }, select: { dueAt: true } });
  const fromOf = (d: Date | undefined) => (d ? localDay(d, tz) : today);
  const readingsFrom = fromOf(first?.takenAt);
  const dosesFrom = fromOf(firstDose?.dueAt);

  const [plans, checklist, files, contractions, moods] = await Promise.all([
    prisma.medicationPlan.findMany({ where: { journeyId }, orderBy: { createdAt: "asc" } }),
    loadChecklist(a),
    prisma.healthFile.findMany({ where: { journeyId, entryId: { not: null } }, orderBy: { createdAt: "asc" } }),
    prisma.contraction.findMany({ where: { journeyId }, orderBy: { startedAt: "asc" } }),
    // Hers alone: only the mother can make this download (asMother above).
    prisma.moodCheck.findMany({ where: { journeyId, userId: a.userId }, orderBy: { takenAt: "asc" } }),
  ]);
  const ymd = (d: Date | null) => (d ? d.toISOString().slice(0, 10) : "");

  const entries: ZipEntry[] = [
    { name: "readings.csv", data: await healthCsv(a, "readings", { from: readingsFrom, to: today }) },
    { name: "doses.csv", data: await healthCsv(a, "doses", { from: dosesFrom, to: today }) },
    {
      name: "medicines.csv",
      data:
        "﻿" +
        toCsv([
          ["Medicine", "Form", "Strength", "Dose", "Route", "Schedule", "From", "Until", "Stopped", "Prescribed by", "Notes"],
          ...plans.map((p) => [p.name, p.form, p.strength ?? "", p.dose ?? "", p.route ?? "", scheduleSummary({ scheduleKind: p.scheduleKind, times: p.times, everyDays: p.everyDays, startOn: ymd(p.startOn), endOn: p.endOn ? ymd(p.endOn) : null }), ymd(p.startOn), ymd(p.endOn), p.stoppedAt ? localDay(p.stoppedAt, tz) : "", p.prescribedBy ?? "", p.notes ?? ""]),
        ]),
    },
    {
      name: "tests.csv",
      data:
        "﻿" +
        toCsv([
          ["Test", "Usual window", "On my list", "Done on", "Result", "Number", "Appointment", "Notes"],
          ...[...checklist.items, ...checklist.hidden].map((i) => [i.title, i.label, i.hidden ? "no — not doing" : "yes", i.doneOn ?? "", i.result ?? "", i.resultValue ?? "", i.appointment?.label ?? "", i.notes ?? ""]),
        ]),
    },
  ];

  // Only when there is something in it: most downloads are made long before labour.
  if (contractions.length > 0) {
    entries.push({
      name: "contractions.csv",
      data:
        "﻿" +
        toCsv([
          ["Began (UTC)", "Eased (UTC)", "Lasted (seconds)"],
          ...contractions.map((c) => [
            c.startedAt.toISOString(),
            c.endedAt?.toISOString() ?? "",
            c.endedAt ? String(Math.round((c.endedAt.getTime() - c.startedAt.getTime()) / 1000)) : "",
          ]),
        ]),
    });
  }

  if (moods.length > 0) {
    entries.push({
      name: "mood-checks.csv",
      data:
        "﻿" +
        toCsv([
          ["Taken (UTC)", "Low mood (PHQ-9, of 27)", "Worry (GAD-2, of 6)", "Thoughts of self-harm (0 to 3)", "Shown to my doctor"],
          ...moods.map((m) => [m.takenAt.toISOString(), String(m.low), String(m.worry), String(m.selfHarm), m.forDoctorAt ? "yes" : "no"]),
        ]),
    });
  }

  let bytes = 0, kept = 0, missing = 0, skipped = 0;
  for (const f of files) {
    if (kept >= MAX_FILES || bytes + f.size > MAX_BYTES) {
      skipped++;
      continue;
    }
    const buf = await readHealthFile(f);
    if (!buf) {
      missing++;
      continue;
    }
    bytes += buf.length;
    kept++;
    entries.push({ name: `files/${localDay(f.createdAt, tz)}-${f.entryType ?? "file"}-${f.id.slice(-8)}.${EXT[f.contentType] ?? "bin"}`, data: buf });
  }

  entries.unshift({
    name: "README.txt",
    data: [
      "Your health log from Oyun",
      "",
      `Made ${today}. Times are in ${tz.replace(/_/g, " ")}.`,
      "",
      "readings.csv   every reading: glucose, blood pressure, weight, temperature, movements, symptoms, urine",
      "doses.csv      every scheduled or logged dose, and whether it was taken",
      "medicines.csv  the medicines you added, with their schedules",
      "tests.csv      the tests and vaccines checklist, with dates and results",
      ...(contractions.length > 0 ? ["contractions.csv  each contraction you timed: when it began, when it eased, how long it lasted"] : []),
      ...(moods.length > 0 ? ["mood-checks.csv  the mood check results you chose to keep"] : []),
      `files/         ${kept === 1 ? "1 photo or PDF" : `${kept} photos and PDFs`} you kept with your entries (named by date and what they belong to)`,
      ...(missing ? ["", `${missing} file${missing === 1 ? " was" : "s were"} no longer in storage and could not be included.`] : []),
      ...(skipped ? ["", `${skipped} file${skipped === 1 ? " was" : "s were"} left out to keep this download a manageable size. Open each entry in the app to see them.`] : []),
      "",
      "The spreadsheets open in Excel, Numbers or Google Sheets.",
      "This is a record kept at home, not a diagnosis.",
      "",
    ].join("\r\n"),
  });

  return { filename: `oyun-health-log-${today}.zip`, body: makeZip(entries) };
}

/**
 * Her whole health log, gone: readings, medicines and doses, the checklist,
 * report links (and who opened them), reminders sent, her settings — and
 * every photo and PDF, from storage as well as from the list. The health
 * cards are a separate thing and stay.
 */
export async function deleteHealthLog(journeyId: string) {
  const files = await prisma.healthFile.findMany({ where: { journeyId }, select: { url: true } });
  if (files.length && process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { del } = await import("@vercel/blob");
      for (let i = 0; i < files.length; i += 100) await del(files.slice(i, i + 100).map((f) => f.url));
    } catch {
      // Storage hiccup: the rows go anyway, and the daily sweep has nothing
      // left to point at them. The addresses were never public.
    }
  }
  await prisma.$transaction([
    prisma.healthFile.deleteMany({ where: { journeyId } }),
    prisma.healthReading.deleteMany({ where: { journeyId } }),
    prisma.contraction.deleteMany({ where: { journeyId } }),
    // Her kept mood checks are hers and are part of what she is asking to be gone.
    prisma.moodCheck.deleteMany({ where: { journeyId } }),
    prisma.medicationDose.deleteMany({ where: { journeyId } }),
    prisma.medicationPlan.deleteMany({ where: { journeyId } }),
    prisma.prenatalCheck.deleteMany({ where: { journeyId } }),
    prisma.healthReportLink.deleteMany({ where: { journeyId } }),
    prisma.healthCheckSent.deleteMany({ where: { journeyId } }),
    prisma.healthLogSettings.deleteMany({ where: { journeyId } }),
  ]);
  return { files: files.length };
}
