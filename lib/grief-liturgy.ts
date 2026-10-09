import { LAMENTS, type Lament } from "@/lib/lament";
import { HYMNS, type Hymn } from "@/lib/hymns";

/**
 * A daily rhythm for somebody standing beside a family who have lost a child.
 *
 * ── Why this exists at all ───────────────────────────────────────────────
 * Worship in Oyun is framed around a coming baby, so after a loss the whole
 * room was closed — to the circle, who were left with nothing, and to the
 * family themselves, who were sent to the lament companion on their home
 * screen and no further. Closing the circle out was the wrong silence: the
 * grandmother, the friend, the accountability partner are exactly the
 * people this house needs steady, and they had no daily place to stand.
 *
 * Closing the family out was the worse mistake. The reasoning was that this
 * liturgy's words would wound them, and that was true of the words — not of
 * the room. Grief is not a reason to stop drawing near to God; it is most
 * of the reason the psalms exist. So the family get worship too, in the
 * voice of the two people it happened to.
 *
 * ── Why it reuses the laments rather than writing new Scripture ──────────
 * lib/lament holds fifteen passages and reflections written for this, with a
 * discipline stated in its own file: what the text says, where it lands in
 * Christ, and only then what it means this morning — never rushing to
 * resolution, never making a loss into a lesson. Writing a second, parallel
 * set would have meant either duplicating that care or diluting it. The
 * family and their circle read the same passage on the same day, which is
 * the point of a circle.
 *
 * ── What is added, and why those two things ──────────────────────────────
 * A prayer, and one thing for today — each written twice, because the two
 * people reading this page are doing entirely different things.
 *
 * A supporter is interceding for a grief that is not theirs, and the words
 * for that are genuinely hard to find; their thing for today is one small
 * concrete act, because the honest problem around a loss is not willingness
 * but not knowing what to do, so people do nothing and the family reads the
 * silence as forgetting. None of those acts ask the family for anything, as
 * a grieving house should not have to host its own comforters.
 *
 * The bereaved are not interceding for anybody. Their prayers are first
 * person and several of them argue with God, because the psalms they sit
 * under do. And their thing for today is a permission, not a task — see
 * BEREAVED_STATIONS.
 *
 * ── What is deliberately absent ──────────────────────────────────────────
 * No catechism: that station is for children being raised in the home. No
 * "talk together": this is one person, often on their own, often far away.
 * And no explanations — nothing here tells the supporter to help the family
 * find a reason, because there isn't one to find and looking for one is how
 * well-meaning people wound.
 */
export interface GriefStation {
  /** Follows the day's passage. Written for the one praying, not the bereaved. */
  pray: string;
  /** One small, concrete thing, doable today, asking nothing of the family. */
  carry: string;
}

/**
 * The same two stations, in the mouths of the two people it happened to.
 *
 * ── Why they could not simply share the supporter's set ──────────────────
 * "Pray for them" and "do one thing for them" are exactly right for a
 * grandmother and grotesque for the mother. She is not interceding for
 * somebody else's grief; she is in it. So the prayer here is first person
 * and honest — several of them argue with God, because the psalms they sit
 * under do — and the thing for today is a permission rather than a task.
 *
 * ── Why a permission and not a task ──────────────────────────────────────
 * A bereaved woman does not need a to-do list; she is already failing at
 * the one she has. Every entry below is something she is allowed to stop
 * doing, or one small human act — eat, say his name, tell one person the
 * truth — that costs almost nothing on a day when almost nothing is
 * possible. None of them can be failed.
 */
