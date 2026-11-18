import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAccess } from "@/lib/health-log-db";
import { streamHealthFile } from "@/lib/health-file-stream";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * One health file, to somebody allowed to see it — and to nobody else.
 *
 * Checked against the journey the file belongs to (not whichever journey the
 * viewer happens to have open). The storage address never reaches the page:
 * this route fetches it server-side and streams it, marked private and never
 * to be cached by anything in between. Report links (a doctor, no login) are
 * checked in a sibling route under the report's own token.
 */
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) return new Response("Not found", { status: 404 });
  const file = await prisma.healthFile.findUnique({
    where: { id: String(params.id).slice(0, 64) },
    select: { journeyId: true, url: true, access: true, contentType: true },
  });
  if (!file) return new Response("Not found", { status: 404 });
  const ok = await logAccess(session.user.id, file.journeyId);
  if (!ok) return new Response("Not found", { status: 404 });
  return streamHealthFile(file);
}
