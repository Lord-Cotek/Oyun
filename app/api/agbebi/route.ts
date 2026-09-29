import { NextResponse } from "next/server";
import { anthropic, modelChain, isModelError } from "@/lib/anthropic";
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
  /**
   * Members only, and this is the line that matters.
   *
   * Every shared link Oyun makes — a post, a registry, an invitation — is a
   * public address by design, meant to be forwarded. Until this check
   * existed, so was this endpoint: anybody holding any of those links, or
   * none of them, could post twenty-four messages of six thousand
   * characters at it as often as they liked, against the family's key, from
   * any browser on earth. Hiding the button would have changed nothing,
   * because the button was never the way in.
   *
   * First of everything, before the body is read and before the key is even
   * looked for: an unwelcome request costs a cookie lookup and nothing
   * else, and a stranger learns nothing about how this app is configured.
   */
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Agbebi walks with families inside Oyun. Please sign in." },
      { status: 401 },
    );
  }

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
  let system = buildAgbebiSystem({ name: session.user.name });

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
      babyCount: active.journey.babyCount,
      grieving: active.journey.status === "LOSS",
      // The mother is the journey owner. Only a real, set name is passed; if
      // it's null, Agbebi is told never to guess it.
      motherName: active.role === "MOTHER" ? null : active.journey.owner.name,
    });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const models = modelChain("default");
      let started = false;
      let lastErr: unknown = null;

      // Walk the model chain: if a model id is misconfigured (404 / not_found),
      // fall through to a known-good model so the user still gets a reply.
      // Once tokens have started streaming we never switch — no double output.
      for (const model of models) {
        try {
          const anthropicStream = anthropic.messages.stream({
            model,
            max_tokens: 1024,
            system,
            messages,
          });

          anthropicStream.on("text", (text) => {
            started = true;
            controller.enqueue(encoder.encode(text));
          });

          await anthropicStream.finalMessage();
          lastErr = null;
          break;
        } catch (err) {
          lastErr = err;
          if (started || !isModelError(err)) break;
          // else: try the next model in the chain
        }
      }

      if (lastErr && !started) {
        const message =
          lastErr instanceof Error ? lastErr.message : "Agbebi is unavailable right now.";
        controller.enqueue(
          encoder.encode(`\n\n[Agbebi could not respond: ${message}]`),
        );
      }
      controller.close();
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
