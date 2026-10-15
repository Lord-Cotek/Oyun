"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { audit, requireUnlockedAdmin } from "@/lib/admin";
import { flagSpec } from "@/lib/flags";

type Result = { ok: true; said: string } | { ok: false; error: string };

/**
 * Throw a switch.
 *
 * ── Why an unknown key is refused rather than created ────────────────────
 * Because a flag the code never asks about is not a flag, it is a row that
 * makes somebody think they have turned something off. The declared list in
 * lib/flags.ts is the only thing that can be moved from here, so a key that
 * does not match the code cannot come into existence.
 */
export async function setFlag(key: string, on: boolean): Promise<Result> {
  const admin = await requireUnlockedAdmin();
  const spec = flagSpec(key);
  if (!spec) {
    await audit(admin.email, "tried to move a flag", key, "no such flag");
    return { ok: false, error: "That is not a flag this app has." };
  }

  await prisma.featureFlag.upsert({
    where: { key },
    update: { on, changedBy: admin.email },
    create: { key, on, changedBy: admin.email },
  });

  await audit(
    admin.email,
    on ? "turned a flag on" : "turned a flag off",
    key,
    spec.label,
  );
  revalidatePath("/admintc/flags");
  revalidatePath("/admintc/audit");
  return {
    ok: true,
    said: `${spec.label} is now ${on ? "on" : "off"}. It takes effect on the next page load.`,
  };
}
