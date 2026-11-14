import { NextResponse } from "next/server";
import { sendMorningNotes } from "@/lib/morning-send";
import { sendOwnMornings } from "@/lib/own-morning";
import { isOn } from "@/lib/flags";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * The morning note, hourly.
 *
 * Hourly because it sends to whoever has just arrived at their own chosen
 * hour — see lib/morning-send.ts. Most runs send to nobody at all, which is
 * the intended shape rather than a sign something is wrong.
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  const authz = req.headers.get("authorization");
  if (!secret || authz !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Reminders at each person's own morning — their hour, their time zone.
  // Not behind the morning note's switch: somebody who turned the note off
  // still asked to be reminded. See lib/own-morning.ts.
  const reminders = await sendOwnMornings();

  // Checked before any work, so it can be stopped from the admin centre
  // without waiting for a deploy. Said out loud rather than silently skipped.
  if (!(await isOn("morning-note"))) {
    return NextResponse.json({ skipped: "the morning note is switched off", reminders });
  }

  return NextResponse.json({ ok: true, ...(await sendMorningNotes()), reminders });
}
