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
  { id: 'friends', label: 'Friends', ar: 'الأصحاب', icon: '🤝', live: false,
    desc: 'making plans, joking, agreeing/disagreeing, storytelling' },
  { id: 'community', label: 'Community', ar: 'المجتمع', icon: '🕌', live: false,
    desc: 'mosque, shopping, transportation, restaurants' },
  { id: 'identity', label: 'Identity', ar: 'الهوية', icon: '🇸🇩', live: false,
    desc: 'talking about Sudan, explaining your background' },
  { id: 'culture', label: 'Culture', ar: 'الثقافة', icon: '🎙️', live: false,
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
