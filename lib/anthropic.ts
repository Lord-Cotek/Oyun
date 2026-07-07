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
 */
export const MODELS = {
  default: process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-6",
  cheap: "claude-haiku-4-5-20251001",
  hard: "claude-opus-4-8",
} as const;

export type ModelTier = keyof typeof MODELS;

export function modelFor(tier: ModelTier = "default"): string {
  return MODELS[tier];
}
