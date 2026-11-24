/**
 * Getting ready for the birth: the hospital bag, and her birth preferences.
 *
 * ── The bag ──────────────────────────────────────────────────────────────
 * A checklist of what to pack: for her, for the baby, for whoever goes with
 * her, and the papers. Each family can add its own lines, because every
 * hospital asks for something different and some hand out a list of their
 * own. Ticking is the two of theirs to do. No brands, and nothing that is
 * true in only one country.
 *
 * ── The preferences ──────────────────────────────────────────────────────
 * One page she can show a midwife: who will be with her, how she would like
 * pain handled, what she hopes for straight after the birth, and what she
 * wants if a caesarean is needed. They are hers. Only she can change them.
 *
 * They are preferences, and the page says so at the top: a birth does not
 * always go the way anybody planned, and nothing here asks staff to do what
 * is unsafe. Every option is a wish about how things are done, never a
 * medical decision made in advance. There is no advice in it.
 *
 * ── The two kinds of reader (lib/voice.ts) ───────────────────────────────
 * • The bag's suggestions follow the reader: with faith, "your Bible, or the
 *   verses you want read to you" is on the list; without, it is not.
 * • In the preferences, "Culture, beliefs and family customs" is asked of
 *   everybody: it is a question every maternity unit asks. "Prayer in the
 *   room" is offered only to a mother who chose Oyun with faith.
 * • What she writes is hers. Once written, it is on her sheet for whoever
 *   she shows it to, exactly as she wrote it — the same rule as a post.
 *   A mother who later chooses Oyun without religious content keeps a line
 *   she already wrote, and can take it off; she is not offered a new one.
 *
 * No database and no imports that reach one.
 */
import { isGeneral } from "@/lib/voice";

// ── The hospital bag ────────────────────────────────────────────────────────

export interface BagItem {
  /** Stable, stored when ticked. Never reuse one. */
  key: string;
  label: string;
  note?: string;
}

export interface BagSection {
  key: string;
  title: string;
  blurb?: string;
  items: BagItem[];
}

export interface BagExtra {
  id: string;
  label: string;
  done: boolean;
}

export const BAG_EXTRA_MAX = 30;
export const BAG_LABEL_MAX = 80;

const BAG: BagSection[] = [
  {
    key: "papers",
    title: "Papers",
    blurb: "At the top of the bag, where a hand finds them first.",
    items: [
      { key: "p-notes", label: "Your maternity notes or antenatal card" },
      { key: "p-id", label: "Identity card, and any hospital, insurance or payment papers" },
      { key: "p-card", label: "Your health card from Oyun, printed", note: "Blood group, allergies and who to call, on one page." },
      { key: "p-prefs", label: "Your birth preferences, printed" },
      { key: "p-hospital-list", label: "Everything on the list your hospital gave you", note: "Some units ask families to bring delivery items. Ask yours what they provide." },
    ],
  },
  {
    key: "you",
    title: "For you",
    items: [
      { key: "y-labour-clothes", label: "Something loose and old to labour in" },
      { key: "y-nightwear", label: "Front-opening nightwear, two or three" },
      { key: "y-robe", label: "Light robe and slippers" },
      { key: "y-pads", label: "Maternity pads, two packs" },
      { key: "y-underwear", label: "Large, comfortable underwear, several pairs" },
      { key: "y-bras", label: "Nursing bras and breast pads" },
      { key: "y-toiletries", label: "Toiletries, a towel, lip balm and hair ties" },
      { key: "y-medicines", label: "Any medicines you take, in their boxes" },
      { key: "y-glasses", label: "Glasses, if you wear them" },
      { key: "y-phone", label: "Phone and a charger with a long lead" },
      { key: "y-snacks", label: "Snacks and drinks, and a water bottle with a straw" },
      { key: "y-pillow", label: "Your own pillow" },
      { key: "y-steady", label: "Music, or whatever steadies you" },
      { key: "y-home-clothes", label: "Loose clothes to go home in" },
    ],
  },
  {
    key: "baby",
    title: "For the baby",
    items: [
      { key: "b-sleepsuits", label: "Sleepsuits, three" },
      { key: "b-vests", label: "Vests or bodysuits, three" },
      { key: "b-hat", label: "A soft hat and socks" },
      { key: "b-blanket", label: "A blanket or shawl" },
      { key: "b-nappies", label: "Newborn nappies (diapers)" },
      { key: "b-wipes", label: "Cotton wool or wipes" },
      { key: "b-muslins", label: "Muslin cloths" },
      { key: "b-home-outfit", label: "A going-home outfit" },
      { key: "b-car-seat", label: "The car seat, fitted, if you are going home by car" },
    ],
  },
  {
    key: "companion",
    title: "For whoever goes with you",
    items: [
      { key: "c-snacks", label: "Food and water for a long day" },
      { key: "c-clothes", label: "A change of clothes" },
      { key: "c-charger", label: "Their own charger" },
      { key: "c-money", label: "Money for parking and small things" },
      { key: "c-people", label: "The list of people to tell" },
    ],
  },
];

