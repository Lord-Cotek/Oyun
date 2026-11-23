"use server";

import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getActiveMembership } from "@/lib/data";
import { logAccess } from "@/lib/health-log-db";
import { hashReportToken } from "@/lib/health-report-link";
import { notify } from "@/lib/notify";
import { allow, HOUR } from "@/lib/rate-limit";
import { buildReport } from "@/lib/health-report";
import { renderReportPdf } from "@/lib/health-report-pdf";
import { healthCsv } from "@/lib/health-csv";
import { motherTimeZone } from "@/lib/medication-db";
import { sendDoctorReportEmail } from "@/lib/email";

type Result<T = object> = ({ ok: true } & T) | { ok: false; error: string };

/** Anyone the log is open to: Mum always, her partner while she shares it. */
async function keeper() {
  const session = await auth();
  if (!session?.user?.id) return null;
  const active = await getActiveMembership(session.user.id);
  if (!active) return null;
  return logAccess(session.user.id, active.journey.id);
}

/**
 * A view-only link to one report, for a doctor. Mum can make one, and so can
 * her partner while she shares the log with them — she sees every link, who
 * made it and when it was opened, can close any of them, and is told when
 * her partner makes one. Switching her log to "Only me" closes her partner's
 * links (see setLogAudience). The token comes from node:crypto and only its
 * hash is stored, so the link is shown once.
 */
export async function createReportLink(input: { from: string; to: string; withPhotos: boolean; label?: string; days?: number; forPrinting?: boolean }): Promise<Result<{ path: string; expiresAt: string }>> {
  const a = await keeper();
  if (!a) return { ok: false, error: "The health report is not open to you." };
  const ymd = /^\d{4}-\d{2}-\d{2}$/;
  if (!ymd.test(input.from) || !ymd.test(input.to) || input.to < input.from) return { ok: false, error: "Choose the period first." };
  const days = Math.min(30, Math.max(1, Math.round(Number(input.days) || 7)));
  const raw = randomBytes(24).toString("base64url");
  // In the installed app nothing can print or download, so "save as PDF"
  // opens the report in the phone's own browser — which is not signed in —
  // through a link of her own that lasts two hours. It is listed with her
  // other links like any of them, and can be closed the same way.
  const expiresAt = new Date(Date.now() + (input.forPrinting ? 2 * 3_600_000 : days * 86_400_000));
  await prisma.healthReportLink.create({
    data: {
      journeyId: a.journeyId,
      createdById: a.userId,
      tokenHash: hashReportToken(raw),
      fromDay: new Date(`${input.from}T00:00:00.000Z`),
      toDay: new Date(`${input.to}T00:00:00.000Z`),
      withPhotos: input.withPhotos === true,
      label: input.forPrinting ? "To print or save on this phone" : String(input.label ?? "").trim().slice(0, 80) || null,
      expiresAt,
    },
  });
  revalidatePath("/health/report");
  if (!a.isMother) {
    const [me, mum] = await Promise.all([
      prisma.user.findUnique({ where: { id: a.userId }, select: { name: true } }),
      prisma.journey.findUnique({ where: { id: a.journeyId }, select: { ownerId: true } }),
    ]);
    if (mum) {
      const who = me?.name?.trim().split(" ")[0] || "Your partner";
      await notify({
        userId: mum.ownerId,
        type: "health_shared",
        title: input.forPrinting ? `${who} opened your health report to print it` : `${who} made a doctor link to your health report`,
        body: "You can see it, and close it, under Health → Report.",
        href: "/health/report",
      });
    }
  }
  return { ok: true, path: `/dr/${raw}`, expiresAt: expiresAt.toISOString() };
}

/** Close a link now — either of the two can. It stops working the moment this returns. */
export async function revokeReportLink(id: string): Promise<{ ok: boolean }> {
  const a = await keeper();
  if (!a) return { ok: false };
  const done = await prisma.healthReportLink.updateMany({ where: { id: String(id), journeyId: a.journeyId, revokedAt: null }, data: { revokedAt: new Date() } });
  revalidatePath("/health/report");
  return { ok: done.count > 0 };
}

const EMAIL_RE = /^[^\s@<>(),;:"]{1,64}@[^\s@<>(),;:"]{1,190}\.[a-z]{2,}$/i;
const SITE = (process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "https://oyun.cotek.app").replace(/\/+$/, "");

/**
 * Email the report to a doctor: a fresh view-only link, made exactly as
 * "Make a link" makes one (and listed with the others, saying who it was
 * sent to), with the PDF and the two spreadsheets attached only when she
 * asked for them. Replies go to whoever sent it.
 *
 * If the email does not go, the link is closed again at once, so a failure
 * never leaves something shared that nobody received. Ten an hour, so a
 * mistyped loop cannot turn the report into a mailing list.
 */
