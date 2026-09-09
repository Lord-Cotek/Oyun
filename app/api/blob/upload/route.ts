import { NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";

// Explicit types — Vercel Blob matches allowedContentTypes exactly, so a
// wildcard like "image/*" would reject a real "image/png". Cover the common
// photo and video types phones produce.
const ALLOWED_CONTENT_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/heic",
  "image/heif",
  "video/mp4",
  "video/quicktime",
  "video/webm",
  "video/x-m4v",
  "video/3gpp",
  "video/x-matroska",
];

const MAX_BYTES = 200 * 1024 * 1024; // 200 MB — room for a short video

/**
 * Signs client-side uploads to Vercel Blob for the family feed. The browser
 * uploads the file directly to Blob storage (so large photos and videos never
 * pass through a server action's body limit); this route only issues a
 * short-lived, size- and type-restricted token to a signed-in user.
 */
export async function POST(request: Request): Promise<NextResponse> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    return NextResponse.json(
      { error: "Photo & video storage isn't set up yet (missing blob token)." },
      { status: 503 },
    );
  }

  const body = (await request.json()) as HandleUploadBody;
  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      token,
      onBeforeGenerateToken: async () => {
        const session = await auth();
        if (!session?.user?.id) throw new Error("Please sign in to share media.");
        return {
          allowedContentTypes: ALLOWED_CONTENT_TYPES,
          maximumSizeInBytes: MAX_BYTES,
          addRandomSuffix: true,
        };
      },
      // The client captures the returned URL directly, so persistence does not
      // depend on this server-to-server callback (which localhost can't reach).
      onUploadCompleted: async () => {},
    });
    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 },
    );
  }
}
