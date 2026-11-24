/**
 * The essentials — a starter list for a baby, sorted onto shelves.
 *
 * ── Why this exists ──────────────────────────────────────────────────────
 * A first-time mother opening an empty registry does not know what she does
 * not know. She adds a pram and a cot and stops, and finds out about muslin
 * cloths and a thermometer at two in the morning in week one. This is the
 * list an aunt who has had four would write for her: by shelf, with how many,
 * and with the handful that truly matter marked as such.
 *
 * ── What it is careful about ─────────────────────────────────────────────
 * • Nothing is added for her. She ticks what she wants; each tick becomes an
 *   ordinary item that is hers to rename, link, price or take off.
 * • No brands, no shops, no prices. Oyun is used in many countries; "a cot"
 *   is true in all of them and a product name is true in one.
 * • Where two words are used for one thing, both are given: nappies
 *   (diapers), pram or stroller.
 * • No infant formula. It is not for a gift list to suggest how a baby is
 *   fed, and the international code on marketing breast-milk substitutes
 *   asks that it is not promoted. Bottles and a pump are both here; she
 *   chooses.
 * • "Depending on where you live" holds the things that are essential in one
 *   climate and useless in another, instead of pretending to know hers.
 * • The words follow the reader (lib/voice.ts): a mother who chose Oyun with
 *   faith is offered a children's Bible and a dedication outfit under
 *   keepsakes; one who chose it without is offered a naming-day outfit. Once
 *   a thing is on her list it is hers, and is shown to everybody as written.
 *
 * ── Existing registries ──────────────────────────────────────────────────
 * Everything added before shelves existed has no shelf, and a registry where
 * nothing has a shelf is drawn exactly as it always was. See groupThings.
 *
 * No database and no imports that reach one.
 */
import { isGeneral } from "@/lib/voice";

/** The shelves, in the order they are shown. */
export const CATEGORIES = [
  { key: "SLEEP", label: "Sleeping" },
  { key: "FEED", label: "Feeding" },
  { key: "CHANGE", label: "Nappies and changing" },
  { key: "CLOTHES", label: "Clothing" },
  { key: "BATH", label: "Bathing and skin" },
  { key: "OUT", label: "Out and about" },
  { key: "SAFETY", label: "Health and safety" },
  { key: "MOTHER", label: "For the mother" },
  { key: "BAG", label: "Hospital bag" },
  { key: "PLAY", label: "Play and books" },
  { key: "CLIMATE", label: "Depending on where you live" },
  // One plain name for everybody on a shared page; the picker's own heading
  // follows the reader — see essentialsFor.
  { key: "KEEPSAKES", label: "Keepsakes and celebration" },
] as const;

export type CategoryKey = (typeof CATEGORIES)[number]["key"];

export function isCategory(v: unknown): v is CategoryKey {
  return typeof v === "string" && CATEGORIES.some((c) => c.key === v);
}

/** A stored value made safe: a known shelf, or none. */
export function cleanCategory(v: unknown): CategoryKey | null {
  return isCategory(v) ? v : null;
}

export function categoryLabel(key: string | null | undefined): string {
  return CATEGORIES.find((c) => c.key === key)?.label ?? "Everything else";
}

export interface Essential {
  /** Stable, and stored on the item it becomes. Never reuse one. */
  key: string;
  title: string;
  /** A line of plain advice shown in the picker and saved as the item's note. */
  note?: string;
  /** How many to ask for, for one baby. */
  quantity: number;
  /** One for each baby: doubled for twins. */
  perBaby?: boolean;
  /** One of the handful that truly matter. */
  mostNeeded?: boolean;
  /** The ones families most often wish they had thought of. */
  forgotten?: boolean;
  /** "HELP" for a hand, not a thing. */
  kind?: "THING" | "HELP";
}

export interface EssentialSection {
  /** The shelf the items land on. Null for help, which has a section of its own on every page. */
  category: CategoryKey | null;
  key: string;
  title: string;
  blurb?: string;
  items: Essential[];
}

