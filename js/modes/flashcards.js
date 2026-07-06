// Flashcards — the design's floating 3D card, ported to the live deck.
// Tap to flip, swipe (or arrows) to browse, direction pills for
// recognition (عربي → EN) vs production (EN → عربي), a speak-aloud button,
// progress dots, and the Word/Sentence practice panel with self-check.

let flashPractice = 'word';     // 'word' | 'sentence'
let flashCompared = false;
let flashInput = '';

const FLASH_SRC_LABEL = { v1: 'Solja episode', v2: 'Ala episode', all: 'Both episodes', p2: 'Glossary', extra: 'Deep vocab' };

// Speak Arabic out loud with the browser voice — rough but carries the melody.
function sayAr(enc) {
  if (!('speechSynthesis' in window)) return;
  const u = new SpeechSynthesisUtterance(decodeURIComponent(enc));
  u.lang = 'ar-SA'; u.rate = 0.85;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
}

function renderFlash() {
  const ca = document.getElementById('content-area');
  if (idx >= deck.length) { renderResult(); return; }
  const it = deck[idx];
  const isAR = flashDir === 'ar';
  const prev = idx > 0 ? deck[idx - 1] : null;
  const next = idx < deck.length - 1 ? deck[idx + 1] : null;

  // 5-dot window centered on the current card
  const dotStart = Math.max(0, Math.min(idx - 2, deck.length - 5));
  const dots = deck.slice(dotStart, dotStart + 5)
    .map((_, i) => `<div class="f2-dot ${dotStart + i === idx ? 'on' : ''}"></div>`).join('');

  ca.innerHTML = `
    <div class="coach-wrap">
      <div class="f2-head">
        <div>
          <div class="d2-title" style="margin-bottom:0">Flashcards</div>
          <div class="f2-counter">${idx + 1} of ${deck.length} · ${FLASH_SRC_LABEL[src] || 'deck'}</div>
        </div>
        <div class="f2-dir">
          <button class="${isAR ? 'on' : ''}" onclick="setFlashDir('ar')">عربي → EN</button>
          <button class="${isAR ? '' : 'on'}" onclick="setFlashDir('en')">EN → عربي</button>
        </div>
      </div>

      <div class="f2-scene" id="f2-scene">
        ${prev ? flashGhostHTML(prev, 'translate(-118%, 8px) rotateY(14deg) scale(.92)') : ''}
        ${next ? flashGhostHTML(next, 'translate(18%, 8px) rotateY(-14deg) scale(.92)') : ''}
        <div class="f2-cardwrap" style="transform:translateX(-50%); z-index:3;">
          <div class="f2-float">
            <div class="f2-flip ${flipped ? 'flipped' : ''}" onclick="flip()">
              <div class="f2-face f2-front">
                <div class="f2-sweep"></div>
                <div style="display:flex;justify-content:space-between;align-items:flex-start">
                  <div class="f2-tags">
                    <span class="f2-tag src">${it.src === 'v1' ? 'Video 1' : it.src === 'v2' ? 'Video 2' : 'Glossary'}</span>
                    <span class="f2-tag">${escAttr(it.cat)}</span>
                  </div>
                  <span style="display:inline-flex;gap:4px;align-items:center">
                    <button class="d2-icon-btn" onclick="sayAr('${encodeURIComponent(it.a)}');event.stopPropagation()" title="hear it">🔊</button>
                    ${starBtnHTML(it.a)}
                  </span>
                </div>
                <div class="f2-mid">
                  ${isAR
                    ? `<div class="f2-ar">${escAttr(it.a)}</div><div class="f2-ph">${escAttr(it.p)}</div>`
                    : `<div class="f2-en-prompt">${escAttr(it.e)}</div><div class="f2-en-hint">say it in Arabic below — or flip anytime</div>`}
                </div>
                <div class="f2-hint">tap to flip · swipe to browse</div>
              </div>
              <div class="f2-face f2-back">
                <div style="display:flex;justify-content:space-between;align-items:baseline;gap:12px">
                  <div class="f2-back-ar">${escAttr(it.a)}</div>
                  <span style="display:inline-flex;gap:6px;align-items:center">
                    <span class="f2-ph" style="font-size:12px;white-space:nowrap">${escAttr(it.p)}</span>
                    <button class="d2-icon-btn" onclick="sayAr('${encodeURIComponent(it.a)}');event.stopPropagation()" title="hear it">🔊</button>
                  </span>
                </div>
                <div class="f2-back-en">${escAttr(it.e)}</div>
                <div class="f2-ctx">${escAttr(it.ctx)}</div>
                <div class="d2-inset" style="margin-top:0">
                  <div class="d2-inset-ar">${escAttr(it.ex)}</div>
                  <div class="d2-inset-ph">${getExPh(it)}</div>
                  <div class="d2-inset-en">${escAttr(it.exen)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="f2-shadow"></div>
      <div class="f2-dots">${dots}</div>

      ${flipped ? `
      <div class="f2-mark-row">
        <button class="d2-pill-red" onclick="mark(false)">Still learning</button>
        <button class="d2-pill-green" onclick="mark(true)">Got it ✓</button>
      </div>` : `
      <div class="f2-navround">
        <button onclick="navCard(-1)" ${idx === 0 ? 'disabled' : ''}>‹</button>
        <button onclick="navCard(1)" ${idx >= deck.length - 1 ? 'disabled' : ''}>›</button>
      </div>`}

      ${flashPracticeHTML(it)}
    </div>
  `;

  flashBindSwipe();
  const inp = document.getElementById('f2-input');
  if (inp) {
    inp.value = flashInput;
    inp.addEventListener('input', () => { flashInput = inp.value; });
    inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') flashCheck(); });
  }
}

