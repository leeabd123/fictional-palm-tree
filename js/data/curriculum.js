// ══════════════════════════════════════════════
// CURRICULUM — the Section 14 reusable scenario schema, loaded with the
// native-speaker-corrected Family/Beginning content (tariga-scenarios-content.md).
// Culture-neutral skeleton fields are reusable across future dialects;
// the culture-specific fill below is Sudanese, native-corrected.
// gender_variant is a first-class field on targets (Section 21 schema note).
// ══════════════════════════════════════════════

const DOMAINS = [
  { id: 'family', label: 'Family', ar: 'الأهل', icon: '🏠', live: true,
    desc: 'greeting elders, phone calls, being offered food, visiting relatives' },
  { id: 'friends', label: 'Friends', ar: 'الأصحاب', icon: '🤝', live: true,
    desc: 'making plans, joking, agreeing/disagreeing, storytelling' },
  { id: 'community', label: 'Community', ar: 'المجتمع', icon: '🕌', live: true,
    desc: 'mosque, shopping, transportation, restaurants' },
  { id: 'identity', label: 'Identity', ar: 'الهوية', icon: '🇸🇩', live: true,
    desc: 'talking about Sudan, explaining your background' },
  { id: 'culture', label: 'Culture', ar: 'الثقافة', icon: '🎙️', live: true,
    desc: 'the podcasts — real speech from real speakers' },
];

const TIERS = ['Beginning', 'Comfortable', 'Natural', 'Native-like'];

