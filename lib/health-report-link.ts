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
  if (!looksLikeToken(raw)) return null;
  const link = await prisma.healthReportLink.findUnique({ where: { tokenHash: hashReportToken(raw) } });
  return link && linkIsOpen(link) ? link : null;
}

/** Open means: not closed by her, and not past its date. */
export function linkIsOpen(link: { revokedAt: Date | null; expiresAt: Date }, now = new Date()): boolean {
  return !link.revokedAt && link.expiresAt.getTime() > now.getTime();
}

/** A token as made by createReportLink: 24 random bytes, base64url. */
export const looksLikeToken = (raw: string) => raw.length > 0 && raw.length <= 100 && /^[A-Za-z0-9_-]+$/.test(raw);
