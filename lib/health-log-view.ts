import { prisma } from "@/lib/prisma";
import { filesFor, type LogAccess } from "@/lib/health-log-db";
import {
  dayContext,
  dayIn,
  evaluate,
  kindLabel,
  showGlucose,
  showTemp,
  showWeight,
  slotLabel,
  symptomLabel,
  type Level,
  type ReadingLike,
} from "@/lib/health-log";

/** One reading, ready for the screen — words and flags worked out here, once. */
export type ReadingView = {
  id: string;
  kind: string;
  kindLabel: string;
  takenAt: string;
  day: string;
  time: string;
  slot: string | null;
  slotLabel: string;
  main: string;
  other: string | null;
  extra: string | null;
  note: string | null;
  level: Level;
  reasons: string[];
  files: { id: string; contentType: string }[];
  recordedBy: string | null;
  canEdit: boolean;
  /** Stored values, for the editor (it converts to the family's units). */
  raw: { valueA: number | null; valueB: number | null; valueC: number | null; detail: unknown };
};

export function describe(r: ReadingLike & { kind: string }, units: LogAccess["units"]): { main: string; other: string | null; extra: string | null } {
  const d = (r.detail ?? {}) as Record<string, unknown>;
  switch (r.kind) {
    case "GLUCOSE": {
      const g = showGlucose(r.valueA ?? 0, units);
      const bits = [r.valueB ? `${r.valueB === 60 ? "1 hour" : "2 hours"} after` : null, d.food ? `ate: ${d.food}` : null].filter(Boolean);
      return { main: g.main, other: g.other, extra: bits.length ? bits.join(" · ") : null };
    }
    case "BP": {
      const bits = [r.valueC ? `pulse ${r.valueC}` : null, d.arm ? `${String(d.arm).toLowerCase()} arm` : null].filter(Boolean);
      return { main: `${r.valueA}/${r.valueB} mmHg`, other: null, extra: bits.length ? bits.join(" · ") : null };
    }
    case "WEIGHT":
      return { main: showWeight(r.valueA ?? 0, units), other: null, extra: null };
    case "TEMP":
      return { main: showTemp(r.valueA ?? 0, units), other: null, extra: null };
    case "MOVEMENTS": {
      const main = d.fewer ? "Fewer than usual" : r.valueA !== null ? `${r.valueA} movement${r.valueA === 1 ? "" : "s"}` : "Movements";
      return { main, other: null, extra: r.valueB ? `over ${r.valueB} min` : null };
    }
    case "SYMPTOMS": {
      const list = (Array.isArray(d.list) ? d.list : []) as string[];
      return { main: list.map(symptomLabel).join(", "), other: null, extra: d.severity ? String(d.severity).toLowerCase() : null };
    }
    case "URINE": {
      const bits = (["protein", "glucose", "ketones"] as const).filter((k) => d[k]).map((k) => `${k} ${d[k]}`);
      return { main: bits.join(" · ") || "—", other: null, extra: null };
    }
    default:
      return { main: "", other: null, extra: null };
  }
}

/** Every reading in a window, each flagged with the rest of its own day. */
export async function readingsBetween(a: LogAccess, from: Date, to: Date) {
  const rows = await prisma.healthReading.findMany({
    where: { journeyId: a.journeyId, takenAt: { gte: from, lte: to } },
    orderBy: { takenAt: "desc" },
    include: { recordedBy: { select: { name: true } } },
  });
  const byDay = new Map<string, typeof rows>();
  for (const r of rows) {
    const k = dayIn(r.takenAt, a.timeZone);
    byDay.set(k, [...(byDay.get(k) ?? []), r]);
  }
  const files = await filesFor("reading", rows.map((r) => r.id));
  const time = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: a.timeZone });
  return rows.map((r): ReadingView => {
    const day = dayIn(r.takenAt, a.timeZone);
    const others = (byDay.get(day) ?? []).filter((x) => x.id !== r.id);
    const v = evaluate(r, a.targets, dayContext(others, a.targets));
    const words = describe(r, a.units);
    return {
      id: r.id,
      kind: r.kind,
      kindLabel: kindLabel(r.kind),
      takenAt: r.takenAt.toISOString(),
      day,
      time: time.format(r.takenAt),
      slot: r.slot,
      slotLabel: slotLabel(r.slot),
      ...words,
      note: r.note,
      level: v.level,
      reasons: v.reasons,
      files: files.get(r.id) ?? [],
      recordedBy: r.recordedBy?.name ?? null,
      canEdit: a.isMother || r.recordedById === a.userId,
      raw: { valueA: r.valueA, valueB: r.valueB, valueC: r.valueC, detail: r.detail },
    };
  });
}

/** Today at a glance, from readings already flagged. */
export function todayAtAGlance(views: ReadingView[], today: string) {
  const mine = views.filter((v) => v.day === today);
  const firstOf = (kind: string, slot?: string) => mine.find((v) => v.kind === kind && (!slot || v.slot === slot)) ?? null;
  const pick = (v: ReadingView | null) => (v ? { main: v.main, level: v.level } : null);
  return {
    glucose: {
      FASTING: pick(firstOf("GLUCOSE", "FASTING")),
      AFTER_BREAKFAST: pick(firstOf("GLUCOSE", "AFTER_BREAKFAST")),
      AFTER_LUNCH: pick(firstOf("GLUCOSE", "AFTER_LUNCH")),
      AFTER_DINNER: pick(firstOf("GLUCOSE", "AFTER_DINNER")),
    },
    bp: { MORNING: pick(firstOf("BP", "MORNING")), EVENING: pick(firstOf("BP", "EVENING")) },
    weight: pick(views.find((v) => v.kind === "WEIGHT") ?? null),
    movements: mine.filter((v) => v.kind === "MOVEMENTS").length,
  };
}
