"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getActiveMembership } from "@/lib/data";
import { notify } from "@/lib/notify";
import { isHousehold, HOUSEHOLD_ROLES } from "@/lib/roles";
import { sendGuestDayEmail } from "@/lib/email";
import { toEventKind } from "@/lib/events-db";
import { newSlug, inviteUrl } from "@/lib/invitations-db";
import {
  HOST_NAME_MAX,
  MESSAGE_MAX,
  MAX_OPTIONS,
  MIN_OPTIONS,
  whenWords,
} from "@/lib/invitations";

type Result = { ok: true } | { ok: false; error: string };

const TITLE_MAX = 120;
const TEXT_MAX = 2000;
const WHERE_MAX = 200;

/**
 * A day she has written down — a class, a shower, friends coming round.
 *
 * Same rule as the rest of the appointment book: this is the household's, the
 * mother and the one beside her. The circle who pray for her are not shown her
 * diary; a gathering reaches them through the invitation link, which is a
 * thing she hands out on purpose.
 */
async function requireHouse() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in?callbackUrl=/appointments");
  const active = await getActiveMembership(session.user.id);
  if (!active) redirect("/onboarding");
  if (!isHousehold(active.role)) return null;
  return { userId: session.user.id, journeyId: active.journey.id };
}

/**
 * Read a day and its hours from the form.
 *
 * The hour is stored as written, as UTC. A shower at 14:00 means two in the
 * afternoon where she lives — not two o'clock somewhere else, shifted.
 */
function readWhen(
  formData: FormData,
): { at: Date; hasTime: boolean; endsAt: Date | null } | null {
  const date = String(formData.get("date") ?? "").trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  const time = String(formData.get("time") ?? "").trim();
  const hasTime = /^\d{2}:\d{2}$/.test(time);
  const at = new Date(`${date}T${hasTime ? time : "09:00"}:00.000Z`);
  if (Number.isNaN(at.getTime())) return null;

  // An end without a start is meaningless, and an end before its start is a
  // typo. In both cases the honest answer is no end rather than a wrong one,
  // because a wrong end goes straight onto a guest's own calendar.
  let endsAt: Date | null = null;
  const end = String(formData.get("endTime") ?? "").trim();
  if (hasTime && /^\d{2}:\d{2}$/.test(end)) {
    const e = new Date(`${date}T${end}:00.000Z`);
    if (!Number.isNaN(e.getTime()) && e.getTime() > at.getTime()) endsAt = e;
  }
  return { at, hasTime, endsAt };
}

function readEvent(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const where = String(formData.get("where") ?? "").trim() || null;
  const note = String(formData.get("note") ?? "").trim() || null;
  return {
    title: title.slice(0, TITLE_MAX),
    kind: toEventKind(String(formData.get("kind") ?? "")),
    where: where ? where.slice(0, WHERE_MAX) : null,
    note: note ? note.slice(0, TEXT_MAX) : null,
  };
}

export async function addEvent(formData: FormData): Promise<Result> {
  const who = await requireHouse();
  if (!who) return { ok: false, error: "This is the household's diary." };
  const when = readWhen(formData);
  if (!when) return { ok: false, error: "Choose a day." };
  const e = readEvent(formData);
  if (!e.title) return { ok: false, error: "Give the day a name." };

  const event = await prisma.journeyEvent.create({
    data: { journeyId: who.journeyId, createdById: who.userId, ...e, ...when },
    select: { id: true, title: true },
  });

  // Tell the other one quietly — never the person who just wrote it.
  const others = await prisma.membership.findMany({
    where: {
      journeyId: who.journeyId,
      userId: { not: who.userId },
      role: { in: HOUSEHOLD_ROLES },
    },
    select: { userId: true },
  });
  for (const m of others) {
    await notify({
      userId: m.userId,
      type: "appointment",
      title: `A day went in the diary: ${event.title}`,
      href: "/appointments",
    });
  }

  revalidatePath("/appointments");
  revalidatePath("/journey");
  return { ok: true };
}

export async function editEvent(formData: FormData): Promise<Result> {
  const who = await requireHouse();
  if (!who) return { ok: false, error: "This is the household's diary." };
  const id = String(formData.get("id") ?? "");
  const when = readWhen(formData);
  if (!when) return { ok: false, error: "Choose a day." };
  const e = readEvent(formData);
  if (!e.title) return { ok: false, error: "Give the day a name." };

  const existing = await prisma.journeyEvent.findFirst({
    where: { id, journeyId: who.journeyId },
    select: { at: true },
  });
  if (!existing) return { ok: false, error: "That day is no longer here." };
  const moved = existing.at.getTime() !== when.at.getTime();

  await prisma.journeyEvent.updateMany({
    where: { id, journeyId: who.journeyId },
    data: { ...e, ...when },
  });

  if (moved) {
    await clearGuestLedger(id);
    await tellGuestsItMoved(id, e.title, when, e.where);
  }

  revalidatePath("/appointments");
  revalidatePath("/journey");
  return { ok: true };
}

