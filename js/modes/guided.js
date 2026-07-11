// ══════════════════════════════════════════════
// GUIDED MODE + PHONE CALL LITE — the highest-scaffolding practice tier.
// Guided: English shown → learner produces the Arabic → compared against a
// specific native-verified target phrase (shared engine with flashcards).
// Call Lite (§19.1): a real call, turn by turn — every family line is
// pre-written and verified, never generated. Light coaching per turn.
// ══════════════════════════════════════════════

let guidedIdx = 0;
let guidedInput = '';
let guidedChecked = false;
let guidedTargetIdx = 0;      // which model target the learner is compared against
let guidedGender = (getProfile().gender === 'm') ? 'm' : 'f';

function guidedList() {
  const dm = focusDomain();
  const list = GUIDED_SCENARIOS.filter(g => g.domain === dm);
  return [...list.filter(g => g.tier === 'Beginning'), ...list.filter(g => g.tier !== 'Beginning')];
}
function guidedLocked(it) {
  return it.tier === 'Comfortable' && domainTier(it.domain) === 'Beginning';
}
function guidedDomain() { return DOMAINS.find(d => d.id === focusDomain()) || DOMAINS[0]; }
function guidedItem() { return guidedList()[guidedIdx]; }

// pick the target: prefer the selected variant's gender, else 'any'
function guidedTargets(it) {
  return it.targets.filter(t => t.gender === 'any' || t.gender === guidedGender);
}

function guidedOpen(id) {
  const g = GUIDED_SCENARIOS.find(s => s.id === id);
  if (g) setFocusDomain(g.domain);
  const i = guidedList().findIndex(s => s.id === id);
  if (i >= 0) { guidedIdx = i; guidedInput = ''; guidedChecked = false; guidedTargetIdx = 0; }
  setMode('guided');
}

