import { type Role } from "@prisma/client";

/**
 * Email via the Resend HTTP API (uses RESEND_API_KEY directly — no SMTP).
 * All sends are best-effort: if the key or from-address is missing, or Resend
 * errors, we log and return false rather than throwing, so a failed email
 * never breaks sign-up or invites.
 */
const RESEND_ENDPOINT = "https://api.resend.com/emails";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://oyun.cotek.app";

function fromAddress(): string {
  return process.env.EMAIL_FROM ?? "Agbebi <agbebi@oyun.cotek.app>";
}

async function sendEmail(opts: {
  to: string;
  subject: string;
  html: string;
  text: string;
}): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[email] RESEND_API_KEY not set — skipping send.");
    return false;
  }
  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromAddress(),
        to: [opts.to],
        subject: opts.subject,
        html: opts.html,
        text: opts.text,
      }),
    });
    if (!res.ok) {
      console.error("[email] Resend error", res.status, await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error("[email] send failed", err);
    return false;
  }
}

const shell = (inner: string) => `
  <div style="background:#0B0E14;padding:32px 0;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;">
    <div style="max-width:520px;margin:0 auto;background:#12151D;border:1px solid #232833;border-radius:16px;padding:32px;color:#ECE8DE;">
      <div style="font-family:Georgia,'Times New Roman',serif;font-size:24px;color:#ECE8DE;">Oyun</div>
      <div style="font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#E6A94E;margin-top:4px;">Guided by Agbebi</div>
      <div style="height:1px;background:#232833;margin:20px 0;"></div>
      ${inner}
      <div style="height:1px;background:#232833;margin:24px 0 16px;"></div>
      <div style="font-size:11px;line-height:1.6;color:#8A9099;">
        Oyun and Agbebi offer spiritual companionship and encouragement — not
        medical advice. Always consult your doctor or midwife for health decisions.
      </div>
    </div>
  </div>`;

export async function sendWelcomeEmail({
  to,
  name,
}: {
  to: string;
  name?: string | null;
}): Promise<boolean> {
  const greeting = name?.trim() ? name.trim() : "friend";
  const html = shell(`
    <p style="font-size:16px;line-height:1.6;color:#ECE8DE;">Peace to you, ${escapeHtml(greeting)}.</p>
    <p style="font-size:14px;line-height:1.7;color:#ECE8DE;">
      Welcome to Oyun. We're glad you're here. Oyun walks with you through the
      whole journey — conception through your child's earliest years — with
      Scripture at the center, one small faithful step at a time.
    </p>
    <p style="font-size:14px;line-height:1.7;color:#ECE8DE;">
      Whenever you're ready, sign in and set where you are. Agbebi will meet you there.
    </p>
    <p style="font-size:14px;line-height:1.7;color:#8A9099;margin-top:20px;">
      "For you formed my inward parts; you knitted me together in my mother's womb." — Psalm 139:13
    </p>
  `);
  const text = [
    `Peace to you, ${greeting}.`,
    "",
    "Welcome to Oyun. Oyun walks with you through the whole journey — conception",
    "through your child's earliest years — with Scripture at the center.",
    "",
    "Sign in whenever you're ready and set where you are. Agbebi will meet you there.",
    "",
    '"For you formed my inward parts; you knitted me together in my mother\'s womb." — Psalm 139:13',
  ].join("\n");

  return sendEmail({ to, subject: "Welcome to Oyun", html, text });
}

export async function sendPasswordResetEmail({
  to,
  link,
}: {
  to: string;
  link: string;
}): Promise<boolean> {
  const html = shell(`
    <p style="font-size:16px;line-height:1.6;color:#ECE8DE;">Let's get you back in.</p>
    <p style="font-size:14px;line-height:1.7;color:#ECE8DE;">
      We received a request to reset your Oyun password. Click below to choose a
      new one. This link expires in one hour.
    </p>
    <p style="margin:24px 0;">
      <a href="${link}" style="display:inline-block;background:#E6A94E;color:#0B0E14;text-decoration:none;font-weight:600;padding:12px 20px;border-radius:8px;font-size:14px;">Reset your password</a>
    </p>
    <p style="font-size:12px;line-height:1.6;color:#8A9099;">
      If you didn't ask for this, you can safely ignore this email — your password
      won't change. Or paste this link into your browser:<br/>${escapeHtml(link)}
    </p>
  `);
  const text = [
    "We received a request to reset your Oyun password.",
    "",
    `Choose a new password (link expires in 1 hour): ${link}`,
    "",
    "If you didn't ask for this, you can safely ignore this email.",
  ].join("\n");

  return sendEmail({ to, subject: "Reset your Oyun password", html, text });
}

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
}): Promise<boolean> {
  const roleWord = role === "ACCOUNTABILITY" ? "an accountability partner" : "a partner";
  const html = shell(`
    <p style="font-size:16px;line-height:1.6;color:#ECE8DE;">${escapeHtml(motherName)} invited you to walk with them.</p>
    <p style="font-size:14px;line-height:1.7;color:#ECE8DE;">
      You're being invited to join their journey on Oyun as ${roleWord}. Your part
      is to support and pray — Oyun will show you how, right where they are each week.
    </p>
    <p style="margin:24px 0;">
      <a href="${link}" style="display:inline-block;background:#E6A94E;color:#0B0E14;text-decoration:none;font-weight:600;padding:12px 20px;border-radius:8px;font-size:14px;">Accept the invite</a>
    </p>
    <p style="font-size:12px;line-height:1.6;color:#8A9099;">Or paste this link into your browser:<br/>${escapeHtml(link)}</p>
  `);
  const text = [
    `${motherName} invited you to join their journey on Oyun as ${roleWord}.`,
    "",
    "Your part is to support and pray — Oyun will show you how, each week.",
    "",
    `Accept the invite: ${link}`,
  ].join("\n");

  return sendEmail({ to, subject: `${motherName} invited you to walk with them on Oyun`, html, text });
}

