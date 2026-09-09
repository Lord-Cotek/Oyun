/**
 * Guidance for the circle walking with an expectant mother — an accountability
 * partner, a close relative, a friend. Their calling is to pray, to show up, to
 * encourage, and to point the family to Christ and His church — never to
 * overstep into the intimacy of the marriage or home.
 *
 * The counsel is shaped by where she actually is. What a woman needs in the
 * hidden, sick first weeks is not what she needs at 39 weeks, and neither is
 * what she needs at four months post-partum when the meals have stopped and the
 * tiredness has not. Each practice carries a verse it genuinely rests on —
 * quoted from the World English Bible embedded in this app, not paraphrased.
 */

export type WalkStage =
  | "first"
  | "second"
  | "third"
  | "nearly"
  | "newborn"
  | "infancy";

export interface Verse {
  text: string;
  ref: string;
}

export interface WalkPractice {
  text: string;
  verse: Verse;
}

/** Which season of walking alongside they are in. */
export function walkStage(pos: {
  born: boolean;
  week?: number;
  month?: number;
}): WalkStage {
  if (pos.born) return (pos.month ?? 0) <= 2 ? "newborn" : "infancy";
  const w = pos.week ?? 0;
  if (w <= 13) return "first";
  if (w <= 27) return "second";
  if (w <= 36) return "third";
  return "nearly";
}

export const STAGE_LABEL: Record<WalkStage, string> = {
  first: "The hidden months",
  second: "The growing months",
  third: "The heavy months",
  nearly: "Any day now",
  newborn: "The first weeks",
  infancy: "The long road",
};

// ── The verses, exactly as the World English Bible has them ────────────────
const V = {
  knit: { text: "For you formed my inmost being. You knit me together in my mother’s womb.", ref: "Psalm 139:13" },
  days: { text: "Your eyes saw my body. In your book they were all written, the days that were ordained for me, when as yet there were none of them.", ref: "Psalm 139:16" },
  heritage: { text: "Behold, children are a heritage of the LORD. The fruit of the womb is his reward.", ref: "Psalm 127:3" },
  help: { text: "My help comes from the LORD, who made heaven and earth.", ref: "Psalm 121:2" },
  refuge: { text: "God is our refuge and strength, a very present help in trouble.", ref: "Psalm 46:1" },
  brokenhearted: { text: "The LORD is near to those who have a broken heart, and saves those who have a crushed spirit.", ref: "Psalm 34:18" },
  anxious: { text: "In nothing be anxious, but in everything, by prayer and petition with thanksgiving, let your requests be made known to God.", ref: "Philippians 4:6" },
  rejoiceWeep: { text: "Rejoice with those who rejoice. Weep with those who weep.", ref: "Romans 12:15" },
  hospitality: { text: "contributing to the needs of the saints; given to hospitality.", ref: "Romans 12:13" },
  friend: { text: "A friend loves at all times; and a brother is born for adversity.", ref: "Proverbs 17:17" },
  buildUp: { text: "Therefore exhort one another, and build each other up, even as you also do.", ref: "1 Thessalonians 5:11" },
  ceaseless: { text: "Pray without ceasing.", ref: "1 Thessalonians 5:17" },
  believed: { text: "Blessed is she who believed, for there will be a fulfillment of the things which have been spoken to her from the Lord!", ref: "Luke 1:45" },
  burdens: { text: "Bear one another’s burdens, and so fulfill the law of Christ.", ref: "Galatians 6:2" },
  fearNot: { text: "Don’t you be afraid, for I am with you. Don’t be dismayed, for I am your God. I will strengthen you. Yes, I will help you. Yes, I will uphold you with the right hand of my righteousness.", ref: "Isaiah 41:10" },
  renew: { text: "but those who wait for the LORD will renew their strength. They will mount up with wings like eagles. They will run, and not be weary. They will walk, and not faint.", ref: "Isaiah 40:31" },
  gently: { text: "He will feed his flock like a shepherd. He will gather the lambs in his arm, and carry them in his bosom. He will gently lead those who have their young.", ref: "Isaiah 40:11" },
  comfort: { text: "As one whom his mother comforts, so I will comfort you.", ref: "Isaiah 66:13" },
  travail: { text: "A woman, when she gives birth, has sorrow because her time has come. But when she has delivered the child, she doesn’t remember the anguish any more, for the joy that a human being is born into the world.", ref: "John 16:21" },
  mercies: { text: "They are new every morning. Great is your faithfulness.", ref: "Lamentations 3:23" },
  provoke: { text: "Let’s consider how to provoke one another to love and good works,", ref: "Hebrews 10:24" },
  lift: { text: "For if they fall, the one will lift up his fellow; but woe to him who is alone when he falls, and doesn’t have another to lift him up.", ref: "Ecclesiastes 4:10" },
  oneMember: { text: "When one member suffers, all the members suffer with it. When one member is honored, all the members rejoice with it.", ref: "1 Corinthians 12:26" },
  speech: { text: "Let no corrupt speech proceed out of your mouth, but only what is good for building others up as the need may be, that it may give grace to those who hear.", ref: "Ephesians 4:29" },
  prayForOne: { text: "Confess your offenses to one another, and pray for one another, that you may be healed. The insistent prayer of a righteous person is powerfully effective.", ref: "James 5:16" },
  steadfast: { text: "Continue steadfastly in prayer, watching in it with thanksgiving,", ref: "Colossians 4:2" },
  visited: { text: "I was sick, and you visited me.", ref: "Matthew 25:36" },
  bless: { text: "The LORD bless you, and keep you.", ref: "Numbers 6:24" },
} satisfies Record<string, Verse>;