// ── Guided scenarios — highest scaffolding: English shown → produce Arabic →
//    compared against a specific verified target phrase ──
const GUIDED_SCENARIOS = [
  {
    id: 'fam-greet-habooba', domain: 'family', tier: 'Beginning',
    title: 'Greeting your grandmother',
    setup: "You walk into your grandmother's house and see her for the first time that day.",
    register_note: 'warm, respectful — an elder',
    prompt: null, // you initiate
    say_en: 'Peace be upon you, grandma',
    targets: [
      { ar: 'السلام عليكم حبوبة', ph: 'as-salamu alaykum habooba', en: 'Peace be upon you, grandma', gender: 'any' },
      { ar: 'كيف حالك يا حبوبة؟', ph: 'kayf halik ya habooba', en: 'How are you, grandma?', gender: 'any' },
    ],
    required: ['السلام عليكم', 'حبوبة'],
    note: 'السلام عليكم on its own, without يا before a name/title, is the natural greeting form — adding يا here reads as too formal. يا is fine as direct address elsewhere (كيف حالك يا حبوبة).',
    source: 'founder-seeded', verification_status: 'native-corrected',
  },
  {
    id: 'fam-kayf-alhal', domain: 'family', tier: 'Beginning',
    title: 'Answering — and reciprocating — "how are you"',
    setup: 'Your uncle asks how you are. This is the moment heritage speakers often freeze — not on the question, but on what comes next.',
    register_note: 'warm, respectful — an elder',
    prompt: { ar: 'كيف الحال؟', ph: 'kayf al-hal?', en: 'How are you?' },
    say_en: 'Great, praise God — and ask him back',
    targets: [
      { ar: 'تمام الحمد لله، كيف إنت؟', ph: 'tamam al-hamdulillah, kayf inta?', en: 'Great, praise God — how are you?', gender: 'any' },
      { ar: 'الحمد لله تمام، كيف أخباركم؟', ph: 'al-hamdulillah tamam, kayf akhbarkum?', en: "Praise God, great — how's everyone?", gender: 'any' },
    ],
    required: ['الحمد لله', 'كيف إنت'],
    note: 'Answering is only half the exchange — asking back is the expected next move. أخباركم (plural "your news") asks after the whole family at once, not just the person.',
    source: 'founder-seeded', verification_status: 'native-corrected',
  },
  {
    id: 'fam-sabah', domain: 'family', tier: 'Beginning',
    title: 'Good morning — and answering it correctly',
    setup: 'You come downstairs in the morning. Your mother greets you.',
    register_note: 'warm, everyday',
    prompt: { ar: 'صباح الخير', ph: 'sabah al-khayr', en: 'Good morning' },
    say_en: 'Answer with "morning of light"',
    targets: [
      { ar: 'صباح النور', ph: 'sabah an-noor', en: 'Morning of light', gender: 'any' },
    ],
    required: ['صباح النور'],
    note: 'A call-and-response pair — the instinct to repeat the same phrase back is the common heritage-speaker mistake. الخير gets answered with النور.',
    source: 'founder-seeded', verification_status: 'native-corrected',
  },
  {
    id: 'fam-khalto-food', domain: 'family', tier: 'Beginning', flagship: true,
    title: 'Your khalto puts food in front of you',
    setup: "You're visiting your khalto's house. Without asking, she puts a full plate of food in front of you. You've already eaten — but refusing outright would be impolite.",
    register_note: 'warm, grateful — hospitality is sacred',
    prompt: { ar: 'أكلي عليك الله', ph: 'aaklee 3alayk allah', en: 'Eat, for God\'s sake (a warm, insistent urging)' },
    say_en: "Thank her and let her know you're full — without a flat no",
    targets: [
      { ar: 'الحمد لله شبعت الحمد لله', ph: 'al-hamdulillah shabi3t al-hamdulillah', en: "Praise God, I'm full, praise God", gender: 'any' },
      { ar: 'شبعانة، والله الأكل جميل لكن شبعانة', ph: 'shab3ana, wallahi al-akl jameel lakin shab3ana', en: "I'm full, I swear the food is beautiful but I'm full", gender: 'f' },
      { ar: 'شبعان، والله الأكل جميل لكن شبعان', ph: 'shab3an, wallahi al-akl jameel lakin shab3an', en: "I'm full, I swear the food is beautiful but I'm full", gender: 'm' },
    ],
    required: ['الحمد لله', 'شبعان'],
    note: "Refusing outright reads as rejecting the host's hospitality. The graceful move is gratitude + acknowledging fullness, not a flat no.",
    source: 'founder-seeded', verification_status: 'native-corrected',
  },
  {
    id: 'fam-mukhtafi', domain: 'family', tier: 'Beginning',
    title: 'An older relative asks where you\'ve been',
    setup: "You haven't visited in a while. An older relative asks, gently, where you've disappeared to.",
    register_note: 'apologetic but warm',
    prompt: { ar: 'وين مختفية؟', ph: 'wayn mukhtafia?', en: 'Where have you disappeared to?', gender: 'f',
      variants: { m: { ar: 'وين مختفي؟', ph: 'wayn mukhtafee?' } } },
    say_en: 'Apologize lightly — you were busy',
    targets: [
      { ar: 'معلش، كنت مشغولة', ph: 'ma3lash, kunt mashghoola', en: 'Sorry, I was busy', gender: 'f' },
      { ar: 'معلش، كنت مشغول', ph: 'kunta mashghool, ma3lash', en: 'Sorry, I was busy', gender: 'm' },
    ],
    required: ['معلش', 'مشغول'],
    note: 'معلش carries the apology softly — no long excuse needed at this tier.',
    source: 'founder-seeded', verification_status: 'native-corrected',
  },
  {
    id: 'fam-wedding', domain: 'family', tier: 'Beginning',
    title: 'Wedding congratulations',
    setup: "You're at a family wedding (عرس), congratulating the couple's family.",
    register_note: 'celebratory, formulaic blessing',
    prompt: null,
    say_en: 'Offer the traditional blessing — a thousand congratulations, home, wealth and children',
    targets: [
      { ar: 'السلام عليكم، ألف مبروك، بيت مال وعيال إن شاء الله', ph: 'as-salamu alaykum, alf mabrook, bayt maal wa 3yal inshallah', en: 'Peace be upon you, a thousand congratulations — [may God grant you] a home, wealth and children', gender: 'any' },
    ],
    required: ['ألف مبروك'],
    reply: { ar: 'الله يبارك فيكم، آمين، عقبالكم', ph: 'allah ybarik feekum, ameen, 3ugbaalkum', en: 'God bless you, amen — may it be your turn next' },
    note: 'بيت مال وعيال is a fixed traditional blessing — the three pillars of a settled life — not something built word by word. عقبالكم is the expected reciprocal reply at celebrations. Learn the pair as one chunk.',
    source: 'founder-seeded', verification_status: 'native-corrected',
  },
];