const SECTIONS: EssentialSection[] = [
  {
    category: "SLEEP",
    key: "SLEEP",
    title: "Sleeping",
    items: [
      { key: "cot", title: "Cot, crib or Moses basket", quantity: 1, perBaby: true, mostNeeded: true },
      {
        key: "mattress",
        title: "Firm, flat mattress to fit the cot",
        note: "A new mattress is the safest choice, even in a cot that has been handed down.",
        quantity: 1,
        perBaby: true,
        mostNeeded: true,
      },
      { key: "cot-sheets", title: "Fitted cot sheets", quantity: 3, perBaby: true },
      { key: "mattress-protector", title: "Waterproof mattress protector", quantity: 2, forgotten: true },
      { key: "blankets", title: "Light cotton or cellular blankets", quantity: 3 },
      { key: "sleeping-bags", title: "Baby sleeping bags", quantity: 2, perBaby: true },
      { key: "night-light", title: "Night light, dim enough for night feeds", quantity: 1, forgotten: true },
      { key: "monitor", title: "Baby monitor", quantity: 1 },
    ],
  },
  {
    category: "FEED",
    key: "FEED",
    title: "Feeding",
    blurb: "For the breast and for the bottle. Choose the ones that fit how you plan to feed; plans change, and that is fine.",
    items: [
      { key: "muslins", title: "Muslin cloths", note: "For winding, spills and a dozen other things.", quantity: 10, mostNeeded: true, forgotten: true },
      { key: "bibs", title: "Bibs", quantity: 6, perBaby: true },
      { key: "nursing-pillow", title: "Nursing pillow", quantity: 1 },
      { key: "breast-pump", title: "Breast pump", quantity: 1 },
      { key: "milk-storage", title: "Breast milk storage bags or pots", quantity: 1 },
      { key: "bottles", title: "Bottles with newborn teats", quantity: 4, perBaby: true },
      { key: "bottle-brush", title: "Bottle brush", quantity: 1 },
      { key: "steriliser", title: "Steriliser", quantity: 1 },
      { key: "high-chair", title: "High chair, for later", quantity: 1, perBaby: true },
    ],
  },
  {
    category: "CHANGE",
    key: "CHANGE",
    title: "Nappies and changing",
    items: [
      { key: "nappies-newborn", title: "Newborn nappies (diapers), packs", note: "Or about twenty cloth nappies, if you are using those.", quantity: 4, perBaby: true, mostNeeded: true },
      { key: "nappies-size1", title: "Size 1 nappies (diapers), packs", quantity: 4, perBaby: true },
      { key: "wipes", title: "Baby wipes or cotton wool, packs", quantity: 6 },
      { key: "changing-mat", title: "Changing mat", quantity: 1, mostNeeded: true },
      { key: "barrier-cream", title: "Nappy barrier cream", quantity: 1 },
      { key: "nappy-bin", title: "Lidded nappy bin or nappy bags", quantity: 1 },
      { key: "changing-bag", title: "Changing bag", quantity: 1 },
    ],
  },
  {
    category: "CLOTHES",
    key: "CLOTHES",
    title: "Clothing",
    blurb: "Babies outgrow the newborn size in weeks. Ask for more in 0–3 months than in newborn.",
    items: [
      { key: "sleepsuits", title: "Sleepsuits, newborn and 0–3 months", quantity: 7, perBaby: true, mostNeeded: true },
      { key: "bodysuits", title: "Bodysuits or vests, newborn and 0–3 months", quantity: 7, perBaby: true, mostNeeded: true },
      { key: "hats", title: "Soft hats", quantity: 2, perBaby: true },
      { key: "socks", title: "Socks or booties, pairs", quantity: 4, perBaby: true },
      { key: "cardigans", title: "Cardigans or light jackets", quantity: 2, perBaby: true },
      { key: "mittens", title: "Scratch mittens, pairs", quantity: 2, perBaby: true },
      { key: "going-home", title: "Going-home outfit or shawl", quantity: 1, perBaby: true },
    ],
  },
  {
    category: "BATH",
    key: "BATH",
    title: "Bathing and skin",
    items: [
      { key: "baby-bath", title: "Baby bath or bath support", quantity: 1 },
      { key: "towels", title: "Soft hooded towels", quantity: 2, perBaby: true },
      { key: "washcloths", title: "Soft washcloths", quantity: 4 },
      { key: "baby-wash", title: "Mild, fragrance-free baby wash and lotion", quantity: 1 },
      { key: "hairbrush", title: "Soft baby hairbrush", quantity: 1 },
    ],
  },
  {
    category: "OUT",
    key: "OUT",
    title: "Out and about",
    items: [
      {
        key: "car-seat",
        title: "Car seat suitable from birth",
        note: "New, or from somebody who can tell you it has never been in a crash.",
        quantity: 1,
        perBaby: true,
        mostNeeded: true,
      },
      { key: "pram", title: "Pram or stroller that lies flat", quantity: 1 },
      { key: "carrier", title: "Baby carrier, wrap or sling", quantity: 1 },
      { key: "rain-cover", title: "Rain cover or sunshade for the pram", quantity: 1 },
      { key: "travel-cot", title: "Travel cot", quantity: 1 },
    ],
  },
  {
    category: "SAFETY",
    key: "SAFETY",
    title: "Health and safety",
    items: [
      { key: "thermometer", title: "Digital thermometer", quantity: 1, mostNeeded: true, forgotten: true },
      { key: "nail-file", title: "Baby nail file or clippers", quantity: 1, forgotten: true },
      { key: "nasal-aspirator", title: "Nasal aspirator", quantity: 1 },
      { key: "first-aid", title: "First-aid kit", quantity: 1 },
    ],
  },
  {
    category: "MOTHER",
    key: "MOTHER",
    title: "For the mother",
    blurb: "The shelf that gets left off. You are recovering too.",
    items: [
      { key: "maternity-pads", title: "Maternity pads, packs", quantity: 4, mostNeeded: true, forgotten: true },
      { key: "nursing-bras", title: "Nursing bras", quantity: 3 },
      { key: "breast-pads", title: "Breast pads, washable or disposable", quantity: 2 },
      { key: "nipple-cream", title: "Nipple cream", quantity: 1 },
      { key: "nightwear", title: "Front-opening nightwear", quantity: 2 },
      { key: "underwear", title: "Comfortable high-waisted underwear, packs", quantity: 2 },
      { key: "water-bottle", title: "Large water bottle with a straw", quantity: 1 },
    ],
  },
  {
    category: "BAG",
    key: "BAG",
    title: "Hospital bag",
    items: [
      { key: "bag", title: "Hospital bag or small case", quantity: 1 },
      { key: "robe", title: "Light robe and slippers", quantity: 1 },
      { key: "toiletries", title: "Toiletries bag and lip balm", quantity: 1 },
      { key: "long-charger", title: "Phone charger with a long lead", quantity: 1 },
    ],
  },
  {
    category: "PLAY",
    key: "PLAY",
    title: "Play and books",
    items: [
      { key: "books", title: "Cloth or board books", quantity: 4 },
      { key: "play-mat", title: "Play mat or baby gym", quantity: 1 },
      { key: "soft-toys", title: "Rattle or soft toy", quantity: 2 },
      { key: "bouncer", title: "Bouncer chair", quantity: 1, perBaby: true },
    ],
  },
  {
    category: "CLIMATE",
    key: "CLIMATE",
    title: "Depending on where you live",
    blurb: "Essential in one place and no use in another. Take what fits yours.",
    items: [
      { key: "mosquito-net", title: "Mosquito net for the cot or pram", quantity: 1, perBaby: true },
      { key: "fan", title: "Quiet fan for the room", quantity: 1 },
      { key: "sun-hat", title: "Sun hat", quantity: 1, perBaby: true },
      { key: "pramsuit", title: "Warm pramsuit or snowsuit", quantity: 1, perBaby: true },
      { key: "room-heater", title: "Room heater with a thermostat", quantity: 1 },
    ],
  },
  {
    category: null,
    key: "HELP",
    title: "Help, not things",
    blurb: "Usually the ones remembered longest. Each can be given dates afterwards.",
    items: [
      { key: "help-dinners", title: "A cooked dinner in the first fortnight home", quantity: 7, kind: "HELP" },
      { key: "help-hold", title: "An hour holding the baby while I sleep", quantity: 4, kind: "HELP" },
      { key: "help-washing", title: "Help with the washing or cleaning", quantity: 2, kind: "HELP" },
      { key: "help-children", title: "Minding the older children, or the school run", quantity: 2, kind: "HELP" },
      { key: "help-lift", title: "A lift to an appointment", quantity: 2, kind: "HELP" },
    ],
  },
];

