import { prisma } from "@/lib/prisma";
import { filesFor, type LogAccess } from "@/lib/health-log-db";
import { adherence, dueTimes, localDay, nextSite, scheduleSummary, formLabel, isInjected } from "@/lib/medication";

/**
 * The time zone a journey's medicines keep: hers. "08:00" means eight in
 * the morning where the mother is, whoever is looking at the screen.
 */
export async function motherTimeZone(journeyId: string): Promise<string> {
  const j = await prisma.journey.findUnique({ where: { id: journeyId }, select: { owner: { select: { timeZone: true } } } });
  return j?.owner.timeZone || "UTC";
}

const day = (d: Date | null) => (d ? d.toISOString().slice(0, 10) : null);
const shift = (ymd: string, n: number) => new Date(Date.parse(`${ymd}T12:00:00Z`) + n * 86_400_000).toISOString().slice(0, 10);

/**
 * Make sure every scheduled dose between two local days exists as a row. Safe
 * to call as often as needed — a dose already there is left exactly as it is.
 */
export async function ensureDoses(journeyId: string, fromDay: string, toDay: string, tz?: string) {
  const zone = tz ?? (await motherTimeZone(journeyId));
  const plans = await prisma.medicationPlan.findMany({
    where: {
      journeyId,
      scheduleKind: { not: "AS_NEEDED" },
      startOn: { lte: new Date(`${toDay}T00:00:00Z`) },
      OR: [{ endOn: null }, { endOn: { gte: new Date(`${fromDay}T00:00:00Z`) } }],
    },
  });
  const rows = plans.flatMap((p) =>
    dueTimes({ scheduleKind: p.scheduleKind, times: p.times, everyDays: p.everyDays, startOn: day(p.startOn)!, endOn: day(p.endOn), stoppedAt: p.stoppedAt }, fromDay, toDay, zone).map((dueAt) => ({
      planId: p.id,
      journeyId,
      dueAt,
    })),
  );
  if (rows.length) await prisma.medicationDose.createMany({ data: rows, skipDuplicates: true });
}

/**
 * A schedule changed: the doses still to come are made again from it. A dose
 * already taken or skipped is history and is never touched.
 */
export async function remakeFutureDoses(planId: string, journeyId: string) {
  const now = new Date();
  await prisma.medicationDose.deleteMany({ where: { planId, status: "DUE", dueAt: { gt: now }, remindedAt: null } });
  const tz = await motherTimeZone(journeyId);
  const today = localDay(now, tz);
  await ensureDoses(journeyId, today, shift(today, 2), tz);
}

export type DoseView = {
  id: string;
  planId: string;
  name: string;
  form: string;
  doseText: string;
  dueAt: string;
  time: string;
  status: string;
  late: boolean;
  takenTime: string | null;
  skipReason: string | null;
  site: string | null;
  units: number | null;
  note: string | null;
  injected: boolean;
  insulin: boolean;
  suggestedSite: string | null;
  files: { id: string; contentType: string }[];
};

export type PlanView = {
  id: string;
  name: string;
  form: string;
  formLabel: string;
  strength: string | null;
  dose: string | null;
  route: string | null;
  schedule: string;
  scheduleKind: string;
  times: string[];
  everyDays: number | null;
  startOn: string;
  endOn: string | null;
  prescribedBy: string | null;
  notes: string | null;
  remind: boolean;
  remindPartner: boolean;
  stopped: boolean;
  week: ReturnType<typeof adherence>;
  files: { id: string; contentType: string }[];
};

