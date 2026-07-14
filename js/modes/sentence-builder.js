// Sentence builder — English in, YOUR Arabic out.
// The learner sees the English of a real podcast sentence plus the anchor
// phrase it's built around, then produces the Arabic themselves (typing,
// Arabizi, or mic). Compare rates them word by word on the same engine as
// Guided mode; "suggest a word" reveals missing words one at a time for
// anyone who gets stuck. Attempts are tracked so beating your own score is
// the game.
let buildArHidden = true; // legacy flag still reset by setMode()
let buildInput = '';
let buildChecked = false;
let buildRevealed = [];   // word hints given for the current sentence
let buildTries = 0;       // attempts on the current sentence
let buildBest = -1;       // best word count this sentence
let buildForIdx = -1;     // which deck position the state above belongs to

function _buildReset() {
  buildInput = ''; buildChecked = false; buildRevealed = [];
  buildTries = 0; buildBest = -1; buildForIdx = idx;
}

// target words paired with their phonetics, filtered like prodMatch filters
// (so hints line up with what the compare engine actually scores)
function _buildPairs(it) {
  const ar = String(it.ex).split(/\s+/);
  const phw = String(getExPh(it) || '').split(/\s+/);
  return ar.map((w, i) => ({ ar: w, ph: phw[i] || '' }))
    .filter(p => prodClean(p.ar).length > 1);
}

function renderBuild() {
  const ca = document.getElementById('content-area');
  if (idx >= deck.length) { renderResult(); return; }
  if (buildForIdx !== idx) _buildReset();
  const it = deck[idx];
  const ph = getExPh(it);
  const m = buildChecked ? prodMatch(buildInput, it.ex, ph) : null;
  const ratio = m && m.words.length ? m.hits.length / m.words.length : 0;
  const verdict = !m ? '' :
    ratio === 1 ? 'Every single word — that’s the whole sentence.' :
    ratio >= 0.7 ? 'Nearly there — only a word or two short.' :
    ratio >= 0.4 ? 'Good bones — the key words are landing.' :
    'A start — steal what’s missing from the line below and go again.';

  ca.innerHTML = `
    <div class="coach-wrap">
      <button class="d2-back" onclick="setMode('home')">← all modes</button>
      <div class="d2-title" style="margin-bottom:16px">Sentence builder <span class="sub">· ${idx + 1} of ${deck.length}</span></div>
      <div class="d2-card">
        <div class="d2-yourturn" style="margin-top:0">
          <div class="d2-yourturn-label">Say this in Sudanese Arabic</div>
          <div class="d2-yourturn-body" style="text-align:left;font-size:18px">${escAttr(it.exen)}</div>
        </div>
        <div class="d2-item-note" style="margin-top:8px">${escAttr(it.ctx)}</div>
        <div class="d2-label" style="margin:14px 0 6px">built around this phrase — make sure it's in there</div>
        <div class="d2-kw-box">
          <span class="ar">${escAttr(it.a)}</span>
          <span class="ph">${escAttr(it.p)} · ${escAttr(it.e)}</span>
        </div>

        ${!buildChecked ? `
          <div class="c2-textbox" style="margin-top:14px">
            <textarea id="build-input" dir="auto" rows="2"
              placeholder="اكتب الجملة هنا… or Arabizi (ana batkallam…) — both count"></textarea>
            <div class="c2-textbox-row">
              ${coachMicSupported() ? `<button class="c2-mic-small" id="build-mic" onclick="buildMic()" title="say it out loud">${UI_MIC}</button>` : ''}
              <span style="flex:1"></span>
              <button class="c2-compare" onclick="buildCheck()">Compare →</button>
            </div>
          </div>
          <div class="d2-pill-row" style="margin-top:10px">
            <button class="c2-ghost-pill" onclick="buildSuggest()">stuck? suggest a word</button>
          </div>
          ${buildRevealed.length ? `
          <div class="f2-p-chips" style="margin-top:10px">
            <span class="f2-p-score">${buildRevealed.length} hint${buildRevealed.length === 1 ? '' : 's'}</span>
            ${buildRevealed.map(h => `<span class="f2-p-chip hit" dir="auto">${escAttr(h.ar)}${h.ph ? ' · ' + escAttr(h.ph) : ''}</span>`).join('')}
          </div>` : ''}
          <div class="c2-footnote" style="margin-top:10px">You'll be rated word by word${buildTries ? ` · attempt ${buildTries + 1} — your best so far is ${buildBest} word${buildBest === 1 ? '' : 's'}` : ' — struggle first, that’s the exercise'}.</div>
        ` : `
          ${prodCompareGridHTML(buildInput, it.ex, ph, 'The podcast line')}
          <div class="f2-p-chips">${prodChipsHTML(m)}</div>
          <div class="d2-inset" style="margin-top:12px">
            <b style="color:var(--text)">Attempt ${buildTries}${buildRevealed.length ? ' · ' + buildRevealed.length + ' hint' + (buildRevealed.length === 1 ? '' : 's') : ''}:</b>
            <span class="d2-when-body">${verdict}${buildTries > 1 && buildBest > m.hits.length ? ' Your best is still ' + buildBest + ' words — beat it.' : ''}</span>
          </div>
          <div class="c2-encourage">Now say your best version out loud. Twice. That's the whole trick.</div>
          <div class="d2-pill-row">
            <button class="c2-ghost-pill" onclick="buildTryAgain()">↻ Try again</button>
            <button class="d2-pill-red" onclick="mark(false)">Need more practice</button>
            <button class="d2-pill-green" onclick="mark(true)">Built it ✓</button>
          </div>
        `}
      </div>
    </div>
  `;
  const ta = document.getElementById('build-input');
  if (ta) {
    ta.value = buildInput;
    ta.addEventListener('input', () => { buildInput = ta.value; });
  }
}

function buildMic() {
  prodMic('build-mic', (t) => {
    buildInput = (buildInput ? buildInput.trimEnd() + ' ' : '') + t;
    const ta = document.getElementById('build-input');
    if (ta) ta.value = buildInput;
  });
}

// reveal the first target word the learner hasn't said (and hasn't been shown)
function buildSuggest() {
  const it = deck[idx];
  const norm = prodClean(buildInput);
  const next = _buildPairs(it).find(p =>
    !buildRevealed.some(r => r.ar === p.ar) &&
    !norm.includes(prodClean(p.ar)) &&
    !(p.ph && prodClean(p.ph).length > 1 && norm.includes(prodClean(p.ph))));
  if (next) buildRevealed.push(next);
  renderBuild();
  const ta = document.getElementById('build-input');
  if (ta) { ta.focus(); ta.selectionStart = ta.selectionEnd = ta.value.length; }
}

function buildCheck() {
  const ta = document.getElementById('build-input');
  buildInput = (ta ? ta.value : buildInput).trim();
  if (!buildInput) { if (ta) ta.focus(); return; }
  buildChecked = true;
  buildTries++;
  const it = deck[idx];
  const m = prodMatch(buildInput, it.ex, getExPh(it));
  if (m.hits.length > buildBest) buildBest = m.hits.length;
  recordActivity();
  if (typeof logEvent === 'function') logEvent('build_check', {
    id: it.a, hits: m.hits.length, total: m.words.length,
    extra: { attempt: buildTries, hints: buildRevealed.length },
  });
  renderBuild();
}

function buildTryAgain() { buildChecked = false; renderBuild(); }
