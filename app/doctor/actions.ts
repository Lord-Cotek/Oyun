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
import { acceptInvite, inviteByToken, inviteState, invitesWaitingFor } from "@/lib/clinician-invite";

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


/* ── Accepting a patient's emailed invitation — lib/clinician-invite.ts ──── */

type Accepted = { ok: true; linkId: string } | { ok: false; error: string };

/** Tell her the moment her doctor can see her records. */
async function tellPatient(invite: { invitedById: string }, clinicianName: string) {
  await notify({
    userId: invite.invitedById,
    type: "health_shared",
    title: `${clinicianName} accepted your invitation.`,
    body: "They can now see the health records you chose to share. You can see when they look, change what they see, or stop, under Health → Your doctor.",
    href: "/health/doctor",
    email: true,
  });
}

/**
 * A doctor with no Oyun account accepts: the account, the clinician profile
 * and the sharing are made in one step, so the next thing they see is her
 * records. The address is the invited one and cannot be changed here — the
 * link was sent to it, which is the proof it is theirs.
 */
export async function acceptInviteWithNewAccount(token: string, fd: FormData): Promise<Accepted> {
  const invite = await inviteByToken(token);
  if (!invite || inviteState(invite) !== "open") return { ok: false, error: "This invitation is no longer open. Ask her to send it again." };
  const p = readProfile(fd);
  const password = String(fd.get("password") ?? "");
  if (!p.displayName) return { ok: false, error: "Please enter your name as patients will see it." };
  const pw = passwordProblem(password);
  if (pw) return { ok: false, error: pw };
  if (!p.declared) return { ok: false, error: DECLARE };
  if (!(await allowAll([[`signup:ip:${callerIp()}`, 10, HOUR]]))) {
    return { ok: false, error: "Too many new accounts from here just now. Please try again in a little while." };
  }
  const existing = await prisma.user.findUnique({ where: { email: invite.email }, select: { id: true } });
  if (existing) return { ok: false, error: "There is already an Oyun account with this email. Sign in to accept the invitation." };
  const user = await prisma.user.create({
    data: {
      email: invite.email,
      name: p.displayName,
      passwordHash: await hashPassword(password),
      voice: "GENERAL",
      // Proven by the emailed link itself.
      emailVerified: new Date(),
    },
    select: { id: true },
  });
  const res = await acceptInvite(invite.id, user.id, { displayName: p.displayName, title: p.title, practice: p.practice });
  if (!res.ok) return res;
  await tellPatient(invite, res.clinicianName);
  return { ok: true, linkId: res.linkId };
}

/**
 * Somebody already signed in accepts. If they keep no clinician account yet
 * — a mother who is also a midwife, say — it is made from the details in
 * the same form, beside the account they already have.
 */
export async function acceptInviteSignedIn(token: string, fd: FormData | null): Promise<Accepted> {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: "Please sign in first." };
  const invite = await inviteByToken(token);
  if (!invite || inviteState(invite) !== "open") return { ok: false, error: "This invitation is no longer open. Ask her to send it again." };
  if (invite.journey.ownerId === session.user.id) return { ok: false, error: "This is your own invitation — it is for your doctor to open." };
  const has = await clinicianOf(session.user.id);
  let profile: { displayName: string; title: string | null; practice: string | null } | null = null;
  if (!has) {
    const p = fd ? readProfile(fd) : null;
    if (!p?.displayName) return { ok: false, error: "Please enter your name as patients will see it." };
    if (!p.declared) return { ok: false, error: DECLARE };
    profile = { displayName: p.displayName, title: p.title, practice: p.practice };
  }
  const res = await acceptInvite(invite.id, session.user.id, profile);
  if (!res.ok) return res;
  await tellPatient(invite, res.clinicianName);
  revalidatePath("/doctor");
  return { ok: true, linkId: res.linkId };
}


/**
 * Accept from inside the app — the invitation on their patients page, not
 * the emailed link. Only an invitation actually addressed to this confirmed
 * account can be named here; any other id is simply not theirs.
 */
export async function acceptInviteInApp(inviteId: string, fd: FormData | null): Promise<Accepted> {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: "Please sign in first." };
  const mine = (await invitesWaitingFor(session.user.id)).find((i) => i.id === String(inviteId));
  if (!mine) return { ok: false, error: "That invitation is no longer waiting for you." };
  const has = await clinicianOf(session.user.id);
  let profile: { displayName: string; title: string | null; practice: string | null } | null = null;
  if (!has) {
    const p = fd ? readProfile(fd) : null;
    if (!p?.displayName) return { ok: false, error: "Please enter your name as patients will see it." };
    if (!p.declared) return { ok: false, error: DECLARE };
    profile = { displayName: p.displayName, title: p.title, practice: p.practice };
  }
  const res = await acceptInvite(mine.id, session.user.id, profile, "app");
  if (!res.ok) return res;
  const invite = await prisma.clinicianInvite.findUnique({ where: { id: mine.id }, select: { invitedById: true } });
  if (invite) await tellPatient(invite, res.clinicianName);
  revalidatePath("/doctor");
  return { ok: true, linkId: res.linkId };
}

/**
 * "Not my patient." The invitation closes and nothing is shared; she is
 * told plainly, so she is not left waiting on a doctor who will not answer.
 */
export async function declineInviteInApp(inviteId: string): Promise<Result> {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: "Please sign in first." };
  const mine = (await invitesWaitingFor(session.user.id)).find((i) => i.id === String(inviteId));
  if (!mine) return { ok: true };
  const invite = await prisma.clinicianInvite.update({
    where: { id: mine.id },
    data: { cancelledAt: new Date() },
    select: { invitedById: true, email: true, doctorName: true },
  });
  await notify({
    userId: invite.invitedById,
    type: "health_shared",
    title: `${invite.doctorName?.trim() || invite.email} declined your invitation.`,
    body: "Nothing was shared. You can invite another doctor, or ask them for their clinic code, under Health → Your doctor.",
    href: "/health/doctor",
  });
  revalidatePath("/doctor");
  return { ok: true };
}
