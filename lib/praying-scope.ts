import { auth } from "@/lib/auth";
import { getActiveMembership } from "@/lib/data";
import { isHousehold } from "@/lib/roles";

/**
 * Whose prayer list, and who may keep it: the journey, kept by the mother
 * and her partner. The circle reads only the names shared with them. The
 * sibling app answers the same question for a house — see
 * lib/praying-for-db.ts, which is shared and asks this.
 */
export async function prayingScope() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return null;
  const active = await getActiveMembership(userId);
  if (!active) return null;
  return { userId, canKeep: isHousehold(active.role), owner: { journeyId: active.journey.id } };
}
