import { prisma } from "@/lib/prisma";
import { prayingScope } from "@/lib/praying-scope";
import { prayerLine, stillThanking, tonight, type PrayingForView } from "@/lib/praying-for";

type Scope = NonNullable<Awaited<ReturnType<typeof prayingScope>>>;

/**
 * The list as this person may see it, and what worship names tonight.
 * Those who keep it see every name; anyone else only the names shared with
 * the circle, and nothing of who added them.
 *
 * Shared with the sibling app and drift-checked.
 */
export async function loadPrayingFor(scope: Scope, now = new Date()) {
  const rows = await prisma.prayingFor.findMany({
    where: { ...scope.owner, ...(scope.canKeep ? {} : { withCircle: true }) },
    orderBy: { createdAt: "asc" },
    take: 300,
  });
  const authors = await prisma.user.findMany({
    where: { id: { in: Array.from(new Set(rows.map((r) => r.addedById))) } },
    select: { id: true, name: true },
  });
  const nameOf = new Map(authors.map((a) => [a.id, a.name?.trim().split(/\s+/)[0] || "Someone"]));

  const views: PrayingForView[] = rows.map((r) => ({
    id: r.id,
    name: r.name,
    request: r.request,
    withCircle: r.withCircle,
    mine: r.addedById === scope.userId,
    addedBy: r.addedById === scope.userId ? "you" : nameOf.get(r.addedById) ?? "Someone",
    since: r.createdAt.toISOString(),
    answeredAt: r.answeredAt?.toISOString() ?? null,
    answerNote: r.answerNote,
    stoppedAt: r.stoppedAt?.toISOString() ?? null,
  }));

  const praying = rows.filter((r) => !r.answeredAt && !r.stoppedAt);
  const thanks = rows.filter((r) => !r.stoppedAt && stillThanking(r.answeredAt, now));
  return {
    views,
    tonightLines: tonight(praying, undefined, now).map(prayerLine),
    thanksLines: thanks.map((r) => prayerLine({ name: r.name, request: r.answerNote ?? r.request })),
    total: praying.length,
  };
}