const BAG_FAITH: BagItem = { key: "y-bible", label: "Your Bible, or the verses you want read to you" };

/** How many babies the three-of-everything lines are multiplied for. */
function forBabies(item: BagItem, n: number): BagItem {
  if (n <= 1) return item;
  const word: Record<string, string> = {
    "b-sleepsuits": `Sleepsuits, three for each baby`,
    "b-vests": `Vests or bodysuits, three for each baby`,
    "b-hat": `A soft hat and socks for each baby`,
    "b-blanket": `A blanket or shawl for each baby`,
    "b-home-outfit": `A going-home outfit for each baby`,
    "b-car-seat": `A car seat for each baby, fitted, if you are going home by car`,
  };
  return word[item.key] ? { ...item, label: word[item.key] } : item;
}

/** The suggested bag, in this reader's words. */
export function bagFor(voice: string | null | undefined, babyCount: number | null | undefined): BagSection[] {
  const n = Math.max(1, Math.trunc(babyCount ?? 1) || 1);
  return BAG.map((s) => {
    let items = s.items;
    if (s.key === "you" && !isGeneral(voice)) {
      const at = items.findIndex((i) => i.key === "y-steady");
      items = [...items.slice(0, at), BAG_FAITH, ...items.slice(at)];
    }
    return { ...s, items: items.map((i) => forBabies(i, n)) };
  });
}

/** Every key the bag can carry, in either voice. */
export const ALL_BAG_KEYS: Set<string> = new Set([...BAG.flatMap((s) => s.items.map((i) => i.key)), BAG_FAITH.key]);

/** Stored extras made safe. */
export function readBagExtras(raw: unknown): BagExtra[] {
  if (!Array.isArray(raw)) return [];
  const out: BagExtra[] = [];
  for (const x of raw) {
    if (!x || typeof x !== "object") continue;
    const r = x as Record<string, unknown>;
    const id = typeof r.id === "string" ? r.id.slice(0, 40) : "";
    const label = typeof r.label === "string" ? r.label.trim().slice(0, BAG_LABEL_MAX) : "";
    if (!id || !label) continue;
    out.push({ id, label, done: r.done === true });
    if (out.length >= BAG_EXTRA_MAX) break;
  }
  return out;
}

/** "12 of 34 packed", counting only what this reader is shown. */
export function bagProgress(sections: BagSection[], done: string[], extras: BagExtra[]): { packed: number; total: number } {
  const keys = sections.flatMap((s) => s.items.map((i) => i.key));
  return {
    packed: keys.filter((k) => done.includes(k)).length + extras.filter((e) => e.done).length,
    total: keys.length + extras.length,
  };
}

// ── Birth preferences ───────────────────────────────────────────────────────

export type PrefKind = "text" | "one" | "many";

export interface PrefField {
  key: string;
  kind: PrefKind;
  label: string;
  hint?: string;
  max?: number;
  options?: { key: string; label: string }[];
  /** Offered only to a mother who chose Oyun with faith. */
  faithOnly?: boolean;
}

