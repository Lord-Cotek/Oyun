import { prisma } from "@/lib/prisma";
import { type Role } from "@prisma/client";
import { isHousehold } from "@/lib/roles";
import { postScope } from "@/lib/post-visibility";
import { chapterRef } from "@/lib/bible";

/**
 * Finding something you wrote.
 *
 * By the time a child turns two there are three years of things in here —
 * diary entries, letters to the baby, notes on a chapter, appointments kept,
 * prayers asked and answered, the small daily record of how she was. Every one
 * of those rooms is chronological, and scrolling is the only way through. "I
 * know I wrote something the week of the twenty-week scan" was, until now, an
 * afternoon's work.
 *
 * The rule this file exists to keep
 * ────────────────────────────────
 * Search shows a person exactly what they could already reach by walking the
 * app, and not one row more. It is a faster route to the same rooms — never a
 * back door into one.
 *
 * That is why every source below carries its own `visible` gate rather than a
 * single check at the top. A search that forgets one gate does not fail loudly;
 * it quietly hands a friend the scan dates, or the mother's care journal. So
 * the gate sits on the source, next to the query it guards, and a new source
 * cannot be added without writing one.
 *
 * Three things are deliberately absent
 * ───────────────────────────────────
 *  - The care journal is the mother's alone (`role === "MOTHER"`), and it is
 *    in search on exactly those terms — her own words, returned to her, and to
 *    nobody else. Not even the partner.
 *  - Remembrances. What a family writes after losing a child is not something
 *    to meet by accident while looking for a birthday. It is kept where they
 *    go to find it on purpose.
 *  - The weekly liturgy, the journey guide and the hymns. Those are the app's
 *    words, not the family's, and burying a real letter under forty devotional
 *    entries would make search useless for the thing it is for.
 *
 * Why no full-text index
 * ─────────────────────
 * A family writes hundreds of rows a year, not millions. ILIKE across a dozen
 * small, journey-scoped tables answers in a few milliseconds, needs no schema
 * change, and cannot fall out of sync with the rows it searches. If a journey
 * ever outgrows it, the fix is a tsvector column — additive, and nobody loses
 * anything.
 */

