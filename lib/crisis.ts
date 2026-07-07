/**
 * Lightweight keyword tripwires for medical-emergency and pregnancy-loss
 * language. This is a UI safety net — never the only one; Agbebi's system
 * prompt also refuses to act as a doctor. When tripped, the chat surfaces a
 * calm, non-dismissive banner pointing to the user's care provider.
 */

const EMERGENCY_PATTERNS: RegExp[] = [
  /\b(heavy|severe|lots of|won'?t stop) bleed/i,
  /\bbleeding (a lot|heavily|badly)\b/i,
  /\b(severe|intense|unbearable|sharp) (pain|cramp)/i,
  /\bcan'?t feel (the )?(baby|kicks?|movement)/i,
  /\b(reduced|less|no) (fetal )?(movement|kicks?)\b/i,
  /\bwater(s)? broke\b/i,
  /\b(blurr?ed|blurry|double) vision\b/i,
  /\bsevere headache\b/i,
  /\bfever\b/i,
  /\bcontractions\b/i,
  /\bfaint(ed|ing)?\b/i,
  /\bcan'?t breathe\b/i,
];

const LOSS_PATTERNS: RegExp[] = [
  /\bmiscarr(y|ied|iage|ying)\b/i,
  /\bstill\s?birth\b/i,
  /\blost (the|my|our) baby\b/i,
  /\bno heartbeat\b/i,
  /\bbaby (has )?died\b/i,
  /\bpregnancy loss\b/i,
];

export type CrisisKind = "emergency" | "loss" | null;

export function detectCrisis(text: string): CrisisKind {
  if (LOSS_PATTERNS.some((r) => r.test(text))) return "loss";
  if (EMERGENCY_PATTERNS.some((r) => r.test(text))) return "emergency";
  return null;
}
