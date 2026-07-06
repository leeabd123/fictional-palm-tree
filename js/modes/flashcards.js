// Flashcards — the design's floating 3D card, ported to the live deck.
// Tap to flip, swipe (or arrows) to browse with a slide animation,
// direction pills for recognition (عربي → EN) vs production (EN → عربي),
// speak-aloud buttons, progress dots, and the Word/Sentence practice panel
// that works in both directions.

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
  u.lang = 'ar-SA'; u.rate = 0.85;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
}

function renderFlash() {
  const ca = document.getElementById('content-area');
  if (idx >= deck.length) { renderResult(); return; }
  const it = deck[idx];
  const isAR = flashDir === 'ar';

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
        ${[-2, -1, 0, 1, 2].map(d => {
          const j = idx + d;
          return (j >= 0 && j < deck.length) ? flashCardHTML(deck[j], d, isAR) : '';
        }).join('')}
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

// ── the design's 3D card carousel ──
// d = offset from the active card. Exact values from the design export:
// translateX(-50 + d*64 %) translateZ(active?0:-90px) rotateY(d*-26deg)
// scale(active?1:.84) · neighbors at opacity .55 · |d|>=2 hidden.
function flashCardTf(d) {
  const active = d === 0;
  return {
    tf: `translateX(${-50 + d * 64}%) translateZ(${active ? 0 : -90}px) rotateY(${d * -26}deg) scale(${active ? 1 : 0.84})`,
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
                : `<div class="f2-en-prompt">${escAttr(it.e)}</div><div class="f2-en-hint">say it in Arabic below — or flip anytime</div>`}
            </div>
            <div class="f2-hint">tap to flip · swipe to browse</div>
          </div>
          ${active ? `
          <div class="f2-face f2-back">
            <div style="display:flex;justify-content:space-between;align-items:baseline;gap:12px">
              <div class="f2-back-ar">${escAttr(it.a)}</div>
              <span style="display:inline-flex;gap:6px;align-items:center">
                <span class="f2-ph" style="font-size:12px;white-space:nowrap">${escAttr(it.p)}</span>
                ${speakerSVG('#a09e9a', encodeURIComponent(it.a))}
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
    if (Math.abs(dx) > 48) {
      flashJustSwiped = true;
      setTimeout(() => { flashJustSwiped = false; }, 350);
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
  const words = target.split(/\s+/).filter(w => w.length > 1);
  const norm = flashInput.toLowerCase();
  const hit = (w) => norm.includes(w.toLowerCase().replace(/[.,!?،؟]/g, ''));
  const hits = words.filter(hit);
  const chips = words.map(w =>
    `<span class="f2-p-chip ${hit(w) ? 'hit' : ''}" dir="auto">${escAttr(w)}</span>`).join('');
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
    <div class="f2-p-chips">
      <span class="f2-p-score">matched ${hits.length} of ${words.length}</span>
      ${chips}
    </div>
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
    setTimeout(() => { flashGliding = false; renderFlash(); }, 660);
  } else {
    renderFlash();
  }
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
  flashCompared = false; flashInput = '';
  renderFlash();
}