export async function removeEvent(formData: FormData) {
  const who = await requireHouse();
  if (!who) return;
  const id = String(formData.get("id") ?? "");

  // Before it goes, and while the guests are still readable: somebody who has
  // said they are coming must not find out by arriving. Deleting the event
  // cascades the invitation and every reply away with it.
  await tellGuestsItIsOff(id, who.journeyId);
  await clearGuestLedger(id);
  await prisma.journeyEvent.deleteMany({ where: { id, journeyId: who.journeyId } });

  revalidatePath("/appointments");
  revalidatePath("/journey");
}

// ── Invitations ───────────────────────────────────────────────────────────

function readInviteSettings(formData: FormData) {
  const hostName = String(formData.get("hostName") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim() || null;
  const capRaw = String(formData.get("capacity") ?? "").trim();
  const cap = capRaw ? Number.parseInt(capRaw, 10) : NaN;
  const by = String(formData.get("repliesBy") ?? "").trim();
  return {
    hostName: hostName.slice(0, HOST_NAME_MAX),
    message: message ? message.slice(0, MESSAGE_MAX) : null,
    showGuestList: formData.get("showGuestList") === "on",
    allowPlusOnes: formData.get("allowPlusOnes") === "on",
    // A cap of nothing and a cap of zero are different mistakes; both mean
    // "don't cap it", because a gathering nobody may come to is not one.
    capacity: Number.isFinite(cap) && cap > 0 ? Math.min(cap, 2000) : null,
    repliesBy: /^\d{4}-\d{2}-\d{2}$/.test(by)
      ? new Date(`${by}T23:59:59.000Z`)
      : null,
  };
}

/**
 * Turn a day into an invitation, or save changes to one.
 *
 * The slug is made once and never changes, so a link already in somebody's
 * WhatsApp keeps working when the wording is edited. Killing a link is a
 * separate, deliberate act — see `revokeInvitation`.
 */
export async function saveInvitation(formData: FormData): Promise<Result> {
  const who = await requireHouse();
  if (!who) return { ok: false, error: "This is the household's diary." };
  const eventId = String(formData.get("eventId") ?? "");
  const event = await prisma.journeyEvent.findFirst({
    where: { id: eventId, journeyId: who.journeyId },
    select: { id: true },
  });
  if (!event) return { ok: false, error: "That day is no longer here." };

  const s = readInviteSettings(formData);
  if (!s.hostName) return { ok: false, error: "Say who the invitation is from." };

  await prisma.invitation.upsert({
    where: { eventId },
    // A dead link stays dead: only `revokeInvitation` sets that field, and
    // only `restoreInvitation` clears it.
    update: s,
    create: { eventId, slug: newSlug(), ...s },
  });

  revalidatePath("/appointments");
  return { ok: true };
}

export async function setInvitationClosed(
  eventId: string,
  closed: boolean,
): Promise<Result> {
  const who = await requireHouse();
  if (!who) return { ok: false, error: "This is the household's diary." };
  const n = await prisma.invitation.updateMany({
    where: { eventId, event: { journeyId: who.journeyId } },
    data: { closedAt: closed ? new Date() : null },
  });
  if (n.count === 0) return { ok: false, error: "That invitation is gone." };
  revalidatePath("/appointments");
  return { ok: true };
}

/**
 * Kill the link. The row survives, so the replies survive with it: revoking by
 * accident on the morning of a shower has not lost the list of who was coming.
 */
export async function revokeInvitation(eventId: string): Promise<Result> {
  const who = await requireHouse();
  if (!who) return { ok: false, error: "This is the household's diary." };
  await prisma.invitation.updateMany({
    where: { eventId, event: { journeyId: who.journeyId } },
    data: { revokedAt: new Date() },
  });
  revalidatePath("/appointments");
  return { ok: true };
}

export async function restoreInvitation(eventId: string): Promise<Result> {
  const who = await requireHouse();
  if (!who) return { ok: false, error: "This is the household's diary." };
  await prisma.invitation.updateMany({
    where: { eventId, event: { journeyId: who.journeyId } },
    data: { revokedAt: null },
  });
  revalidatePath("/appointments");
  return { ok: true };
}

/** Take somebody off the list — for a duplicate, not for disagreeing. */
export async function removeReply(replyId: string): Promise<Result> {
  const who = await requireHouse();
  if (!who) return { ok: false, error: "This is the household's diary." };
  await prisma.invitationReply.deleteMany({
    where: { id: replyId, invitation: { event: { journeyId: who.journeyId } } },
  });
  revalidatePath("/appointments");
  return { ok: true };
}

// ── "Which day suits?" ────────────────────────────────────────────────────

function readOptions(formData: FormData): { at: Date; hasTime: boolean }[] {
  const dates = formData.getAll("optionDate").map(String);
  const times = formData.getAll("optionTime").map(String);
  const out: { at: Date; hasTime: boolean }[] = [];
  const seen = new Set<string>();
  for (const [i, d] of dates.entries()) {
    const date = d.trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) continue;
    const t = (times[i] ?? "").trim();
    const hasTime = /^\d{2}:\d{2}$/.test(t);
    const at = new Date(`${date}T${hasTime ? t : "09:00"}:00.000Z`);
    if (Number.isNaN(at.getTime())) continue;
    // The same day offered twice is a slip, not a choice, and it splits the
    // vote between two rows that mean the same thing.
    const key = at.toISOString();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ at, hasTime });
    if (out.length >= MAX_OPTIONS) break;
  }
  return out;
}

