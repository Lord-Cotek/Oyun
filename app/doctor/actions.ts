"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { HOUR, allowAll, callerIp } from "@/lib/rate-limit";
import { hashPassword, passwordProblem } from "@/lib/password";
import { sendConfirmEmail } from "@/lib/email";
import { makeConfirmLink } from "@/lib/email-confirm";
import { notify } from "@/lib/notify";
import { cleanField, clinicianOf, newClinicCode } from "@/lib/clinician";

const SITE_DEFAULT = "https://oyun.cotek.app";
type Result = { ok: boolean; error?: string };

/** The clinician's own details, read from a form. */
function readProfile(fd: FormData): { displayName: string | null; title: string | null; practice: string | null; declared: boolean } {
  return {
    displayName: cleanField(fd.get("displayName"), 80),
    title: cleanField(fd.get("title"), 80),
    practice: cleanField(fd.get("practice"), 120),
    declared: fd.get("declared") === "on",
  };
}

const DECLARE =
  "Please confirm you are a health professional and will use what patients share only for their care.";

/**
 * A new clinician, with no Oyun account yet. The same care as any sign-up —
 * the same password rule, the same limit per device, never a password set
 * on an address somebody merely typed — and a clinic code made at once, so
 * the dashboard they land on already has something to give a patient.
 */
export async function registerClinician(_prev: unknown, fd: FormData): Promise<Result> {
  const email = String(fd.get("email") ?? "").trim().toLowerCase();
  const password = String(fd.get("password") ?? "");
  const p = readProfile(fd);
  if (!p.displayName) return { ok: false, error: "Please enter your name as patients will see it." };
  if (!email || !email.includes("@")) return { ok: false, error: "Please enter a valid email address." };
  const pw = passwordProblem(password);
  if (pw) return { ok: false, error: pw };
  if (!p.declared) return { ok: false, error: DECLARE };
  if (!(await allowAll([[`signup:ip:${callerIp()}`, 10, HOUR]]))) {
    return { ok: false, error: "Too many new accounts from here just now. Please try again in a little while." };
  }
  const existing = await prisma.user.findUnique({ where: { email }, select: { id: true } });
  if (existing) {
    return { ok: false, error: "An account with this email already exists. Sign in, then set up your clinician account." };
  }
  const code = await newClinicCode();
  const user = await prisma.user.create({
    data: {
      email,
      name: p.displayName,
      passwordHash: await hashPassword(password),
      // A clinician's room carries no devotional content either way; if they
      // ever start a journey of their own, Settings is where they choose.
      voice: "GENERAL",
      clinician: { create: { displayName: p.displayName, title: p.title, practice: p.practice, code } },
    },
    select: { id: true },
  });
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? SITE_DEFAULT;
  await makeConfirmLink(user.id, email, site)
    .then((link) => sendConfirmEmail({ to: email, name: p.displayName, link }))
    .catch(() => {});
  return { ok: true };
}

/** Somebody already signed in to Oyun sets up a clinician account beside it. */
export async function becomeClinician(fd: FormData): Promise<Result> {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in?callbackUrl=/doctor/join");
  const p = readProfile(fd);
  if (!p.displayName) return { ok: false, error: "Please enter your name as patients will see it." };
  if (!p.declared) return { ok: false, error: DECLARE };
  const already = await clinicianOf(session.user.id);
  if (!already) {
    await prisma.clinician.create({
      data: { userId: session.user.id, displayName: p.displayName, title: p.title, practice: p.practice, code: await newClinicCode() },
    });
  }
  revalidatePath("/doctor");
  return { ok: true };
}

/** A clinician changes how patients see them. The code does not change. */
export async function updateClinicianProfile(_prev: unknown, fd: FormData): Promise<Result & { message?: string }> {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in?callbackUrl=/doctor");
  const c = await clinicianOf(session.user.id);
  if (!c) return { ok: false, error: "There is no clinician account here." };
  const p = readProfile(fd);
  if (!p.displayName) return { ok: false, error: "Please enter your name as patients will see it." };
  await prisma.clinician.update({ where: { id: c.id }, data: { displayName: p.displayName, title: p.title, practice: p.practice } });
  revalidatePath("/doctor");
  return { ok: true, message: "Saved." };
}

/**
 * A clinician takes a patient off their list. It ends the sharing exactly as
 * if she had: nothing more is visible from that moment. She is told, so a
 * mother never believes a doctor is still looking when they are not.
 */
export async function endLinkAsClinician(linkId: string): Promise<Result> {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in?callbackUrl=/doctor");
  const link = await prisma.clinicianLink.findUnique({
    where: { id: String(linkId).slice(0, 64) },
    include: { clinician: { select: { userId: true, displayName: true } } },
  });
  if (!link || link.clinician.userId !== session.user.id) return { ok: false, error: "That patient is not on your list." };
  if (!link.endedAt) {
    await prisma.clinicianLink.update({ where: { id: link.id }, data: { endedAt: new Date(), endedBy: "CLINICIAN" } });
    await notify({
      userId: link.grantedById,
      type: "health_shared",
      title: `${link.clinician.displayName} is no longer looking at your records.`,
      body: "They took you off their list in Oyun. Nothing more is shared with them. You can share again any time from Health.",
      href: "/health/doctor",
    });
  }
  revalidatePath("/doctor");
  return { ok: true };
}
