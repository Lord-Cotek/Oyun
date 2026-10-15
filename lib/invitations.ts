/**
 * Invitations — the rules, with no database and no browser in them.
 *
 * Everything here is a pure function so that the host's page, the guest's
 * page, the calendar file and the tests all agree about what "coming" means
 * and what a head count is.
 */

export const HOST_NAME_MAX = 60;
export const GUEST_NAME_MAX = 60;
export const MESSAGE_MAX = 1200;
export const GUEST_NOTE_MAX = 300;
/** A family party, not a stadium. Large enough for a wedding reception. */
export const PARTY_MAX = 20;
/** Past this, something is wrong and it is not a family gathering any more. */
export const REPLIES_MAX = 500;

export const ANSWERS = [
  { value: "YES", label: "I'll be there", short: "Coming" },
  { value: "MAYBE", label: "I hope to", short: "Hoping to" },
  { value: "NO", label: "I can't this time", short: "Can't" },
] as const;

export type Answer = (typeof ANSWERS)[number]["value"];

export function isAnswer(v: string): v is Answer {
  return ANSWERS.some((a) => a.value === v);
}

export function answerLabel(v: string): string {
  return ANSWERS.find((a) => a.value === v)?.short ?? v;
}

export type ReplyLike = {
  name: string;
  answer: string;
  partySize: number;
  note?: string | null;
};

export type HeadCount = {
  /** People, not replies: a yes bringing three is four. */
  coming: number;
  hoping: number;
  /** Replies, not people — "four households said no" is not a useful number. */
  cannot: number;
  replied: number;
};

export function headCount(replies: ReplyLike[]): HeadCount {
  let coming = 0;
  let hoping = 0;
  let cannot = 0;
  for (const r of replies) {
    const size = Math.max(1, Math.min(PARTY_MAX, r.partySize || 1));
    if (r.answer === "YES") coming += size;
    else if (r.answer === "MAYBE") hoping += size;
    else if (r.answer === "NO") cannot += 1;
  }
  return { coming, hoping, cannot, replied: replies.length };
}

/**
 * How the head count reads in a sentence. "3 coming" is a number; "3 people
 * coming, 1 hoping to" is an answer to the question somebody actually asked.
 */
export function countSentence(c: HeadCount): string {
  if (c.replied === 0) return "No replies yet.";
  const parts: string[] = [];
  if (c.coming) parts.push(`${c.coming} coming`);
  if (c.hoping) parts.push(`${c.hoping} hoping to`);
  if (c.cannot) parts.push(`${c.cannot} can't`);
  return parts.join(" · ");
}

/** Is there still room for a party of this size? `null` capacity means yes. */
export function roomFor(
  capacity: number | null | undefined,
  taken: number,
  party: number,
): boolean {
  if (capacity == null) return true;
  return taken + party <= capacity;
}

// ── Why a link stops working ──────────────────────────────────────────────
//
// Four different things, and a guest deserves to be told which. "This page
// isn't available" when the truth is "you're a day late" is the app being
// unhelpful at exactly the wrong moment.

export type InviteState =
  | "open"
  | "closed" // the host stopped taking replies
  | "past" // the day has been and gone
  | "revoked"; // the link is dead

export function inviteState(
  i: {
    closedAt?: Date | null;
    revokedAt?: Date | null;
    repliesBy?: Date | null;
  },
  eventAt: Date,
  eventEndsAt: Date | null | undefined,
  now = new Date(),
): InviteState {
  if (i.revokedAt) return "revoked";
  // A day is over when it is over, not at the moment it starts: people reply
  // from the car park.
  const over = eventEndsAt ?? endOfDay(eventAt);
  if (over.getTime() < now.getTime()) return "past";
  if (i.closedAt) return "closed";
  if (i.repliesBy && i.repliesBy.getTime() < now.getTime()) return "closed";
  return "open";
}

function endOfDay(d: Date): Date {
  return new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 23, 59, 59),
  );
}

// ── Words for a day ───────────────────────────────────────────────────────

export function longDay(at: Date): string {
  return at.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function clock(at: Date): string {
  return at.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  });
}

/** "18:00 – 21:00", "from 18:00", or "" when the day carries no hour. */
export function timeRange(
  at: Date,
  hasTime: boolean,
  endsAt: Date | null | undefined,
): string {
  if (!hasTime) return "";
  if (!endsAt) return `from ${clock(at)}`;
  return `${clock(at)} – ${clock(endsAt)}`;
}

/**
 * The message that goes into WhatsApp.
 *
 * Plain text, because that is what a chat app renders, and the link last so it
 * is the thing under somebody's thumb.
 */
export function shareText(
  title: string,
  /** Already worded — "Saturday 26 September 2026, 18:00 – 21:00". */
  when: string,
  where: string | null | undefined,
  url: string,
): string {
  return [
    title,
    when,
    where ? `at ${where}` : null,
    "",
    "Let me know if you can come:",
    url,
  ]
    .filter((l): l is string => !!l)
    .join("\n");
}