export async function askWhichDay(formData: FormData): Promise<Result> {
  const who = await requireHouse();
  if (!who) return { ok: false, error: "This is the household's diary." };
  const eventId = String(formData.get("eventId") ?? "");
  const invitation = await prisma.invitation.findFirst({
    where: { eventId, event: { journeyId: who.journeyId } },
    select: { id: true, settledAt: true },
  });
  if (!invitation) return { ok: false, error: "Make the invitation first." };
  if (invitation.settledAt) return { ok: false, error: "This day is already settled." };

  const options = readOptions(formData);
  if (options.length < MIN_OPTIONS) {
    return {
      ok: false,
      error: `Offer at least ${MIN_OPTIONS} days — one day is not a question.`,
    };
  }

  /**
   * Changing the days after people have answered throws their answers away,
   * because a tick is against a particular day and there is no honest way to
   * move it to a different one. Better to say so than to quietly lose six
   * people's replies.
   */
  const existingVotes = await prisma.invitationVote.count({
    where: { option: { invitationId: invitation.id } },
  });
  if (existingVotes > 0) {
    const current = await prisma.invitationOption.findMany({
      where: { invitationId: invitation.id },
      select: { at: true, hasTime: true },
      orderBy: { at: "asc" },
    });
    const same =
      current.length === options.length &&
      current.every(
        (c, i) =>
          c.at.getTime() === options[i].at.getTime() &&
          c.hasTime === options[i].hasTime,
      );
    if (!same) {
      return {
        ok: false,
        error:
          "People have already answered these days. Settle on one, or switch the link off and start again — changing the days now would throw their answers away.",
      };
    }
  }

  await prisma.$transaction([
    prisma.invitationOption.deleteMany({ where: { invitationId: invitation.id } }),
    prisma.invitationOption.createMany({
      data: options.map((o) => ({ invitationId: invitation.id, ...o })),
    }),
    // The diary needs a day to hang it on; the earliest offered is the honest
    // placeholder, and nothing on the page calls it settled.
    prisma.journeyEvent.update({
      where: { id: eventId },
      data: { at: options[0].at, hasTime: options[0].hasTime, endsAt: null },
    }),
  ]);

  revalidatePath("/appointments");
  return { ok: true };
}

/**
 * Settle on a day. This is the moment the question becomes an invitation.
 *
 * Everyone who ticked the chosen day keeps their yes. Everyone who did not
 * becomes a no — not to overrule them, but because that is precisely what they
 * said: this day does not suit. They are told, and can still change it.
 */
