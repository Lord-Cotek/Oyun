import { prisma } from "@/lib/prisma";
import { liveReportLink } from "@/lib/health-report-link";
import { fileInReport } from "@/lib/health-report";
import { streamHealthFile } from "@/lib/health-file-stream";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * A photo or PDF in a doctor's report, reached through the report's own link.
 * Served only while the link is open, only if she chose to include
 * attachments, and only for a file attached to something inside the report's
 * period — never any other file in her log. A PDF she attached to a test is
 * listed in the report beside the photographs, so it is served like them;
 * before, its link opened to "Not found".
 */
export async function GET(_req: Request, { params }: { params: { token: string; id: string } }) {
  const link = await liveReportLink(String(params.token));
  if (!link) return new Response("Not found", { status: 404 });
  const file = await prisma.healthFile.findUnique({
    where: { id: String(params.id).slice(0, 64) },
    select: { journeyId: true, entryType: true, entryId: true, url: true, access: true, contentType: true },
  });
  if (!file || !(file.contentType.startsWith("image/") || file.contentType === "application/pdf")) return new Response("Not found", { status: 404 });
  if (!(await fileInReport(file, link))) return new Response("Not found", { status: 404 });
  return streamHealthFile(file);
}
