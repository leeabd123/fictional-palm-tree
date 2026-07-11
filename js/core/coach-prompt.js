// Coach prompt builder — shared by worker mode and direct (dev-key) mode.
// Comparison-based evaluation: the AI never judges "correct/incorrect" in the
// absolute; it compares the learner's response against the native-speaker
// model answers that ship with each scenario, and frames everything as
// "a natural way many Sudanese speakers say this" — never "the correct way."

const COACH_SYSTEM = `You are a warm, encouraging Sudanese Arabic speaking coach inside a practice app for heritage speakers — people who grew up hearing Sudanese Arabic at home, understand a lot, but freeze when they have to SPEAK it. Your one job: help them feel that what they produced is a real step toward talking with their family, and show them concretely how to sound more natural.

Core rules — these define the product, do not bend them:

1. COMPARISON, NOT JUDGMENT. You are given 2-3 reference answers written by a native speaker for this exact scenario. Evaluate the learner's response BY COMPARISON to those references and to natural spoken Sudanese patterns — never as absolutely "correct" or "incorrect". There is no single right answer in a living dialect.

2. NEVER SAY "CORRECT". Frame every reference as "a natural way many Sudanese speakers say this". Regional and family variation is real — if the learner's phrasing might be how THEIR family says it, acknowledge that possibility rather than marking it wrong.

3. ARABIZI IS VALID. Learners may type in Arabic script OR Latin-script Arabizi (3 = ع, 7 = ح, 5/kh = خ, gh = غ, 2 = ء). Arabizi is how heritage speakers actually text — treat it as fully valid Sudanese Arabic, NOT as English code-switching.

4. CODE-SWITCHING IS DATA, NOT SHAME. English words mixed in are the #1 heritage-speaker pattern. Point them out gently, give the Sudanese word, and never scold. Established loanwords used in the reference answers themselves (like "كونتنت"/"content", "فيديو") do NOT count as code-switching.

5. WATCH FOR MSA/FUSHA. Heritage speakers who studied Arabic formally often produce Modern Standard Arabic that sounds stiff at a family dinner. Flag words/structures that read as formal MSA and give the Sudanese colloquial version (e.g. الآن → هسه, ماذا → شنو, أريد → داير/عايز, ليس → ما في / مش).

6. WATCH FOR ENGLISH-SHAPED SENTENCES. Direct translations from English word order or idioms ("أنا ممتن لسؤالك" for "I appreciate you asking") — flag them and show how a Sudanese speaker would actually express the idea.

7. THE SUGGESTION MUST STAY CLOSE TO THEIR ATTEMPT. When you offer "one natural way you could say it", build it from the learner's OWN response upgraded — not a copy of a reference answer. They should recognize themselves in it.

8. BE HONEST BUT WARM. If the response is mostly English or very short, say so kindly and celebrate whatever Sudanese IS there. If it's genuinely strong, say that plainly — don't invent problems to fill sections. Empty arrays are fine.

9. KEEP IT TIGHT. Every note one or two sentences. This is a quick coaching moment, not an essay. Write feedback prose in English (the learner's dominant language), with Arabic examples inline.

10. VOCAB ACCOUNTING. Report which of the scenario's required/bonus vocabulary items appear in the learner's response (in Arabic script or recognizable Arabizi). Report English code-switched words as a list (excluding accepted loanwords per rule 4).

11. TRANSITION WORDS. The connectors (يعني، صراحة، طيب، فاهمني/فاهماني، بالجد، هسه، وبتاع، لكن، عشان) are what make speech sound fluent. If the response naturally invited one and the learner didn't use it, flag it in missed_transitions — at most one or two, only where it would genuinely help, phrased as an invitation not a correction ("this is a perfect spot for a يعني"). Empty array when nothing is missed.

12. FORMULAIC CHUNKS. Real fluency leans on pre-packaged multi-word expressions deployed as single units (إن شاء الله، الحمد لله، كتّر خيرك، ما شاء الله) rather than building every sentence word by word. If the learner constructed piece-by-piece what a speaker would say as one chunk, flag it in missed_chunks — "you could have used this chunk here" — at most one per response. Empty array when none apply.

13. REGISTER CALIBRATION. Formality is its own dimension, separate from vocabulary accuracy. If the response's register doesn't fit the scenario (too casual for an elder, too stiff for a friend), flag it in register_notes — "correct Arabic, but a bit too casual for an elder" — with the adjusted phrasing. Empty array when the register fits.`;

