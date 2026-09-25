"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { audit, requireUnlockedAdmin } from "@/lib/admin";
import {
  audienceCount,
  isAudience,
  sendOnePass,
  type Audience,
} from "@/lib/broadcast";
import { sendBroadcastEmail } from "@/lib/email";

type Result = { ok: true; said: string } | { ok: false; error: string };

/**
 * Writing, testing and sending one email to everybody.
 *
 * ── The order is the safety ──────────────────────────────────────────────
 * Write it. Send it to yourself and read it in a real inbox. Then type the
 * number of people it is about to reach. Nothing here is a single button,
 * because the mistake this guards against is not malice — it is somebody
 * finishing a draft and pressing the thing next to it.
 */

/** Save a draft. Nothing is sent. */
export async function saveBroadcast(formData: FormData): Promise<Result> {
  const admin = await requireUnlockedAdmin();
  const subject = String(formData.get("subject") ?? "").trim().slice(0, 200);
  const body = String(formData.get("body") ?? "").replace(/\r\n?/g, "\n").trim().slice(0, 20000);
  const audienceRaw = String(formData.get("audience") ?? "OPTED_IN");

  if (!subject) return { ok: false, error: "It needs a subject." };
  if (!body) return { ok: false, error: "It needs something to say." };
  if (!isAudience(audienceRaw)) return { ok: false, error: "Choose who it is for." };

  const b = await prisma.broadcast.create({
    data: { subject, body, audience: audienceRaw, createdBy: admin.email },
  });
  await audit(admin.email, "drafted a broadcast", subject, `to ${audienceRaw}`);
  revalidatePath("/admintc/broadcast");
  return { ok: true, said: `Saved. Send it to yourself before you send it to anybody else. (${b.id})` };
}

/** Send the draft to the admin reading it, and to nobody else. */
export async function sendTest(id: string): Promise<Result> {
  const admin = await requireUnlockedAdmin();
  const b = await prisma.broadcast.findUnique({ where: { id } });
  if (!b) return { ok: false, error: "That draft is gone." };

  const ok = await sendBroadcastEmail({
    to: admin.email,
    name: null,
    subject: `[test] ${b.subject}`,
    body: b.body,
  }).catch(() => false);

  await audit(admin.email, "sent a broadcast to themselves", b.subject);
  revalidatePath("/admintc/broadcast");
  return ok
    ? { ok: true, said: `Sent to ${admin.email}. Read it there before going further.` }
    : { ok: false, error: "The test did not send. Nothing has gone to anybody else." };
}

/** Throw a draft away. Only before it has started. */
export async function discardBroadcast(id: string): Promise<Result> {
  const admin = await requireUnlockedAdmin();
  const b = await prisma.broadcast.findUnique({ where: { id } });
  if (!b) return { ok: false, error: "That draft is gone." };
  if (b.startedAt) return { ok: false, error: "That one has already started sending." };

  await prisma.broadcast.delete({ where: { id } });
  await audit(admin.email, "discarded a broadcast", b.subject);
  revalidatePath("/admintc/broadcast");
  return { ok: true, said: "Thrown away." };
}

/**
 * Begin sending, and do the first pass.
 *
 * ── Why the count has to be typed ────────────────────────────────────────
 * Because it makes the operator look at it. "Send to everyone" is a phrase;
 * "1,284" is a number of people, and typing it is the moment somebody
 * notices they meant to pick the other audience.
 *
 * startedAt is claimed with a conditional update, so two presses a second
 * apart cannot both begin: the second finds startedAt already set and stops
 * rather than writing to the first fifty people twice.
 */
export async function beginSending(id: string, typedCount: string): Promise<Result> {
  const admin = await requireUnlockedAdmin();
  const b = await prisma.broadcast.findUnique({ where: { id } });
  if (!b) return { ok: false, error: "That draft is gone." };
  if (b.startedAt) return { ok: false, error: "That one has already started." };

  const audience = (isAudience(b.audience) ? b.audience : "OPTED_IN") as Audience;
  const count = await audienceCount(audience);
  if (Number(typedCount.replace(/[,\s]/g, "")) !== count) {
    return {
      ok: false,
      error: `Type ${count} exactly — that is how many people this reaches.`,
    };
  }

  const claimed = await prisma.broadcast.updateMany({
    where: { id, startedAt: null },
    data: { startedAt: new Date() },
  });
  if (claimed.count === 0) return { ok: false, error: "That one has already started." };

  await audit(admin.email, "began sending a broadcast", b.subject, `to ${count} people`);
  const pass = await sendOnePass(id);
  revalidatePath("/admintc/broadcast");
  revalidatePath("/admintc/audit");
  return {
    ok: true,
    said: pass.done
      ? `Sent to ${pass.sentTotal}. Finished.`
      : `${pass.sentTotal} so far. Press on to send the next batch.`,
  };
}

/** The next batch of an already-started broadcast. */
export async function sendNextBatch(id: string): Promise<Result> {
  const admin = await requireUnlockedAdmin();
  const b = await prisma.broadcast.findUnique({ where: { id } });
  if (!b) return { ok: false, error: "That draft is gone." };
  if (!b.startedAt) return { ok: false, error: "That one has not been started." };
  if (b.finishedAt) return { ok: false, error: "That one has finished." };

  const pass = await sendOnePass(id);
  await audit(
    admin.email,
    "sent another batch of a broadcast",
    b.subject,
    `${pass.sent} sent, ${pass.failed} refused`,
  );
  revalidatePath("/admintc/broadcast");
  revalidatePath("/admintc/audit");
  return {
    ok: true,
    said: pass.done
      ? `Sent to ${pass.sentTotal}. Finished.`
      : `${pass.sentTotal} so far. Press on for the next batch.`,
  };
}
