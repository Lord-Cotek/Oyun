import { liveReportLink } from "@/lib/health-report-link";
import { asMother } from "@/lib/health-report";
import { csvResponse, healthCsv } from "@/lib/health-csv";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * The same numbers as the report behind a link — the link's period exactly,
 * nothing outside it — so a doctor can take them into a spreadsheet, and so
 * the installed app (which cannot download a file itself) can hand them to
 * the phone's browser.
 */
export async function GET(req: Request, { params }: { params: { token: string } }) {
  const link = await liveReportLink(String(params.token));
  if (!link) return new Response("Not found", { status: 404 });
  const kind = new URL(req.url).searchParams.get("kind") === "doses" ? "doses" : "readings";
  const a = await asMother(link.journeyId);
  const period = { from: link.fromDay.toISOString().slice(0, 10), to: link.toDay.toISOString().slice(0, 10) };
  return csvResponse(await healthCsv(a, kind, period), kind, period);
}
