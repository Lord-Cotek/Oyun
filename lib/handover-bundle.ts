import { createHash, timingSafeEqual } from "node:crypto";

/**
 * What crosses from Oyun to Ìdílé when a family moves on — the shape, the
 * checks on it, and the handshake between the two apps.
 *
 * Shared with the sibling app and drift-checked: both sides must agree on
 * every field, and the side that receives it must check every field, because
 * a bundle is only ever as trustworthy as the checks made on arrival.
 *
 * ── How it travels ───────────────────────────────────────────────────────
 * The mother makes a pass in Oyun. Her link to Ìdílé carries only a random
 * token. Ìdílé, server to server, asks Oyun for the family behind it, with
 * HANDOVER_SECRET (set to the same value in both apps). Nothing about the
 * children ever sits in a URL, a browser history or a log line.
 */

export const HANDOVER_VERSION = 1;
export const HANDOVER_TTL_DAYS = 7;

export type HandoverChild = {
  /** Oyun's id for the child, so firsts and letters can say whose they are. */
  ref: string;
  name: string;
  /** yyyy-mm-dd, or null when it was never recorded. */
  birthDate: string | null;
  sex: "boy" | "girl" | null;
};

export type HandoverFirst = {
  childRef: string | null;
  /** FIRST_STEPS, FIRST_WORD, or anything else — told apart by `label`. */
  kind: string;
  label: string;
  note: string | null;
  occurredAt: string;
  photoUrls: string[];
};

export type HandoverLetter = {
  childRef: string | null;
  body: string;
  writtenAt: string;
  /** yyyy-mm-dd it opens, or null if it is already open. */
  opensOn: string | null;
};

export type HandoverPerson = { name: string; email: string };
export type CircleRole = "FAMILY" | "FRIEND" | "MENTOR";

export type HandoverBundle = {
  v: number;
  /** The pass's own id — Ìdílé keys its "brought once" ledger on it. */
  id: string;
  /** The journey's id: the same family brought twice is caught by this. */
  journeyRef: string;
  /** The only address the family may be brought into Ìdílé under. */
  forEmail: string;
  fromName: string | null;
  children: HandoverChild[];
  partner: HandoverPerson | null;
  /** Oyun's ACCOUNTABILITY is Ìdílé's MENTOR; family and friends are the same in both. */
  circle: (HandoverPerson & { role: CircleRole })[];
  firsts: HandoverFirst[];
  letters: HandoverLetter[];
};

/** Only the hash of a pass is ever stored. */
export function hashPass(raw: string): string {
  return createHash("sha256").update(raw).digest("hex");
}

/** Is this request from the sibling app? Constant time, and never with no secret set. */
export function secretOk(authorization: string | null): boolean {
  const secret = process.env.HANDOVER_SECRET;
  if (!secret || secret.length < 16 || !authorization) return false;
  const want = Buffer.from(`Bearer ${secret}`);
  const got = Buffer.from(authorization);
  return want.length === got.length && timingSafeEqual(want, got);
}

/** Photos may only come from Vercel Blob — never an address of anyone's choosing. */
export function isBlobPhoto(url: unknown): url is string {
  if (typeof url !== "string" || url.length > 500) return false;
  try {
    const u = new URL(url);
    return u.protocol === "https:" && u.hostname.endsWith(".blob.vercel-storage.com");
  } catch {
    return false;
  }
}

const str = (v: unknown, max: number): string | null =>
  typeof v === "string" && v.trim() ? v.trim().slice(0, max) : null;

const day = (v: unknown): string | null => {
  if (typeof v !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(v)) return null;
  return Number.isNaN(new Date(`${v}T00:00:00Z`).getTime()) ? null : v;
};

const instant = (v: unknown): string | null => {
  if (typeof v !== "string") return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
};

const email = (v: unknown): string | null => {
  const s = str(v, 254)?.toLowerCase() ?? null;
  return s && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s) ? s : null;
};

/**
 * A bundle as received, checked field by field. Anything malformed is
 * dropped rather than trusted; a bundle with no pass id, no journey or no
 * address is refused outright.
 */
export function parseBundle(raw: unknown): HandoverBundle | null {
  if (!raw || typeof raw !== "object") return null;
  const b = raw as Record<string, unknown>;
  const id = str(b.id, 64);
  const journeyRef = str(b.journeyRef, 64);
  const forEmail = email(b.forEmail);
  if (b.v !== HANDOVER_VERSION || !id || !journeyRef || !forEmail) return null;

  const list = (v: unknown, max: number): Record<string, unknown>[] =>
    Array.isArray(v) ? (v.filter((x) => x && typeof x === "object").slice(0, max) as Record<string, unknown>[]) : [];

  const children: HandoverChild[] = list(b.children, 12).map((c, i) => ({
    ref: str(c.ref, 64) ?? `child-${i}`,
    name: str(c.name, 80) ?? "",
    birthDate: day(c.birthDate),
    sex: c.sex === "boy" || c.sex === "girl" ? c.sex : null,
  }));
  const refs = new Set(children.map((c) => c.ref));
  const childRef = (v: unknown) => {
    const r = str(v, 64);
    return r && refs.has(r) ? r : null;
  };

  const p = b.partner && typeof b.partner === "object" ? (b.partner as Record<string, unknown>) : null;
  const partnerEmail = p ? email(p.email) : null;

  return {
    v: HANDOVER_VERSION,
    id,
    journeyRef,
    forEmail,
    fromName: str(b.fromName, 80),
    children,
    partner: p && partnerEmail ? { name: str(p.name, 80) ?? partnerEmail, email: partnerEmail } : null,
    circle: list(b.circle, 60).flatMap((c) => {
      const e = email(c.email);
      return e ? [{ name: str(c.name, 80) ?? e, email: e, role: (c.role === "FRIEND" || c.role === "MENTOR" ? c.role : "FAMILY") as CircleRole }] : [];
    }),
    firsts: list(b.firsts, 300).flatMap((f) => {
      const at = instant(f.occurredAt);
      if (!at) return [];
      return [{
        childRef: childRef(f.childRef),
        kind: str(f.kind, 32) ?? "CUSTOM",
        label: str(f.label, 120) ?? "A first",
        note: str(f.note, 4000),
        occurredAt: at,
        photoUrls: (Array.isArray(f.photoUrls) ? f.photoUrls : []).filter(isBlobPhoto).slice(0, 12),
      }];
    }),
    letters: list(b.letters, 300).flatMap((l) => {
      const body = str(l.body, 20000);
      const at = instant(l.writtenAt);
      if (!body || !at) return [];
      return [{ childRef: childRef(l.childRef), body, writtenAt: at, opensOn: day(l.opensOn) }];
    }),
  };
}