// ── Stage 2: Beginning tier across the remaining domains ──
// Founder-seeded from phrases already present in the verified transcript/
// glossary data wherever possible. Everything below is explicitly
// verification_status 'pending-review' (shown in-app) until the native
// reviewer confirms it — same trust bar as community submissions.
GUIDED_SCENARIOS.push(
  // FRIENDS
  {
    id: 'fr-greet', domain: 'friends', tier: 'Beginning',
    title: 'Greeting a friend',
    setup: 'You run into a good friend you haven\u2019t seen in a couple of weeks.',
    register_note: 'casual, warm — a peer',
    prompt: null,
    say_en: 'Hey! How are you?',
    targets: [
      { ar: 'أهلاً يا زول! كيف إنت؟', ph: 'ahlan ya zool! kayf inta?', en: 'Hey! How are you?', gender: 'any' },
    ],
    required: ['يا زول', 'كيف إنت'],
    note: 'زول is THE Sudanese word for "person/guy" — يا زول between friends is instantly Sudanese, never formal.',
    source: 'founder-seeded', verification_status: 'pending-review',
  },
  {
    id: 'fr-tea', domain: 'friends', tier: 'Beginning',
    title: 'Making a plan — tea',
    setup: 'You want to catch up with a friend properly, not over text.',
    register_note: 'casual invitation',
    prompt: null,
    say_en: 'Come on, let\u2019s sit and have tea and talk',
    targets: [
      { ar: 'تعال نقعد نشرب شاي ونتونس', ph: 'ta3aal niq3ud nishrab shaay w-nitwannas', en: 'Come, let\u2019s sit, drink tea and talk', gender: 'any' },
    ],
    required: ['نشرب شاي'],
    note: 'ونسة (wanasa) — unhurried conversation over tea — is its own institution. نتونس is the verb: to sit and really talk.',
    source: 'founder-seeded', verification_status: 'pending-review',
  },
  {
    id: 'fr-agree', domain: 'friends', tier: 'Beginning',
    title: 'Agreeing enthusiastically',
    setup: 'A friend suggests a plan you genuinely love.',
    register_note: 'casual, energetic',
    prompt: { ar: 'رأيك شنو؟', ph: 'raayak shinoo?', en: 'What do you think?' },
    say_en: 'I swear that\u2019s a great idea — I\u2019m in',
    targets: [
      { ar: 'والله فكرة حلوة، أنا موافقة', ph: 'wallahi fikra hilwa, ana muwafga', en: 'I swear it\u2019s a lovely idea — I agree', gender: 'f' },
      { ar: 'والله فكرة حلوة، أنا موافق', ph: 'wallahi fikra hilwa, ana muwafig', en: 'I swear it\u2019s a lovely idea — I agree', gender: 'm' },
    ],
    required: ['والله'],
    note: 'والله opens agreement with warmth, not an oath — it\u2019s the everyday "honestly/really" between friends.',
    source: 'founder-seeded', verification_status: 'pending-review',
  },
  {
    id: 'fr-compliment', domain: 'friends', tier: 'Beginning',
    title: 'Complimenting a friend',
    setup: 'Your friend did something impressive and you want to hype them properly.',
    register_note: 'casual praise',
    prompt: null,
    say_en: 'Seriously, that\u2019s amazing — well done!',
    targets: [
      { ar: 'بالجد دا شغل رهيب، برافو عليك', ph: 'bil-jad da shughl raheeb, bravo 3alayk', en: 'Seriously that\u2019s amazing work — bravo', gender: 'any' },
    ],
    required: ['بالجد', 'رهيب'],
    note: 'رهيب is the go-to compliment word; بالجد ("seriously") makes the praise land as real, not polite.',
    source: 'founder-seeded', verification_status: 'pending-review',
  },
  // COMMUNITY
  {
    id: 'cm-price', domain: 'community', tier: 'Beginning',
    title: 'Asking the price',
    setup: 'You\u2019re at a Sudanese shop and want to know what something costs.',
    register_note: 'everyday transactional, friendly',
    prompt: null,
    say_en: 'How much is this?',
    targets: [
      { ar: 'بكم دا؟', ph: 'bikam da?', en: 'How much is this?', gender: 'any' },
    ],
    required: ['بكم'],
    note: 'Two words, endlessly useful. دا (not هذا) is what keeps it Sudanese and not MSA.',
    source: 'founder-seeded', verification_status: 'pending-review',
  },
  {
    id: 'cm-expensive', domain: 'community', tier: 'Beginning',
    title: 'That\u2019s a bit much — softly',
    setup: 'The price is higher than you expected. You want to push back without being rude.',
    register_note: 'friendly bargaining',
    prompt: { ar: 'دا بألفين', ph: 'da bi-alfayn', en: 'That\u2019s two thousand' },
    say_en: 'That\u2019s very expensive, brother — bring it down a little for me',
    targets: [
      { ar: 'غالي شديد يا أخوي، نزّل لي شوية', ph: 'ghali shadeed ya akhooy, nazzil li shwayya', en: 'Very expensive, brother — lower it a little for me', gender: 'any' },
    ],
    required: ['شديد', 'شوية'],
    note: 'Bargaining is a social ritual, not a fight — يا أخوي keeps it warm while you push back.',
    source: 'founder-seeded', verification_status: 'pending-review',
  },
  {
    id: 'cm-thanks', domain: 'community', tier: 'Beginning',
    title: 'Thanking someone properly',
    setup: 'Someone in the community did you a favor — the driver waited, the shopkeeper helped you carry things.',
    register_note: 'gracious, everyday',
    prompt: null,
    say_en: 'Thank you — may your goodness increase',
    targets: [
      { ar: 'شكراً، كتّر خيرك', ph: 'shukran, kattar khayrak', en: 'Thank you — may your goodness increase', gender: 'any' },
    ],
    required: ['كتّر خيرك'],
    note: 'كتّر خيرك goes beyond شكراً — it blesses the person. It\u2019s the thanks that gets remembered.',
    source: 'founder-seeded', verification_status: 'pending-review',
  },
  {
    id: 'cm-elder', domain: 'community', tier: 'Beginning',
    title: 'Greeting an elder in the community',
    setup: 'You pass an elder from the community — at the mosque, at a gathering.',
    register_note: 'respectful — an elder',
    prompt: null,
    say_en: 'Peace be upon you, uncle — how is your health?',
    targets: [
      { ar: 'السلام عليكم يا عمو، كيف الصحة؟', ph: 'as-salamu alaykum ya 3ammu, kayf as-saha?', en: 'Peace be upon you, uncle — how\u2019s your health?', gender: 'any' },
    ],
    required: ['السلام عليكم', 'يا عمو'],
    note: 'عمو for an elder man (خالتو for an elder woman) signals respect even with no blood relation. Asking after health is the expected follow-up.',
    source: 'founder-seeded', verification_status: 'pending-review',
  },
  // IDENTITY
  {
    id: 'id-from', domain: 'identity', tier: 'Beginning',
    title: '"Where are you from?"',
    setup: 'Someone asks where you\u2019re from — you want to answer with your chest.',
    register_note: 'proud, simple',
    prompt: { ar: 'إنت من وين؟', ph: 'inta min wayn?', en: 'Where are you from?' },
    say_en: 'I\u2019m Sudanese',
    targets: [
      { ar: 'أنا سودانية', ph: 'ana sudaniyya', en: 'I\u2019m Sudanese', gender: 'f' },
      { ar: 'أنا سوداني', ph: 'ana sudani', en: 'I\u2019m Sudanese', gender: 'm' },
    ],
    required: ['سوداني'],
    note: 'Short is strong here. The follow-up conversation is where the story lives.',
    source: 'founder-seeded', verification_status: 'pending-review',
  },
  {
    id: 'id-background', domain: 'identity', tier: 'Beginning',
    title: 'Explaining your background',
    setup: 'Someone asks how come you live here — you want to hold both halves of the story.',
    register_note: 'warm, matter-of-fact',
    prompt: null,
    say_en: 'My family is from Sudan, but I grew up here',
    targets: [
      { ar: 'أهلي من السودان، لكن أنا اتربيت هنا', ph: 'ahli min as-Sudan, lakin ana itrabbeyt hina', en: 'My family is from Sudan, but I was raised here', gender: 'any' },
    ],
    required: ['أهلي', 'السودان'],
    note: 'اتربيت ("I was raised") carries the diaspora story in one word — no apology in it.',
    source: 'founder-seeded', verification_status: 'pending-review',
  },
  {
    id: 'id-proud', domain: 'identity', tier: 'Beginning',
    title: 'Saying you\u2019re proud of it',
    setup: 'The conversation turns to heritage and you want to say it plainly.',
    register_note: 'sincere',
    prompt: null,
    say_en: 'I\u2019m proud of my culture and my dialect',
    targets: [
      { ar: 'أنا فخورة بثقافتي وبلهجتي', ph: 'ana fakhoora bi-thaqafati w-bi-lahjti', en: 'I\u2019m proud of my culture and my dialect', gender: 'f' },
      { ar: 'أنا فخور بثقافتي وبلهجتي', ph: 'ana fakhoor bi-thaqafati w-bi-lahjti', en: 'I\u2019m proud of my culture and my dialect', gender: 'm' },
    ],
    required: ['فخور'],
    note: 'Straight from the podcast — Solja says almost exactly this line about his roots and dialect.',
    source: 'podcast-derived', verification_status: 'pending-review',
  },
  {
    id: 'id-learning', domain: 'identity', tier: 'Beginning',
    title: 'When someone notices your Arabic',
    setup: 'A relative or community member comments on your Arabic — kindly or teasingly.',
    register_note: 'self-assured, no apology',
    prompt: { ar: 'عربيك اتحسّن!', ph: '3arabeek ithassan!', en: 'Your Arabic got better!' },
    say_en: 'I\u2019m still learning — but our dialect is in my heart',
    targets: [
      { ar: 'لسه بتعلم، لكن اللهجة بتاعتنا في قلبي', ph: 'lissa bata3allam, lakin al-lahja bita3atna fi galbi', en: 'I\u2019m still learning, but our dialect is in my heart', gender: 'any' },
    ],
    required: ['لسه', 'اللهجة بتاعتنا'],
    note: 'لسه ("still") frames learning as ongoing, not lacking. اللهجة بتاعتنا — OUR dialect — claims it.',
    source: 'founder-seeded', verification_status: 'pending-review',
  },
  // CULTURE — built directly on the podcast connectors
  {
    id: 'cu-saraha', domain: 'culture', tier: 'Beginning',
    title: 'Opening with صراحة',
    setup: 'A friend asks what you honestly think of a new Sudanese song.',
    register_note: 'casual opinion',
    prompt: { ar: 'الأغنية عجبتك؟', ph: 'al-ughniyya 3ajabatak?', en: 'Did you like the song?' },
    say_en: 'Honestly, this song is amazing',
    targets: [
      { ar: 'صراحة الأغنية دي رهيبة', ph: 'saraha al-ughniyya di raheeba', en: 'Honestly, this song is amazing', gender: 'any' },
    ],
    required: ['صراحة', 'رهيبة'],
    note: 'صراحة is how Solja opens nearly every honest take in the episode — it signals "real opinion incoming".',
    source: 'podcast-derived', verification_status: 'pending-review',
  },
  {
    id: 'cu-ya3ni', domain: 'culture', tier: 'Beginning',
    title: 'Connecting with يعني',
    setup: 'You\u2019re explaining something that isn\u2019t simple, the way the podcast guests do.',
    register_note: 'thinking out loud',
    prompt: null,
    say_en: 'I mean, the thing isn\u2019t easy — but I\u2019m trying',
    targets: [
      { ar: 'يعني الموضوع مش سهل، لكن بحاول', ph: 'ya3ni al-mawdoo3 mish sahl, lakin bahaawil', en: 'I mean, the matter isn\u2019t easy, but I\u2019m trying', gender: 'any' },
    ],
    required: ['يعني'],
    note: 'يعني is the connective tissue of spoken Sudanese — it buys thinking time and links ideas without stiffness.',
    source: 'podcast-derived', verification_status: 'pending-review',
  },
  {
    id: 'cu-fahimni', domain: 'culture', tier: 'Beginning',
    title: 'The فاهماني check-in',
    setup: 'You said something that matters to you and want to make sure it landed.',
    register_note: 'connecting',
    prompt: null,
    say_en: 'The meaning is really deep — you understand me?',
    targets: [
      { ar: 'المعنى عميق شديد — فاهماني؟', ph: 'al-ma3na 3ameeq shadeed — fahimani?', en: 'The meaning is really deep — you get me?', gender: 'any' },
    ],
    required: ['فاهماني', 'شديد'],
    note: 'فاهماني is THE Sudanese check-in — it invites the listener into what you said, mid-thought.',
    source: 'podcast-derived', verification_status: 'pending-review',
  },
  {
    id: 'cu-hamdulillah', domain: 'culture', tier: 'Beginning',
    title: 'Landing on الحمد لله',
    setup: 'Someone asks how things are going overall — end the update the way speakers actually do.',
    register_note: 'everyday gratitude',
    prompt: { ar: 'الأمور ماشية كيف؟', ph: 'al-umoor mashya kayf?', en: 'How are things going?' },
    say_en: 'Praise God, things are going well',
    targets: [
      { ar: 'الحمد لله، الحاجات ماشية كويس', ph: 'al-hamdulillah, al-hagat mashya kuwayyis', en: 'Praise God, things are going well', gender: 'any' },
    ],
    required: ['الحمد لله'],
    note: 'الحمد لله is the natural landing of almost every status update — the podcast answers end on it constantly.',
    source: 'podcast-derived', verification_status: 'pending-review',
  }
);