// JSON schema for the structured coaching feedback.
const COACH_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['overall','strengths','sounds_msa','sounds_english_shaped','code_switched_words','vocab_used_required','vocab_used_bonus','missed_transitions','missed_chunks','register_notes','closest_model_index','comparison_note','suggestion','encouragement'],
  properties: {
    overall: { type: 'string', description: 'One or two warm sentences reacting to the response as a whole.' },
    strengths: {
      type: 'array',
      description: 'Things that already sound natural/Sudanese. Quote the learner.',
      items: {
        type: 'object', additionalProperties: false, required: ['quote','note'],
        properties: {
          quote: { type: 'string', description: "The learner's own words (verbatim fragment)." },
          note: { type: 'string', description: 'Why this sounds natural, one sentence.' },
        },
      },
    },
    sounds_msa: {
      type: 'array',
      description: 'Fragments that read as formal MSA rather than spoken Sudanese.',
      items: {
        type: 'object', additionalProperties: false, required: ['quote','note','sudanese'],
        properties: {
          quote: { type: 'string' },
          note: { type: 'string' },
          sudanese: { type: 'string', description: 'The natural Sudanese colloquial version (Arabic script).' },
        },
      },
    },
    sounds_english_shaped: {
      type: 'array',
      description: 'Fragments that read as direct translations from English.',
      items: {
        type: 'object', additionalProperties: false, required: ['quote','note','sudanese'],
        properties: {
          quote: { type: 'string' },
          note: { type: 'string' },
          sudanese: { type: 'string' },
        },
      },
    },
    code_switched_words: {
      type: 'array', items: { type: 'string' },
      description: 'English words mixed into the response (excluding accepted loanwords).',
    },
    vocab_used_required: { type: 'array', items: { type: 'string' }, description: "Scenario 'required' vocab items present in the response (as listed in the scenario)." },
    vocab_used_bonus: { type: 'array', items: { type: 'string' }, description: "Scenario 'bonus' vocab items present in the response." },
    missed_chunks: {
      type: 'array',
      description: 'Formulaic chunk opportunities the response built word-by-word instead (at most 1; empty when none).',
      items: {
        type: 'object', additionalProperties: false, required: ['chunk','ph','note'],
        properties: {
          chunk: { type: 'string', description: 'The fixed expression (Arabic script), e.g. إن شاء الله.' },
          ph: { type: 'string', description: 'Its transliteration.' },
          note: { type: 'string', description: 'Where it fits in THEIR sentence — one sentence.' },
        },
      },
    },
    register_notes: {
      type: 'array',
      description: 'Formality/politeness mismatches for this scenario (empty when the register fits).',
      items: {
        type: 'object', additionalProperties: false, required: ['quote','note','adjusted'],
        properties: {
          quote: { type: 'string', description: "The learner's words that miss the register." },
          note: { type: 'string', description: 'Why the register misses (e.g. too casual for an elder) — one sentence.' },
          adjusted: { type: 'string', description: 'The same idea at the right register (Arabic script).' },
        },
      },
    },
    missed_transitions: {
      type: 'array',
      description: 'Transition-word opportunities the response invited but did not use (at most 1-2; empty when none).',
      items: {
        type: 'object', additionalProperties: false, required: ['phrase','ph','note'],
        properties: {
          phrase: { type: 'string', description: 'The transition word/connector (Arabic script), e.g. يعني.' },
          ph: { type: 'string', description: 'Its transliteration.' },
          note: { type: 'string', description: 'Where it would fit in THEIR sentence — one warm sentence.' },
        },
      },
    },
    closest_model_index: { type: 'integer', description: '0-based index of the reference answer closest in spirit to the learner response.' },
    comparison_note: { type: 'string', description: "One or two sentences: how the learner's response compares to that reference — what they share, what the native phrasing does differently." },
    suggestion: {
      type: 'object', additionalProperties: false, required: ['ar','ph','en'],
      description: "One natural way the learner could say THEIR OWN idea — their attempt upgraded, not a reference copy.",
      properties: {
        ar: { type: 'string', description: 'Arabic script.' },
        ph: { type: 'string', description: 'Phonetic transliteration (3/7/kh style).' },
        en: { type: 'string', description: 'English meaning.' },
      },
    },
    encouragement: { type: 'string', description: 'One closing sentence tied to the real goal: speaking with family. Specific, not generic.' },
  },
};

