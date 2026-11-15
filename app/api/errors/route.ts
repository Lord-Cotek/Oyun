import { NextResponse } from "next/server";
import { HOUR, allow, callerIp } from "@/lib/rate-limit";
import { recordError } from "@/lib/health";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Where the error screens report what broke. Anyone can reach it — an error
 * can happen signed out — so it takes only a short message, a page and a
 * digest, cuts each short, and accepts thirty a device an hour.
 */
export async function POST(req: Request) {
  if (!(await allow(`errors:ip:${callerIp()}`, 30, HOUR))) {
    return new NextResponse(null, { status: 204 });
  }
  let b: { message?: unknown; path?: unknown; digest?: unknown } = {};
  try {
    b = JSON.parse((await req.text()).slice(0, 4000));
  } catch {
    return new NextResponse(null, { status: 204 });
  }
  const message = typeof b.message === "string" ? b.message : "";
  if (!message) return new NextResponse(null, { status: 204 });
  // Only a path, never a query string: a query can carry a token.
  const path = typeof b.path === "string" ? b.path.split("?")[0].split("#")[0] : null;
  await recordError({
    where: "client",
    message,
    path,
    digest: typeof b.digest === "string" ? b.digest : null,
  });
  return new NextResponse(null, { status: 204 });
}
