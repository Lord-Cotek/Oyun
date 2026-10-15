import { type DiaryDay } from "@/lib/events-db";
import { inviteUrl } from "@/lib/invitations-db";
import { type DayRow } from "@/components/dates/DiaryBook";
import { type InviteRow } from "@/components/dates/InvitePanel";

/**
 * Turning what the database knows about a day into what the diary draws.
 *
 * ── Why this moved out of the page ───────────────────────────────────────
 * It was written once inside app/appointments/page.tsx, which was fine while
 * the book was the only place a day was shown. A day now has a page of its
 * own — the notifications about one ("Blessing replied yes") used to point
 * into a list that only drew the days still ahead — and the two must agree
 * about what a day is, down to the surprise's own rule below. Two copies of
 * this mapping would be two chances to disagree, in the one place where
 * disagreeing means showing somebody a party arranged for them.
 *
 * Both are pure: dates to strings, nulls to nulls, no database.
 */

/** What the host may see about their own invitation. Never an address. */
export function toInviteRow(i: {
  slug: string;
  hostName: string;
  message: string | null;
  coverUrl: string | null;
  showGuestList: boolean;
  allowPlusOnes: boolean;
  capacity: number | null;
  repliesBy: Date | null;
  closedAt: Date | null;
  revokedAt: Date | null;
  settledAt: Date | null;
  emailsSentCount: number;
  options: {
    id: string;
    at: Date;
    hasTime: boolean;
    endsAt: Date | null;
    _count: { votes: number };
  }[];
  replies: {
    id: string;
    name: string;
    answer: string;
    partySize: number;
    note: string | null;
  }[];
}): InviteRow {
  return {
    slug: i.slug,
    url: inviteUrl(i.slug),
    hostName: i.hostName,
    message: i.message,
    coverUrl: i.coverUrl,
    showGuestList: i.showGuestList,
    allowPlusOnes: i.allowPlusOnes,
    capacity: i.capacity,
    repliesByISO: i.repliesBy ? i.repliesBy.toISOString() : null,
    closed: i.closedAt !== null,
    revoked: i.revokedAt !== null,
    settled: i.settledAt !== null,
    emailsSent: i.emailsSentCount,
    options: i.options.map((o) => ({
      id: o.id,
      atISO: o.at.toISOString(),
      hasTime: o.hasTime,
      endsAtISO: o.endsAt ? o.endsAt.toISOString() : null,
      votes: o._count.votes,
    })),
    replies: i.replies.map((r) => ({
      id: r.id,
      name: r.name,
      answer: r.answer,
      partySize: r.partySize,
      note: r.note,
    })),
  };
}

export function toDayRow(d: DiaryDay, invite: InviteRow | null): DayRow {
  return {
    key: d.key,
    source: d.source,
    sourceId: d.sourceId,
    atISO: d.at.toISOString(),
    endsAtISO: d.endsAt ? d.endsAt.toISOString() : null,
    hasTime: d.hasTime,
    label: d.label,
    where: d.where,
    note: d.note,
    kind: d.kind,
    editable: d.editable,
    surprise: d.surprise,
    // Everyone in on it except whoever thought of it, which the row keeps
    // separately so they cannot be taken out of their own surprise.
    inOnIt: (d.onlyFor ?? []).filter((id) => id !== d.createdById),
    createdById: d.createdById,
    daysAway: d.daysAway,
    // Only a day she wrote down can be invited to. Nobody RSVPs to a scan.
    invite: d.source === "event" ? invite : null,
  };
}
