import { prisma } from "@/lib/prisma";

/**
 * Everything the admin centre is allowed to know.
 *
 * ── Read the rule in lib/admin.ts first ──────────────────────────────────
 * An admin never reads a family's content. This file is where that stops
 * being a promise and becomes a shape: every query below names its fields one
 * by one, and none of them names a column that holds something a family
 * wrote. scripts/verify-admin-reach.mjs reads this file and fails if one ever
 * does, so widening a select here is a thing somebody has to do on purpose
 * and in the open.
 *
 * What counts as content, and is therefore absent: a post body, a letter, a
 * remembrance, a prayer request, a reading note, an encouragement, a shipping
 * address, transfer details, a registry item, an invitation message. Counts of
 * those are fine — "eleven entries" says nothing about any of them — and
 * counts are what support actually needs.
 */

export interface AdminOverview {
  users: number;
  journeys: number;
  memberships: number;
  posts: number;
  newUsers7: number;
  newUsers30: number;
  activeJourneys7: number;
  registries: number;
  admins: number;
}

function daysAgo(n: number): Date {
  return new Date(Date.now() - n * 86_400_000);
}

/** The shape of things. Numbers only — nothing here can name a person. */
export async function overview(): Promise<AdminOverview> {
  const [
    users,
    journeys,
    memberships,
    posts,
    newUsers7,
    newUsers30,
    activeJourneys7,
    registries,
    admins,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.journey.count(),
    prisma.membership.count(),
    prisma.post.count(),
    prisma.user.count({ where: { createdAt: { gte: daysAgo(7) } } }),
    prisma.user.count({ where: { createdAt: { gte: daysAgo(30) } } }),
    prisma.journey.count({
      where: { posts: { some: { createdAt: { gte: daysAgo(7) } } } },
    }),
    prisma.registry.count(),
    prisma.adminUser.count(),
  ]);
  return {
    users,
    journeys,
    memberships,
    posts,
    newUsers7,
    newUsers30,
    activeJourneys7,
    registries,
    admins,
  };
}

export interface FoundPerson {
  id: string;
  name: string | null;
  email: string | null;
  emailVerified: Date | null;
  hasPassword: boolean;
  createdAt: Date;
  memberships: {
    role: string;
    journeyId: string;
    journeyCreatedAt: Date;
    /** How many people are on that journey — not who they are. */
    people: number;
    /** How many entries it holds. Never what any of them say. */
    posts: number;
  }[];
  /** Invitations sent to this address that nobody has accepted. */
  pending: { id: string; role: string; journeyId: string; createdAt: Date }[];
}

/**
 * Find somebody by email, for when they write in.
 *
 * Exact match, lower-cased. Deliberately not a "contains" search: an admin
 * looking up a person has that person's address in front of them, and a
 * substring search over every account in the app is a browsing tool, which is
 * a different and much less defensible thing.
 */
export async function findPerson(rawEmail: string): Promise<FoundPerson | null> {
  const email = rawEmail.trim().toLowerCase();
  if (!email) return null;

  const user = await prisma.user.findFirst({
    where: { email: { equals: email, mode: "insensitive" } },
    select: {
      id: true,
      name: true,
      email: true,
      emailVerified: true,
      createdAt: true,
      memberships: {
        select: {
          role: true,
          journeyId: true,
          journey: {
            select: {
              createdAt: true,
              _count: { select: { memberships: true, posts: true } },
            },
          },
        },
      },
    },
  });
  if (!user) return null;

  // Whether a password is set, asked as a question rather than fetched: the
  // hash has no business travelling into this process to be turned into a
  // boolean. scripts/verify-admin-reach.mjs refuses the other way round.
  const hasPassword =
    (await prisma.user.count({
      where: { id: user.id, passwordHash: { not: null } },
    })) > 0;

  const pending = await prisma.invite.findMany({
    where: { email: { equals: email, mode: "insensitive" }, acceptedAt: null },
    select: { id: true, role: true, journeyId: true, createdAt: true },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    emailVerified: user.emailVerified,
    hasPassword,
    createdAt: user.createdAt,
    memberships: user.memberships.map((m) => ({
      role: String(m.role),
      journeyId: m.journeyId,
      journeyCreatedAt: m.journey.createdAt,
      people: m.journey._count.memberships,
      posts: m.journey._count.posts,
    })),
    pending: pending.map((p) => ({
      id: p.id,
      role: String(p.role),
      journeyId: p.journeyId,
      createdAt: p.createdAt,
    })),
  };
}

/** An invitation nobody has accepted, with what is needed to send it again. */
export async function pendingInvite(
  id: string,
): Promise<{ id: string; email: string; role: string; token: string; journeyId: string } | null> {
  const invite = await prisma.invite.findUnique({
    where: { id },
    select: { id: true, email: true, role: true, token: true, journeyId: true, acceptedAt: true },
  });
  if (!invite || invite.acceptedAt) return null;
  return {
    id: invite.id,
    email: invite.email,
    role: String(invite.role),
    token: invite.token,
    journeyId: invite.journeyId,
  };
}

/** The name a journey's owner goes by, for the invitation email's wording. */
export async function journeyOwnerName(journeyId: string): Promise<string> {
  const j = await prisma.journey.findUnique({
    where: { id: journeyId },
    select: { owner: { select: { name: true } } },
  });
  return j?.owner?.name?.trim() || "your family";
}

export interface AuditLine {
  id: string;
  actorEmail: string;
  action: string;
  subject: string | null;
  detail: string | null;
  createdAt: Date;
}

export async function recentAudit(take = 100): Promise<AuditLine[]> {
  return prisma.adminAudit.findMany({
    orderBy: { createdAt: "desc" },
    take,
    select: {
      id: true,
      actorEmail: true,
      action: true,
      subject: true,
      detail: true,
      createdAt: true,
    },
  });
}

export async function listAdmins(): Promise<
  { id: string; email: string; label: string | null; addedBy: string | null; createdAt: Date; lastSeenAt: Date | null }[]
> {
  return prisma.adminUser.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      email: true,
      label: true,
      addedBy: true,
      createdAt: true,
      lastSeenAt: true,
    },
  });
}
