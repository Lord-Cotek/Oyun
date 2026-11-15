import { NextResponse } from "next/server";
import { secretOk } from "@/lib/handover-bundle";
import { buildBundle } from "@/lib/handover";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Ìdílé asks for the family behind a pass. Server to server only: refused
 * without HANDOVER_SECRET, and the pass itself is in the body, never the URL.
 */
export async function POST(req: Request) {
  if (!secretOk(req.headers.get("authorization"))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await req.json().catch(() => null)) as { pass?: unknown } | null;
  const pass = typeof body?.pass === "string" ? body.pass.slice(0, 100) : "";
  if (!pass) return NextResponse.json({ error: "missing" }, { status: 400 });

  const found = await buildBundle(pass);
  if (found.status !== "ok") {
    return NextResponse.json({ error: found.status }, { status: found.status === "missing" ? 404 : 410 });
  }
  return NextResponse.json(found.bundle, { headers: { "cache-control": "no-store" } });
}
