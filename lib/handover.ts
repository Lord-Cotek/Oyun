import { randomBytes } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { milestoneTitle } from "@/lib/firsts";
import { bornOn } from "@/lib/journey-complete";
import {
  HANDOVER_TTL_DAYS,
  HANDOVER_VERSION,
  hashPass,
  type CircleRole,
  type HandoverBundle,
  type HandoverChild,
} from "@/lib/handover-bundle";

/**
 * Oyun's half of moving a family on to Ìdílé. See lib/handover-bundle.ts for
 * how the two halves talk.
 */

/** The full handover needs both apps to share a secret; without it, the plain link. */
export function handoverReady(): boolean {
  const s = process.env.HANDOVER_SECRET;
  return !!(s && s.length >= 16 && process.env.NEXT_PUBLIC_IDILE_URL);
}

export function idileBase(): string | null {
  const u = process.env.NEXT_PUBLIC_IDILE_URL?.trim();
  return u ? u.replace(/\/+$/, "") : null;
}

const ymd = (d: Date) => d.toISOString().slice(0, 10);

const CIRCLE_ROLE: Record<string, CircleRole | undefined> = {
  FAMILY: "FAMILY",
  FRIEND: "FRIEND",
  ACCOUNTABILITY: "MENTOR",
};

export type PassChoices = {
  forEmail: string;
  withPartner: boolean;
  withLetters: boolean;
  withFirsts: boolean;
  circleUserIds: string[];
};

/** A new pass. Any earlier unused pass for this journey stops working. */
export async function createPass(journeyId: string, userId: string, c: PassChoices): Promise<string> {
  const raw = randomBytes(24).toString("base64url");
  await prisma.handover.deleteMany({ where: { journeyId, claimedAt: null } });
  await prisma.handover.create({
    data: {
      journeyId,
      createdById: userId,
      tokenHash: hashPass(raw),
      forEmail: c.forEmail.trim().toLowerCase(),
      withPartner: c.withPartner,
      withLetters: c.withLetters,
      withFirsts: c.withFirsts,
      circleUserIds: c.circleUserIds.slice(0, 60),
      expiresAt: new Date(Date.now() + HANDOVER_TTL_DAYS * 86_400_000),
    },
  });
  return raw;
}

type Found =
  | { status: "ok"; bundle: HandoverBundle }
  | { status: "missing" | "used" | "expired" };

/**
 * The family behind a pass, built fresh at the moment Ìdílé asks — so a
 * first added after the pass was made still comes across.
 */
export async function buildBundle(raw: string): Promise<Found> {
  const pass = await prisma.handover.findUnique({ where: { tokenHash: hashPass(raw) } });
  if (!pass) return { status: "missing" };
  if (pass.claimedAt) return { status: "used" };
  if (pass.expiresAt.getTime() < Date.now()) return { status: "expired" };

  const j = await prisma.journey.findUnique({
    where: { id: pass.journeyId },
    select: {
      id: true,
      dueDate: true,
      babyName: true,
      babyCount: true,
      owner: { select: { name: true } },
      children: { select: { id: true, name: true, birthDate: true, sex: true }, orderBy: { createdAt: "asc" } },
      memberships: { select: { role: true, userId: true, user: { select: { name: true, email: true } } } },
    },
  });
  if (!j) return { status: "missing" };

  // The children, with their real birthdays. A journey whose birth was never
  // recorded still has its little ones — named from the journey, one per
  // baby, on the day they were due; she can correct them in Ìdílé.
  let children: HandoverChild[] = j.children.map((c) => ({
    ref: c.id,
    name: c.name,
    birthDate: c.birthDate ? ymd(c.birthDate) : null,
    sex: c.sex === "boy" || c.sex === "girl" ? c.sex : null,
  }));
  if (children.length === 0) {
    const day = ymd(bornOn({ dueDate: j.dueDate, children: [] }));
    const count = Math.max(1, Math.min(j.babyCount, 8));
    const given = (j.babyName ?? "").trim();
    // "Ebun and Tobi" is two names only when there are two babies.
    const names = count === 1 ? [given] : given.split(/\s*(?:,|&|\band\b)\s*/i).map((s) => s.trim()).filter(Boolean);
    children = Array.from({ length: count }, (_, i) => ({
      ref: `baby-${i}`,
      name: names[i] ?? "",
      birthDate: day,
      sex: null,
    }));
  }
  // Something written before the children had their own records belongs to
  // the only child, when there is only one.
  const only = children.length === 1 ? children[0].ref : null;
  const refFor = (childId: string | null) => (childId && j.children.some((c) => c.id === childId) ? childId : only);

  const partnerRow = pass.withPartner ? j.memberships.find((m) => m.role === "PARTNER" && m.user.email) : null;
  const circle = j.memberships.flatMap((m) => {
    const role = CIRCLE_ROLE[m.role];
    if (!role || !m.user.email || !pass.circleUserIds.includes(m.userId)) return [];
    return [{ name: m.user.name ?? m.user.email, email: m.user.email, role }];
  });

  const [firsts, letters] = await Promise.all([
    pass.withFirsts
      ? prisma.milestone.findMany({
          where: { journeyId: j.id, kind: { not: "BIRTH" } },
          orderBy: { occurredAt: "asc" },
          select: { childId: true, kind: true, title: true, note: true, occurredAt: true, photoUrls: true },
        })
      : [],
    // Only her own letters. A letter somebody else wrote is theirs to move;
    // it stays here, where it can always be read.
    pass.withLetters
      ? prisma.letter.findMany({
          where: { journeyId: j.id, authorId: pass.createdById, toBaby: true },
          orderBy: { createdAt: "asc" },
          select: { childId: true, body: true, createdAt: true, openOn: true },
        })
      : [],
  ]);
  const today = ymd(new Date());

  return {
    status: "ok",
    bundle: {
      v: HANDOVER_VERSION,
      id: pass.id,
      journeyRef: j.id,
      forEmail: pass.forEmail,
      fromName: j.owner.name,
      children,
      partner: partnerRow ? { name: partnerRow.user.name ?? partnerRow.user.email!, email: partnerRow.user.email! } : null,
      circle,
      firsts: firsts.map((f) => ({
        childRef: refFor(f.childId),
        kind: f.kind,
        label: milestoneTitle(f.kind, f.title),
        note: f.note,
        occurredAt: f.occurredAt.toISOString(),
        photoUrls: f.photoUrls,
      })),
      letters: letters.map((l) => {
        const opens = l.openOn ? ymd(l.openOn) : null;
        return {
          childRef: refFor(l.childId),
          body: l.body,
          writtenAt: l.createdAt.toISOString(),
          opensOn: opens && opens > today ? opens : null,
        };
      }),
    },
  };
}

/** Spent: only the first claim counts. */
export async function claimPass(raw: string): Promise<boolean> {
  const r = await prisma.handover.updateMany({
    where: { tokenHash: hashPass(raw), claimedAt: null },
    data: { claimedAt: new Date() },
  });
  return r.count === 1;
}