export const BEREAVED_STATIONS: GriefStation[] = [
  {
    // Psalm 34:18 — the LORD is near to the broken-hearted.
    pray: "Lord, you say you are near to the broken-hearted. I cannot feel you at all. I am not going to pretend otherwise this morning — I am only going to hold you to it. Be near in the way you promised rather than the way I would recognise.",
    carry:
      "You do not have to be strong for anybody today. If someone needs comforting about your loss, they can wait.",
  },
  {
    // Psalm 22:1 — my God, why have you forsaken me?
    pray: "My God, why. I have no better prayer than that today and I am not going to dress it up. You put this question in your own book and your Son said it out loud, so it cannot be the thing that finally puts me outside your love. Here it is. Hear it.",
    carry:
      "Say the angry thing to God rather than swallowing it. He has heard it before, from his own Son, and he did not edit it out of Scripture.",
  },
  {
    // John 11:35 — Jesus wept.
    pray: "Lord Jesus, you stood at a grave you were about to open and you wept anyway. Then my tears are not a failure of faith. Weep with me. I would rather have you here in it than have it explained.",
    carry:
      "Cry when it comes, wherever it comes. Do not apologise for it, and do not schedule it for later.",
  },
  {
    // 2 Corinthians 1:3-4 — Father of mercies, God of all comfort.
    pray: "Father of mercies, I am not ready to be comforted so that I can one day comfort somebody else. Today I just need the comfort. Give me it in whatever form I can actually receive, even if that is only sleep.",
    carry:
      "Let one person help with something practical. You are not a burden; they are desperate to do something and do not know how to ask.",
  },
  {
    // Psalm 13:1 — how long?
    pray: "How long, Lord. Everyone else has gone back to their lives and I am still here. I am not asking you to hurry me. I am asking you not to leave while this takes as long as it takes.",
    carry:
      "Do not measure yourself against where you think you ought to be by now. There is no schedule, and anyone implying there is has not been here.",
  },
  {
    // Psalm 56:8 — you put my tears into your container.
    pray: "Lord, you keep my tears in your bottle and write them in your book. Then none of this is being wasted or forgotten, even the crying nobody saw. Keep what I cannot carry.",
    carry:
      "Write one sentence down — to your child, to God, or to nobody. It does not have to be good and no one has to read it.",
  },
  {
    // Psalm 139:13,16 — you knit me together.
    pray: "Lord, you formed our child and every one of their days was written in your book before one of them came to be. However short it was, it was a life, and you knew them. Thank you that they were never only ours to lose.",
    carry:
      "Use your child's name today, out loud, to someone who will not flinch. They were a person and they were yours.",
  },
  {
    // Revelation 21:4 — he will wipe away every tear.
    pray: "Lord, there is a day coming when you wipe away every tear and death is no more. It is not today, and I am not going to pretend it is. Hold the promise for me until I can hold it myself.",
    carry:
      "You are allowed to want it back rather than be comforted by heaven. Both can be true, and God is not offended by the first.",
  },
  {
    // Job 1:21 — the LORD gave, and the LORD has taken away.
    pray: "Lord, Job said this face down with his robe torn, and it was worship. If that is the only way I can say it today, take it that way. I bless you with a broken mouth because I have nowhere else to go.",
    carry:
      "You do not owe anyone an explanation of what God was doing. Neither did Job — and God said his friends were the ones who spoke wrongly.",
  },
  {
    // Psalm 30:5 — weeping may stay for the night.
    pray: "Lord, joy comes in the morning and it is still night here. I am not asking to skip to the morning. I am asking you to stay up with me through the night that is actually happening.",
    carry:
      "Get through the next hour, not the next year. That is the whole task today.",
  },
  {
    // Isaiah 66:13 — as one whom his mother comforts.
    pray: "Lord, you comfort as a mother comforts — and mothering is the thing that has just been taken from me. Come to the exact place that is emptiest. I have no words for it; you know where it is.",
    carry:
      "Eat something, and drink water. Grief is physical, and your body is doing work you cannot see.",
  },
  {
    // 1 Peter 5:7 — casting all your worries on him.
    pray: "Lord, you care for me. I am casting it on you because I cannot hold it — the fear of another loss, the fear that I did something, the fear that I will forget. Take them; I keep picking them back up.",
    carry:
      "Say one fear out loud to the person beside you. Grieving in separate rooms is how two people lose each other as well as a child.",
  },
  {
    // Psalm 130:1-2 — out of the depths.
    pray: "Out of the depths I cry to you. Lord, hear my voice. This is not a composed prayer and it is not going to be. Let your ears be attentive to the sound I am actually making.",
    carry:
      "If you cannot pray, read the psalm out loud instead. Borrowed words count; that is what they were given for.",
  },
  {
    // Romans 8:38-39 — nothing can separate us.
    pray: "Lord, nothing in death or life can separate me from your love in Christ — not this, and not the things I have said to you in the dark this week. Hold on to me. My grip has gone.",
    carry:
      "Your faith does not have to feel like anything today to still be real. Let someone else believe out loud on your behalf.",
  },
  {
    // 2 Samuel 12:23 — I will go to him.
    pray: "Lord, I cannot bring our child back, and David could not either. But he knew where he was going. Give me that — not as a tidy answer, but as ground I can stand on when nothing else holds.",
    carry:
      "Keep something. A scan photograph, a name written down, a date in the diary. You are not walking away from your child; you are walking towards them, the long way round.",
  },
];

