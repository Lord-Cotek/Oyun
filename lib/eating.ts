/**
 * Eating well in pregnancy — what matters each trimester, and "Can I eat
 * this?".
 *
 * ── Why this exists ──────────────────────────────────────────────────────
 * "Can I eat this?" is the question a pregnant woman asks most often and is
 * answered worst: by a relative, by a search result written for another
 * country, by a list that says "avoid" forty times and never says why. This
 * is a short, calm answer for each food, with the reason, and three or four
 * things that matter in the trimester she is in.
 *
 * ── What it is careful about ─────────────────────────────────────────────
 * • A wrong line here matters more than a wrong layout. Everything is taken
 *   from what the World Health Organization and national health services
 *   say in common. Where they disagree — soft cheese, runny eggs, raw fish,
 *   liver — the food is marked "with care", both positions are said plainly,
 *   and she is pointed to her own midwife. Nothing is called safe that any
 *   of them calls unsafe.
 * • No amounts of any vitamin, mineral or medicine. "Take what your midwife
 *   or doctor advised" is the whole of it.
 * • No calories, no weights, no targets. This is not a diet.
 * • Foods are named by kind, not by dish, so it reads the same in Lagos,
 *   Leeds and Lahore; the staples of any kitchen are a fine base.
 * • The medical facts are the same for every reader. One section follows the
 *   reader's faith choice (lib/voice.ts): fasting, shown only to somebody
 *   who chose Oyun with faith. It gives no rule of its own; it says to ask
 *   the doctor first, and what should end a fast at once.
 *   scripts/verify-care.mjs holds all of this.
 * • Nothing here is read by, or sent to, the assistant or anybody else. It
 *   is a page of words; it knows nothing about her.
 *
 * No database and no imports that reach one.
 */
import { isGeneral } from "@/lib/voice";

export type EatPhase = "t1" | "t2" | "t3" | "after-birth" | "after-loss";
export type EatReader = "MOTHER" | "PARTNER";
export type Verdict = "ok" | "care" | "avoid";

export const VERDICT_LABEL: Record<Verdict, string> = {
  ok: "Fine",
  care: "With care",
  avoid: "Best avoided",
};

export const EATING_UPDATED = "November 2026";
export const EATING_SOURCE =
  "Written from what the World Health Organization and national health services advise in common about food in pregnancy. Where they differ, this page says so.";

/** Which trimester a week of pregnancy falls in. */
export function phaseForWeek(week: number | null | undefined): "t1" | "t2" | "t3" {
  const w = week ?? 1;
  return w <= 13 ? "t1" : w <= 27 ? "t2" : "t3";
}

// ── Can I eat this? ─────────────────────────────────────────────────────────

export interface Food {
  key: string;
  name: string;
  /** Other words somebody might type: "sushi", "pâté", "garri". Lower case. */
  also: string[];
  verdict: Verdict;
  why: string;
}

/**
 * In the order they are listed when nothing is typed: the ones asked about
 * most, first. Every entry says what to do, then why.
 */
