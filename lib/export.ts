/**
 * Everything this journey holds, in one file you can keep.
 *
 * The promise the app makes is that these months belong to the family, not to
 * us. That promise is only worth something if the family can walk out with
 * them — so this gathers the lot and hands it back in two forms:
 *
 *  - `your-journey.html`, a single readable page you can open in any browser,
 *    print, or hand to a child in twenty years. No app needed, ever.
 *  - `data/*.json`, the same records exactly, for anyone who wants to move
 *    them somewhere else.
 *
 * ONE RULE governs what goes in: **the export contains what you can already
 * see in the app, and nothing else.** The intimate rooms — the letters, her
 * care journal, the nursery — belong to the mother and the one beside her, and
 * they stay shut to the circle here exactly as they are shut there. Gated
 * through the same `isHousehold` the pages use.
 *
 * Photographs are listed by their address rather than packed into the file.
 * A family's photos run to hundreds of megabytes and the export would time out
 * long before it finished; the addresses are stable and the README says
 * plainly that the pictures live there and not in here.
 */
import { BOOKS } from "@/lib/bible";
import { prisma } from "@/lib/prisma";
import { isHousehold } from "@/lib/roles";
import { makeZip, type ZipEntry } from "@/lib/zip";

/* ── gathering ───────────────────────────────────────────────────────────── */

export interface ExportScope {
  userId: string;
  journeyId: string;
  role: string;
}

const byNewest = { createdAt: "desc" as const };

/**
 * Reads the journey. Everything is pulled at once — this is one request, and a
 * family waiting on a download should not wait on twenty round trips.
 */
async function gather({ userId, journeyId, role }: ExportScope) {
  const inHouse = isHousehold(role);
  const j = { journeyId };

  const [
    you,
    journey,
    members,
    children,
    posts,
    worshipDays,
    readingNotes,
    prayers,
    letters,
    milestones,
    checkIns,
    appointments,
    nudges,
    encouragements,
    remembrances,
    supportDays,
  ] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true },
    }),
    prisma.journey.findUnique({
      where: { id: journeyId },
      select: {
        id: true,
        dueDate: true,
        babyName: true,
        babyCount: true,
        status: true,
        lossAt: true,
        createdAt: true,
        owner: { select: { name: true } },
      },
    }),
    prisma.membership.findMany({
      where: j,
      select: {
        role: true,
        createdAt: true,
        user: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: "asc" },
    }),
    prisma.child.findMany({
      where: j,
      select: {
        id: true,
        name: true,
        birthDate: true,
        sex: true,
        note: true,
        photoUrl: true,
        createdAt: true,
      },
      orderBy: { createdAt: "asc" },
    }),
    prisma.post.findMany({
      where: j,
      select: {
        kind: true,
        body: true,
        imageUrl: true,
        mediaUrls: true,
        createdAt: true,
        editedAt: true,
        author: { select: { name: true } },
        comments: {
          select: { body: true, createdAt: true, author: { select: { name: true } } },
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: byNewest,
    }),
    prisma.worshipDay.findMany({
      where: j,
      select: { day: true },
      orderBy: { day: "desc" },
    }),
    // Someone else's private note is not yours to take.
    prisma.readingNote.findMany({
      where: { journeyId, OR: [{ isPrivate: false }, { authorId: userId }] },
      select: {
        bookSlug: true,
        chapter: true,
        body: true,
        isPrivate: true,
        createdAt: true,
        author: { select: { name: true } },
      },
      orderBy: byNewest,
    }),
    prisma.prayerRequest.findMany({
      where: j,
      select: {
        title: true,
        body: true,
        answeredAt: true,
        createdAt: true,
        author: { select: { name: true } },
        _count: { select: { prayers: true } },
      },
      orderBy: byNewest,
    }),
    // Letters to the baby are the household's own.
    inHouse
      ? prisma.letter.findMany({
          where: j,
          select: {
            body: true,
            toBaby: true,
            createdAt: true,
            author: { select: { name: true } },
          },
          orderBy: byNewest,
        })
      : [],
    prisma.milestone.findMany({
      where: j,
      select: {
        kind: true,
        title: true,
        note: true,
        occurredAt: true,
        photoUrls: true,
        child: { select: { name: true } },
      },
      orderBy: { occurredAt: "desc" },
    }),
    // Her care journal — how she was, day by day. Hers and his, no one else's.
    inHouse
      ? prisma.checkIn.findMany({
          where: j,
          select: {
            mood: true,
            note: true,
            createdAt: true,
            user: { select: { name: true } },
          },
          orderBy: byNewest,
        })
      : [],
    inHouse
      ? prisma.appointment.findMany({
          where: j,
          select: {
            kind: true,
            title: true,
            at: true,
            hasTime: true,
            where: true,
            who: true,
            notes: true,
            questions: true,
            outcome: true,
            attendedAt: true,
            cancelledAt: true,
          },
          orderBy: { at: "asc" },
        })
      : [],
    // A note to yourself is exactly that.
    prisma.nudge.findMany({
      where: { journeyId, userId },
      select: { text: true, dueAt: true, doneAt: true, createdAt: true },
      orderBy: { dueAt: "asc" },
    }),
    prisma.encouragement.findMany({
      where: j,
      select: {
        body: true,
        verseRef: true,
        createdAt: true,
        author: { select: { name: true } },
      },
      orderBy: byNewest,
    }),
    prisma.remembrance.findMany({
      where: j,
      select: { body: true, createdAt: true, author: { select: { name: true } } },
      orderBy: byNewest,
    }),
    prisma.supportDay.findMany({
      where: j,
      select: {
        day: true,
        prayed: true,
        reachedOut: true,
        user: { select: { name: true } },
      },
      orderBy: { day: "desc" },
    }),
  ]);

  return {
    you,
    journey,
    members,
    children,
    posts,
    worshipDays,
    readingNotes,
    prayers,
    letters,
    milestones,
    checkIns,
    appointments,
    nudges,
    encouragements,
    remembrances,
    supportDays,
  };
}