function flashGhostHTML(it, tf) {
  return `
    <div class="f2-cardwrap" style="transform:translateX(-50%) ${tf}; opacity:.35; z-index:1; pointer-events:none;">
      <div class="f2-face f2-front" style="position:relative;height:100%">
        <div class="f2-mid"><div class="f2-ar" style="font-size:30px">${escAttr(it.a)}</div></div>
      </div>
    </div>`;
}

// ── swipe to browse ──
let flashSwipeX = null;
function flashBindSwipe() {
  const scene = document.getElementById('f2-scene');
  if (!scene) return;
  scene.addEventListener('pointerdown', (e) => { flashSwipeX = e.clientX; });
  scene.addEventListener('pointerup', (e) => {
    if (flashSwipeX === null) return;
    const dx = e.clientX - flashSwipeX;
    flashSwipeX = null;
    if (Math.abs(dx) > 48) navCard(dx < 0 ? 1 : -1);
  });
}

// ── practice panel: word & sentence, works in both directions ──
function flashPracticeHTML(it) {
  const isWord = flashPractice === 'word';
  const promptText = isWord ? it.e : it.exen;
  const target = isWord ? it.a : it.ex;
  const targetPh = isWord ? it.p : getExPh(it);
  const micOk = coachMicSupported();

  return `
    <div class="f2-practice">
      <div class="f2-p-head">
        <span class="f2-p-title">${isWord ? 'Say it in Arabic' : 'Say the sentence'}</span>
        <span class="f2-p-toggle">
          <button class="${isWord ? 'on' : ''}" onclick="flashSetPractice('word')">Word</button>
          <button class="${isWord ? '' : 'on'}" onclick="flashSetPractice('sentence')">Sentence</button>
        </span>
      </div>
      <div class="f2-p-prompt">
        <div class="f2-p-prompt-text" dir="auto">"${escAttr(promptText)}"</div>
      </div>
      ${!flashCompared ? `
        <div class="f2-p-row">
          ${micOk ? `<button class="f2-p-mic" id="f2-mic" onclick="flashMic()" title="say it out loud">🎙</button>` : ''}
          <input id="f2-input" class="f2-p-input" dir="auto" placeholder="اكتب هنا… or Arabizi — both count">
          <button class="f2-p-check" onclick="flashCheck()">Check</button>
        </div>
        <div class="f2-p-hint">Compare against the card — no grades, just noticing the gap.</div>
      ` : flashCompareHTML(target, targetPh)}
    </div>
  `;
}

