// ══════════════════════════════════════════════
// WORD & SENTENCE STARRING (§27) — one consistent interaction, built once,
// applied everywhere Arabic renders: press-and-hold (or double-click) any
// Arabic word to look it up and star it, or star the whole sentence.
// Known words come from the vocab database; unknown ones get an AI lookup
// using the surrounding sentence as context and are kept as lighter-weight
// "discovered words". Everything starred is drillable via the "My starred"
// deck source. Lookups that miss the database are also counted — a live,
// demand-driven signal of content gaps (§27.4).
// ══════════════════════════════════════════════

const WSTAR_WORDS_KEY = 'tariga_starred_words_v1';
const WSTAR_SENTS_KEY = 'tariga_starred_sents_v1';
const WSTAR_LOOKUP_KEY = 'tariga_lookups_v1';

function _wsWords() {
  try { return JSON.parse(localStorage.getItem(WSTAR_WORDS_KEY) || '[]'); } catch (e) { return []; }
}
function _wsSents() {
  try { return JSON.parse(localStorage.getItem(WSTAR_SENTS_KEY) || '[]'); } catch (e) { return []; }
}
function _wsSaveWords(v) { try { localStorage.setItem(WSTAR_WORDS_KEY, JSON.stringify(v)); } catch (e) {} }
function _wsSaveSents(v) { try { localStorage.setItem(WSTAR_SENTS_KEY, JSON.stringify(v)); } catch (e) {} }

// §27.4 — count lookups that missed the database
function _wsCountLookup(w) {
  try {
    const c = JSON.parse(localStorage.getItem(WSTAR_LOOKUP_KEY) || '{}');
    c[w] = (c[w] || 0) + 1;
    localStorage.setItem(WSTAR_LOOKUP_KEY, JSON.stringify(c));
  } catch (e) {}
}
function wordstarLookups() {
  try {
    const c = JSON.parse(localStorage.getItem(WSTAR_LOOKUP_KEY) || '{}');
    return Object.entries(c).map(([w, n]) => ({ w, n })).sort((a, b) => b.n - a.n);
  } catch (e) { return []; }
}

// ── word extraction at the press point ──
const WS_AR = /[؀-ۿ]/;
const WS_ARWORD = /[؀-ۿـ]/;

function _wsWordAt(x, y) {
  let node = null, off = 0;
  if (document.caretRangeFromPoint) {
    const r = document.caretRangeFromPoint(x, y);
    if (r) { node = r.startContainer; off = r.startOffset; }
  } else if (document.caretPositionFromPoint) {
    const p = document.caretPositionFromPoint(x, y);
    if (p) { node = p.offsetNode; off = p.offset; }
  }
  if (!node || node.nodeType !== 3) return null;
  const t = node.textContent;
  if (!WS_AR.test(t)) return null;
  let a = off, b = off;
  while (a > 0 && WS_ARWORD.test(t[a - 1])) a--;
  while (b < t.length && WS_ARWORD.test(t[b])) b++;
  const w = t.slice(a, b).trim();
  if (!w || !WS_AR.test(w)) return null;
  // the surrounding sentence = the closest block's text, kept short
  let el = node.parentElement;
  while (el && el.textContent.trim().length < 3) el = el.parentElement;
  let sent = (el ? el.textContent : t).trim().replace(/\s+/g, ' ');
  if (sent.length > 140) sent = sent.slice(0, 140) + '…';
  return { w, sent };
}

// lookup in the vocab database — exact entry, or a word inside an entry
function _wsLookup(w) {
  const all = [...V1, ...V2, ...P2, ...EXTRA];
  return all.find(v => v.a === w)
    || all.find(v => v.a.split(/[\s/،]+/).includes(w))
    || all.find(v => v.a.includes(w) && w.length >= 3)
    || null;
}

// ── the popup ──
let wsCtx = null; // { w, sent, ph, en, discovered }

function wsClose() {
  document.getElementById('wordstar-pop')?.remove();
  wsCtx = null;
}

function _wsIsWordStarred(w) { return _wsWords().some(x => x.w === w); }
function _wsIsSentStarred(s) { return _wsSents().some(x => x.ar === s); }

function wsStarWord() {
  if (!wsCtx) return;
  const words = _wsWords();
  const i = words.findIndex(x => x.w === wsCtx.w);
  if (i >= 0) words.splice(i, 1);
  else words.push({ w: wsCtx.w, ph: wsCtx.ph || '', en: wsCtx.en || '', sent: wsCtx.sent, discovered: !!wsCtx.discovered, ts: Date.now() });
  _wsSaveWords(words);
  updateStarredNav();
  _wsRedraw();
}

function wsStarSent() {
  if (!wsCtx) return;
  const sents = _wsSents();
  const i = sents.findIndex(x => x.ar === wsCtx.sent);
  if (i >= 0) sents.splice(i, 1);
  else sents.push({ ar: wsCtx.sent, ts: Date.now() });
  _wsSaveSents(sents);
  updateStarredNav();
  _wsRedraw();
}

function _wsRedraw() {
  const pop = document.getElementById('wordstar-pop');
  if (pop && wsCtx) pop.innerHTML = _wsPopBody();
}