/**
 * Paired one to one with LAMENTS, in order.
 *
 * The pairing is the whole design: prayer nine answers Job, prayer fifteen
 * answers David at the child's grave. Reordering either array breaks that, so
 * they are kept in step and the count is asserted below.
 */
export const GRIEF_STATIONS: GriefStation[] = [
  {
    // Psalm 34:18 — the LORD is near to the broken-hearted.
    pray: "Lord, you position yourself inside the wreckage and not above it. Be that near to them today — nearer than they can feel, on a morning when they may feel nothing at all. And keep me near too, without needing to be thanked for it.",
    carry:
      "Send one message that asks for no reply. Say the child's name in it if they have given one — people stop saying it, and the silence is its own grief.",
  },
  {
    // Psalm 22:1 — my God, why have you forsaken me?
    pray: "Father, they may be asking you why, and you have heard that question from your own Son's lips. Do not let me be the one who tries to answer it for you. Let them ask it as loudly as they need to, and hold them while they do.",
    carry:
      "If they say something angry or despairing to you this week, do not correct it. Say only that you heard them.",
  },
  {
    // John 11:35 — Jesus wept.
    pray: "Lord Jesus, you stood at a grave you were about to open and wept anyway. Give me your kind of presence: no hurry, no explanation, no fixing. Teach me to weep with those who weep and to stay after the crying stops.",
    carry:
      "Let yourself grieve this child too, properly, rather than staying composed for their sake. Your tears are not a burden to them; your composure might be.",
  },
  {
    // 2 Corinthians 1:3-4 — comfort we have received.
    pray: "Father of mercies, you comfort us so that we can comfort others with the comfort we ourselves received. Bring to mind what was given to me in my own worst season, and let me hand it on without making their grief about mine.",
    carry:
      "If you have walked this road, offer it once — briefly, and with no details unless they ask. If you have not, say plainly that you have not, and stay anyway.",
  },
  {
    // Psalm 13:1 — how long?
    pray: "Lord, how long. They are further into this than anybody around them remembers, and the world has moved on. Keep me from moving on. Give me the patience of someone who will still be here in the autumn.",
    carry:
      "Put a date in your diary six weeks from now to check on them. Most people vanish after a fortnight.",
  },
  {
    // Psalm 56:8 — you put my tears into your container.
    pray: "Lord, you keep their tears in your bottle and write them in your book. Nothing they are feeling is being wasted or overlooked by you. Let me treat their sorrow with the same care you do.",
    carry:
      "Write down what you remember of this pregnancy — a moment, a photograph, something they told you. Keep it. One day they will want to know somebody else was paying attention.",
  },
  {
    // Psalm 139:13,16 — you knit me together.
    pray: "Lord, you formed this child and every one of their days was written in your book before one of them came to be. However short that life was, it was a life, fully known by you. Let me speak of their child as a person and never as an event.",
    carry:
      "Use the past tense gently but use it: their child was real, and was theirs. Avoid \"it\" and avoid \"the pregnancy\".",
  },
  {
    // Revelation 21:4 — he will wipe away every tear.
    pray: "Lord, there is a day coming when you wipe away every tear and death is no more, and it is not today. Let me hold that hope without using it to hurry them towards it. Give me the honesty to say that this is not how it should be.",
    carry:
      "Do not offer heaven as a way of closing the conversation. If you speak of it, speak of it as something you are waiting for too.",
  },
  {
    // Job 1:21 — the LORD gave, and the LORD has taken away.
    pray: "Lord, Job said this face down with his robe torn, and you told his friends their tidy explanations were wrong. Guard my mouth. I would rather sit in silence for seven days than say one thing that adds to what they are carrying.",
    carry:
      "Delete the sentence that begins \"at least\". Also \"everything happens for a reason\", and every sentence explaining what God was doing.",
  },
  {
    // Psalm 30:5 — weeping may stay for the night.
    pray: "Lord, joy comes in the morning, and they are in the night. Do not let me rush the dawn on your behalf. Sit with me in their night, and keep me from measuring how long it ought to take.",
    carry:
      "Notice which hours are worst for them — the evening, the school run, Sunday morning — and be reachable then rather than at your own convenience.",
  },
  {
    // Isaiah 66:13 — as one whom his mother comforts.
    pray: "Lord, you comfort as a mother comforts, and that is the comfort she most wanted to give and cannot. Be tender with her in the exact place she is emptiest. And let me be practical enough to be useful.",
    carry:
      "Do something with your hands: a meal left on the step, a load of washing, the shopping. Do not ask what they need — decide something small and do it.",
  },
  {
    // 1 Peter 5:7 — casting all your worries on him.
    pray: "Lord, you care for them, and you can carry what I cannot. I bring you the things about them that keep me awake — their marriage, their faith, the mornings. Carry what I have no power to mend.",
    carry:
      "Pray for the one who is not being asked about. Partners and fathers are usually asked how she is doing and never how they are.",
  },
  {
    // Psalm 130:1-2 — out of the depths.
    pray: "Out of the depths they are crying to you. Lord, hear their voice, and hear mine on their behalf on the days they cannot pray at all. Let their church be a people who go down into the depths after them.",
    carry:
      "Pray for them out loud today, by name, on your own. And if they are not being cared for by their church, gently help that happen.",
  },
  {
    // Romans 8:38-39 — nothing can separate us.
    pray: "Lord, nothing in death or life can separate them from your love in Christ — not this, not their doubt, not the things they have said to you in the dark. Hold them when they have no grip left on you.",
    carry:
      "If their faith is shaky just now, do not test it. Keep believing on their behalf and tell them you are.",
  },
  {
    // 2 Samuel 12:23 — I will go to him.
    pray: "Lord, David could not bring the child back, but he knew where he was going. Give them that hope — not as a tidy answer, but as ground. And keep this child in my memory as well as theirs, for years, not weeks.",
    carry:
      "Mark the due date and the anniversary in your calendar now. Remembering the date a year from now, when everyone else has forgotten, may be the kindest thing you ever do for them.",
  },
];