function buildCoachRequest(scenario, userText, prevAttempt) {
  const models = scenario.model.map((m, i) =>
    `Reference ${i + 1}:\n  Arabic: ${m.ar}\n  Phonetic: ${m.ph}\n  English: ${m.en}`
  ).join('\n');

  let user = `SCENARIO
Question (English): ${scenario.qen}
Question (Sudanese Arabic): ${scenario.qar}
Context for the learner: ${scenario.context}

NATIVE-SPEAKER REFERENCE ANSWERS (each is one natural way — not the only way):
${models}

VOCAB THE SCENARIO ENCOURAGES
Required: ${scenario.required.join(' · ')}
Bonus: ${scenario.bonus.join(' · ')}

LEARNER'S RESPONSE (may be Arabic script, Arabizi, or a mix):
${userText}`;

  if (prevAttempt) {
    user += `

FOR CONTEXT — the learner answered this same scenario before (${prevAttempt.when}):
${prevAttempt.text}
If the new response shows growth over the old one (more Sudanese vocabulary, less English, fuller sentences), mention it briefly in "overall" — real, specific progress only.`;
  }

  return {
    system: COACH_SYSTEM,
    messages: [{ role: 'user', content: user }],
    output_schema: COACH_SCHEMA,
  };
}

// Free-form mode (§4, low scaffolding): open prompt, no reference answers.
// The coach evaluates against natural spoken Sudanese patterns generally,
// with an explicitly gentler bar — shorter answers are expected.
function buildFreeformRequest(prompt, userText) {
  const user = `OPEN PROMPT (free-form mode — no reference answers exist for this):
${prompt.en}

There are NO scenario reference answers here. Evaluate the learner's response against natural spoken Sudanese patterns from your knowledge of the dialect, with a gentler bar than scenario mode: this is open expression, shorter and looser answers are expected and fine. Set closest_model_index to 0 and use comparison_note for a general note on how the response reads as spoken Sudanese. There is no required/bonus vocab — return empty arrays for vocab_used_required and vocab_used_bonus.

LEARNER'S RESPONSE (may be Arabic script, Arabizi, or a mix):
${userText}`;
  return {
    system: COACH_SYSTEM,
    messages: [{ role: 'user', content: user }],
    output_schema: COACH_SCHEMA,
  };
}

// ══════════════════════════════════════════════
// FULL PHONE CALL MODE (§19.2) — the AI plays a family member across
// multiple dynamic turns. Heavily few-shot grounded against the verified
// call sequences and glossary so it never invents ungrounded dialect.
// ══════════════════════════════════════════════

function callGroundingText() {
  // the verified call sequences ARE the grounding — every few-shot line
  // below passed the native correction round
  return CALL_SEQUENCES.map(seq =>
    `VERIFIED CALL — ${seq.title}:\n` + seq.turns.map(t =>
      `${t.who === 'family' ? 'FAMILY' : 'LEARNER'}: ${t.ar} (${t.ph}) — ${t.en}`).join('\n')
  ).join('\n\n');
}

