import { prisma } from "@/lib/prisma";
import { type AppointmentKind } from "@prisma/client";

/**
 * Reading the appointment book.
 *
 * Kept apart from lib/appointments.ts so the rules and the shape can be
 * imported by a client component without dragging the database behind them.
 */

export interface AppointmentView {
  id: string;
  kind: AppointmentKind;
  title: string | null;
  at: Date;
  hasTime: boolean;
  where: string | null;
  who: string | null;
  notes: string | null;
  questions: string | null;
  attendedAt: Date | null;
  outcome: string | null;
  cancelledAt: Date | null;
  addedBy: string | null;
  mine: boolean;
}

function shape(
  r: {
    id: string;
    kind: AppointmentKind;
    title: string | null;
    at: Date;
    hasTime: boolean;
    where: string | null;
    who: string | null;
    notes: string | null;
    questions: string | null;
    attendedAt: Date | null;
    outcome: string | null;
    cancelledAt: Date | null;
    createdById: string;
    createdBy: { name: string | null };
  },
  viewerId: string,
): AppointmentView {
  return {
    id: r.id,
    kind: r.kind,
    title: r.title,
    at: r.at,
    hasTime: r.hasTime,
    where: r.where,
    who: r.who,
    notes: r.notes,
    questions: r.questions,
    attendedAt: r.attendedAt,
    outcome: r.outcome,
    cancelledAt: r.cancelledAt,
    addedBy: r.createdBy.name,
    mine: r.createdById === viewerId,
  };
}

const FIELDS = {
  id: true,
  kind: true,
  title: true,
  at: true,
  hasTime: true,
  where: true,
  who: true,
  notes: true,
  questions: true,
  attendedAt: true,
  outcome: true,
  cancelledAt: true,
  createdById: true,
  createdBy: { select: { name: true } },
} as const;

/** The start of today in UTC — an appointment at 09:00 is still "coming". */
function startOfToday(now = new Date()): Date {
  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );
}

/**
 * What is still ahead — soonest first.
 *
 * Today counts as ahead right up until midnight, because somebody checking at
 * lunchtime still needs to see the two o'clock.
 */
export async function getUpcoming(
  journeyId: string,
  viewerId: string,
  take = 50,
  now = new Date(),
): Promise<AppointmentView[]> {
  const rows = await prisma.appointment.findMany({
    where: {
      journeyId,
      at: { gte: startOfToday(now) },
      attendedAt: null,
      cancelledAt: null,
    },
    orderBy: { at: "asc" },
    select: FIELDS,
    take,
  });
  return rows.map((r) => shape(r, viewerId));
}

/** What has been and gone — newest first, so the last one is at the top. */
export async function getPast(
  journeyId: string,
  viewerId: string,
  take = 50,
  now = new Date(),
): Promise<AppointmentView[]> {
  const rows = await prisma.appointment.findMany({
    where: {
      journeyId,
      OR: [
        { attendedAt: { not: null } },
        { cancelledAt: { not: null } },
        { at: { lt: startOfToday(now) } },
      ],
    },
    orderBy: { at: "desc" },
    select: FIELDS,
    take,
  });
  return rows.map((r) => shape(r, viewerId));
}

/**
 * The next couple, for the home page beside the due date.
 *
 * Two at most. The home page is meant to be read at a glance by somebody who
 * may be exhausted; a list of nine is a page of its own, which is what
 * /appointments is for.
 */
export async function getNextFew(
  journeyId: string,
  viewerId: string,
  now = new Date(),
): Promise<AppointmentView[]> {
  return getUpcoming(journeyId, viewerId, 2, now);
}
