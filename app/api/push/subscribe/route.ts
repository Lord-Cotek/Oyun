import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { KEY_MAX, isPushEndpoint } from "@/lib/push-endpoint";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  let sub: { endpoint?: unknown; keys?: { p256dh?: unknown; auth?: unknown } };
  try {
    sub = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid body" }, { status: 400 });
  }

  const endpoint = typeof sub.endpoint === "string" ? sub.endpoint : "";
  const p256dh = typeof sub.keys?.p256dh === "string" ? sub.keys.p256dh : "";
  const authKey = typeof sub.keys?.auth === "string" ? sub.keys.auth : "";
  if (!endpoint || !p256dh || !authKey || p256dh.length > KEY_MAX || authKey.length > KEY_MAX) {
    return NextResponse.json({ ok: false, error: "Incomplete subscription" }, { status: 400 });
  }
  // Only a browser maker's push service — see lib/push-endpoint.ts.
  if (!isPushEndpoint(endpoint)) {
    return NextResponse.json({ ok: false, error: "Not a push service" }, { status: 400 });
  }

  try {
    await prisma.pushSubscription.upsert({
      where: { endpoint },
      create: { userId: session.user.id, endpoint, p256dh, auth: authKey },
      update: { userId: session.user.id, p256dh, auth: authKey },
    });
  } catch {
    // The database's own words are not for the browser.
    return NextResponse.json({ ok: false, error: "Could not save" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
