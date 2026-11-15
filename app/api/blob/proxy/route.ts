import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

/**
 * Same-origin proxy for Vercel Blob images, used only so the family-tree
 * poster can embed profile photos as data URLs without tainting the export
 * canvas. Restricted to the Blob host, and to signed-in users.
 */
export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const target = new URL(req.url).searchParams.get("url");
  if (!target) return new NextResponse("Missing url", { status: 400 });

  let u: URL;
  try {
    u = new URL(target);
  } catch {
    return new NextResponse("Bad url", { status: 400 });
  }
  if (u.protocol !== "https:" || !u.hostname.endsWith(".blob.vercel-storage.com")) {
    return new NextResponse("Forbidden host", { status: 403 });
  }

  // Never from Next's fetch cache: a photo deleted a minute ago must stop
  // being served, not linger in a cache keyed on its address.
  const res = await fetch(u.toString(), { cache: "no-store" });
  if (!res.ok) return new NextResponse("Upstream error", { status: 502 });

  const buf = await res.arrayBuffer();
  return new NextResponse(buf, {
    headers: {
      "content-type": res.headers.get("content-type") ?? "image/jpeg",
      "cache-control": "private, max-age=3600",
    },
  });
}
