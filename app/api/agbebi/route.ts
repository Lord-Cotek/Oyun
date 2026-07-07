import { NextResponse } from "next/server";
import { anthropic, modelFor } from "@/lib/anthropic";
import { buildAgbebiSystem } from "@/lib/agbebi";
import { auth } from "@/lib/auth";
import { getActiveMembership } from "@/lib/data";
import { computePosition } from "@/lib/stage";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ChatMessage = { role: "user" | "assistant"; content: string };

const MAX_MESSAGES = 24;
const MAX_CHARS = 6000;

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "Agbebi is not configured yet (missing ANTHROPIC_API_KEY)." },
      { status: 503 },
    );
  }

  let body: { messages?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const messages = sanitizeMessages(body.messages);
  if (messages.length === 0) {
    return NextResponse.json({ error: "No message provided." }, { status: 400 });
  }

  // Build authoritative context server-side from the session — never trust the client.
  const session = await auth();
  let system = buildAgbebiSystem({ name: session?.user?.name });

  if (session?.user?.id) {
    const active = await getActiveMembership(session.user.id);
    const me = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { name: true },
    });
    if (active) {
      const position = computePosition(active.journey.dueDate);
      system = buildAgbebiSystem({
        name: me?.name ?? session.user.name,
        role: active.role,
        stage: position.stage,
        babyName: active.journey.babyName,
      });
    }
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const anthropicStream = anthropic.messages.stream({
          model: modelFor("default"),
          max_tokens: 1024,
          system,
          messages,
        });

        anthropicStream.on("text", (text) => {
          controller.enqueue(encoder.encode(text));
        });

        await anthropicStream.finalMessage();
        controller.close();
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Agbebi is unavailable right now.";
        controller.enqueue(
          encoder.encode(`\n\n[Agbebi could not respond: ${message}]`),
        );
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "X-Accel-Buffering": "no",
    },
  });
}

function sanitizeMessages(raw: unknown): ChatMessage[] {
  if (!Array.isArray(raw)) return [];
  const cleaned: ChatMessage[] = [];
  for (const m of raw) {
    if (
      m &&
      typeof m === "object" &&
      (m.role === "user" || m.role === "assistant") &&
      typeof m.content === "string" &&
      m.content.trim().length > 0
    ) {
      cleaned.push({
        role: m.role,
        content: m.content.slice(0, MAX_CHARS),
      });
    }
  }
  return cleaned.slice(-MAX_MESSAGES);
}
