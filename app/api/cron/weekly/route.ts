import { NextResponse } from "next/server";
import { weeklyDigestFor, type DigestRole, type WeekFacts } from "@/lib/weekly-digest";
import { appointmentTitle } from "@/lib/appointments";
import { moodVisibleTo } from "@/lib/data";
import { prisma } from "@/lib/prisma";
import { computePosition } from "@/lib/stage";
import { MOOD_META } from "@/lib/moods";
import { sendWeeklyDigest } from "@/lib/email";
import { isOn } from "@/lib/flags";
import { claimWeekly, recordRun, releaseWeekly, weekKey, type Budget } from "@/lib/cron-run";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Weekly digest. Vercel Cron calls this on a schedule and automatically sends
 * `Authorization: Bearer $CRON_SECRET`. We refuse anything that doesn't match.
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  const authz = req.headers.get("authorization");
  if (!secret || authz !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Checked before any work, so turning it off in the admin centre stops the
  // next one going out without waiting for a deploy. Reported rather than
  // silent, so a cron run that did nothing says why.
  if (!(await isOn("weekly-digest"))) {
    return NextResponse.json({ skipped: "the weekly email is switched off" });
  }

  const result = await recordRun("weekly", maxDuration, (budget) => runWeekly(budget));
  return NextResponse.json({ ok: true, ...result });
}

async function runWeekly(budget: Budget) {
  const week = weekKey();

  const weekAgo = new Date();
  weekAgo.setUTCDate(weekAgo.getUTCDate() - 7);

  const journeys = await prisma.journey.findMany({
    // Not a family after a loss. "This week on your journey — Week 31 … one
    // thing to do" is the last email a bereaved mother should open, and the
    // daily job already holds back for the same reason. Nor one completed at
    // the second birthday, which would otherwise get "month 24" every week.
    where: { status: "ACTIVE", completedAt: null },
    include: {
      owner: { select: { id: true, name: true } },
      memberships: {
        include: {
          user: {
            select: { id: true, name: true, email: true, weeklyDigest: true, suspendedAt: true, voice: true },
          },
        },
      },
    },
  });

  let sent = 0;

  every: for (const journey of journeys) {
    const position = computePosition(journey.dueDate);
    const motherName = journey.owner.name ?? "her";

    const weekAhead = new Date(Date.now() + 7 * 86_400_000);
    const [prayedCount, latestMood, weeklyEncouragements, wallPrayers, answered, coming, photosAll, photosCircle, heldDays, heldWall] =
      await Promise.all([
        prisma.supportDay.count({
          where: { journeyId: journey.id, prayed: true, day: { gte: weekAgo } },
        }),
        // Only this week's: a mood from a month ago is not "lately".
        prisma.checkIn.findFirst({
          where: { journeyId: journey.id, userId: journey.ownerId, createdAt: { gte: weekAgo } },
          orderBy: { createdAt: "desc" },
        }),
        prisma.encouragement.count({
          where: { journeyId: journey.id, createdAt: { gte: weekAgo } },
        }),
        // Prayers said over requests on the prayer wall count too.
        prisma.prayerPray.count({
          where: { request: { journeyId: journey.id }, createdAt: { gte: weekAgo } },
        }),
        prisma.prayerRequest.findMany({
          where: { journeyId: journey.id, answeredAt: { gte: weekAgo } },
          select: { title: true },
          take: 3,
        }),
        // Appointments are the two of them's: health information.
        prisma.appointment.findMany({
          where: { journeyId: journey.id, cancelledAt: null, at: { gte: new Date(), lte: weekAhead } },
          orderBy: { at: "asc" },
          take: 3,
          select: { kind: true, title: true, at: true },
        }),
        // Photographs shared this week, counted the way each reader may see them.
        prisma.post.findMany({ where: { journeyId: journey.id, createdAt: { gte: weekAgo } }, select: { mediaUrls: true } })
          .then((ps) => ps.reduce((n, p) => n + p.mediaUrls.length, 0)),
        prisma.post.findMany({ where: { journeyId: journey.id, createdAt: { gte: weekAgo }, householdOnly: false }, select: { mediaUrls: true } })
          .then((ps) => ps.reduce((n, p) => n + p.mediaUrls.length, 0)),
        // Of those, the ones marked by somebody who chose Oyun without
        // religious content: they held her in mind rather than prayed, and
        // the email says so (lib/voice.ts).
        prisma.supportDay.count({
          where: { journeyId: journey.id, prayed: true, day: { gte: weekAgo }, user: { voice: "GENERAL" } },
        }),
        prisma.prayerPray.count({
          where: { request: { journeyId: journey.id }, createdAt: { gte: weekAgo }, user: { voice: "GENERAL" } },
        }),
      ]);
    const day = (d: Date) => d.toLocaleDateString("en-GB", { weekday: "long", timeZone: "UTC" });
    const comingLines = coming.map((a) => `${appointmentTitle(a.kind, a.title)} — ${day(a.at)}`);
    const answeredLines = answered.map((r) => `“${r.title}”`);

    // The same week for every reader; the words are chosen per reader below.
    const moodLabel = latestMood ? MOOD_META[latestMood.mood].label : null;
    const facts: WeekFacts = {
      motherName,
      supportAll: prayedCount + wallPrayers,
      supportHeld: heldDays + heldWall,
      encouragements: weeklyEncouragements,
      comingLines,
      answeredLines,
      photosAll,
      photosCircle,
      // Her mood only to those she has chosen — see Journey.moodAudience.
      moodForPartner: moodLabel && moodVisibleTo(journey.moodAudience, "PARTNER") ? moodLabel : null,
      moodForCircle: moodLabel && moodVisibleTo(journey.moodAudience, "CIRCLE") ? moodLabel : null,
    };

    for (const m of journey.memberships) {
      const u = m.user;
      // A suspended account gets nothing from the app until it is restored.
      if (!u.email || !u.weeklyDigest || u.suspendedAt) continue;
      if (budget.out()) { budget.stopped(); break every; }

      // Each reader in their own voice, chosen per person and not per
      // journey — lib/weekly-digest.ts, checked by scripts/verify-voice.mjs.
      const role: DigestRole = m.role === "MOTHER" ? "MOTHER" : m.role === "PARTNER" ? "PARTNER" : "CIRCLE";
      const { subject, intro, verse, sections } = weeklyDigestFor({ role, voice: u.voice }, position.stage, facts);

      // Claimed before the send, given back if the provider refuses — so a
      // retry or the second sweep never sends twice and never skips anyone.
      if (!(await claimWeekly(u.id, week, journey.id))) continue;
      const ok = await sendWeeklyDigest({
        to: u.email,
        userId: u.id,
        name: u.name,
        subject,
        intro,
        verse,
        sections,
        ctaLabel: "Open your journey",
        ctaHref: "/journey",
        voice: u.voice,
      });
      if (ok) sent += 1;
      else await releaseWeekly(u.id, week, journey.id);
    }
  }

  return { journeys: journeys.length, sent };
}
