// Speak & Respond — the AI-coached core loop, in the Claude-designed skin.
// scenario → learner answers out loud (or types; Arabic script or Arabizi) →
// Claude compares it against native-speaker reference answers →
// comparison-based feedback (never "correct/incorrect") → attempt stored →
// on later attempts, a before/after journey view shows real growth.

let coachIdx = 0;
let coachPhase = 'prompt';       // 'prompt' | 'voice' | 'thinking' | 'feedback' | 'journey'
let coachText = '';
let coachFeedback = null;
let coachError = null;
let coachHintOpen = false;       // "show hint" reveal on the question card
let coachInputMode = null;       // 'voice' | 'text' — resolved lazily so mic support is known
let coachSettingsOpen = false;
let coachModelsRevealed = false;

// event-logging state (§9): when this scenario's prompt first appeared
// (→ time-spent), and whether the mic was used for this attempt
let coachPromptAt = null;
let coachUsedVoice = false;

// Rough phonetics for the most common weave chips (chips fall back to
// Arabic-only when a phrase isn't in this map).
const COACH_CHIP_PH = {
  'صراحة': 'saraha', 'يعني': 'ya3ni', 'وبتاع': 'w-bita3', 'الحمد لله': 'al-hamdu lillah',
  'بالجد': 'bil-jadd', 'شديد': 'shadid', 'هسه': 'hissa', 'من حقه': 'min haqquh',
  'نفسيتك': 'nafseeytak', 'فاهماني': 'fahmani', 'بالذات': 'bil-zat', 'شكراً': 'shukran',
  'حبوب': 'haboob', 'رهيب': 'raheeb', 'بريدك': 'bareedak', 'فخور': 'fakhoor',
  'فنان': 'fanan', 'مجهول': 'majhool', 'نفسية': 'nafsiya', 'أصلي': 'asli',
  'الجمهور': 'al-jumhoor', 'هويتنا': 'huwiyyatna', 'بيناتنا': 'binatna',
  'المصلحة': 'al-maslaha', 'التقبل': 'at-taqabbul', 'كوني كونيك': 'kooni koonik',
  'على طبيعتك': '3ala tabee3tak', 'تكلة': 'takkala', 'دفنتلي': 'dafantali',
};

function esc(s) { return escAttr(String(s == null ? '' : s)); }

function coachScenario() {
  if (coachIdx >= SPEAK_QA.length) coachIdx = 0;
  return SPEAK_QA[coachIdx];
}

function coachMode() {
  if (coachInputMode === null) coachInputMode = coachMicSupported() ? 'voice' : 'text';
  return coachInputMode;
}

// ── Entry point ──
function renderSpeak() {
  const ca0 = document.getElementById('content-area');
  if (!SPEAK_QA.length) {
    ca0.innerHTML = '<div class="coach-wrap"><div class="d2-note" style="text-align:center;margin-top:48px">Every coach scenario is currently hidden.<br>Founder tools → Content manager → Show / hide brings them back.</div></div>';
    return;
  }
  if (coachPhase === 'prompt' && !coachPromptAt) coachPromptAt = Date.now();
  const ca = document.getElementById('content-area');
  if (coachPhase === 'voice') { ca.innerHTML = coachVoiceHTML(); return; }
  if (coachPhase === 'thinking') { ca.innerHTML = coachThinkingHTML(); return; }
  if (coachPhase === 'feedback' && coachFeedback) { ca.innerHTML = coachFeedbackHTML(); return; }
  if (coachPhase === 'journey') { ca.innerHTML = coachJourneyHTML(); return; }
  ca.innerHTML = coachPromptHTML();
  const ta = document.getElementById('coach-input');
  if (ta) {
    ta.value = coachText;
    ta.addEventListener('input', () => { coachText = ta.value; coachAutosize(ta); coachUpdateWeave(); });
    coachAutosize(ta);
  }
  coachUpdateWeave();
}

// Light up the vocab chips the learner has already woven in (Arabic-script
// match only — the AI does the authoritative accounting, Arabizi included).
function coachUpdateWeave() {
  document.querySelectorAll('.c2-chip').forEach(chip => {
    const ar = chip.dataset.ar || '';
    const core = ar.split('/')[0].trim();
    chip.classList.toggle('hit', !!core && coachText.includes(core));
  });
}

function coachMicSupported() {
  return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
}

function coachAutosize(ta) {
  ta.style.height = 'auto';
  ta.style.height = Math.min(ta.scrollHeight, 220) + 'px';
}

