import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { computePosition } from "@/lib/stage";
import { MOOD_META } from "@/lib/moods";
import { sendWeeklyDigest, type DigestSection } from "@/lib/email";

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

  const weekAgo = new Date();
  weekAgo.setUTCDate(weekAgo.getUTCDate() - 7);

  const journeys = await prisma.journey.findMany({
    include: {
      owner: { select: { id: true, name: true } },
      memberships: {
        include: {
          user: {
            select: { id: true, name: true, email: true, weeklyDigest: true },
          },
        },
      },
    },
  });

  let sent = 0;

  for (const journey of journeys) {
    const position = computePosition(journey.dueDate);
    const stage = position.stage;
    const motherName = journey.owner.name ?? "her";

    const [prayedCount, latestMood, weeklyEncouragements] = await Promise.all([
      prisma.supportDay.count({
        where: { journeyId: journey.id, prayed: true, day: { gte: weekAgo } },
      }),
      prisma.checkIn.findFirst({
        where: { journeyId: journey.id, userId: journey.ownerId },
        orderBy: { createdAt: "desc" },
      }),
      prisma.encouragement.count({
        where: { journeyId: journey.id, createdAt: { gte: weekAgo } },
      }),
    ]);

    for (const m of journey.memberships) {
      const u = m.user;
      if (!u.email || !u.weeklyDigest) continue;

      let subject: string;
      let intro: string;
      const sections: DigestSection[] = [];

      if (m.role === "MOTHER") {
        subject = `This week on your journey — ${stage.title}`;
        intro = `Here's where you are, and a word for the week ahead.`;
        sections.push({
          heading: "This week",
          lines: [stage.body, stage.reflection, `One thing to do: ${stage.action}`],
        });
        const circle: string[] = [];
        if (prayedCount > 0) {
          circle.push(
            `Your circle prayed for you ${prayedCount} time${prayedCount === 1 ? "" : "s"} this week.`,
          );
        }
        if (weeklyEncouragements > 0) {
          circle.push(
            `You received ${weeklyEncouragements} word${weeklyEncouragements === 1 ? "" : "s"} of encouragement.`,
          );
        }
        if (circle.length === 0) {
          circle.push("Invite someone to walk with you — you were not meant to carry this alone.");
        }
        sections.push({ heading: "Your circle", lines: circle });
      } else {
        subject = `Walking with ${motherName} this week`;
        intro = `Here's how to carry ${motherName} in the days ahead.`;
        sections.push({ heading: "How to carry her", lines: [stage.partnerFocus] });
        sections.push({ heading: "Pray for her", lines: [stage.prayerPoint] });
        if (latestMood) {
          sections.push({
            heading: "Her heart, lately",
            lines: [
              `${MOOD_META[latestMood.mood].label} — a good moment to reach out.`,
            ],
          });
        }
      }

      const ok = await sendWeeklyDigest({
        to: u.email,
        name: u.name,
        subject,
        intro,
        verse: { text: stage.verse.text, ref: stage.verse.ref },
        sections,
        ctaLabel: "Open your journey",
        ctaHref: "/journey",
      });
      if (ok) sent += 1;
    }
  }

  return NextResponse.json({ ok: true, journeys: journeys.length, sent });
}
