/**
 * Scripture for grief — laments and the character of God for those walking
 * through the loss of a child. Honest, never glib. We do not promise that
 * everything will be fine; we point to the God who is near to the brokenhearted.
 * Rotates by the calendar day, like the other devotional rotations.
 */
export interface Lament {
  text: string;
  ref: string;
  reflection: string;
}

export const LAMENTS: Lament[] = [
  {
    text: "the LORD is near to those who have a broken heart, and saves those who have a crushed spirit.",
    ref: "Psalm 34:18",
    reflection:
      "He does not stand at a distance from your sorrow. He draws near to it. You are not alone in this, even when it feels like it.",
  },
  {
    text: "My God, my God, why have you forsaken me? Why are you so far from helping me, and from the words of my groaning?",
    ref: "Psalm 22:1",
    reflection:
      "These are the words of Jesus from the cross. Even the anguished cry, even the question, is welcome before God. You may bring Him your 'why.'",
  },
  {
    text: "Jesus wept.",
    ref: "John 11:35",
    reflection:
      "At the grave of one He loved, the Lord of life wept — though He knew resurrection was coming. Your tears are not a lack of faith. They are the love God gave you.",
  },
  {
    text: "Blessed be the God and Father of our Lord Jesus Christ, the Father of mercies and God of all comfort; who comforts us in all our affliction, that we may be able to comfort those who are in any affliction, through the comfort with which we ourselves are comforted by God.",
    ref: "2 Corinthians 1:3-4",
    reflection:
      "There is no affliction so deep that His comfort cannot reach it. He is not only powerful; He is tender.",
  },
  {
    text: "How long, the LORD? Will you forget me forever? How long will you hide your face from me?",
    ref: "Psalm 13:1",
    reflection:
      "Scripture gives you permission to grieve out loud. This psalm begins in the dark — and you are allowed to sit here as long as you need.",
  },
  {
    text: "You count my wanderings. You put my tears into your container. Aren’t they in your book?",
    ref: "Psalm 56:8",
    reflection:
      "Not one of your tears is unseen or wasted. God keeps them. He remembers. This grief matters to Him because your child matters to Him.",
  },
  {
    text: "For you formed my inmost being. You knit me together in my mother’s womb. Your eyes saw my body. In your book they were all written, the days that were ordained for me, when as yet there were none of them.",
    ref: "Psalm 139:13,16",
    reflection:
      "However brief, this life was known and formed by God. Your child was fully a person, fully seen, fully loved by their Maker.",
  },
  {
    text: "He will wipe away every tear from their eyes. Death will be no more; neither will there be mourning, nor crying, nor pain, any more. The first things have passed away.",
    ref: "Revelation 21:4",
    reflection:
      "This is not yet — and we do not rush there. But it is coming, and it is sure. Death does not get the last word.",
  },
  {
    text: "He said, “Naked I came out of my mother’s womb, and naked will I return there. the LORD gave, and the LORD has taken away. Blessed be the LORD’s name.",
    ref: "Job 1:21",
    reflection:
      "Job says this while tearing his robe in grief. Worship and weeping are not enemies. You can bless God and be broken at the same time.",
  },
  {
    text: "For his anger is but for a moment. His favor is for a lifetime. Weeping may stay for the night, but joy comes in the morning.",
    ref: "Psalm 30:5",
    reflection:
      "The night may be long — longer than anyone else understands. But the God who holds you now will hold you into the morning, whenever it comes.",
  },
  {
    text: "As one whom his mother comforts, so I will comfort you. You will be comforted in Jerusalem.",
    ref: "Isaiah 66:13",
    reflection:
      "God likens His comfort to a mother's — the very tenderness you carry for your own child. That is how He means to hold you now.",
  },
  {
    text: "casting all your worries on him, because he cares for you.",
    ref: "1 Peter 5:7",
    reflection:
      "You do not have to be strong today. Bring the weight — all of it — to the One who cares, and let others help you carry it too.",
  },
  {
    text: "Out of the depths I have cried to you, the LORD. Lord, hear my voice. Let your ears be attentive to the voice of my petitions.",
    ref: "Psalm 130:1-2",
    reflection:
      "From the depths — not from a tidy place — the psalmist cries. God hears the prayer that has no words but tears.",
  },
  {
    text: "For I am persuaded that neither death, nor life, nor angels, nor principalities, nor things present, nor things to come, nor powers, nor height, nor depth, nor any other created thing will be able to separate us from God’s love which is in Christ Jesus our Lord.",
    ref: "Romans 8:38-39",
    reflection:
      "Not even death can sever your child from the love of God, nor can it sever you. That love holds when nothing else does.",
  },
  {
    text: "But now he is dead, why should I fast? Can I bring him back again? I will go to him, but he will not return to me.",
    ref: "2 Samuel 12:23",
    reflection:
      "David grieved his child with hope — not that the child would come back, but that he would one day go to be with him. There is a comfort here that does not deny the loss.",
  },
];

function dayNumber(date: Date): number {
  return Math.floor(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) / 86_400_000,
  );
}

export function dailyLament(date: Date = new Date()): Lament {
  return LAMENTS[dayNumber(date) % LAMENTS.length];
}