// ── Scenario + input screen ──
function coachPromptHTML() {
  const it = coachScenario();
  const attempts = getAttempts(it);
  const configured = apiConfigured();
  const mode = coachMode();

  return `
    <div class="coach-wrap mode-anim">
      <div class="mode-intro" style="margin-bottom:16px;padding-bottom:16px">
        <div class="mode-badge"><svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clip-rule="evenodd"/></svg></div>
        <div style="flex:1">
          <div class="mode-kicker">Speak it · scenario ${coachIdx + 1} of ${SPEAK_QA.length}</div>
          <div class="mode-lede">Answer the way you would with family — voice or text. The coach compares, it never grades.</div>
        </div>
        <div class="speak-q-nav" style="margin:0">
          <button class="arrow-btn" onclick="coachNav(-1)" ${coachIdx === 0 ? 'disabled' : ''}>←</button>
          <button class="arrow-btn" onclick="coachNav(1)" ${coachIdx >= SPEAK_QA.length - 1 ? 'disabled' : ''}>→</button>
        </div>
      </div>

      ${attempts.length ? `
        <button class="c2-journey-pill" onclick="coachShowJourney()">
          ✦ You've answered this ${attempts.length === 1 ? 'once' : attempts.length + ' times'} — see your journey
        </button>` : ''}

      <div class="c2-qcard ts-card">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">
          <span class="mode-badge" style="width:30px;height:30px;box-shadow:0 0 0 1px var(--gold-border)"><svg style="width:15px;height:15px" viewBox="0 0 24 24" fill="currentColor"><path d="M12 14a3 3 0 003-3V5a3 3 0 00-6 0v6a3 3 0 003 3z"/><path d="M19 11a7 7 0 01-14 0H3a9 9 0 008 8.94V23h2v-3.06A9 9 0 0021 11h-2z"/></svg></span>
          <span style="font-size:12px;color:var(--text-muted)">Scenario — ${esc(it.context)}</span>
        </div>
        <div class="bubble them" style="max-width:100%;direction:ltr;text-align:left;font-family:'DM Sans',sans-serif;font-size:22px;font-weight:500">
          ${esc(it.qen)}
          <div class="tl">${coachHintOpen ? esc(it.qar) + ' · ' + esc(it.qph) : 'say it in Sudanese Arabic'}</div>
        </div>
        <button class="c2-hint-btn" onclick="coachToggleHint()">${coachHintOpen ? 'hide hint' : 'show hint — how it sounds'}</button>
        <div class="c2-hint" id="coach-hint" style="${coachHintOpen ? '' : 'display:none'}">
          <div class="c2-hint-ar">${esc(it.qar)}</div>
          <div class="c2-hint-ph">${esc(it.qph)}</div>
        </div>
      </div>

      <div class="c2-weave">
        <span class="c2-weave-label">weave these in — the coach listens for them:</span>
        ${it.required.map(v => coachChipHTML(v, false)).join('')}
        ${it.bonus.map(v => coachChipHTML(v, true)).join('')}
      </div>

      ${coachStarters(it).length ? `
      <div class="c2-weave" style="margin-top:4px">
        <span class="c2-weave-label">stuck? borrow an opener (tap to drop it in):</span>
        ${coachStarters(it).map((s, i) =>
          `<button class="c2-chip" style="font:inherit;cursor:pointer" onclick="coachStarterTap(${i})" dir="auto">${esc(s.ar)}${s.ph ? `<span class="ph">${esc(s.ph)}</span>` : ''}</button>`).join('')}
      </div>` : ''}

      ${mode === 'voice' ? `
        <div class="c2-voicefirst">
          ${typeof neonOn === 'function' && neonOn() ? `
          <button class="c2-orb-mic" onclick="coachVoiceBegin()" ${configured ? '' : 'disabled title="Connect the coach below first"'} title="Tap orb to speak"><tariga-orb mode="idle"></tariga-orb></button>
          <div class="c2-mic-note">Tap orb to speak</div>
          <button class="c2-linklike" onclick="coachUseText()" style="letter-spacing:.18em;text-transform:uppercase;font-size:10px">or type instead</button>
          ` : `
          <button class="c2-mic-big" onclick="coachVoiceBegin()" ${configured ? '' : 'disabled title="Connect the coach below first"'}>${UI_MIC}</button>
          <div class="c2-mic-note">Tap and say it out loud</div>
          <button class="c2-linklike" onclick="coachUseText()">or type it instead</button>`}
        </div>
      ` : `
        <div class="c2-textbox">
          <textarea id="coach-input" dir="auto" rows="3"
            placeholder="اكتب ردك هنا… or type it in Arabizi (saraha, 3ashan…) — both count"></textarea>
          <div class="c2-textbox-row">
            ${coachMicSupported() ? `<button class="c2-mic-small" onclick="coachVoiceBegin()" title="Say it out loud instead">${UI_MIC}</button>` : ''}
            <span style="flex:1"></span>
            <button class="c2-compare" onclick="coachSubmit()" ${configured ? '' : 'disabled title="Connect the coach below first"'}>Compare →</button>
          </div>
        </div>
      `}

      <div class="c2-footnote">No "correct answer" here — just how your family says it.<br>
        <button class="c2-linklike" onclick="coachToggleModels()">${coachModelsRevealed ? 'hide' : 'peek at'} natural examples</button>
      </div>

      ${coachError ? `<div class="coach-error">${esc(coachError)}</div>` : ''}

      <div id="coach-models" style="${coachModelsRevealed ? '' : 'display:none'}">
        ${coachModelsHTML(it)}
      </div>

      ${configured ? `
        <button class="coach-settings-toggle subtle" onclick="coachToggleSettings()">coach settings</button>
        <div id="coach-settings" style="${coachSettingsOpen ? '' : 'display:none'}">${coachSettingsHTML()}</div>
      ` : coachConnectHTML()}
    </div>
  `;
}

