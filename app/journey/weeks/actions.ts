"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getActiveMembership } from "@/lib/data";
import { isHousehold } from "@/lib/roles";
import { TONE_KEYS, type ToneKey } from "@/lib/growth-scene";

/**
 * The baby's skin tone in the growth pictures. The household's to choose —
 * the same pictures are what everybody in the journey sees.
 */
export async function setSkinTone(tone: string): Promise<{ ok: boolean }> {
  const session = await auth();
  if (!session?.user?.id) return { ok: false };
  const active = await getActiveMembership(session.user.id);
  if (!active || !isHousehold(active.role)) return { ok: false };
  if (!TONE_KEYS.includes(tone as ToneKey)) return { ok: false };
  await prisma.journey.update({ where: { id: active.journey.id }, data: { skinTone: tone } });
  revalidatePath("/journey");
  revalidatePath("/journey/weeks");
  return { ok: true };
}