/**
 * Sending the invitation to an address, rather than handing over a link.
 *
 * ── Why the app sends at all, when WhatsApp was already there ────────────
 * Because not everybody is on WhatsApp, and the people most likely to be
 * missing from it at a christening or a baby shower are the ones a family
 * most wants there. An aunt with an email address and no messaging app was,
 * until now, somebody you had to remember to write to separately.
 *
 * ── Why the addresses are never stored ───────────────────────────────────
 * InvitationReply.email says of itself that it is "the only contact detail
 * this app will ever hold for somebody who is not in it", and that promise
 * is worth more than the convenience of a sent-to list. So an address typed
 * here is used for one send and then gone: not written to a row, not kept
 * in a draft, not logged. What the invitation keeps is a count and a date,
 * which is enough for a host to know it went and roughly when.
 *
 * The cost is honest and small — send twice and somebody gets two emails.
 * The alternative is a family quietly accumulating a mailing list of their
 * friends inside an app that promises it does not do that.
 *
 * ── Why the caps ─────────────────────────────────────────────────────────
 * An endpoint that emails arbitrary strangers on request is a spam cannon
 * unless it is bounded. Twenty at a time is more than any real supper, and
 * two hundred over the life of one link is past any real wedding.
 */
export const EMAIL_BATCH_MAX = 20;
export const EMAIL_TOTAL_MAX = 200;

/**
 * Deliberately forgiving about separators, strict about shape.
 *
 * People paste addresses out of a contacts app, a spreadsheet or another
 * email, so they arrive separated by commas, semicolons, newlines or plain
 * spaces, sometimes wrapped as "Auntie Bisi <bisi@example.com>". All of that
 * is the host doing a reasonable thing, and none of it should be an error
 * message. What comes back is de-duplicated, lower-cased, and split into the
 * ones that will be sent and the ones that were not understood — so the host
 * is told exactly which line to fix rather than "invalid input".
 */
export function parseAddresses(raw: string): { ok: string[]; bad: string[] } {
  const ok: string[] = [];
  const bad: string[] = [];
  const seen = new Set<string>();

  const take = (v: string) => {
    const key = v.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      ok.push(key);
    }
  };

  // Split on the separators that really divide one recipient from the next.
  // A space is NOT one of them at this level: "Auntie Bisi <bisi@x.com>" is a
  // single recipient, and splitting it here reported her name as two things
  // the app could not understand.
  for (const chunk of raw.split(/[,;\n\r]+/)) {
    const piece = chunk.trim();
    if (!piece) continue;

    // The display-name form wins outright when it is there, because the part
    // outside the angle brackets is a name and never an address.
    const bracketed = piece.match(/<([^<>]+)>/g);
    if (bracketed) {
      let any = false;
      for (const b of bracketed) {
        const inner = b.slice(1, -1).trim();
        if (isAddress(inner)) {
          take(inner);
          any = true;
        }
      }
      if (!any && !bad.includes(piece)) bad.push(piece);
      continue;
    }

    // Otherwise the chunk may still hold several space-separated addresses,
    // which is what a paste out of a contacts app looks like.
    const tokens = piece.split(/\s+/).filter(Boolean);
    const found = tokens.filter(isAddress);
    if (found.length) {
      found.forEach(take);
    } else if (!bad.includes(piece)) {
      bad.push(piece);
    }
  }
  return { ok, bad };
}

/**
 * Not RFC 5322, on purpose.
 *
 * A full-fidelity address grammar accepts things no mail provider will take
 * and is famously unreadable. This rejects what is obviously not an address
 * and lets the mail server be the judge of the rest, which is the only thing
 * that can actually decide.
 */
export function isAddress(v: string): boolean {
  return /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/.test(v) && v.length <= 254;
}

/** "Sent to 6 people." — said once, plainly, and never as a running total. */
export function sentSentence(n: number): string {
  if (n === 0) return "Nothing sent.";
  return n === 1 ? "Sent to 1 person." : `Sent to ${n} people.`;
}

/** The one place the two halves of "when" are joined, so they always match. */
export function whenWords(
  at: Date,
  hasTime: boolean,
  endsAt: Date | null | undefined,
): string {
  return [longDay(at), timeRange(at, hasTime, endsAt)].filter(Boolean).join(", ");
}

// ── The calendar file ─────────────────────────────────────────────────────

/** Escape the four characters iCalendar treats as syntax. RFC 5545 §3.3.11. */
function esc(s: string): string {
  return s
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

/** `20260926T180000` — no trailing Z. See the note in `toIcs`. */
function stamp(d: Date): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return (
    `${d.getUTCFullYear()}${p(d.getUTCMonth() + 1)}${p(d.getUTCDate())}` +
    `T${p(d.getUTCHours())}${p(d.getUTCMinutes())}00`
  );
}

