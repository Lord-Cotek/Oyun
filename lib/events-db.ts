import { prisma } from "@/lib/prisma";
import { type JourneyEventKind } from "@prisma/client";

/**
 * Everything on this journey's calendar, whatever it came from.
 *
 * Two sources and one shape. A twenty-week scan and a baby shower are
 * different rows for good reasons — one has a midwife to ask for and a list of
 * questions, the other has guests — but from where she is standing they are
 * both simply days that are coming, and she wants to look at them together.
 *
 * Flattening them here is what lets the month grid, the list and the day panel
 * each do their job without knowing the difference.
 */
export type DiaryDay = {
  /** Unique for this row. */
  key: string;
  source: "appointment" | "event";
  sourceId: string;
  at: Date;
  endsAt: Date | null;
  hasTime: boolean;
  label: string;
  where: string | null;
  note: string | null;
  kind: string | null;
  /** Only days she wrote down herself can be edited or invited to here. */
  editable: boolean;
  daysAway: number;
};

const DAY_MS = 86_400_000;
export const HORIZON_DAYS = 120;

function startOfDay(d: Date): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

function daysUntil(at: Date, now: Date): number {
  return Math.round(
    (startOfDay(at).getTime() - startOfDay(now).getTime()) / DAY_MS,
  );
}

export const EVENT_KINDS: { value: JourneyEventKind; label: string }[] = [
  { value: "CLASS", label: "A class" },
  { value: "SHOWER", label: "A baby shower" },
  { value: "GATHERING", label: "People coming" },
  { value: "CHURCH", label: "Church" },
  { value: "CELEBRATION", label: "A celebration" },
  { value: "OTHER", label: "Something else" },
];

export function toEventKind(v: string): JourneyEventKind {
  return (EVENT_KINDS.find((k) => k.value === v)?.value ??
    "OTHER") as JourneyEventKind;
}

/**
 * The months either side of today, so the grid has something to draw when you
 * page backwards as well as forwards. Wider than the list needs on purpose:
 * a calendar you can page through and find empty is a calendar that is lying.
 */
export async function getDiary(
  journeyId: string,
  opts: { now?: Date } = {},
): Promise<DiaryDay[]> {
  const now = opts.now ?? new Date();
  const from = new Date(now.getTime() - 120 * DAY_MS);
  const to = new Date(now.getTime() + 365 * DAY_MS);

  const [appointments, events] = await Promise.all([
    prisma.appointment.findMany({
      where: { journeyId, cancelledAt: null, at: { gte: from, lte: to } },
      select: {
        id: true,
        kind: true,
        title: true,
        at: true,
        hasTime: true,
        where: true,
        notes: true,
      },
    }),
    prisma.journeyEvent.findMany({
      where: { journeyId, cancelledAt: null, at: { gte: from, lte: to } },
      select: {
        id: true,
        kind: true,
        title: true,
        at: true,
        hasTime: true,
        endsAt: true,
        where: true,
        note: true,
      },
    }),
  ]);

  const days: DiaryDay[] = [];

  for (const a of appointments) {
    days.push({
      key: `appointment:${a.id}`,
      source: "appointment",
      sourceId: a.id,
      at: a.at,
      endsAt: null,
      hasTime: a.hasTime,
      label: a.title?.trim() || appointmentWord(a.kind),
      where: a.where,
      note: a.notes,
      kind: a.kind,
      editable: false,
      daysAway: daysUntil(a.at, now),
    });
  }

  for (const e of events) {
    days.push({
      key: `event:${e.id}`,
      source: "event",
      sourceId: e.id,
      at: e.at,
      endsAt: e.endsAt,
      hasTime: e.hasTime,
      label: e.title,
      where: e.where,
      note: e.note,
      kind: e.kind,
      editable: true,
      daysAway: daysUntil(e.at, now),
    });
  }

  return days.sort((a, b) => a.at.getTime() - b.at.getTime());
}

function appointmentWord(kind: string): string {
  const words: Record<string, string> = {
    ANTENATAL: "Antenatal check",
    SCAN: "Scan",
    TEST: "Test",
    CONSULTANT: "Consultant",
    POSTNATAL: "Postnatal check",
    BABY_CHECK: "Baby's check",
    IMMUNISATION: "Immunisation",
    // Retired, and there should be none left — but a word beats a blank.
    CLASS: "Class",
    OTHER: "Appointment",
  };
  return words[kind] ?? "Appointment";
}
