/**
 * A birth announcement: what it holds, how each field is checked, and how it
 * reads as a Life post. Pure — no database — so the editor's live preview,
 * the server and the public page all use exactly the same rules.
 */

export type NameMeaning = { name: string; meaning: string };
export type Baby = { fullName: string; names: NameMeaning[] };

export const STYLES = {
  dawn: { label: "Dawn", paper: "#f8f2e7", edge: "#ecdfc8", ink: "#2b2219", soft: "#6e5f4d", accent: "#a8701f", accent2: "#c27f77" },
  garden: { label: "Garden", paper: "#eef1e7", edge: "#d9e2cd", ink: "#1f2a21", soft: "#55634f", accent: "#557447", accent2: "#a77a4c" },
  night: { label: "Night", paper: "#1c2034", edge: "#2c3150", ink: "#f3ecdd", soft: "#b9b2a4", accent: "#e8b964", accent2: "#d9a0a6" },
} as const;
export type StyleKey = keyof typeof STYLES;

/** The verses offered, quoted exactly — the scripture check reads this file. */
export const BIRTH_VERSES = [
  { ref: "Psalm 139:14", text: "I will give thanks to you, for I am fearfully and wonderfully made." },
  { ref: "Psalm 127:3", text: "Behold, children are a heritage of the Lord. The fruit of the womb is his reward." },
  { ref: "1 Samuel 1:27", text: "I prayed for this child, and the LORD has given me my petition which I asked of him." },
  { ref: "Jeremiah 1:5", text: "Before I formed you in the womb, I knew you." },
  { ref: "Numbers 6:24", text: "The Lord bless you, and keep you." },
] as const;

export const MAX_BABIES = 4;
export const MAX_NAMES = 8;
export const MAX_PHOTOS_ANN = 6;

export type AnnouncementData = {
  babies: Baby[];
  /** yyyy-mm-dd */
  bornOn: string;
  timeOfBirth: string | null;
  weight: string | null;
  place: string | null;
  message: string | null;
  signedAs: string | null;
  verseRef: string | null;
  photoUrls: string[];
  style: StyleKey;
};

const text = (v: unknown, max: number): string | null => {
  const s = typeof v === "string" ? v.replace(/\s+/g, " ").trim().slice(0, max) : "";
  return s || null;
};

/** Paragraphs kept, runs of blank lines folded, within its limit. */
const prose = (v: unknown, max: number): string | null => {
  const s = typeof v === "string" ? v.replace(/\r/g, "").replace(/\n{3,}/g, "\n\n").trim().slice(0, max) : "";
  return s || null;
};

export function isBlobPhoto(u: unknown): u is string {
  if (typeof u !== "string" || u.length > 500) return false;
  try {
    const url = new URL(u);
    return url.protocol === "https:" && url.hostname.endsWith(".blob.vercel-storage.com");
  } catch {
    return false;
  }
}

/** Every field checked on the way in. The error is in words for the parent. */
export function cleanAnnouncement(raw: unknown): { ok: true; data: AnnouncementData } | { ok: false; error: string } {
  const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const babies: Baby[] = (Array.isArray(r.babies) ? r.babies : []).slice(0, MAX_BABIES).flatMap((b) => {
    const o = (b && typeof b === "object" ? b : {}) as Record<string, unknown>;
    const fullName = text(o.fullName, 90);
    if (!fullName) return [];
    const names = (Array.isArray(o.names) ? o.names : []).slice(0, MAX_NAMES).flatMap((n) => {
      const m = (n && typeof n === "object" ? n : {}) as Record<string, unknown>;
      const name = text(m.name, 40);
      return name ? [{ name, meaning: text(m.meaning, 140) ?? "" }] : [];
    });
    return [{ fullName, names }];
  });
  if (babies.length === 0) return { ok: false, error: "Add your little one's name." };

  const bornOn = typeof r.bornOn === "string" && /^\d{4}-\d{2}-\d{2}$/.test(r.bornOn) ? r.bornOn : "";
  const day = bornOn ? new Date(`${bornOn}T00:00:00Z`) : null;
  if (!day || Number.isNaN(day.getTime()) || day.getTime() > Date.now() + 86_400_000) {
    return { ok: false, error: "The birthday needs to be a real date, not in the future." };
  }
  const time = typeof r.timeOfBirth === "string" && /^([01]\d|2[0-3]):[0-5]\d$/.test(r.timeOfBirth) ? r.timeOfBirth : null;
  const verse = BIRTH_VERSES.find((v) => v.ref === r.verseRef);
  const style = (typeof r.style === "string" && r.style in STYLES ? r.style : "dawn") as StyleKey;
  const photoUrls = (Array.isArray(r.photoUrls) ? r.photoUrls : []).filter(isBlobPhoto).slice(0, MAX_PHOTOS_ANN);

  return {
    ok: true,
    data: {
      babies,
      bornOn,
      timeOfBirth: time,
      weight: text(r.weight, 24),
      place: text(r.place, 60),
      message: prose(r.message, 1200),
      signedAs: text(r.signedAs, 60),
      verseRef: verse?.ref ?? null,
      photoUrls,
      style,
    },
  };
}

export function verseFor(ref: string | null): { ref: string; text: string } | null {
  return BIRTH_VERSES.find((v) => v.ref === ref) ?? null;
}

/** "14 November 2026" — a birthday is a date in the family's calendar, not a moment in UTC. */
export function longDate(ymd: string): string {
  const d = new Date(`${ymd}T00:00:00Z`);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}

/** "Ayọ̀mídé" or "Ada & Tobi" — the heading names. */
export function headingNames(babies: Baby[]): string {
  return babies.map((b) => b.fullName).join(" & ");
}

/** The words the Life post carries, so the circle reads the same announcement. */
export function lifeBody(d: AnnouncementData): string {
  const verse = verseFor(d.verseRef);
  const details = [
    `Born ${longDate(d.bornOn)}${d.timeOfBirth ? ` at ${d.timeOfBirth}` : ""}`,
    d.weight,
    d.place,
  ].filter(Boolean);
  const meanings = d.babies
    .flatMap((b) => b.names.filter((n) => n.meaning).map((n) => `${n.name} — ${n.meaning}`))
    .join("\n");
  return [
    `Welcome to the world, ${headingNames(d.babies)}! 💛`,
    meanings || null,
    details.join(" · "),
    verse ? `“${verse.text}” — ${verse.ref}` : null,
    d.message,
    d.signedAs ? `— ${d.signedAs}` : null,
  ]
    .filter(Boolean)
    .join("\n\n")
    .slice(0, 4000);
}
