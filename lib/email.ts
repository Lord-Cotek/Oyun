import { type Role } from "@prisma/client";
import { PROMISE_SHORT } from "@/lib/promise";

/**
 * Email via the Resend HTTP API (uses RESEND_API_KEY directly — no SMTP).
 * All sends are best-effort: if the key or from-address is missing, or Resend
 * errors, we log and return false rather than throwing, so a failed email
 * never breaks sign-up or invites.
 */
/**
 * Resend's own endpoint unless something says otherwise. Overridable so the
 * send path can be exercised for real against a local sink — the alternative
 * is testing everything around the email and hoping about the email itself —
 * and so a self-hosted deployment can point at its own relay.
 */
const RESEND_ENDPOINT =
  process.env.RESEND_ENDPOINT ?? "https://api.resend.com/emails";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://oyun.cotek.app";

function fromAddress(): string {
  return process.env.EMAIL_FROM ?? "Agbebi <agbebi@oyun.cotek.app>";
}

/**
 * Write down that an email happened.
 *
 * ── What is kept, and what is deliberately not ───────────────────────────
 * The kind, the address, whether the provider took it, and why not. NOT the
 * subject and NOT the body: a subject carries a child's name or the first
 * line of an entry, and a log an operator reads all day is the last place
 * those belong. "An invitation went to this address at 14:02 and Resend
 * refused it: domain not verified" answers the only question support is ever
 * actually asked, without opening anything.
 *
 * ── It must never be able to break a send ────────────────────────────────
 * Everything here is inside a catch that does nothing. A logging table that
 * takes the sign-up email down with it when the database is busy is worse
 * than having no log at all — so if this fails, the email still went.
 */
async function recordDelivery(kind: string, to: string, ok: boolean, error?: string) {
  try {
    const { prisma } = await import("@/lib/prisma");
    await prisma.emailDelivery.create({
      data: { kind, to, ok, error: error ? error.slice(0, 300) : null },
    });
  } catch {
    // Deliberately silent. See above.
  }
}

