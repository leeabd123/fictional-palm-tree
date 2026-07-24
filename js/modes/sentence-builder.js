// Sentence builder — English in, YOUR Arabic out, in the practice-modes
// handoff layout: "Build this" + English target, a dashed drop area where
// your sentence forms, and a TILE BANK of the target's words (shuffled).
// Tap tiles to build — or type / speak, both still count; Check rates you
// word by word on the same compare engine as Guided. All previous logic
// (attempts, best score, mic, typed Arabizi) is unchanged.
let buildArHidden = true; // legacy flag still reset by setMode()
let buildInput = '';
let buildChecked = false;
let buildTries = 0;       // attempts on the current sentence
let buildBest = -1;       // best word count this sentence
let buildForIdx = -1;     // which deck position the state above belongs to

function _buildReset() {
  buildInput = ''; buildChecked = false;
  buildTries = 0; buildBest = -1; buildForIdx = idx;
}

// target words paired with their phonetics, filtered like prodMatch filters
// (so tiles line up with what the compare engine actually scores)
function _buildPairs(it) {
  const ar = String(it.ex).split(/\s+/);
  const phw = String(getExPh(it) || '').split(/\s+/);
  return ar.map((w, i) => ({ ar: w, ph: phw[i] || '' }))
    .filter(p => prodClean(p.ar).length > 1);
}

// stable pseudo-shuffle of the tile bank (same order across re-renders)
function _buildBank(it) {
  return _buildPairs(it).map((p, i) => ({ ...p, i }))
    .sort((a, b) => ((a.i * 73 + idx * 37) % 97) - ((b.i * 73 + idx * 37) % 97));
}

function buildTileTap(i) {
  const it = deck[idx];
  const p = _buildPairs(it)[i];
  if (!p) return;
  buildInput = (buildInput ? buildInput.trimEnd() + ' ' : '') + p.ar;
  const ta = document.getElementById('build-input');
  if (ta) { ta.value = buildInput; }
  renderBuild();
}

function buildClear() {
  buildInput = '';
  const ta = document.getElementById('build-input');
  if (ta) ta.value = '';
  renderBuild();
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
  const norm = prodClean(buildInput);
  const used = (p) => norm.includes(prodClean(p.ar));

  ca.innerHTML = `
    <div class="coach-wrap mode-anim">
      <button class="d2-back" onclick="setMode('home')">← all modes</button>
      <div class="mode-intro">
        <div class="mode-badge"><svg viewBox="0 0 20 20" fill="currentColor"><path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9z"/></svg></div>
        <div>
          <div class="mode-kicker">Speak it · sentence builder · ${idx + 1} of ${deck.length}</div>
          <div class="mode-lede">Build the sentence from its tiles — or type it, or say it. Word order is half the battle; you're rated word by word.</div>
        </div>
      </div>

      <div class="ts-card" style="padding:30px 36px">
        <div class="ts-label">Build this</div>
        <div style="font-size:20px;color:var(--text-primary);margin-top:8px;line-height:1.5">“${escAttr(it.exen)}”</div>
        <div style="font-size:12.5px;color:var(--text-muted);margin-top:6px">${escAttr(it.ctx)} · built around <b dir="rtl" style="color:var(--gold)">${escAttr(it.a)}</b> <span style="color:var(--purple);font-style:italic">${escAttr(it.p)}</span></div>

        <div style="min-height:64px;margin-top:22px;padding:10px 14px;border-radius:14px;border:1px dashed var(--gold-border);background:var(--surface-hover)">
          <textarea id="build-input" dir="auto" rows="2" ${buildChecked ? 'disabled' : ''}
            placeholder="tap the tiles below — or type here (Arabizi counts too)…"
            style="width:100%;background:transparent;border:none;outline:none;resize:none;color:var(--text-primary);font-family:'Instrument Serif','Noto Naskh Arabic',serif;font-size:22px;line-height:1.7;text-align:right;direction:rtl"></textarea>
        </div>

        ${!buildChecked ? `
          <div style="height:1px;background:var(--surface-border);margin:24px 0"></div>
          <div style="display:flex;flex-wrap:wrap;gap:12px;justify-content:center">
            ${_buildBank(it).map(p => `<button class="tile ${used(p) ? 'used' : ''}" onclick="buildTileTap(${p.i})" title="${escAttr(p.ph)}">${escAttr(p.ar)}</button>`).join('')}
          </div>
          <div style="display:flex;gap:10px;justify-content:center;align-items:center;margin-top:26px;flex-wrap:wrap">
            ${coachMicSupported() ? `<button class="mic-btn2" id="build-mic" style="width:46px;height:46px" onclick="buildMic()" title="say it out loud"><svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor"><path d="M12 14a3 3 0 003-3V5a3 3 0 00-6 0v6a3 3 0 003 3z"/><path d="M19 11a7 7 0 01-14 0H3a9 9 0 008 8.94V23h2v-3.06A9 9 0 0021 11h-2z"/></svg></button>` : ''}
            <button class="m-chip" style="padding:9px 22px;font-size:13px" onclick="buildClear()">Clear</button>
            <button class="m-chip" style="padding:9px 22px;font-size:13px;border-color:var(--green);color:var(--green)" onclick="buildCheck()">Check answer</button>
          </div>
          <div style="font-size:12px;color:var(--text-muted);text-align:center;margin-top:14px">${buildTries ? `attempt ${buildTries + 1} — your best so far is ${buildBest} word${buildBest === 1 ? '' : 's'}` : 'struggle first — that’s the exercise'}</div>
        ` : `
          ${prodCompareGridHTML(buildInput, it.ex, ph, 'The podcast line')}
          <div class="f2-p-chips">${prodChipsHTML(m)}</div>
          <div style="margin-top:14px;padding:14px 18px;border-radius:12px;background:var(--surface-hover);border:1px solid var(--surface-border)">
            <b style="color:var(--text-primary)">Attempt ${buildTries}:</b>
            <span style="color:var(--text-secondary)">${verdict}${buildTries > 1 && buildBest > m.hits.length ? ' Your best is still ' + buildBest + ' words — beat it.' : ''}</span>
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
    extra: { attempt: buildTries },
  });
  renderBuild();
}

function buildTryAgain() { buildChecked = false; renderBuild(); }