/** Everything the medicines page shows, for a viewer already allowed to see it. */
export async function loadMedicines(a: LogAccess) {
  const tz = await motherTimeZone(a.journeyId);
  const now = new Date();
  const today = localDay(now, tz);
  await ensureDoses(a.journeyId, shift(today, -7), shift(today, 1), tz);

  const [plans, doses] = await Promise.all([
    prisma.medicationPlan.findMany({ where: { journeyId: a.journeyId }, orderBy: [{ stoppedAt: "asc" }, { createdAt: "asc" }] }),
    prisma.medicationDose.findMany({
      where: { journeyId: a.journeyId, dueAt: { gte: new Date(now.getTime() - 8 * 86_400_000), lte: new Date(now.getTime() + 2 * 86_400_000) } },
      orderBy: { dueAt: "asc" },
    }),
  ]);
  const planById = new Map(plans.map((p) => [p.id, p]));
  const [planFiles, doseFiles] = await Promise.all([filesFor("plan", plans.map((p) => p.id)), filesFor("dose", doses.map((d) => d.id))]);
  const fmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: tz });
  const lastSite = new Map<string, string>();
  for (const d of [...doses].sort((x, y) => (x.takenAt?.getTime() ?? 0) - (y.takenAt?.getTime() ?? 0))) if (d.site) lastSite.set(d.planId, d.site);

  const toView = (d: (typeof doses)[number]): DoseView => {
    const p = planById.get(d.planId)!;
    return {
      id: d.id,
      planId: d.planId,
      name: p.name,
      form: p.form,
      doseText: [p.strength, p.dose].filter(Boolean).join(" · "),
      dueAt: d.dueAt.toISOString(),
      time: fmt.format(d.dueAt),
      status: d.status,
      late: d.late,
      takenTime: d.takenAt ? fmt.format(d.takenAt) : null,
      skipReason: d.skipReason,
      site: d.site,
      units: d.units,
      note: d.note,
      injected: isInjected(p.form),
      insulin: p.form === "INSULIN",
      suggestedSite: isInjected(p.form) ? nextSite(lastSite.get(d.planId)) : null,
      files: doseFiles.get(d.id) ?? [],
    };
  };

  const todays = doses.filter((d) => localDay(d.dueAt, tz) === today).map(toView);
  const earlier = doses.filter((d) => d.status === "DUE" && d.dueAt.getTime() < now.getTime() - 60 * 60_000 && localDay(d.dueAt, tz) < today).map(toView);
  const asNeededLog = doses.filter((d) => planById.get(d.planId)?.scheduleKind === "AS_NEEDED" && localDay(d.dueAt, tz) !== today).map(toView).reverse().slice(0, 10);
  const weekAgo = now.getTime() - 7 * 86_400_000;

  const planViews: PlanView[] = plans.map((p) => ({
    id: p.id,
    name: p.name,
    form: p.form,
    formLabel: formLabel(p.form),
    strength: p.strength,
    dose: p.dose,
    route: p.route,
    schedule: scheduleSummary({ scheduleKind: p.scheduleKind, times: p.times, everyDays: p.everyDays, startOn: day(p.startOn)!, endOn: day(p.endOn) }),
    scheduleKind: p.scheduleKind,
    times: p.times,
    everyDays: p.everyDays,
    startOn: day(p.startOn)!,
    endOn: day(p.endOn),
    prescribedBy: p.prescribedBy,
    notes: p.notes,
    remind: p.remind,
    remindPartner: p.remindPartner,
    stopped: !!p.stoppedAt || (!!p.endOn && day(p.endOn)! < today),
    week: adherence(doses.filter((d) => d.planId === p.id && d.dueAt.getTime() >= weekAgo), now),
    files: planFiles.get(p.id) ?? [],
  }));

  return { tz, today, todays, earlier, asNeededLog, plans: planViews };
}

/** Active plans in a line each — for the health card, where a nurse reads it. */
export async function activePlanLines(journeyId: string): Promise<string[]> {
  const today = localDay(new Date(), await motherTimeZone(journeyId));
  const plans = await prisma.medicationPlan.findMany({
    where: { journeyId, stoppedAt: null, startOn: { lte: new Date(`${today}T00:00:00Z`) }, OR: [{ endOn: null }, { endOn: { gte: new Date(`${today}T00:00:00Z`) } }] },
    orderBy: { createdAt: "asc" },
  });
  return plans.map((p) =>
    [p.name, [p.strength, p.dose].filter(Boolean).join(" "), scheduleSummary({ scheduleKind: p.scheduleKind, times: p.times, everyDays: p.everyDays, startOn: day(p.startOn)!, endOn: day(p.endOn) }).toLowerCase()]
      .filter(Boolean)
      .join(" — "),
  );
}
