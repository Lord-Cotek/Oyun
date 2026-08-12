/**
 * A gentle, week-by-week size companion for pregnancy — the familiar "about the
 * size of a…" delight, kept warm and reverent (paired in the UI with Psalm
 * 139:14, "fearfully and wonderfully made"). Weeks 1–3 predate a measurable
 * size, so they get a quiet phrase instead of produce.
 */
const SIZES: Record<number, string> = {
  4: "a poppy seed",
  5: "a sesame seed",
  6: "a lentil",
  7: "a blueberry",
  8: "a raspberry",
  9: "a cherry",
  10: "a strawberry",
  11: "a fig",
  12: "a lime",
  13: "a lemon",
  14: "a peach",
  15: "an apple",
  16: "an avocado",
  17: "a pear",
  18: "a bell pepper",
  19: "a mango",
  20: "a banana",
  21: "a carrot",
  22: "a papaya",
  23: "a grapefruit",
  24: "an ear of corn",
  25: "a cauliflower",
  26: "a head of lettuce",
  27: "a rutabaga",
  28: "an eggplant",
  29: "a butternut squash",
  30: "a cabbage",
  31: "a coconut",
  32: "a squash",
  33: "a pineapple",
  34: "a cantaloupe",
  35: "a honeydew melon",
  36: "a head of romaine",
  37: "a bunch of chard",
  38: "a leek",
  39: "a small pumpkin",
  40: "a watermelon",
};

/** A short size phrase for a gestational week, or null when too early to say. */
export function babySizeFor(week: number): string | null {
  if (week < 4) return null;
  const w = Math.min(40, Math.max(4, Math.round(week)));
  return SIZES[w] ?? null;
}
