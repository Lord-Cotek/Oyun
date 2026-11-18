import { auth } from "@/lib/auth";
import { getActiveMembership } from "@/lib/data";
import { logAccess } from "@/lib/health-log-db";
import { motherTimeZone } from "@/lib/medication-db";
import { csvPeriod, csvResponse, healthCsv } from "@/lib/health-csv";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * The raw numbers, for a doctor's spreadsheet or her own records: readings
 * or doses, for the period on the report. Only to someone the log is open
 * to, in her own time zone and units, and never named after anybody.
 */
export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return new Response("Not found", { status: 404 });
  const active = await getActiveMembership(session.user.id);
  if (!active) return new Response("Not found", { status: 404 });
  const base = await logAccess(session.user.id, active.journey.id);
  if (!base) return new Response("Not found", { status: 404 });

  const u = new URL(req.url);
  const kind = u.searchParams.get("kind") === "doses" ? "doses" : "readings";
  const tz = await motherTimeZone(base.journeyId);
  const period = csvPeriod(u.searchParams.get("from"), u.searchParams.get("to"), tz);
  if ("error" in period) return new Response(period.error, { status: 400 });
  return csvResponse(await healthCsv({ ...base, timeZone: tz }, kind, period), kind, period);
}