// ── Call sequences — Phone Call Lite (Section 19.1): every family line is
//    pre-written and verified, never generated. You produce each of your turns. ──
const CALL_SEQUENCES = [
  {
    id: 'call-habooba', domain: 'family', tier: 'Beginning',
    title: 'Habooba checks in', caller: 'حبوبة', icon: '📞', tone: 'warm',
    note: 'Written in plural "you all" (نحن / ـكم) throughout — addressing the whole household collectively, an authentic detail worth keeping.',
    turns: [
      { who: 'family', ar: 'إزيكم!', ph: 'izzayakum!', en: 'How are you all!' },
      { who: 'you', ar: 'أهلاً يا حبوبة، كيف أخباركم؟', ph: 'ahlan ya habooba, kayf akhbarkum', en: "Hello grandma, how's everyone?" },
      { who: 'family', ar: 'نحن كويسين، مالكم مختفيين؟ طولتوا مننا', ph: 'nihna quyseen, malkum mukhtafyeen? tawaltu minna', en: "We're good — why have you all disappeared? It's been too long." },
      { who: 'you', ar: 'معلش والله، نحن مشغولين مع الشغل والقراية، مع الأولاد... لكن والله في بالنا', ph: 'ma3lash wallahi, nihna mashghooleen ma3 ash-shughl wal-giraya, ma3 al-awlad... lakin wallahi fi balna', en: "Sorry, I swear — we're busy with work and studying, with the kids… but you're always on our mind." },
      { who: 'family', ar: 'الله يحفظكم، خلوا بالكم من نفسكم، وما تنقطعوا', ph: 'allah yahfazkum, khallu balkum min nafsikum, wa ma tinqati3u', en: "God protect you all, take care of yourselves, and don't lose touch." },
    ],
  },
  {
    id: 'call-eid', domain: 'family', tier: 'Beginning',
    title: 'Eid call across time zones', caller: 'الأهل في السودان', icon: '🌙', tone: 'celebratory',
    note: 'The time-zone gap is a specific, real, emotionally resonant detail of diaspora life — celebrating Eid hours apart from family back home.',
    turns: [
      { who: 'you', ar: 'السلام عليكم، كل سنة وإنتو طيبين، عيد مبارك', ph: 'as-salamu alaykum, kull sana wa intu tayybeen, eid mubarak', en: 'Peace be upon you, may you be well every year, blessed Eid' },
      { who: 'family', ar: 'عيد مبارك، صحة وسلامة، ربنا يحقق الأماني، وسنة جاية زي ما عايزين', ph: 'eid mubarak, saha was-salama, rabbana yhaqqiq al-amani, wa sana jaya zay ma 3ayzeen', en: 'Blessed Eid, health and safety, may God fulfill your wishes — and next year be just as you hope' },
      { who: 'you', ar: 'آمين جمعاً، كيف العيد بتاعكم؟', ph: 'ameen jam3an, kayf al-eid bita3kum?', en: "Amen, all together — how's your Eid going?" },
      { who: 'family', ar: 'نحن عيدنا قبايل، هسه المغرب عندنا. عندكم الساعة كم؟', ph: 'nihna eidna gibayl, hasa al-maghrib 3indana. 3indakum as-sa3a kam?', en: "We celebrated a while ago — it's Maghrib time for us now. What time is it there?" },
      { who: 'you', ar: 'عندنا هسه الصباح، يدوب طالعين من الصلاة', ph: '3indana hasa as-sabah, yadoob tal3een min as-salah', en: "It's morning here — we just came out of prayer" },
      { who: 'family', ar: 'والله؟ نحن خلاص قرب يومنا انتهى', ph: 'wallahi? nihna khalas garrab yomna intaha', en: 'Really? Our day is almost over already' },
      { who: 'you', ar: 'سنة جاية إن شاء الله معايدين مع بعض', ph: 'sana jaya inshallah mu3ayydeen ma3 ba3d', en: "Next year, God willing, we'll celebrate together" },
    ],
  },
  {
    id: 'call-condolence', domain: 'family', tier: 'Beginning',
    title: 'A condolence visit', caller: 'بيت العزاء', icon: '🕊️', tone: 'gentle',
    note: 'This exchange follows a specific, expected structure in Sudanese mourning etiquette — the phrases function as fixed ritual formulas. Getting the exact phrasing right matters more here than almost anywhere else; deviating from the expected script in a moment of grief can feel jarring rather than comforting.',
    turns: [
      { who: 'you', ar: 'السلام عليكم، إن شاء الله بركة فيكم، وأحسن الله عزاكم', ph: 'as-salamu alaykum, inshallah baraka feekum, wa ahsan allah 3azakum', en: "Peace be upon you, may there be blessing among you, and may God's condolence comfort you" },
      { who: 'family', ar: 'البركة في جمع، وعليكم السلام، كيف أخباركم، إن شاء الله كويسين', ph: 'al-baraka fi jam3, wa 3alaykum as-salam, kayf akhbarkum, inshallah quyseen', en: 'The blessing is in gathering, peace be upon you too — how are you, hopefully well' },
      { who: 'you', ar: 'الحمد لله بخير، ربنا يصبركم، دي حال الدنيا', ph: 'al-hamdulillah bi-khayr, rabbana yisabbirkum, di hal ad-dunya', en: "Praise God we're well — may God grant you patience, this is the way of the world" },
      { who: 'family', ar: 'شكراً ليك، إن شاء الله ما عزيك في حبيب، كثر خيركم', ph: 'shukran layk, inshallah ma 3azzeek fi habeeb, kattar khayrkum', en: "Thank you — God willing you won't lose a loved one, may your goodness increase" },
    ],
  },
];

