import { randomBytes } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { inviteState, isPoll, type InviteState } from "@/lib/invitations";
import { HOUSEHOLD_ROLES } from "@/lib/roles";
import { inOnIt, maySee, stillASurprise } from "@/lib/surprise";

/**
 * ── Why these are not `randomId()` ───────────────────────────────────────
 * lib/rand.ts says of itself, in its own comment, that its ids are "never
 * security-bearing" and that it falls back to `Math.random`. That is true and
 * fine for keying a React list. It is not fine for the only thing standing
 * between a guessed URL and somebody's address and party.
 *
 * So these come from `node:crypto`, server-side, and they are long. 18 bytes
 * is 144 bits — there is no useful sense in which a family's invitation gets
 * found by trying.
 */
const SLUG_BYTES = 18;
const TOKEN_BYTES = 24;

/** URL-safe base64, which is shorter than hex for the same entropy. */
function secret(bytes: number): string {
  return randomBytes(bytes).toString("base64url");
}

export function newSlug(): string {
  return secret(SLUG_BYTES);
}

export function newGuestToken(): string {
  return secret(TOKEN_BYTES);
}

/** The cookie a guest's browser keeps so they can change their own answer. */
export function guestCookieName(slug: string): string {
  return `idile_rsvp_${slug}`;
}

export type PublicInvitation = {
  slug: string;
  hostName: string;
  message: string | null;
  /**
   * The photograph at the top, chosen by the host. Null is the ordinary case
   * and the page is designed for it — see Invitation.coverUrl for what may be
   * in here, and why that is checked harder than anywhere else in the app.
   */
  coverUrl: string | null;
  showGuestList: boolean;
  allowPlusOnes: boolean;
  capacity: number | null;
  repliesBy: Date | null;
  state: InviteState;
  /** True while this is still asking which day, rather than naming one. */
  poll: boolean;
  options: {
    id: string;
    at: Date;
    hasTime: boolean;
    endsAt: Date | null;
    votes: number;
  }[];
  event: {
    id: string;
    title: string;
    at: Date;
    hasTime: boolean;
    endsAt: Date | null;
    where: string | null;
    cancelled: boolean;
  };
  replies: {
    id: string;
    name: string;
    answer: string;
    partySize: number;
    note: string | null;
  }[];
  /** Directions, the registry, what to bring — in the host's order. */
  links: { id: string; kind: string; label: string; url: string }[];
  /** The host's own word to somebody who has just said yes. */
  thankYou: string | null;
};

/**
 * Everything the public page is allowed to know — and nothing else.
 *
 * This is the whole security boundary of the feature, so it is one function
 * and it selects fields explicitly. It never reaches the household, the
 * household's name, the creator's account, the event's private note, or any
 * other day. If a field is not named here, a guest cannot see it.
 *
 * A revoked link returns nothing at all, so the page 404s exactly as if it had
 * never existed — which, as far as anybody holding that link is concerned, is
 * the truth.
 */
export async function getPublicInvitation(
  slug: string,
  now = new Date(),
): Promise<PublicInvitation | null> {
  const i = await prisma.invitation.findUnique({
    where: { slug },
    select: {
      slug: true,
      hostName: true,
      message: true,
      coverUrl: true,
      showGuestList: true,
      allowPlusOnes: true,
      capacity: true,
      repliesBy: true,
      closedAt: true,
      revokedAt: true,
      settledAt: true,
      options: {
        orderBy: { at: "asc" },
        select: {
          id: true,
          at: true,
          hasTime: true,
          endsAt: true,
          _count: { select: { votes: true } },
        },
      },
      event: {
        select: {
          id: true,
          title: true,
          at: true,
          hasTime: true,
          endsAt: true,
          where: true,
          cancelledAt: true,
          // `note` is deliberately absent. It is the household's own line about
          // the day and was written before anybody thought about guests.
        },
      },
      replies: {
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          name: true,
          answer: true,
          partySize: true,
          note: true,
        },
      },
      // The host put these here for guests to use, so they are part of the
      // public page by definition — but still named field by field, for the
      // reason at the top of this function.
      links: {
        orderBy: [{ position: "asc" }, { createdAt: "asc" }],
        select: { id: true, kind: true, label: true, url: true },
      },
      thankYou: true,
    },
  });
  if (!i || i.revokedAt) return null;

  return {
    slug: i.slug,
    hostName: i.hostName,
    message: i.message,
    coverUrl: i.coverUrl,
    showGuestList: i.showGuestList,
    allowPlusOnes: i.allowPlusOnes,
    capacity: i.capacity,
    repliesBy: i.repliesBy,
    state: inviteState(i, i.event.at, i.event.endsAt, now),
    poll: isPoll({ settledAt: i.settledAt, options: i.options }),
    options: i.options.map((o) => ({
      id: o.id,
      at: o.at,
      hasTime: o.hasTime,
      endsAt: o.endsAt,
      votes: o._count.votes,
    })),
    event: {
      id: i.event.id,
      title: i.event.title,
      at: i.event.at,
      hasTime: i.event.hasTime,
      endsAt: i.event.endsAt,
      where: i.event.where,
      cancelled: i.event.cancelledAt !== null,
    },
    replies: i.replies,
    links: i.links,
    thankYou: i.thankYou,
  };
}

