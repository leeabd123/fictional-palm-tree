// Transitions guide, vocab lists, synonyms
const TRANS_DATA = [
  {
    cat:"Pivot & shift",
    badge:"badge-pivot",
    items:[
      {ar:"طالما إحنا من ناحية",ph:"tala ma ihna min nahyat",en:"As long as we're on this angle...",when:"Use to shift perspective or introduce a new angle on the same topic. The Sudanese way of saying 'since we're here on this...'",rule:"Put it at the start of a sentence when you want to reframe or add a new dimension without breaking flow. Very natural mid-conversation.",examples:[
        {ar:"طالما إحنا من ناحية الشهرة، خلينا نتكلم عن الأصحاب.",en:"Since we're on fame, let's talk about friends.",note:"Pivots from fame to friendship naturally"},
        {ar:"طالما إحنا من ناحية التعب، صراحة الطبيخ ما سهل.",en:"Since we're on the topic of effort, honestly cooking isn't easy.",note:"Uses the same pivot into a new sub-topic"},
      ]},
      {ar:"ألو هو / ألو إنو",ph:"alu hwa / alu ino",en:"So that's it / which means / so that means...",when:"Use when landing on a conclusion or connecting cause to effect. 'Alu hwa' closes a reasoning chain. 'Alu ino' introduces what it means.",rule:"'Alu hwa' stands alone at the start — it's a standalone conclusion marker. 'Alu ino' is always followed by a clause explaining the consequence.",examples:[
        {ar:"ألو هو الزول دا ما كان مستعد للشهرة.",en:"So that's it — that person wasn't ready for fame.",note:"Closes the reasoning: this is why"},
        {ar:"ألو إنو الفترة دي صعبة على الكل.",en:"So that means this period is hard for everyone.",note:"Alu ino introduces the implication"},
      ]},
      {ar:"سن صون / منها لي",ph:"sin soon / min-ha li",en:"Anyway / moving along / from that then...",when:"Use to pivot out of a topic gracefully or bridge to the next point. Like 'anyway' or 'so from there...'",rule:"Works perfectly mid-sentence to signal topic shift without abruptness. Very Sudanese — sounds natural even if you use it frequently.",examples:[
        {ar:"سن صون، لما نيجي للحتة بتاعت الأصحاب...",en:"Anyway, when we get to the friends topic...",note:"Smooth pivot to a new topic"},
        {ar:"منها لي — الموضوع بيتحسّن مع الوقت.",en:"From there — the matter improves over time.",note:"Bridges to a different point"},
      ]},
      {ar:"راجعين لـ / راجع لـ",ph:"raji3een li / raji3 li",en:"Going back to / returning to",when:"Use to circle back to a previous point you want to revisit or elaborate on.",rule:"Always followed by the topic you're returning to. Great for structured conversations where you laid something down earlier.",examples:[
        {ar:"راجعين لحتة أول أغنية — ما قلت لنا كيف جات.",en:"Going back to the first song topic — you didn't tell us how it came.",note:"Returns to an earlier thread"},
        {ar:"راجع لما قلت — التمايز هو الأهم.",en:"Going back to what you said — distinction is the most important.",note:"Recalls a previous statement"},
      ]},
      {ar:"أما بعد",ph:"ama ba3d",en:"Now then / moving on / and after that",when:"Use to signal a shift from an intro or preamble into the main substance. Classic Arabic opener.",rule:"Put it right before the main point. It tells the listener: the warm-up is over, here comes the real thing.",examples:[
        {ar:"أما بعد، خلينا نتكلم عن الأصحاب الحقيقيين.",en:"Now then, let's talk about real friends.",note:"Closes the intro, opens the content"},
        {ar:"أما بعد — السؤال الأول.",en:"Now then — first question.",note:"Signals the start of substance"},
      ]},
      {ar:"تخطينا النقطة دي",ph:"takhatteyna an-nuqta di",en:"We've passed that point / moved beyond that",when:"Use when something used to be an issue but isn't anymore — marking progress or evolution.",rule:"Always references something that WAS a problem or limitation. Implies growth has happened.",examples:[
        {ar:"تخطينا النقطة دي — الناس بدأت تتقبّل.",en:"We've passed that point — people started accepting.",note:"Marks societal progress"},
        {ar:"أنا شخصيا تخطيت النقطة دي.",en:"I personally moved past that point.",note:"Personal growth marker"},
      ]},
    ]
  },
  {
    cat:"Connect & explain",
    badge:"badge-connect",
    items:[
      {ar:"إنو",ph:"ino",en:"That / meaning that (conjunction)",when:"The most used connector in Sudanese Arabic. Introduces a clause that explains, defines, or elaborates on what came before.",rule:"Replace إن/أن with إنو in almost every sentence. 'بحس إنو...' = 'I feel that...' / 'قلت إنو...' = 'I said that...'",examples:[
        {ar:"بحس إنو الموضوع صعب شديد.",en:"I feel that the matter is very difficult.",note:"Most natural sentence structure"},
        {ar:"قلت لنفسي إنو لازم أكمّل.",en:"I told myself that I have to keep going.",note:"Inner monologue structure"},
        {ar:"الحقيقة إنو النجاح ما بييجي بسرعة.",en:"The truth is that success doesn't come quickly.",note:"Truth + إنو = a powerful statement"},
      ]},
      {ar:"حيث إنو",ph:"haytho ino",en:"Given that / since / seeing as",when:"Use when providing the reason or context that makes your main point logical.",rule:"Always comes before the reason. 'حيث إنو هو اشتغل كتير — ما مستغرب النجاح.' The reason comes FIRST with حيث إنو.",examples:[
        {ar:"حيث إنو هو مجتهد، ما مستغرب النجاح.",en:"Given that he's diligent, the success isn't surprising.",note:"Reason first, conclusion second"},
        {ar:"حيث إنو الظروف صعبة، المهم إنك تكمّل.",en:"Given that circumstances are hard, what matters is you keep going.",note:"Context-setting before advice"},
      ]},
      {ar:"على قدر ما",ph:"3ala gadr ma",en:"To the extent that / as much as",when:"Use for proportional statements — what you put in is what you get out.",rule:"'على قدر ما أنت + verb = what you give, you get.' Classic wisdom structure.",examples:[
        {ar:"الدنيا بتديك على قدر ما أنت بتجتهد.",en:"The world gives you to the extent that you work hard.",note:"Proportional wisdom — the core Sudanese formula"},
        {ar:"على قدر ما بتحب الحاجة، على قدر ما بتبدع فيها.",en:"To the extent that you love the thing, you create brilliantly in it.",note:"Love and quality are proportional"},
      ]},
      {ar:"عشان كدا",ph:"3ashan kida",en:"That's why / for that reason / so",when:"Use to land the consequence of what you just said. 'I described the problem — عشان كدا here's the solution or lesson.'",rule:"Always follows the cause. It's the 'therefore' of Sudanese Arabic. Use it to make your logic feel airtight.",examples:[
        {ar:"الناس بتتأثر بيّ — عشان كدا بحس بمسؤولية.",en:"People get influenced by me — that's why I feel responsible.",note:"Cause then consequence"},
        {ar:"الإخلاص نادر — عشان كدا بقدّره شديد.",en:"Sincerity is rare — that's why I value it greatly.",note:"Observation then personal response"},
      ]},
      {ar:"من ناحية",ph:"min nahyat",en:"From the angle of / in terms of",when:"Use to zoom in on a specific dimension of a topic.",rule:"Works like 'in terms of X' in English. Followed immediately by the dimension you're focusing on.",examples:[
        {ar:"من ناحية مسؤولية — الحاجة دي كبيرة شديد.",en:"In terms of responsibility — this thing is very big.",note:"Frames the dimension before expanding"},
        {ar:"من ناحية الشغل، الموضوع ماشي كويس.",en:"In terms of work, things are going well.",note:"Work as specific lens"},
      ]},
      {ar:"اللي هو",ph:"alli huw",en:"Which is / that is / meaning",when:"Use to clarify, define, or add a parenthetical explanation mid-sentence.",rule:"Works like a parenthesis. Insert it to define a term or expand on what you just said without starting a new sentence.",examples:[
        {ar:"المجال، اللي هو الراب، صعب شديد.",en:"The field, which is rap, is very difficult.",note:"Mid-sentence definition"},
        {ar:"العلاقة، اللي هي بتاعت الأصحاب، محتاجة وقت.",en:"The relationship, which is about friends, needs time.",note:"Specifies which relationship"},
      ]},
    ]
  },
  {
    cat:"Check-in & engage",
    badge:"badge-check",
    items:[
      {ar:"فاهمني / فاهماني",ph:"fahimni / fahimani",en:"You understand me? / you see what I mean?",when:"Use after making a point to check the listener is following. Use it constantly — it's the #1 naturalness marker.",rule:"Drop it after almost every important sentence. It creates rhythm, invites engagement, and is the most Sudanese thing you can do in conversation.",examples:[
        {ar:"الموضوع صعب — فاهماني؟",en:"The matter is difficult — you see what I mean?",note:"After any complex point"},
        {ar:"المخلص بيكون مخلص في كل حاجة — فاهمني؟",en:"A sincere person is sincere in everything — you understand?",note:"After a philosophical statement"},
        {ar:"ألو هو كده بيصير — فاهماني؟",en:"So that's how it happens — you see what I mean?",note:"After a conclusion"},
      ]},
      {ar:"يعني",ph:"ya3ni",en:"I mean / meaning / you know",when:"Use everywhere. It softens, explains, buys time, and signals you're about to elaborate.",rule:"The most versatile word in Arabic. At the start = 'I mean...' Mid-sentence = adds informality. End of phrase = 'you know what I mean.' Use it freely.",examples:[
        {ar:"يعني الزول دا رهيب شديد.",en:"I mean, that person is incredibly amazing.",note:"Opener that softens a strong statement"},
        {ar:"في ناس يعني ما بتعرفهم تبقى واثق منهم.",en:"There are people you know, I mean, you can trust.",note:"Mid-sentence to find words"},
        {ar:"الموضوع ما سهل — يعني.",en:"The matter isn't easy — you know.",note:"End position: invites agreement"},
      ]},
      {ar:"صح / صح؟",ph:"sah / sah?",en:"Right / isn't it? / correct",when:"Use to invite agreement or confirm shared understanding. A gentle tag question.",rule:"Put صح at the end of a statement when you want gentle validation. Two صح together (صح صح) signals strong agreement.",examples:[
        {ar:"الإخلاص هو الأهم — صح؟",en:"Sincerity is the most important — right?",note:"Invites confirmation"},
        {ar:"صح صح — كلامك مية في المية.",en:"Right right — what you said is 100%.",note:"Double صح = enthusiastic agreement"},
      ]},
      {ar:"لا لا",ph:"la la",en:"No no / wait wait / that's not quite it",when:"Use to gently correct or walk back something that might be misunderstood. NOT aggressive.",rule:"'لا لا' in Sudanese is softening. Say it quickly and follow with the clarification. It's like saying 'hold on' or 'let me rephrase.'",examples:[
        {ar:"لا لا — قصدي مش كده.",en:"No no — I don't mean it like that.",note:"Gentle correction of interpretation"},
        {ar:"لا لا — هو مش ده اللي حصل.",en:"Wait wait — that's not what happened.",note:"Walks back a mischaracterization"},
      ]},
    ]
  },
  {
    cat:"Close & land",
    badge:"badge-close",
    items:[
      {ar:"نقطة وسطر جديد",ph:"nuqta wa satr jadeed",en:"Full stop and new line / end of story",when:"Use to definitively close a topic you don't want to reopen.",rule:"This is your nuclear closer. Say it when you've made your point and you're done. Works in arguments, discussions, and when delivering final verdicts.",examples:[
        {ar:"خلاص قررت — نقطة وسطر جديد.",en:"I've decided — end of story.",note:"Absolute closure"},
        {ar:"الموضوع خلص — نقطة وسطر جديد.",en:"The matter is done — full stop.",note:"Terminates discussion"},
      ]},
      {ar:"في نهاية الأمر",ph:"fi nihayat al-amr",en:"At the end of the day / ultimately",when:"Use to land on the core truth after laying out complexity.",rule:"Works like the English 'at the end of the day.' Use it before your main point when you've built up a lot of context.",examples:[
        {ar:"في نهاية الأمر — التوفيق من ربنا.",en:"At the end of the day — success comes from God.",note:"Ultimate truth landing"},
        {ar:"في نهاية الأمر، كل واحد مسؤول عن نفسه.",en:"At the end of the day, each person is responsible for themselves.",note:"Closing wisdom statement"},
      ]},
      {ar:"خلاص",ph:"khalaas",en:"That's it / done / enough / settled",when:"Use to signal closure, acceptance, or completion. One of the most flexible Sudanese words.",rule:"Can close a topic, accept something reluctantly, signal you're done with an issue, or confirm something is settled. Tone does the work.",examples:[
        {ar:"خلاص — ما في كلام بعدين.",en:"That's it — no more talk.",note:"Topic officially closed"},
        {ar:"خلاص، أنا موافق.",en:"Fine, I agree.",note:"Reluctant or willing acceptance"},
        {ar:"خلاص؟ خلاص.",en:"Done? Done.",note:"Confirming agreement between two people"},
      ]},
      {ar:"الحمد لله",ph:"al-hamdu lillah",en:"Praise God / thank God (natural closer)",when:"Use as a natural landing on gratitude after describing something positive or after overcoming difficulty.",rule:"The most Sudanese way to close a positive statement. Don't save it for formal moments — use it casually throughout conversation.",examples:[
        {ar:"الانتشار جا — الحمد لله.",en:"The reach came — praise God.",note:"Natural grateful close"},
        {ar:"مرينا في صعوبات لكن الحمد لله كملنا.",en:"We went through difficulties but praise God we made it.",note:"After hardship, gratitude"},
      ]},
    ]
  },
  {
    cat:"Fillers that sound native",
    badge:"badge-filler",
    items:[
      {ar:"وبتاع / وبتاعت",ph:"w-bita3 / w-bita3t",en:"And stuff / and things / and all that",when:"Use to end a list without having to name everything. Like 'and all that.'",rule:"Put it at the end of any list. It signals 'there are more things but you get the idea.' Makes you sound very natural immediately.",examples:[
        {ar:"في حفلات وبرفورمنس وبتاع.",en:"There are shows and performances and stuff.",note:"Closes a list gracefully"},
        {ar:"الأكل والشاي والتحدث وبتاع.",en:"Food, tea, chatting and all that.",note:"Casual list ender"},
      ]},
      {ar:"كمان",ph:"kaman",en:"Also / too / as well",when:"Adds something to what was just said.",rule:"Goes at the END of the clause in Sudanese Arabic. 'أنا بحبها كمان' = 'I love her too.' Never at the start.",examples:[
        {ar:"هو بيغني وبيكتب كمان.",en:"He sings and he writes too.",note:"Adds an item at the end"},
        {ar:"أنا مبسوط وهو مبسوط كمان.",en:"I'm happy and he's happy too.",note:"Parallel addition"},
      ]},
      {ar:"بس",ph:"bas",e:"Just / only / but / that's enough",when:"The most overloaded Sudanese word. 'Just' when limiting. 'But' when contrasting. 'Enough' when stopping.",rule:"Listen carefully to context. 'بس أنا' = 'just me.' 'بس الموضوع صعب' = 'but the matter is hard.' 'بس!' alone = 'enough!'",examples:[
        {ar:"بس أنا وهو عارفين الحقيقة.",en:"Only me and him know the truth.",note:"Limiting: 'just'"},
        {ar:"بس الموضوع ما بسيط.",en:"But the matter isn't simple.",note:"Contrasting: 'but'"},
        {ar:"بس! خلاص.",en:"Enough! That's it.",note:"Stopping: 'enough!'"},
      ]},
      {ar:"طيب",ph:"tayib",en:"Okay / alright / right then",when:"The conversational gear-shift. Use it to move forward, accept something, or signal you're ready for the next thing.",rule:"'طيب' at the start of a turn = you accepted the last point and are moving on. It's the most natural conversational lubricant.",examples:[
        {ar:"طيب — سؤال تاني.",en:"Alright — next question.",note:"Topic transition"},
        {ar:"طيب، أنا موافق.",en:"Okay, I agree.",note:"Acceptance"},
        {ar:"طيب يا جماعة...",en:"Right then everyone...",note:"Addressing an audience"},
      ]},
      {ar:"يلا",ph:"yalla",en:"Let's go / come on / alright",when:"Signals readiness, encourages action, or kicks something off.",rule:"Use it to start doing something, to encourage someone, or to signal you're moving to the next phase.",examples:[
        {ar:"يلا — نبدأ.",en:"Let's go — let's start.",note:"Action initiation"},
        {ar:"يلا، حكيلي القصة.",en:"Come on, tell me the story.",note:"Encouragement to speak"},
      ]},
      {ar:"والله",ph:"wallahi",en:"I swear / by God / honestly",when:"Adds sincerity and weight to any statement.",rule:"Use it freely — it's not considered disrespectful. It's the strongest truthfulness signal in Sudanese Arabic.",examples:[
        {ar:"والله ما كنت متوقع كده.",en:"I swear I wasn't expecting that.",note:"Genuine surprise"},
        {ar:"والله هو زول رهيب.",en:"Honestly he's an incredible person.",note:"Sincere praise"},
      ]},
      {ar:"صراحة",ph:"saraha",en:"Honestly / to be frank / straight up",when:"Use before saying something true but potentially uncomfortable or personal.",rule:"'صراحة' = what follows is unfiltered. It signals authenticity and invites trust. Open important statements with it.",examples:[
        {ar:"صراحة ما كنت واثق.",en:"Honestly I wasn't sure.",note:"Vulnerable honesty"},
        {ar:"صراحة الموضوع صعب — ما حقدر أقول غير كده.",en:"Honestly the matter is hard — I can't say otherwise.",note:"Forced honesty"},
      ]},
    ]
  },
];

