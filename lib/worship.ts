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
    read: { text: "For I know the thoughts that I think toward you,” says the LORD, “thoughts of peace, and not of evil, to give you hope and a future.", ref: "Jeremiah 29:11" },
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
    read: { text: "For you didn’t receive the spirit of bondage again to fear, but you received the Spirit of adoption, by whom we cry, “Abba! Father!", ref: "Romans 8:15" },
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
    read: { text: "Jesus said to him, “ ‘You shall love the Lord your God with all your heart, with all your soul, and with all your mind.’ This is the first and great commandment.", ref: "Matthew 22:37-38" },
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
    read: { text: "But when Jesus saw it, he was moved with indignation, and said to them, “Allow the little children to come to me! Don’t forbid them, for God’s Kingdom belongs to such as these.", ref: "Mark 10:14" },
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
    read: { text: "but just as he who called you is holy, you yourselves also be holy in all of your behavior; because it is written, “You shall be holy; for I am holy.", ref: "1 Peter 1:15-16" },
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
