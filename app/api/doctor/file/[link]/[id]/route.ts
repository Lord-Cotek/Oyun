import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { clinicianAccess } from "@/lib/clinician";
import { streamHealthFile } from "@/lib/health-file-stream";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * A photograph or document from a patient's log, for the clinician she
 * shares with.
 *
 * Served only to the clinician signed in on the account the link was made
 * with, only while the link is live, only if she left attachments on, and
 * only for a file attached to a reading, a dose or a test in her own
 * journey — never a photograph from her diary or anything else she keeps.
 *
 * ── Why a PDF as well as a picture ───────────────────────────────────────
 * She can attach either to a test: a photograph of a result, or the PDF the
 * laboratory sent. The report lists both. This route used to pass only
 * pictures, so the PDF showed as a link that opened to "Not found" — the
 * one attachment a doctor is most likely to want. The two kinds the upload
 * accepts are the two kinds served, and nothing else.
 */
const servable = (type: string) => type.startsWith("image/") || type === "application/pdf";

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
    !servable(file.contentType)
  ) {
    return new Response("Not found", { status: 404 });
  }
  return streamHealthFile(file);
}
