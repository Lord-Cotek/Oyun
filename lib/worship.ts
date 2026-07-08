/**
 * A daily household rhythm for family worship: a verse to read, a short
 * theological reflection, a prayer, a question to talk through, a hymn to sing,
 * and — once the child has arrived — a catechism question.
 *
 * The passages deliberately center on the truth of God's Word and the
 * supremacy of Christ — not merely on children — so that parents' first love
 * stays fixed on the Lord and the gift of parenting is never made an idol.
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
    read: { text: "Indeed, I count everything as loss because of the surpassing worth of knowing Christ Jesus my Lord.", ref: "Philippians 3:8" },
    reflection:
      "Paul counts everything — even his best gifts — as loss next to knowing Christ. This is the great guard against making an idol of your child or your parenting: they are precious gifts, but they are not your treasure. Christ is. When He is supreme, you are freed to love your child rightly — as a gift, and never a god.",
    pray: "Lord Jesus, be our supreme treasure. Let us love our children well because we love you first and most.",
    talk: "Be honest: has any hope for your child quietly taken the place that belongs to Christ alone?",
  },
  {
    read: { text: "These words that I command you today shall be on your heart. You shall teach them diligently to your children.", ref: "Deuteronomy 6:6-7" },
    reflection:
      "Before a parent can teach the Word, it must first be on their own heart. God does not ask us to hand down a faith we do not hold. Family worship begins not with technique but with parents who themselves love and treasure God's Word — and then let it overflow to the little ones.",
    pray: "Father, make our home a place where your Word is spoken and loved. Write it first on our hearts, and then on our children's.",
    talk: "What is one truth about God you most want your child to know deep in their bones?",
  },
  {
    read: { text: "You shall love the Lord your God with all your heart and with all your soul and with all your mind. This is the great and first commandment.", ref: "Matthew 22:37-38" },
    reflection:
      "The first commandment is to love God — not our children. This is not cold; it is the only order that keeps love from becoming idolatry. A child loved more than God is a child crushed under a weight they were never meant to bear. Love God first, and your children are freed to be loved as children, not as gods.",
    pray: "Father, capture our hearts' first love. From loving you supremely, teach us to love our children truly.",
    talk: "What would change this week if loving God first genuinely came before every hope you have for your child?",
  },
  {
    read: { text: "Train up a child in the way he should go; even when he is old he will not depart from it.", ref: "Proverbs 22:6" },
    reflection:
      "This is a proverb — a wise pattern, not an ironclad promise that guarantees an outcome. Our task is faithful training; the fruit belongs to God. That frees us from both pride and despair: we labor diligently, and we entrust the results to the Lord who alone can save.",
    pray: "Lord, give us patience and faithfulness to train this child, and do what only you can do — hold their heart, and bring them home.",
    talk: "Where are you tempted to either coast on grace or grasp for control in parenting? What would trusting God look like instead?",
  },
  {
    read: { text: "For by grace you have been saved through faith. And this is not your own doing; it is the gift of God, not a result of works, so that no one may boast.", ref: "Ephesians 2:8-9" },
    reflection:
      "Salvation is grace from first to last — not earned by our performance, and not by our parenting. This frees us: we are not saved by raising perfect children, nor are our children saved by our efforts. We labor in faith and rest in grace, boasting not in ourselves but in God.",
    pray: "God of grace, save us and our children by your mercy, not our merit. Keep us from boasting in anything but you.",
    talk: "Where are you tempted to treat parenting as something that earns God's favor — for you or your child?",
  },
  {
    read: { text: "Let the little children come to me, and do not hinder them, for to such belongs the kingdom of God.", ref: "Mark 10:14" },
    reflection:
      "Jesus was indignant when children were kept from Him. He does not merely tolerate the young — He welcomes them and holds them up as a picture of the kingdom. Our job is never to be a barrier between our children and Christ, but a door: pointing, inviting, making the way to Him plain and warm.",
    pray: "Jesus, draw our child to yourself early. Let us never hinder them, but always point the way to your open arms.",
    talk: "In what small way can you make Jesus feel welcoming and near to your child this week?",
  },
  {
    read: { text: "Christ died for our sins in accordance with the Scriptures, that he was buried, that he was raised on the third day in accordance with the Scriptures.", ref: "1 Corinthians 15:3-4" },
    reflection:
      "Here is the gospel of first importance — not advice for better families, but the death and resurrection of Christ for sinners. Everything in a Christian home stands on this. Before we are parents, we are sinners saved by a crucified and risen Savior. Keep this at the center, and parenting finds its right place.",
    pray: "Thank you, Lord, for Christ crucified and risen for us. Let the gospel be the ground our home is built on.",
    talk: "How can the gospel — Christ's death and resurrection — stay central in your home, not just good behavior?",
  },
  {
    read: { text: "The steadfast love of the LORD is from everlasting to everlasting on those who fear him, and his righteousness to children's children.", ref: "Psalm 103:17" },
    reflection:
      "God's covenant love reaches across generations. He delights to be the God of families — of parents, and of their children after them. This is the hope under all our praying: not the strength of our parenting, but the faithfulness of a God whose mercy runs down the generations like a river.",
    pray: "God of covenant love, be the God of our child, and of their children after them, to a thousand generations.",
    talk: "Whose faith was passed down to you? Give thanks for them by name.",
  },
  {
    read: { text: "And he is the head of the body, the church. He is the beginning, the firstborn from the dead, that in everything he might be preeminent.", ref: "Colossians 1:18" },
    reflection:
      "In everything — including your family — Christ is meant to be preeminent: first, supreme. Not your child, not your dreams for them, not the family itself. When Christ holds first place, the home is well-ordered; when anything else does, it becomes an idol that cannot bear the weight.",
    pray: "Lord Jesus, be preeminent in our home — first in our affections, our decisions, our hopes.",
    talk: "What currently competes with Christ for first place in your family's life?",
  },
  {
    read: { text: "From childhood you have been acquainted with the sacred writings, which are able to make you wise for salvation through faith in Christ Jesus.", ref: "2 Timothy 3:15" },
    reflection:
      "Timothy knew Scripture from infancy — long before he could reason about it — through the everyday faithfulness of his mother and grandmother. Scripture does its saving work not by our cleverness but by the Spirit through the Word. So we read it to children who do not yet understand, trusting God to make it wise unto salvation in His time.",
    pray: "Make the Scriptures familiar and dear to our child, Lord, and by them make them wise unto salvation in Christ.",
    talk: "How can Scripture become a familiar, everyday sound in your home — not just a Sunday event?",
  },
  {
    read: { text: "Little children, keep yourselves from idols.", ref: "1 John 5:21" },
    reflection:
      "John's last words to a beloved church: keep from idols. An idol is any good thing turned into an ultimate thing. A child is one of the easiest and most respectable idols to make. Guard your heart — love your child dearly, but worship God alone.",
    pray: "Father, guard our hearts from idols. Let no gift, however precious, take the place that is yours alone.",
    talk: "What good gift are you most prone to turn into an ultimate thing?",
  },
  {
    read: { text: "Behold, children are a heritage from the LORD, the fruit of the womb a reward.", ref: "Psalm 127:3" },
    reflection:
      "A heritage is a gift received, not a wage earned. Children are entrusted to us, but they belong first to God. Holding them with open hands — as His before they are ours — changes everything: it turns anxious ownership into grateful stewardship.",
    pray: "Thank you for the gift of this child. Help us hold them with open hands, as yours before ours.",
    talk: "What does it look like, practically, to parent as a steward rather than an owner?",
  },
  {
    read: { text: "But God shows his love for us in that while we were still sinners, Christ died for us.", ref: "Romans 5:8" },
    reflection:
      "God's love is proven not by our worthiness but by Christ dying for the unworthy. This is the love we rest in, and the love we model — loving our children not because they earn it, but freely, as we have been loved. The cross, not our children's behavior, is the measure of grace.",
    pray: "Thank you for loving us while we were still sinners. Teach us to love our children with that same free grace.",
    talk: "How does being loved by God 'while still a sinner' shape how you will love your child on their hardest days?",
  },
  {
    read: { text: "As for me and my house, we will serve the LORD.", ref: "Joshua 24:15" },
    reflection:
      "Joshua's declaration is a settled decision made before the pressures come. A home is not neutral ground; it is always serving something. To say 'we will serve the LORD' is to choose, on ordinary days, a hundred small allegiances that add up to a household pointed toward God.",
    pray: "Lord, make this the settled confession of our home — that we, and our house, will serve you together.",
    talk: "What is one 'small allegiance' — a rhythm or habit — that would point your home more toward God?",
  },
  {
    read: { text: "All Scripture is breathed out by God and profitable for teaching, for reproof, for correction, and for training in righteousness.", ref: "2 Timothy 3:16" },
    reflection:
      "Scripture is God's own breath — sufficient to make us complete and equipped. We do not need the latest parenting theory as our foundation; we need the Word. Let the whole counsel of God, not merely a few sentimental verses, shape your home.",
    pray: "Lord, make your Word our foundation. Feed us on the whole of Scripture, and equip us by it.",
    talk: "Is your family fed on the whole of Scripture, or only the comfortable parts? Where could you go deeper?",
  },
  {
    read: { text: "One generation shall commend your works to another, and shall declare your mighty acts.", ref: "Psalm 145:4" },
    reflection:
      "Faith is meant to be handed down by telling — one generation speaking of God's works to the next. Children come to know a God who acts by hearing the stories: what He has done in Scripture, and what He has done in your own life. Testimony is a means of grace in a home.",
    pray: "Help us tell of your works, Lord — in Scripture and in our own lives — so the next generation will know you.",
    talk: "Tell one story of God's faithfulness in your life that you want your child to grow up hearing.",
  },
  {
    read: { text: "So, whether you eat or drink, or whatever you do, do all to the glory of God.", ref: "1 Corinthians 10:31" },
    reflection:
      "The chief end of parenting — of everything — is the glory of God. Not the success of our children, not our reputation as parents, but God's glory. This lifts the ordinary (feeding, cleaning, teaching) into worship, and keeps the goal from shrinking to something smaller than God.",
    pray: "Father, let everything in our home — even the smallest task — be done for your glory.",
    talk: "How would naming God's glory as the goal reshape an ordinary day of parenting?",
  },
  {
    read: { text: "I have no greater joy than to hear that my children are walking in the truth.", ref: "3 John 1:4" },
    reflection:
      "John names the deepest joy of a spiritual parent: not achievement, comfort, or success, but children walking in the truth. It reorders our hopes. Above health, wealth, or accomplishment, we long most for our children to know and follow Christ.",
    pray: "Above every other hope for our child, Lord, let them walk in the truth all their days.",
    talk: "If you are honest, what do you most want for your child? How does 3 John reorder it?",
  },
  {
    read: { text: "Whom have I in heaven but you? And there is nothing on earth that I desire besides you... God is the strength of my heart and my portion forever.", ref: "Psalm 73:25-26" },
    reflection:
      "The psalmist's satisfaction is in God alone — not in family, not in earthly gifts. This is the settled heart that can hold children with open hands: God is my portion, so I am not undone if earthly things fail. Desire God above all, and every other love finds its place.",
    pray: "God, be our portion and the strength of our hearts. Let us desire you above every earthly gift.",
    talk: "Can you say with the psalmist that God alone is enough — even apart from your hopes for your child?",
  },
  {
    read: { text: "The LORD your God is in your midst, a mighty one who will save; he will rejoice over you with gladness; he will quiet you by his love; he will exult over you with loud singing.", ref: "Zephaniah 3:17" },
    reflection:
      "God sings over His people. The same delight a parent feels over a sleeping child, God feels — infinitely more — over you. As you learn to sing over your little one, you live out a small picture of how God rejoices over you. Let that steady you: you are loved by a God who is glad.",
    pray: "Sing over our child, Lord, as you sing over us. Let them grow up sure that they are loved and delighted in.",
    talk: "How does knowing God 'rejoices over you with singing' change how you see yourself as a parent today?",
  },
  {
    read: { text: "The steadfast love of the LORD never ceases; his mercies never come to an end; they are new every morning; great is your faithfulness.", ref: "Lamentations 3:22-23" },
    reflection:
      "Written amid ruin, this is confidence not in circumstances but in the character of God. His mercies are new every morning — including the mornings after we fail as parents. We do not rest in our own consistency, but in His faithfulness.",
    pray: "Great is your faithfulness, Lord. Meet us with new mercy each morning, for we need it daily.",
    talk: "Where do you need to trade confidence in your own consistency for confidence in God's faithfulness?",
  },
  {
    read: { text: "He established a testimony in Jacob and appointed a law... that the next generation might know them, the children yet unborn.", ref: "Psalm 78:5-6" },
    reflection:
      "God's design is generational from the start — He gives His Word so that children 'yet unborn' would know Him. Your worship today is not only for you; it is an inheritance for a child who cannot yet speak, and perhaps for children not yet born. Small faithfulness now echoes forward.",
    pray: "Let what we know of you not stop with us, Lord, but reach our children, and children yet unborn.",
    talk: "What do you hope your family's faith looks like two generations from now? Pray toward it.",
  },
  {
    read: { text: "If then you have been raised with Christ, seek the things that are above, where Christ is. Set your minds on things that are above, not on things that are on earth.", ref: "Colossians 3:1-2" },
    reflection:
      "The Christian's gaze is meant to be upward — on Christ, not merely on the pressing concerns of earthly life, even good ones like our children. An upward-set mind does not neglect the home; it parents from a heart anchored above, unshaken by what shakes on earth.",
    pray: "Lord, lift our eyes. Set our minds on Christ above, and let us parent from that steadiness.",
    talk: "What earthly worry about your child most needs to be met with a mind 'set on things above'?",
  },
  {
    read: { text: "Whoever receives one such child in my name receives me.", ref: "Matthew 18:5" },
    reflection:
      "Christ so identifies with children that to welcome one in His name is to welcome Him. The unseen, repetitive, humble work of caring for a little one — the feeding, the soothing, the night-waking — is not beneath the kingdom. Done in Jesus' name, it is service rendered to Christ Himself.",
    pray: "Help us receive and serve our child as unto you, Jesus, in the small and unseen things.",
    talk: "Which unseen, ordinary task of care could you offer to Jesus today as worship?",
  },
  {
    read: { text: "But far be it from me to boast except in the cross of our Lord Jesus Christ, by which the world has been crucified to me, and I to the world.", ref: "Galatians 6:14" },
    reflection:
      "Paul boasts in one thing only: the cross. Not his ministry, not his family, not his record. For parents this is freedom — our worth and our children's worth is not our achievement but Christ crucified. Boast in the cross, and you will parent from security, not to earn it.",
    pray: "Let us boast in nothing, Lord, but the cross of Christ. Be our only glory.",
    talk: "What are you quietly tempted to boast in as a parent? How does the cross reorder it?",
  },
  {
    read: { text: "The fear of the LORD is the beginning of wisdom, and the knowledge of the Holy One is insight.", ref: "Proverbs 9:10" },
    reflection:
      "All true wisdom — including wisdom for parenting — begins with the fear of the Lord, not with expertise. Before technique, before strategy, there is reverence for God. Raise children in the fear of the Lord by first walking in it yourselves.",
    pray: "Teach us the fear of the LORD, that we and our children might be truly wise.",
    talk: "What does 'the fear of the Lord' look like in the everyday atmosphere of your home?",
  },
  {
    read: { text: "Let us run with endurance the race that is set before us, looking to Jesus, the founder and perfecter of our faith.", ref: "Hebrews 12:1-2" },
    reflection:
      "The Christian life — and Christian parenting — is a race run by looking to Jesus, not to ourselves or our children. He is the founder and perfecter; the outcome rests with Him. Fix your eyes on Christ, and you will endure the long, ordinary marathon of raising a family.",
    pray: "Jesus, founder and perfecter of our faith, fix our eyes on you as we run this long race.",
    talk: "When parenting feels like a long, tiring race, what does 'looking to Jesus' practically mean for you?",
  },
  {
    read: { text: "As he who called you is holy, you also be holy in all your conduct, since it is written, 'You shall be holy, for I am holy.'", ref: "1 Peter 1:15-16" },
    reflection:
      "God's call is not first to raise good children but to be holy as He is holy. Our children's clearest sermon is the holiness — or the hypocrisy — they see in us. Pursue God's holiness for its own sake, out of reverence for Him, and your children will see a faith worth having.",
    pray: "Holy Father, make us holy as you are holy. Let our children see in us a faith that is real.",
    talk: "What is one area where God is calling you to holiness — that your children are quietly watching?",
  },
  {
    read: { text: "Unless the LORD builds the house, those who build it labor in vain.", ref: "Psalm 127:1" },
    reflection: "We can plan, discipline, and pray with all our strength, yet no parent has ever laid a single living stone in a child's heart. God builds, or nothing is built. This verse does not shame our diligence; it dethrones our self-reliance, so we labor as those who trust the Master Builder rather than our own hands.",
    pray: "Sovereign LORD, build this household by your grace, for apart from you we labor in vain.",
    talk: "Where are we quietly trusting our parenting methods instead of the God who alone builds a family?",
  },
  {
    read: { text: "I am the vine; you are the branches. Whoever abides in me and I in him, he it is that bears much fruit, for apart from me you can do nothing.", ref: "John 15:5" },
    reflection: "Christ does not call us to bear fruit for him but to bear fruit from him. A branch does not strain to produce; it abides, and life flows. The fruit we long to see in our children is his to give through our union with him, not a harvest we manufacture by effort severed from Christ.",
    pray: "Lord Jesus, keep us abiding in you, for apart from you we can do nothing.",
    talk: "What in our family life are we attempting apart from Christ, as though the vine could be skipped?",
  },
  {
    read: { text: "so shall my word be that goes out from my mouth; it shall not return to me empty, but it shall accomplish that which I purpose, and shall succeed in the thing for which I sent it.", ref: "Isaiah 55:11" },
    reflection: "God ties his promise to his word, not to our eloquence or our results. When we read Scripture in this home, we are not casting seed into the wind but scattering the very speech of God, which never fails his purpose. That frees us to be faithful with the word and to leave the outcome, and its timing, to him.",
    pray: "Father, let your word do its own sure work in us, in your time and for your purposes.",
    talk: "Do we treat family reading of Scripture as a duty to survive or as the living word of God at work?",
  },
  {
    read: { text: "Let the word of Christ dwell in you richly, teaching and admonishing one another in all wisdom, singing psalms and hymns and spiritual songs, with thankfulness in your hearts to God.", ref: "Colossians 3:16" },
    reflection: "The aim is not a well-managed household but Christ's word dwelling richly among us, spilling over into teaching, correction, and song. Notice the traffic runs among us all, parents and children alike sitting under the same word. We are not curators of our children's souls but fellow hearers, needing the same grace we speak.",
    pray: "Christ, let your word dwell richly in us and overflow in wisdom and thankful song.",
    talk: "Does the word of Christ actually dwell in our home, or merely visit at scheduled times?",
  },
  {
    read: { text: "For the grace of God has appeared, bringing salvation for all people, training us to renounce ungodliness and worldly passions, and to live self-controlled, upright, and godly lives in the present age.", ref: "Titus 2:11-12" },
    reflection: "Grace is not merely the pardon at the beginning; grace itself is the teacher that trains us to say no. We cannot discipline godliness into a child, and we cannot manufacture it in ourselves; the appearing of Christ does the training. So we point our children less to rules to keep and more to the grace that has appeared in him.",
    pray: "Gracious God, let the grace that has appeared in Christ train our whole household in godliness.",
    talk: "Are we trying to train godliness by pressure, or leading our children to the grace that actually teaches?",
  },
  {
    read: { text: "Come, O children, listen to me; I will teach you the fear of the LORD.", ref: "Psalm 34:11" },
    reflection: "We can teach many things, manners, skills, achievement, but only one lesson is the beginning of wisdom, and it is the fear of the LORD. Note that the psalmist does not teach children to fear him; he turns their gaze past himself to God. Our highest calling as parents is not to be revered but to make our children unafraid of everything except the loss of God.",
    pray: "LORD, teach us and our children to fear you above all, that we might truly be wise.",
    talk: "What do our children sense we fear most, and is it the LORD?",
  },
  {
    read: { text: "But seek first the kingdom of God and his righteousness, and all these things will be added to you.", ref: "Matthew 6:33" },
    reflection: "A family can make a hundred good things the first thing, even a child's flourishing, and so quietly unseat the kingdom. Christ does not forbid our concerns; he orders them, promising that what we need is added when he is sought first. The great danger of parenting is not neglect but misplaced worship, tending the gift as though it were the King.",
    pray: "Father, keep your kingdom first in our hearts, that lesser loves stay in their place.",
    talk: "If someone watched our week, what would they name as the thing we truly seek first?",
  },
  {
    read: { text: "for while bodily training is of some value, godliness is of value in every way, as it holds promise for the present life and also for the life to come.", ref: "1 Timothy 4:8" },
    reflection: "We pour ourselves into schedules, teams, and skills, all of some value, yet all bounded by this life. Godliness alone carries a promise that outlasts the grave. This is not a call to neglect the body or the mind, but a plea to weigh our investments honestly, lest we train our children for everything but eternity.",
    pray: "Lord, let us train our children first for godliness, which holds promise for this life and the next.",
    talk: "Where does our family's calendar and effort say bodily training matters more than godliness?",
  },
  {
    read: { text: "He has told you, O man, what is good; and what does the LORD require of you but to do justice, and to love kindness, and to walk humbly with your God?", ref: "Micah 6:8" },
    reflection: "God has already told us what is good; the parenting question is not chiefly what technique works but what he requires. Justice and kindness are visible, but the root is walking humbly with God, the quiet posture that keeps a home from self-righteousness. Children learn humility not from lectures but from watching parents who walk lowly before the Lord.",
    pray: "LORD, teach us to do justice, love kindness, and walk humbly with you before our children.",
    talk: "Which is hardest in our home right now: doing justice, loving kindness, or walking humbly, and why?",
  },
  {
    read: { text: "His divine power has granted to us all things that pertain to life and godliness, through the knowledge of him who called us to his own glory and excellence.", ref: "2 Peter 1:3" },
    reflection: "We often parent as though we lack the resources for the task, straining to supply what only God can give. Yet his divine power has already granted everything needed for life and godliness, and it comes through knowing him. The remedy for our insufficiency is not a better method but a deeper knowledge of the Christ who called us.",
    pray: "Father, we lack nothing for godliness in Christ; deepen our knowledge of him who called us.",
    talk: "When we feel inadequate as parents, do we reach for new strategies or for the knowledge of Christ?",
  },
  {
    read: { text: "I appeal to you therefore, brothers, by the mercies of God, to present your bodies as a living sacrifice, holy and acceptable to God, which is your spiritual worship. Do not be conformed to this world, but be transformed by the renewal of your mind.", ref: "Romans 12:1-2" },
    reflection: "Worship in this home begins with mercies received, not sacrifices offered; the surrender flows from what God has already done in Christ. We cannot renew our own minds, nor our children's, by willpower against the pull of the world. Transformation is God's inward work, so we offer ourselves and ask him to change us from the inside, parents first.",
    pray: "By your mercies, God, receive us as living sacrifices and transform our minds after Christ.",
    talk: "Where is our family being quietly conformed to the world rather than transformed by God?",
  },
  {
    read: { text: "Only take care, and keep your soul diligently, lest you forget the things that your eyes have seen. Make them known to your children and your children's children.", ref: "Deuteronomy 4:9" },
    reflection: "The command to teach the children begins with a warning to guard our own souls, for we cannot pass on what we have let slip from our hearts. God works across generations, but the thread runs through parents who keep remembering what he has done. What we intend to hand down, we must first refuse to forget.",
    pray: "LORD, guard our souls from forgetting your works, that we may make them known to our children.",
    talk: "What has God done in our lives that we are in danger of forgetting before we pass it on?",
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
  { title: "Before the Throne of God Above", line: "Because the sinless Savior died, my sinful soul is counted free." },
  { title: "Crown Him with Many Crowns", line: "Crown Him the Lord of life, who triumphed o'er the grave." },
  { title: "And Can It Be", line: "Amazing love! how can it be that thou, my God, shouldst die for me?" },
  { title: "How Great Thou Art", line: "Then sings my soul, my Savior God, to thee: how great thou art!" },
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