export async function sendNotificationEmail({
  to,
  name,
  title,
  body,
  href,
}: {
  to: string;
  name?: string | null;
  title: string;
  body?: string;
  href?: string;
}): Promise<boolean> {
  const link = href ? `${SITE_URL}${href}` : SITE_URL;
  const html = shell(`
    <p style="font-size:16px;line-height:1.6;color:#ECE8DE;">${escapeHtml(name?.trim() || "Hello")},</p>
    <p style="font-size:15px;line-height:1.7;color:#ECE8DE;">${escapeHtml(title)}</p>
    ${body ? `<p style="font-size:14px;line-height:1.7;color:#8A9099;">${escapeHtml(body)}</p>` : ""}
    <p style="margin:24px 0;">
      <a href="${link}" style="display:inline-block;background:#E6A94E;color:#0B0E14;text-decoration:none;font-weight:600;padding:12px 20px;border-radius:8px;font-size:14px;">Open Oyun</a>
    </p>
  `);
  const text = `${title}\n${body ?? ""}\n\nOpen Oyun: ${link}`;
  return sendEmail({ to, subject: title, html, text });
}

export interface DigestSection {
  heading: string;
  lines: string[];
}

export async function sendWeeklyDigest({
  to,
  name,
  subject,
  intro,
  verse,
  sections,
  ctaLabel,
  ctaHref,
}: {
  to: string;
  name?: string | null;
  subject: string;
  intro: string;
  verse?: { text: string; ref: string };
  sections: DigestSection[];
  ctaLabel: string;
  ctaHref: string;
}): Promise<boolean> {
  const sectionsHtml = sections
    .map(
      (s) => `
      <div style="margin-top:20px;">
        <div style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#E6A94E;">${escapeHtml(s.heading)}</div>
        ${s.lines
          .map(
            (l) =>
              `<p style="font-size:14px;line-height:1.7;color:#ECE8DE;margin:6px 0 0;">${escapeHtml(l)}</p>`,
          )
          .join("")}
      </div>`,
    )
    .join("");

  const verseHtml = verse
    ? `<div style="margin-top:20px;padding:16px;border:1px solid #232833;border-radius:12px;">
         <p style="font-family:Georgia,serif;font-size:16px;line-height:1.5;color:#ECE8DE;margin:0;">&ldquo;${escapeHtml(verse.text)}&rdquo;</p>
         <p style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#E6A94E;margin:8px 0 0;">${escapeHtml(verse.ref)}</p>
       </div>`
    : "";

  const link = `${SITE_URL}${ctaHref}`;
  const html = shell(`
    <p style="font-size:16px;line-height:1.6;color:#ECE8DE;">Peace to you, ${escapeHtml(name?.trim() || "friend")}.</p>
    <p style="font-size:14px;line-height:1.7;color:#ECE8DE;">${escapeHtml(intro)}</p>
    ${verseHtml}
    ${sectionsHtml}
    <p style="margin:24px 0 0;">
      <a href="${link}" style="display:inline-block;background:#E6A94E;color:#0B0E14;text-decoration:none;font-weight:600;padding:12px 20px;border-radius:8px;font-size:14px;">${escapeHtml(ctaLabel)}</a>
    </p>
  `);

  const text = [
    `Peace to you, ${name?.trim() || "friend"}.`,
    intro,
    verse ? `\n"${verse.text}" — ${verse.ref}` : "",
    ...sections.map((s) => `\n${s.heading}\n${s.lines.join("\n")}`),
    `\n${ctaLabel}: ${link}`,
  ].join("\n");

  return sendEmail({ to, subject, html, text });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