export async function settleOnDay(optionId: string): Promise<Result> {
  const who = await requireHouse();
  if (!who) return { ok: false, error: "This is the household's diary." };

  const option = await prisma.invitationOption.findFirst({
    where: { id: optionId, invitation: { event: { journeyId: who.journeyId } } },
    select: {
      id: true,
      at: true,
      hasTime: true,
      endsAt: true,
      invitation: {
        select: {
          id: true,
          slug: true,
          hostName: true,
          eventId: true,
          revokedAt: true,
          event: { select: { title: true, where: true } },
          replies: { select: { id: true, name: true, email: true } },
        },
      },
      votes: { select: { replyId: true } },
    },
  });
  if (!option) return { ok: false, error: "That day is no longer on offer." };

  const inv = option.invitation;
  const canCome = new Set(option.votes.map((v) => v.replyId));

  await prisma.$transaction([
    prisma.journeyEvent.update({
      where: { id: inv.eventId },
      data: { at: option.at, hasTime: option.hasTime, endsAt: option.endsAt },
    }),
    prisma.invitation.update({
      where: { id: inv.id },
      data: { settledAt: new Date() },
    }),
    prisma.invitationReply.updateMany({
      where: { invitationId: inv.id, id: { in: [...canCome] } },
      data: { answer: "YES" },
    }),
    prisma.invitationReply.updateMany({
      where: { invitationId: inv.id, id: { notIn: [...canCome] } },
      data: { answer: "NO" },
    }),
    // A day that was still a question has never been announced, and a stamp
    // from the placeholder date must not suppress the real one.
    prisma.invitation.update({
      where: { id: inv.id },
      data: {
        remindedDayBeforeAt: null,
        remindedMorningAt: null,
        hostDigestAt: null,
      },
    }),
  ]);

  if (!inv.revokedAt) {
    const when = whenWords(option.at, option.hasTime, option.endsAt);
    for (const r of inv.replies) {
      if (!r.email) continue;
      try {
        await sendGuestDayEmail({
          to: r.email,
          name: r.name,
          lead: "The day is settled",
          title: inv.event.title,
          when,
          where: inv.event.where,
          hostName: inv.hostName,
          url: inviteUrl(inv.slug),
          note: canCome.has(r.id)
            ? "You said this one worked, so you are down as coming."
            : "You had said this day did not suit, so you are down as not coming. If that has changed, the invitation still takes a change.",
        });
      } catch {
        // One address that will not take must not stop the rest being told.
      }
    }
  }

  revalidatePath("/appointments");
  revalidatePath(`/i/${inv.slug}`);
  return { ok: true };
}

// ── Telling the guests when something changes ─────────────────────────────

/**
 * Forget that this invitation has been reminded about.
 *
 * Called when the day moves. The stamps say "we have already told them about
 * this day" — and once the day is a different day, that is no longer true.
 * Leaving them set is how a move silently swallows everybody's "tomorrow".
 */
async function clearGuestLedger(eventId: string) {
  await prisma.invitation.updateMany({
    where: { eventId },
    data: {
      remindedDayBeforeAt: null,
      remindedMorningAt: null,
      hostDigestAt: null,
    },
  });
}

/**
 * The day moved, and people are planning to turn up.
 *
 * This is the one place an invitation can do real harm: a dozen people arrive
 * somewhere on the wrong afternoon because the app quietly knew and did not
 * say. Anybody who left an address is told at once — not on the next nightly
 * run, because the whole point is that they might be about to leave.
 */
async function tellGuestsItMoved(
  eventId: string,
  title: string,
  when: { at: Date; hasTime: boolean; endsAt: Date | null },
  where: string | null,
) {
  try {
    const inv = await prisma.invitation.findUnique({
      where: { eventId },
      select: {
        slug: true,
        hostName: true,
        revokedAt: true,
        replies: {
          where: { answer: { in: ["YES", "MAYBE"] }, email: { not: null } },
          select: { name: true, email: true },
        },
      },
    });
    if (!inv || inv.revokedAt || inv.replies.length === 0) return;
    const words = whenWords(when.at, when.hasTime, when.endsAt);
    for (const r of inv.replies) {
      if (!r.email) continue;
      await sendGuestDayEmail({
        to: r.email,
        name: r.name,
        lead: "The day has moved",
        title,
        when: words,
        where,
        hostName: inv.hostName,
        url: inviteUrl(inv.slug),
        note: "This is the new day and time. Your reply still stands — change it on the invitation if this no longer suits.",
      });
    }
  } catch (err) {
    console.error("[invitation] could not tell the guests it moved", err);
  }
}

/** The day is being taken out of the diary, and people were coming to it. */
async function tellGuestsItIsOff(eventId: string, journeyId: string) {
  try {
    const event = await prisma.journeyEvent.findFirst({
      where: { id: eventId, journeyId },
      select: {
        title: true,
        at: true,
        hasTime: true,
        endsAt: true,
        where: true,
        invitation: {
          select: {
            slug: true,
            hostName: true,
            revokedAt: true,
            replies: {
              where: { answer: { in: ["YES", "MAYBE"] }, email: { not: null } },
              select: { name: true, email: true },
            },
          },
        },
      },
    });
    const inv = event?.invitation;
    if (!event || !inv || inv.revokedAt || inv.replies.length === 0) return;
    for (const r of inv.replies) {
      if (!r.email) continue;
      await sendGuestDayEmail({
        to: r.email,
        name: r.name,
        lead: "This is not happening now",
        title: event.title,
        when: whenWords(event.at, event.hasTime, event.endsAt),
        where: event.where,
        hostName: inv.hostName,
        // No link. Deleting the event takes the invitation with it, so the
        // last word a guest gets must not be a button to a dead page.
        url: null,
        note: "It has been taken out of the diary, so please do not set off. Do speak to them if you need to — this is the last you will hear about it from us.",
      });
    }
  } catch (err) {
    console.error("[invitation] could not tell the guests it is off", err);
  }
}