// ── Day by day ─────────────────────────────────────────────────────────────
const DAILY: Record<WalkStage, WalkPractice[]> = {
  first: [
    { text: "She may be exhausted and unwell while the world sees nothing at all. Ask how she truly is, and let the answer be enough.", verse: V.knit },
    { text: "This news may still be hers to tell. Don’t pass on what isn’t yours to share.", verse: V.speech },
    { text: "Fear of loss is common now, and rarely said out loud. Pray for peace without brushing the fear aside.", verse: V.anxious },
    { text: "Offer one concrete kindness — a meal, an errand — rather than a vague “let me know”.", verse: V.hospitality },
    { text: "Ask about her, not only about the baby. She is a person, not a vessel.", verse: V.friend },
    { text: "Give thanks for a life already being formed, hidden from every eye but God’s.", verse: V.days },
  ],
  second: [
    { text: "Rejoice out loud. Tell her plainly what you thank God for in her.", verse: V.rejoiceWeep },
    { text: "Pray for their marriage, not only the pregnancy — that these months would knit them closer.", verse: V.lift },
    { text: "Encourage her faith. She believed God before there was anything to show.", verse: V.believed },
    { text: "Build her up in front of others, not only to her face.", verse: V.buildUp },
    { text: "Remember the father. He is carrying a weight nobody thinks to ask about.", verse: V.burdens },
    { text: "Give thanks that this child is a gift from the Lord, never an achievement.", verse: V.heritage },
  ],
  third: [
    { text: "She is tired in a way that sleep doesn’t fix. Carry one real thing for her this week.", verse: V.burdens },
    { text: "Fear of labour is real. Don’t argue her out of it — pray her through it.", verse: V.fearNot },
    { text: "Ask about the appointments, and remember what she tells you.", verse: V.visited },
    { text: "Waiting is its own work. Pray for strength that is renewed daily, not stored up.", verse: V.renew },
    { text: "Be a shelter for her — and keep pointing her to the true one.", verse: V.refuge },
  ],
  nearly: [
    { text: "Be reachable without being intrusive. “Praying for you today” is enough.", verse: V.ceaseless },
    { text: "Pray for a safe delivery, and for courage in the hours she cannot plan.", verse: V.help },
    { text: "Remind her where this is going. The sorrow gives way to joy.", verse: V.travail },
    { text: "Speak the Lord’s blessing over this family out loud, by name.", verse: V.bless },
    { text: "Have your practical help ready before it is needed, not after.", verse: V.hospitality },
  ],
  newborn: [
    { text: "Visit briefly, bring food, wash something, and leave early.", verse: V.hospitality },
    { text: "Don’t ask about the baby first. Ask how she is.", verse: V.comfort },
    { text: "The nights are long. Send a word she can read at 3am, not only in daylight.", verse: V.mercies },
    { text: "The Lord leads gently those who have their young. Be gentle in the same way.", verse: V.gently },
    { text: "If she is low, stay near and resist the urge to fix it.", verse: V.brokenhearted },
    { text: "Pray with her, not only for her, when you are together.", verse: V.prayForOne },
  ],
  infancy: [
    { text: "The meals stopped months ago; the tiredness didn’t. Keep showing up.", verse: V.lift },
    { text: "Rejoice at the small things. They are not small to her.", verse: V.oneMember },
    { text: "Point them to their local church. You are a help, never a substitute for the Body of Christ.", verse: V.provoke },
    { text: "Ask gently how she is walking with the Lord. Motherhood can crowd out the quiet.", verse: V.steadfast },
    { text: "Follow up on what she told you last time. Being remembered is a quiet gift.", verse: V.friend },
  ],
};