/** A gentle word for when something was written, without an exact clock. */
export function whenWritten(d: Date, now = new Date()): string {
  const days = Math.floor((now.getTime() - d.getTime()) / 86_400_000);
  if (days < 0) return "coming up";
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months === 1 ? "" : "s"} ago`;
  const years = Math.floor(days / 365);
  return `${years} year${years === 1 ? "" : "s"} ago`;
}

/** Nothing shorter is worth running; "a" would match nearly every row. */
export const MIN_QUERY = 2;

/** Per source, so one chatty table cannot crowd out the rest. */
const PER_SOURCE = 8;

export type SearchKind =
  | "post"
  | "comment"
  | "note"
  | "letter"
  | "prayer"
  | "encouragement"
  | "milestone"
  | "appointment"
  | "checkin"
  | "child"
  | "nudge";

export interface SearchHit {
  id: string;
  kind: SearchKind;
  /** What room this came from, in the family's words. */
  room: string;
  /** The line that names it — a title where there is one, else the person. */
  title: string;
  /** The text that matched, trimmed around the term. */
  snippet: string;
  href: string;
  at: Date;
  /** Who wrote it, when that is not obvious from the room. */
  who?: string | null;
}

export interface SearchContext {
  journeyId: string;
  userId: string;
  role: Role;
}

/** Case-insensitive contains, the same shape every source needs. */
const like = (q: string) => ({ contains: q, mode: "insensitive" as const });

/**
 * A window of text around the first match, so a result shows the words the
 * person searched for rather than the opening line of a long entry.
 */
export function snippet(body: string, q: string, width = 160): string {
  const flat = body.replace(/\s+/g, " ").trim();
  const at = flat.toLowerCase().indexOf(q.toLowerCase());
  if (at < 0) return flat.length > width ? flat.slice(0, width).trimEnd() + "…" : flat;
  const start = Math.max(0, at - Math.floor(width / 3));
  const end = Math.min(flat.length, start + width);
  return (start > 0 ? "…" : "") + flat.slice(start, end).trim() + (end < flat.length ? "…" : "");
}

interface Source {
  kind: SearchKind;
  room: string;
  /** Who may see this room at all. Written next to the query it guards. */
  visible: (c: SearchContext) => boolean;
  run: (q: string, c: SearchContext) => Promise<SearchHit[]>;
}

const SOURCES: Source[] = [
  {
    kind: "post",
    room: "Life",
    // The diary is the journey's shared room, so everyone invited may search
    // it — but a post kept to the family is not in the circle's copy of that
    // room, and a search result is a way into a post. The gate is per row,
    // not per room: see lib/post-visibility.ts.
    visible: () => true,
    run: async (q, c) => {
      const rows = await prisma.post.findMany({
        where: { journeyId: c.journeyId, ...postScope(c.role), body: like(q) },
        orderBy: { createdAt: "desc" },
        take: PER_SOURCE,
        select: {
          id: true,
          body: true,
          createdAt: true,
          author: { select: { name: true } },
        },
      });
      return rows.map((r) => ({
        id: r.id,
        kind: "post" as const,
        room: "Life",
        title: r.author.name ?? "Someone",
        snippet: snippet(r.body, q),
        href: `/life#post-${r.id}`,
        at: r.createdAt,
        who: r.author.name,
      }));
    },
  },
  {
    kind: "comment",
    room: "Life",
    visible: () => true,
    run: async (q, c) => {
      const rows = await prisma.postComment.findMany({
        where: { body: like(q), post: { journeyId: c.journeyId } },
        orderBy: { createdAt: "desc" },
        take: PER_SOURCE,
        select: {
          id: true,
          body: true,
          createdAt: true,
          postId: true,
          author: { select: { name: true } },
        },
      });
      return rows.map((r) => ({
        id: r.id,
        kind: "comment" as const,
        room: "Life",
        title: `${r.author.name ?? "Someone"} replied`,
        snippet: snippet(r.body, q),
        href: `/life#post-${r.postId}`,
        at: r.createdAt,
        who: r.author.name,
      }));
    },
  },
  {
    kind: "note",
    room: "Journal",
    // /journal redirects anyone outside the household.
    visible: (c) => isHousehold(c.role),
    run: async (q, c) => {
      const rows = await prisma.readingNote.findMany({
        where: {
          journeyId: c.journeyId,
          body: like(q),
          // A note kept private belongs to whoever wrote it, and to nobody
          // else — including the person they are married to.
          OR: [{ isPrivate: false }, { authorId: c.userId }],
        },
        orderBy: { createdAt: "desc" },
        take: PER_SOURCE,
        select: {
          id: true,
          body: true,
          createdAt: true,
          bookSlug: true,
          chapter: true,
          isPrivate: true,
          author: { select: { name: true } },
        },
      });
      return rows.map((r) => ({
        id: r.id,
        kind: "note" as const,
        room: r.isPrivate ? "Journal — private" : "Journal",
        title: chapterRef(r.bookSlug, r.chapter),
        snippet: snippet(r.body, q),
        href: `/journal#note-${r.id}`,
        at: r.createdAt,
        who: r.author.name,
      }));
    },
  },
  {
    kind: "letter",
    room: "Letters",
    visible: (c) => isHousehold(c.role),
    run: async (q, c) => {
      const rows = await prisma.letter.findMany({
        where: { journeyId: c.journeyId, body: like(q) },
        orderBy: { createdAt: "desc" },
        take: PER_SOURCE,
        select: {
          id: true,
          body: true,
          toBaby: true,
          createdAt: true,
          author: { select: { name: true } },
        },
      });
      return rows.map((r) => ({
        id: r.id,
        kind: "letter" as const,
        room: "Letters",
        title: r.toBaby ? "To the baby" : "To each other",
        snippet: snippet(r.body, q),
        href: `/letters#letter-${r.id}`,
        at: r.createdAt,
        who: r.author.name,
      }));
    },
  },
  {
    kind: "prayer",
    room: "Prayer",
    visible: () => true,
    run: async (q, c) => {
      const rows = await prisma.prayerRequest.findMany({
        where: {
          journeyId: c.journeyId,
          OR: [{ title: like(q) }, { body: like(q) }],
        },
        orderBy: { createdAt: "desc" },
        take: PER_SOURCE,
        select: {
          id: true,
          title: true,
          body: true,
          createdAt: true,
          answeredAt: true,
        },
      });
      return rows.map((r) => ({
        id: r.id,
        kind: "prayer" as const,
        room: r.answeredAt ? "Prayer — answered" : "Prayer",
        title: r.title,
        snippet: snippet(r.body ?? r.title, q),
        href: `/prayer#prayer-${r.id}`,
        at: r.createdAt,
      }));
    },
  },
  {
    kind: "encouragement",
    room: "Circle",
    visible: () => true,
    run: async (q, c) => {
      const rows = await prisma.encouragement.findMany({
        where: { journeyId: c.journeyId, body: like(q) },
        orderBy: { createdAt: "desc" },
        take: PER_SOURCE,
        select: {
          id: true,
          body: true,
          createdAt: true,
          author: { select: { name: true } },
        },
      });
      return rows.map((r) => ({
        id: r.id,
        kind: "encouragement" as const,
        room: "Circle",
        title: `${r.author.name ?? "Someone"} wrote`,
        snippet: snippet(r.body, q),
        href: `/journey#enc-${r.id}`,
        at: r.createdAt,
        who: r.author.name,
      }));
    },
  },
  {
    kind: "milestone",
    room: "Firsts",
    // /firsts redirects anyone outside the household.
    visible: (c) => isHousehold(c.role),
    run: async (q, c) => {
      const rows = await prisma.milestone.findMany({
        where: {
          journeyId: c.journeyId,
          OR: [{ title: like(q) }, { note: like(q) }],
        },
        orderBy: { occurredAt: "desc" },
        take: PER_SOURCE,
        select: {
          id: true,
          title: true,
          note: true,
          occurredAt: true,
          child: { select: { name: true } },
        },
      });
      return rows.map((r) => ({
        id: r.id,
        kind: "milestone" as const,
        room: "Firsts",
        title: r.title ?? r.child?.name ?? "A first",
        snippet: snippet(r.note ?? r.title ?? "", q),
        href: `/firsts#milestone-${r.id}`,
        at: r.occurredAt,
      }));
    },
  },
  {
    kind: "appointment",
    room: "Appointments",
    // A scan date is health information. The wider circle sees it only if she
    // names it herself on the prayer wall.
    visible: (c) => isHousehold(c.role),
    run: async (q, c) => {
      const rows = await prisma.appointment.findMany({
        where: {
          journeyId: c.journeyId,
          OR: [
            { title: like(q) },
            { where: like(q) },
            { who: like(q) },
            { notes: like(q) },
            { questions: like(q) },
            { outcome: like(q) },
          ],
        },
        orderBy: { at: "desc" },
        take: PER_SOURCE,
        select: {
          id: true,
          title: true,
          where: true,
          who: true,
          notes: true,
          questions: true,
          outcome: true,
          at: true,
        },
      });
      return rows.map((r) => ({
        id: r.id,
        kind: "appointment" as const,
        room: "Appointments",
        title: r.title ?? "An appointment",
        // Whichever field actually matched is the one worth showing.
        snippet: snippet(
          [r.notes, r.questions, r.outcome, r.where, r.who].find((f) =>
            f?.toLowerCase().includes(q.toLowerCase()),
          ) ??
            r.notes ??
            r.where ??
            "",
          q,
        ),
        href: `/appointments#appt-${r.id}`,
        at: r.at,
      }));
    },
  },
  {
    kind: "checkin",
    room: "Care journal",
    // Hers alone — the same gate /care itself uses. Not the partner's.
    visible: (c) => c.role === "MOTHER",
    run: async (q, c) => {
      const rows = await prisma.checkIn.findMany({
        where: { journeyId: c.journeyId, userId: c.userId, note: like(q) },
        orderBy: { createdAt: "desc" },
        take: PER_SOURCE,
        select: { id: true, note: true, mood: true, createdAt: true },
      });
      return rows.map((r) => ({
        id: r.id,
        kind: "checkin" as const,
        room: "Care journal",
        title: "How you were",
        snippet: snippet(r.note ?? "", q),
        href: `/care#checkin-${r.id}`,
        at: r.createdAt,
      }));
    },
  },
  {
    kind: "child",
    room: "Your child",
    visible: (c) => isHousehold(c.role),
    run: async (q, c) => {
      const rows = await prisma.child.findMany({
        where: {
          journeyId: c.journeyId,
          OR: [{ name: like(q) }, { note: like(q) }],
        },
        orderBy: { createdAt: "desc" },
        take: PER_SOURCE,
        select: { id: true, name: true, note: true, createdAt: true },
      });
      return rows.map((r) => ({
        id: r.id,
        kind: "child" as const,
        room: "Your child",
        title: r.name,
        snippet: snippet(r.note ?? r.name, q),
        href: "/child",
        at: r.createdAt,
      }));
    },
  },
  {
    kind: "nudge",
    room: "Your reminders",
    // Keyed on the searcher: a reminder is one person's note to themselves.
    visible: () => true,
    run: async (q, c) => {
      const rows = await prisma.nudge.findMany({
        where: { journeyId: c.journeyId, userId: c.userId, text: like(q) },
        orderBy: { dueAt: "desc" },
        take: PER_SOURCE,
        select: { id: true, text: true, dueAt: true },
      });
      return rows.map((r) => ({
        id: r.id,
        kind: "nudge" as const,
        room: "Your reminders",
        title: "A reminder you set",
        snippet: snippet(r.text, q),
        href: "/settings#reminders",
        at: r.dueAt,
      }));
    },
  },
];

/**
 * Everything matching `q` that this person may see, newest first.
 *
 * Sources run in parallel and a source that throws is dropped rather than
 * taking the page down with it — a broken room should cost you that room's
 * results, not the search.
 */
export async function search(q: string, c: SearchContext): Promise<SearchHit[]> {
  const term = q.trim();
  if (term.length < MIN_QUERY) return [];

  const allowed = SOURCES.filter((s) => s.visible(c));
  const settled = await Promise.allSettled(allowed.map((s) => s.run(term, c)));
  const hits = settled.flatMap((r) => (r.status === "fulfilled" ? r.value : []));
  return hits.sort((a, b) => b.at.getTime() - a.at.getTime());
}

/** The rooms this person's search actually covered, for the page to say so. */
export function roomsSearched(c: SearchContext): string[] {
  return [...new Set(SOURCES.filter((s) => s.visible(c)).map((s) => s.room))];
}
