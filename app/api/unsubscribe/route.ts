import { NextResponse } from "next/server";
import { applyUnsubscribe, isUnsubKind } from "@/lib/unsubscribe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * One-click unsubscribe, as mail apps send it (RFC 8058): a POST to the
 * address in the List-Unsubscribe header, with no page in between. The
 * signature in the address is the whole of the permission.
 *
 * A GET (somebody pasting the address into a browser) goes to the page,
 * which asks before it changes anything — link scanners follow GETs.
 */
export async function POST(req: Request) {
  const url = new URL(req.url);
  const u = url.searchParams.get("u") ?? "";
  const k = url.searchParams.get("k");
  const t = url.searchParams.get("t") ?? "";
  if (!u || !isUnsubKind(k) || !(await applyUnsubscribe(u, k, t))) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  return NextResponse.redirect(new URL(`/unsubscribe${url.search}`, url.origin), 303);
}