// ── learner profile + guided progress (localStorage) ──
function getProfile() {
  try { return JSON.parse(localStorage.getItem('tariga_profile_v1') || '{}'); } catch (e) { return {}; }
}
function saveProfile(p) {
  try { localStorage.setItem('tariga_profile_v1', JSON.stringify(p)); } catch (e) {}
}
function getGuidedProgress() {
  try { return JSON.parse(localStorage.getItem('tariga_guided_v1') || '{}'); } catch (e) { return {}; }
}
function saveGuidedProgress(id, rec) {
  const all = getGuidedProgress();
  all[id] = rec;
  try { localStorage.setItem('tariga_guided_v1', JSON.stringify(all)); } catch (e) {}
}

function focusDomain() {
  const p = getProfile();
  return DOMAINS.some(d => d.id === p.focusDomain && d.live) ? p.focusDomain : 'family';
}
function setFocusDomain(id) {
  const p = getProfile(); p.focusDomain = id; saveProfile(p);
}

// next recommended item in a domain: first untouched guided scenario,
// then the call sequences, then the AI coach
function nextFocus(domain) {
  const done = getGuidedProgress();
  const g = GUIDED_SCENARIOS.find(s => s.domain === domain && !done[s.id]);
  if (g) return { kind: 'guided', id: g.id, title: g.title, sub: '~2 min · guided · say it like family would' };
  const c = CALL_SEQUENCES.find(s => s.domain === domain && !done[s.id]);
  if (c) return { kind: 'call', id: c.id, title: c.title, sub: '~4 min · a real call, turn by turn' };
  return { kind: 'speak', id: null, title: 'Free scenario with your coach', sub: '~5 min · AI coaching on your own words' };
}
