/**
 * A daily household rhythm for family worship: a verse to read, a short
 * theological reflection, a prayer over the child, a question to talk through,
 * a hymn to sing, and — once the child has arrived — a catechism question.
 * Everything rotates by the calendar day.
 */
export interface Liturgy {
  read: { text: string; ref: string };
  reflection: string;
  pray: string;
  talk: string;
}

export const LITURGIES: Liturgy[] = [
  {
    read: { text: "These words that I command you today shall be on your heart. You shall teach them diligently to your children.", ref: "Deuteronomy 6:6-7" },
    reflection:
      "Before a parent can teach the Word, it must first be on their own heart. God does not ask us to hand down a faith we do not hold. Family worship begins not with technique but with parents who themselves love and treasure God's Word — and then, unhurried, let it overflow to the little ones in the ordinary moments of the day.",
    pray: "Father, make our home a place where your Word is spoken and loved. Write it first on our hearts, and then on our children's.",
    talk: "What is one truth about God you most want your child to know deep in their bones?",
  },
  {
    read: { text: "Train up a child in the way he should go; even when he is old he will not depart from it.", ref: "Proverbs 22:6" },
    reflection:
      "This is a proverb — a wise pattern, not an ironclad promise that guarantees an outcome. Our task is faithful training; the fruit belongs to God. That frees us from both pride and despair: we labor diligently, and we entrust the results to the Lord who alone can save.",
    pray: "Lord, give us patience and faithfulness to train this child, and do what only you can do — hold their heart, and bring them home.",
    talk: "Where are you tempted to either coast on grace or grasp for control in parenting? What would trusting God look like instead?",
  },
  {
    read: { text: "Let the little children come to me, and do not hinder them, for to such belongs the kingdom of God.", ref: "Mark 10:14" },
    reflection:
      "Jesus was indignant when children were kept from Him. He does not merely tolerate the young — He welcomes them and holds them up as a picture of the kingdom. Our job is never to be a barrier between our children and Christ, but a door: pointing, inviting, making the way to Him plain and warm.",
    pray: "Jesus, draw our child to yourself early. Let us never hinder them, but always point the way to your open arms.",
    talk: "In what small way can you make Jesus feel welcoming and near to your child this week?",
  },
  {
    read: { text: "The steadfast love of the LORD is from everlasting to everlasting on those who fear him, and his righteousness to children's children.", ref: "Psalm 103:17" },
    reflection:
      "God's covenant love reaches across generations. He delights to be the God of families — of parents, and of their children after them. This is the hope under all our praying: not the strength of our parenting, but the faithfulness of a God whose mercy runs down the generations like a river.",
    pray: "God of covenant love, be the God of our child, and of their children after them, to a thousand generations.",
    talk: "Whose faith was passed down to you? Give thanks for them by name.",
  },
  {
    read: { text: "From childhood you have been acquainted with the sacred writings, which are able to make you wise for salvation through faith in Christ Jesus.", ref: "2 Timothy 3:15" },
    reflection:
      "Timothy knew Scripture from infancy — long before he could reason about it — through the everyday faithfulness of his mother and grandmother. Scripture does its saving work not by our cleverness but by the Spirit through the Word. So we read it to children who do not yet understand, trusting God to make it wise unto salvation in His time.",
    pray: "Make the Scriptures familiar and dear to our child, Lord, and by them make them wise unto salvation in Christ.",
    talk: "How can Scripture become a familiar, everyday sound in your home — not just a Sunday event?",
  },
  {
    read: { text: "Behold, children are a heritage from the LORD, the fruit of the womb a reward.", ref: "Psalm 127:3" },
    reflection:
      "A heritage is a gift received, not a wage earned. Children are entrusted to us, but they belong first to God. Holding them with open hands — as His before they are ours — changes everything: it turns anxious ownership into grateful stewardship.",
    pray: "Thank you for the gift of this child. Help us hold them with open hands, as yours before ours.",
    talk: "What does it look like, practically, to parent as a steward rather than an owner?",
  },
  {
    read: { text: "As for me and my house, we will serve the LORD.", ref: "Joshua 24:15" },
    reflection:
      "Joshua's declaration is a settled decision made before the pressures come. A home is not neutral ground; it is always serving something. To say 'we will serve the LORD' is to choose, on ordinary days, a hundred small allegiances that add up to a household pointed toward God.",
    pray: "Lord, make this the settled confession of our home — that we, and our house, will serve you together.",
    talk: "What is one 'small allegiance' — a rhythm or habit — that would point your home more toward God?",
  },
  {
    read: { text: "One generation shall commend your works to another, and shall declare your mighty acts.", ref: "Psalm 145:4" },
    reflection:
      "Faith is meant to be handed down by telling — one generation speaking of God's works to the next. Children come to know a God who acts by hearing the stories: what He has done in Scripture, and what He has done in your own life. Testimony is a means of grace in a home.",
    pray: "Help us tell of your works, Lord — in Scripture and in our own lives — so the next generation will know you.",
    talk: "Tell one story of God's faithfulness in your life that you want your child to grow up hearing.",
  },
  {
    read: { text: "I have no greater joy than to hear that my children are walking in the truth.", ref: "3 John 1:4" },
    reflection:
      "John names the deepest joy of a spiritual parent: not achievement, comfort, or success, but children walking in the truth. It reorders our hopes. Above health, wealth, or accomplishment, we long most for our children to know and follow Christ — and we let that longing shape how we pray and parent.",
    pray: "Above every other hope for our child, Lord, let them walk in the truth all their days.",
    talk: "If you're honest, what do you most want for your child? How does 3 John reorder it?",
  },
  {
    read: { text: "The LORD your God is in your midst, a mighty one who will save; he will rejoice over you with gladness; he will quiet you by his love; he will exult over you with loud singing.", ref: "Zephaniah 3:17" },
    reflection:
      "God sings over His people. The same delight a parent feels over a sleeping child, God feels — infinitely more — over you. As you learn to sing over your little one, you are living out a small picture of how God rejoices over you. Let that steady you: you are loved by a God who is glad.",
    pray: "Sing over our child, Lord, as you sing over us. Let them grow up sure that they are loved and delighted in.",
    talk: "How does knowing God 'rejoices over you with singing' change how you see yourself as a parent today?",
  },
  {
    read: { text: "He established a testimony in Jacob and appointed a law... that the next generation might know them, the children yet unborn.", ref: "Psalm 78:5-6" },
    reflection:
      "God's design is generational from the start — He gives His Word so that children 'yet unborn' would know Him. Your worship today is not only for you; it is an inheritance for a child who cannot yet speak, and perhaps for children not yet born. Small faithfulness now echoes forward.",
    pray: "Let what we know of you not stop with us, Lord, but reach our children, and children yet unborn.",
    talk: "What do you hope your family's faith looks like two generations from now? Pray toward it.",
  },
  {
    read: { text: "Whoever receives one such child in my name receives me.", ref: "Matthew 18:5" },
    reflection:
      "Christ so identifies with children that to welcome one in His name is to welcome Him. The unseen, repetitive, humble work of caring for a little one — the feeding, the soothing, the night-waking — is not beneath the kingdom. Done in Jesus' name, it is service rendered to Christ Himself.",
    pray: "Help us receive and serve our child as unto you, Jesus, in the small and unseen things.",
    talk: "Which unseen, ordinary task of care could you offer to Jesus today as worship?",
  },
];

