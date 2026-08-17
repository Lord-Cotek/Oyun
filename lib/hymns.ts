/**
 * The hymnal — a rotating set of historic, theologically rich hymns for family
 * worship. Every text here is in the public domain (all authored well before
 * 1928), so the full verses can be kept in-app and sung offline at the table.
 *
 * Each hymn carries a memorable `line` (shown in the compact card), the
 * `author` and year, and the full `lyrics` as an array of stanzas — a refrain
 * is included as its own stanza where the hymn has one.
 *
 * `hymnaryUrl` returns a reliable Hymnary.org link (words, tunes, recordings)
 * for a "Listen / full history" link out.
 */
export interface Hymn {
  title: string;
  line: string;
  author: string;
  lyrics: string[];
}

/** A dependable Hymnary.org search link for a hymn. */
export function hymnaryUrl(title: string): string {
  return `https://hymnary.org/search?qu=${encodeURIComponent(title)}`;
}

export const HYMNS: Hymn[] = [
  {
    title: "Great Is Thy Faithfulness",
    line: "Morning by morning new mercies I see.",
    author: "Thomas O. Chisholm, 1923",
    lyrics: [
      "Great is Thy faithfulness, O God my Father;\nThere is no shadow of turning with Thee;\nThou changest not, Thy compassions, they fail not;\nAs Thou hast been Thou forever wilt be.",
      "Refrain:\nGreat is Thy faithfulness! Great is Thy faithfulness!\nMorning by morning new mercies I see;\nAll I have needed Thy hand hath provided—\nGreat is Thy faithfulness, Lord, unto me!",
      "Summer and winter, and springtime and harvest,\nSun, moon and stars in their courses above,\nJoin with all nature in manifold witness\nTo Thy great faithfulness, mercy and love.",
      "Pardon for sin and a peace that endureth,\nThine own dear presence to cheer and to guide;\nStrength for today and bright hope for tomorrow,\nBlessings all mine, with ten thousand beside!",
    ],
  },
  {
    title: "Come Thou Fount of Every Blessing",
    line: "Streams of mercy, never ceasing, call for songs of loudest praise.",
    author: "Robert Robinson, 1758",
    lyrics: [
      "Come, Thou Fount of every blessing,\nTune my heart to sing Thy grace;\nStreams of mercy, never ceasing,\nCall for songs of loudest praise.\nTeach me some melodious sonnet,\nSung by flaming tongues above;\nPraise the mount! I'm fixed upon it,\nMount of Thy redeeming love.",
      "Here I raise mine Ebenezer;\nHither by Thy help I'm come;\nAnd I hope, by Thy good pleasure,\nSafely to arrive at home.\nJesus sought me when a stranger,\nWandering from the fold of God;\nHe, to rescue me from danger,\nInterposed His precious blood.",
      "O to grace how great a debtor\nDaily I'm constrained to be!\nLet Thy goodness, like a fetter,\nBind my wandering heart to Thee:\nProne to wander, Lord, I feel it,\nProne to leave the God I love;\nHere's my heart, O take and seal it;\nSeal it for Thy courts above.",
    ],
  },
  {
    title: "It Is Well with My Soul",
    line: "Whatever my lot, Thou hast taught me to say, it is well with my soul.",
    author: "Horatio G. Spafford, 1873",
    lyrics: [
      "When peace, like a river, attendeth my way,\nWhen sorrows like sea billows roll;\nWhatever my lot, Thou hast taught me to say,\nIt is well, it is well with my soul.",
      "Refrain:\nIt is well with my soul,\nIt is well, it is well with my soul.",
      "Though Satan should buffet, though trials should come,\nLet this blest assurance control,\nThat Christ hath regarded my helpless estate,\nAnd hath shed His own blood for my soul.",
      "My sin—oh, the bliss of this glorious thought!—\nMy sin, not in part but the whole,\nIs nailed to the cross, and I bear it no more,\nPraise the Lord, praise the Lord, O my soul!",
      "And Lord, haste the day when my faith shall be sight,\nThe clouds be rolled back as a scroll;\nThe trump shall resound, and the Lord shall descend,\nEven so, it is well with my soul.",
    ],
  },
  {
    title: "Be Thou My Vision",
    line: "Thou my best thought, by day or by night.",
    author: "Ancient Irish; tr. Mary E. Byrne, 1905; versified Eleanor H. Hull, 1912",
    lyrics: [
      "Be Thou my Vision, O Lord of my heart;\nNaught be all else to me, save that Thou art—\nThou my best thought, by day or by night,\nWaking or sleeping, Thy presence my light.",
      "Be Thou my Wisdom, and Thou my true Word;\nI ever with Thee and Thou with me, Lord;\nThou my great Father, I Thy true son;\nThou in me dwelling, and I with Thee one.",
      "Riches I heed not, nor man's empty praise,\nThou mine inheritance, now and always:\nThou and Thou only, first in my heart,\nHigh King of heaven, my treasure Thou art.",
      "High King of heaven, my victory won,\nMay I reach heaven's joys, O bright heaven's Sun!\nHeart of my own heart, whatever befall,\nStill be my Vision, O Ruler of all.",
    ],
  },
  {
    title: "How Firm a Foundation",
    line: "How firm a foundation, ye saints of the Lord, is laid for your faith in His excellent Word.",
    author: "'K' in Rippon's Selection, 1787",
    lyrics: [
      "How firm a foundation, ye saints of the Lord,\nIs laid for your faith in His excellent Word!\nWhat more can He say than to you He hath said,\nTo you who for refuge to Jesus have fled?",
      "\"Fear not, I am with thee, O be not dismayed,\nFor I am thy God and will still give thee aid;\nI'll strengthen thee, help thee, and cause thee to stand,\nUpheld by My righteous, omnipotent hand.\"",
      "\"When through the deep waters I call thee to go,\nThe rivers of sorrow shall not overflow;\nFor I will be with thee, thy troubles to bless,\nAnd sanctify to thee thy deepest distress.\"",
      "\"The soul that on Jesus hath leaned for repose,\nI will not, I will not desert to his foes;\nThat soul, though all hell should endeavor to shake,\nI'll never, no never, no never forsake.\"",
    ],
  },
  {
    title: "The Lord's My Shepherd",
    line: "He makes me down to lie in pastures green; He leadeth me the quiet waters by.",
    author: "Scottish Psalter, 1650 (Psalm 23)",
    lyrics: [
      "The Lord's my Shepherd, I'll not want;\nHe makes me down to lie\nIn pastures green; He leadeth me\nThe quiet waters by.",
      "My soul He doth restore again,\nAnd me to walk doth make\nWithin the paths of righteousness,\nE'en for His own name's sake.",
      "Yea, though I walk in death's dark vale,\nYet will I fear none ill;\nFor Thou art with me, and Thy rod\nAnd staff me comfort still.",
      "Goodness and mercy all my life\nShall surely follow me;\nAnd in God's house forevermore\nMy dwelling place shall be.",
    ],
  },
  {
    title: "O Worship the King",
    line: "O worship the King, all glorious above, and gratefully sing His wonderful love.",
    author: "Robert Grant, 1833",
    lyrics: [
      "O worship the King, all glorious above,\nO gratefully sing His power and His love;\nOur Shield and Defender, the Ancient of Days,\nPavilioned in splendor, and girded with praise.",
      "O tell of His might, O sing of His grace,\nWhose robe is the light, whose canopy space.\nHis chariots of wrath the deep thunderclouds form,\nAnd dark is His path on the wings of the storm.",
      "Thy bountiful care, what tongue can recite?\nIt breathes in the air, it shines in the light;\nIt streams from the hills, it descends to the plain,\nAnd sweetly distills in the dew and the rain.",
      "O measureless Might! Ineffable Love!\nWhile angels delight to hymn Thee above,\nThe humbler creation, though feeble their lays,\nWith true adoration shall lisp to Thy praise.",
    ],
  },
  {
    title: "Jesus Loves Me",
    line: "Jesus loves me, this I know, for the Bible tells me so.",
    author: "Anna B. Warner, 1860",
    lyrics: [
      "Jesus loves me! this I know,\nFor the Bible tells me so;\nLittle ones to Him belong,\nThey are weak, but He is strong.",
      "Refrain:\nYes, Jesus loves me! Yes, Jesus loves me!\nYes, Jesus loves me! The Bible tells me so.",
      "Jesus loves me! He who died\nHeaven's gate to open wide;\nHe will wash away my sin,\nLet His little child come in.",
      "Jesus loves me! He will stay\nClose beside me all the way;\nThou hast bled and died for me,\nI will henceforth live for Thee.",
    ],
  },
  {
    title: "Praise to the Lord, the Almighty",
    line: "Praise to the Lord, the Almighty, the King of creation!",
    author: "Joachim Neander, 1680; tr. Catherine Winkworth, 1863",
    lyrics: [
      "Praise to the Lord, the Almighty, the King of creation!\nO my soul, praise Him, for He is thy health and salvation!\nAll ye who hear, now to His temple draw near;\nJoin me in glad adoration!",
      "Praise to the Lord, who o'er all things so wondrously reigneth,\nShelters thee under His wings, yea, so gently sustaineth!\nHast thou not seen how thy desires e'er have been\nGranted in what He ordaineth?",
      "Praise to the Lord, who doth prosper thy work and defend thee;\nSurely His goodness and mercy here daily attend thee.\nPonder anew what the Almighty can do,\nIf with His love He befriend thee.",
      "Praise to the Lord! O let all that is in me adore Him!\nAll that hath life and breath, come now with praises before Him!\nLet the Amen sound from His people again;\nGladly for aye we adore Him.",
    ],
  },
  {
    title: "Abide with Me",
    line: "Help of the helpless, O abide with me.",
    author: "Henry F. Lyte, 1847",
    lyrics: [
      "Abide with me: fast falls the eventide;\nThe darkness deepens; Lord, with me abide;\nWhen other helpers fail and comforts flee,\nHelp of the helpless, O abide with me.",
      "Swift to its close ebbs out life's little day;\nEarth's joys grow dim, its glories pass away;\nChange and decay in all around I see;\nO Thou who changest not, abide with me.",
      "I need Thy presence every passing hour;\nWhat but Thy grace can foil the tempter's power?\nWho, like Thyself, my guide and stay can be?\nThrough cloud and sunshine, O abide with me.",
      "Hold Thou Thy cross before my closing eyes;\nShine through the gloom and point me to the skies;\nHeaven's morning breaks, and earth's vain shadows flee;\nIn life, in death, O Lord, abide with me.",
    ],
  },
  {
    title: "My Hope Is Built on Nothing Less",
    line: "On Christ the solid Rock I stand; all other ground is sinking sand.",
    author: "Edward Mote, 1834",
    lyrics: [
      "My hope is built on nothing less\nThan Jesus' blood and righteousness;\nI dare not trust the sweetest frame,\nBut wholly lean on Jesus' name.",
      "Refrain:\nOn Christ, the solid Rock, I stand;\nAll other ground is sinking sand,\nAll other ground is sinking sand.",
      "When darkness veils His lovely face,\nI rest on His unchanging grace;\nIn every high and stormy gale,\nMy anchor holds within the veil.",
      "His oath, His covenant, His blood\nSupport me in the whelming flood;\nWhen all around my soul gives way,\nHe then is all my hope and stay.",
      "When He shall come with trumpet sound,\nO may I then in Him be found!\nDressed in His righteousness alone,\nFaultless to stand before the throne.",
    ],
  },
  {
    title: "Guide Me, O Thou Great Jehovah",
    line: "Bread of heaven, feed me till I want no more.",
    author: "William Williams, 1745; tr. Peter Williams, 1771",
    lyrics: [
      "Guide me, O Thou great Jehovah,\nPilgrim through this barren land;\nI am weak, but Thou art mighty;\nHold me with Thy powerful hand;\nBread of heaven, Bread of heaven,\nFeed me till I want no more,\nFeed me till I want no more.",
      "Open now the crystal fountain,\nWhence the healing stream doth flow;\nLet the fire and cloudy pillar\nLead me all my journey through;\nStrong Deliverer, strong Deliverer,\nBe Thou still my strength and shield,\nBe Thou still my strength and shield.",
      "When I tread the verge of Jordan,\nBid my anxious fears subside;\nDeath of death, and hell's destruction,\nLand me safe on Canaan's side;\nSongs of praises, songs of praises\nI will ever give to Thee,\nI will ever give to Thee.",
    ],
  },
  {
    title: "Before the Throne of God Above",
    line: "Because the sinless Savior died, my sinful soul is counted free.",
    author: "Charitie Lees Bancroft, 1863",
    lyrics: [
      "Before the throne of God above\nI have a strong and perfect plea,\nA great High Priest whose name is Love,\nWho ever lives and pleads for me.\nMy name is graven on His hands,\nMy name is written on His heart;\nI know that while in heaven He stands\nNo tongue can bid me thence depart.",
      "When Satan tempts me to despair,\nAnd tells me of the guilt within,\nUpward I look and see Him there\nWho made an end of all my sin.\nBecause the sinless Savior died,\nMy sinful soul is counted free;\nFor God the Just is satisfied\nTo look on Him and pardon me.",
      "Behold Him there, the risen Lamb,\nMy perfect, spotless righteousness,\nThe great unchangeable I AM,\nThe King of glory and of grace!\nOne with Himself, I cannot die;\nMy soul is purchased by His blood;\nMy life is hid with Christ on high,\nWith Christ, my Savior and my God.",
    ],
  },
  {
    title: "Crown Him with Many Crowns",
    line: "Crown Him the Lord of life, who triumphed o'er the grave.",
    author: "Matthew Bridges, 1851; Godfrey Thring, 1874",
    lyrics: [
      "Crown Him with many crowns,\nThe Lamb upon His throne;\nHark! how the heavenly anthem drowns\nAll music but its own!\nAwake, my soul, and sing\nOf Him who died for thee,\nAnd hail Him as thy matchless King\nThrough all eternity.",
      "Crown Him the Lord of life,\nWho triumphed o'er the grave,\nAnd rose victorious in the strife\nFor those He came to save;\nHis glories now we sing,\nWho died, and rose on high,\nWho died eternal life to bring,\nAnd lives that death may die.",
      "Crown Him the Lord of love;\nBehold His hands and side,\nRich wounds, yet visible above,\nIn beauty glorified;\nAll hail, Redeemer, hail!\nFor Thou hast died for me;\nThy praise and glory shall not fail\nThroughout eternity.",
    ],
  },
  {
    title: "And Can It Be",
    line: "Amazing love! how can it be that Thou, my God, shouldst die for me?",
    author: "Charles Wesley, 1738",
    lyrics: [
      "And can it be that I should gain\nAn interest in the Savior's blood?\nDied He for me, who caused His pain?\nFor me, who Him to death pursued?\nAmazing love! how can it be\nThat Thou, my God, shouldst die for me?",
      "He left His Father's throne above,\nSo free, so infinite His grace;\nEmptied Himself of all but love,\nAnd bled for Adam's helpless race;\n'Tis mercy all, immense and free;\nFor, O my God, it found out me.",
      "Long my imprisoned spirit lay\nFast bound in sin and nature's night;\nThine eye diffused a quickening ray,\nI woke, the dungeon flamed with light;\nMy chains fell off, my heart was free,\nI rose, went forth, and followed Thee.",
      "No condemnation now I dread;\nJesus, and all in Him, is mine!\nAlive in Him, my living Head,\nAnd clothed in righteousness divine,\nBold I approach the eternal throne,\nAnd claim the crown, through Christ my own.",
    ],
  },
  {
    title: "Holy, Holy, Holy",
    line: "Holy, holy, holy! Lord God Almighty!",
    author: "Reginald Heber, 1826",
    lyrics: [
      "Holy, holy, holy! Lord God Almighty!\nEarly in the morning our song shall rise to Thee;\nHoly, holy, holy! merciful and mighty!\nGod in three Persons, blessed Trinity!",
      "Holy, holy, holy! all the saints adore Thee,\nCasting down their golden crowns around the glassy sea;\nCherubim and seraphim falling down before Thee,\nWhich wert, and art, and evermore shalt be.",
      "Holy, holy, holy! though the darkness hide Thee,\nThough the eye of sinful man Thy glory may not see,\nOnly Thou art holy; there is none beside Thee,\nPerfect in power, in love, and purity.",
      "Holy, holy, holy! Lord God Almighty!\nAll Thy works shall praise Thy name, in earth, and sky, and sea;\nHoly, holy, holy! merciful and mighty!\nGod in three Persons, blessed Trinity!",
    ],
  },
  {
    title: "All Creatures of Our God and King",
    line: "O praise Him, O praise Him, Alleluia, Alleluia!",
    author: "Francis of Assisi, c.1225; tr. William H. Draper, 1919",
    lyrics: [
      "All creatures of our God and King,\nLift up your voice and with us sing,\nAlleluia! Alleluia!\nThou burning sun with golden beam,\nThou silver moon with softer gleam,\nO praise Him, O praise Him,\nAlleluia! Alleluia! Alleluia!",
      "Let all things their Creator bless,\nAnd worship Him in humbleness,\nO praise Him, Alleluia!\nPraise, praise the Father, praise the Son,\nAnd praise the Spirit, three in One,\nO praise Him, O praise Him,\nAlleluia! Alleluia! Alleluia!",
    ],
  },
  {
    title: "A Mighty Fortress Is Our God",
    line: "A mighty fortress is our God, a bulwark never failing.",
    author: "Martin Luther, 1529; tr. Frederick H. Hedge, 1853",
    lyrics: [
      "A mighty fortress is our God,\nA bulwark never failing;\nOur helper He, amid the flood\nOf mortal ills prevailing.\nFor still our ancient foe\nDoth seek to work us woe;\nHis craft and power are great,\nAnd, armed with cruel hate,\nOn earth is not his equal.",
      "Did we in our own strength confide,\nOur striving would be losing,\nWere not the right Man on our side,\nThe Man of God's own choosing.\nDost ask who that may be?\nChrist Jesus, it is He;\nLord Sabaoth His name,\nFrom age to age the same,\nAnd He must win the battle.",
      "And though this world, with devils filled,\nShould threaten to undo us,\nWe will not fear, for God hath willed\nHis truth to triumph through us.\nThe prince of darkness grim,\nWe tremble not for him;\nHis rage we can endure,\nFor lo, his doom is sure;\nOne little word shall fell him.",
      "That word above all earthly powers,\nNo thanks to them, abideth;\nThe Spirit and the gifts are ours\nThrough Him who with us sideth.\nLet goods and kindred go,\nThis mortal life also;\nThe body they may kill:\nGod's truth abideth still,\nHis kingdom is forever.",
    ],
  },
  {
    title: "Amazing Grace",
    line: "Amazing grace! how sweet the sound, that saved a wretch like me!",
    author: "John Newton, 1779",
    lyrics: [
      "Amazing grace! how sweet the sound,\nThat saved a wretch like me!\nI once was lost, but now am found,\nWas blind, but now I see.",
      "'Twas grace that taught my heart to fear,\nAnd grace my fears relieved;\nHow precious did that grace appear\nThe hour I first believed!",
      "Through many dangers, toils, and snares,\nI have already come;\n'Tis grace hath brought me safe thus far,\nAnd grace will lead me home.",
      "The Lord has promised good to me,\nHis word my hope secures;\nHe will my shield and portion be\nAs long as life endures.",
      "When we've been there ten thousand years,\nBright shining as the sun,\nWe've no less days to sing God's praise\nThan when we'd first begun.",
    ],
  },
  {
    title: "When I Survey the Wondrous Cross",
    line: "Love so amazing, so divine, demands my soul, my life, my all.",
    author: "Isaac Watts, 1707",
    lyrics: [
      "When I survey the wondrous cross\nOn which the Prince of glory died,\nMy richest gain I count but loss,\nAnd pour contempt on all my pride.",
      "Forbid it, Lord, that I should boast,\nSave in the death of Christ my God!\nAll the vain things that charm me most,\nI sacrifice them to His blood.",
      "See, from His head, His hands, His feet,\nSorrow and love flow mingled down!\nDid e'er such love and sorrow meet,\nOr thorns compose so rich a crown?",
      "Were the whole realm of nature mine,\nThat were a present far too small;\nLove so amazing, so divine,\nDemands my soul, my life, my all.",
    ],
  },
  {
    title: "O for a Thousand Tongues to Sing",
    line: "My great Redeemer's praise, the glories of my God and King.",
    author: "Charles Wesley, 1739",
    lyrics: [
      "O for a thousand tongues to sing\nMy great Redeemer's praise,\nThe glories of my God and King,\nThe triumphs of His grace!",
      "My gracious Master and my God,\nAssist me to proclaim,\nTo spread through all the earth abroad\nThe honors of Thy name.",
      "Jesus! the name that charms our fears,\nThat bids our sorrows cease;\n'Tis music in the sinner's ears,\n'Tis life, and health, and peace.",
      "He breaks the power of canceled sin,\nHe sets the prisoner free;\nHis blood can make the foulest clean,\nHis blood availed for me.",
    ],
  },
  {
    title: "Rock of Ages",
    line: "Rock of Ages, cleft for me, let me hide myself in Thee.",
    author: "Augustus M. Toplady, 1763",
    lyrics: [
      "Rock of Ages, cleft for me,\nLet me hide myself in Thee;\nLet the water and the blood,\nFrom Thy wounded side which flowed,\nBe of sin the double cure,\nSave from wrath and make me pure.",
      "Not the labors of my hands\nCan fulfill Thy law's demands;\nCould my zeal no respite know,\nCould my tears forever flow,\nAll for sin could not atone;\nThou must save, and Thou alone.",
      "Nothing in my hand I bring,\nSimply to Thy cross I cling;\nNaked, come to Thee for dress;\nHelpless, look to Thee for grace;\nFoul, I to the fountain fly;\nWash me, Savior, or I die.",
      "While I draw this fleeting breath,\nWhen my eyes shall close in death,\nWhen I soar to worlds unknown,\nSee Thee on Thy judgment throne,\nRock of Ages, cleft for me,\nLet me hide myself in Thee.",
    ],
  },
  {
    title: "Immortal, Invisible, God Only Wise",
    line: "In light inaccessible hid from our eyes.",
    author: "Walter Chalmers Smith, 1867",
    lyrics: [
      "Immortal, invisible, God only wise,\nIn light inaccessible hid from our eyes,\nMost blessed, most glorious, the Ancient of Days,\nAlmighty, victorious, Thy great name we praise.",
      "Unresting, unhasting, and silent as light,\nNor wanting, nor wasting, Thou rulest in might;\nThy justice like mountains high soaring above\nThy clouds, which are fountains of goodness and love.",
      "To all life Thou givest—to both great and small;\nIn all life Thou livest, the true life of all;\nWe blossom and flourish as leaves on the tree,\nAnd wither and perish—but naught changeth Thee.",
      "Great Father of glory, pure Father of light,\nThine angels adore Thee, all veiling their sight;\nAll laud we would render: O help us to see\n'Tis only the splendor of light hideth Thee.",
    ],
  },
  {
    title: "Praise, My Soul, the King of Heaven",
    line: "Praise Him! Praise Him! Praise the everlasting King.",
    author: "Henry F. Lyte, 1834",
    lyrics: [
      "Praise, my soul, the King of heaven;\nTo His feet thy tribute bring;\nRansomed, healed, restored, forgiven,\nEvermore His praises sing:\nAlleluia! Alleluia!\nPraise the everlasting King.",
      "Praise Him for His grace and favor\nTo our fathers in distress;\nPraise Him still the same forever,\nSlow to chide, and swift to bless:\nAlleluia! Alleluia!\nGlorious in His faithfulness.",
      "Father-like, He tends and spares us;\nWell our feeble frame He knows;\nIn His hands He gently bears us,\nRescues us from all our foes:\nAlleluia! Alleluia!\nWidely as His mercy flows.",
      "Angels, help us to adore Him;\nYe behold Him face to face;\nSun and moon, bow down before Him,\nDwellers all in time and space:\nAlleluia! Alleluia!\nPraise with us the God of grace.",
    ],
  },
  {
    title: "Love Divine, All Loves Excelling",
    line: "Joy of heaven, to earth come down.",
    author: "Charles Wesley, 1747",
    lyrics: [
      "Love divine, all loves excelling,\nJoy of heaven, to earth come down;\nFix in us Thy humble dwelling,\nAll Thy faithful mercies crown!\nJesus, Thou art all compassion,\nPure, unbounded love Thou art;\nVisit us with Thy salvation,\nEnter every trembling heart.",
      "Breathe, O breathe Thy loving Spirit\nInto every troubled breast!\nLet us all in Thee inherit,\nLet us find that second rest.\nTake away our bent to sinning;\nAlpha and Omega be;\nEnd of faith, as its beginning,\nSet our hearts at liberty.",
      "Finish then Thy new creation;\nPure and spotless let us be;\nLet us see Thy great salvation\nPerfectly restored in Thee:\nChanged from glory into glory,\nTill in heaven we take our place,\nTill we cast our crowns before Thee,\nLost in wonder, love, and praise.",
    ],
  },
  {
    title: "What a Friend We Have in Jesus",
    line: "All our sins and griefs to bear!",
    author: "Joseph M. Scriven, 1855",
    lyrics: [
      "What a Friend we have in Jesus,\nAll our sins and griefs to bear!\nWhat a privilege to carry\nEverything to God in prayer!\nO what peace we often forfeit,\nO what needless pain we bear,\nAll because we do not carry\nEverything to God in prayer!",
      "Have we trials and temptations?\nIs there trouble anywhere?\nWe should never be discouraged;\nTake it to the Lord in prayer.\nCan we find a friend so faithful\nWho will all our sorrows share?\nJesus knows our every weakness;\nTake it to the Lord in prayer.",
      "Are we weak and heavy-laden,\nCumbered with a load of care?\nPrecious Savior, still our refuge—\nTake it to the Lord in prayer.\nDo thy friends despise, forsake thee?\nTake it to the Lord in prayer;\nIn His arms He'll take and shield thee,\nThou wilt find a solace there.",
    ],
  },
  {
    title: "Blessed Assurance",
    line: "Jesus is mine! O what a foretaste of glory divine!",
    author: "Fanny J. Crosby, 1873",
    lyrics: [
      "Blessed assurance, Jesus is mine!\nO what a foretaste of glory divine!\nHeir of salvation, purchase of God,\nBorn of His Spirit, washed in His blood.",
      "Refrain:\nThis is my story, this is my song,\nPraising my Savior all the day long;\nThis is my story, this is my song,\nPraising my Savior all the day long.",
      "Perfect submission, perfect delight,\nVisions of rapture now burst on my sight;\nAngels descending bring from above\nEchoes of mercy, whispers of love.",
      "Perfect submission, all is at rest,\nI in my Savior am happy and blest;\nWatching and waiting, looking above,\nFilled with His goodness, lost in His love.",
    ],
  },
  {
    title: "To God Be the Glory",
    line: "Great things He hath done!",
    author: "Fanny J. Crosby, 1875",
    lyrics: [
      "To God be the glory, great things He hath done!\nSo loved He the world that He gave us His Son,\nWho yielded His life an atonement for sin,\nAnd opened the life-gate that all may go in.",
      "Refrain:\nPraise the Lord, praise the Lord, let the earth hear His voice!\nPraise the Lord, praise the Lord, let the people rejoice!\nO come to the Father, through Jesus the Son,\nAnd give Him the glory, great things He hath done!",
      "O perfect redemption, the purchase of blood,\nTo every believer the promise of God;\nThe vilest offender who truly believes,\nThat moment from Jesus a pardon receives.",
      "Great things He hath taught us, great things He hath done,\nAnd great our rejoicing through Jesus the Son;\nBut purer, and higher, and greater will be\nOur wonder, our transport, when Jesus we see.",
    ],
  },
  {
    title: "My Faith Looks Up to Thee",
    line: "Savior divine! Now hear me while I pray.",
    author: "Ray Palmer, 1830",
    lyrics: [
      "My faith looks up to Thee,\nThou Lamb of Calvary,\nSavior divine!\nNow hear me while I pray,\nTake all my guilt away,\nO let me from this day\nBe wholly Thine!",
      "May Thy rich grace impart\nStrength to my fainting heart,\nMy zeal inspire;\nAs Thou hast died for me,\nO may my love to Thee\nPure, warm, and changeless be,\nA living fire!",
      "While life's dark maze I tread,\nAnd griefs around me spread,\nBe Thou my guide;\nBid darkness turn to day,\nWipe sorrow's tears away,\nNor let me ever stray\nFrom Thee aside.",
    ],
  },
  {
    title: "There Is a Fountain Filled with Blood",
    line: "And sinners plunged beneath that flood lose all their guilty stains.",
    author: "William Cowper, 1772",
    lyrics: [
      "There is a fountain filled with blood\nDrawn from Immanuel's veins;\nAnd sinners plunged beneath that flood\nLose all their guilty stains.",
      "The dying thief rejoiced to see\nThat fountain in his day;\nAnd there may I, though vile as he,\nWash all my sins away.",
      "Dear dying Lamb, Thy precious blood\nShall never lose its power,\nTill all the ransomed church of God\nBe saved, to sin no more.",
      "E'er since, by faith, I saw the stream\nThy flowing wounds supply,\nRedeeming love has been my theme,\nAnd shall be till I die.",
    ],
  },
  {
    title: "All Hail the Power of Jesus' Name",
    line: "Bring forth the royal diadem, and crown Him Lord of all.",
    author: "Edward Perronet, 1780",
    lyrics: [
      "All hail the power of Jesus' name!\nLet angels prostrate fall;\nBring forth the royal diadem,\nAnd crown Him Lord of all!\nBring forth the royal diadem,\nAnd crown Him Lord of all!",
      "Ye chosen seed of Israel's race,\nYe ransomed from the fall,\nHail Him who saves you by His grace,\nAnd crown Him Lord of all!\nHail Him who saves you by His grace,\nAnd crown Him Lord of all!",
      "Let every kindred, every tribe,\nOn this terrestrial ball,\nTo Him all majesty ascribe,\nAnd crown Him Lord of all!\nTo Him all majesty ascribe,\nAnd crown Him Lord of all!",
      "O that with yonder sacred throng\nWe at His feet may fall!\nWe'll join the everlasting song,\nAnd crown Him Lord of all!\nWe'll join the everlasting song,\nAnd crown Him Lord of all!",
    ],
  },
  {
    title: "Come, Ye Thankful People, Come",
    line: "Raise the song of harvest home!",
    author: "Henry Alford, 1844",
    lyrics: [
      "Come, ye thankful people, come,\nRaise the song of harvest home;\nAll is safely gathered in,\nEre the winter storms begin;\nGod, our Maker, doth provide\nFor our wants to be supplied;\nCome to God's own temple, come,\nRaise the song of harvest home.",
      "All the world is God's own field,\nFruit unto His praise to yield;\nWheat and tares together sown,\nUnto joy or sorrow grown;\nFirst the blade, and then the ear,\nThen the full corn shall appear;\nLord of harvest, grant that we\nWholesome grain and pure may be.",
      "Even so, Lord, quickly come\nTo Thy final harvest home;\nGather Thou Thy people in,\nFree from sorrow, free from sin;\nThere, forever purified,\nIn Thy presence to abide;\nCome, with all Thine angels, come,\nRaise the glorious harvest home.",
    ],
  },
  {
    title: "Joy to the World",
    line: "Let earth receive her King!",
    author: "Isaac Watts, 1719",
    lyrics: [
      "Joy to the world! the Lord is come;\nLet earth receive her King;\nLet every heart prepare Him room,\nAnd heaven and nature sing,\nAnd heaven and nature sing,\nAnd heaven, and heaven and nature sing.",
      "Joy to the earth! the Savior reigns;\nLet men their songs employ;\nWhile fields and floods, rocks, hills, and plains\nRepeat the sounding joy,\nRepeat the sounding joy,\nRepeat, repeat the sounding joy.",
      "He rules the world with truth and grace,\nAnd makes the nations prove\nThe glories of His righteousness,\nAnd wonders of His love,\nAnd wonders of His love,\nAnd wonders, wonders of His love.",
    ],
  },
  {
    title: "Hark! the Herald Angels Sing",
    line: "Glory to the newborn King!",
    author: "Charles Wesley, 1739",
    lyrics: [
      "Hark! the herald angels sing,\n\"Glory to the newborn King;\nPeace on earth, and mercy mild,\nGod and sinners reconciled!\"\nJoyful, all ye nations, rise,\nJoin the triumph of the skies;\nWith the angelic host proclaim,\n\"Christ is born in Bethlehem!\"\nHark! the herald angels sing,\n\"Glory to the newborn King!\"",
      "Christ, by highest heaven adored,\nChrist, the everlasting Lord!\nLate in time behold Him come,\nOffspring of the Virgin's womb.\nVeiled in flesh the Godhead see;\nHail the incarnate Deity,\nPleased as man with man to dwell,\nJesus, our Emmanuel.",
      "Hail the heaven-born Prince of Peace!\nHail the Sun of Righteousness!\nLight and life to all He brings,\nRisen with healing in His wings.\nMild He lays His glory by,\nBorn that man no more may die,\nBorn to raise the sons of earth,\nBorn to give them second birth.",
    ],
  },
  {
    title: "Christ the Lord Is Risen Today",
    line: "Alleluia!",
    author: "Charles Wesley, 1739",
    lyrics: [
      "Christ the Lord is risen today, Alleluia!\nSons of men and angels say, Alleluia!\nRaise your joys and triumphs high, Alleluia!\nSing, ye heavens, and earth reply, Alleluia!",
      "Love's redeeming work is done, Alleluia!\nFought the fight, the battle won, Alleluia!\nDeath in vain forbids Him rise, Alleluia!\nChrist has opened paradise, Alleluia!",
      "Lives again our glorious King, Alleluia!\nWhere, O death, is now thy sting? Alleluia!\nOnce He died our souls to save, Alleluia!\nWhere thy victory, O grave? Alleluia!",
      "Soar we now where Christ has led, Alleluia!\nFollowing our exalted Head, Alleluia!\nMade like Him, like Him we rise, Alleluia!\nOurs the cross, the grave, the skies, Alleluia!",
    ],
  },
  {
    title: "Praise God, from Whom All Blessings Flow",
    line: "Praise Him, all creatures here below.",
    author: "Thomas Ken, 1674 (the Doxology)",
    lyrics: [
      "Praise God, from whom all blessings flow;\nPraise Him, all creatures here below;\nPraise Him above, ye heavenly host;\nPraise Father, Son, and Holy Ghost. Amen.",
    ],
  },
  {
    title: "O God, Our Help in Ages Past",
    line: "Our shelter from the stormy blast, and our eternal home.",
    author: "Isaac Watts, 1719",
    lyrics: [
      "O God, our help in ages past,\nOur hope for years to come,\nOur shelter from the stormy blast,\nAnd our eternal home!",
      "Under the shadow of Thy throne\nThy saints have dwelt secure;\nSufficient is Thine arm alone,\nAnd our defense is sure.",
      "Before the hills in order stood,\nOr earth received her frame,\nFrom everlasting Thou art God,\nTo endless years the same.",
      "A thousand ages in Thy sight\nAre like an evening gone;\nShort as the watch that ends the night\nBefore the rising sun.",
      "Time, like an ever-rolling stream,\nBears all its sons away;\nThey fly forgotten, as a dream\nDies at the opening day.",
      "O God, our help in ages past,\nOur hope for years to come,\nBe Thou our guard while troubles last,\nAnd our eternal home!",
    ],
  },
  {
    title: "Now Thank We All Our God",
    line: "Who wondrous things hath done, in whom His world rejoices.",
    author: "Martin Rinkart, c.1636; tr. Catherine Winkworth, 1858",
    lyrics: [
      "Now thank we all our God\nWith heart and hands and voices,\nWho wondrous things hath done,\nIn whom His world rejoices;\nWho from our mothers' arms\nHath blessed us on our way\nWith countless gifts of love,\nAnd still is ours today.",
      "O may this bounteous God\nThrough all our life be near us,\nWith ever joyful hearts\nAnd blessed peace to cheer us;\nAnd keep us in His grace,\nAnd guide us when perplexed,\nAnd free us from all ills\nIn this world and the next.",
      "All praise and thanks to God\nThe Father now be given,\nThe Son, and Him who reigns\nWith them in highest heaven,\nThe one eternal God,\nWhom earth and heaven adore;\nFor thus it was, is now,\nAnd shall be evermore.",
    ],
  },
  {
    title: "All People That on Earth Do Dwell",
    line: "Sing to the Lord with cheerful voice.",
    author: "William Kethe, 1561 (Old Hundredth)",
    lyrics: [
      "All people that on earth do dwell,\nSing to the Lord with cheerful voice;\nHim serve with fear, His praise forth tell,\nCome ye before Him and rejoice.",
      "The Lord, ye know, is God indeed;\nWithout our aid He did us make;\nWe are His folk, He doth us feed,\nAnd for His sheep He doth us take.",
      "O enter then His gates with praise,\nApproach with joy His courts unto;\nPraise, laud, and bless His name always,\nFor it is seemly so to do.",
      "For why? the Lord our God is good,\nHis mercy is forever sure;\nHis truth at all times firmly stood,\nAnd shall from age to age endure.",
    ],
  },
  {
    title: "Take My Life and Let It Be",
    line: "Take my life, and let it be consecrated, Lord, to Thee.",
    author: "Frances R. Havergal, 1874",
    lyrics: [
      "Take my life, and let it be\nConsecrated, Lord, to Thee;\nTake my moments and my days,\nLet them flow in ceaseless praise.",
      "Take my hands, and let them move\nAt the impulse of Thy love;\nTake my feet, and let them be\nSwift and beautiful for Thee.",
      "Take my voice, and let me sing\nAlways, only, for my King;\nTake my lips, and let them be\nFilled with messages from Thee.",
      "Take my silver and my gold,\nNot a mite would I withhold;\nTake my intellect, and use\nEvery power as Thou shalt choose.",
      "Take my will, and make it Thine;\nIt shall be no longer mine;\nTake my heart, it is Thine own;\nIt shall be Thy royal throne.",
      "Take my love, my Lord, I pour\nAt Thy feet its treasure-store;\nTake myself, and I will be\nEver, only, all for Thee.",
    ],
  },
  {
    title: "Jesus Shall Reign Where'er the Sun",
    line: "His kingdom stretch from shore to shore.",
    author: "Isaac Watts, 1719",
    lyrics: [
      "Jesus shall reign where'er the sun\nDoth his successive journeys run;\nHis kingdom stretch from shore to shore,\nTill moons shall wax and wane no more.",
      "For Him shall endless prayer be made,\nAnd praises throng to crown His head;\nHis name like sweet perfume shall rise\nWith every morning sacrifice.",
      "People and realms of every tongue\nDwell on His love with sweetest song,\nAnd infant voices shall proclaim\nTheir early blessings on His name.",
      "Let every creature rise and bring\nPeculiar honors to our King;\nAngels descend with songs again,\nAnd earth repeat the loud amen.",
    ],
  },
  {
    title: "O Sacred Head, Now Wounded",
    line: "O sacred Head, now wounded, with grief and shame weighed down.",
    author: "attr. Bernard of Clairvaux; Paul Gerhardt; tr. James W. Alexander, 1830",
    lyrics: [
      "O sacred Head, now wounded,\nWith grief and shame weighed down,\nNow scornfully surrounded\nWith thorns, Thine only crown;\nHow pale Thou art with anguish,\nWith sore abuse and scorn!\nHow does that visage languish\nWhich once was bright as morn!",
      "What Thou, my Lord, hast suffered\nWas all for sinners' gain;\nMine, mine was the transgression,\nBut Thine the deadly pain.\nLo, here I fall, my Savior!\n'Tis I deserve Thy place;\nLook on me with Thy favor,\nVouchsafe to me Thy grace.",
      "What language shall I borrow\nTo thank Thee, dearest Friend,\nFor this Thy dying sorrow,\nThy pity without end?\nO make me Thine forever;\nAnd should I fainting be,\nLord, let me never, never\nOutlive my love to Thee.",
    ],
  },
  {
    title: "Man of Sorrows! What a Name",
    line: "Hallelujah! what a Savior!",
    author: "Philip P. Bliss, 1875",
    lyrics: [
      "Man of Sorrows! what a name\nFor the Son of God, who came\nRuined sinners to reclaim!\nHallelujah! what a Savior!",
      "Bearing shame and scoffing rude,\nIn my place condemned He stood;\nSealed my pardon with His blood:\nHallelujah! what a Savior!",
      "Guilty, vile, and helpless we;\nSpotless Lamb of God was He;\nFull atonement! can it be?\nHallelujah! what a Savior!",
      "Lifted up was He to die;\n\"It is finished!\" was His cry;\nNow in heaven exalted high:\nHallelujah! what a Savior!",
      "When He comes, our glorious King,\nAll His ransomed home to bring,\nThen anew this song we'll sing:\nHallelujah! what a Savior!",
    ],
  },
  {
    title: "Beneath the Cross of Jesus",
    line: "I fain would take my stand.",
    author: "Elizabeth C. Clephane, 1868",
    lyrics: [
      "Beneath the cross of Jesus\nI fain would take my stand,\nThe shadow of a mighty rock\nWithin a weary land;\nA home within the wilderness,\nA rest upon the way,\nFrom the burning of the noontide heat,\nAnd the burden of the day.",
      "Upon the cross of Jesus\nMine eye at times can see\nThe very dying form of One\nWho suffered there for me;\nAnd from my stricken heart with tears\nTwo wonders I confess,\nThe wonders of redeeming love\nAnd my own worthlessness.",
      "I take, O cross, thy shadow\nFor my abiding place;\nI ask no other sunshine than\nThe sunshine of His face;\nContent to let the world go by,\nTo know no gain nor loss,\nMy sinful self my only shame,\nMy glory all the cross.",
    ],
  },
  {
    title: "Jesus, Lover of My Soul",
    line: "Let me to Thy bosom fly.",
    author: "Charles Wesley, 1740",
    lyrics: [
      "Jesus, lover of my soul,\nLet me to Thy bosom fly,\nWhile the nearer waters roll,\nWhile the tempest still is high:\nHide me, O my Savior, hide,\nTill the storm of life is past;\nSafe into the haven guide,\nO receive my soul at last.",
      "Other refuge have I none,\nHangs my helpless soul on Thee;\nLeave, ah! leave me not alone,\nStill support and comfort me.\nAll my trust on Thee is stayed,\nAll my help from Thee I bring;\nCover my defenseless head\nWith the shadow of Thy wing.",
      "Thou, O Christ, art all I want;\nMore than all in Thee I find;\nRaise the fallen, cheer the faint,\nHeal the sick, and lead the blind.\nJust and holy is Thy name,\nI am all unrighteousness;\nFalse and full of sin I am,\nThou art full of truth and grace.",
      "Plenteous grace with Thee is found,\nGrace to cover all my sin;\nLet the healing streams abound,\nMake and keep me pure within.\nThou of life the fountain art,\nFreely let me take of Thee;\nSpring Thou up within my heart,\nRise to all eternity.",
    ],
  },
  {
    title: "Come, Thou Almighty King",
    line: "Help us Thy name to sing.",
    author: "Anonymous, c.1757",
    lyrics: [
      "Come, Thou almighty King,\nHelp us Thy name to sing,\nHelp us to praise:\nFather all glorious,\nO'er all victorious,\nCome and reign over us,\nAncient of Days.",
      "Come, Thou incarnate Word,\nGird on Thy mighty sword,\nOur prayer attend:\nCome, and Thy people bless,\nAnd give Thy word success;\nSpirit of holiness,\nOn us descend.",
      "Come, holy Comforter,\nThy sacred witness bear\nIn this glad hour:\nThou who almighty art,\nNow rule in every heart,\nAnd ne'er from us depart,\nSpirit of power.",
      "To Thee, great One in Three,\nEternal praises be,\nHence evermore;\nThy sovereign majesty\nMay we in glory see,\nAnd to eternity\nLove and adore.",
    ],
  },
  {
    title: "When Morning Gilds the Skies",
    line: "May Jesus Christ be praised!",
    author: "German, c.1800; tr. Edward Caswall, 1854",
    lyrics: [
      "When morning gilds the skies,\nMy heart awaking cries,\nMay Jesus Christ be praised!\nAlike at work and prayer\nTo Jesus I repair;\nMay Jesus Christ be praised!",
      "Does sadness fill my mind?\nA solace here I find,\nMay Jesus Christ be praised!\nOr fades my earthly bliss?\nMy comfort still is this,\nMay Jesus Christ be praised!",
      "Let earth's wide circle round\nIn joyful notes resound,\nMay Jesus Christ be praised!\nLet air and sea and sky\nFrom depth to height reply,\nMay Jesus Christ be praised!",
      "Be this, while life is mine,\nMy canticle divine,\nMay Jesus Christ be praised!\nBe this the eternal song\nThrough all the ages long,\nMay Jesus Christ be praised!",
    ],
  },
  {
    title: "I Sing the Mighty Power of God",
    line: "That made the mountains rise.",
    author: "Isaac Watts, 1715",
    lyrics: [
      "I sing the mighty power of God,\nThat made the mountains rise,\nThat spread the flowing seas abroad,\nAnd built the lofty skies.\nI sing the wisdom that ordained\nThe sun to rule the day;\nThe moon shines full at His command,\nAnd all the stars obey.",
      "I sing the goodness of the Lord,\nThat filled the earth with food;\nHe formed the creatures with His word,\nAnd then pronounced them good.\nLord, how Thy wonders are displayed,\nWhere'er I turn my eye,\nIf I survey the ground I tread,\nOr gaze upon the sky!",
      "There's not a plant or flower below,\nBut makes Thy glories known;\nAnd clouds arise, and tempests blow,\nBy order from Thy throne;\nWhile all that borrows life from Thee\nIs ever in Thy care,\nAnd everywhere that man can be,\nThou, God, art present there.",
    ],
  },
  {
    title: "For All the Saints",
    line: "Who from their labors rest.",
    author: "William Walsham How, 1864",
    lyrics: [
      "For all the saints who from their labors rest,\nWho Thee by faith before the world confessed,\nThy name, O Jesus, be forever blest.\nAlleluia! Alleluia!",
      "Thou wast their Rock, their Fortress, and their Might;\nThou, Lord, their Captain in the well-fought fight;\nThou, in the darkness drear, their one true Light.\nAlleluia! Alleluia!",
      "O blest communion, fellowship divine!\nWe feebly struggle, they in glory shine;\nYet all are one in Thee, for all are Thine.\nAlleluia! Alleluia!",
      "And when the strife is fierce, the warfare long,\nSteals on the ear the distant triumph-song,\nAnd hearts are brave again, and arms are strong.\nAlleluia! Alleluia!",
      "From earth's wide bounds, from ocean's farthest coast,\nThrough gates of pearl streams in the countless host,\nSinging to Father, Son, and Holy Ghost:\nAlleluia! Alleluia!",
    ],
  },
  {
    title: "Alas! and Did My Savior Bleed",
    line: "Amazing pity! grace unknown! and love beyond degree!",
    author: "Isaac Watts, 1707",
    lyrics: [
      "Alas! and did my Savior bleed,\nAnd did my Sovereign die?\nWould He devote that sacred head\nFor such a worm as I?",
      "Was it for crimes that I had done\nHe groaned upon the tree?\nAmazing pity! grace unknown!\nAnd love beyond degree!",
      "Well might the sun in darkness hide,\nAnd shut his glories in,\nWhen Christ, the mighty Maker, died\nFor man the creature's sin.",
      "But drops of grief can ne'er repay\nThe debt of love I owe;\nHere, Lord, I give myself away,\n'Tis all that I can do.",
    ],
  },
  {
    title: "Fairest Lord Jesus",
    line: "Ruler of all nature.",
    author: "German, Münster Gesangbuch, 1677; tr. 1850",
    lyrics: [
      "Fairest Lord Jesus, Ruler of all nature,\nO Thou of God and man the Son,\nThee will I cherish, Thee will I honor,\nThou, my soul's glory, joy, and crown.",
      "Fair are the meadows, fairer still the woodlands,\nRobed in the blooming garb of spring:\nJesus is fairer, Jesus is purer,\nWho makes the woeful heart to sing.",
      "Fair is the sunshine, fairer still the moonlight,\nAnd all the twinkling starry host:\nJesus shines brighter, Jesus shines purer\nThan all the angels heaven can boast.",
      "Beautiful Savior! Lord of all the nations!\nSon of God and Son of Man!\nGlory and honor, praise, adoration,\nNow and forevermore be Thine!",
    ],
  },
  {
    title: "Nothing but the Blood",
    line: "What can wash away my sin? Nothing but the blood of Jesus.",
    author: "Robert Lowry, 1876",
    lyrics: [
      "What can wash away my sin?\nNothing but the blood of Jesus;\nWhat can make me whole again?\nNothing but the blood of Jesus.",
      "Refrain:\nO precious is the flow\nThat makes me white as snow;\nNo other fount I know,\nNothing but the blood of Jesus.",
      "For my pardon this I see:\nNothing but the blood of Jesus;\nFor my cleansing, this my plea:\nNothing but the blood of Jesus.",
      "Nothing can for sin atone:\nNothing but the blood of Jesus;\nNaught of good that I have done:\nNothing but the blood of Jesus.",
      "This is all my hope and peace:\nNothing but the blood of Jesus;\nThis is all my righteousness:\nNothing but the blood of Jesus.",
    ],
  },
];
