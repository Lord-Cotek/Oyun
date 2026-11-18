import { NextResponse } from "next/server";
import { isOn } from "@/lib/flags";
import { recordRun } from "@/lib/cron-run";
import { sendHealthReminders } from "@/lib/health-reminders";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Health log reminders, hourly: each medicine dose at the run just before it
 * is due, and the reading times she chose. See lib/health-reminders.ts.
 * Oyun's own job — the hourly morning job is shared with Ìdílé, which has
 * no health log.
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  const authz = req.headers.get("authorization");
  if (!secret || authz !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const result = await recordRun("health", maxDuration, async () => {
    if (!(await isOn("health-reminders"))) return { skipped: "health reminders are switched off" };
    return sendHealthReminders();
  });
  return NextResponse.json({ ok: true, ...result });
}