async function sendEmail(opts: {
  to: string;
  subject: string;
  html: string;
  text: string;
  /** Which template this is. Named in code — never anything a user typed. */
  kind: string;
}): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[email] RESEND_API_KEY not set — skipping send.");
    await recordDelivery(opts.kind, opts.to, false, "no mail provider configured");
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
      const said = await res.text();
      console.error("[email] Resend error", res.status, said);
      await recordDelivery(opts.kind, opts.to, false, `${res.status} ${said}`);
      return false;
    }
    await recordDelivery(opts.kind, opts.to, true);
    return true;
  } catch (err) {
    console.error("[email] send failed", err);
    await recordDelivery(opts.kind, opts.to, false, String(err));
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
        ${PROMISE_SHORT}
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
      Scripture at the centre, one small faithful step at a time.
    </p>
    <p style="font-size:14px;line-height:1.7;color:#ECE8DE;">
      Whenever you're ready, sign in and set where you are. Agbebi will meet you there.
    </p>
    <p style="font-size:14px;line-height:1.7;color:#8A9099;margin-top:20px;">
      "For you formed my inmost being. You knit me together in my mother’s womb." — Psalm 139:13
    </p>
  `);
  const text = [
    `Peace to you, ${greeting}.`,
    "",
    "Welcome to Oyun. Oyun walks with you through the whole journey — conception",
    "through your child's earliest years — with Scripture at the centre.",
    "",
    "Sign in whenever you're ready and set where you are. Agbebi will meet you there.",
    "",
    '"For you formed my inward parts; you knitted me together in my mother\'s womb." — Psalm 139:13',
  ].join("\n");

  return sendEmail({ to, subject: "Welcome to Oyun", html, text, kind: "welcome" });
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

  return sendEmail({ to, subject: "Reset your Oyun password", html, text, kind: "password-reset" });
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
  const roleWord =
    (
      {
        PARTNER: "a partner",
        ACCOUNTABILITY: "an accountability partner",
        FAMILY: "family",
        FRIEND: "a close friend",
      } as Record<string, string>
    )[role] ?? "a partner";
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

  return sendEmail({ to, subject: `${motherName} invited you to walk with them on Oyun`, html, text, kind: "invite" });
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
  return sendEmail({ to, subject: title, html, text, kind: "notification" });
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

  return sendEmail({ to, subject, html, text, kind: "weekly-digest" });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * A word to somebody who is coming to a day, and who is not in this app.
 *
 * ── Why these are not `sendNotificationEmail` ────────────────────────────
 * That one ends with a button saying "Open Ìdílé", which for a guest is an
 * invitation to a product they did not ask for. Somebody's cousin sent them a
 * link about a dinner; the only thing this email should offer is that dinner.
 * So the button goes to the invitation, the subject is about the day, and
 * there is no sign-up anywhere in it.
 *
 * It also says, every time and in plain words, why they are receiving it and
 * how to stop — because an address given once to answer one invitation must
 * never start to feel like a list somebody has been put on.
 */
export async function sendGuestDayEmail({
  to,
  name,
  /** "Tomorrow" | "Today" | "The day has moved" — the reason for writing. */
  lead,
  title,
  when,
  where,
  hostName,
  url,
  note,
}: {
  to: string;
  name?: string | null;
  lead: string;
  title: string;
  when: string;
  where?: string | null;
  hostName: string;
  /** Null where there is nothing left to open — a day that has been called off. */
  url: string | null;
  note?: string | null;
}): Promise<boolean> {
  // The whole name as they typed it. Taking the first word turns "Auntie Bisi"
  // into "Auntie," which is nobody's name — and a guest wrote down exactly
  // what they want to be called, so there is nothing here worth guessing at.
  const greeting = name?.trim() || "Hello";
  const html = shell(`
    <p style="font-size:16px;line-height:1.6;color:#ECE9DF;">${escapeHtml(greeting)},</p>
    <p style="font-size:13px;letter-spacing:3px;text-transform:uppercase;color:#CF7D43;margin-bottom:4px;">${escapeHtml(lead)}</p>
    <p style="font-family:Georgia,'Times New Roman',serif;font-size:26px;line-height:1.25;color:#ECE9DF;margin:0 0 12px;">${escapeHtml(title)}</p>
    <p style="font-size:15px;line-height:1.7;color:#ECE9DF;margin:0;">${escapeHtml(when)}</p>
    ${where ? `<p style="font-size:14px;line-height:1.7;color:#8B9086;margin:4px 0 0;">${escapeHtml(where)}</p>` : ""}
    ${note ? `<p style="font-size:14px;line-height:1.7;color:#ECE9DF;margin-top:16px;">${escapeHtml(note)}</p>` : ""}
    ${
      url
        ? `<p style="margin:24px 0;">
      <a href="${url}" style="display:inline-block;background:#CF7D43;color:#120D08;text-decoration:none;font-weight:600;padding:12px 20px;border-radius:8px;font-size:14px;">See the invitation</a>
    </p>`
        : `<div style="height:24px;"></div>`
    }
    <p style="font-size:12px;line-height:1.7;color:#8B9086;">
      ${
        url
          ? `You are getting this because you told ${escapeHtml(hostName)} you were coming.
      Open the invitation and take your reply back to stop — that removes your
      address with it. It is used for nothing else.`
          : `You are getting this because you told ${escapeHtml(hostName)} you were coming.
      Nothing further will be sent about it, and your address goes with the invitation.`
      }
    </p>
  `);
  // Nulls are the lines that are not there; "" is a paragraph break that is.
  // Filtering on falsiness collapses both and hands somebody a wall of text.
  const text = [
    `${greeting},`,
    "",
    lead.toUpperCase(),
    title,
    when,
    where ?? null,
    note ? "" : null,
    note ?? null,
    "",
    url ? `See the invitation: ${url}` : null,
    url ? "" : null,
    `You are getting this because you told ${hostName} you were coming.`,
    url
      ? "Open the invitation and take your reply back to stop — that removes your"
      : "Nothing further will be sent about it, and your address goes with the",
    url ? "address with it. It is used for nothing else." : "invitation.",
  ]
    .filter((l): l is string => l !== null)
    .join("\n");

  return sendEmail({ to, subject: `${lead} — ${title}`, html, text, kind: "guest-day" });
}


/**
 * The invitation itself, sent to somebody who has no account and may never
 * have heard of this app.
 *
 * ── Why "an invitation from", and not "X has invited you" ────────────────
 * Because a host name is a name they typed, and most of the ones people
 * actually type are plural: "Amara and Chidi", "The Coteks", "the antenatal
 * group". "Amara and Chidi has invited you" is the kind of small wrongness
 * that makes a message look automatic, which is exactly what this one must
 * not look like. A noun phrase is right however many people are in it.
 *
 * ── Why it opens with who it is from and not with the app ────────────────
 * Because this lands in the inbox of somebody who did not ask for it. The
 * first line a stranger reads has to answer "who is this and why have they
 * written to me", and the answer is a person they know, not a product. The
 * app's name appears once, at the bottom, where it belongs.
 *
 * ── Why there is no unsubscribe link ─────────────────────────────────────
 * There is nothing to unsubscribe from. The address was typed once by a
 * host, used for this one message and never written down — so a link
 * promising to remove them from a list would be promising to do something
 * to a list that does not exist. The footer says that plainly instead,
 * which is the true version and the more reassuring one.
 */
export async function sendInvitationEmail({
  to,
  title,
  when,
  where,
  hostName,
  message,
  url,
}: {
  to: string;
  title: string;
  /** Already worded — "Saturday 26 September 2026, 18:00 – 21:00". */
  when: string;
  where?: string | null;
  hostName: string;
  /** The host's own word to whoever opens it. */
  message?: string | null;
  url: string;
}): Promise<boolean> {
  const html = shell(`
    <p style="font-size:13px;letter-spacing:3px;text-transform:uppercase;color:#CF7D43;margin-bottom:4px;">An invitation from ${escapeHtml(hostName)}</p>
    <p style="font-family:Georgia,'Times New Roman',serif;font-size:26px;line-height:1.25;color:#ECE9DF;margin:0 0 12px;">${escapeHtml(title)}</p>
    <p style="font-size:15px;line-height:1.7;color:#ECE9DF;margin:0;">${escapeHtml(when)}</p>
    ${where ? `<p style="font-size:14px;line-height:1.7;color:#8B9086;margin:4px 0 0;">${escapeHtml(where)}</p>` : ""}
    ${message ? `<p style="font-size:15px;line-height:1.7;color:#ECE9DF;margin-top:18px;">${escapeHtml(message)}</p>` : ""}
    <p style="margin:24px 0;">
      <a href="${url}" style="display:inline-block;background:#CF7D43;color:#120D08;text-decoration:none;font-weight:600;padding:12px 20px;border-radius:8px;font-size:14px;">See it and reply</a>
    </p>
    <p style="font-size:12px;line-height:1.7;color:#8B9086;">
      You need no account to open it, and you can simply say whether you are
      coming. ${escapeHtml(hostName)} sent this to your address directly —
      you are not on a list, and nothing else will follow unless you reply.
    </p>
  `);
  const text = [
    `An invitation from ${hostName}.`,
    "",
    title,
    when,
    where ?? null,
    message ? "" : null,
    message ?? null,
    "",
    `See it and reply: ${url}`,
    "",
    "You need no account to open it, and you can simply say whether you are",
    `coming. ${hostName} sent this to your address directly — you are not on a`,
    "list, and nothing else will follow unless you reply.",
  ]
    .filter((l): l is string => l !== null)
    .join("\n");

  return sendEmail({
    kind: "invitation",
    to,
    subject: `An invitation from ${hostName} — ${title}`,
    html,
    text,
  });
}

/**
 * The address on an account has changed.
 *
 * ── Why both addresses are told ──────────────────────────────────────────
 * The address IS the account: whoever holds it can reset the password and
 * walk in. So the OLD one is written to as well, and that message matters
 * most — if this was not asked for, it is the only warning its owner will
 * get, and it needs to say plainly what to do about it.
 */
export async function sendAddressChangedEmail({
  to,
  from,
  next,
  wasOld,
}: {
  to: string;
  from: string;
  next: string;
  /** True for the message going to the address being left behind. */
  wasOld: boolean;
}): Promise<boolean> {
  const line = wasOld
    ? `Your Oyun account has been moved from ${escapeHtml(from)} to ${escapeHtml(next)} at your request.`
    : `Your Oyun account now uses this address. It was moved here from ${escapeHtml(from)}.`;
  const warn = wasOld
    ? "If you did not ask for this, reply to this email straight away — whoever holds the new address can reset the password on your account."
    : "If you were not expecting this, reply to this email straight away.";

  const html = shell(`
    <p style="font-size:16px;line-height:1.6;color:#ECE8DE;">${line}</p>
    <p style="font-size:14px;line-height:1.7;color:#ECE8DE;">
      You will sign in with ${escapeHtml(next)} from now on. Your password has
      not changed, and nothing in your journey has moved.
    </p>
    <p style="font-size:12px;line-height:1.6;color:#8A9099;">${warn}</p>
  `);
  const text = [line, "", `You will sign in with ${next} from now on.`, "", warn].join("\n");

  return sendEmail({ to, subject: "The address on your Oyun account has changed", html, text, kind: "address-changed" });
}

/**
 * "Here is where your own copy lives."
 *
 * ── Why this mails a signpost and not a file ─────────────────────────────
 * Because an export is the family's whole diary, and the one promise the
 * admin centre makes is that it never touches a family's content. A link
 * that produced the file on its own would break that promise twice over: an
 * admin would be causing content to move, and the link itself would be a way
 * into a journey for anyone who came across the email.
 *
 * So this points at Settings. It needs signing in, the download is built for
 * whoever is signed in, and the admin who sent it is no nearer the contents
 * than they were before. What it saves the person is the hunt for the button.
 */
export async function sendExportLinkEmail({
  to,
  name,
  link,
}: {
  to: string;
  name: string | null;
  link: string;
}): Promise<boolean> {
  const hello = name?.trim() ? `${escapeHtml(name.trim().split(/\s+/)[0])},` : "Hello,";

  const html = shell(`
    <p style="font-size:16px;line-height:1.6;color:#ECE8DE;">${hello}</p>
    <p style="font-size:14px;line-height:1.7;color:#ECE8DE;">
      You asked for a copy of everything you have kept in Oyun. It is waiting
      for you in Settings — sign in, and the download is at
      &ldquo;Take everything with you&rdquo;.
    </p>
    <p style="font-size:14px;line-height:1.7;">
      <a href="${escapeHtml(link)}" style="color:#C9A227;">Open Settings</a>
    </p>
    <p style="font-size:12px;line-height:1.6;color:#8A9099;">
      The file is made for whoever is signed in, so this link is no use to
      anybody else. Nobody here has read it, and nobody here can.
    </p>
  `);
  const text = [
    hello,
    "",
    "You asked for a copy of everything you have kept in Oyun. It is waiting for you in Settings — sign in, and the download is at “Take everything with you”.",
    "",
    link,
    "",
    "The file is made for whoever is signed in, so this link is no use to anybody else. Nobody here has read it, and nobody here can.",
  ].join("\n");

  return sendEmail({ to, subject: "Your own copy of everything in Oyun", html, text, kind: "export-link" });
}

/**
 * A word from the people who keep Oyun, to everybody.
 *
 * ── Why the body is plain text and escaped ───────────────────────────────
 * Because it is typed into a box in a back office, often at the end of a
 * long day, and an operator composing HTML there is how a broken email
 * reaches three thousand people at once. Paragraphs are made from blank
 * lines and everything else is escaped, so the worst a typo can do is look
 * like a typo.
 */
export async function sendBroadcastEmail({
  to,
  name,
  subject,
  body,
}: {
  to: string;
  name: string | null;
  subject: string;
  body: string;
}): Promise<boolean> {
  const hello = name?.trim() ? `${escapeHtml(name.trim().split(/\s+/)[0])}, ` : "";
  const paragraphs = body
    .replace(/\r\n?/g, "\n")
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map(
      (p) =>
        `<p style="font-size:14px;line-height:1.7;color:#ECE8DE;">${escapeHtml(p).replace(/\n/g, "<br/>")}</p>`,
    )
    .join("");

  const html = shell(`
    ${hello ? `<p style="font-size:16px;line-height:1.6;color:#ECE8DE;">${hello.trim().replace(/,$/, "")},</p>` : ""}
    ${paragraphs}
    <p style="font-size:12px;line-height:1.6;color:#8A9099;">
      You are getting this because you have an Oyun account. You can turn
      emails off in Settings.
    </p>
  `);
  const text = [hello ? `${hello.trim().replace(/,$/, "")},` : "", "", body, "", "You are getting this because you have an Oyun account. You can turn emails off in Settings."]
    .filter((s, i) => !(i === 0 && !s))
    .join("\n");

  return sendEmail({ to, subject, html, text, kind: "broadcast" });
}
