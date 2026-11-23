import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { clinicianAccess } from "@/lib/clinician";
import { streamHealthFile } from "@/lib/health-file-stream";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * A photograph from a patient's log, for the clinician she shares with.
 *
 * Served only to the clinician signed in on the account the link was made
 * with, only while the link is live, only if she left photographs on, and
 * only for an image attached to a reading, a dose or a test in her own
 * journey — never a photograph from her diary or anything else she keeps.
 */
export async function GET(_req: Request, { params }: { params: { link: string; id: string } }) {
  const session = await auth();
  if (!session?.user?.id) return new Response("Not found", { status: 404 });
  const link = await clinicianAccess(session.user.id, params.link);
  if (!link || !link.withPhotos) return new Response("Not found", { status: 404 });
  const file = await prisma.healthFile.findUnique({
    where: { id: String(params.id).slice(0, 64) },
    select: { journeyId: true, entryType: true, entryId: true, url: true, access: true, contentType: true },
  });
  if (
    !file ||
    file.journeyId !== link.journeyId ||
    !file.entryId ||
    !["reading", "dose", "check"].includes(file.entryType ?? "") ||
    !file.contentType.startsWith("image/")
  ) {
    return new Response("Not found", { status: 404 });
  }
  return streamHealthFile(file);
}