// Sentence starters lifted from this scenario's real model answers — the
// first couple of words of each, deduplicated. A tap drops one into the
// answer box, so a blank-page freeze always has a way in.
function coachStarters(it) {
  const seen = new Set(), out = [];
  (it.model || []).forEach(m => {
    const ar = String(m.ar || '').split(/\s+/).slice(0, 2).join(' ');
    const ph = String(m.ph || '').split(/\s+/).slice(0, 2).join(' ');
    if (ar && !seen.has(ar)) { seen.add(ar); out.push({ ar, ph }); }
  });
  return out.slice(0, 3);
}

function coachStarterTap(i) {
  const s = coachStarters(coachScenario())[i];
  if (!s) return;
  coachInputMode = 'text';
  coachText = coachText.trim() ? coachText.trimEnd() + ' ' + s.ar : s.ar;
  renderSpeak();
  const ta = document.getElementById('coach-input');
  if (ta) { ta.focus(); ta.selectionStart = ta.selectionEnd = ta.value.length; }
}

function coachChipHTML(v, bonus) {
  const core = v.split('/')[0].trim();
  const ph = COACH_CHIP_PH[core];
  return `<span class="c2-chip ${bonus ? 'bonus' : ''}" data-ar="${esc(v)}" dir="auto">${esc(v)}${ph ? `<span class="ph">${esc(ph)}</span>` : ''}</span>`;
}

function coachToggleHint() {
  coachHintOpen = !coachHintOpen;
  const el = document.getElementById('coach-hint');
  if (el) el.style.display = coachHintOpen ? '' : 'none';
  document.querySelectorAll('.c2-hint-btn').forEach(b => {
    b.textContent = coachHintOpen ? 'hide hint' : 'show hint — how it sounds';
  });
}

function coachUseText() {
  coachInputMode = 'text';
  renderSpeak();
}

function coachModelsHTML(it) {
  return `
    <div class="c2-panel" style="margin-top:14px;text-align:left">
      <div class="c2-col-label native" style="margin-bottom:12px">Natural ways speakers have answered this — not "the correct way", just real ones</div>
      ${it.model.map(m => `
        <div class="speak-model-line">
          <div class="c2-native-ar">${esc(m.ar)}</div>
          <div class="c2-native-ph">${esc(m.ph)}</div>
          <div class="c2-sug-en">${esc(m.en)}</div>
        </div>`).join('')}
      <div class="c2-note-line" style="margin-top:10px"><b>Tip:</b> ${esc(it.tip)}</div>
    </div>
  `;
}

// ── Voice capture — full-screen listening state (tiered response modes).
// Browser STT is demo-grade on Sudanese by design of the underlying models,
// which is exactly why the transcript stays editable before you compare.
let coachRecognizer = null;
let coachVoiceInterim = '';
let coachVoicePrevText = '';

function coachVoiceBegin() {
  if (!coachMicSupported()) { coachInputMode = 'text'; renderSpeak(); return; }
  coachUsedVoice = true;
  coachVoicePrevText = coachText;
  coachVoiceInterim = '';
  coachPhase = 'voice';
  coachError = null;
  renderSpeak();

  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  coachRecognizer = new SR();
  coachRecognizer.lang = 'ar-SA';
  coachRecognizer.interimResults = true;
  coachRecognizer.continuous = true;
  coachRecognizer.onresult = (ev) => {
    let interim = '';
    for (let i = ev.resultIndex; i < ev.results.length; i++) {
      if (ev.results[i].isFinal) {
        coachText = (coachText ? coachText.trimEnd() + ' ' : '') + ev.results[i][0].transcript.trim();
      } else {
        interim += ev.results[i][0].transcript;
      }
    }
    coachVoiceInterim = interim;
    coachVoiceLiveUpdate();
  };
  coachRecognizer.onend = () => { coachRecognizer = null; };
  coachRecognizer.onerror = (ev) => {
    coachRecognizer = null;
    if (coachPhase === 'voice') {
      coachPhase = 'prompt';
      coachInputMode = 'text';
      coachError = ev.error === 'not-allowed'
        ? 'The mic was blocked — allow microphone access, or type it instead.'
        : 'Voice input hiccuped (' + (ev.error || 'unknown') + ') — type it instead, Arabizi counts.';
      renderSpeak();
    }
  };
  try { coachRecognizer.start(); } catch (e) { /* already started */ }
}

