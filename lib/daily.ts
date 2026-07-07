/**
 * A daily rotation layered on top of the weekly stage content. The stage's own
 * scripture still changes each week; this adds a fresh verse + short reflection
 * every day, chosen deterministically by the calendar day so it's stable for
 * everyone within a day and moves on the next.
 */
export interface Devotion {
  text: string;
  ref: string;
  reflection: string;
}

export const DAILY_DEVOTIONS: Devotion[] = [
  { text: "The LORD is my shepherd; I shall not want.", ref: "Psalm 23:1", reflection: "Whatever today holds, you are led by One who lacks nothing." },
  { text: "She is clothed with strength and dignity, and she laughs at the time to come.", ref: "Proverbs 31:25", reflection: "Strength today, and no need to fear tomorrow — both are gifts from His hand." },
  { text: "Cast all your anxieties on him, because he cares for you.", ref: "1 Peter 5:7", reflection: "Your worry is not a burden to Him; He invites it, because He loves you." },
  { text: "Be still, and know that I am God.", ref: "Psalm 46:10", reflection: "Before you do anything today, be still. He is God, and you are held." },
  { text: "The LORD your God is in your midst, a mighty one who will save.", ref: "Zephaniah 3:17", reflection: "He is not distant. He is near, and He delights over you with singing." },
  { text: "Trust in the LORD with all your heart, and do not lean on your own understanding.", ref: "Proverbs 3:5", reflection: "You do not have to understand it all today. You only have to trust the One who does." },
  { text: "Children are a heritage from the LORD, the fruit of the womb a reward.", ref: "Psalm 127:3", reflection: "This little life is a gift given, never a wage earned." },
  { text: "For I know the plans I have for you, declares the LORD, plans for welfare and not for evil.", ref: "Jeremiah 29:11", reflection: "His plans reach further than you can see, and they are good." },
  { text: "God is our refuge and strength, a very present help in trouble.", ref: "Psalm 46:1", reflection: "Not a help far off, but a very present one — here, now, in this." },
  { text: "The steadfast love of the LORD never ceases; his mercies never come to an end.", ref: "Lamentations 3:22", reflection: "They are new this morning. Whatever yesterday was, His mercy meets you fresh today." },
  { text: "Fear not, for I am with you; be not dismayed, for I am your God.", ref: "Isaiah 41:10", reflection: "The antidote to fear is not certainty about tomorrow, but His presence today." },
  { text: "He gives power to the faint, and to him who has no might he increases strength.", ref: "Isaiah 40:29", reflection: "On the days you have nothing left, He is the God who gives." },
  { text: "Weeping may tarry for the night, but joy comes with the morning.", ref: "Psalm 30:5", reflection: "Whatever the night has held, morning belongs to the God of joy." },
  { text: "Come to me, all who labor and are heavy laden, and I will give you rest.", ref: "Matthew 11:28", reflection: "You were not made to carry it alone. Bring the weight to Him." },
  { text: "My grace is sufficient for you, for my power is made perfect in weakness.", ref: "2 Corinthians 12:9", reflection: "Your weakness today is not a problem to hide, but a place for His strength." },
  { text: "The LORD will fight for you, and you have only to be silent.", ref: "Exodus 14:14", reflection: "Some battles are not yours to win, only His to fight while you rest." },
  { text: "For you formed my inward parts; you knitted me together in my mother's womb.", ref: "Psalm 139:13", reflection: "The same careful hands that made you are at work in your child." },
  { text: "And we know that for those who love God all things work together for good.", ref: "Romans 8:28", reflection: "Not all things are good — but in His hands, all things are working toward it." },
  { text: "The LORD bless you and keep you; the LORD make his face to shine upon you.", ref: "Numbers 6:24-25", reflection: "Receive today as one on whom the face of God shines." },
  { text: "Peace I leave with you; my peace I give to you. Not as the world gives do I give.", ref: "John 14:27", reflection: "His peace does not depend on circumstances. Let it settle your heart today." },
  { text: "Let us then with confidence draw near to the throne of grace.", ref: "Hebrews 4:16", reflection: "You are welcome to come — not when you are strong, but exactly as you are." },
  { text: "He heals the brokenhearted and binds up their wounds.", ref: "Psalm 147:3", reflection: "No ache is too small or too deep for the tenderness of God." },
  { text: "The eternal God is your dwelling place, and underneath are the everlasting arms.", ref: "Deuteronomy 33:27", reflection: "However far you feel you might fall, His arms are already underneath." },
  { text: "I sought the LORD, and he answered me and delivered me from all my fears.", ref: "Psalm 34:4", reflection: "Bring the fear into the light of His presence, and watch it lose its grip." },
  { text: "Rejoice in hope, be patient in tribulation, be constant in prayer.", ref: "Romans 12:12", reflection: "Three quiet anchors for an ordinary day: hope, patience, prayer." },
  { text: "The LORD is near to the brokenhearted and saves the crushed in spirit.", ref: "Psalm 34:18", reflection: "He does not stand back from your sorrow. He draws near to it." },
  { text: "Whom have I in heaven but you? And there is nothing on earth that I desire besides you.", ref: "Psalm 73:25", reflection: "Every good gift points home to the Giver Himself." },
  { text: "But they who wait for the LORD shall renew their strength.", ref: "Isaiah 40:31", reflection: "Waiting is not wasted time. It is where strength is renewed." },
  { text: "This is the day that the LORD has made; let us rejoice and be glad in it.", ref: "Psalm 118:24", reflection: "Today was made by Him and given to you. Receive it as a gift." },
  { text: "Cast your burden on the LORD, and he will sustain you.", ref: "Psalm 55:22", reflection: "He does not just take the burden — He holds you up under it." },
  { text: "For nothing will be impossible with God.", ref: "Luke 1:37", reflection: "The word spoken over Mary is spoken still: nothing is beyond His reach." },
  { text: "Let the little children come to me, and do not hinder them.", ref: "Mark 10:14", reflection: "The tenderness of Christ toward children is His heart toward yours." },
  { text: "You keep him in perfect peace whose mind is stayed on you, because he trusts in you.", ref: "Isaiah 26:3", reflection: "Peace follows where your mind rests. Rest it on Him today." },
  { text: "Give thanks to the LORD, for he is good; his steadfast love endures forever.", ref: "Psalm 107:1", reflection: "Begin today by naming one good thing. His love is behind it." },
  { text: "The LORD is my light and my salvation; whom shall I fear?", ref: "Psalm 27:1", reflection: "When He is your light, the dark loses its power to frighten." },
  { text: "Behold, children are a gift of the LORD.", ref: "Psalm 127:3", reflection: "Held, hoped for, or on the way — this child is His gift to you." },
  { text: "In peace I will both lie down and sleep; for you alone, O LORD, make me dwell in safety.", ref: "Psalm 4:8", reflection: "Rest tonight is an act of trust. He keeps watch while you sleep." },
  { text: "Blessed be the God and Father of our Lord Jesus Christ, the Father of mercies and God of all comfort.", ref: "2 Corinthians 1:3", reflection: "He is not only powerful, but the very Father of mercies, comforting you." },
  { text: "I have said these things to you, that in me you may have peace. Take heart; I have overcome the world.", ref: "John 16:33", reflection: "Trouble is real, but it does not have the last word. He has overcome." },
  { text: "The grass withers, the flower fades, but the word of our God will stand forever.", ref: "Isaiah 40:8", reflection: "When everything else feels fragile, His word is the ground that holds." },
  { text: "Delight yourself in the LORD, and he will give you the desires of your heart.", ref: "Psalm 37:4", reflection: "As you delight in Him, He reshapes what your heart most longs for." },
  { text: "Be strong and courageous. Do not be frightened, for the LORD your God is with you wherever you go.", ref: "Joshua 1:9", reflection: "Courage is not the absence of fear, but the presence of God with you." },
];

/** Days since the Unix epoch (UTC) — stable within a day, +1 each new day. */
function dayNumber(date: Date): number {
  return Math.floor(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) / 86_400_000,
  );
}

export function dailyDevotion(date: Date = new Date()): Devotion {
  const i = dayNumber(date) % DAILY_DEVOTIONS.length;
  return DAILY_DEVOTIONS[i];
}