type Gathered = Awaited<ReturnType<typeof gather>>;

/* ── writing it out ──────────────────────────────────────────────────────── */

const ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
};

function esc(v: unknown): string {
  return String(v ?? "").replace(/[&<>"]/g, (c) => ESCAPES[c]);
}

const DAY = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

function day(d: Date | string | null | undefined): string {
  if (!d) return "";
  const date = d instanceof Date ? d : new Date(d);
  return Number.isNaN(date.getTime()) ? "" : DAY.format(date);
}

/** "john" is how the reader stores it; "John" is how a person reads it. */
function bookName(slug: string): string {
  return BOOKS.find((b) => b.slug === slug)?.name ?? slug;
}

/** Paragraphs, kept as the person wrote them. */
function prose(body: string): string {
  return body
    .split(/\n{2,}/)
    .map((p) => `<p>${esc(p).replace(/\n/g, "<br>")}</p>`)
    .join("");
}

function photos(urls: string[]): string {
  if (!urls?.length) return "";
  return `<p class="shots">${urls
    .map((u, i) => `<a href="${esc(u)}">photograph ${i + 1}</a>`)
    .join(" · ")}</p>`;
}

/** MilestoneKind and the rest read as SHOUTED_CONSTANTS; people do not. */
function words(v: string): string {
  return v.toLowerCase().replace(/_/g, " ");
}

interface Chapter {
  slug: string;
  title: string;
  blurb: string;
  rows: unknown[];
  html: string;
}

function chapters(g: Gathered): Chapter[] {
  const name = (p: { name: string | null } | null | undefined) => p?.name ?? "someone";
  const list = (rows: string[]) => rows.join("");

  const out: Chapter[] = [
    {
      slug: "children",
      title: "The children",
      blurb: "Everyone this journey has been waiting for, and welcomed.",
      rows: g.children,
      html: list(
        g.children.map(
          (c) =>
            `<article><h3>${esc(c.name)}</h3><p class="meta">${
              c.birthDate ? `born ${day(c.birthDate)}` : "still on the way"
            }${c.sex ? ` · ${esc(c.sex)}` : ""}</p>${c.note ? prose(c.note) : ""}</article>`,
        ),
      ),
    },
    {
      slug: "life",
      title: "Life",
      blurb: "Everything posted to the family's own page, newest first.",
      rows: g.posts,
      html: list(
        g.posts.map(
          (p) =>
            `<article><p class="meta">${esc(name(p.author))} · ${day(p.createdAt)}</p>${prose(
              p.body,
            )}${photos([...(p.imageUrl ? [p.imageUrl] : []), ...p.mediaUrls])}${
              p.comments.length
                ? `<div class="replies">${p.comments
                    .map(
                      (c) =>
                        `<p><span class="who">${esc(name(c.author))}</span> ${esc(c.body)}</p>`,
                    )
                    .join("")}</div>`
                : ""
            }</article>`,
        ),
      ),
    },
    {
      slug: "letters",
      title: "Letters",
      blurb: "Written along the way, to be read one day.",
      rows: g.letters,
      html: list(
        g.letters.map(
          (l) =>
            `<article><p class="meta">${esc(name(l.author))}${
              l.toBaby ? " · to the baby" : ""
            } · ${day(l.createdAt)}</p>${prose(l.body)}</article>`,
        ),
      ),
    },
    {
      slug: "firsts",
      title: "Firsts and milestones",
      blurb: "What happened, and when.",
      rows: g.milestones,
      html: list(
        g.milestones.map(
          (m) =>
            `<article><h3>${esc(m.title ?? words(m.kind))}</h3><p class="meta">${
              m.child ? `${esc(name(m.child))} · ` : ""
            }${day(m.occurredAt)}</p>${m.note ? prose(m.note) : ""}${photos(
              m.photoUrls,
            )}</article>`,
        ),
      ),
    },
    {
      slug: "prayer",
      title: "Prayer",
      blurb: "What was asked for, and what came of it.",
      rows: g.prayers,
      html: list(
        g.prayers.map(
          (p) =>
            `<article><h3>${esc(p.title)}</h3><p class="meta">${esc(
              name(p.author),
            )} · ${day(p.createdAt)} · prayed ${p._count.prayers} time${
              p._count.prayers === 1 ? "" : "s"
            }${p.answeredAt ? ` · answered ${day(p.answeredAt)}` : ""}</p>${
              p.body ? prose(p.body) : ""
            }</article>`,
        ),
      ),
    },
    {
      slug: "encouragement",
      title: "What the circle said",
      blurb: "Words sent by the people walking alongside.",
      rows: g.encouragements,
      html: list(
        g.encouragements.map(
          (e) =>
            `<article><p class="meta">${esc(name(e.author))} · ${day(e.createdAt)}${
              e.verseRef ? ` · ${esc(e.verseRef)}` : ""
            }</p>${prose(e.body)}</article>`,
        ),
      ),
    },
    {
      slug: "care",
      title: "How she was",
      blurb: "The care journal, day by day — kept between the two of you.",
      rows: g.checkIns,
      html: list(
        g.checkIns.map(
          (c) =>
            `<article><p class="meta">${esc(name(c.user))} · ${esc(
              words(c.mood),
            )} · ${day(c.createdAt)}</p>${c.note ? prose(c.note) : ""}</article>`,
        ),
      ),
    },
    {
      slug: "appointments",
      title: "Appointments",
      blurb: "Every scan, check and clinic — with the questions asked and the answers given.",
      rows: g.appointments,
      html: list(
        g.appointments.map(
          (a) =>
            `<article><h3>${esc(a.title ?? words(a.kind))}</h3><p class="meta">${day(
              a.at,
            )}${a.where ? ` · ${esc(a.where)}` : ""}${a.who ? ` · ${esc(a.who)}` : ""}${
              a.cancelledAt ? " · cancelled" : a.attendedAt ? " · attended" : ""
            }</p>${a.questions ? `<div class="asked">${prose(a.questions)}</div>` : ""}${
              a.notes ? prose(a.notes) : ""
            }${a.outcome ? `<div class="answer">${prose(a.outcome)}</div>` : ""}</article>`,
        ),
      ),
    },
    {
      slug: "worship",
      title: "Worship",
      blurb: `Every day this family gathered — ${g.worshipDays.length} in all.`,
      rows: g.worshipDays,
      html: g.worshipDays.length
        ? `<p class="days">${g.worshipDays.map((w) => day(w.day)).join(" · ")}</p>`
        : "",
    },
    {
      slug: "scripture",
      title: "Scripture notes",
      blurb: "What was written down while reading.",
      rows: g.readingNotes,
      html: list(
        g.readingNotes.map(
          (n) =>
            `<article><p class="meta">${esc(bookName(n.bookSlug))} ${n.chapter} · ${esc(
              name(n.author),
            )} · ${day(n.createdAt)}${n.isPrivate ? " · kept private" : ""}</p>${prose(
              n.body,
            )}</article>`,
        ),
      ),
    },
    {
      slug: "remembrance",
      title: "Remembrance",
      blurb: "What was written in grief, and kept.",
      rows: g.remembrances,
      html: list(
        g.remembrances.map(
          (r) =>
            `<article><p class="meta">${esc(name(r.author))} · ${day(
              r.createdAt,
            )}</p>${prose(r.body)}</article>`,
        ),
      ),
    },
    {
      slug: "reminders",
      title: "Your own reminders",
      blurb: "Notes you set for yourself. Yours only — nobody else's appear here.",
      rows: g.nudges,
      html: list(
        g.nudges.map(
          (n) =>
            `<article><p class="meta">${day(n.dueAt)}${
              n.doneAt ? ` · done ${day(n.doneAt)}` : ""
            }</p><p>${esc(n.text)}</p></article>`,
        ),
      ),
    },
    {
      slug: "support",
      title: "Who stood with you",
      blurb: "The days the circle prayed and reached out.",
      rows: g.supportDays,
      html: g.supportDays.length
        ? `<p class="days">${g.supportDays
            .map(
              (s) =>
                `${esc(name(s.user))} — ${day(s.day)}${s.prayed ? " · prayed" : ""}${
                  s.reachedOut ? " · reached out" : ""
                }`,
            )
            .join("<br>")}</p>`
        : "",
    },
  ];

  return out.filter((c) => c.rows.length > 0);
}

function title(g: Gathered): string {
  const baby = g.journey?.babyName;
  const owner = g.journey?.owner?.name;
  if (baby) return baby;
  if (owner) return `${owner}'s journey`;
  return "This journey";
}

function page(g: Gathered, cs: Chapter[], who: string): string {
  const heading = title(g);
  const total = cs.reduce((n, c) => n + c.rows.length, 0);
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(heading)} — everything kept</title>
<style>
  :root {
    --ink: #2a2320; --muted: #80756c; --line: #e6ddd4;
    --ground: #fbf8f4; --surface: #fffefb; --accent: #a35a52;
  }
  @media (prefers-color-scheme: dark) {
    :root {
      --ink: #efe7dd; --muted: #9c9188; --line: #362f2a;
      --ground: #191411; --surface: #211b17; --accent: #dd9b90;
    }
  }
  * { box-sizing: border-box; }
  body {
    margin: 0; padding: 0; background: var(--ground); color: var(--ink);
    font: 16px/1.65 Georgia, "Iowan Old Style", "Times New Roman", serif;
  }
  .wrap { max-width: 42rem; margin: 0 auto; padding: 3rem 1.25rem 6rem; }
  h1 { font-size: 2.1rem; line-height: 1.15; margin: 0 0 .4rem; text-wrap: balance; }
  h2 {
    font-size: 1.35rem; margin: 4rem 0 .25rem; padding-top: 1.5rem;
    border-top: 1px solid var(--line);
  }
  h3 { font-size: 1.05rem; margin: 0 0 .2rem; }
  .lede, .blurb { color: var(--muted); margin: 0 0 1.5rem; }
  .blurb { font-size: .9rem; margin-bottom: 1.75rem; }
  .meta {
    font: 400 .74rem/1.5 ui-monospace, "SF Mono", Menlo, monospace;
    color: var(--muted); letter-spacing: .02em; margin: 0 0 .5rem;
  }
  article {
    background: var(--surface); border: 1px solid var(--line);
    border-radius: 10px; padding: 1.1rem 1.25rem; margin: 0 0 .85rem;
  }
  article p { margin: 0 0 .7rem; }
  article p:last-child { margin-bottom: 0; }
  .replies { border-top: 1px solid var(--line); margin-top: .8rem; padding-top: .7rem; }
  .replies p { font-size: .92rem; margin-bottom: .35rem; }
  .who { color: var(--accent); }
  .answer, .asked { border-left: 2px solid var(--accent); padding-left: .9rem; margin: .7rem 0; }
  .asked { border-left-color: var(--line); }
  .days, .shots { font: 400 .78rem/1.9 ui-monospace, Menlo, monospace; color: var(--muted); }
  a { color: var(--accent); }
  nav { margin: 2rem 0 0; padding: 1.1rem 1.25rem; background: var(--surface);
        border: 1px solid var(--line); border-radius: 10px; }
  nav ul { margin: 0; padding: 0; list-style: none;
           font: 400 .82rem/2 ui-monospace, Menlo, monospace; }
  footer { margin-top: 5rem; padding-top: 1.5rem; border-top: 1px solid var(--line);
           color: var(--muted); font-size: .82rem; }
  @media print {
    body { background: #fff; color: #000; }
    article, nav { break-inside: avoid; border-color: #ccc; background: #fff; }
    h2 { break-after: avoid; }
  }
</style></head><body><div class="wrap">
<h1>${esc(heading)}</h1>
<p class="lede">Everything kept here, written out on ${day(new Date())} for ${esc(
    who,
  )} — ${total} record${total === 1 ? "" : "s"}. This page needs nothing but a
browser. Keep it somewhere safe, or print it.</p>
<nav><ul>${cs
    .map((c) => `<li><a href="#${c.slug}">${esc(c.title)}</a> — ${c.rows.length}</li>`)
    .join("")}</ul></nav>
${cs
  .map(
    (c) =>
      `<section id="${c.slug}"><h2>${esc(c.title)}</h2><p class="blurb">${esc(
        c.blurb,
      )}</p>${c.html}</section>`,
  )
  .join("")}
<footer><p>Photographs are not inside this file. Where a record had pictures,
their web addresses are linked above and the pictures themselves stay where
they have always been. Save them separately if you want them for good.</p>
<p>Written out of Oyun. The words are yours; they always were.</p></footer>
</div></body></html>`;
}

function readme(g: Gathered, cs: Chapter[], who: string, inHouse: boolean): string {
  return `${title(g)} — everything kept
Written out on ${day(new Date())} for ${who}.

WHAT IS IN HERE
  your-journey.html  Open this first. Everything, laid out to read or to print.
                     It needs no app and no internet — just a browser.
  data/              The same records again, as JSON, one file per kind, for
                     anyone who wants to move them somewhere else.

WHAT IS IN IT
${cs.map((c) => `  ${String(c.rows.length).padStart(5)}  ${c.title}`).join("\n")}

ABOUT THE PHOTOGRAPHS
  Pictures are not packed into this file — a family's photographs run to
  hundreds of megabytes. Every record that had pictures lists their web
  addresses instead, and the pictures are still there. If you want them kept
  for good, save them down yourself.

WHAT IS NOT IN HERE
${
  inHouse
    ? "  Reminders anyone else set for themselves, and any reading note another\n  person marked private. Those were never yours to take."
    : "  The rooms this family keeps between themselves — the letters, the care\n  journal, and the appointments. You are part of the circle around them, not\n  one of the two at the centre, and the export shows you exactly what the app\n  does."
}

These months belong to your family. They always did.
`;
}

/* ── the file itself ─────────────────────────────────────────────────────── */

export async function buildExport(scope: ExportScope): Promise<{
  filename: string;
  body: Buffer;
}> {
  const g = await gather(scope);
  const cs = chapters(g);
  const who = g.you?.name ?? g.you?.email ?? "you";

  const entries: ZipEntry[] = [
    { name: "README.txt", data: readme(g, cs, who, isHousehold(scope.role)) },
    { name: "your-journey.html", data: page(g, cs, who) },
  ];

  for (const [key, rows] of Object.entries(g)) {
    if (rows == null) continue;
    entries.push({ name: `data/${key}.json`, data: JSON.stringify(rows, null, 2) });
  }

  const slug =
    title(g)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "journey";
  const stamp = new Date().toISOString().slice(0, 10);

  return { filename: `oyun-${slug}-${stamp}.zip`, body: makeZip(entries) };
}
