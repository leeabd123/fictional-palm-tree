// Tips, deep quiz types, mode intros
const tips=[
  "Context before form: always learn a word inside a full sentence — every card here has one.",
  "Shadowing: listen, pause, then say the WHOLE sentence — not word by word. Mimic rhythm and emotion.",
  "Spaced repetition: review 'still learning' cards first next session before adding new ones.",
  "Output practice: after each card, make a NEW sentence using that word about your own life.",
  "Transition mastery: use ألو هو and طالما إحنا from ناحية until they feel completely automatic.",
  "Tone matters: الحمد لله and سبحان الله carry energy beyond their meaning. Say them with feeling.",
  "Mirror work: say phrases aloud while watching yourself. Arabic sounds need full facial engagement.",
  "Chunking: learn فاهماني and يعني وبتاع as ready-made chunks. Insert them constantly.",
  "Emotion link: words learned with genuine emotion stick faster. Find the ones that resonate first.",
  "Comprehensible input: you understand more than you speak. Start outputting — imperfect is fine.",
];
const DQ_TYPES = [
  {id:'mixed',label:'Mixed drill',desc:'All question types in randomized order. Best for overall retention.'},
  {id:'mc4',label:'4-choice recognition',desc:'See Arabic, pick English. Builds recognition speed through forced choice.'},
  {id:'produce',label:'English → Arabic production',desc:'See English, recall the Arabic. Hardest mode — builds real output skill.'},
  {id:'context',label:'Context cloze',desc:'A sentence with a gap. Pick the right word from 4 options. Builds grammar sense.'},
  {id:'arrange',label:'Word order',desc:'Arrange scrambled Arabic words into a correct sentence. Builds grammar feel.'},
];

const MODE_INTROS = {
  flash:{icon:'🃏',title:'Flashcards — recognition & production',body:'See Arabic → recall the English meaning (or flip it: see English → produce the Arabic). Use the ☆ star button to save any card you want to review later. Navigate freely with ← → arrows. Rate each card: Still learning / Almost / Got it.',tip:'Start with Arabic→English. Once you know 80%, flip to English→Arabic — that\'s the hard direction that builds real speaking ability.'},
  deep:{icon:'📖',title:'Deep cards — full word analysis with synonyms',body:'Every word gets full treatment: meaning, transliteration, grammar type, the example sentence with phonetics, synonyms and related words you can swap in, and extra usage notes. Much more detail than regular flashcards.',tip:'Use this after you\'ve seen a word in the regular flashcards. Deep cards cement the word by showing you its full context and alternatives.'},
  shadow:{icon:'🎙️',title:'Shadowing — speak before you reveal',body:'You see the context in English. The Arabic is hidden. Try to say the phrase out loud first, then reveal to check yourself. Rate your attempt. Use vocab chips to practice enriching your sentences.',tip:'The research is clear: output practice before seeing the answer is 3x more effective than reading then repeating. Struggle first.'},
  mc:{icon:'✅',title:'Quiz — 4-choice recognition',body:'See Arabic, choose the correct English meaning from 4 options. Fast pattern recognition training. You\'ll see context after you answer to reinforce memory.',tip:'Go fast. The first instinct is often correct. Speed builds automaticity — the goal is that words feel immediately recognizable.'},
  build:{icon:'✍️',title:'Sentence builder — produce your own sentences',body:'You see a situation and a phrase stem. Build your own sentence using that phrase. The Arabic model is hidden until you\'re ready. Use the vocab chips to enrich your sentence with extra words.',tip:'Don\'t just reveal and copy — actually try to build something first, even if imperfect. Imperfect production is where learning happens.'},
  flow:{icon:'📄',title:'Flow translation — multi-sentence paragraphs',body:'You get 5 connected English sentences on a topic. Try to say the whole paragraph in Arabic before revealing. Click each sentence individually to check one at a time.',tip:'This is the bridge to real conversation. Practice flowing from sentence to sentence using the transitions (يعني, فاهمني, ألو هو) to connect your thoughts.'},
  speak:{icon:'💬',title:'Speak & respond — with a live coach',body:'A real-life scenario, in English and Arabic. Type your answer the way you\'d actually say it — Arabic script or Arabizi (saraha, 3ashan), both count. Your coach compares it with how native speakers answered the same scenario and shows you what already sounds Sudanese, what reads as formal MSA, and what\'s shaped like English. Answer the same scenario again another week and you\'ll see a real before-and-after of your growth.',tip:'There is no \'correct answer\' here — every reference is one natural way many Sudanese speakers say it. Your family may say it differently, and that\'s real fluency too.'},
  deepquiz:{icon:'⚡',title:'Deep quiz — 4 research-backed question types',body:'Mixed drills across: 4-choice recognition, English→Arabic production, context cloze (fill the blank), and word order (arrange scrambled Arabic). Each type trains a different cognitive skill.',tip:'Production and word-order questions are hardest. Do those modes specifically when you feel ready — they build the deepest fluency.'},
  listen:{icon:'👂',title:'Tune your ear — comprehension first',body:'You already understand more than you can say — this mode activates it. Two exercises: <b>Meaning</b> (read a real podcast line, predict what it means before confirming) and <b>What comes next?</b> (read one side of an exchange, predict the natural reply — real conversational-flow comprehension). Toggle the Arabic/phonetic layers to tune difficulty. No speaking, no pressure.',tip:'Prediction before confirmation is what turns passive understanding into active recall. Guess FIRST, even when unsure — the guess is the exercise.'},
  contribute:{icon:'🫶',title:'Contribute — help preserve Sudanese Arabic',body:'Every phrase in this app was verified by a native speaker. This is where the community grows that library: answer one prompt the way YOUR family actually says it, tag it by region and generation, and it joins the review queue. Nothing goes live until 2\u20133 independent native speakers confirm it sounds natural.',tip:'There is no single correct answer \u2014 regional and family variation is the whole point. If your grandmother says it differently, that difference is exactly what we want to capture.'},
  convo:{icon:'🎧',title:'Conversation mode — the real podcast',body:'Every line from the Wansa × Solja transcript, organized into 9 scenes. Full scene read: blur lines then reveal one at a time while shadowing. Respond mode: host lines shown, you produce Solja\'s response.',tip:'Listen to the actual podcast episode while using this mode if you can. Connecting the text to the real voices and rhythm is the fastest path to native speed.'},
};

