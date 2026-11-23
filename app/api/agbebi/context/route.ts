import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getActiveMembership } from "@/lib/data";
import { computePosition } from "@/lib/stage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Lightweight context for the chat greeting / crisis banner. Degrades
 * gracefully to `{ authenticated: false }` when there is no session or DB,
 * so the landing page never fails on account of it.
 */
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ authenticated: false });
    }

    const active = await getActiveMembership(session.user.id);
    if (!active) {
      return NextResponse.json({
        authenticated: true,
        name: session.user.name ?? null,
        role: null,
        stageTitle: null,
        voice: session.user.voice ?? "FAITH",
      });
    }

    const position = computePosition(active.journey.dueDate);
    return NextResponse.json({
      authenticated: true,
      name: session.user.name ?? null,
      role: active.role,
      stageTitle: position.stage.title,
      babyName: active.journey.babyName ?? null,
      // So the chat greets them in the voice they chose — lib/voice.ts.
      voice: session.user.voice ?? "FAITH",
    });
  } catch {
    return NextResponse.json({ authenticated: false });
  }
}
