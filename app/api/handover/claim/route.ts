import { NextResponse } from "next/server";
import { secretOk } from "@/lib/handover-bundle";
import { claimPass } from "@/lib/handover";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Ìdílé says the family has arrived: the pass is spent. */
export async function POST(req: Request) {
  if (!secretOk(req.headers.get("authorization"))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await req.json().catch(() => null)) as { pass?: unknown } | null;
  const pass = typeof body?.pass === "string" ? body.pass.slice(0, 100) : "";
  if (!pass) return NextResponse.json({ error: "missing" }, { status: 400 });
  return NextResponse.json({ claimed: await claimPass(pass) });
}