// ══════════════════════════════════════
// VOCAB LISTS DATA
// ══════════════════════════════════════
const VOCAB_LISTS = {
  essential:{
    label:"Essential 30 — learn these first",
    desc:"These 30 words and phrases appear in almost every Sudanese conversation. Master these and you'll understand 60% of what you hear.",
    items:[
      {ar:"يعني",ph:"ya3ni",en:"I mean / you know / meaning",note:"Use in every sentence"},
      {ar:"صراحة",ph:"saraha",en:"Honestly / to be frank",note:"Opens honest statements"},
      {ar:"فاهمني؟",ph:"fahimni?",en:"You understand me?",note:"After every key point"},
      {ar:"بالجد",ph:"bil-jad",en:"For real / seriously",note:"Strongest emphasis"},
      {ar:"خلاص",ph:"khalaas",en:"That's it / done / enough",note:"Universal closer"},
      {ar:"طيب",ph:"tayib",en:"Okay / alright",note:"Gear-shift between topics"},
      {ar:"يلا",ph:"yalla",en:"Let's go / come on",note:"Starts actions"},
      {ar:"والله",ph:"wallahi",en:"I swear / honestly",note:"Sincerity marker"},
      {ar:"شديد",ph:"shadeed",en:"Very / extremely",note:"After what it intensifies"},
      {ar:"بعدين",ph:"ba3dayn",en:"Then / after that",note:"Story sequencer"},
      {ar:"لكن",ph:"lakin",en:"But / however",note:"Contrast connector"},
      {ar:"عشان كدا",ph:"3ashan kida",en:"That's why",note:"Consequence marker"},
      {ar:"الحمد لله",ph:"al-hamdu lillah",en:"Praise God / thank God",note:"Natural closer"},
      {ar:"ألو هو",ph:"alu hwa",en:"So that's it / which means",note:"Conclusion marker"},
      {ar:"إنو",ph:"ino",en:"That / meaning that",note:"Most common conjunction"},
      {ar:"وبتاع",ph:"w-bita3",en:"And stuff / and all that",note:"Closes lists naturally"},
      {ar:"زول",ph:"zool",en:"A person / someone",note:"Universal person word"},
      {ar:"هسه",ph:"hissa",en:"Now / right now",note:"Sudanese 'now'"},
      {ar:"بالذات",ph:"bil-zat",en:"Especially / specifically",note:"Emphasis + specificity"},
      {ar:"طبعاً",ph:"tab3an",en:"Of course / naturally",note:"Soft agreement"},
      {ar:"بس",ph:"bas",en:"Just / but / enough",note:"Most flexible word"},
      {ar:"كمان",ph:"kaman",en:"Also / too",note:"Always at end of clause"},
      {ar:"صح؟",ph:"sah?",en:"Right? / correct?",note:"Tag question"},
      {ar:"مبسوط",ph:"mabsoot",en:"Happy / content",note:"Everyday happy word"},
      {ar:"رهيب",ph:"rahib",en:"Amazing / incredible",note:"Go-to praise word"},
      {ar:"الحمد لله على كل حاجة",ph:"al-hamdu lillah 3ala kull haga",en:"Praise God for everything",note:"Full gratitude phrase"},
      {ar:"في نهاية الأمر",ph:"fi nihayat al-amr",en:"At the end of the day",note:"Final truth landing"},
      {ar:"من ناحية",ph:"min nahyat",en:"In terms of / from the angle of",note:"Dimension framer"},
      {ar:"ما في",ph:"ma fi",en:"There isn't / there's no",note:"Negation of existence"},
      {ar:"دايماً",ph:"dayiman",en:"Always",note:"Universal frequency word"},
    ]
  },
  transitions:{
    label:"Transition master list",
    desc:"Every key transition in one place. Learn these and you'll sound fluent even when you're still building vocabulary.",
    items:[
      {ar:"طالما إحنا من ناحية",ph:"tala ma ihna min nahyat",en:"As long as we're on this angle...",note:"Topic pivot"},
      {ar:"ألو هو / ألو إنو",ph:"alu hwa / alu ino",en:"So that's it / so that means",note:"Conclusion connector"},
      {ar:"سن صون / منها لي",ph:"sin soon / min-ha li",en:"Anyway / moving along",note:"Smooth topic shift"},
      {ar:"راجعين لـ",ph:"raji3een li",en:"Going back to...",note:"Returns to earlier point"},
      {ar:"أما بعد",ph:"ama ba3d",en:"Now then / moving on",note:"Preamble ender"},
      {ar:"حيث إنو",ph:"haytho ino",en:"Given that / since",note:"Reason introducer"},
      {ar:"على قدر ما",ph:"3ala gadr ma",en:"To the extent that",note:"Proportional logic"},
      {ar:"عشان كدا",ph:"3ashan kida",en:"That's why",note:"Consequence"},
      {ar:"من ناحية",ph:"min nahyat",en:"In terms of",note:"Dimension framing"},
      {ar:"اللي هو",ph:"alli huw",en:"Which is / meaning",note:"Mid-sentence clarifier"},
      {ar:"إنو",ph:"ino",en:"That (conjunction)",note:"Most used connector"},
      {ar:"تخطينا النقطة دي",ph:"takhatteyna an-nuqta di",en:"We've passed that point",note:"Progress marker"},
      {ar:"كوني كونيك",ph:"kowni kownik",en:"Be yourself / you do you",note:"Autonomy pivot"},
      {ar:"في نهاية الأمر",ph:"fi nihayat al-amr",en:"At the end of the day",note:"Truth lander"},
      {ar:"نقطة وسطر جديد",ph:"nuqta wa satr jadeed",en:"End of story / full stop",note:"Nuclear closer"},
      {ar:"راجع وبقول لنفسي",ph:"raji3 wa baqool li-nafsi",en:"I go back and tell myself",note:"Reflection pivot"},
      {ar:"من ناحية ثانية",ph:"min nahyat tanya",en:"On the other hand / from another angle",note:"Counter-perspective"},
      {ar:"بالعكس",ph:"bil-3aks",en:"On the contrary",note:"Reversal"},
      {ar:"في نفس الوقت",ph:"fi nafs al-waqt",en:"At the same time",note:"Simultaneous contrast"},
      {ar:"بعيداً عن",ph:"ba3eedan 3an",en:"Setting aside / apart from",note:"Parenthetical shift"},
    ]
  },
  emotions:{
    label:"Emotions & inner world",
    desc:"Express your feelings, mental state, and emotional experiences naturally.",
    items:[
      {ar:"إحساس",ph:"ehsas",en:"Feeling / emotion",note:"Core emotion word"},
      {ar:"نفسية",ph:"nafseeyya",en:"Mental/emotional state",note:"Your internal weather"},
      {ar:"مبسوط",ph:"mabsoot",en:"Happy / content",note:"Everyday happy"},
      {ar:"زعلان",ph:"za3laan",en:"Upset / hurt",note:"Emotional pain"},
      {ar:"قلقان",ph:"qalqaan",en:"Worried / anxious",note:"Anxiety word"},
      {ar:"خايف",ph:"khaayif",en:"Scared / afraid",note:"Fear"},
      {ar:"واثق",ph:"waathiq",en:"Confident / certain",note:"Belief in self"},
      {ar:"تعبان",ph:"ta3baan",en:"Tired / exhausted",note:"Physical/emotional fatigue"},
      {ar:"ضغط",ph:"daght",en:"Pressure / stress",note:"Stress noun"},
      {ar:"راحة البال",ph:"raahat al-baal",en:"Peace of mind",note:"Mental ease"},
      {ar:"حاسس إنو",ph:"haasis innu",en:"I feel that",note:"Feeling + connector"},
      {ar:"أثّر فيّ",ph:"aththar fiyy",en:"It affected me",note:"Impact expression"},
      {ar:"دفنتلي",ph:"dafantili",en:"It settled deep in me",note:"Deep impact"},
      {ar:"بتخليني أحبط",ph:"bittkhallini ahbat",en:"It makes me feel defeated",note:"Demoralization"},
      {ar:"أتمالك نفسي",ph:"atmallak nafsi",en:"Control myself / hold it together",note:"Self-composure"},
      {ar:"استحمل",ph:"istahamal",en:"Bear / endure / can't take it",note:"Tolerance threshold"},
      {ar:"ما طاقة",ph:"ma taqa",en:"Unbearable / can't stand it",note:"Limit reached"},
      {ar:"مؤمن بكدا",ph:"mu'min bi-kida",en:"I believe in this",note:"Conviction"},
      {ar:"خوف من الفقد",ph:"khawf min al-faqd",en:"Fear of loss",note:"Deepest fear"},
      {ar:"الدوافع",ph:"ad-dawa fi3",en:"Motivations / the why",note:"What drives you"},
    ]
  },
  praise:{
    label:"Praise, reactions & responses",
    desc:"Sound natural when someone does something good, when you're impressed, or when you want to express appreciation.",
    items:[
      {ar:"رهيب / رهيبة",ph:"rahib",en:"Amazing / incredible",note:"Primary praise word"},
      {ar:"فظيع",ph:"fazee3",en:"Insanely good (positive!)",note:"Ironic strong praise"},
      {ar:"درعة",ph:"dara3ah",en:"Exceptional / extraordinary",note:"Slang top-tier praise"},
      {ar:"جامد",ph:"jaamid",en:"Solid / great",note:"Solid modern praise"},
      {ar:"دسيسة",ph:"dasees",en:"Good / solid (revolution slang)",note:"2018 revolution born"},
      {ar:"زيت",ph:"zait",en:"Excellent / top quality",note:"Strongest slang approval"},
      {ar:"أصلي",ph:"asli",en:"Genuine / the real deal",note:"Authenticity praise"},
      {ar:"تستاهل",ph:"tistaahil",en:"You deserve it",note:"Earned praise"},
      {ar:"ماشاء الله",ph:"mashaa'allah",en:"God willed it / wow",note:"Admiration + gratitude"},
      {ar:"والله يسلموا",ph:"wallahi yislamu",en:"Bless you / well done",note:"Appreciative response"},
      {ar:"برافو عليك",ph:"bravo 3alayk",en:"Bravo / well done",note:"Direct praise"},
      {ar:"عظيم",ph:"3azeem",en:"Great / magnificent",note:"Formal strong praise"},
      {ar:"على مستوى عالي",ph:"3ala mustawa 3aali",en:"At a high level",note:"Quality statement"},
      {ar:"شديد",ph:"shadeed",en:"Very / extremely (intensifier)",note:"After any praise word"},
      {ar:"بالجد",ph:"bil-jad",en:"For real / genuinely",note:"Sincerity amp"},
    ]
  },
  character:{
    label:"Describing people & character",
    desc:"All the words you need to describe someone's personality, values, and way of being.",
    items:[
      {ar:"مخلص",ph:"mukhlis",en:"Sincere / loyal / dedicated",note:"Highest character praise"},
      {ar:"متمرد",ph:"mutamarrid",en:"Rebellious / non-conformist",note:"Positive rebelliousness"},
      {ar:"صعب الرضا",ph:"sa3b ar-rida",en:"Hard to please",note:"High standards"},
      {ar:"أوفر ثينكر",ph:"over thinker",en:"Overthinker",note:"Natural loanword"},
      {ar:"حربي / حربية",ph:"harbi",en:"Fighter / brave rebel",note:"Admirable strength"},
      {ar:"كندكة",ph:"kandaka",en:"Powerful inspiring woman",note:"Ancient queen title"},
      {ar:"زول الله",ph:"zool allah",en:"Peaceful / innocent soul",note:"Gentle person"},
      {ar:"جلدة",ph:"jilda",en:"Stingy / tight with money",note:"Miser"},
      {ar:"غتاتة",ph:"ghatata",en:"Sly / cunning",note:"Deceptive character"},
      {ar:"مكنة",ph:"makana",en:"Skilled / a machine at work",note:"Top professional"},
      {ar:"هناكة / هناك",ph:"hanaaka",en:"Sweet talker / charmer",note:"Natural persuader"},
      {ar:"حنكوش",ph:"hankosh",en:"Spoiled / soft / comfort-loving",note:"Inexperienced youth"},
      {ar:"جاد",ph:"jaad",en:"Serious / committed",note:"Dedication"},
      {ar:"مبدع",ph:"mubdi3",en:"Creative / innovative",note:"Creative person"},
      {ar:"صاحبي",ph:"sahibi",en:"My friend",note:"Close friend"},
    ]
  },
  wisdom:{
    label:"Wisdom phrases & proverbs",
    desc:"Sound like someone who thinks deeply. These phrases come directly from the podcast conversations.",
    items:[
      {ar:"الدنيا ما دوامة",ph:"al-dunya ma dawwama",en:"What goes around comes around",note:"Actions return to you"},
      {ar:"النجاح والفشل مترادفين",ph:"an-najah wal-fashal mutaradifeen",en:"Success and failure are intertwined",note:"Core philosophy"},
      {ar:"التوقعات عدو الإنسان",ph:"at-tawaqqu3at 3aduw al-insan",en:"Expectations are the enemy",note:"Let go of expectations"},
      {ar:"ما عارف اللي ما عارفه",ph:"ma 3arif alli ma 3arfu",en:"You don't know what you don't know",note:"Humility about unknown"},
      {ar:"الحياة بتجي مع الحياة",ph:"al-hayat bituji ma3 al-hayat",en:"Life comes with life",note:"Things unfold naturally"},
      {ar:"بتنحت في الصخر",ph:"betnhat fi as-sakhr",en:"Chiseling into rock / grinding",note:"Persistent effort"},
      {ar:"على قدر ما أنت بتجتهد",ph:"3ala gadr ma anta bitujtahid",en:"To the extent you work hard",note:"Proportional reward"},
      {ar:"الدنيا دبنقا دردقي بشيش",ph:"dunia dabanga dardigi bishish",en:"Life is fleeting — tread slowly",note:"Darfuri proverb"},
      {ar:"خُذ للزول العذر",ph:"khuz lil-zool al-3uzur",en:"Give the person an excuse",note:"For YOUR peace, not them"},
      {ar:"رجع روحك لورا",ph:"raji3 rohak lawwra",en:"Step back and see what's best",note:"Self-care perspective"},
      {ar:"الصبر مفتاح النجاح",ph:"as-sabr miftah an-najah",en:"Patience is the key to success",note:"Classic wisdom"},
      {ar:"الإخلاص في كل حاجة",ph:"al-ikhlaas fi kull haga",en:"Sincerity in everything",note:"The standard"},
      {ar:"بعد الضيق بييجي الفرج",ph:"ba3d ad-dayyq biyiiji al-faraj",en:"After hardship comes relief",note:"Quranic / universal"},
      {ar:"شوف التحت وصل وين",ph:"shoof at-taht wisal ween",en:"Look how far the bottom came",note:"Gratitude for growth"},
    ]
  },
};