const KEEPSAKES_COMMON: Essential[] = [
  { key: "keepsake-box", title: "Keepsake box", quantity: 1, perBaby: true },
  { key: "record-book", title: "Baby record book", quantity: 1, perBaby: true },
  { key: "prints-kit", title: "Hand and footprint kit", quantity: 1 },
];

const KEEPSAKES_FAITH: EssentialSection = {
  category: "KEEPSAKES",
  key: "KEEPSAKES",
  title: "Keepsakes and the dedication",
  items: [
    { key: "childrens-bible", title: "Children's Bible or Bible storybook", quantity: 1 },
    { key: "dedication-outfit", title: "Dedication or christening outfit", quantity: 1, perBaby: true },
    ...KEEPSAKES_COMMON,
  ],
};

const KEEPSAKES_GENERAL: EssentialSection = {
  category: "KEEPSAKES",
  key: "KEEPSAKES",
  title: "Welcome and naming",
  items: [{ key: "naming-outfit", title: "Naming-day or welcome outfit", quantity: 1, perBaby: true }, ...KEEPSAKES_COMMON],
};

/** The most that may be asked for of one thing — the registry's own limit. */
const QUANTITY_CAP = 20;

/**
 * The starter list for one reader.
 *
 * @param voice the reader's own choice — hers on her screen, his on his.
 * @param babyCount twins and more are asked for in twos and more.
 */
