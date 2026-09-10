/**
 * A short orientation for every book of Scripture, shown above the day's
 * reading in the Scripture Journey.
 *
 * A family reading a plan lands one day in Habakkuk and the next in Philemon.
 * Without a word of orientation the chapter arrives bare, and a household with
 * children quietly gives up. These four lines are what a patient pastor would
 * say before reading: what this book is, where it sits in the one story, how it
 * points to Christ, and what to watch for today.
 *
 * Two rules held throughout:
 *
 *  - Christ is found where the text actually puts Him — in promise, type,
 *    covenant, and fulfilment the New Testament itself names — never by
 *    allegorising details into whatever we please.
 *  - Nothing here promises health, wealth, or a tidy outcome. The Bible's own
 *    people were often poor, often ill, and often waiting.
 */

export interface BookIntro {
  /** One line: what this book is. */
  what: string;
  /** Where it sits in the one story of redemption. */
  story: string;
  /** How it points to Christ — as the New Testament itself reads it. */
  christ: string;
  /** What to watch for while reading. */
  watch: string;
}

export const BOOK_INTROS: Record<string, BookIntro> = {
  genesis: {
    what: "Beginnings — of everything, of sin, and of God's promise to undo it.",
    story:
      "God makes a good world, people break it, and God immediately promises a rescuer through one family: Abraham's.",
    christ:
      "The offspring who crushes the serpent (3:15) and the family through whom all nations are blessed (12:3) — Paul says that offspring is Christ (Gal 3:16).",
    watch:
      "How often God keeps His promise through people who behave badly. Grace is not a reward here.",
  },
  exodus: {
    what: "God rescues a slave people and comes to live among them.",
    story:
      "The family of Genesis has become a nation in chains. God hears, redeems by blood, and gives them His law and His presence.",
    christ:
      "The Passover lamb whose blood turns away judgement — 'Christ, our Passover lamb, has been sacrificed' (1 Cor 5:7).",
    watch:
      "Rescue comes first, law second. God saves them, then tells them how to live — never the reverse.",
  },
  leviticus: {
    what: "How sinful people can live near a holy God without being destroyed.",
    story:
      "God has moved in. Now: what does it cost to approach Him, and what must be dealt with first?",
    christ:
      "Every sacrifice here is a picture that could never finish the job. Hebrews says Christ offered one sacrifice for sins forever (Heb 10:12).",
    watch:
      "The sheer cost of sin. The blood is not decoration — it is the price of nearness.",
  },
  numbers: {
    what: "Forty years of wandering, and a God who stays anyway.",
    story:
      "Rescued Israel refuses to trust God at the edge of the land, and a generation dies in the wilderness.",
    christ:
      "The bronze serpent lifted up so that whoever looked would live — Jesus says that was about Him (John 3:14-15).",
    watch:
      "Unbelief, not scandal, is what keeps them out. And God's faithfulness outlasts their grumbling.",
  },
  deuteronomy: {
    what: "A farewell sermon: remember, and love the Lord your God.",
    story:
      "A new generation stands at the border. Moses preaches the covenant again before they cross without him.",
    christ:
      "The prophet greater than Moses whom God promised to raise up (18:15) — the apostles say that is Jesus (Acts 3:22).",
    watch:
      "'Teach them diligently to your children' (6:7) — the verse this whole app is built around.",
  },
  joshua: {
    what: "God keeps the land promise He made to Abraham.",
    story:
      "Israel enters the land. God fights for them; their part is to trust and obey.",
    christ:
      "Joshua ('the LORD saves') leads them into rest — a rest Hebrews says is still ahead of us, and is finally Christ's (Heb 4:8-9).",
    watch:
      "The hard chapters of judgement. God is patient for centuries first (Gen 15:16), and never asks us to imitate this.",
  },
  judges: {
    what: "A spiral downward, and God rescuing anyway.",
    story:
      "Between Joshua and the kings, Israel forgets God again and again; He keeps sending flawed deliverers.",
    christ:
      "Every judge saves partly and then fails. The book leaves you aching for a king who will not.",
    watch:
      "'Everyone did that which was right in his own eyes' (21:25). This is what a people looks like without God as king.",
  },
  ruth: {
    what: "An ordinary family's grief, and a quiet redemption.",
    story:
      "In the dark days of the judges, a foreign widow is drawn into God's covenant family.",
    christ:
      "Boaz redeems what Naomi could not, at cost to himself — and Ruth becomes the great-grandmother of David, and so of Christ (Matt 1:5).",
    watch:
      "How God's providence works through small, unglamorous faithfulness — and through people outside Israel.",
  },
  "1samuel": {
    what: "Israel demands a king, and gets the one they wanted before the one God chose.",
    story:
      "Samuel anoints Saul, then David. The kingdom begins.",
    christ:
      "David, the shepherd-king anointed long before he reigns, hunted by the king in power — the pattern Christ fills out.",
    watch:
      "'The LORD looks at the heart' (16:7). God's choices keep confounding appearances.",
  },
  "2samuel": {
    what: "David reigns — and falls hard.",
    story:
      "God promises David a throne that will never end (ch. 7), then David commits adultery and murder, and the consequences run for generations.",
    christ:
      "The everlasting throne promised to David is occupied by his greater Son (Luke 1:32-33).",
    watch:
      "Forgiveness is real and consequences are also real. Both are in this book, and neither cancels the other.",
  },
  "1kings": {
    what: "Glory, then division.",
    story:
      "Solomon builds the temple and then loses his heart; the kingdom splits in two.",
    christ:
      "A temple where God dwells with His people — which Jesus says He is, and will raise in three days (John 2:19-21).",
    watch:
      "Wisdom without a guarded heart is not enough. Solomon knew more than anyone and drifted anyway.",
  },
  "2kings": {
    what: "Both kingdoms fall, and are carried away.",
    story:
      "Prophets warn for generations. Israel goes to Assyria, Judah to Babylon. The promise looks dead.",
    christ:
      "God preserves David's line through exile — the thread that runs unbroken to Bethlehem.",
    watch:
      "God's patience is very long, and His warnings are not empty. Both are mercy.",
  },
  "1chronicles": {
    what: "The same history retold for a people coming home from exile.",
    story:
      "Genealogies and David's reign, written to remind returned exiles who they still are.",
    christ:
      "The long lists are the paper trail of a promise: God is keeping a line alive for the Messiah.",
    watch:
      "Names matter to God. So does the worship of His house — this book cares deeply about both.",
  },
  "2chronicles": {
    what: "The kings of Judah, weighed by one question: did they seek the Lord?",
    story:
      "Temple, reform, decline, exile — and the book ends with permission to go home and rebuild.",
    christ:
      "Every good king's reform is partial and dies with him. The last verse leaves the door open.",
    watch:
      "The repeated turning points. Revival here always begins with God's Word being found and read.",
  },
  ezra: {
    what: "Coming home and rebuilding the house of God.",
    story:
      "A remnant returns from Babylon, rebuilds the temple against opposition, and rediscovers the law.",
    christ:
      "A second exodus, smaller and shabbier than the first — pointing to a greater homecoming still ahead.",
    watch:
      "The old men weep at the new temple's foundation (3:12). Restoration is often smaller than we hoped, and still God's.",
  },
  nehemiah: {
    what: "Rebuilding walls, and rebuilding a people.",
    story:
      "A cupbearer prays, plans, and leads a broken city to rebuild — then the covenant is renewed.",
    christ:
      "The walls go up, but the hearts inside them still fail by chapter 13. The city needs more than repair.",
    watch:
      "How prayer and hard practical work sit side by side here, never in competition.",
  },
  esther: {
    what: "God's people rescued — in a book that never says God's name.",
    story:
      "In Persia, far from home, a hidden hand preserves the covenant people from annihilation.",
    christ:
      "The line the Messiah would come from survives an extermination order, exactly as at the Exodus and at Bethlehem.",
    watch:
      "Providence with no miracles and no sermon. God is most present here in what looks like coincidence.",
  },
  job: {
    what: "A good man loses everything, and his friends explain it wrongly.",
    story:
      "Outside Israel's history: the oldest question, asked honestly and at length.",
    christ:
      "Job longs for a mediator to stand between him and God (9:33; 19:25). There is one now.",
    watch:
      "God never explains the suffering. He gives Job Himself instead — and rebukes the friends who tied it to Job's sin.",
  },
  psalms: {
    what: "The prayer book of God's people — praise, lament, rage, repentance, trust.",
    story:
      "Five books of songs spanning Israel's whole life with God.",
    christ:
      "Jesus prayed these and quoted them from the cross (Ps 22:1). Many speak of Him directly (Ps 2, 22, 110).",
    watch:
      "How much space God gives to complaint. Nearly a third are laments — permission to bring Him the worst.",
  },
  proverbs: {
    what: "Wisdom for ordinary life, under the fear of the Lord.",
    story:
      "A father teaching a son how the world God made actually works.",
    christ:
      "Wisdom personified (ch. 8) — and Paul says Christ is 'the wisdom of God' (1 Cor 1:24).",
    watch:
      "These are proverbs, not promises. They describe how life usually goes, not a contract God has signed.",
  },
  ecclesiastes: {
    what: "An honest look at life under the sun, and how little of it lasts.",
    story:
      "The wisest man tries pleasure, work, wealth and learning, and finds each one a vapour.",
    christ:
      "Everything the Preacher chases slips away; the book's dead end is answered by a life that death could not hold.",
    watch:
      "How bracingly honest Scripture is about futility. This is in the Bible, and a grieving family may need it.",
  },
  songofsolomon: {
    what: "A love song — married love, delighted in, without embarrassment.",
    story:
      "In the middle of Scripture, God puts a poem celebrating the love of a husband and wife.",
    christ:
      "The New Testament names marriage a picture of Christ and the church (Eph 5:32) — read it that way second, not first.",
    watch:
      "That God is not squeamish about the good gift He made. Read with the age of your household in mind.",
  },
  isaiah: {
    what: "Judgement and comfort — and the clearest sight of the Servant who saves.",
    story:
      "Judah is warned, exiled, and promised a return greater than any return.",
    christ:
      "'He was pierced for our transgressions' (53:5). The child born, the Servant crushed, the King reigning.",
    watch:
      "How judgement and comfort are spoken by the same mouth. Both come from His love.",
  },
  jeremiah: {
    what: "A weeping prophet no one listened to.",
    story:
      "Forty years of warning Judah before Babylon comes, and a promise of a new covenant beyond it.",
    christ:
      "'I will make a new covenant... I will write it in their heart' (31:31-33) — the covenant Jesus announces at the table (Luke 22:20).",
    watch:
      "Faithfulness that produces no visible results. Jeremiah obeyed for decades and was ignored.",
  },
  lamentations: {
    what: "Five poems of grief over a ruined city.",
    story:
      "Jerusalem has fallen. This is what God's people do with catastrophe.",
    christ:
      "In the middle of the ruin: 'his compassion doesn't fail' (3:22-23) — mercy that outlives the worst day.",
    watch:
      "That God gave His people words for grief, and put them in the Bible. Nothing is tidied up.",
  },
  ezekiel: {
    what: "Strange visions to exiles who thought God had left them.",
    story:
      "In Babylon, Ezekiel sees God's glory depart the temple — and, at the end, return.",
    christ:
      "The good shepherd God promises to be Himself for His scattered sheep (34:11-16) — the title Jesus takes (John 10:11).",
    watch:
      "Dry bones live only when God breathes (ch. 37). New life is His work, not ours.",
  },
  daniel: {
    what: "Faithfulness in a foreign empire, and the kingdom that outlasts every empire.",
    story:
      "Exiles serve pagan kings without bowing to them, while God shows the end of history.",
    christ:
      "'One like a son of man' given everlasting dominion (7:13-14) — the title Jesus used of Himself most often.",
    watch:
      "'But if not' (3:18). They obey without any guarantee of rescue. That is faith, not a formula.",
  },
  hosea: {
    what: "God tells a prophet to marry an unfaithful woman, so Israel can see itself.",
    story:
      "A living parable of covenant love against covenant betrayal.",
    christ:
      "A husband who buys his wife back after she has sold herself — love that pays to redeem.",
    watch:
      "How personally God takes unfaithfulness, and how far He goes anyway.",
  },
  joel: {
    what: "A locust plague, a call to repent, and a promised outpouring.",
    story:
      "Disaster becomes a summons: 'return to me with all your heart'.",
    christ:
      "'I will pour out my Spirit on all flesh' (2:28) — Peter says that began at Pentecost (Acts 2:16-17).",
    watch:
      "'Tear your heart and not your garments' (2:13). God is after the inside.",
  },
  amos: {
    what: "A shepherd sent to a prosperous nation to talk about justice.",
    story:
      "Israel is rich, religious, and crushing the poor. God says the worship makes Him sick.",
    christ:
      "The day of the Lord is coming — and the fallen tent of David will be raised (9:11), which James applies to the church (Acts 15:16).",
    watch:
      "Prosperity is not proof of God's favour here. It is the setting of the indictment.",
  },
  obadiah: {
    what: "One chapter against a nation that gloated over its brother's ruin.",
    story:
      "Edom stood by and cheered when Jerusalem fell. God saw.",
    christ:
      "'The kingdom will be the LORD's' (v. 21) — the last word belongs to Him, not to the gloating.",
    watch:
      "How seriously God takes what we do when someone else is down.",
  },
  jonah: {
    what: "A prophet who runs, and a God who is merciful to the wrong sort of people.",
    story:
      "Jonah is sent to Israel's enemy, refuses, is rescued, obeys, and then sulks when God relents.",
    christ:
      "'As Jonah was three days and three nights in the belly of the fish' — Jesus made this a sign of His own death and rising (Matt 12:40).",
    watch:
      "The book ends with a question, aimed at the reader. Whom do we not want God to forgive?",
  },
  micah: {
    what: "Judgement on injustice, and a ruler from Bethlehem.",
    story:
      "Judah's leaders sell justice; God announces both the reckoning and the rescue.",
    christ:
      "'But you, Bethlehem Ephrathah... out of you one will come out to me that is to be ruler in Israel' (5:2).",
    watch:
      "'What does the LORD require of you, but to act justly, to love mercy, and to walk humbly' (6:8).",
  },
  nahum: {
    what: "The fall of Nineveh — the city Jonah once saw spared.",
    story:
      "A century after Jonah, Assyria's cruelty is answered.",
    christ:
      "'The LORD is good, a stronghold in the day of trouble' (1:7) — in the same breath as the judgement.",
    watch:
      "That God's patience has an end, and that this is good news to the people Assyria was crushing.",
  },
  habakkuk: {
    what: "A prophet argues with God about why the wicked prosper.",
    story:
      "God's answer is harder than the question — and Habakkuk learns to wait.",
    christ:
      "'The righteous will live by his faith' (2:4) — the verse Paul builds Romans and Galatians on.",
    watch:
      "Chapter 3: he decides to rejoice in God even if the crops fail and the flock dies. Not if they thrive — if they fail.",
  },
  zephaniah: {
    what: "The day of the Lord, and a remnant left singing.",
    story:
      "Judgement announced on Judah and the nations, with a humble remnant preserved.",
    christ:
      "'He will rejoice over you with singing' (3:17) — God's own gladness over a rescued people.",
    watch:
      "The severity and the tenderness are in the same short book, and belong together.",
  },
  haggai: {
    what: "Get up and build the house of God.",
    story:
      "Returned exiles are panelling their own houses while God's lies in ruins.",
    christ:
      "'The latter glory of this house will be greater than the former' (2:9) — a glory that walked in as a man.",
    watch:
      "How quickly good people's own comfort quietly takes priority. God names it kindly and directly.",
  },
  zechariah: {
    what: "Visions to encourage builders, and remarkably specific pictures of the King.",
    story:
      "Alongside Haggai, urging the temple's rebuilding, with sight lines far past it.",
    christ:
      "The king coming humble on a donkey (9:9); thirty pieces of silver (11:12); the one they pierced (12:10).",
    watch:
      "'Not by might, nor by power, but by my Spirit' (4:6).",
  },
  malachi: {
    what: "The last word of the Old Testament: God's complaint, and a promise.",
    story:
      "The people are back, the temple stands, and the worship has gone cold and cynical.",
    christ:
      "'The Lord, whom you seek, will suddenly come to his temple' (3:1) — after four hundred years of silence.",
    watch:
      "'A book of memory was written before him' (3:16) — the verse the Book of Remembrance is named for.",
  },
  matthew: {
    what: "Jesus the promised King, written for people who know the Old Testament.",
    story:
      "Everything Israel waited for arrives, and is mostly rejected by the people expecting it.",
    christ:
      "The son of David, son of Abraham (1:1) — the whole Old Testament coming to a point.",
    watch:
      "How often Matthew says 'that it might be fulfilled'. He is showing you the seams.",
  },
  mark: {
    what: "The fastest gospel — Jesus on the move, and on the way to the cross.",
    story:
      "Written for outsiders, urgent and plain, with the cross in view from early on.",
    christ:
      "'The Son of Man also came not to be served, but to serve, and to give his life as a ransom for many' (10:45).",
    watch:
      "The word 'immediately'. And how badly the disciples keep missing it — which is comfort, not just comedy.",
  },
  luke: {
    what: "A careful account for a careful reader, full of the poor, the women, the outsiders.",
    story:
      "A doctor investigates and writes an orderly account, then continues it in Acts.",
    christ:
      "The Son of Man who 'came to seek and to save that which was lost' (19:10).",
    watch:
      "Who keeps showing up: shepherds, widows, lepers, a thief on a cross. Luke will not let you miss them.",
  },
  john: {
    what: "Written so that you may believe.",
    story:
      "Seven signs and seven 'I am' sayings, arranged to answer one question: who is He?",
    christ:
      "'The Word became flesh, and lived among us' (1:14). God, in a body, at a wedding and a funeral.",
    watch:
      "The long conversations. John slows down where the others hurry.",
  },
  acts: {
    what: "What Jesus kept on doing, by His Spirit, through ordinary people.",
    story:
      "From a room in Jerusalem to a rented house in Rome, against every kind of opposition.",
    christ:
      "The risen Christ, poured out in the Spirit, building His church without a state or an army.",
    watch:
      "The gospel keeps crossing lines — Samaritans, an Ethiopian, Gentiles — and each time it costs someone their comfort.",
  },
  romans: {
    what: "The gospel, laid out from the ground up.",
    story:
      "Paul writes to a church he has not met, explaining the message he means to bring further west.",
    christ:
      "Justified freely by His grace, through the redemption that is in Christ Jesus (3:24).",
    watch:
      "Chapters 1-3 are bleak on purpose. You cannot feel chapter 5 without them.",
  },
  "1corinthians": {
    what: "A gifted, divided, badly-behaving church, pastored patiently.",
    story:
      "Paul answers report after report from a church in a hard city.",
    christ:
      "'We preach Christ crucified' (1:23) — the answer to every problem in the letter.",
    watch:
      "Chapter 13 is not a wedding reading. It is aimed at a church that thought its gifts made it mature.",
  },
  "2corinthians": {
    what: "The most personal letter Paul wrote — weakness, suffering, and comfort.",
    story:
      "Defending his ministry against polished rivals, Paul boasts about his failures instead.",
    christ:
      "'My grace is sufficient for you, for my power is made perfect in weakness' (12:9).",
    watch:
      "Paul asked three times for the thorn to be removed. It was not. This is the Bible's own answer to unanswered prayer.",
  },
  galatians: {
    what: "An urgent letter: do not add anything to the gospel.",
    story:
      "Teachers are telling Gentile Christians they must also become Jews. Paul is furious.",
    christ:
      "'I have been crucified with Christ, and it is no longer I that live, but Christ lives in me' (2:20).",
    watch:
      "How quickly grace gets edited into a system of requirements — in that church and in ours.",
  },
  ephesians: {
    what: "What God has done, and what it makes of us together.",
    story:
      "Three chapters of what is true, three of how to live it — in that order.",
    christ:
      "Chosen in Him before the foundation of the world (1:4); raised with Him while we were dead (2:5-6).",
    watch:
      "'By grace you have been saved through faith... not of works' (2:8-9). Everything after chapter 4 rests on it.",
  },
  philippians: {
    what: "A joyful letter, written from prison.",
    story:
      "Paul thanks a church that supported him, while chained and facing possible execution.",
    christ:
      "He emptied Himself, took the form of a servant, obeyed to the point of death (2:6-8).",
    watch:
      "The joy is not circumstantial. Note where he is writing from before you read chapter 4.",
  },
  colossians: {
    what: "Christ is enough — nothing needs adding to Him.",
    story:
      "A church is being sold extra rules, extra experiences, extra secrets.",
    christ:
      "'In him all the fullness of the Deity dwells bodily' (2:9). He is the image of the invisible God (1:15).",
    watch:
      "Every 'yes, but also...' offered to that church has a modern version.",
  },
  "1thessalonians": {
    what: "Encouragement to a young church, and comfort about their dead.",
    story:
      "Paul had to leave in a hurry; he writes as soon as he hears they are standing.",
    christ:
      "'The Lord himself will descend from heaven' (4:16) — hope for those who have buried someone.",
    watch:
      "'That you may not grieve like the rest, who have no hope' (4:13). Not 'do not grieve'.",
  },
  "2thessalonians": {
    what: "Steady on — and get back to work.",
    story:
      "Some have concluded the day of the Lord has come and stopped working.",
    christ:
      "Christ will be revealed, and will finish what He began — so live ordinary faithful lives until then.",
    watch:
      "How practical the correction is. Eschatology here ends in earning your bread quietly.",
  },
  "1timothy": {
    what: "How a church should order its life.",
    story:
      "Paul writes to a young pastor left in a difficult church.",
    christ:
      "'Christ Jesus came into the world to save sinners, of whom I am chief' (1:15).",
    watch:
      "'Godliness with contentment is great gain' (6:6) — said directly against those who imagine godliness is a means of gain.",
  },
  "2timothy": {
    what: "Paul's last letter, written expecting to die.",
    story:
      "Most have deserted him. He asks for a coat, some books, and for Timothy to come.",
    christ:
      "'He remains faithful, for he can't deny himself' (2:13) — even when we fail.",
    watch:
      "All Scripture is God-breathed (3:16), written by a man whose own life is ending badly by every worldly measure.",
  },
  titus: {
    what: "Sound doctrine, and the ordinary lives it should produce.",
    story:
      "Organising young churches on Crete, in a culture with a bad reputation.",
    christ:
      "'He saved us, not by works of righteousness which we did ourselves, but according to his mercy' (3:5).",
    watch:
      "Grace 'teaches us' how to live (2:11-12). Grace is not the opposite of instruction.",
  },
  philemon: {
    what: "One page about a runaway slave, and what the gospel does to a relationship.",
    story:
      "Paul sends Onesimus back to his master — as a brother.",
    christ:
      "'If he has wronged you... put that to my account' (v. 18). That is what Christ did for us, in one sentence.",
    watch:
      "Paul does not command; he appeals. And the whole social order quietly cracks.",
  },
  hebrews: {
    what: "Jesus is better — than angels, Moses, priests, and every sacrifice.",
    story:
      "Written to Jewish Christians tempted to go back to what was familiar and safe.",
    christ:
      "'He is the radiance of his glory, and the very image of his substance' (1:3); one sacrifice, forever (10:12).",
    watch:
      "Chapter 11's roll call ends with people who 'didn't receive the promise' and were tortured. Faith is not a guarantee of outcomes.",
  },
  james: {
    what: "Faith that does something, or is not faith.",
    story:
      "Practical, blunt, close to the Sermon on the Mount.",
    christ:
      "The wisdom from above (3:17) — the life the Lord Jesus actually lived.",
    watch:
      "'Confess your sins to one another, and pray for one another' (5:16). Very few of us do this.",
  },
  "1peter": {
    what: "How to suffer well as an exile.",
    story:
      "Written to scattered Christians under real pressure for their faith.",
    christ:
      "'He himself bore our sins in his body on the tree' (2:24) — and left us an example in suffering.",
    watch:
      "Suffering is assumed here, not treated as a sign that something has gone wrong.",
  },
  "2peter": {
    what: "Watch out for teachers who are selling you something.",
    story:
      "Peter's last letter warns of false teachers and mockers of Christ's return.",
    christ:
      "'The Lord is not slow concerning his promise... but is patient with us' (3:9).",
    watch:
      "The false teachers are marked by greed and by exploiting people (2:3). That test still works.",
  },
  "1john": {
    what: "How to know you actually belong to God.",
    story:
      "Written against teachers denying that Christ truly came in the flesh.",
    christ:
      "'He is the atoning sacrifice for our sins' (2:2); 'we love him, because he first loved us' (4:19).",
    watch:
      "The three tests, circling round again and again: belief, love, obedience.",
  },
  "2john": {
    what: "Walk in truth, and do not welcome those who deny Christ.",
    story:
      "A short note to a church about hospitality and its limits.",
    christ:
      "The truth about who Jesus is — the line that cannot be crossed for the sake of being nice.",
    watch:
      "Love and truth are not alternatives here. They are in the same sentence.",
  },
  "3john": {
    what: "Two men, one hospitable and one domineering.",
    story:
      "A private letter about supporting travelling teachers.",
    christ:
      "Ordinary hospitality is named as working together for the truth (v. 8).",
    watch:
      "Diotrephes 'loves to be first' (v. 9). Church trouble is often that simple.",
  },
  jude: {
    what: "Contend for the faith.",
    story:
      "A brief, alarmed letter about people who have slipped into the church.",
    christ:
      "'Now to him who is able to keep them from stumbling' (v. 24) — the letter's frightening warnings end in safety.",
    watch:
      "Mercy toward the doubting (v. 22), alongside the warnings. Both are commanded.",
  },
  revelation: {
    what: "The end, shown to a persecuted church, so they would hold on.",
    story:
      "Visions given to John in exile: the Lamb reigns, the enemy is real, the end is certain.",
    christ:
      "The Lamb who was slain, standing (5:6) — the crucified Jesus at the centre of heaven.",
    watch:
      "Read it as encouragement to hold on, which is what it was for. Every tear wiped away (21:4) is the point.",
  },
};

export function bookIntro(slug: string): BookIntro | null {
  return BOOK_INTROS[slug] ?? null;
}
