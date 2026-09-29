/**
 * Hands the family their own months back, as one file.
 *
 * A GET so it can be a plain link — no JavaScript, no fetch, nothing to go
 * wrong on a phone with a poor signal. The browser saves it the way it saves
 * any download.
 *
 * Gathering a whole journey takes a moment, so the route is given room to
 * work; `force-dynamic` keeps it away from any cache, since the one thing
 * worse than a slow export is somebody else's.
 */
import { auth } from "@/lib/auth";
import { getActiveMembership } from "@/lib/data";
import { buildExport } from "@/lib/export";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response("Sign in first.", { status: 401 });
  }

  const active = await getActiveMembership(session.user.id);
  if (!active) {
    return new Response("No journey to write out yet.", { status: 404 });
  }

  const { filename, body } = await buildExport({
    userId: session.user.id,
    journeyId: active.journey.id,
    role: active.role,
  });

  return new Response(new Uint8Array(body), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Length": String(body.length),
      "Cache-Control": "no-store, private",
    },
  });
}