if (
  GRIEF_STATIONS.length !== LAMENTS.length ||
  BEREAVED_STATIONS.length !== LAMENTS.length
) {
  // A loud failure at import rather than a silently mismatched pairing — a
  // prayer answering the wrong passage is worse here than in any other room.
  throw new Error(
    `grief-liturgy: ${GRIEF_STATIONS.length} beside / ${BEREAVED_STATIONS.length} bereaved stations for ${LAMENTS.length} laments`,
  );
}

/**
 * Hymns that can be sung in a house where a child has died.
 *
 * The general rotation is not safe here — it is full of songs about new life
 * and a good harvest, and one of those landing on the wrong morning would be
 * cruel. These are the ones the church has actually sung at gravesides: they
 * are named rather than filtered, so nothing new can wander into this list by
 * being added to the main pool.
 */
const GRIEF_HYMN_TITLES = [
  "Abide with Me",
  "It Is Well with My Soul",
  "The Lord's My Shepherd",
  "Rock of Ages",
  "How Firm a Foundation",
  "What a Friend We Have in Jesus",
  "Great Is Thy Faithfulness",
];

export const GRIEF_HYMNS: Hymn[] = GRIEF_HYMN_TITLES.map((t) => {
  const found = HYMNS.find((h) => h.title === t);
  if (!found) throw new Error(`grief-liturgy: no hymn titled ${t}`);
  return found;
});

function dayNumber(date: Date): number {
  return Math.floor(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) /
      86_400_000,
  );
}

/**
 * Today's grief liturgy.
 *
 * The lament is taken with the same day number the family's own lament
 * companion uses, so a grandmother and the mother she is praying for are on
 * the same passage — which is the difference between a circle and an audience.
 */
export function griefWorship(
  /**
   * Who is reading. "bereaved" is the mother and the one beside her;
   * "beside" is everybody else in the circle. Same passage, same hymn, and
   * two of the five stations in a different voice.
   */
  who: "bereaved" | "beside",
  date: Date = new Date(),
): {
  lament: Lament;
  station: GriefStation;
  hymn: Hymn;
} {
  const n = dayNumber(date);
  const pool = who === "bereaved" ? BEREAVED_STATIONS : GRIEF_STATIONS;
  return {
    lament: LAMENTS[n % LAMENTS.length],
    station: pool[n % pool.length],
    hymn: GRIEF_HYMNS[n % GRIEF_HYMNS.length],
  };
}
