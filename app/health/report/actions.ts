"use server";

import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getActiveMembership } from "@/lib/data";
import { logAccess } from "@/lib/health-log-db";
import { hashReportToken } from "@/lib/health-report-link";
import { notify } from "@/lib/notify";

type Result<T = object> = ({ ok: true } & T) | { ok: false; error: string };

/** Anyone the log is open to: Mum always, her partner while she shares it. */
async function keeper() {
  const session = await auth();
  if (!session?.user?.id) return null;
  const active = await getActiveMembership(session.user.id);
  if (!active) return null;
  return logAccess(session.user.id, active.journey.id);
}

/**
 * A view-only link to one report, for a doctor. Mum can make one, and so can
 * her partner while she shares the log with them — she sees every link, who
 * made it and when it was opened, can close any of them, and is told when
 * her partner makes one. Switching her log to "Only me" closes her partner's
 * links (see setLogAudience). The token comes from node:crypto and only its
 * hash is stored, so the link is shown once.
 */
export async function createReportLink(input: { from: string; to: string; withPhotos: boolean; label?: string; days?: number; forPrinting?: boolean }): Promise<Result<{ path: string; expiresAt: string }>> {
  const a = await keeper();
  if (!a) return { ok: false, error: "The health report is not open to you." };
  const ymd = /^\d{4}-\d{2}-\d{2}$/;
  if (!ymd.test(input.from) || !ymd.test(input.to) || input.to < input.from) return { ok: false, error: "Choose the period first." };
  const days = Math.min(30, Math.max(1, Math.round(Number(input.days) || 7)));
  const raw = randomBytes(24).toString("base64url");
  // In the installed app nothing can print or download, so "save as PDF"
  // opens the report in the phone's own browser — which is not signed in —
  // through a link of her own that lasts two hours. It is listed with her
  // other links like any of them, and can be closed the same way.
  const expiresAt = new Date(Date.now() + (input.forPrinting ? 2 * 3_600_000 : days * 86_400_000));
  await prisma.healthReportLink.create({
    data: {
      journeyId: a.journeyId,
      createdById: a.userId,
      tokenHash: hashReportToken(raw),
      fromDay: new Date(`${input.from}T00:00:00.000Z`),
      toDay: new Date(`${input.to}T00:00:00.000Z`),
      withPhotos: input.withPhotos === true,
      label: input.forPrinting ? "To print or save on this phone" : String(input.label ?? "").trim().slice(0, 80) || null,
      expiresAt,
    },
  });
  revalidatePath("/health/report");
  if (!a.isMother) {
    const [me, mum] = await Promise.all([
      prisma.user.findUnique({ where: { id: a.userId }, select: { name: true } }),
      prisma.journey.findUnique({ where: { id: a.journeyId }, select: { ownerId: true } }),
    ]);
    if (mum) {
      const who = me?.name?.trim().split(" ")[0] || "Your partner";
      await notify({
        userId: mum.ownerId,
        type: "health_shared",
        title: input.forPrinting ? `${who} opened your health report to print it` : `${who} made a doctor link to your health report`,
        body: "You can see it, and close it, under Health → Report.",
        href: "/health/report",
      });
    }
  }
  return { ok: true, path: `/dr/${raw}`, expiresAt: expiresAt.toISOString() };
}

/** Close a link now — either of the two can. It stops working the moment this returns. */
export async function revokeReportLink(id: string): Promise<{ ok: boolean }> {
  const a = await keeper();
  if (!a) return { ok: false };
  const done = await prisma.healthReportLink.updateMany({ where: { id: String(id), journeyId: a.journeyId, revokedAt: null }, data: { revokedAt: new Date() } });
  revalidatePath("/health/report");
  return { ok: done.count > 0 };
}
