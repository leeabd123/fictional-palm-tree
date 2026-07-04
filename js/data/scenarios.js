// Speak & Respond scenario questions + Flow translation sets
const SPEAK_QA = [
  {
    qen:"Tell me about yourself — what do you do and how long have you been doing it?",
    qar:"حكي لي عن نفسك — بتعمل شنو وكم قاعد تعمله؟",
    qph:"haki li 3an nafsak — bita3mal shinoo w-kam qa3id ta3maluh?",
    context:"Answer as if you're introducing yourself on a podcast. Sound natural and Sudanese.",
    required:["صراحة","يعني","وبتاع"],
    bonus:["الحمد لله","بالجد","شديد"],
    model:[
      {ar:"صراحة أنا بعمل [شغلك] من حوالي سنة ونص هسه.",ph:"saraha ana ba3mil [shughlak] min hawali sana w-nus hissa.",en:"Honestly I've been doing [your thing] for about a year and a half now.",vocab:["صراحة","سنة ونص","هسه"]},
      {ar:"يعني الحمد لله الموضوع ماشي كويس وأنا مبسوط.",ph:"ya3ni al-hamdu lillah al-mawdoo3 mashi kuayis w-ana mabsoot.",en:"I mean, praise God, things are going well and I'm happy.",vocab:["يعني","الحمد لله","مبسوط"]},
      {ar:"بعمل محتوى وكونتنت وبتاع — الناس بتشوف وبتتفاعل الحمد لله.",ph:"ba3mil muhtawa w-content w-bita3 — an-nas bitshoof w-bittifa3al al-hamdu lillah.",en:"I make content and stuff — people watch and engage, praise God.",vocab:["محتوى","وبتاع","الحمد لله"]},
    ],
    tip:"Start with صراحة. Use يعني to connect sentences. End with الحمد لله — it's the natural landing."
  },
  {
    qen:"How do you deal with hate comments and people who don't like your content?",
    qar:"كيف بتتعامل مع الهيت كومنتس والناس اللي ما بحبوا محتواك؟",
    qph:"kif bita3amal ma3 al-hate comments w-an-nas alli ma bihibbu muhtawak?",
    context:"Give a genuine, honest answer the way you'd say it in real conversation.",
    required:["من حقه","نفسيتك","صراحة"],
    bonus:["بالجد","يعني","فاهماني"],
    model:[
      {ar:"صراحة بتأثر فيني، مش حقول لك ما بتأثر.",ph:"saraha bita'athar finni, mish haqool lak ma bita'athar.",en:"Honestly it affects me, I'm not going to tell you it doesn't.",vocab:["صراحة","بتأثر"]},
      {ar:"لكن برجع وبقول لنفسي — من حقه يقول أي رأي عنده.",ph:"lakin barji3 w-baqool li-nafsi — min haqquh yaqool ayy ra'y 3anduh.",en:"But I go back and tell myself — he has the right to say whatever opinion he has.",vocab:["من حقه","لنفسي","برجع"]},
      {ar:"خُذ للزول العذر عشان نفسيتك ترتاح — مش عشان الزول.",ph:"khuz lil-zool al-3uzur 3ashan nafseeytak tirtah — mish 3ashan az-zool.",en:"Give the person an excuse so your mind can rest — not for the person's sake.",vocab:["العذر","نفسيتك","الزول"]},
    ],
    tip:"صراحة at the start signals honesty. برجع وبقول لنفسي is how you show reflection. End with the lesson."
  },
  {
    qen:"What does success mean to you as an artist or creator?",
    qar:"شنو معنى النجاح بالنسبة لك كفنان أو كريتر؟",
    qph:"shinoo ma3na an-najah bil-nisba lak ka-fanan aw creator?",
    context:"This is a deep question. Think about how Solja answered it — layered, honest, philosophical.",
    required:["يعني","الحمد لله","صراحة"],
    bonus:["بالجد","فاهماني","النجاح والفشل مترادفين"],
    model:[
      {ar:"صراحة كلمة النجاح دي كبيرة شديد ومتفرعة.",ph:"saraha kalimat an-najah di kabeera shadid w-mutafar3a.",en:"Honestly the word 'success' is very big and complex.",vocab:["صراحة","شديد","متفرعة"]},
      {ar:"يعني في نجاح في نظر الناس وفي نجاح في نظر نفسك — وهم مختلفين.",ph:"ya3ni fi najah fi nazar an-nas w-fi najah fi nazar nafsak — w-hum mukhtalifeen.",en:"I mean there's success in the eyes of people and success in your own eyes — and they're different.",vocab:["يعني","في نظر","نفسك","مختلفين"]},
      {ar:"الحمد لله على كل حاجة — النجاح والفشل مترادفين زي الليل والنهار.",ph:"al-hamdu lillah 3ala kull haga — an-najah wal-fashal mutaradifeen zay al-layl w-an-nahar.",en:"Praise God for everything — success and failure are intertwined like night and day.",vocab:["الحمد لله","النجاح والفشل","مترادفين"]},
    ],
    tip:"Sudanese speakers often open philosophical answers with صراحة. Use يعني to build the layers. Land with الحمد لله."
  },
  {
    qen:"Tell me about a time your life changed suddenly and how you handled it.",
    qar:"حكي لي عن وقت حياتك تغيرت فجأة وكيف تعاملت مع الموضوع.",
    qph:"haki li 3an waqt hayatak taghayyarat faj'a w-kif ta3amalt ma3 al-mawdoo3.",
    context:"Speak honestly about something real. Use the past tense and reflection phrases.",
    required:["في حاجات كثيرة تغيّرت فجأة","الحمد لله","يعني"],
    bonus:["صراحة","فاهماني","بالجد"],
    model:[
      {ar:"في حاجات كتيرة تغيّرت فجأة في حياتي — الحرب، الانتقال، الظروف.",ph:"fi hagat katira ghayyarat faj'a fi hayati — al-harb, al-intiqal, az-zuroof.",en:"Many things changed suddenly in my life — the war, moving, circumstances.",vocab:["تغيّرت فجأة","الحرب","الظروف"]},
      {ar:"يعني أول مرة في حياتي ما كنت عارف الجاي عليه شنو — مجهول تماماً.",ph:"ya3ni awwal marra fi hayati ma kunt 3arif al-jay 3alayh shinoo — majhool tamaman.",en:"I mean for the first time in my life I didn't know what was coming — completely unknown.",vocab:["يعني","أول مرة","مجهول","تماماً"]},
      {ar:"لكن الحمد لله — المزيكة كانت السلاح بتاعي. شيلت الحاجة اللي بحبها معي.",ph:"lakin al-hamdu lillah — al-moozeeka kanat as-silah bata3i. shilt al-haga alli bihibbha ma3i.",en:"But praise God — music was my weapon. I carried the thing I love with me.",vocab:["الحمد لله","السلاح","بحبها"]},
    ],
    tip:"Start with the change using تغيّرت فجأة. Build tension with مجهول. Resolve with الحمد لله — it's the natural Sudanese way."
  },
  {
    qen:"What advice would you give someone who's scared to start something new?",
    qar:"شنو النصيحة اللي حتديها لزول خايف يبدأ حاجة جديدة؟",
    qph:"shinoo an-naseeh alli hattideeha li-zool khaayif yibda haga jadeeda?",
    context:"Give real advice the way people speak in these podcasts — direct, warm, encouraging.",
    required:["ما تخاف من النجاح","كمّل المشوار","بالجد"],
    bonus:["يعني","فاهماني","الحمد لله"],
    model:[
      {ar:"بالجد ما تخاف من النجاح — الإنسان مرات بيوقف نفسه.",ph:"bil-jad ma tikhaaf min an-najah — al-insan marrat biyawqif nafsuh.",en:"For real don't be afraid of success — a person sometimes stops themselves.",vocab:["بالجد","ما تخاف","الإنسان","نفسه"]},
      {ar:"يعني حبّ اللي بتعمله جنونياً والقِ روحك فيه — فاهماني؟",ph:"ya3ni hibb alli bita3maluh junuuniyyan w-alqi rohak fih — fahimani?",en:"I mean love what you do madly and throw your soul into it — you understand?",vocab:["يعني","جنونياً","روحك","فاهماني"]},
      {ar:"كمّل المشوار — لسه قدامك كتير وسكايز دا ليميت.",ph:"kammil al-mishwar — lissa qaddamak kateer w-skies the limit.",en:"Complete the journey — there's still so much ahead and the sky's the limit.",vocab:["كمّل","المشوار","لسه","قدامك"]},
    ],
    tip:"بالجد at the start gives warmth and conviction. يعني keeps the flow natural. End with كمّل المشوار — it's the strongest close."
  },
  {
    qen:"How do you balance being real online vs. showing only certain parts of yourself?",
    qar:"كيف بتوفق بين إنك تكون حقيقي أونلاين وبين إنك تخلي بعض حاجاتك خاصة؟",
    qph:"kif bittawaffiq bayn innak takoon haqiqi online w-bayn innak tkhalli ba3d hagaatak khassa?",
    context:"This is a nuanced personal question. Think about how Ala answered it — honest but thoughtful.",
    required:["ما في إنسان ممكن يوريك كل شخصياته","يعني","فاهماني"],
    bonus:["صراحة","على طبيعتك","بالجد"],
    model:[
      {ar:"يعني صراحة ما في إنسان ممكن يوريك كل شخصياته في فيديو.",ph:"ya3ni saraha ma fi insan mumkin yawrreek kull shakhsiyyatuh fi video.",en:"I mean honestly no person can show you all their sides in a video.",vocab:["يعني","صراحة","كل شخصياته"]},
      {ar:"بوريكم سايد — شايد الجانب الفكاهي أو الجانب الحقيقي — فاهماني؟",ph:"bawwarreekum side — shayid al-janib al-fukahi aw al-janib al-haqiqi — fahimani?",en:"I show you a side — maybe the funny side or the real side — you understand?",vocab:["بوريكم","سايد","فاهماني"]},
      {ar:"لكن على طبيعتك دايماً أحسن — لما تكون على طبيعتك الناس بتحبك أكتر.",ph:"lakin 3ala tabi3tak dayiman ahsan — lamma takoon 3ala tabi3tak an-nas bitthibbak aktar.",en:"But being natural is always better — when you're natural people love you more.",vocab:["على طبيعتك","دايماً","الناس","أكتر"]},
    ],
    tip:"يعني صراحة together = 'I mean honestly' — a great combo. فاهماني? is the natural Sudanese check-in. End with a principle."
  },
  {
    qen:"Do you think Sudanese people are finally starting to accept content creators?",
    qar:"بتحس إنو السودانيين بدوا يتقبلوا الكونتنت كريتورز هسه؟",
    qph:"bittihhis innu as-sudaniyyeen badaw yittaqabbalu content creators hissa?",
    context:"Give an opinion — reference society, the change you see, and what still needs to happen.",
    required:["لسه ما اتفتحت فولي","ابتدى يفتح نفسه للعالم","يعني"],
    bonus:["الحمد لله","بالجد","دوب بدأت تتعود"],
    model:[
      {ar:"يعني السودان لسه ما اتفتح فولي للحتة دي — لكن بادي يتحسّن.",ph:"ya3ni as-sudan lissa ma itfatahat fully lil-hitta di — lakin badi yithassan.",en:"I mean Sudan hasn't fully opened up to this thing yet — but it's starting to improve.",vocab:["يعني","لسه ما اتفتح فولي","بادي"]},
      {ar:"الناس دوب بدأت تتعود إنو في بنات وأولاد بيطلعوا ويعملوا حاجات.",ph:"an-nas doob bada'at tit3awwad innu fi banat w-awlad biyitla3u w-ya3malu hagat.",en:"People are just barely starting to get used to girls and guys coming out and doing things.",vocab:["دوب بدأت تتعود","بنات وأولاد","بيطلعوا"]},
      {ar:"بالجد السودان ابتدى يفتح نفسه للعالم — والحمد لله.",ph:"bil-jad as-sudan ibtada yiftah nafsu lil-3alam — w-al-hamdu lillah.",en:"For real, Sudan has started opening itself to the world — praise God.",vocab:["بالجد","ابتدى يفتح نفسه","الحمد لله"]},
    ],
    tip:"Open with يعني to frame the opinion softly. Use لسه to show it's a process. End with بالجد + الحمد لله for conviction."
  },
  {
    qen:"Tell me about a friendship that really tested you and what you learned from it.",
    qar:"حكي لي عن صداقة بجد امتحنتك وشنو تعلمت منها.",
    qph:"haki li 3an sadaqa bil-jad imtahanak w-shinoo ta3allamtu minha.",
    context:"Speak about real relationships the Sudanese way — honest, with reflection and values.",
    required:["امتحنت العلاقة","إخلاص / مخلص","يعني"],
    bonus:["بيناتنا","بالجد","اللي بيناتنا أكبر"],
    model:[
      {ar:"يعني كل علاقة حقيقية لازم تتمتحن في لحظة معينة.",ph:"ya3ni kull 3alaqa haqiqi lazim timtahan fi lahza mu3ayyana.",en:"I mean every real relationship must be tested at a certain moment.",vocab:["يعني","علاقة","لازم","تتمتحن"]},
      {ar:"اللي بيناتنا كان أكبر من أي مشكلة — وده اللي خلانا نكمّل.",ph:"alli beiyna kan akbar min ayy mushkila — w-dah alli khallana nkammil.",en:"What was between us was bigger than any problem — and that's what kept us going.",vocab:["بيناتنا","أكبر","خلانا","نكمّل"]},
      {ar:"الزول المخلص بيبقى مخلص حتى في أصعب اللحظات — بالجد.",ph:"az-zool al-mukhlis yibqa mukhlis hatta fi as3ab al-lahzaat — bil-jad.",en:"A sincere person stays sincere even in the hardest moments — for real.",vocab:["المخلص","حتى","أصعب","بالجد"]},
    ],
    tip:"يعني is your opener. بيناتنا carries the emotional weight. End with the lesson about مخلص — that's the Sudanese way to close."
  },
  {
    qen:"What's the difference between someone who's a real artist and someone who's just skilled?",
    qar:"شنو الفرق بين الزول الفنان الحقيقي والزول الصناعي الشاطر بس؟",
    qph:"shinoo al-farq bayn az-zool al-fanan al-haqiqi w-az-zool as-sona3y ash-shater bas?",
    context:"This is Solja's core philosophy. Try to explain the distinction in your own words naturally.",
    required:["فنان","صناعي شاطر","يعني"],
    bonus:["صراحة","فاهماني","بالجد"],
    model:[
      {ar:"يعني الفرق كبير شديد. الفنان عنده حاجة جوّاه دايرة تطلع للناس.",ph:"ya3ni al-farq kabeer shadid. al-fanan 3anduh haga juwwah dayra titla3 lin-nas.",en:"I mean the difference is huge. The artist has something inside them that wants to come out to people.",vocab:["يعني","الفنان","جوّاه","دايرة تطلع"]},
      {ar:"الصناعي الشاطر ممكن يكون بارع شديد — لكن مدخله من الناحية التقنية، مش من الإحساس.",ph:"as-sona3y ash-shater mumkin yakoon bari3 shadid — lakin madkhaluh min an-nahya at-taqniyya, mish min al-ihsas.",en:"The skilled craftsman can be very talented — but their entry point is technical, not feeling.",vocab:["الصناعي الشاطر","بارع","التقنية","الإحساس"]},
      {ar:"وما فيها ديس ريسبكت — لكن صراحة أنا بعتبرك فنان لما بتتعامل مع نفسك كفنان.",ph:"w-ma fiha disrespect — lakin saraha ana ba3tabrak fanan lamma bittita3amal ma3 nafsak ka-fanan.",en:"And there's no disrespect — but honestly I consider you an artist when you treat yourself as an artist.",vocab:["ما فيها ديس ريسبكت","صراحة","بعتبرك","كفنان"]},
    ],
    tip:"يعني opens the comparison. Use الفنان and الصناعي as the two poles. End with صراحة to land your personal view."
  },
  {
    qen:"Tell me about a time you felt like giving up and what made you keep going.",
    qar:"حكي لي عن وقت حسست إنك دايرت توقف وشنو خلاك تكمّل.",
    qph:"haki li 3an waqt hassayt innak dayirt tawwaqquuf w-shinoo khallak tkammil.",
    context:"Be honest and real. This is a personal question — give it depth the Sudanese way.",
    required:["بتخليني أحبط","كمّل المشوار","الحمد لله"],
    bonus:["صراحة","بالجد","فاهماني"],
    model:[
      {ar:"صراحة كانت في فترات الهيت كومنتس كانت بتخليني أحبط شديدة.",ph:"saraha kanat fi fatraat al-hate comments kanat bittkhallini ahbat shadida.",en:"Honestly there were periods when the hate comments were making me feel really defeated.",vocab:["صراحة","الهيت كومنتس","بتخليني أحبط","فترات"]},
      {ar:"لكن بعدين بشوف إنو الناس اللي بتحبني أكتر بكتير من الناس اللي ما بتحبني.",ph:"lakin ba3dayn bashoof innu an-nas alli bitthibbni aktar bi-kateer min an-nas alli ma bitthibbni.",en:"But then I see that the people who love me are far more than the people who don't.",vocab:["بعدين","الناس","أكتر بكتير","ما بتحبني"]},
      {ar:"والحمد لله — كمّل المشوار. لسه قدامك كتير ولا أقل.",ph:"w-al-hamdu lillah — kammil al-mishwar. lissa qaddamak kateer wala aqall.",en:"Praise God — complete the journey. There's still so much ahead, not less.",vocab:["الحمد لله","كمّل المشوار","لسه","قدامك"]},
    ],
    tip:"صراحة opens honesty. بتخليني أحبط is the emotional dip. The turn comes with لكن بعدين. Close with الحمد لله + كمّل المشوار."
  },
  {
    qen:"How do you define loyalty in a friendship?",
    qar:"كيف بتعرّف الإخلاص في الصداقة؟",
    qph:"kif bita3arrif al-ikhlaas fi as-sadaaqa?",
    context:"Go deep. Think about the values Solja talked about regarding 77 and Montiago.",
    required:["إخلاص / مخلص","بيناتنا","يعني"],
    bonus:["بالجد","فاهماني","المصلحة"],
    model:[
      {ar:"يعني الإخلاص عندي إنك تختار مصلحة صاحبك على مصلحتك أنت.",ph:"ya3ni al-ikhlaas 3indi innak takhtar maslahat sahibak 3ala maslahatak anta.",en:"I mean loyalty to me means you choose your friend's interest over your own.",vocab:["يعني","الإخلاص","مصلحة صاحبك","مصلحتك أنت"]},
      {ar:"وما في زول فينا اختار مصلحته على مصلحة الثاني — ده هو المعيار عندي.",ph:"w-ma fi zool feena ikhtar maslahtuh 3ala maslahat at-tani — dah huw al-mi3yaar 3indi.",en:"And neither of us chose their interest over the other's — that's the standard for me.",vocab:["ما في زول","اختار مصلحته","المعيار"]},
      {ar:"بالجد اللي بيناتنا ده أكبر من أي كلام — الإخلاص بيتبيّن في المواقف مش في الكلام.",ph:"bil-jad alli beiyna dah akbar min ayy kalaam — al-ikhlaas bittibayyan fi al-mawaqif mish fi al-kalaam.",en:"For real what's between us is bigger than any words — loyalty shows in moments, not in words.",vocab:["بالجد","بيناتنا","الإخلاص","في المواقف"]},
    ],
    tip:"يعني sets up your definition. Use مصلحة to talk about interests. End with بالجد + بيناتنا for the emotional punch."
  },
  {
    qen:"What's something society expects of you that you refuse to do?",
    qar:"شنو حاجة المجتمع بيتوقعها منك وأنت ترفضها؟",
    qph:"shinoo haga al-mujtama3 biyitawaqqa3ha minnak w-anta tarfudha?",
    context:"Be direct. Use language from the videos — about society, expectations, norms.",
    required:["يتحدّوا النورم","التقبل","صراحة"],
    bonus:["كوني كونيك","يعني","بالذات"],
    model:[
      {ar:"صراحة المجتمع دايماً بيتوقع منك إنك تكون في قالب معين.",ph:"saraha al-mujtama3 dayiman biyitawaqqa3 minnak innak takoon fi qalib mu3ayyan.",en:"Honestly society always expects you to fit in a certain mold.",vocab:["صراحة","المجتمع","بيتوقع","قالب معين"]},
      {ar:"لكن أنا شايف إنو التقبل هو اللي نحتاجه — قبل ما نطلب من الناس تتغير.",ph:"lakin ana shaayif innu at-taqabbul huw alli nihtaajuh — qabl ma nutlub min an-nas titghayyar.",en:"But I think acceptance is what we need — before we ask people to change.",vocab:["لكن","التقبل","قبل ما","تتغير"]},
      {ar:"وكوني كونيك — أنا بعمل اللي بحبه وأنت حر تعمل اللي بتحبه.",ph:"w-kowni kownik — ana ba3mil alli bihibbuh w-anta hurr ta3mil alli bitthibbuh.",en:"And be yourself — I do what I love and you're free to do what you love.",vocab:["كوني كونيك","بحبه","حر","بتحبه"]},
    ],
    tip:"صراحة opens the critique. التقبل carries the nuance. كوني كونيك gives the positive close."
  },
  {
    qen:"If you could go back in time, what would you tell your younger self?",
    qar:"لو تقدر ترجع في الوقت، شنو حتقول لنفسك الصغيرة؟",
    qph:"lau tiqdar tirja3 fi al-waqt, shinoo hattiqool li-nafsak as-sagheera?",
    context:"Reflective and personal. Use the wisdom language from both podcasts.",
    required:["لسه في البداية","ما تخاف من النجاح","تطور من نفسي"],
    bonus:["صراحة","بالجد","الحمد لله"],
    model:[
      {ar:"حقول لنفسي الصغيرة — أنت لسه في البداية وما تستعجل.",ph:"haqool li-nafsi as-sagheera — anta lissa fi al-bidaya w-ma tista3jil.",en:"I'd tell my younger self — you're still at the beginning and don't rush.",vocab:["أنت لسه في البداية","ما تستعجل"]},
      {ar:"وما تخاف من النجاح — الخوف من النجاح أكثر حاجة ممكن توقفك.",ph:"w-ma tikhaaf min an-najah — al-khawf min an-najah akthar haga mumkin tawqifak.",en:"And don't be afraid of success — the fear of success is the thing most likely to stop you.",vocab:["ما تخاف من النجاح","الخوف","أكثر حاجة","توقفك"]},
      {ar:"وتطور دايماً من نفسك — الله بالنهاية اللي بيفتح الأبواب.",ph:"w-tatawwar dayiman min nafsak — allah bil-nihaya alli biyiftah al-abwab.",en:"And always develop yourself — God is ultimately the one who opens the doors.",vocab:["تطور من نفسك","الله","بيفتح","الأبواب"]},
    ],
    tip:"لسه في البداية is the reassurance. ما تخاف من النجاح is the biggest lesson. End with God opening doors — the natural Sudanese close."
  },
  {
    qen:"Talk me through what a typical good day looks like for you.",
    qar:"حكيلي عن يوم كويس عادي بالنسبة لك — كيف بيكون؟",
    qph:"hakiili 3an yoom kuayis 3aadi bil-nisba lak — kif biyakoon?",
    context:"Describe a good day naturally, using everyday Sudanese phrases.",
    required:["تكلة","نفسية","الحمد لله"],
    bonus:["يعني","وبتاع","هسه"],
    model:[
      {ar:"يوم كويس عندي يكون فيه شوية تكلة — قعدة وشاي وناس بحبهم وبتاع.",ph:"yoom kuayis 3andi yakoon fih shuwayya takla — qa3da w-shaay w-naas bihibbum w-bita3.",en:"A good day for me has some ease in it — sitting, tea, people I love, and stuff.",vocab:["تكلة","قعدة","بحبهم","وبتاع"]},
      {ar:"ونفسيتي تكون هادية — ما في ضغط ما في حاجة مضايقاني.",ph:"w-nafseeyti takoon haadiya — ma fi daght ma fi haga mudaayqaani.",en:"And my mental state is calm — no pressure, nothing bothering me.",vocab:["نفسيتي","هادية","ما في ضغط","مضايقاني"]},
      {ar:"والحمد لله على أي يوم فيه الصحة والسلامة والناس الكويسين.",ph:"w-al-hamdu lillah 3ala ayy yoom fih as-sihha w-as-salaama w-an-nas al-kuayseen.",en:"And praise God for any day that has health, safety, and good people.",vocab:["الحمد لله","الصحة","السلامة","الناس الكويسين"]},
    ],
    tip:"تكلة signals ease and leisure. نفسيتي هادية is the emotional state. End with الحمد لله — gratitude is the Sudanese way to close any reflection."
  },
  {
    qen:"What does the Sudanese war mean to you personally and how has it affected your path?",
    qar:"شنو معنى الحرب السودانية بالنسبة لك شخصياً وكيف أثّرت في مسارك؟",
    qph:"shinoo ma3na al-harb as-sudaniyya bil-nisba lak shakhsiyan w-kif athharat fi masaarak?",
    context:"This is a heavy, personal topic. Speak with honesty and depth. Reference what Solja said.",
    required:["الحرب غيّرت السيناريو","السلاح بتاعي","الحمد لله"],
    bonus:["مجهول","صراحة","بالجد"],
    model:[
      {ar:"الحرب غيّرت السيناريو بتاع حياتي كله في لحظة — أول مرة ما عارف الجاي شنو.",ph:"al-harb ghayyarat as-sinaryo bata3 hayaati kullu fi lahza — awwal marra ma 3arif al-jay shinoo.",en:"The war changed the entire scenario of my life in a moment — first time I don't know what's coming.",vocab:["الحرب غيّرت","السيناريو","في لحظة","ما عارف الجاي"]},
      {ar:"صراحة كانت تجربة مجهول تماماً — والخوف من المجهول ده كان أصعب حاجة.",ph:"saraha kanat tajribat majhool tamaman — w-al-khawf min al-majhool dah kan as3ab haga.",en:"Honestly it was a completely unknown experience — and the fear of the unknown was the hardest thing.",vocab:["صراحة","مجهول تماماً","الخوف","أصعب حاجة"]},
      {ar:"لكن الحمد لله — شيلت السلاح بتاعي معي وكمّلت. المزيكة ما خلّيتها.",ph:"lakin al-hamdu lillah — shilt as-silah bata3i ma3i w-kammalt. al-moozeeka ma khallaytha.",en:"But praise God — I took my weapon with me and kept going. I didn't leave the music.",vocab:["الحمد لله","السلاح بتاعي","كمّلت","ما خلّيتها"]},
    ],
    tip:"Open with the disruption — غيّرت السيناريو. Build with مجهول for the fear. Turn it with الحمد لله + السلاح بتاعي — music as survival."
  },
  {
    qen:"Do you think social media shows people's real personalities or a curated version?",
    qar:"بتحس إنو السوشيال ميديا بتوري شخصيات الناس الحقيقية ولا نسخة مرتبة؟",
    qph:"bitthiss innu social media bittwarri shakhsiyyaat an-nas al-haqiiqiyya walla nuskha murattaba?",
    context:"Give a nuanced opinion. Reference what Ala said about sides vs. the full person.",
    required:["ما في إنسان ممكن يوريك كل شخصياته","بوريكم سايد","يعني"],
    bonus:["صراحة","فاهماني","على طبيعتك"],
    model:[
      {ar:"يعني صراحة ما في إنسان ممكن يوريك كل شخصياته — ومش المفروض.",ph:"ya3ni saraha ma fi insan mumkin yawrreek kull shakhsiyyatuh — w-mish al-mafrood.",en:"I mean honestly no person can show you all their sides — and they shouldn't have to.",vocab:["يعني","صراحة","كل شخصياته","ومش المفروض"]},
      {ar:"أنا بوريكم سايد مني — الجانب اللي أنا مرتاح أشاركه مع الناس.",ph:"ana bawwarreekum side minni — al-jaanib alli ana murtaah ashaarikuh ma3 an-nas.",en:"I show you a side of me — the side I'm comfortable sharing with people.",vocab:["بوريكم سايد","الجانب","مرتاح أشاركه"]},
      {ar:"لكن لما تكون على طبيعتك — الناس بيحسوا بيها وبيتفاعلوا أكتر.",ph:"lakin lamma takoon 3ala tabi3tak — an-nas biyihissuu biha w-bittifa3aluu aktar.",en:"But when you're in your natural state — people feel it and engage more.",vocab:["على طبيعتك","بيحسوا بيها","بيتفاعلوا أكتر"]},
    ],
    tip:"يعني صراحة together is the opener for nuanced opinions. بوريكم سايد is the honest middle. على طبيعتك is the wise close."
  },
  {
    qen:"What do you think makes something truly Sudanese — in music, food, culture?",
    qar:"شنو اللي بيخلي حاجة سودانية حقاً — في الموسيقى والأكل والثقافة؟",
    qph:"shinoo alli bikhalli haga sudaniyya haqan — fi al-moozeqa w-al-akl w-ath-thaqaafa?",
    context:"This is a cultural pride question. Be passionate and specific.",
    required:["اللهجة بتاعتنا","هويتنا","بالذات"],
    bonus:["فخور","نمثّل","صراحة"],
    model:[
      {ar:"اللي بيخلي الحاجة سودانية هو الروح اللي جوّاها — بالذات في اللهجة والأسلوب.",ph:"alli bikhalli al-haga sudaniyya huw ar-rooh alli juwwaha — bil-zat fi al-lahja w-al-uslub.",en:"What makes something Sudanese is the soul inside it — especially in the dialect and style.",vocab:["اللي بيخلي","الروح","جوّاها","بالذات","اللهجة"]},
      {ar:"اللهجة بتاعتنا جزء من هويتنا — لما بتسمع السوداني بيتكلم بتحس بحاجة مختلفة.",ph:"al-lahja bata3tna juz' min huwiyyatna — lamma tism3 as-sudaani biyitakallam btihiss bi-haga mukhtalifa.",en:"Our dialect is part of our identity — when you hear a Sudanese person speak you feel something different.",vocab:["اللهجة بتاعتنا","هويتنا","بتسمع","بتحس"]},
      {ar:"وأنا فخور بكل حاجة فينا — من الكندكة للهبوب للفول والطعمية.",ph:"w-ana fakhoor bi-kull haga fiina — min al-kandaka lil-haboob lil-fool w-at-ta3miyya.",en:"And I'm proud of everything in us — from the kandaka to the haboob to the ful and falafel.",vocab:["فخور","الكندكة","الهبوب","الفول والطعمية"]},
    ],
    tip:"بالذات grounds the cultural point. اللهجة بتاعتنا هويتنا is the core statement. End with فخور + a list of Sudanese things."
  },
  {
    qen:"What's the hardest part about building an audience from scratch?",
    qar:"شنو أصعب حاجة في بناء جمهور من الصفر؟",
    qph:"shinoo as3ab haga fi bina' jamhoor min as-sifr?",
    context:"Be practical and honest. Think about what both Ala and Solja described.",
    required:["الجمهور","الانتشار الواسع","صراحة"],
    bonus:["يعني","بالجد","شديد"],
    model:[
      {ar:"صراحة أصعب حاجة إنك تفضل ثابت في الوقت اللي ما في زول شايفك.",ph:"saraha as3ab haga innak tifadal thabit fi al-waqt alli ma fi zool shayyifak.",en:"Honestly the hardest thing is staying consistent when no one is watching yet.",vocab:["صراحة","تفضل ثابت","ما في زول","شايفك"]},
      {ar:"يعني الجمهور ما بييجي في يوم وليلة — بياخذ وقت وصبر شديد.",ph:"ya3ni al-jamhoor ma biyiiji fi yoom w-layla — biyaakhuz waqt w-sabr shadid.",en:"I mean the audience doesn't come in a day and night — it takes time and a lot of patience.",vocab:["يعني","الجمهور","ما بييجي","صبر شديد"]},
      {ar:"لكن لما الانتشار الواسع بييجي — الحمد لله — بتحس إنو كل الوقت دا كان يستاهل.",ph:"lakin lamma al-intishar al-wasi3 biyiiji — al-hamdu lillah — btihiss innu kull al-waqt daa kan yistaahil.",en:"But when the wide reach comes — praise God — you feel like all that time was worth it.",vocab:["الانتشار الواسع","الحمد لله","كل الوقت","يستاهل"]},
    ],
    tip:"صراحة + ما في زول شايفك is the honest reality. يعني builds the point. Close with الانتشار الواسع + الحمد لله — the payoff."
  },
  {
    qen:"When you meet someone new, how do you know if they're genuinely good or not?",
    qar:"لما بتلتقي بزول جديد، كيف بتعرف إنو أصيل ولا لأ؟",
    qph:"lamma bittiltaqi bi-zool jadeed, kif bita3rif innu aseel walla la?",
    context:"This is about reading people — use السنسر language and character vocabulary.",
    required:["السنسر بتاعك","أصلي","يعني"],
    bonus:["صراحة","الإخلاص","فاهماني"],
    model:[
      {ar:"يعني السنسر بتاعي بيعلى مع الوقت — بتبدأ تقرأ الناس أسرع.",ph:"ya3ni as-sensor bata3i bi3la ma3 al-waqt — batibda tiqra an-nas asra3.",en:"I mean my sensor gets sharper with time — you start reading people faster.",vocab:["يعني","السنسر بتاعي","بيعلى","تقرأ الناس"]},
      {ar:"الزول الأصلي — بتحسه. ما في أداء. بيكون على طبيعته دايماً.",ph:"az-zool al-asli — btihissuh. ma fi adaa'. bikoon 3ala tabi3tuh dayiman.",en:"The real person — you feel them. No performance. They're always in their natural state.",vocab:["الأصلي","بتحسه","ما في أداء","على طبيعته"]},
      {ar:"صراحة الإخلاص بيبيّن في المواقف مش في الكلام — ده هو الاختبار.",ph:"saraha al-ikhlaas bittibayyan fi al-mawaqif mish fi al-kalaam — dah huw al-ikhtibaar.",en:"Honestly sincerity shows in moments not in words — that's the test.",vocab:["صراحة","الإخلاص","في المواقف","الاختبار"]},
    ],
    tip:"السنسر بتاعي is the frame. أصلي is the quality you're looking for. Close with صراحة + الإخلاص في المواقف — the real measure."
  },
  {
    qen:"Describe your dream collaboration — who, what style, and why.",
    qar:"وصفلي الكولابوريشن بتاع أحلامك — مع منو وبأي أسلوب وليه؟",
    qph:"wassiflii al-collaboration bata3 ahlaamak — ma3 manoo w-bi-ayy uslub w-layyh?",
    context:"Be specific and passionate. Use music industry vocabulary naturally.",
    required:["كولابوريشن","التمايز","يعني"],
    bonus:["بالجد","رهيب","صراحة"],
    model:[
      {ar:"يعني الكولابوريشن اللي بحلم فيه يكون مع زول فيه تمايز حقيقي — مش بس شهرة.",ph:"ya3ni al-collaboration alli bihlam fih yakoon ma3 zool fih tamayuz haqiqi — mish bas shuhra.",en:"I mean the collaboration I dream of is with someone who has real distinction — not just fame.",vocab:["يعني","الكولابوريشن","تمايز حقيقي","مش بس شهرة"]},
      {ar:"زول عنده مدرسته وأسلوبه الخاص — بتفهم شغله وبتحس إنو فنان مش صناعي.",ph:"zool 3anduh madrasatuh w-uslubuh al-khas — btifham shughluh w-btihiss innu fanan mish sona3y.",en:"Someone with their own school and their own style — you understand their work and feel they're an artist not a craftsman.",vocab:["مدرسته","أسلوبه الخاص","فنان","مش صناعي"]},
      {ar:"بالجد الحاجة اللي بتعملها مع زول زي دا ممكن تكون رهيبة شديد.",ph:"bil-jad al-haga alli bita3milha ma3 zool zay daa mumkin takoon rahiba shadid.",en:"For real what you could make with someone like that could be incredibly amazing.",vocab:["بالجد","ممكن تكون","رهيبة","شديد"]},
    ],
    tip:"يعني leads the vision. تمايز حقيقي is the key distinction. Close with بالجد + رهيبة شديد — Sudanese enthusiasm."
  },
  {
    qen:"What do you miss most about Sudan?",
    qar:"شنو أكتر حاجة بتوحشك في السودان؟",
    qph:"shinoo aktar haga bittawhhishak fi as-sudan?",
    context:"This is emotional. Let yourself be vulnerable. Warm, real Sudanese language.",
    required:["بريدك","حبوب","صراحة"],
    bonus:["الحمد لله","بالجد","وبتاع"],
    model:[
      {ar:"صراحة اللي بوحشني أكتر هو الناس — حبوبتي وأهلي وأصحابي الكان.",ph:"saraha alli bawwahhishni aktar huw an-nas — habubti w-ahli w-ashaabi al-kan.",en:"Honestly what I miss most is the people — my grandmother, my family, my original friends.",vocab:["صراحة","بوحشني","حبوبتي","أهلي"]},
      {ar:"وبريدهم كلهم. يعني الحنين ده حاجة صعبة ما في كلمات توصفها.",ph:"w-bareeduhum kulluhum. ya3ni al-haneen dah haga sa3ba ma fi kalimaat tawsifha.",en:"And I love them all deeply. I mean that nostalgia is something so difficult, there are no words to describe it.",vocab:["بريدهم","كلهم","الحنين","ما في كلمات"]},
      {ar:"لكن الحمد لله — إنهم بخير ونحنا بخير — ده هو المهم في النهاية.",ph:"lakin al-hamdu lillah — inhum bi-khayr w-nihna bi-khayr — dah huw al-muhimm fi an-nihaya.",en:"But praise God — they're well and we're well — that's what matters in the end.",vocab:["الحمد لله","بخير","المهم","في النهاية"]},
    ],
    tip:"صراحة + personal nouns (حبوبتي، أهلي) makes it feel real. يعني الحنين ده is deeply Sudanese. Close with الحمد لله — always."
  },
  {
    qen:"Talk about a time someone gave you really important advice that changed you.",
    qar:"حكيلي عن وقت زول دالك على حاجة مهمة غيّرت فيك.",
    qph:"hakiili 3an waqt zool dallak 3ala haga muhimma ghayyarat fiik.",
    context:"Reflect and be grateful. Use language of learning and growth.",
    required:["دفنتلي","تطور من نفسي","شكراً"],
    bonus:["بالجد","يعني","الحمد لله"],
    model:[
      {ar:"في زول قال لي حاجة بسيطة — لكنها دفنتلي وما خرجت من بالي.",ph:"fi zool qaal li haga basseeta — laakinha dafantili w-ma kharajat min baali.",en:"Someone said something simple to me — but it settled deep in me and never left my mind.",vocab:["قال لي حاجة","بسيطة","دفنتلي","ما خرجت من بالي"]},
      {ar:"قال لي: أنت ما لازم تثبت لحد حاجة — بس تطور من نفسك.",ph:"qaal li: anta ma lazim tuthbit li-hadd haga — bas tatawwir min nafsak.",en:"He said: you don't have to prove anything to anyone — just develop yourself.",vocab:["ما لازم تثبت","لحد","بس تطور من نفسك"]},
      {ar:"يعني بالجد شكراً لكل زول قالك حاجة بجد حتى لو كانت في الوقت الغلط.",ph:"ya3ni bil-jad shukran li-kull zool qallak haga bil-jad hatta lau kanat fi al-waqt al-ghalit.",en:"I mean for real thank you to every person who told you something real even if it was at the wrong time.",vocab:["يعني","بالجد","شكراً","في الوقت الغلط"]},
    ],
    tip:"قال لي حاجة opens the story. دفنتلي carries the emotional weight. Close with يعني بالجد شكراً — a generous, warm Sudanese close."
  },
];

