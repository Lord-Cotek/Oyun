"use server";

import { redirect } from "next/navigation";
import { appointmentPath } from "@/lib/open-item";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getActiveMembership } from "@/lib/data";
import { notify } from "@/lib/notify";
import {
  toKind,
  appointmentTitle,
  whenLabel,
  TITLE_MAX,
  TEXT_MAX,
} from "@/lib/appointments";

export type AppointmentResult = { ok: boolean; error?: string };

/**
 * The appointment book belongs to the household — the mother and whoever is
 * walking beside her. A scan date is health information, and the wider circle
 * of relatives and friends has no business with it unless she chooses to name
 * it on the prayer wall herself.
 */
async function requireHousehold() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in?callbackUrl=/appointments");
  const active = await getActiveMembership(session.user.id);
  if (!active) redirect("/onboarding");
  if (active.role !== "MOTHER" && active.role !== "PARTNER") {
    redirect("/journey");
  }
  return { userId: session.user.id, active };
}

function refresh() {
  revalidatePath("/appointments");
  revalidatePath("/journey");
}

/**
 * Read a date, and an hour if one was given.
 *
 * Stored as UTC from the wall-clock values typed in, so what somebody enters
 * is exactly what they later read back. A hospital letter says "Tuesday at
 * 09:30" — it does not mean 09:30 in a timezone, it means the time written on
 * the letter, and shifting that by an offset would be actively harmful.
 */
function readWhen(
  rawDate: string,
  rawTime: string,
): { at: Date; hasTime: boolean } | null {
  const date = rawDate.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  const time = rawTime.trim();
  const hasTime = /^\d{2}:\d{2}$/.test(time);
  const at = new Date(`${date}T${hasTime ? time : "00:00"}:00.000Z`);
  if (Number.isNaN(at.getTime())) return null;
  return { at, hasTime };
}

export async function addAppointment(
  formData: FormData,
): Promise<AppointmentResult> {
  const { userId, active } = await requireHousehold();

  const when = readWhen(
    String(formData.get("date") ?? ""),
    String(formData.get("time") ?? ""),
  );
  if (!when) return { ok: false, error: "Give the date it is on." };

  const kind = toKind(formData.get("kind"));
  const text = (k: string, max = TEXT_MAX) =>
    String(formData.get(k) ?? "").trim().slice(0, max) || null;

  const appt = await prisma.appointment.create({
    data: {
      journeyId: active.journey.id,
      createdById: userId,
      kind,
      title: text("title", TITLE_MAX),
      at: when.at,
      hasTime: when.hasTime,
      where: text("where", 200),
      who: text("who", 200),
      notes: text("notes"),
      questions: text("questions"),
    },
    select: { id: true, kind: true, title: true, at: true, hasTime: true },
  });

  // Tell the other half of the household, once. Whoever typed it in already
  // knows, and does not need telling about their own keystrokes.
  const others = await prisma.membership.findMany({
    where: {
      journeyId: active.journey.id,
      userId: { not: userId },
      role: { in: ["MOTHER", "PARTNER"] },
    },
    select: { userId: true },
  });
  const name = appointmentTitle(appt.kind, appt.title);
  for (const o of others) {
    await notify({
      userId: o.userId,
      type: "appointment",
      title: `${name} — ${whenLabel(appt.at, appt.hasTime)}.`,
      href: appointmentPath(appt.id),
    });
  }

  refresh();
  return { ok: true };
}

export async function editAppointment(
  id: string,
  formData: FormData,
): Promise<AppointmentResult> {
  const { active } = await requireHousehold();
  const existing = await prisma.appointment.findFirst({
    where: { id, journeyId: active.journey.id },
    select: { id: true, at: true },
  });
  if (!existing) return { ok: false, error: "That appointment is gone." };

  const when = readWhen(
    String(formData.get("date") ?? ""),
    String(formData.get("time") ?? ""),
  );
  if (!when) return { ok: false, error: "Give the date it is on." };

  const text = (k: string, max = TEXT_MAX) =>
    String(formData.get(k) ?? "").trim().slice(0, max) || null;

  // A moved appointment gets its reminders back. If it was pushed from
  // Tuesday to next month, the week-ahead note that already went is worthless
  // and the new date deserves its own — so the stamps are cleared whenever
  // the date actually changes.
  const moved = when.at.getTime() !== existing.at.getTime();

  await prisma.appointment.update({
    where: { id },
    data: {
      kind: toKind(formData.get("kind")),
      title: text("title", TITLE_MAX),
      at: when.at,
      hasTime: when.hasTime,
      where: text("where", 200),
      who: text("who", 200),
      notes: text("notes"),
      questions: text("questions"),
      ...(moved
        ? {
            remindedWeekAt: null,
            remindedDayAt: null,
            remindedMorningAt: null,
          }
        : {}),
    },
  });
  refresh();
  return { ok: true };
}

