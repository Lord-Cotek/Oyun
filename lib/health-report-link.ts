import { createHash } from "node:crypto";
import { prisma } from "@/lib/prisma";

/** Only the hash of a report token is ever stored. */
export function hashReportToken(raw: string): string {
  return createHash("sha256").update(raw).digest("hex");
}

/**
 * The live link behind a token — or null if there is none, it was closed,
 * or it has expired. Every route a doctor can reach asks this first.
 */
export async function liveReportLink(raw: string) {
  if (!raw || raw.length > 100 || !/^[A-Za-z0-9_-]+$/.test(raw)) return null;
  const link = await prisma.healthReportLink.findUnique({ where: { tokenHash: hashReportToken(raw) } });
  if (!link || link.revokedAt || link.expiresAt.getTime() <= Date.now()) return null;
  return link;
}
