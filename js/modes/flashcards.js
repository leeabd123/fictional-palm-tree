// Flashcards — the design's floating 3D card, ported to the live deck.
// Tap to flip, swipe (or arrows) to browse with a slide animation,
// direction pills for recognition (عربي → EN) vs production (EN → عربي),
// speak-aloud buttons and progress dots.
//
// Two sub-modes, so browsing and producing never compete on one screen:
//   'browse'   — just the cards (flip / swipe / mark), plus an invitation
//   'practice' — the Word/Sentence produce-and-compare panel, full screen,
//                with the card kept hidden until you've tried

let flashView = 'browse';       // 'browse' | 'practice'
let flashPractice = 'word';     // 'word' | 'sentence'
let flashCompared = false;
let flashInput = '';

const FLASH_SRC_LABEL = { v1: 'Solja episode', v2: 'Ala episode', all: 'Both episodes', p2: 'Glossary', extra: 'Deep vocab' };

// the design's icons (emoji render as flat blobs — these match the export)
function speakerSVG(color, enc) {
  return `<button class="d2-icon-btn" onclick="sayAr('${enc}');event.stopPropagation()" title="hear it">
    <svg width="16" height="16" viewBox="0 0 20 20" fill="${color}"><path d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.784L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.797-3.784a1 1 0 011.617.076z"></path><path d="M14.657 5.343a1 1 0 011.414 0A7.975 7.975 0 0118.4 11a7.975 7.975 0 01-2.329 5.657 1 1 0 01-1.414-1.414A5.975 5.975 0 0016.4 11c0-1.594-.62-3.09-1.743-4.243a1 1 0 010-1.414z"></path></svg>
  </button>`;
}
const MIC_SVG = `<svg width="19" height="19" viewBox="0 0 20 20" fill="#dcd2ff"><path fill-rule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clip-rule="evenodd"></path></svg>`;

// Speak Arabic out loud with the browser voice — rough but carries the melody.
function sayAr(enc) {
  if (!('speechSynthesis' in window)) return;
  const u = new SpeechSynthesisUtterance(decodeURIComponent(enc));
  u.lang = 'ar-SA'; u.rate = window._sayArRate || 0.88;   // shadowing speed chips set this
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
}

