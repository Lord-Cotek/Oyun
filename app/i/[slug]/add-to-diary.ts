"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getActiveMembership } from "@/lib/data";
import { isHousehold } from "@/lib/roles";

type Result = { ok: true; already?: boolean } | { ok: false; error: string };

/**
 * Put somebody else's invitation into your own journey's diary.
 *
 * ── Why this exists ──────────────────────────────────────────────────────
 * Two mothers both use Oyun and one invites the other to a shower, or the
 * antenatal group arranges a meal. Until now the only way that day reached the
 * second journey's diary was to download a .ics and then also type it in by
 * hand, or to not have it in Oyun at all — which meant the app she keeps her
 * days in was the one place the day was missing, and nobody in that house got
 * the day-before or the morning.
 *
 * ── What it copies, and what it does not ─────────────────────────────────
 * The title, the day, the hour and the place: exactly what is on the public
 * invitation and nothing more. It does NOT copy the other household's private
 * note, does not join the two houses to each other, and creates no link either
 * of them can see. It is a day written down, the same as if it had been typed.
 *
 * The copy is an ordinary day in this house's diary from that moment on. If
 * the other family moves it, this copy does not move — they are told by email
 * if they left an address, and the day is theirs to correct. Quietly reaching
 * into another household's diary and rewriting a day there is not something
 * this app should do.
 *
 * ── Who may ──────────────────────────────────────────────────────────────
 * The mother and the one beside her, the same rule as the rest of the
 * appointment book. A day put in the diary is a day they are both then
 * reminded about, and that is not a thing a visitor to the circle decides for
 * them.
 */
export async function addInvitationToMyDiary(slug: string): Promise<Result> {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, error: "Sign in to Ìdílé first." };
  }
  const active = await getActiveMembership(session.user.id);
  if (!active) return { ok: false, error: "You have no journey on Oyun yet." };
  if (!isHousehold(active.role)) {
    return {
      ok: false,
      error: "Only the mother or the one beside her can put a day in the diary.",
    };
  }

  const invitation = await prisma.invitation.findUnique({
    where: { slug },
    select: {
      id: true,
      revokedAt: true,
      settledAt: true,
      _count: { select: { options: true } },
      event: {
        select: {
          title: true,
          at: true,
          hasTime: true,
          endsAt: true,
          where: true,
          cancelledAt: true,
          journeyId: true,
        },
      },
    },
  });
  if (!invitation || invitation.revokedAt) {
    return { ok: false, error: "That invitation is no longer here." };
  }
  if (invitation.event.cancelledAt) {
    return { ok: false, error: "That day has been called off." };
  }
  // A day that is still a question has no day to copy. The placeholder on the
  // event is the earliest one being offered, and writing that into somebody's
  // diary as fact is how a family turns up on the wrong Saturday.
  if (!invitation.settledAt && invitation._count.options > 0) {
    return {
      ok: false,
      error: "The day is not settled yet. Come back once they have chosen one.",
    };
  }
  // Their own invitation is already in their own diary — it IS their diary.
  if (invitation.event.journeyId === active.journey.id) {
    return { ok: true, already: true };
  }

  const existing = await prisma.journeyEvent.findFirst({
    where: {
      journeyId: active.journey.id,
      fromInvitationId: invitation.id,
    },
    select: { id: true },
  });
  if (existing) return { ok: true, already: true };

  await prisma.journeyEvent.create({
    data: {
      journeyId: active.journey.id,
      createdById: session.user.id,
      title: invitation.event.title,
      at: invitation.event.at,
      hasTime: invitation.event.hasTime,
      endsAt: invitation.event.endsAt,
      where: invitation.event.where,
      kind: "GATHERING",
      fromInvitationId: invitation.id,
    },
  });

  revalidatePath("/appointments");
  revalidatePath("/journey");
  return { ok: true };
}
