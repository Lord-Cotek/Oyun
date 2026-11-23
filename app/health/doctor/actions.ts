"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getActiveMembership } from "@/lib/data";
import { allowAll, HOUR, MINUTE } from "@/lib/rate-limit";
import { notify } from "@/lib/notify";
import { clinicianLine, normaliseCode } from "@/lib/clinician";

type Found = { ok: true; code: string; line: string; displayName: string } | { ok: false; error: string };
type Result = { ok: boolean; error?: string };

/**
 * Only the mother shares her own records — see lib/clinician.ts. Her
 * partner keeps everything else he has, but this is hers.
 */
async function requireMother() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in?callbackUrl=/health/doctor");
  const active = await getActiveMembership(session.user.id);
  if (!active) redirect("/onboarding");
  if (active.role !== "MOTHER") return null;
  return { userId: session.user.id, journeyId: active.journey.id, name: active.journey.owner.name ?? null };
}

/**
 * Who a code belongs to, before anything is shared — so she sees the name
 * she expects to see. Limited per person, so the box cannot be used to walk
 * the list of clinicians in Oyun one guess at a time.
 */
export async function lookUpClinician(raw: string): Promise<Found> {
  const me = await requireMother();
  if (!me) return { ok: false, error: "Only the mother can share her records with a doctor." };
  if (!(await allowAll([[`clinic-code:${me.userId}`, 12, 10 * MINUTE], [`clinic-code-day:${me.userId}`, 40, 24 * HOUR]]))) {
    return { ok: false, error: "Too many tries just now. Please wait a few minutes and check the code with your doctor." };
  }
  const code = normaliseCode(raw);
  if (!code) return { ok: false, error: "That doesn’t look like a clinic code. It is six letters and numbers, like K7Q-3PM." };
  const c = await prisma.clinician.findUnique({ where: { code }, select: { displayName: true, title: true, practice: true, userId: true } });
  if (!c) return { ok: false, error: "No clinician has that code. Please check it with your doctor or midwife." };
  if (c.userId === me.userId) return { ok: false, error: "That is your own clinician code." };
  return { ok: true, code, line: clinicianLine(c), displayName: c.displayName };
}

/**
 * She agrees, and her records are shared. A link she ended before is opened
 * again rather than duplicated, so her doctor keeps one place for her and
 * she keeps one history of who looked.
 */
export async function shareWithClinician(input: { code: string; withPhotos: boolean; withAppointments: boolean; agreed: boolean }): Promise<Result> {
  const me = await requireMother();
  if (!me) return { ok: false, error: "Only the mother can share her records with a doctor." };
  if (!input.agreed) return { ok: false, error: "Please tick the box to confirm what will be shared." };
  const code = normaliseCode(input.code);
  const c = code ? await prisma.clinician.findUnique({ where: { code }, select: { id: true, userId: true, displayName: true } }) : null;
  if (!c || c.userId === me.userId) return { ok: false, error: "That clinic code is not valid any more. Please check it." };
  const flags = { withPhotos: !!input.withPhotos, withAppointments: !!input.withAppointments };
  await prisma.clinicianLink.upsert({
    where: { clinicianId_journeyId: { clinicianId: c.id, journeyId: me.journeyId } },
    create: { clinicianId: c.id, journeyId: me.journeyId, grantedById: me.userId, ...flags },
    update: { ...flags, endedAt: null, endedBy: null, grantedById: me.userId, createdAt: new Date() },
  });
  await notify({
    userId: c.userId,
    type: "health_shared",
    title: `${me.name?.trim() || "A patient"} shared her records with you.`,
    body: "Her health log, medicines, tests and appointments are in your Oyun patient list.",
    href: "/doctor",
    // A clinician may not open Oyun for days; the email is how they learn a
    // patient is now on their list.
    email: true,
  });
  revalidatePath("/health/doctor");
  return { ok: true };
}

/** What a link carries, changed by her alone. */
export async function changeSharing(linkId: string, input: { withPhotos: boolean; withAppointments: boolean }): Promise<Result> {
  const me = await requireMother();
  if (!me) return { ok: false, error: "Only the mother can change this." };
  const link = await prisma.clinicianLink.findFirst({ where: { id: String(linkId).slice(0, 64), journeyId: me.journeyId, endedAt: null } });
  if (!link) return { ok: false, error: "That doctor is no longer shared with." };
  await prisma.clinicianLink.update({ where: { id: link.id }, data: { withPhotos: !!input.withPhotos, withAppointments: !!input.withAppointments } });
  revalidatePath("/health/doctor");
  return { ok: true };
}

/** She stops sharing. It takes effect on the doctor's very next page. */
export async function stopSharing(linkId: string): Promise<Result> {
  const me = await requireMother();
  if (!me) return { ok: false, error: "Only the mother can change this." };
  const link = await prisma.clinicianLink.findFirst({ where: { id: String(linkId).slice(0, 64), journeyId: me.journeyId, endedAt: null } });
  if (!link) return { ok: true };
  await prisma.clinicianLink.update({ where: { id: link.id }, data: { endedAt: new Date(), endedBy: "PATIENT" } });
  revalidatePath("/health/doctor");
  return { ok: true };
}

/**
 * One Life post shown to her doctor, or taken back. Hers to decide, for the
 * posts she or her partner wrote — not a friend's words, which were written
 * for the family and not for a clinic.
 */
export async function setPostForDoctor(postId: string, on: boolean): Promise<Result> {
  const me = await requireMother();
  if (!me) return { ok: false, error: "Only the mother can share a post with her doctor." };
  const post = await prisma.post.findFirst({
    where: { id: String(postId).slice(0, 64), journeyId: me.journeyId },
    select: { id: true, author: { select: { memberships: { where: { journeyId: me.journeyId }, select: { role: true } } } } },
  });
  const role = post?.author.memberships[0]?.role;
  if (!post || (role !== "MOTHER" && role !== "PARTNER")) return { ok: false, error: "Only posts you or your partner wrote can be shared." };
  await prisma.post.update({ where: { id: post.id }, data: { forDoctorAt: on ? new Date() : null } });
  revalidatePath("/life");
  revalidatePath("/health/doctor");
  return { ok: true };
}
