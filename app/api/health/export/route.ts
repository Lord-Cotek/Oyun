import { auth } from "@/lib/auth";
import { getActiveMembership } from "@/lib/data";
import { logAccess } from "@/lib/health-log-db";
import { buildHealthExport } from "@/lib/health-export";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

/** Her whole health log as a ZIP. Hers alone to take. */
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return new Response("Not found", { status: 404 });
  const active = await getActiveMembership(session.user.id);
  if (!active) return new Response("Not found", { status: 404 });
  const a = await logAccess(session.user.id, active.journey.id);
  if (!a?.isMother) return new Response("Not found", { status: 404 });
  const { filename, body } = await buildHealthExport(a.journeyId);
  return new Response(new Uint8Array(body), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, no-store, max-age=0",
      "X-Content-Type-Options": "nosniff",
      "X-Robots-Tag": "noindex",
    },
  });
}
