"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getActiveMembership } from "@/lib/data";
import { isHousehold } from "@/lib/roles";
import {
  ALL_BAG_KEYS,
  BAG_EXTRA_MAX,
  BAG_LABEL_MAX,
  cleanPreferences,
  hasPreferences,
  readBagExtras,
  readPreferences,
} from "@/lib/birth-prep";

type Result<T = object> = ({ ok: true } & T) | { ok: false; error: string };

/** The two of them. The circle has no way into any of this. */
async function household() {
  const session = await auth();
  if (!session?.user?.id) return null;
  const active = await getActiveMembership(session.user.id);
  if (!active || !isHousehold(active.role)) return null;
  return { userId: session.user.id, journeyId: active.journey.id, isMother: active.role === "MOTHER", voice: session.user.voice };
}

const NOPE = { ok: false as const, error: "This is kept by the two of you." };
const HERS = { ok: false as const, error: "Her birth preferences are hers to change." };

function refresh() {
  revalidatePath("/health/birth");
  revalidatePath("/health/birth/bag");
  revalidatePath("/health/birth/preferences");
}

/** The row for this journey, made the first time it is needed. */
async function prep(journeyId: string, userId: string) {
  return prisma.birthPrep.upsert({
    where: { journeyId },
    create: { journeyId, updatedById: userId },
    update: {},
    select: { id: true, bagDone: true, bagExtras: true, preferences: true },
  });
}

// ── The bag: either of them ─────────────────────────────────────────────────

export async function toggleBagItem(key: string, done: boolean): Promise<Result> {
  const a = await household();
  if (!a) return NOPE;
  if (!ALL_BAG_KEYS.has(key)) return { ok: false, error: "That is not on the list." };
  const p = await prep(a.journeyId, a.userId);
  const next = done ? [...new Set([...p.bagDone, key])] : p.bagDone.filter((k) => k !== key);
  await prisma.birthPrep.update({ where: { id: p.id }, data: { bagDone: next, updatedById: a.userId } });
  refresh();
  return { ok: true };
}

export async function addBagExtra(label: string): Promise<Result<{ id: string }>> {
  const a = await household();
  if (!a) return NOPE;
  const text = String(label ?? "").replace(/\s+/g, " ").trim().slice(0, BAG_LABEL_MAX);
  if (!text) return { ok: false, error: "What should go in the bag?" };
  const p = await prep(a.journeyId, a.userId);
  const extras = readBagExtras(p.bagExtras);
  if (extras.length >= BAG_EXTRA_MAX) return { ok: false, error: `The bag holds ${BAG_EXTRA_MAX} lines of your own. Take one off first?` };
  const id = randomUUID();
  await prisma.birthPrep.update({
    where: { id: p.id },
    data: { bagExtras: [...extras, { id, label: text, done: false }] as unknown as Prisma.InputJsonValue, updatedById: a.userId },
  });
  refresh();
  return { ok: true, id };
}

export async function toggleBagExtra(id: string, done: boolean): Promise<Result> {
  const a = await household();
  if (!a) return NOPE;
  const p = await prep(a.journeyId, a.userId);
  const extras = readBagExtras(p.bagExtras).map((e) => (e.id === id ? { ...e, done } : e));
  await prisma.birthPrep.update({ where: { id: p.id }, data: { bagExtras: extras as unknown as Prisma.InputJsonValue, updatedById: a.userId } });
  refresh();
  return { ok: true };
}

export async function removeBagExtra(id: string): Promise<Result> {
  const a = await household();
  if (!a) return NOPE;
  const p = await prep(a.journeyId, a.userId);
  const extras = readBagExtras(p.bagExtras).filter((e) => e.id !== id);
  await prisma.birthPrep.update({ where: { id: p.id }, data: { bagExtras: extras as unknown as Prisma.InputJsonValue, updatedById: a.userId } });
  refresh();
  return { ok: true };
}

// ── Her preferences: hers alone to change ───────────────────────────────────

export async function savePreferences(input: unknown): Promise<Result> {
  const a = await household();
  if (!a) return NOPE;
  if (!a.isMother) return HERS;
  const p = await prep(a.journeyId, a.userId);
  const clean = cleanPreferences(input, a.voice, readPreferences(p.preferences));
  await prisma.birthPrep.update({
    where: { id: p.id },
    data: {
      preferences: clean as unknown as Prisma.InputJsonValue,
      preferencesAt: new Date(),
      updatedById: a.userId,
      // With nothing written there is nothing to show a doctor.
      ...(hasPreferences(clean) ? {} : { forDoctorAt: null }),
    },
  });
  refresh();
  return { ok: true };
}

/** Showing her preferences to her linked doctor, or not. Off until she says. */
export async function setPreferencesForDoctor(share: boolean): Promise<Result> {
  const a = await household();
  if (!a) return NOPE;
  if (!a.isMother) return HERS;
  const p = await prep(a.journeyId, a.userId);
  if (share && !hasPreferences(readPreferences(p.preferences))) {
    return { ok: false, error: "Write your preferences first; there is nothing to show yet." };
  }
  await prisma.birthPrep.update({ where: { id: p.id }, data: { forDoctorAt: share ? new Date() : null, updatedById: a.userId } });
  refresh();
  return { ok: true };
}
