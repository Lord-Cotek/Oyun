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
  {
    read: { text: "She called the name of the LORD who spoke to her, “You are a God who sees,” for she said, “Have I even stayed alive after seeing him?", ref: "Genesis 16:13" },
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
    read: { text: "the LORD said to him, “Who made man’s mouth? Or who makes one mute, or deaf, or seeing, or blind? Isn’t it I, the LORD?", ref: "Exodus 4:11" },
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
    read: { text: "I prayed for this child, and the LORD has given me my petition which I asked of him. Therefore I have also given him to the LORD. As long as he lives he is given to the LORD.” He worshiped the LORD there.", ref: "1 Samuel 1:27-28" },
    reflection:
      "For this child I prayed... therefore I have also given him to the LORD. Hannah's answered prayer ended in giving him away. A child who is a gift is never a possession, and holding them loosely starts long before they leave.",
    talk: "What does it look like to give this child back to God while still longing for them?",
    pray: "Lord, this child is yours before they are ours. Help us hold them with open hands.",
  },
  {
    read: { text: "Hannah prayed, and said: “My heart exults in the LORD! My horn is exalted in the LORD. My mouth is enlarged over my enemies, because I rejoice in your salvation. There is no one as holy as the LORD, for there is no one besides you, nor is there any rock like our God.", ref: "1 Samuel 2:1-2" },
    reflection:
      "My heart exults in the LORD... There is no rock like our God. Hannah's song is not about her baby. Having finally received what she begged for, she sings about God's character, not her outcome.",
    talk: "When God gives you what you asked for, what do you end up praising — the gift or the giver?",
    pray: "Lord, there is no rock like you. Let our joy land on you, not only on your gifts.",
  },
  {
    read: { text: "Please run now to meet her, and ask her, ‘Is it well with you? Is it well with your husband? Is it well with your child?’ ” She answered, “It is well.", ref: "2 Kings 4:26" },
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
    read: { text: "For the mountains may depart, and the hills be removed; but my loving kindness will not depart from you, and my covenant of peace will not be removed,” says the LORD who has mercy on you.", ref: "Isaiah 54:10" },
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
    read: { text: "the LORD is my portion,” says my soul. “Therefore I will hope in him.” the LORD is good to those who wait for him, to the soul who seeks him. It is good that a man should hope and quietly wait for the salvation of the LORD.", ref: "Lamentations 3:24-26" },
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
    read: { text: "Behold, the virgin shall be with child, and shall give birth to a son. They shall call his name Immanuel;” which is, being interpreted, “God with us.", ref: "Matthew 1:23" },
    reflection:
      "Behold, the virgin shall be with child, and shall give birth to a son. They shall call his name Immanuel — God with us. An unplanned, socially catastrophic pregnancy is how God chose to come. He is not embarrassed by complicated circumstances.",
    talk: "What is complicated about your circumstances? Does God seem embarrassed by it?",
    pray: "Immanuel, you came through a difficult story. Be with us in ours.",
  },
  {
    read: { text: "See the birds of the sky, that they don’t sow, neither do they reap, nor gather into barns. Your heavenly Father feeds them. Aren’t you of much more value than they? “Which of you, by being anxious, can add one moment to his lifespan?", ref: "Matthew 6:26-27" },
    reflection:
      "Which of you by being anxious, can add one moment to his lifespan? Jesus does not shame the anxious; he reasons with them. Worry has never once changed an outcome, and he knows how hard that is to feel.",
    talk: "What is your worry actually accomplishing? What would it take to hand it over?",
    pray: "Father, you feed the birds. Teach us to stop trying to control what we cannot.",
  },
  {
    read: { text: "But Jesus said, “Allow the little children, and don’t forbid them to come to me; for the Kingdom of Heaven belongs to ones like these.", ref: "Matthew 19:14" },
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
    read: { text: "Mary said, “My soul magnifies the Lord. My spirit has rejoiced in God my Savior, for he has looked at the humble state of his servant. For behold, from now on, all generations will call me blessed.", ref: "Luke 1:46-48" },
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
    read: { text: "and Simeon blessed them, and said to Mary, his mother, “Behold, this child is set for the falling and the rising of many in Israel, and for a sign which is spoken against. Yes, a sword will pierce through your own soul, that the thoughts of many hearts may be revealed.", ref: "Luke 2:34-35" },
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
    read: { text: "His disciples asked him, “Rabbi, who sinned, this man or his parents, that he was born blind?” Jesus answered, “This man didn’t sin, nor did his parents; but, that the works of God might be revealed in him.", ref: "John 9:2-3" },
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
    read: { text: "They said, “Believe in the Lord Jesus Christ, and you will be saved, you and your household.", ref: "Acts 16:31" },
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
    read: { text: "To the woman he said, “I will greatly multiply your pain in childbirth. You will bear children in pain. Your desire will be for your husband, and he will rule over you.", ref: "Genesis 3:16" },
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
    read: { text: "God heard the voice of the boy. The angel of God called to Hagar out of the sky, and said to her, “What troubles you, Hagar? Don’t be afraid. For God has heard the voice of the boy where he is.", ref: "Genesis 21:17" },
    reflection:
      "God heard the voice of the boy. The angel of God called to Hagar out of the sky. A dying child in a desert, and God heard the child's own voice. He hears children directly.",
    talk: "Does it comfort you that God hears this child independently of you?",
    pray: "Lord, you hear the voice of the child. Hear ours.",
  },
  {
    read: { text: "They blessed Rebekah, and said to her, “Our sister, may you be the mother of thousands of ten thousands, and let your offspring possess the gate of those who hate them.", ref: "Genesis 24:60" },
    reflection:
      "Our sister, may you be the mother of thousands of ten thousands. A family blessing spoken over a woman before she was married. Households have always spoken blessings out loud.",
    talk: "What blessing would you speak over this child? Say it out loud tonight.",
    pray: "Lord, we speak your blessing over this child. Make it so.",
  },
  {
    read: { text: "He lifted up his eyes, and saw the women and the children; and said, “Who are these with you?” He said, “The children whom God has graciously given your servant.", ref: "Genesis 33:5" },
    reflection:
      "Who are these with you? He said, 'The children whom God has graciously given your servant.' Jacob calls his children a gracious gift, not an achievement.",
    talk: "Do you think of this child as a gift or as an accomplishment? What is the difference?",
    pray: "Lord, these are the children you have graciously given. Thank you.",
  },
  {
    read: { text: "He blessed Joseph, and said, “The God before whom my fathers Abraham and Isaac walked, the God who has fed me all my life long to this day, the angel who has redeemed me from all evil, bless the lads, and let my name be named on them, and the name of my fathers Abraham and Isaac. Let them grow into a multitude upon the earth.", ref: "Genesis 48:15-16" },
    reflection:
      "The God who has fed me all my life long to this day, the angel who has redeemed me from all evil, bless the boys. An old man blesses his grandsons out of his own long experience of God.",
    talk: "What has God done in your life that you want this child to know about?",
    pray: "Lord, the God who has fed us all our life long, bless this child.",
  },
  {
    read: { text: "Pharaoh commanded all his people, saying, “You shall cast every son who is born into the river, and every daughter you shall save alive.", ref: "Exodus 1:22" },
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
    read: { text: "the LORD passed by before him, and proclaimed, “the LORD! the LORD, a merciful and gracious God, slow to anger, and abundant in loving kindness and truth,", ref: "Exodus 34:6" },
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
    read: { text: "Manoah said, “Now let your words happen. What shall the child’s way of life and mission be?", ref: "Judges 13:12" },
    reflection:
      "When your words happen, what shall be the child's way of life and mission? A father asks God what the child is for, before the child arrives. That is a good question to ask.",
    talk: "What do you hope this child is for? Can you hold it loosely?",
    pray: "Lord, what will this child's life be? We give them to you.",
  },
  {
    read: { text: "The women said to Naomi, “Blessed be the LORD, who has not left you today without a near kinsman. Let his name be famous in Israel. He shall be to you a restorer of life and sustain you in your old age; for your daughter-in-law, who loves you, who is better to you than seven sons, has given birth to him.", ref: "Ruth 4:14-15" },
    reflection:
      "Blessed be the LORD, who has not left you today without a near kinsman. He shall be to you a restorer of life. A grandmother's grief answered by a grandchild. God restores by generations.",
    talk: "What has been restored in your family? What still needs restoring?",
    pray: "Lord, you restore life and nourish old age. Do that here.",
  },
  {
    read: { text: "She was in bitterness of soul, and prayed to the LORD, weeping bitterly. She vowed a vow, and said, “the LORD of Armies, if you will indeed look at the affliction of your servant and remember me, and not forget your servant, but will give to your servant a boy, then I will give him to the LORD all the days of his life, and no razor shall come on his head.", ref: "1 Samuel 1:10-11" },
    reflection:
      "She was in bitterness of soul, and prayed to the LORD, and wept bitterly. Bitter prayer, recorded without correction. God receives what is bitter as prayer.",
    talk: "Have you prayed bitterly? Did you feel you were allowed to?",
    pray: "Lord, we come bitter and weeping. Receive it as prayer.",
  },
  {
    read: { text: "Then Eli answered, “Go in peace; and may the God of Israel grant your petition that you have asked of him.", ref: "1 Samuel 1:17" },
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
    read: { text: "He said, “While the child was yet alive, I fasted and wept; for I said, ‘Who knows whether the LORD will not be gracious to me, that the child may live?’ But now he is dead, why should I fast? Can I bring him back again? I will go to him, but he will not return to me.", ref: "2 Samuel 12:22-23" },
    reflection:
      "While the child was yet alive, I fasted and wept... but now he is dead, why should I fast? I will go to him, but he will not return to me. David prays until there is nothing to pray for, and then hopes.",
    talk: "If you have lost a child, have you been allowed to grieve out loud? Who knows?",
    pray: "Lord, we shall go to them. Hold those who have buried a child.",
  },
  {
    read: { text: "Then the woman whose the living child was spoke to the king, for her heart yearned over her son, and she said, “Oh, my lord, give her the living child, and in no way kill him!” But the other said, “He shall be neither mine nor yours. Divide him.", ref: "1 Kings 3:26" },
    reflection:
      "Then the woman whose the living child was spoke to the king, for her heart yearned over her son. A mother's love revealed by willingness to lose. That instinct is from God.",
    talk: "What would you give up for this child's good?",
    pray: "Lord, you put this fierce love in us. Let it be like yours.",
  },
  {
    read: { text: "He said, “At this season, when the time comes around, you will embrace a son.” She said, “No, my lord, you man of God, do not lie to your servant.", ref: "2 Kings 4:16" },
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
    read: { text: "and he said, “Listen, all Judah, and you inhabitants of Jerusalem, and you, king Jehoshaphat. the LORD says to you, ‘Don’t be afraid, and don’t be dismayed because of this great multitude; for the battle is not yours, but God’s.", ref: "2 Chronicles 20:15" },
    reflection:
      "Don't be afraid or dismayed because of this great multitude; for the battle is not yours, but God's. Whatever is coming, the outcome does not rest on your strength.",
    talk: "What battle are you treating as yours to win?",
    pray: "Lord, the battle is not ours but yours. We stand still and watch.",
  },
  {
    read: { text: "Then he said to them, “Go your way. Eat the fat, drink the sweet, and send portions to him for whom nothing is prepared, for today is holy to our Lord. Don’t be grieved, for the joy of the LORD is your strength.", ref: "Nehemiah 8:10" },
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
    read: { text: "I said, “Oh that I had wings like a dove! Then I would fly away, and be at rest.", ref: "Psalm 55:6" },
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
    read: { text: "I cried to you, the LORD. I said, “You are my refuge, my portion in the land of the living.", ref: "Psalm 142:5" },
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
    read: { text: "Come now, and let’s reason together,” says the LORD: “Though your sins are as scarlet, they shall be as white as snow. Though they are red like crimson, they shall be as wool.", ref: "Isaiah 1:18" },
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
    read: { text: "This is what the LORD who made you, and formed you from the womb, who will help you says: “Don’t be afraid, Jacob my servant; and you, Jeshurun, whom I have chosen.", ref: "Isaiah 44:2" },
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
      "The LORD will guide you continually, and satisfy your soul in dry places... You shall be like a watered garden. Guidance and satisfaction promised in dry places, not after them.",
    talk: "What is dry in you? What would being watered look like?",
    pray: "Lord, guide us continually and satisfy us in the dry places.",
  },
  {
    read: { text: "The little one will become a thousand, and the small one a strong nation. I, the LORD, will do this quickly in its time.", ref: "Isaiah 60:22" },
    reflection:
      "I, the LORD, will do this quickly in its time. God's timing is described as both patient and sudden. It is not slow; it is timed.",
    talk: "What feels slow? What if it is simply not yet its time?",
    pray: "Lord, in its time you will hasten it. We wait on your clock.",
  },
  {
    read: { text: "But now, the LORD, you are our Father. We are the clay and you our potter. We all are the work of your hand.", ref: "Isaiah 64:8" },
    reflection:
      "But now, LORD, you are our Father. We are the clay and you our potter. We all are the work of your hand. Being clay is not an insult; it is a relationship.",
    talk: "What is being formed in you right now? Can you stay soft?",
    pray: "Lord, you are the potter and we are clay. Form us as you please.",
  },
  {
    read: { text: "Heal me, O the LORD, and I will be healed. Save me, and I will be saved; for you are my praise.", ref: "Jeremiah 17:14" },
    reflection:
      "Heal me, O LORD, and I will be healed. Save me, and I will be saved; for you are my praise. Healing asked for directly, with the outcome placed entirely in his hands.",
    talk: "What needs healing? Have you asked plainly?",
    pray: "Heal us, Lord, and we shall be healed. You are our praise.",
  },
  {
    read: { text: "For I have satiated the weary soul, and I have replenished every sorrowful soul.", ref: "Jeremiah 31:25" },
    reflection:
      "For I have satiated the weary soul, and I have replenished every sorrowful soul. Weary and sorrowful souls specifically named as those he refreshes.",
    talk: "Are you weary, sorrowful, or both? Which needs attention first?",
    pray: "Lord, you satisfy the weary and replenish the sorrowful. Do it here.",
  },
  {
    read: { text: "I will seek that which was lost, and will bring back that which was driven away, and will bind up that which was broken, and will strengthen that which was sick; but I will destroy the fat and the strong. I will feed them in justice.", ref: "Ezekiel 34:16" },
    reflection:
      "I will seek that which was lost, and will bring back that which was driven away, and will bind up that which was broken, and will strengthen that which was sick. Four verbs for four conditions.",
    talk: "Which of the four are you? Lost, driven away, broken, or sick?",
    pray: "Lord, seek, bring back, bind up and strengthen us.",
  },
  {
    read: { text: "If it happens, our God whom we serve is able to deliver us from the burning fiery furnace; and he will deliver us out of your hand, O king. But if not, let it be known to you, O king, that we will not serve your gods or worship the golden image which you have set up.", ref: "Daniel 3:17-18" },
    reflection:
      "Our God whom we serve is able to deliver us... But if not, be it known to you, O king, that we will not serve your gods. Obedience not conditional on rescue.",
    talk: "Is your trust conditional on a particular outcome? How would you know?",
    pray: "Lord, you are able. And if not, we will still be yours.",
  },
  {
    read: { text: "Come! Let’s return to the LORD; for he has torn us to pieces, and he will heal us; he has injured us, and he will bind up our wounds.", ref: "Hosea 6:1" },
    reflection:
      "Come! Let's return to the LORD; for he has torn us to pieces, and he will heal us; he has injured us, and he will bind up our wounds. Torn and healed by the same hand.",
    talk: "Can you hold both — that God has allowed this and will heal it?",
    pray: "Lord, you have torn and you will heal. We return to you.",
  },
  {
    read: { text: "You will have plenty to eat, and be satisfied, and will praise the name of the LORD, your God, who has dealt wondrously with you; and my people will never again be disappointed.", ref: "Joel 2:26" },
    reflection:
      "You will have plenty to eat and be satisfied, and will praise the name of the LORD your God, who has dealt wondrously with you. My people will never again be disappointed.",
    talk: "What disappointment have you carried? What is promised beyond it?",
    pray: "Lord, deal wondrously with us. Let us praise your name.",
  },
  {
    read: { text: "He shall stand, and shall shepherd in the strength of the LORD, in the majesty of the name of the LORD his God: and they will live, for then he will be great to the ends of the earth.", ref: "Micah 5:4" },
    reflection:
      "He shall stand, and shall shepherd in the strength of the LORD... and they will live, for then he will be great to the ends of the earth. The child of Bethlehem grew into the shepherd of the nations.",
    talk: "What might God do with the child in your arms?",
    pray: "Lord Jesus, you were once a child. Shepherd this one all their life.",
  },
  {
    read: { text: "the LORD is good, a stronghold in the day of trouble; and he knows those who take refuge in him.", ref: "Nahum 1:7" },
    reflection:
      "The LORD is good, a stronghold in the day of trouble; and he knows those who take refuge in him. He knows the ones who run to him — by name, individually.",
    talk: "Do you believe God knows you individually? What would change if you did?",
    pray: "Lord, you are good and you know those who take refuge in you.",
  },
  {
    read: { text: "the LORD, I have heard of your fame. I stand in awe of your deeds, the LORD. Renew your work in the middle of the years. In the middle of the years make it known. In wrath, you remember mercy.", ref: "Habakkuk 3:2" },
    reflection:
      "LORD, I have heard of your fame. I stand in awe of your deeds, LORD. Renew your work in the years... In wrath, you remember mercy. Mercy remembered even in judgement.",
    talk: "Where do you need God to remember mercy?",
    pray: "Lord, in wrath remember mercy. Renew your work in our years.",
  },
  {
    read: { text: "Behold, at that time I will deal with all those who afflict you, and I will save those who are lame, and gather those who were driven away. I will give them praise and honor, whose shame has been in all the earth.", ref: "Zephaniah 3:19" },
    reflection:
      "I will save those who are lame, and gather those who were driven away. I will give them praise and honour, whose shame has been in all the earth. Shame exchanged for honour.",
    talk: "What shame do you carry into this season? What does God offer?",
    pray: "Lord, turn our shame to praise. Gather what was driven away.",
  },
  {
    read: { text: "For I,’ says the LORD, ‘will be to her a wall of fire around it, and I will be the glory in the middle of her.", ref: "Zechariah 2:5" },
    reflection:
      "For I, says the LORD, will be to her a wall of fire around her, and I will be the glory in the middle of her. Protection outside and glory inside. Both from him.",
    talk: "What needs a wall of fire around it right now?",
    pray: "Lord, be a wall of fire around this house, and the glory within it.",
  },
  {
    read: { text: "But when he thought about these things, behold, an angel of the Lord appeared to him in a dream, saying, “Joseph, son of David, don’t be afraid to take to yourself Mary, your wife, for that which is conceived in her is of the Holy Spirit.", ref: "Matthew 1:20" },
    reflection:
      "Joseph, son of David, don't be afraid to take to yourself Mary as your wife; for that which is conceived in her is of the Holy Spirit. A man told not to fear a complicated situation.",
    talk: "What complication are you afraid of? What might God be doing in it?",
    pray: "Lord, do not let us fear the situations you have given us.",
  },
  {
    read: { text: "Now when they had departed, behold, an angel of the Lord appeared to Joseph in a dream, saying, “Arise and take the young child and his mother, and flee into Egypt, and stay there until I tell you, for Herod will seek the young child to destroy him.", ref: "Matthew 2:13" },
    reflection:
      "Arise and take the young child and his mother, and flee into Egypt. The holy family became refugees. God's protection sometimes looks like being told to run.",
    talk: "Has God's protection ever looked like upheaval to you?",
    pray: "Lord, you protected the child by flight. Protect ours however you choose.",
  },
  {
    read: { text: "Therefore don’t be like them, for your Father knows what things you need, before you ask him.", ref: "Matthew 6:8" },
    reflection:
      "Your Father knows what things you need, before you ask him. Prayer is not informing God. It is coming to someone who already knows and wants you to come.",
    talk: "If God already knows, why pray? What is prayer actually for?",
    pray: "Father, you know what we need before we ask. We come anyway.",
  },
  {
    read: { text: "Therefore don’t be anxious for tomorrow, for tomorrow will be anxious for itself. Each day’s own evil is sufficient.", ref: "Matthew 6:34" },
    reflection:
      "Therefore don't be anxious for tomorrow, for tomorrow will be anxious for itself. Each day's own evil is sufficient. One day at a time is a command, not merely advice.",
    talk: "What tomorrow are you living in today?",
    pray: "Lord, give us today's grace for today's trouble.",
  },
  {
    read: { text: "Or who is there among you, who, if his son asks him for bread, will give him a stone? Or if he asks for a fish, who will give him a serpent? If you then, being evil, know how to give good gifts to your children, how much more will your Father who is in heaven give good things to those who ask him!", ref: "Matthew 7:9-11" },
    reflection:
      "If you then, being evil, know how to give good gifts to your children, how much more will your Father who is in heaven give good things to those who ask him? Your instinct to give is a shadow of his.",
    talk: "What do you already want to give this child? What does that tell you about God?",
    pray: "Father, you give good gifts. We ask, as children.",
  },
  {
    read: { text: "but the very hairs of your head are all numbered. Therefore don’t be afraid. You are of more value than many sparrows.", ref: "Matthew 10:30-31" },
    reflection:
      "But the very hairs of your head are all numbered. Therefore don't be afraid. You are of more value than many sparrows. God's attention is at the level of hair count.",
    talk: "What does that level of attention mean for this child?",
    pray: "Lord, even our hairs are numbered. Do not let us be afraid.",
  },
  {
    read: { text: "See that you don’t despise one of these little ones, for I tell you that in heaven their angels always see the face of my Father who is in heaven.", ref: "Matthew 18:10" },
    reflection:
      "See that you don't despise one of these little ones, for I tell you that in heaven their angels always see the face of my Father. Children are not to be looked down on. Heaven takes them seriously.",
    talk: "Where does your culture despise children? How will this house be different?",
    pray: "Lord, you honour little ones. Teach us to do the same.",
  },
  {
    read: { text: "But Jesus, when he heard the message spoken, immediately said to the ruler of the synagogue, “Don’t be afraid, only believe.", ref: "Mark 5:36" },
    reflection:
      "Don't be afraid, only believe. Said to a father whose daughter had just died. It is not a denial of the situation but a redirection of where to look.",
    talk: "What is the worst news you fear? Where would you look if it came?",
    pray: "Lord Jesus, do not let us fear. Help us believe.",
  },
  {
    read: { text: "He took a little child, and set him in the middle of them. Taking him in his arms, he said to them, “Whoever receives one such little child in my name, receives me, and whoever receives me, doesn’t receive me, but him who sent me.", ref: "Mark 9:36-37" },
    reflection:
      "He took a little child, and set him in the middle of them. Taking him in his arms, he said... 'Whoever receives one such little child in my name, receives me.' Welcoming a child is welcoming Christ.",
    talk: "How does it change your night feeds to know you are receiving Christ?",
    pray: "Lord Jesus, when we receive this child, we receive you.",
  },
  {
    read: { text: "But the angel said to him, “Don’t be afraid, Zacharias, because your request has been heard. Your wife, Elizabeth, will bear you a son, and you shall call his name John. You will have joy and gladness, and many will rejoice at his birth.", ref: "Luke 1:13-14" },
    reflection:
      "Your request has been heard, and your wife Elizabeth will bear you a son... You will have joy and gladness. A prayer answered decades after it was prayed.",
    talk: "What did you pray years ago that has not yet been answered?",
    pray: "Lord, our prayers are heard, even the old ones.",
  },
  {
    read: { text: "Thus has the Lord done to me in the days in which he looked at me, to take away my reproach among men.", ref: "Luke 1:25" },
    reflection:
      "Thus has the Lord done to me in the days in which he looked at me, to take away my reproach among men. Elizabeth names the social shame she had carried for years.",
    talk: "What reproach have you carried? Who has seen it?",
    pray: "Lord, you look on us and take away our reproach.",
  },
  {
    read: { text: "When Elizabeth heard Mary’s greeting, the baby leaped in her womb; and Elizabeth was filled with the Holy Spirit. She called out with a loud voice and said, “Blessed are you among women, and blessed is the fruit of your womb!", ref: "Luke 1:41-42" },
    reflection:
      "When Elizabeth heard Mary's greeting, the baby leaped in her womb... 'Blessed are you among women, and blessed is the fruit of your womb!' A child responds in the womb.",
    talk: "What have you noticed already from this child? What do you make of it?",
    pray: "Lord, you are at work before we can see. Bless the fruit of this womb.",
  },
  {
    read: { text: "All who heard them laid them up in their heart, saying, “What then will this child be?” The hand of the Lord was with him.", ref: "Luke 1:66" },
    reflection:
      "All who heard them laid them up in their heart, saying, 'What then will this child be?' And the hand of the Lord was with him. The right question, and the right answer.",
    talk: "What will this child be? Can you hold the question open?",
    pray: "Lord, let your hand be with this child, whatever they become.",
  },
  {
    read: { text: "While they were there, the day had come for her to give birth. She gave birth to her firstborn son. She wrapped him in bands of cloth, and laid him in a feeding trough, because there was no room for them in the inn.", ref: "Luke 2:6-7" },
    reflection:
      "The days were fulfilled for her to give birth. She gave birth to her firstborn son... because there was no room for them in the inn. God's own son was born in inadequate conditions.",
    talk: "What is inadequate about your circumstances? Does that disqualify anything?",
    pray: "Lord Jesus, you were laid in a manger. Meet us where we are.",
  },
  {
    read: { text: "When the days of their purification according to the law of Moses were fulfilled, they brought him up to Jerusalem, to present him to the Lord (as it is written in the law of the Lord, “Every male who opens the womb shall be called holy to the Lord”), and to offer a sacrifice according to that which is said in the law of the Lord, “A pair of turtledoves, or two young pigeons.", ref: "Luke 2:22-24" },
    reflection:
      "They brought him up to Jerusalem, to present him to the Lord... a pair of turtledoves. An ordinary religious duty, done by a poor family, for the Son of God.",
    talk: "What ordinary act of devotion could you do for this child?",
    pray: "Lord, we present this child to you, as Mary and Joseph did.",
  },
  {
    read: { text: "The child was growing, and was becoming strong in spirit, being filled with wisdom, and the grace of God was upon him.", ref: "Luke 2:40" },
    reflection:
      "The child was growing, and becoming strong in spirit, being filled with wisdom, and the grace of God was upon him. Growth described in four ways, only one of them physical.",
    talk: "Which kind of growth will be easiest to measure? Which matters most?",
    pray: "Lord, let this child grow strong, filled with wisdom, with your favour upon them.",
  },
  {
    read: { text: "Which of you fathers, if your son asks for bread, will give him a stone? Or if he asks for a fish, he won’t give him a snake instead of a fish, will he? Or if he asks for an egg, he won’t give him a scorpion, will he? If you then, being evil, know how to give good gifts to your children, how much more will your heavenly Father give the Holy Spirit to those who ask him?", ref: "Luke 11:11-13" },
    reflection:
      "How much more will your heavenly Father give the Holy Spirit to those who ask him? The comparison is with a parent's instinct. You are about to learn it firsthand.",
    talk: "What would you never do to this child? What does that say about God?",
    pray: "Father, give us your Holy Spirit. We ask as your children.",
  },
  {
    read: { text: "Aren’t five sparrows sold for two assaria coins? Not one of them is forgotten by God. But the very hairs of your head are all counted. Therefore don’t be afraid. You are of more value than many sparrows.", ref: "Luke 12:6-7" },
    reflection:
      "Aren't five sparrows sold for two assaria coins? Not one of them is forgotten by God. But the very hairs of your head are all numbered. Cheap birds, remembered.",
    talk: "What makes you feel forgettable?",
    pray: "Lord, not one sparrow is forgotten. Neither are we.",
  },
  {
    read: { text: "Jesus summoned them, saying, “Allow the little children to come to me, and don’t hinder them, for God’s Kingdom belongs to such as these.", ref: "Luke 18:16" },
    reflection:
      "Allow the little children to come to me, and don't hinder them, for God's Kingdom belongs to such as these. Repeated in three gospels, because the disciples kept getting it wrong.",
    talk: "What hinders children coming to Christ in a household? Be specific.",
    pray: "Lord Jesus, remove whatever hinders this child from coming to you.",
  },
  {
    read: { text: "But as many as received him, to them he gave the right to become God’s children, to those who believe in his name: who were born not of blood, nor of the will of the flesh, nor of the will of man, but of God.", ref: "John 1:12-13" },
    reflection:
      "But as many as received him, to them he gave the right to become God's children, who were born not of blood, nor of the will of the flesh... but of God. A second birth, given not achieved.",
    talk: "What is the difference between being born and being born again?",
    pray: "Lord, give this child the right to become your child.",
  },
  {
    read: { text: "That which is born of the flesh is flesh. That which is born of the Spirit is spirit.", ref: "John 3:6" },
    reflection:
      "That which is born of the flesh is flesh. That which is born of the Spirit is spirit. This birth is not the last one that matters. Pray for the second as much as the first.",
    talk: "Do you pray for this child's second birth? What would that prayer sound like?",
    pray: "Lord, birth this child in the flesh, and then in your Spirit.",
  },
  {
    read: { text: "All those whom the Father gives me will come to me. He who comes to me I will in no way throw out.", ref: "John 6:37" },
    reflection:
      "He who comes to me I will in no way throw out. A double negative for emphasis. Whoever comes — including a child raised in a stumbling household — is never turned away.",
    talk: "What do you fear would disqualify this child from Christ? What does this say?",
    pray: "Lord Jesus, you cast out no one who comes. Bring this child to you.",
  },
  {
    read: { text: "I will not leave you orphans. I will come to you.", ref: "John 14:18" },
    reflection:
      "I will not leave you orphans. I will come to you. Christ's promise uses the language of parentless children. He does not abandon the ones he has taken responsibility for.",
    talk: "Have you ever felt abandoned by God? What does this promise say?",
    pray: "Lord Jesus, you will not leave us as orphans. Come to us.",
  },
  {
    read: { text: "A woman, when she gives birth, has sorrow because her time has come. But when she has delivered the child, she doesn’t remember the anguish any more, for the joy that a human being is born into the world.", ref: "John 16:21" },
    reflection:
      "A woman, when she gives birth, has sorrow, because her time has come. But when she has delivered the child, she doesn't remember the anguish any more, for the joy. Jesus uses labour as his image for suffering and joy.",
    talk: "How does it feel that Christ chose childbirth as his picture of coming joy?",
    pray: "Lord Jesus, you know that the anguish gives way to joy. Carry us through.",
  },
  {
    read: { text: "For the promise is to you, and to your children, and to all who are far off, even as many as the Lord our God will call to himself.", ref: "Acts 2:39" },
    reflection:
      "For the promise is to you, and to your children, and to all who are far off, even as many as the Lord our God will call. The promise reaches to children by name.",
    talk: "What promise of God do you most want for this child?",
    pray: "Lord, the promise is for us and for our children. Call them.",
  },
  {
    read: { text: "He made from one blood every nation of men to dwell on all the surface of the earth, having determined appointed seasons, and the boundaries of their dwellings,", ref: "Acts 17:26" },
    reflection:
      "He made from one blood every nation of men to dwell on all the surface of the earth, having determined appointed seasons, and the boundaries of their dwellings. Even the where and when are appointed.",
    talk: "Does it change anything that this child's time and place are chosen?",
    pray: "Lord, you appoint our times and places. Thank you for this one.",
  },
  {
    read: { text: "Without being weakened in faith, he didn’t consider his own body, already having been worn out, (he being about a hundred years old), and the deadness of Sarah’s womb. Yet, looking to the promise of God, he didn’t waver through unbelief, but grew strong through faith, giving glory to God, and being fully assured that what he had promised, he was also able to perform.", ref: "Romans 4:19-21" },
    reflection:
      "Without being weakened in faith, he didn't consider his own body, already having been worn out... yet, looking to the promise of God, he didn't waver. Abraham faced the facts and believed anyway.",
    talk: "What facts are you facing? Is faith denial, or something else?",
    pray: "Lord, we face the facts and still believe your promise.",
  },
  {
    read: { text: "But if the Spirit of him who raised up Jesus from the dead dwells in you, he who raised up Christ Jesus from the dead will also give life to your mortal bodies through his Spirit who dwells in you.", ref: "Romans 8:11" },
    reflection:
      "But if the Spirit of him who raised up Jesus from the dead dwells in you... will also give life to your mortal bodies through his Spirit who dwells in you. Resurrection power, in a tired body.",
    talk: "What does your body need? Have you asked for the Spirit's help with it?",
    pray: "Lord, the Spirit who raised Jesus dwells in us. Give life to our mortal bodies.",
  },
  {
    read: { text: "rejoicing in hope; enduring in troubles; continuing steadfastly in prayer;", ref: "Romans 12:12" },
    reflection:
      "Rejoicing in hope; enduring in troubles; continuing steadfastly in prayer. Three instructions for a long season. All three are choices, not moods.",
    talk: "Which of the three is hardest today?",
    pray: "Lord, make us joyful in hope, patient in tribulation, constant in prayer.",
  },
  {
    read: { text: "Now the God of perseverance and of encouragement grant you to be of the same mind with one another according to Christ Jesus,", ref: "Romans 15:5" },
    reflection:
      "Now the God of patience and encouragement grant you to be of the same mind with one another according to Christ Jesus. God is named as the source of patience and encouragement.",
    talk: "Where has patience run out between you? Ask its source for more.",
    pray: "God of endurance and encouragement, grant us to live in harmony.",
  },
  {
    read: { text: "God is faithful, through whom you were called into the fellowship of his Son, Jesus Christ, our Lord.", ref: "1 Corinthians 1:9" },
    reflection:
      "God is faithful, through whom you were called into the fellowship of his Son, Jesus Christ, our Lord. Faithfulness stated as a fact about God, not a feeling about circumstances.",
    talk: "What does God's faithfulness look like when circumstances are hard?",
    pray: "Lord, you are faithful. You called us, and you will keep us.",
  },
  {
    read: { text: "No temptation has taken you except what is common to man. God is faithful, who will not allow you to be tempted above what you are able, but will with the temptation also make the way of escape, that you may be able to endure it.", ref: "1 Corinthians 10:13" },
    reflection:
      "God is faithful, who will not allow you to be tempted above what you are able, but will with the temptation also make the way of escape. A way out is promised — not the absence of pressure.",
    talk: "Where do you feel at your limit? Is there an exit you have not taken?",
    pray: "Lord, you are faithful. Show us the way of escape.",
  },
  {
    read: { text: "When I was a child, I spoke as a child, I felt as a child, I thought as a child. Now that I have become a man, I have put away childish things.", ref: "1 Corinthians 13:11" },
    reflection:
      "When I was a child, I spoke as a child, I felt as a child, I thought as a child. Now that I have become a man, I have put away childish things. Childhood is a stage, not a defect.",
    talk: "How will you let this child be a child, without rushing them?",
    pray: "Lord, let this child be a child, in your good time.",
  },
  {
    read: { text: "Yes, we ourselves have had the sentence of death within ourselves, that we should not trust in ourselves, but in God who raises the dead, who delivered us out of so great a death, and does deliver; on whom we have set our hope that he will also still deliver us;", ref: "2 Corinthians 1:9-10" },
    reflection:
      "That we should not trust in ourselves, but in God who raises the dead... on whom we have set our hope that he will also still deliver us. Past deliverance funding present hope.",
    talk: "What has God already delivered you from? Does it fund your hope now?",
    pray: "Lord, you have delivered and will deliver. On you we have set our hope.",
  },
  {
    read: { text: "Therefore I take pleasure in weaknesses, in injuries, in necessities, in persecutions, and in distresses, for Christ’s sake. For when I am weak, then am I strong.", ref: "2 Corinthians 12:10" },
    reflection:
      "For when I am weak, then am I strong. A statement of how God's economy works, written by someone whose thorn was not removed.",
    talk: "Where are you weakest right now? What is offered there?",
    pray: "Lord, when we are weak, then we are strong in you.",
  },
  {
    read: { text: "My little children, of whom I am again in travail until Christ is formed in you—", ref: "Galatians 4:19" },
    reflection:
      "My little children, of whom I am again in travail until Christ is formed in you. Paul uses labour pains for spiritual formation. The forming of Christ in someone costs something like childbirth.",
    talk: "What does it cost to form Christ in a child? Are you ready for that?",
    pray: "Lord, let Christ be formed in this child, whatever it costs us.",
  },
  {
    read: { text: "having predestined us for adoption as children through Jesus Christ to himself, according to the good pleasure of his desire,", ref: "Ephesians 1:5" },
    reflection:
      "Having predestined us for adoption as children through Jesus Christ to himself, according to the good pleasure of his desire. Adoption according to his pleasure. God wanted us.",
    talk: "How does it feel that God's adoption of you was his pleasure?",
    pray: "Father, you adopted us according to your good pleasure. Thank you.",
  },
  {
    read: { text: "Now to him who is able to do exceedingly abundantly above all that we ask or think, according to the power that works in us,", ref: "Ephesians 3:20" },
    reflection:
      "Now to him who is able to do exceedingly abundantly above all that we ask or think, according to the power that works in us. His ability exceeds our imagination, not just our request.",
    talk: "What are you afraid to ask for?",
    pray: "Lord, you are able to do far more than we ask or imagine.",
  },
  {
    read: { text: "being confident of this very thing, that he who began a good work in you will complete it until the day of Jesus Christ.", ref: "Philippians 1:6" },
    reflection:
      "Being confident of this very thing, that he who began a good work in you will complete it until the day of Jesus Christ. God finishes what he starts. That applies to you and to this child.",
    talk: "What unfinished thing in you worries you? Who is committed to completing it?",
    pray: "Lord, you began a good work. Bring it to completion.",
  },
  {
    read: { text: "In nothing be anxious, but in everything, by prayer and petition with thanksgiving, let your requests be made known to God. And the peace of God, which surpasses all understanding, will guard your hearts and your thoughts in Christ Jesus.", ref: "Philippians 4:6-7" },
    reflection:
      "In everything, by prayer and petition with thanksgiving, let your requests be made known to God. And the peace of God, which surpasses all understanding, will guard your hearts.",
    talk: "What anxiety could become a request tonight?",
    pray: "Lord, we bring our anxieties with thanksgiving. Guard our hearts and minds.",
  },
  {
    read: { text: "And let the peace of God rule in your hearts, to which also you were called in one body, and be thankful.", ref: "Colossians 3:15" },
    reflection:
      "Let the peace of God rule in your hearts... and be thankful. Peace as an umpire in the heart, and thankfulness alongside it.",
    talk: "What is ruling your heart right now — peace or something else?",
    pray: "Lord, let your peace rule in our hearts. Make us thankful.",
  },
  {
    read: { text: "But we were gentle among you, like a nursing mother cherishes her own children.", ref: "1 Thessalonians 2:7" },
    reflection:
      "But we were gentle among you, like a nursing mother cherishes her own children. Paul reaches for a nursing mother to describe his ministry. Tenderness is not weakness.",
    talk: "Where do you mistake gentleness for weakness?",
    pray: "Lord, make us gentle as a nursing mother, and count that strength.",
  },
  {
    read: { text: "Therefore exhort one another, and build each other up, even as you also do.", ref: "1 Thessalonians 5:11" },
    reflection:
      "Therefore exhort one another, and build each other up, even as you also do. Encouragement is maintenance work. It is never finished, in any season.",
    talk: "Say one specific true encouraging thing to each other now.",
    pray: "Lord, make us builders of one another.",
  },
  {
    read: { text: "having been reminded of the sincere faith that is in you, which lived first in your grandmother Lois, and your mother Eunice, and, I am persuaded, in you also.", ref: "2 Timothy 1:5" },
    reflection:
      "The sincere faith that is in you, which lived first in your grandmother Lois, and your mother Eunice, and, I am persuaded, in you also. Faith travelling three generations through a household.",
    talk: "Whose faith did you receive? Who will receive yours?",
    pray: "Lord, let faith live in this house and pass to this child.",
  },
  {
    read: { text: "Let’s therefore draw near with boldness to the throne of grace, that we may receive mercy and may find grace for help in time of need.", ref: "Hebrews 4:16" },
    reflection:
      "Let's therefore draw near with boldness to the throne of grace, that we may receive mercy, and may find grace for help in time of need. Boldness at a throne, because of who sits on it.",
    talk: "Do you come to God boldly or apologetically? Why?",
    pray: "Lord, we draw near boldly. Give us mercy and grace to help in time of need.",
  },
  {
    read: { text: "By faith, even Sarah herself received power to conceive, and she bore a child when she was past age, since she counted him faithful who had promised.", ref: "Hebrews 11:11" },
    reflection:
      "By faith, even Sarah herself received power to conceive... since she counted him faithful who had promised. The woman who laughed is listed among the faithful.",
    talk: "Have you laughed at a promise? Does that disqualify you?",
    pray: "Lord, we have doubted and we still count you faithful.",
  },
  {
    read: { text: "Be free from the love of money, content with such things as you have, for he has said, “I will in no way leave you, neither will I in any way forsake you.” So that with good courage we say, “The Lord is my helper. I will not fear. What can man do to me?", ref: "Hebrews 13:5-6" },
    reflection:
      "I will in no way leave you, neither will I in any way forsake you. So that with good courage we say, 'The Lord is my helper. I will not fear.' A double negative, twice, for certainty.",
    talk: "What are you afraid of losing? What can never be lost?",
    pray: "Lord, you will never leave us nor forsake us. We will not fear.",
  },
  {
    read: { text: "But if any of you lacks wisdom, let him ask of God, who gives to all liberally and without reproach, and it will be given to him.", ref: "James 1:5" },
    reflection:
      "But if any of you lacks wisdom, let him ask of God, who gives to all liberally and without reproach. New parents lack wisdom by definition. God gives without making you feel foolish for asking.",
    talk: "What do you not know how to do? Have you asked God about it?",
    pray: "Lord, we lack wisdom. Give generously, without reproach.",
  },
  {
    read: { text: "Wherein you greatly rejoice, though now for a little while, if need be, you have been grieved in various trials, that the proof of your faith, which is more precious than gold that perishes even though it is tested by fire, may be found to result in praise, glory, and honor at the revelation of Jesus Christ—", ref: "1 Peter 1:6-7" },
    reflection:
      "You greatly rejoice, though now for a little while, if need be, you have been grieved in various trials, that the proof of your faith... may be found to result in praise. Grief and rejoicing together.",
    talk: "Can you grieve and rejoice at the same time? Is that dishonest, or biblical?",
    pray: "Lord, we rejoice and we grieve. Refine our faith through both.",
  },
  {
    read: { text: "casting all your worries on him, because he cares for you.", ref: "1 Peter 5:7" },
    reflection:
      "Casting all your worries on him, because he cares for you. All of them, and the reason given is his care, not your competence.",
    talk: "Which worry have you not cast? Why that one?",
    pray: "Lord, we cast all our anxiety on you, because you care for us.",
  },
  {
    read: { text: "There is no fear in love; but perfect love casts out fear, because fear has punishment. He who fears is not made perfect in love.", ref: "1 John 4:18" },
    reflection:
      "There is no fear in love; but perfect love casts out fear, because fear has punishment. He who fears is not made perfect in love. Fear and love cannot occupy the same space.",
    talk: "What fear is largest right now? What love could displace it?",
    pray: "Lord, cast out our fear with your perfect love.",
  },
  {
    read: { text: "He who sits on the throne said, “Behold, I am making all things new.” He said, “Write, for these words of God are faithful and true.", ref: "Revelation 21:5" },
    reflection:
      "Behold, I am making all things new. Not all new things — all things new. Including bodies, including grief, including whatever this season has cost.",
    talk: "What do you most want made new?",
    pray: "Lord, you make all things new. We wait for that day.",
  },
  {
    read: { text: "The man knew Eve his wife. She conceived, and gave birth to Cain, and said, “I have gotten a man with the LORD’s help.", ref: "Genesis 4:1" },
    reflection:
      "She conceived, and gave birth to Cain, and said, 'I have gotten a man with the LORD's help.' The first mother credits God for the birth. Even outside Eden, children come with his help.",
    talk: "Who do you credit for this child? Does it show in how you speak about it?",
    pray: "Lord, with your help we have this child. Thank you.",
  },
  {
    read: { text: "This is the book of the generations of Adam. In the day that God created man, he made him in God’s likeness. He created them male and female, and blessed them. On the day they were created, he named them Adam.", ref: "Genesis 5:1-2" },
    reflection:
      "In the day that God created man, he made him in God's likeness. He created them male and female, and blessed them. Likeness and blessing, stated before any achievement.",
    talk: "What does this child have to do to be valuable? Nothing — why is that hard to feel?",
    pray: "Lord, you made and blessed us before we did anything. Thank you.",
  },
  {
    read: { text: "the LORD brought him outside, and said, “Look now toward the sky, and count the stars, if you are able to count them.” He said to Abram, “So your offspring will be.", ref: "Genesis 15:5" },
    reflection:
      "Look now toward the sky, and count the stars, if you are able to count them. So shall your offspring be. God took a childless man outside to look up.",
    talk: "When did you last look up? What does the sky say to you about God?",
    pray: "Lord, you count the stars and the generations. We trust you with ours.",
  },
  {
    read: { text: "Abraham called the name of that place “the LORD Will Provide”. As it is said to this day, “On the LORD’s mountain, it will be provided.", ref: "Genesis 22:14" },
    reflection:
      "Abraham called the name of that place 'The LORD will provide.' God's provision came at the last moment, and Abraham named the place for it.",
    talk: "What has God provided at the last moment? Have you named it?",
    pray: "Lord, you provide. On the mountain of the Lord it will be provided.",
  },
  {
    read: { text: "Jacob awakened out of his sleep, and he said, “Surely the LORD is in this place, and I didn’t know it.", ref: "Genesis 28:16" },
    reflection:
      "Surely the LORD is in this place, and I didn't know it. Jacob wakes up and realises God was present all along. Some of God's presence is recognised late.",
    talk: "Where might God be present that you have not noticed?",
    pray: "Lord, surely you are in this place. Open our eyes to see it.",
  },
  {
    read: { text: "He said, “If you will diligently listen to the LORD your God’s voice, and will do that which is right in his eyes, and will pay attention to his commandments, and keep all his statutes, I will put none of the diseases on you, which I have put on the Egyptians; for I am the LORD who heals you.", ref: "Exodus 15:26" },
    reflection:
      "For I am the LORD who heals you. God names himself as healer. Whatever medicine you use, this is who stands behind healing.",
    talk: "How do you hold together medicine and prayer?",
    pray: "Lord, you are the God who heals us. Heal us as you see fit.",
  },
  {
    read: { text: "You shall serve the LORD your God, and he will bless your bread and your water, and I will take sickness away from among you. No one will miscarry or be barren in your land. I will fulfill the number of your days.", ref: "Exodus 23:25-26" },
    reflection:
      "You shall serve the LORD your God... I will take sickness away from among you. No one will miscarry or be barren in your land. A covenant promise to a nation, not a contract for individuals today.",
    talk: "Why does it matter to read this promise in its context?",
    pray: "Lord, you are the giver of life. We ask, and we do not presume.",
  },
  {
    read: { text: "God is not a man, that he should lie, nor a son of man, that he should repent. Has he said, and will he not do it? Or has he spoken, and will he not make it good?", ref: "Numbers 23:19" },
    reflection:
      "God is not a man, that he should lie. Has he said, and will he not do it? Or has he spoken, and will he not make it good? Two rhetorical questions with one answer.",
    talk: "What has God said that you struggle to believe he will do?",
    pray: "Lord, you are not a man that you should lie. We stand on your word.",
  },
  {
    read: { text: "About Benjamin he said, “The beloved of the LORD will dwell in safety by him. He covers him all day long. He dwells between his shoulders.", ref: "Deuteronomy 33:12" },
    reflection:
      "The beloved of the LORD will dwell in safety by him. He covers him all day long. He dwells between his shoulders. Carried on the shoulders, all day. That is the picture.",
    talk: "What would it mean to be carried on God's shoulders through today?",
    pray: "Lord, shield us all day long. Let us dwell between your shoulders.",
  },
  {
    read: { text: "There is no one as holy as the LORD, for there is no one besides you, nor is there any rock like our God.", ref: "1 Samuel 2:2" },
    reflection:
      "There is no one as holy as the LORD, for there is no one besides you, nor is there any rock like our God. Hannah's song, after receiving what she begged for, is about God's character.",
    talk: "When God gives you what you asked for, what do you praise — the gift or the giver?",
    pray: "Lord, there is no rock like our God. We praise you, not just your gifts.",
  },
  {
    read: { text: "From the lips of babes and infants you have established strength, because of your adversaries, that you might silence the enemy and the avenger.", ref: "Psalm 8:2" },
    reflection:
      "From the lips of babes and infants you have established strength. Jesus quoted this about children praising him in the temple. God establishes strength through the smallest mouths.",
    talk: "What could a baby teach a household about God?",
    pray: "Lord, out of the mouths of infants you have established strength.",
  },
  {
    read: { text: "Keep me as the apple of your eye. Hide me under the shadow of your wings,", ref: "Psalm 17:8" },
    reflection:
      "Keep me as the apple of your eye. Hide me under the shadow of your wings. Two images of tenderness and protection, asked for directly.",
    talk: "Which image speaks to you more — the eye, or the wings?",
    pray: "Lord, keep us as the apple of your eye. Hide us in the shadow of your wings.",
  },
  {
    read: { text: "the LORD will give strength to his people. the LORD will bless his people with peace.", ref: "Psalm 29:11" },
    reflection:
      "The LORD will give strength to his people. The LORD will bless his people with peace. Strength and peace, given by the God whose voice shakes the wilderness.",
    talk: "Do you need strength or peace more today?",
    pray: "Lord, give strength to your people. Bless this house with peace.",
  },
  {
    read: { text: "the LORD’s angel encamps around those who fear him, and delivers them.", ref: "Psalm 34:7" },
    reflection:
      "The LORD's angel encamps around those who fear him, and delivers them. Encamped around — a surrounding presence, not a distant watch.",
    talk: "What are you afraid is unprotected right now?",
    pray: "Lord, encamp around this house and deliver us.",
  },
  {
    read: { text: "For you are my hope, Lord the LORD, my confidence from my youth. I have relied on you from the womb. You are he who took me out of my mother’s womb. I will always praise you.", ref: "Psalm 71:5-6" },
    reflection:
      "For you are my hope, Lord the LORD, my confidence from my youth. I have relied on you from the womb. Confidence traced right back to before memory.",
    talk: "How far back does your trust in God go? What formed it?",
    pray: "Lord, you have been our hope from our youth. Be this child's too.",
  },
  {
    read: { text: "that the generation to come might know, even the children who should be born; who should arise and tell their children, that they might set their hope in God, and not forget God’s deeds, but keep his commandments,", ref: "Psalm 78:6-7" },
    reflection:
      "That the generation to come might know, even the children who should be born; who should arise and tell their children, that they might set their hope in God. Four generations in one sentence.",
    talk: "What are you telling that could reach four generations?",
    pray: "Lord, let the children yet to be born set their hope in you.",
  },
  {
    read: { text: "Yes, the sparrow has found a home, and the swallow a nest for herself, where she may have her young, near your altars, the LORD of Armies, my King, and my God.", ref: "Psalm 84:3" },
    reflection:
      "Yes, the sparrow has found a home, and the swallow a nest for herself, where she may have her young, near your altars. Even a bird's nesting place is near God's altar.",
    talk: "Is this house near God's altar? What would make it nearer?",
    pray: "Lord, let this nest be built near your altar.",
  },
  {
    read: { text: "But the LORD’s loving kindness is from everlasting to everlasting with those who fear him, his righteousness to children’s children, to those who keep his covenant, to those who remember to obey his precepts.", ref: "Psalm 103:17-18" },
    reflection:
      "But the LORD's loving kindness is from everlasting to everlasting with those who fear him, his righteousness to children's children. Love reaching to grandchildren.",
    talk: "What do you hope will still be true in your grandchildren?",
    pray: "Lord, let your righteousness reach our children's children.",
  },
  {
    read: { text: "He will not be afraid of evil news. His heart is steadfast, trusting in the LORD.", ref: "Psalm 112:7" },
    reflection:
      "He will not be afraid of evil news. His heart is steadfast, trusting in the LORD. The news may still be bad. The heart is settled in advance.",
    talk: "How does this house handle bad news? What would settle you beforehand?",
    pray: "Lord, steady our hearts now, before the news comes.",
  },
  {
    read: { text: "I love the LORD, because he listens to my voice, and my cries for mercy. Because he has turned his ear to me, therefore I will call on him as long as I live.", ref: "Psalm 116:1-2" },
    reflection:
      "I love the LORD, because he listens to my voice, and my cries for mercy. Because he has turned his ear to me, therefore I will call on him as long as I live.",
    talk: "Do you pray as though you are being listened to?",
    pray: "Lord, you have inclined your ear to us. We will call on you as long as we live.",
  },
  {
    read: { text: "It is vain for you to rise up early, to stay up late, eating the bread of toil, for he gives sleep to his loved ones.", ref: "Psalm 127:2" },
    reflection:
      "It is vain for you to rise up early, to stay up late... for he gives to his beloved sleep. Sleep described as a gift, not a luxury. In this season that is a hard word and a needed one.",
    talk: "What are you doing with your exhaustion? Is any of it self-imposed?",
    pray: "Lord, you give sleep to your beloved. Give it to us.",
  },
  {
    read: { text: "the LORD, my heart isn’t arrogant, nor my eyes lofty; nor do I concern myself with great matters, or things too wonderful for me.", ref: "Psalm 131:1" },
    reflection:
      "LORD, my heart isn't arrogant, nor my eyes lofty; nor do I concern myself with great matters, or things too wonderful for me. Deliberately setting down what is not yours to carry.",
    talk: "What are you carrying that is too great for you?",
    pray: "Lord, we do not occupy ourselves with things too great. Quiet us.",
  },
  {
    read: { text: "Cause me to hear your loving kindness in the morning, for I trust in you. Cause me to know the way in which I should walk, for I lift up my soul to you.", ref: "Psalm 143:8" },
    reflection:
      "Cause me to hear your loving kindness in the morning, for I trust in you. Cause me to know the way in which I should walk. A morning prayer for love and direction.",
    talk: "What are your mornings like? What could change in one of them?",
    pray: "Lord, let us hear your steadfast love in the morning. Show us the way.",
  },
  {
    read: { text: "The fear of the LORD is the beginning of knowledge; but the foolish despise wisdom and instruction.", ref: "Proverbs 1:7" },
    reflection:
      "The fear of the LORD is the beginning of knowledge. Everything this child will ever learn has a proper starting point, and it is reverence.",
    talk: "Where do you want this child's education to begin?",
    pray: "Lord, let the fear of you be the beginning of this child's knowledge.",
  },
  {
    read: { text: "Two are better than one, because they have a good reward for their labor. For if they fall, the one will lift up his fellow; but woe to him who is alone when he falls, and doesn’t have another to lift him up.", ref: "Ecclesiastes 4:9-10" },
    reflection:
      "Two are better than one... For if they fall, the one will lift up his fellow. The passage assumes falling. Company is for the fall, not just the walk.",
    talk: "Who would lift you up if you fell right now? Do they know?",
    pray: "Lord, two are better than one. Give us people close enough to lift us.",
  },
  {
    read: { text: "But now the LORD who created you, Jacob, and he who formed you, Israel, says: “Don’t be afraid, for I have redeemed you. I have called you by your name. You are mine.", ref: "Isaiah 43:1" },
    reflection:
      "Don't be afraid, for I have redeemed you. I have called you by your name. You are mine. Named and owned. That is said to you, and it will be true of this child.",
    talk: "What does it mean to be called by name and belong to God?",
    pray: "Lord, you have called us by name. We are yours.",
  },
  {
    read: { text: "All your children will be taught by the LORD; and your children’s peace will be great.", ref: "Isaiah 54:13" },
    reflection:
      "All your children will be taught by the LORD; and your children's peace will be great. God teaching children directly. Your teaching is not the only means he has.",
    talk: "Does it relieve you that God teaches children himself?",
    pray: "Lord, teach our children yourself. Give them great peace.",
  },
  {
    read: { text: "Ah Lord the LORD! Behold, you have made the heavens and the earth by your great power and by your outstretched arm. There is nothing too hard for you.", ref: "Jeremiah 32:17" },
    reflection:
      "Ah Lord the LORD! Behold, you have made the heavens and the earth by your great power... There is nothing too hard for you. Prayed in the middle of a siege.",
    talk: "What looks too hard right now?",
    pray: "Lord, nothing is too hard for you. Not even this.",
  },
  {
    read: { text: "For he who is mighty has done great things for me. Holy is his name. His mercy is for generations of generations on those who fear him.", ref: "Luke 1:49-50" },
    reflection:
      "For he who is mighty has done great things for me. Holy is his name. His mercy is for generations of generations on those who fear him. Mary's song looks forward and back.",
    talk: "What great thing has God done for you? Say it out loud.",
    pray: "Lord, you have done great things for us. Holy is your name.",
  },
  {
    read: { text: "Don’t be afraid, little flock, for it is your Father’s good pleasure to give you the Kingdom.", ref: "Luke 12:32" },
    reflection:
      "Don't be afraid, little flock, for it is your Father's good pleasure to give you the Kingdom. Good pleasure — not reluctance. God enjoys giving to his people.",
    talk: "Do you experience God as generous or grudging? Where did that come from?",
    pray: "Father, it is your good pleasure to give. Let us receive gladly.",
  },
  {
    read: { text: "I give eternal life to them. They will never perish, and no one will snatch them out of my hand. My Father who has given them to me is greater than all. No one is able to snatch them out of my Father’s hand.", ref: "John 10:28-29" },
    reflection:
      "They will never perish, and no one will snatch them out of my hand... no one is able to snatch them out of my Father's hand. Two hands, and nothing can prise them open.",
    talk: "What do you fear could take this child from God?",
    pray: "Lord, no one can snatch them from your hand. Hold this child there.",
  },
  {
    read: { text: "For I am persuaded that neither death, nor life, nor angels, nor principalities, nor things present, nor things to come, nor powers, nor height, nor depth, nor any other created thing will be able to separate us from God’s love which is in Christ Jesus our Lord.", ref: "Romans 8:38-39" },
    reflection:
      "Neither death, nor life... nor any other created thing, will be able to separate us from God's love which is in Christ Jesus our Lord. An exhaustive list, and none of it can separate.",
    talk: "Which item on Paul's list do you fear most?",
    pray: "Lord, nothing can separate us from your love in Christ Jesus.",
  },
  {
    read: { text: "Therefore, my beloved brothers, be steadfast, immovable, always abounding in the Lord’s work, because you know that your labor is not in vain in the Lord.", ref: "1 Corinthians 15:58" },
    reflection:
      "Be steadfast, immovable, always abounding in the Lord's work, because you know that your labour is not in vain in the Lord. Night feeds are labour in the Lord.",
    talk: "What labour feels wasted right now?",
    pray: "Lord, our labour is not in vain. Keep us steadfast.",
  },
  {
    read: { text: "For our light affliction, which is for the moment, works for us more and more exceedingly an eternal weight of glory, while we don’t look at the things which are seen, but at the things which are not seen. For the things which are seen are temporal, but the things which are not seen are eternal.", ref: "2 Corinthians 4:17-18" },
    reflection:
      "For our light affliction, which is for the moment, works for us more and more exceedingly an eternal weight of glory. Paul, who was beaten and shipwrecked, called it light.",
    talk: "What weighs on you? What is it being weighed against?",
    pray: "Lord, weigh our affliction against your glory. Fix our eyes on what is unseen.",
  },
  {
    read: { text: "For we are his workmanship, created in Christ Jesus for good works, which God prepared before that we would walk in them.", ref: "Ephesians 2:10" },
    reflection:
      "For we are his workmanship, created in Christ Jesus for good works, which God prepared before that we would walk in them. Works prepared in advance — including for this child.",
    talk: "What might God have prepared for this child to walk in?",
    pray: "Lord, you prepare works in advance. Prepare them for this child.",
  },
  {
    read: { text: "For it is God who works in you both to will and to work, for his good pleasure.", ref: "Philippians 2:13" },
    reflection:
      "For it is God who works in you both to will and to work, for his good pleasure. Even the wanting is his work. That takes pressure off exhausted people.",
    talk: "Where do you need God to change what you want, not just what you do?",
    pray: "Lord, work in us to will and to work for your good pleasure.",
  },
  {
    read: { text: "Put on therefore, as God’s chosen ones, holy and beloved, a heart of compassion, kindness, lowliness, humility, and perseverance;", ref: "Colossians 3:12" },
    reflection:
      "Put on therefore, as God's chosen ones, a heart of compassion, kindness, lowliness, humility, and perseverance. Clothing chosen deliberately each morning. Some mornings that is the whole battle.",
    talk: "Which of these did you forget to put on today?",
    pray: "Lord, clothe us with compassion, kindness, humility, meekness and patience.",
  },
  {
    read: { text: "May the God of peace himself sanctify you completely. May your whole spirit, soul, and body be preserved blameless at the coming of our Lord Jesus Christ.", ref: "1 Thessalonians 5:23" },
    reflection:
      "May the God of peace himself sanctify you completely. May your whole spirit, soul, and body be preserved blameless. The whole person, body included, named in the prayer.",
    talk: "What part of you most needs preserving right now — body, soul, or spirit?",
    pray: "God of peace, sanctify us completely and keep us blameless.",
  },
  {
    read: { text: "Confess your offenses to one another, and pray for one another, that you may be healed. The insistent prayer of a righteous person is powerfully effective.", ref: "James 5:16" },
    reflection:
      "Confess your offences to one another, and pray for one another, that you may be healed. Confession and prayer joined, with healing as the direction.",
    talk: "Confess one thing to each other now, and pray.",
    pray: "Lord, we confess to one another. Heal us as we pray.",
  },
  {
    read: { text: "as newborn babies, long for the pure milk of the Word, that with it you may grow, if indeed you have tasted that the Lord is gracious:", ref: "1 Peter 2:2-3" },
    reflection:
      "As newborn babies, long for the pure milk of the Word, that with it you may grow, if indeed you have tasted that the Lord is gracious. Watching a baby feed is a sermon about your own soul.",
    talk: "When did you last long for God's word the way a baby wants milk?",
    pray: "Lord, give us appetite for your word, as a newborn for milk.",
  },
  {
    read: { text: "This is the boldness which we have toward him, that if we ask anything according to his will, he listens to us. And if we know that he listens to us, whatever we ask, we know that we have the petitions which we have asked of him.", ref: "1 John 5:14-15" },
    reflection:
      "If we ask anything according to his will, he listens to us. The condition is his will, not our certainty. That protects prayer from becoming a technique.",
    talk: "How does 'according to his will' change what you ask for?",
    pray: "Lord, we ask according to your will, and trust you with the rest.",
  },
  {
    read: { text: "God said, “Let there be light,” and there was light.", ref: "Genesis 1:3" },
    reflection:
      "God said, 'Let there be light,' and there was light. The first thing God did in a formless dark was speak light into it. Whatever is formless and dark about this season, he still speaks.",
    talk: "What feels formless right now? What would you ask God to speak into it?",
    pray: "Lord, you spoke light into darkness. Speak into ours.",
  },
  {
    read: { text: "the LORD God said, “It is not good for the man to be alone. I will make him a helper comparable to him.", ref: "Genesis 2:18" },
    reflection:
      "It is not good that the man should be alone. The first thing called 'not good' was loneliness — before sin, in a perfect world. New parents are often lonelier than anyone admits.",
    talk: "Where do you feel alone in this? Have you said it out loud?",
    pray: "Lord, you saw it was not good to be alone. Meet the loneliness here.",
  },
  {
    read: { text: "But Noah found favor in the LORD’s eyes.", ref: "Genesis 6:8" },
    reflection:
      "But Noah found favour in the LORD's eyes. Grace, and it comes before anything is said about Noah's righteousness. You will not earn what God gives this family.",
    talk: "Are you trying to earn something from God in this season?",
    pray: "Lord, we have found favour in your eyes through Christ. Thank you.",
  },
  {
    read: { text: "While the earth remains, seed time and harvest, and cold and heat, and summer and winter, and day and night will not cease.", ref: "Genesis 8:22" },
    reflection:
      "While the earth remains, seed time and harvest, and cold and heat, and summer and winter, and day and night shall not cease. God binds himself to the ordinary. Ordinary is a mercy.",
    talk: "What ordinary thing has been a mercy to you this week?",
    pray: "Lord, you keep the seasons turning. Thank you for ordinary days.",
  },
  {
    read: { text: "I will make of you a great nation. I will bless you and make your name great. You will be a blessing.", ref: "Genesis 12:2" },
    reflection:
      "I will make of you a great nation. I will bless you and make your name great. You will be a blessing. The blessing is given so it can be passed on. Households are conduits, not reservoirs.",
    talk: "Who might be blessed through this family?",
    pray: "Lord, bless us, and make us a blessing to others.",
  },
  {
    read: { text: "Is anything too hard for the LORD? At the set time I will return to you, when the season comes round, and Sarah will have a son.", ref: "Genesis 18:14" },
    reflection:
      "Is anything too hard for the LORD? Asked of an old couple who had just laughed at a promise. God does not scold the laugh; he asks a better question.",
    talk: "What have you quietly written off as impossible?",
    pray: "Lord, nothing is too hard for you. Meet our unbelief.",
  },
  {
    read: { text: "Behold, I am with you, and will keep you, wherever you go, and will bring you again into this land. For I will not leave you, until I have done that which I have spoken of to you.", ref: "Genesis 28:15" },
    reflection:
      "Behold, I am with you, and will keep you wherever you go. Said to a man running from his own family mess. God's promise found him mid-flight.",
    talk: "What are you carrying from your own family that worries you?",
    pray: "Lord, be with us and keep us wherever we go.",
  },
  {
    read: { text: "The man said, “Let me go, for the day breaks.” Jacob said, “I won’t let you go unless you bless me.", ref: "Genesis 32:26" },
    reflection:
      "I won't let you go, unless you bless me. Jacob wrestles all night and leaves blessed and limping. Some blessings come only through a struggle that changes how you walk.",
    talk: "What has this season already changed about how you walk?",
    pray: "Lord, we will not let you go. Bless us, even if we limp.",
  },
  {
    read: { text: "the LORD was with Joseph, and he was a prosperous man. He was in the house of his master the Egyptian.", ref: "Genesis 39:2" },
    reflection:
      "The LORD was with Joseph, and he was a prosperous man. He was in the house of his master. Slavery, and God with him in it. Presence in the middle of a wrong situation.",
    talk: "Where do you need God's presence rather than a change of circumstances?",
    pray: "Lord, be with us here, in the situation as it is.",
  },
  {
    read: { text: "As for you, you meant evil against me, but God meant it for good, to save many people alive, as is happening today.", ref: "Genesis 50:20" },
    reflection:
      "You meant evil against me, but God meant it for good. Both are true at once. Nothing that has happened to this family is outside God's hands or his purposes.",
    talk: "What has been done to you that God might still be using?",
    pray: "Lord, you are not defeated by what people do. Work your good.",
  },
  {
    read: { text: "God said to Moses, “I AM WHO I AM,” and he said, “You shall tell the children of Israel this: ‘I AM has sent me to you.", ref: "Exodus 3:14" },
    reflection:
      "I AM WHO I AM. God's name is a declaration that he simply is. Everything about this child depends on him; he depends on nothing.",
    talk: "What are you depending on that could fail?",
    pray: "Lord, you are the I AM. Everything we have comes from you.",
  },
  {
    read: { text: "the LORD will fight for you, and you shall be still.", ref: "Exodus 14:14" },
    reflection:
      "The LORD will fight for you, and you shall be still. And then, in the very next verse, God tells them to move. Trust is not always stillness; sometimes it is the next obedient step.",
    talk: "Is God asking you to be still, or to move? How would you tell?",
    pray: "Lord, fight for us. And where you say move, give us courage.",
  },
  {
    read: { text: "Then the LORD said to Moses, “Behold, I will rain bread from the sky for you, and the people shall go out and gather a day’s portion every day, that I may test them, whether they will walk in my law or not.", ref: "Exodus 16:4" },
    reflection:
      "I will rain bread from the sky for you... a day's portion every day. They could not store it. Daily dependence was designed, not accidental.",
    talk: "What would today's portion be? Are you trying to stockpile?",
    pray: "Give us this day our daily bread, and teach us to depend.",
  },
  {
    read: { text: "He said, “My presence will go with you, and I will give you rest.", ref: "Exodus 33:14" },
    reflection:
      "My presence will go with you, and I will give you rest. Presence and rest, promised together. God's answer to an overwhelmed leader was himself.",
    talk: "What would rest look like this week? Have you asked for it?",
    pray: "Lord, let your presence go with us, and give us rest.",
  },
  {
    read: { text: "You shall rise up before the gray head and honor the face of the elderly; and you shall fear your God. I am the LORD.", ref: "Leviticus 19:32" },
    reflection:
      "You shall rise up before the gray head and honour the face of an old man. This child will grow up watching how you treat their grandparents.",
    talk: "How are the older people in your family treated here?",
    pray: "Lord, teach us to honour the old, so our child learns it by watching.",
  },
  {
    read: { text: "the LORD bless you, and keep you. the LORD make his face to shine on you, and be gracious to you. the LORD lift up his face toward you, and give you peace.", ref: "Numbers 6:24-26" },
    reflection:
      "The LORD bless you, and keep you. The LORD make his face to shine on you, and be gracious to you. The blessing God gave for speaking over his people. Speak it over this child.",
    talk: "Say this blessing over your child tonight, by name.",
    pray: "Lord, bless and keep this child. Make your face shine on them.",
  },
  {
    read: { text: "I am not able to bear all this people alone, because it is too heavy for me.", ref: "Numbers 11:14" },
    reflection:
      "I am not able to bear all this people alone, because it is too heavy for me. Moses says it plainly and God sends help rather than a rebuke. Admitting the limit is what opens the help.",
    talk: "What is too heavy? Have you told anyone?",
    pray: "Lord, this is too heavy for us alone. Send us help.",
  },
  {
    read: { text: "You shall remember all the way which the LORD your God has led you these forty years in the wilderness, that he might humble you, to test you, to know what was in your heart, whether you would keep his commandments or not.", ref: "Deuteronomy 8:2" },
    reflection:
      "You shall remember all the way which the LORD your God has led you these forty years in the wilderness, that he might humble you, testing you. The wilderness was the route, not a wrong turn.",
    talk: "What has this season shown you about your own heart?",
    pray: "Lord, teach us in the wilderness what we could not learn elsewhere.",
  },
  {
    read: { text: "I call heaven and earth to witness against you today that I have set before you life and death, the blessing and the curse. Therefore choose life, that you may live, you and your descendants,", ref: "Deuteronomy 30:19" },
    reflection:
      "I have set before you life and death, the blessing and the curse. Therefore choose life. A household does not drift into faithfulness. It is chosen, repeatedly.",
    talk: "What is the next choice for life this family must make?",
    pray: "Lord, we choose life. Hold us to it.",
  },
  {
    read: { text: "that this may be a sign among you, that when your children ask in the future, saying, ‘What do you mean by these stones?’ then you shall tell them, ‘Because the waters of the Jordan were cut off before the ark of the LORD’s covenant. When it crossed over the Jordan, the waters of the Jordan were cut off. These stones shall be for a memorial to the children of Israel forever.", ref: "Joshua 4:6-7" },
    reflection:
      "When your children ask in time to come, 'What do you mean by these stones?' Stones piled so a future child's question would have an answer.",
    talk: "What could you keep in this house that a child will one day ask about?",
    pray: "Lord, give us stones of remembrance for our children to ask about.",
  },
  {
    read: { text: "He said to him, “O Lord, how shall I save Israel? Behold, my family is the poorest in Manasseh, and I am the least in my father’s house.” the LORD said to him, “Surely I will be with you, and you shall strike the Midianites as one man.", ref: "Judges 6:15-16" },
    reflection:
      "My family is the poorest... and I am the least in my father's house. The LORD said to him, 'Surely I will be with you.' God does not argue with the low estimate. He adds himself.",
    talk: "What is your version of 'I am the least'? What is God's answer?",
    pray: "Lord, we are small. Be with us, and that will be enough.",
  },
  {
    read: { text: "Ruth said, “Don’t urge me to leave you, and to return from following you, for where you go, I will go; and where you stay, I will stay. Your people will be my people, and your God my God.", ref: "Ruth 1:16" },
    reflection:
      "Your people will be my people, and your God my God. Ruth binds herself to a bitter woman and a foreign God. She ends up in the line of Christ.",
    talk: "Who has bound themselves to you at cost? Have you thanked them?",
    pray: "Lord, you draw outsiders in. Thank you for making us family.",
  },
  {
    read: { text: "the LORD came, and stood, and called as at other times, “Samuel! Samuel!” Then Samuel said, “Speak; for your servant hears.", ref: "1 Samuel 3:10" },
    reflection:
      "Speak, for your servant hears. A boy in the temple answers God. Do not assume God is waiting for this child to grow up before he speaks to them.",
    talk: "When did God first speak to you? How old were you?",
    pray: "Speak, Lord. Your servants are listening — even the youngest.",
  },
  {
    read: { text: "Then Samuel took a stone, and set it between Mizpah and Shen, and called its name Ebenezer, saying, “the LORD helped us until now.", ref: "1 Samuel 7:12" },
    reflection:
      "He called its name Ebenezer, saying, 'The LORD helped us all the way here.' A stone for the journey, not for a victory. Most help is only visible looking back.",
    talk: "Look back a year. Where did God help that you did not see at the time?",
    pray: "Lord, you have helped us all the way here.",
  },
  {
    read: { text: "But the LORD said to Samuel, “Don’t look on his face, or on the height of his stature, because I have rejected him; for I don’t see as man sees. For man looks at the outward appearance, but the LORD looks at the heart.", ref: "1 Samuel 16:7" },
    reflection:
      "Man looks at the outward appearance, but the LORD looks at the heart. Every scan, every measurement, every comparison — God is looking at something else.",
    talk: "What are you measuring that God is not?",
    pray: "Lord, you look at the heart. Free us from measuring the wrong things.",
  },
  {
    read: { text: "As for God, his way is perfect. the LORD’s word is tested. He is a shield to all those who take refuge in him.", ref: "2 Samuel 22:31" },
    reflection:
      "As for God, his way is perfect. The LORD's word is tested. He is a shield to all those who take refuge in him. Tested — proven under load, not theoretical.",
    talk: "What promise of God has been tested in your life? Did it hold?",
    pray: "Lord, your way is perfect and your word proves true. Be our shield.",
  },
  {
    read: { text: "May the LORD our God be with us, as he was with our fathers. Let him not leave us or forsake us;", ref: "1 Kings 8:57" },
    reflection:
      "May the LORD our God be with us, as he was with our fathers. Let him not leave us or forsake us. Asking God to be to us what he was to those before us.",
    talk: "What has God been to your parents or grandparents? Ask for the same.",
    pray: "Lord, be with us as you were with those before us. Do not leave us.",
  },
  {
    read: { text: "He lay down and slept under a juniper tree; and behold, an angel touched him, and said to him, “Arise and eat!” He looked, and behold, there was at his head a cake baked on the coals, and a jar of water. He ate and drank, and lay down again.", ref: "1 Kings 19:5-6" },
    reflection:
      "An angel touched him, and said to him, 'Arise and eat!' A suicidal prophet is given food and sleep before he is given words. God attends to bodies.",
    talk: "What does your body need right now? Have you treated that as spiritual?",
    pray: "Lord, you fed Elijah before you spoke to him. Care for our bodies.",
  },
  {
    read: { text: "He answered, “Don’t be afraid; for those who are with us are more than those who are with them.", ref: "2 Kings 6:16" },
    reflection:
      "Don't be afraid; for those who are with us are more than those who are with them. Nothing changed outside — only what the servant could see.",
    talk: "What are you afraid of? What else is also true that you cannot see?",
    pray: "Lord, open our eyes. Let us see what is really there.",
  },
  {
    read: { text: "Seek the LORD and his strength. Seek his face forever more.", ref: "1 Chronicles 16:11" },
    reflection:
      "Seek the LORD and his strength. Seek his face forever. Seeking described as a permanent posture, not a crisis measure.",
    talk: "Do you seek God only when worried? What would continual seeking look like?",
    pray: "Lord, we seek your face. Keep us seeking.",
  },
  {
    read: { text: "For the LORD’s eyes run back and forth throughout the whole earth, to show himself strong in the behalf of them whose heart is perfect toward him. You have done foolishly in this; for from now on you will have wars.", ref: "2 Chronicles 16:9" },
    reflection:
      "For the LORD's eyes run back and forth throughout the whole earth, to show himself strong on the behalf of them whose heart is perfect toward him. He is looking for hearts to strengthen.",
    talk: "Is your heart whole toward God right now? What divides it?",
    pray: "Lord, your eyes search the earth. Find our hearts whole toward you.",
  },
  {
    read: { text: "Then I proclaimed a fast there, at the river Ahava, that we might humble ourselves before our God, to seek from him a straight way for us, and for our little ones, and for all our possessions.", ref: "Ezra 8:21" },
    reflection:
      "Then I proclaimed a fast there, that we might humble ourselves before our God, to seek from him a straight way for us, and for our little ones. A journey prayed over, with children named.",
    talk: "What journey are you on? Have you prayed over it with the children named?",
    pray: "Lord, give us a safe journey, for us and for our little ones.",
  },
  {
    read: { text: "I looked, and rose up, and said to the nobles, to the rulers, and to the rest of the people, “Don’t be afraid of them! Remember the Lord, who is great and awesome, and fight for your brothers, your sons, your daughters, your wives, and your houses.", ref: "Nehemiah 4:14" },
    reflection:
      "Remember the Lord, who is great and awesome, and fight for your brothers, your sons, your daughters, your wives, and your houses. Courage grounded in God, exercised for family.",
    talk: "What do you need courage for on behalf of this child?",
    pray: "Lord, you are great and awesome. Make us brave for our family.",
  },
  {
    read: { text: "For if you remain silent now, then relief and deliverance will come to the Jews from another place, but you and your father’s house will perish. Who knows if you haven’t come to the kingdom for such a time as this?", ref: "Esther 4:14" },
    reflection:
      "Who knows if you haven't come to the kingdom for such a time as this? God's purposes do not depend on us, and the invitation to join them is still real.",
    talk: "Why might God have put you here, now, with this child?",
    pray: "Lord, you do not need us and still you call us. Give us courage.",
  },
  {
    read: { text: "He said, “Naked I came out of my mother’s womb, and naked will I return there. the LORD gave, and the LORD has taken away. Blessed be the LORD’s name.", ref: "Job 1:21" },
    reflection:
      "The LORD gave, and the LORD has taken away. Blessed be the LORD's name. Job says this having just buried his children. Scripture lets grief and worship stand together.",
    talk: "Can you grieve hard and worship at the same time? What does that look like?",
    pray: "Lord, you give and you take away. Hold us when we cannot understand.",
  },
  {
    read: { text: "But he knows the way that I take. When he has tried me, I will come out like gold.", ref: "Job 23:10" },
    reflection:
      "But he knows the way that I take. When he has tried me, I will come out like gold. He cannot find God, and still says God knows where he is.",
    talk: "Do you feel lost? Does it help that God is not lost about you?",
    pray: "Lord, you know the way we take. Bring us out as gold.",
  },
  {
    read: { text: "But you, the LORD, are a shield around me, my glory, and the one who lifts up my head.", ref: "Psalm 3:3" },
    reflection:
      "But you, LORD, are a shield around me, my glory, and the one who lifts up my head. A shield around — on every side — and God himself lifting a bowed head.",
    talk: "Whose head needs lifting in this house?",
    pray: "Lord, be a shield around us and lift our heads.",
  },
  {
    read: { text: "the LORD, in the morning you will hear my voice. In the morning I will lay my requests before you, and will watch expectantly.", ref: "Psalm 5:3" },
    reflection:
      "LORD, in the morning you will hear my voice. In the morning I will lay my requests before you, and will watch expectantly. Laying it out, then watching.",
    talk: "Do you watch after you pray, or move straight on?",
    pray: "Lord, in the morning we lay our requests before you and watch.",
  },
  {
    read: { text: "When I consider your heavens, the work of your fingers, the moon and the stars, which you have ordained; what is man, that you think of him? What is the son of man, that you care for him?", ref: "Psalm 8:3-4" },
    reflection:
      "When I consider your heavens... what is man, that you think of him? The maker of galaxies is thinking about this small family.",
    talk: "Does God's greatness make you feel small or held? Why both?",
    pray: "Lord, the heavens are your work, and still you think of us.",
  },
  {
    read: { text: "How long, the LORD? Will you forget me forever? How long will you hide your face from me? How long shall I take counsel in my soul, having sorrow in my heart every day? How long shall my enemy triumph over me?", ref: "Psalm 13:1-2" },
    reflection:
      "How long, LORD? Will you forget me forever? God gave his people words for the days he seems absent, and did not correct them for using them.",
    talk: "Have you stopped praying out of disappointment? Could you pray that instead?",
    pray: "How long, Lord? We do not understand, and we are still speaking to you.",
  },
  {
    read: { text: "He sent from on high. He took me. He drew me out of many waters.", ref: "Psalm 18:16" },
    reflection:
      "He sent from on high. He took me. He drew me out of many waters. Four verbs, all God's. No description of self-rescue.",
    talk: "Where are you trying to climb out of something God intends to reach into?",
    pray: "Lord, reach down and draw us out of deep waters.",
  },
  {
    read: { text: "May the LORD answer you in the day of trouble. May the name of the God of Jacob set you up on high, send you help from the sanctuary, grant you support from Zion,", ref: "Psalm 20:1-2" },
    reflection:
      "May the LORD answer you in the day of trouble. May the name of the God of Jacob set you up on high. Send you help from the sanctuary. A prayer to pray over each other.",
    talk: "Pray this verse over your spouse by name, right now.",
    pray: "Lord, answer us in the day of trouble. Send help from your sanctuary.",
  },
  {
    read: { text: "the LORD is my shepherd: I shall lack nothing. He makes me lie down in green pastures. He leads me beside still waters.", ref: "Psalm 23:1-2" },
    reflection:
      "The LORD is my shepherd; I shall lack nothing. He makes me lie down in green pastures. Sometimes the shepherd makes us lie down. Rest can be imposed for our good.",
    talk: "Has God made you stop recently? How did you take it?",
    pray: "Lord, you are our shepherd. Make us lie down in green pastures.",
  },
  {
    read: { text: "the LORD is my light and my salvation. Whom shall I fear? the LORD is the strength of my life. Of whom shall I be afraid?", ref: "Psalm 27:1" },
    reflection:
      "The LORD is my light and my salvation. Whom shall I fear? A rhetorical question that David clearly had to talk himself into.",
    talk: "Whom or what do you actually fear? Ask David's question about it by name.",
    pray: "Lord, you are our light and our salvation. Whom shall we fear?",
  },
  {
    read: { text: "You are my hiding place. You will preserve me from trouble. You will surround me with songs of deliverance.", ref: "Psalm 32:7" },
    reflection:
      "You are my hiding place. You will preserve me from trouble. You will surround me with songs of deliverance. Surrounded by songs — an odd and lovely image.",
    talk: "What song has carried you through something hard?",
    pray: "Lord, be our hiding place. Surround us with songs of deliverance.",
  },
  {
    read: { text: "the LORD is near to those who have a broken heart, and saves those who have a crushed spirit.", ref: "Psalm 34:18" },
    reflection:
      "The LORD is near to those who have a broken heart, and saves those who have a crushed spirit. Nearness is his instinct toward the crushed, not a reward for coping.",
    talk: "Who is broken-hearted near you? What would nearness look like from you?",
    pray: "Lord, you are near the broken-hearted. Be near to us.",
  },
  {
    read: { text: "Rest in the LORD, and wait patiently for him. Don’t fret because of him who prospers in his way, because of the man who makes wicked plots happen.", ref: "Psalm 37:7" },
    reflection:
      "Rest in the LORD, and wait patiently for him. Don't fret because of him who prospers in his way. Fretting about others' ease is named and forbidden.",
    talk: "Whose pregnancy or family are you comparing yours to?",
    pray: "Lord, we will rest and wait. Take the fretting out of us.",
  },
  {
    read: { text: "Why are you in despair, my soul? Why are you disturbed within me? Hope in God! For I shall still praise him for the saving help of his presence.", ref: "Psalm 42:5" },
    reflection:
      "Why are you in despair, my soul? Why are you disturbed within me? Hope in God! He talks to himself and preaches truth back. Feelings do not get the last word.",
    talk: "What does your inner voice say on a bad day? What would Scripture answer?",
    pray: "Lord, when our souls are cast down, teach us to hope in you.",
  },
  {
    read: { text: "God is our refuge and strength, a very present help in trouble.", ref: "Psalm 46:1" },
    reflection:
      "God is our refuge and strength, a very present help in trouble. Very present — not distant, not delayed.",
    talk: "Where do you go first in trouble? Is it him?",
    pray: "Lord, you are a very present help in trouble. We come to you.",
  },
  {
    read: { text: "Create in me a clean heart, O God. Renew a right spirit within me.", ref: "Psalm 51:10" },
    reflection:
      "Create in me a clean heart, O God. Renew a right spirit within me. Create — the word used of making the world from nothing. Only God can do this.",
    talk: "What in your heart needs creating, not just improving?",
    pray: "Create in us clean hearts, O God. Renew a right spirit within us.",
  },
  {
    read: { text: "When I am afraid, I will put my trust in you. In God, I praise his word. In God, I put my trust. I will not be afraid. What can flesh do to me?", ref: "Psalm 56:3-4" },
    reflection:
      "When I am afraid, I will put my trust in you. In God, I praise his word. In God, I put my trust. I will not be afraid. Fear admitted, then answered.",
    talk: "What would 'when I am afraid, I will trust' look like practically tonight?",
    pray: "Lord, when we are afraid, we put our trust in you.",
  },
  {
    read: { text: "My soul, wait in silence for God alone, for my expectation is from him. He alone is my rock and my salvation, my fortress. I will not be shaken.", ref: "Psalm 62:5-6" },
    reflection:
      "My soul, wait in silence for God alone, for my expectation is from him. He alone is my rock and my salvation. Alone, repeated. A deliberate narrowing of trust.",
    talk: "What else are you leaning on that this psalm would remove?",
    pray: "For God alone our souls wait in silence. He alone is our rock.",
  },
  {
    read: { text: "Blessed be God, who has not turned away my prayer, nor his loving kindness from me.", ref: "Psalm 66:20" },
    reflection:
      "Blessed be God, who has not turned away my prayer, nor his loving kindness from me. Praise for a prayer that was not turned away.",
    talk: "What prayer has God not turned away? Have you thanked him?",
    pray: "Blessed be God, who has not rejected our prayer.",
  },
  {
    read: { text: "You, who have shown us many and bitter troubles, you will let me live. You will bring us up again from the depths of the earth.", ref: "Psalm 71:20" },
    reflection:
      "You, who have shown us many and bitter troubles, you will let me live. You will bring us up again from the depths of the earth. God credited with the troubles and the raising.",
    talk: "Can you name the trouble as from God's hand without concluding he is unkind?",
    pray: "Lord, you will revive us again and bring us up from the depths.",
  },
  {
    read: { text: "My flesh and my heart fails, but God is the strength of my heart and my portion forever.", ref: "Psalm 73:26" },
    reflection:
      "My flesh and my heart fails, but God is the strength of my heart and my portion forever. Bodies do fail, sometimes in this exact season. He remains.",
    talk: "What has failed in one of you? What is still standing underneath?",
    pray: "Lord, when flesh and heart fail, be the strength of our hearts.",
  },
  {
    read: { text: "For the LORD God is a sun and a shield. the LORD will give grace and glory. He withholds no good thing from those who walk blamelessly.", ref: "Psalm 84:11" },
    reflection:
      "He withholds no good thing from those who walk blamelessly. Read carefully: what is withheld was not good. That is hard and it is a comfort.",
    talk: "What has God withheld? Can you trust that judgement?",
    pray: "Lord, you withhold no good thing. Help us trust what has not come.",
  },
  {
    read: { text: "Satisfy us in the morning with your loving kindness, that we may rejoice and be glad all our days.", ref: "Psalm 90:14" },
    reflection:
      "Satisfy us in the morning with your loving kindness, that we may rejoice and be glad all our days. Asking to be satisfied early, so the day is coloured by it.",
    talk: "What are the first minutes of your day like now?",
    pray: "Satisfy us in the morning with your steadfast love.",
  },
  {
    read: { text: "For the LORD is good. His loving kindness endures forever, his faithfulness to all generations.", ref: "Psalm 100:5" },
    reflection:
      "For the LORD is good. His loving kindness endures forever, his faithfulness to all generations. Three facts to stand on when feelings will not hold.",
    talk: "Which of the three is hardest to feel today? Say it anyway.",
    pray: "Lord, you are good. Your love endures. Your faithfulness reaches every generation.",
  },
  {
    read: { text: "Light dawns in the darkness for the upright, gracious, merciful, and righteous.", ref: "Psalm 112:4" },
    reflection:
      "Light dawns in the darkness for the upright, gracious, merciful, and righteous. Dawn happens in the dark, not after it.",
    talk: "Where do you need dawn without the dark ending yet?",
    pray: "Lord, let light rise in our darkness.",
  },
  {
    read: { text: "This is the day that the LORD has made. We will rejoice and be glad in it!", ref: "Psalm 118:24" },
    reflection:
      "This is the day that the LORD has made. We will rejoice and be glad in it. Not a good day, or an easy one. This day, the actual one.",
    talk: "What is today actually like? Can you rejoice in this one?",
    pray: "Lord, you made this day. We will rejoice and be glad in it.",
  },
  {
    read: { text: "Your word is a lamp to my feet, and a light for my path.", ref: "Psalm 119:105" },
    reflection:
      "Your word is a lamp to my feet, and a light for my path. A lamp shows the next step only. That is usually all God gives, and it is enough.",
    talk: "Are you refusing to move because you cannot see the whole path?",
    pray: "Lord, your word is a lamp to our feet. Let us walk by the light we have.",
  },
  {
    read: { text: "I will lift up my eyes to the hills. Where does my help come from? My help comes from the LORD, who made heaven and earth.", ref: "Psalm 121:1-2" },
    reflection:
      "I will lift up my eyes to the hills. Where does my help come from? My help comes from the LORD, who made heaven and earth. A question, then an answer.",
    talk: "Where do you look for help first? What would looking up sooner change?",
    pray: "Maker of heaven and earth, our help comes from you.",
  },
  {
    read: { text: "Those who sow in tears will reap in joy.", ref: "Psalm 126:5" },
    reflection:
      "Those who sow in tears will reap in joy. Sowing in tears is still sowing. Faithfulness that feels fruitless is still faithfulness.",
    talk: "What are you sowing in tears right now?",
    pray: "Lord, we sow in tears. Bring us home with joy in your time.",
  },
  {
    read: { text: "I wait for the LORD. My soul waits. I hope in his word.", ref: "Psalm 130:5" },
    reflection:
      "I wait for the LORD. My soul waits. In his word I hope. Waiting stated three ways in one verse, because it takes that much to hold on.",
    talk: "What are you waiting for? Where is your hope actually placed?",
    pray: "Lord, our souls wait for you. In your word we hope.",
  },
  {
    read: { text: "Give thanks to the LORD, for he is good; for his loving kindness endures forever.", ref: "Psalm 136:1" },
    reflection:
      "Give thanks to the LORD, for he is good, for his loving kindness endures forever. The refrain repeats twenty-six times. Repetition is the point.",
    talk: "Say the refrain together after each thing you are thankful for tonight.",
    pray: "Give thanks to the Lord, for he is good; his love endures forever.",
  },
  {
    read: { text: "the LORD, you have searched me, and you know me. You know my sitting down and my rising up. You perceive my thoughts from afar.", ref: "Psalm 139:1-2" },
    reflection:
      "LORD, you have searched me, and you know me. You know my sitting down and my rising up. You perceive my thoughts from afar. Fully known, and not left.",
    talk: "What do you hide that God already knows?",
    pray: "Lord, you have searched us and know us. Thank you for staying.",
  },
  {
    read: { text: "the LORD upholds all who fall, and raises up all those who are bowed down.", ref: "Psalm 145:14" },
    reflection:
      "The LORD upholds all who fall, and raises up all those who are bowed down. Two conditions, and God acts on both.",
    talk: "Are you falling or bowed down? What is promised?",
    pray: "Lord, uphold us as we fall. Raise us as we bow down.",
  },
  {
    read: { text: "He heals the broken in heart, and binds up their wounds.", ref: "Psalm 147:3" },
    reflection:
      "He heals the broken in heart, and binds up their wounds. Set beside a line about counting the stars. Scale does not reduce his attention.",
    talk: "What wound has never been bound up? Have you brought it to him?",
    pray: "Lord, heal the broken-hearted here and bind up our wounds.",
  },
  {
    read: { text: "A gentle answer turns away wrath, but a harsh word stirs up anger.", ref: "Proverbs 15:1" },
    reflection:
      "A gentle answer turns away wrath, but a harsh word stirs up anger. Tired people say harsh things. A gentle answer is a discipline, not a temperament.",
    talk: "What harsh word have you spoken this week? Would you take it back?",
    pray: "Lord, give us gentle answers when we are most tired.",
  },
  {
    read: { text: "A cheerful heart makes good medicine, but a crushed spirit dries up the bones.", ref: "Proverbs 17:22" },
    reflection:
      "A cheerful heart makes good medicine, but a crushed spirit dries up the bones. Emotional and physical health linked, without embarrassment.",
    talk: "What is drying up your bones? Have you told anyone?",
    pray: "Lord, give us cheerful hearts and heal our crushed spirits.",
  },
  {
    read: { text: "for a righteous man falls seven times and rises up again; but the wicked are overthrown by calamity.", ref: "Proverbs 24:16" },
    reflection:
      "For a righteous man falls seven times and rises up again. The righteous are not those who never fall. They are those who get up.",
    talk: "Where have you stopped getting up?",
    pray: "Lord, when we fall, raise us again. Seven times if needed.",
  },
  {
    read: { text: "Don’t boast about tomorrow; for you don’t know what a day may bring.", ref: "Proverbs 27:1" },
    reflection:
      "Don't boast about tomorrow; for you don't know what a day may bring. Every plan for this child is provisional. Holding them loosely is realism.",
    talk: "What plan are you holding too tightly?",
    pray: "Lord, we do not know what a day will bring. Hold our plans.",
  },
  {
    read: { text: "Better is a handful, with quietness, than two handfuls with labor and chasing after wind.", ref: "Ecclesiastes 4:6" },
    reflection:
      "Better is a handful, with quietness, than two handfuls with labour and chasing after wind. Less with peace ranked above more with exhaustion.",
    talk: "What are you chasing with two hands? What would one handful cost?",
    pray: "Lord, teach us that enough with quietness is better.",
  },
  {
    read: { text: "I heard the Lord’s voice, saying, “Whom shall I send, and who will go for us?” Then I said, “Here I am. Send me!", ref: "Isaiah 6:8" },
    reflection:
      "Whom shall I send, and who will go for us? Then I said, 'Here I am. Send me!' Note the order: his guilt was taken away first. Cleansing precedes commissioning.",
    talk: "Are you trying to serve God before letting him deal with you?",
    pray: "Lord, cleanse us and then send us. Here we are.",
  },
  {
    read: { text: "and when you turn to the right hand, and when you turn to the left, your ears will hear a voice behind you, saying, “This is the way. Walk in it.", ref: "Isaiah 30:21" },
    reflection:
      "Your ears will hear a word behind you, saying, 'This is the way. Walk in it.' Guidance comes as we move, and often from behind.",
    talk: "Have you been waiting for direction before moving?",
    pray: "Lord, let us hear the word behind us: this is the way.",
  },
  {
    read: { text: "He gives power to the weak. He increases the strength of him who has no might.", ref: "Isaiah 40:29" },
    reflection:
      "He gives power to the weak. He increases the strength of him who has no might. Offered to the exhausted, not held over them.",
    talk: "When you are empty, what do you usually reach for?",
    pray: "Lord, give power to the faint. We have no might of our own.",
  },
  {
    read: { text: "but those who wait for the LORD will renew their strength. They will mount up with wings like eagles. They will run, and not be weary. They will walk, and not faint.", ref: "Isaiah 40:31" },
    reflection:
      "They who wait for the LORD will renew their strength. Waiting comes first. This is not a promise that you will never be exhausted.",
    talk: "What does waiting on God look like on an ordinary Tuesday?",
    pray: "Lord, we are tired. Renew our strength as we wait.",
  },
  {
    read: { text: "Behold, I will do a new thing. It springs out now. Don’t you know it? I will even make a way in the wilderness, and rivers in the desert.", ref: "Isaiah 43:19" },
    reflection:
      "Behold, I will do a new thing. It springs out now. Don't you know it? I will even make a way in the wilderness. Said to a people whose past was a catalogue of failure.",
    talk: "What old thing are you still rehearsing? What might God be doing?",
    pray: "Lord, do a new thing. Make a way in this wilderness.",
  },
  {
    read: { text: "For my thoughts are not your thoughts, and your ways are not my ways,” says the LORD. “For as the heavens are higher than the earth, so are my ways higher than your ways, and my thoughts than your thoughts.", ref: "Isaiah 55:8-9" },
    reflection:
      "For my thoughts are not your thoughts, neither are your ways my ways. Sometimes the answer is that God is doing something we cannot see from here.",
    talk: "What do you not understand about God's dealings with you?",
    pray: "Lord, your ways are higher. Give us trust where we lack understanding.",
  },
  {
    read: { text: "The Lord the LORD’s Spirit is on me, because the LORD has anointed me to preach good news to the humble. He has sent me to bind up the broken hearted, to proclaim liberty to the captives and release to those who are bound,", ref: "Isaiah 61:1" },
    reflection:
      "He has sent me... to bind up the broken-hearted, to proclaim liberty to the captives. Jesus read this aloud and said it was about him.",
    talk: "Which part of that job description do you need from him now?",
    pray: "Lord Jesus, you came to bind up the broken-hearted. Do it here.",
  },
  {
    read: { text: "Blessed is the man who trusts in the LORD, and whose confidence is in the LORD. For he will be as a tree planted by the waters, who spreads out its roots by the river, and will not fear when heat comes, but its leaf will be green, and will not be concerned in the year of drought. It won’t cease from yielding fruit.", ref: "Jeremiah 17:7-8" },
    reflection:
      "Blessed is the man who trusts in the LORD... he will be like a tree planted by the waters... and will not be anxious in the year of drought. The drought still comes.",
    talk: "Where are your roots? What is your water source?",
    pray: "Lord, plant us by your streams. Let us not fear the drought.",
  },
  {
    read: { text: "Call to me, and I will answer you, and will show you great and difficult things, which you don’t know.", ref: "Jeremiah 33:3" },
    reflection:
      "Call to me, and I will answer you, and will show you great and difficult things, which you don't know. Spoken to a man in prison, about a city about to fall.",
    talk: "What have you not called to God about because you assumed the answer?",
    pray: "Lord, we call to you. Show us what we do not know.",
  },
  {
    read: { text: "I will also give you a new heart, and I will put a new spirit within you. I will take away the stony heart out of your flesh, and I will give you a heart of flesh.", ref: "Ezekiel 36:26" },
    reflection:
      "I will give you a new heart, and I will put a new spirit within you. Heart surgery promised as God's own work — for you, and one day for this child.",
    talk: "Where has your heart gone hard? Have you asked for the surgery?",
    pray: "Lord, take out our hearts of stone. Give us hearts of flesh.",
  },
  {
    read: { text: "When Daniel knew that the writing was signed, he went into his house (now his windows were open in his room toward Jerusalem) and he kneeled on his knees three times a day, and prayed, and gave thanks before his God, as he did before.", ref: "Daniel 6:10" },
    reflection:
      "He kneeled on his knees three times a day, and prayed... as he did before. Nothing changed except the risk. His routine was built long before it became dangerous.",
    talk: "What habit are you building now that will hold when it costs?",
    pray: "Lord, build habits in us that will hold under pressure.",
  },
  {
    read: { text: "Let’s acknowledge the LORD. Let’s press on to know the LORD. As surely as the sun rises, the LORD will appear. He will come to us like the rain, like the spring rain that waters the earth.", ref: "Hosea 6:3" },
    reflection:
      "Let's acknowledge the LORD. Let's press on to know the LORD. As surely as the sun rises, the LORD will appear. He will come to us like the rain.",
    talk: "What would 'pressing on to know God' involve this month?",
    pray: "Lord, let us press on to know you. Come to us like the rain.",
  },
  {
    read: { text: "Tear your heart, and not your garments, and turn to the LORD, your God; for he is gracious and merciful, slow to anger, and abundant in loving kindness, and relents from sending calamity.", ref: "Joel 2:13" },
    reflection:
      "Tear your heart and not your garments. Return to the LORD, your God, for he is gracious and merciful, slow to anger, and abundant in loving kindness. The reason to return is his character.",
    talk: "When did you last perform repentance rather than practise it?",
    pray: "Lord, tear our hearts. Return us to you.",
  },
  {
    read: { text: "But as for me, I will look to the LORD. I will wait for the God of my salvation. My God will hear me.", ref: "Micah 7:7" },
    reflection:
      "But as for me, I will look to the LORD. I will wait for the God of my salvation. My God will hear me. Said where family relationships had broken down completely.",
    talk: "If everything else fell apart, could you still say this?",
    pray: "Lord, we look to you and wait. You will hear us.",
  },
  {
    read: { text: "For though the fig tree doesn’t flourish, nor fruit be in the vines; the labor of the olive fails, the fields yield no food; the flocks are cut off from the fold, and there is no herd in the stalls: yet I will rejoice in the LORD. I will be joyful in the God of my salvation!", ref: "Habakkuk 3:17-18" },
    reflection:
      "Though the fig tree doesn't flourish... yet I will rejoice in the LORD. Joy chosen when the outcome is a disaster, not because it is good.",
    talk: "What have you quietly made the condition of your joy?",
    pray: "Lord, though everything fails, we will rejoice in you.",
  },
  {
    read: { text: "Then he answered and spoke to me, saying, “This is the LORD’s word to Zerubbabel, saying, ‘Not by might, nor by power, but by my Spirit,’ says the LORD of Armies.", ref: "Zechariah 4:6" },
    reflection:
      "Not by might, nor by power, but by my Spirit, says the LORD of Armies. Said to a discouraged builder facing a job too big.",
    talk: "What are you trying to do by sheer effort?",
    pray: "Lord, not by our might but by your Spirit. Do what we cannot.",
  },
  {
    read: { text: "Then those who feared the LORD spoke one with another; and the LORD listened, and heard, and a book of memory was written before him, for those who feared the LORD, and who honored his name.", ref: "Malachi 3:16" },
    reflection:
      "Those who feared the LORD spoke one with another; and the LORD listened, and a book of memory was written before him. He was listening the whole time.",
    talk: "What would be written from this week's conversations here?",
    pray: "Lord, you listen and remember. Give us something worth writing down.",
  },
  {
    read: { text: "Blessed are those who mourn, for they shall be comforted.", ref: "Matthew 5:4" },
    reflection:
      "Blessed are those who mourn, for they shall be comforted. Mourning is blessed, not merely permitted. Comfort is promised to those who let themselves grieve.",
    talk: "What have you not let yourself mourn?",
    pray: "Lord, blessed are those who mourn. Comfort us.",
  },
  {
    read: { text: "Pray like this: ‘Our Father in heaven, may your name be kept holy. Let your Kingdom come. Let your will be done on earth as it is in heaven.", ref: "Matthew 6:9-10" },
    reflection:
      "Our Father in heaven, may your name be kept holy. May your Kingdom come. May your will be done. The prayer starts with him, not with our needs.",
    talk: "How much of your praying starts with God rather than with your requests?",
    pray: "Our Father in heaven, hallowed be your name. Your kingdom come.",
  },
  {
    read: { text: "Ask, and it will be given you. Seek, and you will find. Knock, and it will be opened for you. For everyone who asks receives. He who seeks finds. To him who knocks it will be opened.", ref: "Matthew 7:7-8" },
    reflection:
      "Ask, and it will be given you. Seek, and you will find. Knock, and it will be opened for you. Three verbs, all persistent, all commanded.",
    talk: "What have you stopped asking for? Would you start again?",
    pray: "Lord, we ask, seek and knock. Teach us to keep going.",
  },
  {
    read: { text: "At that time, Jesus answered, “I thank you, Father, Lord of heaven and earth, that you hid these things from the wise and understanding, and revealed them to infants.", ref: "Matthew 11:25" },
    reflection:
      "You hid these things from the wise and understanding, and revealed them to infants. Jesus thanks the Father for a pattern that would offend most academies.",
    talk: "Where does your knowledge get in the way of receiving like a child?",
    pray: "Father, you reveal these things to little children. Make us small.",
  },
  {
    read: { text: "But when he saw that the wind was strong, he was afraid, and beginning to sink, he cried out, saying, “Lord, save me!” Immediately Jesus stretched out his hand, took hold of him, and said to him, “You of little faith, why did you doubt?", ref: "Matthew 14:30-31" },
    reflection:
      "Beginning to sink, he cried out, saying, 'Lord, save me!' Immediately Jesus stretched out his hand. Peter's faith failed; the hand did not.",
    talk: "Where are you sinking? Have you called out?",
    pray: "Lord, save us. Take hold of us before we go under.",
  },
  {
    read: { text: "and said, “Most certainly I tell you, unless you turn, and become as little children, you will in no way enter into the Kingdom of Heaven.", ref: "Matthew 18:3" },
    reflection:
      "Unless you turn and become as little children, you will in no way enter into the Kingdom of Heaven. Not childish, but dependent — nothing to bring, nothing to protect.",
    talk: "What do you bring to God that a child could not? Is it helping?",
    pray: "Lord, make us like children — dependent, and glad to be.",
  },
  {
    read: { text: "teaching them to observe all things that I commanded you. Behold, I am with you always, even to the end of the age.” Amen.", ref: "Matthew 28:20" },
    reflection:
      "Behold, I am with you always, even to the end of the age. The last words of the gospel are a promise of presence.",
    talk: "Where has God sent you? Does his promise of presence reach there?",
    pray: "Lord Jesus, you are with us always. Thank you.",
  },
  {
    read: { text: "Early in the morning, while it was still dark, he rose up and went out, and departed into a deserted place, and prayed there.", ref: "Mark 1:35" },
    reflection:
      "Early in the morning, while it was still dark, he rose up and went out... and prayed there. Jesus made time by losing sleep. That may not be your season — and he understands.",
    talk: "When could you meet God in this season? Be realistic.",
    pray: "Lord Jesus, you rose early to pray. Make room for us to meet you.",
  },
  {
    read: { text: "He himself was in the stern, asleep on the cushion, and they woke him up, and told him, “Teacher, don’t you care that we are dying?” He awoke, and rebuked the wind, and said to the sea, “Peace! Be still!” The wind ceased, and there was a great calm.", ref: "Mark 4:38-39" },
    reflection:
      "Teacher, don't you care that we are dying? The question underneath most panic is not 'can God' but 'does God care'.",
    talk: "When you panic, which do you doubt: his power or his care?",
    pray: "Lord Jesus, you care and you are able. Still the storm in us.",
  },
  {
    read: { text: "He said to them, “You come apart into a deserted place, and rest awhile.” For there were many coming and going, and they had no leisure so much as to eat.", ref: "Mark 6:31" },
    reflection:
      "Come away into a deserted place, and rest awhile. Jesus says this in the middle of genuinely urgent, good work.",
    talk: "What good work are you using as a reason not to rest?",
    pray: "Lord Jesus, you call us aside to rest. Give us permission to obey.",
  },
  {
    read: { text: "Immediately the father of the child cried out with tears, “I believe. Help my unbelief!", ref: "Mark 9:24" },
    reflection:
      "I believe. Help my unbelief! A father asks for help with faith he does not fully have, and Jesus acts anyway.",
    talk: "Where do you believe and doubt at once? Have you told God?",
    pray: "Lord, we believe. Help our unbelief.",
  },
  {
    read: { text: "Jesus, looking at them, said, “With men it is impossible, but not with God, for all things are possible with God.", ref: "Mark 10:27" },
    reflection:
      "With men it is impossible, but not with God, for all things are possible with God. Said about salvation, in context — the impossible thing is a person being saved.",
    talk: "Whose salvation feels impossible to you?",
    pray: "Lord, with you all things are possible. Save those we love.",
  },
  {
    read: { text: "Mary said, “My soul magnifies the Lord. My spirit has rejoiced in God my Savior,", ref: "Luke 1:46-47" },
    reflection:
      "My soul magnifies the Lord. My spirit has rejoiced in God my Saviour. A pregnant teenager's song is about God, not about her circumstances.",
    talk: "Can you magnify God about this pregnancy rather than only worry about it?",
    pray: "Lord, our souls magnify you. Our spirits rejoice in God our Saviour.",
  },
  {
    read: { text: "The angel said to them, “Don’t be afraid, for behold, I bring you good news of great joy which will be to all the people.", ref: "Luke 2:10" },
    reflection:
      "Don't be afraid, for behold, I bring you good news of great joy which will be to all the people. Announced to shepherds working nights, of no social standing.",
    talk: "Why do you think God chose shepherds as the first congregation?",
    pray: "Lord, you bring good news of great joy for all people. Thank you for including us.",
  },
  {
    read: { text: "But he withdrew himself into the desert, and prayed.", ref: "Luke 5:16" },
    reflection:
      "But he withdrew himself into the desert, and prayed. The verb form suggests he did it habitually. At peak demand, he repeatedly disappeared.",
    talk: "What is your version of withdrawing? When did you last manage it?",
    pray: "Lord Jesus, you withdrew to pray. Teach us that rhythm.",
  },
  {
    read: { text: "I tell you, keep asking, and it will be given you. Keep seeking, and you will find. Keep knocking, and it will be opened to you.", ref: "Luke 11:9" },
    reflection:
      "Ask, and you will receive. Seek, and you will find. Knock, and it will be opened to you. The context is a friend banging on a door at midnight.",
    talk: "What would persistent, almost rude prayer look like for you?",
    pray: "Lord, we ask, we seek, we knock. Keep us at the door.",
  },
  {
    read: { text: "But the very hairs of your head are all counted. Therefore don’t be afraid. You are of more value than many sparrows.", ref: "Luke 12:7" },
    reflection:
      "But the very hairs of your head are all numbered. Therefore don't be afraid. You are of more value than many sparrows. Attention at the level of hair count.",
    talk: "What makes you feel forgettable?",
    pray: "Lord, even our hairs are numbered. Do not let us fear.",
  },
  {
    read: { text: "But he said, “The things which are impossible with men are possible with God.", ref: "Luke 18:27" },
    reflection:
      "The things which are impossible with men are possible with God. Said in a conversation about who can be saved. The impossible thing is salvation.",
    talk: "What have you decided is beyond God?",
    pray: "Lord, what is impossible with us is possible with you.",
  },
  {
    read: { text: "saying, “Father, if you are willing, remove this cup from me. Nevertheless, not my will, but yours, be done.", ref: "Luke 22:42" },
    reflection:
      "Not my will, but yours, be done. Jesus asks for a different outcome, genuinely, and then submits. Wanting something else is not unbelief.",
    talk: "What are you asking God to change? Can you pray this alongside it?",
    pray: "Father, take this cup if you will. Nevertheless, not our will but yours.",
  },
  {
    read: { text: "For God so loved the world, that he gave his one and only Son, that whoever believes in him should not perish, but have eternal life.", ref: "John 3:16" },
    reflection:
      "For God so loved the world, that he gave his one and only Son. Love measured by what was given up. That is the standard for how you will love this child.",
    talk: "What are you already willing to give up for this child?",
    pray: "Lord, you gave your only Son. Teach us love that gives.",
  },
  {
    read: { text: "Jesus said to them, “I am the bread of life. Whoever comes to me will not be hungry, and whoever believes in me will never be thirsty.", ref: "John 6:35" },
    reflection:
      "I am the bread of life. He who comes to me will not be hungry, and he who believes in me will never be thirsty. He offers himself, not a technique.",
    talk: "What hunger have you tried to satisfy elsewhere?",
    pray: "Lord Jesus, you are the bread of life. Feed us.",
  },
  {
    read: { text: "The thief only comes to steal, kill, and destroy. I came that they may have life, and may have it abundantly.", ref: "John 10:10" },
    reflection:
      "I came that they may have life, and may have it abundantly. The contrast in context is a thief who kills. Abundant life is life under the good shepherd.",
    talk: "How has this verse been sold to you? What does the context change?",
    pray: "Lord Jesus, you came that we might have life. Be our shepherd.",
  },
  {
    read: { text: "Jesus wept.", ref: "John 11:35" },
    reflection:
      "Jesus wept. Minutes from raising Lazarus, he still weeps. Grief is not a failure of faith; the Lord himself does it.",
    talk: "Do you allow yourself to grieve, or rush to be fine?",
    pray: "Lord Jesus, you wept at a grave. Weep with us.",
  },
  {
    read: { text: "But you will receive power when the Holy Spirit has come upon you. You will be witnesses to me in Jerusalem, in all Judea and Samaria, and to the uttermost parts of the earth.", ref: "Acts 1:8" },
    reflection:
      "You will receive power when the Holy Spirit has come upon you. Power given for witness, not for display. Even at home, even now.",
    talk: "Where has God placed you to be a witness?",
    pray: "Lord, give us your Spirit's power to be witnesses where we are.",
  },
  {
    read: { text: "But about midnight Paul and Silas were praying and singing hymns to God, and the prisoners were listening to them.", ref: "Acts 16:25" },
    reflection:
      "About midnight Paul and Silas were praying and singing hymns to God, and the prisoners were listening. Beaten, chained, and singing — and others heard.",
    talk: "What do people hear from you when things are hardest?",
    pray: "Lord, give us songs at midnight, and let others hear them.",
  },
  {
    read: { text: "But these things don’t count; nor do I hold my life dear to myself, so that I may finish my race with joy, and the ministry which I received from the Lord Jesus, to fully testify to the Good News of the grace of God.", ref: "Acts 20:24" },
    reflection:
      "I don't hold my life dear to myself, so that I may finish my race with joy. Finishing valued over surviving.",
    talk: "What are you holding dear that is slowing the race?",
    pray: "Lord, let us finish our course with joy.",
  },
  {
    read: { text: "There is therefore now no condemnation to those who are in Christ Jesus, who don’t walk according to the flesh, but according to the Spirit.", ref: "Romans 8:1" },
    reflection:
      "There is therefore now no condemnation to those who are in Christ Jesus. Whatever guilt you carry into parenting, this verse stands over it.",
    talk: "What do you condemn yourself for? What does this verse say?",
    pray: "Lord, there is no condemnation in Christ. Let us live in that.",
  },
  {
    read: { text: "In the same way, the Spirit also helps our weaknesses, for we don’t know how to pray as we ought. But the Spirit himself makes intercession for us with groanings which can’t be uttered.", ref: "Romans 8:26" },
    reflection:
      "The Spirit also helps our weaknesses, for we don't know how to pray as we ought. When you are too tired for words, prayer does not stop.",
    talk: "Sit in silence together for two minutes and let the Spirit pray.",
    pray: "Spirit of God, pray in us what we cannot say.",
  },
  {
    read: { text: "He who didn’t spare his own Son, but delivered him up for us all, how would he not also with him freely give us all things?", ref: "Romans 8:32" },
    reflection:
      "He who didn't spare his own Son... how would he not also with him freely give us all things? An argument from the greater to the lesser.",
    talk: "What are you afraid God will withhold?",
    pray: "Father, you did not spare your Son. We trust you with everything else.",
  },
  {
    read: { text: "Don’t be conformed to this world, but be transformed by the renewing of your mind, so that you may prove what is the good, well-pleasing, and perfect will of God.", ref: "Romans 12:2" },
    reflection:
      "Don't be conformed to this world, but be transformed by the renewing of your mind. Conforming happens by default. Transformation begins with what fills your mind.",
    talk: "What is forming your ideas about parenting more than Scripture is?",
    pray: "Lord, transform us by renewing our minds.",
  },
  {
    read: { text: "Now may the God of hope fill you with all joy and peace in believing, that you may abound in hope, in the power of the Holy Spirit.", ref: "Romans 15:13" },
    reflection:
      "May the God of hope fill you with all joy and peace in believing, that you may abound in hope. Hope is a gift given, not a mood generated.",
    talk: "What are you hoping in that could fail?",
    pray: "God of hope, fill us with joy and peace in believing.",
  },
  {
    read: { text: "Love is patient and is kind. Love doesn’t envy. Love doesn’t brag, is not proud, doesn’t behave itself inappropriately, doesn’t seek its own way, is not provoked, takes no account of evil; doesn’t rejoice in unrighteousness, but rejoices with the truth; bears all things, believes all things, hopes all things, and endures all things.", ref: "1 Corinthians 13:4-7" },
    reflection:
      "Love is patient and is kind... bears all things, believes all things, hopes all things, endures all things. Written to a fractious church, not for a wedding.",
    talk: "Which line will be hardest at 3am?",
    pray: "Lord, make our love patient and kind, bearing and enduring all things.",
  },
  {
    read: { text: "But the fruit of the Spirit is love, joy, peace, patience, kindness, goodness, faith, gentleness, and self-control. Against such things there is no law.", ref: "Galatians 5:22-23" },
    reflection:
      "The fruit of the Spirit is love, joy, peace, patience, kindness, goodness, faith, gentleness, and self-control. Nine things new parents run out of.",
    talk: "Which of the nine is most missing? Ask for that one.",
    pray: "Spirit of God, grow your fruit in us. We are running low.",
  },
  {
    read: { text: "Now to him who is able to do exceedingly abundantly above all that we ask or think, according to the power that works in us, to him be the glory in the assembly and in Christ Jesus to all generations forever and ever. Amen.", ref: "Ephesians 3:20-21" },
    reflection:
      "To him who is able to do exceedingly abundantly above all that we ask or think, according to the power that works in us. Ability exceeding imagination.",
    talk: "What are you afraid to ask for?",
    pray: "Lord, you can do more than we ask or imagine. We ask again.",
  },
  {
    read: { text: "And be kind to one another, tender hearted, forgiving each other, just as God also in Christ forgave you.", ref: "Ephesians 4:32" },
    reflection:
      "And be kind to one another, tender hearted, forgiving each other, just as God also in Christ forgave you. The standard is how you have been forgiven.",
    talk: "What needs forgiving between you tonight?",
    pray: "Lord, make us kind and tender-hearted, forgiving as we were forgiven.",
  },
  {
    read: { text: "with all prayer and requests, praying at all times in the Spirit, and being watchful to this end in all perseverance and requests for all the saints:", ref: "Ephesians 6:18" },
    reflection:
      "With all prayer and requests, praying at all times in the Spirit, and being watchful to this end in all perseverance. Prayer as the thing that holds the armour on.",
    talk: "Do you pray for each other by name daily? Start tonight if not.",
    pray: "Lord, keep us praying at all times, watchful for each other.",
  },
  {
    read: { text: "bearing with one another, and forgiving each other, if any man has a complaint against any; even as Christ forgave you, so you also do.", ref: "Colossians 3:13" },
    reflection:
      "Bearing with one another, and forgiving each other, if any man has a complaint against any; even as Christ forgave you, so you also do. Bearing with assumes something to bear.",
    talk: "What do you each have to bear with in the other right now?",
    pray: "Lord, help us bear with and forgive one another as you forgave us.",
  },
  {
    read: { text: "Now may the Lord of peace himself give you peace at all times in all ways. The Lord be with you all.", ref: "2 Thessalonians 3:16" },
    reflection:
      "Now may the Lord of peace himself give you peace at all times in all ways. The Lord be with you all. Peace at all times in all ways — that is the scope of the prayer.",
    talk: "Where do you most lack peace? Ask for it there.",
    pray: "Lord of peace, give us peace at all times in every way.",
  },
  {
    read: { text: "For every creature of God is good, and nothing is to be rejected, if it is received with thanksgiving.", ref: "1 Timothy 4:4" },
    reflection:
      "For every creature of God is good, and nothing is to be rejected if it is received with thanksgiving. Sleep, food, help, medicine — received with thanks, not refused out of misplaced piety.",
    talk: "What help have you refused that you should receive?",
    pray: "Lord, everything you made is good. Teach us to receive with thanks.",
  },
  {
    read: { text: "not by works of righteousness which we did ourselves, but according to his mercy, he saved us through the washing of regeneration and renewing by the Holy Spirit,", ref: "Titus 3:5" },
    reflection:
      "He saved us, not by works of righteousness which we did ourselves, but according to his mercy. Nothing you do as a parent will save you or this child. Mercy will.",
    talk: "Where are you trying to earn what has been given?",
    pray: "Lord, you saved us by mercy, not by our works. Thank you.",
  },
  {
    read: { text: "For in that he himself has suffered being tempted, he is able to help those who are tempted.", ref: "Hebrews 2:18" },
    reflection:
      "In that he himself has suffered being tempted, he is able to help those who are tempted. Christ is not sympathetic from a distance.",
    talk: "What are you tempted by in this season? Does it help that he understands?",
    pray: "Lord Jesus, you have been tempted. Help us who are being tempted.",
  },
  {
    read: { text: "For we don’t have a high priest who can’t be touched with the feeling of our infirmities, but one who has been in all points tempted like we are, yet without sin.", ref: "Hebrews 4:15" },
    reflection:
      "We don't have a high priest who can't be touched with the feeling of our infirmities. He knows what a tired human body feels like.",
    talk: "What would you want Christ to understand about today? He already does.",
    pray: "Lord Jesus, you know our weakness. Thank you for understanding.",
  },
  {
    read: { text: "Now faith is assurance of things hoped for, proof of things not seen.", ref: "Hebrews 11:1" },
    reflection:
      "Now faith is assurance of things hoped for, proof of things not seen. Faith is not certainty about outcomes. It is confidence about someone.",
    talk: "What are you sure of that you cannot see?",
    pray: "Lord, give us assurance of what we hope for and conviction of what we cannot see.",
  },
  {
    read: { text: "All chastening seems for the present to be not joyous but grievous; yet afterward it yields the peaceful fruit of righteousness to those who have been trained by it.", ref: "Hebrews 12:11" },
    reflection:
      "All chastening seems for the present to be not joyous but grievous; yet afterward it yields the peaceful fruit of righteousness. Painful, admitted. Fruit later.",
    talk: "What has God been disciplining? Are you being trained by it or resisting?",
    pray: "Lord, let your discipline yield the peaceful fruit of righteousness.",
  },
  {
    read: { text: "Count it all joy, my brothers, when you fall into various temptations, knowing that the testing of your faith produces endurance.", ref: "James 1:2-3" },
    reflection:
      "Count it all joy when you fall into various temptations, knowing that the testing of your faith produces endurance. Not 'feel joy' — count it, a deliberate reckoning.",
    talk: "What is the current trial producing? Can you see it yet?",
    pray: "Lord, let endurance have its full effect in us.",
  },
  {
    read: { text: "Come now, you who say, “Today or tomorrow let’s go into this city, and spend a year there, trade, and make a profit.” Whereas you don’t know what your life will be like tomorrow. For what is your life? For you are a vapor that appears for a little time, and then vanishes away. For you ought to say, “If the Lord wills, we will both live, and do this or that.", ref: "James 4:13-15" },
    reflection:
      "You ought to say, 'If the Lord wills, we will both live, and do this or that.' Every plan for this child is provisional on his will.",
    talk: "What are you planning as though your life were guaranteed?",
    pray: "Lord, if you will, we will live and do this. All our plans are yours.",
  },
  {
    read: { text: "If we confess our sins, he is faithful and righteous to forgive us the sins, and to cleanse us from all unrighteousness.", ref: "1 John 1:9" },
    reflection:
      "If we confess our sins, he is faithful and righteous to forgive us the sins, and to cleanse us from all unrighteousness. Forgiveness tied to his character, not his mood.",
    talk: "What have you not confessed because you doubt he would forgive it?",
    pray: "Lord, we confess. You are faithful and just to forgive and cleanse.",
  },
  {
    read: { text: "We love him, because he first loved us.", ref: "1 John 4:19" },
    reflection:
      "We love him, because he first loved us. Every love in this house is a response to a prior love. Including the love you will feel for this child.",
    talk: "Where did your capacity to love come from?",
    pray: "Lord, we love because you first loved us.",
  },
  {
    read: { text: "I set my rainbow in the cloud, and it will be a sign of a covenant between me and the earth.", ref: "Genesis 9:13" },
    reflection:
      "I set my rainbow in the cloud, and it will be a sign of a covenant. A weapon hung up in the sky. God signs his promise with a picture of war laid down.",
    talk: "What promise of God do you need a visible sign of?",
    pray: "Lord, you set your bow in the clouds. Thank you for keeping promises.",
  },
  {
    read: { text: "Sarah said, “God has made me laugh. Everyone who hears will laugh with me.", ref: "Genesis 21:6" },
    reflection:
      "God has made me laugh. Everyone who hears will laugh with me. Sarah, who laughed bitterly, laughs differently. God can change the meaning of a laugh.",
    talk: "What have you laughed at bitterly? Could that change?",
    pray: "Lord, you turn bitter laughter to joy. Do it in your own time.",
  },
  {
    read: { text: "Elkanah her husband said to her, “Hannah, why do you weep? Why don’t you eat? Why is your heart grieved? Am I not better to you than ten sons?", ref: "1 Samuel 1:8" },
    reflection:
      "Am I not better to you than ten sons? A husband means well and misses her completely. Loving someone includes not requiring them to be comforted on your terms.",
    talk: "When have you tried to fix rather than sit with the other's grief?",
    pray: "Lord, teach us to grieve with each other rather than talking each other out of it.",
  },
  {
    read: { text: "I had heard of you by the hearing of the ear, but now my eye sees you.", ref: "Job 42:5" },
    reflection:
      "I had heard of you by the hearing of the ear, but now my eye sees you. God never explained the suffering. He gave Job himself.",
    talk: "Would you rather have an explanation from God, or God?",
    pray: "Lord, we want answers. Give us yourself, which is better.",
  },
  {
    read: { text: "Jesus answered, “This man didn’t sin, nor did his parents; but, that the works of God might be revealed in him.", ref: "John 9:3" },
    reflection:
      "Neither did this man sin, nor his parents; but, that the works of God might be revealed in him. Jesus refuses the whole question of blame.",
    talk: "Have you searched for what you did wrong when something went wrong?",
    pray: "Lord Jesus, free us from hunting for our own guilt in every hard thing.",
  },
  {
    read: { text: "Blessed is the man who doesn’t walk in the counsel of the wicked, nor stand on the path of sinners, nor sit in the seat of scoffers; but his delight is in the LORD’s law. On his law he meditates day and night.", ref: "Psalm 1:1-2" },
    reflection:
      "Blessed is the man who doesn't walk in the counsel of the wicked... but his delight is in the LORD's law. Delight, not duty. What you feed on shapes what grows in you.",
    talk: "What are you feeding on in this season — advice, forums, fear, or Scripture?",
    pray: "Lord, let our delight be in your word, day and night.",
  },
  {
    read: { text: "Ask of me, and I will give the nations for your inheritance, the uttermost parts of the earth for your possession.", ref: "Psalm 2:8" },
    reflection:
      "Ask of me, and I will give the nations for your inheritance. The Father's word to the Son. This child's future is bound up with a King who already owns everything.",
    talk: "What inheritance do you want for this child? What is already secured?",
    pray: "Lord Jesus, all things are yours. Give this child a place in your kingdom.",
  },
  {
    read: { text: "Have mercy on me, the LORD, for I am faint. the LORD, heal me, for my bones are troubled.", ref: "Psalm 6:2" },
    reflection:
      "Have mercy on me, LORD, for I am faint. Heal me, LORD, for my bones are troubled. Physical exhaustion brought to God as prayer, without apology.",
    talk: "How is your body? Have you told God plainly?",
    pray: "Lord, we are languishing. Heal us; our bones are troubled.",
  },
  {
    read: { text: "My shield is with God, who saves the upright in heart.", ref: "Psalm 7:10" },
    reflection:
      "My shield is with God, who saves the upright in heart. A shield held by someone else. You are not required to defend yourself in this season.",
    talk: "What are you defending that God could hold instead?",
    pray: "Lord, our shield is with you. Save the upright in heart.",
  },
  {
    read: { text: "But you do see trouble and grief. You consider it to take it into your hand. You help the victim and the fatherless.", ref: "Psalm 10:14" },
    reflection:
      "But you do see trouble and grief. You consider it to take it into your hand. You are the helper of the fatherless. God sees, considers, and takes it in hand.",
    talk: "What trouble do you think God has not noticed?",
    pray: "Lord, you see trouble and grief. Take ours into your hand.",
  },
  {
    read: { text: "the LORD is in his holy temple. the LORD is on his throne in heaven. His eyes observe. His eyes examine the children of men.", ref: "Psalm 11:4" },
    reflection:
      "The LORD is in his holy temple. The LORD is on his throne in heaven. When the foundations shake, the throne does not.",
    talk: "What foundation of yours has moved? Where is the throne in that?",
    pray: "Lord, you are on your throne. The foundations shake and you do not.",
  },
  {
    read: { text: "Because of the oppression of the weak and because of the groaning of the needy, I will now arise,” says the LORD; “I will set him in safety from those who malign him.", ref: "Psalm 12:5" },
    reflection:
      "Because of the oppression of the weak and because of the groaning of the needy, I will now arise, says the LORD. Groaning is what moves God to act.",
    talk: "Who is groaning near you? What might God be about to do?",
    pray: "Lord, arise for the groaning of the needy.",
  },
  {
    read: { text: "the LORD looked down from heaven on the children of men, to see if there were any who understood, who sought after God.", ref: "Psalm 14:2" },
    reflection:
      "The LORD looked down from heaven on the children of men, to see if there were any who understood, who sought after God. God searching for anyone who is looking for him.",
    talk: "Are you seeking God in this season, or only asking him for things?",
    pray: "Lord, you look for those who seek you. Find us seeking.",
  },
  {
    read: { text: "the LORD, who shall dwell in your sanctuary? Who shall live on your holy hill? He who walks blamelessly and does what is right, and speaks truth in his heart;", ref: "Psalm 15:1-2" },
    reflection:
      "LORD, who shall dwell in your sanctuary? He who walks blamelessly. The entry requirements are impossible, which is why we come through Christ.",
    talk: "Read the whole psalm. Where do you fail? What do you do with that?",
    pray: "Lord, none of us qualifies. Thank you for Christ, who does.",
  },
  {
    read: { text: "The heavens declare the glory of God. The expanse shows his handiwork.", ref: "Psalm 19:1" },
    reflection:
      "The heavens declare the glory of God. The expanse shows his handiwork. This child will grow up under a sky that preaches.",
    talk: "When did you last look up on purpose?",
    pray: "Lord, the heavens declare your glory. Open our eyes to it.",
  },
  {
    read: { text: "Let the words of my mouth and the meditation of my heart be acceptable in your sight, the LORD, my rock, and my redeemer.", ref: "Psalm 19:14" },
    reflection:
      "Let the words of my mouth and the meditation of my heart be acceptable in your sight. Words come out of what has been rehearsed inside.",
    talk: "What have you been rehearsing in your heart lately?",
    pray: "Lord, let our words and our thoughts be acceptable to you.",
  },
  {
    read: { text: "For you make him most blessed forever. You make him glad with joy in your presence.", ref: "Psalm 21:6" },
    reflection:
      "For you make him most blessed forever. You make him glad with joy in your presence. Joy located in his presence, not in circumstances.",
    talk: "Where do you look for joy first? Is it there?",
    pray: "Lord, make us glad with the joy of your presence.",
  },
  {
    read: { text: "The earth is the LORD’s, with its fullness; the world, and those who dwell in it.", ref: "Psalm 24:1" },
    reflection:
      "The earth is the LORD's, with its fullness; the world, and those who dwell in it. Including this child. You are stewards, not owners.",
    talk: "What do you treat as yours that is held in trust?",
    pray: "Lord, the earth is yours and all who live in it. Make us faithful stewards.",
  },
  {
    read: { text: "Examine me, the LORD, and prove me. Try my heart and my mind.", ref: "Psalm 26:2" },
    reflection:
      "Examine me, LORD, and prove me. Try my heart and my mind. A dangerous prayer prayed by someone who wants to be right more than to feel right.",
    talk: "Would you dare pray this? What are you afraid he would find?",
    pray: "Examine us, Lord. Test our hearts and minds.",
  },
  {
    read: { text: "the LORD is my strength and my shield. My heart has trusted in him, and I am helped. Therefore my heart greatly rejoices. With my song I will thank him.", ref: "Psalm 28:7" },
    reflection:
      "The LORD is my strength and my shield. My heart has trusted in him, and I am helped. Therefore my heart greatly rejoices. Trust, help, then joy — in that order.",
    talk: "Where in that sequence are you today?",
    pray: "Lord, be our strength and shield. We trust you and are helped.",
  },
  {
    read: { text: "My soul shall be joyful in the LORD. It shall rejoice in his salvation.", ref: "Psalm 35:9" },
    reflection:
      "My soul shall be joyful in the LORD. It shall rejoice in his salvation. Joy located in what God has done, not in what is currently happening.",
    talk: "What has God already done that you can rejoice in tonight?",
    pray: "Lord, our souls rejoice in you and in your salvation.",
  },
  {
    read: { text: "How precious is your loving kindness, God! The children of men take refuge under the shadow of your wings.", ref: "Psalm 36:7" },
    reflection:
      "How precious is your loving kindness, God! The children of men take refuge under the shadow of your wings. Shelter offered to anyone who comes.",
    talk: "Where do you shelter when you are frightened?",
    pray: "Lord, we take refuge under the shadow of your wings.",
  },
  {
    read: { text: "Lord, all my desire is before you. My groaning is not hidden from you.", ref: "Psalm 38:9" },
    reflection:
      "Lord, all my desire is before you. My groaning is not hidden from you. Even inarticulate longing is fully known.",
    talk: "What do you long for that you cannot put into words?",
    pray: "Lord, all our longing is before you. Our sighing is not hidden.",
  },
  {
    read: { text: "Now, Lord, what do I wait for? My hope is in you.", ref: "Psalm 39:7" },
    reflection:
      "Now, Lord, what do I wait for? My hope is in you. A question and its own answer, in one breath.",
    talk: "What are you waiting for? Where is your hope actually placed?",
    pray: "Lord, what do we wait for? Our hope is in you.",
  },
  {
    read: { text: "the LORD will sustain him on his sickbed, and restore him from his bed of illness.", ref: "Psalm 41:3" },
    reflection:
      "The LORD will sustain him on his sickbed, and restore him from his bed of illness. God named as present at a sickbed. He is not only the God of good days.",
    talk: "Who is ill near you? Have you prayed this verse over them?",
    pray: "Lord, sustain those on their sickbeds. Restore them.",
  },
  {
    read: { text: "Why are you in despair, my soul? Why are you disturbed within me? Hope in God! For I shall still praise him: my Savior, my helper, and my God.", ref: "Psalm 43:5" },
    reflection:
      "Why are you in despair, my soul? Hope in God! For I shall still praise him: my Saviour, my helper, and my God. Talking to yourself, and preaching truth back.",
    talk: "What would you say to your own soul tonight?",
    pray: "Lord, we hope in you. We shall again praise you, our salvation and our God.",
  },
  {
    read: { text: "Rise up to help us. Redeem us for your loving kindness’ sake.", ref: "Psalm 44:26" },
    reflection:
      "Rise up to help us. Redeem us for your loving kindness' sake. A demand made on the ground of God's own character, not the people's worth.",
    talk: "On what grounds do you ask God for things?",
    pray: "Rise up and help us, Lord. Redeem us for the sake of your steadfast love.",
  },
  {
    read: { text: "My heart overflows with a noble theme. I recite my verses for the king. My tongue is like the pen of a skillful writer.", ref: "Psalm 45:1" },
    reflection:
      "My heart overflows with a noble theme. I recite my verses for the king. Praise described as overflow. It has to fill before it spills.",
    talk: "What is your heart full of right now? What overflows?",
    pray: "Lord, fill our hearts with a good theme, and let it overflow.",
  },
  {
    read: { text: "Oh clap your hands, all you nations. Shout to God with the voice of triumph!", ref: "Psalm 47:1" },
    reflection:
      "Oh clap your hands, all you nations. Shout to God with the voice of triumph! Worship in Scripture is physical and loud, not only quiet and internal.",
    talk: "Is worship in this house ever loud or physical? Should it be?",
    pray: "Lord, we clap and shout. You are King over all the earth.",
  },
  {
    read: { text: "For this God is our God forever and ever. He will be our guide even to death.", ref: "Psalm 48:14" },
    reflection:
      "For this God is our God forever and ever. He will be our guide even to death. A guide who does not stop at the hard part.",
    talk: "How far does your trust in God's guidance reach?",
    pray: "Lord, you are our God forever. Guide us even to the end.",
  },
  {
    read: { text: "Call on me in the day of trouble. I will deliver you, and you will honor me.", ref: "Psalm 50:15" },
    reflection:
      "Call on me in the day of trouble. I will deliver you, and you will honour me. Trouble as an occasion for calling; deliverance as an occasion for glory.",
    talk: "What trouble have you handled without calling on him?",
    pray: "Lord, we call on you in the day of trouble. Deliver us.",
  },
  {
    read: { text: "But as for me, I am like a green olive tree in God’s house. I trust in God’s loving kindness forever and ever.", ref: "Psalm 52:8" },
    reflection:
      "But as for me, I am like a green olive tree in God's house. I trust in God's loving kindness forever and ever. Planted in his house, alive because of where it stands.",
    talk: "Where are you planted? Is it somewhere that keeps you green?",
    pray: "Lord, let us be like green olive trees in your house.",
  },
  {
    read: { text: "Behold, God is my helper. The Lord is the one who sustains my soul.", ref: "Psalm 54:4" },
    reflection:
      "Behold, God is my helper. The Lord is the one who sustains my soul. Two roles: helping with the situation, sustaining the soul inside it.",
    talk: "Which do you need more — help, or sustaining?",
    pray: "Lord, be our helper and the upholder of our lives.",
  },
  {
    read: { text: "Be merciful to me, God, be merciful to me, for my soul takes refuge in you. Yes, in the shadow of your wings, I will take refuge, until disaster has passed.", ref: "Psalm 57:1" },
    reflection:
      "Be merciful to me, God, be merciful to me... until disaster has passed. Written in a cave. Refuge until it passes, not instead of it.",
    talk: "Are you asking God to remove the storm or to shelter you through it?",
    pray: "Be merciful to us, God. We take refuge until the storms pass by.",
  },
  {
    read: { text: "But I will sing of your strength. Yes, I will sing aloud of your loving kindness in the morning. For you have been my high tower, a refuge in the day of my distress.", ref: "Psalm 59:16" },
    reflection:
      "But I will sing of your strength. Yes, I will sing aloud of your loving kindness in the morning. For you have been my high tower.",
    talk: "What could you sing about tomorrow morning?",
    pray: "Lord, we will sing of your strength and your love in the morning.",
  },
  {
    read: { text: "Through God we will do valiantly, for it is he who will tread down our adversaries.", ref: "Psalm 60:12" },
    reflection:
      "Through God we will do valiantly, for it is he who will tread down our adversaries. Valour is borrowed. Nobody here has to be brave on their own supply.",
    talk: "What are you facing that requires borrowed courage?",
    pray: "Lord, through you we shall do valiantly.",
  },
  {
    read: { text: "The righteous shall be glad in the LORD, and shall take refuge in him. All the upright in heart shall praise him!", ref: "Psalm 64:10" },
    reflection:
      "The righteous shall be glad in the LORD, and shall take refuge in him. All the upright in heart shall praise him! Gladness and refuge in the same person.",
    talk: "Is God a refuge to you, or mostly a standard?",
    pray: "Lord, we take refuge in you and are glad.",
  },
  {
    read: { text: "You crown the year with your bounty. Your carts overflow with abundance.", ref: "Psalm 65:11" },
    reflection:
      "You crown the year with your bounty. Your carts overflow with abundance. God's provision described as a crown on a whole year.",
    talk: "What has this year held that you could call bounty?",
    pray: "Lord, you crown the year with your goodness. Thank you.",
  },
  {
    read: { text: "May God be merciful to us, bless us, and cause his face to shine on us. That your way may be known on earth, and your salvation among all nations,", ref: "Psalm 67:1-2" },
    reflection:
      "May God be merciful to us, bless us, and cause his face to shine on us... that your way may be known on earth. Blessing asked for, so that others may know him.",
    talk: "Why do you want God's blessing? For yourselves, or for what it enables?",
    pray: "Lord, bless us, that your way may be known on earth.",
  },
  {
    read: { text: "Save me, God, for the waters have come up to my neck! I sink in deep mire, where there is no foothold. I have come into deep waters, where the floods overflow me. I am weary with my crying. My throat is dry. My eyes fail looking for my God.", ref: "Psalm 69:1-3" },
    reflection:
      "Save me, God, for the waters have come up to my neck... I am weary with my crying. Exhaustion, not triumph, and it is in the songbook.",
    talk: "Are you weary with crying out? Would you keep going anyway?",
    pray: "Save us, God. The waters are up to our necks and we are tired.",
  },
  {
    read: { text: "But I am poor and needy. Come to me quickly, God. You are my help and my deliverer. the LORD, don’t delay.", ref: "Psalm 70:5" },
    reflection:
      "But I am poor and needy. Come to me quickly, God. You are my help and my deliverer. Hurry — an urgent, undignified prayer, and God preserved it.",
    talk: "What would an urgent, undignified prayer sound like from you?",
    pray: "Lord, we are poor and needy. Hasten to us.",
  },
  {
    read: { text: "For he will deliver the needy when he cries; the poor, who has no helper.", ref: "Psalm 72:12" },
    reflection:
      "For he will deliver the needy when he cries; the poor, who has no helper. The King's job description begins with those who have nobody.",
    talk: "Who near you has no helper?",
    pray: "Lord, deliver the needy who cry, and the poor who have no helper.",
  },
  {
    read: { text: "The day is yours, the night is also yours. You have prepared the light and the sun. You have set all the boundaries of the earth. You have made summer and winter.", ref: "Psalm 74:16-17" },
    reflection:
      "The day is yours, the night is also yours. You have prepared the light and the sun. Both halves of a twenty-four hour cycle belong to him. Including the small hours.",
    talk: "What are your nights like? Who owns them?",
    pray: "Lord, the day is yours and the night is yours. Keep us in both.",
  },
  {
    read: { text: "For neither from the east, nor from the west, nor yet from the south, comes exaltation. But God is the judge. He puts down one, and lifts up another.", ref: "Psalm 75:6-7" },
    reflection:
      "For neither from the east, nor from the west, nor yet from the south, comes exaltation. But God is the judge. He puts down one, and lifts up another. Position is his to give.",
    talk: "What position are you striving for? Who gives it?",
    pray: "Lord, you put down and you lift up. We leave our place with you.",
  },
  {
    read: { text: "You pronounced judgment from heaven. The earth feared, and was silent, when God arose to judgment, to save all the afflicted ones of the earth.", ref: "Psalm 76:8-9" },
    reflection:
      "You caused sentence to be heard from heaven. The earth feared, and was silent, when God arose to judgement, to save all the afflicted ones of the earth. His judgement saves the afflicted.",
    talk: "Why is God's judgement good news to those being crushed?",
    pray: "Lord, arise to save all the humble of the earth.",
  },
  {
    read: { text: "Help us, God of our salvation, for the glory of your name. Deliver us, and forgive our sins, for your name’s sake.", ref: "Psalm 79:9" },
    reflection:
      "Help us, God of our salvation, for the glory of your name. Deliver us, and forgive our sins, for your name's sake. Asking on the ground of his reputation.",
    talk: "How does praying 'for your name's sake' change what you ask for?",
    pray: "Help us, God of our salvation, for the glory of your name.",
  },
  {
    read: { text: "Turn us again, the LORD God of Armies. Cause your face to shine, and we will be saved.", ref: "Psalm 80:19" },
    reflection:
      "Turn us again, LORD God of Armies. Cause your face to shine, and we will be saved. We cannot even turn ourselves. The prayer is to be turned.",
    talk: "What do you need God to turn in you?",
    pray: "Restore us, Lord God of hosts. Let your face shine, that we may be saved.",
  },
  {
    read: { text: "I am the LORD, your God, who brought you up out of the land of Egypt. Open your mouth wide, and I will fill it.", ref: "Psalm 81:10" },
    reflection:
      "Open your mouth wide, and I will fill it. An invitation to ask largely. Most of us ask small and blame God for small answers.",
    talk: "What would asking largely look like for this family?",
    pray: "Lord, we open our mouths wide. Fill them.",
  },
  {
    read: { text: "Defend the weak, the poor, and the fatherless. Maintain the rights of the poor and oppressed. Rescue the weak and needy. Deliver them out of the hand of the wicked.", ref: "Psalm 82:3-4" },
    reflection:
      "Defend the weak, the poor, and the fatherless. Maintain the rights of the poor and oppressed. Rescue the weak and needy. Four commands about the powerless.",
    talk: "Who is powerless in your world? What could this house do?",
    pray: "Lord, make us defenders of the weak and the fatherless.",
  },
  {
    read: { text: "God, don’t keep silent. Don’t keep silent, and don’t be still, God.", ref: "Psalm 83:1" },
    reflection:
      "God, don't keep silent. Don't keep silent, and don't be still, God. God's silence complained about, twice in one verse. That is allowed.",
    talk: "Where has God been silent? Have you said so to him?",
    pray: "God, do not keep silence. Do not hold your peace.",
  },
  {
    read: { text: "I will hear what God, the LORD, will speak, for he will speak peace to his people, his saints; but let them not turn again to folly.", ref: "Psalm 85:8" },
    reflection:
      "I will hear what God, the LORD, will speak, for he will speak peace to his people, his saints. Listening posture, expecting peace.",
    talk: "When did you last stop to listen rather than to ask?",
    pray: "Lord, we will listen. Speak peace to your people.",
  },
  {
    read: { text: "Yes, of Zion it will be said, “This one and that one was born in her;” the Most High himself will establish her. the LORD will count, when he writes up the peoples, “This one was born there.", ref: "Psalm 87:5-6" },
    reflection:
      "Yes, of Zion it will be said, 'This one and that one was born in her.' The LORD will count, when he writes up the peoples, 'This one was born there.' God keeps a birth register.",
    talk: "What would it mean for this child's name to be written in God's register?",
    pray: "Lord, you record where each person was born. Write this child's name in your book.",
  },
  {
    read: { text: "the LORD, the God of my salvation, I have cried day and night before you. Let my prayer enter into your presence. Turn your ear to my cry.", ref: "Psalm 88:1-2" },
    reflection:
      "LORD, the God of my salvation, I have cried day and night before you. Let my prayer enter into your presence. The one psalm that ends without hope begins by still addressing him.",
    talk: "Can you keep praying when nothing improves? What would that look like?",
    pray: "Lord, we cry day and night before you. Let our prayer come to you.",
  },
  {
    read: { text: "Above the voices of many waters, the mighty breakers of the sea, the LORD on high is mighty.", ref: "Psalm 93:4" },
    reflection:
      "Above the voices of many waters, the mighty breakers of the sea, the LORD on high is mighty. Louder than the noise. That is the claim.",
    talk: "What noise is loudest in your life right now?",
    pray: "Lord, you are mightier than the thunder of the waters.",
  },
  {
    read: { text: "Oh come, let’s worship and bow down. Let’s kneel before the LORD, our Maker,", ref: "Psalm 95:6" },
    reflection:
      "Oh come, let's worship and bow down. Let's kneel before the LORD our Maker. Worship described physically and corporately — come, bow, kneel.",
    talk: "Try kneeling together for a moment before you pray tonight.",
    pray: "Lord our Maker, we bow before you.",
  },
  {
    read: { text: "Sing to the LORD a new song! Sing to the LORD, all the earth.", ref: "Psalm 96:1" },
    reflection:
      "Sing to the LORD a new song! Sing to the LORD, all the earth. New songs for new mercies. This season deserves its own.",
    talk: "What new thing has God done that deserves a new song?",
    pray: "Lord, we sing a new song to you.",
  },
  {
    read: { text: "Light is sown for the righteous, and gladness for the upright in heart.", ref: "Psalm 97:11" },
    reflection:
      "Light is sown for the righteous, and gladness for the upright in heart. Sown — planted now, harvested later. Light can be underground for a while.",
    talk: "What has been sown in you that has not yet come up?",
    pray: "Lord, light is sown for the righteous. Let it break through.",
  },
  {
    read: { text: "Sing to the LORD a new song, for he has done marvelous things! His right hand and his holy arm have worked salvation for him.", ref: "Psalm 98:1" },
    reflection:
      "Sing to the LORD a new song, for he has done marvellous things! His right hand and his holy arm have worked salvation for him. Praise grounded in what he has done.",
    talk: "What marvellous thing has God done for you? Say it aloud.",
    pray: "Lord, you have done marvellous things. We sing a new song.",
  },
  {
    read: { text: "You answered them, the LORD our God. You are a God who forgave them, although you took vengeance for their doings.", ref: "Psalm 99:8" },
    reflection:
      "You answered them, LORD our God. You were a God who forgave them, although you took vengeance for their doings. Forgiveness and consequences, held together.",
    talk: "Have you experienced forgiveness alongside consequences? How did you hold both?",
    pray: "Lord, you forgive, and you deal with what we have done. We trust both.",
  },
  {
    read: { text: "I will be careful to live a blameless life. When will you come to me? I will walk within my house with a blameless heart.", ref: "Psalm 101:2" },
    reflection:
      "I will walk within my house with a perfect heart. A king's resolution about how he behaves at home. Home conduct is a spiritual matter.",
    talk: "Are you the same person at home as elsewhere? Where is the gap?",
    pray: "Lord, let us walk with integrity inside our own house.",
  },
  {
    read: { text: "He causes the grass to grow for the livestock, and plants for man to cultivate, that he may produce food out of the earth: wine that makes the heart of man glad, oil to make his face to shine, and bread that strengthens man’s heart.", ref: "Psalm 104:14-15" },
    reflection:
      "He causes the grass to grow for the livestock, and plants for man to cultivate... wine that makes the heart of man glad, oil to make his face to shine, and bread that strengthens.",
    talk: "What ordinary good has God given today that you have not noticed?",
    pray: "Lord, you give bread and gladness. Thank you for ordinary good things.",
  },
  {
    read: { text: "Seek the LORD and his strength. Seek his face forever more.", ref: "Psalm 105:4" },
    reflection:
      "Seek the LORD and his strength. Seek his face forever more. Seeking described as permanent, not occasional.",
    talk: "What would seeking God look like this week, practically?",
    pray: "Lord, we seek your face. Keep us seeking.",
  },
  {
    read: { text: "Praise the LORD! Give thanks to the LORD, for he is good, for his loving kindness endures forever.", ref: "Psalm 106:1" },
    reflection:
      "Praise the LORD! Give thanks to the LORD, for he is good, for his loving kindness endures forever. A psalm cataloguing Israel's failures opens with praise.",
    talk: "Can you praise God at the start of a list of your own failures?",
    pray: "Give thanks to the Lord, for he is good; his love endures forever.",
  },
  {
    read: { text: "For your loving kindness is great above the heavens. Your faithfulness reaches to the skies.", ref: "Psalm 108:4" },
    reflection:
      "For your loving kindness is great above the heavens. Your faithfulness reaches to the skies. Scale used to describe love, not power.",
    talk: "How big is God's love to you? Bigger than your worst fear?",
    pray: "Lord, your steadfast love is higher than the heavens.",
  },
  {
    read: { text: "for I am poor and needy. My heart is wounded within me.", ref: "Psalm 109:22" },
    reflection:
      "For I am poor and needy. My heart is wounded within me. A wounded heart brought to God in plain words.",
    talk: "What has wounded you? Can you say it as simply as this?",
    pray: "Lord, we are poor and needy, and our hearts are wounded within us.",
  },
  {
    read: { text: "the LORD says to my Lord, “Sit at my right hand, until I make your enemies your footstool for your feet.", ref: "Psalm 110:1" },
    reflection:
      "The LORD says to my Lord, 'Sit at my right hand, until I make your enemies your footstool.' The most quoted Old Testament verse in the New Testament.",
    talk: "Where is Jesus now? What difference does that make to today?",
    pray: "Lord Jesus, you are seated at the right hand. Reign over this house.",
  },
  {
    read: { text: "He has caused his wonderful works to be remembered. the LORD is gracious and merciful.", ref: "Psalm 111:4" },
    reflection:
      "He has caused his wonderful works to be remembered. The LORD is gracious and merciful. He builds memory in on purpose, because we forget.",
    talk: "How does this house remember what God has done?",
    pray: "Lord, you cause your works to be remembered. Do not let us forget.",
  },
  {
    read: { text: "Tremble, you earth, at the presence of the Lord, at the presence of the God of Jacob,", ref: "Psalm 114:7" },
    reflection:
      "Tremble, you earth, at the presence of the Lord, at the presence of the God of Jacob. The one who is gentle with a nursing mother is also the one before whom the earth trembles.",
    talk: "Do you hold both God's tenderness and his greatness? Which do you forget?",
    pray: "Lord, the earth trembles before you. Be great and gentle with us.",
  },
  {
    read: { text: "Not to us, the LORD, not to us, but to your name give glory, for your loving kindness, and for your truth’s sake.", ref: "Psalm 115:1" },
    reflection:
      "Not to us, LORD, not to us, but to your name give glory. Repeated for emphasis, because the instinct to take credit is strong.",
    talk: "Where have you quietly taken glory that belongs to God?",
    pray: "Not to us, Lord, not to us, but to your name give glory.",
  },
  {
    read: { text: "Praise the LORD, all you nations! Extol him, all you peoples! For his loving kindness is great toward us. the LORD’s faithfulness endures forever. Praise Yah!", ref: "Psalm 117:1-2" },
    reflection:
      "Praise the LORD, all you nations! ... For his loving kindness is great toward us. The shortest psalm, and it is about God's love toward us and every nation.",
    talk: "What would you say about God in two lines?",
    pray: "Praise the Lord, all nations. His steadfast love toward us is great.",
  },
  {
    read: { text: "In my distress, I cried to the LORD. He answered me.", ref: "Psalm 120:1" },
    reflection:
      "In my distress, I cried to the LORD. He answered me. Two sentences: distress, and answer. Nothing between them but crying out.",
    talk: "What distress has gone uncried-about?",
    pray: "Lord, in our distress we cry to you. Answer us.",
  },
  {
    read: { text: "I was glad when they said to me, “Let’s go to the LORD’s house!", ref: "Psalm 122:1" },
    reflection:
      "I was glad when they said to me, 'Let's go to the LORD's house!' Gladness at gathering with God's people. That instinct is worth cultivating in a child from the start.",
    talk: "Is going to church a gladness or a duty for you? What would move it?",
    pray: "Lord, make us glad to go to your house.",
  },
  {
    read: { text: "Behold, as the eyes of servants look to the hand of their master, as the eyes of a maid to the hand of her mistress; so our eyes look to the LORD, our God, until he has mercy on us.", ref: "Psalm 123:2" },
    reflection:
      "As the eyes of servants look to the hand of their master... so our eyes look to the LORD our God. Watching a hand for the smallest signal.",
    talk: "How attentive are you to God through an ordinary day?",
    pray: "Lord, our eyes look to you until you have mercy on us.",
  },
  {
    read: { text: "Our help is in the LORD’s name, who made heaven and earth.", ref: "Psalm 124:8" },
    reflection:
      "Our help is in the LORD's name, who made heaven and earth. The name of the maker of everything is where help is located.",
    talk: "Where do you look for help first?",
    pray: "Our help is in the name of the Lord, who made heaven and earth.",
  },
  {
    read: { text: "As the mountains surround Jerusalem, so the LORD surrounds his people from this time forward and forever more.", ref: "Psalm 125:2" },
    reflection:
      "As the mountains surround Jerusalem, so the LORD surrounds his people from this time forward and forever more. Surrounded, permanently.",
    talk: "What are you afraid is unprotected?",
    pray: "Lord, surround this house as the mountains surround the city.",
  },
  {
    read: { text: "Blessed is everyone who fears the LORD, who walks in his ways.", ref: "Psalm 128:1" },
    reflection:
      "Blessed is everyone who fears the LORD, who walks in his ways. A picture of ordinary blessing, not a guarantee. Godly people have gone hungry.",
    talk: "What ordinary blessings are here today that you have stopped noticing?",
    pray: "Lord, thank you for the ordinary mercies of this house.",
  },
  {
    read: { text: "many times they have afflicted me from my youth up, yet they have not prevailed against me.", ref: "Psalm 129:2" },
    reflection:
      "Many times they have afflicted me from my youth up, yet they have not prevailed against me. Long affliction, and survival. Not victory — survival, which is enough.",
    talk: "What have you survived? Is survival a form of faithfulness?",
    pray: "Lord, they have not prevailed against us. Keep us standing.",
  },
  {
    read: { text: "I will abundantly bless her provision. I will satisfy her poor with bread.", ref: "Psalm 132:15" },
    reflection:
      "I will abundantly bless her provision. I will satisfy her poor with bread. God's attention to a city's food supply. Provision is not beneath him.",
    talk: "What provision do you need? Have you asked plainly?",
    pray: "Lord, bless our provisions. Satisfy the poor with bread.",
  },
  {
    read: { text: "See how good and how pleasant it is for brothers to live together in unity!", ref: "Psalm 133:1" },
    reflection:
      "Behold, how good and how pleasant it is for brothers to live together in unity! Unity described as good and pleasant — worth working for.",
    talk: "What is costing this house its unity right now?",
    pray: "Lord, make this house dwell together in unity.",
  },
  {
    read: { text: "Look! Praise the LORD, all you servants of the LORD, who stand by night in the LORD’s house! Lift up your hands in the sanctuary. Praise the LORD!", ref: "Psalm 134:1-2" },
    reflection:
      "Behold, bless the LORD, all you servants of the LORD, who stand by night in the LORD's house! Lift up your hands. A psalm for those on the night watch.",
    talk: "Who is on the night watch in this house? Could that become worship?",
    pray: "Lord, we who stand by night bless you. Lift our hands.",
  },
  {
    read: { text: "Whatever the LORD pleased, that he has done, in heaven and in earth, in the seas and in all deeps.", ref: "Psalm 135:6" },
    reflection:
      "Whatever the LORD pleased, that he has done, in heaven and in earth, in the seas and in all deeps. Nothing happens outside his pleasure and permission.",
    talk: "Is that a comfort or a difficulty to you? Why?",
    pray: "Lord, you do whatever pleases you. We rest under your rule.",
  },
  {
    read: { text: "By the rivers of Babylon, there we sat down. Yes, we wept, when we remembered Zion.", ref: "Psalm 137:1" },
    reflection:
      "By the rivers of Babylon, there we sat down. Yes, we wept, when we remembered Zion. Grief in a foreign place, remembered honestly. God preserved the lament.",
    talk: "What have you lost that you still weep for?",
    pray: "Lord, we sit and weep. You have kept our lament in your book.",
  },
  {
    read: { text: "I know that the LORD will maintain the cause of the afflicted, and justice for the needy.", ref: "Psalm 140:12" },
    reflection:
      "I know that the LORD will maintain the cause of the afflicted, and justice for the needy. A settled certainty about God's bias toward the afflicted.",
    talk: "Do you believe God takes the side of the afflicted? What follows from that?",
    pray: "Lord, maintain the cause of the afflicted. Do justice for the needy.",
  },
  {
    read: { text: "Set a watch, the LORD, before my mouth. Keep the door of my lips.", ref: "Psalm 141:3" },
    reflection:
      "Set a watch, LORD, before my mouth. Keep the door of my lips. He asks God to guard his speech, which suggests he could not manage it alone.",
    talk: "What did you say this week that you would take back?",
    pray: "Lord, set a guard over our mouths.",
  },
  {
    read: { text: "the LORD, what is man, that you care for him? Or the son of man, that you think of him? Man is like a breath. His days are like a shadow that passes away.", ref: "Psalm 144:3-4" },
    reflection:
      "LORD, what is man, that you care for him?... Man is like a breath. His days are like a shadow that passes away. Brief, and cared for.",
    talk: "How does the brevity of life change how you spend today?",
    pray: "Lord, we are a breath. Thank you that you care for us.",
  },
  {
    read: { text: "Happy is he who has the God of Jacob for his help, whose hope is in the LORD, his God:", ref: "Psalm 146:5" },
    reflection:
      "Happy is he who has the God of Jacob for his help, whose hope is in the LORD, his God. Happiness located in whose help you have.",
    talk: "Whose help are you relying on? Is it enough?",
    pray: "Lord, blessed are those whose help is the God of Jacob.",
  },
  {
    read: { text: "both young men and maidens; old men and children: let them praise the LORD’s name, for his name alone is exalted. His glory is above the earth and the heavens.", ref: "Psalm 148:12-13" },
    reflection:
      "Both young men and maidens; old men and children: let them praise the LORD's name. Every age named. This child is already on the list.",
    talk: "How will this child learn to praise? Who will show them?",
    pray: "Lord, let every age in this house praise your name.",
  },
  {
    read: { text: "For the LORD takes pleasure in his people. He crowns the humble with salvation.", ref: "Psalm 149:4" },
    reflection:
      "For the LORD takes pleasure in his people. He crowns the humble with salvation. Pleasure — not tolerance. That is hard to receive.",
    talk: "Do you believe God takes pleasure in you? What blocks it?",
    pray: "Lord, you take pleasure in your people. Teach us to believe it.",
  },
  {
    read: { text: "Let everything that has breath praise Yah! Praise Yah!", ref: "Psalm 150:6" },
    reflection:
      "Let everything that has breath praise the LORD! The Psalter ends here. This child's first breath is already recruited.",
    talk: "What will you teach this child to praise God for first?",
    pray: "Let everything that has breath praise the Lord.",
  },
  {
    read: { text: "This book of the law shall not depart from your mouth, but you shall meditate on it day and night, that you may observe to do according to all that is written in it; for then you shall make your way prosperous, and then you shall have good success.", ref: "Joshua 1:8" },
    reflection:
      "This book of the law shall not depart out of your mouth, but you shall meditate on it day and night. Not to earn favour but so the word is in you when you need it.",
    talk: "What do you think about when your mind is free?",
    pray: "Lord, put your word in our mouths and our minds, day and night.",
  },
  {
    read: { text: "Then Gideon built an altar there to the LORD, and called it “the LORD is Peace.” To this day it is still in Ophrah of the Abiezrites.", ref: "Judges 6:24" },
    reflection:
      "Then Gideon built an altar there to the LORD, and called it 'The LORD is Peace.' He named God after what he most needed.",
    talk: "What would you name God, out of this season?",
    pray: "Lord, you are our peace. Be that to this house.",
  },
  {
    read: { text: "May the LORD repay your work, and a full reward be given to you from the LORD, the God of Israel, under whose wings you have come to take refuge.", ref: "Ruth 2:12" },
    reflection:
      "May the LORD repay your work, and a full reward be given you from the LORD, under whose wings you have come to take refuge. A blessing spoken over a foreign widow.",
    talk: "Who has taken refuge with you? Have you blessed them?",
    pray: "Lord, we take refuge under your wings. Make us shelter for others.",
  },
  {
    read: { text: "Moreover as for me, far be it from me that I should sin against the LORD in ceasing to pray for you: but I will instruct you in the good and the right way.", ref: "1 Samuel 12:23" },
    reflection:
      "Far be it from me that I should sin against the LORD in ceasing to pray for you. Not praying for people is called a sin.",
    talk: "Who have you stopped praying for? Why did you stop?",
    pray: "Lord, forgive our abandoned prayers. Make us faithful in interceding.",
  },
  {
    read: { text: "David was greatly distressed; for the people spoke of stoning him, because the souls of all the people were grieved, every man for his sons and for his daughters; but David strengthened himself in the LORD his God.", ref: "1 Samuel 30:6" },
    reflection:
      "But David strengthened himself in the LORD his God. Nobody encouraged him. He had to do it himself, from God.",
    talk: "When no one encourages you, how do you strengthen yourself in the Lord?",
    pray: "Lord, when there is no one, let us strengthen ourselves in you.",
  },
  {
    read: { text: "Then David the king went in, and sat before the LORD; and he said, “Who am I, Lord the LORD, and what is my house, that you have brought me this far?", ref: "2 Samuel 7:18" },
    reflection:
      "Who am I, Lord the LORD, and what is my house, that you have brought me this far? Grace received rightly makes us smaller, not bigger.",
    talk: "How do you respond to God's kindness — entitlement or astonishment?",
    pray: "Who are we, Lord, that you have brought us this far?",
  },
  {
    read: { text: "For you are my lamp, the LORD. the LORD will light up my darkness.", ref: "2 Samuel 22:29" },
    reflection:
      "For you are my lamp, LORD. The LORD will light up my darkness. Not that the dark ended, but that God lit it.",
    talk: "Do you expect God to remove the dark, or to be light in it?",
    pray: "Lord, you are our lamp. Light up our darkness.",
  },
  {
    read: { text: "Give your servant therefore an understanding heart to judge your people, that I may discern between good and evil; for who is able to judge this great people of yours?", ref: "1 Kings 3:9" },
    reflection:
      "Give your servant therefore an understanding heart. Solomon could have asked for anything and asked to do the job well.",
    talk: "If you could ask God one thing for this season, what would it be?",
    pray: "Lord, give us understanding hearts for what you have given us to do.",
  },
  {
    read: { text: "But will God in very deed dwell on the earth? Behold, heaven and the heaven of heavens can’t contain you; how much less this house that I have built!", ref: "1 Kings 8:27" },
    reflection:
      "Heaven and the heaven of heavens can't contain you; how much less this house that I have built! Solomon dedicates the temple by admitting God will not fit in it.",
    talk: "What small container have you tried to keep God in?",
    pray: "Lord, the highest heaven cannot contain you. Forgive our small ideas.",
  },
  {
    read: { text: "He said, “Go out, and stand on the mountain before the LORD.” Behold, the LORD passed by, and a great and strong wind tore the mountains, and broke in pieces the rocks before the LORD; but the LORD was not in the wind. After the wind there was an earthquake; but the LORD was not in the earthquake. After the earthquake a fire passed; but the LORD was not in the fire. After the fire, there was a still small voice.", ref: "1 Kings 19:11-12" },
    reflection:
      "After the fire a still small voice. Elijah expected spectacle and God came in a whisper.",
    talk: "Do you only expect God in dramatic moments?",
    pray: "Lord, you come in the whisper. Give us ears quiet enough.",
  },
  {
    read: { text: "Elisha said to her, “What should I do for you? Tell me: what do you have in the house?” She said, “Your servant has nothing in the house, except a pot of oil.", ref: "2 Kings 4:2" },
    reflection:
      "What do you have in the house? A widow with nothing is asked what she has. The miracle starts with an almost-empty jar.",
    talk: "What little thing have you dismissed as too small?",
    pray: "Lord, what we have is small. Take it and multiply it.",
  },
  {
    read: { text: "Hezekiah received the letter from the hand of the messengers and read it. Then Hezekiah went up to the LORD’s house, and spread it before the LORD.", ref: "2 Kings 19:14" },
    reflection:
      "Hezekiah received the letter... and spread it before the LORD. He does not answer the threat; he lays it out before God.",
    talk: "What would it mean to literally spread today's bad news before God?",
    pray: "Lord, we spread it before you. We have no other answer.",
  },
  {
    read: { text: "Jabez called on the God of Israel, saying, “Oh that you would bless me indeed, and enlarge my border! May your hand be with me, and may you keep me from evil, that I may not cause pain!” God granted him that which he requested.", ref: "1 Chronicles 4:10" },
    reflection:
      "Jabez called on the God of Israel... and God granted him. One honest request, in a chapter of names. Not a formula.",
    talk: "Does it comfort you that God hears ordinary people in long lists?",
    pray: "Lord, you hear ordinary people. Hear us.",
  },
  {
    read: { text: "But who am I, and what is my people, that we should be able to offer so willingly as this? For all things come from you, and we have given you of your own.", ref: "1 Chronicles 29:14" },
    reflection:
      "Who am I, and what is my people, that we should be able to offer so willingly? All things come from you, and of your own we have given you.",
    talk: "Do you feel generous when you give, or grateful?",
    pray: "Lord, all things come from you. Keep us from pride in our giving.",
  },
  {
    read: { text: "if my people, who are called by my name, will humble themselves, pray, seek my face, and turn from their wicked ways; then I will hear from heaven, will forgive their sin, and will heal their land.", ref: "2 Chronicles 7:14" },
    reflection:
      "If my people... humble themselves, pray, seek my face, and turn from their wicked ways, then I will hear from heaven. Spoken to Israel about their land. Read it carefully; its heart is timeless.",
    talk: "Why does context matter when reading a promise?",
    pray: "Lord, humble us and turn us back to you. Hear us for Christ's sake.",
  },
  {
    read: { text: "Our God, will you not judge them? For we have no might against this great company that comes against us. We don’t know what to do, but our eyes are on you.", ref: "2 Chronicles 20:12" },
    reflection:
      "We have no might against this great company... neither know we what to do, but our eyes are on you. Total helplessness and total attention. Both are faith.",
    talk: "Can you pray 'we don't know what to do' without treating it as failure?",
    pray: "Lord, we do not know what to do, but our eyes are on you.",
  },
  {
    read: { text: "They sang to one another in praising and giving thanks to the LORD, “For he is good, for his loving kindness endures forever toward Israel.” All the people shouted with a great shout, when they praised the LORD, because the foundation of the LORD’s house had been laid.", ref: "Ezra 3:11" },
    reflection:
      "They sang one to another in praising and giving thanks to the LORD, 'For he is good, for his loving kindness endures forever toward Israel.' Praise at a smaller temple's foundation.",
    talk: "Can you praise for something smaller than you hoped for?",
    pray: "Lord, you are good and your love endures. We praise you for what is.",
  },
  {
    read: { text: "When I heard these words, I sat down and wept, and mourned several days; and I fasted and prayed before the God of heaven,", ref: "Nehemiah 1:4" },
    reflection:
      "When I heard these words, I sat down and wept, and mourned several days; and I fasted and prayed. Before any plan, grief and prayer.",
    talk: "What do you do first with bad news?",
    pray: "Lord, let our first response to trouble be prayer.",
  },
  {
    read: { text: "Go, gather together all the Jews who are present in Susa, and fast for me, and neither eat nor drink three days, night or day. I and my maidens will also fast the same way. Then I will go in to the king, which is against the law; and if I perish, I perish.", ref: "Esther 4:16" },
    reflection:
      "If I perish, I perish. Courage without confidence about the outcome. Willingness to lose.",
    talk: "What would you do if you were willing to lose?",
    pray: "Lord, make us willing to obey without knowing how it ends.",
  },
  {
    read: { text: "who does great things that can’t be fathomed, marvelous things without number;", ref: "Job 5:9" },
    reflection:
      "He does great things that can't be fathomed; marvellous things without number. Some of what God does will never be explained to us.",
    talk: "What do you want explained? Can you live without the explanation?",
    pray: "Lord, you do great things beyond searching out. We trust you.",
  },
  {
    read: { text: "Behold, he will kill me. I have no hope. Nevertheless, I will maintain my ways before him.", ref: "Job 13:15" },
    reflection:
      "Behold, he will kill me. I have no hope. Nevertheless, I will maintain my ways before him. Faith that is not cheerful, and is still faith.",
    talk: "Is faith without hopefulness still faith? What does Job suggest?",
    pray: "Lord, even if you slay us, we will hold to you.",
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
    read: { text: "Strengthen the weak hands, and make the feeble knees firm. Tell those who have a fearful heart, “Be strong! Don’t be afraid! Behold, your God will come with vengeance, God’s retribution. He will come and save you.", ref: "Isaiah 35:3-4" },
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
    read: { text: "For the high and lofty One who inhabits eternity, whose name is Holy, says: “I dwell in the high and holy place, with him also who is of a contrite and humble spirit, to revive the spirit of the humble, and to revive the heart of the contrite.", ref: "Isaiah 57:15" },
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
    read: { text: "the LORD appeared of old to me, saying, “Yes, I have loved you with an everlasting love. Therefore I have drawn you with loving kindness.", ref: "Jeremiah 31:3" },
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
    read: { text: "He said to me, “Son of man, can these bones live?” I answered, “Lord the LORD, you know.", ref: "Ezekiel 37:3" },
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
    read: { text: "Jesus sat down opposite the treasury, and saw how the multitude cast money into the treasury. Many who were rich cast in much. A poor widow came, and she cast in two small brass coins, which equal a quadrans coin. He called his disciples to himself, and said to them, “Most certainly I tell you, this poor widow gave more than all those who are giving into the treasury, for they all gave out of their abundance, but she, out of her poverty, gave all that she had to live on.", ref: "Mark 12:41-44" },
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
    read: { text: "Jesus answered her, “Martha, Martha, you are anxious and troubled about many things, but one thing is needed. Mary has chosen the good part, which will not be taken away from her.", ref: "Luke 10:41-42" },
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
    read: { text: "They said to one another, “Weren’t our hearts burning within us, while he spoke to us along the way, and while he opened the Scriptures to us?", ref: "Luke 24:32" },
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
    read: { text: "Again, therefore, Jesus spoke to them, saying, “I am the light of the world. He who follows me will not walk in the darkness, but will have the light of life.", ref: "John 8:12" },
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
    read: { text: "Then he said to Thomas, “Reach here your finger, and see my hands. Reach here your hand, and put it into my side. Don’t be unbelieving, but believing.” Thomas answered him, “My Lord and my God!", ref: "John 20:27-28" },
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
    read: { text: "But as it is written, “Things which an eye didn’t see, and an ear didn’t hear, which didn’t enter into the heart of man, these God has prepared for those who love him.", ref: "1 Corinthians 2:9" },
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
    read: { text: "When I saw him, I fell at his feet like a dead man. He laid his right hand on me, saying, “Don’t be afraid. I am the first and the last, and the Living one. I was dead, and behold, I am alive forever and ever. Amen. I have the keys of Death and of Hades.", ref: "Revelation 1:17-18" },
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
    read: { text: "They sang a new song, saying, “You are worthy to take the book and to open its seals: for you were killed, and bought us for God with your blood out of every tribe, language, people, and nation,", ref: "Revelation 5:9" },
    reflection:
      "You are worthy... for you were killed, and bought us for God with your blood out of every tribe, language, people, and nation. Heaven's song, about the cross and every nation.",
    talk: "Does your church's worship sound like this song?",
    pray: "Worthy is the Lamb who was slain, who ransomed people from every nation.",
  },
  {
    read: { text: "I heard a loud voice out of heaven saying, “Behold, God’s dwelling is with people, and he will dwell with them, and they will be his people, and God himself will be with them as their God.", ref: "Revelation 21:3" },
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
    read: { text: "Behold, the days come,” says the Lord the LORD, “that I will send a famine in the land, not a famine of bread, nor a thirst for water, but of hearing the LORD’s words.", ref: "Amos 8:11" },
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
    read: { text: "So let all your enemies perish, the LORD, but let those who love him be as the sun when it rises in its strength.” Then the land had rest forty years.", ref: "Judges 5:31" },
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
    read: { text: "Daniel answered, “Blessed be the name of God forever and ever; for wisdom and might are his. He changes the times and the seasons. He removes kings, and sets up kings. He gives wisdom to the wise, and knowledge to those who have understanding.", ref: "Daniel 2:20-21" },
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
    read: { text: "He answered and spoke to those who stood before him, saying, “Take the filthy garments off him.” To him he said, “Behold, I have caused your iniquity to pass from you, and I will clothe you with rich clothing.", ref: "Zechariah 3:4" },
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
    read: { text: "I sent messengers to them, saying, “I am doing a great work, so that I can’t come down. Why should the work cease, while I leave it, and come down to you?", ref: "Nehemiah 6:3" },
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
    read: { text: "It will happen at that time, that I will search Jerusalem with lamps, and I will punish the men who are settled on their dregs, who say in their heart, “the LORD will not do good, neither will he do evil.", ref: "Zephaniah 1:12" },
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
    read: { text: "Joshua said to the people, “Sanctify yourselves; for tomorrow the LORD will do wonders among you.", ref: "Joshua 3:5" },
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
    read: { text: "David said to him, “Don’t be afraid; for I will surely show you kindness for Jonathan your father’s sake, and will restore to you all the land of Saul your father. You will eat bread at my table continually.", ref: "2 Samuel 9:7" },
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
    read: { text: "Turn back, and tell Hezekiah the prince of my people, ‘the LORD, the God of David your father, says, “I have heard your prayer. I have seen your tears. Behold, I will heal you. On the third day, you will go up to the LORD’s house.", ref: "2 Kings 20:5" },
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
