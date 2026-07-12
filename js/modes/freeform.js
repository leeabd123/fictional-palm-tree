// ══════════════════════════════════════════════
// FREE-FORM — the low-scaffolding tier (§4): an open prompt, your words,
// AI coaching with a gentler bar and no reference answers. Unlocks per
// domain once that domain reaches Comfortable (§13 progressive unlock).
// ══════════════════════════════════════════════

let ffIdx = 0;
let ffText = '';
let ffPhase = 'prompt';   // 'prompt' | 'thinking' | 'feedback'
let ffFeedback = null;
let ffError = null;

function ffList() { return FREEFORM_PROMPTS.filter(f => f.domain === focusDomain()); }
function ffUnlocked() { return comfortUnlocked(focusDomain()); }

function renderFreeform() {
  const ca = document.getElementById('content-area');
  const dm = DOMAINS.find(d => d.id === focusDomain()) || DOMAINS[0];

  if (!ffUnlocked()) {
    ca.innerHTML = `
      <div class="coach-wrap">
        <button class="d2-back" onclick="setMode('home')">← home</button>
        <div class="d2-card" style="text-align:center">
          <div style="font-size:34px">🔒</div>
          <div class="c2-title" style="margin:10px 0 6px">Free-form unlocks with comfort</div>
          <div class="d2-note" style="margin:0 auto;max-width:380px">Finish the ${dm.label} basics in Guided practice first — free-form is where you fly without the scaffolding, and the basics are the wings.</div>
          <div class="d2-pill-row" style="margin-top:16px">
            <button class="d2-pill-gold" onclick="setMode('guided')">Back to Guided →</button>
          </div>
        </div>
      </div>`;
    return;
  }

  if (ffIdx >= ffList().length) ffIdx = 0;
  const it = ffList()[ffIdx];
  const configured = apiConfigured();

  if (ffPhase === 'thinking') {
    ca.innerHTML = `
      <div class="coach-wrap"><div class="c2-think">
        <div class="c2-think-halo"></div>
        <span class="c2-think-orb"><tariga-orb mode="thinking"></tariga-orb></span>
        <div class="c2-think-title">Your coach is listening…</div>
        <div class="c2-think-sub">reading your words as spoken Sudanese — no reference sheet this time</div>
        <div class="c2-think-answer" dir="auto">${escAttr(ffText)}</div>
      </div></div>`;
    return;
  }

  if (ffPhase === 'feedback' && ffFeedback) {
    const fb = ffFeedback;
    const kept = [...fb.vocab_used_required, ...fb.vocab_used_bonus];
    const swaps = [...fb.sounds_msa, ...fb.sounds_english_shaped]
      .filter(x => x.quote && x.sudanese).map(x => ({ from: x.quote, to: x.sudanese }));
    const notes = [
      ...(fb.missed_transitions || []).map(t => ({ q: t.phrase + ' (' + t.ph + ')', n: t.note })),
      ...fb.strengths.map(x => ({ q: x.quote, n: x.note })),
      ...fb.sounds_msa.map(x => ({ q: x.quote, n: x.note })),
      ...fb.sounds_english_shaped.map(x => ({ q: x.quote, n: x.note })),
    ];
    ca.innerHTML = `
      <div class="coach-wrap"><div class="c2-fb">
        <div><div class="c2-fb-label">Free-form · ${dm.label}</div>
        <div class="c2-fb-overall">${escAttr(fb.overall)}</div></div>
        <div class="c2-panel">
          <div class="c2-grid">
            <div><div class="c2-col-label">You said</div><div class="c2-you-text" dir="auto">${escAttr(ffText)}</div></div>
            <div class="c2-native-col">
              <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:10px">
                <span class="c2-col-label native" style="margin-bottom:0">Your words, upgraded</span>
                <button class="c2-speak-btn" onclick="sayAr('${encodeURIComponent(fb.suggestion.ar)}')" title="Hear it">🔊</button>
              </div>
              <div class="c2-native-ar">${escAttr(fb.suggestion.ar)}</div>
              <div class="c2-native-ph">${escAttr(fb.suggestion.ph)}</div>
              <div class="c2-sug-en">${escAttr(fb.suggestion.en)}</div>
            </div>
          </div>
          ${swaps.length ? `<div class="c2-chips-row"><span class="c2-swap-label" style="margin-left:0">swap</span>${swaps.map(x => `
            <span class="c2-swap-pair"><span class="c2-swap-from" dir="auto">${escAttr(x.from)}</span><span class="c2-swap-arrow">→</span><span class="c2-swap-to" dir="auto">${escAttr(x.to)}</span></span>`).join('')}</div>` : ''}
          ${notes.length ? `<div class="c2-notes">${notes.map(x => `<div class="c2-note-line"><b dir="auto">"${escAttr(x.q)}"</b> — ${escAttr(x.n)}</div>`).join('')}</div>` : ''}
          <div class="c2-sug-say" style="border-top:1px solid rgba(255,255,255,.06)">Say the upgraded version out loud. Twice.</div>
        </div>
        <div class="c2-encourage">${escAttr(fb.encouragement)}</div>
        <div class="c2-fb-actions">
          <button class="c2-ghost-pill" onclick="ffTryAgain()">↻ Say it differently</button>
          <button class="d2-pill-gold" onclick="ffNext()">Next prompt →</button>
        </div>
      </div></div>`;
    return;
  }

  ca.innerHTML = `
    <div class="coach-wrap">
      <button class="d2-back" onclick="setMode('home')">← home</button>
      <div class="c2-head">
        <div>
          <div class="c2-title">Free-form · ${dm.label}</div>
          <div class="c2-sub">${ffIdx + 1} of ${ffList().length} · no scaffolding, no vocab list — just you</div>
        </div>
        <div class="speak-q-nav" style="margin:0">
          <button class="arrow-btn" onclick="ffNav(-1)" ${ffIdx === 0 ? 'disabled' : ''}>←</button>
          <button class="arrow-btn" onclick="ffNav(1)" ${ffIdx >= ffList().length - 1 ? 'disabled' : ''}>→</button>
        </div>
      </div>
      <div class="c2-qcard">
        <div class="c2-qlabel">Open prompt</div>
        <div class="c2-qtext">${escAttr(it.en)}</div>
        <div class="c2-sub" style="margin-top:10px">${escAttr(it.hint)}</div>
      </div>
      <div class="c2-textbox">
        <textarea id="ff-input" dir="auto" rows="3" placeholder="اكتب أو اتكلم… anything, in your Sudanese — Arabizi counts"></textarea>
        <div class="c2-textbox-row">
          ${coachMicSupported() ? `<button class="c2-mic-small" id="ff-mic" onclick="ffMic()">🎙</button>` : ''}
          <span style="flex:1"></span>
          <button class="c2-compare" onclick="ffSubmit()" ${configured ? '' : 'disabled title="Connect the coach first (in Your coach)"'}>Coach me →</button>
        </div>
      </div>
      <div class="c2-footnote">Gentler bar here — short and loose is expected. This is expression, not a drill.</div>
      ${ffError ? `<div class="coach-error">${escAttr(ffError)}</div>` : ''}
    </div>`;
  const ta = document.getElementById('ff-input');
  if (ta) {
    ta.value = ffText;
    ta.addEventListener('input', () => { ffText = ta.value; });
  }
}

