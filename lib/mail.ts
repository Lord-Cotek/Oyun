import nodemailer from "nodemailer";
import { type Role } from "@prisma/client";

/**
 * Best-effort invite email over the same SMTP used for magic links.
 * If EMAIL_SERVER isn't set (e.g. local dev), we no-op — the caller always
 * has the shareable link to fall back on.
 */
export async function sendInviteEmail({
  to,
  link,
  motherName,
  role,
}: {
  to: string;
  link: string;
  motherName: string;
  role: Role;
}): Promise<void> {
  const server = process.env.EMAIL_SERVER;
  const from = process.env.EMAIL_FROM;
  if (!server || !from) return;

  const roleWord = role === "ACCOUNTABILITY" ? "an accountability partner" : "a partner";
  const transport = nodemailer.createTransport(server);

  await transport.sendMail({
    to,
    from,
    subject: `${motherName} invited you to walk with them on Oyun`,
    text: [
      `${motherName} has invited you to join their journey on Oyun as ${roleWord}.`,
      "",
      "Oyun is a Christian companion for pregnancy and a child's earliest years.",
      "Your part is to support and pray — Oyun will show you how, each week.",
      "",
      `Accept the invite: ${link}`,
      "",
      "Oyun and Agbebi offer spiritual companionship, not medical advice.",
    ].join("\n"),
  });
}
