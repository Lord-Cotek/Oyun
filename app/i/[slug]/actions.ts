"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { notify } from "@/lib/notify";
import {
  isAnswer,
  inviteState,
  headCount,
  roomFor,
  GUEST_NAME_MAX,
  GUEST_NOTE_MAX,
  PARTY_MAX,
  REPLIES_MAX,
  isPoll,
} from "@/lib/invitations";
import { guestCookieName, newGuestToken } from "@/lib/invitations-db";
import { HOUSEHOLD_ROLES } from "@/lib/roles";

type Result = { ok: true } | { ok: false; error: string };

/**
 * A guest replying to an invitation. No account, and there will never be one.
 *
 * ── What stands in for a login ───────────────────────────────────────────
 * The guest's browser keeps a long random token in a cookie. It is how the
 * same person edits their own answer instead of adding a second one — people
 * tap twice, change their mind, and come back a week later to say the baby is
 * ill — and it is why one guest cannot edit another's reply.
 *
 * Lose the cookie and you get a new row, which is the right failure: worse
 * would be trusting a typed name, where anyone could overwrite anyone.
 *
 * ── What this refuses ────────────────────────────────────────────────────
 * Everything is checked here and not only in the form, because this is a
 * public endpoint and the form is not a wall. A closed invitation, a revoked
 * link, a day already gone, a party of forty, a wall of text, a five-hundredth
 * reply — each is turned away with a sentence saying which.
 */
export async function reply(formData: FormData): Promise<Result> {
  const slug = String(formData.get("slug") ?? "");
  const invitation = await prisma.invitation.findUnique({
    where: { slug },
    select: {
      id: true,
      allowPlusOnes: true,
      capacity: true,
      closedAt: true,
      revokedAt: true,
      repliesBy: true,
      event: {
        select: {
          id: true,
          title: true,
          at: true,
          endsAt: true,
          cancelledAt: true,
          journeyId: true,
        },
      },
      settledAt: true,
      options: { select: { id: true } },
      replies: { select: { answer: true, partySize: true, name: true } },
    },
  });
  if (!invitation || invitation.revokedAt) {
    return { ok: false, error: "This invitation is no longer here." };
  }

  const state = inviteState(
    invitation,
    invitation.event.at,
    invitation.event.endsAt,
  );
  if (state === "past") {
    return { ok: false, error: "This day has already been." };
  }
  if (state !== "open") {
    return { ok: false, error: "The host has stopped taking replies." };
  }
  if (invitation.event.cancelledAt) {
    return { ok: false, error: "This has been called off." };
  }

  const name = String(formData.get("name") ?? "")
    .trim()
    .slice(0, GUEST_NAME_MAX);
  if (!name) return { ok: false, error: "Put your name so they know who it is." };

  /**
   * ── Where the answer comes from ────────────────────────────────────────
   * On an ordinary invitation it is the question, so it is asked.
   *
   * On a "which day suits?" it is not a second question — asking somebody to
   * tick three days AND then separately declare that they are coming is the
   * form making them say the same thing twice, and one of the two will end up
   * contradicting the other. So it is derived: ticking any day at all is a
   * yes, ticking none is "none of these work for me", which is a real and
   * useful answer and the only one a poll can honestly record.
   */
  const poll = isPoll(invitation);
  const ticked = poll
    ? formData
        .getAll("option")
        .map(String)
        .filter((id) => invitation.options.some((o) => o.id === id))
        .slice(0, 12)
    : [];

  const answer = poll
    ? ticked.length > 0
      ? "YES"
      : "NO"
    : String(formData.get("answer") ?? "");
  if (!isAnswer(answer)) return { ok: false, error: "Choose one of the three." };

  const sizeRaw = Number.parseInt(String(formData.get("partySize") ?? "1"), 10);
  let partySize = Number.isFinite(sizeRaw) ? sizeRaw : 1;
  partySize = Math.max(1, Math.min(PARTY_MAX, partySize));
  // Somebody who can't come is one reply, whatever they typed in the box.
  if (!invitation.allowPlusOnes || answer === "NO") partySize = 1;

  const note =
    String(formData.get("note") ?? "")
      .trim()
      .slice(0, GUEST_NOTE_MAX) || null;

  /**
   * Optional, and held to a low bar on purpose.
   *
   * A wrong address costs a guest one reminder they never see. Refusing their
   * whole reply because a regular expression disliked their work address costs
   * the host a head count. So: something that looks like an address is kept,
   * anything else is dropped silently, and the answer goes through either way.
   *
   * Somebody who can't come is never asked and never stored — there is
   * nothing to remind them about.
   */
  const typed = String(formData.get("email") ?? "").trim().slice(0, 200);
  const email =
    answer !== "NO" && /^[^@\s]+@[^@\s.]+\.[^@\s]+$/.test(typed) ? typed : null;

  const cookieName = guestCookieName(slug);
  const jar = cookies();
  const existingToken = jar.get(cookieName)?.value;
  const mine = existingToken
    ? await prisma.invitationReply.findFirst({
        where: { token: existingToken, invitationId: invitation.id },
        select: { id: true, partySize: true, answer: true },
      })
    : null;

  // Is there room? Count what is already promised, minus this guest's own
  // previous answer, so somebody changing 4 to 2 is never told the party is
  // full by their own earlier self.
  if (answer === "YES" && !poll) {
    const promised = headCount(invitation.replies).coming;
    const taken =
      promised - (mine?.answer === "YES" ? mine.partySize : 0);
    if (!roomFor(invitation.capacity, taken, partySize)) {
      const left = Math.max(0, (invitation.capacity ?? 0) - taken);
      return {
        ok: false,
        error: left
          ? `There is only room for ${left} more. Ask them if you need to.`
          : "It is full. Do ask them — they may be able to make room.",
      };
    }
  }

  if (mine) {
    await prisma.invitationReply.update({
      where: { id: mine.id },
      data: { name, answer, partySize, note, email },
    });
    if (poll) await setVotes(mine.id, ticked);
  } else {
    if (invitation.replies.length >= REPLIES_MAX) {
      return { ok: false, error: "This invitation has as many replies as it can hold." };
    }
    const token = newGuestToken();
    const created = await prisma.invitationReply.create({
      data: {
        invitationId: invitation.id,
        token,
        name,
        answer,
        partySize,
        note,
        email,
      },
      select: { id: true },
    });
    if (poll) await setVotes(created.id, ticked);
    // A year: long enough that somebody who replied in March can still change
    // their answer in December, and it dies with the invitation regardless.
    jar.set(cookieName, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: `/i/${slug}`,
      maxAge: 60 * 60 * 24 * 365,
    });

    // Tell the house somebody answered — but only the first time, so a guest
    // who is still deciding does not ring a phone four times.
    await tellTheHouse(invitation.event, name, answer);
  }

  revalidatePath(`/i/${slug}`);
  revalidatePath("/appointments");
  return { ok: true };
}

