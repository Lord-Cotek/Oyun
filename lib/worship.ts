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
    read: { text: "I will give thanks to you, for I am fearfully and wonderfully made. Your works are wonderful. My soul knows that very well.", ref: "Psalm 139:14" },
    reflection:
      "This praise sits inside a psalm about God knowing everything — our sitting, rising, and words before we speak them. The wonder is not first that we are impressive, but that we are known and made by God. A child in the womb is not a project of ours; they are a work of his, already fully known.",
    talk: "How does it change your fear to know God already fully knows this child?",
    pray: "Lord, you know this child completely and made them wonderfully. We praise you for works we cannot see.",
  },
  {
    read: { text: "The grass withers, the flower fades; but the word of our God stands forever.", ref: "Isaiah 40:8" },
    reflection:
      "Isaiah is comforting exiles who have watched everything solid fall apart. Grass withers, flowers fade, empires end — and the word of our God stands. In a season of changing bodies, shifting plans and uncertain outcomes, this is the one thing that will not move under your feet.",
    talk: "What in this season feels like withering grass? What word of God will you stand on instead?",
    pray: "Everlasting God, when everything else fades, hold us to your word that stands forever.",
  },
  {
    read: { text: "The Word became flesh, and lived among us. We saw his glory, such glory as of the one and only Son of the Father, full of grace and truth.", ref: "John 1:14" },
    reflection:
      "God did not save us from a distance. The Word took on flesh, was carried in a womb, born in a body, dependent on a mother. Whatever you are learning about frailty and flesh in these months, Christ has entered it himself. The incarnation means our God is not squeamish about bodies.",
    talk: "What does it mean to you that Jesus was once a child in a mother's body?",
    pray: "Lord Jesus, you took on flesh for us. Thank you that our God knows the womb from the inside.",
  },
  {
    read: { text: "We know that all things work together for good for those who love God, for those who are called according to his purpose.", ref: "Romans 8:28" },
    reflection:
      "Read the next verse before you claim this one: the good God works toward is being conformed to the image of his Son. This is not a promise that every outcome will be pleasant, or that a hard providence will be explained. It is a promise that nothing is wasted, and that God is bending even the worst of it toward Christ in us.",
    talk: "Where are you tempted to read this verse as a guarantee that nothing hard will happen?",
    pray: "Father, we cannot see how you are working. Make us like your Son through whatever comes.",
  },
  {
    read: { text: "“For I know the thoughts that I think toward you,” says the LORD, “thoughts of peace, and not of evil, to give you hope and a future.”", ref: "Jeremiah 29:11" },
    reflection:
      "These words were written to exiles told to settle down in Babylon for seventy years — most would die there. God's good plan was real, but it ran straight through decades of hardship and a generation's whole lifetime. Take the comfort, but take it honestly: God's plans are good and long, not always quick or comfortable.",
    talk: "Have you ever heard this verse used to promise something God did not promise?",
    pray: "Lord, your plans are good even when they are long. Give us patience to trust you inside the waiting.",
  },
  {
    read: { text: "Not that I speak because of lack, for I have learned in whatever state I am, to be content in it. I know how to be humbled, and I also know how to abound. In everything and in all things I have learned the secret both to be filled and to be hungry, both to abound and to be in need. I can do all things through Christ, who strengthens me.", ref: "Philippians 4:11-13" },
    reflection:
      "The famous verse about doing all things is not about achievement — it is the end of a sentence about contentment. Paul learned it in plenty and in hunger, in abundance and in need. The strength Christ gives is not the power to get what you want; it is the power to be content whichever way it goes.",
    talk: "Which is harder for you right now — contentment in lack, or contentment in abundance?",
    pray: "Christ our strength, teach us contentment in plenty and in want. Be enough for us either way.",
  },
  {
    read: { text: "He has said to me, “My grace is sufficient for you, for my power is made perfect in weakness.” Most gladly therefore I will rather glory in my weaknesses, that the power of Christ may rest on me.", ref: "2 Corinthians 12:9" },
    reflection:
      "Paul asked three times for the thorn to be taken away, and God said no — and that no was grace. God did not remove the weakness; he supplied himself in it. This is the opposite of a faith that measures God's favour by how much has been removed from our lives.",
    talk: "What are you asking God to remove? What would it look like to ask for grace in it instead?",
    pray: "Lord, if you do not remove this, be sufficient in it. Let your power rest on our weakness.",
  },
  {
    read: { text: "Be still, and know that I am God. I will be exalted among the nations. I will be exalted in the earth.", ref: "Psalm 46:10" },
    reflection:
      "Be still is not a spa invitation. The psalm is full of roaring waters, nations raging, and the earth giving way; the stillness is the command to stop striving and look at who God is above the noise. Stillness here is surrender, not calm circumstances.",
    talk: "What would stopping striving actually look like for you this week?",
    pray: "God of Jacob, we stop striving. Be exalted above our fears and our plans.",
  },
  {
    read: { text: "For we don’t have a high priest who can’t be touched with the feeling of our infirmities, but one who has been in all points tempted like we are, yet without sin. Let’s therefore draw near with boldness to the throne of grace, that we may receive mercy and may find grace for help in time of need.", ref: "Hebrews 4:15-16" },
    reflection:
      "We do not have a high priest who is distant from weakness. Jesus was tempted in every way and understands what a body costs. That is why the throne is called a throne of grace and why we are told to come boldly — not because we have held it together, but because he has.",
    talk: "What have you been carrying alone that you could bring boldly to Christ today?",
    pray: "Great High Priest, you know our weakness. We come boldly, not because we are strong but because you are merciful.",
  },
  {
    read: { text: "Humble yourselves therefore under the mighty hand of God, that he may exalt you in due time, casting all your worries on him, because he cares for you.", ref: "1 Peter 5:6-7" },
    reflection:
      "Casting your cares is not a separate technique; it is the second half of humbling yourself under God's hand. Anxiety often hides pride — the belief that outcomes rest on us. To cast care on him is to admit he is God and we are not, and to trust that he genuinely cares.",
    talk: "What anxiety are you holding as though the outcome depends on you?",
    pray: "Father, we humble ourselves under your hand. Take the weight we were never able to carry.",
  },
  {
    read: { text: "Like a father has compassion on his children, so the LORD has compassion on those who fear him. For he knows how we are made. He remembers that we are dust.", ref: "Psalm 103:13-14" },
    reflection:
      "God does not forget what we are made of. A father's compassion is the picture, and dust is the material. In months where you cannot do what you used to do, this is not an accusation but a comfort: the Lord is not disappointed by your frailty. He remembers it, and he pities.",
    talk: "Where are you being harder on yourself than God is?",
    pray: "Compassionate Father, you remember we are dust. Be gentle with us as we are, not as we wish we were.",
  },
  {
    read: { text: "You fathers, don’t provoke your children to wrath, but nurture them in the discipline and instruction of the Lord.", ref: "Ephesians 6:4" },
    reflection:
      "The command comes with a warning: do not provoke them. Discipline and instruction are to be of the Lord, not of our temper or our ambition for them. A father's authority in this house is a stewardship under Christ, exercised for the child's good and never for the parent's ego.",
    talk: "What in your own temperament is most likely to provoke rather than train?",
    pray: "Father, keep us from provoking this child. Teach us to raise them in your discipline, not our frustration.",
  },
  {
    read: { text: "We will not hide them from their children, telling to the generation to come the praises of the LORD, his strength, and his wondrous deeds that he has done. For he established a covenant in Jacob, and appointed a teaching in Israel, which he commanded our fathers, that they should make them known to their children; that the generation to come might know, even the children who should be born; who should arise and tell their children, that they might set their hope in God, and not forget God’s deeds, but keep his commandments,", ref: "Psalm 78:4-7" },
    reflection:
      "The psalm commands one generation to tell the next what God has done — and the telling includes Israel's failures, not only its victories. Honest testimony, wonders and rebellion together, is what teaches children to set their hope in God rather than in their parents.",
    talk: "What story of God's faithfulness, including a hard one, will you want to tell this child?",
    pray: "Lord, help us tell the next generation what you have done — honestly, so their hope is set on you.",
  },
  {
    read: { text: "Every good gift and every perfect gift is from above, coming down from the Father of lights, with whom can be no variation, nor turning shadow.", ref: "James 1:17" },
    reflection:
      "Every good gift comes down from a Father who does not vary or turn like shifting shadows. Our circumstances swing wildly; he does not. That means the goodness of God is not measured by the quality of our week, and gifts are received from his hand rather than earned by our performance.",
    talk: "Name one good gift this week. Did you receive it as a gift, or as something owed?",
    pray: "Father of lights, you do not change. Thank you for every good gift, and for being better than your gifts.",
  },
  {
    read: { text: "I have been crucified with Christ, and it is no longer I who live, but Christ lives in me. That life which I now live in the flesh, I live by faith in the Son of God, who loved me, and gave himself up for me.", ref: "Galatians 2:20" },
    reflection:
      "The Christian life is not Christ helping us live our life; it is Christ living his life in us. Paul says the I who lives is no longer the old I. In a season where your body, sleep and plans are not your own, this is not a loss to grieve but a pattern you were already called into.",
    talk: "Where is your sense of self most under pressure right now? What does Galatians 2:20 say to it?",
    pray: "Lord Jesus, you loved us and gave yourself for us. Live your life in us today.",
  },
  {
    read: { text: "Not only this, but we also rejoice in our sufferings, knowing that suffering produces perseverance; and perseverance, proven character; and proven character, hope: and hope doesn’t disappoint us, because God’s love has been poured into our hearts through the Holy Spirit who was given to us.", ref: "Romans 5:3-5" },
    reflection:
      "Paul does not say suffering is good, or that we should enjoy it. He says God is doing something through it — endurance, character, hope — and that this hope does not put us to shame because God's love has been poured out in us. This is honest, not cheerful; it looks at suffering and still tells the truth about God.",
    talk: "What is God patiently building in you that you would not have chosen?",
    pray: "Father, we do not enjoy this. Work endurance and hope in us, and pour out your love in our hearts.",
  },
  {
    read: { text: "Surely I have stilled and quieted my soul, like a weaned child with his mother, like a weaned child is my soul within me.", ref: "Psalm 131:2" },
    reflection:
      "David calms himself like a weaned child with its mother — not a hungry infant demanding, but a child content simply to be near. The psalm begins by refusing to occupy itself with things too great. There is deep rest in admitting how much you do not understand and staying close anyway.",
    talk: "What question are you demanding an answer to that you may need to lay down for now?",
    pray: "Lord, we do not occupy ourselves with things too great for us. Quiet our souls near you.",
  },
  {
    read: { text: "When you pass through the waters, I will be with you, and through the rivers, they will not overflow you. When you walk through the fire, you will not be burned, and flame will not scorch you.", ref: "Isaiah 43:2" },
    reflection:
      "Notice what God does not promise: he does not say you will avoid the waters or the fire. He says when you pass through them, he will be with you. The promise is presence in it, not exemption from it. Any comfort that promises exemption is promising what God did not.",
    talk: "Have you been hoping God will keep you out of something, when he has promised to be with you in it?",
    pray: "Lord, we may yet pass through deep water. Be with us in it, as you have promised.",
  },
  {
    read: { text: "I have told you these things, that in me you may have peace. In the world you have trouble; but cheer up! I have overcome the world.", ref: "John 16:33" },
    reflection:
      "Jesus tells his disciples plainly that in the world they will have trouble — and then tells them to take heart because he has overcome the world. He gives no false comfort and no denial. Peace here is not the absence of trouble but confidence in the one who has already won.",
    talk: "Where have you been waiting for trouble to end before you let yourself have peace?",
    pray: "Lord Jesus, you have overcome the world. Give us your peace inside the trouble, not instead of it.",
  },
  {
    read: { text: "Even though I walk through the valley of the shadow of death, I will fear no evil, for you are with me. Your rod and your staff, they comfort me.", ref: "Psalm 23:4" },
    reflection:
      "David does not say he is taken around the valley but through it, and the comfort is not the absence of shadow — it is a shepherd who is with him and a rod and staff that are near. Fear is answered by company, not by explanation.",
    talk: "What valley are you in or afraid of? What difference does the Shepherd's presence make?",
    pray: "Shepherd of our souls, walk with us through whatever valley comes. Your presence is enough.",
  },
  {
    read: { text: "See how great a love the Father has given to us, that we should be called children of God! For this cause the world doesn’t know us, because it didn’t know him.", ref: "1 John 3:1" },
    reflection:
      "John cannot get over it: see what kind of love the Father has given, that we should be called children of God. Before this child is ever yours, you are his. Parenting flows out of being fathered, and a parent who has forgotten they are a child will parent from emptiness.",
    talk: "Do you more naturally relate to God as a child, or as a worker trying to please him?",
    pray: "Father, we are your children. Let us parent out of being loved by you, not out of our own emptiness.",
  },
  {
    read: { text: "For you didn’t receive the spirit of bondage again to fear, but you received the Spirit of adoption, by whom we cry, “Abba! Father!”", ref: "Romans 8:15" },
    reflection:
      "The Spirit we received is not a spirit of slavery leading back to fear but the Spirit of adoption, by whom we cry Abba, Father. Fear is the native language of a slave; Abba is the language of a child. In an anxious season, notice which language your prayers are speaking.",
    talk: "Do your prayers this week sound more like a slave's or a child's?",
    pray: "Abba, Father, we are not slaves but children. Teach us to pray without fear.",
  },
  {
    read: { text: "even as he chose us in him before the foundation of the world, that we would be holy and without defect before him in love, having predestined us for adoption as children through Jesus Christ to himself, according to the good pleasure of his desire,", ref: "Ephesians 1:4-5" },
    reflection:
      "God chose us in Christ before the foundation of the world and predestined us for adoption according to the purpose of his will. Our standing does not rest on our performance as parents or as people, because it was settled before we existed. That is the deepest possible ground for a shaky season.",
    talk: "How does it steady you that your standing with God was settled before you could earn it?",
    pray: "Father, you chose us in Christ before the world began. Let that settle our hearts today.",
  },
  {
    read: { text: "Behold, I was born in iniquity. My mother conceived me in sin.", ref: "Psalm 51:5" },
    reflection:
      "David is not blaming his mother or calling conception sinful; he is confessing that sin goes back further in him than any single act. This matters for parenting: your child will not be sinless because you are diligent. They will need the same grace you needed, and that keeps us honest and prayerful.",
    talk: "How does knowing your child will need grace, not just training, change how you pray for them?",
    pray: "Merciful God, we and our children are sinners by nature. Save us all by your grace, not our goodness.",
  },
  {
    read: { text: "God created man in his own image. In God’s image he created him; male and female he created them.", ref: "Genesis 1:27" },
    reflection:
      "Every human being, at every stage, bears the image of God — not because of capacity, usefulness, or how far along they are. This is the ground of a Christian view of the unborn, of the disabled, and of the very old. Dignity is given by God, not earned by development.",
    talk: "Where does the world around you measure a person's worth by what they can do?",
    pray: "Creator God, you make people in your own image. Teach us to treat every life as you do.",
  },
  {
    read: { text: "Mary said, “Behold, the servant of the Lord; let it be done to me according to your word.” The angel departed from her.", ref: "Luke 1:38" },
    reflection:
      "Mary is told something frightening, socially costly, and impossible to explain, and she answers as the servant of the Lord. Notice she has already asked an honest question first. Submission here is not the absence of questions; it is trust that keeps saying yes after the questions are asked.",
    talk: "What has God given you that you would not have chosen? Can you say let it be?",
    pray: "Lord, we are your servants. Let it be to us according to your word, even when we do not understand it.",
  },
  {
    read: { text: "Trust in the LORD with all your heart, and don’t lean on your own understanding. In all your ways acknowledge him, and he will make your paths straight.", ref: "Proverbs 3:5-6" },
    reflection:
      "Trusting with all your heart is set against leaning on your own understanding — not against thinking. The promise that he will make your paths straight is not a promise of an easy or obvious route, but that the Lord himself will direct it. Guidance is a person, not a map.",
    talk: "Where are you leaning hardest on your own understanding right now?",
    pray: "Lord, we do not understand this season. We trust you and ask you to direct our paths.",
  },
  {
    read: { text: "Come to me, all you who labor and are heavily burdened, and I will give you rest. Take my yoke upon you, and learn from me, for I am gentle and humble in heart; and you will find rest for your souls. For my yoke is easy, and my burden is light.", ref: "Matthew 11:28-30" },
    reflection:
      "Jesus does not offer the removal of the yoke but the exchange of it. His is easy and his burden light, not because there is nothing to carry, but because he carries it with us and his terms are gentle. Rest here is found in a person, not in a lighter schedule.",
    talk: "What yoke are you carrying that Christ never gave you?",
    pray: "Lord Jesus, we are weary. We come to you for rest and take your yoke instead of ours.",
  },
  {
    read: { text: "Blessed be the God and Father of our Lord Jesus Christ, the Father of mercies and God of all comfort; who comforts us in all our affliction, that we may be able to comfort those who are in any affliction, through the comfort with which we ourselves are comforted by God.", ref: "2 Corinthians 1:3-4" },
    reflection:
      "God comforts us in all our affliction so that we can comfort others with the comfort we ourselves received. Nothing you suffer is only for you. This is not a reason to rush past grief, but it does mean your hardest season may one day be the very thing that steadies someone else.",
    talk: "Who comforted you well in a hard time? What did they actually do?",
    pray: "God of all comfort, comfort us — and make us able to comfort others with what you give.",
  },
  {
    read: { text: "Trust in him at all times, you people. Pour out your heart before him. God is a refuge for us.", ref: "Psalm 62:8" },
    reflection:
      "Pour out your heart before him — God can take the unedited version. The psalm says this to a people told to trust him at all times, and it ends by naming God our refuge. Honest prayer is not a lack of faith; it is what faith sounds like when it is under pressure.",
    talk: "Is there something you have been praying politely about that you need to say honestly?",
    pray: "Lord, we pour out our hearts to you. You are our refuge and can hold everything we bring.",
  },
  {
    read: { text: "You will keep whoever’s mind is steadfast in perfect peace, because he trusts in you.", ref: "Isaiah 26:3" },
    reflection:
      "Perfect peace is kept for the mind that is stayed on God — and the reason given is that he is trusted. Peace here is not a mood we manufacture but the fruit of where our thoughts rest. In an anxious season the question is less how do I feel and more where is my mind staying.",
    talk: "Where does your mind go by default when you lie awake?",
    pray: "Lord, keep our minds stayed on you, and keep us in your peace because we trust you.",
  },
  {
    read: { text: "the LORD himself is who goes before you. He will be with you. He will not fail you nor forsake you. Don’t be afraid. Don’t be discouraged.", ref: "Deuteronomy 31:8" },
    reflection:
      "Moses says this to a people about to enter a land full of real dangers. The promise is not that there is nothing to fear but that the Lord goes before them and will not leave them. Courage in Scripture is almost always grounded in God's presence, never in a guaranteed outcome.",
    talk: "What are you walking toward that you would like a guarantee about? What has God actually promised?",
    pray: "Lord, you go before us and will not forsake us. Give us courage that rests on your presence.",
  },
  {
    read: { text: "So teach us to count our days, that we may gain a heart of wisdom.", ref: "Psalm 90:12" },
    reflection:
      "Moses prays for a heart of wisdom by learning to number our days — a prayer born from honestly facing how short life is. This is not morbid; it is clarifying. Parents of small children live in days that feel endless and years that vanish, and wisdom comes from counting them honestly before God.",
    talk: "If this season is shorter than it feels, what would you want to do differently in it?",
    pray: "Teach us to number our days, Lord, that we may get a heart of wisdom.",
  },
  {
    read: { text: "For everything there is a season, and a time for every purpose under heaven:", ref: "Ecclesiastes 3:1" },
    reflection:
      "The Preacher lists times to be born and to die, to weep and to laugh, to embrace and to refrain. He is not being poetic about balance; he is facing that we do not control the seasons. Naming the season you are actually in, rather than the one you wish you were in, is the beginning of wisdom.",
    talk: "What season are you actually in right now? Have you accepted it, or are you resisting it?",
    pray: "Lord of every season, help us live honestly in the one you have given, not the one we imagined.",
  },
  {
    read: { text: "Always rejoice. Pray without ceasing. In everything give thanks, for this is the will of God in Christ Jesus toward you.", ref: "1 Thessalonians 5:16-18" },
    reflection:
      "Rejoice always, pray without ceasing, give thanks in all circumstances — notice it is in all circumstances, not for all circumstances. We are not asked to call evil good. We are asked to keep speaking to God in the middle of everything, which is a very different thing.",
    talk: "What can you honestly thank God for in this circumstance, without pretending it is good?",
    pray: "Father, teach us to give thanks in this, not pretend about it. Keep us praying without ceasing.",
  },
  {
    read: { text: "He is before all things, and in him all things are held together.", ref: "Colossians 1:17" },
    reflection:
      "Christ is before all things, and in him all things hold together. The universe is not self-sustaining and neither is your household. On days when everything feels like it is coming apart, the one holding it together is not you, and he is not struggling.",
    talk: "What are you trying to hold together that you could hand back to Christ today?",
    pray: "Lord Jesus, you hold all things together. Hold this family together when we cannot.",
  },
  {
    read: { text: "He will wipe away every tear from their eyes. Death will be no more; neither will there be mourning, nor crying, nor pain, any more. The first things have passed away.", ref: "Revelation 21:4" },
    reflection:
      "Every tear wiped away, death gone, mourning and crying and pain gone — because the former things have passed away. This is the Christian hope, and it is not now. Holding it honestly keeps us from demanding heaven in this life while keeping us from despair when this life hurts.",
    talk: "How does a hope that is genuinely future change how you carry present pain?",
    pray: "Lord, we long for the day you wipe away every tear. Until then, hold us in hope.",
  },
  {
    read: { text: "Oh taste and see that the LORD is good. Blessed is the man who takes refuge in him.", ref: "Psalm 34:8" },
    reflection:
      "Taste and see that the Lord is good — an invitation to experience, not merely to agree. David wrote it after a humiliating escape, not from a comfortable life. Goodness here is tested and found true in hard circumstances, which is the only kind of testimony worth passing to a child.",
    talk: "When have you actually tasted God's goodness rather than just believed in it?",
    pray: "Lord, let us taste and see that you are good, and let our child grow up hearing that we did.",
  },
  {
    read: { text: "Beloved, I pray that you may prosper in all things and be healthy, even as your soul prospers.", ref: "3 John 1:2" },
    reflection:
      "This line is often quoted as a promise of health and wealth; it is in fact the ordinary opening courtesy of an ancient letter, John's warm wish for his friend Gaius, much like we might write hoping this finds you well. Scripture is not a lever for prosperity. Read it as the affection it is, and let it stay affection.",
    talk: "Where have you seen Scripture used to promise things it does not actually say?",
    pray: "Lord, keep us from bending your word to promise what it never promised. Let us love it as it is.",
  },
  {
    read: { text: "Did he not make you one, although he had the residue of the Spirit? Why one? He sought godly offspring. Therefore take heed to your spirit, and let no one deal treacherously against the wife of his youth.", ref: "Malachi 2:15" },
    reflection:
      "God seeks godly offspring — and the context is a rebuke to men dealing faithlessly with their wives. The health of the marriage is not separate from the discipleship of the children. Guarding your covenant with your spouse is part of how you love the child you are expecting.",
    talk: "How is the state of your marriage shaping the home this child will be born into?",
    pray: "Lord, guard our covenant. Let faithfulness to one another be part of how we raise this child.",
  },
  {
    read: { text: "As one whom his mother comforts, so I will comfort you. You will be comforted in Jerusalem.", ref: "Isaiah 66:13" },
    reflection:
      "God chooses a mother's comfort as the picture of his own. It is worth sitting with: the tenderness a mother gives is a faint echo of something in God, not the other way round. Whatever comfort you long to give this child, God gives more truly.",
    talk: "What kind of comfort do you most want to give this child? Where will you get it from?",
    pray: "Lord, you comfort as a mother comforts. Comfort us, and make us comforters in this home.",
  },
  {
    read: { text: "But Mary kept all these sayings, pondering them in her heart.", ref: "Luke 2:19" },
    reflection:
      "Mary treasured up all these things and pondered them in her heart. She did not understand it all; she kept it. Much of early parenting is like this — moments too large to process in the moment, stored up and understood years later. Keeping is a spiritual act.",
    talk: "What from this season do you want to treasure and ponder rather than rush past?",
    pray: "Lord, help us treasure what you are doing here, even the parts we do not yet understand.",
  },
  {
    read: { text: "Jesus Christ is the same yesterday, today, and forever.", ref: "Hebrews 13:8" },
    reflection:
      "Jesus Christ is the same yesterday, today, and forever. Everything about your body, your home and your routine is changing right now. The unchanging one is not a distant abstraction but the person who has already proved his love at the cross, and will not be different tomorrow.",
    talk: "What has changed most in your life recently? What has not changed at all?",
    pray: "Unchanging Christ, when everything else shifts, you are the same. We rest there.",
  },
  {
    read: { text: "I am still confident of this: I will see the goodness of the LORD in the land of the living. Wait for the LORD. Be strong, and let your heart take courage. Yes, wait for the LORD.", ref: "Psalm 27:13-14" },
    reflection:
      "David says he would have despaired unless he had believed he would see the goodness of the Lord in the land of the living — and then tells himself to wait. Waiting on the Lord is active and difficult, and even David had to preach it to his own heart. Say it to yourself when no one else will.",
    talk: "What do you need to preach to your own heart this week?",
    pray: "Lord, we will see your goodness in the land of the living. Strengthen our hearts as we wait.",
  },
  {
    read: { text: "Know that the LORD, he is God. It is he who has made us, and we are his. We are his people, and the sheep of his pasture.", ref: "Psalm 100:3" },
    reflection:
      "Know that the Lord is God — it is he who made us, and we are his. The order matters: we belong to him before anyone belongs to us. A child entrusted to you is still his sheep, his making, his possession. That is a relief, not a threat.",
    talk: "What changes when you remember this child belongs to God before they belong to you?",
    pray: "Lord, you made us and we are yours. This child is yours before they are ours.",
  },
  {
    read: { text: "Blessed be the God and Father of our Lord Jesus Christ, who according to his great mercy caused us to be born again to a living hope through the resurrection of Jesus Christ from the dead,", ref: "1 Peter 1:3" },
    reflection:
      "We have been born again to a living hope through the resurrection of Jesus Christ from the dead. Peter writes to scattered, suffering believers. Christian hope is not optimism about how things will go; it is anchored in something that has already happened in history and cannot be undone.",
    talk: "Is your hope resting on how you expect things to go, or on what Christ has already done?",
    pray: "Father of mercies, thank you for a living hope grounded in the resurrection, not in our circumstances.",
  },
  {
    read: { text: "For a child is born to us. A son is given to us; and the government will be on his shoulders. His name will be called Wonderful Counselor, Mighty God, Everlasting Father, Prince of Peace.", ref: "Isaiah 9:6" },
    reflection:
      "For to us a child is born — but the child is not ours. Isaiah is speaking of Christ, whose names are Wonderful Counsellor and Mighty God. It is a good corrective in a season consumed with one particular child: the only child who can carry the weight of the world has already been born.",
    talk: "What hope might you be placing on this child that only Christ can carry?",
    pray: "Lord Jesus, you are the Child given for us. Keep us from asking our child to be what only you are.",
  },
  {
    read: { text: "Every Scripture is God-breathed and profitable for teaching, for reproof, for correction, and for instruction in righteousness, that each person who belongs to God may be complete, thoroughly equipped for every good work.", ref: "2 Timothy 3:16-17" },
    reflection:
      "All Scripture is breathed out by God and profitable — including the parts that correct and reprove us, not only the parts that comfort. A household that only reads the encouraging verses is not really under the Word. The whole of it is what makes us complete.",
    talk: "Which parts of Scripture do you tend to skip? What might God want to say there?",
    pray: "Lord, your whole Word is breathed out by you. Teach, reprove, correct and train us by it.",
  },
  {
    read: { text: "He will not allow your foot to be moved. He who keeps you will not slumber. Behold, he who keeps Israel will neither slumber nor sleep.", ref: "Psalm 121:3-4" },
    reflection:
      "He who keeps you will not slumber; the keeper of Israel neither slumbers nor sleeps. For anyone awake at 3am, this is startlingly literal comfort. Someone is awake, and it does not exhaust him. You are not the only one keeping watch over this house tonight.",
    talk: "What do you find yourself keeping watch over that God is already watching?",
    pray: "Keeper of Israel, you never sleep. Watch over this house tonight while we cannot.",
  },
  {
    read: { text: "Have this in your mind, which was also in Christ Jesus, who, existing in the form of God, didn’t consider equality with God a thing to be grasped, but emptied himself, taking the form of a servant, being made in the likeness of men.", ref: "Philippians 2:5-7" },
    reflection:
      "Have this mind among yourselves, which is yours in Christ Jesus, who emptied himself and took the form of a servant. The pattern of the Christian life is downward — power laid down for the good of another. Parenting is one of the most ordinary places this pattern is practised.",
    talk: "Where is God asking you to lay something down for the good of someone else?",
    pray: "Lord Jesus, you emptied yourself for us. Give us your mind in this home, laying down our rights in love.",
  },
  {
    read: { text: "You will show me the path of life. In your presence is fullness of joy. In your right hand there are pleasures forever more.", ref: "Psalm 16:11" },
    reflection:
      "In your presence is fullness of joy — the joy is located in a person, not in circumstances. David writes this while speaking of the Lord as his chosen portion. If joy is in God's presence, then it is available in seasons that are exhausting and uncertain, and not guaranteed by seasons that go well.",
    talk: "Where have you been looking for joy that only God's presence can give?",
    pray: "Lord, in your presence is fullness of joy. Draw us near, and let our joy be in you.",
  },
  {
    read: { text: "Let’s not be weary in doing good, for we will reap in due season, if we don’t give up.", ref: "Galatians 6:9" },
    reflection:
      "Let us not grow weary in doing good, for in due season we will reap if we do not give up. Notice due season — God's timing, not ours. This is not a promise of quick results, and it assumes weariness is real. It simply asks us to keep going.",
    talk: "Where are you closest to giving up in doing good right now?",
    pray: "Lord, we are weary. Keep us doing good, and give us patience for your due season.",
  },
  {
    read: { text: "Yes most certainly, and I count all things to be a loss for the excellency of the knowledge of Christ Jesus, my Lord, for whom I suffered the loss of all things, and count them nothing but refuse, that I may gain Christ", ref: "Philippians 3:8" },
    reflection:
      "Paul counts everything — even his best gifts — as loss next to knowing Christ. This is the great guard against making an idol of your child or your parenting: they are precious gifts, but they are not your treasure. Christ is. When He is supreme, you are freed to love your child rightly — as a gift, and never a god.",
    pray: "Lord Jesus, be our supreme treasure. Let us love our children well because we love you first and most.",
    talk: "Be honest: has any hope for your child quietly taken the place that belongs to Christ alone?",
  },
  {
    read: { text: "These words, which I command you today, shall be on your heart; and you shall teach them diligently to your children, and shall talk of them when you sit in your house, and when you walk by the way, and when you lie down, and when you rise up.", ref: "Deuteronomy 6:6-7" },
    reflection:
      "Before a parent can teach the Word, it must first be on their own heart. God does not ask us to hand down a faith we do not hold. Family worship begins not with technique but with parents who themselves love and treasure God's Word — and then let it overflow to the little ones.",
    pray: "Father, make our home a place where your Word is spoken and loved. Write it first on our hearts, and then on our children's.",
    talk: "What is one truth about God you most want your child to know deep in their bones?",
  },
  {
    read: { text: "Jesus said to him, “‘You shall love the Lord your God with all your heart, with all your soul, and with all your mind.’ This is the first and great commandment.”", ref: "Matthew 22:37-38" },
    reflection:
      "The first commandment is to love God — not our children. This is not cold; it is the only order that keeps love from becoming idolatry. A child loved more than God is a child crushed under a weight they were never meant to bear. Love God first, and your children are freed to be loved as children, not as gods.",
    pray: "Father, capture our hearts' first love. From loving you supremely, teach us to love our children truly.",
    talk: "What would change this week if loving God first genuinely came before every hope you have for your child?",
  },
  {
    read: { text: "Train up a child in the way he should go, and when he is old he will not depart from it.", ref: "Proverbs 22:6" },
    reflection:
      "This is a proverb — a wise pattern, not an ironclad promise that guarantees an outcome. Our task is faithful training; the fruit belongs to God. That frees us from both pride and despair: we labor diligently, and we entrust the results to the Lord who alone can save.",
    pray: "Lord, give us patience and faithfulness to train this child, and do what only you can do — hold their heart, and bring them home.",
    talk: "Where are you tempted to either coast on grace or grasp for control in parenting? What would trusting God look like instead?",
  },
  {
    read: { text: "for by grace you have been saved through faith, and that not of yourselves; it is the gift of God, not of works, that no one would boast.", ref: "Ephesians 2:8-9" },
    reflection:
      "Salvation is grace from first to last — not earned by our performance, and not by our parenting. This frees us: we are not saved by raising perfect children, nor are our children saved by our efforts. We labor in faith and rest in grace, boasting not in ourselves but in God.",
    pray: "God of grace, save us and our children by your mercy, not our merit. Keep us from boasting in anything but you.",
    talk: "Where are you tempted to treat parenting as something that earns God's favor — for you or your child?",
  },
  {
    read: { text: "But when Jesus saw it, he was moved with indignation, and said to them, “Allow the little children to come to me! Don’t forbid them, for God’s Kingdom belongs to such as these.”", ref: "Mark 10:14" },
    reflection:
      "Jesus was indignant when children were kept from Him. He does not merely tolerate the young — He welcomes them and holds them up as a picture of the kingdom. Our job is never to be a barrier between our children and Christ, but a door: pointing, inviting, making the way to Him plain and warm.",
    pray: "Jesus, draw our child to yourself early. Let us never hinder them, but always point the way to your open arms.",
    talk: "In what small way can you make Jesus feel welcoming and near to your child this week?",
  },
  {
    read: { text: "For I delivered to you first of all that which I also received: that Christ died for our sins according to the Scriptures, that he was buried, that he was raised on the third day according to the Scriptures,", ref: "1 Corinthians 15:3-4" },
    reflection:
      "Here is the gospel of first importance — not advice for better families, but the death and resurrection of Christ for sinners. Everything in a Christian home stands on this. Before we are parents, we are sinners saved by a crucified and risen Savior. Keep this at the center, and parenting finds its right place.",
    pray: "Thank you, Lord, for Christ crucified and risen for us. Let the gospel be the ground our home is built on.",
    talk: "How can the gospel — Christ's death and resurrection — stay central in your home, not just good behavior?",
  },
  {
    read: { text: "But the LORD’s loving kindness is from everlasting to everlasting with those who fear him, his righteousness to children’s children,", ref: "Psalm 103:17" },
    reflection:
      "God's covenant love reaches across generations. He delights to be the God of families — of parents, and of their children after them. This is the hope under all our praying: not the strength of our parenting, but the faithfulness of a God whose mercy runs down the generations like a river.",
    pray: "God of covenant love, be the God of our child, and of their children after them, to a thousand generations.",
    talk: "Whose faith was passed down to you? Give thanks for them by name.",
  },
  {
    read: { text: "He is the head of the body, the assembly, who is the beginning, the firstborn from the dead, that in all things he might have the preeminence.", ref: "Colossians 1:18" },
    reflection:
      "In everything — including your family — Christ is meant to be preeminent: first, supreme. Not your child, not your dreams for them, not the family itself. When Christ holds first place, the home is well-ordered; when anything else does, it becomes an idol that cannot bear the weight.",
    pray: "Lord Jesus, be preeminent in our home — first in our affections, our decisions, our hopes.",
    talk: "What currently competes with Christ for first place in your family's life?",
  },
  {
    read: { text: "From infancy, you have known the holy Scriptures which are able to make you wise for salvation through faith, which is in Christ Jesus.", ref: "2 Timothy 3:15" },
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
    read: { text: "Behold, children are a heritage of the LORD. The fruit of the womb is his reward.", ref: "Psalm 127:3" },
    reflection:
      "A heritage is a gift received, not a wage earned. Children are entrusted to us, but they belong first to God. Holding them with open hands — as His before they are ours — changes everything: it turns anxious ownership into grateful stewardship.",
    pray: "Thank you for the gift of this child. Help us hold them with open hands, as yours before ours.",
    talk: "What does it look like, practically, to parent as a steward rather than an owner?",
  },
  {
    read: { text: "But God commends his own love toward us, in that while we were yet sinners, Christ died for us.", ref: "Romans 5:8" },
    reflection:
      "God's love is proven not by our worthiness but by Christ dying for the unworthy. This is the love we rest in, and the love we model — loving our children not because they earn it, but freely, as we have been loved. The cross, not our children's behavior, is the measure of grace.",
    pray: "Thank you for loving us while we were still sinners. Teach us to love our children with that same free grace.",
    talk: "How does being loved by God 'while still a sinner' shape how you will love your child on their hardest days?",
  },
  {
    read: { text: "If it seems evil to you to serve the LORD, choose today whom you will serve; whether the gods which your fathers served that were beyond the River, or the gods of the Amorites, in whose land you dwell; but as for me and my house, we will serve the LORD.", ref: "Joshua 24:15" },
    reflection:
      "Joshua's declaration is a settled decision made before the pressures come. A home is not neutral ground; it is always serving something. To say 'we will serve the LORD' is to choose, on ordinary days, a hundred small allegiances that add up to a household pointed toward God.",
    pray: "Lord, make this the settled confession of our home — that we, and our house, will serve you together.",
    talk: "What is one 'small allegiance' — a rhythm or habit — that would point your home more toward God?",
  },
  {
    read: { text: "Every Scripture is God-breathed and profitable for teaching, for reproof, for correction, and for instruction in righteousness,", ref: "2 Timothy 3:16" },
    reflection:
      "Scripture is God's own breath — sufficient to make us complete and equipped. We do not need the latest parenting theory as our foundation; we need the Word. Let the whole counsel of God, not merely a few sentimental verses, shape your home.",
    pray: "Lord, make your Word our foundation. Feed us on the whole of Scripture, and equip us by it.",
    talk: "Is your family fed on the whole of Scripture, or only the comfortable parts? Where could you go deeper?",
  },
  {
    read: { text: "One generation will commend your works to another, and will declare your mighty acts.", ref: "Psalm 145:4" },
    reflection:
      "Faith is meant to be handed down by telling — one generation speaking of God's works to the next. Children come to know a God who acts by hearing the stories: what He has done in Scripture, and what He has done in your own life. Testimony is a means of grace in a home.",
    pray: "Help us tell of your works, Lord — in Scripture and in our own lives — so the next generation will know you.",
    talk: "Tell one story of God's faithfulness in your life that you want your child to grow up hearing.",
  },
  {
    read: { text: "Whether therefore you eat, or drink, or whatever you do, do all to the glory of God.", ref: "1 Corinthians 10:31" },
    reflection:
      "The chief end of parenting — of everything — is the glory of God. Not the success of our children, not our reputation as parents, but God's glory. This lifts the ordinary (feeding, cleaning, teaching) into worship, and keeps the goal from shrinking to something smaller than God.",
    pray: "Father, let everything in our home — even the smallest task — be done for your glory.",
    talk: "How would naming God's glory as the goal reshape an ordinary day of parenting?",
  },
  {
    read: { text: "I have no greater joy than this: to hear about my children walking in truth.", ref: "3 John 1:4" },
    reflection:
      "John names the deepest joy of a spiritual parent: not achievement, comfort, or success, but children walking in the truth. It reorders our hopes. Above health, wealth, or accomplishment, we long most for our children to know and follow Christ.",
    pray: "Above every other hope for our child, Lord, let them walk in the truth all their days.",
    talk: "If you are honest, what do you most want for your child? How does 3 John reorder it?",
  },
  {
    read: { text: "Whom do I have in heaven? There is no one on earth whom I desire besides you. My flesh and my heart fails, but God is the strength of my heart and my portion forever.", ref: "Psalm 73:25-26" },
    reflection:
      "The psalmist's satisfaction is in God alone — not in family, not in earthly gifts. This is the settled heart that can hold children with open hands: God is my portion, so I am not undone if earthly things fail. Desire God above all, and every other love finds its place.",
    pray: "God, be our portion and the strength of our hearts. Let us desire you above every earthly gift.",
    talk: "Can you say with the psalmist that God alone is enough — even apart from your hopes for your child?",
  },
  {
    read: { text: "the LORD, your God, is among you, a mighty one who will save. He will rejoice over you with joy. He will calm you in his love. He will rejoice over you with singing.", ref: "Zephaniah 3:17" },
    reflection:
      "God sings over His people. The same delight a parent feels over a sleeping child, God feels — infinitely more — over you. As you learn to sing over your little one, you live out a small picture of how God rejoices over you. Let that steady you: you are loved by a God who is glad.",
    pray: "Sing over our child, Lord, as you sing over us. Let them grow up sure that they are loved and delighted in.",
    talk: "How does knowing God 'rejoices over you with singing' change how you see yourself as a parent today?",
  },
  {
    read: { text: "It is because of the LORD’s loving kindnesses that we are not consumed, because his compassion doesn’t fail. They are new every morning. Great is your faithfulness.", ref: "Lamentations 3:22-23" },
    reflection:
      "Written amid ruin, this is confidence not in circumstances but in the character of God. His mercies are new every morning — including the mornings after we fail as parents. We do not rest in our own consistency, but in His faithfulness.",
    pray: "Great is your faithfulness, Lord. Meet us with new mercy each morning, for we need it daily.",
    talk: "Where do you need to trade confidence in your own consistency for confidence in God's faithfulness?",
  },
  {
    read: { text: "For he established a covenant in Jacob, and appointed a teaching in Israel, which he commanded our fathers, that they should make them known to their children; that the generation to come might know, even the children who should be born; who should arise and tell their children,", ref: "Psalm 78:5-6" },
    reflection:
      "God's design is generational from the start — He gives His Word so that children 'yet unborn' would know Him. Your worship today is not only for you; it is an inheritance for a child who cannot yet speak, and perhaps for children not yet born. Small faithfulness now echoes forward.",
    pray: "Let what we know of you not stop with us, Lord, but reach our children, and children yet unborn.",
    talk: "What do you hope your family's faith looks like two generations from now? Pray toward it.",
  },
  {
    read: { text: "If then you were raised together with Christ, seek the things that are above, where Christ is, seated on the right hand of God. Set your mind on the things that are above, not on the things that are on the earth.", ref: "Colossians 3:1-2" },
    reflection:
      "The Christian's gaze is meant to be upward — on Christ, not merely on the pressing concerns of earthly life, even good ones like our children. An upward-set mind does not neglect the home; it parents from a heart anchored above, unshaken by what shakes on earth.",
    pray: "Lord, lift our eyes. Set our minds on Christ above, and let us parent from that steadiness.",
    talk: "What earthly worry about your child most needs to be met with a mind 'set on things above'?",
  },
  {
    read: { text: "Whoever receives one such little child in my name receives me,", ref: "Matthew 18:5" },
    reflection:
      "Christ so identifies with children that to welcome one in His name is to welcome Him. The unseen, repetitive, humble work of caring for a little one — the feeding, the soothing, the night-waking — is not beneath the kingdom. Done in Jesus' name, it is service rendered to Christ Himself.",
    pray: "Help us receive and serve our child as unto you, Jesus, in the small and unseen things.",
    talk: "Which unseen, ordinary task of care could you offer to Jesus today as worship?",
  },
  {
    read: { text: "But far be it from me to boast, except in the cross of our Lord Jesus Christ, through which the world has been crucified to me, and I to the world.", ref: "Galatians 6:14" },
    reflection:
      "Paul boasts in one thing only: the cross. Not his ministry, not his family, not his record. For parents this is freedom — our worth and our children's worth is not our achievement but Christ crucified. Boast in the cross, and you will parent from security, not to earn it.",
    pray: "Let us boast in nothing, Lord, but the cross of Christ. Be our only glory.",
    talk: "What are you quietly tempted to boast in as a parent? How does the cross reorder it?",
  },
  {
    read: { text: "The fear of the LORD is the beginning of wisdom. The knowledge of the Holy One is understanding.", ref: "Proverbs 9:10" },
    reflection:
      "All true wisdom — including wisdom for parenting — begins with the fear of the Lord, not with expertise. Before technique, before strategy, there is reverence for God. Raise children in the fear of the Lord by first walking in it yourselves.",
    pray: "Teach us the fear of the LORD, that we and our children might be truly wise.",
    talk: "What does 'the fear of the Lord' look like in the everyday atmosphere of your home?",
  },
  {
    read: { text: "Therefore let’s also, seeing we are surrounded by so great a cloud of witnesses, lay aside every weight and the sin which so easily entangles us, and let’s run with perseverance the race that is set before us, looking to Jesus, the author and perfecter of faith, who for the joy that was set before him endured the cross, despising its shame, and has sat down at the right hand of the throne of God.", ref: "Hebrews 12:1-2" },
    reflection:
      "The Christian life — and Christian parenting — is a race run by looking to Jesus, not to ourselves or our children. He is the founder and perfecter; the outcome rests with Him. Fix your eyes on Christ, and you will endure the long, ordinary marathon of raising a family.",
    pray: "Jesus, founder and perfecter of our faith, fix our eyes on you as we run this long race.",
    talk: "When parenting feels like a long, tiring race, what does 'looking to Jesus' practically mean for you?",
  },
  {
    read: { text: "but just as he who called you is holy, you yourselves also be holy in all of your behavior; because it is written, “You shall be holy; for I am holy.”", ref: "1 Peter 1:15-16" },
    reflection:
      "God's call is not first to raise good children but to be holy as He is holy. Our children's clearest sermon is the holiness — or the hypocrisy — they see in us. Pursue God's holiness for its own sake, out of reverence for Him, and your children will see a faith worth having.",
    pray: "Holy Father, make us holy as you are holy. Let our children see in us a faith that is real.",
    talk: "What is one area where God is calling you to holiness — that your children are quietly watching?",
  },
  {
    read: { text: "Unless the LORD builds the house, they who build it labor in vain. Unless the LORD watches over the city, the watchman guards it in vain.", ref: "Psalm 127:1" },
    reflection: "We can plan, discipline, and pray with all our strength, yet no parent has ever laid a single living stone in a child's heart. God builds, or nothing is built. This verse does not shame our diligence; it dethrones our self-reliance, so we labor as those who trust the Master Builder rather than our own hands.",
    pray: "Sovereign LORD, build this household by your grace, for apart from you we labor in vain.",
    talk: "Where are we quietly trusting our parenting methods instead of the God who alone builds a family?",
  },
  {
    read: { text: "I am the vine. You are the branches. He who remains in me and I in him bears much fruit, for apart from me you can do nothing.", ref: "John 15:5" },
    reflection: "Christ does not call us to bear fruit for him but to bear fruit from him. A branch does not strain to produce; it abides, and life flows. The fruit we long to see in our children is his to give through our union with him, not a harvest we manufacture by effort severed from Christ.",
    pray: "Lord Jesus, keep us abiding in you, for apart from you we can do nothing.",
    talk: "What in our family life are we attempting apart from Christ, as though the vine could be skipped?",
  },
  {
    read: { text: "so is my word that goes out of my mouth: it will not return to me void, but it will accomplish that which I please, and it will prosper in the thing I sent it to do.", ref: "Isaiah 55:11" },
    reflection: "God ties his promise to his word, not to our eloquence or our results. When we read Scripture in this home, we are not casting seed into the wind but scattering the very speech of God, which never fails his purpose. That frees us to be faithful with the word and to leave the outcome, and its timing, to him.",
    pray: "Father, let your word do its own sure work in us, in your time and for your purposes.",
    talk: "Do we treat family reading of Scripture as a duty to survive or as the living word of God at work?",
  },
  {
    read: { text: "Let the word of Christ dwell in you richly; in all wisdom teaching and admonishing one another with psalms, hymns, and spiritual songs, singing with grace in your heart to the Lord.", ref: "Colossians 3:16" },
    reflection: "The aim is not a well-managed household but Christ's word dwelling richly among us, spilling over into teaching, correction, and song. Notice the traffic runs among us all, parents and children alike sitting under the same word. We are not curators of our children's souls but fellow hearers, needing the same grace we speak.",
    pray: "Christ, let your word dwell richly in us and overflow in wisdom and thankful song.",
    talk: "Does the word of Christ actually dwell in our home, or merely visit at scheduled times?",
  },
  {
    read: { text: "For the grace of God has appeared, bringing salvation to all men, instructing us to the intent that, denying ungodliness and worldly lusts, we would live soberly, righteously, and godly in this present age;", ref: "Titus 2:11-12" },
    reflection: "Grace is not merely the pardon at the beginning; grace itself is the teacher that trains us to say no. We cannot discipline godliness into a child, and we cannot manufacture it in ourselves; the appearing of Christ does the training. So we point our children less to rules to keep and more to the grace that has appeared in him.",
    pray: "Gracious God, let the grace that has appeared in Christ train our whole household in godliness.",
    talk: "Are we trying to train godliness by pressure, or leading our children to the grace that actually teaches?",
  },
  {
    read: { text: "Come, you children, listen to me. I will teach you the fear of the LORD.", ref: "Psalm 34:11" },
    reflection: "We can teach many things, manners, skills, achievement, but only one lesson is the beginning of wisdom, and it is the fear of the LORD. Note that the psalmist does not teach children to fear him; he turns their gaze past himself to God. Our highest calling as parents is not to be revered but to make our children unafraid of everything except the loss of God.",
    pray: "LORD, teach us and our children to fear you above all, that we might truly be wise.",
    talk: "What do our children sense we fear most, and is it the LORD?",
  },
  {
    read: { text: "But seek first God’s Kingdom, and his righteousness; and all these things will be given to you as well.", ref: "Matthew 6:33" },
    reflection: "A family can make a hundred good things the first thing, even a child's flourishing, and so quietly unseat the kingdom. Christ does not forbid our concerns; he orders them, promising that what we need is added when he is sought first. The great danger of parenting is not neglect but misplaced worship, tending the gift as though it were the King.",
    pray: "Father, keep your kingdom first in our hearts, that lesser loves stay in their place.",
    talk: "If someone watched our week, what would they name as the thing we truly seek first?",
  },
  {
    read: { text: "For bodily exercise has some value, but godliness has value in all things, having the promise of the life which is now, and of that which is to come.", ref: "1 Timothy 4:8" },
    reflection: "We pour ourselves into schedules, teams, and skills, all of some value, yet all bounded by this life. Godliness alone carries a promise that outlasts the grave. This is not a call to neglect the body or the mind, but a plea to weigh our investments honestly, lest we train our children for everything but eternity.",
    pray: "Lord, let us train our children first for godliness, which holds promise for this life and the next.",
    talk: "Where does our family's calendar and effort say bodily training matters more than godliness?",
  },
  {
    read: { text: "He has shown you, O man, what is good. What does the LORD require of you, but to act justly, to love mercy, and to walk humbly with your God?", ref: "Micah 6:8" },
    reflection: "God has already told us what is good; the parenting question is not chiefly what technique works but what he requires. Justice and kindness are visible, but the root is walking humbly with God, the quiet posture that keeps a home from self-righteousness. Children learn humility not from lectures but from watching parents who walk lowly before the Lord.",
    pray: "LORD, teach us to do justice, love kindness, and walk humbly with you before our children.",
    talk: "Which is hardest in our home right now: doing justice, loving kindness, or walking humbly, and why?",
  },
  {
    read: { text: "seeing that his divine power has granted to us all things that pertain to life and godliness, through the knowledge of him who called us by his own glory and virtue,", ref: "2 Peter 1:3" },
    reflection: "We often parent as though we lack the resources for the task, straining to supply what only God can give. Yet his divine power has already granted everything needed for life and godliness, and it comes through knowing him. The remedy for our insufficiency is not a better method but a deeper knowledge of the Christ who called us.",
    pray: "Father, we lack nothing for godliness in Christ; deepen our knowledge of him who called us.",
    talk: "When we feel inadequate as parents, do we reach for new strategies or for the knowledge of Christ?",
  },
  {
    read: { text: "Therefore I urge you, brothers, by the mercies of God, to present your bodies a living sacrifice, holy, acceptable to God, which is your spiritual service. Don’t be conformed to this world, but be transformed by the renewing of your mind, so that you may prove what is the good, well-pleasing, and perfect will of God.", ref: "Romans 12:1-2" },
    reflection: "Worship in this home begins with mercies received, not sacrifices offered; the surrender flows from what God has already done in Christ. We cannot renew our own minds, nor our children's, by willpower against the pull of the world. Transformation is God's inward work, so we offer ourselves and ask him to change us from the inside, parents first.",
    pray: "By your mercies, God, receive us as living sacrifices and transform our minds after Christ.",
    talk: "Where is our family being quietly conformed to the world rather than transformed by God?",
  },
  {
    read: { text: "Only be careful, and keep your soul diligently, lest you forget the things which your eyes saw, and lest they depart from your heart all the days of your life; but make them known to your children and your children’s children—", ref: "Deuteronomy 4:9" },
    reflection: "The command to teach the children begins with a warning to guard our own souls, for we cannot pass on what we have let slip from our hearts. God works across generations, but the thread runs through parents who keep remembering what he has done. What we intend to hand down, we must first refuse to forget.",
    pray: "LORD, guard our souls from forgetting your works, that we may make them known to our children.",
    talk: "What has God done in our lives that we are in danger of forgetting before we pass it on?",
  },
  {
    read: { text: "She called the name of the LORD who spoke to her, “You are a God who sees,” for she said, “Have I even stayed alive after seeing him?”", ref: "Genesis 16:13" },
    reflection:
      "You are a God who sees. Hagar names God after being found in a desert — a pregnant, used, runaway slave woman with no standing at all. The first person in Scripture to give God a name is her. God's attention does not track our importance.",
    talk: "Where do you feel unseen in this season? What would it mean that God sees you there?",
    pray: "God who sees, you found Hagar in the desert. See us here.",
  },
  {
    read: { text: "The children struggled together within her. She said, “If it is like this, why do I live?” She went to inquire of the LORD.", ref: "Genesis 25:22" },
    reflection:
      "The children struggled together within her. She said, 'Why do I live?' and went to inquire of the LORD. A difficult pregnancy drove Rebekah to ask God a raw question. Scripture records the question without correcting her for asking it.",
    talk: "What raw question would you ask God about this season if you knew you would not be scolded for it?",
    pray: "Lord, we bring you our hard questions. Thank you that you receive them.",
  },
  {
    read: { text: "God remembered Rachel, and God listened to her, and opened her womb.", ref: "Genesis 30:22" },
    reflection:
      "God remembered Rachel, and God listened to her. The Bible speaks plainly about wombs that stayed closed for years. It does not offer a formula for opening them, and it never treats the waiting woman as at fault.",
    talk: "How has waiting shaped what you believe about God — honestly?",
    pray: "Lord, you remember and you listen. We are still waiting on you for some things.",
  },
  {
    read: { text: "When she could no longer hide him, she took a papyrus basket for him, and coated it with tar and with pitch. She put the child in it, and laid it in the reeds by the river’s bank.", ref: "Exodus 2:3" },
    reflection:
      "When she could no longer hide him, she took a papyrus basket for him. A mother does what she can and then must let the river carry him. Every parent reaches the edge of what they can protect, usually sooner than they expected.",
    talk: "What are you already having to entrust to God rather than control?",
    pray: "Lord, we can only do so much. We put this child into your hands.",
  },
  {
    read: { text: "the LORD said to him, “Who made man’s mouth? Or who makes one mute, or deaf, or seeing, or blind? Isn’t it I, the LORD?”", ref: "Exodus 4:11" },
    reflection:
      "Who made man's mouth? Or who makes one mute, or deaf, or seeing, or blind? Isn't it I, the LORD? God does not distance himself from disability. He claims it — and then sends Moses anyway. A child God gives is not a mistake, whatever their body does.",
    talk: "What are you afraid this child might be or might lack? Can you bring that fear to God as it is?",
    pray: "Lord, you make and you know. Whatever this child is, you have not made a mistake.",
  },
  {
    read: { text: "The eternal God is your dwelling place. Underneath are the everlasting arms. He thrust out the enemy from before you, and said, ‘Destroy!", ref: "Deuteronomy 33:27" },
    reflection:
      "The eternal God is your dwelling place. Underneath are the everlasting arms. Not a promise of an easy road but of a floor that will not give way. Some nights that is exactly the promise you need.",
    talk: "What would it mean tonight to trust that underneath everything are everlasting arms?",
    pray: "Eternal God, be our dwelling place. Hold us with your everlasting arms.",
  },
  {
    read: { text: "“I prayed for this child, and the LORD has given me my petition which I asked of him. Therefore I have also given him to the LORD. As long as he lives he is given to the LORD.” He worshiped the LORD there.", ref: "1 Samuel 1:27-28" },
    reflection:
      "For this child I prayed... therefore I have also given him to the LORD. Hannah's answered prayer ended in giving him away. A child who is a gift is never a possession, and holding them loosely starts long before they leave.",
    talk: "What does it look like to give this child back to God while still longing for them?",
    pray: "Lord, this child is yours before they are ours. Help us hold them with open hands.",
  },
  {
    read: { text: "Hannah prayed, and said: “My heart exults in the LORD! My horn is exalted in the LORD. My mouth is enlarged over my enemies, because I rejoice in your salvation. There is no one as holy as the LORD, for there is no one besides you, nor is there any rock like our God.”", ref: "1 Samuel 2:1-2" },
    reflection:
      "My heart exults in the LORD... There is no rock like our God. Hannah's song is not about her baby. Having finally received what she begged for, she sings about God's character, not her outcome.",
    talk: "When God gives you what you asked for, what do you end up praising — the gift or the giver?",
    pray: "Lord, there is no rock like you. Let our joy land on you, not only on your gifts.",
  },
  {
    read: { text: "“Please run now to meet her, and ask her, ‘Is it well with you? Is it well with your husband? Is it well with your child?’ ” She answered, “It is well.”", ref: "2 Kings 4:26" },
    reflection:
      "Is it well with you? Is it well with your husband? Is it well with the child? And she answered, 'It is well.' She says it while carrying her dead son upstairs. Faith here is not denial — it is a refusal to let the worst day have the final word.",
    talk: "Can you say 'it is well' about something not yet well? What does that mean and not mean?",
    pray: "Lord, when it is not well, hold us until it is. We will not let go of you.",
  },
  {
    read: { text: "But you brought me out of the womb. You made me trust while at my mother’s breasts. I was thrown on you from my mother’s womb. You are my God since my mother bore me.", ref: "Psalm 22:9-10" },
    reflection:
      "You brought me out of the womb. You made me trust while at my mother's breasts. Written by David and quoted by Christ from the cross. God's care reaches back before memory — before this child can know anything, God is already at work.",
    talk: "What comfort is there in God's care beginning before a child can understand it?",
    pray: "Lord, you have kept us since the womb. Keep this child from the very beginning.",
  },
  {
    read: { text: "For his anger is but for a moment. His favor is for a lifetime. Weeping may stay for the night, but joy comes in the morning.", ref: "Psalm 30:5" },
    reflection:
      "Weeping may stay for the night, but joy comes in the morning. Note the night is real and it lasts. This is not a promise about how long — it is a promise about the direction things finally go for those who belong to God.",
    talk: "What has your night been? Do you believe there is a morning?",
    pray: "Lord, our weeping has been long. We wait for the morning you have promised.",
  },
  {
    read: { text: "You count my wanderings. You put my tears into your container. Aren’t they in your book?", ref: "Psalm 56:8" },
    reflection:
      "You count my wanderings. You put my tears into your container. Aren't they in your book? God does not merely tolerate our crying; he keeps it. Nothing you have wept in this season has been unnoticed or wasted.",
    talk: "What have you cried about that you assumed nobody counted?",
    pray: "Lord, you keep our tears in your bottle. Thank you that none of them are lost.",
  },
  {
    read: { text: "A father of the fatherless, and a defender of the widows, is God in his holy habitation. God sets the lonely in families. He brings out the prisoners with singing, but the rebellious dwell in a sun-scorched land.", ref: "Psalm 68:5-6" },
    reflection:
      "A father of the fatherless, and a defender of the widows, is God. God sets the lonely in families. God's instinct runs toward those without support. If your circle is thin right now, this is his particular concern.",
    talk: "Who has God set around you? Who could you invite closer?",
    pray: "Lord, you set the lonely in families. Give us people, and make us people to others.",
  },
  {
    read: { text: "I have relied on you from the womb. You are he who took me out of my mother’s womb. I will always praise you.", ref: "Psalm 71:6" },
    reflection:
      "I have relied on you from the womb. You are he who took me out of my mother's womb. Whatever your own start in life was, the psalmist claims God's hand on it. That claim is available to this child too.",
    talk: "What kind of start did you have? What do you want to be different, and what do you want to keep?",
    pray: "Lord, you have held us since birth. Hold this child from the first moment.",
  },
  {
    read: { text: "In the multitude of my thoughts within me, your comforts delight my soul.", ref: "Psalm 94:19" },
    reflection:
      "In the multitude of my thoughts within me, your comforts delight my soul. The psalmist names the racing mind and then names the comfort. God's consolation does not require you to first stop worrying.",
    talk: "What thoughts multiply in you at 3am? What comfort could you bring to them?",
    pray: "Lord, when our thoughts multiply, let your comfort delight our souls.",
  },
  {
    read: { text: "He settles the barren woman in her home as a joyful mother of children. Praise Yah!", ref: "Psalm 113:9" },
    reflection:
      "He settles the barren woman in her home as a joyful mother of children. This is a psalm of praise for God's reversals — and it is honest that the situation being reversed was a real grief. Praise here does not skip the pain.",
    talk: "What reversal are you hoping for? Can you praise God before you see it?",
    pray: "Lord, you lift the needy from the ash heap. We wait on you and praise you.",
  },
  {
    read: { text: "Precious in the LORD’s sight is the death of his saints.", ref: "Psalm 116:15" },
    reflection:
      "Precious in the LORD's sight is the death of his saints. Some pregnancies end, and some children do not stay. Scripture does not explain that away, and it does say that God does not treat any of it as cheap.",
    talk: "If you have lost a child, have you been able to grieve out loud? Who have you told?",
    pray: "Lord, precious to you is every one of your saints. Hold those who are grieving.",
  },
  {
    read: { text: "the LORD will fulfill that which concerns me. Your loving kindness, the LORD, endures forever. Don’t forsake the works of your own hands.", ref: "Psalm 138:8" },
    reflection:
      "The LORD will fulfill that which concerns me. Your loving kindness, LORD, endures forever. Don't forsake the works of your own hands. Confidence and pleading in one breath. Faith is allowed to ask God to do what it just declared he would.",
    talk: "What are you both confident about and still pleading for?",
    pray: "Lord, fulfil your purpose for us. Do not forsake the work of your own hands.",
  },
  {
    read: { text: "He will feed his flock like a shepherd. He will gather the lambs in his arm, and carry them in his bosom. He will gently lead those who have their young.", ref: "Isaiah 40:11" },
    reflection:
      "He will gently lead those who have their young. God's care is specifically calibrated to those carrying and nursing — he leads them gently, at their pace. He does not drive a new mother the way the world does.",
    talk: "Where are you being driven rather than led? What would a gentler pace require?",
    pray: "Shepherd of your people, gather us in your arms and lead us gently.",
  },
  {
    read: { text: "Can a woman forget her nursing child, that she should not have compassion on the son of her womb? Yes, these may forget, yet I will not forget you! Behold, I have engraved you on the palms of my hands. Your walls are continually before me.", ref: "Isaiah 49:15-16" },
    reflection:
      "Can a woman forget her nursing child? ... Yes, these may forget, yet I will not forget you. God takes the strongest human bond he can name and says his own is stronger. And then: I have engraved you on the palms of my hands.",
    talk: "Which do you find harder to believe — that God loves this child, or that he loves you?",
    pray: "Lord, you have engraved us on your palms. You will not forget us.",
  },
  {
    read: { text: "“For the mountains may depart, and the hills be removed; but my loving kindness will not depart from you, and my covenant of peace will not be removed,” says the LORD who has mercy on you.", ref: "Isaiah 54:10" },
    reflection:
      "The mountains may depart, and the hills be removed; but my loving kindness will not depart from you. The covenant of peace is more stable than geology. Whatever else moves in these months, this does not.",
    talk: "What has moved under you recently? What has not?",
    pray: "Lord, mountains may move but your steadfast love will not depart from us.",
  },
  {
    read: { text: "Before I formed you in the womb, I knew you. Before you were born, I sanctified you. I have appointed you a prophet to the nations.", ref: "Jeremiah 1:5" },
    reflection:
      "Before I formed you in the womb, I knew you. Spoken to Jeremiah about his calling, and it says something true of every person God forms: knowing precedes forming. This child is already known.",
    talk: "How does it change your waiting to know God already knows this child fully?",
    pray: "Lord, you knew us before you formed us. You already know this child.",
  },
  {
    read: { text: "“the LORD is my portion,” says my soul. “Therefore I will hope in him.” the LORD is good to those who wait for him, to the soul who seeks him. It is good that a man should hope and quietly wait for the salvation of the LORD.", ref: "Lamentations 3:24-26" },
    reflection:
      "The LORD is my portion, says my soul. Therefore I will hope in him... It is good that a man should hope and quietly wait. Written in the ruins. Waiting quietly is named as good — not passive, not resigned, but hopeful.",
    talk: "What does quiet waiting look like for you, practically, this week?",
    pray: "Lord, you are our portion. We will hope in you and wait quietly.",
  },
  {
    read: { text: "For the vision is yet for the appointed time, and it hurries toward the end, and won’t prove false. Though it takes time, wait for it; because it will surely come. It won’t delay.", ref: "Habakkuk 2:3" },
    reflection:
      "For the vision is yet for the appointed time... Though it takes time, wait for it; because it will surely come. God's timing is described as appointed, not arbitrary — and as slower than we would like.",
    talk: "What are you waiting for that has taken longer than you expected?",
    pray: "Lord, your time is appointed. Give us patience until it comes.",
  },
  {
    read: { text: "“Behold, the virgin shall be with child, and shall give birth to a son. They shall call his name Immanuel;” which is, being interpreted, “God with us.”", ref: "Matthew 1:23" },
    reflection:
      "Behold, the virgin shall be with child, and shall give birth to a son. They shall call his name Immanuel — God with us. An unplanned, socially catastrophic pregnancy is how God chose to come. He is not embarrassed by complicated circumstances.",
    talk: "What is complicated about your circumstances? Does God seem embarrassed by it?",
    pray: "Immanuel, you came through a difficult story. Be with us in ours.",
  },
  {
    read: { text: "See the birds of the sky, that they don’t sow, neither do they reap, nor gather into barns. Your heavenly Father feeds them. Aren’t you of much more value than they? “Which of you, by being anxious, can add one moment to his lifespan?”", ref: "Matthew 6:26-27" },
    reflection:
      "Which of you by being anxious, can add one moment to his lifespan? Jesus does not shame the anxious; he reasons with them. Worry has never once changed an outcome, and he knows how hard that is to feel.",
    talk: "What is your worry actually accomplishing? What would it take to hand it over?",
    pray: "Father, you feed the birds. Teach us to stop trying to control what we cannot.",
  },
  {
    read: { text: "But Jesus said, “Allow the little children, and don’t forbid them to come to me; for the Kingdom of Heaven belongs to ones like these.”", ref: "Matthew 19:14" },
    reflection:
      "Allow the little children, and don't forbid them to come to me. The disciples thought children were an interruption to real ministry. Jesus corrected them sharply. In his kingdom the small are not in the way.",
    talk: "Where do you treat children as an interruption to more important things?",
    pray: "Lord Jesus, you welcomed children. Let this home welcome them as you do.",
  },
  {
    read: { text: "For nothing spoken by God is impossible.", ref: "Luke 1:37" },
    reflection:
      "For nothing spoken by God is impossible. Said to a young woman being told something biologically impossible. It is a statement about God's power, not a blank cheque for our plans — Mary's yes led to a sword through her own soul.",
    talk: "How is this verse usually used? What does Mary's whole story do to that reading?",
    pray: "Lord, nothing is impossible for you. Give us Mary's yes, whatever it costs.",
  },
  {
    read: { text: "Mary said, “My soul magnifies the Lord. My spirit has rejoiced in God my Savior, for he has looked at the humble state of his servant. For behold, from now on, all generations will call me blessed.”", ref: "Luke 1:46-48" },
    reflection:
      "My soul magnifies the Lord... for he has looked at the humble state of his servant. Mary's song celebrates a God who notices the lowly and unseats the powerful. Pregnancy in Scripture is often political before it is sentimental.",
    talk: "What does it mean that God looked on the humble state of an unimportant girl?",
    pray: "Lord, you regard the lowly. Magnify yourself in this ordinary house.",
  },
  {
    read: { text: "She gave birth to her firstborn son. She wrapped him in bands of cloth, and laid him in a feeding trough, because there was no room for them in the inn.", ref: "Luke 2:7" },
    reflection:
      "She wrapped him in bands of cloth and laid him in a feeding trough, because there was no room for them in the inn. The Saviour's first bed was borrowed and unsuitable. God's plans are rarely delivered under ideal conditions.",
    talk: "What is not ideal about your circumstances? Does that disqualify anything?",
    pray: "Lord Jesus, you were laid in a manger. Meet us in our unideal circumstances.",
  },
  {
    read: { text: "and Simeon blessed them, and said to Mary, his mother, “Behold, this child is set for the falling and the rising of many in Israel, and for a sign which is spoken against. Yes, a sword will pierce through your own soul, that the thoughts of many hearts may be revealed.”", ref: "Luke 2:34-35" },
    reflection:
      "A sword will pierce through your own soul. Simeon blesses Mary and tells her the truth in the same breath. Nobody promised her an easy motherhood, and God was not less good to her for it.",
    talk: "Have you assumed that God's blessing means an easy road? Where did that idea come from?",
    pray: "Lord, you tell us the truth. Prepare us for what is coming, and be with us in it.",
  },
  {
    read: { text: "And Jesus increased in wisdom and stature, and in favor with God and men.", ref: "Luke 2:52" },
    reflection:
      "Jesus increased in wisdom and stature, and in favour with God and men. The Son of God grew — learned to walk, learned to speak, grew up. Whatever this child needs to learn slowly, so did he.",
    talk: "Where are you impatient for growth that can only be slow?",
    pray: "Lord Jesus, you grew as a child. Give us patience with growth that takes time.",
  },
  {
    read: { text: "His disciples asked him, “Rabbi, who sinned, this man or his parents, that he was born blind?” Jesus answered, “This man didn’t sin, nor did his parents; but, that the works of God might be revealed in him.”", ref: "John 9:2-3" },
    reflection:
      "Who sinned, this man or his parents, that he was born blind? Jesus answered, 'Neither.' He refuses the whole question. Suffering is not a code to be decoded back to somebody's fault — least of all a parent's.",
    talk: "Have you searched for what you did wrong when something went wrong? What does Jesus say here?",
    pray: "Lord Jesus, you refused to blame. Free us from hunting for our own guilt in every hard thing.",
  },
  {
    read: { text: "Peace I leave with you. My peace I give to you; not as the world gives, I give to you. Don’t let your heart be troubled, neither let it be fearful.", ref: "John 14:27" },
    reflection:
      "Peace I leave with you. My peace I give to you; not as the world gives. The world's peace depends on things going well. Christ's does not, which is why it can be given the night before a crucifixion.",
    talk: "What kind of peace are you actually looking for? Which one is on offer?",
    pray: "Lord Jesus, give us your peace, not the world's. Let our hearts not be troubled.",
  },
  {
    read: { text: "They said, “Believe in the Lord Jesus Christ, and you will be saved, you and your household.”", ref: "Acts 16:31" },
    reflection:
      "Believe in the Lord Jesus Christ, and you will be saved, you and your household. A jailer's whole house heard the word and believed. It is a promise about the gospel reaching a household, not a guarantee that a parent's faith saves a child automatically.",
    talk: "What does it mean to want the gospel for your whole house without presuming on it?",
    pray: "Lord, bring this whole household to yourself. We ask, and we do not presume.",
  },
  {
    read: { text: "For I consider that the sufferings of this present time are not worthy to be compared with the glory which will be revealed toward us.", ref: "Romans 8:18" },
    reflection:
      "The sufferings of this present time are not worthy to be compared with the glory which will be revealed. Paul does not minimise present suffering — he weighs it against something. The comparison is what makes it bearable, not denial.",
    talk: "What are you carrying that needs weighing against something bigger?",
    pray: "Lord, our sufferings are real. Let them be outweighed by the glory to come.",
  },
  {
    read: { text: "For we know that the whole creation groans and travails in pain together until now. Not only so, but ourselves also, who have the first fruits of the Spirit, even we ourselves groan within ourselves, waiting for adoption, the redemption of our body.", ref: "Romans 8:22-23" },
    reflection:
      "The whole creation groans and travails in pain together until now. Paul reaches for the language of labour to describe creation itself. Groaning is not a sign that something has gone wrong — it is what waiting for redemption feels like.",
    talk: "What are you groaning about? Does it help to know creation groans with you?",
    pray: "Lord, we groan inwardly, waiting. Come quickly and make all things new.",
  },
  {
    read: { text: "Now we who are strong ought to bear the weaknesses of the weak, and not to please ourselves.", ref: "Romans 15:1" },
    reflection:
      "We who are strong ought to bear the weaknesses of the weak, and not to please ourselves. In a household with a pregnancy, an infant, or exhaustion, there is always someone weaker this week. The strong one carries — and next week it reverses.",
    talk: "Who is weaker this week? What would bearing with them look like tonight?",
    pray: "Lord, make the stronger among us carry the weaker, and make us willing to be carried.",
  },
  {
    read: { text: "I always thank my God concerning you, for the grace of God which was given you in Christ Jesus; that in everything you were enriched in him, in all speech and all knowledge;", ref: "1 Corinthians 1:4-5" },
    reflection:
      "I always thank my God concerning you, for the grace of God which was given you in Christ Jesus. Paul thanks God for a church he is about to rebuke for six chapters. Gratitude does not require the situation to be sorted.",
    talk: "What can you thank God for about each other right now, before anything is fixed?",
    pray: "Lord, we thank you for grace already given, before anything is resolved.",
  },
  {
    read: { text: "When one member suffers, all the members suffer with it. When one member is honored, all the members rejoice with it.", ref: "1 Corinthians 12:26" },
    reflection:
      "When one member suffers, all the members suffer with it. Suffering in a household is never private. If one of you is struggling, the whole house is carrying it, whether or not anyone says so.",
    talk: "Who in this circle is suffering right now? Has the rest of the body noticed?",
    pray: "Lord, we are one body. Let us suffer and rejoice together, not alone.",
  },
  {
    read: { text: "But we have this treasure in clay vessels, that the exceeding greatness of the power may be of God, and not from ourselves.", ref: "2 Corinthians 4:7" },
    reflection:
      "We have this treasure in clay pots, that the exceeding greatness of the power may be of God, and not from ourselves. Frailty is not a design fault. It is the arrangement, so that when something holds, everyone knows who held it.",
    talk: "Where are you most aware of being a clay pot right now?",
    pray: "Lord, we are fragile. Let your power be obvious precisely because we are.",
  },
  {
    read: { text: "But when the fullness of the time came, God sent out his Son, born to a woman, born under the law, that he might redeem those who were under the law, that we might receive the adoption of children.", ref: "Galatians 4:4-5" },
    reflection:
      "When the fullness of the time came, God sent out his Son, born to a woman, born under the law. The eternal Son entered the world through a pregnancy and a birth. There is no part of this that God has kept at arm's length.",
    talk: "What does it mean to you that God chose to arrive this way?",
    pray: "Father, you sent your Son, born of a woman. Thank you for coming so close.",
  },
  {
    read: { text: "For this cause, I bow my knees to the Father of our Lord Jesus Christ, from whom every family in heaven and on earth is named, that he would grant you, according to the riches of his glory, that you may be strengthened with power through his Spirit in the inner person,", ref: "Ephesians 3:14-16" },
    reflection:
      "That he would grant you, according to the riches of his glory, that you may be strengthened with power through his Spirit in the inner person. Paul prays for inner strength, not for changed circumstances. That is a different prayer from the one we usually pray.",
    talk: "What would you ask God for if you asked for inner strength rather than a changed situation?",
    pray: "Father, strengthen us with power through your Spirit in the inner person.",
  },
  {
    read: { text: "This I pray, that your love may abound yet more and more in knowledge and all discernment, so that you may approve the things that are excellent, that you may be sincere and without offense to the day of Christ, being filled with the fruits of righteousness, which are through Jesus Christ, to the glory and praise of God.", ref: "Philippians 1:9-11" },
    reflection:
      "That your love may abound yet more and more in knowledge and all discernment. Paul prays for love that grows in knowledge — not sentiment, but love that gets wiser. Parenting will require both.",
    talk: "Where does your love for each other need more knowledge and discernment?",
    pray: "Lord, make our love abound more and more, with knowledge and discernment.",
  },
  {
    read: { text: "My God will supply every need of yours according to his riches in glory in Christ Jesus.", ref: "Philippians 4:19" },
    reflection:
      "My God will supply every need of yours according to his riches in glory in Christ Jesus. Paul writes this to a poor church that had just given sacrificially — and he distinguishes needs from wants without apology.",
    talk: "What do you call a need that is actually a want? What is a real need here?",
    pray: "Lord, supply our needs according to your riches. Teach us the difference from our wants.",
  },
  {
    read: { text: "strengthened with all power, according to the might of his glory, for all endurance and perseverance with joy,", ref: "Colossians 1:11" },
    reflection:
      "Strengthened with all power, according to the might of his glory, for all endurance and perseverance with joy. All that divine power, and the stated purpose is endurance — with patience. Sometimes God's great power shows up as an ordinary ability to keep going.",
    talk: "What do you need to endure this week? What would enduring with joy look like?",
    pray: "Lord, strengthen us with your power — for endurance and patience, with joy.",
  },
  {
    read: { text: "But we were gentle among you, like a nursing mother cherishes her own children. Even so, affectionately longing for you, we were well pleased to impart to you, not the Good News of God only, but also our own souls, because you had become very dear to us.", ref: "1 Thessalonians 2:7-8" },
    reflection:
      "We were gentle among you, like a nursing mother cherishes her own children. Paul, a hard man in many ways, reaches for the image of a nursing mother to describe ministry. Tenderness is not a lesser form of strength.",
    talk: "Where do you confuse gentleness with weakness?",
    pray: "Lord, make us gentle as a nursing mother, and count that strength.",
  },
  {
    read: { text: "We exhort you, brothers: Admonish the disorderly; encourage the faint-hearted; support the weak; be patient toward all.", ref: "1 Thessalonians 5:14" },
    reflection:
      "Admonish the disorderly; encourage the faint-hearted; support the weak; be patient toward all. Four different responses for four different people. Wisdom is knowing which one this person needs today.",
    talk: "Which of those four does your partner need from you this week? Ask, don't guess.",
    pray: "Lord, give us wisdom to know when to admonish, encourage, support, and simply be patient.",
  },
  {
    read: { text: "For God didn’t give us a spirit of fear, but of power, love, and self-control.", ref: "2 Timothy 1:7" },
    reflection:
      "God didn't give us a spirit of fear, but of power, love, and self-control. Written to a timid young man facing real danger. It is not a promise that you will stop feeling afraid — it is a statement about what God has actually given.",
    talk: "What are you afraid of? What has God given you instead of that spirit?",
    pray: "Lord, you have not given us fear but power, love and self-control. Let those govern us.",
  },
  {
    read: { text: "This hope we have as an anchor of the soul, a hope both sure and steadfast and entering into that which is within the veil;", ref: "Hebrews 6:19" },
    reflection:
      "This hope we have as an anchor of the soul, a hope both sure and steadfast. An anchor does not stop the storm; it stops the drift. That is the specific work hope does in a season with no guarantees.",
    talk: "What is your soul currently anchored to? Will it hold?",
    pray: "Lord, be the anchor of our souls, sure and steadfast, in every storm.",
  },
  {
    read: { text: "let’s hold fast the confession of our hope without wavering; for he who promised is faithful.", ref: "Hebrews 10:23" },
    reflection:
      "Let's hold fast the confession of our hope without wavering; for he who promised is faithful. The reason to hold on is not our grip but his faithfulness. Some seasons the only honest thing is to hold on badly to someone who is holding you well.",
    talk: "What are you holding onto by your fingernails? Who is actually holding you?",
    pray: "Lord, we hold fast because you are faithful, not because we are strong.",
  },
  {
    read: { text: "Is any among you suffering? Let him pray. Is any cheerful? Let him sing praises. Is any among you sick? Let him call for the elders of the assembly, and let them pray over him, anointing him with oil in the name of the Lord,", ref: "James 5:13-14" },
    reflection:
      "Is any among you suffering? Let him pray. Is any cheerful? Let him sing praises. Is any among you sick? Let him call for the elders. Practical instructions, and note the third: sickness sends you to the church, not to a formula.",
    talk: "Who would you call if things got hard? Do they know they are on that list?",
    pray: "Lord, when we suffer let us pray, and when we are sick let us call for help.",
  },
  {
    read: { text: "as newborn babies, long for the pure milk of the Word, that with it you may grow,", ref: "1 Peter 2:2" },
    reflection:
      "As newborn babies, long for the pure milk of the Word, that with it you may grow. Peter uses an infant's hunger as the picture of how Christians should want Scripture. Watching a newborn feed is a sermon about your own soul.",
    talk: "When did you last long for God's word the way a hungry baby wants milk?",
    pray: "Lord, give us appetite for your word, like a newborn for milk.",
  },
  {
    read: { text: "By this God’s love was revealed in us, that God has sent his one and only Son into the world that we might live through him. In this is love, not that we loved God, but that he loved us, and sent his Son as the atoning sacrifice for our sins.", ref: "1 John 4:9-10" },
    reflection:
      "In this is love, not that we loved God, but that he loved us, and sent his Son as the atoning sacrifice for our sins. Love is defined by God's initiative, not our response. This is the pattern for how you will love a child who cannot yet love you back.",
    talk: "How is loving a newborn a picture of how God has loved us?",
    pray: "Lord, you loved us first. Let us love this child the same way — first, and without return.",
  },
  {
    read: { text: "for the Lamb who is in the middle of the throne shepherds them and leads them to springs of life-giving waters. And God will wipe away every tear from their eyes.", ref: "Revelation 7:17" },
    reflection:
      "The Lamb will be their shepherd, and will guide them to springs of waters of life. God will wipe away every tear from their eyes. Every tear — including the ones nobody else has seen in this season.",
    talk: "Which of your tears do you most want wiped away? Tell God about that one.",
    pray: "Lord, you will wipe away every tear. Until then, keep them in your bottle.",
  },
  {
    read: { text: "Some trust in chariots, and some in horses, but we trust in the name of the LORD our God.", ref: "Psalm 20:7" },
    reflection:
      "Some trust in chariots, and some in horses, but we trust in the name of the LORD our God. Chariots were the best available technology. Trusting God does not mean refusing good medicine — it means knowing what is finally holding you.",
    talk: "What is your chariot in this season? Is it holding the weight you have put on it?",
    pray: "Lord, we will use every good gift you provide — and trust in your name, not in them.",
  },
  {
    read: { text: "when I remember you on my bed, and think about you in the night watches. For you have been my help. I will rejoice in the shadow of your wings. My soul stays close to you. Your right hand holds me up.", ref: "Psalm 63:6-8" },
    reflection:
      "When I remember you on my bed, and think about you in the night watches... My soul stays close to you. The night watches are named. Someone awake at 3am wrote this, and made it worship.",
    talk: "What do you do when you are awake in the night? Could some of it become prayer?",
    pray: "Lord, in the night watches, let our souls cling to you. Your right hand upholds us.",
  },
  {
    read: { text: "Therefore the LORD will wait, that he may be gracious to you; and therefore he will be exalted, that he may have mercy on you, for the LORD is a God of justice. Blessed are all those who wait for him.", ref: "Isaiah 30:18" },
    reflection:
      "Therefore the LORD will wait, that he may be gracious to you... Blessed are all those who wait for him. God is described as waiting — for the right moment to be gracious. His delays are not neglect.",
    talk: "What if God's delay is itself part of his grace? Does that change anything for you?",
    pray: "Lord, you wait to be gracious to us. Make us those who wait for you.",
  },
  {
    read: { text: "Aren’t two sparrows sold for an assarion coin? Not one of them falls on the ground apart from your Father’s will, but the very hairs of your head are all numbered. Therefore don’t be afraid. You are of more value than many sparrows.", ref: "Matthew 10:29-31" },
    reflection:
      "Not one sparrow falls to the ground apart from your Father's will... you are of more value than many sparrows. Note what Jesus does not say: he does not say the sparrow will not fall. He says the Father is there when it does.",
    talk: "What comfort is there in God's presence at the fall, rather than the prevention of it?",
    pray: "Father, not one sparrow falls without you. We are worth more than many sparrows.",
  },
  {
    read: { text: "I laid myself down and slept. I awakened; for the LORD sustains me.", ref: "Psalm 3:5" },
    reflection:
      "I laid myself down and slept. I awakened, for the LORD sustains me. David wrote this while fleeing his own son. Sleep in a crisis is a small act of faith — it says someone else is keeping watch.",
    talk: "How is your sleep? What does it say about who you think is keeping watch?",
    pray: "Lord, we lie down and sleep because you sustain us. Keep watch tonight.",
  },
  {
    read: { text: "In the beginning, God created the heavens and the earth.", ref: "Genesis 1:1" },
    reflection:
      "In the beginning, God created the heavens and the earth. Before anything existed, God was. The One who spoke galaxies into being is the One forming this child cell by cell.",
    talk: "What does it do to your fear to know the Creator is the one at work here?",
    pray: "Lord, you made everything from nothing. We trust you with this small beginning.",
  },
  {
    read: { text: "God saw everything that he had made, and, behold, it was very good. There was evening and there was morning, a sixth day.", ref: "Genesis 1:31" },
    reflection:
      "God saw everything that he had made, and behold, it was very good. Bodies were called very good before anything went wrong. Whatever your body is doing right now, it is not a shameful thing.",
    talk: "What do you find hardest to accept about your body in this season?",
    pray: "Lord, you called it very good. Help us receive our bodies as your work.",
  },
  {
    read: { text: "the LORD God formed man from the dust of the ground, and breathed into his nostrils the breath of life; and man became a living soul.", ref: "Genesis 2:7" },
    reflection:
      "The LORD God formed man from the dust of the ground, and breathed into his nostrils the breath of life. Dust and breath. Every child is both fragile and God-breathed at once.",
    talk: "How do you hold together this child's fragility and their eternal worth?",
    pray: "Lord, you form us from dust and give us breath. Do it again here.",
  },
  {
    read: { text: "To the woman he said, “I will greatly multiply your pain in childbirth. You will bear children in pain. Your desire will be for your husband, and he will rule over you.”", ref: "Genesis 3:16" },
    reflection:
      "I will greatly multiply your pain in childbirth. In pain you will bear children. Scripture does not pretend this is easy. The pain is named honestly and it is not a punishment for anything you did.",
    talk: "Has anyone ever made you feel the difficulty is your fault? What does this verse actually say?",
    pray: "Lord, this is hard, and you said it would be. Be with us in it.",
  },
  {
    read: { text: "The man called his wife Eve because she would be the mother of all the living.", ref: "Genesis 3:20" },
    reflection:
      "The man called his wife Eve, because she would be the mother of all living. In the middle of the curse, he names her for life. Hope named in the darkest chapter.",
    talk: "Where can you name hope in the middle of something hard?",
    pray: "Lord, even in the curse you left room for life. Thank you.",
  },
  {
    read: { text: "Whoever sheds man’s blood, his blood will be shed by man, for God made man in his own image.", ref: "Genesis 9:6" },
    reflection:
      "Whoever sheds man's blood, his blood will be shed by man, for God made man in his own image. Human life is protected because of whose image it bears. That is the ground of a child's worth.",
    talk: "Where does this child's value come from? Not from us — from whom?",
    pray: "Lord, you made this child in your image. Guard their life.",
  },
  {
    read: { text: "I will establish my covenant between me and you and your offspring after you throughout their generations for an everlasting covenant, to be a God to you and to your offspring after you.", ref: "Genesis 17:7" },
    reflection:
      "I will establish my covenant between me and you and your offspring after you throughout their generations. God's promises reach forward into generations we will not meet.",
    talk: "What do you want to be true of this family three generations from now?",
    pray: "Lord, establish your covenant with us and with our children after us.",
  },
  {
    read: { text: "the LORD visited Sarah as he had said, and the LORD did to Sarah as he had spoken.", ref: "Genesis 21:1" },
    reflection:
      "The LORD visited Sarah as he had said, and the LORD did to Sarah as he had spoken. Twenty-five years after the promise. God's keeping of his word is not measured on our calendar.",
    talk: "What have you been waiting for? How long has it been?",
    pray: "Lord, you visit as you have said. We wait on your timing.",
  },
  {
    read: { text: "God heard the voice of the boy. The angel of God called to Hagar out of the sky, and said to her, “What troubles you, Hagar? Don’t be afraid. For God has heard the voice of the boy where he is.”", ref: "Genesis 21:17" },
    reflection:
      "God heard the voice of the boy. The angel of God called to Hagar out of the sky. A dying child in a desert, and God heard the child's own voice. He hears children directly.",
    talk: "Does it comfort you that God hears this child independently of you?",
    pray: "Lord, you hear the voice of the child. Hear ours.",
  },
  {
    read: { text: "They blessed Rebekah, and said to her, “Our sister, may you be the mother of thousands of ten thousands, and let your offspring possess the gate of those who hate them.”", ref: "Genesis 24:60" },
    reflection:
      "Our sister, may you be the mother of thousands of ten thousands. A family blessing spoken over a woman before she was married. Households have always spoken blessings out loud.",
    talk: "What blessing would you speak over this child? Say it out loud tonight.",
    pray: "Lord, we speak your blessing over this child. Make it so.",
  },
  {
    read: { text: "He lifted up his eyes, and saw the women and the children; and said, “Who are these with you?” He said, “The children whom God has graciously given your servant.”", ref: "Genesis 33:5" },
    reflection:
      "Who are these with you? He said, 'The children whom God has graciously given your servant.' Jacob calls his children a gracious gift, not an achievement.",
    talk: "Do you think of this child as a gift or as an accomplishment? What is the difference?",
    pray: "Lord, these are the children you have graciously given. Thank you.",
  },
  {
    read: { text: "He blessed Joseph, and said, “The God before whom my fathers Abraham and Isaac walked, the God who has fed me all my life long to this day, the angel who has redeemed me from all evil, bless the lads, and let my name be named on them, and the name of my fathers Abraham and Isaac. Let them grow into a multitude upon the earth.”", ref: "Genesis 48:15-16" },
    reflection:
      "The God who has fed me all my life long to this day, the angel who has redeemed me from all evil, bless the boys. An old man blesses his grandsons out of his own long experience of God.",
    talk: "What has God done in your life that you want this child to know about?",
    pray: "Lord, the God who has fed us all our life long, bless this child.",
  },
  {
    read: { text: "Pharaoh commanded all his people, saying, “You shall cast every son who is born into the river, and every daughter you shall save alive.”", ref: "Exodus 1:22" },
    reflection:
      "Pharaoh commanded all his people, saying, 'You shall cast every son who is born into the river.' Children have been at risk from powerful people since the beginning. God's rescue plan came through one of them.",
    talk: "What threatens children in your world? What can this household do?",
    pray: "Lord, you saved a child from the river. Protect the vulnerable children of our day.",
  },
  {
    read: { text: "Pharaoh’s daughter said to her, “Take this child away, and nurse him for me, and I will give you your wages.” The woman took the child, and nursed it.", ref: "Exodus 2:9" },
    reflection:
      "Take this child away, and nurse him for me, and I will give you your wages. Moses' own mother is paid to nurse her own son. God's providence returns the child to the mother by an impossible route.",
    talk: "Where has God worked through a route you could never have planned?",
    pray: "Lord, your providence takes strange routes. We trust it.",
  },
  {
    read: { text: "Honor your father and your mother, that your days may be long in the land which the LORD your God gives you.", ref: "Exodus 20:12" },
    reflection:
      "Honour your father and your mother, that your days may be long in the land. The only commandment with a promise attached concerns parents. This child will one day be asked to honour you.",
    talk: "What kind of parent will be easy to honour? What kind will be hard?",
    pray: "Lord, make us parents worth honouring, and this child able to honour.",
  },
  {
    read: { text: "the LORD passed by before him, and proclaimed, “the LORD! the LORD, a merciful and gracious God, slow to anger, and abundant in loving kindness and truth,”", ref: "Exodus 34:6" },
    reflection:
      "The LORD, a merciful and gracious God, slow to anger, and abundant in loving kindness and truth. God's own self-description. This is the God your child will meet through you first.",
    talk: "Which of God's qualities do you most need to show this child?",
    pray: "Lord, you are merciful and gracious, slow to anger. Make us like you.",
  },
  {
    read: { text: "If she cannot afford a lamb, then she shall take two turtledoves or two young pigeons: the one for a burnt offering, and the other for a sin offering. The priest shall make atonement for her, and she shall be clean.", ref: "Leviticus 12:8" },
    reflection:
      "If she can't afford a lamb, then she shall take two turtledoves, or two young pigeons. God legislated a cheaper offering for poor mothers. Mary and Joseph brought the birds.",
    talk: "Does it matter to you that Christ was born into a family who could not afford a lamb?",
    pray: "Lord, you made room for the poor in your law. Thank you for meeting us where we are.",
  },
  {
    read: { text: "and in the wilderness where you have seen how that the LORD your God carried you, as a man carries his son, in all the way that you went, until you came to this place.", ref: "Deuteronomy 1:31" },
    reflection:
      "In the wilderness, where you have seen how that the LORD your God bore you, as a man bears his son. God's care described as a father carrying an exhausted child. That is the image he chose.",
    talk: "When were you last carried? Can you receive that from God now?",
    pray: "Lord, you carry us as a father carries his son. Carry us through this.",
  },
  {
    read: { text: "Know therefore that the LORD your God himself is God, the faithful God, who keeps covenant and loving kindness with them who love him and keep his commandments to a thousand generations,", ref: "Deuteronomy 7:9" },
    reflection:
      "Know therefore that the LORD your God himself is God, the faithful God, who keeps covenant and loving kindness with them who love him to a thousand generations. A thousand generations.",
    talk: "What would you want this child to know about God's faithfulness?",
    pray: "Lord, you keep covenant to a thousand generations. Keep it with ours.",
  },
  {
    read: { text: "Be strong and courageous. Don’t be afraid or scared of them; for the LORD your God himself is who goes with you. He will not fail you nor forsake you.", ref: "Deuteronomy 31:6" },
    reflection:
      "Be strong and courageous. Don't be afraid or scared of them; for the LORD your God himself is who goes with you. Courage grounded in presence, not in a guaranteed outcome.",
    talk: "What are you afraid of about this birth or this child? Say it aloud.",
    pray: "Lord, you go with us. Do not let us be afraid.",
  },
  {
    read: { text: "Haven’t I commanded you? Be strong and courageous. Don’t be afraid. Don’t be dismayed, for the LORD your God is with you wherever you go.", ref: "Joshua 1:9" },
    reflection:
      "Haven't I commanded you? Be strong and courageous. Don't be afraid. Don't be dismayed, for the LORD your God is with you wherever you go. Commanded courage — so it is not a personality type.",
    talk: "Where do you need commanded courage this week?",
    pray: "Lord, you have commanded us. Be with us wherever we go.",
  },
  {
    read: { text: "Manoah said, “Now let your words happen. What shall the child’s way of life and mission be?”", ref: "Judges 13:12" },
    reflection:
      "When your words happen, what shall be the child's way of life and mission? A father asks God what the child is for, before the child arrives. That is a good question to ask.",
    talk: "What do you hope this child is for? Can you hold it loosely?",
    pray: "Lord, what will this child's life be? We give them to you.",
  },
  {
    read: { text: "The women said to Naomi, “Blessed be the LORD, who has not left you today without a near kinsman. Let his name be famous in Israel. He shall be to you a restorer of life and sustain you in your old age; for your daughter-in-law, who loves you, who is better to you than seven sons, has given birth to him.”", ref: "Ruth 4:14-15" },
    reflection:
      "Blessed be the LORD, who has not left you today without a near kinsman. He shall be to you a restorer of life. A grandmother's grief answered by a grandchild. God restores by generations.",
    talk: "What has been restored in your family? What still needs restoring?",
    pray: "Lord, you restore life and nourish old age. Do that here.",
  },
  {
    read: { text: "She was in bitterness of soul, and prayed to the LORD, weeping bitterly. She vowed a vow, and said, “the LORD of Armies, if you will indeed look at the affliction of your servant and remember me, and not forget your servant, but will give to your servant a boy, then I will give him to the LORD all the days of his life, and no razor shall come on his head.”", ref: "1 Samuel 1:10-11" },
    reflection:
      "She was in bitterness of soul, and prayed to the LORD, and wept bitterly. Bitter prayer, recorded without correction. God receives what is bitter as prayer.",
    talk: "Have you prayed bitterly? Did you feel you were allowed to?",
    pray: "Lord, we come bitter and weeping. Receive it as prayer.",
  },
  {
    read: { text: "Then Eli answered, “Go in peace; and may the God of Israel grant your petition that you have asked of him.”", ref: "1 Samuel 1:17" },
    reflection:
      "Go in peace; and may the God of Israel grant your petition. Eli, who had misjudged her, blesses her. Sometimes the person who misread you is still the one who blesses you.",
    talk: "Who has misjudged you in this season? Could they still be a blessing?",
    pray: "Lord, grant our petition. Let us go in peace.",
  },
  {
    read: { text: "the LORD visited Hannah, and she conceived and bore three sons and two daughters. The child Samuel grew before the LORD.", ref: "1 Samuel 2:21" },
    reflection:
      "The LORD visited Hannah, and she conceived, and bore three sons and two daughters. The child Samuel grew before the LORD. After giving away her only son, God gave five more.",
    talk: "What have you given up that God has more than made good?",
    pray: "Lord, you are no one's debtor. We trust you with what we surrender.",
  },
  {
    read: { text: "He said, “While the child was yet alive, I fasted and wept; for I said, ‘Who knows whether the LORD will not be gracious to me, that the child may live?’ But now he is dead, why should I fast? Can I bring him back again? I will go to him, but he will not return to me.”", ref: "2 Samuel 12:22-23" },
    reflection:
      "While the child was yet alive, I fasted and wept... but now he is dead, why should I fast? I will go to him, but he will not return to me. David prays until there is nothing to pray for, and then hopes.",
    talk: "If you have lost a child, have you been allowed to grieve out loud? Who knows?",
    pray: "Lord, we shall go to them. Hold those who have buried a child.",
  },
  {
    read: { text: "Then the woman whose the living child was spoke to the king, for her heart yearned over her son, and she said, “Oh, my lord, give her the living child, and in no way kill him!” But the other said, “He shall be neither mine nor yours. Divide him.”", ref: "1 Kings 3:26" },
    reflection:
      "Then the woman whose the living child was spoke to the king, for her heart yearned over her son. A mother's love revealed by willingness to lose. That instinct is from God.",
    talk: "What would you give up for this child's good?",
    pray: "Lord, you put this fierce love in us. Let it be like yours.",
  },
  {
    read: { text: "He said, “At this season, when the time comes around, you will embrace a son.” She said, “No, my lord, you man of God, do not lie to your servant.”", ref: "2 Kings 4:16" },
    reflection:
      "About this season, when the time comes around, you will embrace a son. She said, 'No, my lord, you man of God, do not lie to your servant.' She could not bear to hope again.",
    talk: "Have you been afraid to hope? What made hope feel dangerous?",
    pray: "Lord, we are afraid to hope. Be gentle with our hearts.",
  },
  {
    read: { text: "Yours, the LORD, is the greatness, the power, the glory, the victory, and the majesty! For all that is in the heavens and in the earth is yours. Yours is the kingdom, the LORD, and you are exalted as head above all.", ref: "1 Chronicles 29:11" },
    reflection:
      "Yours, LORD, is the greatness, the power, the glory, the victory, and the majesty! For all that is in the heavens and in the earth is yours. Everything belongs to God, including this child.",
    talk: "What do you find hardest to acknowledge as God's rather than yours?",
    pray: "Lord, everything in heaven and earth is yours. This child too.",
  },
  {
    read: { text: "and he said, “Listen, all Judah, and you inhabitants of Jerusalem, and you, king Jehoshaphat. the LORD says to you, ‘Don’t be afraid, and don’t be dismayed because of this great multitude; for the battle is not yours, but God’s.”", ref: "2 Chronicles 20:15" },
    reflection:
      "Don't be afraid or dismayed because of this great multitude; for the battle is not yours, but God's. Whatever is coming, the outcome does not rest on your strength.",
    talk: "What battle are you treating as yours to win?",
    pray: "Lord, the battle is not ours but yours. We stand still and watch.",
  },
  {
    read: { text: "Then he said to them, “Go your way. Eat the fat, drink the sweet, and send portions to him for whom nothing is prepared, for today is holy to our Lord. Don’t be grieved, for the joy of the LORD is your strength.”", ref: "Nehemiah 8:10" },
    reflection:
      "Don't be grieved, for the joy of the LORD is your strength. Spoken to people undone by realising how far they had drifted. The joy is his, not manufactured by us.",
    talk: "Where are you trying to manufacture strength? What is offered instead?",
    pray: "Lord, let your joy be our strength when we have none of our own.",
  },
  {
    read: { text: "Your hands have framed me and fashioned me altogether, yet you destroy me.", ref: "Job 10:8" },
    reflection:
      "Your hands have framed me and fashioned me altogether, yet you destroy me. Job says both in one breath. The maker and the one who allows the ruin are the same, and Job does not resolve it.",
    talk: "Have you felt both made and undone by God? Can both be said to him?",
    pray: "Lord, your hands fashioned us. We do not understand you, and we are still here.",
  },
  {
    read: { text: "The Spirit of God has made me, and the breath of the Almighty gives me life.", ref: "Job 33:4" },
    reflection:
      "The Spirit of God has made me, and the breath of the Almighty gives me life. Every breath this child takes is on loan from God. So is every one of yours.",
    talk: "How does it change today to know each breath is given?",
    pray: "Lord, your Spirit made us and your breath gives us life.",
  },
  {
    read: { text: "In peace I will both lay myself down and sleep, for you, the LORD alone, make me live in safety.", ref: "Psalm 4:8" },
    reflection:
      "In peace I will both lay myself down and sleep, for you, LORD alone, make me live in safety. Written by someone whose danger had not passed. Sleep as an act of trust.",
    talk: "What keeps you awake? Who do you think is on duty tonight?",
    pray: "Lord, you alone make us dwell in safety. We lie down in peace.",
  },
  {
    read: { text: "the LORD will also be a high tower for the oppressed; a high tower in times of trouble.", ref: "Psalm 9:9" },
    reflection:
      "The LORD will also be a high tower for the oppressed; a high tower in times of trouble. A place to go when you cannot fix the trouble.",
    talk: "Where do you go when it is too much? Is it a tower or a hiding place?",
    pray: "Lord, be our stronghold in this time of trouble.",
  },
  {
    read: { text: "I have set the LORD always before me. Because he is at my right hand, I shall not be moved.", ref: "Psalm 16:8" },
    reflection:
      "I have set the LORD always before me. Because he is at my right hand, I shall not be moved. Setting him before us is deliberate — a decision about where to look.",
    talk: "What is in front of you most of the day? What would change if he were?",
    pray: "Lord, we set you before us. Keep us from being shaken.",
  },
  {
    read: { text: "He brought me out also into a large place. He delivered me, because he delighted in me.", ref: "Psalm 18:19" },
    reflection:
      "He brought me out also into a large place. He delivered me, because he delighted in me. He delighted in me — that is the stated reason for the rescue.",
    talk: "Do you believe God delights in you? Why is that harder than believing he loves you?",
    pray: "Lord, you delivered us because you delighted in us. Help us believe it.",
  },
  {
    read: { text: "Guide me in your truth, and teach me, For you are the God of my salvation, I wait for you all day long.", ref: "Psalm 25:5" },
    reflection:
      "Guide me in your truth, and teach me, for you are the God of my salvation. I wait for you all day long. Waiting all day long is named as normal.",
    talk: "How do you spend the waiting? Anxiously, or with him?",
    pray: "Lord, lead us in your truth. We wait for you all the day long.",
  },
  {
    read: { text: "Wait for the LORD. Be strong, and let your heart take courage. Yes, wait for the LORD.", ref: "Psalm 27:14" },
    reflection:
      "Wait for the LORD. Be strong, and let your heart take courage. Yes, wait for the LORD. Repeated because we do not want to hear it once.",
    talk: "What are you being asked to wait for? What would courageous waiting look like?",
    pray: "Lord, we wait for you. Let our hearts take courage.",
  },
  {
    read: { text: "I will be glad and rejoice in your loving kindness, for you have seen my affliction. You have known my soul in adversities.", ref: "Psalm 31:7" },
    reflection:
      "I will be glad and rejoice in your loving kindness, for you have seen my affliction. You have known my soul in adversities. Being known in adversity is itself the comfort.",
    talk: "What adversity do you feel nobody knows about?",
    pray: "Lord, you have seen our affliction and known our soul's distress.",
  },
  {
    read: { text: "Our soul has waited for the LORD. He is our help and our shield. For our heart rejoices in him, because we have trusted in his holy name. Let your loving kindness be on us, the LORD, since we have hoped in you.", ref: "Psalm 33:20-22" },
    reflection:
      "Our soul has waited for the LORD. He is our help and our shield. Let your loving kindness be on us, since we have hoped in you. Waiting, and asking for love while waiting.",
    talk: "What are you waiting for? Have you asked for love in the waiting?",
    pray: "Lord, our soul waits for you. Let your steadfast love be upon us.",
  },
  {
    read: { text: "Commit your way to the LORD. Trust also in him, and he will do this:", ref: "Psalm 37:5" },
    reflection:
      "Commit your way to the LORD. Trust also in him, and he will do this. Committing is a handing over, done deliberately, often more than once.",
    talk: "What do you need to hand over today? Have you handed it over before?",
    pray: "Lord, we commit our way to you. Do what we cannot.",
  },
  {
    read: { text: "Many, the LORD, my God, are the wonderful works which you have done, and your thoughts which are toward us. They can’t be declared back to you. If I would declare and speak of them, they are more than can be counted.", ref: "Psalm 40:5" },
    reflection:
      "Many, LORD, my God, are the wonderful works which you have done, and your thoughts which are toward us... They are more than can be counted. His thoughts toward us are innumerable.",
    talk: "Do you imagine God thinking about you? What does this verse say?",
    pray: "Lord, your thoughts toward us are more than can be numbered.",
  },
  {
    read: { text: "God is within her. She shall not be moved. God will help her at dawn.", ref: "Psalm 46:5" },
    reflection:
      "God is within her. She shall not be moved. God will help her at dawn. Written of a city, and it reads as a promise to anyone who feels close to collapse.",
    talk: "What feels close to collapse? What does 'God will help her at dawn' offer?",
    pray: "Lord, be within us. Help us when morning dawns.",
  },
  {
    read: { text: "I said, “Oh that I had wings like a dove! Then I would fly away, and be at rest.”", ref: "Psalm 55:6" },
    reflection:
      "Oh that I had wings like a dove! Then I would fly away, and be at rest. The wish to escape is in the Bible. You are not faithless for having felt it.",
    talk: "Have you wished to escape? Can you say that here without judgement?",
    pray: "Lord, we have wanted to fly away. Give us rest where we are.",
  },
  {
    read: { text: "Hear my cry, God. Listen to my prayer. From the end of the earth, I will call to you when my heart is overwhelmed. Lead me to the rock that is higher than I.", ref: "Psalm 61:1-2" },
    reflection:
      "Hear my cry, God. Listen to my prayer. From the end of the earth, I will call to you when my heart is overwhelmed. Overwhelmed is a place to pray from, not a disqualification.",
    talk: "What overwhelms you right now?",
    pray: "Lord, from the end of the earth we call to you. Lead us to the rock.",
  },
  {
    read: { text: "God, you are my God. I will earnestly seek you. My soul thirsts for you. My flesh longs for you, in a dry and weary land, where there is no water.", ref: "Psalm 63:1" },
    reflection:
      "God, you are my God. I will earnestly seek you. My soul thirsts for you, my flesh longs for you, in a dry and weary land where there is no water. Written in a wilderness.",
    talk: "What is dry in you right now?",
    pray: "Lord, our souls thirst for you in a dry and weary land.",
  },
  {
    read: { text: "Blessed be the Lord, who daily bears our burdens, even the God who is our salvation.", ref: "Psalm 68:19" },
    reflection:
      "Blessed be the Lord, who daily bears our burdens, even the God who is our salvation. Daily — not once, not occasionally. A new load each day, carried by him.",
    talk: "What burden did you carry today that he offered to carry?",
    pray: "Lord, you daily bear our burdens. Take today's.",
  },
  {
    read: { text: "Nevertheless, I am continually with you. You have held my right hand.", ref: "Psalm 73:23" },
    reflection:
      "Nevertheless, I am continually with you. You have held my right hand. Written by a man who had nearly lost his faith. Held even while nearly slipping.",
    talk: "Have you nearly slipped? What held you?",
    pray: "Lord, we are continually with you. You hold our right hand.",
  },
  {
    read: { text: "Your way was through the sea; your paths through the great waters. Your footsteps were not known.", ref: "Psalm 77:19" },
    reflection:
      "Your way was through the sea; your paths through the great waters. Your footsteps were not known. God's route left no visible trace. His leading is often invisible in the moment.",
    talk: "Where has God led you that you could not see at the time?",
    pray: "Lord, your way was through the sea. Lead us where we cannot see.",
  },
  {
    read: { text: "But you, Lord, are a merciful and gracious God, slow to anger, and abundant in loving kindness and truth.", ref: "Psalm 86:15" },
    reflection:
      "But you, Lord, are a merciful and gracious God, slow to anger, and abundant in loving kindness and truth. The description God gave of himself, quoted back to him in prayer.",
    talk: "Which quality do you most need from God today?",
    pray: "Lord, you are merciful and gracious, slow to anger. Be that to us.",
  },
  {
    read: { text: "the LORD, God of Armies, who is a mighty one, like you? Yah, your faithfulness is around you. You rule the pride of the sea. When its waves rise up, you calm them.", ref: "Psalm 89:8-9" },
    reflection:
      "Who is a mighty one, like you, the LORD? You rule the pride of the sea. When its waves rise up, you calm them. The one who calms seas is the one over this season.",
    talk: "What waves are rising? Who rules them?",
    pray: "Lord, you still the rising waves. Still ours.",
  },
  {
    read: { text: "For he will put his angels in charge of you, to guard you in all your ways.", ref: "Psalm 91:11" },
    reflection:
      "For he will put his angels in charge of you, to guard you in all your ways. Satan quoted this verse at Christ to tempt him to presumption. Read it as comfort, not as a guarantee against harm.",
    talk: "How can a true promise be misused? What is the difference between trust and presumption?",
    pray: "Lord, you command your angels concerning us. Keep us from presuming.",
  },
  {
    read: { text: "They will still produce fruit in old age. They will be full of sap and green,", ref: "Psalm 92:14" },
    reflection:
      "They will still produce fruit in old age. They will be full of sap and green. A promise about the far end of life. This child will one day be old, and God's plan reaches there.",
    talk: "What do you hope for this child at eighty?",
    pray: "Lord, let this child still bear fruit in old age.",
  },
  {
    read: { text: "This will be written for the generation to come. A people which will be created will praise Yah.", ref: "Psalm 102:18" },
    reflection:
      "This will be written for the generation to come. A people which will be created will praise the LORD. Written for people not yet born. This child is among them.",
    talk: "What are you writing down for the generation to come?",
    pray: "Lord, let this be written for those yet to be created, who will praise you.",
  },
  {
    read: { text: "the LORD is merciful and gracious, slow to anger, and abundant in loving kindness.", ref: "Psalm 103:8" },
    reflection:
      "The LORD is merciful and gracious, slow to anger, and abundant in loving kindness. Note 'slow to anger'. Whatever you fear about your own patience, his is not the limit.",
    talk: "Are you afraid of your own anger with this child? Have you said so?",
    pray: "Lord, you are slow to anger. Make us slow too.",
  },
  {
    read: { text: "Then they cry to the LORD in their trouble, and he brings them out of their distress. He makes the storm a calm, so that its waves are still.", ref: "Psalm 107:28-29" },
    reflection:
      "Then they cry to the LORD in their trouble, and he brings them out of their distress. He makes the storm a calm, so that its waves are still. Crying out, and calm given.",
    talk: "Have you cried out yet, or only worried?",
    pray: "Lord, we cry to you in our trouble. Make the storm a whisper.",
  },
  {
    read: { text: "He raises up the poor out of the dust. Lifts up the needy from the ash heap, that he may set him with princes, even with the princes of his people.", ref: "Psalm 113:7-8" },
    reflection:
      "He raises up the poor out of the dust, and lifts up the needy from the ash heap, that he may set him with princes. God's habit of reversal. No one here is too low to be lifted.",
    talk: "Where do you feel low? What does God do with the lowly?",
    pray: "Lord, you lift the needy from the ash heap. Lift us.",
  },
  {
    read: { text: "Out of my distress, I called on Yah. Yah answered me with freedom. the LORD is on my side. I will not be afraid. What can man do to me?", ref: "Psalm 118:5-6" },
    reflection:
      "Out of my distress, I called on the LORD. The LORD answered me with freedom. The LORD is on my side. I will not be afraid. Distress, calling, answer, courage — the sequence matters.",
    talk: "Where in that sequence are you?",
    pray: "Lord, we call from distress. Set us in a broad place.",
  },
  {
    read: { text: "This is my comfort in my affliction, for your word has revived me.", ref: "Psalm 119:50" },
    reflection:
      "This is my comfort in my affliction, for your word has revived me. The comfort named is the word — not an explanation, not a resolution. The word itself.",
    talk: "Has Scripture ever actually comforted you? Which part?",
    pray: "Lord, your promise gives life. Comfort us with your word.",
  },
  {
    read: { text: "Please let your loving kindness be for my comfort, according to your word to your servant.", ref: "Psalm 119:76" },
    reflection:
      "Please let your loving kindness be for my comfort, according to your word to your servant. Asking God to comfort according to what he has already said. That is how to pray a promise.",
    talk: "Which of God's promises would you ask him to keep for you today?",
    pray: "Lord, let your steadfast love comfort us, according to your promise.",
  },
  {
    read: { text: "the LORD is your keeper. the LORD is your shade on your right hand. The sun will not harm you by day, nor the moon by night.", ref: "Psalm 121:5-6" },
    reflection:
      "The LORD is your keeper. The LORD is your shade on your right hand. The sun will not harm you by day, nor the moon by night. Day and night both covered.",
    talk: "What are your nights like? Who is keeping watch?",
    pray: "Lord, you are our keeper and our shade. Keep us day and night.",
  },
  {
    read: { text: "Out of the depths I have cried to you, the LORD.", ref: "Psalm 130:1" },
    reflection:
      "Out of the depths I have cried to you, LORD. The depths are where this psalm begins. You do not have to climb out before you pray.",
    talk: "How deep is it right now? Can you pray from there?",
    pray: "Out of the depths we cry to you, Lord. Hear our voice.",
  },
  {
    read: { text: "In the day that I called, you answered me. You encouraged me with strength in my soul.", ref: "Psalm 138:3" },
    reflection:
      "In the day that I called, you answered me. You encouraged me with strength in my soul. Strength in the soul — not a change of circumstances, but a change in the one facing them.",
    talk: "What would strength in your soul change about today?",
    pray: "Lord, on the day we called, you answered. Strengthen our souls.",
  },
  {
    read: { text: "You hem me in behind and before. You laid your hand on me.", ref: "Psalm 139:5" },
    reflection:
      "You hem me in behind and before. You laid your hand on me. Hemmed in — surrounded on every side. That can feel like confinement or safety, depending on who is doing it.",
    talk: "Does God's closeness feel like safety or pressure to you right now?",
    pray: "Lord, you hem us in behind and before. Lay your hand upon us.",
  },
  {
    read: { text: "For you formed my inmost being. You knit me together in my mother’s womb.", ref: "Psalm 139:13" },
    reflection:
      "For you formed my inmost being. You knit me together in my mother's womb. Knitting is slow, deliberate, one stitch at a time. That is how this child is being made.",
    talk: "What does 'knit together' suggest about God's care and pace?",
    pray: "Lord, you knit us together. Knit this child well.",
  },
  {
    read: { text: "Your eyes saw my body. In your book they were all written, the days that were ordained for me, when as yet there were none of them.", ref: "Psalm 139:16" },
    reflection:
      "Your eyes saw my body. In your book they were all written, the days that were ordained for me, when as yet there were none of them. Every day already written before one existed.",
    talk: "What comfort and what fear does this verse hold for you?",
    pray: "Lord, all our days were written before one of them came to be. We trust the book.",
  },
  {
    read: { text: "I cried to you, the LORD. I said, “You are my refuge, my portion in the land of the living.”", ref: "Psalm 142:5" },
    reflection:
      "I cried to you, LORD. I said, 'You are my refuge, my portion in the land of the living.' Said from a cave. Refuge is not a place; it is a person.",
    talk: "What is your refuge when things are hardest?",
    pray: "Lord, you are our refuge and our portion in the land of the living.",
  },
  {
    read: { text: "the LORD is good to all. His tender mercies are over all his works.", ref: "Psalm 145:9" },
    reflection:
      "The LORD is good to all. His tender mercies are over all his works. All of them. Nothing God has made falls outside his tender mercy — including this small one.",
    talk: "Is there anything you fear God has overlooked?",
    pray: "Lord, you are good to all, and your mercy is over all you have made.",
  },
  {
    read: { text: "He heals the broken in heart, and binds up their wounds. He counts the number of the stars. He calls them all by their names.", ref: "Psalm 147:3-4" },
    reflection:
      "He heals the broken in heart, and binds up their wounds. He counts the number of the stars. The star-counter is the wound-binder. Scale does not reduce attention.",
    talk: "Does God's greatness make you feel small or held? Why?",
    pray: "Lord, you count the stars and bind our wounds. Do both here.",
  },
  {
    read: { text: "When you lie down, you will not be afraid. Yes, you will lie down, and your sleep will be sweet.", ref: "Proverbs 3:24" },
    reflection:
      "When you lie down, you will not be afraid. Yes, you will lie down, and your sleep will be sweet. A proverb about the peace that comes from walking with wisdom.",
    talk: "What steals your sleep? Is any of it something you could put right?",
    pray: "Lord, when we lie down, let us not be afraid. Make our sleep sweet.",
  },
  {
    read: { text: "Keep your heart with all diligence, for out of it is the wellspring of life.", ref: "Proverbs 4:23" },
    reflection:
      "Keep your heart with all diligence, for out of it is the wellspring of life. What you feed your heart in these months will shape what pours out on a hard night.",
    talk: "What is going into your heart daily right now?",
    pray: "Lord, guard our hearts. Everything else flows from them.",
  },
  {
    read: { text: "In the fear of the LORD is a secure fortress, and he will be a refuge for his children.", ref: "Proverbs 14:26" },
    reflection:
      "In the fear of the LORD is a secure fortress, and he will be a refuge for his children. A parent's reverence becomes a refuge for the next generation.",
    talk: "How might your walk with God become a shelter for this child?",
    pray: "Lord, be a fortress to us, and a refuge for our children.",
  },
  {
    read: { text: "Commit your deeds to the LORD, and your plans shall succeed.", ref: "Proverbs 16:3" },
    reflection:
      "Commit your deeds to the LORD, and your plans shall succeed. Read alongside 16:9 — he directs the steps. Committing is not controlling.",
    talk: "What plan are you gripping? What would committing it look like?",
    pray: "Lord, we commit our work to you. Establish what is right.",
  },
  {
    read: { text: "Children’s children are the crown of old men; the glory of children are their parents.", ref: "Proverbs 17:6" },
    reflection:
      "Children's children are the crown of old men; the glory of children are their parents. Both directions. A child's glory is their parents — which is a sobering thing to be.",
    talk: "What kind of glory do you want to be to this child?",
    pray: "Lord, let us be a glory to our children, and they a crown to us.",
  },
  {
    read: { text: "the LORD’s name is a strong tower: the righteous run to him, and are safe.", ref: "Proverbs 18:10" },
    reflection:
      "The LORD's name is a strong tower: the righteous run to him, and are safe. Running is the action. The tower does not come to you.",
    talk: "Where do you run first? Is it the tower?",
    pray: "Lord, your name is a strong tower. We run to you.",
  },
  {
    read: { text: "Even a child makes himself known by his doings, whether his work is pure, and whether it is right.", ref: "Proverbs 20:11" },
    reflection:
      "Even a child makes himself known by his doings, whether his work is pure, and whether it is right. Character shows early. Watch, and do not be surprised by what you see.",
    talk: "What have you already noticed about this child, or expect to?",
    pray: "Lord, shape this child's character from the very beginning.",
  },
  {
    read: { text: "The father of the righteous has great joy. Whoever fathers a wise child delights in him.", ref: "Proverbs 23:24" },
    reflection:
      "The father of the righteous has great joy. Whoever fathers a wise child delights in him. Joy in a child's character rather than their achievement. Aim there.",
    talk: "What will you celebrate in this child — what they do, or who they are becoming?",
    pray: "Lord, let our joy be in their walk with you, not their achievements.",
  },
  {
    read: { text: "Strength and dignity are her clothing. She laughs at the time to come.", ref: "Proverbs 31:25" },
    reflection:
      "Strength and dignity are her clothing. She laughs at the time to come. Laughing at the future is possible only for someone who knows who holds it.",
    talk: "Can you laugh at the days to come? What would that require?",
    pray: "Lord, clothe us with strength and dignity. Let us laugh at the future.",
  },
  {
    read: { text: "He has made everything beautiful in its time. He has also set eternity in their hearts, yet so that man can’t find out the work that God has done from the beginning even to the end.", ref: "Ecclesiastes 3:11" },
    reflection:
      "He has made everything beautiful in its time. He has also set eternity in their hearts. Timing belongs to God, and our restlessness is by design.",
    talk: "What are you impatient about? What might its right time be?",
    pray: "Lord, you make everything beautiful in its time. Teach us to wait for it.",
  },
  {
    read: { text: "As you don’t know what is the way of the wind, nor how the bones grow in the womb of her who is with child; even so you don’t know the work of God who does all.", ref: "Ecclesiastes 11:5" },
    reflection:
      "As you don't know what is the way of the wind, nor how the bones grow in the womb of her who is with child; even so you don't know the work of God. Mystery in a womb, named by Scripture.",
    talk: "What do you not know? Can you leave it unknown?",
    pray: "Lord, we do not understand the work of your hands. We trust it anyway.",
  },
  {
    read: { text: "“Come now, and let’s reason together,” says the LORD: “Though your sins are as scarlet, they shall be as white as snow. Though they are red like crimson, they shall be as wool.”", ref: "Isaiah 1:18" },
    reflection:
      "Though your sins are as scarlet, they shall be as white as snow. Whatever came before this pregnancy, God's invitation is to reason together and be made clean.",
    talk: "Is there guilt you have carried into this season? Have you brought it to him?",
    pray: "Lord, though our sins are scarlet, make them white as snow.",
  },
  {
    read: { text: "Therefore the Lord himself will give you a sign. Behold, the virgin will conceive, and bear a son, and shall call his name Immanuel.", ref: "Isaiah 7:14" },
    reflection:
      "Behold, the virgin will conceive, and bear a son, and shall call his name Immanuel. God's rescue plan ran through a pregnancy that looked scandalous.",
    talk: "What is complicated about your circumstances? Does that disqualify anything?",
    pray: "Immanuel, God with us. Be with us in our complicated story.",
  },
  {
    read: { text: "the LORD, you are my God. I will exalt you! I will praise your name, for you have done wonderful things, things planned long ago, in complete faithfulness and truth.", ref: "Isaiah 25:1" },
    reflection:
      "LORD, you are my God. I will exalt you! I will praise your name, for you have done wonderful things, your counsels of old, in faithfulness and truth. Old plans, faithfully kept.",
    talk: "What has God already done that you can praise him for tonight?",
    pray: "Lord, you have done wonderful things, planned long ago in faithfulness.",
  },
  {
    read: { text: "Don’t you be afraid, for I am with you. Don’t be dismayed, for I am your God. I will strengthen you. Yes, I will help you. Yes, I will uphold you with the right hand of my righteousness.", ref: "Isaiah 41:10" },
    reflection:
      "Don't be afraid, for I am with you. Don't be dismayed, for I am your God. I will strengthen you. Yes, I will help you. Four promises in one verse, each grounded in presence.",
    talk: "Which of the four do you most need? Say it aloud.",
    pray: "Lord, do not let us fear. Strengthen us, help us, uphold us.",
  },
  {
    read: { text: "I will bring the blind by a way that they don’t know. I will lead them in paths that they don’t know. I will make darkness light before them, and crooked places straight. I will do these things, and I will not forsake them.", ref: "Isaiah 42:16" },
    reflection:
      "I will bring the blind by a way that they don't know... I will make darkness light before them, and crooked places straight. First-time parents are blind by definition. He leads anyway.",
    talk: "What do you not know how to do? Can you admit it?",
    pray: "Lord, lead us in a way we do not know. Make the rough places level.",
  },
  {
    read: { text: "This is what the LORD who made you, and formed you from the womb, who will help you says: “Don’t be afraid, Jacob my servant; and you, Jeshurun, whom I have chosen.”", ref: "Isaiah 44:2" },
    reflection:
      "The LORD who made you, and formed you from the womb, who will help you says: 'Don't be afraid.' The one who formed you is the one telling you not to fear.",
    talk: "Does it help that the God telling you not to fear is the one who made you?",
    pray: "Lord, you formed us from the womb. Do not let us be afraid.",
  },
  {
    read: { text: "Listen to me, house of Jacob, and all the remnant of the house of Israel, that have been carried from their birth, that have been carried from the womb. Even to old age I am he, and even to gray hairs I will carry you. I have made, and I will bear. Yes, I will carry, and will deliver.", ref: "Isaiah 46:3-4" },
    reflection:
      "You who have been carried from their birth, who have been carried from the womb: even to old age I am he. God carries from womb to grey hair. The whole span.",
    talk: "What season are you in? Is he carrying you in it?",
    pray: "Lord, you have carried us since birth. Carry us to old age.",
  },
  {
    read: { text: "Can a woman forget her nursing child, that she should not have compassion on the son of her womb? Yes, these may forget, yet I will not forget you!", ref: "Isaiah 49:15" },
    reflection:
      "Can a woman forget her nursing child, that she should not have compassion on the son of her womb? Yes, these may forget, yet I will not forget you. Even the strongest human bond can fail. His does not.",
    talk: "What is the strongest bond you know? What is stronger?",
    pray: "Lord, even a mother may forget. You will not forget us.",
  },
  {
    read: { text: "Surely he has borne our sickness and carried our suffering; yet we considered him plagued, struck by God, and afflicted.", ref: "Isaiah 53:4" },
    reflection:
      "Surely he has borne our sickness, and carried our suffering. Christ carried what we cannot. Whatever this season holds physically, he is not distant from it.",
    talk: "What are you carrying that Christ has already borne?",
    pray: "Lord Jesus, you have borne our griefs and carried our sorrows.",
  },
  {
    read: { text: "and the LORD will guide you continually, satisfy your soul in dry places, and make your bones strong. You will be like a watered garden, and like a spring of water whose waters don’t fail.", ref: "Isaiah 58:11" },
    reflection:
      "This promise is not made to people having an easy time of it. Isaiah 58 has just torn into a religion that fasted and prayed and ground the poor underfoot, and the watered garden is held out to a people asked to change. Notice where the guidance lands: in dry places, not after them. God does not wait for the drought to lift before he leads. And the water is not something the garden manufactures — Jesus stood up in the temple and shouted that anyone thirsty should come to him and drink, and John tells us he meant the Spirit. A garden is watered from outside itself.",
    talk: "What is dry in you? What would being watered look like?",
    pray: "Father, you promised to lead your people through dry ground and not merely out of it. We are thirsty, and we have nothing in ourselves to draw on. Send the Spirit your Son promised; satisfy us here, in the middle of it, and make this house a watered garden rather than a well-managed one.",
  },
  {
    read: { text: "The little one will become a thousand, and the small one a strong nation. I, the LORD, will do this quickly in its time.", ref: "Isaiah 60:22" },
    reflection:
      "Isaiah is speaking to a nation reduced almost to nothing — a remnant so small it could be counted. God says the little one will become a thousand, and then adds something strange: he will hasten it, in its time. Both. Not slow and not early. Israel waited four hundred years after the last prophet fell silent, and Paul's verdict on that long quiet was that when the fullness of time had come, God sent forth his Son. Exactly on time, after what felt to everyone alive like nothing happening at all.",
    talk: "What feels slow? What if it is simply not yet its time?",
    pray: "Lord, you are never late and never early, and we are not good at either. What feels slow to us tonight is simply not yet its time. Teach us to wait the way your people waited for your Son — not passively, but certain that the God who set the hour will keep it.",
  },
  {
    read: { text: "But now, the LORD, you are our Father. We are the clay and you our potter. We all are the work of your hand.", ref: "Isaiah 64:8" },
    reflection:
      "Read what comes just before this and the tenderness of it doubles. Isaiah has confessed that all of them have become unclean, that their righteousness is filthy rags, that they fade like a leaf. And then — but now — you are our Father, and we are the clay. It is an appeal, not a compliment. To be clay is not to be worthless; it is to be in a relationship with hands that intend something. Paul says the same treasure is carried in jars of clay precisely so that the surpassing power is seen to be God's and not ours.",
    talk: "What is being formed in you right now? Can you stay soft?",
    pray: "Father, we are clay and you are the potter, and we confess we would rather be the one at the wheel. Keep us soft while you work. Whatever you are forming in this house through this season, do not stop halfway because we flinched.",
  },
  {
    read: { text: "Heal me, O the LORD, and I will be healed. Save me, and I will be saved; for you are my praise.", ref: "Jeremiah 17:14" },
    reflection:
      "Jeremiah prays this five verses after saying that the heart is deceitful above all things, and desperately sick — who can know it? So the healing he asks for is not only a body's. He is asking to be healed at the level where he cannot even see the damage. And notice he does not bargain or soften it: heal me, save me, and both outcomes belong entirely to you. Peter, quoting Isaiah, tells us where that healing was finally paid for — by his wounds you were healed. The asking is plain because the ground is settled.",
    talk: "What needs healing? Have you asked plainly?",
    pray: "Lord, heal what we can name and what we cannot. We ask plainly, without conditions, because the wounds that heal us were not ours. You are our praise — not our last resort, and not our bargaining partner.",
  },
  {
    read: { text: "For I have satiated the weary soul, and I have replenished every sorrowful soul.", ref: "Jeremiah 31:25" },
    reflection:
      "This sits in the middle of Jeremiah's new covenant chapter — the one that promises a law written on hearts rather than stone, and sins remembered no more. So the refreshing of the weary soul is not a kind word dropped into a hard book. It is part of a covenant God swore he would keep himself. Weary and sorrowful are not two failures to get past; they are the two conditions God names as the ones he attends to. On the night he was betrayed, Jesus lifted a cup and called it this covenant, in his blood.",
    talk: "Are you weary, sorrowful, or both? Which needs attention first?",
    pray: "Father, we are weary in a way sleep does not touch, and sorrowful in ways we have not said out loud. You named both. Do here what you promised — satisfy and replenish — on the ground of the covenant your Son sealed and cannot break.",
  },
  {
    read: { text: "I will seek that which was lost, and will bring back that which was driven away, and will bind up that which was broken, and will strengthen that which was sick; but I will destroy the fat and the strong. I will feed them in justice.", ref: "Ezekiel 34:16" },
    reflection:
      "God has spent this whole chapter furious with the shepherds of Israel, who fed themselves and let the flock scatter. Then he stops using the third person: I myself will search. Four verbs for four conditions, and none of them is a condition you can fix from inside. Centuries later Jesus stood in the temple and said I am the good shepherd — deliberately taking Ezekiel 34 onto himself, in front of the men who were supposed to be doing this job. God did not send someone. He came.",
    talk: "Which of the four are you? Lost, driven away, broken, or sick?",
    pray: "Good Shepherd, we are some of the four tonight — lost, driven away, broken, or simply worn out. You said you would come yourself rather than send. Seek us, carry us back, bind what is torn, and strengthen what is failing.",
  },
  {
    read: { text: "If it happens, our God whom we serve is able to deliver us from the burning fiery furnace; and he will deliver us out of your hand, O king. But if not, let it be known to you, O king, that we will not serve your gods or worship the golden image which you have set up.", ref: "Daniel 3:17-18" },
    reflection:
      "Three young men stand in front of a furnace and a king, and their answer has two halves. Our God is able to deliver us — that is faith. But if not, we still will not bow — that is faith with nothing underneath it but God himself. They did not know the ending. Neither did Jesus' human heart in the garden, where the same two halves came out as let this cup pass, and nevertheless not my will but yours. This is not a promise that you will get the outcome you want. It is a promise that God is worth having when you do not.",
    talk: "Is your trust conditional on a particular outcome? How would you know?",
    pray: "Lord, you are able. We ask you plainly for what we want and we are not ashamed of asking. And if the answer is not the one we are praying for, hold us anyway — let us still be yours on that morning, the way your Son was in the garden.",
  },
  {
    read: { text: "Come! Let’s return to the LORD; for he has torn us to pieces, and he will heal us; he has injured us, and he will bind up our wounds.", ref: "Hosea 6:1" },
    reflection:
      "There is something uncomfortable here worth seeing. These are Israel's words, and God's reply two verses later is that their love is like the morning mist, gone by noon. So this is a true thing said by people who did not mean it — which makes it a test as much as a comfort. Can you say it and mean it: that the hand which tore is the hand you are returning to? The verse that follows says he will raise us up on the third day, and the church has never been able to read that line without thinking of a Sunday morning.",
    talk: "Can you hold both — that God has allowed this and will heal it?",
    pray: "Lord, we want to come back to you meaning it, not just saying it while the trouble lasts. You have wounded and you will bind up, and we do not pretend to understand how both are your kindness. Raise us. We are returning.",
  },
  {
    read: { text: "You will have plenty to eat, and be satisfied, and will praise the name of the LORD, your God, who has dealt wondrously with you; and my people will never again be disappointed.", ref: "Joel 2:26" },
    reflection:
      "Joel has just described a land stripped bare by locusts, and a verse earlier God promises to restore the years the swarm has eaten. Not the crops — the years. Then this: you will eat and be satisfied, and never again be put to shame. Peter stood up at Pentecost and said this chapter was happening in front of them. What Joel saw as harvest restored, Peter saw as the Spirit poured out on sons and daughters. The disappointment does not get erased; it gets overtaken.",
    talk: "What disappointment have you carried? What is promised beyond it?",
    pray: "Lord, you promised to give back years, not only harvests. We bring you the disappointments we have stopped mentioning. Deal wondrously with this house, and let our children know a God who restores rather than one who merely compensates.",
  },
  {
    read: { text: "He shall stand, and shall shepherd in the strength of the LORD, in the majesty of the name of the LORD his God: and they will live, for then he will be great to the ends of the earth.", ref: "Micah 5:4" },
    reflection:
      "Two verses earlier Micah names the town: Bethlehem, too small to be counted among the clans of Judah, and out of it a ruler whose goings forth are from ancient days. Matthew quotes it to Herod's scholars. So this shepherd standing in the strength of the LORD is the baby the magi came for — and the smallness of the beginning is the whole point of the prophecy. God's habit is to start things too small to be worth anyone's notice, and to be great to the ends of the earth by the end of it.",
    talk: "What might God do with the child in your arms?",
    pray: "Lord Jesus, you were once a child in a town nobody counted. We do not know what you intend to do with the one you have given us. Shepherd them in the strength of your Father, all their life, and let their beginning be small and their end be yours.",
  },
  {
    read: { text: "the LORD is good, a stronghold in the day of trouble; and he knows those who take refuge in him.", ref: "Nahum 1:7" },
    reflection:
      "Nahum is three chapters of judgement falling on Nineveh, and this verse sits in the middle of it like a window cut in a wall. The goodness of God is not a different subject from his justice; it is the same God, and the people who take refuge in him are known — not counted, known. Paul writes almost the same sentence to a church under pressure: the Lord knows those who are his. In a day of trouble it matters enormously whether God knows your name or merely your number.",
    talk: "Do you believe God knows you individually? What would change if you did?",
    pray: "Lord, you are good, and you are a stronghold on the day everything else gives way. You know the ones who run to you. We are running. Know this house by name, and let our children grow up certain they are known and not counted.",
  },
  {
    read: { text: "the LORD, I have heard of your fame. I stand in awe of your deeds, the LORD. Renew your work in the middle of the years. In the middle of the years make it known. In wrath, you remember mercy.", ref: "Habakkuk 3:2" },
    reflection:
      "Habakkuk has spent two chapters arguing with God about why the wicked prosper, and been given an answer he found harder than the question. Chapter three is what he prays afterwards. He does not ask for a new answer. He asks God to do again what he has already done, and then says the most remarkable thing in the book: in wrath, remember mercy. That sentence found its answer at a place outside Jerusalem, where the wrath fell and the mercy was remembered in the same afternoon, on the same Person.",
    talk: "Where do you need God to remember mercy?",
    pray: "Lord, we have heard what you have done and we are asking you to do it again — in the middle of our years, not only at the end of them. In wrath remember mercy. You have already proved you do.",
  },
  {
    read: { text: "Behold, at that time I will deal with all those who afflict you, and I will save those who are lame, and gather those who were driven away. I will give them praise and honor, whose shame has been in all the earth.", ref: "Zephaniah 3:19" },
    reflection:
      "This is the last page of a book that opened with God promising to sweep everything from the face of the earth. And it ends here: the lame saved, the outcast gathered, and shame turned into praise. Not shame removed and replaced with neutrality — turned into praise, the same material worked into its opposite. Hebrews says that Jesus endured the cross and despised the shame, which is how the exchange was made. He took what was ours and left us with what was his.",
    talk: "What shame do you carry into this season? What does God offer?",
    pray: "Father, we carry things we do not say aloud, and some of them we brought into this season with us. You promised to turn shame into praise. Do it. And let this child grow up in a house where nothing has to be hidden.",
  },
  {
    read: { text: "For I,’ says the LORD, ‘will be to her a wall of fire around it, and I will be the glory in the middle of her.", ref: "Zechariah 2:5" },
    reflection:
      "A young man is out measuring Jerusalem for walls, and God stops him: the city will be too full for walls, so I will be the wall. Fire on the outside, glory on the inside — and nothing of it built by the people living there. It is one of the strangest pictures of security in Scripture, because it removes the thing everyone assumed security meant. John says the glory in the middle finally moved in: the Word became flesh and pitched his tent among us, and we have seen his glory.",
    talk: "What needs a wall of fire around it right now?",
    pray: "Lord, be a wall of fire around this house — we cannot build one, and the walls we can build do not hold. Be the glory in the middle of it too, so that what is inside is worth guarding.",
  },
  {
    read: { text: "But when he thought about these things, behold, an angel of the Lord appeared to him in a dream, saying, “Joseph, son of David, don’t be afraid to take to yourself Mary, your wife, for that which is conceived in her is of the Holy Spirit.”", ref: "Matthew 1:20" },
    reflection:
      "Joseph has already decided what to do. He is a righteous man and he has chosen the kindest lawful option, which is a quiet divorce. Then God interrupts the plan he had every right to make, and the word is: do not be afraid to take her. Not the situation will be simple. Not people will understand. Just — do not be afraid, because what is happening here is of the Holy Spirit. Joseph's obedience cost him a reputation he never got back, and it put him in the genealogy of the Son of God.",
    talk: "What complication are you afraid of? What might God be doing in it?",
    pray: "Father, we are afraid of complications we did not choose and cannot explain to everyone. Do not let fear be what decides things in this house. Give us Joseph's willingness to take on what you have given, before we understand it.",
  },
  {
    read: { text: "Now when they had departed, behold, an angel of the Lord appeared to Joseph in a dream, saying, “Arise and take the young child and his mother, and flee into Egypt, and stay there until I tell you, for Herod will seek the young child to destroy him.”", ref: "Matthew 2:13" },
    reflection:
      "God warns Joseph, and the family runs — and Matthew does not soften what happened to the families who were not warned. He quotes Jeremiah: Rachel weeping for her children, refusing to be comforted. So this is not a verse promising that your child will be kept from every harm, and we should not pretend it is. It is the record of God bringing his Son out of Egypt as he once brought out his people, through a night that cost other mothers everything. Protection here looked like a road in the dark.",
    talk: "Has God's protection ever looked like upheaval to you?",
    pray: "Lord, you protected your Son by telling his father to run. We do not know what your protection of ours will look like, and we will not tell you how to do it. Keep them. And be near the families tonight for whom this verse is Rachel's, not Joseph's.",
  },
  {
    read: { text: "Therefore don’t be like them, for your Father knows what things you need, before you ask him.", ref: "Matthew 6:8" },
    reflection:
      "Jesus has just described people heaping up words, thinking volume is what gets heaven's attention. His correction is not pray less. It is: you are not talking to a stranger who needs briefing. Your Father already knows. Which raises the obvious question, and the answer is that prayer was never about transferring information. It is about a child coming to a father. Paul says the Spirit puts the word Abba in our mouths — the same word the Son used in the garden — because that is what we now are.",
    talk: "If God already knows, why pray? What is prayer actually for?",
    pray: "Father, you know what we need before we open our mouths, and you want us to come anyway. So here we are, with nothing to tell you. Make us the kind of people who come because you are our Father, not because we have run out of options.",
  },
  {
    read: { text: "Therefore don’t be anxious for tomorrow, for tomorrow will be anxious for itself. Each day’s own evil is sufficient.", ref: "Matthew 6:34" },
    reflection:
      "This is the end of a long argument about birds and flowers and what it means to be fed. The command is odd when you look at it directly: not do not think about tomorrow, but do not be anxious for it — because tomorrow will do its own worrying and today has enough. It is manna logic. God gave Israel bread one day at a time and it rotted if they hoarded it, and Jesus taught us to ask for daily bread and not a month's. He is not being casual. He is rationing the weight deliberately.",
    talk: "What tomorrow are you living in today?",
    pray: "Lord, we keep trying to live in a day you have not given us yet. Give us today's grace for today's trouble, and no more, and let that be enough. Teach us to ask for bread one day at a time.",
  },
  {
    read: { text: "Or who is there among you, who, if his son asks him for bread, will give him a stone? Or if he asks for a fish, who will give him a serpent? If you then, being evil, know how to give good gifts to your children, how much more will your Father who is in heaven give good things to those who ask him!", ref: "Matthew 7:9-11" },
    reflection:
      "Jesus argues from the worst version of a parent to the best version of God. You, being evil — and even you would not hand a hungry child a stone. Whatever instinct rises in you when you think about feeding this child, protecting them, giving them what they need: that instinct is a shadow, and God is the substance. Paul makes the same argument with everything at stake — he did not spare his own Son, so how will he not also, with him, freely give us all things?",
    talk: "What do you already want to give this child? What does that tell you about God?",
    pray: "Father, the love we feel for this child is a borrowed thing, and a small one next to yours. You did not spare your own Son for us. Give us what is good — not always what we asked for — and let us ask like children rather than like beggars.",
  },
  {
    read: { text: "but the very hairs of your head are all numbered. Therefore don’t be afraid. You are of more value than many sparrows.", ref: "Matthew 10:30-31" },
    reflection:
      "Look at who is being told this. Jesus is sending the twelve out and has just warned them they will be handed over, flogged in synagogues and hated by everyone. Then: the hairs of your head are numbered, do not be afraid. This is not comfort for an easy day. It is comfort for the day you are in trouble, and it works by scale — if his attention runs to hair count, nothing that is happening to you is beneath his notice. And the valuation is not sentimental. He named the price himself, later, and paid it.",
    talk: "What does that level of attention mean for this child?",
    pray: "Father, you count what nobody would bother counting. Steady us. We are more afraid than we let on, and this child has not even arrived. Do not let fear be the air they grow up breathing.",
  },
  {
    read: { text: "See that you don’t despise one of these little ones, for I tell you that in heaven their angels always see the face of my Father who is in heaven.", ref: "Matthew 18:10" },
    reflection:
      "The disciples had just asked who was greatest, and Jesus answered by standing a child in front of them. Then this warning, and it is a warning: do not look down on one of these. His reason is not that children are innocent — he has said nothing about that. It is that in heaven their angels always see the Father's face. Heaven's court is not indifferent to how a small person is treated in your kitchen. Every culture has its own way of treating children as an interruption to the real work. A Christian house has to decide, deliberately, not to.",
    talk: "Where does your culture despise children? How will this house be different?",
    pray: "Father, heaven takes our children seriously, and we do not always. Forgive the tone we use when we are tired. Make this a house where a small person is never an interruption to something more important.",
  },
  {
    read: { text: "But Jesus, when he heard the message spoken, immediately said to the ruler of the synagogue, “Don’t be afraid, only believe.”", ref: "Mark 5:36" },
    reflection:
      "The messengers have just arrived to say the girl is dead and there is no point troubling the teacher further. Jesus overhears and speaks past them to her father. Don't be afraid, only believe — and he does not tell Jairus the situation is less serious than he thinks. It is exactly as serious as he thinks. Jesus is not offering optimism; he is redirecting the man's eyes from the news to the person standing in front of him. Then he walks into the house and takes the dead child by the hand.",
    talk: "What is the worst news you fear? Where would you look if it came?",
    pray: "Lord Jesus, we are afraid of news that has not come. You never told anyone their fear was silly; you told them where to look. Turn our faces towards you, and keep us believing on the day we get told there is no point troubling you further.",
  },
  {
    read: { text: "He took a little child, and set him in the middle of them. Taking him in his arms, he said to them, “Whoever receives one such little child in my name, receives me, and whoever receives me, doesn’t receive me, but him who sent me.”", ref: "Mark 9:36-37" },
    reflection:
      "They had been arguing on the road about which of them was greatest, and they went quiet when he asked what they were discussing. His answer was to pick up a child. In that world a child had no standing at all — no rights, no voice, nothing to offer in return. Which is the point: welcome the one who can give you nothing back, and you have welcomed me, and not only me but the One who sent me. The chain runs all the way to the Father. Most of that welcoming looks like feeding and carrying and getting up again at three in the morning.",
    talk: "How does it change your night feeds to know you are receiving Christ?",
    pray: "Lord Jesus, you said that receiving a child is receiving you. We will forget that at two in the morning. Remind us. Let the unseen work of this house be done as though it were done for you, because you said it is.",
  },
  {
    read: { text: "But the angel said to him, “Don’t be afraid, Zacharias, because your request has been heard. Your wife, Elizabeth, will bear you a son, and you shall call his name John. You will have joy and gladness, and many will rejoice at his birth.”", ref: "Luke 1:13-14" },
    reflection:
      "Zechariah is an old man doing the one duty of a lifetime, and the angel's first words are: your prayer has been heard. Which prayer? He and Elizabeth had long since stopped expecting it — he argues with the angel and is struck dumb for it. The prayer had been heard for decades; it was simply not answered yet. God's silence had never been God's refusal. That gap between the asking and the answering is where most of the Christian life is actually lived, and this verse says what is happening in it.",
    talk: "What did you pray years ago that has not yet been answered?",
    pray: "Father, we have prayers we stopped mentioning because nothing came of them. You heard those too. Teach us the difference between a silence and a refusal, and give us Elizabeth's patience rather than Zechariah's argument.",
  },
  {
    read: { text: "Thus has the Lord done to me in the days in which he looked at me, to take away my reproach among men.", ref: "Luke 1:25" },
    reflection:
      "Elizabeth had carried childlessness in a society that read it as God's verdict on a woman. Reproach is the word she uses — not sadness, reproach, the thing other people said. And what she says God did is not merely that he acted but that he looked at her. Being seen came first. Hagar had said something similar in the desert centuries earlier: you are a God who sees me. Whatever anyone else had decided about Elizabeth, God had been looking the whole time, and what he did about it he did in his own hour.",
    talk: "What reproach have you carried? Who has seen it?",
    pray: "Lord, you see what people say about us and what we have believed about ourselves. Some of it we have carried for years. Look on this house and lift what is not true, and give us courage to wait for your hour rather than theirs.",
  },
  {
    read: { text: "When Elizabeth heard Mary’s greeting, the baby leaped in her womb; and Elizabeth was filled with the Holy Spirit. She called out with a loud voice and said, “Blessed are you among women, and blessed is the fruit of your womb!”", ref: "Luke 1:41-42" },
    reflection:
      "Two pregnant women meet, and the first person in the New Testament to recognise Jesus is an unborn child. John leaps, Elizabeth is filled with the Spirit, and the greeting comes out of her at a shout. Notice that neither woman had an easy pregnancy socially — one too old, one not yet married. What they had was each other and the Holy Spirit. This is what the circle around a pregnancy is for: not advice, but someone who sees what God is doing and says so out loud.",
    talk: "What have you noticed already from this child? What do you make of it?",
    pray: "Lord, you were at work in two wombs before anyone outside those houses knew anything. Bless the fruit of this one. And give us an Elizabeth — someone who will name what you are doing when we cannot see it ourselves.",
  },
  {
    read: { text: "All who heard them laid them up in their heart, saying, “What then will this child be?” The hand of the Lord was with him.", ref: "Luke 1:66" },
    reflection:
      "The whole hill country is talking. A mute priest has spoken, the baby has been named against family custom, and everyone is asking the same question: what then will this child be? Luke does not answer it. He writes one more line instead — the hand of the Lord was with him — and leaves the question open for thirty years. That is the right shape for the question you are asking about your own. You are not owed the answer now. What you are given is the better half: whose hand is on them.",
    talk: "What will this child be? Can you hold the question open?",
    pray: "Lord, we ask what this child will be and you have not told us. Let your hand be on them instead. That is more than an answer, and we will try to be content with it.",
  },
  {
    read: { text: "While they were there, the day had come for her to give birth. She gave birth to her firstborn son. She wrapped him in bands of cloth, and laid him in a feeding trough, because there was no room for them in the inn.", ref: "Luke 2:6-7" },
    reflection:
      "Luke gives it no drama at all. The days were fulfilled, she gave birth, she wrapped him, she laid him down — and the only explanation offered for the feeding trough is that there was no room. God did not arrange better conditions for his own Son. He did not delay the birth until something suitable came free. Whatever is inadequate about your circumstances, it does not disqualify what God intends to do in them. The most important night in human history happened to a young couple a long way from home with nowhere proper to put the baby.",
    talk: "What is inadequate about your circumstances? Does that disqualify anything?",
    pray: "Lord Jesus, you were laid in a feeding trough because there was no room. We have been measuring our circumstances and finding them wanting. Meet us in them. Do not wait until we are ready.",
  },
  {
    read: { text: "When the days of their purification according to the law of Moses were fulfilled, they brought him up to Jerusalem, to present him to the Lord (as it is written in the law of the Lord, “Every male who opens the womb shall be called holy to the Lord”), and to offer a sacrifice according to that which is said in the law of the Lord, “A pair of turtledoves, or two young pigeons.”", ref: "Luke 2:22-24" },
    reflection:
      "The law allowed a poor family to bring two birds instead of a lamb, and that is what Mary and Joseph brought. So here is the Lamb of God, carried into the temple by parents too poor to afford a lamb. It is an ordinary obedience — the duty every Jewish family did, done on the right day, with the cheaper offering. No one there knew what was happening except two old people who had been waiting. Most of what you will do for this child will look exactly this ordinary.",
    talk: "What ordinary act of devotion could you do for this child?",
    pray: "Father, we present this child to you, as Mary and Joseph did, with what we have and not with what we wish we had. Take the ordinary obediences of this house and do with them whatever you did with theirs.",
  },
  {
    read: { text: "The child was growing, and was becoming strong in spirit, being filled with wisdom, and the grace of God was upon him.", ref: "Luke 2:40" },
    reflection:
      "Luke lists four things and only one of them can be measured: the child grew. The other three — strong in spirit, filled with wisdom, the grace of God upon him — are invisible, and they are the ones the sentence is really about. He writes almost the same line again eleven verses later, after the temple, as though to say that this went on being true through the years nobody recorded. The things you will be able to chart about your child are not the things that will matter most about them.",
    talk: "Which kind of growth will be easiest to measure? Which matters most?",
    pray: "Lord, we will measure the weight and the height and the words, because we can. Grow what we cannot see. Make this child strong in spirit and full of wisdom, and let your favour rest on them through all the years nobody writes down.",
  },
  {
    read: { text: "Which of you fathers, if your son asks for bread, will give him a stone? Or if he asks for a fish, he won’t give him a snake instead of a fish, will he? Or if he asks for an egg, he won’t give him a scorpion, will he? If you then, being evil, know how to give good gifts to your children, how much more will your heavenly Father give the Holy Spirit to those who ask him?", ref: "Luke 11:11-13" },
    reflection:
      "Luke's version of this ends somewhere Matthew's does not. Matthew has the Father giving good things; Luke says the Holy Spirit. That is the good thing — not a better outcome, but God himself, given to people who ask. And the argument gets there by way of your own instincts: you would never hand a hungry child a scorpion, and you are not even good. You are about to learn that instinct from the inside, at three in the morning, for a person who cannot thank you.",
    talk: "What would you never do to this child? What does that say about God?",
    pray: "Father, the very best thing you give is yourself. Give us your Holy Spirit — not just help, not just an easier season. We ask as your children, which is what your Son has made us.",
  },
  {
    read: { text: "Aren’t five sparrows sold for two assaria coins? Not one of them is forgotten by God. But the very hairs of your head are all counted. Therefore don’t be afraid. You are of more value than many sparrows.", ref: "Luke 12:6-7" },
    reflection:
      "Sparrows were the cheapest thing in the market — five for two coins, and Matthew's version prices them two for one, which means the fifth bird was thrown in free. That is the one Jesus is pointing at. Not one of them is forgotten by God. He is speaking to disciples about to be dragged before authorities, and his argument is from the bottom up: if the throw-in bird is remembered, and the hairs on your head are counted, then nothing about you falls through. Forgettable is not a category God has.",
    talk: "What makes you feel forgettable?",
    pray: "Lord, not one sparrow falls outside your notice, not even the one nobody paid for. We feel small and often overlooked. Count us. And let this child grow up unable to imagine being forgotten by you.",
  },
  {
    read: { text: "Jesus summoned them, saying, “Allow the little children to come to me, and don’t hinder them, for God’s Kingdom belongs to such as these.”", ref: "Luke 18:16" },
    reflection:
      "All three gospels record this, and in all three it is the disciples who are the problem. They were not being cruel; they were protecting an important man's time from unimportant people. Jesus was indignant — Mark uses a hard word for it. Then he says the kingdom belongs to such as these, which is not praise of childhood innocence but of childhood emptiness: they come with nothing and expect to be received. That is the only way anyone comes. The hindering, then and now, is usually done by people who mean well.",
    talk: "What hinders children coming to Christ in a household? Be specific.",
    pray: "Lord Jesus, you were angry with the men who got between you and the children. Show us what we do in this house that would get in the way — our busyness, our tone, our distraction — and take it out of the road.",
  },
  {
    read: { text: "But as many as received him, to them he gave the right to become God’s children, to those who believe in his name: who were born not of blood, nor of the will of the flesh, nor of the will of man, but of God.", ref: "John 1:12-13" },
    reflection:
      "John has just said that his own people did not receive him. Then this: but as many as did, he gave the right to become God's children. Right, not reward — the word is about standing, not achievement. And he shuts every human door behind it. Not of blood: you cannot inherit it from us. Not of the will of the flesh or of man: no parent can decide it for a child. You can teach this child everything and you cannot give them this. God does it, or it is not done.",
    talk: "What is the difference between being born and being born again?",
    pray: "Father, we can give this child our name and our house and everything we know. We cannot give them the second birth. Give it to them yourself. Make them yours by the only means that works.",
  },
  {
    read: { text: "That which is born of the flesh is flesh. That which is born of the Spirit is spirit.", ref: "John 3:6" },
    reflection:
      "Nicodemus came at night, a teacher of Israel, and could not follow the argument — how can a man be born when he is old? Jesus does not simplify it. Flesh gives birth to flesh; only the Spirit gives birth to spirit, and the wind blows where it wishes. You are about to do the first birth, at real cost, and it is a genuine work. It is also not the last one that matters. Pray for the second with at least the seriousness you are bringing to the first.",
    talk: "Do you pray for this child's second birth? What would that prayer sound like?",
    pray: "Lord, we are preparing hard for one birth. We ask you for the other. Birth this child in the flesh, and then birth them again by your Spirit, in your own time and by your own doing.",
  },
  {
    read: { text: "All those whom the Father gives me will come to me. He who comes to me I will in no way throw out.", ref: "John 6:37" },
    reflection:
      "The crowd has just asked what work they must do, and Jesus has answered that the work is to believe. Then he says this, and the Greek doubles the negative: I will never, ever cast out. He puts it beside the Father's giving — all whom the Father gives will come — so the promise is bolted at both ends. Whatever you fear would disqualify this child, whatever failures you already know this household will have, the door is not the weak point. He turns nobody away who comes.",
    talk: "What do you fear would disqualify this child from Christ? What does this say?",
    pray: "Lord Jesus, we already know the ways we will fail this child. You have never yet cast out anyone who came to you. Bring them. And do not let our failures become the reason they stay away.",
  },
  {
    read: { text: "I will not leave you orphans. I will come to you.", ref: "John 14:18" },
    reflection:
      "He says this in the upper room, hours before he is arrested, to men who are about to lose him. The word is orphans — he chooses the language of children left with nobody. And the promise is not that he will send help; it is I will come to you, which in the next breath he explains as the Spirit who will be in them. The Son who was himself abandoned on Friday so that we would not be is the one making it. Fatherlessness is not the last word over any house.",
    talk: "Have you ever felt abandoned by God? What does this promise say?",
    pray: "Lord Jesus, you promised not to leave your people as orphans, and you kept it at a cost we cannot measure. Come to us. And wherever this child goes, and whatever happens to us, let them never be without the Father.",
  },
  {
    read: { text: "A woman, when she gives birth, has sorrow because her time has come. But when she has delivered the child, she doesn’t remember the anguish any more, for the joy that a human being is born into the world.", ref: "John 16:21" },
    reflection:
      "Of every image available to him on that last night, this is the one Jesus chose for what was about to happen to him and to them. Not a storm. Not a battle. A woman in labour — sorrow because the hour has come, and then joy that swallows the memory of it. He is saying something about the cross and something about the world at once: the pain is real, it is not pointless, and it is going somewhere. A woman about to give birth is the closest picture he had to the resurrection.",
    talk: "How does it feel that Christ chose childbirth as his picture of coming joy?",
    pray: "Lord Jesus, you took a labouring woman as your picture of coming joy. That is a strange comfort and we will take it. Carry her through the hour. And let whatever else this family suffers be labour and not ruin.",
  },
  {
    read: { text: "For the promise is to you, and to your children, and to all who are far off, even as many as the Lord our God will call to himself.", ref: "Acts 2:39" },
    reflection:
      "Peter is preaching to a crowd that has just been cut to the heart, and he tells them to repent and be baptised. Then he widens it: the promise is for you, and your children, and all who are far off. Three circles, and the last one is the Gentiles, which is why any of us are here. But notice he does not leave children to be mentioned by implication. He names them in the sentence, on the first day of the church. Your child is not outside the reach of what was promised at Pentecost.",
    talk: "What promise of God do you most want for this child?",
    pray: "Lord, the promise was named for us and for our children on the very first day. We hold you to it. Call this child to yourself, and let them hear it as an invitation rather than an inheritance.",
  },
  {
    read: { text: "He made from one blood every nation of men to dwell on all the surface of the earth, having determined appointed seasons, and the boundaries of their dwellings,", ref: "Acts 17:26" },
    reflection:
      "Paul is standing in Athens surrounded by people who thought their city was the centre of the world, and he tells them that every nation came from one man, and that God appointed the times and the borders. He gives the reason in the next verse: so that they might seek him and find him, though he is not far from any one of us. So the when and where are not accidents of biology or politics. This child's century, country, language and family were set by someone with an aim in mind.",
    talk: "Does it change anything that this child's time and place are chosen?",
    pray: "Lord, you set the times and the boundaries, and you did it so that people would look for you and find you. Thank you for this one — this year, this house, these parents. Let the place you have put them be the place they find you.",
  },
  {
    read: { text: "Without being weakened in faith, he didn’t consider his own body, already having been worn out, (he being about a hundred years old), and the deadness of Sarah’s womb. Yet, looking to the promise of God, he didn’t waver through unbelief, but grew strong through faith, giving glory to God, and being fully assured that what he had promised, he was also able to perform.", ref: "Romans 4:19-21" },
    reflection:
      "Paul is careful about a thing people get wrong. Abraham did not look away from the facts — the text says he considered his own body, as good as dead, and Sarah's womb likewise. He looked straight at it. Faith here is not refusing to see; it is seeing clearly and then looking at something else as well, namely the One who made the promise. And what grew was not his optimism but his certainty about God's ability to do what he said. Scan results, test numbers, doctors' words: look at them honestly, then look up.",
    talk: "What facts are you facing? Is faith denial, or something else?",
    pray: "Lord, we are not pretending things are other than they are. Give us Abraham's kind of faith — the sort that faces the facts squarely and is still fully persuaded that what you have promised, you are able to do.",
  },
  {
    read: { text: "But if the Spirit of him who raised up Jesus from the dead dwells in you, he who raised up Christ Jesus from the dead will also give life to your mortal bodies through his Spirit who dwells in you.", ref: "Romans 8:11" },
    reflection:
      "Paul is in the middle of the heaviest chapter in his letters, and he reaches for the resurrection to talk about ordinary bodies. The Spirit who raised Jesus out of a tomb is the same Spirit living in you, and Paul's conclusion is that he will give life to your mortal body — this one, the tired one, not only the one to come. That is a startling amount of power to apply to a woman who cannot get up the stairs. But he means it, and he does not apologise for the scale of it.",
    talk: "What does your body need? Have you asked for the Spirit's help with it?",
    pray: "Father, the Spirit who raised your Son from the dead lives in us, and we are exhausted. Give life to these mortal bodies. We are not asking for something small, and we will not pretend we are.",
  },
  {
    read: { text: "rejoicing in hope; enduring in troubles; continuing steadfastly in prayer;", ref: "Romans 12:12" },
    reflection:
      "Three imperatives in a single breath, and each one cuts against the grain. Rejoice in hope, which means the joy is fastened to something not yet visible. Endure in trouble, which assumes the trouble stays. Continue steadfastly in prayer, where the word means to hold on stubbornly, like someone keeping a seat. None of these are moods you wait to feel. They are things a household does, on the days it feels like none of them, because they are commanded and because grace comes through the doing.",
    talk: "Which of the three is hardest today?",
    pray: "Lord, we do not feel joyful or patient or prayerful tonight, and you have commanded all three anyway. Give what you require. Let this house go on doing these things on the days our hearts are not in it.",
  },
  {
    read: { text: "Now the God of perseverance and of encouragement grant you to be of the same mind with one another according to Christ Jesus,", ref: "Romans 15:5" },
    reflection:
      "Paul has just spent a chapter on a congregation arguing about food and days, and pleading with the strong to bear with the weak. Then he prays — and notice he does not tell them to try harder at harmony. He names God as the source: the God of endurance and encouragement grant you. Patience with each other is not a resource the two of you generate between you. It runs out, usually around the fourth broken night. It is asked for. And the pattern given is according to Christ Jesus, who bore with us first.",
    talk: "Where has patience run out between you? Ask its source for more.",
    pray: "God of endurance and encouragement, we have run out with each other more than once this week. We are not asking for more effort; we are asking you for what we do not have. Give us one mind, after the pattern of your Son.",
  },
  {
    read: { text: "God is faithful, through whom you were called into the fellowship of his Son, Jesus Christ, our Lord.", ref: "1 Corinthians 1:9" },
    reflection:
      "This is the ninth verse of a letter about to tear into a church for division, immorality and chaos at the Lord's table. Paul opens it by telling them God is faithful. Not they are doing well — God is faithful, and he called you into fellowship with his Son. Faithfulness is stated here as a fact about God's character, before a word of correction, and independent of how the Corinthians are performing. When circumstances are hard, God's faithfulness is not a reading you take off them. It is a fact you stand on while taking them.",
    talk: "What does God's faithfulness look like when circumstances are hard?",
    pray: "Lord, you are faithful — not because this season feels like it, but because that is what you are. You called us into fellowship with your Son and you will keep us there. Hold this house when our grip is poor.",
  },
  {
    read: { text: "No temptation has taken you except what is common to man. God is faithful, who will not allow you to be tempted above what you are able, but will with the temptation also make the way of escape, that you may be able to endure it.", ref: "1 Corinthians 10:13" },
    reflection:
      "Paul has just listed Israel's disasters in the wilderness and said they were written down as warnings. Then this, and read what it actually promises. Not that the pressure will be removed. Not that you will never be tempted beyond what feels bearable. It promises that God is faithful, that the limit is set by him, and that there will be a way out — which means there is something to look for and take, rather than simply endure. Exhaustion makes every exit invisible. Ask him to show you the one that is there.",
    talk: "Where do you feel at your limit? Is there an exit you have not taken?",
    pray: "Father, we are closer to our limit than we admit. You promised a way out, not the absence of pressure. Show it to us — and give us the honesty to take it when you do, instead of calling endurance a virtue.",
  },
  {
    read: { text: "When I was a child, I spoke as a child, I felt as a child, I thought as a child. Now that I have become a man, I have put away childish things.", ref: "1 Corinthians 13:11" },
    reflection:
      "This sits in the middle of the love chapter, and Paul's point is about the age to come — now we see in a mirror dimly, then face to face. But he gets there by treating childhood as a stage, not a defect: the child spoke and thought and reasoned as a child, and there was nothing wrong with that. Each thing in its season. A great deal of the impatience that visits Christian homes comes from wanting a four-year-old to behave like a forty-year-old, and calling the wish discipleship.",
    talk: "How will you let this child be a child, without rushing them?",
    pray: "Lord, you were a child yourself, and grew in wisdom and stature, and nobody hurried you. Let this child be a child. Save us from rushing them towards a maturity only you can give, and in your own time.",
  },
  {
    read: { text: "Yes, we ourselves have had the sentence of death within ourselves, that we should not trust in ourselves, but in God who raises the dead, who delivered us out of so great a death, and does deliver; on whom we have set our hope that he will also still deliver us;", ref: "2 Corinthians 1:9-10" },
    reflection:
      "Paul is describing being so crushed in Asia that he despaired of life itself — and then tells us why God let it go that far: so that we would not rely on ourselves but on God who raises the dead. That is the only comfort he offers for it. And then three tenses in a row, which is the whole architecture of hope: he delivered us, he does deliver, and on him we have set our hope that he will deliver us again. Yesterday's rescue is the evidence you carry into tomorrow.",
    talk: "What has God already delivered you from? Does it fund your hope now?",
    pray: "Lord, you have brought us out before. We are counting the times tonight rather than the fears. You delivered, you are delivering, and you will deliver — and it is on you and not on ourselves that we have set our hope.",
  },
  {
    read: { text: "Therefore I take pleasure in weaknesses, in injuries, in necessities, in persecutions, and in distresses, for Christ’s sake. For when I am weak, then am I strong.", ref: "2 Corinthians 12:10" },
    reflection:
      "Remember what this man had asked for. Three times he begged God to take the thorn away, and three times the answer was no — my grace is sufficient for you, my power is made perfect in weakness. This verse is what Paul says afterwards. It is not a theory about suffering written by a comfortable man; it is the settled position of somebody whose prayer was refused and who found the refusal was a gift. The strength is not yours becoming greater. It is Christ's resting on you where you are least able.",
    talk: "Where are you weakest right now? What is offered there?",
    pray: "Lord, we have asked you to take things away and you have not. Let your power rest where we are weakest. We would rather have your strength in our weakness than our own strength without you — help us mean that.",
  },
  {
    read: { text: "My little children, of whom I am again in travail until Christ is formed in you—", ref: "Galatians 4:19" },
    reflection:
      "Paul is furious with the Galatians and frightened for them, and the tenderest line in the letter comes out of it: my little children, I am in labour for you again. He borrows a mother's pain to describe what it costs to see Christ formed in someone. Not taught to them — formed in them, the way a body is formed, slowly and invisibly and by someone else's expense. You are about to learn the first kind of labour. The second kind lasts considerably longer and nobody hands you the baby at the end.",
    talk: "What does it cost to form Christ in a child? Are you ready for that?",
    pray: "Lord, form Christ in this child. We do not know yet what that will cost us in years and prayers and patience. Let us not resent the price when it comes.",
  },
  {
    read: { text: "having predestined us for adoption as children through Jesus Christ to himself, according to the good pleasure of his desire,", ref: "Ephesians 1:5" },
    reflection:
      "Roman adoption was a legal act that made a chosen heir as fully a son as one born in the house — with the family name, the inheritance, the lot. Paul says God did that for us, through Jesus Christ, and then adds the reason: according to the good pleasure of his will. Not because it was needed. Not reluctantly. Because he wanted to. Everything you are about to feel for this child — the wanting, before they have done anything — is a small picture of what God felt when he chose you.",
    talk: "How does it feel that God's adoption of you was his pleasure?",
    pray: "Father, you adopted us because it pleased you to, not because we were owed it. Let that go deeper in us than it has. And make this house a place where a child is wanted before they have earned anything.",
  },
  {
    read: { text: "Now to him who is able to do exceedingly abundantly above all that we ask or think, according to the power that works in us,", ref: "Ephesians 3:20" },
    reflection:
      "This is the end of a prayer that had already asked outrageous things — that they would know a love that surpasses knowledge and be filled with all the fullness of God. And Paul finishes by saying God can do more than that. More than we ask, and more than we can imagine asking. Then he grounds it somewhere unexpected: according to the power that works in us, which is the same power he has already said raised Christ from the dead. Your small requests are not straining the supply.",
    talk: "What are you afraid to ask for?",
    pray: "Father, you can do more than we know how to ask for. We have been praying small because we were afraid of disappointment. Enlarge what we ask, and do whatever is beyond it, by the power already at work in us.",
  },
  {
    read: { text: "being confident of this very thing, that he who began a good work in you will complete it until the day of Jesus Christ.", ref: "Philippians 1:6" },
    reflection:
      "Paul writes this from prison, to a church he may never see again, and the confidence is not in them. He who began a good work will complete it. God began it; God finishes it; the day of Jesus Christ is the deadline and it is not moveable. Which means the unfinished thing in you is not evidence against you — it is evidence that the work is still running. The same applies to the child you are about to raise imperfectly. Neither of you is the one responsible for completing it.",
    talk: "What unfinished thing in you worries you? Who is committed to completing it?",
    pray: "Lord, we are unfinished and we know it, and we are about to raise someone while we still are. You began this work and you have promised to complete it. Keep going. Do not let our failures be the last word on what you started.",
  },
  {
    read: { text: "In nothing be anxious, but in everything, by prayer and petition with thanksgiving, let your requests be made known to God. And the peace of God, which surpasses all understanding, will guard your hearts and your thoughts in Christ Jesus.", ref: "Philippians 4:6-7" },
    reflection:
      "Two things are easy to miss here. First, with thanksgiving — Paul slips it in so quietly, and it is the hinge; anxiety and gratitude cannot easily occupy the same sentence. Second, what is promised is not that you will understand. The peace surpasses understanding, which means it arrives before the explanation does and often without one. And the word guard is a military one: a garrison posted around your heart and thoughts, in Christ Jesus. Not a feeling. A sentry.",
    talk: "What anxiety could become a request tonight?",
    pray: "Father, here is what we are anxious about, said plainly and out loud — and here is what we are thankful for, said alongside it. We are not asking to understand. Post your peace around our hearts tonight, in Christ Jesus.",
  },
  {
    read: { text: "And let the peace of God rule in your hearts, to which also you were called in one body, and be thankful.", ref: "Colossians 3:15" },
    reflection:
      "The word Paul uses for rule is the one for an umpire — the official who decides and whose decision stands. So let the peace of Christ be the umpire in your heart: when two impulses are shouting, it settles the call. And notice he says you were called to it in one body, which is to say this is not private serenity. It is peace between people who have to live together. He ends the sentence with be thankful, and for the third time in four verses, because he knows how quickly a household forgets.",
    talk: "What is ruling your heart right now — peace or something else?",
    pray: "Lord, let your peace be the thing that settles arguments in this house rather than whoever is more tired or more right. Rule us. And make us thankful people, because we forget by Tuesday what you did on Sunday.",
  },
  {
    read: { text: "But we were gentle among you, like a nursing mother cherishes her own children.", ref: "1 Thessalonians 2:7" },
    reflection:
      "Paul is defending himself against people saying he was in it for the money and the status, and the picture he chooses is a nursing mother — literally, one who warms her own children against herself. He was an apostle with every right to throw his weight around, and the proof he offers that his ministry was genuine is that he was gentle. Strength that has to be demonstrated is usually insecurity. Strength that can afford to be tender has nothing to prove. That is the strength this house will need at four in the morning.",
    talk: "Where do you mistake gentleness for weakness?",
    pray: "Lord, make us gentle — and let us count that as strength and not as giving in. Where we want to be obeyed quickly, give us patience instead. Teach us the tenderness Paul was not ashamed of.",
  },
  {
    read: { text: "Therefore exhort one another, and build each other up, even as you also do.", ref: "1 Thessalonians 5:11" },
    reflection:
      "The phrase at the end matters: even as you also do. They were already doing it; Paul tells them to keep going. Encouragement is not a crisis intervention, it is maintenance — the thing you do when nothing is wrong, so that the structure holds when something is. The word is to build up, an image from masonry, one course at a time. A marriage in a hard season rarely collapses from one blow. It gets quiet, and nobody lays anything new, and one day there is nothing there.",
    talk: "Say one specific true encouraging thing to each other now.",
    pray: "Lord, make us builders of each other rather than assessors of each other. Give us something true and specific to say tonight, and the humility to say it out loud rather than assume it is known.",
  },
  {
    read: { text: "having been reminded of the sincere faith that is in you, which lived first in your grandmother Lois, and your mother Eunice, and, I am persuaded, in you also.", ref: "2 Timothy 1:5" },
    reflection:
      "Paul names the two women and does not name a father, and elsewhere we learn Timothy's was a Greek who evidently did not share this. So the faith travelled down a line that was, by the standards of the day, not the official one — a grandmother, a mother, a boy who knew the Scriptures from infancy. Paul calls it sincere, meaning unhypocritical, the kind with nothing performed about it. That is what carries. Not a household's reputation but whether the faith in it is real when nobody is watching.",
    talk: "Whose faith did you receive? Who will receive yours?",
    pray: "Lord, let the faith in this house be the unhypocritical kind — the same on Tuesday as on Sunday. Let it live here, and let it pass to this child, and to children we will never meet.",
  },
  {
    read: { text: "Let’s therefore draw near with boldness to the throne of grace, that we may receive mercy and may find grace for help in time of need.", ref: "Hebrews 4:16" },
    reflection:
      "Hebrews has just said we have a high priest who was tempted in every way as we are, yet without sin. Therefore — and the therefore carries the whole weight — draw near with boldness. Not with confidence in ourselves; boldness because of who sits on the throne and who stands beside it. It is called a throne of grace, which is a strange pairing until you know how it was made one. And notice what you find there: mercy for what is past, grace for the need that is arriving.",
    talk: "Do you come to God boldly or apologetically? Why?",
    pray: "Father, we come without apologising, because your Son has made the throne a throne of grace. Give us mercy for what is behind us and grace for what is coming. We are going to need help at the exact time it is needed.",
  },
  {
    read: { text: "By faith, even Sarah herself received power to conceive, and she bore a child when she was past age, since she counted him faithful who had promised.", ref: "Hebrews 11:11" },
    reflection:
      "This is the woman who laughed behind the tent flap and then denied it. Hebrews puts her in the roll of faith anyway, and says she considered him faithful who had promised. Both things are true of her and the Bible does not tidy it. Her laugh did not disqualify her; God's faithfulness was never resting on the quality of her belief. If you have laughed at a promise, or prayed for something while privately expecting nothing, you are in older company than you think, and it is listed under faith.",
    talk: "Have you laughed at a promise? Does that disqualify you?",
    pray: "Lord, we have doubted you in ways we have not said out loud, and some of it was close to laughter. Count us faithful anyway, as you counted Sarah. You are the one who promised, and you are the one who keeps it.",
  },
  {
    read: { text: "Be free from the love of money, content with such things as you have, for he has said, “I will in no way leave you, neither will I in any way forsake you.” So that with good courage we say, “The Lord is my helper. I will not fear. What can man do to me?”", ref: "Hebrews 13:5-6" },
    reflection:
      "The promise is old — God said it to Joshua at the Jordan, and to Israel before that — and Hebrews drops it into a paragraph about money. Be content with what you have, because he has said this. The Greek piles up negatives to the point of clumsiness: never, no never, will I leave you. And then the conclusion is boldness, not resignation. A family bracing for the cost of a child, counting what they do not have, is exactly who this was written for. What can be taken from you is not the thing you are actually standing on.",
    talk: "What are you afraid of losing? What can never be lost?",
    pray: "Lord, we are counting what we do not have, and it frightens us more than we say. You have promised never to leave us. Make us content, and make us brave — you are our helper, and that is enough to go on.",
  },
  {
    read: { text: "But if any of you lacks wisdom, let him ask of God, who gives to all liberally and without reproach, and it will be given to him.", ref: "James 1:5" },
    reflection:
      "James has just told them to count trials as joy, which is preposterous advice unless you have something they lack — and he knows they lack it, so the very next sentence is: ask. Two things about the giving. Liberally, without holding back. And without reproach, which means without the look. God does not sigh when you come back with the same question a fourth time. New parents lack wisdom by definition; there is no version of this you will already know how to do.",
    talk: "What do you not know how to do? Have you asked God about it?",
    pray: "Father, we do not know what we are doing, and we are embarrassed by how often we have to ask. You give without making anyone feel foolish for asking. Give us wisdom for this week — and the honesty to ask again next week.",
  },
  {
    read: { text: "Wherein you greatly rejoice, though now for a little while, if need be, you have been grieved in various trials, that the proof of your faith, which is more precious than gold that perishes even though it is tested by fire, may be found to result in praise, glory, and honor at the revelation of Jesus Christ—", ref: "1 Peter 1:6-7" },
    reflection:
      "Peter puts them in one sentence and does not apologise for it: you greatly rejoice, and you have been grieved. Both, now, at once. He is writing to exiles under real pressure and he does not ask them to pick one. Notice the three qualifications he adds to the grief — for a little while, if need be, in various trials — none of which make it hurt less, all of which say it is bounded and purposed. What comes out is not toughness but proof: faith tried by fire, and found genuine on the day Christ appears.",
    talk: "Can you grieve and rejoice at the same time? Is that dishonest, or biblical?",
    pray: "Lord, we are glad and we are grieving in the same week, and we have wondered whether one of them is dishonest. Neither is. Refine what is real in us through both, and let it be found genuine on the day we see your Son.",
  },
  {
    read: { text: "casting all your worries on him, because he cares for you.", ref: "1 Peter 5:7" },
    reflection:
      "Peter writes this straight after telling them to humble themselves under God's mighty hand — and the two belong together. Handing over your worry is an act of humility, because keeping it is usually a way of staying in charge. The word is throw, not place. And the reason given is not that anxiety is unproductive, which is true and useless. The reason is that he cares for you. There is always one worry we keep back, and it is generally the one we have not really believed he cares about.",
    talk: "Which worry have you not cast? Why that one?",
    pray: "Father, there is one thing we have not handed over, and you know which one. We have been holding it because letting go feels like not caring. Take it. You care for us — for this house, for this child, for the thing we have not named.",
  },
  {
    read: { text: "There is no fear in love; but perfect love casts out fear, because fear has punishment. He who fears is not made perfect in love.", ref: "1 John 4:18" },
    reflection:
      "John is not talking about nerves. Read the line before: we may have boldness on the day of judgement, because as he is, so are we in this world. The fear being cast out is fear of punishment — the suspicion that God is finally against you. Perfect love drives it out, and the love in question is not yours; two verses earlier he defined it as God sending his Son as the atoning sacrifice for our sins. Fear of God's verdict and confidence in God's Son cannot occupy the same room.",
    talk: "What fear is largest right now? What love could displace it?",
    pray: "Father, underneath the ordinary fears is an older one — that you are not really for us. Your Son settled that. Cast out what his cross has already answered, and let this child grow up in a house that is not afraid of you.",
  },
  {
    read: { text: "He who sits on the throne said, “Behold, I am making all things new.” He said, “Write, for these words of God are faithful and true.”", ref: "Revelation 21:5" },
    reflection:
      "It is the only time in Revelation that the One on the throne speaks directly, and this is what he says. Not all new things — all things new. The distinction is everything: nothing is scrapped and replaced, it is restored. Bodies, memories, the years a season cost you, the griefs you assumed were simply lost. And then he tells John to write it down, because these words are faithful and true — as though he knew we would need it in writing on the days it seems least likely.",
    talk: "What do you most want made new?",
    pray: "Lord, you are making all things new, and you had it written down because you knew we would doubt it. We are waiting for that day. Until it comes, hold what this season has cost us; you have promised none of it is wasted.",
  },
  {
    read: { text: "The man knew Eve his wife. She conceived, and gave birth to Cain, and said, “I have gotten a man with the LORD’s help.”", ref: "Genesis 4:1" },
    reflection:
      "This is the first birth outside Eden, to the woman who had just lost it, and the first words out of her mouth are about God. I have gotten a man with the LORD's help. The curse had fallen, the gate was shut, pain in childbearing had been named — and she still credited him. Whatever she meant by it, and Cain's later story is a hard one, the instinct was right. Children are not produced; they are given, and they are given outside Eden too.",
    talk: "Who do you credit for this child? Does it show in how you speak about it?",
    pray: "Lord, this child comes from you and not from us, and we want that to show in how we speak about them — to family, to friends, to the child themselves. With your help we have this life. Thank you.",
  },
  {
    read: { text: "This is the book of the generations of Adam. In the day that God created man, he made him in God’s likeness. He created them male and female, and blessed them. On the day they were created, he named them Adam.", ref: "Genesis 5:1-2" },
    reflection:
      "Moses opens the genealogy of a fallen race by going back to the beginning: made in God's likeness, male and female, and blessed. Blessed on the day they were created, before a single thing had been done. Then the chapter that follows is a long list of men who lived and died. The likeness and the blessing are stated first, and they are stated about everyone on the list. Nothing this child ever achieves will add to what was true of them on the day they were made.",
    talk: "What does this child have to do to be valuable? Nothing — why is that hard to feel?",
    pray: "Lord, you made and blessed people before they had done anything at all. We know that and we do not feel it. Let this child never have to earn their place in this house — and let us stop trying to earn ours with you.",
  },
  {
    read: { text: "the LORD brought him outside, and said, “Look now toward the sky, and count the stars, if you are able to count them.” He said to Abram, “So your offspring will be.”", ref: "Genesis 15:5" },
    reflection:
      "Abram has just complained, bluntly, that God has given him nothing and his heir is a servant. God does not rebuke him. He takes him outside. There is no argument offered, no timetable, just a sky he could not count and a promise attached to it. And then Moses writes the sentence Paul will build a whole doctrine on: he believed the LORD, and it was credited to him as righteousness. The night sky has not changed since. It is still the cheapest cure for a small view of God.",
    talk: "When did you last look up? What does the sky say to you about God?",
    pray: "Lord, you took a childless man outside and showed him the stars rather than explaining yourself. We have not looked up in a long time. You count the stars and the generations; we trust you with ours.",
  },
  {
    read: { text: "Abraham called the name of that place “the LORD Will Provide”. As it is said to this day, “On the LORD’s mountain, it will be provided.”", ref: "Genesis 22:14" },
    reflection:
      "Abraham names the place after what happened, and the phrase he uses is future tense — the LORD will provide — as though the thing he learned that morning was a rule and not an incident. The ram was in the thicket the whole time; he simply could not see it until the knife was raised. Centuries later another Son carried the wood up a hill outside the same city, and that time there was no ram, because he was the ram. On the mountain of the LORD it was provided.",
    talk: "What has God provided at the last moment? Have you named it?",
    pray: "Lord, you have provided late and you have provided exactly on time, and we have often mistaken the one for the other. Give us the eyes to name it when it comes — and thank you for the Son you did not spare.",
  },
  {
    read: { text: "Jacob awakened out of his sleep, and he said, “Surely the LORD is in this place, and I didn’t know it.”", ref: "Genesis 28:16" },
    reflection:
      "Jacob is running away with a stolen blessing and a brother who wants him dead, sleeping rough on a stone. He has not repented of anything. And God meets him there with a ladder and a promise — and Jacob's first waking thought is that God had been in this place all along and he had no idea. Some of God's presence is only recognised in the rear-view mirror. That does not make it less real while you are asleep on the stone.",
    talk: "Where might God be present that you have not noticed?",
    pray: "Lord, you were present in places we thought we were alone, and we did not know it at the time. Surely you are in this house. Open our eyes to see it now rather than only years from now.",
  },
  {
    read: { text: "He said, “If you will diligently listen to the LORD your God’s voice, and will do that which is right in his eyes, and will pay attention to his commandments, and keep all his statutes, I will put none of the diseases on you, which I have put on the Egyptians; for I am the LORD who heals you.”", ref: "Exodus 15:26" },
    reflection:
      "Three days out of the Red Sea and they have no water, and what they find is bitter. God makes it sweet, and then gives himself a name over it: I am the LORD who heals you. Not I have a remedy — I am the one. The Hebrew is Yahweh Rapha, and it is said to a people who would still get sick and still die. Medicine is not a rival to this. Whatever the tablets and the surgeons do, they do it downstream of the one who names himself Healer.",
    talk: "How do you hold together medicine and prayer?",
    pray: "Lord, you call yourself our healer, and we are grateful for every doctor and every medicine you have put in reach. Stand behind them. Heal us as you see fit, and let us thank you rather than only them.",
  },
  {
    read: { text: "You shall serve the LORD your God, and he will bless your bread and your water, and I will take sickness away from among you. No one will miscarry or be barren in your land. I will fulfill the number of your days.", ref: "Exodus 23:25-26" },
    reflection:
      "Read this carefully, because it has been misused to wound people. It is covenant language, spoken to a nation entering a land, tied to their national obedience — and Israel's own history shows the promise was neither automatic nor individual. The Bible does not offer a contract by which the right faith guarantees a healthy baby. What it does offer is a God who gives life, who is genuinely willing to be asked, and who never once told a grieving mother that she had failed to qualify.",
    talk: "Why does it matter to read this promise in its context?",
    pray: "Lord, you are the giver of life, and we are asking you plainly for this one. We do not presume, and we will not treat your word as a contract. Whatever comes, keep us from thinking your love is something we have earned or lost.",
  },
  {
    read: { text: "God is not a man, that he should lie, nor a son of man, that he should repent. Has he said, and will he not do it? Or has he spoken, and will he not make it good?", ref: "Numbers 23:19" },
    reflection:
      "The mouth these words come out of belonged to a hired prophet, brought in by a king to curse Israel, who could not make the curse come. That is the joke of the passage: God's reliability proved by a man paid to say the opposite. Two questions, and both expect the answer no. God does not say a thing and then think better of it. Whatever it is you are struggling to believe he will do, the difficulty is not on his end.",
    talk: "What has God said that you struggle to believe he will do?",
    pray: "Lord, you are not a man that you should lie, and you do not change your mind about what you have promised. There are things you have said that we find hard to hold on to. We are standing on your word rather than on our grip of it.",
  },
  {
    read: { text: "About Benjamin he said, “The beloved of the LORD will dwell in safety by him. He covers him all day long. He dwells between his shoulders.”", ref: "Deuteronomy 33:12" },
    reflection:
      "This is Moses' last act — blessing the tribes before he climbs the mountain to die. To Benjamin, the youngest, the little brother, he gives this: the beloved of the LORD dwells in safety, covered all day long, and the last phrase is best read as being carried on his shoulders, the way a father carries a child who cannot walk any further. Not visited occasionally. Carried, all day, by someone who does not put you down when the road gets long.",
    talk: "What would it mean to be carried on God's shoulders through today?",
    pray: "Lord, carry us today — we are further past our strength than we look. Shield this house all day long, and let this child grow up on your shoulders, knowing they were never expected to walk it alone.",
  },
  {
    read: { text: "There is no one as holy as the LORD, for there is no one besides you, nor is there any rock like our God.", ref: "1 Samuel 2:2" },
    reflection:
      "Hannah has just handed over the son she begged for. She prayed until Eli thought she was drunk, she got what she asked for, and now she has walked him to Shiloh and left him there. And her song is not about the boy at all. It is about God — holy, unrivalled, a rock. When God answers a prayer, the gift is the easiest thing in the world to worship instead of him. Hannah gives the gift back and sings about the Giver.",
    talk: "When God gives you what you asked for, what do you praise — the gift or the giver?",
    pray: "Lord, there is no rock like you. Keep our love for this child from becoming the thing we actually worship. You are what we wanted before we knew to ask — let us praise you and not only your gifts.",
  },
  {
    read: { text: "From the lips of babes and infants you have established strength, because of your adversaries, that you might silence the enemy and the avenger.", ref: "Psalm 8:2" },
    reflection:
      "David is looking at the stars and asking what a human being amounts to. Then this, and it is strange: strength established out of the mouths of infants, to silence the enemy. God's chosen instrument against the loudest opposition is the smallest voice in the room. Jesus quoted it in the temple, the week he died, when the priests objected to children shouting his praise — and he did not soften it. Out of the mouths of infants. Your household is about to acquire one.",
    talk: "What could a baby teach a household about God?",
    pray: "Lord, you silence enemies with the voices of children, which is not how anyone would have arranged it. Let this house learn from the smallest person in it. Out of the mouths of infants you have established strength.",
  },
  {
    read: { text: "Keep me as the apple of your eye. Hide me under the shadow of your wings,", ref: "Psalm 17:8" },
    reflection:
      "The Hebrew behind apple of your eye is literally the little man of the eye — the tiny reflection you see of yourself in someone else's pupil. It is the most protected part of the body, the thing you shield without deciding to. And then a second picture straight after, from a different world: a bird covering what is underneath her. David asks for both, plainly, in a psalm where enemies are closing in. Tenderness and protection are the same thing here.",
    talk: "Which image speaks to you more — the eye, or the wings?",
    pray: "Lord, keep us as the apple of your eye — guarded the way a person guards their own sight, without having to think about it. Hide this house under the shadow of your wings. We are asking plainly, as David did.",
  },
  {
    read: { text: "the LORD will give strength to his people. the LORD will bless his people with peace.", ref: "Psalm 29:11" },
    reflection:
      "Read the whole psalm and this last line lands differently. Seven times the voice of the LORD breaks cedars, shakes the wilderness, strips the forests bare — an unmistakably violent psalm. And it ends with him handing strength and peace to his people. The same voice that shakes the desert speaks peace over a household. The power is not in tension with the tenderness; the tenderness is what the power is for.",
    talk: "Do you need strength or peace more today?",
    pray: "Lord, your voice shakes wildernesses and you use it to bless your people with peace. Give us strength for what we cannot do, and peace for what we cannot control. Both, please. We need both this week.",
  },
  {
    read: { text: "the LORD’s angel encamps around those who fear him, and delivers them.", ref: "Psalm 34:7" },
    reflection:
      "Encamps is a military word — a whole army settling in around a position and staying there. It is not a sentry passing by. David wrote this after escaping a king who wanted him dead by pretending to be insane, which is not a dignified rescue, and he concluded that he had been surrounded the entire time by something he could not see. Elisha's servant had the same discovery on a hillside: the mountain full of horses and chariots of fire, visible only once his eyes were opened.",
    talk: "What are you afraid is unprotected right now?",
    pray: "Lord, encamp around this house — around the room this child will sleep in, around the roads we drive, around the things we are afraid are unguarded. We cannot see it. Open our eyes if it helps, and guard us either way.",
  },
  {
    read: { text: "For you are my hope, Lord the LORD, my confidence from my youth. I have relied on you from the womb. You are he who took me out of my mother’s womb. I will always praise you.", ref: "Psalm 71:5-6" },
    reflection:
      "This is an old man's psalm — a few verses on he asks God not to cast him off when his strength is gone. And what he reaches back for is not a conversion story he can date but something further back than memory: you took me out of my womb. He is claiming a relationship that began before he could contribute to it. That is the ground under a Christian childhood. Not that the child chose early, but that God was at work before there was anything to choose with.",
    talk: "How far back does your trust in God go? What formed it?",
    pray: "Lord, you have been our hope since before we could remember, and we did nothing to begin it. Be this child's hope the same way — from the womb, long before they can tell anyone about it.",
  },
  {
    read: { text: "that the generation to come might know, even the children who should be born; who should arise and tell their children, that they might set their hope in God, and not forget God’s deeds, but keep his commandments,", ref: "Psalm 78:6-7" },
    reflection:
      "Count the generations in this one sentence: the fathers who were told, the generation to come, the children yet unborn, and the children those children will tell. Four, and Asaph is writing a psalm rather than a family record — this is how a nation remembers. Notice the purpose clause at the end: so that they would set their hope in God. Not so the facts survive. The telling has a point, and the point is a hope lodged in someone who has not been born yet.",
    talk: "What are you telling that could reach four generations?",
    pray: "Lord, let what is said in this house reach further than this house. Give us things worth telling — your deeds and not our opinions — and let children we will never meet set their hope in you because of them.",
  },
  {
    read: { text: "Yes, the sparrow has found a home, and the swallow a nest for herself, where she may have her young, near your altars, the LORD of Armies, my King, and my God.", ref: "Psalm 84:3" },
    reflection:
      "The psalmist is shut out of the temple and homesick for it, and what he envies is a bird. Sparrows and swallows nested in the eaves of the courts, so close to the altar that they raised their young there — permanent residents where he was only a visitor. The image he lands on for blessedness is not a worshipper but a nest full of chicks in the right place. Where a family builds, and what it builds next to, shapes everyone who grows up in it.",
    talk: "Is this house near God's altar? What would make it nearer?",
    pray: "Lord, the birds nested where we would like to live. Let this nest be built near your altar — near your word, near your people, near the table. Let our children be raised within sound of it.",
  },
  {
    read: { text: "But the LORD’s loving kindness is from everlasting to everlasting with those who fear him, his righteousness to children’s children, to those who keep his covenant, to those who remember to obey his precepts.", ref: "Psalm 103:17-18" },
    reflection:
      "David has just said that our days are like grass, and the wind passes over and the place knows it no more. Then the contrast: but the steadfast love of the LORD is from everlasting to everlasting, and his righteousness to children's children. Our end is measured in decades; his covenant is measured in generations. Notice the conditions he attaches — to those who keep his covenant and remember to do his commandments — which is not a payment but a description of the people in whose houses this gets handed on.",
    talk: "What do you hope will still be true in your grandchildren?",
    pray: "Lord, we are grass and you are from everlasting to everlasting. Let your righteousness reach our children's children. Keep this house in your covenant so that the ones who come after us find the road already worn.",
  },
  {
    read: { text: "He will not be afraid of evil news. His heart is steadfast, trusting in the LORD.", ref: "Psalm 112:7" },
    reflection:
      "The psalm does not say he will hear no bad news. It says he will not be afraid of it — the heart is firm, and only then, in the next verse, established. The order matters: the settling happens before the news arrives, or it does not happen at all. You cannot construct a steady heart at the moment the phone rings. It is built now, in the ordinary weeks, by trusting the LORD when there is nothing to be brave about.",
    talk: "How does this house handle bad news? What would settle you beforehand?",
    pray: "Lord, we do not know what news is coming and we are frightened of it in advance. Settle our hearts now, in the quiet, so that whatever we are told we are already trusting you rather than scrambling to begin.",
  },
  {
    read: { text: "I love the LORD, because he listens to my voice, and my cries for mercy. Because he has turned his ear to me, therefore I will call on him as long as I live.", ref: "Psalm 116:1-2" },
    reflection:
      "The psalmist begins with love, and gives a reason for it that is almost startlingly personal: because he heard me. The word for inclined is the picture of someone bending down to catch what a small voice is saying. And the conclusion he draws is lifelong — therefore I will call on him as long as I live. Being genuinely listened to, once, changes how you speak to someone for the rest of your life. That is what this psalm is about.",
    talk: "Do you pray as though you are being listened to?",
    pray: "Lord, you bend down to hear us. We do not always pray as though that were true. Because you have listened, we will keep calling on you as long as we live — and let this child hear us doing it.",
  },
  {
    read: { text: "It is vain for you to rise up early, to stay up late, eating the bread of toil, for he gives sleep to his loved ones.", ref: "Psalm 127:2" },
    reflection:
      "This is the middle verse of the psalm about building a house in vain, and the line is aimed at anxious labour — rising early, going late to rest, eating the bread of anxious toil. Sleep is called a gift, given to his beloved. In a season where sleep is genuinely broken and not by choice, that is a hard word to hear, and it is not a rebuke. It is an invitation to lay down the part of the exhaustion that is self-imposed, and to stop treating rest as a thing you have not earned.",
    talk: "What are you doing with your exhaustion? Is any of it self-imposed?",
    pray: "Lord, some of this tiredness we did not choose and some of it we did. Show us which is which. You give sleep to those you love; give it to us, and let us take it without feeling we ought to be doing more.",
  },
  {
    read: { text: "the LORD, my heart isn’t arrogant, nor my eyes lofty; nor do I concern myself with great matters, or things too wonderful for me.", ref: "Psalm 131:1" },
    reflection:
      "This is one of the shortest psalms and possibly the hardest. David says he has stilled and quieted his soul like a weaned child with its mother — and the whole force is in weaned. Not a baby crying to be fed, but an older child content simply to be held, wanting nothing. That is not how any of us start. It is arrived at, by deliberately setting down the great matters we were never given to carry.",
    talk: "What are you carrying that is too great for you?",
    pray: "Lord, we occupy ourselves with things too great for us and call it responsibility. Quiet us. Make us like a weaned child with its mother — content to be near you without needing something from you.",
  },
  {
    read: { text: "Cause me to hear your loving kindness in the morning, for I trust in you. Cause me to know the way in which I should walk, for I lift up my soul to you.", ref: "Psalm 143:8" },
    reflection:
      "Read the psalm and you find David hiding, his spirit failing, his heart appalled. And what he asks for in the morning is two things: to hear God's steadfast love, and to be shown the way to walk. Hearing first, then direction — because guidance without love is just instruction, and a frightened person cannot follow it. He gives a reason for each: for I trust in you, for to you I lift up my soul. Mornings in this house are about to get harder. Let them start here.",
    talk: "What are your mornings like? What could change in one of them?",
    pray: "Lord, let us hear your steadfast love in the morning, before the day tells us anything else. Then show us the way to walk in it. We are lifting our souls to you, which is most of what we have to offer today.",
  },
  {
    read: { text: "The fear of the LORD is the beginning of knowledge; but the foolish despise wisdom and instruction.", ref: "Proverbs 1:7" },
    reflection:
      "Solomon puts this at the front of the whole book, before a single piece of practical advice, because it is not one lesson among many — it is where learning starts. And the fear of the LORD does not mean terror of him; it means knowing who he is and what you are, and ordering everything else accordingly. Without it you can acquire an enormous amount of information and be, in the Bible's judgement, a fool. Everything you will ever teach this child stands on this or on nothing.",
    talk: "Where do you want this child's education to begin?",
    pray: "Lord, let the fear of you be where this child's knowledge begins — before letters, before numbers, before anything we are proud of teaching them. And begin it in us, because they will learn it from watching more than from being told.",
  },
  {
    read: { text: "Two are better than one, because they have a good reward for their labor. For if they fall, the one will lift up his fellow; but woe to him who is alone when he falls, and doesn’t have another to lift him up.", ref: "Ecclesiastes 4:9-10" },
    reflection:
      "Qoheleth is in the middle of the bleakest stretch of his book, having just described a man toiling alone with nobody to toil for. And the argument he makes for company is not that it is pleasant — it is that people fall. If they fall, one will lift up his fellow, and woe to him who is alone when he falls. The falling is assumed. That is the honest case for having people close to you: not for the good days, when you would manage anyway, but for the week you cannot get up.",
    talk: "Who would lift you up if you fell right now? Do they know?",
    pray: "Lord, two are better than one and we have been living as though we could manage. Give us people close enough to lift us — and make us willing to be seen on the floor when it happens.",
  },
  {
    read: { text: "But now the LORD who created you, Jacob, and he who formed you, Israel, says: “Don’t be afraid, for I have redeemed you. I have called you by your name. You are mine.”", ref: "Isaiah 43:1" },
    reflection:
      "Israel is in exile, and the chapter before has just described them as robbed and plundered, trapped in holes. Into that comes but now — and four short claims in a row: I have redeemed you, I have called you by name, you are mine, do not be afraid. The fear is answered by ownership, not by circumstances changing. Paul says the Spirit of adoption makes the same thing ours in Christ. Whatever else is uncertain about this season, who you belong to is not.",
    talk: "What does it mean to be called by name and belong to God?",
    pray: "Lord, you have called us by name and we are yours, and nothing about this season changes that. Say it to us again when we forget. And let it be true of this child too.",
  },
  {
    read: { text: "All your children will be taught by the LORD; and your children’s peace will be great.", ref: "Isaiah 54:13" },
    reflection:
      "This is said to a city pictured as a barren woman, told to enlarge her tent for children she does not have yet. And the promise about those children is startling: they will be taught by the LORD himself. Jesus quoted this line in John 6 to explain why some people came to him — everyone who has heard and learned from the Father comes to me. Your teaching matters enormously and it is not the only instrument God has. He teaches children directly, and he has done it in houses far worse than yours.",
    talk: "Does it relieve you that God teaches children himself?",
    pray: "Lord, teach this child yourself — beyond what we are able to explain, and in the years when they stop listening to us. Give them great peace, and let their first teacher be you.",
  },
  {
    read: { text: "Ah Lord the LORD! Behold, you have made the heavens and the earth by your great power and by your outstretched arm. There is nothing too hard for you.", ref: "Jeremiah 32:17" },
    reflection:
      "Jeremiah prays this having just been told to buy a field. The Babylonians are camped outside the walls, he is under arrest, and God tells him to purchase land in a country about to be destroyed — as a sign that houses and fields will be bought here again. So the Ah, Lord GOD is not a man in a good mood. Nothing is too hard for you is said by someone signing a deed for ground he will never walk on, because God told him to.",
    talk: "What looks too hard right now?",
    pray: "Lord, nothing is too hard for you — not this, not the thing we have stopped mentioning because it seems settled. Give us Jeremiah's willingness to act on what you have said while the siege is still outside.",
  },
  {
    read: { text: "For he who is mighty has done great things for me. Holy is his name. His mercy is for generations of generations on those who fear him.", ref: "Luke 1:49-50" },
    reflection:
      "Mary is perhaps fourteen, unmarried and pregnant, standing in her cousin's house, and she sings about generations. He who is mighty has done great things for me — and his mercy is on those who fear him from generation to generation. She looks back over centuries and forward over centuries, and locates one obscure pregnancy inside that. What is happening in your house this year is smaller than you fear and larger than you think.",
    talk: "What great thing has God done for you? Say it out loud.",
    pray: "Lord, you have done great things for us and we have not stopped to say so. Holy is your name. Let your mercy run through this house to generations we will never meet.",
  },
  {
    read: { text: "Don’t be afraid, little flock, for it is your Father’s good pleasure to give you the Kingdom.", ref: "Luke 12:32" },
    reflection:
      "Jesus has just spent a paragraph on ravens and lilies and told them not to be anxious. Then this, and every word in it is chosen. Little flock — small, defenceless, and he knows it. Do not be afraid — because the Father is not reluctant. It is his good pleasure to give you the kingdom, which is to say he enjoys it. Most of us can believe God gives. Very few of us can believe he is glad to.",
    talk: "Do you experience God as generous or grudging? Where did that come from?",
    pray: "Father, it is your good pleasure to give — you enjoy it, and we ask as though we were extracting something. Let us receive gladly. And make this a house where giving is done with pleasure.",
  },
  {
    read: { text: "I give eternal life to them. They will never perish, and no one will snatch them out of my hand. My Father who has given them to me is greater than all. No one is able to snatch them out of my Father’s hand.", ref: "John 10:28-29" },
    reflection:
      "Count the securities Jesus stacks up. I give them eternal life. They shall never perish. No one will snatch them out of my hand. My Father is greater than all. No one can snatch them out of the Father's hand. Five, and each one would have been enough. He is speaking to people who had every reason to doubt their own staying power, and he does not point them at their grip. He points them at two hands that cannot be forced open.",
    talk: "What do you fear could take this child from God?",
    pray: "Lord, our own grip is poor and we are aware of it. No one can snatch anyone out of your hand. Hold this child there, and hold us, because that is where the safety actually is.",
  },
  {
    read: { text: "For I am persuaded that neither death, nor life, nor angels, nor principalities, nor things present, nor things to come, nor powers, nor height, nor depth, nor any other created thing will be able to separate us from God’s love which is in Christ Jesus our Lord.", ref: "Romans 8:38-39" },
    reflection:
      "Paul lists death first, then life, then powers and heights and depths, and closes it off with nor anything else in all creation — sealing every gap he might have missed. And note where the love is located: in Christ Jesus our Lord. Not floating somewhere, not dependent on how well you are coping. It is held in a person who died, rose, and cannot die again. That is why the list can be so total. The love is as secure as he is.",
    talk: "Which item on Paul's list do you fear most?",
    pray: "Lord, nothing in the whole of creation can separate us from your love in Christ Jesus. We are frightened of several things on that list. Hold us in the one place nothing reaches.",
  },
  {
    read: { text: "Therefore, my beloved brothers, be steadfast, immovable, always abounding in the Lord’s work, because you know that your labor is not in vain in the Lord.", ref: "1 Corinthians 15:58" },
    reflection:
      "This is the last line of the resurrection chapter — fifteen hundred words on the risen body, and then therefore. Because he rose, be steadfast, immovable, abounding in the work of the Lord, knowing your labour is not in vain. The therefore is the whole argument: resurrection is what makes unseen work count. Nobody records a night feed. Nobody thanks you for the hundredth load of washing. Paul says the risen Christ does, and that nothing done in him is wasted.",
    talk: "What labour feels wasted right now?",
    pray: "Lord, most of what we do this week nobody will see and none of it feels like your work. You have said our labour is not in vain. Keep us steadfast, and let us believe you about the small things.",
  },
  {
    read: { text: "For our light affliction, which is for the moment, works for us more and more exceedingly an eternal weight of glory, while we don’t look at the things which are seen, but at the things which are not seen. For the things which are seen are temporal, but the things which are not seen are eternal.", ref: "2 Corinthians 4:17-18" },
    reflection:
      "Read the list Paul has just given of his light momentary affliction: beaten, stoned, shipwrecked, hungry, in danger constantly. He calls that light. Not because he is minimising it but because he is weighing it — against an eternal weight of glory beyond all comparison, and the Greek piles superlative on superlative as though the language is buckling. The trick, he says, is where you look. What is seen is temporary. What is not seen is eternal.",
    talk: "What weighs on you? What is it being weighed against?",
    pray: "Lord, what we are carrying does not feel light and we will not pretend it does. Weigh it against your glory for us. Fix our eyes on what we cannot see, because everything we can see is passing.",
  },
  {
    read: { text: "For we are his workmanship, created in Christ Jesus for good works, which God prepared before that we would walk in them.", ref: "Ephesians 2:10" },
    reflection:
      "The verse before says we are saved by grace, not by works, so that nobody can boast. Then this: we are his workmanship, created in Christ Jesus for good works, which God prepared beforehand. The word is poiema — a made thing, a piece of work. Works are not how you get in; they are what you were remade for, and they were laid out in advance, like a road already built and waiting to be walked. That is true of you, and it is true of the person you are about to meet.",
    talk: "What might God have prepared for this child to walk in?",
    pray: "Lord, you prepared works in advance for us to walk in, and you have prepared some for this child. Show us ours. And keep us from trying to choose theirs for them.",
  },
  {
    read: { text: "For it is God who works in you both to will and to work, for his good pleasure.", ref: "Philippians 2:13" },
    reflection:
      "The sentence before is work out your own salvation with fear and trembling, and this is the reason attached: for it is God who works in you, both to will and to work. Even the wanting is his doing. That is enormous relief for people running on empty, because the hardest thing is rarely the action — it is finding any desire to do it at three in the morning. You cannot manufacture that. He can, and Paul says he does it for his good pleasure, which means gladly.",
    talk: "Where do you need God to change what you want, not just what you do?",
    pray: "Lord, we can make ourselves do the next thing for a while; we cannot make ourselves want to. Work in us to will and to work. Change what we actually want, because that is past our reach.",
  },
  {
    read: { text: "Put on therefore, as God’s chosen ones, holy and beloved, a heart of compassion, kindness, lowliness, humility, and perseverance;", ref: "Colossians 3:12" },
    reflection:
      "Put on — the same word for getting dressed, and Paul chooses it deliberately: these are not moods that descend but garments you reach for. And the reason he gives comes first in the sentence: as God's chosen ones, holy and beloved. You dress like this because of what you already are, not to become it. On a morning after a broken night, deciding to put on kindness rather than what comes naturally is not a small spiritual act. It is most of the day's work.",
    talk: "Which of these did you forget to put on today?",
    pray: "Lord, we are chosen, holy and loved, and we do not feel like any of it this morning. Clothe us anyway — with compassion, kindness, humility, gentleness and patience. Help us get dressed.",
  },
  {
    read: { text: "May the God of peace himself sanctify you completely. May your whole spirit, soul, and body be preserved blameless at the coming of our Lord Jesus Christ.", ref: "1 Thessalonians 5:23" },
    reflection:
      "Paul ends the letter with a prayer, and notice he does not ask them to sanctify themselves: may the God of peace himself do it. And then the scope — your whole spirit and soul and body. The body is named, which the Greeks around them would have found strange and which exhausted parents need to hear. God's interest in you includes the part that aches. The next verse is the promise attached: he who calls you is faithful, and he will do it.",
    talk: "What part of you most needs preserving right now — body, soul, or spirit?",
    pray: "God of peace, sanctify us completely — spirit, soul and body, including the part of us that is simply worn out. You have called us and you are faithful, and you have said you will do it.",
  },
  {
    read: { text: "Confess your offenses to one another, and pray for one another, that you may be healed. The insistent prayer of a righteous person is powerfully effective.", ref: "James 5:16" },
    reflection:
      "James has just described the elders praying over the sick, and then widens it to everyone: confess your sins to one another, and pray for one another, that you may be healed. The two are joined. Confession here is not to a priest but to a person — someone who knows what you actually did and prays for you anyway. Most households have no one like that. The healing James has in view is broader than bodies, and it does not come to people who are managing alone.",
    talk: "Confess one thing to each other now, and pray.",
    pray: "Lord, there is no one who knows the worst of us and prays for us anyway. Give us someone. Make this house a place where confession is possible, and heal us as we pray for each other.",
  },
  {
    read: { text: "as newborn babies, long for the pure milk of the Word, that with it you may grow, if indeed you have tasted that the Lord is gracious:", ref: "1 Peter 2:2-3" },
    reflection:
      "Peter tells them to crave the pure spiritual milk like newborn infants, and anyone who has watched a newborn feed knows exactly what he means: nothing polite about it, nothing occasional, an absolute and undisguised need. Then the clause that turns it: if indeed you have tasted that the Lord is good. Appetite follows taste. You will spend this year watching a demonstration of how a soul is supposed to want God, several times a night.",
    talk: "When did you last long for God's word the way a baby wants milk?",
    pray: "Lord, give us the appetite a newborn has, because ours has gone polite. Let us taste that you are good, and want you the way this child wants to be fed.",
  },
  {
    read: { text: "This is the boldness which we have toward him, that if we ask anything according to his will, he listens to us. And if we know that he listens to us, whatever we ask, we know that we have the petitions which we have asked of him.", ref: "1 John 5:14-15" },
    reflection:
      "John gives the condition plainly: if we ask anything according to his will, he hears us. Not if we ask with enough certainty, which would make prayer a technique and put the weight on the strength of your own believing. The confidence rests on his will and his character, which is why it is called boldness. And there is freedom in it — you can ask for anything, plainly, without having to work yourself into a state first.",
    talk: "How does 'according to his will' change what you ask for?",
    pray: "Lord, we ask you plainly for what we want, and we place it under your will rather than under our own certainty. Hear us. And where the answer is no, let us trust that it was also love.",
  },
  {
    read: { text: "God said, “Let there be light,” and there was light.", ref: "Genesis 1:3" },
    reflection:
      "Four words into the Bible's account of the world and everything is formless, empty and dark. God does not organise the darkness or explain it. He speaks, and there is light — and light exists three days before the sun does, which is the writer's way of saying the light is his and not the sun's. Paul takes exactly this verse and applies it to conversion: God who said let light shine out of darkness has shone in our hearts.",
    talk: "What feels formless right now? What would you ask God to speak into it?",
    pray: "Lord, you spoke light into a dark with nothing in it, and you did not need anything to make it from. Speak into ours. There is a formless part of this season and we cannot organise it ourselves.",
  },
  {
    read: { text: "the LORD God said, “It is not good for the man to be alone. I will make him a helper comparable to him.”", ref: "Genesis 2:18" },
    reflection:
      "Everything in Genesis 1 is good, repeatedly — and then the first thing God calls not good is a man on his own, in a perfect garden, before anything had gone wrong. Loneliness is not a symptom of the fall; it is a design statement about what a person is. Which matters because new parents are often lonelier than anyone will say out loud: surrounded by people, awake at unsociable hours, and unable to explain it without sounding ungrateful.",
    talk: "Where do you feel alone in this? Have you said it out loud?",
    pray: "Lord, you said it was not good to be alone before anything was broken. There is a loneliness in this house that we have not admitted to each other. Meet it — and send us someone.",
  },
  {
    read: { text: "But Noah found favor in the LORD’s eyes.", ref: "Genesis 6:8" },
    reflection:
      "Read the order carefully. Noah found favour in the eyes of the LORD, and only then does the next verse say he was righteous and blameless in his generation. Grace first; character afterwards. That order is the whole Bible in one paragraph, and it is the order most of us reverse instinctively. You will not earn what God gives this family, and neither will this child. Everything that follows in Noah's life came after the favour, not before it.",
    talk: "Are you trying to earn something from God in this season?",
    pray: "Lord, favour came to Noah before anything was said about his goodness, and it comes to us through your Son. Thank you. Let us stop trying to earn what is already given.",
  },
  {
    read: { text: "While the earth remains, seed time and harvest, and cold and heat, and summer and winter, and day and night will not cease.", ref: "Genesis 8:22" },
    reflection:
      "Noah has just come off the ark into a world scoured empty, and God's first promise is not a spectacular one. It is that the seasons will keep turning — seedtime and harvest, cold and heat, summer and winter, day and night. God binds himself to the ordinary as an act of mercy, and Jesus said the same God sends rain on the just and the unjust. When a season is hard, the fact that morning keeps arriving on schedule is not background noise. It is a covenant being kept.",
    talk: "What ordinary thing has been a mercy to you this week?",
    pray: "Lord, you promised the seasons would not stop and you have kept it every day since. Thank you for ordinary days. Let us notice them as mercies rather than as filler.",
  },
  {
    read: { text: "I will make of you a great nation. I will bless you and make your name great. You will be a blessing.", ref: "Genesis 12:2" },
    reflection:
      "God calls a seventy-five-year-old childless man out of his country and promises him a nation — and then the last clause turns the whole thing outward: you will be a blessing, and in you all the families of the earth will be blessed. Paul says that clause was the gospel preached in advance to Abraham. Nothing given to a household is given only for that household. A family that receives and stores is not doing what Abraham was called into.",
    talk: "Who might be blessed through this family?",
    pray: "Lord, bless us — and then make us a blessing, because the second half is the point of the first. Keep this house from becoming a reservoir. Show us who we are meant to pass this on to.",
  },
  {
    read: { text: "Is anything too hard for the LORD? At the set time I will return to you, when the season comes round, and Sarah will have a son.", ref: "Genesis 18:14" },
    reflection:
      "Sarah has just laughed inside the tent and then denied laughing, and God's response is not a rebuke but a question: is anything too hard for the LORD? The Hebrew word means too wonderful, too extraordinary. He does not argue her out of her unbelief; he points at himself and lets the question do the work. The angel used almost the same words to Mary — nothing will be impossible with God. Both times it was said to a woman about a child.",
    talk: "What have you quietly written off as impossible?",
    pray: "Lord, nothing is too hard for you and part of us does not believe it. Meet our unbelief the way you met Sarah's — without scolding, and by being what you are.",
  },
  {
    read: { text: "Behold, I am with you, and will keep you, wherever you go, and will bring you again into this land. For I will not leave you, until I have done that which I have spoken of to you.", ref: "Genesis 28:15" },
    reflection:
      "Jacob is running. He has cheated his brother out of a blessing, deceived his blind father, and is fleeing a household that wants him dead — and he sleeps on a stone in the open. God meets him there with a ladder and a promise he has done nothing to deserve: I am with you, I will keep you wherever you go, I will not leave you until I have done what I promised. Grace found him mid-flight, in the middle of a mess entirely of his own making.",
    talk: "What are you carrying from your own family that worries you?",
    pray: "Lord, be with us and keep us wherever we go — including the places we have ended up through our own fault. You did not wait for Jacob to be sorry. Find us where we are.",
  },
  {
    read: { text: "The man said, “Let me go, for the day breaks.” Jacob said, “I won’t let you go unless you bless me.”", ref: "Genesis 32:26" },
    reflection:
      "Jacob has spent his life getting blessings by cunning, and on the last night before facing his brother he finally asks for one. He wrestles until daybreak and will not let go — and the man touches his hip and he is lame for the rest of his life. He gets the blessing and a new name and a permanent limp, all in the same encounter. Some things God gives are not given to people who are unchanged by the getting.",
    talk: "What has this season already changed about how you walk?",
    pray: "Lord, we will not let you go. Bless us — and if the blessing comes with a limp, let us take it. Change our name if you must; we would rather be marked by you than untouched.",
  },
  {
    read: { text: "the LORD was with Joseph, and he was a prosperous man. He was in the house of his master the Egyptian.", ref: "Genesis 39:2" },
    reflection:
      "Look at what the sentence puts side by side. The LORD was with Joseph, and he was a successful man — and then the location: in the house of his Egyptian master. He is a slave. Sold by his brothers, trafficked into a foreign house, and about to be falsely accused and imprisoned. The Bible does not say God was with him afterwards, once things improved. He was with him in it, and the wrong situation was not thereby made right.",
    talk: "Where do you need God's presence rather than a change of circumstances?",
    pray: "Lord, be with us here, in the situation as it actually is, rather than in the one we keep hoping to be moved to. You were with Joseph in a house he never chose. Be with us in this one.",
  },
  {
    read: { text: "As for you, you meant evil against me, but God meant it for good, to save many people alive, as is happening today.", ref: "Genesis 50:20" },
    reflection:
      "Joseph's brothers are on the floor in front of him, terrified that now their father is dead he will finally take revenge. And what he gives them is neither denial nor absolution of the facts: you meant evil against me, but God meant it for good. Both verbs are the same word. Their intention was genuinely wicked and God's intention ran straight through it without excusing it. Peter says exactly this about the cross — delivered up by the definite plan of God, and crucified by lawless men.",
    talk: "What has been done to you that God might still be using?",
    pray: "Lord, people have done real harm and we are not going to call it good. You are not defeated by it. Work your good through what was meant for evil, as you have done before.",
  },
  {
    read: { text: "God said to Moses, “I AM WHO I AM,” and he said, “You shall tell the children of Israel this: ‘I AM has sent me to you.”", ref: "Exodus 3:14" },
    reflection:
      "Moses asks for a name to take back to Israel, and God gives one that refuses to be defined by anything outside itself: I AM WHO I AM. Every other thing that exists is contingent — it began, it depends, it can stop. He does not. That is not an abstraction when you are about to become responsible for a life: everything about this child hangs on someone else, and he hangs on nothing. Jesus took that name on his own lips: before Abraham was, I am.",
    talk: "What are you depending on that could fail?",
    pray: "Lord, you are the I AM — you depend on nothing and everything depends on you. We are holding a life we cannot sustain. Be for this family what only you are.",
  },
  {
    read: { text: "the LORD will fight for you, and you shall be still.", ref: "Exodus 14:14" },
    reflection:
      "The sea is in front and the chariots are behind, and Moses tells them the LORD will fight for you, and you have only to be silent. Then read the very next verse: God says to Moses, why are you crying to me? Tell the people to go forward. Both in the same breath. Stillness is not the whole of trust, and neither is action. The difference is only ever knowing which one he has asked for, and that is something to pray about rather than decide by temperament.",
    talk: "Is God asking you to be still, or to move? How would you tell?",
    pray: "Lord, fight for us — we cannot win this. And where you are telling us to go forward, give us the courage to move rather than call our fear stillness.",
  },
  {
    read: { text: "Then the LORD said to Moses, “Behold, I will rain bread from the sky for you, and the people shall go out and gather a day’s portion every day, that I may test them, whether they will walk in my law or not.”", ref: "Exodus 16:4" },
    reflection:
      "They could gather enough for one day only; what was hoarded bred worms and stank. That was not a flaw in the arrangement, it was the arrangement — God says plainly that he did it to test whether they would walk in his law. Daily dependence was designed. Jesus built it into the prayer he taught: give us this day our daily bread, not this month's. A season where you cannot see past tomorrow is not a failure of planning. It may be the training.",
    talk: "What would today's portion be? Are you trying to stockpile?",
    pray: "Lord, give us this day our daily bread. We keep trying to secure next month and you have only ever promised today. Teach us to depend, and to sleep anyway.",
  },
  {
    read: { text: "He said, “My presence will go with you, and I will give you rest.”", ref: "Exodus 33:14" },
    reflection:
      "Moses has just told God he will not move an inch unless God goes with them, and this is the answer: my presence will go with you, and I will give you rest. Presence and rest arrive together, in that order. Moses was leading a nation that complained constantly, and God's remedy for the weight of it was not fewer people or better systems. It was himself. Jesus used almost the same pairing: come to me, and I will give you rest.",
    talk: "What would rest look like this week? Have you asked for it?",
    pray: "Lord, let your presence go with us, because we are not moving without it. And give us rest — the kind that comes from you being here rather than from the load getting lighter.",
  },
  {
    read: { text: "You shall rise up before the gray head and honor the face of the elderly; and you shall fear your God. I am the LORD.", ref: "Leviticus 19:32" },
    reflection:
      "It is a small commandment in the middle of a long list, and it is oddly physical: stand up when an old person comes in. And then the reason, which is much larger than manners: you shall fear your God, I am the LORD. How the old are treated is filed under reverence, not etiquette. Whatever you say to this child about honouring their grandparents will matter far less than what they watch you do on the days it is inconvenient.",
    talk: "How are the older people in your family treated here?",
    pray: "Lord, teach us to honour the old — in what we say about them when they are not in the room, and in how much of our time they get. Let this child learn it by watching rather than by being told.",
  },
  {
    read: { text: "the LORD bless you, and keep you. the LORD make his face to shine on you, and be gracious to you. the LORD lift up his face toward you, and give you peace.", ref: "Numbers 6:24-26" },
    reflection:
      "God dictates this one himself and tells Aaron to put it on the people — and the last line explains why it works: so they shall put my name on the children of Israel, and I will bless them. The blessing is not a wish. It is God lending his own name. Three lines, each longer than the last, moving from keeping to shining to peace. It is the oldest blessing still spoken over children anywhere on earth, and you have every right to say it over yours.",
    talk: "Say this blessing over your child tonight, by name.",
    pray: "Lord, bless this child and keep them. Make your face shine on them and be gracious to them. Lift up your countenance on them and give them peace — for all their life, and beyond it.",
  },
  {
    read: { text: "I am not able to bear all this people alone, because it is too heavy for me.", ref: "Numbers 11:14" },
    reflection:
      "Moses is not being dramatic. A few lines earlier he asks God to kill him rather than go on, and here he simply names the limit: I am not able to carry all this people alone, the burden is too heavy for me. And God's response is not a rebuke, or a lecture on faith. He tells him to gather seventy others and shares the load. The admission is what opened the help. Most exhausted households are still trying to prove they do not need any.",
    talk: "What is too heavy? Have you told anyone?",
    pray: "Lord, this is too heavy for us alone and we have been pretending otherwise. Send us help — and give us the humility to accept it when it arrives looking like other people.",
  },
  {
    read: { text: "You shall remember all the way which the LORD your God has led you these forty years in the wilderness, that he might humble you, to test you, to know what was in your heart, whether you would keep his commandments or not.", ref: "Deuteronomy 8:2" },
    reflection:
      "Forty years, and Moses tells them to remember all of it — and then says what it was for: to humble you, to test you, to know what was in your heart. The wilderness was not a detour caused by somebody's mistake. It was the route God chose, and the very next verses say he let them hunger in order to feed them with manna, so they would learn that man does not live by bread alone. Jesus quoted that line to the devil in a wilderness of his own.",
    talk: "What has this season shown you about your own heart?",
    pray: "Lord, we assumed this stretch was a wrong turn. Teach us here what we could not have learned anywhere easier. Show us what is actually in our hearts, and be patient with what you find.",
  },
  {
    read: { text: "I call heaven and earth to witness against you today that I have set before you life and death, the blessing and the curse. Therefore choose life, that you may live, you and your descendants,", ref: "Deuteronomy 30:19" },
    reflection:
      "Moses is at the end of his life, laying the choice out in front of a whole nation: life and death, blessing and curse, and then — therefore choose life, that you and your offspring may live. Notice who is in the sentence: your offspring. The choosing is not private. And it is not a single decision either; the next verse defines it as loving the LORD, obeying his voice, holding fast to him. Households do not drift into faithfulness. Nobody ever has.",
    talk: "What is the next choice for life this family must make?",
    pray: "Lord, we choose life — today, and we will need to choose it again tomorrow. Hold us to it. And let this choice reach the children who come after us.",
  },
  {
    read: { text: "that this may be a sign among you, that when your children ask in the future, saying, ‘What do you mean by these stones?’ then you shall tell them, ‘Because the waters of the Jordan were cut off before the ark of the LORD’s covenant. When it crossed over the Jordan, the waters of the Jordan were cut off. These stones shall be for a memorial to the children of Israel forever.", ref: "Joshua 4:6-7" },
    reflection:
      "Twelve stones out of a dry riverbed, piled up for one purpose: so that when your children ask in time to come, what do these stones mean, there is something to point at. Joshua assumed the question would be asked and built the answer in advance. Children ask about what is visible and odd — a photograph, a date kept every year, a habit nobody explains. A household with nothing unusual in it will not be asked anything.",
    talk: "What could you keep in this house that a child will one day ask about?",
    pray: "Lord, give us stones of remembrance — things kept and marked, so that our children ask what they mean. And when they ask, give us something true to say about what you have done.",
  },
  {
    read: { text: "He said to him, “O Lord, how shall I save Israel? Behold, my family is the poorest in Manasseh, and I am the least in my father’s house.” the LORD said to him, “Surely I will be with you, and you shall strike the Midianites as one man.”", ref: "Judges 6:15-16" },
    reflection:
      "Gideon is threshing wheat in a winepress to hide it from raiders when he is greeted as a mighty man of valour, and his reply is a list of reasons he is the wrong person: poorest clan, least in his father's house. God does not contradict him. He does not say you are underestimating yourself. He says I will be with you — which makes the low estimate irrelevant rather than false. That is a different kind of encouragement, and a far more durable one.",
    talk: "What is your version of 'I am the least'? What is God's answer?",
    pray: "Lord, we are small and we are not exaggerating. You never argued with Gideon's estimate; you added yourself to it. Be with us, and let that be enough, because nothing else is.",
  },
  {
    read: { text: "Ruth said, “Don’t urge me to leave you, and to return from following you, for where you go, I will go; and where you stay, I will stay. Your people will be my people, and your God my God.”", ref: "Ruth 1:16" },
    reflection:
      "Ruth is a Moabite — from a people Israel was told to keep at arm's length — and she binds herself to a widow who has just told the whole town to call her Bitter. There is nothing sentimental in the decision; Naomi has no money, no sons, and no prospects. Your people shall be my people, and your God my God. Four generations later her great-grandson is David, and Matthew puts her name in the genealogy of Christ.",
    talk: "Who has bound themselves to you at cost? Have you thanked them?",
    pray: "Lord, you draw outsiders in and put them in the family line. Thank you for making us family when we had no claim. Give us Ruth's kind of loyalty to the people you have joined us to.",
  },
  {
    read: { text: "the LORD came, and stood, and called as at other times, “Samuel! Samuel!” Then Samuel said, “Speak; for your servant hears.”", ref: "1 Samuel 3:10" },
    reflection:
      "Samuel is a boy, and the text says the word of the LORD was rare in those days — there were no frequent visions. He does not recognise the voice and needs an old priest to tell him what is happening. But God spoke to the child, not to the professional. Whatever you plan to teach this child, do not assume God is waiting politely for them to reach an age of understanding. He was speaking to Samuel before anybody had explained him.",
    talk: "When did God first speak to you? How old were you?",
    pray: "Speak, Lord — your servants are listening, and that includes the youngest person in this house. Give us the sense to help them recognise your voice rather than assume it is not for them yet.",
  },
  {
    read: { text: "Then Samuel took a stone, and set it between Mizpah and Shen, and called its name Ebenezer, saying, “the LORD helped us until now.”", ref: "1 Samuel 7:12" },
    reflection:
      "Samuel sets the stone up after a battle, and the name he gives it looks backwards over everything: Ebenezer, stone of help — the LORD has helped us all the way to here. Not just today. The whole road, including the twenty years the ark had been gone and nothing seemed to be happening. Help is almost always easier to see behind you than in front of you, which is why people set stones up: so that on a day you cannot see any help at all, there is something to point at.",
    talk: "Look back a year. Where did God help that you did not see at the time?",
    pray: "Lord, you have helped us all the way here, including the stretches where we could not tell. Let us name it out loud tonight rather than only notice it years from now.",
  },
  {
    read: { text: "But the LORD said to Samuel, “Don’t look on his face, or on the height of his stature, because I have rejected him; for I don’t see as man sees. For man looks at the outward appearance, but the LORD looks at the heart.”", ref: "1 Samuel 16:7" },
    reflection:
      "Samuel is standing in front of Jesse's eldest, a tall and impressive young man, and has already decided. God stops him: I have rejected him, for the LORD sees not as man sees. Man looks on the outward appearance; the LORD looks on the heart. The prophet got it wrong, on his first look, using the criteria everybody uses. You are about to enter years of measurement — weights, centiles, milestones, comparisons — and almost none of it is what God is attending to.",
    talk: "What are you measuring that God is not?",
    pray: "Lord, you look at the heart, and we will spend this year measuring everything except that. Free us from the wrong scoreboard, and keep us from teaching this child to live on it.",
  },
  {
    read: { text: "As for God, his way is perfect. the LORD’s word is tested. He is a shield to all those who take refuge in him.", ref: "2 Samuel 22:31" },
    reflection:
      "David sings this at the end of his life, looking back over years of being hunted, betrayed and at war. Tested is a metalworker's word — refined, put through fire, proven under load. He is not saying God's word sounds true. He is saying he has leaned his whole weight on it repeatedly and it has not given way. That is a different kind of claim, and it is the only kind worth having when you are about to need it.",
    talk: "What promise of God has been tested in your life? Did it hold?",
    pray: "Lord, your way is perfect and your word has been proved by people who leaned on it harder than we have. Be a shield to us. Let us find it true by using it, not only by believing it.",
  },
  {
    read: { text: "May the LORD our God be with us, as he was with our fathers. Let him not leave us or forsake us;", ref: "1 Kings 8:57" },
    reflection:
      "Solomon prays this at the dedication of the temple, in front of the whole nation, and what he asks for is continuity: be with us as you were with our fathers. He is not asking for something new. He is asking the God who kept faith with a previous generation to keep it with this one. Every household that has received anything from those before it can pray exactly this, and every household that has received nothing can ask to be the generation it starts with.",
    talk: "What has God been to your parents or grandparents? Ask for the same.",
    pray: "Lord, be with us as you were with those before us, and do not leave or forsake us. Where we inherited faith, keep it; where we did not, let it begin here.",
  },
  {
    read: { text: "He lay down and slept under a juniper tree; and behold, an angel touched him, and said to him, “Arise and eat!” He looked, and behold, there was at his head a cake baked on the coals, and a jar of water. He ate and drank, and lay down again.", ref: "1 Kings 19:5-6" },
    reflection:
      "Elijah has just won the greatest victory of his life and then run a day into the desert and asked God to kill him. What heaven sends is not a rebuke or a vision. An angel wakes him, twice, with baked bread and a jar of water, and lets him sleep in between. The still small voice comes forty days later. God fed him and let him rest first, because he was not primarily in a spiritual crisis — he was exhausted, and God treated that as real.",
    talk: "What does your body need right now? Have you treated that as spiritual?",
    pray: "Lord, you fed Elijah and let him sleep before you said a word to him. Care for our bodies. Let us stop treating tiredness as a failure of faith when you never did.",
  },
  {
    read: { text: "He answered, “Don’t be afraid; for those who are with us are more than those who are with them.”", ref: "2 Kings 6:16" },
    reflection:
      "An army has surrounded the city overnight, the servant panics, and Elisha prays one thing: open his eyes. Nothing outside changes. The Syrians are still there, the horses are still there, the odds are unchanged — and the servant sees the mountain full of horses and chariots of fire. The reality was never in question, only his access to it. Most of the time we are not asking God to alter a situation so much as to let us see what is already in it.",
    talk: "What are you afraid of? What else is also true that you cannot see?",
    pray: "Lord, open our eyes. We are not asking you to change what is around us so much as to show us what else is there. Those with us are more than those against us, and we cannot see it.",
  },
  {
    read: { text: "Seek the LORD and his strength. Seek his face forever more.", ref: "1 Chronicles 16:11" },
    reflection:
      "David gives this to Asaph on the day the ark comes into Jerusalem — the highest point of his life, everything going right. And what he tells the nation at that moment is to seek the LORD and his strength, seek his face continually. Not seek him when things go wrong. Continually, which is the word that makes it a posture rather than an emergency measure. People who only seek God in crises spend most of their lives out of practice.",
    talk: "Do you seek God only when worried? What would continual seeking look like?",
    pray: "Lord, we seek your face — and we mostly do it when something has gone wrong. Keep us seeking on the ordinary days, so that the road is familiar when we need it in a hurry.",
  },
  {
    read: { text: "For the LORD’s eyes run back and forth throughout the whole earth, to show himself strong in the behalf of them whose heart is perfect toward him. You have done foolishly in this; for from now on you will have wars.", ref: "2 Chronicles 16:9" },
    reflection:
      "This is said as a rebuke. Asa has just bought a foreign army instead of relying on God, and the seer tells him the eyes of the LORD run to and fro through the whole earth to show himself strong on behalf of those whose heart is whole toward him — and then, you have done foolishly. So the searching is real and so is the missed opportunity. God is actively looking for people to strengthen. The qualification is not competence. It is a heart that is not divided.",
    talk: "Is your heart whole toward God right now? What divides it?",
    pray: "Lord, your eyes are searching the earth for hearts to strengthen. Find ours whole toward you — and show us where we have been quietly arranging our own support instead of asking.",
  },
  {
    read: { text: "Then I proclaimed a fast there, at the river Ahava, that we might humble ourselves before our God, to seek from him a straight way for us, and for our little ones, and for all our possessions.", ref: "Ezra 8:21" },
    reflection:
      "Ezra is about to lead a convoy of families across hundreds of miles of bandit country carrying a fortune in temple silver, and he has just told the king that God's hand is on those who seek him — so he is too ashamed to ask for soldiers. Instead he fasts. And notice who he names in the prayer: ourselves, our children, and all our goods. In that order, with the little ones second and the money last.",
    talk: "What journey are you on? Have you prayed over it with the children named?",
    pray: "Lord, give us a straight way — for us, for our little ones, and for what you have put in our hands. Keep us from asking everyone else for help before we have asked you.",
  },
  {
    read: { text: "I looked, and rose up, and said to the nobles, to the rulers, and to the rest of the people, “Don’t be afraid of them! Remember the Lord, who is great and awesome, and fight for your brothers, your sons, your daughters, your wives, and your houses.”", ref: "Nehemiah 4:14" },
    reflection:
      "The wall is half-built, the workers are exhausted, and enemies are threatening a surprise attack. Nehemiah's speech has two halves and both are necessary: remember the Lord, who is great and awesome — and fight for your brothers, your sons, your daughters, your wives and your homes. Courage grounded in God, spent on your family. He does not ask them to feel brave. He gives them something true to remember and something specific to defend.",
    talk: "What do you need courage for on behalf of this child?",
    pray: "Lord, you are great and awesome, and we keep forgetting it at exactly the moment we need it. Make us brave — and let the courage be spent on the people in this house.",
  },
  {
    read: { text: "For if you remain silent now, then relief and deliverance will come to the Jews from another place, but you and your father’s house will perish. Who knows if you haven’t come to the kingdom for such a time as this?", ref: "Esther 4:14" },
    reflection:
      "Mordecai's sentence has two halves that sit uncomfortably together. Deliverance will arise from another place — God's purposes do not hang on Esther's nerve. And yet: who knows whether you have not come to the kingdom for such a time as this. Both are true, and the second is not made small by the first. You are not indispensable, and you are genuinely invited. That is a far better place to act from than thinking everything depends on you.",
    talk: "Why might God have put you here, now, with this child?",
    pray: "Lord, you do not need us and you still call us. Give us courage for the thing we are avoiding. Let us act because you invited us, not because we imagine it all rests on us.",
  },
  {
    read: { text: "He said, “Naked I came out of my mother’s womb, and naked will I return there. the LORD gave, and the LORD has taken away. Blessed be the LORD’s name.”", ref: "Job 1:21" },
    reflection:
      "Read the verse before. Job tears his robe, shaves his head, and falls on the ground — and then worships. He has just been told that all ten of his children are dead. Scripture does not tidy this: the worship and the torn robe are in the same sentence, and the book later has God tell Job's friends that their neat explanations were wrong and Job's raw speech was right. You are allowed to bless God from the floor.",
    talk: "Can you grieve hard and worship at the same time? What does that look like?",
    pray: "Lord, you give and you take away, and we do not understand how both are your hand. Hold us when we cannot make sense of it. Let us worship without pretending we are not broken.",
  },
  {
    read: { text: "But he knows the way that I take. When he has tried me, I will come out like gold.", ref: "Job 23:10" },
    reflection:
      "Read what comes just before: Job says he goes forward and God is not there, backward and cannot perceive him, left and right and finds nothing. He has been looking in every direction and God is absent from all of them. Then this — but he knows the way that I take. He cannot locate God and he still insists God can locate him. That is a very thin thread and it holds. Faith is often reduced to exactly that much and is not less real for it.",
    talk: "Do you feel lost? Does it help that God is not lost about you?",
    pray: "Lord, we cannot find you in this and you have not lost us. You know the way we are taking. When you have tried us, bring us out as gold — and hold us while it takes.",
  },
  {
    read: { text: "But you, the LORD, are a shield around me, my glory, and the one who lifts up my head.", ref: "Psalm 3:3" },
    reflection:
      "David writes this fleeing from his own son, with an army behind him and people saying there is no salvation for him in God. And what he answers with is three things: a shield about me — not in front, around, on every side; my glory, when his reputation is in ruins; and the lifter of my head, which is what someone does for a person who cannot look up. Not a distant help. Somebody close enough to take your chin.",
    talk: "Whose head needs lifting in this house?",
    pray: "Lord, be a shield around us on every side, and lift our heads. We cannot look up on our own this week. Be our glory where we have lost face.",
  },
  {
    read: { text: "the LORD, in the morning you will hear my voice. In the morning I will lay my requests before you, and will watch expectantly.", ref: "Psalm 5:3" },
    reflection:
      "Two things in one verse: in the morning I prepare a sacrifice for you and watch. The word for prepare is what a priest does laying wood on the altar — it is deliberate, ordered work, not muttering. And then he watches, which assumes something will happen. Most of us do one or the other: we lay things out and walk away, or we wait without ever having asked. David does both, early, before the day has said anything.",
    talk: "Do you watch after you pray, or move straight on?",
    pray: "Lord, in the morning we lay our requests out before you, and then we will watch for what you do. Give us the discipline to ask properly and the expectation to look for an answer.",
  },
  {
    read: { text: "When I consider your heavens, the work of your fingers, the moon and the stars, which you have ordained; what is man, that you think of him? What is the son of man, that you care for him?", ref: "Psalm 8:3-4" },
    reflection:
      "David is outside at night, and the scale of it works on him the way it works on anyone: what is man, that you are mindful of him? The question is genuine — he is not fishing for reassurance, he is staggered. And the psalm's answer is not that we are impressive but that God attends anyway. Hebrews takes these verses and applies them to Jesus, who was made lower than the angels so that the mindfulness would cost him something.",
    talk: "Does God's greatness make you feel small or held? Why both?",
    pray: "Lord, the heavens are the work of your fingers and you are thinking about this small family. We do not understand it and we are not going to argue. Thank you for such attention.",
  },
  {
    read: { text: "How long, the LORD? Will you forget me forever? How long will you hide your face from me? How long shall I take counsel in my soul, having sorrow in my heart every day? How long shall my enemy triumph over me?", ref: "Psalm 13:1-2" },
    reflection:
      "Four times: how long, how long, how long, how long. And the accusation underneath them is that God has forgotten and is hiding his face. This is in the Bible. God put words for his own apparent absence into his people's songbook and did not correct anyone for singing them. The psalm does turn — by the end David is singing about steadfast love — but it takes the whole psalm, and nobody hurries him through the first two verses.",
    talk: "Have you stopped praying out of disappointment? Could you pray that instead?",
    pray: "How long, Lord? We do not understand and we are still speaking to you, which is most of what we have. Do not let us go quiet. Turn us, in your own time, to the end of the psalm.",
  },
  {
    read: { text: "He sent from on high. He took me. He drew me out of many waters.", ref: "Psalm 18:16" },
    reflection:
      "Four verbs in a row and every one of them is God's: he sent, he took, he drew me out. David has just described cords of death and torrents of destruction closing over him, and there is nothing in the rescue that he contributes — no swimming, no reaching, no holding on. Many waters is the Bible's picture of chaos, the thing nobody survives by effort. The whole account is of somebody being pulled out by someone else.",
    talk: "Where are you trying to climb out of something God intends to reach into?",
    pray: "Lord, reach down and draw us out. We have been trying to swim and it has not worked. Take us — we have nothing to offer the rescue but being findable.",
  },
  {
    read: { text: "May the LORD answer you in the day of trouble. May the name of the God of Jacob set you up on high, send you help from the sanctuary, grant you support from Zion,", ref: "Psalm 20:1-2" },
    reflection:
      "This psalm is unusual: it is not addressed to God but to a person. The congregation is praying it over the king before he goes out to battle — may the LORD answer you, may he send you help, may he grant your heart's desire. It is a prayer written to be said out loud over somebody else, in their hearing. A household that only prays privately misses something. There is a particular comfort in being prayed for by name while you can hear it.",
    talk: "Pray this verse over your spouse by name, right now.",
    pray: "Lord, answer us in the day of trouble, and send help from your sanctuary. Give us the habit of praying for each other out loud, where the other can hear it.",
  },
  {
    read: { text: "the LORD is my shepherd: I shall lack nothing. He makes me lie down in green pastures. He leads me beside still waters.", ref: "Psalm 23:1-2" },
    reflection:
      "He makes me lie down. Not invites, not permits — makes. Sheep will graze themselves into exhaustion and will not lie down while they are anxious, so a good shepherd puts them down, in good grass, beside water that is not moving fast enough to frighten them. That is an uncomfortable comfort for anyone whose rest has been forced on them by circumstances rather than chosen. Sometimes being made to stop is the shepherd doing his job.",
    talk: "Has God made you stop recently? How did you take it?",
    pray: "Lord, you are our shepherd and we do not lie down well. Make us. Put us in green pastures and beside still water, even if we would not have chosen to stop.",
  },
  {
    read: { text: "the LORD is my light and my salvation. Whom shall I fear? the LORD is the strength of my life. Of whom shall I be afraid?", ref: "Psalm 27:1" },
    reflection:
      "Two rhetorical questions, and by verse three David is talking about an army encamping against him, so this is not a man with nothing to fear. He is stating a conclusion and then spending the rest of the psalm arguing himself into it — by verse fourteen he is telling his own heart to wait for the LORD and be strong. That is how this verse actually works. Not an absence of fear, but a fact about God set deliberately against it.",
    talk: "Whom or what do you actually fear? Ask David's question about it by name.",
    pray: "Lord, you are our light and our salvation, and we are still afraid of several things. Say it to us again. Be the strength of our lives while we talk ourselves into believing it.",
  },
  {
    read: { text: "You are my hiding place. You will preserve me from trouble. You will surround me with songs of deliverance.", ref: "Psalm 32:7" },
    reflection:
      "David has just described what it was like to keep silent about his sin — his bones wasting away, his strength dried up as by summer heat. Then he confessed, and this is what he found on the other side: God as a hiding place, and surrounded not by threats but by songs of deliverance. It is a strange and lovely picture. The place you least want to go, because of what you are hiding, turns out to be where the singing is.",
    talk: "What song has carried you through something hard?",
    pray: "Lord, be our hiding place — the one we run to rather than the one we run from. Surround us with songs of deliverance, and take the silence out of us.",
  },
  {
    read: { text: "the LORD is near to those who have a broken heart, and saves those who have a crushed spirit.", ref: "Psalm 34:18" },
    reflection:
      "David wrote this having escaped a foreign king by pretending to be insane — not a dignified season. And what he reports is where God positions himself: near to the brokenhearted, saving the crushed in spirit. It is his instinct, not a reward for coping well. And it is not sentiment either; at Calvary God came so near to the crushed that he was crushed himself, the Servant of Isaiah 53 bruised for our iniquities.",
    talk: "Who is broken-hearted near you? What would nearness look like from you?",
    pray: "Lord, you are near to the broken-hearted and you do not wait for them to pull themselves together. Be near to us. We are not coping as well as we are saying.",
  },
  {
    read: { text: "Rest in the LORD, and wait patiently for him. Don’t fret because of him who prospers in his way, because of the man who makes wicked plots happen.", ref: "Psalm 37:7" },
    reflection:
      "The psalm names something most of us would not confess: fretting over people who are getting away with it and doing well on it. David does not tell you that it does not matter. He tells you it will not last — the whole psalm is about how short the prosperity of the wicked turns out to be — and then asks for something harder than indifference. Be still before the LORD and wait patiently. The stillness is the discipline; the fretting is the default.",
    talk: "Whose pregnancy or family are you comparing yours to?",
    pray: "Lord, we compare ourselves with people who seem to have it easier and it eats at us. Take the fretting out. Let us be still before you and wait, without needing to see the accounts settled.",
  },
  {
    read: { text: "Why are you in despair, my soul? Why are you disturbed within me? Hope in God! For I shall still praise him for the saving help of his presence.", ref: "Psalm 42:5" },
    reflection:
      "The psalmist does something unusual here: he stops talking to God and starts talking to himself. Why are you cast down, my soul? Hope in God. He is not denying the feeling — he has just described tears as his food day and night — he is refusing to let the feeling have the final word. Half of the Christian life is learning that your soul will tell you things, and that you are allowed to answer it back with something truer.",
    talk: "What does your inner voice say on a bad day? What would Scripture answer?",
    pray: "Lord, our souls are cast down and we have been listening to them without arguing. Teach us to preach back — to say hope in God out loud, and mean it by the time we finish saying it.",
  },
  {
    read: { text: "God is our refuge and strength, a very present help in trouble.", ref: "Psalm 46:1" },
    reflection:
      "The Hebrew behind very present help means found — abundantly found, easily located — in trouble. Not a help that has to be summoned from a distance or that arrives once the crisis has resolved itself. And look at what the psalm goes on to describe: the earth giving way, mountains falling into the sea. It is the psalm Luther built A Mighty Fortress on, written for the moment the ground itself stops being reliable.",
    talk: "Where do you go first in trouble? Is it him?",
    pray: "Lord, you are a very present help — not distant and not delayed. We come to you now rather than later. Be our refuge while the ground is still moving.",
  },
  {
    read: { text: "Create in me a clean heart, O God. Renew a right spirit within me.", ref: "Psalm 51:10" },
    reflection:
      "David has committed adultery and arranged a man's death, and the verb he reaches for is bara — the word used in Genesis 1 for God making the world out of nothing. He is not asking to be tidied up or helped along. He is asking for an act of creation, because he knows there is nothing in him to work with. That is the only honest prayer after real failure, and it is the one God answers.",
    talk: "What in your heart needs creating, not just improving?",
    pray: "Create in us clean hearts, O God, because there is nothing here to repair. Renew a right spirit within us. Do the kind of making you did at the beginning.",
  },
  {
    read: { text: "When I am afraid, I will put my trust in you. In God, I praise his word. In God, I put my trust. I will not be afraid. What can flesh do to me?", ref: "Psalm 56:3-4" },
    reflection:
      "Notice the order, because it is the opposite of what we tell ourselves. Not I trust, therefore I am not afraid — but when I am afraid, I put my trust in you. The fear comes first and is admitted without embarrassment; David wrote this while in Philistine hands at Gath. Trust is what he does with the fear, not a state that replaces it. Then he asks the question that puts flesh back in proportion: what can flesh do to me?",
    talk: "What would 'when I am afraid, I will trust' look like practically tonight?",
    pray: "Lord, when we are afraid — which is now — we put our trust in you. We are not waiting until the fear passes. Be bigger to us than what we are frightened of.",
  },
  {
    read: { text: "My soul, wait in silence for God alone, for my expectation is from him. He alone is my rock and my salvation, my fortress. I will not be shaken.", ref: "Psalm 62:5-6" },
    reflection:
      "The word alone appears again and again in this psalm: for God alone my soul waits, he alone is my rock. It is a deliberate narrowing, and David makes it explicit a few verses later — do not set your heart on riches, and power belongs to God. Waiting in silence is not passivity; it is refusing to go looking elsewhere while the answer is slow. Most of us wait for God and hedge with three other options.",
    talk: "What else are you leaning on that this psalm would remove?",
    pray: "For God alone our souls wait in silence. Take away the hedges — the plans we are quietly keeping in reserve. You alone are our rock, and we will not be shaken.",
  },
  {
    read: { text: "Blessed be God, who has not turned away my prayer, nor his loving kindness from me.", ref: "Psalm 66:20" },
    reflection:
      "The psalm ends here after a long account of being tested — brought into the net, crushing burdens laid on the back, going through fire and water. And the blessing at the end is remarkably modest: he has not rejected my prayer or removed his steadfast love from me. Not he gave me everything I asked. The psalmist's joy is that the line stayed open and the love stayed put, through the whole of it.",
    talk: "What prayer has God not turned away? Have you thanked him?",
    pray: "Blessed be God, who has not turned away our prayer or his love from us. Even when the answer has not come, the line has stayed open. Thank you for that much, which is a great deal.",
  },
  {
    read: { text: "You, who have shown us many and bitter troubles, you will let me live. You will bring us up again from the depths of the earth.", ref: "Psalm 71:20" },
    reflection:
      "The sentence is startling in what it attributes to God: you who have made me see many troubles and calamities will revive me again. He does not split the ledger — bad things from elsewhere, good things from God. Both are laid at the same door, and he goes on trusting the same hand. And the language of being brought up again from the depths of the earth is resurrection language, which is where the whole hope finally rests.",
    talk: "Can you name the trouble as from God's hand without concluding he is unkind?",
    pray: "Lord, you have shown us hard things and you will revive us again. Bring us up from the depths. We are not going to divide you into the parts we like and the parts we do not.",
  },
  {
    read: { text: "My flesh and my heart fails, but God is the strength of my heart and my portion forever.", ref: "Psalm 73:26" },
    reflection:
      "Asaph has spent the whole psalm nearly losing his footing over the prosperity of the wicked, and this is where he lands. My flesh and my heart may fail — he does not say might, he says it as a matter of course. Bodies give out, and sometimes in exactly this season. What he sets against it is not a denial but a possession: God is the strength of my heart and my portion for ever. The body is temporary. The portion is not.",
    talk: "What has failed in one of you? What is still standing underneath?",
    pray: "Lord, our bodies are failing us in small ways and we are tired of pretending otherwise. Be the strength of our hearts. Be our portion when there is not much else left in the account.",
  },
  {
    read: { text: "For the LORD God is a sun and a shield. the LORD will give grace and glory. He withholds no good thing from those who walk blamelessly.", ref: "Psalm 84:11" },
    reflection:
      "Read it slowly, because the comfort is sharper than it first looks. No good thing does he withhold — which means that what has been withheld was, by his reckoning, not good. That is hard on a day you are grieving something you did not get. And it is the only alternative to a God who is either unable or indifferent. Paul says the same thing from the other end: he who did not spare his own Son will give us all things with him.",
    talk: "What has God withheld? Can you trust that judgement?",
    pray: "Lord, you withhold no good thing, which means what we did not get was not good, and we do not always believe you. Help us trust what has not come. You did not spare your own Son.",
  },
  {
    read: { text: "Satisfy us in the morning with your loving kindness, that we may rejoice and be glad all our days.", ref: "Psalm 90:14" },
    reflection:
      "The psalm has been unsparing — our days pass away under your wrath, we bring our years to an end like a sigh, teach us to number our days. And out of that comes this request: satisfy us in the morning with your steadfast love. Early, before the day makes its case. The logic is that a day is coloured by what filled the first hour of it, and a household that starts on anything else spends the rest of the day catching up.",
    talk: "What are the first minutes of your day like now?",
    pray: "Satisfy us in the morning with your steadfast love, before the day tells us anything else. Let the first thing we take in be you, so we have something to go on.",
  },
  {
    read: { text: "For the LORD is good. His loving kindness endures forever, his faithfulness to all generations.", ref: "Psalm 100:5" },
    reflection:
      "The psalm has been all imperatives — shout, serve with gladness, come with singing, enter with thanksgiving — and then it gives the reason, and the reason is three plain facts. The LORD is good. His steadfast love endures for ever. His faithfulness to all generations. Worship here is not built on how anybody feels; it is built on what is true about God, which is why it can be commanded at all.",
    talk: "Which of the three is hardest to feel today? Say it anyway.",
    pray: "Lord, you are good, your love endures for ever and your faithfulness reaches every generation. We will stand on those three facts today, because our feelings are not load-bearing.",
  },
  {
    read: { text: "Light dawns in the darkness for the upright, gracious, merciful, and righteous.", ref: "Psalm 112:4" },
    reflection:
      "Light dawns in the darkness — not after it. The psalm is describing the household of someone who fears the LORD, and it does not promise that the dark will be avoided. It promises a dawn inside it. A few verses on the same person is described as not afraid of bad news, his heart firm, trusting in the LORD. The light is not the end of the trouble; it is something given in the middle of it.",
    talk: "Where do you need dawn without the dark ending yet?",
    pray: "Lord, let light rise in our darkness rather than only after it. We are not asking you to remove this yet. Give us enough to see by while it lasts.",
  },
  {
    read: { text: "This is the day that the LORD has made. We will rejoice and be glad in it!", ref: "Psalm 118:24" },
    reflection:
      "This line is usually said about a good day. In the psalm it is said about the day the rejected stone became the cornerstone — the psalm the crowds sang on Palm Sunday and that Jesus applied to himself days before his execution. So the day the LORD has made, in context, is the day of a terrible reversal that turned out to be salvation. Which means this verse is not about the weather. It is about whose day today is.",
    talk: "What is today actually like? Can you rejoice in this one?",
    pray: "Lord, you made this day — not the one we wanted, this one. We will rejoice and be glad in it, because it is yours and you are doing something in it we cannot see yet.",
  },
  {
    read: { text: "Your word is a lamp to my feet, and a light for my path.", ref: "Psalm 119:105" },
    reflection:
      "The lamp in question was a small oil lamp tied near the foot, throwing light about a pace ahead. It was never a floodlight over the whole route. That is the honest picture of guidance in Scripture: enough to take the next step, and no more, which is exactly the amount that keeps a person walking close to the one holding it. Most of our frustration is that we wanted a map and were given a lamp.",
    talk: "Are you refusing to move because you cannot see the whole path?",
    pray: "Lord, your word is a lamp to our feet and we keep asking for a searchlight. Let us walk by the light we have been given, one step, and trust you for the one after that.",
  },
  {
    read: { text: "I will lift up my eyes to the hills. Where does my help come from? My help comes from the LORD, who made heaven and earth.", ref: "Psalm 121:1-2" },
    reflection:
      "The hills are probably not a comfort here. Pilgrims going up to Jerusalem watched the high places where the shrines were, and the bandits, and the psalm asks the question straight: where does my help come from? The answer deliberately goes past all of it — from the LORD, who made heaven and earth. Then the psalm says six times that he keeps you, and twice that he does not sleep. A road song for people who were genuinely exposed.",
    talk: "Where do you look for help first? What would looking up sooner change?",
    pray: "Maker of heaven and earth, our help comes from you and not from the things we keep looking at. Keep us on the road. You do not slumber, and we do, so watch while we cannot.",
  },
  {
    read: { text: "Those who sow in tears will reap in joy.", ref: "Psalm 126:5" },
    reflection:
      "The picture is a farmer sowing his last grain in a famine year, weeping because he is putting food into the ground instead of on the table. The psalm does not pretend the tears are irrational — that is a genuinely costly act — and it says the harvest comes anyway. Sowing in tears is still sowing. Faithfulness that feels fruitless is still faithfulness, and the seed does not know how anyone felt when it went in.",
    talk: "What are you sowing in tears right now?",
    pray: "Lord, we are sowing in tears and we cannot see any of it coming up. Bring us home with joy in your time. Until then, let us keep putting seed in the ground.",
  },
  {
    read: { text: "I wait for the LORD. My soul waits. I hope in his word.", ref: "Psalm 130:5" },
    reflection:
      "The next line gives the picture: more than watchmen wait for the morning — men on a wall at three in the morning, who know the sun is coming and cannot make it come faster. And what he waits on is not a feeling but a word: in his word I hope. That is the only thing that makes waiting different from drifting. The psalm began out of the depths and it ends in abundant redemption, and the whole distance is covered by waiting.",
    talk: "What are you waiting for? Where is your hope actually placed?",
    pray: "Lord, our souls wait for you like men watching for the morning. We hope in your word, because we have nothing else to time it by. Let the morning come.",
  },
  {
    read: { text: "Give thanks to the LORD, for he is good; for his loving kindness endures forever.", ref: "Psalm 136:1" },
    reflection:
      "Twenty-six verses, and every single one ends the same way: for his steadfast love endures for ever. It is a psalm designed to be sung antiphonally — a leader names an act of God, the whole congregation answers with the refrain. The repetition is not padding, it is the method. Some things do not become part of you by being understood once. They get in by being said, out loud, by the same people, until the household no longer has to think about it.",
    talk: "Say the refrain together after each thing you are thankful for tonight.",
    pray: "Give thanks to the Lord, for he is good and his love endures for ever. Make this the line our children hear so often that they cannot get it out of their heads.",
  },
  {
    read: { text: "the LORD, you have searched me, and you know me. You know my sitting down and my rising up. You perceive my thoughts from afar.", ref: "Psalm 139:1-2" },
    reflection:
      "Searched is an excavation word — dug into, examined thoroughly. And what David lists is entirely unremarkable: when I sit down and when I rise up, my path and my lying down, a word before it is on my tongue. He is describing total exposure, and the psalm's astonishment is that nothing found there made God leave. Being fully known is only terrifying if you are not also fully loved.",
    talk: "What do you hide that God already knows?",
    pray: "Lord, you have searched us and you know us — including the parts we have not shown anyone. Thank you for staying. Let us stop performing for the one who already sees.",
  },
  {
    read: { text: "the LORD upholds all who fall, and raises up all those who are bowed down.", ref: "Psalm 145:14" },
    reflection:
      "Two different conditions and two different verbs. Those who are falling — mid-fall, not yet down — he upholds, which is the hand under an elbow. Those already bowed down, folded over by whatever it was, he raises up. The psalm is the great alphabet psalm of God's kingship, full of majesty and greatness, and it lands here, on people on their way to the floor. That is what his greatness is for.",
    talk: "Are you falling or bowed down? What is promised?",
    pray: "Lord, uphold us while we are falling and raise us when we are already down. We are somewhere between the two. You do both, and we need whichever applies today.",
  },
  {
    read: { text: "He heals the broken in heart, and binds up their wounds.", ref: "Psalm 147:3" },
    reflection:
      "The verse either side of this one is about God counting the stars and calling them all by name. The psalmist puts the two side by side deliberately: the one who numbers the galaxies is the one binding up wounds. Scale does not dilute attention in God the way it does in us. A person with many responsibilities has less for each; he does not work like that, and the psalm expects that to be the surprising part.",
    talk: "What wound has never been bound up? Have you brought it to him?",
    pray: "Lord, you count the stars and you bind up wounds, and neither crowds out the other. Heal what is broken here. We are small, and you have never found anyone too small.",
  },
  {
    read: { text: "A gentle answer turns away wrath, but a harsh word stirs up anger.", ref: "Proverbs 15:1" },
    reflection:
      "Proverbs is describing a mechanism, not a mood. A soft answer turns wrath away — it actually does something to the other person — and a harsh word stirs anger up, which is a different kind of causation from what most of us assume when we are being honest and blunt. Tired people say harsh things and call it candour. Gentleness at two in the morning is not a temperament some people are lucky enough to have. It is a decision, made in advance.",
    talk: "What harsh word have you spoken this week? Would you take it back?",
    pray: "Lord, give us gentle answers when we are most tired and least able. Let us decide now, while we are calm, what we will say at three in the morning.",
  },
  {
    read: { text: "A cheerful heart makes good medicine, but a crushed spirit dries up the bones.", ref: "Proverbs 17:22" },
    reflection:
      "Proverbs makes the link without embarrassment: a joyful heart is good medicine, and a crushed spirit dries up the bones. The body and the inner life are not separate departments, and Scripture never treated them as such. That cuts both ways in this season. What is happening in a mind will show up in a body, and what is happening to a body — broken sleep, pain, hormones — will show up in a spirit, and neither is a failure of faith.",
    talk: "What is drying up your bones? Have you told anyone?",
    pray: "Lord, give us cheerful hearts, and heal what has been crushed. Where our bodies are wearing our spirits down, help us treat that as real rather than as weakness.",
  },
  {
    read: { text: "for a righteous man falls seven times and rises up again; but the wicked are overthrown by calamity.", ref: "Proverbs 24:16" },
    reflection:
      "Seven times is the Bible's number for completeness, so this is not a quota with an eighth fall waiting to disqualify anyone. The point is the definition: the righteous are not people who do not fall. They are people who get up. And the contrast in the second half is not that the wicked fall more often but that they are overthrown — they do not rise. Perseverance, not performance, is what marks out the righteous here.",
    talk: "Where have you stopped getting up?",
    pray: "Lord, when we fall, raise us — again, and again after that. Keep us from thinking that falling proves we were never yours. Make us the kind of people who get up.",
  },
  {
    read: { text: "Don’t boast about tomorrow; for you don’t know what a day may bring.", ref: "Proverbs 27:1" },
    reflection:
      "Do not boast about tomorrow, for you do not know what a day may bring forth. James takes this and sharpens it: you do not know what tomorrow will bring, you are a mist; instead say, if the Lord wills, we will live and do this. He is not against planning — he is against planning as though the outcome were ours. Every plan you make for this child is provisional, and holding it loosely is not pessimism. It is accuracy.",
    talk: "What plan are you holding too tightly?",
    pray: "Lord, we do not know what tomorrow holds and we plan as though we did. Hold our plans. If you will, we will do these things — and if not, keep us from calling that a disaster.",
  },
  {
    read: { text: "Better is a handful, with quietness, than two handfuls with labor and chasing after wind.", ref: "Ecclesiastes 4:6" },
    reflection:
      "The Preacher has just described a man driven by rivalry, working endlessly because of envy of his neighbour, and this is the alternative he proposes: better a handful with quietness than two handfuls with toil and chasing after wind. It is a deliberate ranking. He is not saying less is easier. He is saying less, held quietly, is better — and the two-handfuls life is not merely tiring, it is a pursuit of something that cannot be caught.",
    talk: "What are you chasing with two hands? What would one handful cost?",
    pray: "Lord, teach us that enough with quietness is better than more with exhaustion. Show us which handful we are reaching for out of fear, and give us the nerve to put it down.",
  },
  {
    read: { text: "I heard the Lord’s voice, saying, “Whom shall I send, and who will go for us?” Then I said, “Here I am. Send me!”", ref: "Isaiah 6:8" },
    reflection:
      "Get the order right. Isaiah sees the Lord, cries out that he is undone and a man of unclean lips, and a coal from the altar is put to his mouth — your guilt is taken away, your sin atoned for. Only then does the question come, and only then can he answer it. Cleansing precedes commissioning, every time. People who volunteer without the coal burn out fast, and people who wait to be good enough never go at all.",
    talk: "Are you trying to serve God before letting him deal with you?",
    pray: "Lord, cleanse us first — we are not fit to be sent and we know it. And then send us. Here we are, on the strength of what your Son has already done about our unclean lips.",
  },
  {
    read: { text: "and when you turn to the right hand, and when you turn to the left, your ears will hear a voice behind you, saying, “This is the way. Walk in it.”", ref: "Isaiah 30:21" },
    reflection:
      "Look at who this is said to. Judah had just gone down to Egypt for help without consulting God — Isaiah calls them rebellious children. And the promise is that when they wander, they will hear a voice behind them putting them back on the road. Behind, not in front: guidance given to people already moving, and often already moving wrongly. Waiting motionless until you are certain is not what is on offer here.",
    talk: "Have you been waiting for direction before moving?",
    pray: "Lord, we have been waiting for certainty before we move, and you have promised to speak to people already walking. Let us hear the voice behind us, and turn when we do.",
  },
  {
    read: { text: "He gives power to the weak. He increases the strength of him who has no might.", ref: "Isaiah 40:29" },
    reflection:
      "The verse before establishes that God does not faint or grow weary and his understanding is unsearchable — and then, immediately, he gives power to the faint. The inexhaustibility is not held over the exhausted as a rebuke; it is handed to them. And this same God later slept in a boat out of tiredness and said I thirst on a cross. He took weariness on, so that the weary would have somewhere to get strength.",
    talk: "When you are empty, what do you usually reach for?",
    pray: "Lord, you never grow tired and we are past ours. Give power to the faint. We have no might of our own left and we are not going to pretend we do.",
  },
  {
    read: { text: "but those who wait for the LORD will renew their strength. They will mount up with wings like eagles. They will run, and not be weary. They will walk, and not faint.", ref: "Isaiah 40:31" },
    reflection:
      "Isaiah has just said that even youths shall faint and be weary, and young men shall fall exhausted — so the chapter rules out the obvious answer of trying harder. What renews strength is waiting on the LORD, and the Hebrew carries the sense of binding yourself to him rather than merely letting time pass. Note the order of the images too: mount up, run, walk. It ends with walking, which is what most of life actually requires.",
    talk: "What does waiting on God look like on an ordinary Tuesday?",
    pray: "Lord, we are tired in a way sleep does not touch. Renew our strength as we wait on you — and if it is walking rather than flying, that will do. Just keep us going.",
  },
  {
    read: { text: "Behold, I will do a new thing. It springs out now. Don’t you know it? I will even make a way in the wilderness, and rivers in the desert.", ref: "Isaiah 43:19" },
    reflection:
      "Read who this is said to. God has just rehearsed Israel's entire record and it is a catalogue of failure — you have burdened me with your sins, you have wearied me with your iniquities. Then: remember not the former things. Behold, I am doing a new thing, now it springs forth. The new thing is announced to people whose past gives them no reason to expect it. That is the only kind of person it is ever announced to.",
    talk: "What old thing are you still rehearsing? What might God be doing?",
    pray: "Lord, do a new thing. Make a way through the wilderness we are in and put rivers in the desert. Our record is not good and you have never made that the deciding factor.",
  },
  {
    read: { text: "“For my thoughts are not your thoughts, and your ways are not my ways,” says the LORD. “For as the heavens are higher than the earth, so are my ways higher than your ways, and my thoughts than your thoughts.”", ref: "Isaiah 55:8-9" },
    reflection:
      "This gets quoted to close conversations, and in Isaiah it does the opposite. The verse before it is about the wicked forsaking his way and returning to the LORD, for he will abundantly pardon. Then — my thoughts are not your thoughts. The specific way God's ways are higher, here, is that he forgives far more readily than we would. So when you cannot see what God is doing, the safest guess is that it is more merciful than your version.",
    talk: "What do you not understand about God's dealings with you?",
    pray: "Lord, your ways are higher than ours, and the passage says the difference is how freely you pardon. Give us trust where we lack understanding — and make us more like you in that.",
  },
  {
    read: { text: "The Lord the LORD’s Spirit is on me, because the LORD has anointed me to preach good news to the humble. He has sent me to bind up the broken hearted, to proclaim liberty to the captives and release to those who are bound,", ref: "Isaiah 61:1" },
    reflection:
      "Jesus stood up in the synagogue at Nazareth, read this passage aloud, rolled up the scroll, sat down, and said: today this Scripture has been fulfilled in your hearing. So the binding up of the broken-hearted and the liberty for captives is not a general hope. It is a job description he claimed as his own in front of people who had watched him grow up, and which he then spent three years doing.",
    talk: "Which part of that job description do you need from him now?",
    pray: "Lord Jesus, you read this over yourself and then went and did it. Bind up what is broken-hearted in this house. Set free what has been bound here for longer than we admit.",
  },
  {
    read: { text: "Blessed is the man who trusts in the LORD, and whose confidence is in the LORD. For he will be as a tree planted by the waters, who spreads out its roots by the river, and will not fear when heat comes, but its leaf will be green, and will not be concerned in the year of drought. It won’t cease from yielding fruit.", ref: "Jeremiah 17:7-8" },
    reflection:
      "Jeremiah is contrasting two people, and the contrast is not about whether the drought comes. It comes for both. The tree planted by water does not escape the heat; it does not fear when heat comes, its leaves stay green, and it does not cease to bear fruit. Everything depends on where the roots went in the years before. That is why the ordinary habits of a household matter — they are root work, done long before the dry year arrives.",
    talk: "Where are your roots? What is your water source?",
    pray: "Lord, plant us by your streams. Send our roots deep now, while things are manageable, so that when the drought comes our leaves stay green and we are not anxious.",
  },
  {
    read: { text: "Call to me, and I will answer you, and will show you great and difficult things, which you don’t know.", ref: "Jeremiah 33:3" },
    reflection:
      "Look where Jeremiah is standing. He is under arrest in the court of the guard, the Babylonian siege ramps are against the walls, and the city is going to fall. There is no good version of the next few years. Into that, God says call to me and I will answer, and show you great and hidden things you have not known. It is not a promise to change the circumstances. It is a promise that more is going on than you can currently see.",
    talk: "What have you not called to God about because you assumed the answer?",
    pray: "Lord, we call to you. Show us great and hidden things we do not know — especially about the situation we have already decided is settled. Answer us here, not somewhere easier.",
  },
  {
    read: { text: "I will also give you a new heart, and I will put a new spirit within you. I will take away the stony heart out of your flesh, and I will give you a heart of flesh.", ref: "Ezekiel 36:26" },
    reflection:
      "Every verb belongs to God: I will give, I will put, I will remove. These are people who had proved that law, warning and catastrophe could not change them, so what God promises is replacement rather than repair. A heart of stone cannot resolve to become flesh. And the next line adds the Spirit within them — which Jesus called being born again to a man who could not follow the argument either.",
    talk: "Where has your heart gone hard? Have you asked for the surgery?",
    pray: "Lord, take out our hearts of stone and give us hearts of flesh, because we cannot soften ourselves. Do it in us first, and then do it in this child, in your own time.",
  },
  {
    read: { text: "When Daniel knew that the writing was signed, he went into his house (now his windows were open in his room toward Jerusalem) and he kneeled on his knees three times a day, and prayed, and gave thanks before his God, as he did before.", ref: "Daniel 6:10" },
    reflection:
      "The detail sits in the last three words: as he had done previously. The decree changed; Daniel did not. He did not pray more loudly to make a point, or more quietly to stay safe. He went home and did what he had been doing for decades, at the same windows, at the same hours. A routine built in ordinary times is what remains standing when the law changes. Nobody rises to an occasion. They fall back on what they already had.",
    talk: "What habit are you building now that will hold when it costs?",
    pray: "Lord, build habits in us now, while nothing is at stake — the prayers, the open Bible, the table. Let them be so ordinary that they are still standing on the day they cost something.",
  },
  {
    read: { text: "Let’s acknowledge the LORD. Let’s press on to know the LORD. As surely as the sun rises, the LORD will appear. He will come to us like the rain, like the spring rain that waters the earth.", ref: "Hosea 6:3" },
    reflection:
      "Hosea's people are saying this, and God's reply two verses later is that their love is like a morning cloud, gone by noon — so it is a good thing said by people who did not mean it. But the promise inside it stands: he will come to us as surely as the dawn, like the spring rains that water the earth. Press on to know him. Knowing God is described as something pursued over time, not acquired in a moment.",
    talk: "What would 'pressing on to know God' involve this month?",
    pray: "Lord, let us press on to know you rather than settle for what we learned years ago. Come to us like rain on dry ground — and let our returning be real and not a morning cloud.",
  },
  {
    read: { text: "Tear your heart, and not your garments, and turn to the LORD, your God; for he is gracious and merciful, slow to anger, and abundant in loving kindness, and relents from sending calamity.", ref: "Joel 2:13" },
    reflection:
      "Tearing your clothes was the standard public sign of grief, and Joel says do not bother — tear your heart instead. Then he gives the reason to return, and it is not fear of the coming day. It is the character of God, in the words Israel had known since Sinai: gracious and merciful, slow to anger, abounding in steadfast love. People come back to a God like that. Nobody ever came back out of terror and stayed.",
    talk: "When did you last perform repentance rather than practise it?",
    pray: "Lord, tear our hearts rather than let us settle for the appearance of sorrow. Return us to you — and let it be your kindness that draws us, because that is the only thing that lasts.",
  },
  {
    read: { text: "But as for me, I will look to the LORD. I will wait for the God of my salvation. My God will hear me.", ref: "Micah 7:7" },
    reflection:
      "The verses just before are bleak: the son treats the father with contempt, the daughter rises against her mother, a man's enemies are his own household. Jesus later quoted that passage about himself. And out of that wreckage comes but as for me. Micah does not claim the family is fine. He says where he will look while it is not, and adds the thing he is most sure of: my God will hear me.",
    talk: "If everything else fell apart, could you still say this?",
    pray: "Lord, we look to you and wait for you. Whatever is unresolved between the people in this family, you will hear us. Let that be where each of us turns first rather than last.",
  },
  {
    read: { text: "For though the fig tree doesn’t flourish, nor fruit be in the vines; the labor of the olive fails, the fields yield no food; the flocks are cut off from the fold, and there is no herd in the stalls: yet I will rejoice in the LORD. I will be joyful in the God of my salvation!", ref: "Habakkuk 3:17-18" },
    reflection:
      "Habakkuk lists total agricultural collapse — no figs, no grapes, no olives, no crops, no flock, no herd — which in that economy is not hardship but starvation. And then yet. He is not rejoicing because things are secretly fine; he is rejoicing in the LORD, who is a different subject from the harvest. The book began with him shouting at God about violence. It ends with him choosing joy in the dark, and the last line says God makes him walk on high places.",
    talk: "What have you quietly made the condition of your joy?",
    pray: "Lord, even if everything we are counting on fails, we will rejoice in you. Not in the situation — in you. Be the God of our salvation when there is nothing in the stalls.",
  },
  {
    read: { text: "Then he answered and spoke to me, saying, “This is the LORD’s word to Zerubbabel, saying, ‘Not by might, nor by power, but by my Spirit,’ says the LORD of Armies.”", ref: "Zechariah 4:6" },
    reflection:
      "Zerubbabel is trying to rebuild the temple with a small, discouraged workforce and a mountain of opposition, and the vision he is given is of a lampstand fed by two olive trees — oil arriving without anyone carrying it. Not by might, nor by power, but by my Spirit. Might is armies, power is personal strength, and neither of them is what will finish this. The verse after promises that the great mountain in front of him will become a plain.",
    talk: "What are you trying to do by sheer effort?",
    pray: "Lord, not by our might and not by our power. Do what we cannot. Give us oil we did not carry, because we have been trying to finish this on our own supply.",
  },
  {
    read: { text: "Then those who feared the LORD spoke one with another; and the LORD listened, and heard, and a book of memory was written before him, for those who feared the LORD, and who honored his name.", ref: "Malachi 3:16" },
    reflection:
      "The people speaking have just been complaining that serving God is pointless and the arrogant get away with everything. Then those who feared the LORD spoke with one another — and the LORD paid attention and heard, and a book of remembrance was written before him. They did not know he was listening. Ordinary conversation between believers, and heaven was taking minutes. That is either alarming or wonderful depending on what your house sounds like.",
    talk: "What would be written from this week's conversations here?",
    pray: "Lord, you listen to what we say to each other and you write it down. Give us something worth recording. Let our ordinary conversation be the kind you would want in a book.",
  },
  {
    read: { text: "Blessed are those who mourn, for they shall be comforted.", ref: "Matthew 5:4" },
    reflection:
      "It is worth pausing on how strange this is as a public statement. Not blessed are those who recover quickly, or who keep perspective. Blessed are those who mourn — the grieving are called fortunate, because they are the ones in a position to be comforted. Comfort cannot be given to a person still insisting they are fine. Jesus was described by Isaiah as a man of sorrows, and he wept at a grave he was about to open.",
    talk: "What have you not let yourself mourn?",
    pray: "Lord, blessed are those who mourn, and we have been trying to get past it rather than through it. Let us grieve honestly. Comfort us — we cannot be comforted while we are pretending.",
  },
  {
    read: { text: "Pray like this: ‘Our Father in heaven, may your name be kept holy. Let your Kingdom come. Let your will be done on earth as it is in heaven.", ref: "Matthew 6:9-10" },
    reflection:
      "Notice the order. Before a single request for anything we need, three petitions about God: your name, your kingdom, your will. Jesus is teaching that prayer begins by putting yourself in the right place rather than by getting to the point. And the first word is Father — our Father, plural, which means even praying alone you are praying as part of a family. The needs come next, and they come easier once the first three are said.",
    talk: "How much of your praying starts with God rather than with your requests?",
    pray: "Our Father in heaven, hallowed be your name. Your kingdom come, your will be done in this house as it is in heaven. Teach us to start here before we start asking.",
  },
  {
    read: { text: "Ask, and it will be given you. Seek, and you will find. Knock, and it will be opened for you. For everyone who asks receives. He who seeks finds. To him who knocks it will be opened.", ref: "Matthew 7:7-8" },
    reflection:
      "All three verbs in the Greek are continuous: keep asking, keep seeking, keep knocking. It is not a formula for a single successful request but a description of a life spent at the door. And Jesus immediately explains the confidence behind it with the picture of a father and a hungry child — you would not give a stone, and neither will he. Persistence here is not wearing God down. It is behaving like someone who believes the door opens.",
    talk: "What have you stopped asking for? Would you start again?",
    pray: "Lord, we ask and seek and knock and then stop when nothing happens. Teach us to keep going. Give us the persistence of people who actually expect the door to open.",
  },
  {
    read: { text: "At that time, Jesus answered, “I thank you, Father, Lord of heaven and earth, that you hid these things from the wise and understanding, and revealed them to infants.”", ref: "Matthew 11:25" },
    reflection:
      "The cities where Jesus had done most of his miracles had just refused to repent — and this is his response. Not a complaint, but thanks to the Father for a pattern that would offend any university: hidden from the wise and understanding, revealed to little children. Not because God despises intelligence, but because knowledge makes it easy to approach him as an equal, and nobody is. The invitation to come to him, all who labour, follows immediately.",
    talk: "Where does your knowledge get in the way of receiving like a child?",
    pray: "Father, you reveal yourself to little children and hide yourself from the clever. Make us small enough to receive. Let this child's simple trust teach us something rather than the reverse.",
  },
  {
    read: { text: "But when he saw that the wind was strong, he was afraid, and beginning to sink, he cried out, saying, “Lord, save me!” Immediately Jesus stretched out his hand, took hold of him, and said to him, “You of little faith, why did you doubt?”", ref: "Matthew 14:30-31" },
    reflection:
      "Peter had walked on water — briefly, genuinely. Then he saw the wind, was afraid, and started to go down. And Matthew's detail is that Jesus reached out his hand immediately: no lecture first, no waiting to see if Peter could recover himself. The rebuke comes after he is already held. Peter's faith failed in about thirty seconds; the hand did not. That is the right way round, and it is the only reason any of us are still upright.",
    talk: "Where are you sinking? Have you called out?",
    pray: "Lord, save us. Take hold of us before we go under — you have never waited for anyone to steady themselves first. Our faith is small and your hand is not.",
  },
  {
    read: { text: "and said, “Most certainly I tell you, unless you turn, and become as little children, you will in no way enter into the Kingdom of Heaven.”", ref: "Matthew 18:3" },
    reflection:
      "The disciples have just asked who is greatest in the kingdom, and Jesus stands a child in front of them. Unless you turn and become like children — and the point is not innocence, which children do not have, but position. A child in that world owned nothing, could claim nothing, and had no standing to argue from. They received, or they went without. That is the only posture in which anyone has ever entered.",
    talk: "What do you bring to God that a child could not? Is it helping?",
    pray: "Lord, make us like children — with nothing to bring and nothing to protect. Take away the standing we keep trying to claim, and let us simply receive what you are giving.",
  },
  {
    read: { text: "“teaching them to observe all things that I commanded you. Behold, I am with you always, even to the end of the age.” Amen.", ref: "Matthew 28:20" },
    reflection:
      "The last sentence of Matthew's gospel. Everything before it is a command — go, make disciples, baptise, teach — and it ends not with a warning about failure but with a promise about presence: I am with you always, to the end of the age. Matthew opened his gospel with a name, Immanuel, God with us. He closes it with the same claim out of Jesus' own mouth. The whole book is bracketed by it.",
    talk: "Where has God sent you? Does his promise of presence reach there?",
    pray: "Lord Jesus, you are with us always, to the very end. Thank you. Let us live this week as though that were a fact rather than a phrase we have heard too often.",
  },
  {
    read: { text: "Early in the morning, while it was still dark, he rose up and went out, and departed into a deserted place, and prayed there.", ref: "Mark 1:35" },
    reflection:
      "Mark says it plainly: very early, while it was still dark, he went out to a desolate place and prayed there. He had been healing until late the night before and the crowds would be back at dawn. So he lost sleep to make the time. That is worth saying honestly — this is a hard verse in a season where sleep is not yours to spend. He knows. He was tired too, and he is not standing over you with a stopwatch.",
    talk: "When could you meet God in this season? Be realistic.",
    pray: "Lord Jesus, you made time to pray by going without sleep, and we do not have that to give at the moment. Make room some other way. Meet us in whatever minutes we have.",
  },
  {
    read: { text: "He himself was in the stern, asleep on the cushion, and they woke him up, and told him, “Teacher, don’t you care that we are dying?” He awoke, and rebuked the wind, and said to the sea, “Peace! Be still!” The wind ceased, and there was a great calm.", ref: "Mark 4:38-39" },
    reflection:
      "Their question is not do you have the power. It is do you not care that we are perishing — and that is almost always the real question underneath panic. Ability is rarely what we doubt. And Jesus does two things: he stills the storm, and then he asks why they were afraid. He had said at the start that they were going across to the other side. His care was never actually in question; it just looked like it while he was asleep.",
    talk: "When you panic, which do you doubt: his power or his care?",
    pray: "Lord Jesus, we half believe you can and we are less sure you care, and that is the honest state of us. Still the storm in us. You said we were going to the other side.",
  },
  {
    read: { text: "He said to them, “You come apart into a deserted place, and rest awhile.” For there were many coming and going, and they had no leisure so much as to eat.", ref: "Mark 6:31" },
    reflection:
      "Consider the timing. John the Baptist has just been executed, the disciples have returned from a preaching tour, and so many people are coming and going that they have not had a chance to eat. The work is urgent, real and good — and Jesus tells them to come away to a desolate place and rest a while. Rest is not what you do when the work runs out. He prescribed it in the middle of genuine need, which is the only time it is ever difficult.",
    talk: "What good work are you using as a reason not to rest?",
    pray: "Lord Jesus, you told tired people to come away and rest while the crowds were still waiting. Give us permission to obey. Take the guilt out of stopping.",
  },
  {
    read: { text: "Immediately the father of the child cried out with tears, “I believe. Help my unbelief!”", ref: "Mark 9:24" },
    reflection:
      "The father has just said if you can do anything, have compassion on us — and Jesus turns the if back on him. Then this, shouted immediately and with tears: I believe; help my unbelief. It is not an elegant statement of faith. It is a man admitting his faith is partial while asking for help with the part that is missing. Jesus heals the boy. That is the amount of faith the gospel actually requires.",
    talk: "Where do you believe and doubt at once? Have you told God?",
    pray: "Lord, we believe — and large parts of us do not. Help our unbelief. Do not wait until we have got this right before you act, because we may never get it right.",
  },
  {
    read: { text: "Jesus, looking at them, said, “With men it is impossible, but not with God, for all things are possible with God.”", ref: "Mark 10:27" },
    reflection:
      "This verse gets attached to ambitions it was never about. Look at the question it answers: a rich man has just walked away, Jesus has said it is easier for a camel to go through the eye of a needle, and the disciples ask in astonishment then who can be saved? That is the impossible thing. Not a career or a healing — a human being getting into the kingdom at all. With men it cannot be done. With God it can.",
    talk: "Whose salvation feels impossible to you?",
    pray: "Lord, the impossible thing you were talking about was saving people, and we are asking for exactly that. Save those we love — the ones we have almost stopped praying for.",
  },
  {
    read: { text: "Mary said, “My soul magnifies the Lord. My spirit has rejoiced in God my Savior,”", ref: "Luke 1:46-47" },
    reflection:
      "Mary is young, unmarried, pregnant, and about to face a village that will draw its own conclusions. And her song is almost entirely about God — what he has done, what he is like, what he has promised to Abraham's offspring for ever. Her own circumstances appear briefly and only as evidence of his character. Magnify means to make large; she is not enlarging God, she is making him look the size he actually is.",
    talk: "Can you magnify God about this pregnancy rather than only worry about it?",
    pray: "Lord, our souls magnify you and our spirits rejoice in God our Saviour. Turn our attention off our circumstances and onto you, the way Mary's went, and let the song be about you.",
  },
  {
    read: { text: "The angel said to them, “Don’t be afraid, for behold, I bring you good news of great joy which will be to all the people.”", ref: "Luke 2:10" },
    reflection:
      "Of everyone in the empire, the announcement goes to shepherds — men working a night shift, whose testimony was not accepted in court, living outside the town because the job required it. Not to the temple, not to Herod, not to Rome. And the news is for all the people, which is the opposite of how it was delivered. God's habit of telling the least significant people first is not an accident of the story; it is the story.",
    talk: "Why do you think God chose shepherds as the first congregation?",
    pray: "Lord, you sent the best news in history to men on a night shift. Thank you for including people like us. Let this house never be too respectable to hear it.",
  },
  {
    read: { text: "But he withdrew himself into the desert, and prayed.", ref: "Luke 5:16" },
    reflection:
      "Luke's grammar carries the weight: the verb form means he kept withdrawing, habitually. And the verse before says why it was hard — crowds were gathering in great numbers to hear him and be healed. At the exact point where demand was highest and the work going best, he repeatedly disappeared into empty places. Not when things went badly. When they went well, which is the harder discipline and the one nobody arrives at by accident.",
    talk: "What is your version of withdrawing? When did you last manage it?",
    pray: "Lord Jesus, you withdrew most when you were most in demand, and we do the opposite. Teach us that rhythm. Give this house times when it stops on purpose rather than from collapse.",
  },
  {
    read: { text: "I tell you, keep asking, and it will be given you. Keep seeking, and you will find. Keep knocking, and it will be opened to you.", ref: "Luke 11:9" },
    reflection:
      "The parable immediately before is a man banging on a friend's door at midnight because unexpected guests have arrived and he has no bread. The friend is in bed with his children and does not want to get up — and gets up anyway, because of the man's shameless persistence. That is the setting for ask, seek, knock. All three verbs are continuous in the Greek: keep asking. This is not a formula. It is a description of someone who will not go away.",
    talk: "What would persistent, almost rude prayer look like for you?",
    pray: "Lord, we ask and seek and knock and then give up quietly when nothing happens. Keep us at the door. Give us the shamelessness of a man with nothing to offer his guests.",
  },
  {
    read: { text: "But the very hairs of your head are all counted. Therefore don’t be afraid. You are of more value than many sparrows.", ref: "Luke 12:7" },
    reflection:
      "Look at who Jesus is talking to. He has just warned them about being dragged before synagogues and authorities, and told them not to fear those who kill the body. Then: the hairs of your head are all numbered. This is not comfort for an easy day. It is given to people about to be in real trouble, and it works by scale — if his attention runs to hair count, nothing happening to you is beneath his notice.",
    talk: "What makes you feel forgettable?",
    pray: "Lord, you count what nobody would bother counting. Do not let us be afraid. Steady us, and let this child grow up unable to imagine themselves overlooked by you.",
  },
  {
    read: { text: "But he said, “The things which are impossible with men are possible with God.”", ref: "Luke 18:27" },
    reflection:
      "The context decides the meaning. A rich ruler has walked away sorrowful, Jesus has said how hard it is for the wealthy to enter the kingdom, and the listeners ask then who can be saved? That is the impossible thing being discussed. Not a plan or an outcome — a human being entering the kingdom at all, which nobody can arrange for themselves or for anyone else. With God it is possible, and that is the only reason any of us are here.",
    talk: "What have you decided is beyond God?",
    pray: "Lord, what is impossible with us is possible with you, and the impossible thing is a person being saved. Do it in this house — in us, and in the child we are about to raise.",
  },
  {
    read: { text: "saying, “Father, if you are willing, remove this cup from me. Nevertheless, not my will, but yours, be done.”", ref: "Luke 22:42" },
    reflection:
      "Both halves matter, and we usually only quote the second. He asks — genuinely, in agony, sweating, with the request repeated — that the cup be taken away. Wanting a different outcome is not unbelief; the Son of God did it out loud. And then nevertheless, not my will but yours. Submission here is not the absence of a preference. It is a real preference, stated honestly, and then laid down.",
    talk: "What are you asking God to change? Can you pray this alongside it?",
    pray: "Father, take this cup if you are willing — we are asking plainly and we are not ashamed of asking. Nevertheless, not our will but yours. Hold us to that when the answer comes.",
  },
  {
    read: { text: "For God so loved the world, that he gave his one and only Son, that whoever believes in him should not perish, but have eternal life.", ref: "John 3:16" },
    reflection:
      "The famous word is so, and it does not mean so much — it means in this way. God loved the world in this manner: he gave his only Son. Love is defined by what it hands over, not by what it feels. And Jesus says it to Nicodemus in the context of the bronze serpent lifted in the wilderness, which means the giving he has in mind ends at a cross. That is the standard you have just signed up to imitate.",
    talk: "What are you already willing to give up for this child?",
    pray: "Lord, you loved by giving up your only Son, and that is the pattern we have been handed. Teach us love that gives rather than love that feels. Start with the next unglamorous thing.",
  },
  {
    read: { text: "Jesus said to them, “I am the bread of life. Whoever comes to me will not be hungry, and whoever believes in me will never be thirsty.”", ref: "John 6:35" },
    reflection:
      "The crowd had just asked for a sign and reminded him that Moses gave their fathers manna. Jesus does not offer a better system or a practice. He offers himself: I am the bread of life. And bread is a daily, unremarkable food, not a delicacy — the thing you eat every day without noticing, and die without. Whoever comes will not hunger, he says. The condition is coming, repeatedly, the way you come to a table.",
    talk: "What hunger have you tried to satisfy elsewhere?",
    pray: "Lord Jesus, you are the bread of life and we keep looking for a method instead. Feed us — today, and then again tomorrow, because that is how bread works.",
  },
  {
    read: { text: "The thief only comes to steal, kill, and destroy. I came that they may have life, and may have it abundantly.", ref: "John 10:10" },
    reflection:
      "This verse has been sold as a promise of prosperity, and the context makes that impossible. Jesus is contrasting himself with thieves and hired hands who run when the wolf comes, and the very next sentence is that the good shepherd lays down his life for the sheep. Abundant life here means life under a shepherd who dies for you rather than one who is using you. It is a promise about who is in charge of you, not about what you will own.",
    talk: "How has this verse been sold to you? What does the context change?",
    pray: "Lord Jesus, you came that we might have life in full, and you defined it by laying yours down. Be our shepherd. Keep us from wanting the abundance without the shepherd.",
  },
  {
    read: { text: "Jesus wept.", ref: "John 11:35" },
    reflection:
      "He is four days late and entirely in control. He has already said Lazarus will rise, and he knows exactly how this ends — and standing at the grave of someone he loved, he weeps anyway. The word John uses just before is closer to anger than sadness: he snorted in his spirit. God in the flesh looked at death and hated it. He did not explain it or ask anyone to take the long view. He cried, and then he acted.",
    talk: "Do you allow yourself to grieve, or rush to be fine?",
    pray: "Lord Jesus, you wept at a grave you were about to open. Weep with us. Let nobody in this house be told their tears are a failure of faith, because yours were not.",
  },
  {
    read: { text: "But you will receive power when the Holy Spirit has come upon you. You will be witnesses to me in Jerusalem, in all Judea and Samaria, and to the uttermost parts of the earth.", ref: "Acts 1:8" },
    reflection:
      "The disciples have just asked whether he will restore the kingdom to Israel now, and Jesus declines to answer the timetable question and gives them this instead. Power — dunamis — for one stated purpose: you will be my witnesses. Not for display and not for personal benefit. And the geography starts at home: Jerusalem first, where they lived and where everybody knew them, then outward. Witness begins where you already are.",
    talk: "Where has God placed you to be a witness?",
    pray: "Lord, give us your Spirit's power for the one thing you gave it for. Make us witnesses here — in this house, to the people who already know us — before anywhere else.",
  },
  {
    read: { text: "But about midnight Paul and Silas were praying and singing hymns to God, and the prisoners were listening to them.", ref: "Acts 16:25" },
    reflection:
      "They have been stripped, beaten with rods, thrown into an inner cell and put in the stocks. At midnight they are praying and singing hymns, and Luke adds the detail that matters: the prisoners were listening to them. Nobody sings in a place like that, so the other men had nothing to compare it to. What a household does at its worst hour is heard by people who never listen to it at its best.",
    talk: "What do people hear from you when things are hardest?",
    pray: "Lord, give us songs at midnight — and let others hear them. Let what we do in the hard hours preach something truer than what we say in the easy ones.",
  },
  {
    read: { text: "But these things don’t count; nor do I hold my life dear to myself, so that I may finish my race with joy, and the ministry which I received from the Lord Jesus, to fully testify to the Good News of the grace of God.", ref: "Acts 20:24" },
    reflection:
      "Paul says this on a beach, saying goodbye to the Ephesian elders and heading for a city where he has been told imprisonment and affliction await him. I do not account my life of any value nor as precious to myself, if only I may finish my course and the ministry I received. Finishing is what he wants, not surviving. And notice the two words attached: with joy. He is not bracing himself grimly. He wants to enjoy the end of it.",
    talk: "What are you holding dear that is slowing the race?",
    pray: "Lord, let us finish the course you have given us, and finish it with joy. Keep us from spending our lives merely trying to survive them.",
  },
  {
    read: { text: "There is therefore now no condemnation to those who are in Christ Jesus, who don’t walk according to the flesh, but according to the Spirit.", ref: "Romans 8:1" },
    reflection:
      "Therefore now — the therefore reaches back over seven chapters of argument, and the now means the verdict is already in. Not there will be no condemnation if you manage well; there is none, presently, for those in Christ Jesus. Paul writes it immediately after the honest chapter about doing the thing he hates. You are about to accumulate a great deal of guilt about your parenting, some of it deserved. This verse stands over all of it.",
    talk: "What do you condemn yourself for? What does this verse say?",
    pray: "Lord, there is no condemnation for us in Christ, and we keep living as though the verdict were still pending. Let us actually believe it — today, and on the day we get it badly wrong.",
  },
  {
    read: { text: "In the same way, the Spirit also helps our weaknesses, for we don’t know how to pray as we ought. But the Spirit himself makes intercession for us with groanings which can’t be uttered.", ref: "Romans 8:26" },
    reflection:
      "Paul admits something few of us will: we do not know what to pray for as we ought. Not that we word it badly — we do not know. And the answer is not a technique. The Spirit himself intercedes with groanings too deep for words, and the Father, who searches hearts, knows exactly what the Spirit means. So a person too tired to form a sentence has not stopped praying. Someone else is carrying it in the same room.",
    talk: "Sit in silence together for two minutes and let the Spirit pray.",
    pray: "Spirit of God, pray in us what we cannot say. We do not know what to ask for any more. Carry it to the Father, who knows your mind even when we have lost ours.",
  },
  {
    read: { text: "He who didn’t spare his own Son, but delivered him up for us all, how would he not also with him freely give us all things?", ref: "Romans 8:32" },
    reflection:
      "Paul argues from the largest thing to everything else. God did not spare his own Son — the phrase deliberately echoes Abraham on the mountain, except this time there was no ram. If the greater gift has already been given, at that price, then withholding the lesser ones makes no sense. It is not a promise that you will get what you ask for. It is a promise about the disposition of the one you are asking.",
    talk: "What are you afraid God will withhold?",
    pray: "Father, you did not spare your own Son, and there was no ram in the thicket. We trust you with everything smaller than that — including the things we are most afraid of losing.",
  },
  {
    read: { text: "Don’t be conformed to this world, but be transformed by the renewing of your mind, so that you may prove what is the good, well-pleasing, and perfect will of God.", ref: "Romans 12:2" },
    reflection:
      "Two verbs, and they work differently. Conformed is passive — it is what happens by default, the way water takes the shape of whatever holds it. Nobody decides to be pressed into the world's mould. Transformed is the word behind metamorphosis, and it comes by the renewing of the mind, which means it starts with what you let in. The result Paul names is discernment: you begin to be able to tell what God's will actually is.",
    talk: "What is forming your ideas about parenting more than Scripture is?",
    pray: "Lord, we are being shaped by things we never chose — by what we watch, by what everyone around us assumes. Transform us by renewing our minds, and give us discernment with it.",
  },
  {
    read: { text: "Now may the God of hope fill you with all joy and peace in believing, that you may abound in hope, in the power of the Holy Spirit.", ref: "Romans 15:13" },
    reflection:
      "Notice the title: the God of hope. Hope is not something the Romans are told to generate; it is something he fills them with, and the last phrase names the means — by the power of the Holy Spirit. So hope that has quietly drained out of a household is not a personality failure to be talked out of. It is something to ask God for, specifically, in the places where you have stopped expecting anything.",
    talk: "What are you hoping in that could fail?",
    pray: "God of hope, we have stopped hoping for certain things and never said so out loud. Fill us with joy and peace in believing. Give the hope back, by the power of your Spirit.",
  },
  {
    read: { text: "Love is patient and is kind. Love doesn’t envy. Love doesn’t brag, is not proud, doesn’t behave itself inappropriately, doesn’t seek its own way, is not provoked, takes no account of evil; doesn’t rejoice in unrighteousness, but rejoices with the truth; bears all things, believes all things, hopes all things, and endures all things.", ref: "1 Corinthians 13:4-7" },
    reflection:
      "This was not written for a wedding. Paul is correcting a church that was suing each other, getting drunk at the Lord's table, and ranking themselves by spiritual gifts — and the list is aimed at them. Every line is a rebuke of something they were doing. Which makes it far more useful than a poem: patient, kind, not irritable, not resentful, keeping no record of wrongs. It is a description of the last hour of a very long day.",
    talk: "Which line will be hardest at 3am?",
    pray: "Lord, make our love patient and kind in the hours when we are least able. Take away the record of wrongs each of us is keeping. Let it bear and believe and hope and endure.",
  },
  {
    read: { text: "But the fruit of the Spirit is love, joy, peace, patience, kindness, goodness, faith, gentleness, and self-control. Against such things there is no law.", ref: "Galatians 5:22-23" },
    reflection:
      "Fruit, singular — nine facets of one thing, not a menu to pick from. And fruit is not manufactured; it grows, slowly, on something connected to a root, which is why Paul contrasts it with the works of the flesh a few lines earlier. Every item on this list is one that exhausted people run out of first. You cannot generate any of them by effort at four in the morning. You can stay connected to the vine.",
    talk: "Which of the nine is most missing? Ask for that one.",
    pray: "Spirit of God, grow your fruit in us, because we cannot manufacture a single item on that list. We are running low on all nine. Keep us attached to the vine.",
  },
  {
    read: { text: "Now to him who is able to do exceedingly abundantly above all that we ask or think, according to the power that works in us, to him be the glory in the assembly and in Christ Jesus to all generations forever and ever. Amen.", ref: "Ephesians 3:20-21" },
    reflection:
      "This closes a prayer that had already asked outrageous things — that they would know a love surpassing knowledge, and be filled with all the fullness of God. And Paul ends by saying God can do more than that: more than we ask, and more than we can imagine asking. Then he grounds it somewhere unexpected — according to the power at work within us, which he has already identified as the power that raised Christ from the dead.",
    talk: "What are you afraid to ask for?",
    pray: "Lord, you can do more than we know how to ask for, and we have been asking small because we were afraid of disappointment. We ask again. Do whatever is beyond it.",
  },
  {
    read: { text: "And be kind to one another, tender hearted, forgiving each other, just as God also in Christ forgave you.", ref: "Ephesians 4:32" },
    reflection:
      "The command is ordinary; the standard is not. Be kind, tender-hearted, forgiving one another — as God in Christ forgave you. That last clause sets the measure, and it is not proportional to the offence. The parable Jesus told makes the same point with numbers: a debt of ten thousand talents cancelled, and a hundred denarii demanded back. The forgiveness in a household is meant to run at the rate we received, not the rate we think is fair.",
    talk: "What needs forgiving between you tonight?",
    pray: "Lord, make us kind and tender-hearted, and let us forgive at the rate you forgave us rather than the rate that feels reasonable. We know what we were let off.",
  },
  {
    read: { text: "with all prayer and requests, praying at all times in the Spirit, and being watchful to this end in all perseverance and requests for all the saints:", ref: "Ephesians 6:18" },
    reflection:
      "This comes at the end of the armour passage, and it is not a seventh piece. It is the sentence that holds the other six on — praying at all times in the Spirit, with all prayer and supplication, keeping alert with all perseverance. Armour on a man who never prays is decorative. And note who the praying is for: all the saints. The last instruction in the passage points away from yourself.",
    talk: "Do you pray for each other by name daily? Start tonight if not.",
    pray: "Lord, keep us praying at all times rather than only when something is wrong. Make us watchful for each other — and for people beyond this house who need it more.",
  },
  {
    read: { text: "bearing with one another, and forgiving each other, if any man has a complaint against any; even as Christ forgave you, so you also do.", ref: "Colossians 3:13" },
    reflection:
      "Bearing with one another assumes there is something to bear. Paul is not describing people who happen to get along; he is describing a church where somebody has a complaint against somebody, and telling them what to do about it. And then the same measure again: as the Lord has forgiven you, so you also must forgive. A household will always have things to bear. The question is whether they are borne or catalogued.",
    talk: "What do you each have to bear with in the other right now?",
    pray: "Lord, help us bear with each other — which means there will be things to bear, and we accept that. Let us forgive as you forgave us, rather than keep an account.",
  },
  {
    read: { text: "Now may the Lord of peace himself give you peace at all times in all ways. The Lord be with you all.", ref: "2 Thessalonians 3:16" },
    reflection:
      "Paul has just been writing about people who will not work and about not growing weary in doing good, and he ends with this. The title is deliberate: the Lord of peace himself. Not may you find peace, but may he give it, himself. And the scope is total — at all times, in every way. He does not attach a condition or a season. It is the widest peace prayer in the letters, and it is asked for rather than achieved.",
    talk: "Where do you most lack peace? Ask for it there.",
    pray: "Lord of peace, give us peace at all times and in every way — not only when things are settled. And be with us, which is the other half of the prayer and the better half.",
  },
  {
    read: { text: "For every creature of God is good, and nothing is to be rejected, if it is received with thanksgiving.", ref: "1 Timothy 4:4" },
    reflection:
      "Paul is writing against people who were forbidding marriage and certain foods, treating renunciation as holiness. His answer is creation theology: everything God made is good, and nothing is to be rejected if it is received with thanksgiving. That matters in this season, because there is a false piety that treats sleep, help, medicine and decent food as luxuries a serious Christian should manage without. Thanksgiving is the test, not refusal.",
    talk: "What help have you refused that you should receive?",
    pray: "Lord, everything you made is good and we have been refusing things out of a piety you never asked for. Teach us to receive with thanks — the sleep, the help, the medicine.",
  },
  {
    read: { text: "not by works of righteousness which we did ourselves, but according to his mercy, he saved us through the washing of regeneration and renewing by the Holy Spirit,", ref: "Titus 3:5" },
    reflection:
      "Paul stacks the negatives to leave no room: not because of works done by us in righteousness, but according to his own mercy. And the verse before describes what we were — foolish, disobedient, led astray, hating one another. So the saving happened to people in that condition, on the basis of mercy alone. Nothing you do in the next twenty years will save you or this child. You will still do it, and it will still matter, and it will not save anyone.",
    talk: "Where are you trying to earn what has been given?",
    pray: "Lord, you saved us by mercy and not by anything we managed. Thank you. Let us raise this child out of that freedom rather than trying to earn something already given.",
  },
  {
    read: { text: "For in that he himself has suffered being tempted, he is able to help those who are tempted.", ref: "Hebrews 2:18" },
    reflection:
      "The logic of the sentence is that the suffering qualifies him. Because he himself has suffered when tempted, he is able to help those who are being tempted. Not sympathetic from a distance — able, because he has been in it. The chapter has just said he shared in flesh and blood and was made like his brothers in every respect. Help here comes from someone who knows the pull from the inside and did not give in.",
    talk: "What are you tempted by in this season? Does it help that he understands?",
    pray: "Lord Jesus, you were tempted and you know exactly how it feels from the inside. Help us who are being tempted — in the specific thing we have not named out loud.",
  },
  {
    read: { text: "For we don’t have a high priest who can’t be touched with the feeling of our infirmities, but one who has been in all points tempted like we are, yet without sin.", ref: "Hebrews 4:15" },
    reflection:
      "A double negative, which in Greek is emphasis: we do not have a high priest who is unable to sympathise with our weaknesses. He knows what a body feels like at the end of its strength — he slept through a storm from exhaustion, he was hungry in the desert, he thirsted on a cross. The next verse is the conclusion: therefore draw near with confidence. The sympathy is not the end of it; it is the reason you can come.",
    talk: "What would you want Christ to understand about today? He already does.",
    pray: "Lord Jesus, you know what a tired human body feels like because you had one. Thank you for understanding. Let us come to you without apologising for being weak.",
  },
  {
    read: { text: "Now faith is assurance of things hoped for, proof of things not seen.", ref: "Hebrews 11:1" },
    reflection:
      "Assurance and conviction are both courtroom words — substance, evidence. And notice what faith is aimed at: things hoped for and things not seen, which is not the same as certainty about outcomes. The chapter that follows proves the point: it lists people who conquered kingdoms and people who were sawn in two, and says all of them died without receiving what was promised. Faith is confidence about a person, not a prediction about events.",
    talk: "What are you sure of that you cannot see?",
    pray: "Lord, give us assurance of what we hope for and conviction of what we cannot see. Keep us from mistaking faith for certainty about how things will turn out.",
  },
  {
    read: { text: "All chastening seems for the present to be not joyous but grievous; yet afterward it yields the peaceful fruit of righteousness to those who have been trained by it.", ref: "Hebrews 12:11" },
    reflection:
      "The writer does not pretend. All discipline seems painful rather than pleasant at the time — no qualification, no suggestion that mature people find it easier. What he adds is later: afterwards it yields the peaceful fruit of righteousness, and only to those trained by it. So the fruit is not automatic; it comes to people who let the thing do its work rather than merely enduring it. And the context is a Father disciplining sons he owns, not a judge punishing.",
    talk: "What has God been disciplining? Are you being trained by it or resisting?",
    pray: "Lord, this is painful and we are not going to call it anything else. Let your discipline yield the peaceful fruit of righteousness in us. Train us rather than just tire us.",
  },
  {
    read: { text: "Count it all joy, my brothers, when you fall into various temptations, knowing that the testing of your faith produces endurance.", ref: "James 1:2-3" },
    reflection:
      "Count is an accountant's word — reckon, calculate, enter in the ledger. James does not say feel joyful about trials, which would be absurd and dishonest. He says work out what they are producing and enter that in the book: the testing of your faith produces steadfastness. It is a deliberate act of reckoning done with a clear head, usually afterwards, and it is entirely compatible with hating the thing while it happens.",
    talk: "What is the current trial producing? Can you see it yet?",
    pray: "Lord, we cannot feel joy about this and you did not ask us to. Help us count it — to see what you are producing. Let endurance have its full effect in us.",
  },
  {
    read: { text: "Come now, you who say, “Today or tomorrow let’s go into this city, and spend a year there, trade, and make a profit.” Whereas you don’t know what your life will be like tomorrow. For what is your life? For you are a vapor that appears for a little time, and then vanishes away. For you ought to say, “If the Lord wills, we will both live, and do this or that.”", ref: "James 4:13-15" },
    reflection:
      "James is not against planning; he quotes a perfectly sensible business plan and then puts a hole in it. You do not know what tomorrow will bring — you are a mist that appears and vanishes. What he wants instead is not paralysis but a phrase: if the Lord wills, we will live and do this or that. Said honestly, it changes the grip rather than the plan. Every arrangement you are making for this child is provisional, and always was.",
    talk: "What are you planning as though your life were guaranteed?",
    pray: "Lord, if you will, we will live and do these things. All our plans are yours. Hold them loosely for us, since we cannot seem to.",
  },
  {
    read: { text: "If we confess our sins, he is faithful and righteous to forgive us the sins, and to cleanse us from all unrighteousness.", ref: "1 John 1:9" },
    reflection:
      "Look at the two words holding up the promise: faithful and just. Not merciful and kind, which is what we expect. He forgives because he is faithful to his word and because the debt has been justly settled — John says in the next breath that Jesus Christ the righteous is our advocate and the propitiation for our sins. Forgiveness here does not depend on God being in a good mood. It rests on a transaction already completed.",
    talk: "What have you not confessed because you doubt he would forgive it?",
    pray: "Lord, we confess — plainly, without softening it. You are faithful and just to forgive and to cleanse, because it has already been paid for. Thank you that it does not rest on your mood or ours.",
  },
  {
    read: { text: "We love him, because he first loved us.", ref: "1 John 4:19" },
    reflection:
      "Four words carry it: because he first loved us. Every love in this house is a second thing, a response to something that started elsewhere. John has just said that in this is love, not that we loved God, but that he loved us and sent his Son. Which is worth remembering when the love you feel for this child arrives and seems to come from nowhere. It did not. You are passing on something you were given.",
    talk: "Where did your capacity to love come from?",
    pray: "Lord, we love because you loved us first, and every bit of affection in this house is borrowed from you. Thank you. Keep us from taking credit for it.",
  },
  {
    read: { text: "I set my rainbow in the cloud, and it will be a sign of a covenant between me and the earth.", ref: "Genesis 9:13" },
    reflection:
      "The Hebrew word is simply bow — a war bow, and God says he is setting his in the cloud. The picture is a weapon hung up, pointed away from the earth. It is not decoration; it is a disarmament, signed. And God says the sign is for himself: when I see it, I will remember. He did not need a reminder. He gave one anyway, because people do, and because a promise you can see is easier to hold.",
    talk: "What promise of God do you need a visible sign of?",
    pray: "Lord, you hung up your bow and signed a promise you did not need reminding of. Thank you for keeping promises. Give us eyes for the signs you have already put in front of us.",
  },
  {
    read: { text: "Sarah said, “God has made me laugh. Everyone who hears will laugh with me.”", ref: "Genesis 21:6" },
    reflection:
      "Sarah laughed once before, behind the tent flap, and then denied it. Now she laughs again and the sound means something different: God has made laughter for me, and everyone who hears will laugh with me. Same woman, same laugh, entirely new meaning — and the child is named Isaac, which means he laughs, so the joke is permanent. God did not scold the first laugh out of her. He outlasted it.",
    talk: "What have you laughed at bitterly? Could that change?",
    pray: "Lord, some of our laughter has gone bitter and we cannot change it ourselves. Turn it, in your own time, the way you turned Sarah's. We will wait for that.",
  },
  {
    read: { text: "Elkanah her husband said to her, “Hannah, why do you weep? Why don’t you eat? Why is your heart grieved? Am I not better to you than ten sons?”", ref: "1 Samuel 1:8" },
    reflection:
      "Elkanah loves her and he is completely wrong. Three questions in a row, all reasonable, and then am I not more to you than ten sons — which asks her to be comforted on his terms and to stop grieving because it distresses him. Hannah does not answer. She goes to the temple and pours it out to God instead. Loving someone in grief includes not requiring them to feel better in order to make you comfortable.",
    talk: "When have you tried to fix rather than sit with the other's grief?",
    pray: "Lord, teach us to sit with each other's grief rather than talk each other out of it. Keep us from asking the other to be comforted for our own sake.",
  },
  {
    read: { text: "I had heard of you by the hearing of the ear, but now my eye sees you.", ref: "Job 42:5" },
    reflection:
      "Thirty-eight chapters of argument, and God's answer is four chapters of questions about wild goats and ostriches and the foundations of the earth. He never tells Job why any of it happened — the reader knows, and Job never does. What Job gets instead is God himself, and he says it is enough: I had heard of you by the hearing of the ear, but now my eye sees you. The explanation was withheld. The presence was not.",
    talk: "Would you rather have an explanation from God, or God?",
    pray: "Lord, we want an explanation and you have not given one. Give us yourself instead, which Job said was better. Let us see you, and stop requiring you to justify yourself first.",
  },
  {
    read: { text: "Jesus answered, “This man didn’t sin, nor did his parents; but, that the works of God might be revealed in him.”", ref: "John 9:3" },
    reflection:
      "The disciples ask the question every sufferer has been asked: who sinned, this man or his parents? It assumes the whole framework — somebody is at fault, and the job is to identify them. Jesus refuses the framework entirely: neither. Then he redirects it forwards rather than backwards — that the works of God might be displayed. He does not explain the blindness. He declines to let it be turned into a charge against anybody.",
    talk: "Have you searched for what you did wrong when something went wrong?",
    pray: "Lord Jesus, we go looking for our own guilt in every hard thing and call it humility. Free us from that. Show us what you are doing instead of who is to blame.",
  },
  {
    read: { text: "Blessed is the man who doesn’t walk in the counsel of the wicked, nor stand on the path of sinners, nor sit in the seat of scoffers; but his delight is in the LORD’s law. On his law he meditates day and night.", ref: "Psalm 1:1-2" },
    reflection:
      "Watch the verbs slow down: walks, stands, sits. Drift has stages, and nobody sits down in the seat of scoffers on the first day. Against that the psalm sets not discipline but delight — his delight is in the law of the LORD. Then the tree by streams of water, bearing fruit in season, leaves that do not wither. The whole first psalm, which is the doorway into the book, is about what a person feeds on and what grows out of it.",
    talk: "What are you feeding on in this season — advice, forums, fear, or Scripture?",
    pray: "Lord, let our delight be in your word rather than our duty toward it. Plant us by your streams now, so that there is fruit in season and leaves that hold in a dry year.",
  },
  {
    read: { text: "Ask of me, and I will give the nations for your inheritance, the uttermost parts of the earth for your possession.", ref: "Psalm 2:8" },
    reflection:
      "This is the Father speaking to the Son in a psalm about kings raging against the LORD and his anointed. Ask of me, and I will make the nations your heritage. The New Testament quotes this psalm more than almost any other and applies it directly to Jesus — at his baptism, at the resurrection, in Hebrews. Whatever this child's life amounts to, it will be lived inside a kingdom whose King has already been given everything.",
    talk: "What inheritance do you want for this child? What is already secured?",
    pray: "Lord Jesus, the nations were given to you and the ends of the earth are yours. Give this child a place in that kingdom, and let their small life be spent inside your large one.",
  },
  {
    read: { text: "Have mercy on me, the LORD, for I am faint. the LORD, heal me, for my bones are troubled.", ref: "Psalm 6:2" },
    reflection:
      "The psalm begins with sin and judgement and then, without apology, turns to a body: I am languishing, my bones are troubled, and a few lines later, I am weary with my moaning, my bed is drenched with weeping. Nothing here is treated as beneath God's notice or as a failure of faith. Exhaustion is brought straight to him as prayer, in the plainest physical terms available, and it is in the Bible for that reason.",
    talk: "How is your body? Have you told God plainly?",
    pray: "Lord, have mercy on us, for we are worn out. Heal us — our bodies as well as our spirits. We are not going to dress this up as something more spiritual than it is.",
  },
  {
    read: { text: "My shield is with God, who saves the upright in heart.", ref: "Psalm 7:10" },
    reflection:
      "The Hebrew is odd and better for it: my shield is upon God — the shield is not in David's hand at all, it is with someone else. He has just asked God to judge his case, and then stops arguing and hands the defence over. That is a rarer thing than it sounds. Most of us will let God fight for us in principle while continuing to make our own case to everyone who will listen.",
    talk: "What are you defending that God could hold instead?",
    pray: "Lord, our shield is with you and not in our hands. We keep picking up our own defence. Save the upright in heart, and let us stop arguing our case.",
  },
  {
    read: { text: "But you do see trouble and grief. You consider it to take it into your hand. You help the victim and the fatherless.", ref: "Psalm 10:14" },
    reflection:
      "The psalm has just quoted the wicked saying God has forgotten, he has hidden his face, he will never see it. And the answer is three verbs: you do see, you note it, you take it into your hand. Not merely observing — taking hold of it, as a judge takes a case. And the psalm names who benefits: the helpless, the fatherless. God's attention runs first to the people whose situation nobody else is handling.",
    talk: "What trouble do you think God has not noticed?",
    pray: "Lord, you see trouble and grief and you take it into your hand. Take ours. And take up the cause of the children nobody is speaking for tonight.",
  },
  {
    read: { text: "the LORD is in his holy temple. the LORD is on his throne in heaven. His eyes observe. His eyes examine the children of men.", ref: "Psalm 11:4" },
    reflection:
      "Verse three has just asked the question: if the foundations are destroyed, what can the righteous do? And the answer is not a strategy. It is a location: the LORD is in his holy temple, the LORD's throne is in heaven. The thing that shakes and the thing that does not are named in the same breath. His eyes see, his eyelids test the children of man — he is not merely seated, he is watching closely.",
    talk: "What foundation of yours has moved? Where is the throne in that?",
    pray: "Lord, you are on your throne, and the foundations under us are moving. Hold still while we do not. Keep this house steady by being what you are rather than what we manage.",
  },
  {
    read: { text: "“Because of the oppression of the weak and because of the groaning of the needy, I will now arise,” says the LORD; “I will set him in safety from those who malign him.”", ref: "Psalm 12:5" },
    reflection:
      "God is quoted directly, which is rare in the psalms, and the trigger is named precisely: because the poor are plundered, because the needy groan, I will now arise. Groaning — not eloquence, not a well-formed petition. It is the same word used of Israel in Egypt, whose groaning God heard and remembered his covenant. Inarticulate misery is a language heaven reads fluently, and it moves him to get up.",
    talk: "Who is groaning near you? What might God be about to do?",
    pray: "Lord, arise for the groaning of the needy — the ones with no words and no advocate. And where we are among them tonight, count our groaning as prayer.",
  },
  {
    read: { text: "the LORD looked down from heaven on the children of men, to see if there were any who understood, who sought after God.", ref: "Psalm 14:2" },
    reflection:
      "The picture is God leaning over the edge of heaven, looking for one person who understands and seeks him — and the verdict of the next verse is that there is none, not one. Paul quotes exactly this in Romans to close down any idea that anybody started the search. Which means that anyone who is seeking God at all is doing so because he came looking first. The search was never ours.",
    talk: "Are you seeking God in this season, or only asking him for things?",
    pray: "Lord, you look down for anyone who is seeking you, and we are only seeking because you started it. Find us seeking. Keep this house among those who are still looking up.",
  },
  {
    read: { text: "the LORD, who shall dwell in your sanctuary? Who shall live on your holy hill? He who walks blamelessly and does what is right, and speaks truth in his heart;", ref: "Psalm 15:1-2" },
    reflection:
      "The psalm asks who may dwell on your holy hill and then lists the qualifications: blameless walk, righteous deeds, truth spoken in the heart, no slander, keeps an oath even when it hurts. Read honestly, nobody clears the bar, and the psalm is not being unrealistic — it is describing what would actually be required. Hebrews answers it: we enter the holy places by the blood of Jesus, by a new and living way.",
    talk: "Read the whole psalm. Where do you fail? What do you do with that?",
    pray: "Lord, we read the list and none of us qualifies. Thank you for Christ, who does, and who opened the way. Let us live like people let in rather than people who earned it.",
  },
  {
    read: { text: "The heavens declare the glory of God. The expanse shows his handiwork.", ref: "Psalm 19:1" },
    reflection:
      "David says the heavens are speaking — pouring out speech day after day — and then adds that there is no speech and no words, their voice is not heard. A sermon without language, preached everywhere, every night, to everyone. Paul says in Romans that this leaves people without excuse. This child will grow up under a sky that is already testifying, before anyone in this house explains a single thing.",
    talk: "When did you last look up on purpose?",
    pray: "Lord, the heavens are preaching every night and we have stopped listening. Open our eyes to it — and let us be the kind of parents who take a child outside and point upwards.",
  },
  {
    read: { text: "Let the words of my mouth and the meditation of my heart be acceptable in your sight, the LORD, my rock, and my redeemer.", ref: "Psalm 19:14" },
    reflection:
      "It is the last verse of the psalm about the heavens and the law, and it narrows from the cosmos to a mouth. The words and the meditation are put together deliberately: speech is what leaks out of what has been rehearsed inside. Nobody says at three in the morning something they have not been quietly practising for weeks. And he addresses God as rock and redeemer — the one who is stable, and the one who buys back what has been lost.",
    talk: "What have you been rehearsing in your heart lately?",
    pray: "Lord, let the words of our mouths and the meditation of our hearts be acceptable to you. Deal with what is rehearsing inside us, because that is where the words come from.",
  },
  {
    read: { text: "For you make him most blessed forever. You make him glad with joy in your presence.", ref: "Psalm 21:6" },
    reflection:
      "The psalm is about a king given what he asked for — length of days, glory, splendour — and this is where it lands: you make him glad with the joy of your presence. Not with the gifts, with the presence. The distinction runs through the whole Bible; Moses would not move an inch without it, and Psalm 16 calls God's presence fullness of joy. Everything else in this list can be given and taken. That cannot.",
    talk: "Where do you look for joy first? Is it there?",
    pray: "Lord, make us glad with the joy of your presence rather than with our circumstances. Blessings come and go in this house. Be the gladness that does not depend on them.",
  },
  {
    read: { text: "The earth is the LORD’s, with its fullness; the world, and those who dwell in it.", ref: "Psalm 24:1" },
    reflection:
      "Paul quotes this verse twice in one letter to settle arguments about food, and its force is total: the earth and everything in it, the world and everyone who lives there, belongs to God. That includes the child you are about to hold. You are not being given a possession; you are being handed something that stays his, to look after for a while. Every parent eventually finds out the difference, usually the hard way.",
    talk: "What do you treat as yours that is held in trust?",
    pray: "Lord, the earth is yours and everyone in it, and so is this child. Make us faithful stewards rather than anxious owners. Remind us who they actually belong to.",
  },
  {
    read: { text: "Examine me, the LORD, and prove me. Try my heart and my mind.", ref: "Psalm 26:2" },
    reflection:
      "It is a dangerous prayer and David knows it: examine me, test me, try my heart and my mind. Psalm 139 ends with the same request — search me, O God, and know my heart, see if there be any grievous way in me. Nobody prays this who mostly wants to feel all right. It is the prayer of someone who would rather be put straight than left comfortable, and it is usually answered.",
    talk: "Would you dare pray this? What are you afraid he would find?",
    pray: "Examine us, Lord. Test our hearts and minds and show us what you find, even the part we would rather not see. We would rather be right with you than comfortable.",
  },
  {
    read: { text: "the LORD is my strength and my shield. My heart has trusted in him, and I am helped. Therefore my heart greatly rejoices. With my song I will thank him.", ref: "Psalm 28:7" },
    reflection:
      "Follow the order, because it is not the one we want. The LORD is my strength and my shield; in him my heart trusts, and I am helped — and therefore my heart exults. Trust comes before help, and help comes before joy. David is not waiting to feel joyful in order to trust. He trusts first, in the dark, and the singing arrives afterwards, which is the only order that has ever worked.",
    talk: "Where in that sequence are you today?",
    pray: "Lord, be our strength and our shield. We are trusting you before we feel any different, because that is the order. Help us — and give us back the song in your time.",
  },
  {
    read: { text: "My soul shall be joyful in the LORD. It shall rejoice in his salvation.", ref: "Psalm 35:9" },
    reflection:
      "Read the psalm and this line is startling. David is surrounded by people who repay evil for good, who gather against him and mock, and he is asking God to contend with them. Nothing has been resolved. And in the middle of it: my soul shall rejoice in the LORD, exulting in his salvation. The joy is fastened to something already done rather than to anything currently happening, which is why it can be said at all.",
    talk: "What has God already done that you can rejoice in tonight?",
    pray: "Lord, our souls rejoice in you and in your salvation — not in how things are going, because that is not going well. Fasten our gladness to what you have already done.",
  },
  {
    read: { text: "How precious is your loving kindness, God! The children of men take refuge under the shadow of your wings.", ref: "Psalm 36:7" },
    reflection:
      "The psalm has just described God's steadfast love extending to the heavens and his faithfulness to the clouds — cosmic scale — and then narrows to a bird sheltering something small underneath. The children of mankind take refuge in the shadow of your wings, which is the same image Jesus used weeping over Jerusalem. It is offered to anyone; the psalm does not restrict it. The only qualification is coming in under it.",
    talk: "Where do you shelter when you are frightened?",
    pray: "Lord, how precious is your steadfast love. We take refuge under the shadow of your wings — this house, and the people in it who do not know how to ask for shelter.",
  },
  {
    read: { text: "Lord, all my desire is before you. My groaning is not hidden from you.", ref: "Psalm 38:9" },
    reflection:
      "The psalm around this is one long description of a body and a conscience in trouble: no soundness in my flesh, wounds that stink, a heart that throbs, strength that fails. And into that he says the one thing that helps — all my longing is before you, my sighing is not hidden from you. He cannot articulate it, and he does not have to. Sighing counts. It is already filed.",
    talk: "What do you long for that you cannot put into words?",
    pray: "Lord, all our longing is before you and our sighing is not hidden. We cannot put most of it into words. Take the sighing as prayer, because that is all we have tonight.",
  },
  {
    read: { text: "Now, Lord, what do I wait for? My hope is in you.", ref: "Psalm 39:7" },
    reflection:
      "David has just said that a man heaps up wealth and does not know who will gather it, and that everyone is a mere breath. The question comes out of genuine disillusionment: and now, O Lord, for what do I wait? He asks it and answers it in the same breath, because there is nothing else left standing: my hope is in you. That is not a comfortable arrival. It is what remains after everything else has been priced honestly.",
    talk: "What are you waiting for? Where is your hope actually placed?",
    pray: "Lord, what are we waiting for? Our hope is in you, and by now we know there is not much else. Let that be enough, because we have tested the alternatives.",
  },
  {
    read: { text: "the LORD will sustain him on his sickbed, and restore him from his bed of illness.", ref: "Psalm 41:3" },
    reflection:
      "The psalm begins by blessing the person who considers the poor, and this is one of the promises attached: the LORD sustains him on his sickbed, and in his illness you restore him to full health. The Hebrew for that first verb is the word for supporting or propping up. God is described as present at a bedside, doing something ordinary and unglamorous. He is not only the God of the days when people are well.",
    talk: "Who is ill near you? Have you prayed this verse over them?",
    pray: "Lord, sustain those who are ill tonight — in this family and in the houses we know about. Be at the bedside. And make us the kind of people who consider the weak.",
  },
  {
    read: { text: "Why are you in despair, my soul? Why are you disturbed within me? Hope in God! For I shall still praise him: my Savior, my helper, and my God.", ref: "Psalm 43:5" },
    reflection:
      "This is the third time in two psalms the same refrain appears, which means the psalmist had to say it repeatedly and it did not work the first time. He is talking to himself: why are you cast down, my soul? Hope in God. And the grounds he gives are not circumstantial — my salvation and my God. Feelings are addressed, not obeyed. Half the Christian life is learning you are allowed to answer your own soul back.",
    talk: "What would you say to your own soul tonight?",
    pray: "Lord, our souls are cast down and we have been listening to them rather than arguing. We hope in you. We shall again praise you, our salvation and our God.",
  },
  {
    read: { text: "Rise up to help us. Redeem us for your loving kindness’ sake.", ref: "Psalm 44:26" },
    reflection:
      "This is the last line of a psalm that spends most of its length complaining. The sons of Korah have just insisted they have not forgotten God or been false to his covenant, and yet they are crushed, scattered, a byword. They even accuse God of sleeping. And the final appeal is not to their record — it is to his: redeem us for the sake of your steadfast love. Paul quotes this psalm in Romans 8 and answers it with Christ.",
    talk: "On what grounds do you ask God for things?",
    pray: "Rise up and help us, Lord. We are not asking on the strength of how we have done. Redeem us for the sake of your own steadfast love, which is the only ground we have.",
  },
  {
    read: { text: "My heart overflows with a noble theme. I recite my verses for the king. My tongue is like the pen of a skillful writer.", ref: "Psalm 45:1" },
    reflection:
      "The word for overflows is used of water boiling up — something that has filled to the point where it cannot stay in. Praise here is not squeezed out of an empty vessel; it is the overspill of a heart that has been filled with a good theme first. That is worth knowing on days when worship feels forced. The problem is usually not the tongue but the filling, and Hebrews later applies this psalm directly to the Son.",
    talk: "What is your heart full of right now? What overflows?",
    pray: "Lord, fill our hearts with a good theme — with yourself — until it spills. We have been trying to produce praise from an empty vessel. Fill first, and let the words follow.",
  },
  {
    read: { text: "Oh clap your hands, all you nations. Shout to God with the voice of triumph!", ref: "Psalm 47:1" },
    reflection:
      "Clap, shout, sing praises — the psalm is unembarrassed and physical, and it is addressed to all peoples, not just Israel. Worship in Scripture is regularly loud and involves bodies, which sits awkwardly with a culture that treats reverence as quietness. Both are in the Bible: this psalm, and be still and know. A household that only ever does one of them has half a vocabulary, and children learn the range from what they see.",
    talk: "Is worship in this house ever loud or physical? Should it be?",
    pray: "Lord, you are King over all the earth, and we are quieter about it than your people have ever been. Let there be some noise in this house — clapping, singing, gladness that is visible.",
  },
  {
    read: { text: "For this God is our God forever and ever. He will be our guide even to death.", ref: "Psalm 48:14" },
    reflection:
      "The psalm has been a tour of Jerusalem's walls and towers — count them, walk round them, tell the next generation. And it ends by moving from the city to the person: this God is our God for ever and ever, he will guide us for ever. The old translations read even unto death, and either way the point stands. A guide who goes as far as the wall is no use. This one does not stop at the hard part.",
    talk: "How far does your trust in God's guidance reach?",
    pray: "Lord, you are our God for ever and you will guide us to the end. Do not stop at the edge of what we can see. Walk us through the last part too.",
  },
  {
    read: { text: "Call on me in the day of trouble. I will deliver you, and you will honor me.", ref: "Psalm 50:15" },
    reflection:
      "The context is God telling Israel he does not need their sacrifices — if I were hungry I would not tell you, for the world and its fullness are mine. What he actually wants is thanksgiving and this: call upon me in the day of trouble. Trouble is not an interruption to the relationship, it is an occasion for it. And the outcome is two-sided — I will deliver you, and you shall glorify me. He gets something out of it too.",
    talk: "What trouble have you handled without calling on him?",
    pray: "Lord, we call on you in the day of trouble because you asked us to. Deliver us. And when you do, let us be the kind of people who say so out loud.",
  },
  {
    read: { text: "But as for me, I am like a green olive tree in God’s house. I trust in God’s loving kindness forever and ever.", ref: "Psalm 52:8" },
    reflection:
      "David writes this about a man who informed on him and got a town of priests massacred — the psalm is savage about him. And the contrast he draws for himself is a tree: but I am like a green olive tree in the house of God. Olives live for centuries, and this one is green because of where it is planted, not because of anything it is doing. The house is why it is alive.",
    talk: "Where are you planted? Is it somewhere that keeps you green?",
    pray: "Lord, let us be like green olive trees in your house — alive because of where we are planted rather than because of anything we are managing. Keep us in your courts.",
  },
  {
    read: { text: "Behold, God is my helper. The Lord is the one who sustains my soul.", ref: "Psalm 54:4" },
    reflection:
      "Two distinct things in one verse, and it helps enormously to notice the difference. God is my helper — that is about the situation, the practical trouble, the Ziphites who have just betrayed David's hiding place. And the Lord is the upholder of my life — that is about the man himself, held up from underneath while the situation is unresolved. You can have the second long before you get the first.",
    talk: "Which do you need more — help, or sustaining?",
    pray: "Lord, be our helper in the situation, and be the one who upholds us inside it. If the circumstances stay as they are, hold us up anyway.",
  },
  {
    read: { text: "Be merciful to me, God, be merciful to me, for my soul takes refuge in you. Yes, in the shadow of your wings, I will take refuge, until disaster has passed.", ref: "Psalm 57:1" },
    reflection:
      "The heading says David wrote it in a cave, fleeing Saul, and the doubled plea — be merciful to me, be merciful to me — is the sound of a man who has run out of other things to say. Then the telling phrase: I will take refuge in the shadow of your wings until the storms of destruction pass by. Until, not instead of. The wings are not a way round the storm; they are cover while it goes over.",
    talk: "Are you asking God to remove the storm or to shelter you through it?",
    pray: "Be merciful to us, God, be merciful to us. We take refuge in the shadow of your wings until this passes — we are not asking to be spared it, only to be covered.",
  },
  {
    read: { text: "But I will sing of your strength. Yes, I will sing aloud of your loving kindness in the morning. For you have been my high tower, a refuge in the day of my distress.", ref: "Psalm 59:16" },
    reflection:
      "But I will sing — the but is doing all the work. The psalm has been about men lying in wait, prowling round the city like dogs, and nothing about that has been resolved when he says this. He fixes on a time, in the morning, which means deciding the night before what tomorrow will begin with. And he names God a fortress and a refuge in the day of my distress, in the past tense. He has tested it before.",
    talk: "What could you sing about tomorrow morning?",
    pray: "Lord, we will sing of your strength in the morning, and we are deciding that tonight while nothing has changed. You have been our fortress before. Be it again.",
  },
  {
    read: { text: "Through God we will do valiantly, for it is he who will tread down our adversaries.", ref: "Psalm 60:12" },
    reflection:
      "The psalm has just said that salvation by man is vain — the verse immediately before is bleak about human help. And then: with God we shall do valiantly, for it is he who will tread down our foes. Both halves belong together. The valour is real and it is borrowed; nobody in this house has to be brave out of their own supply, and nobody gets to take credit for the bravery either.",
    talk: "What are you facing that requires borrowed courage?",
    pray: "Lord, through you we shall do valiantly, because on our own we will not. Give us borrowed courage for the thing we are avoiding, and tread down what is against us.",
  },
  {
    read: { text: "The righteous shall be glad in the LORD, and shall take refuge in him. All the upright in heart shall praise him!", ref: "Psalm 64:10" },
    reflection:
      "The psalm has been about people who sharpen their tongues like swords and shoot from ambush, and it ends here. Let the righteous one rejoice in the LORD and take refuge in him. Notice the two held together: gladness and shelter, in the same person. Refuge on its own is survival; gladness on its own is denial. What the psalm describes is someone sheltering and glad at the same time, which is only possible if the shelter is a person.",
    talk: "Is God a refuge to you, or mostly a standard?",
    pray: "Lord, we take refuge in you and we are glad in you, and we would like both at once. Be our shelter — and let there be joy in this house while we are sheltering.",
  },
  {
    read: { text: "You crown the year with your bounty. Your carts overflow with abundance.", ref: "Psalm 65:11" },
    reflection:
      "The image is harvest: you crown the year with your bounty, and your wagon tracks overflow with abundance — the picture of carts so loaded that grain spills on the road behind them. And the psalm attributes all of it to God, down to the softening of the furrows with showers. A crown sits on top of something already there. He is not merely supplying the year; he is finishing it with more than was required.",
    talk: "What has this year held that you could call bounty?",
    pray: "Lord, you crown the year with your goodness and the carts overflow. Thank you for what we have not counted. Let this house notice abundance rather than only shortage.",
  },
  {
    read: { text: "May God be merciful to us, bless us, and cause his face to shine on us. That your way may be known on earth, and your salvation among all nations,", ref: "Psalm 67:1-2" },
    reflection:
      "The psalm begins by borrowing Aaron's blessing — be gracious to us and bless us and make his face to shine upon us — and then does something the original did not. It gives a reason: that your way may be known on earth, your saving power among all nations. The blessing is asked for in order to be passed on. A household that is blessed and keeps it has misunderstood what it was given.",
    talk: "Why do you want God's blessing? For yourselves, or for what it enables?",
    pray: "Lord, be gracious to us and make your face shine on us — so that your way is known beyond this house. Bless us for somebody else's sake as well as our own.",
  },
  {
    read: { text: "Save me, God, for the waters have come up to my neck! I sink in deep mire, where there is no foothold. I have come into deep waters, where the floods overflow me. I am weary with my crying. My throat is dry. My eyes fail looking for my God.", ref: "Psalm 69:1-3" },
    reflection:
      "This is one of the most quoted psalms in the New Testament, and Jesus is repeatedly seen in it — zeal for your house has consumed me, they gave me vinegar to drink. But the opening is simply a man drowning: water to the neck, no foothold, worn out with crying, eyes failing from looking for God. Exhaustion, not triumph. God put this in the songbook, and then his own Son lived it.",
    talk: "Are you weary with crying out? Would you keep going anyway?",
    pray: "Save us, God. The water is up to our necks and we are tired of crying and looking. Our eyes are failing from waiting for you. Come before we go under.",
  },
  {
    read: { text: "But I am poor and needy. Come to me quickly, God. You are my help and my deliverer. the LORD, don’t delay.", ref: "Psalm 70:5" },
    reflection:
      "Four verses long, and it is almost entirely a demand to hurry: make haste, O God, to deliver me; hasten to me; do not delay. There is nothing dignified about it. And the ground he gives is his own condition — I am poor and needy — rather than any claim on God's obligation. This is what prayer sounds like when someone has stopped composing it, and God kept it in the book.",
    talk: "What would an urgent, undignified prayer sound like from you?",
    pray: "Lord, we are poor and needy and we are past being dignified about it. Hasten to us. You are our help and our deliverer — do not delay.",
  },
  {
    read: { text: "For he will deliver the needy when he cries; the poor, who has no helper.", ref: "Psalm 72:12" },
    reflection:
      "This is a psalm about a king, and the job description it gives him is worth reading against every other king in history: he delivers the needy when he calls, the poor and him who has no helper. Not the powerful, not those who can return the favour. Him who has no helper — the one whose situation nobody is handling. Christians have always read this psalm as being finally about Christ, and it is what he did.",
    talk: "Who near you has no helper?",
    pray: "Lord, deliver the needy who cry out and the poor who have nobody. And where we could be the helper somebody lacks, make us willing rather than merely sympathetic.",
  },
  {
    read: { text: "The day is yours, the night is also yours. You have prepared the light and the sun. You have set all the boundaries of the earth. You have made summer and winter.", ref: "Psalm 74:16-17" },
    reflection:
      "Asaph is in the middle of a psalm about the sanctuary in ruins and God apparently absent, and he steadies himself on creation: yours is the day, yours also the night. Both halves. That matters in a season where the night is the hard part — the hours when everything is worse and nobody else is awake. The small hours are not a gap in God's jurisdiction. He made them, and he is there.",
    talk: "What are your nights like? Who owns them?",
    pray: "Lord, the day is yours and the night is yours. Keep us in both. Be with whichever of us is awake at three in the morning, because that hour belongs to you too.",
  },
  {
    read: { text: "For neither from the east, nor from the west, nor yet from the south, comes exaltation. But God is the judge. He puts down one, and lifts up another.", ref: "Psalm 75:6-7" },
    reflection:
      "Three directions are ruled out — not from the east or the west, not from the wilderness — and the list conspicuously misses one. The fourth direction is up. Lifting up comes from God alone, who is the judge, putting down one and lifting up another. That is a relief and a warning at once: nobody has to claw their way into a position, and nobody holds one he has not been given.",
    talk: "What position are you striving for? Who gives it?",
    pray: "Lord, you put down and you lift up, and nothing comes from the directions we keep looking in. We leave our place with you. Take the scrambling out of us.",
  },
  {
    read: { text: "You pronounced judgment from heaven. The earth feared, and was silent, when God arose to judgment, to save all the afflicted ones of the earth.", ref: "Psalm 76:8-9" },
    reflection:
      "The earth fears and is still when God rises to judgement — and then the purpose clause, which is not what anyone expects: to save all the humble of the earth. His judgement is aimed at rescue. That is the shape of it throughout Scripture; the flood saves Noah, the plagues free slaves, and the final judgement is good news to everyone who has been on the wrong end of power. Judgement and salvation are the same act seen from two sides.",
    talk: "Why is God's judgement good news to those being crushed?",
    pray: "Lord, arise to save all the humble of the earth — the ones with no recourse, in this country and elsewhere. And when you judge, count us among the humble rather than the secure.",
  },
  {
    read: { text: "Help us, God of our salvation, for the glory of your name. Deliver us, and forgive our sins, for your name’s sake.", ref: "Psalm 79:9" },
    reflection:
      "Asaph is standing in a devastated Jerusalem with bodies unburied, and he asks for help — but notice the ground he asks on. For the glory of your name. Deliver us and atone for our sins for your name's sake. Not because we deserve it, not because the situation is unfair. Because your reputation is bound up with us. It is the boldest argument in prayer and the most secure, because God's name does not fluctuate.",
    talk: "How does praying 'for your name's sake' change what you ask for?",
    pray: "Help us, God of our salvation, for the glory of your name. We are not asking on the strength of our record. Your name is attached to this house — act for its sake.",
  },
  {
    read: { text: "Turn us again, the LORD God of Armies. Cause your face to shine, and we will be saved.", ref: "Psalm 80:19" },
    reflection:
      "Three times in this psalm the same refrain: restore us, let your face shine, that we may be saved. And the verb is the one for turning — turn us back. They cannot even manage the turning; that is what they are asking for. Jeremiah prays the same way: turn me, and I shall be turned. Repentance, in the Bible's own account of it, is something asked for rather than achieved.",
    talk: "What do you need God to turn in you?",
    pray: "Restore us, Lord God of hosts. We cannot even turn ourselves around — turn us. Let your face shine on this house, and we shall be saved.",
  },
  {
    read: { text: "I am the LORD, your God, who brought you up out of the land of Egypt. Open your mouth wide, and I will fill it.", ref: "Psalm 81:10" },
    reflection:
      "The picture is a bird in a nest, and the invitation is faintly comic: open wide, and I will fill it. It comes with a credential attached — I am the LORD your God who brought you up out of the land of Egypt, which is to say, consider what I have already done before you decide how much to ask for. And the psalm's grief a few verses later is that they would not listen. The narrow asking was their own doing.",
    talk: "What would asking largely look like for this family?",
    pray: "Lord, we ask small and then explain to ourselves why the answers are small. We open our mouths wide. Fill them — you brought your people out of Egypt, and we keep forgetting that.",
  },
  {
    read: { text: "Defend the weak, the poor, and the fatherless. Maintain the rights of the poor and oppressed. Rescue the weak and needy. Deliver them out of the hand of the wicked.", ref: "Psalm 82:3-4" },
    reflection:
      "God is pictured standing in the divine council rebuking the rulers of the earth, and these are the charges: you have not defended the weak, the fatherless, the afflicted, the destitute. Four commands, all about people with no power to return a favour. Justice in the Bible is not an abstraction about fairness; it is measured by what happens to specific people who cannot protect themselves. James says the same when he defines pure religion.",
    talk: "Who is powerless in your world? What could this house do?",
    pray: "Lord, make us defenders of the weak and the fatherless rather than people who only feel sorry for them. Show us one person this house could actually stand up for.",
  },
  {
    read: { text: "God, don’t keep silent. Don’t keep silent, and don’t be still, God.", ref: "Psalm 83:1" },
    reflection:
      "It is the first line of the psalm and it is an accusation: do not keep silence, do not hold your peace or be still. Asaph says it twice in one breath, which is the sound of someone who has been waiting a long time. God let it into the songbook without correction. Complaining about God's silence, to God, is not a failure of reverence — it is one of the most common things his people do in Scripture.",
    talk: "Where has God been silent? Have you said so to him?",
    pray: "God, do not keep silence and do not hold your peace. We have been waiting and hearing nothing, and we are telling you so rather than pretending otherwise.",
  },
  {
    read: { text: "I will hear what God, the LORD, will speak, for he will speak peace to his people, his saints; but let them not turn again to folly.", ref: "Psalm 85:8" },
    reflection:
      "Let me hear what God the LORD will speak — it is a deliberate stopping, a decision to listen rather than continue talking. And the psalmist is confident about what will come: he will speak peace to his people. Then the warning in the same sentence, which we usually leave off: but let them not turn back to folly. Peace is spoken to people who are also being kept from wandering, and both belong to the same kindness.",
    talk: "When did you last stop to listen rather than to ask?",
    pray: "Lord, we will stop and listen. Speak peace to us. And keep us from turning back to the things we have already been rescued from once.",
  },
  {
    read: { text: "Yes, of Zion it will be said, “This one and that one was born in her;” the Most High himself will establish her. the LORD will count, when he writes up the peoples, “This one was born there.”", ref: "Psalm 87:5-6" },
    reflection:
      "The psalm is doing something startling: it lists Israel's enemies — Rahab, Babylon, Philistia, Tyre, Cush — and says of each, this one was born there. Foreigners registered as native-born citizens of Zion. The LORD records as he registers the peoples: this one was born there. It is a picture of God keeping a birth register that includes people nobody expected, and Paul builds the whole doctrine of the church on exactly this.",
    talk: "What would it mean for this child's name to be written in God's register?",
    pray: "Lord, you keep a register and you write in names nobody expected. Write this child's name in your book. Let them be counted as born in your city, whatever else is true of them.",
  },
  {
    read: { text: "the LORD, the God of my salvation, I have cried day and night before you. Let my prayer enter into your presence. Turn your ear to my cry.", ref: "Psalm 88:1-2" },
    reflection:
      "This is the one psalm that does not resolve. It ends with the word darkness and no turn, no comfort, no but. And yet look at how it begins: O LORD, God of my salvation. He is still addressing him, still calling him his salvation, while saying everything else has gone. God put a psalm with no happy ending in the book on purpose, for the people whose season does not have one yet.",
    talk: "Can you keep praying when nothing improves? What would that look like?",
    pray: "Lord, God of our salvation, we cry day and night and nothing has changed. Let our prayer come before you. We are still speaking to you, which is most of what we have.",
  },
  {
    read: { text: "Above the voices of many waters, the mighty breakers of the sea, the LORD on high is mighty.", ref: "Psalm 93:4" },
    reflection:
      "The psalm builds it deliberately: the floods have lifted up their voice, the floods lift up their roaring — and then, mightier than the thunders of many waters, the LORD on high is mighty. It is a comparison of volume. Whatever is currently the loudest thing in your life, the psalm does not deny that it is loud. It says there is something louder, and that his throne is established from everlasting.",
    talk: "What noise is loudest in your life right now?",
    pray: "Lord, you are mightier than the thunder of the waters. The noise in this house is real and you are louder. Let us hear you over it.",
  },
  {
    read: { text: "Oh come, let’s worship and bow down. Let’s kneel before the LORD, our Maker,", ref: "Psalm 95:6" },
    reflection:
      "Three verbs, all physical and all plural: come, let us worship and bow down, let us kneel before the LORD our Maker. The psalm has just been shouting joyfully to the rock of our salvation, so this is not a tonal instruction — it is the same gathering moving from noise to the floor. Worship in Scripture involves bodies and other people. Both the shout and the kneeling, and neither on its own.",
    talk: "Try kneeling together for a moment before you pray tonight.",
    pray: "Lord our Maker, we bow before you. Teach this house to worship with its whole self — the singing and the kneeling — rather than only in its head.",
  },
  {
    read: { text: "Sing to the LORD a new song! Sing to the LORD, all the earth.", ref: "Psalm 96:1" },
    reflection:
      "A new song, because there is new mercy to sing about — the phrase turns up whenever God has done something fresh, right through to the song in Revelation. It does not mean the old ones are worn out; it means the material keeps arriving. And the command goes to all the earth, which is a very large choir for a very small psalm. Whatever God does in this house this year is worth a song nobody has written yet.",
    talk: "What new thing has God done that deserves a new song?",
    pray: "Lord, we sing a new song to you, because you have done new things in this house that the old songs do not cover. Give us words for what you are doing now.",
  },
  {
    read: { text: "Light is sown for the righteous, and gladness for the upright in heart.", ref: "Psalm 97:11" },
    reflection:
      "Sown, not given — planted in the ground, out of sight, on a timescale the farmer does not control. Light is sown for the righteous and joy for the upright in heart. That explains a great deal about seasons where nothing seems to be happening: seed underground looks identical to no seed at all. The psalm is not promising immediate brightness. It is promising that something is already in the soil.",
    talk: "What has been sown in you that has not yet come up?",
    pray: "Lord, light is sown for the righteous and we cannot see any of it. Let it break through. Until it does, help us believe there is something in the ground.",
  },
  {
    read: { text: "Sing to the LORD a new song, for he has done marvelous things! His right hand and his holy arm have worked salvation for him.", ref: "Psalm 98:1" },
    reflection:
      "The reason is given before the command has finished landing: sing, for he has done marvellous things. And then the psalm points at the means — his right hand and his holy arm have worked salvation, which is to say he did it himself, without help. This is the psalm Isaac Watts turned into Joy to the World, written about the Lord coming to judge the earth with righteousness. Praise here is grounded in an act, not a mood.",
    talk: "What marvellous thing has God done for you? Say it aloud.",
    pray: "Lord, you have done marvellous things and your own arm accomplished it. We sing a new song. Let our praise rest on what you have done rather than on how we feel.",
  },
  {
    read: { text: "You answered them, the LORD our God. You are a God who forgave them, although you took vengeance for their doings.", ref: "Psalm 99:8" },
    reflection:
      "The sentence is uncomfortable and honest: you were a forgiving God to them, but an avenger of their wrongdoings. Both, of the same people, in the same breath. Moses was forgiven and did not enter the land. David was forgiven and the child died. Forgiveness in Scripture is real and it does not always cancel consequences, and a faith that promises otherwise will break the first time it is tested.",
    talk: "Have you experienced forgiveness alongside consequences? How did you hold both?",
    pray: "Lord, you forgive completely and you do not always undo what we have caused. We trust both. Give us the honesty to live with consequences without doubting the pardon.",
  },
  {
    read: { text: "I will be careful to live a blameless life. When will you come to me? I will walk within my house with a blameless heart.", ref: "Psalm 101:2" },
    reflection:
      "It is a king's manifesto, and the striking thing is where he locates the test: I will walk with integrity of heart within my house. Not in the court, not in public policy — at home, where nobody is watching and where a king has the most power and the least accountability. The psalm then lists what he will not tolerate in his own household. Home conduct is treated here as the real measure of a life.",
    talk: "Are you the same person at home as elsewhere? Where is the gap?",
    pray: "Lord, let us walk with integrity inside our own house — where nobody sees, where we are tired, and where we have the most power over the smallest people.",
  },
  {
    read: { text: "He causes the grass to grow for the livestock, and plants for man to cultivate, that he may produce food out of the earth: wine that makes the heart of man glad, oil to make his face to shine, and bread that strengthens man’s heart.", ref: "Psalm 104:14-15" },
    reflection:
      "The psalm is a tour of creation, and when it reaches food it does not stop at necessity. Wine to gladden the heart of man, oil to make his face shine, bread to strengthen his heart. God supplies more than the minimum, and the extra is named specifically as being for gladness. Christians who are suspicious of enjoyment have not read this psalm. He could have made calories. He made flavour.",
    talk: "What ordinary good has God given today that you have not noticed?",
    pray: "Lord, you give bread to strengthen and wine to gladden, and you did not have to. Thank you for ordinary good things. Let this house enjoy them without guilt.",
  },
  {
    read: { text: "Seek the LORD and his strength. Seek his face forever more.", ref: "Psalm 105:4" },
    reflection:
      "David gives this to Asaph on the day the ark comes into Jerusalem — the highest point of his reign, everything going well. And what he tells the nation at that moment is to seek the LORD and his strength, seek his presence continually. Not in the next crisis. Continually, which makes it a posture rather than an emergency measure. People who only seek God in trouble are always out of practice when it arrives.",
    talk: "What would seeking God look like this week, practically?",
    pray: "Lord, we seek your face — and mostly only when something has gone wrong. Keep us seeking on the ordinary days, so the road is familiar when we need it in a hurry.",
  },
  {
    read: { text: "Praise the LORD! Give thanks to the LORD, for he is good, for his loving kindness endures forever.", ref: "Psalm 106:1" },
    reflection:
      "Read what follows this opening line. The psalm is a long, unflinching catalogue of Israel's failures — they forgot, they rebelled, they made a calf, they grumbled, they sacrificed their children. And it begins with praise and thanksgiving anyway, because God's goodness is not a verdict on their record. That is how it is possible to be honest about a family's history and still start the prayer with thanks.",
    talk: "Can you praise God at the start of a list of your own failures?",
    pray: "Give thanks to the Lord, for he is good and his love endures for ever. Our record is not good and yours has never depended on ours. We start here anyway.",
  },
  {
    read: { text: "For your loving kindness is great above the heavens. Your faithfulness reaches to the skies.", ref: "Psalm 108:4" },
    reflection:
      "Notice what gets the cosmic measurement. Not his power, which would be the obvious thing, but his steadfast love — great above the heavens — and his faithfulness, reaching to the clouds. When David wants to describe something too large to take in, he reaches for the two qualities most of us quietly assume are limited. Power we expect to be infinite. Love and reliability we tend to budget for.",
    talk: "How big is God's love to you? Bigger than your worst fear?",
    pray: "Lord, your steadfast love is higher than the heavens and your faithfulness reaches the clouds. We have been rationing our expectations of both. Enlarge them.",
  },
  {
    read: { text: "for I am poor and needy. My heart is wounded within me.", ref: "Psalm 109:22" },
    reflection:
      "David has spent twenty verses asking God to deal with a man who repaid his love with accusation, and then the register changes completely: for I am poor and needy, and my heart is stricken within me. The Hebrew says pierced. No argument, no case, just the plain condition of a man who is hurt. Prayer is allowed to stop making a case and simply report the damage.",
    talk: "What has wounded you? Can you say it as simply as this?",
    pray: "Lord, we are poor and needy and our hearts are wounded inside us. We have no case to make tonight. That is the whole prayer.",
  },
  {
    read: { text: "the LORD says to my Lord, “Sit at my right hand, until I make your enemies your footstool for your feet.”", ref: "Psalm 110:1" },
    reflection:
      "This is the verse the New Testament quotes more than any other, and Jesus used it himself to silence the Pharisees: if David calls him Lord, how is he his son? Hebrews returns to it again and again to make one point — every other priest stood, because the work was never finished. This one sat down. The sitting is the proof that the thing is done, and he is seated there now while the rest is being brought under his feet.",
    talk: "Where is Jesus now? What difference does that make to today?",
    pray: "Lord Jesus, you are seated at the right hand because the work is finished. Reign over this house. We are not waiting for you to win; we are living under a victory already had.",
  },
  {
    read: { text: "He has caused his wonderful works to be remembered. the LORD is gracious and merciful.", ref: "Psalm 111:4" },
    reflection:
      "He has caused his wondrous works to be remembered — God builds the remembering in on purpose, because he knows what we are. The whole Old Testament is full of the machinery: festivals, stones, songs, a Passover meal eaten annually with a script for children's questions. Jesus did the same on his last night: do this in remembrance of me. Memory is not assumed. It is constructed, deliberately, by people who know they forget.",
    talk: "How does this house remember what God has done?",
    pray: "Lord, you cause your works to be remembered because you know we forget by Tuesday. Do not let us. Give this house things we keep and repeat until the children know them.",
  },
  {
    read: { text: "Tremble, you earth, at the presence of the Lord, at the presence of the God of Jacob,", ref: "Psalm 114:7" },
    reflection:
      "The psalm has been almost playful — the sea looked and fled, the mountains skipped like rams — and then it turns and addresses the earth directly: tremble at the presence of the Lord. It is the same God described elsewhere as gathering lambs in his arms and comforting like a mother. Both are true at once, and a household that has only one of them has either a tyrant or a mascot, and neither is him.",
    talk: "Do you hold both God's tenderness and his greatness? Which do you forget?",
    pray: "Lord, the earth trembles before you and you carry lambs in your arms. Be both to us. Let this house never shrink you down to something manageable.",
  },
  {
    read: { text: "Not to us, the LORD, not to us, but to your name give glory, for your loving kindness, and for your truth’s sake.", ref: "Psalm 115:1" },
    reflection:
      "Said twice in one breath, which is what people do when the instinct being resisted is strong. And the psalm goes straight on to mock idols — mouths that do not speak, eyes that do not see — before the warning that those who make them become like them. Refusing the credit is not modesty here; it is the difference between worshipping God and worshipping something you had a hand in making, including your own competence.",
    talk: "Where have you quietly taken glory that belongs to God?",
    pray: "Not to us, Lord, not to us, but to your name give glory. Where this house has been quietly taking credit for what you did, take it back.",
  },
  {
    read: { text: "Praise the LORD, all you nations! Extol him, all you peoples! For his loving kindness is great toward us. the LORD’s faithfulness endures forever. Praise Yah!", ref: "Psalm 117:1-2" },
    reflection:
      "Two verses, the shortest chapter in the Bible, and Paul quotes it in Romans to prove that the Gentiles were always meant to be in. Praise the LORD, all nations — and then the reason: great is his steadfast love toward us. The us is Israel; the invitation is to everyone. God's particular kindness to one people was never meant to stay there, and the psalm is the smallest and clearest statement of it.",
    talk: "What would you say about God in two lines?",
    pray: "Praise the Lord, all nations. His steadfast love toward us is great and it was never meant to stop with us. Let this house be glad that the door is wide.",
  },
  {
    read: { text: "In my distress, I cried to the LORD. He answered me.", ref: "Psalm 120:1" },
    reflection:
      "It is the first of the songs of ascents, sung on the road up to Jerusalem, and it opens with the whole story in one line: in my distress I called to the LORD, and he answered me. Nothing between the two clauses except the calling. Then the psalm goes on to describe lying tongues and living among people who hate peace — the trouble is not over. The answer came; the situation continued. Both are in the same psalm.",
    talk: "What distress has gone uncried-about?",
    pray: "Lord, in our distress we call to you, because there is nothing between the trouble and you except the calling. Answer us — and be with us if the trouble stays.",
  },
  {
    read: { text: "I was glad when they said to me, “Let’s go to the LORD’s house!”", ref: "Psalm 122:1" },
    reflection:
      "I was glad when they said to me — the gladness is at the invitation, before the journey has even started. And it is plural: let us go. This is a pilgrim's song, sung by people walking together to worship, and the pleasure in it is social as much as spiritual. That instinct is learned young. A child who grows up watching their parents look forward to gathering with God's people has been given something no argument supplies.",
    talk: "Is going to church a gladness or a duty for you? What would move it?",
    pray: "Lord, make us glad to go to your house — and let that gladness be visible, so that this child learns it by watching rather than by being made to go.",
  },
  {
    read: { text: "Behold, as the eyes of servants look to the hand of their master, as the eyes of a maid to the hand of her mistress; so our eyes look to the LORD, our God, until he has mercy on us.", ref: "Psalm 123:2" },
    reflection:
      "The image is a servant watching a hand, not a face — because instructions came by gesture, and a servant who looked away missed it. It is a picture of attention that costs something, sustained over time. And the psalm adds the honest ending: until he has mercy on us. They are still waiting. This is watching in the gap, which is where almost all of the Christian life is actually spent.",
    talk: "How attentive are you to God through an ordinary day?",
    pray: "Lord, our eyes look to you the way a servant watches a hand, and we keep looking away. Hold our attention until you have mercy on us.",
  },
  {
    read: { text: "Our help is in the LORD’s name, who made heaven and earth.", ref: "Psalm 124:8" },
    reflection:
      "The psalm has just described near-disaster — if the LORD had not been on our side, the flood would have swept us away, the waters would have gone over us. And it ends on this, which the church has used as a call to worship for centuries. Our help is in the name of the LORD, who made heaven and earth. The maker of everything is where help is located, and the psalm arrives at it by looking back at what nearly happened.",
    talk: "Where do you look for help first?",
    pray: "Our help is in the name of the Lord, who made heaven and earth. Looking back, we can see what nearly took us under. Thank you. Be our help again.",
  },
  {
    read: { text: "As the mountains surround Jerusalem, so the LORD surrounds his people from this time forward and forever more.", ref: "Psalm 125:2" },
    reflection:
      "Anyone who has stood in Jerusalem knows the geography is exact — the city sits in a bowl with hills on every side. The psalm takes something the pilgrims could see and makes it a statement about God: as the mountains surround Jerusalem, so the LORD surrounds his people, from this time forth and for evermore. Not a wall they built. A landscape they arrived into, already in place.",
    talk: "What are you afraid is unprotected?",
    pray: "Lord, surround this house as the mountains surround the city — on every side, and already there before we noticed. From this time forth and for evermore.",
  },
  {
    read: { text: "Blessed is everyone who fears the LORD, who walks in his ways.", ref: "Psalm 128:1" },
    reflection:
      "The psalm goes on to a table, a wife like a fruitful vine, children like olive shoots — and it is a picture of ordinary blessing rather than a contract. Read it as a guarantee and it will eventually wound somebody godly and childless or godly and hungry. Read it as what God delights to give, and it becomes what it is: a household looking around at ordinary mercies and recognising where they came from.",
    talk: "What ordinary blessings are here today that you have stopped noticing?",
    pray: "Lord, thank you for the ordinary mercies of this house — the table, the work, the people at it. We hold them as gifts rather than as terms we have met.",
  },
  {
    read: { text: "many times they have afflicted me from my youth up, yet they have not prevailed against me.", ref: "Psalm 129:2" },
    reflection:
      "Greatly have they afflicted me from my youth — and then, twice, the same verb: yet they have not prevailed against me. Not defeated them. Not been vindicated. Survived. The psalm's whole claim is that the affliction was long, real, and did not win. For a household in a stretch that has gone on for years, that is a truer comfort than a promise of victory, and the Bible offers it without embarrassment.",
    talk: "What have you survived? Is survival a form of faithfulness?",
    pray: "Lord, this has gone on a long time and it has not finished us. They have not prevailed against us. Keep us standing — that will be enough for today.",
  },
  {
    read: { text: "I will abundantly bless her provision. I will satisfy her poor with bread.", ref: "Psalm 132:15" },
    reflection:
      "God is speaking about Zion, and among the promises about priests and a horn for David there is this: I will abundantly bless her provisions, I will satisfy her poor with bread. The supply of food is named alongside the great covenant promises, as though it belonged there. It does. Jesus taught his disciples to ask for daily bread in the same prayer as the coming of the kingdom.",
    talk: "What provision do you need? Have you asked plainly?",
    pray: "Lord, bless the provisions of this house, and satisfy the poor with bread — here, and in the streets around us where we know people are going without.",
  },
  {
    read: { text: "See how good and how pleasant it is for brothers to live together in unity!", ref: "Psalm 133:1" },
    reflection:
      "Good and pleasant — two different words, and both are needed. Unity is right, and it is also enjoyable, which is a claim worth making because most people experience keeping the peace as neither. The images that follow are extravagant: oil running down Aaron's beard onto his collar, dew on Hermon. Excessive, deliberately. The psalm thinks people living together well is worth that much poetry.",
    talk: "What is costing this house its unity right now?",
    pray: "Lord, make this house dwell together in unity — and let it be pleasant and not merely correct. Give us peace that is enjoyed rather than maintained.",
  },
  {
    read: { text: "Look! Praise the LORD, all you servants of the LORD, who stand by night in the LORD’s house! Lift up your hands in the sanctuary. Praise the LORD!", ref: "Psalm 134:1-2" },
    reflection:
      "The last of the songs of ascents, and it is addressed to the men on the night shift in the temple — you who stand by night in the house of the LORD. The pilgrims have gone home; these are the ones left awake while everyone else sleeps, and the psalm turns to them and tells them to bless the LORD and lift their hands. Somebody is always on the night watch. This one is for them.",
    talk: "Who is on the night watch in this house? Could that become worship?",
    pray: "Lord, whoever in this house is awake tonight, let them bless you rather than only endure it. Lift our hands in the small hours. Bless us from Zion while we watch.",
  },
  {
    read: { text: "Whatever the LORD pleased, that he has done, in heaven and in earth, in the seas and in all deeps.", ref: "Psalm 135:6" },
    reflection:
      "Whatever the LORD pleases, he does — in heaven and on earth, in the seas and all deeps. The psalm sets it directly against the idols of the nations, which have mouths and do not speak. The claim is total and it is meant to be a comfort rather than a threat: nothing that has happened to this family arrived outside his knowledge or his permission, and that is the only alternative to a universe running itself.",
    talk: "Is that a comfort or a difficulty to you? Why?",
    pray: "Lord, you do whatever pleases you in heaven and earth, and nothing has reached us that did not come past you. We rest under your rule, including the parts we do not understand.",
  },
  {
    read: { text: "By the rivers of Babylon, there we sat down. Yes, we wept, when we remembered Zion.", ref: "Psalm 137:1" },
    reflection:
      "By the waters of Babylon, there we sat down and wept. It is a psalm of raw dislocation — their captors asking for one of the songs of Zion as entertainment, and the refusal: how shall we sing the LORD's song in a foreign land. The psalm ends somewhere genuinely shocking, and God kept it anyway. He did not require his people to tidy their grief or their rage before putting it in the book.",
    talk: "What have you lost that you still weep for?",
    pray: "Lord, we sit and weep and we do not feel like singing. You kept the laments in your book without correcting them. Take ours the same way.",
  },
  {
    read: { text: "I know that the LORD will maintain the cause of the afflicted, and justice for the needy.", ref: "Psalm 140:12" },
    reflection:
      "I know — a settled certainty, stated after a psalm full of evildoers who plan trouble and sharpen their tongues like serpents. He does not say he can see it happening. He says he knows the LORD will maintain the cause of the afflicted and execute justice for the needy. This is one of the oldest and most consistent claims in Scripture, and it is the ground under every unanswered injustice.",
    talk: "Do you believe God takes the side of the afflicted? What follows from that?",
    pray: "Lord, maintain the cause of the afflicted and do justice for the needy, because nobody else is going to. Where we have given up expecting it, restore our certainty.",
  },
  {
    read: { text: "Set a watch, the LORD, before my mouth. Keep the door of my lips.", ref: "Psalm 141:3" },
    reflection:
      "David asks God to do it, which is the interesting part — set a guard over my mouth, keep watch over the door of my lips. Not I will be careful. He has evidently tried that. And the next verse asks that his heart not be drawn to evil, which is the source the mouth draws from. James says nobody can tame the tongue, and David seems to have worked that out a thousand years earlier.",
    talk: "What did you say this week that you would take back?",
    pray: "Lord, set a guard over our mouths, because we cannot manage them ourselves. Watch the door of our lips — especially in this house, at the end of a long day.",
  },
  {
    read: { text: "the LORD, what is man, that you care for him? Or the son of man, that you think of him? Man is like a breath. His days are like a shadow that passes away.", ref: "Psalm 144:3-4" },
    reflection:
      "David is a king with armies, and he describes a human being as a breath, a passing shadow. It ought to be bleak and it is not, because the question in front of it is the real subject: what is man that you regard him? The brevity is not the point. The astonishment is that something this brief is attended to at all, and the New Testament answers the question by pointing at a manger and a cross.",
    talk: "How does the brevity of life change how you spend today?",
    pray: "Lord, we are a breath and a shadow that passes, and you care for us. We do not understand it. Thank you. Let us hold our few days lightly and gratefully.",
  },
  {
    read: { text: "Happy is he who has the God of Jacob for his help, whose hope is in the LORD, his God:", ref: "Psalm 146:5" },
    reflection:
      "The psalm has just said do not put your trust in princes, in a son of man in whom there is no salvation — his plans perish the day he dies. Then the contrast: blessed is he whose help is the God of Jacob, whose hope is in the LORD his God. Happiness is located in whose help you are relying on, not in how well things are going. The rest of the psalm lists what that God actually does.",
    talk: "Whose help are you relying on? Is it enough?",
    pray: "Lord, blessed are those whose help is the God of Jacob. Take our trust off the things that die with the people holding them. Our hope is in you.",
  },
  {
    read: { text: "both young men and maidens; old men and children: let them praise the LORD’s name, for his name alone is exalted. His glory is above the earth and the heavens.", ref: "Psalm 148:12-13" },
    reflection:
      "The psalm has called on sun, moon, stars, sea creatures, fire, hail, mountains, trees and beasts, and then it reaches people — kings and princes, young men and maidens, old men and children. Every age is named, deliberately, with children last on the list and fully on it. The smallest person in your house is already enlisted in this. Nobody has to reach a certain age before their praise counts.",
    talk: "How will this child learn to praise? Who will show them?",
    pray: "Lord, let every age in this house praise your name — the oldest and the one not yet born. Your name alone is exalted, and none of us is too small to say so.",
  },
  {
    read: { text: "For the LORD takes pleasure in his people. He crowns the humble with salvation.", ref: "Psalm 149:4" },
    reflection:
      "The LORD takes pleasure in his people. Not tolerates, not permits — takes pleasure, the same word used of God delighting in his own creation. Zephaniah says he exults over them with loud singing. It is one of the hardest things in Scripture to actually receive, because most of us can believe we are forgiven long before we can believe we are enjoyed. And then: he adorns the humble with salvation.",
    talk: "Do you believe God takes pleasure in you? What blocks it?",
    pray: "Lord, you take pleasure in your people and we can barely credit it about ourselves. Teach us to believe it. Adorn the humble in this house with salvation.",
  },
  {
    read: { text: "Let everything that has breath praise Yah! Praise Yah!", ref: "Psalm 150:6" },
    reflection:
      "The last line of the Psalter, after a hundred and fifty psalms that have included rage, despair, revenge and a psalm that ends in darkness. All of it lands here: let everything that has breath praise the LORD. Breath is the only qualification — not maturity, not understanding, not having sorted anything out. The child about to take a first breath in this house is already included in the final sentence of the book.",
    talk: "What will you teach this child to praise God for first?",
    pray: "Let everything that has breath praise the Lord. That is the only entry requirement, and it includes the smallest person here. Put praise in this house from the first breath.",
  },
  {
    read: { text: "This book of the law shall not depart from your mouth, but you shall meditate on it day and night, that you may observe to do according to all that is written in it; for then you shall make your way prosperous, and then you shall have good success.", ref: "Joshua 1:8" },
    reflection:
      "Joshua has just taken over from Moses and is about to lead a nation into a war. What God gives him is not a battle plan but a book, and the word for meditate means to mutter — to say it under your breath, repeatedly, until it is in the mouth without effort. The point is not to earn favour. It is so that the word is already in you on the day there is no time to go and look it up.",
    talk: "What do you think about when your mind is free?",
    pray: "Lord, put your word in our mouths and our minds, day and night, until we are saying it without noticing. Let it be there before the day we need it.",
  },
  {
    read: { text: "Then Gideon built an altar there to the LORD, and called it “the LORD is Peace.” To this day it is still in Ophrah of the Abiezrites.", ref: "Judges 6:24" },
    reflection:
      "Gideon has just realised he has seen the angel of the LORD face to face and is convinced he is about to die. God says to him, peace be to you, do not fear. So he builds an altar and names it after the thing he had just been given: The LORD is Peace. The names people give God in Scripture are usually what they most needed from him and received. His was not courage. It was permission to stop being afraid.",
    talk: "What would you name God, out of this season?",
    pray: "Lord, you are our peace — you said it to a frightened man before he had done anything brave. Be that to this house. Take the fear down to something we can live with.",
  },
  {
    read: { text: "May the LORD repay your work, and a full reward be given to you from the LORD, the God of Israel, under whose wings you have come to take refuge.", ref: "Ruth 2:12" },
    reflection:
      "Boaz says this to a Moabite widow gleaning in his field, and he uses the language of a bird sheltering its young — under whose wings you have come to take refuge. She is a foreigner from a people Israel was told to keep away from, and he blesses her as one who has come in under the God of Israel. Then he becomes the answer to his own prayer. That happens more often than we notice.",
    talk: "Who has taken refuge with you? Have you blessed them?",
    pray: "Lord, we take refuge under your wings, and we were outsiders too. Make this house shelter for someone else — and let us not be surprised if you answer through us.",
  },
  {
    read: { text: "Moreover as for me, far be it from me that I should sin against the LORD in ceasing to pray for you: but I will instruct you in the good and the right way.", ref: "1 Samuel 12:23" },
    reflection:
      "Samuel is being retired. The people have rejected him and asked for a king, and he has every reason to wash his hands of them. Instead he says that ceasing to pray for them would be a sin against the LORD. Not unkind, not disappointing — sin. That reframes every relationship we have quietly let lapse. Praying for people is not a favour we extend to those who deserve it.",
    talk: "Who have you stopped praying for? Why did you stop?",
    pray: "Lord, forgive the prayers we have abandoned — for people who disappointed us, and for people we simply forgot. Make us faithful in interceding, especially where it is costly.",
  },
  {
    read: { text: "David was greatly distressed; for the people spoke of stoning him, because the souls of all the people were grieved, every man for his sons and for his daughters; but David strengthened himself in the LORD his God.", ref: "1 Samuel 30:6" },
    reflection:
      "Ziklag is burned, the families are taken, and David's own men are talking about stoning him. There is nobody left to encourage him — the text is specific about that. And then: but David strengthened himself in the LORD his God. It is a reflexive verb; he had to do it to himself, from a source outside himself. That is a skill worth having before the day arrives when nobody is available to do it for you.",
    talk: "When no one encourages you, how do you strengthen yourself in the Lord?",
    pray: "Lord, when there is no one to encourage us, teach us to strengthen ourselves in you. Give us that habit now, before the day we cannot borrow it from anyone.",
  },
  {
    read: { text: "Then David the king went in, and sat before the LORD; and he said, “Who am I, Lord the LORD, and what is my house, that you have brought me this far?”", ref: "2 Samuel 7:18" },
    reflection:
      "God has just promised David a house and a throne for ever, and David's response is to go in and sit down — an odd posture for prayer, the posture of a man too overwhelmed to stand. Who am I, and what is my house, that you have brought me thus far? Grace received properly always has this effect. It makes a person smaller in their own eyes, not larger, and David's greatest moment produces his humblest sentence.",
    talk: "How do you respond to God's kindness — entitlement or astonishment?",
    pray: "Who are we, Lord, and what is this house, that you have brought us this far? We did not arrange any of it. Keep what you give us from making us think better of ourselves.",
  },
  {
    read: { text: "For you are my lamp, the LORD. the LORD will light up my darkness.", ref: "2 Samuel 22:29" },
    reflection:
      "David's last song, looking back over a life of caves and betrayals and war. You are my lamp, O LORD; the LORD lightens my darkness. Not removes it — lightens it, gives light in it. That is a more modest claim than we usually want and a more honest one. The darkness was real and lasted years. What he testifies to is that there was light in it, and where the light came from.",
    talk: "Do you expect God to remove the dark, or to be light in it?",
    pray: "Lord, you are our lamp. Light up our darkness — we are not asking you to end it tonight, only to give us enough to see by while it lasts.",
  },
  {
    read: { text: "Give your servant therefore an understanding heart to judge your people, that I may discern between good and evil; for who is able to judge this great people of yours?", ref: "1 Kings 3:9" },
    reflection:
      "God offers a young king anything, and Solomon asks for a listening heart — the Hebrew is literally a hearing heart — to discern between good and evil, because who is able to govern this great people of yours? He asks for competence at the job he has been given rather than escape from it, or wealth, or a longer life. And God is pleased, and gives him the rest as well.",
    talk: "If you could ask God one thing for this season, what would it be?",
    pray: "Lord, give us listening hearts for what you have actually given us to do. We keep asking for different circumstances. Make us able for these ones.",
  },
  {
    read: { text: "But will God in very deed dwell on the earth? Behold, heaven and the heaven of heavens can’t contain you; how much less this house that I have built!", ref: "1 Kings 8:27" },
    reflection:
      "It is the strangest dedication speech in Scripture. Solomon has just finished seven years of building the most magnificent structure in Israel's history, and he stands up in front of it and says God will not fit. Heaven and the highest heaven cannot contain you; how much less this house that I have built. The right response to having built something for God is to admit its inadequacy out loud.",
    talk: "What small container have you tried to keep God in?",
    pray: "Lord, the highest heaven cannot contain you and our ideas of you are smaller than that. Forgive them. Do not let us shrink you to the size of what we can manage.",
  },
  {
    read: { text: "He said, “Go out, and stand on the mountain before the LORD.” Behold, the LORD passed by, and a great and strong wind tore the mountains, and broke in pieces the rocks before the LORD; but the LORD was not in the wind. After the wind there was an earthquake; but the LORD was not in the earthquake. After the earthquake a fire passed; but the LORD was not in the fire. After the fire, there was a still small voice.", ref: "1 Kings 19:11-12" },
    reflection:
      "Elijah has just called down fire from heaven on Carmel. If anyone had grounds to expect God in the spectacular, it was him — and the wind, the earthquake and the fire all pass by and God is in none of them. Then a sound of a low whisper, and he covers his face. Having seen God do the dramatic thing, he meets him in the quiet one, at the point of complete exhaustion.",
    talk: "Do you only expect God in dramatic moments?",
    pray: "Lord, you came to Elijah in a whisper after the fire. Give us ears quiet enough. We have been listening for something loud and missing what you are actually saying.",
  },
  {
    read: { text: "Elisha said to her, “What should I do for you? Tell me: what do you have in the house?” She said, “Your servant has nothing in the house, except a pot of oil.”", ref: "2 Kings 4:2" },
    reflection:
      "She has nothing. Her husband is dead, the creditor is coming for her two sons, and Elisha's question sounds almost cruel: what do you have in the house? Nothing, she says, except a jar of oil — the except is where the miracle starts. God repeatedly begins with the thing someone has already dismissed as not worth mentioning. Five loaves. Two fish. A jar of oil that barely counts.",
    talk: "What little thing have you dismissed as too small?",
    pray: "Lord, what we have is small and we have been apologising for it. Take it. Do with it what you did with the oil, and let us stop waiting until we have something impressive.",
  },
  {
    read: { text: "Hezekiah received the letter from the hand of the messengers and read it. Then Hezekiah went up to the LORD’s house, and spread it before the LORD.", ref: "2 Kings 19:14" },
    reflection:
      "The Assyrian letter is designed to break morale, and it is effective — it mocks God by name. Hezekiah does not draft a reply, call a council, or negotiate. He carries the letter up to the temple and spreads it out in front of the LORD, which is a wonderfully physical act of prayer. Here it is. You read it. Then he prays, and the answer comes through Isaiah that night.",
    talk: "What would it mean to literally spread today's bad news before God?",
    pray: "Lord, we spread it out in front of you, because we have no answer of our own. Read it. Deal with it as you see fit — we are not able to.",
  },
  {
    read: { text: "Jabez called on the God of Israel, saying, “Oh that you would bless me indeed, and enlarge my border! May your hand be with me, and may you keep me from evil, that I may not cause pain!” God granted him that which he requested.", ref: "1 Chronicles 4:10" },
    reflection:
      "Nine chapters of genealogy, and then two verses about a man whose name means pain, whose mother gave it to him because she bore him in sorrow. He asks God for blessing, for enlarged borders, for God's hand with him, and to be kept from harm — and God granted what he asked. It is not a formula, whatever has been made of it. It is a note that God hears ordinary people with painful names.",
    talk: "Does it comfort you that God hears ordinary people in long lists?",
    pray: "Lord, you heard one man in the middle of a list of names, and you granted what he asked. Hear us. We are nobody in particular and that has never stopped you.",
  },
  {
    read: { text: "But who am I, and what is my people, that we should be able to offer so willingly as this? For all things come from you, and we have given you of your own.", ref: "1 Chronicles 29:14" },
    reflection:
      "David has just led the largest offering in Israel's history for the temple, and the people have given willingly — and what he says is that none of it was theirs. All things come from you, and of your own have we given you. It is the clearest statement in Scripture about what giving actually is: handing back a portion of what was already on loan. There is nothing to be proud of in generosity, which is why generous people are rarely smug.",
    talk: "Do you feel generous when you give, or grateful?",
    pray: "Lord, everything we gave was already yours and we were only passing it back. Keep pride out of our giving. Let us hold what you have entrusted with open hands.",
  },
  {
    read: { text: "if my people, who are called by my name, will humble themselves, pray, seek my face, and turn from their wicked ways; then I will hear from heaven, will forgive their sin, and will heal their land.", ref: "2 Chronicles 7:14" },
    reflection:
      "Read it in context before applying it. God is answering Solomon about the temple, about this land, to this covenant nation, with drought and locusts and plague in view. It is not a formula for any modern country. But the heart of it is as old as God himself and never expires: humble yourselves, pray, seek my face, turn. And the promise attached is his own character — I will hear, I will forgive, I will heal.",
    talk: "Why does context matter when reading a promise?",
    pray: "Lord, humble us, and turn us from what we have been excusing. Hear us for Christ's sake rather than for our own. Heal what has gone wrong in this house.",
  },
  {
    read: { text: "Our God, will you not judge them? For we have no might against this great company that comes against us. We don’t know what to do, but our eyes are on you.", ref: "2 Chronicles 20:12" },
    reflection:
      "Three armies are coming and Jehoshaphat prays in front of the whole nation, ending with the most honest sentence any leader has spoken: we do not know what to do, but our eyes are on you. Not a plan disguised as a prayer. Total helplessness and total attention in one breath — and both of those are faith. The answer comes back that the battle is not theirs but God's.",
    talk: "Can you pray 'we don't know what to do' without treating it as failure?",
    pray: "Lord, we do not know what to do, and we are not going to pretend we have a plan. Our eyes are on you. The battle is not ours.",
  },
  {
    read: { text: "They sang to one another in praising and giving thanks to the LORD, “For he is good, for his loving kindness endures forever toward Israel.” All the people shouted with a great shout, when they praised the LORD, because the foundation of the LORD’s house had been laid.", ref: "Ezra 3:11" },
    reflection:
      "They lay the foundation of the second temple and sing the old refrain — he is good, his steadfast love endures for ever — and shout. And Ezra adds that the old men who had seen the first temple wept aloud, so that nobody could tell the shouting from the weeping. Both at once, at the same foundation. Praise for what is, offered by people who remember something bigger, is a hard and honest thing.",
    talk: "Can you praise for something smaller than you hoped for?",
    pray: "Lord, you are good and your love endures for ever. We praise you for what we actually have rather than for what we hoped for. Take the shouting and the weeping together.",
  },
  {
    read: { text: "When I heard these words, I sat down and wept, and mourned several days; and I fasted and prayed before the God of heaven,", ref: "Nehemiah 1:4" },
    reflection:
      "Nehemiah is a competent man — cupbearer to a king, later a project manager of extraordinary ability. And when he hears that the walls are broken down, his first act is not a plan. He sits down and weeps, and mourns for days, and fasts and prays. The building comes later and it comes well. But the order matters, and it is the order most capable people get wrong.",
    talk: "What do you do first with bad news?",
    pray: "Lord, let our first response to trouble be grief and prayer rather than a plan. Give us time to feel it properly before we start fixing it.",
  },
  {
    read: { text: "Go, gather together all the Jews who are present in Susa, and fast for me, and neither eat nor drink three days, night or day. I and my maidens will also fast the same way. Then I will go in to the king, which is against the law; and if I perish, I perish.", ref: "Esther 4:16" },
    reflection:
      "If I perish, I perish. It is not confidence about the outcome — she has no assurance she will survive going to the king uninvited, and says so. What she has is a decision made without one. That is the difference between courage and optimism, and Scripture consistently commends the first. The three young men said something structurally identical in front of a furnace: our God is able, and if not, we still will not bow.",
    talk: "What would you do if you were willing to lose?",
    pray: "Lord, make us willing to obey without knowing how it ends. Give us Esther's kind of nerve — not certainty about the result, just a decision made anyway.",
  },
  {
    read: { text: "who does great things that can’t be fathomed, marvelous things without number;", ref: "Job 5:9" },
    reflection:
      "Eliphaz says this, and one of the uncomfortable things about the book of Job is that his friends say true things and apply them badly. The sentence itself stands: God does great things beyond searching out, marvellous things without number. Job ends with God saying exactly that at enormous length and never explaining anything. Some of what he does will not be explained to us, and the book does not treat that as a problem to be solved.",
    talk: "What do you want explained? Can you live without the explanation?",
    pray: "Lord, you do great things beyond our searching out, and we will not get most of the explanations. We trust you. Let us stop requiring you to make sense to us first.",
  },
  {
    read: { text: "Behold, he will kill me. I have no hope. Nevertheless, I will maintain my ways before him.", ref: "Job 13:15" },
    reflection:
      "The Hebrew here is difficult and the older translation is famous: though he slay me, yet will I trust him. Either reading lands in the same place — a man with no expectation of rescue, who is still going to hold his position before God rather than curse him and be done. It is faith with nothing cheerful in it, and it is the kind the book of Job commends and the friends never manage.",
    talk: "Is faith without hopefulness still faith? What does Job suggest?",
    pray: "Lord, even if this does not end the way we are asking, we will hold to you. We have nowhere else to go. Let that be counted as faith, because it is all we have.",
  },
  {
    read: { text: "But as for me, I know that my Redeemer lives. In the end, he will stand upon the earth.", ref: "Job 19:25" },
    reflection:
      "But as for me, I know that my Redeemer lives. In total loss, Job holds one thing — not an explanation, a person.",
    talk: "When everything is uncertain, what is the one thing you know?",
    pray: "Lord, we know that our Redeemer lives.",
  },
  {
    read: { text: "Where were you when I laid the foundations of the earth? Declare, if you have understanding.", ref: "Job 38:4" },
    reflection:
      "Where were you when I laid the foundations of the earth? God's answer to Job's suffering is questions about creation — an invitation to be small before someone vast.",
    talk: "Why might being reminded of your smallness be a comfort?",
    pray: "Lord, we were not there. You are God and we are not.",
  },
  {
    read: { text: "Don’t be rash with your mouth, and don’t let your heart be hasty to utter anything before God; for God is in heaven, and you on earth. Therefore let your words be few.", ref: "Ecclesiastes 5:2" },
    reflection:
      "God is in heaven, and you on earth. Therefore let your words be few. God is not persuaded by volume.",
    talk: "Are your prayers performances or conversations?",
    pray: "Lord, you are in heaven and we are on earth. Receive our few words.",
  },
  {
    read: { text: "In the day of prosperity be joyful, and in the day of adversity consider; yes, God has made the one side by side with the other, to the end that man should not find out anything after him.", ref: "Ecclesiastes 7:14" },
    reflection:
      "In the day of prosperity be joyful, and in the day of adversity consider; yes, God has made the one side by side with the other.",
    talk: "Which day are you in? What is it asking of you?",
    pray: "Lord, you make both days. We take both from your hand.",
  },
  {
    read: { text: "This is the end of the matter. All has been heard. Fear God and keep his commandments; for this is the whole duty of man.", ref: "Ecclesiastes 12:13" },
    reflection:
      "Fear God and keep his commandments; for this is the whole duty of man. A settled place to stand when nothing else makes sense.",
    talk: "What would 'the whole duty of man' simplify for you this week?",
    pray: "Lord, when nothing makes sense, hold us to this: fear God and keep his word.",
  },
  {
    read: { text: "For behold, the winter is past. The rain is over and gone. The flowers appear on the earth. The time of the singing has come, and the voice of the turtledove is heard in our land.", ref: "Song of Solomon 2:11-12" },
    reflection:
      "For, behold, the winter is past. The rain is over and gone. The flowers appear on the earth. Seasons change. Winters end.",
    talk: "What winter are you in? What would spring look like?",
    pray: "Lord, winters pass. Bring us to the time of singing.",
  },
  {
    read: { text: "Behold, God is my salvation. I will trust, and will not be afraid; for Yah, the LORD, is my strength and song; and he has become my salvation.", ref: "Isaiah 12:2" },
    reflection:
      "Behold, God is my salvation. I will trust, and will not be afraid. Isaiah quotes the song at the Red Sea. Old rescues fund present courage.",
    talk: "What past rescue should be funding your courage now?",
    pray: "Lord, you are our strength and our song. We will trust and not be afraid.",
  },
  {
    read: { text: "He has swallowed up death forever! The Lord the LORD will wipe away tears from off all faces. He will take the reproach of his people away from off all the earth, for the LORD has spoken it.", ref: "Isaiah 25:8" },
    reflection:
      "He has swallowed up death forever! The Lord the LORD will wipe away tears from off all faces. Death not managed but swallowed.",
    talk: "What tears do you most want wiped?",
    pray: "Lord, you will swallow up death forever. Come quickly.",
  },
  {
    read: { text: "A man shall be as a hiding place from the wind, and a covert from the storm, as streams of water in a dry place, as the shade of a large rock in a weary land.", ref: "Isaiah 32:2" },
    reflection:
      "A man shall be as a hiding place from the wind... as the shade of a great rock in a weary land. A picture of what one person can be to another.",
    talk: "Are you a shelter to your spouse right now, or another weather system?",
    pray: "Lord, make us shelter to one another in a weary land.",
  },
  {
    read: { text: "Strengthen the weak hands, and make the feeble knees firm. Tell those who have a fearful heart, “Be strong! Don’t be afraid! Behold, your God will come with vengeance, God’s retribution. He will come and save you.”", ref: "Isaiah 35:3-4" },
    reflection:
      "Strengthen the weak hands, and make the feeble knees firm. Tell those who have a fearful heart, 'Be strong! Don't be afraid!' Someone must say this to someone.",
    talk: "Whose hands are weak? Say the words to them now.",
    pray: "Lord, strengthen the weak hands here, and steady the feeble knees.",
  },
  {
    read: { text: "For I, the LORD your God, will hold your right hand, saying to you, ‘Don’t be afraid. I will help you.", ref: "Isaiah 41:13" },
    reflection:
      "For I, the LORD your God, will hold your right hand, saying to you, 'Don't be afraid. I will help you.' A hand held, and words spoken.",
    talk: "What are you afraid of? Pray this verse over it.",
    pray: "Lord, hold our right hands. Do not let fear rule this house.",
  },
  {
    read: { text: "I will give you the treasures of darkness and hidden riches of secret places, that you may know that it is I, the LORD, who call you by your name, even the God of Israel.", ref: "Isaiah 45:3" },
    reflection:
      "I will give you the treasures of darkness and hidden riches of secret places, that you may know that it is I, the LORD, who call you by your name.",
    talk: "What has a dark season given you that light could not?",
    pray: "Lord, give us the treasures of darkness, that we may know you.",
  },
  {
    read: { text: "Behold, I have refined you, but not as silver. I have chosen you in the furnace of affliction.", ref: "Isaiah 48:10" },
    reflection:
      "Behold, I have refined you, but not as silver. I have chosen you in the furnace of affliction. Chosen in the furnace, not despite it.",
    talk: "What furnace have you been in? What might God have been doing?",
    pray: "Lord, you choose us in the furnace. Do not waste ours.",
  },
  {
    read: { text: "Who among you fears the LORD and obeys the voice of his servant? He who walks in darkness and has no light, let him trust in the LORD’s name, and rely on his God.", ref: "Isaiah 50:10" },
    reflection:
      "Who among you fears the LORD... who walks in darkness and has no light? Let him trust in the LORD's name. God-fearing people walk in the dark. It is not assumed to be sin.",
    talk: "Have you assumed darkness means you did something wrong?",
    pray: "Lord, we walk in darkness. We will trust in your name.",
  },
  {
    read: { text: "For the high and lofty One who inhabits eternity, whose name is Holy, says: “I dwell in the high and holy place, with him also who is of a contrite and humble spirit, to revive the spirit of the humble, and to revive the heart of the contrite.”", ref: "Isaiah 57:15" },
    reflection:
      "I dwell in the high and holy place, with him also who is of a contrite and humble spirit. God's two addresses: the highest place, and the broken heart.",
    talk: "Do you believe God wants to be near you at your lowest?",
    pray: "High and holy Lord, dwell with us in our lowness.",
  },
  {
    read: { text: "You will also be a crown of beauty in the LORD‘s hand, and a royal diadem in your God’s hand.", ref: "Isaiah 62:3" },
    reflection:
      "You will also be a crown of beauty in the LORD's hand, and a royal diadem in the hand of your God. Held up as something beautiful, in his hand.",
    talk: "Can you believe God sees you as beautiful? What blocks it?",
    pray: "Lord, hold us as a crown of beauty in your hand.",
  },
  {
    read: { text: "Your words were found, and I ate them. Your words were to me a joy and the rejoicing of my heart, for I am called by your name, the LORD, God of Armies.", ref: "Jeremiah 15:16" },
    reflection:
      "Your words were found, and I ate them. Your words were to me a joy and the rejoicing of my heart. Said by the most miserable prophet in Scripture.",
    talk: "Do you eat Scripture, or skim it? What would eating look like?",
    pray: "Lord, your words were found and we ate them. Be our joy.",
  },
  {
    read: { text: "the LORD appeared of old to me, saying, “Yes, I have loved you with an everlasting love. Therefore I have drawn you with loving kindness.”", ref: "Jeremiah 31:3" },
    reflection:
      "I have loved you with an everlasting love. Therefore I have drawn you with loving kindness. His love is the cause of our being drawn.",
    talk: "Did God's love for you start when you turned to him? What does this say?",
    pray: "Lord, you loved us with an everlasting love. You drew us.",
  },
  {
    read: { text: "Remember my affliction and my misery, the wormwood and the bitterness. My soul still remembers them, and is bowed down within me.", ref: "Lamentations 3:19-20" },
    reflection:
      "Remember my affliction and my misery... My soul still remembers them, and is bowed down within me. Verses 22-23 come after this, not instead of it.",
    talk: "Do you allow bitterness its verses before reaching for comfort?",
    pray: "Lord, we remember our affliction. Our souls are bowed down. Be near.",
  },
  {
    read: { text: "Let us search and try our ways, and turn again to the LORD.", ref: "Lamentations 3:40" },
    reflection:
      "Let's search and try our ways, and turn again to the LORD. In the ruins, the response is self-examination rather than blame.",
    talk: "When things go badly, is your first instinct to examine or to blame?",
    pray: "Lord, let us examine our ways and return to you.",
  },
  {
    read: { text: "I will give them one heart, and I will put a new spirit within you. I will take the stony heart out of their flesh, and will give them a heart of flesh;", ref: "Ezekiel 11:19" },
    reflection:
      "I will give them one heart, and I will put a new spirit within you. Heart surgery promised as God's own work.",
    talk: "Where has your heart gone stony? Have you asked for the surgery?",
    pray: "Lord, take out our hearts of stone. Give us hearts of flesh.",
  },
  {
    read: { text: "He said to me, “Son of man, can these bones live?” I answered, “Lord the LORD, you know.”", ref: "Ezekiel 37:3" },
    reflection:
      "Son of man, can these bones live? I answered, 'Lord the LORD, you know.' Neither false optimism nor despair. Sometimes 'you know' is the honest answer.",
    talk: "What looks like dry bones? Can you say 'Lord, you know'?",
    pray: "Lord, you know. Breathe on what is dead among us.",
  },
  {
    read: { text: "My God, turn your ear, and hear. Open your eyes, and see our desolations, and the city which is called by your name; for we do not present our petitions before you for our righteousness, but for your great mercies’ sake.", ref: "Daniel 9:18" },
    reflection:
      "We do not present our petitions before you for our righteousness, but for your great mercies. Daniel pleads on mercy alone. Nobody has better grounds.",
    talk: "What do you secretly think gives your prayers weight?",
    pray: "Lord, not for our righteousness but for your great mercy — hear us.",
  },
  {
    read: { text: "How can I give you up, Ephraim? How can I hand you over, Israel? How can I make you like Admah? How can I make you like Zeboiim? My heart is turned within me, my compassion is aroused.", ref: "Hosea 11:8" },
    reflection:
      "How can I give you up, Ephraim? ... My heart is turned within me, my compassion is aroused. God speaks like a parent unable to let a child go.",
    talk: "Have you thought of God as detached? What does this do to that?",
    pray: "Lord, your heart recoils within you. Thank you for love like that.",
  },
  {
    read: { text: "I will heal their waywardness. I will love them freely; for my anger is turned away from him.", ref: "Hosea 14:4" },
    reflection:
      "I will heal their waywardness. I will love them freely; for my anger is turned away. He heals the very thing that offended him.",
    talk: "What would 'freely' mean if you truly believed God loved you that way?",
    pray: "Lord, heal our waywardness. Love us freely.",
  },
  {
    read: { text: "I will restore to you the years that the swarming locust has eaten, the great locust, the grasshopper, and the caterpillar, my great army, which I sent among you.", ref: "Joel 2:25" },
    reflection:
      "I will restore to you the years that the swarming locust has eaten. Restoration offered — his gift, not a formula.",
    talk: "What years feel eaten? Can you ask without demanding?",
    pray: "Lord, restore the years the locusts have eaten.",
  },
  {
    read: { text: "But let justice roll on like rivers, and righteousness like a mighty stream.", ref: "Amos 5:24" },
    reflection:
      "Let justice roll on like rivers, and righteousness like a mighty stream. Said to people whose worship God had rejected.",
    talk: "Could God say of this house that the singing is fine and the justice missing?",
    pray: "Lord, let justice roll down. Do not let our worship excuse us.",
  },
  {
    read: { text: "The pride of your heart has deceived you, you who dwell in the clefts of the rock, whose habitation is high, who says in his heart, ‘Who will bring me down to the ground?", ref: "Obadiah 1:3" },
    reflection:
      "The pride of your heart has deceived you. Pride deceives the proud person first, which is why it is so hard to see.",
    talk: "What might your pride be hiding from you?",
    pray: "Lord, our pride deceives us. Show us what we cannot see.",
  },
  {
    read: { text: "But I will sacrifice to you with the voice of thanksgiving. I will pay that which I have vowed. Salvation belongs to the LORD.", ref: "Jonah 2:9" },
    reflection:
      "Salvation belongs to the LORD. Prayed from inside a fish by a man who ran. The theological centre of the book, from the least deserving mouth.",
    talk: "Where do you speak as though salvation were partly yours to arrange?",
    pray: "Lord, salvation belongs to you. We add nothing.",
  },
  {
    read: { text: "But you, Bethlehem Ephrathah, being small among the clans of Judah, out of you one will come out to me that is to be ruler in Israel; whose goings out are from of old, from ancient times.", ref: "Micah 5:2" },
    reflection:
      "But you, Bethlehem Ephrathah, being small among the clans of Judah, out of you one will come. The smallest town, named seven hundred years ahead.",
    talk: "What does God's use of small places suggest about where he works?",
    pray: "Lord, you use the small and overlooked. Use us.",
  },
  {
    read: { text: "the LORD, the Lord, is my strength. He makes my feet like deer’s feet, and enables me to go in high places. For the music director, on my stringed instruments.", ref: "Habakkuk 3:19" },
    reflection:
      "The LORD, the Lord, is my strength. He makes my feet like deer's feet, and enables me to go in high places. The book that began in complaint ends on high ground.",
    talk: "Where do you need surefootedness?",
    pray: "Lord, be our strength. Make our feet like the deer's.",
  },
  {
    read: { text: "At that time I will bring you in, and at that time I will gather you; for I will give you honor and praise among all the peoples of the earth, when I restore your fortunes before your eyes, says the LORD.", ref: "Zephaniah 3:20" },
    reflection:
      "At that time will I bring you in, and at that time will I gather you; for I will give you honour and praise. He restores what shame took.",
    talk: "What shame do you carry? What does it mean that God gives honour?",
    pray: "Lord, gather us and give us honour where there was shame.",
  },
  {
    read: { text: "Yet now be strong, Zerubbabel,’ says the LORD. ‘Be strong, Joshua, son of Jehozadak, the high priest. Be strong, all you people of the land,’ says the LORD, ‘and work, for I am with you,’ says the LORD of Armies. This is the word that I covenanted with you when you came out of Egypt, and my Spirit lived among you. ‘Don’t be afraid.", ref: "Haggai 2:4-5" },
    reflection:
      "Be strong... and work, for I am with you, says the LORD of Armies. Don't be afraid. Strength, work, presence and courage, to discouraged builders.",
    talk: "What work have you stopped because you were discouraged?",
    pray: "Lord of hosts, be with us. Make us strong, and let us work.",
  },
  {
    read: { text: "The streets of the city will be full of boys and girls playing in its streets.", ref: "Zechariah 8:5" },
    reflection:
      "The streets of the city will be full of boys and girls playing in its streets. God's picture of a restored city has children playing in it safely.",
    talk: "What would it take for children to play safely where you live?",
    pray: "Lord, fill our streets with children playing. Make them safe.",
  },
  {
    read: { text: "But to you who fear my name shall the sun of righteousness arise with healing in its wings. You will go out, and leap like calves of the stall.", ref: "Malachi 4:2" },
    reflection:
      "But to you who fear my name, the sun of righteousness will arise with healing in its wings. The Old Testament ends with a sunrise, then four hundred silent years.",
    talk: "What are you waiting through? What does it mean that the dawn came slowly?",
    pray: "Lord, let the sun of righteousness rise on us with healing.",
  },
  {
    read: { text: "She shall give birth to a son. You shall name him Jesus, for it is he who shall save his people from their sins.", ref: "Matthew 1:21" },
    reflection:
      "You shall call his name Jesus, for it is he who shall save his people from their sins. The name is the job description.",
    talk: "What do you mostly want Jesus to save you from?",
    pray: "Lord Jesus, you save your people from their sins. Save us.",
  },
  {
    read: { text: "They came into the house and saw the young child with Mary, his mother, and they fell down and worshiped him. Opening their treasures, they offered to him gifts: gold, frankincense, and myrrh.", ref: "Matthew 2:11" },
    reflection:
      "They came into the house and saw the young child with Mary, his mother, and they fell down and worshiped him. Outsiders worship a toddler.",
    talk: "Who would be the unlikely worshippers in your setting? Would they be welcome?",
    pray: "Lord Jesus, the nations came to worship you. Draw them still.",
  },
  {
    read: { text: "Blessed are the poor in spirit, for theirs is the Kingdom of Heaven. Blessed are those who mourn, for they shall be comforted.", ref: "Matthew 5:3-4" },
    reflection:
      "Blessed are the poor in spirit... Blessed are those who mourn. Jesus opens by blessing the people the world pities.",
    talk: "Which beatitude sounds most backwards to you?",
    pray: "Lord Jesus, make us poor enough in spirit to receive you.",
  },
  {
    read: { text: "Even so, let your light shine before men; that they may see your good works, and glorify your Father who is in heaven.", ref: "Matthew 5:16" },
    reflection:
      "Let your light shine before men, that they may see your good works and glorify your Father who is in heaven. Visible goodness so God gets the credit.",
    talk: "When your good work is noticed, who gets the credit?",
    pray: "Lord, let our light shine so people glorify you.",
  },
  {
    read: { text: "Therefore I tell you, don’t be anxious for your life: what you will eat, or what you will drink; nor yet for your body, what you will wear. Isn’t life more than food, and the body more than clothing?", ref: "Matthew 6:25" },
    reflection:
      "Therefore I tell you, don't be anxious for your life: what you will eat, or what you will drink... Isn't life more than food? Anxiety addressed by reasoning, not shaming.",
    talk: "What are you anxious about? Is Jesus shaming you for it here?",
    pray: "Lord, you know what we need. Take our anxiety.",
  },
  {
    read: { text: "But when he saw the multitudes, he was moved with compassion for them, because they were harassed and scattered, like sheep without a shepherd.", ref: "Matthew 9:36" },
    reflection:
      "When he saw the multitudes, he was moved with compassion for them, because they were harassed and scattered, like sheep without a shepherd.",
    talk: "What is your default reaction to strangers?",
    pray: "Lord Jesus, give us your eyes for people.",
  },
  {
    read: { text: "Aren’t two sparrows sold for an assarion coin? Not one of them falls on the ground apart from your Father’s will,", ref: "Matthew 10:29" },
    reflection:
      "Aren't two sparrows sold for an assarion coin? Not one of them falls on the ground apart from your Father's will. He does not say the sparrow will not fall.",
    talk: "What comfort is there in his presence at the fall, rather than its prevention?",
    pray: "Father, not one sparrow falls without you.",
  },
  {
    read: { text: "Come to me, all you who labor and are heavily burdened, and I will give you rest.", ref: "Matthew 11:28" },
    reflection:
      "Come to me, all you who labour and are heavily burdened, and I will give you rest. An open invitation to the exhausted. That includes new parents.",
    talk: "What burden has he offered to take?",
    pray: "Lord Jesus, we are weary. Give us rest.",
  },
  {
    read: { text: "The King will answer them, ‘Most certainly I tell you, because you did it to one of the least of these my brothers, you did it to me.", ref: "Matthew 25:40" },
    reflection:
      "Inasmuch as you did it to one of the least of these my brothers, you did it to me. How we treat the least powerful is how we treat him.",
    talk: "Who is the least powerful person you regularly encounter?",
    pray: "Lord Jesus, you are found among the least. Open our eyes.",
  },
  {
    read: { text: "Jesus sat down opposite the treasury, and saw how the multitude cast money into the treasury. Many who were rich cast in much. A poor widow came, and she cast in two small brass coins, which equal a quadrans coin. He called his disciples to himself, and said to them, “Most certainly I tell you, this poor widow gave more than all those who are giving into the treasury, for they all gave out of their abundance, but she, out of her poverty, gave all that she had to live on.”", ref: "Mark 12:41-44" },
    reflection:
      "This poor widow put in more than all of them. He measures by what is left, not by what is given.",
    talk: "What have you given that felt too small to matter?",
    pray: "Lord, you see the widow's coins. Receive our small offerings.",
  },
  {
    read: { text: "because of the tender mercy of our God, by which the dawn from on high will visit us, to shine on those who sit in darkness and the shadow of death; to guide our feet into the way of peace.", ref: "Luke 1:78-79" },
    reflection:
      "Because of the tender mercy of our God, by which the dawn from on high will visit us, to shine on those who sit in darkness. The incarnation as a sunrise.",
    talk: "Where have you been sitting in darkness?",
    pray: "Lord, by your tender mercy, let the dawn visit us.",
  },
  {
    read: { text: "Give, and it will be given to you: good measure, pressed down, shaken together, and running over, will be given to you. For with the same measure you measure it will be measured back to you.", ref: "Luke 6:38" },
    reflection:
      "Give, and it will be given to you: good measure, pressed down, shaken together, and running over. In context this is about mercy and judgement.",
    talk: "What measure are you using with the people nearest you?",
    pray: "Lord, let us give generously, and receive the same measure back.",
  },
  {
    read: { text: "Jesus answered her, “Martha, Martha, you are anxious and troubled about many things, but one thing is needed. Mary has chosen the good part, which will not be taken away from her.”", ref: "Luke 10:41-42" },
    reflection:
      "Martha, Martha, you are anxious and troubled about many things, but one thing is needed. Busyness crowding out the necessary thing.",
    talk: "What is the one needful thing being crowded out here?",
    pray: "Lord Jesus, give us the one needful thing.",
  },
  {
    read: { text: "He arose, and came to his father. But while he was still far off, his father saw him, and was moved with compassion, and ran, and fell on his neck, and kissed him.", ref: "Luke 15:20" },
    reflection:
      "But while he was still far off, his father saw him... and ran, and fell on his neck, and kissed him. The father was watching, and he ran.",
    talk: "Do you picture God waiting to scold, or watching to run?",
    pray: "Father, you run to us while we are still far off.",
  },
  {
    read: { text: "For the Son of Man came to seek and to save that which was lost.", ref: "Luke 19:10" },
    reflection:
      "For the Son of Man came to seek and to save that which was lost. He came looking, and was not put off by the address.",
    talk: "Whom have you written off?",
    pray: "Lord Jesus, you came to seek and to save. Thank you for looking for us.",
  },
  {
    read: { text: "They said to one another, “Weren’t our hearts burning within us, while he spoke to us along the way, and while he opened the Scriptures to us?”", ref: "Luke 24:32" },
    reflection:
      "Weren't our hearts burning within us while he spoke to us along the way? Two disciples walked seven miles with the risen Christ and only recognised him afterwards.",
    talk: "Where might Christ have been present and you saw it only later?",
    pray: "Lord Jesus, open the Scriptures to us and make our hearts burn.",
  },
  {
    read: { text: "But as many as received him, to them he gave the right to become God’s children, to those who believe in his name:", ref: "John 1:12" },
    reflection:
      "But as many as received him, to them he gave the right to become God's children. Receiving and believing, resulting in a legal standing.",
    talk: "Do you relate to God as a child or as a subject?",
    pray: "Lord, you gave us the right to become children of God.",
  },
  {
    read: { text: "Again, therefore, Jesus spoke to them, saying, “I am the light of the world. He who follows me will not walk in the darkness, but will have the light of life.”", ref: "John 8:12" },
    reflection:
      "I am the light of the world. He who follows me will not walk in the darkness, but will have the light of life.",
    talk: "Where are you walking by a smaller light?",
    pray: "Lord Jesus, you are the light of the world. Let us not walk in darkness.",
  },
  {
    read: { text: "Now before the feast of the Passover, Jesus, knowing that his time had come that he would depart from this world to the Father, having loved his own who were in the world, he loved them to the end.", ref: "John 13:1" },
    reflection:
      "Having loved his own who were in the world, he loved them to the end. Said just before he washed the feet of his betrayer.",
    talk: "Do you believe Christ's love for you has an endpoint?",
    pray: "Lord Jesus, you loved your own to the end. Thank you.",
  },
  {
    read: { text: "Don’t let your heart be troubled. Believe in God. Believe also in me. In my Father’s house are many homes. If it weren’t so, I would have told you. I am going to prepare a place for you. If I go and prepare a place for you, I will come again, and will receive you to myself; that where I am, you may be there also.", ref: "John 14:1-3" },
    reflection:
      "Don't let your heart be troubled... I go to prepare a place for you. Spoken hours before his arrest, to men about to abandon him.",
    talk: "What troubles your heart tonight?",
    pray: "Lord Jesus, you have gone to prepare a place. Let not our hearts be troubled.",
  },
  {
    read: { text: "Greater love has no one than this, that someone lay down his life for his friends.", ref: "John 15:13" },
    reflection:
      "Greater love has no one than this, that someone lay down his life for his friends. Said the night before he did it.",
    talk: "What has love cost you lately?",
    pray: "Lord Jesus, you laid down your life. Teach us to love at cost.",
  },
  {
    read: { text: "Not for these only do I pray, but for those also who will believe in me through their word, that they may all be one; even as you, Father, are in me, and I in you, that they also may be one in us; that the world may believe that you sent me.", ref: "John 17:20-21" },
    reflection:
      "I pray for those who believe in me through their word — that is us, prayed for by name in the garden. And what he asked for was unity.",
    talk: "Where are you contributing to division? What would his prayer ask of you?",
    pray: "Lord Jesus, you prayed that we would be one. Begin in this house.",
  },
  {
    read: { text: "Then he said to Thomas, “Reach here your finger, and see my hands. Reach here your hand, and put it into my side. Don’t be unbelieving, but believing.” Thomas answered him, “My Lord and my God!”", ref: "John 20:27-28" },
    reflection:
      "Don't be unbelieving, but believing. Thomas answered, 'My Lord and my God!' Christ meets a doubter with evidence rather than rebuke.",
    talk: "What doubt have you hidden because you think it disqualifies you?",
    pray: "Lord Jesus, meet our doubts. You are our Lord and our God.",
  },
  {
    read: { text: "They continued steadfastly in the apostles’ teaching and fellowship, in the breaking of bread, and prayer.", ref: "Acts 2:42" },
    reflection:
      "They continued steadfastly in the apostles' teaching and fellowship, in the breaking of bread and prayer. Four ordinary things, done persistently.",
    talk: "Which of the four is thinnest for you right now?",
    pray: "Lord, hold this house steadfast in your word, your people, your table and prayer.",
  },
  {
    read: { text: "There is salvation in no one else, for there is no other name under heaven that is given among men, by which we must be saved!", ref: "Acts 4:12" },
    reflection:
      "There is salvation in no one else, for there is no other name under heaven that is given among men, by which we must be saved. An exclusive claim, made plainly.",
    talk: "What does this mean for how you will teach this child about other faiths?",
    pray: "Lord Jesus, there is no other name. Save us and our children.",
  },
  {
    read: { text: "The God who made the world and all things in it, he, being Lord of heaven and earth, doesn’t dwell in temples made with hands. He isn’t served by men’s hands, as though he needed anything, seeing he himself gives to all life and breath, and all things.", ref: "Acts 17:24-25" },
    reflection:
      "God does not live in temples made with hands, and is not served by human hands as though he needed anything. We do not do him a favour by worshipping.",
    talk: "Do you ever treat God as though he owes you for your effort?",
    pray: "Lord, you need nothing and give everything. Correct our accounting.",
  },
  {
    read: { text: "for all have sinned, and fall short of the glory of God; being justified freely by his grace through the redemption that is in Christ Jesus;", ref: "Romans 3:23-24" },
    reflection:
      "For all have sinned, and fall short of the glory of God; being justified freely by his grace. This child will need what you need.",
    talk: "How will you teach this child about their own sin without crushing them?",
    pray: "Lord, we have all sinned. Justify us freely by your grace.",
  },
  {
    read: { text: "For the wages of sin is death, but the free gift of God is eternal life in Christ Jesus our Lord.", ref: "Romans 6:23" },
    reflection:
      "For the wages of sin is death, but the free gift of God is eternal life in Christ Jesus our Lord. Wages earned; gift given. The contrast is the whole gospel.",
    talk: "What is the difference between wages and a gift? Why does it matter here?",
    pray: "Lord, the wages of sin is death, and your gift is eternal life. Thank you.",
  },
  {
    read: { text: "So faith comes by hearing, and hearing by the word of God.", ref: "Romans 10:17" },
    reflection:
      "Faith comes by hearing, and hearing by the word of God. Faith comes from outside, through something heard. That is why we read aloud in this house.",
    talk: "What does this say about how you should spend some of your week?",
    pray: "Lord, faith comes by hearing. Speak, and give us faith.",
  },
  {
    read: { text: "Therefore I urge you, brothers, by the mercies of God, to present your bodies a living sacrifice, holy, acceptable to God, which is your spiritual service.", ref: "Romans 12:1" },
    reflection:
      "Present your bodies a living sacrifice, holy, acceptable to God, which is your spiritual service. The daily grind of a household can be an offering.",
    talk: "What ordinary work tomorrow could be offered as worship?",
    pray: "Lord, we present our bodies as a living sacrifice.",
  },
  {
    read: { text: "But as it is written, “Things which an eye didn’t see, and an ear didn’t hear, which didn’t enter into the heart of man, these God has prepared for those who love him.”", ref: "1 Corinthians 2:9" },
    reflection:
      "Things which an eye didn't see, and an ear didn't hear... God has prepared for those who love him. Whatever this season lacks, something better is prepared.",
    talk: "What has this season not given you? What has God prepared?",
    pray: "Lord, you have prepared what no eye has seen. Hold our hope there.",
  },
  {
    read: { text: "Therefore if anyone is in Christ, he is a new creation. The old things have passed away. Behold, all things have become new.", ref: "2 Corinthians 5:17" },
    reflection:
      "Therefore if anyone is in Christ, he is a new creation. The old things have passed away. Behold, all things have become new. New, not improved.",
    talk: "What old thing has passed away for you?",
    pray: "Lord, in Christ we are a new creation. Make all things new in us.",
  },
  {
    read: { text: "For him who knew no sin he made to be sin on our behalf; so that in him we might become the righteousness of God.", ref: "2 Corinthians 5:21" },
    reflection:
      "For him who knew no sin he made to be sin on our behalf; so that in him we might become the righteousness of God. The great exchange.",
    talk: "What did Christ take? What did he give?",
    pray: "Lord Jesus, you became sin for us. Thank you for your righteousness.",
  },
  {
    read: { text: "Bear one another’s burdens, and so fulfill the law of Christ.", ref: "Galatians 6:2" },
    reflection:
      "Bear one another's burdens, and so fulfill the law of Christ. Bearing is not fixing. Often the most Christlike thing is to carry weight you cannot lift off someone.",
    talk: "What burden can you not fix for your spouse? Could you carry it anyway?",
    pray: "Lord, let us bear each other's burdens.",
  },
  {
    read: { text: "in whom we have our redemption through his blood, the forgiveness of our trespasses, according to the riches of his grace,", ref: "Ephesians 1:7" },
    reflection:
      "In whom we have our redemption through his blood, the forgiveness of our trespasses, according to the riches of his grace. Measured by his riches, not by our sin.",
    talk: "What sin do you treat as bigger than his grace?",
    pray: "Lord, we have redemption through his blood, according to the riches of your grace.",
  },
  {
    read: { text: "Therefore watch carefully how you walk, not as unwise, but as wise, redeeming the time, because the days are evil.", ref: "Ephesians 5:15-16" },
    reflection:
      "Therefore watch carefully how you walk... redeeming the time, because the days are evil. Time is described as something to be bought back.",
    talk: "What is stealing your hours? What would buying them back require?",
    pray: "Lord, teach us to redeem the time.",
  },
  {
    read: { text: "But we don’t want you to be ignorant, brothers, concerning those who have fallen asleep, so that you don’t grieve like the rest, who have no hope.", ref: "1 Thessalonians 4:13" },
    reflection:
      "That you don't grieve like the rest, who have no hope. Not 'do not grieve' — grieve differently, because of what you know.",
    talk: "How is Christian grief different? What does it not remove?",
    pray: "Lord, let us grieve with hope, not without it.",
  },
  {
    read: { text: "He who calls you is faithful, who will also do it.", ref: "1 Thessalonians 5:24" },
    reflection:
      "He who calls you is faithful, who will also do it. What God asks of this family, he intends to supply.",
    talk: "What has God asked of you that feels impossible? Who will do it?",
    pray: "Lord, you are faithful, and you will do it.",
  },
  {
    read: { text: "But godliness with contentment is great gain. For we brought nothing into the world, and we certainly can’t carry anything out. But having food and clothing, we will be content with that.", ref: "1 Timothy 6:6-8" },
    reflection:
      "Godliness with contentment is great gain... having food and clothing, we will be content with that. A definition of enough.",
    talk: "What is your definition of enough? Compare it with Paul's.",
    pray: "Lord, teach us godliness with contentment.",
  },
  {
    read: { text: "For the word of God is living and active, and sharper than any two-edged sword, piercing even to the dividing of soul and spirit, of both joints and marrow, and is able to discern the thoughts and intentions of the heart.", ref: "Hebrews 4:12" },
    reflection:
      "For the word of God is living and active, and sharper than any two-edged sword... able to discern the thoughts and intentions of the heart. It reads us.",
    talk: "When did Scripture last read you rather than the other way round?",
    pray: "Lord, let your word discern the thoughts and intentions of our hearts.",
  },
  {
    read: { text: "Let’s consider how to provoke one another to love and good works, not forsaking our own assembling together, as the custom of some is, but exhorting one another, and so much the more as you see the Day approaching.", ref: "Hebrews 10:24-25" },
    reflection:
      "Let's consider how to provoke one another to love and good works; not forsaking our own assembling together. New parents drift from church easily.",
    talk: "How will you stay among God's people in this season? Be practical.",
    pray: "Lord, keep us among your people. Do not let us withdraw.",
  },
  {
    read: { text: "So, then, my beloved brothers, let every man be swift to hear, slow to speak, and slow to anger;", ref: "James 1:19" },
    reflection:
      "Let every man be swift to hear, slow to speak, and slow to anger. Exhausted people fail all three. The order is the instruction.",
    talk: "Practise it now: one speaks for two minutes, the other only listens.",
    pray: "Lord, make us quick to hear, slow to speak, slow to anger.",
  },
  {
    read: { text: "But be doers of the word, and not only hearers, deluding your own selves.", ref: "James 1:22" },
    reflection:
      "But be doers of the word, and not only hearers, deluding your own selves. Hearing without doing is described as self-deception.",
    talk: "What have you heard from God and not done?",
    pray: "Lord, make us doers of your word, not hearers only.",
  },
  {
    read: { text: "He himself bore our sins in his body on the tree, that we, having died to sins, might live to righteousness. You were healed by his wounds.", ref: "1 Peter 2:24" },
    reflection:
      "He himself bore our sins in his body on the tree, that we, having died to sins, might live to righteousness. In his body — a real body, really wounded.",
    talk: "What does it mean that Christ's body bore this?",
    pray: "Lord Jesus, you bore our sins in your body. Thank you.",
  },
  {
    read: { text: "But sanctify the Lord God in your hearts. Always be ready to give an answer to everyone who asks you a reason concerning the hope that is in you, with humility and fear,", ref: "1 Peter 3:15" },
    reflection:
      "Always be ready to give an answer to everyone who asks you a reason concerning the hope that is in you, with humility and fear. The manner is commanded as much as the content.",
    talk: "Have you ever been right and unkind about your faith?",
    pray: "Lord, make us ready to answer, and gentle in how we do it.",
  },
  {
    read: { text: "As each has received a gift, employ it in serving one another, as good managers of the grace of God in its various forms.", ref: "1 Peter 4:10" },
    reflection:
      "As each has received a gift, employ it in serving one another, as good managers of the grace of God. Gifts given to be spent on each other.",
    talk: "What is your spouse's gift? Are you making room for it?",
    pray: "Lord, let us use our gifts to serve one another.",
  },
  {
    read: { text: "The Lord is not slow concerning his promise, as some count slowness; but he is patient with us, not wishing that anyone should perish, but that all should come to repentance.", ref: "2 Peter 3:9" },
    reflection:
      "The Lord is not slow concerning his promise, as some count slowness; but is patient with us. What we experience as delay, Scripture calls patience.",
    talk: "Whose salvation might God's delay be for?",
    pray: "Lord, you are patient, not slow. Thank you for the time given.",
  },
  {
    read: { text: "The testimony is this, that God gave to us eternal life, and this life is in his Son. He who has the Son has the life. He who doesn’t have God’s Son doesn’t have the life.", ref: "1 John 5:11-12" },
    reflection:
      "God gave us eternal life, and this life is in his Son. He who has the Son has the life. Life located in a person, not in a decision or a feeling.",
    talk: "What would you want this child to know about where life is found?",
    pray: "Lord, you have given us eternal life in your Son. Give it to our child.",
  },
  {
    read: { text: "This is love, that we should walk according to his commandments. This is the commandment, even as you heard from the beginning, that you should walk in it.", ref: "2 John 1:6" },
    reflection:
      "This is love, that we should walk according to his commandments. Love defined as obedience, not as sentiment.",
    talk: "Where do you separate loving God from obeying him?",
    pray: "Lord, let us walk in your commandments. That is love.",
  },
  {
    read: { text: "Now to him who is able to keep them from stumbling, and to present you faultless before the presence of his glory in great joy, to God our Savior, who alone is wise, be glory and majesty, dominion and power, both now and forever. Amen.", ref: "Jude 1:24-25" },
    reflection:
      "Now to him who is able to keep them from stumbling, and to present you faultless before the presence of his glory with great joy. He keeps, he presents, and he does it with joy.",
    talk: "What are you afraid you will not survive? Who is able to keep you?",
    pray: "To him who is able to keep us from stumbling — glory, majesty, dominion and power.",
  },
  {
    read: { text: "When I saw him, I fell at his feet like a dead man. He laid his right hand on me, saying, “Don’t be afraid. I am the first and the last, and the Living one. I was dead, and behold, I am alive forever and ever. Amen. I have the keys of Death and of Hades.”", ref: "Revelation 1:17-18" },
    reflection:
      "Don't be afraid. I am the first and the last, and the Living one. I was dead, and behold, I am alive forever more. His first act toward a terrified man was a touch.",
    talk: "How do you hold together Christ's terrifying glory and his gentle hand?",
    pray: "Lord Jesus, you are the living one. You were dead and are alive forever.",
  },
  {
    read: { text: "Behold, I stand at the door and knock. If anyone hears my voice and opens the door, then I will come in to him, and will dine with him, and he with me.", ref: "Revelation 3:20" },
    reflection:
      "Behold, I stand at the door and knock. Said to a lukewarm church that had left Christ outside its own building. He is still knocking.",
    talk: "Where has this house become self-satisfied? Is Christ inside that part?",
    pray: "Lord Jesus, you stand and knock. We open the door.",
  },
  {
    read: { text: "They sang a new song, saying, “You are worthy to take the book and to open its seals: for you were killed, and bought us for God with your blood out of every tribe, language, people, and nation,”", ref: "Revelation 5:9" },
    reflection:
      "You are worthy... for you were killed, and bought us for God with your blood out of every tribe, language, people, and nation. Heaven's song, about the cross and every nation.",
    talk: "Does your church's worship sound like this song?",
    pray: "Worthy is the Lamb who was slain, who ransomed people from every nation.",
  },
  {
    read: { text: "I heard a loud voice out of heaven saying, “Behold, God’s dwelling is with people, and he will dwell with them, and they will be his people, and God himself will be with them as their God.”", ref: "Revelation 21:3" },
    reflection:
      "Behold, God's dwelling is with people; and he will dwell with them, and they will be his people. The end is not us going up but God coming down to stay.",
    talk: "Is your hope 'going to heaven' or 'God dwelling with us'?",
    pray: "Lord, your dwelling place will be with us. Come and stay.",
  },
  {
    read: { text: "The Spirit and the bride say, “Come!” He who hears, let him say, “Come!” He who is thirsty, let him come. He who desires, let him take the water of life freely.", ref: "Revelation 22:17" },
    reflection:
      "He who is thirsty, let him come. He who desires, let him take the water of life freely. The Bible's last invitation has no conditions and no price.",
    talk: "Do you believe it is free? What in you keeps trying to pay?",
    pray: "Lord Jesus, we are thirsty. We come and take the water of life freely.",
  },
  {
    read: { text: "He who testifies these things says, “Yes, I come quickly.” Amen! Yes, come, Lord Jesus.", ref: "Revelation 22:20" },
    reflection:
      "He who testifies these things says, 'Yes, I come quickly.' Amen! Yes, come, Lord Jesus. The Bible's last prayer is a request for him to come.",
    talk: "Do you actually want Christ to return? What in you hesitates?",
    pray: "Amen. Come, Lord Jesus.",
  },
  {
    read: { text: "that the fellowship of your faith may become effective in the knowledge of every good thing which is in us in Christ Jesus.", ref: "Philemon 1:6" },
    reflection:
      "Paul prays that the sharing of Onesimus' faith would become effective through knowing every good thing that is in us in Christ. Faith becomes useful to others when we know what we already have. A parent who has not counted their own mercies has little to hand a child.",
    talk: "Name three good things Christ has already given you that this child will inherit by watching you.",
    pray: "Father, make our faith useful. Let what you have given us reach the ones who come after us.",
  },
  {
    read: { text: "For we have much joy and comfort in your love, because the hearts of the saints have been refreshed through you, brother.", ref: "Philemon 1:7" },
    reflection:
      "Paul says the hearts of the saints have been refreshed through Philemon. Refreshment is a real ministry, not a lesser one. Much of what you will do for a very small child is simply refreshing them — food, warmth, sleep, a steady face. Do not despise it.",
    talk: "Who has refreshed you this week? Have you told them?",
    pray: "Lord, let our home be a place where tired hearts are refreshed, starting with each other's.",
  },
  {
    read: { text: "Do two walk together, unless they have agreed?", ref: "Amos 3:3" },
    reflection:
      "Two cannot walk together unless they have agreed. Amos is speaking of God and Israel, but the principle runs down into a household. Parenting exposes every unspoken disagreement about money, sleep, discipline and family. Agreement is not automatic; it is made, out loud, in advance.",
    talk: "What is one thing about raising this child we have never actually agreed on out loud?",
    pray: "Lord, give us agreement — not silence mistaken for peace. Let us walk together.",
  },
  {
    read: { text: "“Behold, the days come,” says the Lord the LORD, “that I will send a famine in the land, not a famine of bread, nor a thirst for water, but of hearing the LORD’s words.”", ref: "Amos 8:11" },
    reflection:
      "The worst famine God names is not of bread but of hearing his words. It is possible to be well fed, well housed and starving. In a season crowded with practical need, guard the intake of Scripture as carefully as you guard meals.",
    talk: "Is our household better fed on food or on the word right now?",
    pray: "Lord, spare us a famine of your word. Keep our ears open while our hands are full.",
  },
  {
    read: { text: "Shouldn’t I be concerned for Nineveh, that great city, in which are more than one hundred twenty thousand persons who can’t discern between their right hand and their left hand; and also much livestock?", ref: "Jonah 4:11" },
    reflection:
      "God's last word in Jonah is a question about a city full of people who cannot tell their right hand from their left — and also much livestock. God's pity extends to the ignorant and the small. Your child, who knows nothing yet, is already the object of that pity.",
    talk: "Where do you find it hard to believe God is tender toward those who understand nothing yet?",
    pray: "God of Nineveh, you pity the small and the ignorant. Pity us, and pity this child.",
  },
  {
    read: { text: "the LORD prepared a great fish to swallow up Jonah, and Jonah was in the belly of the fish three days and three nights.", ref: "Jonah 1:17" },
    reflection:
      "The fish is not the punishment; it is the rescue. Jonah asked to be thrown into the sea, and God met him in the water with a mercy that looked like a disaster. Some of what has felt like being swallowed in this season may be the shape God's rescue is taking.",
    talk: "What has felt like being swallowed that may in fact have been kept?",
    pray: "Lord, we cannot always tell your mercies from our troubles. Teach us to trust you in the dark.",
  },
  {
    read: { text: "For the day of the LORD is near all the nations! As you have done, it will be done to you. Your deeds will return upon your own head.", ref: "Obadiah 1:15" },
    reflection:
      "Obadiah warns Edom that what they have done will return on their own head. It is the shortest book in the Old Testament and its lesson is domestic: households reap what they sow toward their neighbours and their kin. Children learn how to treat relatives by watching how relatives are treated.",
    talk: "How do we speak about difficult family members when the child is in the room?",
    pray: "Lord, guard our mouths about our own kin. Let this child learn mercy from us.",
  },
  {
    read: { text: "Now therefore this is what the LORD of Armies says: Consider your ways.", ref: "Haggai 1:5" },
    reflection:
      "Consider your ways, says the LORD, to a people who panelled their own houses while God's house lay waste. New parents build nests — it is right and good. But the question stands: while we are finishing this room, what are we leaving unbuilt?",
    talk: "What are we spending on that will not last, and what are we neglecting that will?",
    pray: "Lord, we are building. Show us what we have left unbuilt while we worked.",
  },
  {
    read: { text: "The latter glory of this house will be greater than the former,’ says the LORD of Armies; ‘and in this place I will give peace,’ says the LORD of Armies.", ref: "Haggai 2:9" },
    reflection:
      "God promises the latter glory of this house will be greater than the former. To people looking at a smaller, poorer temple than their grandparents had, God says the best is not behind you. Your home may not look like the one you grew up in. That is not the measure.",
    talk: "In what way are you comparing your home to one that came before it?",
    pray: "Lord, let the latter glory of this house be greater — not in size, but in you.",
  },
  {
    read: { text: "the LORD is slow to anger, and great in power, and will by no means leave the guilty unpunished. the LORD has his way in the whirlwind and in the storm, and the clouds are the dust of his feet.", ref: "Nahum 1:3" },
    reflection:
      "The LORD is slow to anger and great in power. Nahum holds both together without embarrassment. A parent who is only patient becomes weak, and one who is only strong becomes frightening. God's patience is the patience of someone who could act at once and chooses not to.",
    talk: "Is your patience with this child strength held back, or simply exhaustion?",
    pray: "Lord, make us slow to anger the way you are — from strength, not from tiredness.",
  },
  {
    read: { text: "Behold, on the mountains the feet of him who brings good news, who publishes peace! Keep your feasts, Judah! Perform your vows, for the wicked one will no more pass through you. He is utterly cut off.", ref: "Nahum 1:15" },
    reflection:
      "Nahum sees feet on the mountains bringing good news and calls the people to keep their feasts. Even in a book about judgement, God tells his people to celebrate. Keep the feasts in your house. Birthdays, Sundays, small ordinary joys — they are commanded, not optional.",
    talk: "What feast could we keep in this house that we have let slip?",
    pray: "Lord, teach us to celebrate. Let joy be a discipline in our home, not an accident.",
  },
  {
    read: { text: "Now our Lord Jesus Christ himself, and God our Father, who loved us and gave us eternal comfort and good hope through grace, comfort your hearts and establish you in every good work and word.", ref: "2 Thessalonians 2:16-17" },
    reflection:
      "Paul prays that God, who loved us and gave us eternal comfort and good hope through grace, would comfort your hearts and establish them in every good work and word. Comfort comes before establishing. God settles the heart first, then the hands.",
    talk: "Are you trying to work before you have let God comfort you?",
    pray: "Father of eternal comfort, settle our hearts, then steady our hands for the work.",
  },
  {
    read: { text: "But you, brothers, don’t be weary in doing what is right.", ref: "2 Thessalonians 3:13" },
    reflection:
      "Do not be weary in doing what is right. Paul says it to a church distracted by end-times speculation and idleness. The days of early parenting are made almost entirely of small right things done again — and the temptation is not to do wrong but to stop.",
    talk: "What good thing have you nearly given up on because it is repetitive?",
    pray: "Lord, keep us from growing weary in the small right things. They are not small to you.",
  },
  {
    read: { text: "Set me as a seal on your heart, as a seal on your arm; for love is strong as death. Jealousy is as cruel as Sheol. Its flashes are flashes of fire, a very flame of the LORD. Many waters can’t quench love, neither can floods drown it. If a man would give all the wealth of his house for love, he would be utterly scorned.", ref: "Song of Solomon 8:6-7" },
    reflection:
      "Love is set as a seal on the heart, strong as death, and many waters cannot quench it. This is covenant love, not sentiment — a love that holds when feeling is gone. A child changes the shape of a marriage; the seal is what keeps it when the shape is unfamiliar.",
    talk: "What has changed in how we show love since this season began?",
    pray: "Lord, set your love as a seal on us. Let no flood in this season quench it.",
  },
  {
    read: { text: "You are all beautiful, my love. There is no spot in you.", ref: "Song of Solomon 4:7" },
    reflection:
      "The bride is called altogether beautiful with no flaw. It is a husband's word to a wife whose body he sees plainly. In a season when bodies change, stretch and ache, this verse is not flattery; it is a model of how a spouse is meant to speak.",
    talk: "When did you last say something like this out loud to each other?",
    pray: "Lord, teach us to speak well of each other's bodies, especially now.",
  },
  {
    read: { text: "I rejoice greatly that I have found some of your children walking in truth, even as we have been commanded by the Father.", ref: "2 John 1:4" },
    reflection:
      "John rejoices greatly to find children walking in truth. Not clever children, not successful ones — walking ones. The joy of an older believer is watching the next generation still on the road. That is the ambition worth having for this child.",
    talk: "What would it look like for this child to still be walking in truth at thirty?",
    pray: "Lord, let there be joy in this house one day at finding our children walking in truth.",
  },
  {
    read: { text: "Beloved, don’t imitate that which is evil, but that which is good. He who does good is of God. He who does evil hasn’t seen God.", ref: "3 John 1:11" },
    reflection:
      "John tells Gaius not to imitate evil but good. Children learn almost everything by imitation before they learn anything by instruction. Long before this child understands a rule, they will be copying a tone of voice.",
    talk: "What are you doing right now that you would be content to see copied exactly?",
    pray: "Lord, make us worth imitating. Guard what this child copies from us.",
  },
  {
    read: { text: "Mercy to you and peace and love be multiplied.", ref: "Jude 1:2" },
    reflection:
      "Mercy, peace and love be multiplied to you. Jude opens a fierce letter with multiplication, not addition. God's supply to a household does not run out as the household grows; it multiplies to meet it.",
    talk: "Where are you afraid there will not be enough — time, patience, money, love?",
    pray: "Lord, multiply mercy, peace and love to this house as it grows.",
  },
  {
    read: { text: "But you, beloved, keep building up yourselves on your most holy faith, praying in the Holy Spirit. Keep yourselves in God’s love, looking for the mercy of our Lord Jesus Christ to eternal life.", ref: "Jude 1:20-21" },
    reflection:
      "Build yourselves up on your most holy faith, pray in the Holy Spirit, keep yourselves in God's love. Three verbs of ordinary maintenance. Faith is not kept by a single decision but by habits repeated in seasons when nothing feels spiritual.",
    talk: "Which of those three has slipped most in this season?",
    pray: "Holy Spirit, hold us in the love of God while we are too tired to hold on ourselves.",
  },
  {
    read: { text: "You shall not take vengeance, nor bear any grudge against the children of your people; but you shall love your neighbor as yourself. I am the LORD.", ref: "Leviticus 19:18" },
    reflection:
      "Love your neighbour as yourself, says the LORD — the verse Jesus placed second only to loving God. The first neighbour a child meets is the person their parent married. They will learn what the second commandment means from watching that.",
    talk: "Who is the nearest neighbour you are finding hardest to love this week?",
    pray: "Lord, our nearest neighbours live in this house. Give us love for them today.",
  },
  {
    read: { text: "I will walk among you, and will be your God, and you will be my people.", ref: "Leviticus 26:12" },
    reflection:
      "God promises to walk among his people and be their God. The whole point of the law was not distance but nearness — a God who dwells in the middle of the camp. Your home is not a place God visits; it is a place he means to live.",
    talk: "Does our home feel like a place God visits or a place he lives?",
    pray: "Lord, walk among us here. Be our God in this house, in these rooms.",
  },
  {
    read: { text: "Whenever the cloud was taken up from over the Tent, then after that the children of Israel traveled; and in the place where the cloud remained, there the children of Israel encamped. At the commandment of the LORD, the children of Israel traveled, and at the commandment of the LORD they encamped. As long as the cloud remained on the tabernacle they remained encamped.", ref: "Numbers 9:17-18" },
    reflection:
      "Israel travelled when the cloud lifted and camped when it settled — sometimes for a night, sometimes for a year. They did not choose the pace. Parenting a very small child is life at a pace you do not set, and the discipline is the same: move when God moves, stay when he stays.",
    talk: "Are you trying to move while the cloud is still settled?",
    pray: "Lord, we are not in charge of the pace. Teach us to camp and to travel at your word.",
  },
  {
    read: { text: "the LORD is slow to anger, and abundant in loving kindness, forgiving iniquity and disobedience; and he will by no means clear the guilty, visiting the iniquity of the fathers on the children, on the third and on the fourth generation.", ref: "Numbers 14:18" },
    reflection:
      "The LORD is slow to anger and abundant in loving kindness, forgiving iniquity — and Moses prays this back to God as an argument. The surest ground of prayer is God's own stated character. Pray his words back to him.",
    talk: "Which of God's own words do you most need to pray back to him this week?",
    pray: "Lord, you said you are slow to anger and abundant in mercy. We hold you to your own word.",
  },
  {
    read: { text: "For Ezra had set his heart to seek the LORD’s law, and to do it, and to teach statutes and ordinances in Israel.", ref: "Ezra 7:10" },
    reflection:
      "Ezra set his heart to seek the law of the LORD, to do it, and to teach it. In that order. A parent cannot teach past what they have sought, and cannot sustain teaching what they do not do. The order is not optional.",
    talk: "Which step is weakest for you right now — seeking, doing, or teaching?",
    pray: "Lord, set our hearts to seek your word, to do it, and only then to teach it.",
  },
  {
    read: { text: "Now for a little moment grace has been shown from the LORD our God, to leave us a remnant to escape, and to give us a nail in his holy place, that our God may lighten our eyes, and revived us a little in our bondage.", ref: "Ezra 9:8" },
    reflection:
      "Ezra calls God's kindness a little reviving in their bondage — not deliverance, not yet, but a nail in a holy place and light to the eyes. Sometimes what God gives is not rescue but enough strength for one more day. That is still grace.",
    talk: "What small reviving has God given you this week that you nearly overlooked?",
    pray: "Lord, thank you for little revivings. Give light to our eyes for today.",
  },
  {
    read: { text: "He brought up Hadassah, that is, Esther, his uncle’s daughter; for she had neither father nor mother. The maiden was fair and beautiful; and when her father and mother were dead, Mordecai took her for his own daughter.", ref: "Esther 2:7" },
    reflection:
      "Mordecai took Esther as his own daughter when she had neither father nor mother. Scripture records adoption plainly and without qualification — she is simply his daughter. Every child in a Christian home is being raised for a purpose no one can yet see.",
    talk: "How does it change things to think of this child as raised for a purpose you cannot see?",
    pray: "Lord, you place the lonely in families. Thank you for the child you have placed with us.",
  },
  {
    read: { text: "and that these days should be remembered and kept throughout every generation, every family, every province, and every city; and that these days of Purim should not fail from among the Jews, nor their memory perish from their offspring,", ref: "Esther 9:28" },
    reflection:
      "The days of Purim were to be remembered and kept throughout every generation, every family. God's people were commanded to build family memory. Remembering is not nostalgia; it is a defence against forgetting who rescued you.",
    talk: "What one thing from this season do we want this child to be told about every year?",
    pray: "Lord, help us build memory in this house so that the next generation knows what you did.",
  },
  {
    read: { text: "if anyone is blameless, the husband of one wife, having children who believe, who are not accused of loose or unruly behavior.", ref: "Titus 1:6" },
    reflection:
      "An elder is to be blameless, the husband of one wife, with children who believe. Paul ties public ministry to the ordinary running of a home. What happens in your house at two in the morning is not separate from what happens in the church at eleven on Sunday.",
    talk: "Is there a gap between how we behave at church and how we behave at home?",
    pray: "Lord, close the gap between our public and private selves. Make us one person.",
  },
  {
    read: { text: "that they may train the young wives to love their husbands, to love their children, to be sober minded, chaste, workers at home, kind, being in subjection to their own husbands, that God’s word may not be blasphemed.", ref: "Titus 2:4-5" },
    reflection:
      "Older women are to train younger women to love their husbands and children, and to be sensible and kind. Note that loving your children is something to be taught. It does not arrive complete with the child. It is learned, usually from someone older.",
    talk: "Who is the older believer we could ask to teach us this year?",
    pray: "Lord, send us older saints, and make us willing to be taught by them.",
  },
  {
    read: { text: "Yes, and for this very cause adding on your part all diligence, in your faith supply moral excellence; and in moral excellence, knowledge; and in knowledge, self-control; and in self-control perseverance; and in perseverance godliness; and in godliness brotherly affection; and in brotherly affection, love.", ref: "2 Peter 1:5-7" },
    reflection:
      "Peter stacks faith, moral excellence, knowledge, self-control, perseverance, godliness, brotherly affection and love. Each is added to the one before. Nobody is given the whole stack at once; parenting mostly works on self-control and perseverance for a few years.",
    talk: "Which link in that chain is God working on in you right now?",
    pray: "Lord, add to our faith what is missing. Work patiently; we are slow.",
  },
  {
    read: { text: "But grow in the grace and knowledge of our Lord and Savior Jesus Christ. To him be the glory both now and forever. Amen.", ref: "2 Peter 3:18" },
    reflection:
      "Grow in the grace and knowledge of our Lord and Saviour Jesus Christ. Growth is the closing command of Peter's last letter. A season that leaves no time for study is not a season without growth; grace is learned as much by being carried as by reading.",
    talk: "How has God grown you this year in ways you did not plan?",
    pray: "Lord Jesus, grow us in grace and in knowledge of you, even in a year like this one.",
  },
  {
    read: { text: "After all that generation were gathered to their fathers, another generation arose after them who didn’t know the LORD, nor the work which he had done for Israel.", ref: "Judges 2:10" },
    reflection:
      "A generation arose after them who did not know the LORD or the work he had done for Israel. One generation was enough. Faith is never inherited automatically; it is handed over deliberately, or it is lost.",
    talk: "What specific work of God in our lives has this child not been told about yet?",
    pray: "Lord, let no generation of this family arise not knowing you. Make us tell them.",
  },
  {
    read: { text: "“So let all your enemies perish, the LORD, but let those who love him be as the sun when it rises in its strength.” Then the land had rest forty years.", ref: "Judges 5:31" },
    reflection:
      "Deborah's song ends asking that those who love the LORD would be like the sun rising in strength. It is a mother's image of the faithful — not spectacular, but rising again, reliably, every morning.",
    talk: "What would rising in strength look like in your household tomorrow morning?",
    pray: "Lord, let us rise like the sun — steadily, again, for those who depend on us.",
  },
  {
    read: { text: "Now, my daughter, don’t be afraid. I will do to you all that you say; for all the city of my people knows that you are a worthy woman.", ref: "Ruth 3:11" },
    reflection:
      "Boaz tells Ruth the whole city knows she is a worthy woman. Her reputation was made by daily faithfulness to a bitter mother-in-law, not by anything public. Character is built where nobody is watching and eventually everyone knows.",
    talk: "What is being built in you right now that nobody sees?",
    pray: "Lord, build character in us in the hidden hours. Let it show without our arranging it.",
  },
  {
    read: { text: "But Daniel purposed in his heart that he would not defile himself with the king’s dainties, nor with the wine which he drank. Therefore he requested of the prince of the eunuchs that he might not defile himself.", ref: "Daniel 1:8" },
    reflection:
      "Daniel purposed in his heart that he would not defile himself — before the pressure came, not during it. Decisions about what a household will and will not do are best made in advance, calmly, while nothing is at stake.",
    talk: "What decision should we make now, in advance, before the pressure arrives?",
    pray: "Lord, give us settled hearts. Let us decide before we are tested.",
  },
  {
    read: { text: "Daniel answered, “Blessed be the name of God forever and ever; for wisdom and might are his. He changes the times and the seasons. He removes kings, and sets up kings. He gives wisdom to the wise, and knowledge to those who have understanding.”", ref: "Daniel 2:20-21" },
    reflection:
      "Daniel blesses God who changes the times and the seasons, gives wisdom to the wise and knowledge to those with understanding. He praises God's control over time on the very night his life depended on it. Seasons change by God's hand, not by ours.",
    talk: "What season are you desperate to be out of? Who holds its end?",
    pray: "God of the times and seasons, this one is yours too. Give us wisdom inside it.",
  },
  {
    read: { text: "It will happen afterward, that I will pour out my Spirit on all flesh; and your sons and your daughters will prophesy. Your old men will dream dreams. Your young men will see visions.", ref: "Joel 2:28" },
    reflection:
      "God promises to pour out his Spirit on all flesh — sons and daughters, old and young. Peter quotes it at Pentecost. The promise deliberately includes children. Do not treat your child as someone who must wait years to be met by God.",
    talk: "Do you expect God to work in this child now, or only later?",
    pray: "Lord, pour out your Spirit on our sons and daughters. Do not wait for them to be old enough.",
  },
  {
    read: { text: "He answered and spoke to those who stood before him, saying, “Take the filthy garments off him.” To him he said, “Behold, I have caused your iniquity to pass from you, and I will clothe you with rich clothing.”", ref: "Zechariah 3:4" },
    reflection:
      "The angel takes filthy garments off Joshua the high priest and clothes him with rich robes while Satan stands accusing. God does not defend our record; he replaces our clothing. On a day when you have failed your child badly, this is the gospel.",
    talk: "What accusation are you carrying that Christ has already answered by clothing you?",
    pray: "Lord, take our filthy garments. Clothe us, and silence the accuser.",
  },
  {
    read: { text: "Turn to the stronghold, you prisoners of hope! Even today I declare that I will restore double to you.", ref: "Zechariah 9:12" },
    reflection:
      "Return to the stronghold, prisoners of hope. It is a strange, strong title — people held captive by hope rather than by fear. Christian parents are prisoners of hope: they cannot stop expecting God to be good.",
    talk: "Would anyone describe you this year as a prisoner of hope? Why or why not?",
    pray: "Lord, hold us captive to hope. We will not let go of expecting your goodness.",
  },
  {
    read: { text: "I told them of the hand of my God which was good on me, as also of the king’s words that he had spoken to me. They said, “Let’s rise up and build.” So they strengthened their hands for the good work.", ref: "Nehemiah 2:18" },
    reflection:
      "Nehemiah told them of the hand of his God which was good on him, and they said, let us rise up and build. Testimony creates courage in other people. Say out loud what God has done; someone in your house needs it to start building.",
    talk: "What good hand of God on us should be said out loud this week?",
    pray: "Lord, let us speak of your good hand on us, and let it stir others to build.",
  },
  {
    read: { text: "I sent messengers to them, saying, “I am doing a great work, so that I can’t come down. Why should the work cease, while I leave it, and come down to you?”", ref: "Nehemiah 6:3" },
    reflection:
      "Nehemiah refuses to come down from the wall: I am doing a great work, so that I cannot come down. He does not argue with his critics; he declines to be interrupted. Raising a child is a great work, and much that demands your attention can wait.",
    talk: "What is calling you down off the wall that you should simply decline?",
    pray: "Lord, give us Nehemiah's clarity. Let us not come down for what does not matter.",
  },
  {
    read: { text: "I will make them and the places around my hill a blessing. I will cause the shower to come down in its season. There will be showers of blessing.", ref: "Ezekiel 34:26" },
    reflection:
      "God promises showers of blessing in their season. Not constant rain, not on demand — in season. God's provision has timing, and part of faith is refusing to call a dry week abandonment.",
    talk: "Are you interpreting a dry season as God's absence?",
    pray: "Lord, send showers in their season. Keep us trusting between the rains.",
  },
  {
    read: { text: "When I passed by you, and saw you wallowing in your blood, I said to you, ‘Though you are in your blood, live!’ Yes, I said to you, ‘Though you are in your blood, live!", ref: "Ezekiel 16:6" },
    reflection:
      "God passes by an abandoned newborn lying in her blood and says: live. It is the most physical picture of grace in Scripture — a helpless infant given life by a word. That is exactly what God has done for you, and what he can do for this child.",
    talk: "How does it land to picture yourself as the infant in this passage?",
    pray: "Lord, you said live to us when we could do nothing. Say it over this child.",
  },
  {
    read: { text: "I will betroth you to me forever. Yes, I will betroth you to me in righteousness, in justice, in loving kindness, and in compassion. I will even betroth you to me in faithfulness; and you shall know the LORD.", ref: "Hosea 2:19-20" },
    reflection:
      "God betroths his people to himself forever in righteousness, justice, loving kindness and compassion — and says, you will know the LORD. Covenant is God's chosen picture for his love. He binds himself. A marriage in a Christian home is meant to display that binding.",
    talk: "What does our marriage currently teach an onlooker about God's faithfulness?",
    pray: "Lord, you betroth yourself forever. Make our covenant a small picture of yours.",
  },
  {
    read: { text: "But if anyone doesn’t provide for his own, and especially his own household, he has denied the faith, and is worse than an unbeliever.", ref: "1 Timothy 5:8" },
    reflection:
      "Paul says whoever does not provide for their own household has denied the faith. Provision is a spiritual matter, not merely a practical one. Working, budgeting and planning for this child are acts of obedience, not distractions from it.",
    talk: "What part of providing for this household have we been avoiding?",
    pray: "Lord, make our provision faithful. Let our ordinary work be worship.",
  },
  {
    read: { text: "I exhort therefore, first of all, that petitions, prayers, intercessions, and givings of thanks be made for all men: for kings and all who are in high places, that we may lead a tranquil and quiet life in all godliness and reverence.", ref: "1 Timothy 2:1-2" },
    reflection:
      "Paul urges prayers for kings and all in authority, so that we may lead a tranquil and quiet life in godliness and reverence. A quiet life is a legitimate Christian ambition. Pray for the peace of the place your child will grow up in.",
    talk: "When did we last pray for those in authority over the place we live?",
    pray: "Lord, grant peace to this place, so that this child may grow up in quietness and godliness.",
  },
  {
    read: { text: "For I, the LORD, don’t change; therefore you, sons of Jacob, are not consumed.", ref: "Malachi 3:6" },
    reflection:
      "I, the LORD, do not change; therefore you, sons of Jacob, are not consumed. Their survival rests on his constancy, not their consistency. On the days your parenting is wildly inconsistent, the family is held by God's unchanging character.",
    talk: "Where are you relying on your own consistency instead of God's?",
    pray: "Unchanging God, we are not consumed because you do not change. Hold this house together.",
  },
  {
    read: { text: "It will happen at that time, that I will search Jerusalem with lamps, and I will punish the men who are settled on their dregs, who say in their heart, “the LORD will not do good, neither will he do evil.”", ref: "Zephaniah 1:12" },
    reflection:
      "God searches out those settled on their dregs, who say in their heart that the LORD will not do good or evil. Practical unbelief is not loud; it is settled. It looks like a Christian who no longer expects God to do anything.",
    talk: "Have you quietly stopped expecting God to act in some area of your life?",
    pray: "Lord, search us out where we have settled. Restore our expectation of you.",
  },
  {
    read: { text: "You, Solomon my son, know the God of your father, and serve him with a perfect heart and with a willing mind; for the LORD searches all hearts, and understands all the imaginations of the thoughts. If you seek him, he will be found by you; but if you forsake him, he will cast you off forever.", ref: "1 Chronicles 28:9" },
    reflection:
      "David tells Solomon to know the God of his father and serve him with a whole heart and a willing mind, because the LORD searches all hearts. A father charging a son publicly with the faith. There is a place for saying this plainly to your child, one day.",
    talk: "What would you want to say to this child, in your own words, when they are old enough?",
    pray: "Lord, give us words for this child when the time comes, and courage to say them.",
  },
  {
    read: { text: "But you be strong, and don’t let your hands be slack; for your work will be rewarded.", ref: "2 Chronicles 15:7" },
    reflection:
      "Be strong, do not let your hands be slack, for your work will be rewarded. Spoken to a king facing reform that would cost him. The reward is not visible in the moment of the work. Slack hands are the temptation of the long middle.",
    talk: "Where have your hands gone slack because the reward is far off?",
    pray: "Lord, strengthen our hands. We will not see the reward yet; help us work anyway.",
  },
  {
    read: { text: "But they will sit every man under his vine and under his fig tree; and no one will make them afraid: For the mouth of the LORD of Armies has spoken.", ref: "Micah 4:4" },
    reflection:
      "Every man will sit under his vine and under his fig tree, and no one will make them afraid. The Bible's picture of peace is domestic — a family at rest in its own place, unafraid. That is what God is finally building.",
    talk: "What are you most afraid of for this child? What does this promise say to it?",
    pray: "Lord, bring the day when no one makes us afraid. Give us a foretaste of it here.",
  },
  {
    read: { text: "Look among the nations, watch, and wonder marvelously; for I am working a work in your days, which you will not believe though it is told you.", ref: "Habakkuk 1:5" },
    reflection:
      "God tells the prophet to look and wonder, for he is working a work in your days which you will not believe though it is told you. God's answer to Habakkuk's complaint was not comfort but scale. He is doing more than you can currently credit.",
    talk: "What would change if you believed God is working something you would not believe if told?",
    pray: "Lord, we do not see it. Work anyway, and give us eyes later.",
  },
  {
    read: { text: "Joshua said to the people, “Sanctify yourselves; for tomorrow the LORD will do wonders among you.”", ref: "Joshua 3:5" },
    reflection:
      "Sanctify yourselves, for tomorrow the LORD will do wonders among you. Preparation preceded the miracle. There are seasons where the right response to what God is about to do is to get ready.",
    talk: "What preparation is God asking of us before the next thing?",
    pray: "Lord, prepare us. Do not let your wonders find us unready.",
  },
  {
    read: { text: "Behold, today I am going the way of all the earth. You know in all your hearts and in all your souls that not one thing has failed of all the good things which the LORD your God spoke concerning you. All have happened to you. Not one thing has failed of it.", ref: "Joshua 23:14" },
    reflection:
      "Joshua, at the end of his life, says not one thing has failed of all the good things the LORD spoke. That is an old man's audit of God's promises, and it came out clean. Yours will too, though you cannot see it yet.",
    talk: "What promise of God are you still waiting to see kept?",
    pray: "Lord, not one of your words has failed. Keep us until we can say it ourselves.",
  },
  {
    read: { text: "For the Lord will not cast off forever. For though he causes grief, yet he will have compassion according to the multitude of his loving kindnesses.", ref: "Lamentations 3:31-32" },
    reflection:
      "The Lord will not cast off forever; though he causes grief, he will have compassion according to the multitude of his loving kindnesses. Jeremiah does not pretend the grief came from elsewhere. He holds God's sovereignty and God's compassion in the same sentence.",
    talk: "Can you say both of those things about your hardest season, in one breath?",
    pray: "Lord, you do not cast off forever. Have compassion according to your mercies, not our sense of them.",
  },
  {
    read: { text: "David said to him, “Don’t be afraid; for I will surely show you kindness for Jonathan your father’s sake, and will restore to you all the land of Saul your father. You will eat bread at my table continually.”", ref: "2 Samuel 9:7" },
    reflection:
      "David tells Mephibosheth not to fear, promises him kindness for his father's sake, and seats him at the king's table permanently. Kindness for someone else's sake, given to a man who could offer nothing back. That is the gospel with a limp.",
    talk: "Who could you show kindness to this month who cannot repay it?",
    pray: "Lord, you seated us at your table for Christ's sake. Make us kind the same way.",
  },
  {
    read: { text: "The jar of meal didn’t run out, and the jar of oil didn’t fail, according to the LORD’s word, which he spoke by Elijah.", ref: "1 Kings 17:16" },
    reflection:
      "The jar of meal did not run out and the jug of oil did not fail — but neither did they overflow. God gave a widow and her son exactly enough, daily, for a long time. Enough is a real form of provision, and it is often the one we get.",
    talk: "Are you calling enough a shortage?",
    pray: "Lord, thank you for enough. Keep the jar from failing, and keep us from despising it.",
  },
  {
    read: { text: "Turn back, and tell Hezekiah the prince of my people, ‘the LORD, the God of David your father, says, “I have heard your prayer. I have seen your tears. Behold, I will heal you. On the third day, you will go up to the LORD’s house.”", ref: "2 Kings 20:5" },
    reflection:
      "God tells Hezekiah: I have heard your prayer, I have seen your tears. Both are noted separately. God attends not only to what we say but to what we could not put into words.",
    talk: "What have you cried about that you have never actually prayed about?",
    pray: "Lord, you see our tears as well as hear our words. Both are before you tonight.",
  },
  {
    read: { text: "He took them in his arms, and blessed them, laying his hands on them.", ref: "Mark 10:16" },
    reflection:
      "Jesus took the children in his arms, laid his hands on them and blessed them. He did not merely permit them; he held them. The physical tenderness of Christ toward small children is recorded because it is meant to be imitated.",
    talk: "How much of your care for this child is physical tenderness rather than management?",
    pray: "Lord Jesus, you took children in your arms. Give us your tenderness in our hands.",
  },
  {
    read: { text: "She has done what she could. She has anointed my body beforehand for the burying.", ref: "Mark 14:8" },
    reflection:
      "Jesus defends a woman criticised for waste with five words: she has done what she could. Not what was optimal, not what was enough. In a season where you cannot do what you would, this is the standard Christ himself sets.",
    talk: "What are you condemning yourself for not doing, that was never possible today?",
    pray: "Lord, we have done what we could. Receive it, and forgive what we could not.",
  },
  {
    read: { text: "Now there was at Joppa a certain disciple named Tabitha, which when translated, means Dorcas. This woman was full of good works and acts of mercy which she did.", ref: "Acts 9:36" },
    reflection:
      "Tabitha was full of good works and acts of mercy, mostly sewing clothes for widows. When she died the church showed Peter the coats she had made. A life's ministry displayed as a pile of ordinary garments. Small domestic work is remembered in heaven.",
    talk: "What ordinary work of your hands is serving someone this week?",
    pray: "Lord, receive the small work of our hands as service to you.",
  },
  {
    read: { text: "and because he practiced the same trade, he lived with them and worked, for by trade they were tent makers.", ref: "Acts 18:3" },
    reflection:
      "Paul stayed with Aquila and Priscilla and worked with them, because they were tentmakers by trade. The greatest missionary in history spent his weekdays making tents in someone's house. Ordinary work and gospel work sat in the same room.",
    talk: "Do you treat your daily work as separate from your walk with God?",
    pray: "Lord, join our work and our worship. Let there be no sacred and secular in this house.",
  },
  {
    read: { text: "For you are all children of God, through faith in Christ Jesus. For as many of you as were baptized into Christ have put on Christ.", ref: "Galatians 3:26-27" },
    reflection:
      "In Christ Jesus you are all children of God through faith, for as many as were baptised into Christ have put on Christ. Your deepest identity is not parent. It is child. You are parenting as someone who is themselves being fathered.",
    talk: "Which identity feels more real to you today — parent or child of God?",
    pray: "Father, before we are anyone's parents we are your children. Remind us today.",
  },
  {
    read: { text: "Stand firm therefore in the liberty by which Christ has made us free, and don’t be entangled again with a yoke of bondage.", ref: "Galatians 5:1" },
    reflection:
      "For freedom Christ has set us free; stand firm therefore and do not be entangled again with a yoke of bondage. Parenting attracts new laws quickly — methods, standards, comparisons. Most of them are yokes Christ never gave.",
    talk: "What rule about parenting have you taken on that Christ never gave you?",
    pray: "Lord, we were set free. Keep us from putting on yokes you never made.",
  },
  {
    read: { text: "If we are faithless, he remains faithful; for he can’t deny himself.", ref: "2 Timothy 2:13" },
    reflection:
      "If we are faithless, he remains faithful, for he cannot deny himself. God's faithfulness is not a response to ours. It is grounded in his own being. On the days you have nothing to bring, that is the whole point.",
    talk: "Does your sense of God's faithfulness rise and fall with your own performance?",
    pray: "Lord, you remain faithful when we are not. You cannot deny yourself. Thank you.",
  },
  {
    read: { text: "I have fought the good fight. I have finished the course. I have kept the faith.", ref: "2 Timothy 4:7" },
    reflection:
      "I have fought the good fight, I have finished the course, I have kept the faith. Paul's final audit has nothing about results and everything about endurance. The measure of a Christian parent is not outcome; it is finishing.",
    talk: "What would finishing well look like for you as a parent?",
    pray: "Lord, let us finish the course and keep the faith. That is all we ask.",
  },
  {
    read: { text: "Therefore Eli said to Samuel, “Go, lie down. It shall be, if he calls you, that you shall say, ‘Speak, the LORD; for your servant hears.’ ” So Samuel went and lay down in his place.", ref: "1 Samuel 3:9" },
    reflection:
      "Eli teaches the boy Samuel what to say when God speaks: speak, LORD, for your servant hears. An old man past his own usefulness still gave a child the words to answer God with. You do not need to be strong to hand on something crucial.",
    talk: "What words do you want to put in this child's mouth for speaking to God?",
    pray: "Speak, Lord. Your servants are listening. Teach this child to say it too.",
  },
  {
    read: { text: "Through wisdom a house is built; by understanding it is established; by knowledge the rooms are filled with all rare and beautiful treasure.", ref: "Proverbs 24:3-4" },
    reflection:
      "Through wisdom a house is built, by understanding it is established, and by knowledge the rooms are filled with precious treasures. Three different things: building, establishing, filling. A house needs all three, and none of them is decoration.",
    talk: "Which does our house need most right now — wisdom, understanding, or knowledge?",
    pray: "Lord, build this house by wisdom, establish it by understanding, fill it by knowledge of you.",
  },
  {
    read: { text: "She opens her mouth with wisdom. Kind instruction is on her tongue.", ref: "Proverbs 31:26" },
    reflection:
      "She opens her mouth with wisdom, and the law of kindness is on her tongue. Kindness described as a law — something governing, not occasional. What rules your tongue at the end of a long day is what your child will learn to call normal.",
    talk: "What law is on your tongue when you are exhausted?",
    pray: "Lord, put the law of kindness on our tongues, especially when we are spent.",
  },
];

// The hymnal lives in its own module now — a larger, year-round rotation with
// full public-domain lyrics. Re-exported here so existing imports still resolve.
import { HYMNS, hymnaryUrl, type Hymn } from "./hymns";
export { HYMNS, hymnaryUrl, type Hymn };

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