function renderGuided() {
  const ca = document.getElementById('content-area');
  if (guidedIdx >= guidedList().length) guidedIdx = 0;
  const it = guidedItem();
  if (guidedLocked(it)) {
    ca.innerHTML = `
      <div class="coach-wrap">
        <button class="d2-back" onclick="setMode('home')">← home</button>
        <div class="c2-head">
          <div>
            <div class="c2-title">Guided · ${guidedDomain().label}</div>
            <div class="c2-sub">${guidedIdx + 1} of ${guidedList().length} · Comfortable tier</div>
          </div>
          <div class="speak-q-nav" style="margin:0">
            <button class="arrow-btn" onclick="guidedNav(-1)" ${guidedIdx === 0 ? 'disabled' : ''}>←</button>
            <button class="arrow-btn" onclick="guidedNav(1)" ${guidedIdx >= guidedList().length - 1 ? 'disabled' : ''}>→</button>
          </div>
        </div>
        <div class="d2-card" style="text-align:center">
          <div style="font-size:34px">🔒</div>
          <div class="c2-title" style="font-size:19px;margin:10px 0 6px">${escAttr(it.title)}</div>
          <div class="d2-note" style="margin:0 auto;max-width:380px">This one unlocks at Comfortable tier — finish the ${guidedDomain().label} basics first and it opens on its own.</div>
          <div class="d2-pill-row" style="margin-top:16px">
            <button class="d2-pill-gold" onclick="guidedIdx=0;renderGuided()">Back to the basics →</button>
          </div>
        </div>
      </div>`;
    return;
  }
  const targets = guidedTargets(it);
  const target = targets[Math.min(guidedTargetIdx, targets.length - 1)];
  const hasGenderVariants = it.targets.some(t => t.gender !== 'any') || (it.prompt && it.prompt.variants);
  const prompt = it.prompt && it.prompt.gender && guidedGender === 'm' && it.prompt.variants && it.prompt.variants.m
    ? { ...it.prompt, ...it.prompt.variants.m } : it.prompt;
  const done = getGuidedProgress();
  const m = guidedChecked ? prodMatch(guidedInput, target.ar, target.ph) : null;

  ca.innerHTML = `
    <div class="coach-wrap">
      <button class="d2-back" onclick="setMode('home')">← home</button>
      <div class="c2-head">
        <div>
          <div class="c2-title">Guided · ${guidedDomain().label}</div>
          <div class="c2-sub">${guidedIdx + 1} of ${guidedList().length} · ${escAttr(it.tier)} tier · domain: ${domainTier(focusDomain())}${domainTier(focusDomain()) !== 'Beginning' ? ' ✓' : ''}</div>
        </div>
        <div class="speak-q-nav" style="margin:0">
          <button class="arrow-btn" onclick="guidedNav(-1)" ${guidedIdx === 0 ? 'disabled' : ''}>←</button>
          <button class="arrow-btn" onclick="guidedNav(1)" ${guidedIdx >= guidedList().length - 1 ? 'disabled' : ''}>→</button>
        </div>
      </div>

      <div class="c2-qcard">
        <div class="c2-qlabel">${escAttr(it.title)} ${done[it.id] ? '· ✓ practiced' : ''}</div>
        ${it.verification_status === 'pending-review' ? '<div class="d2-badge" style="margin-bottom:10px">founder-seeded · pending native review</div>' : ''}
        <div class="c2-sub" style="margin-top:0;margin-bottom:12px">${escAttr(it.setup)}</div>
        ${prompt ? `
          <div class="d2-inset" style="text-align:right">
            <div class="d2-inset-ar" style="font-size:19px">${escAttr(prompt.ar)}</div>
            <div class="d2-inset-ph">${escAttr(prompt.ph)}</div>
            <div class="d2-inset-en" style="text-align:left">${escAttr(prompt.en)}
              ${typeof speakerSVG === 'function' ? speakerSVG('#a09e9a', encodeURIComponent(prompt.ar)) : ''}</div>
          </div>` : ''}
        <div class="c2-qtext" style="font-size:18px;margin-top:14px">${escAttr(it.say_en)}</div>
        ${hasGenderVariants ? `
        <div class="d2-tab-row" style="justify-content:center;margin:12px 0 0">
          <button class="d2-tab ${guidedGender === 'f' ? 'on' : ''}" onclick="guidedSetGender('f')">speaking as her</button>
          <button class="d2-tab ${guidedGender === 'm' ? 'on' : ''}" onclick="guidedSetGender('m')">speaking as him</button>
        </div>` : ''}
      </div>

      ${!guidedChecked ? `
        <div class="c2-textbox">
          <textarea id="guided-input" dir="auto" rows="2"
            placeholder="اكتب هنا… or Arabizi (as-salamu…, ma3lash…) — both count"></textarea>
          <div class="c2-textbox-row">
            ${coachMicSupported() ? `<button class="c2-mic-small" id="guided-mic" onclick="guidedMic()" title="say it out loud">🎙</button>` : ''}
            <span style="flex:1"></span>
            <button class="c2-compare" onclick="guidedCheck()">Compare →</button>
          </div>
        </div>
        <div class="c2-footnote">Struggle first — that's the exercise. The verified answer appears after you try.</div>
      ` : `
        ${prodCompareGridHTML(guidedInput, target.ar, target.ph, 'How family says it')}
        <div class="f2-p-chips">${prodChipsHTML(m)}</div>
        ${targets.length > 1 ? `
        <div class="d2-note" style="text-align:center;margin:12px 0 0">
          another natural way:
          ${targets.map((t, i) => i === guidedTargetIdx ? '' : `<button class="c2-linklike" onclick="guidedSwapTarget(${i})">${escAttr(t.ph)}</button>`).filter(Boolean).join(' · ')}
        </div>` : ''}
        ${it.reply ? `
        <div class="d2-gold-box">
          <div class="d2-label gold" style="margin-bottom:8px">They answer back —</div>
          <div class="d2-inset-ar" style="font-size:18px">${escAttr(it.reply.ar)}</div>
          <div class="d2-inset-ph">${escAttr(it.reply.ph)}</div>
          <div class="d2-inset-en">${escAttr(it.reply.en)}</div>
        </div>` : ''}
        <div class="d2-inset" style="margin-top:14px">
          <b style="color:var(--text)">Why it's said this way:</b>
          <span class="d2-when-body">${escAttr(it.note)}</span>
        </div>
        <div class="c2-encourage">Now say it out loud. Twice. That's the whole trick.</div>
        <div class="d2-pill-row">
          <button class="c2-ghost-pill" onclick="guidedTryAgain()">↻ Try again</button>
          <button class="d2-pill-gold" onclick="guidedNext()">${guidedIdx >= guidedList().length - 1 ? 'The calls →' : 'Next →'}</button>
        </div>
      `}

      ${domainTier(focusDomain()) !== 'Beginning' ? `
      <div class="d2-pill-row" style="margin-top:22px">
        <button class="d2-pill-teal" onclick="setMode('freeform')">✨ Free-form unlocked — speak without the scaffolding →</button>
      </div>` : ''}

      ${CALL_SEQUENCES.some(c => c.domain === focusDomain()) ? `
      <div class="j2-sec-label" style="margin-top:26px">The calls — put it together</div>
      <div class="d2-grid2">
        ${CALL_SEQUENCES.filter(c => c.domain === focusDomain()).map(c => `
          <button class="home-card" style="text-align:left" onclick="callOpen('${c.id}')">
            <span class="home-card-icon">${c.icon}</span>
            <span class="home-card-title">${escAttr(c.title)}</span>
            <span class="home-card-sub">${done[c.id] ? '✓ completed · replay' : c.turns.filter(t => t.who === 'you').length + ' turns are yours'}</span>
          </button>`).join('')}
      </div>` : ''}
    </div>
  `;
  const ta = document.getElementById('guided-input');
  if (ta) {
    ta.value = guidedInput;
    ta.addEventListener('input', () => { guidedInput = ta.value; });
  }
}