const LIVECALL_SYSTEM_BASE = `LIVE CALL MODE. You are playing حبوبة (habooba — the learner's Sudanese grandmother) on a phone call with a diaspora heritage speaker who is practicing Sudanese Arabic. You are warm, loving, a little teasing, endlessly proud of them.

HARD RULES — these protect dialect authenticity:
1. GROUNDED SUDANESE ONLY. Speak ONLY in the register and vocabulary shown in the verified call transcripts below plus very common pan-Sudanese phrases (السلام عليكم، الحمد لله، إن شاء الله، معلش، يا حبيبي/حبيبتي، الله يحفظك). When in doubt, reuse a verified line or a close variation of one. NEVER invent slang or regionalisms not evidenced in the grounding.
2. SHORT TURNS. One or two short sentences per turn, like a real call. Ask one question at a time.
3. MEET THEM WHERE THEY ARE. If the learner answers in English or heavy Arabizi, stay in simple Sudanese — never switch to English yourself, but keep your Arabic simple enough to follow.
4. NO CORRECTIONS IN CHARACTER. Habooba never corrects grammar. If the learner's Arabic has a gap worth noting, put ONE gentle observation in coach_whisper (English, one sentence) — the app shows it quietly outside the conversation.
5. END NATURALLY. After several exchanges (the app tells you the turn count), wind down with a blessing like the verified calls do, and set call_done true.
6. EVERY ARABIC LINE needs its transliteration (3/7/kh style) and English meaning.`;

const LIVECALL_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['reply', 'coach_whisper', 'call_done'],
  properties: {
    reply: {
      type: 'object', additionalProperties: false, required: ['ar','ph','en'],
      properties: {
        ar: { type: 'string', description: "Habooba's next line (Arabic script, short)." },
        ph: { type: 'string', description: 'Transliteration.' },
        en: { type: 'string', description: 'English meaning.' },
      },
    },
    coach_whisper: { type: 'string', description: 'One gentle English coaching observation about the learner\u2019s last turn, or empty string.' },
    call_done: { type: 'boolean', description: 'true when the call has wound down naturally with a blessing.' },
  },
};

function buildLiveCallRequest(history, userText, turnCount, maxTurns) {
  const system = LIVECALL_SYSTEM_BASE + '\n\nVERIFIED GROUNDING TRANSCRIPTS:\n' + callGroundingText();
  const convo = history.map(h =>
    `${h.who === 'family' ? 'HABOOBA' : 'LEARNER'}: ${h.ar || h.text}`).join('\n');
  const user = `CALL SO FAR (turn ${turnCount} of at most ${maxTurns} — wind down with a blessing when close to the limit):
${convo || '(call just connected — you answer first, greet them)'}

LEARNER'S NEW TURN (may be Arabic, Arabizi, or English):
${userText || '(the learner just picked up — open the call)'}`;
  return {
    system,
    messages: [{ role: 'user', content: user }],
    output_schema: LIVECALL_SCHEMA,
  };
}

// §17.4 — AI-assisted categorization at intake: Claude reads a raw
// submission and SUGGESTS tags; the contributor confirms or adjusts.
// "AI organizes, humans provide the language" — at intake too.
const TAG_SUGGEST_SCHEMA = {
  type: 'object', additionalProperties: false,
  required: ['domain', 'tier', 'register', 'reasoning'],
  properties: {
    domain: { type: 'string', enum: ['family', 'friends', 'community', 'identity', 'culture'], description: 'Which life domain the phrase belongs to.' },
    tier: { type: 'string', enum: ['Beginning', 'Comfortable', 'Natural', 'Native-like'], description: 'Difficulty tier for a heritage learner.' },
    register: { type: 'string', enum: ['warm/family', 'respectful/formal', 'playful/teasing', 'neutral'], description: 'Formality register of the phrase.' },
    reasoning: { type: 'string', description: 'One short sentence explaining the suggestion.' },
  },
};

function buildTagSuggestRequest(text, meaning) {
  return {
    system: 'You categorize Sudanese Arabic phrases submitted to a community dialect library. Suggest tags only — never alter or judge the phrase itself. The submission may be Arabic script or Arabizi.',
    messages: [{ role: 'user', content: `Suggest tags for this community submission.\nPhrase: ${text}\nMeaning (if given): ${meaning || 'not provided'}` }],
    output_schema: TAG_SUGGEST_SCHEMA,
  };
}
