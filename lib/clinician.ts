import { prisma } from "@/lib/prisma";

/**
 * Doctors and midwives in Oyun.
 *
 * ── What a clinician is here ─────────────────────────────────────────────
 * Not a role in a journey. A partner, a grandmother and a friend are members
 * of a family's circle; a doctor is not, and must never be shown a family's
 * diary, letters, mood or prayers by accident of sharing a table with them.
 * So a clinician has an account of their own (Clinician), a room of their
 * own (/doctor), and a short code they give to patients.
 *
 * ── How a patient shares ─────────────────────────────────────────────────
 * Only the mother, from her own account, by typing her doctor's code and
 * agreeing to a plain list of what will be shared (ClinicianLink). Never the
 * other way round: a doctor cannot ask for a patient by name, cannot see who
 * else uses Oyun, and cannot add anybody. Either side can end it at any time,
 * and it ends at once.
 *
 * ── What is shared ───────────────────────────────────────────────────────
 *   always    the health log (readings, symptoms, notes), medicines and the
 *             doses taken, tests and vaccines, her stage and due date —
 *             the same things the doctor's report already holds
 *   unless    photographs attached to readings and tests (withPhotos), and
 *   she says  appointments and scans with what came of them (withAppointments)
 *   only if   a Life post she has chosen, one by one (Post.forDoctorAt)
 *   she picks
 *   never     letters, the journal, her moods, the circle, requests for prayer
 *             or support, the registry — anything that is not clinical
 *
 * ── What it is not ───────────────────────────────────────────────────────
 * Not monitoring. Nothing here alerts a doctor in real time, and Oyun says so
 * to both of them: a high reading still tells her, on her own screen, to call
 * her maternity unit. A doctor opening the records when they choose is a
 * convenience for an appointment, not a promise of being watched over.
 *
 * Every opening is recorded (ClinicianView) and shown to the patient.
 */

/** No 0/O, 1/I/L — read aloud across a consulting room without a mistake. */
const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

function randomCode(): string {
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  const c = Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join("");
  return `${c.slice(0, 3)}-${c.slice(3)}`;
}

/** A fresh, unused clinic code. */
export async function newClinicCode(): Promise<string> {
  for (let i = 0; i < 12; i++) {
    const code = randomCode();
    const taken = await prisma.clinician.findUnique({ where: { code }, select: { id: true } });
    if (!taken) return code;
  }
  throw new Error("Could not find a free clinic code");
}

/**
 * What a patient typed, as a code — or null. Forgiving of the ways people
 * type a code off a card: lower case, spaces, a missing or extra dash.
 */
export function normaliseCode(raw: string): string | null {
  const s = String(raw ?? "").toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (s.length !== 6 || ![...s].every((ch) => ALPHABET.includes(ch))) return null;
  return `${s.slice(0, 3)}-${s.slice(3)}`;
}

/** The clinician account behind this person, if they keep one. */
export async function clinicianOf(userId: string) {
  return prisma.clinician.findUnique({ where: { userId } });
}

/** How a clinician is introduced to a patient: "Dr Okafor · Midwife · St Mary's". */
export function clinicianLine(c: { displayName: string; title: string | null; practice: string | null }): string {
  return [c.displayName, c.title, c.practice].filter((x) => x && x.trim()).join(" · ");
}

/**
 * A clinician's access to one patient — the single gate every doctor page,
 * action and file route asks first. Null unless this person keeps the
 * clinician account the link was made with, and the link has not ended.
 */
export async function clinicianAccess(userId: string, linkId: string) {
  const link = await prisma.clinicianLink.findUnique({
    where: { id: String(linkId).slice(0, 64) },
    include: {
      clinician: true,
      journey: { select: { id: true, dueDate: true, babyCount: true, status: true, babyName: true, ownerId: true, owner: { select: { name: true, email: true } } } },
    },
  });
  if (!link || link.endedAt || link.clinician.userId !== userId) return null;
  return link;
}

/** The doctors a journey is being shared with now. */
export async function liveLinksForJourney(journeyId: string) {
  return prisma.clinicianLink.findMany({
    where: { journeyId, endedAt: null },
    include: { clinician: { select: { displayName: true, title: true, practice: true, code: true, userId: true } } },
    orderBy: { createdAt: "asc" },
  });
}

/** Clean a free-text field from a form: trimmed, bounded, null when empty. */
export function cleanField(v: unknown, max: number): string | null {
  const s = String(v ?? "").trim().replace(/\s+/g, " ").slice(0, max);
  return s ? s : null;
}