// ── Week by week — a bigger rhythm than a single day ───────────────────────
const WEEKLY: Record<WalkStage, WalkPractice[]> = {
  first: [
    { text: "This week, pray daily for the hidden months — for a child being formed unseen, and for a body doing quiet, costly work.", verse: V.knit },
    { text: "This week, guard her privacy. Let her tell her own news, in her own time.", verse: V.speech },
    { text: "This week, take one thing off her plate without being asked.", verse: V.hospitality },
    { text: "This week, pray for her fears as honestly as for her joys.", verse: V.anxious },
  ],
  second: [
    { text: "This week, write down what you thank God for in her — then actually tell her.", verse: V.buildUp },
    { text: "This week, pray for their marriage: that these months would draw them together, not apart.", verse: V.lift },
    { text: "This week, ask the father how he is, and listen properly to the answer.", verse: V.burdens },
    { text: "This week, give thanks that this child is a gift, not a project.", verse: V.heritage },
  ],
  third: [
    { text: "This week, decide the help you will give after the birth — and tell them what it is.", verse: V.hospitality },
    { text: "This week, pray specifically for a safe delivery and a steady heart.", verse: V.fearNot },
    { text: "This week, ask what she is dreading, and carry it to God with her.", verse: V.prayForOne },
    { text: "This week, pray she would wait on the Lord and find her strength renewed.", verse: V.renew },
  ],
  nearly: [
    { text: "This week, be ready: phone near, plans loose, prayers constant.", verse: V.ceaseless },
    { text: "This week, speak the Lord’s blessing over this household out loud.", verse: V.bless },
    { text: "This week, pray for the hours she can neither plan nor control.", verse: V.help },
    { text: "This week, remind her where the pain is going — to joy.", verse: V.travail },
  ],
  newborn: [
    { text: "This week, bring a meal and ask nothing in return — not even a visit.", verse: V.hospitality },
    { text: "This week, take one night-time worry to God on her behalf, by name.", verse: V.mercies },
    { text: "This week, ask how she is in herself, not how the baby is feeding.", verse: V.comfort },
    { text: "This week, watch for signs she is sinking — and stay close if she is.", verse: V.brokenhearted },
  ],
  infancy: [
    { text: "This week, keep the promise you made months ago. Faithfulness outlasts enthusiasm.", verse: V.lift },
    { text: "This week, encourage them toward their church family, not only toward you.", verse: V.provoke },
    { text: "This week, rejoice with them over something small and ordinary.", verse: V.oneMember },
    { text: "This week, pray for yourself: that you would be steady, humble, and unhurried.", verse: V.steadfast },
  ],
};

function dayNumber(date: Date): number {
  return Math.floor(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) /
      86_400_000,
  );
}

/** Today's practice for this stage — rotates each day. */
export function dailyWalk(stage: WalkStage, date: Date = new Date()): WalkPractice {
  const list = DAILY[stage];
  return list[dayNumber(date) % list.length];
}

/** This week's bigger focus for this stage — rotates each week. */
export function weeklyWalk(stage: WalkStage, date: Date = new Date()): WalkPractice {
  const list = WEEKLY[stage];
  return list[Math.floor(dayNumber(date) / 7) % list.length];
}
