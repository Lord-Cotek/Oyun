import { type AppointmentKind } from "@prisma/client";

/**
 * Mirrors AppointmentView in lib/appointments-db.ts, declared here so the
 * client components never reach into a module that opens the database.
 */
export type Appt = {
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
};

/** yyyy-mm-dd / hh:mm from a stored instant, for putting back in the form. */
export function dateValue(d: Date): string {
  return new Date(d).toISOString().slice(0, 10);
}

export function timeValue(d: Date): string {
  return new Date(d).toISOString().slice(11, 16);
}