function flashCompareHTML(target, targetPh) {
  const words = target.split(/\s+/).filter(Boolean);
  const hits = words.filter(w => flashInput.includes(w));
  const chips = words.map(w =>
    `<span class="f2-p-chip ${flashInput.includes(w) ? 'hit' : ''}" dir="auto">${escAttr(w)}</span>`).join('');
  return `
    <div class="f2-p-compare">
      <div>
        <div class="f2-p-col-label">You said</div>
        <div class="f2-p-you" dir="auto">${escAttr(flashInput) || '<i>—</i>'}</div>
      </div>
      <div class="f2-p-target-col">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
          <span class="f2-p-col-label teal" style="margin-bottom:0">The card</span>
          <button class="d2-icon-btn" onclick="sayAr('${encodeURIComponent(target)}')" title="hear it">🔊</button>
        </div>
        <div class="f2-p-target">${escAttr(target)}</div>
        <div class="f2-p-target-ph">${escAttr(targetPh)}</div>
      </div>
    </div>
    <div class="f2-p-chips">
      <span class="f2-p-score">matched ${hits.length} of ${words.length}</span>
      ${chips}
    </div>
    <div class="d2-pill-row" style="margin-top:14px">
      <button class="d2-pill-red" onclick="flashTryAgain()">↻ Try again</button>
      <button class="d2-pill-gold" onclick="flashNextWord()">Next word →</button>
    </div>
  `;
}

function flashSetPractice(k) {
  if (k === flashPractice) return;
  flashPractice = k; flashCompared = false; flashInput = '';
  renderFlash();
}

function flashCheck() {
  const inp = document.getElementById('f2-input');
  flashInput = (inp ? inp.value : flashInput).trim();
  if (!flashInput) { if (inp) inp.focus(); return; }
  flashCompared = true;
  recordActivity();
  renderFlash();
}

function flashTryAgain() { flashCompared = false; renderFlash(); }
function flashNextWord() { flashCompared = false; flashInput = ''; navCard(1); }

// one-shot browser STT into the practice input
let flashRecognizer = null;
function flashMic() {
  if (!coachMicSupported()) return;
  const btn = document.getElementById('f2-mic');
  if (flashRecognizer) { try { flashRecognizer.stop(); } catch (e) {} return; }
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  flashRecognizer = new SR();
  flashRecognizer.lang = 'ar-SA';
  flashRecognizer.onresult = (ev) => {
    const t = ev.results[0][0].transcript;
    flashInput = (flashInput ? flashInput.trimEnd() + ' ' : '') + t.trim();
    const inp = document.getElementById('f2-input');
    if (inp) inp.value = flashInput;
  };
  flashRecognizer.onend = () => { flashRecognizer = null; btn?.classList.remove('listening'); };
  flashRecognizer.onerror = () => { flashRecognizer = null; btn?.classList.remove('listening'); };
  flashRecognizer.start();
  btn?.classList.add('listening');
}

function navCard(dir) {
  const newIdx = idx + dir;
  if (newIdx < 0 || newIdx >= deck.length) return;
  idx = newIdx;
  flipped = false;
  flashCompared = false; flashInput = '';
  updStats(); renderFlash();
}

function flip() {
  flipped = !flipped;
  // flip in place — only the mark/nav row below needs re-rendering
  const flipEl = document.querySelector('.f2-flip');
  if (flipEl) {
    flipEl.classList.toggle('flipped', flipped);
    const markRow = document.querySelector('.f2-mark-row, .f2-navround');
    if (markRow) {
      const html = flipped
        ? `<div class="f2-mark-row">
            <button class="d2-pill-red" onclick="mark(false)">Still learning</button>
            <button class="d2-pill-green" onclick="mark(true)">Got it ✓</button>
          </div>`
        : `<div class="f2-navround">
            <button onclick="navCard(-1)" ${idx === 0 ? 'disabled' : ''}>‹</button>
            <button onclick="navCard(1)" ${idx >= deck.length - 1 ? 'disabled' : ''}>›</button>
          </div>`;
      markRow.outerHTML = html;
    }
    return;
  }
  renderFlash();
}

function setFlashDir(dir) {
  flashDir = dir;
  flipped = false;
  renderFlash();
}