function ffMic() {
  prodMic('ff-mic', (t) => {
    ffText = (ffText ? ffText.trimEnd() + ' ' : '') + t;
    const ta = document.getElementById('ff-input');
    if (ta) ta.value = ffText;
  });
}

async function ffSubmit() {
  const ta = document.getElementById('ff-input');
  ffText = (ta ? ta.value : ffText).trim();
  if (!ffText) { if (ta) ta.focus(); return; }
  if (!apiConfigured()) { ffError = 'Connect the coach first — open Your coach once to set it up.'; renderFreeform(); return; }
  ffPhase = 'thinking'; ffError = null;
  renderFreeform();
  try {
    const fb = await coachEvaluate(buildFreeformRequest(ffList()[ffIdx], ffText));
    ffFeedback = fb;
    recordActivity();
    ffPhase = 'feedback';
  } catch (e) {
    ffPhase = 'prompt';
    ffError = 'Something went wrong reaching the coach (' + (e.message || e) + ') — your words are still here.';
  }
  renderFreeform();
}

function ffTryAgain() { ffPhase = 'prompt'; ffFeedback = null; renderFreeform(); }
function ffNext() { ffNav(1); if (ffIdx === 0) renderFreeform(); }
function ffNav(dir) {
  const n = ffIdx + dir;
  if (n < 0 || n >= ffList().length) { ffPhase = 'prompt'; ffText = ''; ffFeedback = null; renderFreeform(); return; }
  ffIdx = n; ffPhase = 'prompt'; ffText = ''; ffFeedback = null; ffError = null;
  renderFreeform();
}
