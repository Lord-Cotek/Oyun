/**
 * A daily-rotating layer of small, concrete ways for a husband or
 * accountability partner to care for her — laid *underneath* each stage's
 * anchored counsel (`Stage.partnerFocus`) so what he sees changes day to day,
 * not just week to week. Each is one doable act, tender and unhurried, many
 * anchored in a line of Scripture.
 *
 * Selection is deterministic per day (so it's stable within a day and matches
 * across her circle) and offset by the stage, so two people at different points
 * in the journey aren't handed the same nudge on the same day.
 */
export interface CareNudge {
  act: string;
  ref?: string;
}

const PREGNANCY_CARE: CareNudge[] = [
  { act: "Bring her a glass of water before she has to ask, and quietly thank God for the life she is carrying." },
  { act: "Ask one specific question about how her body feels today, then just listen without fixing it.", ref: "James 1:19" },
  { act: "Take one chore off her list without being asked and without announcing it." },
  { act: "Put your hand on her belly tonight and pray a single sentence over the baby." },
  { act: "Tell her one thing you admire about how she is carrying this child." },
  { act: "Send her a message in the middle of the day so she knows she is on your mind." },
  { act: "Guard her rest tonight — take the last task yourself and let the evening be quiet.", ref: "Psalm 127:2" },
  { act: "Read one psalm aloud to her before sleep.", ref: "Psalm 121" },
  { act: "Ask what she is afraid of this week, and carry it to God with her instead of explaining it away." },
  { act: "Make the meal, or order it, so she does not have to decide what to eat." },
  { act: "Speak of the baby as a gift today, never as a demand.", ref: "Psalm 127:3" },
  { act: "Rub her feet or her shoulders without being asked." },
  { act: "Thank her out loud, in front of others, for the work of carrying this child.", ref: "Proverbs 31:28" },
  { act: "Pray Psalm 139 over the child God is knitting together in secret.", ref: "Psalm 139:13" },
  { act: "Notice one worry behind her eyes and gently name it with her." },
  { act: "Give a soft answer when you are both tired tonight.", ref: "Proverbs 15:1" },
  { act: "Plan one small thing she would enjoy, and take the planning off her." },
  { act: "Ask how you can pray for her right now, then pray it out loud." },
  { act: "Let her sleep in tomorrow; handle the morning yourself." },
  { act: "Write her one line telling her you are in this with her, from the first day." },
  { act: "Sit with her in silence when words are not what she needs." },
  { act: "Give thanks at dinner for how far God has already brought this pregnancy." },
  { act: "Take the heavy thing out of her hands before she lifts it." },
  { act: "Remind her that God finishes what he starts.", ref: "Philippians 1:6" },
  { act: "Ask about the baby's movements and delight with her in them." },
  { act: "Shield her from one needless stress today — a call, an errand, a decision." },
  { act: "Pray for the birth ahead, unhurried, holding her hand." },
  { act: "Tell her she is not carrying this alone, and show it in what you do next." },
];

const INFANCY_CARE: CareNudge[] = [
  { act: "Take a night waking so she can sleep one unbroken stretch." },
  { act: "Bring her water and a snack while she feeds the baby." },
  { act: "Ask what would help most in the next hour, then simply do it." },
  { act: "Hold the baby so she can shower without rushing." },
  { act: "Do the dishes or the laundry before she notices they are waiting." },
  { act: "Tell her she is a good mother, especially on the tired days.", ref: "Proverbs 31:28" },
  { act: "Pray over the baby's sleep together tonight." },
  { act: "Take the baby out for a short walk so the house is quiet for her." },
  { act: "Give grace instead of a sharp word when you are both worn thin.", ref: "Ephesians 4:32" },
  { act: "Lead two minutes of family worship — even one verse and a prayer.", ref: "Deuteronomy 6:7" },
  { act: "Ask how her heart is, not only how the baby is." },
  { act: "Handle one feed or one change without being asked." },
  { act: "Give thanks aloud for the child the Lord has granted you.", ref: "Psalm 127:3" },
  { act: "Let her rest while you take the fussy hour." },
  { act: "Say the specific thing you are grateful she did today." },
  { act: "Speak calm into the tired house instead of adding pressure." },
  { act: "Pray Psalm 121 over your home before you sleep.", ref: "Psalm 121" },
  { act: "Notice when she is running on empty and step in before she asks." },
  { act: "Sing or read Scripture over the baby so your voice carries the Word." },
  { act: "Take the whole outing today — the bag, the buckling, the loading." },
  { act: "Protect a pocket of quiet for her today, even ten minutes alone." },
  { act: "Remind her that the grace for today is enough.", ref: "2 Corinthians 12:9" },
  { act: "Tidy one room so she wakes to a little less to do." },
  { act: "Ask her to name one worry, then pray it back to God together." },
  { act: "Show tender compassion to both mother and child, as the Father does to you.", ref: "Psalm 103:13" },
  { act: "Thank God together for one small mercy from this day.", ref: "Lamentations 3:23" },
  { act: "Take the baby at dawn so she gets the first hour to herself." },
  { act: "Tell her you see how hard she is working, and that you are proud of her." },
];

/** Whole days since the epoch — a stable, per-day key for rotation. */
export function dayKey(now: Date = new Date()): number {
  return Math.floor(now.getTime() / 86_400_000);
}

/**
 * The care nudge for a given day. `offset` (e.g. the stage index) shifts where
 * the rotation sits so different points in the journey don't land on the same
 * nudge the same day.
 */
export function partnerDailyCare(
  phase: "pregnancy" | "infancy",
  key: number,
  offset = 0,
): CareNudge {
  const pool = phase === "infancy" ? INFANCY_CARE : PREGNANCY_CARE;
  const i = (((key + offset) % pool.length) + pool.length) % pool.length;
  return pool[i];
}
