import { prisma } from "@/lib/prisma";

/**
 * Switches that can be thrown without a deploy.
 *
 * ── Why the keys live here and not in the database ───────────────────────
 * Because the way free-form flags fail is a typo. Somebody adds
 * "new-registry" in the admin centre while the code asks for "new_registry";
 * the flag reads as off for ever; the feature is silently dead and there is
 * no error anywhere to find. So the flags that exist are declared here, the
 * centre can only move these, and a key the code does not know about cannot
 * be created at all.
 *
 * ── Why each one declares a default ──────────────────────────────────────
 * So that a fresh database behaves like an old one. A flag with nothing
 * stored against it is not "off" — it is whatever this file says it is, which
 * means a new deployment, a restored backup and a developer's laptop all do
 * the same thing on the first request.
 *
 * ── Why they fail ON, not off, when the database is unreachable ──────────
 * A flag is for turning something on early or off in a hurry, not for
 * guarding anything dangerous. If the read throws, the honest answer is the
 * declared default rather than a blank screen where a feature used to be.
 */

export interface FlagSpec {
  key: string;
  /** What an operator sees. Written for somebody who was not here in March. */
  label: string;
  /** What actually changes, in one sentence. */
  what: string;
  /** What happens when nothing is stored. */
  fallback: boolean;
}

/**
 * Every flag this app has.
 *
 * Adding one is a code change on purpose: a flag is a branch that somebody
 * has to delete later, and a list you can see the whole of is the only thing
 * that makes that deletion happen.
 */
export const FLAGS: FlagSpec[] = [
  {
    key: "weekly-digest",
    label: "The weekly email",
    what: "Sends the Saturday summary. Turn it off to stop the next one going out without waiting for a deploy.",
    fallback: true,
  },
  {
    key: "link-preview",
    label: "Reading a shop link",
    what: "Fetches the name, picture and price when somebody pastes a shop link into the registry. Turn it off if a retailer starts refusing us and the wait becomes the problem.",
    fallback: true,
  },
  {
    key: "concerns",
    label: "Raising a concern",
    what: "Shows the way to write to us from Settings. Turn it off only if the queue is being flooded.",
    fallback: true,
  },
];

export function flagSpec(key: string): FlagSpec | undefined {
  return FLAGS.find((f) => f.key === key);
}

/**
 * Is this on?
 *
 * Unknown keys return false and say so loudly in the log — that is the typo
 * case, and it should be findable rather than silent.
 */
export async function isOn(key: string): Promise<boolean> {
  const spec = flagSpec(key);
  if (!spec) {
    console.error(`[flags] asked about "${key}", which is not a declared flag`);
    return false;
  }
  try {
    const row = await prisma.featureFlag.findUnique({
      where: { key },
      select: { on: true },
    });
    return row ? row.on : spec.fallback;
  } catch {
    return spec.fallback;
  }
}

/** Every flag with its current state, for the admin centre. */
export async function allFlags(): Promise<
  (FlagSpec & { on: boolean; stored: boolean; changedBy: string | null; changedAt: Date | null })[]
> {
  const rows = await prisma.featureFlag.findMany({
    select: { key: true, on: true, changedBy: true, changedAt: true },
  });
  const by = new Map(rows.map((r) => [r.key, r]));
  return FLAGS.map((f) => {
    const row = by.get(f.key);
    return {
      ...f,
      on: row ? row.on : f.fallback,
      stored: !!row,
      changedBy: row?.changedBy ?? null,
      changedAt: row?.changedAt ?? null,
    };
  });
}