export function essentialsFor(voice: string | null | undefined, babyCount: number | null | undefined): EssentialSection[] {
  const n = Math.max(1, Math.min(6, Math.trunc(babyCount ?? 1) || 1));
  const sections = [...SECTIONS];
  // Keepsakes sit before help, which is always last.
  sections.splice(sections.length - 1, 0, isGeneral(voice) ? KEEPSAKES_GENERAL : KEEPSAKES_FAITH);
  return sections.map((s) => ({
    ...s,
    items: s.items.map((i) => ({ ...i, quantity: Math.min(QUANTITY_CAP, i.perBaby ? i.quantity * n : i.quantity) })),
  }));
}

/** Every starter entry there is, in either voice — for looking one up by key. */
export function findEssential(
  key: string,
  babyCount: number | null | undefined,
): { item: Essential; category: CategoryKey | null } | null {
  for (const voice of ["FAITH", "GENERAL"]) {
    for (const s of essentialsFor(voice, babyCount)) {
      const item = s.items.find((i) => i.key === key);
      if (item) return { item, category: s.category };
    }
  }
  return null;
}

/**
 * Things, sorted onto their shelves for a page.
 *
 * Returns ONE group with no heading when nothing has a shelf — which is every
 * registry made before shelves existed. Those pages are drawn exactly as they
 * were: one list, in the family's own order. Headings appear only once the
 * family has put something on a shelf, and then the unsorted things are
 * gathered under "Everything else" at the end, in the order they were in.
 */
export function groupThings<T extends { category: string | null }>(
  items: T[],
): { key: string; label: string | null; items: T[] }[] {
  if (items.length === 0) return [];
  if (!items.some((i) => isCategory(i.category))) return [{ key: "ALL", label: null, items }];
  const groups: { key: string; label: string | null; items: T[] }[] = [];
  for (const c of CATEGORIES) {
    const here = items.filter((i) => i.category === c.key);
    if (here.length) groups.push({ key: c.key, label: c.label, items: here });
  }
  const rest = items.filter((i) => !isCategory(i.category));
  if (rest.length) groups.push({ key: "OTHER", label: "Everything else", items: rest });
  return groups;
}
