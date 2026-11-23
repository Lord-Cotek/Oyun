import { createHash, randomBytes } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { newClinicCode } from "@/lib/clinician";

/**
 * A patient inviting her doctor by email.
 *
 * ── Why, beside the clinic code ──────────────────────────────────────────
 * The code works when the doctor is already in Oyun. Most are not: the
 * patient is the one who knows the app, and she wants to bring her doctor
 * in. So she types her doctor's email, agrees to exactly what will be
 * shared, and Oyun writes to them. The doctor opens the link, makes an
 * account (or signs in), and is looking at her records — one step, not a
 * code to find and a form to fill.
 *
 * ── The rules ────────────────────────────────────────────────────────────
 * 1. Only the mother invites, as only she shares (lib/clinician.ts). Her
 *    agreement is given when she sends it; nothing is shared until the
 *    doctor accepts.
 * 2. Only the address she invited may accept. An account with a different
 *    address is told so, never quietly attached — the same rule as an
 *    invitation to the circle. It is what stops the link being accepted by
 *    whoever happens to be signed in on the phone it is opened on,
 *    including the mother herself.
 * 3. The link goes by email and nowhere else, and only its hash is stored.
 *    So opening it is proof of that mailbox, which is also why accepting
 *    confirms the account's address.
 * 4. Fourteen days, then it lapses. She can cancel it or send it again
 *    (which makes a new link and ends the old one) until it is accepted.
 * 5. Accepting makes an ordinary ClinicianLink — the same sharing, the same
 *    viewing log, the same "stop at any time" as one made with a code.
 */

export const INVITE_DAYS = 14;

export function hashInviteToken(raw: string): string {
  return createHash("sha256").update(raw).digest("hex");
}

/** A new link token: 24 random bytes, base64url. Only the hash is kept. */
export function newInviteToken(): { raw: string; hash: string } {
  const raw = randomBytes(24).toString("base64url");
  return { raw, hash: hashInviteToken(raw) };
}

export function inviteExpiry(from = new Date()): Date {
  return new Date(from.getTime() + INVITE_DAYS * 86_400_000);
}

const looksLikeToken = (raw: string) => raw.length >= 20 && raw.length <= 100 && /^[A-Za-z0-9_-]+$/.test(raw);

export type InviteState = "open" | "accepted" | "cancelled" | "expired";

export function inviteState(i: { acceptedAt: Date | null; cancelledAt: Date | null; expiresAt: Date }, now = new Date()): InviteState {
  if (i.acceptedAt) return "accepted";
  if (i.cancelledAt) return "cancelled";
  if (i.expiresAt.getTime() <= now.getTime()) return "expired";
  return "open";
}

/** The invitation behind a link, whatever state it is in — or null. */
export async function inviteByToken(raw: string) {
  if (!looksLikeToken(String(raw ?? ""))) return null;
  return prisma.clinicianInvite.findUnique({
    where: { tokenHash: hashInviteToken(raw) },
    include: {
      journey: { select: { id: true, ownerId: true, owner: { select: { name: true, email: true } } } },
    },
  });
}

/** A plausible email address, lower-cased — or null. */
export function cleanEmail(raw: unknown): string | null {
  const s = String(raw ?? "").trim().toLowerCase();
  return s.length <= 200 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s) ? s : null;
}

/**
 * Accept: this account, whose address is the invited one, becomes her
 * clinician. Makes the clinician account if there is none yet (from the
 * details given), opens the link, and closes the invitation — together, so
 * an invitation can never be spent twice or half-spent.
 *
 * The caller has already checked the invitation is open and the address
 * matches; both are checked again here, inside the transaction.
 */
export async function acceptInvite(
  inviteId: string,
  userId: string,
  profile: { displayName: string; title: string | null; practice: string | null } | null,
): Promise<{ ok: true; linkId: string; clinicianName: string } | { ok: false; error: string }> {
  // Made outside the transaction: it reads to find a free code.
  const spareCode = await newClinicCode();
  return prisma.$transaction(async (tx) => {
    const invite = await tx.clinicianInvite.findUnique({ where: { id: inviteId } });
    if (!invite || inviteState(invite) !== "open") return { ok: false as const, error: "This invitation is no longer open." };
    const user = await tx.user.findUnique({ where: { id: userId }, select: { email: true, clinician: true } });
    if (!user?.email || user.email.toLowerCase() !== invite.email) {
      return { ok: false as const, error: `This invitation was sent to ${invite.email}. Please sign in with that address.` };
    }
    let clinician = user.clinician;
    if (!clinician) {
      if (!profile?.displayName) return { ok: false as const, error: "Please enter your name as patients will see it." };
      clinician = await tx.clinician.create({
        data: { userId, displayName: profile.displayName, title: profile.title, practice: profile.practice, code: spareCode },
      });
    }
    const flags = { withPhotos: invite.withPhotos, withAppointments: invite.withAppointments };
    const link = await tx.clinicianLink.upsert({
      where: { clinicianId_journeyId: { clinicianId: clinician.id, journeyId: invite.journeyId } },
      create: { clinicianId: clinician.id, journeyId: invite.journeyId, grantedById: invite.invitedById, ...flags },
      update: { ...flags, endedAt: null, endedBy: null, grantedById: invite.invitedById, createdAt: new Date() },
    });
    await tx.clinicianInvite.update({ where: { id: invite.id }, data: { acceptedAt: new Date() } });
    // The link came by email to this very address: the address is theirs.
    await tx.user.updateMany({ where: { id: userId, emailVerified: null }, data: { emailVerified: new Date() } });
    return { ok: true as const, linkId: link.id, clinicianName: clinician.displayName };
  });
}
