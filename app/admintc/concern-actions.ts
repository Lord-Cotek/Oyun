"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { audit, requireUnlockedAdmin } from "@/lib/admin";
import { OUTCOME_MAX, isConcernState } from "@/lib/concerns";

type Result = { ok: true; said: string } | { ok: false; error: string };

/**
 * Settle one, and say how.
 *
 * ── Why a note is required to close something ────────────────────────────
 * Because "closed" on its own is indistinguishable from "ignored", and the
 * person who picks the queue up next has no way to tell which. One sentence
 * costs nothing now and is the whole record later.
 *
 * Nothing here writes to the person — answering is an email, sent the way any
 * human would send one. The note records that it was done.
 */
export async function settleConcern(
  id: string,
  state: string,
  outcome: string,
): Promise<Result> {
  const admin = await requireUnlockedAdmin();
  if (!isConcernState(state)) return { ok: false, error: "Not a state this can be in." };

  const note = outcome.trim().slice(0, OUTCOME_MAX);
  if (state !== "OPEN" && !note) {
    return { ok: false, error: "Say what happened. The next person has only this." };
  }

  const existing = await prisma.concern.findUnique({
    where: { id },
    select: { email: true },
  });
  if (!existing) return { ok: false, error: "That has gone." };

  await prisma.concern.update({
    where: { id },
    data: {
      state,
      outcome: note || null,
      handledBy: state === "OPEN" ? null : admin.email,
      handledAt: state === "OPEN" ? null : new Date(),
    },
  });

  await audit(
    admin.email,
    state === "OPEN" ? "reopened a concern" : `marked a concern ${state.toLowerCase()}`,
    existing.email,
    note || null,
  );
  revalidatePath("/admintc/concerns");
  revalidatePath("/admintc/audit");
  revalidatePath("/admintc");
  return { ok: true, said: "Written down." };
}
