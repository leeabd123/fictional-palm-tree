// ══════════════════════════════════════════════
// SPEED ROUND — automatization (§11, DeKeyser): once comfortable in a
// domain, a timed variant of Guided pushes toward real-time fluency —
// the actual goal is not freezing under social pressure, not accuracy
// on an untimed test. Only previously-practiced items appear.
// ══════════════════════════════════════════════

let spItems = [];
let spIdx = 0;
let spInput = '';
let spScore = 0;
let spEndsAt = 0;
let spTimer = null;
let spRunning = false;

function speedAvailable() {
  if (typeof adminOn === 'function' && adminOn()) return true;
  const done = getGuidedProgress();
  return GUIDED_SCENARIOS.filter(g => g.domain === focusDomain() && done[g.id]).length >= 3;
}

function speedStart() {
  const done = getGuidedProgress();
  spItems = shuf(GUIDED_SCENARIOS.filter(g => g.domain === focusDomain() && done[g.id]));
  if (!spItems.length && typeof adminOn === 'function' && adminOn()) {
    spItems = shuf(GUIDED_SCENARIOS.filter(g => g.domain === focusDomain()));
  }
  if (!spItems.length) { setMode('guided'); return; }
  spIdx = 0; spInput = ''; spScore = 0; spRunning = true;
  spEndsAt = Date.now() + TARIGA_CONFIG.speed.seconds * 1000;
  clearInterval(spTimer);
  spTimer = setInterval(() => {
    const left = document.getElementById('sp-left');
    if (left) left.textContent = Math.max(0, Math.ceil((spEndsAt - Date.now()) / 1000)) + 's';
    if (Date.now() >= spEndsAt) speedEnd();
  }, 250);
  setMode('speed');
}

function speedEnd() {
  clearInterval(spTimer);
  spRunning = false;
  recordActivity();
  if (typeof logEvent === 'function') logEvent('speed_round', { score: spScore, domain: focusDomain() });
  renderSpeed();
}

function renderSpeed() {
  const ca = document.getElementById('content-area');
  const dm = DOMAINS.find(d => d.id === focusDomain()) || DOMAINS[0];

  if (!spRunning) {
    ca.innerHTML = `
      <div class="coach-wrap">
        <button class="d2-back" onclick="clearInterval(spTimer);setMode('guided')">← guided practice</button>
        <div class="d2-card" style="text-align:center">
          <div style="font-size:34px">⚡</div>
          <div class="c2-title" style="margin:10px 0 6px">${spItems.length ? spScore + ' in ' + TARIGA_CONFIG.speed.seconds + ' seconds' : 'Speed round · ' + dm.label}</div>
          <div class="d2-note" style="margin:0 auto;max-width:380px">${spItems.length
            ? (spScore >= 4 ? 'That speed is real fluency forming — no freezing there.' : 'Speed comes with reps — the phrases you hesitated on are the ones to revisit.')
            : 'Phrases you have already practiced, against the clock — fluency is speed, not just accuracy.'}</div>
          <div class="d2-pill-row" style="margin-top:16px">
            <button class="c2-compare" onclick="speedStart()">${spItems.length ? '⚡ Again' : '⚡ Start'} — ${TARIGA_CONFIG.speed.seconds}s</button>
          </div>
        </div>
      </div>`;
    return;
  }

  const it = spItems[spIdx % spItems.length];
  ca.innerHTML = `
    <div class="coach-wrap">
      <div class="c2-head">
        <div>
          <div class="c2-title">⚡ Speed round</div>
          <div class="c2-sub">${dm.label} · say it FAST — close counts</div>
        </div>
        <span class="d2-badge" style="font-size:14px;font-variant-numeric:tabular-nums"><span id="sp-left">${Math.max(0, Math.ceil((spEndsAt - Date.now()) / 1000))}s</span> · ${spScore} ✓</span>
      </div>
      <div class="c2-qcard" style="padding:22px">
        <div class="c2-qtext" style="font-size:18px">${escAttr(it.say_en)}</div>
      </div>
      <div class="c2-textbox">
        <textarea id="sp-input" dir="auto" rows="2" placeholder="go go go — Arabizi counts"></textarea>
        <div class="c2-textbox-row">
          <span style="flex:1"></span>
          <button class="c2-compare" onclick="speedCheck()">✓</button>
        </div>
      </div>
    </div>`;
  const ta = document.getElementById('sp-input');
  if (ta) {
    ta.value = spInput;
    ta.addEventListener('input', () => { spInput = ta.value; });
    ta.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); speedCheck(); } });
    ta.focus();
  }
}

function speedCheck() {
  const ta = document.getElementById('sp-input');
  spInput = (ta ? ta.value : spInput).trim();
  if (!spInput) { if (ta) ta.focus(); return; }
  const it = spItems[spIdx % spItems.length];
  const t = it.targets.find(x => x.gender === 'any') || it.targets[0];
  const m = prodMatch(spInput, t.ar, t.ph);
  if (m.hits.length >= Math.ceil(m.words.length / 2)) spScore++;
  spIdx++; spInput = '';
  renderSpeed();
}
