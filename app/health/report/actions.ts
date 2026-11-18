"use server";

import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getActiveMembership } from "@/lib/data";
import { logAccess } from "@/lib/health-log-db";
import { hashReportToken } from "@/lib/health-report-link";

type Result<T = object> = ({ ok: true } & T) | { ok: false; error: string };

async function mother() {
  const session = await auth();
  if (!session?.user?.id) return null;
  const active = await getActiveMembership(session.user.id);
  if (!active) return null;
  const a = await logAccess(session.user.id, active.journey.id);
  return a?.isMother ? a : null;
}

/**
 * A view-only link to one report, for a doctor. Hers to make: the health log
 * leaves the app only this way, and only when she chooses. The token comes
 * from node:crypto and only its hash is stored, so the link is shown once.
 */
export async function createReportLink(input: { from: string; to: string; withPhotos: boolean; label?: string; days?: number }): Promise<Result<{ path: string; expiresAt: string }>> {
  const a = await mother();
  if (!a) return { ok: false, error: "Only Mum can share her health report." };
  const ymd = /^\d{4}-\d{2}-\d{2}$/;
  if (!ymd.test(input.from) || !ymd.test(input.to) || input.to < input.from) return { ok: false, error: "Choose the period first." };
  const days = Math.min(30, Math.max(1, Math.round(Number(input.days) || 7)));
  const raw = randomBytes(24).toString("base64url");
  const expiresAt = new Date(Date.now() + days * 86_400_000);
  await prisma.healthReportLink.create({
    data: {
      journeyId: a.journeyId,
      createdById: a.userId,
      tokenHash: hashReportToken(raw),
      fromDay: new Date(`${input.from}T00:00:00.000Z`),
      toDay: new Date(`${input.to}T00:00:00.000Z`),
      withPhotos: input.withPhotos === true,
      label: String(input.label ?? "").trim().slice(0, 80) || null,
      expiresAt,
    },
  });
  revalidatePath("/health/report");
  return { ok: true, path: `/dr/${raw}`, expiresAt: expiresAt.toISOString() };
}

/** Close a link now. It stops working the moment this returns. */
export async function revokeReportLink(id: string): Promise<{ ok: boolean }> {
  const a = await mother();
  if (!a) return { ok: false };
  const done = await prisma.healthReportLink.updateMany({ where: { id: String(id), journeyId: a.journeyId, revokedAt: null }, data: { revokedAt: new Date() } });
  revalidatePath("/health/report");
  return { ok: done.count > 0 };
}