/** Take my own reply back — for the person who replied and then cannot come. */
export async function withdraw(slug: string): Promise<Result> {
  const token = cookies().get(guestCookieName(slug))?.value;
  if (!token) return { ok: false, error: "There is nothing here to take back." };
  await prisma.invitationReply.deleteMany({
    where: { token, invitation: { slug } },
  });
  cookies().delete({ name: guestCookieName(slug), path: `/i/${slug}` });
  revalidatePath(`/i/${slug}`);
  revalidatePath("/appointments");
  return { ok: true };
}

async function tellTheHouse(
  event: { id: string; title: string; journeyId: string },
  name: string,
  answer: string,
) {
  const word =
    answer === "YES" ? "is coming" : answer === "MAYBE" ? "hopes to come" : "can't come";
  // The mother and the one beside her — the people whose day it is. The wider
  // circle is not told who replied to a shower they may not be at.
  const keepers = await prisma.membership.findMany({
    where: { journeyId: event.journeyId, role: { in: HOUSEHOLD_ROLES } },
    select: { userId: true },
  });
  for (const k of keepers) {
    try {
      await notify({
        userId: k.userId,
        type: "appointment",
        title: `${name} ${word} to ${event.title}.`,
        href: `/appointments#day-${event.id}`,
      });
    } catch {
      // A notification that does not send must never lose somebody's reply.
    }
  }
}

/**
 * Replace this guest's ticks with exactly what they have just sent.
 *
 * Deleting and rewriting rather than working out a difference: a guest's set
 * of days is small, and "whatever the form says is now the truth" cannot drift
 * out of step with what they are looking at. Unticking Saturday has to remove
 * Saturday, and a diff that gets that wrong leaves a host planning around a
 * day nobody can make.
 */
async function setVotes(replyId: string, optionIds: string[]) {
  await prisma.invitationVote.deleteMany({ where: { replyId } });
  if (optionIds.length === 0) return;
  await prisma.invitationVote.createMany({
    data: optionIds.map((optionId) => ({ optionId, replyId })),
    skipDuplicates: true,
  });
}