function datePart(d: Date): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getUTCFullYear()}${p(d.getUTCMonth() + 1)}${p(d.getUTCDate())}`;
}

/** RFC 5545 asks for lines of no more than 75 octets, folded with a space. */
function fold(line: string): string {
  if (Buffer.byteLength(line, "utf8") <= 75) return line;
  const out: string[] = [];
  let cur = "";
  for (const ch of line) {
    if (Buffer.byteLength(cur + ch, "utf8") > 74) {
      out.push(cur);
      cur = " ";
    }
    cur += ch;
  }
  out.push(cur);
  return out.join("\r\n");
}

/**
 * The event as a file a phone will put in its own calendar.
 *
 * ── The one thing that is easy to get wrong here ─────────────────────────
 * This app stores an hour exactly as it was typed, as UTC: 18:00 means six in
 * the evening where the family lives. Writing that out as `...T180000Z` would
 * be a claim about UTC, and a guest in London in summer would find the party
 * in their calendar at seven.
 *
 * So the time goes out FLOATING — no Z, no TZID — which iCalendar defines as
 * "the local time of whoever is reading it". That is exactly what the stored
 * value means, and it is the only form that does not silently shift the party
 * by an hour twice a year.
 *
 * A day with no hour goes out as a real all-day event, whose DTEND is the next
 * morning because iCalendar's end is exclusive.
 */
export function toIcs(e: {
  uid: string;
  title: string;
  at: Date;
  hasTime: boolean;
  endsAt: Date | null | undefined;
  where: string | null | undefined;
  description: string | null | undefined;
  url: string;
  /** Which app wrote this file, as iCalendar's PRODID wants it. */
  prodId: string;
  stampedAt?: Date;
}): string {
  const start = e.hasTime
    ? `DTSTART:${stamp(e.at)}`
    : `DTSTART;VALUE=DATE:${datePart(e.at)}`;
  const end = e.hasTime
    ? `DTEND:${stamp(e.endsAt ?? new Date(e.at.getTime() + 2 * 3_600_000))}`
    : `DTEND;VALUE=DATE:${datePart(new Date(e.at.getTime() + 86_400_000))}`;

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:${e.prodId}`,
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${e.uid}`,
    // DTSTAMP is when the file was made, and that one genuinely is UTC.
    `DTSTAMP:${stamp(e.stampedAt ?? new Date())}Z`,
    start,
    end,
    `SUMMARY:${esc(e.title)}`,
    e.where ? `LOCATION:${esc(e.where)}` : null,
    e.description ? `DESCRIPTION:${esc(e.description)}` : null,
    `URL:${esc(e.url)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter((l): l is string => l !== null);

  return lines.map(fold).join("\r\n") + "\r\n";
}

/** A filename a person can find again in their downloads. */
export function icsFilename(title: string): string {
  const base =
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40) || "invitation";
  return `${base}.ics`;
}

// ── "Which day suits?" ────────────────────────────────────────────────────
//
// The other half of an invitation. Sometimes you know the day and you are
// asking whether people can come; sometimes you do not know the day and that
// is the whole question. Both are the same link, the same guests and the same
// list — only the question on it differs.

/** Two is a question; more than this is a form, and people stop answering. */
export const MAX_OPTIONS = 6;
export const MIN_OPTIONS = 2;

export type OptionLike = {
  id: string;
  at: Date;
  hasTime: boolean;
  endsAt: Date | null;
  votes: number;
};

/**
 * Is this invitation still asking which day?
 *
 * Options and no settled date. An invitation with no options never asked, and
 * one that has been settled is an ordinary invitation with a history.
 */
export function isPoll(i: {
  settledAt?: Date | null;
  options?: { id: string }[] | null;
}): boolean {
  return !i.settledAt && (i.options?.length ?? 0) > 0;
}

/**
 * The days in the order a host should read them: best first, then earliest.
 *
 * Deliberately NOT the order they were typed. A host looking at this is trying
 * to answer one question — which day works for the most people — and making
 * them scan for the biggest number is the page refusing to do its job.
 */
export function rankOptions(options: OptionLike[]): OptionLike[] {
  return [...options].sort(
    (a, b) => b.votes - a.votes || a.at.getTime() - b.at.getTime(),
  );
}

/** The day with the most ticks, or null when nobody has answered yet. */
export function bestOption(options: OptionLike[]): OptionLike | null {
  const ranked = rankOptions(options);
  return ranked[0] && ranked[0].votes > 0 ? ranked[0] : null;
}

/**
 * Is the leader clear, or is it a tie?
 *
 * Worth saying out loud on the host's page. "Saturday and Sunday both suit 6
 * people" is a real answer to the question, and a page that quietly picks one
 * of them is inventing a result nobody gave it.
 */
export function tiedWith(options: OptionLike[]): OptionLike[] {
  const best = bestOption(options);
  if (!best) return [];
  return options.filter((o) => o.id !== best.id && o.votes === best.votes);
}

/** "4 of 7 can make this one" — a count against the people who have answered. */
export function optionSentence(votes: number, replied: number): string {
  if (replied === 0) return "No replies yet";
  if (votes === 0) return `Nobody of the ${replied} so far`;
  return `${votes} of ${replied} can`;
}