function coachVoiceLiveUpdate() {
  const el = document.getElementById('c2-voice-live');
  if (!el) return;
  const full = (coachText + ' ' + coachVoiceInterim).trim();
  el.textContent = full || '…';
}

function coachVoiceStopRecognizer() {
  if (coachRecognizer) {
    const r = coachRecognizer;
    coachRecognizer = null;
    r.onend = null; r.onerror = null;
    try { r.stop(); } catch (e) { /* fine */ }
  }
}

// ❚❚ Stop — keep what was heard, drop back to the text box to edit it.
function coachVoiceStop() {
  coachVoiceStopRecognizer();
  coachPhase = 'prompt';
  coachInputMode = 'text';
  renderSpeak();
}

// ✓ Compare — send what was heard straight to the coach.
function coachVoiceDone() {
  coachVoiceStopRecognizer();
  if (!coachText.trim()) { coachVoiceStop(); return; }
  coachPhase = 'prompt';
  coachSubmit();
}

// × — cancel, restore whatever was in the box before recording.
function coachVoiceCancel() {
  coachVoiceStopRecognizer();
  coachText = coachVoicePrevText;
  coachPhase = 'prompt';
  renderSpeak();
}

function coachVoiceHTML() {
  const live = (coachText + ' ' + coachVoiceInterim).trim();
  return `
    <div class="coach-wrap">
      <div class="c2-voice">
        <div class="c2-voice-halo"></div>
        <span class="c2-voice-orb"><tariga-orb mode="listening"></tariga-orb></span>
        <div class="c2-listening">
          <span class="c2-dots"><span></span><span></span><span></span><span></span></span>
          <span class="c2-listening-label">Listening</span>
        </div>
        <div class="c2-voice-text" id="c2-voice-live" dir="auto">${esc(live) || '…'}</div>
        <div class="c2-voice-note">Speak the way you'd say it to family — Arabizi counts too.</div>
        <div class="c2-voice-bar">
          <button class="c2-voice-stop" onclick="coachVoiceStop()">❚❚ Stop</button>
          <button class="c2-voice-done" onclick="coachVoiceDone()">Compare with a native ✓</button>
          <button class="c2-voice-x" onclick="coachVoiceCancel()">×</button>
        </div>
      </div>
    </div>
  `;
}

// ── Connect / settings panel ──
function coachConnectHTML() {
  return `
    <div class="coach-connect">
      <div class="coach-connect-title">Connect the coach</div>
      <div class="coach-connect-body">The AI coach needs a way to reach Claude. Pick one:</div>
      <div class="coach-connect-option">
        <div class="coach-connect-opt-label">Worker URL <span class="coach-connect-rec">recommended · safe to share</span></div>
        <div class="coach-connect-row">
          <input type="url" id="coach-worker-url" class="coach-connect-input" placeholder="https://tariga-coach.you.workers.dev">
          <button class="btn btn-accent" onclick="coachSaveWorker()">Save</button>
        </div>
        <div class="coach-connect-note">Deploy it once from <code>worker/README.md</code> (~10 min, free).</div>
      </div>
      <div class="coach-connect-divider">or, just for your own testing</div>
      <div class="coach-connect-option">
        <div class="coach-connect-opt-label">Your Anthropic API key <span class="coach-connect-warn">stays in this browser only — never share a link while using this mode</span></div>
        <div class="coach-connect-row">
          <input type="password" id="coach-api-key" class="coach-connect-input" placeholder="sk-ant-…">
          <button class="btn btn-accent" onclick="coachSaveKey()">Save</button>
        </div>
      </div>
    </div>
  `;
}

