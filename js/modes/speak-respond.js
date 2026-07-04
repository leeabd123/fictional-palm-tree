// Speak & Respond — the AI-coached core loop.
// scenario → learner types a real response (Arabic script or Arabizi) →
// Claude compares it against native-speaker reference answers →
// comparison-based feedback (never "correct/incorrect") → attempt stored →
// on later attempts, a before/after journey view shows real growth.

let coachIdx = 0;
let coachPhase = 'prompt';       // 'prompt' | 'thinking' | 'feedback' | 'journey'
let coachText = '';
let coachFeedback = null;
let coachError = null;
let coachLayers = { ar: true, ph: true, en: false }; // question difficulty layers
let coachSettingsOpen = false;
let coachModelsRevealed = false;

function esc(s) { return escAttr(String(s == null ? '' : s)); }

function coachScenario() { return SPEAK_QA[coachIdx]; }

// ── Entry point ──
function renderSpeak() {
  const ca = document.getElementById('content-area');
  if (coachPhase === 'thinking') { ca.innerHTML = coachThinkingHTML(); return; }
  if (coachPhase === 'feedback' && coachFeedback) { ca.innerHTML = coachFeedbackHTML(); return; }
  if (coachPhase === 'journey') { ca.innerHTML = coachJourneyHTML(); return; }
  ca.innerHTML = coachPromptHTML();
  const ta = document.getElementById('coach-input');
  if (ta) {
    ta.value = coachText;
    ta.addEventListener('input', () => { coachText = ta.value; coachAutosize(ta); });
    coachAutosize(ta);
  }
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

  return `
    <div class="coach-wrap">
      <div class="speak-q-nav">
        <button class="arrow-btn" onclick="coachNav(-1)" ${coachIdx === 0 ? 'disabled' : ''}>←</button>
        <span class="speak-q-counter">Scenario ${coachIdx + 1} of ${SPEAK_QA.length}</span>
        <button class="arrow-btn" onclick="coachNav(1)" ${coachIdx >= SPEAK_QA.length - 1 ? 'disabled' : ''}>→</button>
      </div>

      ${attempts.length ? `
        <button class="coach-journey-pill" onclick="coachShowJourney()">
          <span class="coach-journey-pill-icon">✦</span>
          You've answered this ${attempts.length === 1 ? 'once' : attempts.length + ' times'} — see your journey
        </button>` : ''}

      <div class="speak-question-card coach-q-card">
        <div class="speak-q-label">The scenario</div>
        <div class="coach-context">${esc(it.context)}</div>
        <div class="coach-layer-row">
          <button class="coach-layer-chip ${coachLayers.ar ? 'on' : ''}" onclick="coachToggleLayer('ar')">عربي</button>
          <button class="coach-layer-chip ${coachLayers.ph ? 'on' : ''}" onclick="coachToggleLayer('ph')">phonetic</button>
          <button class="coach-layer-chip ${coachLayers.en ? 'on' : ''}" onclick="coachToggleLayer('en')">english</button>
        </div>
        <div class="speak-question-ar coach-layer-ar" id="coach-q-ar" style="${coachLayers.ar ? '' : 'display:none'}">${esc(it.qar)}</div>
        <div class="phonetic coach-layer-ph" id="coach-q-ph" style="${coachLayers.ph ? '' : 'display:none'}">${esc(it.qph)}</div>
        <div class="speak-question-en coach-layer-en" id="coach-q-en" style="${coachLayers.en ? '' : 'display:none'}">${esc(it.qen)}</div>
      </div>

      <div class="coach-input-block">
        <div class="coach-input-label">How would <em>you</em> answer? <span class="coach-input-hint">Arabic script or Arabizi (saraha, 3ashan…) — both count.</span></div>
        <textarea id="coach-input" class="coach-textarea" dir="auto" rows="3"
          placeholder="اكتب ردك هنا… or type it in Arabizi"></textarea>
        <div class="coach-actions">
          <button class="btn btn-accent coach-submit" onclick="coachSubmit()" ${configured ? '' : 'disabled title="Connect the coach below first"'}>Get coaching →</button>
          <button class="coach-reveal-link" onclick="coachToggleModels()">${coachModelsRevealed ? 'Hide' : 'Peek at'} natural examples</button>
          <span class="coach-voice-note" title="Voice input is the next tier — text first, on purpose.">🎙️ voice coming soon</span>
        </div>
        ${coachError ? `<div class="coach-error">${esc(coachError)}</div>` : ''}
      </div>

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

function coachModelsHTML(it) {
  return `
    <div class="speak-vocab-panel coach-models-panel">
      <div class="speak-vocab-title">Natural ways speakers have answered this <span class="coach-models-sub">— not "the correct way", just real ones</span></div>
      ${it.model.map(m => `
        <div class="speak-model-line">
          <div class="speak-line-ar">${esc(m.ar)}</div>
          <div class="speak-line-ph">${esc(m.ph)}</div>
          <div class="speak-line-en">${esc(m.en)}</div>
        </div>`).join('')}
      <div class="speak-tip-box" style="margin-top:12px"><strong>Tip:</strong> ${esc(it.tip)}</div>
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
  const desc = cfg.mode === 'worker'
    ? `Using worker: <code>${esc(cfg.workerUrl)}</code>`
    : `Using a personal API key stored in this browser (dev mode).`;
  return `
    <div class="coach-connect" style="margin-top:8px">
      <div class="coach-connect-body">${desc}</div>
      <div class="coach-actions" style="margin-top:10px">
        <button class="starred-clear-btn" onclick="coachDisconnect()">Disconnect</button>
      </div>
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
function coachToggleLayer(k) {
  coachLayers[k] = !coachLayers[k];
  // DOM-only toggle so the textarea keeps its content
  const el = document.getElementById('coach-q-' + k);
  if (el) el.style.display = coachLayers[k] ? '' : 'none';
  document.querySelectorAll('.coach-layer-chip').forEach(c => {
    if (c.textContent.trim() === (k === 'ar' ? 'عربي' : k === 'ph' ? 'phonetic' : 'english'))
      c.classList.toggle('on', coachLayers[k]);
  });
}

function coachToggleModels() {
  coachModelsRevealed = !coachModelsRevealed;
  const el = document.getElementById('coach-models');
  if (el) el.style.display = coachModelsRevealed ? '' : 'none';
  document.querySelectorAll('.coach-reveal-link').forEach(b => {
    b.textContent = (coachModelsRevealed ? 'Hide' : 'Peek at') + ' natural examples';
  });
}

function coachNav(dir) {
  const n = coachIdx + dir;
  if (n < 0 || n >= SPEAK_QA.length) return;
  coachIdx = n;
  coachPhase = 'prompt'; coachText = ''; coachFeedback = null; coachError = null; coachModelsRevealed = false;
  renderSpeak();
}

async function coachSubmit() {
  const text = coachText.trim();
  if (!text) { coachError = 'Type your answer first — even a few words count.'; renderSpeak(); return; }
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
    coachPhase = 'feedback';
  } catch (e) {
    coachPhase = 'prompt';
    const msg = String(e.message || e);
    coachError =
      msg === 'bad_key' ? 'That API key was rejected — check it and try again.' :
      msg === 'rate_limited' ? 'The coach is getting too many requests — wait a minute and try again.' :
      msg === 'not_configured' ? 'Connect the coach first (below).' :
      msg === 'refused' ? 'The coach couldn’t respond to that one — try rephrasing.' :
      'Something went wrong reaching the coach (' + msg + '). Your answer is still here — try again.';
  }
  renderSpeak();
}

function coachTryAgain() {
  coachPhase = 'prompt'; coachFeedback = null; coachModelsRevealed = false;
  // keep coachText so they can edit their previous answer
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
      <div class="coach-thinking">
        <div class="coach-thinking-orb"></div>
        <div class="coach-thinking-title">Your coach is listening…</div>
        <div class="coach-thinking-sub">comparing your answer with how Sudanese speakers naturally say it</div>
        <div class="coach-thinking-answer" dir="auto">${esc(coachText)}</div>
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

  return `
    <div class="coach-wrap">
      <div class="coach-fb-head coach-stagger" ${delay()}>
        <div class="speak-q-label">Coaching · scenario ${coachIdx + 1}</div>
        <div class="coach-fb-overall">${esc(fb.overall)}</div>
      </div>

      <div class="coach-fb-yours coach-stagger" ${delay()}>
        <div class="coach-fb-section-label">You said</div>
        <div class="coach-fb-yours-text" dir="auto">${esc(coachText)}</div>
        ${coachVocabChipsHTML(fb)}
      </div>

      ${fb.strengths.length ? `
      <div class="coach-fb-card coach-fb-good coach-stagger" ${delay()}>
        <div class="coach-fb-section-label">✦ Already sounds Sudanese</div>
        ${fb.strengths.map(s => `
          <div class="coach-fb-item">
            <span class="coach-fb-quote" dir="auto">"${esc(s.quote)}"</span>
            <span class="coach-fb-note">${esc(s.note)}</span>
          </div>`).join('')}
      </div>` : ''}

      ${fb.sounds_msa.length ? `
      <div class="coach-fb-card coach-fb-msa coach-stagger" ${delay()}>
        <div class="coach-fb-section-label">📜 Reads as formal MSA</div>
        ${fb.sounds_msa.map(s => `
          <div class="coach-fb-item">
            <span class="coach-fb-quote" dir="auto">"${esc(s.quote)}"</span>
            <span class="coach-fb-note">${esc(s.note)}</span>
            <span class="coach-fb-swap">a Sudanese speaker would say → <b dir="auto">${esc(s.sudanese)}</b></span>
          </div>`).join('')}
      </div>` : ''}

      ${fb.sounds_english_shaped.length ? `
      <div class="coach-fb-card coach-fb-eng coach-stagger" ${delay()}>
        <div class="coach-fb-section-label">🔁 Shaped like English</div>
        ${fb.sounds_english_shaped.map(s => `
          <div class="coach-fb-item">
            <span class="coach-fb-quote" dir="auto">"${esc(s.quote)}"</span>
            <span class="coach-fb-note">${esc(s.note)}</span>
            <span class="coach-fb-swap">more natural → <b dir="auto">${esc(s.sudanese)}</b></span>
          </div>`).join('')}
      </div>` : ''}

      <div class="coach-fb-card coach-fb-compare coach-stagger" ${delay()}>
        <div class="coach-fb-section-label">Side by side — one natural way vs. yours</div>
        <div class="coach-compare-grid">
          <div class="coach-compare-col">
            <div class="coach-compare-tag">yours</div>
            <div class="coach-compare-text" dir="auto">${esc(coachText)}</div>
          </div>
          <div class="coach-compare-col coach-compare-native">
            <div class="coach-compare-tag">a native speaker</div>
            <div class="coach-compare-text" dir="rtl">${esc(closest.ar)}</div>
            <div class="speak-line-ph">${esc(closest.ph)}</div>
            <div class="speak-line-en">${esc(closest.en)}</div>
          </div>
        </div>
        <div class="coach-fb-note" style="margin-top:10px">${esc(fb.comparison_note)}</div>
      </div>

      <div class="coach-fb-card coach-fb-suggestion coach-stagger" ${delay()}>
        <div class="coach-fb-section-label">💛 Your answer, upgraded — one natural way to say it</div>
        <div class="coach-suggestion-ar" dir="rtl">${esc(fb.suggestion.ar)}</div>
        <div class="speak-line-ph">${esc(fb.suggestion.ph)}</div>
        <div class="speak-line-en">${esc(fb.suggestion.en)}</div>
        <div class="coach-say-it">Now say it out loud. Twice. That's the whole trick.</div>
      </div>

      <div class="coach-fb-encourage coach-stagger" ${delay()}>${esc(fb.encouragement)}</div>

      <div class="coach-fb-actions coach-stagger" ${delay()}>
        <button class="btn" onclick="coachTryAgain()">↻ Answer again</button>
        ${attempts.length >= 2 ? `<button class="btn coach-journey-btn" onclick="coachShowJourney()">✦ See your journey</button>` : ''}
        <button class="btn btn-accent" onclick="coachNextScenario()">Next scenario →</button>
      </div>
    </div>
  `;
}

function coachVocabChipsHTML(fb) {
  const used = [...fb.vocab_used_required, ...fb.vocab_used_bonus];
  if (!used.length && !fb.code_switched_words.length) return '';
  return `
    <div class="coach-chip-row">
      ${used.map(v => `<span class="coach-chip coach-chip-vocab" dir="auto">${esc(v)}</span>`).join('')}
      ${fb.code_switched_words.map(w => `<span class="coach-chip coach-chip-english">${esc(w)} <i>english</i></span>`).join('')}
    </div>
  `;
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
        <div class="coach-journey-head">
          <div class="coach-journey-title">Your journey starts here</div>
          <div class="coach-journey-sub">One answer recorded${only ? ' on ' + fmtAttemptDate(only.ts) : ''}. Answer this scenario again another day and this page becomes a before-and-after.</div>
        </div>
        ${only ? `<div class="coach-fb-yours"><div class="coach-fb-section-label">${fmtAttemptDate(only.ts)}</div><div class="coach-fb-yours-text" dir="auto">${esc(only.text)}</div></div>` : ''}
      </div>`;
  }

  const first = attempts[0];
  const last = attempts[attempts.length - 1];
  const s1 = naturalScore(first.metrics);
  const s2 = naturalScore(last.metrics);
  const newVocab = last.vocabUsed.filter(v => !first.vocabUsed.includes(v));
  const droppedEnglish = first.englishWords.filter(w => !last.englishWords.includes(w));

  return `
    <div class="coach-wrap">
      <button class="coach-back-link" onclick="coachCloseJourney()">← back to the scenario</button>

      <div class="coach-journey-head coach-stagger" style="animation-delay:60ms">
        <div class="coach-journey-title">Then <span class="coach-journey-vs">→</span> now</div>
        <div class="coach-journey-sub" dir="auto">${esc(it.qen)}</div>
      </div>

      <div class="coach-journey-grid coach-stagger" style="animation-delay:160ms">
        <div class="coach-journey-col coach-journey-then">
          <div class="coach-compare-tag">first try · ${fmtAttemptDate(first.ts)}</div>
          <div class="coach-journey-text" dir="auto">${esc(first.text)}</div>
          <div class="coach-journey-stats">
            <span>${first.metrics.vocabRequired + first.metrics.vocabBonus} Sudanese key phrases</span>
            <span>${first.metrics.english} English word${first.metrics.english === 1 ? '' : 's'} mixed in</span>
          </div>
        </div>
        <div class="coach-journey-arrow">→</div>
        <div class="coach-journey-col coach-journey-now">
          <div class="coach-compare-tag">latest · ${fmtAttemptDate(last.ts)}</div>
          <div class="coach-journey-text" dir="auto">${esc(last.text)}</div>
          <div class="coach-journey-stats">
            <span>${last.metrics.vocabRequired + last.metrics.vocabBonus} Sudanese key phrases</span>
            <span>${last.metrics.english} English word${last.metrics.english === 1 ? '' : 's'} mixed in</span>
          </div>
        </div>
      </div>

      <div class="coach-meter-block coach-stagger" style="animation-delay:280ms">
        <div class="coach-fb-section-label">Sounding natural</div>
        <div class="coach-meter">
          <div class="coach-meter-fill coach-meter-then" style="width:${s1}%"></div>
          <div class="coach-meter-fill coach-meter-now" style="--target:${s2}%"></div>
        </div>
        <div class="coach-meter-labels"><span>then ${s1}</span><span>now ${s2}</span></div>
      </div>

      ${newVocab.length ? `
      <div class="coach-fb-card coach-fb-good coach-stagger" style="animation-delay:380ms">
        <div class="coach-fb-section-label">✦ New Sudanese vocabulary since your first try</div>
        <div class="coach-chip-row">${newVocab.map(v => `<span class="coach-chip coach-chip-vocab coach-chip-new" dir="auto">${esc(v)}</span>`).join('')}</div>
      </div>` : ''}

      ${droppedEnglish.length ? `
      <div class="coach-fb-card coach-stagger" style="animation-delay:460ms">
        <div class="coach-fb-section-label">English you no longer lean on</div>
        <div class="coach-chip-row">${droppedEnglish.map(w => `<span class="coach-chip coach-chip-dropped">${esc(w)}</span>`).join('')}</div>
      </div>` : ''}

      <div class="coach-timeline coach-stagger" style="animation-delay:540ms">
        <div class="coach-fb-section-label">Every attempt</div>
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

      <div class="coach-fb-actions coach-stagger" style="animation-delay:620ms">
        <button class="btn btn-accent" onclick="coachCloseJourney()">Answer it again →</button>
      </div>
    </div>
  `;
}