/** It happened — and what came of it, if you want it kept. */
export async function markAttended(
  id: string,
  rawOutcome?: string,
): Promise<AppointmentResult> {
  const { active } = await requireHousehold();
  const appt = await prisma.appointment.findFirst({
    where: { id, journeyId: active.journey.id },
    select: { id: true },
  });
  if (!appt) return { ok: false, error: "That appointment is gone." };

  await prisma.appointment.update({
    where: { id },
    data: {
      attendedAt: new Date(),
      cancelledAt: null,
      outcome: (rawOutcome ?? "").trim().slice(0, TEXT_MAX) || null,
    },
  });
  refresh();
  return { ok: true };
}

export async function reopenAppointment(id: string): Promise<AppointmentResult> {
  const { active } = await requireHousehold();
  const appt = await prisma.appointment.findFirst({
    where: { id, journeyId: active.journey.id },
    select: { id: true },
  });
  if (!appt) return { ok: true };
  await prisma.appointment.update({
    where: { id },
    data: { attendedAt: null, cancelledAt: null },
  });
  refresh();
  return { ok: true };
}

export async function cancelAppointment(id: string): Promise<AppointmentResult> {
  const { active } = await requireHousehold();
  const appt = await prisma.appointment.findFirst({
    where: { id, journeyId: active.journey.id },
    select: { id: true },
  });
  if (!appt) return { ok: true };
  await prisma.appointment.update({
    where: { id },
    data: { cancelledAt: new Date() },
  });
  refresh();
  return { ok: true };
}

export async function deleteAppointment(id: string): Promise<AppointmentResult> {
  const { active } = await requireHousehold();
  const appt = await prisma.appointment.findFirst({
    where: { id, journeyId: active.journey.id },
    select: { id: true },
  });
  if (!appt) return { ok: true };
  await prisma.appointment.delete({ where: { id } });
  refresh();
  return { ok: true };
}

/**
 * Ask the circle to pray for it.
 *
 * Shares the name and the day, and nothing else — never the notes, never the
 * consultant, never why. The circle is not given a medical record; it is
 * given something to pray about. Whoever asks can edit the wording on the
 * prayer wall afterwards like any other request.
 */
export async function askCircleToPray(id: string): Promise<AppointmentResult> {
  const { userId, active } = await requireHousehold();
  const appt = await prisma.appointment.findFirst({
    where: { id, journeyId: active.journey.id },
    select: { kind: true, title: true, at: true, hasTime: true },
  });
  if (!appt) return { ok: false, error: "That appointment is gone." };

  const name = appointmentTitle(appt.kind, appt.title);
  await prisma.prayerRequest.create({
    data: {
      journeyId: active.journey.id,
      authorId: userId,
      title: `${name} — ${whenLabel(appt.at, appt.hasTime)}`,
      body: null,
    },
  });
  refresh();
  revalidatePath("/prayer");
  return { ok: true };
}

/**
 * Bring last time's questions into this appointment's "To ask".
 *
 * Added beneath whatever is already there, and only the lines that are not
 * already in it — pressing it twice, or carrying forward a question she has
 * already copied across by hand, does not write it out twice.
 */
export async function carryQuestions(id: string, fromText: string): Promise<AppointmentResult> {
  const { active } = await requireHousehold();
  const appt = await prisma.appointment.findFirst({
    where: { id, journeyId: active.journey.id, attendedAt: null, cancelledAt: null },
    select: { id: true, questions: true, kind: true, at: true },
  });
  if (!appt) return { ok: false, error: "That appointment is gone." };
  // The text is re-read from the database, not trusted from the browser: the
  // last visit of this kind, as the book itself computes it.
  const last = await prisma.appointment.findFirst({
    where: {
      journeyId: active.journey.id,
      kind: appt.kind,
      cancelledAt: null,
      at: { lt: appt.at },
      id: { not: appt.id },
      // The same "last time" the book shows: a visit that has happened.
      OR: [
        { attendedAt: { not: null } },
        { at: { lt: new Date(new Date().setUTCHours(0, 0, 0, 0)) } },
      ],
      AND: [{ OR: [{ outcome: { not: null } }, { questions: { not: null } }] }],
    },
    orderBy: { at: "desc" },
    select: { questions: true },
  });
  const source = (last?.questions ?? "").trim();
  if (!source || source !== fromText.trim()) {
    return { ok: false, error: "Those questions have changed — refresh and try again." };
  }
  const have = (appt.questions ?? "").split("\n").map((l) => l.trim()).filter(Boolean);
  const seen = new Set(have.map((l) => l.toLowerCase()));
  const adding = source
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !seen.has(l.toLowerCase()));
  if (adding.length === 0) return { ok: true };
  await prisma.appointment.update({
    where: { id },
    data: { questions: [...have, ...adding].join("\n").slice(0, TEXT_MAX) },
  });
  refresh();
  return { ok: true };
}
