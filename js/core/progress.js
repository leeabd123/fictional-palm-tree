// Attempt history — the memory behind the before/after progress feature.
// Attempts are stored per scenario (keyed by the scenario's English question,
// which is stable across reorderings) in localStorage.

const PROGRESS_KEY = 'tariga_attempts_v1';

// the connectors that make speech sound fluent — tracked as a journey metric
const TRANSITION_WORDS = ['يعني','صراحة','طيب','فاهمني','فاهماني','بالجد','هسه','وبتاع','لكن','عشان','زاتو','خلاص'];
function countTransitions(text) {
  return TRANSITION_WORDS.filter(w => text.includes(w)).length;
}

// fixed multi-word expressions deployed as single units (the lexical approach)
const FORMULAIC_CHUNKS = ['إن شاء الله','الحمد لله','ما شاء الله','كتّر خيرك','كثر خيرك','ألف مبروك','الله يحفظك','الله يبارك','كل سنة وإنتو طيبين','السلام عليكم','بيت مال وعيال'];
function countChunks(text) {
  return FORMULAIC_CHUNKS.filter(c => text.includes(c)).length;
}

function _loadAttempts() {
  try { return JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}'); } catch (e) { return {}; }
}

function _saveAttempts(all) {
  try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(all)); } catch (e) {}
}

function scenarioKey(scenario) { return scenario.qen; }

function getAttempts(scenario) {
  const all = _loadAttempts();
  return all[scenarioKey(scenario)] || [];
}

function addAttempt(scenario, text, feedback) {
  const all = _loadAttempts();
  const key = scenarioKey(scenario);
  if (!all[key]) all[key] = [];
  all[key].push({
    text,
    ts: Date.now(),
    metrics: {
      english: feedback.code_switched_words.length,
      vocabRequired: feedback.vocab_used_required.length,
      vocabBonus: feedback.vocab_used_bonus.length,
      msa: feedback.sounds_msa.length,
      englishShaped: feedback.sounds_english_shaped.length,
      strengths: feedback.strengths.length,
      transitions: countTransitions(text),
      chunks: countChunks(text),
      missedTransitions: (feedback.missed_transitions || []).length,
      words: text.trim().split(/\s+/).filter(Boolean).length,
    },
    vocabUsed: [...feedback.vocab_used_required, ...feedback.vocab_used_bonus],
    englishWords: feedback.code_switched_words,
  });
  // Cap history per scenario so localStorage stays small
  if (all[key].length > 25) all[key] = all[key].slice(-25);
  _saveAttempts(all);
}

function attemptCount(scenario) { return getAttempts(scenario).length; }

function totalAttemptCount() {
  const all = _loadAttempts();
  return Object.values(all).reduce((n, a) => n + a.length, 0);
}

// A simple 0-100 "sounding natural" score for one attempt — used for the
// progress meter. Comparison over time is what matters, not the absolute
// value, so this only needs to be consistent.
function naturalScore(m) {
  let s = 30;
  s += Math.min(m.vocabRequired * 12, 36);
  s += Math.min(m.vocabBonus * 6, 12);
  s += Math.min(m.strengths * 6, 18);
  s -= Math.min(m.english * 6, 24);
  s -= Math.min((m.msa + m.englishShaped) * 4, 16);
  if (m.words >= 8) s += 4;
  return Math.max(2, Math.min(100, Math.round(s)));
}

function fmtAttemptDate(ts) {
  const d = new Date(ts);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) +
    ' · ' + d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}