function coachSettingsHTML() {
  const cfg = getApiConfig() || {};
  const desc = cfg.isDefault
    ? `Using Tariga's built-in worker: <code>${esc(cfg.workerUrl)}</code> — nothing to set up.`
    : cfg.mode === 'worker'
    ? `Using worker: <code>${esc(cfg.workerUrl)}</code>`
    : `Using a personal API key stored in this browser (dev mode).`;
  return `
    <div class="coach-connect" style="margin-top:8px">
      <div class="coach-connect-body">${desc}</div>
      ${cfg.isDefault ? `
      <div class="coach-connect-option" style="margin-top:10px">
        <div class="coach-connect-opt-label">Point this browser at a different worker (optional)</div>
        <div class="coach-connect-row">
          <input type="url" id="coach-worker-url" class="coach-connect-input" placeholder="https://your-worker.workers.dev">
          <button class="btn btn-accent" onclick="coachSaveWorker()">Save</button>
        </div>
      </div>` : `
      <div class="coach-actions" style="margin-top:10px">
        <button class="starred-clear-btn" onclick="coachDisconnect()">Reset to the built-in worker</button>
      </div>`}
    </div>
  `;
}

function coachSaveWorker() {
  const v = (document.getElementById('coach-worker-url')?.value || '').trim();
  if (!/^https:\/\/.+/.test(v)) { coachError = 'That doesn’t look like a URL — it should start with https://'; renderSpeak(); return; }
  saveApiConfig({ mode: 'worker', workerUrl: v });
  coachError = null; renderSpeak();
}

function coachSaveKey() {
  const v = (document.getElementById('coach-api-key')?.value || '').trim();
  if (!v.startsWith('sk-ant-')) { coachError = 'Anthropic keys start with sk-ant-'; renderSpeak(); return; }
  saveApiConfig({ mode: 'direct', apiKey: v });
  coachError = null; renderSpeak();
}

function coachDisconnect() { clearApiConfig(); coachSettingsOpen = false; renderSpeak(); }
function coachToggleSettings() { coachSettingsOpen = !coachSettingsOpen; renderSpeak(); }

// ── Interactions ──
function coachToggleModels() {
  coachModelsRevealed = !coachModelsRevealed;
  const el = document.getElementById('coach-models');
  if (el) el.style.display = coachModelsRevealed ? '' : 'none';
  renderSpeak();
}

function coachNav(dir) {
  const n = coachIdx + dir;
  if (n < 0 || n >= SPEAK_QA.length) return;
  coachIdx = n;
  coachPhase = 'prompt'; coachText = ''; coachFeedback = null; coachError = null;
  coachModelsRevealed = false; coachHintOpen = false; coachInputMode = null;
  coachPromptAt = null; coachUsedVoice = false;
  renderSpeak();
}

async function coachSubmit() {
  const text = coachText.trim();
  if (!text) { coachError = 'Say or type your answer first — even a few words count.'; renderSpeak(); return; }
  if (!apiConfigured()) { coachError = 'Connect the coach first (below).'; renderSpeak(); return; }

  const it = coachScenario();
  const attempts = getAttempts(it);
  const prev = attempts.length
    ? { text: attempts[attempts.length - 1].text, when: fmtAttemptDate(attempts[attempts.length - 1].ts) }
    : null;

  coachPhase = 'thinking'; coachError = null;
  renderSpeak();

  try {
    const req = buildCoachRequest(it, text, prev);
    const fb = await coachEvaluate(req);
    coachFeedback = fb;
    addAttempt(it, text, fb);
    recordActivity();
    // §9 event: scenario id, time spent on the prompt, voice vs text,
    // retry count, completion — no PII, never the learner's words
    if (typeof logEvent === 'function') logEvent('coach_eval', {
      mode: 'speak', id: 'speak-' + coachIdx,
      ms: coachPromptAt ? Date.now() - coachPromptAt : 0,
      extra: { input: coachUsedVoice ? 'voice' : 'text', retry: attempts.length, words: text.split(/\s+/).length, done: true },
    });
    coachPromptAt = null; coachUsedVoice = false;
    coachPhase = 'feedback';
  } catch (e) {
    coachPhase = 'prompt';
    coachInputMode = 'text'; // keep the transcript visible & editable after an error
    const msg = String(e.message || e);
    // completion=false event — which failure kind, never the learner's words
    if (typeof logEvent === 'function') logEvent('coach_error', {
      mode: 'speak', id: 'speak-' + coachIdx, extra: { kind: msg.slice(0, 40), done: false },
    });
    coachError =
      msg === 'bad_key' ? 'That API key was rejected — check it and try again.' :
      msg === 'rate_limited' ? 'The coach is getting too many requests — wait a minute and try again.' :
      msg === 'not_configured' ? 'Connect the coach first (below).' :
      msg === 'refused' ? 'The coach couldn’t respond to that one — try rephrasing.' :
      msg === 'timeout' ? 'The coach took too long to answer (it already retried once). Your answer is saved right here — try again in a moment.' :
      'Something went wrong reaching the coach (' + msg + '). Your answer is still here — try again.';
  }
  renderSpeak();
}