function guidedSetGender(g) {
  guidedGender = g;
  const p = getProfile(); p.gender = g; saveProfile(p);
  renderGuided();
}
function guidedMic() {
  prodMic('guided-mic', (t) => {
    guidedInput = (guidedInput ? guidedInput.trimEnd() + ' ' : '') + t;
    const ta = document.getElementById('guided-input');
    if (ta) ta.value = guidedInput;
  });
}
function guidedCheck() {
  const ta = document.getElementById('guided-input');
  guidedInput = (ta ? ta.value : guidedInput).trim();
  if (!guidedInput) { if (ta) ta.focus(); return; }
  guidedChecked = true;
  const it = guidedItem();
  const targets = guidedTargets(it);
  // compare against whichever variant the learner got closest to
  let best = 0, bestHits = -1;
  targets.forEach((t, i) => {
    const mm = prodMatch(guidedInput, t.ar, t.ph);
    if (mm.hits.length > bestHits) { bestHits = mm.hits.length; best = i; }
  });
  guidedTargetIdx = best;
  const t = targets[best];
  const mm = prodMatch(guidedInput, t.ar, t.ph);
  saveGuidedProgress(it.id, { ts: Date.now(), hits: mm.hits.length, total: mm.words.length });
  recordActivity();
  renderGuided();
}
function guidedSwapTarget(i) { guidedTargetIdx = i; renderGuided(); }
function guidedTryAgain() { guidedChecked = false; renderGuided(); }
function guidedNext() {
  if (guidedIdx >= guidedList().length - 1) {
    const c = CALL_SEQUENCES.find(x => x.domain === focusDomain());
    if (c) { callOpen(c.id); return; }
    setMode('home'); return;
  }
  guidedNav(1);
}
function guidedNav(dir) {
  const n = guidedIdx + dir;
  if (n < 0 || n >= guidedList().length) return;
  guidedIdx = n; guidedInput = ''; guidedChecked = false; guidedTargetIdx = 0;
  renderGuided();
}

// ── Phone Call Lite ──
let callId = null;
let callTurn = 0;            // how many turns are revealed
let callInput = '';
let callChecked = false;

function callSeq() { return CALL_SEQUENCES.find(c => c.id === callId) || CALL_SEQUENCES[0]; }

function callOpen(id) {
  callId = id; callTurn = 0; callInput = ''; callChecked = false;
  setMode('call');
  callAdvanceFamily();
}

// auto-reveal consecutive family turns until it's the learner's turn
function callAdvanceFamily() {
  const seq = callSeq();
  while (callTurn < seq.turns.length && seq.turns[callTurn].who === 'family') callTurn++;
  renderCall();
}