// ── Flow state ──
const FLOW_SETS = [
  {
    topic:"Talking about yourself on social media",
    title:"Who you are as a creator",
    sentences:[
      {en:"Honestly, I've been doing social media for about a year and a half now.",ar:"صراحة، أنا بعمل سوشيال ميديا من حوالي سنة ونص.",ph:"saraha, ana ba3mil social media min hawali sana w-nus.",note:"Lead with صراحة to sound natural and honest.",vocab:["صراحة","سنة ونص"]},
      {en:"People know me mainly for cooking videos, but I also do fashion content.",ar:"الناس عارفاني بالذات من فيديوهات الطبيخ، لكن بعمل فاشن كمان.",ph:"an-nas 3arfani bil-zat min videohaat at-tabikh, lakin ba3mil fashion kaman.",note:"Use بالذات to mean 'especially' or 'mainly known for'.",vocab:["بالذات","الطبيخ","كمان"]},
      {en:"I hate the word influencer — it carries massive responsibility.",ar:"بكره كلمة إنفلونسر — فيها مسؤولية شديدة.",ph:"bakra kalimat influencer — fiha mas'uliyya shadida.",note:"بكره is strong — 'I really hate.' فيها مسؤولية = 'it carries responsibility.'",vocab:["بكره","مسؤولية","شديدة"]},
      {en:"I just say I do social media — no self-glorification in that.",ar:"بقول بعمل سوشيال ميديا — ما فيها تعظيم لنفسي.",ph:"baqool ba3mil social media — ma fiha ta3zeem li-nafsi.",note:"ما فيها تعظيم = 'no inflation of yourself' — a humility phrase.",vocab:["ما فيها","نفسي"]},
      {en:"I provide entertainment — no more, no less. That's my lane.",ar:"بقدم انترتينمنت — لا أكثر لا أقل. دا لين بتاعي.",ph:"baqaddim entertainment — la akthar la aqal. da lane bata3i.",note:"لا أكثر لا أقل is a great phrase to define your role clearly.",vocab:["بقدم","لا أكثر لا أقل"]},
    ]
  },
  {
    topic:"Talking about friendship and loyalty",
    title:"Real relationships vs. surface ones",
    sentences:[
      {en:"My circle is always small and I'm happy with that, honestly.",ar:"السيركل بتاعتي دايماً ضيقة وأنا مبسوط بكدا، صراحة.",ph:"as-circle bata3ti dayiman dayyiqa w-ana mabsoot bikida, saraha.",note:"ضيقة here means 'tight/small' — a deliberate choice, not a problem.",vocab:["السيركل بتاعتي","دايماً","صراحة"]},
      {en:"Every time you succeed, your relationships get tested. That's just how it goes.",ar:"كل مرة تنجح تمتحن علاقاتك. ألو هو كده بيصير.",ph:"kull marra tinjah timtahan 3alaaqatak. alu hwa kida biseer.",note:"ألو هو = 'so that's just it / that's how it is.' Great closure phrase.",vocab:["تمتحن","العلاقة","ألو هو"]},
      {en:"I swear what's between us is bigger than what people see.",ar:"والله اللي بيناتنا أكبر من اللي الناس شايفينه.",ph:"wallahi alli beiyna akbar min alli an-nas shayfinnuh.",note:"Open with والله to add sincerity weight.",vocab:["بيناتنا","الناس"]},
      {en:"A sincere person is sincere to their work AND their friends — you can't separate the two.",ar:"الزول المخلص بيكون مخلص لشغله وأصحابه — ما تقدر تفصل.",ph:"az-zool al-mukhlis bikoon mukhlis li-shughluh w-ashabuh — ma tidar tifsal.",note:"مخلص is the most important character compliment in Sudanese Arabic.",vocab:["المخلص","شغله","أصحابه"]},
      {en:"People who genuinely love each other don't choose their own interests over the other person.",ar:"الناس اللي بتحب بعض ما بتختار مصلحتها على مصلحة الطرف الثاني.",ph:"an-nas alli bittihib ba3d ma bittkhtar maslahtha 3ala maslahat at-taraf at-tani.",note:"مصلحة = self-interest. الطرف الثاني = the other party/side.",vocab:["مصلحة","الطرف الثاني","بتحب"]},
    ]
  },
  {
    topic:"Talking about effort, success and failure",
    title:"The philosophy of hard work",
    sentences:[
      {en:"The world gives you to the extent that you work hard — not more, not less.",ar:"الدنيا بتديك على قدر ما أنت بتجتهد — لا أكثر لا أقل.",ph:"ad-dunya biddeek 3ala gadr ma anta bitujtahid — la akthar la aqal.",note:"على قدر ما is a proportional connector — 'to the extent that.'",vocab:["على قدر ما","الدنيا","بتجتهد"]},
      {en:"Success and failure are intertwined like night and day — you can't have one without the other.",ar:"النجاح والفشل مترادفين زي الليل والنهار — ما تقدر تاخذ واحدة بدون الثانية.",ph:"an-najah wal-fashal mutaradifeen zay al-layl w-an-nahar.",note:"مترادفين = intertwined/inseparable. A really elegant way to frame struggle.",vocab:["النجاح","الفشل","مترادفين","زي"]},
      {en:"You don't know what you don't know — the doors that could open, you can't even imagine.",ar:"ما عارف اللي ما عارفه — الأبواب اللي ممكن تفتح ما تتخيلها.",ph:"ma 3arif alli ma 3arfu — al-abwab alli mumkin tiftah ma tittakhayyal.",note:"A great humility phrase. Pair with if you keep grinding / بتنحت في الصخر.",vocab:["ما عارف","الأبواب","ممكن"]},
      {en:"If you keep chiseling at the rock, you'll get there. I genuinely believe that.",ar:"لو فضلت تنحت في الصخر حتوصل. أنا بالجد مؤمن بكدا.",ph:"lau fadalt tenhat fi as-sakhr hatwassal. ana bil-jad mu'min bikida.",note:"بالجد = 'for real / genuinely.' Great to close a belief statement with.",vocab:["بتنحت في الصخر","بالجد","حتوصل"]},
      {en:"Expectations are always the enemy of the person. Let go of them and just work.",ar:"التوقعات دايماً عدو الإنسان. خلّيها وشغّل.",ph:"at-tawaqqu3at dayiman 3aduw al-insan. khalleeha w-shaghghil.",note:"خلّيها = let go of them. شغّل = just work/start working.",vocab:["التوقعات","عدو","الإنسان"]},
    ]
  },
  {
    topic:"Talking about fame and what it changes",
    title:"When your world suddenly gets bigger",
    sentences:[
      {en:"When the reach came, it was a surprise — it blew up more than I expected.",ar:"الانتشار لما جا كان مفاجأة — بقى بوزة زيادة على اللي توقعت.",ph:"al-intishar lamma ja kan mufaja'a — biqa boza ziyada 3ala alli tawaqqa3t.",note:"بقى بوزة زيادة = 'became too much / exceeded expectations.'",vocab:["الانتشار","بوزة زيادة","مفاجأة"]},
      {en:"When it happened I was young — 23 or 24. I hadn't matured enough yet.",ar:"لما حصل كنت صغير — 23 أو 24. ما نضجت كفاية وقتها.",ph:"lamma hasal kunt sagheer — 23 aw 24. ma nadajt kifaya waqtiha.",note:"ما نضجت = 'I hadn't ripened/matured.' كفاية = enough.",vocab:["صغير","ما نضجت","وقتها"]},
      {en:"A lot of people started entering your life and you don't know how to deal with them.",ar:"كميه من الناس بدت تدخل حياتك وما عارف كيف تتعامل معاهم.",ph:"kamiyya min an-nas badat tudkhul hayatak w-ma 3arif kif tit3amal ma3ahum.",note:"كمية من الناس = a large quantity/wave of people.",vocab:["كمية","حياتك","تتعامل"]},
      {en:"Your sensor gets sharper as you grow — you start seeing who's real and who's not.",ar:"السنسر بتاعك بيعلى لما بتكبر — بتبدأ تشوف مين حقيقي ومين لأ.",ph:"as-sensor bata3k biy3ala lamma tikkabbar — batibda tshoof meen haqiqi w-meen la.",note:"السنسر بتاعك = 'your sensor' — a very natural English-Arabic mix.",vocab:["السنسر","بتكبر","حقيقي"]},
      {en:"My standards are harder than before — and I'm okay with that.",ar:"الستاندرز بتاعي أصعب من زمان — وأنا مبسوط من كده.",ph:"as-standards bata3i as3ab min zaman — w-ana mabsoot min kida.",note:"من زمان = 'than before / than previously.'",vocab:["الستاندرز","أصعب","من زمان"]},
    ]
  },
  {
    topic:"Dealing with hate and negativity online",
    title:"How to handle criticism and haters",
    sentences:[
      {en:"I can't tell you it doesn't affect me. Honestly it does. But I handle it differently now.",ar:"ما قادر أقول لك ما بتأثر فيني. بالجد بتأثر. بس بتعامل معها بطريقة ثانية هسه.",ph:"ma qadir aqul lak ma bita'athar finni. bil-jad bita'athar. bas bita3amal ma3ha bi-tariqa tanya hissa.",note:"بالجد used here for emphasis on a hard truth. هسه = 'now / these days.'",vocab:["بتأثر","بالجد","هسه","طريقة"]},
      {en:"He has the right to say whatever. That's his opinion. It's not my job to force him to agree.",ar:"من حقه يقول ما شاء. ده رأيه. مش شغلتي أفرض عليه إنو يتفق.",ph:"min haqquh yaqool ma sha'. dah ra'yuh. mish shughliti ufrid 3alayh innu yittafiq.",note:"من حقه يقول = 'he has the right to say.' A key phrase for not being defensive.",vocab:["من حقه","رأيه","أفرض"]},
      {en:"Give the person an excuse — for your own mental state, not for their sake.",ar:"خُذ للزول العذر — عشان نفسيتك، مش عشان الزول.",ph:"khuz lil-zool al-3uzur — 3ashan nafseeytak, mish 3ashan az-zool.",note:"A key wisdom phrase. نفسيتك = your mental state. This is self-protection, not kindness.",vocab:["العذر","نفسيتك","الزول"]},
      {en:"Step back and see what's best for you. The comment was bad but so what.",ar:"رجع روحك لورا وشوف اللي بست فور يو. الكومنت كان سيء بس وشنو.",ph:"raji3 rohak lawwra w-shoof alli best for you. al-comment kan sayyi' bas w-shinoo.",note:"وشنو = 'and so what? / and what about it?' Great dismissal phrase.",vocab:["روحك","لورا","وشنو"]},
      {en:"People will try to break you. But if you genuinely love what you do, they can't.",ar:"الناس حتكسروك. لكن لو بتحب اللي بتعمله بالجد، ما حيقدروا.",ph:"an-nas haykissrook. lakin lau bitthibb alli bita3maluh bil-jad, ma hayyiqdaru.",note:"حتكسروك = 'they'll break you.' ما حيقدروا = 'they won't be able to.'",vocab:["حتكسروك","بتحب","ما حيقدروا"]},
    ]
  },
  {
    topic:"Talking about self-care and not burning out",
    title:"Balance, pressure, and protecting yourself",
    sentences:[
      {en:"I won't pressure myself to put out content just because people expect it.",ar:"ما حضغط على نفسي عشان أطلع كونتنت بس لأن الناس متوقعين.",ph:"ma haddghut 3ala nafsi 3ashan atla3 content bas la'ann an-nas mitawaqqi3een.",note:"ما حضغط على نفسي = 'I won't pressure myself' — strong self-care phrase.",vocab:["ما حضغط","نفسي","متوقعين"]},
      {en:"If you pressure yourself too much, you'll destroy yourself. And then you'll hate the thing you loved.",ar:"لو ضغطت على نفسك كتير، حتهلك روحك. وبعدين حتكره الحاجة اللي بتحبها.",ph:"lau daghattu 3ala nafsak kateer, hatahlak rohak. w-ba3dayn hattikrah al-haga alli bitthibbha.",note:"هلك روحك = 'destroy yourself.' بعدين = 'and then / after that.'",vocab:["ضغطت","تهلك","بعدين","بتحبها"]},
      {en:"Give yourself a break. Life comes with life — things unfold naturally.",ar:"خُدي روحك برييك. الحياة بتجي مع الحياة.",ph:"khudi rohak break. al-hayat bituji ma3 al-hayat.",note:"الحياة بتجي مع الحياة is a beautiful phrase — life brings what it needs naturally.",vocab:["روحك","برييك","الحياة"]},
      {en:"Many things changed suddenly in my life. And honestly I needed time to process.",ar:"في حاجات كتيرة تغيّرت فجأة في حياتي. وصراحة احتجت وقت أستوعب.",ph:"fi hagat katira ghayyarat faj'a fi hayati. w-saraha ihtajt waqt astaw3ib.",note:"فجأة = suddenly. استوعب = to process/absorb/comprehend.",vocab:["تغيّرت فجأة","صراحة","وقت","أستوعب"]},
      {en:"The mental state itself is a challenge. Take care of yourself first.",ar:"النفسيات ذات صعبة. خلّي بالك من نفسك أول.",ph:"an-nafseeyat zat sa3ba. khalli balak min nafsak awwal.",note:"خلّي بالك من نفسك = 'take care of yourself.' أول = first.",vocab:["النفسيات","خلّي بالك","نفسك"]},
    ]
  },
  {
    topic:"Talking about Sudanese culture and identity",
    title:"What it means to represent your culture",
    sentences:[
      {en:"We are smart and we have so many talents — we're not just doctors and engineers.",ar:"نحنا سمارت وعندنا تالنتس كتيرة — ما بس دكاترة ومهندسين.",ph:"nihna smart w-3andna talents katira — ma bas daktara w-muhandisin.",note:"Opening with نحنا makes it inclusive. سمارت is a natural loanword.",vocab:["نحنا","تالنتس","ما بس"]},
      {en:"Sudan is starting to open itself to the world and I love seeing that.",ar:"السودان ابتدى يفتح نفسه للعالم وأنا بحب أشوف كده.",ph:"as-sudan ibtada yiftah nafsu lil-3alam w-ana bihibb ashoof kida.",note:"يفتح نفسه للعالم = 'opens itself to the world.' A proud phrase.",vocab:["ابتدى","يفتح نفسه","العالم"]},
      {en:"We don't have people who represent us like other countries. That's why we have to do it ourselves.",ar:"ما عندنا ناس يمثلوننا زي بقية البلدان. عشان كدا لازم نعمل كده نحنا.",ph:"ma 3andna nas yumassalunna zay baqiyyat al-bildan. 3ashan kida lazim na3mal kida nihna.",note:"عشان كدا = 'that's why / for that reason.' A strong consequence connector.",vocab:["يمثلوننا","بقية البلدان","عشان كدا","لازم"]},
      {en:"Sudanese girls and guys have started coming out and doing things. I love seeing that.",ar:"بنات وأولاد سودانيين بدوا يطلعوا ويعملوا حاجات. بالجد بحب أشوف كده.",ph:"banat w-awlad sudaniyyeen badaw yitla3u w-ya3malu hagat. bil-jad bihibb ashoof kida.",note:"بدوا يطلعوا = 'started coming out / emerging.' بالجد adds genuine emotion.",vocab:["بنات وأولاد","سودانيين","بدوا","بالجد"]},
      {en:"Our dialect is part of who we are. Don't be ashamed of how you speak.",ar:"اللهجة بتاعتنا جزء من هويتنا. ما تخجل من طريقة كلامك.",ph:"al-lahja bata3tna juz' min huwiyyatna. ma tikhjal min tariqat kalamak.",note:"هويتنا = our identity. ما تخجل = don't be ashamed.",vocab:["اللهجة","هويتنا","ما تخجل"]},
    ]
  },
  {
    topic:"Giving advice and encouragement",
    title:"Speaking to someone who wants to start something",
    sentences:[
      {en:"Love what you do — madly. Not just like it. Actually love it.",ar:"حبّ اللي بتعمله جنونياً. مش بس حبه. حبّه فعلاً.",ph:"hibb alli bita3maluh junuuniyyan. mish bas hibbuh. hibbuh fi3lan.",note:"جنونياً = madly/insanely. فعلاً = actually / genuinely.",vocab:["حبّ","جنونياً","فعلاً"]},
      {en:"Throw yourself into it. The sky's the limit — don't put a ceiling on yourself.",ar:"القِ روحك فيه. سكايز دا ليميت — ما تحط على نفسك سقف.",ph:"alqi rohak fih. skies the limit — ma thut 3ala nafsak saqf.",note:"ألقِ روحك فيه = throw your soul into it. سقف = ceiling.",vocab:["روحك","سقف","ما تحط"]},
      {en:"Don't be afraid of success. The only thing that can stop you is yourself.",ar:"ما تخاف من النجاح. الحاجة الوحيدة اللي ممكن توقفك هي نفسك.",ph:"ma tikhaaf min an-najah. al-haga al-wahida alli mumkin tawqifak hiya nafsak.",note:"الحاجة الوحيدة اللي = 'the only thing that...' Great for building emphasis.",vocab:["ما تخاف","النجاح","الوحيدة","نفسك"]},
      {en:"People will try to break you. But look how far the bottom has come already.",ar:"الناس حتكسروك. بس شوف التحت وصل وين بالفعل.",ph:"an-nas haykissrook. bas shoof at-taht wisal ween bil-fi3l.",note:"شوف التحت وصل وين = 'look how far the bottom has come' — acknowledge your growth.",vocab:["حتكسروك","التحت","وصل وين"]},
      {en:"Complete the journey. There's still so much ahead of you. Don't stop now.",ar:"كمّل المشوار. لسه قدامك كتير. ما توقف هسه.",ph:"kammil al-mishwar. lissa qaddamak kateer. ma tawqaf hissa.",note:"كمّل المشوار is one of the most powerful encouragement phrases. لسه = still.",vocab:["كمّل","المشوار","لسه","قدامك"]},
    ]
  },
  {
    topic:"Talking about your creative process",
    title:"How ideas come and how you work",
    sentences:[
      {en:"Honestly, when I'm in a creative block, it's not that I have nothing — I'm usually just planning.",ar:"صراحة لما أكون في كريتيفيتي بلوك، ما معناه إنو ما عندي حاجة — الغالب بكون بخطط.",ph:"saraha lamma akoon fi creativity block, ma ma3nah innu ma 3andi haga — al-ghalib bakoon bakhattit.",note:"ما معناه إنو = 'it doesn't mean that.' The Sudanese way to clarify a misconception.",vocab:["صراحة","كريتيفيتي بلوك","الغالب","بخطط"]},
      {en:"The time when I disappear is usually the time I'm preparing something big.",ar:"الوقت اللي بكون فيه مختفي ده الغالب بيكون وقت تجهيزي.",ph:"al-waqt alli bakoon fih mukhtafi dah al-ghalib bikoon waqt tajheezi.",en2:"مختفي = disappeared/gone quiet. وقت تجهيزي = my preparation time.",note:"Use مختفي to say you've gone quiet intentionally. It signals intention.",vocab:["مختفي","وقت","تجهيزي"]},
      {en:"I always try to develop myself — I don't want to put out the same thing every time.",ar:"دايماً بحاول أطور من نفسي — ما دايري أنزل نفس الحاجة كل مرة.",ph:"dayiman bahawal atawwir min nafsi — ma dayiri anzil nafs al-haga kull marra.",note:"أطور من نفسي = self-development. نفس الحاجة = the same thing.",vocab:["أطور من نفسي","نفس الحاجة","دايماً"]},
      {en:"I want to see what I actually care about and let that guide the content.",ar:"عايز أشوف اللي بهتم بيه فعلاً وأخليه يوجّه الكونتنت.",ph:"3ayiz ashoof alli bahtamm bih fi3lan w-akhallih yuwajjih al-content.",note:"بهتم بيه = 'I care about it.' فعلاً = actually / genuinely.",vocab:["بهتم بيه","فعلاً","يوجّه"]},
      {en:"Life brings life — things unfold naturally when you're not forcing them.",ar:"الحياة بتجي مع الحياة — الأمور بتنكشف لما ما بتجبرها.",ph:"al-hayat bituji ma3 al-hayat — al-umoor btinkashif lamma ma bitjabrha.",note:"تنكشف = to unfold/reveal themselves. ما بتجبرها = when you don't force them.",vocab:["الحياة بتجي","تنكشف","ما بتجبرها"]},
    ]
  },
  {
    topic:"Talking about your audience and connection with people",
    title:"The relationship between a creator and their followers",
    sentences:[
      {en:"I genuinely love people. Their presence in my life is a blessing I didn't expect.",ar:"بحب الناس بجد. وجودهم في حياتي نعمة ما كنت متوقعها.",ph:"bihibb an-nas bil-jad. wujuudhum fi hayati ni3ma ma kunt mitawaqqi3ha.",note:"نعمة = blessing/gift. ما كنت متوقعها = wasn't expecting it.",vocab:["بحب الناس","وجودهم","نعمة","متوقعها"]},
      {en:"A person you've never met who loves you just through your videos — that's something I couldn't have found without social media.",ar:"زول ما شفته في حياتي بيحبك بس من خلال فيديوهاتك — دي حاجة ما كنت قادر ألاقيها بدون سوشيال ميديا.",ph:"zool ma shuftuh fi hayati bihibbak bas min khilal videohaatak — di haga ma kunt qadir alaaqiha bidoon social media.",note:"ما شفته في حياتي = 'I've never seen him/her in my life.' A powerful phrase for strangers who love you.",vocab:["زول","ما شفته","من خلال","بدون"]},
      {en:"The audience engages more when I'm in my natural state — when I'm performing, they feel it.",ar:"الأوديينس بتتفاعل أكتر لما أكون على طبيعتي — لما بكون بأمثّل يحسوا بيها.",ph:"al-audience bittifa3al aktar lamma akoon 3ala tabi3ti — lamma bakoon bammaththil yihissuu biha.",note:"يحسوا بيها = 'they feel it.' The difference between authentic and performed.",vocab:["على طبيعتي","أتفاعل","يحسوا","بأمثّل"]},
      {en:"The comment — even a negative one — boosts your video. That's just how the algorithm works.",ar:"الكومنت — حتى السلبي — بيرفع لك الفيديو. ألو هو كده الألجوريزم شغّال.",ph:"al-comment — hatta as-salbi — biyirfa3 lak al-video. alu hwa kida al-algorithm shagghal.",note:"ألو هو كده = 'so that's how it is.' Use this to explain facts of life.",vocab:["الكومنت","السلبي","بيرفع","ألو هو"]},
      {en:"I show you a side of me — not all of me. No one can show you all their sides.",ar:"بوريكم سايد مني — مش كل أنا. ما في زول يقدر يوريكم كل شخصياته.",ph:"bawwarreekum side minni — mish kull ana. ma fi zool yiqdar yawwarreekum kull shakhsiyyatuh.",note:"سايد = a side/aspect. كل شخصياته = all their sides/personalities.",vocab:["سايد","كل أنا","كل شخصياته","يوريكم"]},
    ]
  },
  {
    topic:"Talking about why you started",
    title:"The origin story — your first step",
    sentences:[
      {en:"It started when I had some free time and I just began focusing all my energy into it.",ar:"ابتدت لما كان عندي فراغ وبديت أركز كل طاقتي فيه.",ph:"ibtadat lamma kan 3andi faragh w-badit arakkiz kull taqati fih.",note:"فراغ = free time / emptiness. كل طاقتي = all my energy.",vocab:["فراغ","أركز","كل طاقتي"]},
      {en:"I didn't even imagine that someone I know would see the video.",ar:"ما تخيلت إنو زول بعرفه حيشوف الفيديو.",ph:"ma takhayalt innu zool ba3riffuh hayishoof al-video.",note:"ما تخيلت = 'I didn't imagine.' حيشوف = 'would see.'",vocab:["ما تخيلت","زول","بعرفه"]},
      {en:"I started learning to film, then to edit — step by step the thing became something I enjoyed.",ar:"بديت أتعلم أصور، بعدين أديت — شيء فشيء الموضوع بقى حاجة بستمتع بيها.",ph:"badit at3allam assawwir, ba3dayn adit — shay' fa-shay' al-mawdoo3 biqa haga bastamti3 biha.",note:"شيء فشيء = 'step by step / little by little.' A great natural phrase.",vocab:["بديت أتعلم","شيء فشيء","بستمتع"]},
      {en:"My mom was the one who always pushed me — she loved social media before I did.",ar:"ماما كانت دايماً بتشجعني — هي كانت بتحب السوشيال ميديا قبلي.",ph:"mama kanat dayiman bitshajji3ni — hiya kanat bithibb social media qabli.",note:"بتشجعني = 'encourages me.' قبلي = 'before me.'",vocab:["ماما","بتشجعني","دايماً","قبلي"]},
      {en:"And here we are now. Praise God for everything that happened.",ar:"وها نحنا هسه. الحمد لله على كل اللي صار.",ph:"w-haa nihna hissa. al-hamdu lillah 3ala kull alli saar.",note:"وها نحنا = 'and here we are.' صار = happened (past tense, Sudanese).",vocab:["وها نحنا","هسه","الحمد لله","صار"]},
    ]
  },
  {
    topic:"Talking about comparisons and competition",
    title:"Staying in your lane when others compare",
    sentences:[
      {en:"Honestly, comparisons happen — even in your own house your sister compares you to someone.",ar:"صراحة المقارنات بتصير — حتى في بيتك أختك بتقارنك بزول.",ph:"saraha al-muqaaranaat bitsiir — hatta fi baytak ukhtik bitqaarinnak bi-zool.",note:"المقارنات = comparisons. بتصير = happen/occur (Sudanese).",vocab:["المقارنات","بتصير","حتى","أختك"]},
      {en:"The problem isn't when the audience compares. The problem is when creators compare themselves to each other.",ar:"المشكلة مش لما الجمهور يقارن. المشكلة لما الكونتنت كريتورز يقارنوا روحهم ببعض.",ph:"al-mushkila mish lamma al-jamhoor yiqaarin. al-mushkila lamma al-content creators yiqaarnuu roohhum bi-ba3d.",note:"روحهم ببعض = 'themselves to each other.' روح = soul/self here.",vocab:["المشكلة","الجمهور","يقارنوا","روحهم ببعض"]},
      {en:"Every creator has their own style and their own content. That's what makes it interesting.",ar:"كل كريتر عندها أسلوبها وكونتنتها الخاص. ده اللي بيخليه ممتع.",ph:"kull creator 3andha uslubha w-contentha al-khas. dah alli bikhallih mumti3.",note:"أسلوبها = her style. اللي بيخليه = 'what makes it.'",vocab:["أسلوبها","الخاص","ده اللي","ممتع"]},
      {en:"When you compare yourself to someone, you waste your time on what they're doing instead of what you're doing.",ar:"لما بتقارن روحك بزول تاني، بتضيّع وقتك في شنو هو بعمل بدل ما تعمل أنت.",ph:"lamma btiqaarin rohak bi-zool tani, bitdayyyi3 waqtak fi shinoo huw ba3mil badal ma ta3mil anta.",note:"بتضيّع وقتك = 'you waste your time.' بدل ما = 'instead of.'",vocab:["بتقارن روحك","بتضيّع وقتك","بدل ما"]},
      {en:"So what's the point? Be yourself. What you do is yours and no one can do it exactly like you.",ar:"ألو هو شنو الفايدة؟ كوني كونيك. اللي بتعمله بتاعك وما في زول يعمله زيك بالضبط.",ph:"alu hwa shinoo al-fayda? kowni kownik. alli bita3maluh bata3k w-ma fi zool ya3maluh zayyak bil-dabt.",note:"ألو هو = 'so then.' كوني كونيك = be yourself. بالضبط = exactly.",vocab:["ألو هو","كوني كونيك","بالضبط","ما في زول"]},
    ]
  },
  {
    topic:"Talking about the rap/music industry",
    title:"What makes a real artist in a competitive field",
    sentences:[
      {en:"The field is aggressive by nature — it's always been about 'I'm better than you.'",ar:"المجال بطبيعته أجريسيف — دايماً كان عن أنا أشفت منك.",ph:"al-majal bi-tabi3tuh aggressive — dayiman kan 3an ana ashaft minnak.",note:"بطبيعته = 'by its nature.' أشفت منك = 'I'm better than you' (Sudanese slang).",vocab:["المجال","بطبيعته","أجريسيف","أشفت منك"]},
      {en:"But honestly every rapper in real life is kinder than they appear online.",ar:"لكن صراحة كل رابر في حياته الحقيقية ألطف بكتير مما بيبين في الإنترنت.",ph:"lakin saraha kull rapper fi hayatuh al-haqiqiyya altaf bi-kateer mimma bibayyin fi al-internet.",note:"ألطف بكتير = 'much kinder.' مما بيبين = 'than what he shows.'",vocab:["صراحة","ألطف","بكتير","مما بيبين"]},
      {en:"The field asks you to be aggressive — that's what the audience gravitates toward.",ar:"المجال بيطلب منك تكون أجريسيف — ده اللي الأوديينس بيمشي له.",ph:"al-majal biyutlub minnak takoon aggressive — dah alli al-audience biyimshi luh.",note:"بيطلب منك = 'asks of you / demands from you.'",vocab:["بيطلب منك","ده اللي","بيمشي له"]},
      {en:"If I could change one thing, I'd add more opportunities — more space for people who are working hard.",ar:"لو قدرت أغيّر حاجة واحدة، حأزيد الفرص — حأعمل مكان أكبر للناس اللي بتتعب.",ph:"lau qadart aghayyir haga wahida, ha-azid al-furas — ha-a3mil makan akbar li-nas alli bittit3ab.",note:"حأزيد الفرص = 'I'll increase opportunities.' مكان أكبر = more space.",vocab:["حأغيّر","الفرص","مكان أكبر","بتتعب"]},
      {en:"The sincerity is what I look for. A sincere person is sincere across everything — work, friends, life.",ar:"الإخلاص هو اللي بشوف فيه. الزول المخلص بيكون مخلص في كل حاجة — شغله أصحابه حياته.",ph:"al-ikhlaas huw alli bashuuf fih. az-zool al-mukhlis bikoon mukhlis fi kull haga — shughluh ashabuh hayatuh.",note:"الإخلاص هو اللي = 'sincerity is what.' The key value from the transcript.",vocab:["الإخلاص","المخلص","في كل حاجة","شغله"]},
    ]
  },
  {
    topic:"Talking about a difficult period in life",
    title:"When things were hard and how you got through",
    sentences:[
      {en:"There was a period where the whole situation was difficult — mentally, emotionally, everything.",ar:"كان في فترة الوضع كله كان صعب — نفسياً وعاطفياً وكل حاجة.",ph:"kan fi fatra al-wad3 kullu kan sa3b — nafsiyan w-3aatifiyyan w-kull haga.",note:"نفسياً = mentally/psychologically. عاطفياً = emotionally.",vocab:["فترة","الوضع","نفسياً","كل حاجة"]},
      {en:"The mental state itself is a challenge on its own — it doesn't need any extra pressure.",ar:"النفسيات ذات تحدي لوحدها — ما محتاجة ضغط زيادة فوقيها.",ph:"an-nafseeyat zat tahaddi li-wahda — ma muhtaaja daght ziyada fawqiha.",note:"لوحدها = 'on its own.' ما محتاجة = 'doesn't need.' فوقيها = 'on top of it.'",vocab:["النفسيات ذات","لوحدها","ما محتاجة","فوقيها"]},
      {en:"In those times, the person themselves can't even focus. That's the reality.",ar:"في الأوقات دي الإنسان ذاته ما مركزك. دي الحقيقة.",ph:"fi al-awqaat di al-insan zatuh ma markazak. di al-haqeeqa.",note:"الإنسان ذاته ما مركزك = 'the person themselves can't focus.' ذاته = themselves.",vocab:["في الأوقات دي","الإنسان ذاته","ما مركزك","الحقيقة"]},
      {en:"I gave myself a break. I told myself: the thing you love will still be there when you're ready.",ar:"خديت روحي برييك. قلت لنفسي: الحاجة اللي بتحبها ستفضل موجودة لما بتكون ريدي.",ph:"khadayt rohki break. qult li-nafsi: al-haga alli bitthibbha sattifadal maujuuda lamma battakoon ready.",note:"خديت روحي برييك = 'I gave myself a break.' ستفضل = 'will still remain.'",vocab:["خديت روحي","برييك","ستفضل","ريدي"]},
      {en:"And praise God — after the difficulty comes the ease. That's the promise.",ar:"والحمد لله — بعد الضيق بييجي الفرج. دا هو الوعد.",ph:"w-al-hamdu lillah — ba3d ad-dayyq biyiiji al-faraj. dah huw al-wa3d.",note:"بعد الضيق بييجي الفرج = Quranic: 'after hardship comes relief.' الوعد = the promise.",vocab:["الحمد لله","الضيق","الفرج","الوعد"]},
    ]
  },
  {
    topic:"Describing someone you admire",
    title:"How to talk about a person with real depth",
    sentences:[
      {en:"I'm genuinely indebted to this person for things I can't even count.",ar:"أنا مدين له في حاجات كتيرة شديد ما أقدر حتى أعدّها.",ph:"ana madiyn lahu fi hagat katira shadid ma aqdar hatta a3uddha.",note:"مدين له = 'indebted to him.' ما أقدر حتى = 'I can't even.'",vocab:["مدين له","حاجات كتيرة","شديد","ما أقدر"]},
      {en:"On a personal and human level — this person is one of the most sincere people I've met in my life.",ar:"على الصعيد الشخصي والإنساني — الزول دا من أكثر الناس اللي قابلتهم إخلاصاً في حياتي.",ph:"3ala as-sa3eed ash-shakhsi wal-insaani — az-zool daa min akthar an-nas alli qaabilthum ikhlaasan fi hayati.",note:"على الصعيد الشخصي = 'on a personal level.' الإنساني = human/humanitarian.",vocab:["على الصعيد الشخصي","الإنساني","أكثر الناس","إخلاصاً"]},
      {en:"What I love most about them is their sincerity — sincere to their work, their friends, their whole life.",ar:"اللي بحبه فيهم أكتر هو الإخلاص — مخلص لشغله وأصحابه وكل حياته.",ph:"alli bihibbuh fiihum aktar huw al-ikhlaas — mukhlis li-shughluh w-ashaabuh w-kull hayatuh.",note:"اللي بحبه فيهم أكتر = 'what I love most about them.' A beautiful structure.",vocab:["اللي بحبه","أكتر","الإخلاص","كل حياته"]},
      {en:"A loyal person is loyal across everything. That consistency is rare.",ar:"الزول المخلص بيكون مخلص في كل حاجة. الثبات دا نادر.",ph:"az-zool al-mukhlis bikoon mukhlis fi kull haga. ath-thabaat daa nadir.",note:"الثبات = consistency/steadfastness. نادر = rare.",vocab:["المخلص","في كل حاجة","الثبات","نادر"]},
      {en:"Words honestly can't describe it — but the field of Sudanese rap owes a lot to this person.",ar:"الكلمات صراحة ما تقدر تصفه — لكن مجال الراب السوداني مدين كتير لهذا الشخص.",ph:"al-kalimaat saraha ma tiqdar tasfuh — lakin majaal ar-rap as-sudani madiyn kateer li-haza ash-shakhis.",note:"الكلمات ما تقدر تصف = 'words can't describe.' مدين = indebted.",vocab:["الكلمات ما تقدر","تصفه","مجال","مدين"]},
    ]
  },
  {
    topic:"Talking about the Sudanese community abroad",
    title:"Being Sudanese outside of Sudan",
    sentences:[
      {en:"We've started representing more outside — people are getting to know us more.",ar:"بقينا نمثّل أكتر برّا — الناس بدأت تتعرف علينا أكتر.",ph:"baqeena numaththil aktar barra — an-nas badat tit3arraf 3alaina aktar.",note:"نمثّل = to represent. برّا = outside. تتعرف علينا = get to know us.",vocab:["نمثّل","برّا","تتعرف علينا"]},
      {en:"We're smart. We have so many talents. We're not just doctors and engineers.",ar:"نحنا سمارت. عندنا تالنتس كتيرة. ما بس دكاترة ومهندسين.",ph:"nihna smart. 3andna talents katira. ma bas daktara w-muhandisin.",note:"نحنا is the Sudanese 'we.' سمارت is a natural loanword.",vocab:["نحنا","سمارت","تالنتس","ما بس"]},
      {en:"The displacement forced us to open ourselves to the world — and honestly I think that's a silver lining.",ar:"التهجير أجبرنا نفتح نفسنا للعالم — وصراحة بحس دا فيه خير.",ph:"at-tahjiir ajbarana niftah nafsana lil-3alam — w-saraha bahiss daa fih khayr.",note:"التهجير = displacement. أجبرنا = forced us. فيه خير = 'there's good in it.'",vocab:["التهجير","أجبرنا","نفسنا","فيه خير"]},
      {en:"People started knowing us — our food, our music, our dialect — things we were too shy to show before.",ar:"الناس بدأت تعرفنا — أكلنا وموسيقانا ولهجتنا — حاجات كنا خجلانين نوريها قبل.",ph:"an-nas badat ta3rafna — aklana w-moozeqaana w-lahjtana — hagaat kinna khjalaaniin nawwariha qabl.",note:"خجلانين = shy/ashamed. نوريها = to show it.",vocab:["بدأت تعرفنا","لهجتنا","خجلانين","نوريها"]},
      {en:"And now we're saying — no, we have things and we'll show them. That's the shift.",ar:"وهسه بنقول — لا، عندنا حاجات وحنوريها. دا هو التحوّل.",ph:"w-hissa binqool — la, 3andna hagaat w-hanwarriha. daa huw at-tahawwul.",note:"التحوّل = the shift/transformation. حنوريها = we will show them.",vocab:["هسه","عندنا حاجات","حنوريها","التحوّل"]},
    ]
  },
  {
    topic:"Talking about your relationship with content and creativity",
    title:"When you love what you do vs. when it becomes a burden",
    sentences:[
      {en:"If you pressure yourself, you'll destroy yourself — and then you'll hate the thing you loved.",ar:"لو ضغطت على نفسك حتهلك روحك — وبعدين حتكره الحاجة اللي كنت بتحبها.",ph:"lau daghattu 3ala nafsak hatahlak rohak — w-ba3dayn hattikrah al-haga alli kunt bitthibbha.",note:"تهلك روحك = 'you'll destroy yourself.' حتكره = 'you'll hate.'",vocab:["ضغطت","تهلك روحك","بعدين","حتكره"]},
      {en:"Cooking content isn't like any other content. It takes a planning day and a preparation day.",ar:"كونتنت الطبيخ ما زي أي كونتنت تاني. بياخذ يوم تخطيط ويوم إعداد.",ph:"content at-tabikh ma zay ayy content tani. biyaakhuz yoom takhtiit w-yoom i3daad.",note:"يوم تخطيط = planning day. يوم إعداد = preparation day.",vocab:["الطبيخ","يوم تخطيط","يوم إعداد"]},
      {en:"I'm not going to pressure myself and produce something just because people are waiting.",ar:"ما حضغط على نفسي وأنزل حاجة بس عشان الناس مستنيين.",ph:"ma haddghut 3ala nafsi w-anzil haga bas 3ashan an-nas mistniyyeen.",note:"مستنيين = waiting. بس عشان = 'just because.'",vocab:["ما حضغط","أنزل حاجة","مستنيين","بس عشان"]},
      {en:"When I'm ready, I'll be ready with something that I'm proud to put out.",ar:"لما بكون ريدي، حكون ريدي بحاجة أنا فخور إني أنزلها.",ph:"lamma bakoon ready, hakoon ready bi-haga ana fakhoor inni anzilha.",note:"فخور إني = 'proud that I.' A natural structure for expressing pride.",vocab:["ريدي","فخور","إني","أنزلها"]},
      {en:"Give yourself a break. Life comes with life. Don't push the river — it flows on its own.",ar:"خُدي روحك برييك. الحياة بتجي مع الحياة. ما تدفع النهر — بيجري لوحده.",ph:"khudi rohak break. al-hayat bituji ma3 al-hayat. ma tudfah an-nahr — biyijri li-wahdu.",note:"لوحده = on its own. ما تدفع النهر = 'don't push the river' — a natural flow metaphor.",vocab:["روحك","برييك","الحياة بتجي","النهر","لوحده"]},
    ]
  },
  {
    topic:"Talking about identity — who you are before the fame",
    title:"The person behind the persona",
    sentences:[
      {en:"Before all of this, I was just a rebellious kid who never liked what everyone else liked.",ar:"قبل كل دا كنت بس ولد متمرد ما كان بيعجبه اللي بيعجب الكل.",ph:"qabl kull daa kunt bas walad mutamarrid ma kan biy3ijbuh alli biy3jib al-kull.",note:"متمرد = rebellious. ما كان بيعجبه = 'wasn't impressed by.'",vocab:["قبل كل دا","متمرد","ما كان بيعجبه","الكل"]},
      {en:"I was always hard to please — I never found something that excited me quickly.",ar:"كنت دايماً صعب الرضا — ما كنت بلاقي حاجة تعجبني بسرعة.",ph:"kunt dayiman sa3b ar-rida — ma kunt balaaqii haga ta3jibni bi-sur3a.",note:"صعب الرضا = hard to please. تعجبني بسرعة = 'impresses me quickly.'",vocab:["صعب الرضا","ما كنت","تعجبني بسرعة"]},
      {en:"My personality was shaped through this field — the person I am now was formed by it.",ar:"شخصيتي اتشكّلت عبر المجال دا — الأنا اللي أنا هسه اتشكّل فيه.",ph:"shakhsiyati itshakkalat 3abr al-majal daa — al-ana alli ana hissa itshakkal fih.",note:"اتشكّلت = was shaped/formed. عبر = through/via.",vocab:["شخصيتي اتشكّلت","عبر","الأنا","هسه"]},
      {en:"I used to not know where Osama ended and Solja began. Now I know — they're the same person.",ar:"كنت ما عارف وين بتخلص أسامة وين بتبدأ سولجا. هسه بعرف — هم نفس الشخص.",ph:"kunt ma 3arif wayn bitikhlas Osama wayn tiibda Solja. hissa ba3rif — hum nafs ash-shakhis.",note:"وين بتخلص / وين بتبدأ = 'where does X end / where does Y begin.'",vocab:["ما عارف","وين بتخلص","وين بتبدأ","نفس الشخص"]},
      {en:"Being on the outside — being marginalized — that's actually what made me different.",ar:"إنك تكون في البرّا — إنك تكون مهمّش — ده في الحقيقة اللي خلاك مختلف.",ph:"innak takoon fi al-barra — innak takoon muhammash — dah fi al-haqeeqa alli khallak mukhtalif.",note:"في البرّا = on the outside. مهمّش = marginalized. خلاك مختلف = 'made you different.'",vocab:["في البرّا","مهمّش","خلاك","مختلف"]},
    ]
  },
  {
    topic:"Talking about God's role in your success",
    title:"Success, blessings, and where credit belongs",
    sentences:[
      {en:"I'll be honest — 90% of this is God's grace, not my talent.",ar:"حكون صريح — 90% من ده توفيق من ربنا، مش موهبتي.",ph:"hakoon sariih — 90% min dah tawfeeq min rabbina, mish mawhibati.",note:"حكون صريح = 'I'll be honest/frank.' توفيق = divine facilitation. مش موهبتي = not my talent.",vocab:["حكون صريح","توفيق","ربنا","مش موهبتي"]},
      {en:"Especially when your work depends on people loving you — that's not in your hands.",ar:"بالذات لما شغلك متعلق بحب الناس لك — ده ما في إيدك.",ph:"bil-zat lamma shughlak muta3alliq bi-hubb an-nas lak — dah ma fi eydak.",note:"متعلق بـ = depends on. ما في إيدك = 'not in your hands.'",vocab:["بالذات","متعلق","حب الناس","ما في إيدك"]},
      {en:"Nothing happens without a blessing from God in it. Nothing.",ar:"ما في حاجة بتحصل بدون بركة من ربنا فيها. خالص.",ph:"ma fi haga bithsul bidoon baraka min rabbina fiha. khalis.",note:"خالص = 'at all / period.' A strong closer.",vocab:["ما في حاجة","بدون بركة","ربنا","خالص"]},
      {en:"So I always do my part — I work, I try, I push — then I leave the outcome to God.",ar:"عشان كده دايماً بعمل اللي عليّ — بشتغل وبحاول وبدفع — وبعدين بتوكل على الله.",ph:"3ashan kida dayiman ba3mil alli 3alayy — bashtghil w-bahawal w-badfa3 — w-ba3dayn battawakkal 3ala allah.",note:"اللي عليّ = 'what's on me / my responsibility.' بتوكل = to rely on God.",vocab:["عشان كده","اللي عليّ","بتوكل","على الله"]},
      {en:"Praise God for the wide reach. Praise God for the people who love this thing. Praise God for all of it.",ar:"الحمد لله على الانتشار الواسع. الحمد لله على الناس اللي بتحب الحاجة دي. الحمد لله على كل حاجة.",ph:"al-hamdu lillah 3ala al-intishar al-wasi3. al-hamdu lillah 3ala an-nas alli bithibb al-haga di. al-hamdu lillah 3ala kull haga.",note:"Repeating الحمد لله three times is a powerful rhythm — use it to express overwhelming gratitude.",vocab:["الحمد لله","الانتشار الواسع","الناس","كل حاجة"]},
    ]
  },
  {
    topic:"Small talk — catching up with a friend",
    title:"Natural casual Sudanese conversation",
    sentences:[
      {en:"Hey, how are you? Where have you been? I haven't seen you in forever.",ar:"هوي، عامل كيف؟ وين كنت؟ ما شفتك من زمان حفروا البحر.",ph:"hoy, 3aamil kayf? wayn kunt? ma shuftuk min zaman hafaru al-bahr.",note:"من زمان حفروا البحر = 'from forever ago / ancient history.' Idiomatic Sudanese.",vocab:["هوي","عامل كيف","من زمان","حفروا البحر"]},
      {en:"I've been busy — honestly the situation has been something else lately.",ar:"كنت مشغول — صراحة الأوضاع كانت شوية غير الفتره دي.",ph:"kunt mashghuul — saraha al-awdaa3 kanat shuwayya gheyr al-fatra di.",note:"الأوضاع = conditions/situation (plural). غير = different/other.",vocab:["مشغول","صراحة","الأوضاع","غير"]},
      {en:"Are you good though? How's your mental state? I worry about you sometimes.",ar:"لكن أنت كويس؟ كيف نفسيتك؟ أنا مرات بشيل هم عليك.",ph:"lakin anta kuayis? kif nafseeytak? ana marraat bashiil hamm 3alayk.",note:"بشيل هم عليك = 'I carry worry for you.' A warm Sudanese phrase.",vocab:["كويس","نفسيتك","بشيل هم","عليك"]},
      {en:"No big deal — I'm fine now, praise God. It was just a rough period.",ar:"ما حنك — أنا كويس هسه، الحمد لله. كانت بس فترة صعبة.",ph:"ma hanak — ana kuayis hissa, al-hamdu lillah. kanat bas fatra sa3ba.",note:"ما حنك = 'no big deal / it's nothing.' بس = just. فترة صعبة = a rough period.",vocab:["ما حنك","كويس","الحمد لله","فترة صعبة"]},
      {en:"Let's catch up properly. Come over and we'll sit, drink tea, and talk.",ar:"يلا نتلاقى صح. تعال نقعد نشرب شاي ونتحدث.",ph:"yalla nitlaaqaa sahi. ta3aal niq3ud nishrab shaay w-nithadath.",note:"نتلاقى صح = 'let's properly meet up.' نتحدث = let's talk/chat.",vocab:["يلا","نتلاقى صح","نقعد","نتحدث"]},
    ]
  },
  {
    topic:"Talking about what being Sudanese means to you",
    title:"Pride, identity, and representing your roots",
    sentences:[
      {en:"I'm proud of my roots, my dialect, and everything in my culture.",ar:"أنا فخور بعرقي وبلهجتي وبكل حاجة في ثقافتي.",ph:"ana fakhoor bi-3irqi w-bi-lahjtii w-bi-kull haga fi thaqafati.",note:"عرقي = my ethnicity/roots. ثقافتي = my culture.",vocab:["فخور","عرقي","لهجتي","ثقافتي"]},
      {en:"Our dialect is part of our identity. Don't be ashamed of how you speak.",ar:"اللهجة بتاعتنا جزء من هويتنا. ما تخجل من طريقة كلامك.",ph:"al-lahja bata3tna juz' min huwiyyatna. ma tikhjal min tariqat kalamak.",note:"هويتنا = our identity. ما تخجل = don't be ashamed.",vocab:["اللهجة بتاعتنا","هويتنا","ما تخجل","طريقة كلامك"]},
      {en:"We have a kandaka spirit. Strong. Resilient. Beautiful. And we should celebrate that.",ar:"عندنا روح الكندكة. قوية. صامدة. جميلة. ومفروض نحتفل بكدا.",ph:"3andna rooh al-kandaka. qawiyya. samida. jamiila. w-mafrood nihttafil bi-kida.",note:"كندكة = powerful ancient Sudanese queen. صامدة = resilient/steadfast.",vocab:["روح الكندكة","صامدة","جميلة","مفروض نحتفل"]},
      {en:"The world is getting to know Sudan and Sudanese people — and we are not what they expected.",ar:"العالم بادي يتعرف على السودان والسودانيين — وما نحنا اللي كانوا متوقعينه.",ph:"al-3alam baadi yit3arraf 3ala as-sudan w-as-sudaniyyeen — w-ma nihna alli kaanu mitawaqqi3iinuh.",note:"بادي = starting to. ما نحنا اللي = 'we are not what.'",vocab:["العالم","بادي يتعرف","السودانيين","ما نحنا اللي"]},
      {en:"And that surprise — that's our opportunity. Let's use it.",ar:"والمفاجأة دي — دي فرصتنا. يلا نستغلها.",ph:"w-al-mufaja'a di — di fursatna. yalla nusteghlilha.",note:"فرصتنا = our opportunity. نستغلها = let's use it/capitalize on it.",vocab:["المفاجأة","فرصتنا","يلا","نستغلها"]},
    ]
  },
  {
    topic:"Talking about a podcast or conversation you found inspiring",
    title:"Reacting to and discussing ideas you heard",
    sentences:[
      {en:"I was listening to this person and honestly every point they made landed deep in me.",ar:"كنت بسمع الزول دا وصراحة كل نقطة قالها دفنتلي.",ph:"kunt basma3 az-zool daa w-saraha kull nuqta qaalha dafantili.",note:"دفنتلي = 'it settled deep in me / it really landed.' One of the most Sudanese phrases.",vocab:["كنت بسمع","صراحة","كل نقطة","دفنتلي"]},
      {en:"The point about expectations being the enemy of the person — that one really made me think.",ar:"النقطة بتاعت التوقعات هي عدو الإنسان — دي بالجد خلتني أفكر.",ph:"an-nuqta bata3t at-tawaqqu3at hiya 3aduw al-insan — di bil-jad khallitni ufakkir.",note:"خلتني أفكر = 'made me think.' A great phrase for intellectual reactions.",vocab:["النقطة بتاعت","التوقعات","عدو الإنسان","خلتني أفكر"]},
      {en:"And what they said about success and failure being intertwined — I'd never heard it framed like that before.",ar:"واللي قاله عن النجاح والفشل مترادفين — ما سمعت الحاجة دي اتصاغت بالطريقة دي قبل.",ph:"w-alli qaaluh 3an an-najah wal-fashal mutaradifeen — ma sima3t al-haga di ittasaaghat bil-tariqa di qabl.",note:"اتصاغت = was framed/formulated. بالطريقة دي = in this way.",vocab:["النجاح والفشل","مترادفين","اتصاغت","بالطريقة دي"]},
      {en:"Some conversations genuinely change how you see things. That was one of them.",ar:"في حوارات بجد بتغيّر نظرتك للأمور. ده كان واحد منهم.",ph:"fi hiwaraat bil-jad bitghayyir nazrtak lil-umoor. dah kan waahid minhum.",note:"نظرتك للأمور = 'your view of things.' واحد منهم = 'one of them.'",vocab:["حوارات","بجد","نظرتك","واحد منهم"]},
      {en:"Going back to what he said about private wins — I think that's the most important insight of all.",ar:"راجعين لحته اللي قاله عن البرايفت وينز — بحس دا أهم إنسايت في كل الحاجة.",ph:"raji3een li-hitta alli qaaluh 3an al-private wins — bahiss daa ahimm insight fi kull al-haga.",note:"راجعين لحته = 'going back to the point.' أهم = 'most important.'",vocab:["راجعين لحته","البرايفت وينز","أهم إنسايت","في كل الحاجة"]},
    ]
  },
  {
    topic:"Expressing opinions and taking a stance",
    title:"How to confidently share your perspective in Sudanese Arabic",
    sentences:[
      {en:"Honestly, in my personal opinion, the matter is completely different from how people see it.",ar:"صراحة، من رأيي الشخصي، الموضوع مختلف تماماً عن طريقة ما الناس شايفينه.",ph:"saraha, min ra'yi ash-shakhsi, al-mawdoo3 mukhtalif tamaman 3an tariqat ma an-nas shayfinnuh.",note:"من رأيي الشخصي = 'in my personal opinion.' مختلف تماماً = completely different.",vocab:["صراحة","من رأيي الشخصي","مختلف تماماً","الناس شايفينه"]},
      {en:"I'm not saying I'm right — I'm saying this is how I see it. You're free to disagree.",ar:"ما بقول إني صح — بقول كده بشوف الموضوع. أنت حر تختلف.",ph:"ma baqool inni sahi — baqool kida bashoof al-mawdoo3. anta hurr takhtalif.",note:"أنت حر = 'you're free.' تختلف = to disagree.",vocab:["ما بقول إني صح","بشوف الموضوع","حر","تختلف"]},
      {en:"And given that this is my experience — I feel like I can speak on this with some confidence.",ar:"وحيث إنو دي تجربتي — بحس إني قادر أتكلم في ده بشوية ثقة.",ph:"w-haytho innu di tajribati — bahiss inni qadir atakallam fi dah bi-shwayya thiqa.",note:"حيث إنو = 'given that / seeing as.' تجربتي = my experience.",vocab:["حيث إنو","تجربتي","قادر أتكلم","ثقة"]},
      {en:"But at the end of the day, every person sees the world through their own lens.",ar:"لكن في نهايه الأمر، كل إنسان بيشوف الدنيا من عدسته هو.",ph:"lakin fi nihayat al-amr, kull insan biyshoof ad-dunya min 3adastuh huw.",note:"في نهايه الأمر = 'at the end of the day.' عدسته = their lens/perspective.",vocab:["في نهايه الأمر","كل إنسان","يشوف الدنيا","عدسته"]},
      {en:"And that's okay. Differences in perspective are what make conversations interesting.",ar:"وده تمام. اختلاف وجهات النظر ده اللي بيخلي الحوارات مثيرة.",ph:"w-dah tamam. ikhtilaf wijhaat an-nazar dah alli bikhalli al-hiwaraat muthiira.",note:"وجهات النظر = points of view. مثيرة = exciting/interesting.",vocab:["وده تمام","اختلاف","وجهات النظر","مثيرة"]},
    ]
  },
];

// ══════════════════════════════════════
// SPEAK & RESPOND — Q&A with vocab
// ══════════════════════════════════════