export async function emailReportToDoctor(input: {
  from: string;
  to: string;
  withPhotos: boolean;
  email: string;
  label?: string;
  note?: string;
  days?: number;
  attach?: boolean;
  dob?: string;
  clinic?: string;
}): Promise<Result<{ sentTo: string; expires: string; attached: boolean }>> {
  const a = await keeper();
  if (!a) return { ok: false, error: "The health report is not open to you." };
  const ymd = /^\d{4}-\d{2}-\d{2}$/;
  if (!ymd.test(input.from) || !ymd.test(input.to) || input.to < input.from) return { ok: false, error: "Choose the period first." };
  const email = String(input.email ?? "").trim().toLowerCase();
  if (!EMAIL_RE.test(email) || email.length > 200) return { ok: false, error: "That email address doesn't look right." };
  if (!(await allow(`doctor-email:${a.userId}`, 10, HOUR))) return { ok: false, error: "That's a lot of emails in an hour. Please try again a little later." };

  const me = await prisma.user.findUnique({ where: { id: a.userId }, select: { name: true, email: true } });
  if (!me?.email) return { ok: false, error: "Your account has no email address for the doctor to reply to." };

  const days = Math.min(30, Math.max(1, Math.round(Number(input.days) || 7)));
  const raw = randomBytes(24).toString("base64url");
  const expiresAt = new Date(Date.now() + days * 86_400_000);
  const forWho = String(input.label ?? "").trim().slice(0, 40);
  const link = await prisma.healthReportLink.create({
    data: {
      journeyId: a.journeyId,
      createdById: a.userId,
      tokenHash: hashReportToken(raw),
      fromDay: new Date(`${input.from}T00:00:00.000Z`),
      toDay: new Date(`${input.to}T00:00:00.000Z`),
      withPhotos: input.withPhotos === true,
      label: `${forWho ? `${forWho} · ` : ""}emailed to ${email}`.slice(0, 80),
      expiresAt,
    },
    select: { id: true },
  });

  const tz = await motherTimeZone(a.journeyId);
  const day = (d: string) => new Date(`${d}T12:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
  const periodText = input.from === input.to ? day(input.from) : `${day(input.from)} – ${day(input.to)}`;
  const expires = expiresAt.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: tz });
  const period = { from: input.from, to: input.to };

  let attachments: { filename: string; content: string; contentType: string }[] = [];
  let patientName = a.motherName || me.name || "the patient";
  try {
    if (input.attach) {
      const report = await buildReport(a.journeyId, period, { photos: false, dob: input.dob, clinic: input.clinic });
      patientName = report.header.name && report.header.name !== "—" ? report.header.name : patientName;
      const host = SITE.replace(/^https?:\/\//, "");
      const pdf = await renderReportPdf(report, { siteHost: host });
      const access = { ...a, timeZone: tz };
      const [readings, doses] = await Promise.all([healthCsv(access, "readings", period), healthCsv(access, "doses", period)]);
      const stamp = `${input.from}_to_${input.to}`;
      attachments = [
        { filename: `health-report_${stamp}.pdf`, content: Buffer.from(pdf).toString("base64"), contentType: "application/pdf" },
        { filename: `readings_${stamp}.csv`, content: Buffer.from(readings, "utf8").toString("base64"), contentType: "text/csv" },
        { filename: `doses_${stamp}.csv`, content: Buffer.from(doses, "utf8").toString("base64"), contentType: "text/csv" },
      ];
    }
  } catch (err) {
    console.error("[doctor-email] could not prepare attachments", err);
    await prisma.healthReportLink.update({ where: { id: link.id }, data: { revokedAt: new Date() } });
    return { ok: false, error: "The attachments couldn't be prepared, so nothing was sent. Try again, or send the link without them." };
  }

  const sent = await sendDoctorReportEmail({
    to: email,
    senderName: me.name?.trim() || "A patient",
    senderEmail: me.email,
    patientName,
    periodText,
    link: `${SITE}/dr/${raw}`,
    expires,
    note: String(input.note ?? "").trim().slice(0, 1500) || null,
    attachments,
  });
  if (!sent) {
    await prisma.healthReportLink.update({ where: { id: link.id }, data: { revokedAt: new Date() } });
    revalidatePath("/health/report");
    return { ok: false, error: "The email didn't go, so nothing was shared. Please try again in a moment." };
  }

  revalidatePath("/health/report");
  if (!a.isMother) {
    const mum = await prisma.journey.findUnique({ where: { id: a.journeyId }, select: { ownerId: true } });
    if (mum) {
      const who = me.name?.trim().split(" ")[0] || "Your partner";
      await notify({
        userId: mum.ownerId,
        type: "health_shared",
        title: `${who} emailed your health report to ${email}`,
        body: `${attachments.length ? "With the PDF and spreadsheets attached. " : ""}You can see the link, and close it, under Health → Report.`,
        href: "/health/report",
      });
    }
  }
  return { ok: true, sentTo: email, expires, attached: attachments.length > 0 };
}