function renderCall() {
  const ca = document.getElementById('content-area');
  const seq = callSeq();
  const doneAll = callTurn >= seq.turns.length;
  const current = doneAll ? null : seq.turns[callTurn];
  const m = callChecked && current ? prodMatch(callInput, current.ar, current.ph) : null;

  ca.innerHTML = `
    <div class="coach-wrap">
      <button class="d2-back" onclick="setMode('guided')">← guided practice</button>
      <div class="c2-head">
        <div>
          <div class="c2-title">${seq.icon} ${escAttr(seq.title)}</div>
          <div class="c2-sub">${escAttr(seq.caller)} · every line here is native-verified — nothing invented</div>
        </div>
      </div>
      ${seq.tone === 'gentle' ? `<div class="d2-note" style="text-align:center">a gentler moment — these phrases are ritual, learn them exactly</div>` : ''}

      <div class="d2-thread">
        ${seq.turns.slice(0, callTurn).map(t => `
          <div class="d2-msg ${t.who === 'family' ? 'host' : 'guest'}">
            <div class="d2-msg-who">${t.who === 'family' ? escAttr(seq.caller) : 'You'}</div>
            <div class="d2-bubble" style="cursor:default">
              <div class="d2-bubble-ar">${escAttr(t.ar)}</div>
              <div class="d2-bubble-ph">${escAttr(t.ph)}</div>
              <div class="d2-bubble-en">${escAttr(t.en)}</div>
            </div>
          </div>`).join('')}
      </div>

      ${doneAll ? `
        <div class="d2-gold-box" style="text-align:center">
          <div class="c2-title" style="font-size:19px">That's the whole call. 🤍</div>
          <div class="d2-when-body" style="margin-top:8px">${escAttr(seq.note)}</div>
        </div>
        <div class="d2-pill-row">
          <button class="c2-ghost-pill" onclick="callOpen('${seq.id}')">↻ Call again</button>
          <button class="d2-pill-gold" onclick="setMode('home')">Done for now →</button>
        </div>
      ` : `
        <div class="d2-yourturn" style="margin-top:14px">
          <div class="d2-yourturn-label">Your turn</div>
          <div class="d2-yourturn-body" style="text-align:left">${escAttr(current.en)}</div>
          ${!callChecked ? `
            <div class="c2-textbox" style="margin-top:12px;margin-bottom:0">
              <textarea id="call-input" dir="auto" rows="2" placeholder="say it — Arabic script or Arabizi"></textarea>
              <div class="c2-textbox-row">
                ${coachMicSupported() ? `<button class="c2-mic-small" id="call-mic" onclick="callMic()">🎙</button>` : ''}
                <span style="flex:1"></span>
                <button class="c2-compare" onclick="callCheck()">Say it →</button>
              </div>
            </div>
          ` : `
            ${prodCompareGridHTML(callInput, current.ar, current.ph, 'The verified line')}
            <div class="f2-p-chips">${prodChipsHTML(m)}</div>
            <div class="d2-pill-row" style="margin-top:12px">
              <button class="c2-ghost-pill" onclick="callTryAgain()">↻ Once more</button>
              <button class="d2-pill-gold" onclick="callContinue()">Continue the call →</button>
            </div>
          `}
        </div>
      `}
    </div>
  `;
  const ta = document.getElementById('call-input');
  if (ta) {
    ta.value = callInput;
    ta.addEventListener('input', () => { callInput = ta.value; });
    ta.focus();
  }
}

function callMic() {
  prodMic('call-mic', (t) => {
    callInput = (callInput ? callInput.trimEnd() + ' ' : '') + t;
    const ta = document.getElementById('call-input');
    if (ta) ta.value = callInput;
  });
}
function callCheck() {
  const ta = document.getElementById('call-input');
  callInput = (ta ? ta.value : callInput).trim();
  if (!callInput) { if (ta) ta.focus(); return; }
  callChecked = true;
  recordActivity();
  renderCall();
}
function callTryAgain() { callChecked = false; renderCall(); }
function callContinue() {
  const seq = callSeq();
  callTurn++;               // reveal your line as sent
  callInput = ''; callChecked = false;
  while (callTurn < seq.turns.length && seq.turns[callTurn].who === 'family') callTurn++;
  if (callTurn >= seq.turns.length) saveGuidedProgress(seq.id, { ts: Date.now() });
  renderCall();
}