export interface Hymn {
  title: string;
  line: string;
}

export const HYMNS: Hymn[] = [
  { title: "Great Is Thy Faithfulness", line: "Morning by morning new mercies I see." },
  { title: "Come Thou Fount of Every Blessing", line: "Streams of mercy, never ceasing, call for songs of loudest praise." },
  { title: "It Is Well with My Soul", line: "Whatever my lot, thou hast taught me to say, it is well with my soul." },
  { title: "Be Thou My Vision", line: "Thou my best thought, by day or by night." },
  { title: "How Firm a Foundation", line: "How firm a foundation, ye saints of the Lord, is laid for your faith in His excellent Word." },
  { title: "The Lord's My Shepherd", line: "He makes me down to lie in pastures green; He leadeth me the quiet waters by." },
  { title: "O Worship the King", line: "O worship the King, all glorious above, and gratefully sing His wonderful love." },
  { title: "Jesus Loves Me", line: "Jesus loves me, this I know, for the Bible tells me so." },
  { title: "Praise to the Lord, the Almighty", line: "Praise to the Lord, the Almighty, the King of creation." },
  { title: "Abide with Me", line: "Help of the helpless, O abide with me." },
  { title: "My Hope Is Built on Nothing Less", line: "On Christ the solid rock I stand; all other ground is sinking sand." },
  { title: "Guide Me, O Thou Great Jehovah", line: "Bread of heaven, feed me till I want no more." },
];