function coachTryAgain() {
  coachPhase = 'prompt'; coachFeedback = null; coachModelsRevealed = false;
  coachInputMode = 'text'; // keep coachText so they can edit their previous answer
  renderSpeak();
}

function coachNextScenario() {
  if (coachIdx < SPEAK_QA.length - 1) coachNav(1);
  else { coachPhase = 'prompt'; coachText = ''; coachFeedback = null; renderSpeak(); }
}

function coachShowJourney() { coachPhase = 'journey'; renderSpeak(); }
function coachCloseJourney() { coachPhase = 'prompt'; renderSpeak(); }

// ── Thinking state ──
function coachThinkingHTML() {
  return `
    <div class="coach-wrap">
      <div class="c2-think">
        <div class="c2-think-halo"></div>
        <span class="c2-think-orb"><tariga-orb mode="thinking"></tariga-orb></span>
        <div class="c2-think-title">Your coach is listening…</div>
        <div class="c2-think-sub">comparing your answer with how Sudanese speakers naturally say it</div>
        <div class="c2-think-answer" dir="auto">${esc(coachText)}</div>
      </div>
    </div>
  `;
}

// ── Feedback screen ──
function coachFeedbackHTML() {
  const it = coachScenario();
  const fb = coachFeedback;
  const attempts = getAttempts(it);
  let d = 0;
  const delay = () => `style="animation-delay:${(d += 90)}ms"`;

  const closest = it.model[Math.max(0, Math.min(it.model.length - 1, fb.closest_model_index || 0))];
  const kept = [...fb.vocab_used_required, ...fb.vocab_used_bonus];
  const swaps = [...fb.sounds_msa, ...fb.sounds_english_shaped]
    .filter(s => s.quote && s.sudanese)
    .map(s => ({ from: s.quote, to: s.sudanese }));
  const notes = [
    ...(fb.missed_chunks || []).map(t => ({ q: t.chunk + ' (' + t.ph + ')', n: t.note })),
    ...(fb.register_notes || []).map(t => ({ q: t.quote, n: t.note + ' \u2014 try: ' + t.adjusted })),
    ...(fb.missed_transitions || []).map(t => ({ q: t.phrase + ' (' + t.ph + ')', n: t.note })),
    ...fb.strengths.map(s => ({ q: s.quote, n: s.note })),
    ...fb.sounds_msa.map(s => ({ q: s.quote, n: s.note })),
    ...fb.sounds_english_shaped.map(s => ({ q: s.quote, n: s.note })),
    fb.code_switched_words.length
      ? { q: null, n: 'Still in English: ' + fb.code_switched_words.join(', ') + ' — totally normal, that\u2019s how diaspora Arabic works. Swap one at a time.' }
      : null,
  ].filter(Boolean);

  // Hierarchy per the learning-design doc \u00a70: the PRIMARY comparison is the
  // learner's answer vs. an upgraded version of THAT SAME answer (same
  // content, cleaned-up Sudanese). Model answers and specific flags are
  // secondary, collapsed context \u2014 not the main event.
  return `
    <div class="coach-wrap">
      <div class="c2-fb">
        <div class="coach-stagger" ${delay()}>
          <div class="c2-fb-label">Coaching \u00b7 scenario ${coachIdx + 1}</div>
          <div class="c2-fb-overall">${esc(fb.overall)}</div>
        </div>

        <div class="c2-panel coach-stagger" ${delay()}>
          <div class="c2-grid">
            <div>
              <div class="c2-col-label">You said</div>
              <div class="c2-you-text" dir="auto">${esc(coachText)}</div>
            </div>
            <div class="c2-native-col">
              <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:10px">
                <span class="c2-col-label native" style="margin-bottom:0">Your answer, upgraded</span>
                <button class="c2-speak-btn" onclick="coachSpeakSuggestion()" title="Hear it">\ud83d\udd0a</button>
              </div>
              <div class="c2-native-ar">${esc(fb.suggestion.ar)}</div>
              <div class="c2-native-ph">${esc(fb.suggestion.ph)}</div>
              <div class="c2-sug-en">${esc(fb.suggestion.en)}</div>
            </div>
          </div>
          ${kept.length || swaps.length ? `
          <div class="c2-chips-row">
            ${kept.length ? `<span class="c2-kept-label">\u2726 kept</span>${kept.map(v => `<span class="c2-kept-chip" dir="auto">${esc(v)}</span>`).join('')}` : ''}
            ${swaps.length ? `<span class="c2-swap-label">swap</span>${swaps.map(s => `
              <span class="c2-swap-pair">
                <span class="c2-swap-from" dir="auto">${esc(s.from)}</span>
                <span class="c2-swap-arrow">\u2192</span>
                <span class="c2-swap-to" dir="auto">${esc(s.to)}</span>
              </span>`).join('')}` : ''}
          </div>` : ''}
          <div class="c2-sug-say" style="border-top:1px solid var(--surface-border)">Now say the upgraded version out loud. Twice. That's the whole trick.</div>
        </div>

        <div class="coach-stagger" ${delay()} style="text-align:center">
          <button class="c2-linklike" onclick="coachFbToggle('coach-fb-model', this)">\u25b8 another natural way a speaker might say this</button>
          <div id="coach-fb-model" style="display:none;text-align:left">
            <div class="c2-panel" style="margin-top:10px">
              <div class="c2-col-label native">A native speaker</div>
              <div class="c2-native-ar">${esc(closest.ar)}</div>
              <div class="c2-native-ph">${esc(closest.ph)}</div>
              <div class="c2-sug-en">${esc(closest.en)}</div>
              ${fb.comparison_note ? `<div class="c2-note-line" style="margin-top:10px">${esc(fb.comparison_note)}</div>` : ''}
            </div>
          </div>
        </div>

        ${notes.length ? `
        <div class="coach-stagger" ${delay()} style="text-align:center">
          <button class="c2-linklike" onclick="coachFbToggle('coach-fb-notes', this)">\u25b8 specific notes (${notes.length})</button>
          <div id="coach-fb-notes" style="display:none;text-align:left">
            <div class="c2-panel" style="margin-top:10px">
              <div class="c2-notes" style="margin-top:0">
                ${notes.map(x => `<div class="c2-note-line">${x.q ? `<b dir="auto">"${esc(x.q)}"</b> \u2014 ` : ''}${esc(x.n)}</div>`).join('')}
              </div>
            </div>
          </div>
        </div>` : ''}

        <div class="c2-encourage coach-stagger" ${delay()}>${esc(fb.encouragement)}</div>

        <div class="c2-fb-actions coach-stagger" ${delay()}>
          <button class="c2-ghost-pill" onclick="coachTryAgain()">\u21bb Answer again</button>
          ${attempts.length >= 2 ? `<button class="c2-gold-pill" onclick="coachShowJourney()">\u2726 See your journey</button>` : ''}
          <button class="c2-gold-pill" onclick="coachNextScenario()">Next scenario \u2192</button>
        </div>
      </div>
    </div>
  `;
}

