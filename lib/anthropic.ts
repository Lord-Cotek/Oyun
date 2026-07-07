import Anthropic from "@anthropic-ai/sdk";

// Server-only. Import this module solely inside route handlers.
if (typeof window !== "undefined") {
  throw new Error("lib/anthropic must never be imported in the browser.");
}

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * Cost-aware model choice is a first-class COTEK concern.
 * Default to Sonnet; drop to Haiku for routine/cheap calls; reserve Opus
 * for genuinely hard reasoning. Override via ANTHROPIC_MODEL or per-call.
 *
 * `default` reads ANTHROPIC_MODEL if set, but only when it looks like a real
 * model id — otherwise we fall back to a known-good current model so a stray
 * or stale env value can never take Agbebi offline.
 */
const SAFE_DEFAULT = "claude-sonnet-5";
const KNOWN_GOOD_FALLBACK = "claude-haiku-4-5-20251001";

function resolveDefault(): string {
  const fromEnv = process.env.ANTHROPIC_MODEL?.trim();
  // Accept only plausible Anthropic model ids; ignore anything else.
  if (fromEnv && /^claude-[a-z0-9.-]+$/i.test(fromEnv)) return fromEnv;
  return SAFE_DEFAULT;
}

export const MODELS = {
  default: resolveDefault(),
  cheap: KNOWN_GOOD_FALLBACK,
  hard: "claude-opus-4-8",
} as const;

export type ModelTier = keyof typeof MODELS;

export function modelFor(tier: ModelTier = "default"): string {
  return MODELS[tier];
}

/**
 * An ordered list of models to try. If the configured default is misconfigured
 * (e.g. a non-existent id returns a 404 / not_found error), callers can fall
 * through to a model that is known to exist so the user still gets a reply.
 */
export function modelChain(tier: ModelTier = "default"): string[] {
  const chain = [modelFor(tier), SAFE_DEFAULT, KNOWN_GOOD_FALLBACK];
  return Array.from(new Set(chain));
}

/** True when an error looks like "this model id doesn't exist / isn't allowed". */
export function isModelError(err: unknown): boolean {
  const status = (err as { status?: number })?.status;
  const msg = (err as { message?: string })?.message?.toLowerCase() ?? "";
  return (
    status === 404 ||
    msg.includes("not_found") ||
    msg.includes("model") && (msg.includes("does not exist") || msg.includes("not found"))
  );
}