function _wsPopBody() {
  const wStar = _wsIsWordStarred(wsCtx.w);
  const sStar = _wsIsSentStarred(wsCtx.sent);
  return `
    <div class="ws-word" dir="rtl">${escAttr(wsCtx.w)}</div>
    ${wsCtx.loading ? '<div class="ws-def">asking the coach…</div>'
      : (wsCtx.ph || wsCtx.en)
        ? `<div class="ws-def">${escAttr(wsCtx.ph)}${wsCtx.ph && wsCtx.en ? ' · ' : ''}${escAttr(wsCtx.en)}${wsCtx.discovered ? ' <span class="ws-disc">✨ discovered</span>' : ''}</div>`
        : `<div class="ws-def">not in the library yet${apiConfigured() ? '' : ' — connect the coach to look it up'}</div>`}
    <div class="ws-btns">
      <button onclick="wsStarWord()" class="${wStar ? 'on' : ''}">${wStar ? '★ word saved' : '☆ star word'}</button>
      <button onclick="wsStarSent()" class="${sStar ? 'on' : ''}">${sStar ? '★ sentence saved' : '☆ star sentence'}</button>
      <button onclick="sayAr('${encodeURIComponent(wsCtx.w)}')">🔊</button>
      <button onclick="wsClose()">✕</button>
    </div>`;
}

async function _wsShow(x, y, hit) {
  wsClose();
  const known = _wsLookup(hit.w);
  wsCtx = { w: hit.w, sent: hit.sent, ph: known ? known.p : '', en: known ? known.e : '', discovered: false, loading: !known && apiConfigured() };
  if (!known) _wsCountLookup(hit.w);

  const pop = document.createElement('div');
  pop.id = 'wordstar-pop';
  pop.innerHTML = _wsPopBody();
  document.body.appendChild(pop);
  const W = pop.offsetWidth || 260, H = pop.offsetHeight || 120;
  pop.style.left = Math.max(8, Math.min(window.innerWidth - W - 8, x - W / 2)) + 'px';
  pop.style.top = Math.max(8, (y - H - 16 > 8 ? y - H - 16 : y + 24)) + 'px';

  // unknown word → AI lookup with the sentence as context (§27.1),
  // stored as a lighter-weight "discovered word" once starred
  if (!known && apiConfigured()) {
    try {
      const def = await coachEvaluate({
        system: 'You are a Sudanese Arabic dictionary. Given one word and the sentence it appeared in, return its phonetic transliteration (Sudanese pronunciation, e.g. ق as g) and a short English meaning fitting THIS context. Never invent — if genuinely unsure, say so in the meaning.',
        messages: [{ role: 'user', content: `Word: ${hit.w}\nSentence: ${hit.sent}` }],
        output_schema: { type: 'object', properties: { ph: { type: 'string' }, en: { type: 'string' } }, required: ['ph', 'en'], additionalProperties: false },
        max_tokens: 200,
      });
      if (wsCtx && wsCtx.w === hit.w) {
        wsCtx.ph = def.ph || ''; wsCtx.en = def.en || ''; wsCtx.discovered = true; wsCtx.loading = false;
        _wsRedraw();
      }
    } catch (e) {
      if (wsCtx && wsCtx.w === hit.w) { wsCtx.loading = false; _wsRedraw(); }
    }
  }
}

// ── one global interaction: press-and-hold (or double-click) ──
let _wsTimer = null, _wsDown = null, _wsFired = false;

function _wsCancel() {
  clearTimeout(_wsTimer);
  _wsTimer = null; _wsDown = null;
}

function _wsEligible(e) {
  const t = e.target;
  if (!t || t.closest('#wordstar-pop')) return false;
  if (t.closest('input, textarea, select, [contenteditable]')) return false;
  return true;
}

document.addEventListener('pointerdown', (e) => {
  if (!_wsEligible(e)) return;
  _wsFired = false;
  _wsDown = { x: e.clientX, y: e.clientY };
  clearTimeout(_wsTimer);
  _wsTimer = setTimeout(() => {
    const hit = _wsWordAt(_wsDown.x, _wsDown.y);
    if (hit) {
      _wsFired = true;
      _wsShow(_wsDown.x, _wsDown.y, hit);
    }
    _wsDown = null;
  }, 500);
}, true);

document.addEventListener('pointermove', (e) => {
  if (_wsDown && (Math.abs(e.clientX - _wsDown.x) > 12 || Math.abs(e.clientY - _wsDown.y) > 12)) _wsCancel();
}, true);

document.addEventListener('pointerup', () => { clearTimeout(_wsTimer); _wsTimer = null; _wsDown = null; }, true);
document.addEventListener('pointercancel', _wsCancel, true);

// swallow the click that follows a fired long-press so cards don't flip
document.addEventListener('click', (e) => {
  if (_wsFired) { _wsFired = false; e.stopPropagation(); e.preventDefault(); return; }
  // tap anywhere outside the popup closes it
  if (wsCtx && !e.target.closest('#wordstar-pop')) wsClose();
}, true);

// desktop convenience: double-click a word
document.addEventListener('dblclick', (e) => {
  if (!_wsEligible(e)) return;
  const hit = _wsWordAt(e.clientX, e.clientY);
  if (hit) _wsShow(e.clientX, e.clientY, hit);
});

// ── practice integration (§27.3): starred content as a deck source ──
function starredDeck() {
  const all = [...V1, ...V2, ...P2, ...EXTRA];
  const cards = all.filter(x => starredItems.has(x.a));
  const words = _wsWords().map(x => ({
    a: x.w, p: x.ph || '—', e: x.en || 'a word you starred', ctx: 'You starred this word yourself' + (x.discovered ? ' — an AI-looked-up "discovered word", not yet community-verified.' : '.'),
    ex: x.sent || x.w, exen: '', cat: 'Starred word', src: 'starred', type: x.discovered ? 'Discovered' : 'Word',
  }));
  const sents = _wsSents().map(x => ({
    a: x.ar, p: '—', e: 'a sentence you starred', ctx: 'You starred this whole sentence — the value is the construction.',
    ex: x.ar, exen: '', cat: 'Starred sentence', src: 'starred', type: 'Sentence',
  }));
  return [...cards, ...words, ...sents];
}
function starredDeckCount() { return starredItems.size + _wsWords().length + _wsSents().length; }