export const FOODS: Food[] = [
  {
    key: "alcohol",
    name: "Alcohol",
    also: ["beer", "wine", "spirits", "palm wine", "stout", "drink"],
    verdict: "avoid",
    why: "No amount is known to be safe for the baby at any stage of pregnancy.",
  },
  {
    key: "caffeine",
    name: "Coffee, tea, cola and energy drinks",
    also: ["caffeine", "espresso", "green tea", "black tea", "chai", "energy drink", "mate"],
    verdict: "care",
    why: "Keep it low: most health services say no more than about two cups of coffee a day, counting tea and cola too. Energy drinks are best left out.",
  },
  {
    key: "raw-meat",
    name: "Raw or undercooked meat",
    also: ["rare steak", "pink meat", "tartare", "carpaccio", "undercooked chicken", "suya", "kebab", "burger", "mince"],
    verdict: "avoid",
    why: "Cook meat and poultry until no pink is left and the juices run clear. Undercooked meat can carry infections that harm the baby.",
  },
  {
    key: "cooked-meat",
    name: "Well-cooked meat and poultry",
    also: ["beef", "chicken", "goat", "lamb", "pork", "turkey", "stew"],
    verdict: "ok",
    why: "A good source of iron and protein. Cooked through, it is exactly what is wanted.",
  },
  {
    key: "cured-meat",
    name: "Cold cured and deli meats",
    also: ["salami", "ham", "parma", "prosciutto", "chorizo", "pepperoni", "deli", "sausage", "hot dog", "luncheon meat", "biltong"],
    verdict: "care",
    why: "Fine when heated until steaming hot. Eaten cold they can carry listeria, which is rare but serious in pregnancy.",
  },
  {
    key: "liver",
    name: "Liver and liver products",
    also: ["liver", "pate", "pâté", "liver sausage", "offal", "kidney"],
    verdict: "care",
    why: "Very rich in vitamin A, and too much of it can harm the baby. Some health services say to avoid liver in pregnancy; others allow a small portion now and then. Ask your midwife what is advised where you live.",
  },
  {
    key: "pate",
    name: "Chilled pâté, any kind",
    also: ["pate", "pâté", "vegetable pate", "meat paste", "spread"],
    verdict: "avoid",
    why: "Chilled pâté, including vegetable pâté, can carry listeria.",
  },
  {
    key: "eggs-cooked",
    name: "Eggs, cooked until firm",
    also: ["egg", "boiled egg", "fried egg", "omelette", "scrambled"],
    verdict: "ok",
    why: "A cheap, complete protein. Cooked until the white and the yolk are firm, they are safe everywhere.",
  },
  {
    key: "eggs-raw",
    name: "Raw or runny eggs",
    also: ["soft boiled", "runny yolk", "homemade mayonnaise", "mousse", "tiramisu", "raw batter", "cookie dough", "eggnog"],
    verdict: "care",
    why: "Cook eggs until firm, unless eggs where you live carry a mark that says they are safe to eat runny. Shop-bought mayonnaise and ice cream are made with treated egg and are fine.",
  },
  {
    key: "oily-fish",
    name: "Oily fish, cooked",
    also: ["salmon", "sardines", "mackerel", "herring", "trout", "pilchards", "titus", "anchovies"],
    verdict: "ok",
    why: "Good for the baby's brain and eyes. Most health services suggest about two portions a week.",
  },
  {
    key: "white-fish",
    name: "White fish and shellfish, cooked through",
    also: ["tilapia", "cod", "hake", "catfish", "croaker", "prawns", "shrimp", "crab", "crayfish", "lobster", "mussels"],
    verdict: "ok",
    why: "Fine when cooked until piping hot all the way through.",
  },
  {
    key: "mercury-fish",
    name: "Shark, swordfish, marlin and king mackerel",
    also: ["shark", "swordfish", "marlin", "king mackerel", "tilefish", "bigeye tuna", "mercury"],
    verdict: "avoid",
    why: "These large fish carry the most mercury, which can affect the baby's developing nerves.",
  },
  {
    key: "tuna",
    name: "Tuna",
    also: ["tuna steak", "canned tuna", "tinned tuna"],
    verdict: "care",
    why: "Fine in moderation. Tuna carries more mercury than most fish, so health services set a weekly limit; ask what it is where you live.",
  },
  {
    key: "raw-fish",
    name: "Raw fish and sushi",
    also: ["sushi", "sashimi", "ceviche", "poke", "raw salmon"],
    verdict: "care",
    why: "Sushi made with cooked fish or vegetables is fine. On raw fish health services differ: some allow it if the fish was frozen first, others say to avoid it. If in doubt, choose cooked.",
  },
  {
    key: "raw-shellfish",
    name: "Raw shellfish",
    also: ["oysters", "raw clams", "raw mussels", "raw prawns"],
    verdict: "avoid",
    why: "Raw shellfish can carry bacteria and viruses that cause food poisoning.",
  },
  {
    key: "smoked-fish",
    name: "Smoked and cured fish",
    also: ["smoked salmon", "lox", "gravlax", "smoked mackerel", "smoked trout", "kippers", "stockfish", "dried fish", "bonga"],
    verdict: "care",
    why: "Fine when cooked into a hot dish until steaming. Cold-smoked fish eaten as it comes can carry listeria.",
  },
  {
    key: "raw-milk",
    name: "Unpasteurised (raw) milk and anything made from it",
    also: ["raw milk", "fresh milk", "unpasteurised cheese", "raw milk cheese", "nono", "fura", "wara", "goat milk", "camel milk"],
    verdict: "avoid",
    why: "Raw milk can carry listeria and other infections. Boil milk that has not been pasteurised before drinking it.",
  },
  {
    key: "dairy",
    name: "Pasteurised milk, yoghurt and hard cheese",
    also: ["milk", "yogurt", "yoghurt", "cheddar", "parmesan", "gouda", "edam", "hard cheese", "evaporated milk", "powdered milk"],
    verdict: "ok",
    why: "Good sources of calcium and protein.",
  },
  {
    key: "soft-cheese-plain",
    name: "Soft cheeses that are not mould-ripened",
    also: ["mozzarella", "feta", "cottage cheese", "cream cheese", "paneer", "halloumi", "ricotta", "mascarpone", "processed cheese", "cheese spread"],
    verdict: "ok",
    why: "Fine when made from pasteurised milk.",
  },
  {
    key: "soft-cheese-mould",
    name: "Mould-ripened and soft blue cheeses",
    also: ["brie", "camembert", "blue cheese", "gorgonzola", "roquefort", "goat cheese with rind", "chevre"],
    verdict: "care",
    why: "Fine when cooked until steaming hot. Eaten cold, many health services advise against them, even pasteurised, because of listeria.",
  },
  {
    key: "fruit-veg",
    name: "Fruit, vegetables and salad",
    also: ["salad", "lettuce", "tomato", "greens", "spinach", "ugu", "kale", "fruit", "vegetables", "mango", "banana", "orange", "watermelon"],
    verdict: "ok",
    why: "As much and as varied as you like. Wash them well in clean water first, including ready-bagged salad.",
  },
  {
    key: "pineapple",
    name: "Pineapple and ripe papaya",
    also: ["pineapple", "pawpaw", "papaya"],
    verdict: "ok",
    why: "Both are safe to eat in ordinary amounts. Pineapple does not bring on labour.",
  },
  {
    key: "green-papaya",
    name: "Unripe (green) papaya",
    also: ["green papaya", "green pawpaw", "unripe pawpaw", "papaya salad", "som tam"],
    verdict: "care",
    why: "Best left until it is fully ripe. Unripe papaya contains a latex that may cause the womb to tighten.",
  },
  {
    key: "sprouts",
    name: "Raw sprouts",
    also: ["bean sprouts", "alfalfa", "mung sprouts", "sprouted beans"],
    verdict: "care",
    why: "Cook them through. Raw sprouts are grown warm and damp, which suits bacteria.",
  },
  {
    key: "beans",
    name: "Beans, lentils, peas and nuts",
    also: ["beans", "lentils", "dal", "dhal", "chickpeas", "groundnuts", "peanuts", "peanut butter", "cashews", "almonds", "moi moi", "akara", "soya", "tofu"],
    verdict: "ok",
    why: "Protein, iron, folate and fibre in one. Nuts, including peanuts, are fine unless you are allergic to them yourself.",
  },
  {
    key: "staples",
    name: "Rice, bread, maize, yam, potatoes and other staples",
    also: ["rice", "bread", "pasta", "noodles", "yam", "cassava", "garri", "eba", "fufu", "plantain", "potato", "maize", "ugali", "sadza", "pap", "chapati", "roti", "oats", "millet", "couscous"],
    verdict: "ok",
    why: "The base of every plate. Wholegrain kinds, where you can get them, help with constipation.",
  },
  {
    key: "leftovers",
    name: "Leftovers and reheated rice",
    also: ["leftover", "reheated", "cold rice", "yesterday's food", "takeaway"],
    verdict: "care",
    why: "Cool quickly, keep covered and cold, and reheat once until steaming hot all the way through.",
  },
  {
    key: "street-food",
    name: "Street food and buffets",
    also: ["street food", "buffet", "party food", "roadside", "bukka", "food stall"],
    verdict: "care",
    why: "Choose food that is cooked in front of you and served hot. Leave what has been standing out.",
  },
  {
    key: "juice",
    name: "Freshly pressed juice from a stall",
    also: ["fresh juice", "sugarcane juice", "smoothie", "zobo", "kunu", "sobolo"],
    verdict: "care",
    why: "Fine when made at home from washed fruit with clean water. From a stall it is not pasteurised and the water may not be clean.",
  },
  {
    key: "water",
    name: "Water",
    also: ["tap water", "sachet water", "pure water", "bottled water", "ice"],
    verdict: "ok",
    why: "Plenty of it. Where tap water is not treated, drink boiled, filtered or sealed water, and remember ice is made of water too.",
  },
  {
    key: "herbal-tea",
    name: "Herbal teas",
    also: ["ginger tea", "peppermint tea", "chamomile", "rooibos", "raspberry leaf", "hibiscus", "lemongrass", "moringa"],
    verdict: "care",
    why: "A cup or two of an everyday tea such as ginger or peppermint is fine. Teas sold to do something — for labour, for slimming, for cleansing — are medicines; ask first.",
  },
  {
    key: "herbal-medicine",
    name: "Herbal medicines and tonics",
    also: ["herbs", "herbal", "tonic", "bitters", "agbo", "concoction", "traditional medicine", "supplement", "detox"],
    verdict: "care",
    why: "Most have never been tested in pregnancy, and some are known to harm. Tell your midwife or doctor everything you take, including remedies from home.",
  },
  {
    key: "vitamin-a",
    name: "Vitamin A and fish-liver-oil supplements",
    also: ["vitamin a", "retinol", "cod liver oil", "fish liver oil", "multivitamin"],
    verdict: "care",
    why: "Only if your doctor or midwife has prescribed it. Too much vitamin A can harm the baby. A multivitamin made for pregnancy is a different thing.",
  },
  {
    key: "clay",
    name: "Clay, chalk or soil",
    also: ["clay", "chalk", "nzu", "calabash chalk", "kaolin", "soil", "earth", "charcoal", "starch", "pica", "craving"],
    verdict: "avoid",
    why: "These can contain lead and other harmful things. A craving for them, or for ice, is common and is often a sign of low iron; tell your midwife, who can test for it.",
  },
  {
    key: "spicy",
    name: "Spicy food",
    also: ["pepper", "chilli", "chili", "curry", "pepper soup", "hot sauce"],
    verdict: "ok",
    why: "Safe for the baby. It can make heartburn worse later on, so go by how it sits with you.",
  },
  {
    key: "honey",
    name: "Honey",
    also: ["honey"],
    verdict: "ok",
    why: "Safe for you. It is babies under one year old who must not be given honey.",
  },
  {
    key: "sweets",
    name: "Sugary drinks, sweets and fried snacks",
    also: ["soda", "soft drink", "fizzy", "sweets", "chocolate", "cake", "biscuits", "chin chin", "puff puff", "crisps", "chips", "doughnut"],
    verdict: "care",
    why: "Nothing in them harms the baby. They fill you without feeding you, so keep them for now and then, more so if you have been told your blood sugar is raised.",
  },
];