// ══════════════════════════════════════
// DEEP QUIZ DATA & ENGINE
// ══════════════════════════════════════
const SYNONYMS = {
  'رهيب / رهيبة':[{a:'فظيع',ph:'fazee3',en:'insanely good'},{a:'درعة',ph:'dara3ah',en:'exceptional'},{a:'جامد',ph:'jaamid',en:'solid/great'},{a:'زيت',ph:'zait',en:'excellent'},{a:'دسيسة',ph:'dasees',en:'solid (revolution slang)'}],
  'يعني':[{a:'اللي هو',ph:'alli huw',en:'which is / meaning'},{a:'قصدي',ph:'qasdi',en:'what I mean is'},{a:'بمعنى',ph:'bi-ma3na',en:'meaning that'}],
  'بالجد':[{a:'صراحة',ph:'saraha',en:'honestly'},{a:'حقيقة',ph:'haqiiqa',en:'truly'},{a:'فعلاً',ph:'fi3lan',en:'actually / genuinely'},{a:'والله',ph:'wallahi',en:'by God'}],
  'صعب شديد':[{a:'صعبة شديد',ph:'sa3ba shadeed',en:'very difficult (f)'},{a:'ما بسيط',ph:'ma basiit',en:'not simple'},{a:'ما سهل',ph:'ma sahl',en:'not easy'},{a:'تعبان',ph:'ta3baan',en:'exhausting'}],
  'مبسوط':[{a:'فرحان',ph:'farhaan',en:'happy/joyful'},{a:'مرتاح',ph:'murtaah',en:'comfortable/at ease'},{a:'راضي',ph:'raadi',en:'satisfied'},{a:'كويس',ph:'kuayis',en:'good/well'}],
  'أكيد':[{a:'طبعاً',ph:'tab3an',en:'of course'},{a:'لازم',ph:'laazim',en:'must / for sure'},{a:'بالتأكيد',ph:'bit-ta-kid',en:'certainly'},{a:'يقيناً',ph:'yaqinan',en:'definitely'}],
  'هسّة / هسي':[{a:'الحين',ph:'al-heen',en:'now (Gulf)'},{a:'دلوقتي',ph:'dilwaqti',en:'now (Egyptian)'},{a:'الآن',ph:'al-aan',en:'now (formal)'}],
  'زول':[{a:'شخص',ph:'shakhis',en:'person (formal)'},{a:'حد',ph:'hadd',en:'someone/anyone'},{a:'واحد',ph:'waahid',en:'one/someone'}],
  'دايماً':[{a:'أبداً',ph:'abadan',en:'always / never'},{a:'كل وقت',ph:'kull waqt',en:'all the time'},{a:'في كل مرة',ph:'fi kull marra',en:'every time'}],
  'كثير':[{a:'شديد',ph:'shadeed',en:'a lot / very'},{a:'زيادة',ph:'ziyaada',en:'too much/many'},{a:'وايد',ph:'waayid',en:'a lot (Gulf loanword)'}],
  'فاهمني؟':[{a:'فاهمه؟',ph:'faahimuh?',en:'understand? (m)'},{a:'فاهمة؟',ph:'faahima?',en:'understand? (f)'},{a:'صح؟',ph:'sah?',en:'right?'},{a:'مع بعض؟',ph:'ma3 ba3d?',en:'together? (following?)'}],
  'الحمد لله':[{a:'الشكر لله',ph:'ash-shukr lillah',en:'thanks be to God'},{a:'سبحان الله',ph:'subhan allah',en:'glory to God'},{a:'ماشاء الله',ph:'mashaa-allah',en:'God willed it'}],
  'إنو':[{a:'إن',ph:'inn',en:'that (formal)'},{a:'أنه',ph:'innuh',en:'that (he)'},{a:'إنها',ph:'innaha',en:'that (she)'}],
  'برضو':[{a:'كمان',ph:'kaman',en:'also/too'},{a:'أيضاً',ph:'aydan',en:'also (formal)'},{a:'وبعدين',ph:'w-ba3dayn',en:'and also / and then'}],
};

// ══════════════════════════════════════
// DEEP FLASHCARD MODE
// ══════════════════════════════════════
