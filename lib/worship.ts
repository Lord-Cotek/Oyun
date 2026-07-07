/**
 * A daily household rhythm: a short family-worship prompt (a verse to read and a
 * prayer to pray over the child) and a rotating question from the historic
 * Catechism for Young Children. Both rotate by the calendar day.
 */
export interface Liturgy {
  read: { text: string; ref: string };
  pray: string;
}

export const LITURGIES: Liturgy[] = [
  { read: { text: "These words that I command you today shall be on your heart. You shall teach them diligently to your children.", ref: "Deuteronomy 6:6-7" }, pray: "Father, make our home a place where your Word is spoken and loved. Write it on our children's hearts." },
  { read: { text: "Train up a child in the way he should go; even when he is old he will not depart from it.", ref: "Proverbs 22:6" }, pray: "Lord, give us patience and faith to train this child, and do what only you can do — keep them." },
  { read: { text: "Let the little children come to me, and do not hinder them, for to such belongs the kingdom of God.", ref: "Mark 10:14" }, pray: "Jesus, draw our child to yourself early. Let them know your welcome all their days." },
  { read: { text: "The steadfast love of the LORD is from everlasting to everlasting on those who fear him.", ref: "Psalm 103:17" }, pray: "God of covenant love, be the God of our child, and of their children after them." },
  { read: { text: "And these words shall be on your heart. You shall talk of them when you sit and when you walk.", ref: "Deuteronomy 6:6-7" }, pray: "Teach us to speak of you in the ordinary hours, Lord — at the table, on the road, at bedtime." },
  { read: { text: "From childhood you have been acquainted with the sacred writings, which are able to make you wise for salvation.", ref: "2 Timothy 3:15" }, pray: "Make the Scriptures familiar and dear to our child, and wise them up unto Christ." },
  { read: { text: "Behold, children are a heritage from the LORD, the fruit of the womb a reward.", ref: "Psalm 127:3" }, pray: "Thank you for the gift of this child. Help us hold them with open hands, as yours before ours." },
  { read: { text: "But as for me and my house, we will serve the LORD.", ref: "Joshua 24:15" }, pray: "Lord, make this the settled confession of our home — that we will serve you together." },
  { read: { text: "One generation shall commend your works to another, and shall declare your mighty acts.", ref: "Psalm 145:4" }, pray: "Help us hand down your faithfulness, Lord, telling of you to the next generation." },
  { read: { text: "I have no greater joy than to hear that my children are walking in the truth.", ref: "3 John 1:4" }, pray: "Above every other hope for our child, Lord, let them walk in the truth." },
  { read: { text: "The LORD your God is in your midst, a mighty one who will save; he will rejoice over you with gladness.", ref: "Zephaniah 3:17" }, pray: "Sing over our child, Lord, as you sing over us. Let them grow up knowing they are loved." },
  { read: { text: "Grace, mercy, and peace will be with us, in truth and love.", ref: "2 John 1:3" }, pray: "Let grace, mercy, and peace mark our home today, in truth and in love." },
  { read: { text: "Whoever receives one such child in my name receives me.", ref: "Matthew 18:5" }, pray: "Help us receive and serve our child as unto you, Jesus, in the small and unseen things." },
  { read: { text: "He established a testimony in Jacob and appointed a law, that the next generation might know them.", ref: "Psalm 78:5-6" }, pray: "Let what we know of you not stop with us, Lord, but reach our children and beyond." },
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
  catechism: CatechismQ;
  catechismNumber: number;
} {
  const n = dayNumber(date);
  return {
    liturgy: LITURGIES[n % LITURGIES.length],
    catechism: CATECHISM[n % CATECHISM.length],
    catechismNumber: (n % CATECHISM.length) + 1,
  };
}
