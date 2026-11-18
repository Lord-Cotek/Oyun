import { NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { auth } from "@/lib/auth";
import { getActiveMembership } from "@/lib/data";
import { logAccess } from "@/lib/health-log-db";
import { HOUR, allowAll } from "@/lib/rate-limit";

export const runtime = "nodejs";

/**
 * Signs uploads of health proof — a photo of a meter, a used pen, a lab
 * report. Narrower than the family upload on purpose: only someone who may
 * see this journey's health log, only photos and PDFs, only under health/,
 * and stored privately where the storage allows it (the browser asks for
 * that; see lib/health-upload.ts). The address that comes back is kept on
 * the server and never shown — files are served through /api/health/file.
 */
const TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
const MAX_BYTES = 20 * 1024 * 1024;

export async function POST(request: Request): Promise<NextResponse> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) return NextResponse.json({ error: "Photo storage isn't set up yet." }, { status: 503 });
  const body = (await request.json()) as HandleUploadBody;
  try {
    const json = await handleUpload({
      body,
      request,
      token,
      onBeforeGenerateToken: async (pathname) => {
        const session = await auth();
        if (!session?.user?.id) throw new Error("Please sign in again.");
        const active = await getActiveMembership(session.user.id);
        const access = active ? await logAccess(session.user.id, active.journey.id) : null;
        if (!access) throw new Error("Only the two of you can add to the health log.");
        if (!pathname.startsWith(`health/${active!.journey.id}/`)) throw new Error("That is not where health files go.");
        const ok = await allowAll([
          [`hupload:h:${session.user.id}`, 60, HOUR],
          [`hupload:d:${session.user.id}`, 200, 24 * HOUR],
        ]);
        if (!ok) throw new Error("That is a lot of uploads for one day. Please try again later.");
        return { allowedContentTypes: TYPES, maximumSizeInBytes: MAX_BYTES, addRandomSuffix: true };
      },
      onUploadCompleted: async () => {},
    });
    return NextResponse.json(json);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