export interface CatechismQ {
  q: string;
  a: string;
}

/** From the Catechism for Young Children (a historic Reformed children's catechism). */
export const CATECHISM: CatechismQ[] = [
  { q: "Who made you?", a: "God." },
  { q: "What else did God make?", a: "God made all things." },
  { q: "Why did God make you and all things?", a: "For his own glory." },
  { q: "How can you glorify God?", a: "By loving him and doing what he commands." },
  { q: "Why ought you to glorify God?", a: "Because he made me and takes care of me." },
  { q: "Are there more gods than one?", a: "There is only one God." },
  { q: "In how many persons does this one God exist?", a: "In three persons." },
  { q: "What are they?", a: "The Father, the Son, and the Holy Spirit." },
  { q: "What is God?", a: "God is a Spirit, and does not have a body like men." },
  { q: "Where is God?", a: "God is everywhere." },
  { q: "Can you see God?", a: "No; I cannot see God, but he always sees me." },
  { q: "Does God know all things?", a: "Yes; nothing can be hidden from God." },
  { q: "Can God do all things?", a: "Yes; God can do all his holy will." },
  { q: "Where do you learn how to love and obey God?", a: "In the Bible alone." },
  { q: "Who wrote the Bible?", a: "Holy men who were taught by the Holy Spirit." },
  { q: "Who were our first parents?", a: "Adam and Eve." },
  { q: "Of what were our first parents made?", a: "God made the body of Adam out of the ground, and formed Eve from the body of Adam." },
  { q: "What did God give Adam and Eve besides bodies?", a: "He gave them souls that could never die." },
  { q: "Do you have a soul as well as a body?", a: "Yes; I have a soul that can never die." },
  { q: "How do you know that you have a soul?", a: "Because the Bible tells me so." },
  { q: "In what condition did God make Adam and Eve?", a: "He made them holy and happy." },
  { q: "What is a covenant?", a: "An agreement between two or more persons." },
  { q: "Did Adam keep the covenant?", a: "No; he sinned against God." },
  { q: "What is sin?", a: "Sin is any want of conformity to, or transgression of, the law of God." },
];

function dayNumber(date: Date): number {
  return Math.floor(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) / 86_400_000,
  );
}

export function familyWorship(date: Date = new Date()): {
  liturgy: Liturgy;
  hymn: Hymn;
  catechism: CatechismQ;
  catechismNumber: number;
} {
  const n = dayNumber(date);
  return {
    liturgy: LITURGIES[n % LITURGIES.length],
    hymn: HYMNS[n % HYMNS.length],
    catechism: CATECHISM[n % CATECHISM.length],
    catechismNumber: (n % CATECHISM.length) + 1,
  };
}
