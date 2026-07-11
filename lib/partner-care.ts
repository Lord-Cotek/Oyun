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
  { act: "Pray for the doctors and midwives who will care for her and the baby." },
  { act: "Ask her what she needs from you this week that she has not said out loud." },
  { act: "Bring home one small thing she loves — a fruit, a tea, a treat." },
  { act: "Put your phone down when she is talking and give her your eyes." },
  { act: "Take tonight's worry to prayer with her rather than to your own head.", ref: "1 Peter 5:7" },
  { act: "Tell her the home is safe because God is her keeper, and you are here.", ref: "Psalm 121:5" },
  { act: "Handle the errand she has been quietly dreading." },
  { act: "Read Psalm 91 over her and the baby.", ref: "Psalm 91" },
  { act: "Ask her forgiveness quickly if you were short with her today." },
  { act: "Let her rest without guilt — take whatever she would feel guilty leaving." },
  { act: "Speak life over the baby by name, or by 'little one' if there is no name yet." },
  { act: "Clear her evening before she asks — you have already seen she is tired." },
  { act: "Give thanks for her strength out loud, where she can hear it." },
  { act: "Sit close on the couch tonight; choose presence over productivity." },
  { act: "Pray that God would form a soft, believing heart in this child.", ref: "Ezekiel 36:26" },
  { act: "Do the thing she asked for twice — now, before she asks a third time." },
  { act: "When fear of the birth rises, pray Isaiah 41:10 over her by name.", ref: "Isaiah 41:10" },
  { act: "Take a slow walk together and let the conversation wander." },
  { act: "Quietly finish a task she thinks is 'hers' and let her find it done." },
  { act: "Thank God at bedtime for another day of the baby's hidden life." },
  { act: "Carry the weight of money and plans this week so she does not have to." },
  { act: "Ask how her walk with the Lord is, and pray with her about it." },
  { act: "Be the steady one today; keep the house calm." },
  { act: "Bring her water and her vitamins without being asked." },
  { act: "Tell her one hope you carry for who this child will become in Christ." },
  { act: "Guard her from a draining conversation or person today." },
  { act: "When anxiety rises, pray Philippians 4:6–7 with her.", ref: "Philippians 4:6–7" },
  { act: "Prepare one thing for the baby's arrival so she sees you readying too." },
  { act: "Hold her when she cries, and do not try to fix it." },
  { act: "Give thanks for the gift of her, apart from the pregnancy." },
  { act: "Ask what would make tomorrow lighter, and set it up tonight." },
  { act: "Kneel and pray together before sleep, thanking God for his faithfulness so far." },
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
  { act: "Get up first at dawn so she knows the baby is handled." },
  { act: "Prepare her a warm meal she does not have to think about." },
  { act: "Take the baby to another room so she can nap without listening for cries." },
  { act: "Pray for wisdom to shepherd this child's heart toward Christ.", ref: "Proverbs 22:6" },
  { act: "Do a load of the baby's laundry and fold it away." },
  { act: "Ask her what part of today was hardest, and just listen." },
  { act: "Bring her coffee or tea the way she likes it, unasked." },
  { act: "Cover the whole evening routine tonight — bath, bottle, bed." },
  { act: "Tell her the specific ways you have watched her love the baby well." },
  { act: "Pray the blessing of Numbers 6:24–26 over your child tonight.", ref: "Numbers 6:24–26" },
  { act: "Handle the next diaper before she moves toward it." },
  { act: "Guard her from the comparison and noise of everyone's opinions." },
  { act: "Sit with her in the quiet after the baby is down — no screens." },
  { act: "Thank God together for how the baby has grown this week." },
  { act: "Take the fussy witching hour so she can breathe." },
  { act: "Ask how you can pray for her as a mother, then pray it aloud." },
  { act: "Wear the baby and go for a walk so she has the house to herself." },
  { act: "Make peace fast if tiredness made you sharp.", ref: "Ephesians 4:26" },
  { act: "Read a psalm aloud while she feeds." },
  { act: "Notice the chore she keeps eyeing and simply do it." },
  { act: "Speak calm and gratitude at dinner instead of tallying the day's stress." },
  { act: "Pray that this child would love the Lord with all their heart.", ref: "Deuteronomy 6:5" },
  { act: "Give her a full hour off, and do not ask what to do — figure it out." },
  { act: "Tell her she is not failing; she is faithful." },
  { act: "Take a night feed with the bottle so she gets a longer sleep." },
  { act: "Lead a short thanksgiving before bed for the day's mercies.", ref: "1 Thessalonians 5:18" },
  { act: "Rock the baby so she can eat with both hands, warm and slow." },
  { act: "Ask about her heart's weariness, not only her body's." },
  { act: "Prepare tomorrow's bag and bottles tonight." },
  { act: "Aim to raise this child in the Lord without provoking them.", ref: "Ephesians 6:4" },
  { act: "Hold her before you both collapse, and remind her you are a team." },
  { act: "Kneel together and give thanks for the child God has entrusted to you." },
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
