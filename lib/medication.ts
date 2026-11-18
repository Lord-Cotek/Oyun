/**
 * Medicines and doses — the rules, with no database in sight.
 *
 * A plan's schedule is written in her own clock ("08:00 and 20:00") and her
 * own time zone; the doses it makes are instants. Everything that turns one
 * into the other lives here so the verify script can check it: the edge of
 * a day, a course that ends, every other day, a daylight-saving change.
 */

export const FORMS = [
  { form: "TABLET", label: "Tablet" },
  { form: "CAPSULE", label: "Capsule" },
  { form: "PESSARY", label: "Pessary" },
  { form: "INJECTION", label: "Injection" },
  { form: "INSULIN", label: "Insulin pen" },
  { form: "LIQUID", label: "Liquid" },
  { form: "OTHER", label: "Other" },
] as const;
export type Form = (typeof FORMS)[number]["form"];
export const formLabel = (f: string) => FORMS.find((x) => x.form === f)?.label ?? "Medicine";
export const isInjected = (f: string) => f === "INJECTION" || f === "INSULIN";

export const SITES = ["Left abdomen", "Right abdomen", "Left thigh", "Right thigh", "Left arm", "Right arm"] as const;

/** The next site in the rotation after the last one used. */
export function nextSite(last: string | null | undefined): string {
  const i = SITES.indexOf((last ?? "") as (typeof SITES)[number]);
  return SITES[(i + 1) % SITES.length];
}

export type ScheduleKind = "TIMES" | "EVERY_N_DAYS" | "AS_NEEDED";

export type PlanInput = {
  name: string;
  form: Form;
  strength: string | null;
  dose: string | null;
  route: string | null;
  scheduleKind: ScheduleKind;
  times: string[];
  everyDays: number | null;
  startOn: string; // yyyy-mm-dd
  endOn: string | null;
  prescribedBy: string | null;
  notes: string | null;
  remind: boolean;
  remindPartner: boolean;
};

const ymd = /^\d{4}-\d{2}-\d{2}$/;
const hhmm = /^([01]\d|2[0-3]):[0-5]\d$/;
const t = (v: unknown, max: number) => {
  const s = typeof v === "string" ? v.trim() : "";
  return s ? s.slice(0, max) : null;
};

/** A plan as typed, made safe — or the reason it cannot be saved. */
export function cleanPlan(raw: Record<string, unknown>): { ok: true; data: PlanInput } | { ok: false; error: string } {
  const name = t(raw.name, 120);
  if (!name) return { ok: false, error: "What is the medicine called?" };
  const form = (FORMS.some((f) => f.form === raw.form) ? raw.form : "OTHER") as Form;
  const scheduleKind = (["TIMES", "EVERY_N_DAYS", "AS_NEEDED"].includes(String(raw.scheduleKind)) ? raw.scheduleKind : "TIMES") as ScheduleKind;
  const times = [...new Set((Array.isArray(raw.times) ? raw.times : []).map(String).filter((x) => hhmm.test(x)))].sort().slice(0, 8);
  if (scheduleKind !== "AS_NEEDED" && times.length === 0) return { ok: false, error: "Add at least one time of day." };
  let everyDays: number | null = null;
  if (scheduleKind === "EVERY_N_DAYS") {
    everyDays = Math.round(Number(raw.everyDays));
    if (!Number.isFinite(everyDays) || everyDays < 2 || everyDays > 60) return { ok: false, error: "Every how many days? (2 to 60)" };
  }
  const startOn = String(raw.startOn ?? "");
  if (!ymd.test(startOn)) return { ok: false, error: "When does it start?" };
  const endOn = raw.endOn && ymd.test(String(raw.endOn)) ? String(raw.endOn) : null;
  if (endOn && endOn < startOn) return { ok: false, error: "It cannot end before it starts." };
  return {
    ok: true,
    data: {
      name,
      form,
      strength: t(raw.strength, 60),
      dose: t(raw.dose, 60),
      route: t(raw.route, 60),
      scheduleKind,
      times: scheduleKind === "AS_NEEDED" ? [] : times,
      everyDays,
      startOn,
      endOn,
      prescribedBy: t(raw.prescribedBy, 120),
      notes: t(raw.notes, 1000),
      remind: raw.remind !== false,
      remindPartner: raw.remindPartner === true,
    },
  };
}