/** The host's view: same invitation, plus what only the host should see. */
export async function getHostInvitations(journeyId: string) {
  const rows = await prisma.invitation.findMany({
    where: { event: { journeyId } },
    orderBy: { event: { at: "asc" } },
    select: {
      id: true,
      slug: true,
      eventId: true,
      hostName: true,
      message: true,
      coverUrl: true,
      showGuestList: true,
      allowPlusOnes: true,
      capacity: true,
      repliesBy: true,
      closedAt: true,
      revokedAt: true,
      settledAt: true,
      // A count, never the addresses — see the field's own comment.
      emailsSentCount: true,
      thankYou: true,
      links: {
        orderBy: [{ position: "asc" }, { createdAt: "asc" }],
        select: { id: true, kind: true, label: true, url: true },
      },
      options: {
        orderBy: { at: "asc" },
        select: {
          id: true,
          at: true,
          hasTime: true,
          endsAt: true,
          _count: { select: { votes: true } },
        },
      },
      replies: {
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          name: true,
          answer: true,
          partySize: true,
          note: true,
          createdAt: true,
          // Not the address itself. A guest gave it to the app so the app
          // could remind them; handing it to the host is a different thing
          // from the one they agreed to, and the host has no use for it.
          votes: { select: { optionId: true } },
        },
      },
    },
  });

  /**
   * For the emailed thank-you: how many guests could be sent it, and how
   * many already have been. Counted in the database, so not one address
   * leaves this function — a host learns "18 left an email", never which.
   */
  const ids = rows.map((r) => r.id);
  const [waiting, thanked] = ids.length
    ? await Promise.all([
        prisma.invitationReply.groupBy({
          by: ["invitationId"],
          where: {
            invitationId: { in: ids },
            answer: { in: ["YES", "MAYBE"] },
            email: { not: null },
            thankedAt: null,
          },
          _count: { _all: true },
        }),
        prisma.invitationReply.groupBy({
          by: ["invitationId"],
          where: { invitationId: { in: ids }, thankedAt: { not: null } },
          _count: { _all: true },
        }),
      ])
    : [[], []];
  const w = new Map(waiting.map((g) => [g.invitationId, g._count._all]));
  const t = new Map(thanked.map((g) => [g.invitationId, g._count._all]));
  return rows.map((r) => ({
    ...r,
    thanksWaiting: w.get(r.id) ?? 0,
    thanksSent: t.get(r.id) ?? 0,
  }));
}

/** The full link, for the share sheet and the WhatsApp message. */
export function inviteUrl(slug: string): string {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "https://oyun.cotek.app";
  return `${base}/i/${slug}`;
}

/**
 * Who may be told about replies to this day's invitation — a guest saying
 * yes, the count the evening before.
 *
 * ── Why this is not simply "the household" ───────────────────────────────
 * It was, and a surprise shower with an invitation on it then told the
 * mother "Ada is coming to your surprise shower" the moment Ada replied. A
 * day still being kept from somebody is told only to the people in on it —
 * the one who planned it and the ones they asked to help — and only while
 * they still belong to this journey. Once the day has come, it is an
 * ordinary day again and the household hears as usual.
 */
export async function inviteAudience(eventId: string, now = new Date()): Promise<string[]> {
  const e = await prisma.journeyEvent.findUnique({
    where: { id: eventId },
    select: {
      journeyId: true,
      surprise: true,
      at: true,
      createdById: true,
      planners: { select: { userId: true } },
    },
  });
  if (!e) return [];
  // Whoever would ordinarily hear — the household — and, on a surprise, the
  // helpers let in on it, who may be in the wider circle. Then the one rule:
  // only those who may see this day at all.
  const candidates = await prisma.membership.findMany({
    where: {
      journeyId: e.journeyId,
      OR: [
        { role: { in: HOUSEHOLD_ROLES } },
        ...(stillASurprise(e, now) ? [{ userId: { in: inOnIt(e) } }] : []),
      ],
    },
    select: { userId: true },
  });
  return Array.from(new Set(candidates.map((m) => m.userId))).filter((id) =>
    maySee(e, id, now),
  );
}
