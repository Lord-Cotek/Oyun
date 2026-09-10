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
  { text: "the LORD is my shepherd: I shall lack nothing.", ref: "Psalm 23:1", reflection: "Whatever today holds, you are led by One who lacks nothing." },
  { text: "Strength and dignity are her clothing. She laughs at the time to come.", ref: "Proverbs 31:25", reflection: "Strength today, and no need to fear tomorrow — both are gifts from His hand." },
  { text: "casting all your worries on him, because he cares for you.", ref: "1 Peter 5:7", reflection: "Your worry is not a burden to Him; He invites it, because He loves you." },
  { text: "Be still, and know that I am God. I will be exalted among the nations. I will be exalted in the earth.", ref: "Psalm 46:10", reflection: "Before you do anything today, be still. He is God, and you are held." },
  { text: "the LORD, your God, is among you, a mighty one who will save. He will rejoice over you with joy. He will calm you in his love. He will rejoice over you with singing.", ref: "Zephaniah 3:17", reflection: "He is not distant. He is near, and He delights over you with singing." },
  { text: "Trust in the LORD with all your heart, and don’t lean on your own understanding.", ref: "Proverbs 3:5", reflection: "You do not have to understand it all today. You only have to trust the One who does." },
  { text: "Behold, children are a heritage of the LORD. The fruit of the womb is his reward.", ref: "Psalm 127:3", reflection: "This little life is a gift given, never a wage earned." },
  { text: "For I know the thoughts that I think toward you,” says the LORD, “thoughts of peace, and not of evil, to give you hope and a future.", ref: "Jeremiah 29:11", reflection: "His plans reach further than you can see, and they are good." },
  { text: "God is our refuge and strength, a very present help in trouble.", ref: "Psalm 46:1", reflection: "Not a help far off, but a very present one — here, now, in this." },
  { text: "It is because of the LORD’s loving kindnesses that we are not consumed, because his compassion doesn’t fail.", ref: "Lamentations 3:22", reflection: "They are new this morning. Whatever yesterday was, His mercy meets you fresh today." },
  { text: "Don’t you be afraid, for I am with you. Don’t be dismayed, for I am your God. I will strengthen you. Yes, I will help you. Yes, I will uphold you with the right hand of my righteousness.", ref: "Isaiah 41:10", reflection: "The antidote to fear is not certainty about tomorrow, but His presence today." },
  { text: "He gives power to the weak. He increases the strength of him who has no might.", ref: "Isaiah 40:29", reflection: "On the days you have nothing left, He is the God who gives." },
  { text: "For his anger is but for a moment. His favor is for a lifetime. Weeping may stay for the night, but joy comes in the morning.", ref: "Psalm 30:5", reflection: "Whatever the night has held, morning belongs to the God of joy." },
  { text: "Come to me, all you who labor and are heavily burdened, and I will give you rest.", ref: "Matthew 11:28", reflection: "You were not made to carry it alone. Bring the weight to Him." },
  { text: "He has said to me, “My grace is sufficient for you, for my power is made perfect in weakness.” Most gladly therefore I will rather glory in my weaknesses, that the power of Christ may rest on me.", ref: "2 Corinthians 12:9", reflection: "Your weakness today is not a problem to hide, but a place for His strength." },
  { text: "the LORD will fight for you, and you shall be still.", ref: "Exodus 14:14", reflection: "Some battles are not yours to win, only His to fight while you rest." },
  { text: "For you formed my inmost being. You knit me together in my mother’s womb.", ref: "Psalm 139:13", reflection: "The same careful hands that made you are at work in your child." },
  { text: "We know that all things work together for good for those who love God, for those who are called according to his purpose.", ref: "Romans 8:28", reflection: "Not all things are good — but in His hands, all things are working toward it." },
  { text: "the LORD bless you, and keep you. the LORD make his face to shine on you, and be gracious to you.", ref: "Numbers 6:24-25", reflection: "Receive today as one on whom the face of God shines." },
  { text: "Peace I leave with you. My peace I give to you; not as the world gives, I give to you. Don’t let your heart be troubled, neither let it be fearful.", ref: "John 14:27", reflection: "His peace does not depend on circumstances. Let it settle your heart today." },
  { text: "Let’s therefore draw near with boldness to the throne of grace, that we may receive mercy and may find grace for help in time of need.", ref: "Hebrews 4:16", reflection: "You are welcome to come — not when you are strong, but exactly as you are." },
  { text: "He heals the broken in heart, and binds up their wounds.", ref: "Psalm 147:3", reflection: "No ache is too small or too deep for the tenderness of God." },
  { text: "The eternal God is your dwelling place. Underneath are the everlasting arms. He thrust out the enemy from before you, and said, ‘Destroy!", ref: "Deuteronomy 33:27", reflection: "However far you feel you might fall, His arms are already underneath." },
  { text: "I sought the LORD, and he answered me, and delivered me from all my fears.", ref: "Psalm 34:4", reflection: "Bring the fear into the light of His presence, and watch it lose its grip." },
  { text: "rejoicing in hope; enduring in troubles; continuing steadfastly in prayer;", ref: "Romans 12:12", reflection: "Three quiet anchors for an ordinary day: hope, patience, prayer." },
  { text: "the LORD is near to those who have a broken heart, and saves those who have a crushed spirit.", ref: "Psalm 34:18", reflection: "He does not stand back from your sorrow. He draws near to it." },
  { text: "Whom do I have in heaven? There is no one on earth whom I desire besides you.", ref: "Psalm 73:25", reflection: "Every good gift points home to the Giver Himself." },
  { text: "but those who wait for the LORD will renew their strength. They will mount up with wings like eagles. They will run, and not be weary. They will walk, and not faint.", ref: "Isaiah 40:31", reflection: "Waiting is not wasted time. It is where strength is renewed." },
  { text: "This is the day that the LORD has made. We will rejoice and be glad in it!", ref: "Psalm 118:24", reflection: "Today was made by Him and given to you. Receive it as a gift." },
  { text: "Cast your burden on the LORD and he will sustain you. He will never allow the righteous to be moved.", ref: "Psalm 55:22", reflection: "He does not just take the burden — He holds you up under it." },
  { text: "For nothing spoken by God is impossible.", ref: "Luke 1:37", reflection: "The word spoken over Mary is spoken still: nothing is beyond His reach." },
  { text: "But when Jesus saw it, he was moved with indignation, and said to them, “Allow the little children to come to me! Don’t forbid them, for God’s Kingdom belongs to such as these.", ref: "Mark 10:14", reflection: "The tenderness of Christ toward children is His heart toward yours." },
  { text: "You will keep whoever’s mind is steadfast in perfect peace, because he trusts in you.", ref: "Isaiah 26:3", reflection: "Peace follows where your mind rests. Rest it on Him today." },
  { text: "Give thanks to the LORD, for he is good, for his loving kindness endures forever.", ref: "Psalm 107:1", reflection: "Begin today by naming one good thing. His love is behind it." },
  { text: "the LORD is my light and my salvation. Whom shall I fear? the LORD is the strength of my life. Of whom shall I be afraid?", ref: "Psalm 27:1", reflection: "When He is your light, the dark loses its power to frighten." },
  { text: "Behold, children are a heritage of the LORD. The fruit of the womb is his reward.", ref: "Psalm 127:3", reflection: "Held, hoped for, or on the way — this child is His gift to you." },
  { text: "In peace I will both lay myself down and sleep, for you, the LORD alone, make me live in safety.", ref: "Psalm 4:8", reflection: "Rest tonight is an act of trust. He keeps watch while you sleep." },
  { text: "Blessed be the God and Father of our Lord Jesus Christ, the Father of mercies and God of all comfort;", ref: "2 Corinthians 1:3", reflection: "He is not only powerful, but the very Father of mercies, comforting you." },
  { text: "I have told you these things, that in me you may have peace. In the world you have trouble; but cheer up! I have overcome the world.", ref: "John 16:33", reflection: "Trouble is real, but it does not have the last word. He has overcome." },
  { text: "The grass withers, the flower fades; but the word of our God stands forever.", ref: "Isaiah 40:8", reflection: "When everything else feels fragile, His word is the ground that holds." },
  { text: "Also delight yourself in the LORD, and he will give you the desires of your heart.", ref: "Psalm 37:4", reflection: "As you delight in Him, He reshapes what your heart most longs for." },
  { text: "Haven’t I commanded you? Be strong and courageous. Don’t be afraid. Don’t be dismayed, for the LORD your God is with you wherever you go.", ref: "Joshua 1:9", reflection: "Courage is not the absence of fear, but the presence of God with you." },
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
