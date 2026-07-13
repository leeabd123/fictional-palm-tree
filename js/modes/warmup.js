// ══════════════════════════════════════════════
// WARM-UP — the returning-user flow (learning-design doc §12).
// Not new material and not a test: resurface previously-touched items
// (starred words, guided scenarios already practiced) prioritized by time
// elapsed, three quick production rounds, then back to Today's focus.
// Framed as "easing back in", never "finding out what you forgot".
// ══════════════════════════════════════════════

let warmupSteps = [];
let warmupIdx = 0;
let warmupInput = '';
let warmupChecked = false;
let warmupHits = 0;

function daysSinceLastActivity() {
  let days;
  try { days = JSON.parse(localStorage.getItem('tariga_activity_v1') || '[]'); } catch (e) { return null; }
  if (!days.length) return null;
  const last = days.sort().slice(-1)[0];
  const [y, m, d] = last.split('-').map(Number);
  return Math.floor((Date.now() - new Date(y, m - 1, d).getTime()) / 86400000);
}

// warm-up is offered when the learner has history and has been away a bit
function warmupAvailable() {
  const gap = daysSinceLastActivity();
  if (gap === null || gap < 2) return false;
  return warmupBuildSteps().length >= 2;
}

function warmupBuildSteps() {
  const steps = [];
  // 1) previously practiced guided scenarios, oldest first (forgetting curve)
  const prog = getGuidedProgress();
  const practiced = GUIDED_SCENARIOS
    .filter(g => prog[g.id] && prog[g.id].ts)
    .sort((a, b) => prog[a.id].ts - prog[b.id].ts);
  practiced.slice(0, 2).forEach(g => {
    const t = g.targets.find(x => x.gender === 'any') || g.targets[0];
    steps.push({ kind: 'guided', title: g.title, prompt: g.say_en, target: t.ar, ph: t.ph });
  });
  // 2) starred items — the learner chose these, resurface them
  const all = [...V1, ...V2, ...P2, ...EXTRA];
  const starred = all.filter(x => starredItems.has(x.a));
  shuf(starred).slice(0, 2).forEach(it => {
    steps.push({ kind: 'starred', title: 'One you starred', prompt: it.e, target: it.a, ph: it.p });
  });
  return steps.slice(0, 3);
}

function warmupStart() {
  warmupSteps = warmupBuildSteps();
  warmupIdx = 0; warmupInput = ''; warmupChecked = false; warmupHits = 0;
  setMode('warmup');
}

function renderWarmup() {
  const ca = document.getElementById('content-area');
  if (!warmupSteps.length) { setMode('home'); return; }
  const doneAll = warmupIdx >= warmupSteps.length;
  const step = doneAll ? null : warmupSteps[warmupIdx];
  const m = warmupChecked && step ? prodMatch(warmupInput, step.target, step.ph) : null;
  const gap = daysSinceLastActivity();

  ca.innerHTML = `
    <div class="coach-wrap">
      <button class="d2-back" onclick="setMode('home')">← home</button>
      <div class="c2-head">
        <div>
          <div class="c2-title">Easing back in</div>
          <div class="c2-sub">${gap ? gap + ' days away · ' : ''}${warmupSteps.length} quick ones from your own history — no new material</div>
        </div>
      </div>

      ${doneAll ? `
        <div class="d2-gold-box" style="text-align:center">
          <div class="c2-title" style="font-size:20px">Warmed up. ♡</div>
          <div class="d2-when-body" style="margin-top:8px">That's the rust gone — ${warmupHits} phrase${warmupHits === 1 ? '' : 's'} came right back. Now the real practice.</div>
        </div>
        <div class="d2-pill-row">
          <button class="d2-pill-gold" onclick="homeStart()">Today's focus →</button>
        </div>
      ` : `
        <div class="c2-qcard">
          <div class="c2-qlabel">${warmupIdx + 1} of ${warmupSteps.length} · ${escAttr(step.title)}</div>
          <div class="c2-qtext" style="font-size:19px">${escAttr(step.prompt)}</div>
        </div>
        ${!warmupChecked ? `
          <div class="c2-textbox">
            <textarea id="warmup-input" dir="auto" rows="2" placeholder="say it — Arabic script or Arabizi"></textarea>
            <div class="c2-textbox-row">
              ${coachMicSupported() ? `<button class="c2-mic-small" id="warmup-mic" onclick="warmupMic()">${UI_MIC}</button>` : ''}
              <span style="flex:1"></span>
              <button class="c2-compare" onclick="warmupCheck()">Check →</button>
            </div>
          </div>
          <div class="c2-footnote">You've said this before — trust the instinct.</div>
        ` : `
          ${prodCompareGridHTML(warmupInput, step.target, step.ph, 'As you learned it')}
          <div class="f2-p-chips">${prodChipsHTML(m)}</div>
          <div class="d2-pill-row" style="margin-top:14px">
            <button class="c2-ghost-pill" onclick="warmupTryAgain()">↻ Once more</button>
            <button class="d2-pill-gold" onclick="warmupNext()">${warmupIdx >= warmupSteps.length - 1 ? 'Done →' : 'Next →'}</button>
          </div>
        `}
      `}
    </div>
  `;
  const ta = document.getElementById('warmup-input');
  if (ta) {
    ta.value = warmupInput;
    ta.addEventListener('input', () => { warmupInput = ta.value; });
    ta.focus();
  }
}

function warmupMic() {
  prodMic('warmup-mic', (t) => {
    warmupInput = (warmupInput ? warmupInput.trimEnd() + ' ' : '') + t;
    const ta = document.getElementById('warmup-input');
    if (ta) ta.value = warmupInput;
  });
}
function warmupCheck() {
  const ta = document.getElementById('warmup-input');
  warmupInput = (ta ? ta.value : warmupInput).trim();
  if (!warmupInput) { if (ta) ta.focus(); return; }
  warmupChecked = true;
  const step = warmupSteps[warmupIdx];
  const m = prodMatch(warmupInput, step.target, step.ph);
  if (m.hits.length >= Math.ceil(m.words.length / 2)) warmupHits++;
  recordActivity();
  renderWarmup();
}
function warmupTryAgain() { warmupChecked = false; renderWarmup(); }
function warmupNext() {
  warmupIdx++; warmupInput = ''; warmupChecked = false;
  renderWarmup();
}
