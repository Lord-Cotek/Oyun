import { prisma } from "@/lib/prisma";
import { cleanUnits, readTargets, type Targets, type Units } from "@/lib/health-log";

/**
 * Who may open a journey's health log — the one question every page, action
 * and file route asks first.
 *
 * The rule: the mother, always; her partner, unless she has kept the log to
 * herself. Nobody else in the journey — not the circle, not an accountability
 * partner — ever, whatever they type into the address bar. Asked per journey
 * rather than "of the active journey", because a file or a reading is looked
 * up by its own id and must be checked against the journey it belongs to.
 */
export type LogAccess = {
  journeyId: string;
  userId: string;
  role: "MOTHER" | "PARTNER";
  isMother: boolean;
  audience: "HOUSEHOLD" | "MOTHER";
  units: Units;
  targets: Targets;
  customTargets: Set<string>;
  template: "INTL" | "NG";
  conditions: string[];
  /** Reading reminder times she chose ("07:00"). */
  checkTimes: string[];
  /** The viewer's own time zone, for grouping readings into their days. */
  timeZone: string;
  dueDate: Date;
  motherName: string;
  journeyActive: boolean;
};

export async function logAccess(userId: string, journeyId: string): Promise<LogAccess | null> {
  const m = await prisma.membership.findUnique({
    where: { journeyId_userId: { journeyId, userId } },
    select: {
      role: true,
      user: { select: { timeZone: true } },
      journey: {
        select: {
          dueDate: true,
          status: true,
          owner: { select: { name: true } },
          healthLog: true,
        },
      },
    },
  });
  if (!m || (m.role !== "MOTHER" && m.role !== "PARTNER")) return null;
  const s = m.journey.healthLog;
  const audience = s?.audience === "MOTHER" ? "MOTHER" : "HOUSEHOLD";
  if (audience === "MOTHER" && m.role !== "MOTHER") return null;
  const { targets, custom } = readTargets(s?.targets);
  return {
    journeyId,
    userId,
    role: m.role,
    isMother: m.role === "MOTHER",
    audience,
    units: cleanUnits(s),
    targets,
    customTargets: custom,
    template: s?.template === "NG" ? "NG" : "INTL",
    conditions: s?.conditions ?? [],
    checkTimes: s?.checkTimes ?? [],
    timeZone: m.user.timeZone || "UTC",
    dueDate: m.journey.dueDate,
    motherName: m.journey.owner.name?.trim() || "Mum",
    journeyActive: m.journey.status === "ACTIVE",
  };
}

/**
 * Whether the partner is being kept out — said on his screen in her words,
 * rather than the log simply vanishing for him.
 */
export async function keptToMother(journeyId: string): Promise<boolean> {
  const s = await prisma.healthLogSettings.findUnique({ where: { journeyId }, select: { audience: true } });
  return s?.audience === "MOTHER";
}

/** Files attached to entries, grouped by entry id. Ids only — never the storage address. */
export async function filesFor(entryType: string, ids: string[]) {
  if (ids.length === 0) return new Map<string, { id: string; contentType: string }[]>();
  const rows = await prisma.healthFile.findMany({
    where: { entryType, entryId: { in: ids } },
    orderBy: { createdAt: "asc" },
    select: { id: true, entryId: true, contentType: true },
  });
  const out = new Map<string, { id: string; contentType: string }[]>();
  for (const r of rows) {
    const list = out.get(r.entryId!) ?? [];
    list.push({ id: r.id, contentType: r.contentType });
    out.set(r.entryId!, list);
  }
  return out;
}

/**
 * Attach freshly uploaded files to an entry. Only files this journey owns,
 * uploaded by this person, and not yet attached to anything else — so a
 * crafted form cannot move somebody else's photograph onto a reading.
 */
export async function attachFiles(journeyId: string, userId: string, entryType: string, entryId: string, fileIds: string[]) {
  const ids = [...new Set(fileIds.filter((x) => typeof x === "string"))].slice(0, 12);
  if (ids.length === 0) return;
  await prisma.healthFile.updateMany({
    where: { id: { in: ids }, journeyId, uploadedById: userId, entryId: null },
    data: { entryType, entryId },
  });
}

/** Take files off an entry and out of storage. */
export async function deleteFiles(where: { journeyId: string; ids?: string[]; entryType?: string; entryId?: string }) {
  const rows = await prisma.healthFile.findMany({
    where: {
      journeyId: where.journeyId,
      ...(where.ids ? { id: { in: where.ids } } : {}),
      ...(where.entryType ? { entryType: where.entryType, entryId: where.entryId } : {}),
    },
    select: { id: true, url: true },
  });
  if (rows.length === 0) return 0;
  await removeFromStorage(rows.map((r) => r.url));
  await prisma.healthFile.deleteMany({ where: { id: { in: rows.map((r) => r.id) } } });
  return rows.length;
}

/** Best effort: a file the store has already lost is not a reason to keep its row. */
export async function removeFromStorage(urls: string[]) {
  if (!urls.length || !process.env.BLOB_READ_WRITE_TOKEN) return;
  try {
    const { del } = await import("@vercel/blob");
    await del(urls);
  } catch {
    // Storage hiccup: the row goes anyway; the address was never public.
  }
}
