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
export async function getUpcomingAppointments(
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

/**
 * One appointment, for the page a reminder opens.
 *
 * ── Why a reminder could not use the book ────────────────────────────────
 * Every reminder is about something still ahead, and an appointment still
 * ahead sits below the form, the next-few card and the whole upcoming list.
 * Measured on a phone: the element existed two thousand pixels down and the
 * page did not move, because the browser had already acted on the fragment
 * before the book had rendered. "Your appointment is tomorrow" opened the top
 * of the book and left her to find which one.
 *
 * Null when it is not this journey's, so the page 404s without saying whether
 * the id was wrong or somebody else's.
 */
export async function getOneAppointment(
  appointmentId: string,
  journeyId: string,
  viewerId: string,
): Promise<AppointmentView | null> {
  const r = await prisma.appointment.findFirst({
    where: { id: appointmentId, journeyId },
    select: FIELDS,
  });
  return r ? shape(r, viewerId) : null;
}

/** What has been and gone — newest first, so the last one is at the top. */
export async function getPastAppointments(
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
  return getUpcomingAppointments(journeyId, viewerId, 2, now);
}
