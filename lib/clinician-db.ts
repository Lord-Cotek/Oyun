import { prisma } from "@/lib/prisma";
import { asMother } from "@/lib/health-report";
import { readingsBetween } from "@/lib/health-log-view";
import { computePosition, gestationLabel } from "@/lib/stage";

/**
 * What a clinician's patient list shows about each patient — read-only, and
 * only for links that are live. See lib/clinician.ts for what is shared.
 *
 * The flags are counts of readings the log itself marked high or urgent
 * since this clinician last opened her records: a reason to look first, not
 * an alert. Nothing here is sent anywhere; it is computed when the doctor
 * opens the page.
 */
export async function patientList(clinicianId: string) {
  const links = await prisma.clinicianLink.findMany({
    where: { clinicianId, endedAt: null },
    orderBy: { createdAt: "desc" },
    include: {
      journey: { select: { id: true, dueDate: true, status: true, babyCount: true, owner: { select: { name: true, email: true } } } },
      views: { orderBy: { at: "desc" }, take: 1, select: { at: true } },
    },
  });
  const now = new Date();
  const fortnight = new Date(now.getTime() - 14 * 86_400_000);
  return Promise.all(
    links.map(async (l) => {
      const pos = computePosition(l.journey.dueDate, now);
      const lastViewed = l.views[0]?.at ?? null;
      const since = lastViewed && lastViewed > fortnight ? lastViewed : fortnight;
      let urgent = 0;
      let high = 0;
      let lastReading: string | null = null;
      try {
        const a = await asMother(l.journey.id);
        const recent = await readingsBetween(a, since, now);
        urgent = recent.filter((r) => r.level === "urgent").length;
        high = recent.filter((r) => r.level === "high").length;
        const latest = await prisma.healthReading.findFirst({
          where: { journeyId: l.journey.id },
          orderBy: { takenAt: "desc" },
          select: { takenAt: true },
        });
        lastReading = latest?.takenAt.toISOString() ?? null;
      } catch {
        // A journey whose log cannot be read shows its stage and nothing more.
      }
      return {
        linkId: l.id,
        name: l.journey.owner.name?.trim() || l.journey.owner.email || "Patient",
        stage: pos.born ? `Month ${pos.month} after birth` : gestationLabel(pos.week ?? 0, pos.dayInWeek ?? 0),
        dueDate: l.journey.dueDate.toISOString(),
        born: pos.born,
        loss: l.journey.status === "LOSS",
        babyCount: l.journey.babyCount,
        sharedSince: l.createdAt.toISOString(),
        lastViewed: lastViewed?.toISOString() ?? null,
        lastReading,
        urgent,
        high,
      };
    }),
  );
}
