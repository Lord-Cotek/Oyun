/**
 * Yorùbá for the screens everyone passes through: the way in (sign in, sign
 * up) and the menus. Keyed by the English words themselves, so a screen only
 * has to wrap what it already says — and anything not yet here simply stays
 * in English rather than going blank.
 *
 * ── Before anyone sees it ────────────────────────────────────────────────
 * These were written carefully, but not by a native speaker. They sit behind
 * the "yoruba" switch in the admin centre, which starts OFF: nobody sees a
 * word of this until someone who speaks Yorùbá has read every line and the
 * switch is turned on. Corrections go here, in one place, for both apps.
 *
 * Shared with the sibling app and drift-checked.
 */

export type Lang = "en" | "yo";
export type Words = Record<string, string>;

export const LANG_COOKIE = "lang";

export const YORUBA: Words = {
  // ── The way in ──────────────────────────────────────────────────────────
  "Welcome back.": "Ẹ káàbọ̀ padà.",
  "Sign in to join.": "Wọlé láti darapọ̀.",
  "Enter Oyun": "Wọ inú Oyun",
  "Enter Ìdílé": "Wọ inú Ìdílé",
  "Sign in with your email and password to continue your journey.":
    "Wọlé pẹ̀lú ímeèlì àti ọ̀rọ̀ aṣínà rẹ láti tẹ̀síwájú nínú ìrìn-àjò rẹ.",
  "Sign in with your email and password to return to your household.":
    "Wọlé pẹ̀lú ímeèlì àti ọ̀rọ̀ aṣínà rẹ láti padà sí ilé rẹ.",
  "You already have an account with this email — sign in, and you'll accept the invitation next.":
    "O ti ní àkáǹtì pẹ̀lú ímeèlì yìí — wọlé, lẹ́yìn náà ìwọ yóò gba ìpè náà.",
  Email: "Ímeèlì",
  Password: "Ọ̀rọ̀ aṣínà",
  "Your password": "Ọ̀rọ̀ aṣínà rẹ",
  "Sign in": "Wọlé",
  "Signing in…": "Ẹ dúró díẹ̀…",
  "One moment…": "Ẹ dúró díẹ̀…",
  "Email me a code": "Fi kóòdù ránṣẹ́ sí ímeèlì mi",
  "Email me a code instead": "Fi kóòdù ránṣẹ́ sí ímeèlì mi dípò rẹ̀",
  "Use my password instead": "Lo ọ̀rọ̀ aṣínà mi dípò rẹ̀",
  "Send a new code": "Fi kóòdù tuntun ránṣẹ́",
  "The 6-digit code": "Kóòdù oní-nọ́ńbà mẹ́fà",
  "Forgot password?": "Ṣé o gbàgbé ọ̀rọ̀ aṣínà?",
  "New to Oyun?": "Ṣé o jẹ́ tuntun sí Oyun?",
  "New to Ìdílé?": "Ṣé o jẹ́ tuntun sí Ìdílé?",
  "Create an account": "Ṣí àkáǹtì tuntun",
  "That email or password doesn't match. Please try again.":
    "Ímeèlì tàbí ọ̀rọ̀ aṣínà yẹn kò bá ara wọn mu. Jọ̀wọ́ gbìyànjú lẹ́ẹ̀kan sí i.",
  "Something went wrong. Please try again.": "Nǹkan kan kò lọ dáadáa. Jọ̀wọ́ gbìyànjú lẹ́ẹ̀kan sí i.",
  "That code didn't work. Check it, or send a new one.": "Kóòdù yẹn kò ṣiṣẹ́. Ṣàyẹ̀wò rẹ̀, tàbí fi òmíràn ránṣẹ́.",
  "Create your account.": "Ṣí àkáǹtì rẹ.",
  "Create your account to join.": "Ṣí àkáǹtì rẹ láti darapọ̀.",
  "Your name": "Orúkọ rẹ",
  "At least 8 characters": "Ó kéré tán, lẹ́tà mẹ́jọ",
  "Create account": "Ṣí àkáǹtì",
  "Creating your account…": "Ẹ dúró díẹ̀…",
  "We couldn't create your account.": "A kò lè ṣí àkáǹtì rẹ.",
  "Already have an account?": "Ṣé o ti ní àkáǹtì?",
  "You've been invited": "A ti pè ọ́",
  "Begin the journey": "Bẹ̀rẹ̀ ìrìn-àjò náà",
  "Begin at home": "Bẹ̀rẹ̀ nílé",
  "Set a name and password below. Once you're in, you'll accept the invitation and see how to stand with her.":
    "Fi orúkọ àti ọ̀rọ̀ aṣínà sí ìsàlẹ̀. Nígbà tí o bá wọlé, ìwọ yóò gba ìpè náà, ìwọ yóò sì rí bí o ṣe lè dúró tì í.",
  "We'll send you a warm welcome, then set you where you are on the journey. No account is ever a promise of outcome — only a companion for the road.":
    "A ó kí ọ káàbọ̀ tọ̀yàyàtọ̀yàyà, lẹ́yìn náà a ó fi ọ́ sí ibi tí o wà nínú ìrìn-àjò náà. Kò sí àkáǹtì tí ó jẹ́ ìlérí àbájáde — alábàárìn ọ̀nà nìkan ni.",
  "Set a name and password below. Once you're in, you'll accept the invitation and step into the household you were invited to.":
    "Fi orúkọ àti ọ̀rọ̀ aṣínà sí ìsàlẹ̀. Nígbà tí o bá wọlé, ìwọ yóò gba ìpè náà, ìwọ yóò sì wọ inú ilé tí a pè ọ́ sí.",
  "We'll send a warm welcome, then help you gather your house. No account is ever a promise of an outcome — only a help for the work God has given you.":
    "A ó kí ọ káàbọ̀ tọ̀yàyàtọ̀yàyà, lẹ́yìn náà a ó ràn ọ́ lọ́wọ́ láti kó ilé rẹ jọ. Kò sí àkáǹtì tí ó jẹ́ ìlérí àbájáde — ìrànlọ́wọ́ nìkan ni fún iṣẹ́ tí Ọlọ́run fi lé ọ lọ́wọ́.",

  // ── The menus ───────────────────────────────────────────────────────────
  Home: "Ilé",
  Journey: "Ìrìn-àjò",
  Life: "Ìgbésí ayé",
  Letters: "Lẹ́tà",
  Worship: "Ìjọsìn",
  Scripture: "Ìwé Mímọ́",
  Prayer: "Àdúrà",
  Appointments: "Ìpàdé",
  Care: "Ìtọ́jú",
  Nursery: "Yàrá ọmọ",
  Firsts: "Àwọn àkọ́kọ́",
  Circle: "Àwọn alátìlẹ́yìn",
  Registry: "Àkójọ ẹ̀bùn",
  "Shared outside": "Ohun tí a pín síta",
  "How this works": "Bí ó ṣe ń ṣiṣẹ́",
  Settings: "Ètò",
  Household: "Ilé",
  Health: "Ìlera",
  Papers: "Ìwé",
  Everyone: "Gbogbo ènìyàn",
  Tree: "Igi ìdílé",
  Dates: "Àwọn ọjọ́",
  Together: "Papọ̀",
  Board: "Pátákó",
  Confession: "Ìjẹ́wọ́",
  Legacy: "Ogún",
  Compound: "Agbo ilé",
  Remembrance: "Ìrántí",
  More: "Àwọn mìíràn",
  "Sign out": "Jáde",
  Search: "Wá",

  // ── The switch itself ───────────────────────────────────────────────────
  Language: "Èdè",
};

/** The words for a language, or nothing for English (the words as written). */
export function wordsFor(lang: Lang): Words | undefined {
  return lang === "yo" ? YORUBA : undefined;
}

/** These English words in the reader's language, or as they are. */
export function sayIn(words: Words | undefined, en: string): string {
  return words?.[en] ?? en;
}