function renderFlash() {
  if (flashView === 'practice') { renderFlashPractice(); return; }
  const ca = document.getElementById('content-area');
  if (idx >= deck.length) { renderResult(); return; }
  const it = deck[idx];
  const isAR = flashDir === 'ar';


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
        ${[-2, -1, 0, 1, 2].map(d => {
          const j = idx + d;
          return (j >= 0 && j < deck.length) ? flashCardHTML(deck[j], d, isAR) : '';
        }).join('')}
      </div>
      <div class="f2-shadow"></div>
      <div class="f2-dots">${flashDotsHTML()}</div>

      ${flashRowHTML()}

      <div style="text-align:center;margin-top:22px">
        <button class="d2-pill-gold" onclick="flashSetView('practice')">✎ Practice mode — produce it yourself, then compare →</button>
        <div class="d2-item-note" style="margin-top:7px">word or full sentence · voice or typing · rated word by word</div>
      </div>
    </div>
  `;

  flashBindSwipe();
}

// ── the practice sub-mode: its own focused screen ──
function renderFlashPractice() {
  const ca = document.getElementById('content-area');
  if (idx >= deck.length) { renderResult(); return; }
  const it = deck[idx];
  const isAR = flashDir === 'ar';
  ca.innerHTML = `
    <div class="coach-wrap">
      <button class="d2-back" onclick="flashSetView('browse')">← back to the cards</button>
      <div class="f2-head">
        <div>
          <div class="d2-title" style="margin-bottom:0">Flashcard practice</div>
          <div class="f2-counter">${idx + 1} of ${deck.length} · ${FLASH_SRC_LABEL[src] || 'deck'}</div>
        </div>
        <div class="f2-dir">
          <button class="${isAR ? 'on' : ''}" onclick="setFlashDir('ar')">عربي → EN</button>
          <button class="${isAR ? '' : 'on'}" onclick="setFlashDir('en')">EN → عربي</button>
        </div>
      </div>

      ${flashPracticeHTML(it)}

      <div class="f2-navround" style="margin-top:16px">
        <button onclick="navCard(-1)" ${idx === 0 ? 'disabled' : ''}>‹</button>
        <button onclick="navCard(1)" ${idx >= deck.length - 1 ? 'disabled' : ''}>›</button>
      </div>
      <div class="d2-note" style="text-align:center;margin-top:8px">the card stays hidden here — struggle first, then Check compares for you</div>
    </div>
  `;
  flashBindInput();
}

function flashSetView(v) {
  flashView = v;
  flashCompared = false; flashInput = '';
  renderFlash();
}

// 5-dot window centered on the current card
function flashDotsHTML() {
  const dotStart = Math.max(0, Math.min(idx - 2, deck.length - 5));
  return deck.slice(dotStart, dotStart + 5)
    .map((_, i) => `<div class="f2-dot ${dotStart + i === idx ? 'on' : ''}"></div>`).join('');
}

function flashRowHTML() {
  return flipped ? `
      <div class="f2-mark-row">
        <button class="d2-pill-red" onclick="flashMark(false)">Still learning</button>
        <button class="d2-pill-green" onclick="flashMark(true)">Got it ✓</button>
      </div>` : `
      <div class="f2-navround">
        <button onclick="navCard(-1)" ${idx === 0 ? 'disabled' : ''}>‹</button>
        <button onclick="navCard(1)" ${idx >= deck.length - 1 ? 'disabled' : ''}>›</button>
      </div>`;
}

function flashBindInput() {
  const inp = document.getElementById('f2-input');
  if (inp) {
    inp.value = flashInput;
    inp.addEventListener('input', () => { flashInput = inp.value; });
    inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') flashCheck(); });
  }
}

// ── the design's 3D card carousel ──
// d = offset from the active card. Spec: neighbors ±72% X, pushed back
// translateZ(-120px), rotateY(∓12deg), opacity .55; |d|>=2 hidden.
function flashCardTf(d) {
  const active = d === 0;
  return {
    tf: `translateX(${-50 + d * 72}%) translateZ(${active ? 0 : -120}px) rotateY(${d * -12}deg)`,
    op: active ? 1 : Math.abs(d) >= 2 ? 0 : 0.55,
    z: 5 - Math.abs(d),
    pe: Math.abs(d) >= 2 ? 'none' : 'auto',
  };
}

function flashCardHTML(it, d, isAR) {
  const active = d === 0;
  const t = flashCardTf(d);
  return `
    <div class="f2-cardwrap" data-off="${d}" style="transform:${t.tf}; opacity:${t.op}; z-index:${t.z}; pointer-events:${t.pe};">
      <div class="f2-float" style="animation:${active ? 'f2Floaty 6.5s ease-in-out infinite' : 'none'}">
        <div class="f2-flip ${active && flipped ? 'flipped' : ''}" onclick="flashTap(${d})">
          <div class="f2-face f2-front">
            ${active ? '<div class="f2-sweep"></div>' : ''}
            <div style="display:flex;justify-content:space-between;align-items:flex-start">
              <div class="f2-tags">
                <span class="f2-tag src">${it.src === 'v1' ? 'Video 1' : it.src === 'v2' ? 'Video 2' : 'Glossary'}</span>
                <span class="f2-tag">${escAttr(it.cat)}</span>
              </div>
              <span style="display:inline-flex;gap:4px;align-items:center">
                ${speakerSVG('#a09e9a', encodeURIComponent(it.a))}
                ${active ? starBtnHTML(it.a) : '<span style="color:#7a756e;font-size:17px">☆</span>'}
              </span>
            </div>
            <div class="f2-mid">
              ${isAR
                ? `<div class="f2-ar">${escAttr(it.a)}</div><div class="f2-ph">${escAttr(it.p)}</div>`
                : `<div class="f2-en-prompt">${escAttr(it.e)}</div><div class="f2-en-hint">flip for the Arabic — or produce it in practice mode</div>`}
            </div>
            <div class="f2-hint">tap to flip · swipe to browse</div>
          </div>
          ${active ? `
          <div class="f2-face f2-back">
            <div style="display:flex;justify-content:space-between;align-items:baseline;gap:12px">
              <div class="f2-back-ar">${escAttr(it.a)}</div>
              <span style="display:inline-flex;gap:6px;align-items:center">
                <span class="f2-ph" style="font-size:12px;white-space:nowrap">${escAttr(it.p)}</span>
                ${speakerSVG('#a09e9a', encodeURIComponent(it.a + '… ' + it.ex))}
              </span>
            </div>
            <div class="f2-back-en">${escAttr(it.e)}</div>
            <div class="f2-ctx">${escAttr(it.ctx)}</div>
            <div class="d2-inset" style="margin-top:0">
              <div class="d2-inset-ar">${escAttr(it.ex)}</div>
              <div class="d2-inset-ph">${getExPh(it)}</div>
              <div class="d2-inset-en">${escAttr(it.exen)}</div>
            </div>
          </div>` : ''}
        </div>
      </div>
    </div>`;
}


// Mark buttons advance through the glide (the global mark() re-renders the
// whole screen, which reads as a flash). Same bookkeeping, smooth motion.
function flashMark(know) {
  streak.push(know);
  recordActivity();
  const it = deck[idx];
  if (know) knowSet.add(it.a); else learnSet.add(it.a);
  if (idx >= deck.length - 1) { idx++; updStats(); renderFlash(); return; } // deck done -> result screen
  flipped = false;
  // un-flip the card first so the carousel glides face-up
  const flipEl = document.querySelector('#f2-scene .f2-cardwrap[data-off="0"] .f2-flip');
  if (flipEl) flipEl.classList.remove('flipped');
  navCard(1);
}

// tap: active card flips, a side card slides into focus (like the design)
function flashTap(d) {
  if (flashJustSwiped) return;
  if (d === 0) flip();
  else navCard(d);
}

// ── swipe to browse ──
let flashSwipeX = null;
let flashJustSwiped = false;
function flashBindSwipe() {
  const scene = document.getElementById('f2-scene');
  if (!scene) return;
  scene.addEventListener('pointerdown', (e) => { flashSwipeX = e.clientX; });
  scene.addEventListener('pointerup', (e) => {
    if (flashSwipeX === null) return;
    const dx = e.clientX - flashSwipeX;
    flashSwipeX = null;
    if (Math.abs(dx) > 45) {
      flashJustSwiped = true;
      setTimeout(() => { flashJustSwiped = false; }, 300);
      navCard(dx < 0 ? 1 : -1);
    }
  });
}

// ── practice panel: word & sentence, works in both directions ──
// عربي → EN: read the Arabic, produce the meaning in English.
// EN → عربي: read the English, produce the Arabic (script or Arabizi).
function flashPracticeHTML(it) {
  const isWord = flashPractice === 'word';
  const isAR = flashDir === 'ar';
  const prompt = isWord ? (isAR ? it.a : it.e) : (isAR ? it.ex : it.exen);
  const promptPh = isAR ? (isWord ? it.p : getExPh(it)) : null;
  const title = isAR
    ? (isWord ? 'What does it mean?' : 'What does the sentence mean?')
    : (isWord ? 'Say it in Arabic' : 'Say the sentence in Arabic');
  const placeholder = isAR ? 'type the meaning in English…' : 'اكتب هنا… or Arabizi — both count';
  const micOk = !isAR && coachMicSupported();

  return `
    <div class="f2-practice">
      <div class="f2-p-head">
        <span class="f2-p-title">${title}</span>
        <span class="f2-p-toggle">
          <button class="${isWord ? 'on' : ''}" onclick="flashSetPractice('word')">Word</button>
          <button class="${isWord ? '' : 'on'}" onclick="flashSetPractice('sentence')">Sentence</button>
        </span>
      </div>
      <div class="f2-p-prompt">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:10px">
          <div class="f2-p-prompt-text" dir="auto">"${escAttr(prompt)}"</div>
          ${isAR ? speakerSVG('#a09e9a', encodeURIComponent(prompt)) : ''}
        </div>
        ${promptPh ? `<div class="d2-inset-ph" style="margin-top:4px">${escAttr(promptPh)}</div>` : ''}
      </div>
      ${!flashCompared ? `
        <div class="f2-p-row">
          ${micOk ? `<button class="f2-p-mic" id="f2-mic" onclick="flashMic()" title="say it out loud">${MIC_SVG}</button>` : ''}
          <input id="f2-input" class="f2-p-input" dir="auto" placeholder="${placeholder}">
          <button class="f2-p-check" onclick="flashCheck()">Check</button>
        </div>
        <div class="f2-p-hint">Compare against the card — no grades, just noticing the gap.</div>
      ` : flashCompareHTML(it)}
    </div>
  `;
}

function flashCompareHTML(it) {
  const isWord = flashPractice === 'word';
  const isAR = flashDir === 'ar';
  const target = isWord ? (isAR ? it.e : it.a) : (isAR ? it.exen : it.ex);
  const targetPh = isAR ? null : (isWord ? it.p : getExPh(it));
  // shared engine (js/core/produce.js): Arabic script OR Arabizi counts
  const m = prodMatch(flashInput, target, targetPh || '');
  return `
    <div class="f2-p-compare">
      <div>
        <div class="f2-p-col-label">You said</div>
        <div class="f2-p-you" dir="auto">${escAttr(flashInput) || '<i>—</i>'}</div>
      </div>
      <div class="f2-p-target-col">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
          <span class="f2-p-col-label teal" style="margin-bottom:0">The card</span>
          ${isAR ? '' : speakerSVG('#4fd8c4', encodeURIComponent(target))}
        </div>
        <div class="f2-p-target" style="${isAR ? 'font-family:var(--sans);font-size:14px;direction:ltr;text-align:left' : ''}">${escAttr(target)}</div>
        ${targetPh ? `<div class="f2-p-target-ph">${escAttr(targetPh)}</div>` : ''}
      </div>
    </div>
    <div class="f2-p-chips">${prodChipsHTML(m)}</div>
    <div class="d2-pill-row" style="margin-top:14px">
      <button class="c2-ghost-pill" onclick="flashTryAgain()">↻ Try again</button>
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

let flashGliding = false;
function navCard(dir) {
  const newIdx = idx + dir;
  if (newIdx < 0 || newIdx >= deck.length || flashGliding) return;
  idx = newIdx;
  flipped = false;
  flashCompared = false; flashInput = '';
  updStats();
  // glide the existing cards to their new carousel positions (the .65s
  // wrapper transition does the motion), then re-render to re-center
  const wraps = document.querySelectorAll('#f2-scene .f2-cardwrap');
  if (wraps.length) {
    flashGliding = true;
    wraps.forEach(w => {
      const nd = parseInt(w.dataset.off, 10) - dir;
      const t = flashCardTf(nd);
      w.dataset.off = nd;
      w.style.transform = t.tf; w.style.opacity = t.op;
      w.style.zIndex = t.z; w.style.pointerEvents = t.pe;
      const fl = w.querySelector('.f2-float');
      if (fl) fl.style.animation = nd === 0 ? 'f2Floaty 6.5s ease-in-out infinite' : 'none';
    });
    setTimeout(() => { flashGliding = false; flashSettle(dir); }, 660);
  } else {
    renderFlash();
  }
}

// After the glide, patch the DOM surgically — a full re-render repaints the
// whole screen (visible flash) and replays the sweep. Here only the cards
// that changed roles are swapped; positions/styles are already correct.
function flashSettle(dir) {
  const scene = document.getElementById('f2-scene');
  if (!scene) { renderFlash(); return; }
  const isAR = flashDir === 'ar';
  // drop cards pushed outside the window
  scene.querySelectorAll('.f2-cardwrap').forEach(w => {
    if (Math.abs(parseInt(w.dataset.off, 10)) >= 3) w.remove();
  });
  // demote the previous active card (loses back face / sweep / live star)
  const prevOff = -dir;
  const prevEl = scene.querySelector(`.f2-cardwrap[data-off="${prevOff}"]`);
  const prevIdx = idx + prevOff;
  if (prevEl && prevIdx >= 0 && prevIdx < deck.length) prevEl.outerHTML = flashCardHTML(deck[prevIdx], prevOff, isAR);
  // promote the new active card (gains back face / sweep / star button)
  const nowEl = scene.querySelector('.f2-cardwrap[data-off="0"]');
  if (nowEl) nowEl.outerHTML = flashCardHTML(deck[idx], 0, isAR);
  else scene.insertAdjacentHTML('beforeend', flashCardHTML(deck[idx], 0, isAR));
  // make sure every window slot that should exist does (hidden edges too)
  [-2, -1, 1, 2].forEach(off => {
    const k = idx + off;
    if (k >= 0 && k < deck.length && !scene.querySelector(`.f2-cardwrap[data-off="${off}"]`)) {
      scene.insertAdjacentHTML('beforeend', flashCardHTML(deck[k], off, isAR));
    }
  });
  // header counter, dots, nav row, practice panel — updated in place
  const counter = document.querySelector('.f2-counter');
  if (counter) counter.textContent = `${idx + 1} of ${deck.length} · ${FLASH_SRC_LABEL[src] || 'deck'}`;
  const dots = document.querySelector('.f2-dots');
  if (dots) dots.innerHTML = flashDotsHTML();
  const row = document.querySelector('.f2-mark-row, .f2-navround');
  if (row) row.outerHTML = flashRowHTML();
  const practice = document.querySelector('.f2-practice');
  if (practice) { practice.outerHTML = flashPracticeHTML(deck[idx]); flashBindInput(); }
}

function flip() {
  flipped = !flipped;
  // flip in place — only the mark/nav row below needs re-rendering
  const flipEl = document.querySelector('#f2-scene .f2-cardwrap[data-off="0"] .f2-flip');
  if (flipEl) {
    flipEl.classList.toggle('flipped', flipped);
    const sw = flipEl.querySelector('.f2-sweep');
    if (sw) { sw.style.animation = 'none'; void sw.offsetWidth; sw.style.animation = 'f2Sweep 1.1s .1s cubic-bezier(.3,.7,.4,1) both'; }
    const markRow = document.querySelector('.f2-mark-row, .f2-navround');
    if (markRow) markRow.outerHTML = flashRowHTML();
    return;
  }
  renderFlash();
}

function setFlashDir(dir) {
  flashDir = dir;
  flipped = false;
  flashCompared = false; flashInput = '';
  renderFlash();
}
