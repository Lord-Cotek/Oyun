import { prisma } from "@/lib/prisma";
import { computePosition } from "@/lib/stage";
import { filesFor, type LogAccess } from "@/lib/health-log-db";
import { carriesVariant, isRhesusNegative } from "@/lib/health-card";
import { itemsFor, order, statusOf, weeksLabel, type Facts, type Stage, type Status } from "@/lib/prenatal";
import { CONDITIONALS, EVERY_VISIT, SCHEDULE } from "@/data/prenatal-schedule";

/** What the health cards say that changes the checklist. */
export async function checklistFacts(journeyId: string): Promise<Facts> {
  const members = await prisma.membership.findMany({ where: { journeyId, role: { in: ["MOTHER", "PARTNER"] } }, select: { userId: true, role: true } });
  const cards = await prisma.healthRecord.findMany({ where: { journeyId, userId: { in: members.map((m) => m.userId) } }, select: { userId: true, bloodGroup: true, genotype: true } });
  const roleOf = new Map(members.map((m) => [m.userId, m.role]));
  const mum = cards.find((c) => roleOf.get(c.userId!) === "MOTHER");
  const dad = cards.find((c) => roleOf.get(c.userId!) === "PARTNER");
  return { rhNegative: isRhesusNegative(mum?.bloodGroup), bothCarriers: carriesVariant(mum?.genotype) && carriesVariant(dad?.genotype) };
}

export async function stageOf(journeyId: string): Promise<Stage> {
  const j = await prisma.journey.findUnique({ where: { id: journeyId }, select: { dueDate: true } });
  const pos = computePosition(j!.dueDate);
  if (!pos.born) return { born: false, week: pos.week ?? 0 };
  return { born: true, weeksAfter: Math.floor((Date.now() - j!.dueDate.getTime()) / (7 * 86_400_000)) };
}

export type CheckView = {
  /** Template key, or null for one the family added. */
  key: string | null;
  /** The row's id, once there is one. */
  id: string | null;
  title: string;
  category: string;
  weeks: [number, number] | null;
  afterBirth: [number, number] | null;
  label: string;
  note: string | null;
  optional: boolean;
  status: Status;
  doneOn: string | null;
  result: string | null;
  resultValue: string | null;
  appointment: { id: string; label: string } | null;
  hidden: boolean;
  notes: string | null;
  custom: boolean;
  files: { id: string; contentType: string }[];
};

/** The whole checklist for this family, merged and sorted. */
export async function loadChecklist(a: LogAccess) {
  const [facts, stage, rows, appts] = await Promise.all([
    checklistFacts(a.journeyId),
    stageOf(a.journeyId),
    prisma.prenatalCheck.findMany({ where: { journeyId: a.journeyId } }),
    prisma.appointment.findMany({
      where: { journeyId: a.journeyId, cancelledAt: null },
      orderBy: { at: "desc" },
      take: 40,
      select: { id: true, at: true, title: true, kind: true },
    }),
  ]);
  const apptLabel = (x: (typeof appts)[number]) =>
    `${x.at.toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: a.timeZone })} · ${x.title ?? x.kind.charAt(0) + x.kind.slice(1).toLowerCase()}`;
  const apptById = new Map(appts.map((x) => [x.id, apptLabel(x)]));
  const byKey = new Map(rows.filter((r) => r.key).map((r) => [r.key!, r]));
  const files = await filesFor("check", rows.map((r) => r.id));
  const day = (d: Date | null) => (d ? d.toISOString().slice(0, 10) : null);

  const fromRow = (r: (typeof rows)[number] | undefined) => ({
    id: r?.id ?? null,
    doneOn: day(r?.doneOn ?? null),
    result: r?.result ?? null,
    resultValue: r?.resultValue ?? null,
    appointment: r?.appointmentId && apptById.has(r.appointmentId) ? { id: r.appointmentId, label: apptById.get(r.appointmentId)! } : null,
    hidden: r?.hidden ?? false,
    notes: r?.notes ?? null,
    files: r ? files.get(r.id) ?? [] : [],
  });

  const list: CheckView[] = itemsFor(a.conditions, facts).map((i) => {
    const r = byKey.get(i.key);
    const weeks: [number, number] | null = r?.weekFrom != null && r?.weekTo != null ? [r.weekFrom, r.weekTo] : i.weeks ?? null;
    const afterBirth = i.afterBirth ?? null;
    const base = { weeks, afterBirth };
    return {
      key: i.key,
      title: r?.title || i.title,
      category: i.category,
      ...base,
      label: weeksLabel(base),
      note: i.note ?? null,
      optional: !!i.optional,
      status: statusOf(base, stage, !!r?.doneOn),
      custom: false,
      ...fromRow(r),
    };
  });
  // Anything already done stays in view, even under a key that has since
  // been folded into another item (see `retired` in the schedule) or a
  // conditional that has been switched off — no result is ever hidden.
  const shown = new Set(list.map((x) => x.key));
  for (const r of rows.filter((x) => x.key && x.doneOn && !shown.has(x.key))) {
    const i = SCHEDULE.find((t) => t.key === r.key);
    if (!i) continue;
    const weeks: [number, number] | null = r.weekFrom != null && r.weekTo != null ? [r.weekFrom, r.weekTo] : i.weeks ?? null;
    const base = { weeks, afterBirth: i.afterBirth ?? null };
    list.push({ key: i.key, title: r.title || i.title, category: i.category, ...base, label: weeksLabel(base), note: null, optional: !!i.optional, status: "done", custom: false, ...fromRow(r) });
  }
  for (const r of rows.filter((x) => !x.key)) {
    const weeks: [number, number] | null = r.weekFrom != null && r.weekTo != null ? [r.weekFrom, r.weekTo] : null;
    list.push({
      key: null,
      title: r.title || "Check",
      category: r.category || "VISIT",
      weeks,
      afterBirth: null,
      label: weeksLabel({ weeks }),
      note: null,
      optional: false,
      status: statusOf({ weeks }, stage, !!r.doneOn),
      custom: true,
      ...fromRow(r),
    });
  }
  list.sort((x, y) => order({ status: x.status, start: (x.weeks ?? x.afterBirth ?? [99])[0] }, { status: y.status, start: (y.weeks ?? y.afterBirth ?? [99])[0] }));

  return {
    stage,
    facts,
    everyVisit: EVERY_VISIT,
    conditionals: CONDITIONALS.map((c) => ({ ...c, on: a.conditions.includes(c.key) })),
    /** False until the family has touched the list at all — the page then opens the chooser. */
    touched: rows.length > 0,
    items: list.filter((x) => !x.hidden),
    hidden: list.filter((x) => x.hidden),
    appointments: appts.map((x) => ({ id: x.id, label: apptLabel(x) })),
  };
}