/* ── Time zones, without a library ─────────────────────────────────────── */

function offsetMinutes(at: Date, timeZone: string): number {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone,
      hourCycle: "h23",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).formatToParts(at);
    const g = (k: string) => Number(parts.find((p) => p.type === k)?.value);
    const asUtc = Date.UTC(g("year"), g("month") - 1, g("day"), g("hour"), g("minute"), g("second"));
    return Math.round((asUtc - at.getTime()) / 60_000);
  } catch {
    return 0;
  }
}

/**
 * The instant a wall-clock time happens in a time zone — "08:00 on 18 Nov in
 * Dubai". Corrected twice so a day on which the clocks change still lands
 * on the right hour.
 */
export function zonedInstant(day: string, time: string, timeZone: string): Date {
  const [y, m, d] = day.split("-").map(Number);
  const [hh, mm] = time.split(":").map(Number);
  const guess = Date.UTC(y, m - 1, d, hh, mm);
  let at = guess - offsetMinutes(new Date(guess), timeZone) * 60_000;
  at = guess - offsetMinutes(new Date(at), timeZone) * 60_000;
  return new Date(at);
}

/** "yyyy-mm-dd" of an instant in a time zone. */
export function localDay(at: Date, timeZone: string): string {
  try {
    return new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).format(at);
  } catch {
    return at.toISOString().slice(0, 10);
  }
}

const addDays = (day: string, n: number) => new Date(Date.parse(`${day}T12:00:00Z`) + n * 86_400_000).toISOString().slice(0, 10);
const daysBetween = (a: string, b: string) => Math.round((Date.parse(`${b}T12:00:00Z`) - Date.parse(`${a}T12:00:00Z`)) / 86_400_000);

export type PlanSchedule = {
  scheduleKind: string;
  times: string[];
  everyDays: number | null;
  startOn: string;
  endOn: string | null;
  stoppedAt?: Date | null;
};

/**
 * Every dose a plan makes between two local days, inclusive, as instants.
 * A stopped plan makes nothing after the moment it was stopped.
 */
export function dueTimes(plan: PlanSchedule, fromDay: string, toDay: string, timeZone: string): Date[] {
  if (plan.scheduleKind === "AS_NEEDED" || plan.times.length === 0) return [];
  const first = plan.startOn > fromDay ? plan.startOn : fromDay;
  const last = plan.endOn && plan.endOn < toDay ? plan.endOn : toDay;
  const out: Date[] = [];
  for (let day = first; day <= last; day = addDays(day, 1)) {
    if (plan.scheduleKind === "EVERY_N_DAYS") {
      const n = plan.everyDays ?? 2;
      if (daysBetween(plan.startOn, day) % n !== 0) continue;
    }
    for (const time of plan.times) {
      const at = zonedInstant(day, time, timeZone);
      if (plan.stoppedAt && at.getTime() > plan.stoppedAt.getTime()) continue;
      out.push(at);
    }
  }
  return out;
}

/** Taken more than an hour after it was due. */
export const isLate = (dueAt: Date, takenAt: Date) => takenAt.getTime() - dueAt.getTime() > 60 * 60_000;

/** "Every day at 08:00 and 20:00", "Every 3 days at 09:00", "As needed". */
export function scheduleSummary(p: PlanSchedule & { dose?: string | null }): string {
  const at = p.times.length ? ` at ${p.times.join(", ").replace(/, ([^,]*)$/, " and $1")}` : "";
  if (p.scheduleKind === "AS_NEEDED") return "As needed";
  if (p.scheduleKind === "EVERY_N_DAYS") return `Every ${p.everyDays} days${at}`;
  return `${p.times.length === 1 ? "Once" : p.times.length === 2 ? "Twice" : `${p.times.length} times`} a day${at}`;
}

export type DoseLike = { dueAt: Date; status: string; late: boolean };

/** Of the doses due so far in a window: how many taken, late, skipped, unrecorded. */
export function adherence(doses: DoseLike[], now: Date) {
  const due = doses.filter((d) => d.dueAt.getTime() <= now.getTime());
  const taken = due.filter((d) => d.status === "TAKEN").length;
  return {
    due: due.length,
    taken,
    late: due.filter((d) => d.status === "TAKEN" && d.late).length,
    skipped: due.filter((d) => d.status === "SKIPPED").length,
    missing: due.filter((d) => d.status === "DUE").length,
  };
}