/** Plain letters, lower case, no accents: "Pâté" finds "pate". */
function plain(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9 ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** The foods matching what was typed; all of them when nothing was. */
export function searchFoods(query: string, verdict?: Verdict | null): Food[] {
  const q = plain(query);
  const words = q ? q.split(" ") : [];
  return FOODS.filter((f) => {
    if (verdict && f.verdict !== verdict) return false;
    if (words.length === 0) return true;
    const hay = plain([f.name, ...f.also].join(" "));
    return words.every((w) => hay.includes(w));
  });
}

// ── What matters now ────────────────────────────────────────────────────────

export interface EatSection {
  key: string;
  title: string;
  intro?: string;
  points: string[];
}

export interface EatingGuide {
  lede: string;
  /** Shown only on her partner's screen. */
  partnerNote: string | null;
  focus: EatSection;
  plate: EatSection | null;
  everyday: EatSection | null;
  troubles: EatSection[];
  /** With faith only — see the top of this file. */
  fasting: EatSection | null;
  /** Whether "Can I eat this?" belongs on the page in this phase. */
  showFoods: boolean;
  closing: string[];
}

const FOCUS: Record<EatPhase, EatSection> = {
  t1: {
    key: "t1",
    title: "The first three months",
    intro: "The baby is forming, and needs very little extra food from you yet. What it needs is the right few things.",
    points: [
      "Folate: dark green leaves, beans and lentils, oranges, and bread or cereals with folic acid added. Take the folic acid your midwife or doctor advised as well; food alone is rarely enough.",
      "Eat little and often if you feel sick. Something small and dry before you get up helps many women.",
      "There is no need to eat for two. Eat as you normally would, as well as you can.",
      "Food safety matters most now. The list below says what to cook through and what to leave.",
    ],
  },
  t2: {
    key: "t2",
    title: "The middle three months",
    intro: "The baby is growing fast and your blood is increasing to carry it. Iron and calcium are the two that run short.",
    points: [
      "Iron: meat, fish, beans, lentils and dark green leaves. Eat fruit or tomatoes with them, which helps the body take the iron in, and keep tea and coffee for between meals.",
      "Calcium: milk, yoghurt, cheese, small fish eaten with their bones, and greens.",
      "Protein at each meal: eggs, beans, fish, meat, groundnuts.",
      "A little more food than usual, not double. An extra snack is about the size of it.",
      "Cook with iodised salt where it is sold, and not much of it.",
    ],
  },
  t3: {
    key: "t3",
    title: "The last three months",
    intro: "The baby is laying down its stores and there is less room for a meal. Smaller and more often is the shape of it.",
    points: [
      "Keep up the iron and the protein; the baby is taking its own stores from yours.",
      "Oily fish about twice a week, cooked, for the baby's brain.",
      "Fibre and water against constipation: fruit, vegetables, beans, wholegrains, and a drink at hand all day.",
      "Smaller meals, eaten sitting up and not late, against heartburn.",
      "Keep taking what your midwife or doctor advised, to the end.",
    ],
  },
  "after-birth": {
    key: "after-birth",
    title: "After the birth",
    intro: "You are recovering, and if you are breastfeeding you are making food as well. This is not the time to eat less.",
    points: [
      "Eat regularly, and keep things you can eat with one hand within reach.",
      "Drink whenever you are thirsty. A glass of water each time you sit down to feed is an easy rule.",
      "Iron to rebuild after the birth: meat, fish, beans, lentils and greens.",
      "Fibre and water; the first days are easier for it.",
      "When breastfeeding, almost nothing has to be left out. Alcohol is best avoided or kept to very little, caffeine kept low, and the fish with the most mercury still limited.",
      "No dieting in the early weeks. The weight is not the work in front of you.",
    ],
  },
  "after-loss": {
    key: "after-loss",
    title: "Eating, in the weeks after",
    intro: "Appetite often goes. Your body is still recovering and needs feeding all the same.",
    points: [
      "Small amounts, often, of whatever you can face. Let people bring food.",
      "Drink through the day.",
      "Iron to make up for blood lost: meat, fish, beans, lentils and greens.",
      "If days go by with almost nothing eaten, tell your doctor.",
    ],
  },
};

const PLATE: EatSection = {
  key: "plate",
  title: "A plate, most days",
  intro: "No weighing and no counting. This is the shape to aim for with the food your own kitchen already cooks.",
  points: [
    "Half of it vegetables and fruit, of as many colours as the market has.",
    "A quarter the staple: rice, yam, maize, bread, potatoes, chapati, whatever yours is.",
    "A quarter protein: beans, eggs, fish, meat or groundnuts.",
    "Milk, yoghurt or another source of calcium somewhere in the day.",
    "Water with it.",
  ],
};

const EVERYDAY: EatSection = {
  key: "everyday",
  title: "Every day",
  points: [
    "Take the folic acid, iron or other supplements your midwife or doctor advised, and nothing they have not.",
    "Try not to go long hours without eating; three meals and a snack or two suits most women.",
    "Wash hands before cooking and eating, keep raw meat apart from food that is ready to eat, and cook food through.",
    "If you have been told your blood sugar or blood pressure is raised, follow the eating plan your own team gave you. Writing what you ate beside a glucose reading in the Log helps them help you.",
  ],
};

const TROUBLES: EatSection[] = [
  {
    key: "sick",
    title: "Feeling sick",
    points: [
      "Small amounts, often. An empty stomach makes it worse.",
      "Dry, plain food before getting up; cold food if cooking smells turn you.",
      "Ginger helps some women.",
      "Sip fluids all day. If nothing stays down, that is a sign to call: see When to call.",
    ],
  },
  {
    key: "heartburn",
    title: "Heartburn",
    points: [
      "Smaller meals, eaten slowly and sitting upright.",
      "Leave a couple of hours between eating and lying down.",
      "Go easy on fried, fatty and very spicy food if they set it off.",
      "Ask your midwife or pharmacist before taking anything for it.",
    ],
  },
  {
    key: "constipation",
    title: "Constipation",
    points: [
      "More fibre: fruit, vegetables, beans and wholegrains.",
      "More water.",
      "A walk each day.",
      "Iron tablets can cause it. Do not stop them; tell your midwife, who may change the kind.",
    ],
  },
  {
    key: "cravings",
    title: "Cravings and going off food",
    points: [
      "Both are normal and usually pass. Eat what you fancy alongside what you need.",
      "A craving for something that is not food, such as clay, chalk or ice, is worth telling your midwife about. It often means iron is low.",
    ],
  },
];

const FASTING: EatSection = {
  key: "fasting",
  title: "Fasting while you are expecting",
  intro:
    "Many churches fast together, and you may want to take part. Many excuse women who are pregnant or nursing; it is worth asking your pastor before you decide. Oyun never asks you to fast.",
  points: [
    "Speak to your doctor or midwife before any fast, whatever its length. This matters most if you have diabetes, raised blood pressure, anaemia, twins or more, or take medicine that goes with food.",
    "Do not go without water. A fast from all fluids is not safe in pregnancy.",
    "If you take glucose readings, a fast will change them. Your team needs to know.",
    "Stop, eat and drink at once if you feel dizzy or faint, get a headache, pass very little or dark urine, feel tightenings, or the baby moves less than usual. Then call your midwife.",
    "A fast does not have to be from food. Giving up something else, or giving a mealtime to prayer while you eat simply afterwards, is a fast that harms nobody.",
  ],
};

/**
 * The page, for one reader.
 *
 * @param voice only decides whether the fasting section is there.
 */
export function eatingGuide(
  phase: EatPhase,
  reader: EatReader,
  voice: string | null | undefined,
  motherName: string,
): EatingGuide {
  const her = reader === "PARTNER";
  const name = motherName.trim().split(/\s+/)[0] || "her";
  const pregnant = phase === "t1" || phase === "t2" || phase === "t3";

  const lede =
    phase === "after-loss"
      ? "A few plain things about eating while the body recovers."
      : phase === "after-birth"
        ? her
          ? `What helps ${name} while she recovers and feeds the baby.`
          : "What helps while you recover and feed the baby."
        : "What matters at the table this trimester, and a straight answer for each food.";

  return {
    lede,
    partnerNote: her
      ? `This page is written to ${name}. It is here for you too: you are often the one shopping, cooking, or being asked "can I eat this?".`
      : null,
    focus: FOCUS[phase],
    plate: phase === "after-loss" ? null : PLATE,
    everyday: pregnant ? EVERYDAY : null,
    troubles: pregnant ? TROUBLES : [],
    fasting: pregnant && !isGeneral(voice) ? FASTING : null,
    showFoods: pregnant,
    closing: [
      "This page is general. It does not know your health, and your own midwife or doctor's advice comes before anything written here.",
    ],
  };
}
