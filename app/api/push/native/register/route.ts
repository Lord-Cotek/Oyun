import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Register (or refresh) a native device token for the signed-in user. */
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  let body: { token?: string; platform?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid body" }, { status: 400 });
  }

  const token = (body.token ?? "").trim();
  const platform = (body.platform ?? "unknown").trim().toLowerCase();
  if (!token) {
    return NextResponse.json({ ok: false, error: "Missing token" }, { status: 400 });
  }

  // A token is unique to a device; make sure it belongs to this user.
  await prisma.nativePushToken.upsert({
    where: { token },
    create: { userId: session.user.id, token, platform },
    update: { userId: session.user.id, platform },
  });

  return NextResponse.json({ ok: true });
}

/** Remove a native device token (e.g. on sign-out or when disabled). */
export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  let body: { token?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid body" }, { status: 400 });
  }
  const token = (body.token ?? "").trim();
  if (token) {
    await prisma.nativePushToken
      .deleteMany({ where: { token, userId: session.user.id } })
      .catch(() => {});
  }
  return NextResponse.json({ ok: true });
}