function coachFbToggle(id, btn) {
  const el = document.getElementById(id);
  if (!el) return;
  const open = el.style.display !== 'none';
  el.style.display = open ? 'none' : '';
  if (btn) btn.textContent = (open ? '\u25b8' : '\u25be') + btn.textContent.slice(1);
}

// Speak the suggested answer with the browser voice — rough, but it gives
// the melody. Real native audio arrives with community contributions.
function coachSpeakSuggestion() {
  if (!('speechSynthesis' in window) || !coachFeedback) return;
  const u = new SpeechSynthesisUtterance(coachFeedback.suggestion.ar);
  u.lang = 'ar-SA';
  u.rate = 0.85;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
}

// ── The journey — before/after progress view ──
function coachJourneyHTML() {
  const it = coachScenario();
  const attempts = getAttempts(it);
  if (attempts.length < 2) {
    const only = attempts[0];
    return `
      <div class="coach-wrap">
        <button class="coach-back-link" onclick="coachCloseJourney()">← back to the scenario</button>
        <div class="j2-head">
          <div class="j2-title">Your journey starts here</div>
          <div class="j2-sub">One answer recorded${only ? ' on ' + fmtAttemptDate(only.ts) : ''}. Answer this scenario again another day and this page becomes a before-and-after.</div>
        </div>
        ${only ? `
        <div class="j2-word-col" style="margin-top:8px">
          <div class="j2-word-tag">${fmtAttemptDate(only.ts)}</div>
          <div class="j2-word-text" dir="auto">${esc(only.text)}</div>
        </div>` : ''}
      </div>`;
  }

  const first = attempts[0];
  const last = attempts[attempts.length - 1];
  const s1 = naturalScore(first.metrics);
  const s2 = naturalScore(last.metrics);
  const v1 = first.metrics.vocabRequired + first.metrics.vocabBonus;
  const v2 = last.metrics.vocabRequired + last.metrics.vocabBonus;
  const newVocab = last.vocabUsed.filter(v => !first.vocabUsed.includes(v));
  const droppedEnglish = first.englishWords.filter(w => !last.englishWords.includes(w));

  return `
    <div class="coach-wrap">
      <button class="coach-back-link" onclick="coachCloseJourney()">← back to the scenario</button>

      <div class="j2-head coach-stagger" style="animation-delay:60ms">
        <div class="j2-title">You're getting there.</div>
        <div class="j2-sub" dir="auto">${esc(it.qen)}</div>
      </div>

      <div class="j2-score coach-stagger" style="animation-delay:150ms">
        <div class="j2-score-grid">
          <div class="j2-score-cell">
            <div class="j2-score-when">First try · ${fmtAttemptDate(first.ts)}</div>
            <div class="j2-score-n">${s1}</div>
            <div class="j2-score-bar"><i style="width:${s1}%"></i></div>
          </div>
          <div class="j2-score-arrow"><span>→</span></div>
          <div class="j2-score-cell now">
            <div class="j2-score-when">Latest · ${fmtAttemptDate(last.ts)}</div>
            <div class="j2-score-n">${s2}</div>
            <div class="j2-score-bar"><i style="width:${s2}%"></i></div>
          </div>
        </div>
      </div>

      <div class="coach-stagger" style="animation-delay:240ms">
        <div class="j2-sec-label">Your words, side by side</div>
        <div class="j2-words">
          <div class="j2-word-col">
            <div class="j2-word-tag">Then</div>
            <div class="j2-word-text" dir="auto">${esc(first.text)}</div>
          </div>
          <div class="j2-word-col now">
            <div class="j2-word-tag">Now</div>
            <div class="j2-word-text" dir="auto">${esc(last.text)}</div>
          </div>
        </div>
      </div>

      <div class="coach-stagger" style="animation-delay:330ms">
        <div class="j2-sec-label">The numbers</div>
        <div class="j2-nums">
          <div class="j2-num-row"><span>Sudanese key phrases</span>
            <span class="j2-num-vals"><span class="j2-num-then">${v1}</span><span class="j2-num-arrow">→</span><span class="j2-num-now">${v2}</span></span></div>
          <div class="j2-num-row"><span>English words mixed in</span>
            <span class="j2-num-vals"><span class="j2-num-then">${first.metrics.english}</span><span class="j2-num-arrow">→</span><span class="j2-num-now">${last.metrics.english}</span></span></div>
          <div class="j2-num-row"><span>Transition words (يعني، صراحة…)</span>
            <span class="j2-num-vals"><span class="j2-num-then">${first.metrics.transitions || 0}</span><span class="j2-num-arrow">→</span><span class="j2-num-now">${last.metrics.transitions || 0}</span></span></div>
          <div class="j2-num-row"><span>Formulaic chunks (إن شاء الله…)</span>
            <span class="j2-num-vals"><span class="j2-num-then">${first.metrics.chunks || 0}</span><span class="j2-num-arrow">→</span><span class="j2-num-now">${last.metrics.chunks || 0}</span></span></div>
          <div class="j2-num-row"><span>Natural score</span>
            <span class="j2-num-vals"><span class="j2-num-then">${s1}</span><span class="j2-num-arrow">→</span><span class="j2-num-now">${s2}</span></span></div>
        </div>
      </div>

      ${newVocab.length ? `
      <div class="coach-stagger" style="animation-delay:420ms">
        <div class="j2-sec-label">✦ New Sudanese since your first try</div>
        <div class="c2-chips-row" style="border-top:none;margin-top:0;padding-top:0">
          ${newVocab.map(v => `<span class="c2-kept-chip" dir="auto">${esc(v)}</span>`).join('')}
        </div>
      </div>` : ''}

      ${droppedEnglish.length ? `
      <div class="coach-stagger" style="animation-delay:480ms">
        <div class="j2-sec-label">English you no longer lean on</div>
        <div class="c2-chips-row" style="border-top:none;margin-top:0;padding-top:0">
          ${droppedEnglish.map(w => `<span class="c2-swap-from">${esc(w)}</span>`).join('')}
        </div>
      </div>` : ''}

      <div class="coach-stagger" style="animation-delay:540ms">
        <div class="j2-sec-label">Every attempt</div>
        <div class="coach-timeline-row">
          ${attempts.map((a, i) => {
            const s = naturalScore(a.metrics);
            return `<div class="coach-timeline-dot" title="${fmtAttemptDate(a.ts)} · score ${s}">
              <div class="coach-timeline-bar" style="height:${Math.max(8, s * 0.6)}px"></div>
              <span class="coach-timeline-n">${i + 1}</span>
            </div>`;
          }).join('')}
        </div>
      </div>

      <div class="c2-fb-actions coach-stagger" style="animation-delay:620ms">
        <button class="c2-gold-pill" onclick="coachCloseJourney()">Answer it again →</button>
      </div>
    </div>
  `;
}
