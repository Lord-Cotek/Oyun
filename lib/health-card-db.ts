import { prisma } from "@/lib/prisma";
import { computePosition, gestationLabel } from "@/lib/stage";
import { EMPTY_HEALTH, healthHints, type HealthFields, type HealthHint } from "@/lib/health-card";

export type HealthPerson = {
  /** "me", "mother", "partner" or a child's id — what the editor saves against. */
  target: string;
  kind: "mother" | "partner" | "child";
  name: string;
  /** "Mother", "Partner", or the child's age. */
  sub: string;
  fields: HealthFields;
  saved: boolean;
  /** Each adult writes their own card; either parent writes a child's. */
  canEdit: boolean;
  /** Their card from an earlier journey, offered when this one is empty. */
  prefill: HealthFields | null;
  updatedAt: Date | null;
};

const pick = (r: HealthFields): HealthFields => ({
  bloodGroup: r.bloodGroup,
  genotype: r.genotype,
  allergies: r.allergies,
  conditions: r.conditions,
  medicines: r.medicines,
  careProvider: r.careProvider,
  emergencyContact: r.emergencyContact,
  notes: r.notes,
});

function ageOf(birth: Date | null, now = new Date()): string {
  if (!birth) return "Child";
  const days = Math.floor((now.getTime() - birth.getTime()) / 86_400_000);
  if (days < 0) return "Child";
  if (days < 14) return `${days} day${days === 1 ? "" : "s"} old`;
  if (days < 61) return `${Math.floor(days / 7)} weeks old`;
  const months = Math.floor(days / 30.44);
  if (months < 24) return `${months} months old`;
  return `${Math.floor(months / 12)} years old`;
}

/**
 * Everyone's card in this journey, in the order a hurried reader wants them:
 * the mother, her partner, then the children by age. Only ever called for the
 * mother or her partner — the page and the actions check that first.
 */
export async function loadHealthCards(journeyId: string, viewerId: string) {
  const journey = await prisma.journey.findUnique({
    where: { id: journeyId },
    select: {
      dueDate: true,
      status: true,
      completedAt: true,
      memberships: {
        where: { role: { in: ["MOTHER", "PARTNER"] } },
        orderBy: { createdAt: "asc" },
        select: { role: true, userId: true, user: { select: { name: true, email: true } } },
      },
      children: { orderBy: [{ birthDate: "asc" }, { createdAt: "asc" }], select: { id: true, name: true, birthDate: true } },
      healthRecords: true,
    },
  });
  if (!journey) return null;

  const byUser = new Map(journey.healthRecords.filter((r) => r.userId).map((r) => [r.userId!, r]));
  const byChild = new Map(journey.healthRecords.filter((r) => r.childId).map((r) => [r.childId!, r]));

  // The viewer's card from another journey — a second pregnancy should not
  // mean typing her blood group in again.
  const mine = byUser.get(viewerId);
  const earlier = mine
    ? null
    : await prisma.healthRecord.findFirst({
        where: { userId: viewerId, journeyId: { not: journeyId } },
        orderBy: { updatedAt: "desc" },
      });

  const people: HealthPerson[] = [];
  for (const m of journey.memberships) {
    const r = byUser.get(m.userId);
    const isMe = m.userId === viewerId;
    people.push({
      target: isMe ? "me" : m.role === "MOTHER" ? "mother" : "partner",
      kind: m.role === "MOTHER" ? "mother" : "partner",
      name: m.user.name?.trim() || m.user.email || (m.role === "MOTHER" ? "Mother" : "Partner"),
      sub: m.role === "MOTHER" ? "Mother" : "Partner",
      fields: r ? pick(r) : { ...EMPTY_HEALTH },
      saved: !!r,
      canEdit: isMe,
      prefill: isMe && earlier ? pick(earlier) : null,
      updatedAt: r?.updatedAt ?? null,
    });
  }
  for (const c of journey.children) {
    const r = byChild.get(c.id);
    people.push({
      target: c.id,
      kind: "child",
      name: c.name,
      sub: ageOf(c.birthDate),
      fields: r ? pick(r) : { ...EMPTY_HEALTH },
      saved: !!r,
      canEdit: true,
      prefill: null,
      updatedAt: r?.updatedAt ?? null,
    });
  }

  const mother = people.find((p) => p.kind === "mother")?.fields ?? null;
  const partner = people.find((p) => p.kind === "partner")?.fields ?? null;
  const pos = computePosition(journey.dueDate);
  const active = journey.status === "ACTIVE" && !journey.completedAt;
  // The rhesus note matters while she is expecting and for the weeks after.
  const pregnancyRelevant = active && (!pos.born || (pos.month ?? 0) < 3);
  const hints: HealthHint[] = healthHints({ mother, partner, pregnancyRelevant });

  const pregnancy =
    active && !pos.born && pos.week
      ? { dueDate: journey.dueDate, week: pos.week, dayInWeek: pos.dayInWeek ?? 0, label: gestationLabel(pos.week, pos.dayInWeek ?? 0) }
      : null;

  return { people, hints, pregnancy };
}