export const PREF_FIELDS: PrefField[] = [
  { key: "companions", kind: "text", label: "Who will be with me", hint: "Their names, and who should be rung if they are not there.", max: 200 },
  {
    key: "room",
    kind: "many",
    label: "The room",
    options: [
      { key: "dim", label: "Low lighting, where possible" },
      { key: "quiet", label: "As quiet as it can be" },
      { key: "music", label: "My own music" },
      { key: "move", label: "Free to move and choose my position" },
      { key: "few", label: "As few people in the room as possible" },
      { key: "students", label: "Please ask before students are present" },
    ],
  },
  {
    key: "pain",
    kind: "one",
    label: "Pain relief",
    options: [
      { key: "without", label: "I would like to manage without, and will ask if I change my mind" },
      { key: "options", label: "I would like to hear my options as we go" },
      { key: "early", label: "I would like pain relief as soon as it is possible" },
      { key: "none", label: "No preference" },
    ],
  },
  { key: "painNote", kind: "text", label: "More about pain relief", hint: "Anything you would or would not like offered.", max: 300 },
  {
    key: "after",
    kind: "many",
    label: "Straight after the birth",
    options: [
      { key: "skin", label: "Skin-to-skin straight away, if we are both well" },
      { key: "cord-wait", label: "Wait before clamping the cord, if possible" },
      { key: "cord-partner", label: "My birth partner would like to cut the cord" },
      { key: "stay", label: "My baby to stay with me" },
      { key: "tell-sex", label: "Let us see for ourselves whether it is a boy or a girl" },
    ],
  },
  {
    key: "feeding",
    kind: "one",
    label: "Feeding",
    options: [
      { key: "breast", label: "I plan to breastfeed, and would like help to start" },
      { key: "bottle", label: "I plan to bottle feed" },
      { key: "both", label: "I plan to do both" },
      { key: "undecided", label: "I have not decided" },
    ],
  },
  {
    key: "caesarean",
    kind: "many",
    label: "If a caesarean is needed",
    options: [
      { key: "partner", label: "My birth partner with me" },
      { key: "screen", label: "The screen lowered so I can see my baby born" },
      { key: "skin", label: "Skin-to-skin in theatre, if possible" },
      { key: "tell", label: "Tell me what is happening as it happens" },
    ],
  },
  { key: "know", kind: "text", label: "What the staff should know about me", hint: "Allergies, fears, anything from a birth before.", max: 500 },
  { key: "customs", kind: "text", label: "Culture, beliefs and family customs", hint: "Anything about how you or the baby are to be cared for.", max: 300 },
  { key: "prayer", kind: "text", label: "Prayer in the room", hint: "Who will pray, and when: before, during, or over the baby afterwards.", max: 300, faithOnly: true },
  { key: "other", kind: "text", label: "Anything else", max: 500 },
];

export type Preferences = Record<string, string | string[]>;

/** Said at the top of the sheet, always. */
export const PREF_PREAMBLE =
  "These are my preferences, not demands. I know a birth does not always go to plan. Please tell me if something needs to change, and why.";

/**
 * What came in from the form, made safe: known fields only, known options
 * only, text trimmed to its limit, empty answers dropped.
 *
 * @param voice the mother's own choice.
 * @param existing what is saved now. A general mother may keep or clear a
 *   faith-only line she already wrote; she cannot write a new one.
 */
export function cleanPreferences(raw: unknown, voice: string | null | undefined, existing: Preferences | null): Preferences {
  const input = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  const out: Preferences = {};
  for (const f of PREF_FIELDS) {
    const v = input[f.key];
    if (f.kind === "text") {
      let text = typeof v === "string" ? v.replace(/\r\n?/g, "\n").trim().slice(0, f.max ?? 300) : "";
      if (f.faithOnly && isGeneral(voice)) {
        const was = typeof existing?.[f.key] === "string" ? (existing![f.key] as string) : "";
        // Kept exactly as it was, or taken off. Nothing new.
        text = text && text === was ? was : "";
      }
      if (text) out[f.key] = text;
    } else if (f.kind === "one") {
      if (typeof v === "string" && f.options!.some((o) => o.key === v)) out[f.key] = v;
    } else {
      const picked = Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
      const known = f.options!.map((o) => o.key).filter((k) => picked.includes(k));
      if (known.length) out[f.key] = known;
    }
  }
  return out;
}

/** Stored preferences made safe for reading, whatever is in the column. */
export function readPreferences(raw: unknown): Preferences {
  // Read as a faith mother would write them: nothing that is there is dropped.
  return cleanPreferences(raw, "FAITH", null);
}

/** The fields the editor offers this mother. */
export function fieldsFor(voice: string | null | undefined, existing: Preferences): PrefField[] {
  return PREF_FIELDS.filter((f) => !f.faithOnly || !isGeneral(voice) || typeof existing[f.key] === "string");
}

export interface SheetLine {
  label: string;
  /** One paragraph, or a list of chosen options. */
  text?: string;
  list?: string[];
}

/** Her sheet: only what she answered, in the order of the form, in her words. */
export function preferenceSheet(prefs: Preferences): SheetLine[] {
  const lines: SheetLine[] = [];
  for (const f of PREF_FIELDS) {
    const v = prefs[f.key];
    if (v === undefined) continue;
    if (f.kind === "text" && typeof v === "string") lines.push({ label: f.label, text: v });
    else if (f.kind === "one" && typeof v === "string") {
      const o = f.options!.find((x) => x.key === v);
      if (o) lines.push({ label: f.label, text: o.label });
    } else if (f.kind === "many" && Array.isArray(v)) {
      const list = f.options!.filter((o) => v.includes(o.key)).map((o) => o.label);
      if (list.length) lines.push({ label: f.label, list });
    }
  }
  return lines;
}

export function hasPreferences(prefs: Preferences): boolean {
  return Object.keys(prefs).length > 0;
}
