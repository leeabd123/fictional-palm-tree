// Tune your ear — comprehension activation, no production required.
// Designed screen: lavender title, glass line card ("Solja said · Wansa
// episode"), predict-before-you-tap option rows.
//   'meaning' — read a line, predict what it means before confirming
//   'next'    — read one side of an exchange, predict the natural reply
// Difficulty is self-adjustable by toggling the Arabic/phonetic layers.

let listenKind = 'meaning';       // 'meaning' | 'next' | 'dicto'
let listenPool = [];
let listenIdx = 0;
let listenPicked = null;
let listenOptions = [];
let listenRight = 0;
let listenTotal = 0;
let listenLayers = { ar: true, ph: true };

let dictoInput = '';
let dictoChecked = false;
let dictoRevealed = false;

function buildListenPool() {
  if (listenKind === 'dicto') {
    const lines = [];
    CONVO_SCENES.forEach(scene => scene.lines.forEach(l => {
      const words = (l.ar || '').split(/\s+/).length;
      if (l.ar && l.ph && l.en && words >= 3 && words <= 10) lines.push(l);
    }));
    listenPool = shuf(lines);
    listenIdx = 0; listenPicked = null; listenOptions = []; listenRight = 0; listenTotal = 0;
    dictoInput = ''; dictoChecked = false; dictoRevealed = false;
    return;
  }
  if (listenKind === 'meaning') {
    const lines = [];
    CONVO_SCENES.forEach(scene => scene.lines.forEach(l => {
      if (l.ar && l.en && l.ph) lines.push(l);
    }));
    listenPool = shuf(lines);
  } else {
    const pairs = [];
    CONVO_SCENES.forEach(scene => {
      for (let i = 0; i < scene.lines.length - 1; i++) {
        const cue = scene.lines[i], answer = scene.lines[i + 1];
        if (cue.ar && answer.ar && answer.en) pairs.push({ cue, answer });
      }
    });
    listenPool = shuf(pairs);
  }
  listenIdx = 0; listenPicked = null; listenOptions = []; listenRight = 0; listenTotal = 0;
}

function listenSetKind(k) {
  if (k === listenKind) return;
  listenKind = k;
  buildListenPool();
  renderListen();
}

function listenAnswerOf(item) { return listenKind === 'meaning' ? item : item.answer; }

function listenMakeOptions(item) {
  const answer = listenAnswerOf(item);
  const others = shuf(listenPool.filter(x => listenAnswerOf(x).en !== answer.en))
    .slice(0, 2).map(listenAnswerOf);
  listenOptions = shuf([answer, ...others]);
}

function renderListen() {
  const ca = document.getElementById('content-area');
  if (!listenPool.length) buildListenPool();
  if (listenIdx >= listenPool.length) buildListenPool();
  if (listenKind === 'dicto') { renderDicto(ca); return; }
  const item = listenPool[listenIdx];
  const answer = listenAnswerOf(item);
  if (listenPicked === null && !listenOptions.includes(answer)) listenMakeOptions(item);

  const answered = listenPicked !== null;
  const correctIdx = listenOptions.indexOf(answer);
  const line = listenKind === 'meaning' ? item : item.cue;
  const speakerLabel = (l) => l.speaker === 'host' ? 'Wansa said' : 'Solja said';

  ca.innerHTML = `
    <div class="coach-wrap mode-anim">
      <button class="d2-back" onclick="setMode('home')">← all modes</button>
      <div class="mode-intro">
        <div class="mode-badge"><svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"/></svg></div>
        <div>
          <div class="mode-kicker">Immerse · listening · ${listenIdx + 1} of ${listenPool.length}${listenTotal ? ` · ${listenRight}/${listenTotal} this session` : ''}</div>
          <div class="mode-lede">Play the line and pick what you heard — trust your ear. Guess before you're sure; the guess is the exercise.</div>
        </div>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:16px">
        <button class="m-chip ${listenKind === 'meaning' ? 'gold' : ''}" onclick="listenSetKind('meaning')">Meaning</button>
        <button class="m-chip ${listenKind === 'next' ? 'gold' : ''}" onclick="listenSetKind('next')">What comes next?</button>
        <button class="m-chip ${listenKind === 'dicto' ? 'gold' : ''}" onclick="listenSetKind('dicto')">Reconstruct</button>
        <span style="flex:1"></span>
        <button class="m-chip ${listenLayers.ar ? 'gold' : ''}" onclick="listenToggle('ar')">عربي</button>
        <button class="m-chip ${listenLayers.ph ? 'gold' : ''}" onclick="listenToggle('ph')">phonetic</button>
      </div>

      <div class="ts-card" style="padding:22px;margin-bottom:16px">
        ${(() => {
          const NE = typeof neonOn === 'function' && neonOn();
          const playGrad = NE ? 'linear-gradient(140deg,#0891b2,#22d3ee)' : 'linear-gradient(140deg,#c9a96e,#e8c99a)';
          const playGlow = NE ? 'rgba(34,211,238,0.7)' : 'rgba(201,169,110,0.7)';
          const barCol = NE ? '#22d3ee' : '#e8c99a';
          const barGlow = NE ? 'box-shadow:0 0 8px rgba(34,211,238,0.7);' : '';
          return `
        <div style="display:flex;align-items:center;gap:14px">
          <span onclick="sayAr('${encodeURIComponent(line.ar)}')" title="hear it" style="width:50px;height:50px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;background:${playGrad};box-shadow:0 10px 26px -8px ${playGlow};cursor:pointer"><span style="display:block;width:0;height:0;border-top:8px solid transparent;border-bottom:8px solid transparent;border-left:13px solid #14110c;margin-left:4px"></span></span>
          <span style="flex:1;display:flex;align-items:center;gap:3px;height:40px">${[10, 24, 36, 18, 30, 12, 28, 16, 34, 8, 22, 14].map((h, bi) =>
            `<span style="display:block;flex:1;height:${h}px;border-radius:2px;background:${bi < 5 ? barCol : 'rgba(255,255,255,0.14)'};${bi < 5 ? barGlow : ''}"></span>`).join('')}</span>
          <span style="font-size:10px;color:#7a756e">${escAttr(speakerLabel(line))}</span>
        </div>`;
        })()}
        <div dir="rtl" style="font-family:'Noto Naskh Arabic',var(--serif),serif;font-size:21px;color:#f6f1e8;line-height:2;margin-top:18px;${listenLayers.ar ? '' : 'display:none'}">${escAttr(line.ar)}</div>
        <div style="font-size:11px;font-style:italic;color:#a78bfa;margin-top:6px;${listenLayers.ph ? '' : 'display:none'}">${escAttr(line.ph)}</div>
        ${listenKind === 'next' ? `<div class="d2-when-body" style="margin-top:12px">…and ${line.speaker === 'host' ? 'Solja' : 'Wansa'} replies. <b style="color:var(--text)">What's the natural reply?</b></div>` : ''}
        ${!listenLayers.ar && !listenLayers.ph ? '<div class="d2-note" style="font-style:italic;margin:8px 0 0">Turn on at least one layer to read the line.</div>' : ''}
      </div>

      <div class="ts-label" style="text-align:right;margin-bottom:12px">${listenKind === 'meaning' ? 'What did you hear?' : 'What comes next?'}</div>
      <div style="display:flex;flex-direction:column;gap:12px">
        ${listenOptions.map((o, i) => {
          let cls = 'opt';
          if (answered) {
            if (i === listenPicked && i === correctIdx) cls += ' correct';
            else if (i === listenPicked) cls += ' wrong';
            else if (i === correctIdx) cls += ' correct';
          }
          return `<button class="${cls}" onclick="listenPick(${i})" ${answered ? 'disabled' : ''}>
            <span style="flex:1;font-size:15px;color:var(--text-primary);text-align:left;line-height:1.5">${escAttr(o.en)}</span>
            ${answered && i === correctIdx ? '<span style="color:var(--green);font-weight:700">✓</span>' : ''}
            ${answered && i === listenPicked && i !== correctIdx ? '<span style="color:var(--coral);font-weight:700">✕</span>' : ''}
          </button>`;
        }).join('')}
      </div>

      ${answered ? `
        ${listenKind === 'next' ? `
        <div class="d2-card" style="margin-top:14px;border-color:rgba(201,169,110,.3)">
          <div class="d2-label gold">The actual reply</div>
          <div class="d2-acc-ar" style="margin-top:0;color:#f6f1e8">${escAttr(item.answer.ar)}</div>
          <div class="d2-acc-ph">${escAttr(item.answer.ph)}</div>
        </div>` : ''}
        <div style="margin-top:14px;padding:14px 18px;border-radius:16px;background:rgba(79,216,196,0.05);border:1px solid rgba(79,216,196,0.2)">
          <div style="font-size:9px;letter-spacing:.18em;text-transform:uppercase;color:#4fd8c4">Why it matters</div>
          <div style="font-size:12px;color:#a09e9a;line-height:1.6;margin-top:6px"><b style="color:var(--text)">${listenPicked === correctIdx ? 'Your ear knows.' : 'Close — hear it again:'}</b> ${escAttr(answer.note || '')}</div>
          ${answer.vocab && answer.vocab.length ? `<div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px">${answer.vocab.map(v => `<span class="d2-weave-chip">${escAttr(v)}</span>`).join('')}</div>` : ''}
        </div>
        <div class="d2-pill-row"><button class="d2-pill-gold" onclick="listenNext()">Next →</button></div>` : ''}
    </div>
  `;
}

function listenToggle(k) {
  listenLayers[k] = !listenLayers[k];
  renderListen();
}

function listenPick(i) {
  if (listenPicked !== null) return;
  listenPicked = i;
  listenTotal++;
  recordActivity();
  if (listenOptions[i] === listenAnswerOf(listenPool[listenIdx])) listenRight++;
  renderListen();
}

function listenNext() {
  listenIdx++;
  listenPicked = null;
  listenOptions = [];
  renderListen();
}


// ── Dictogloss (§11): hear a real podcast line, reconstruct it in your own
// words, then compare against the original. Uses existing transcript
// content directly — a genuinely different exercise from recognition. ──
function renderDicto(ca) {
  const line = listenPool[listenIdx];
  const m = dictoChecked ? prodMatch(dictoInput, line.ar, line.ph) : null;
  ca.innerHTML = `
    <div class="coach-wrap">
      <button class="d2-back" onclick="setMode('home')">← all modes</button>
      <div class="d2-title lav" style="margin-bottom:4px">Tune your ear</div>
      <div class="d2-note">${listenIdx + 1} of ${listenPool.length} · reconstruct what you hear — the struggle IS the exercise</div>
      <div class="d2-tab-row">
        <button class="d2-tab" onclick="listenSetKind('meaning')">Meaning</button>
        <button class="d2-tab" onclick="listenSetKind('next')">What comes next?</button>
        <button class="d2-tab on" onclick="void 0">Reconstruct ${UI_SPK}</button>
      </div>

      <div class="d2-card" style="text-align:center;margin-bottom:14px">
        <div class="d2-label lav">Listen — then rebuild it</div>
        <button class="c2-mic-big" style="margin:8px auto" onclick="sayAr('${encodeURIComponent(line.ar)}')" title="play the line">${UI_SPK}</button>
        <div class="d2-note" style="margin:8px 0 0">tap to hear it (again as often as you like) · browser voice for now — real audio comes with community recordings</div>
        ${dictoRevealed ? `
          <div class="d2-gold-box" style="text-align:right">
            <div class="d2-inset-ar" style="font-size:18px">${escAttr(line.ar)}</div>
            <div class="d2-inset-ph">${escAttr(line.ph)}</div>
            <div class="d2-inset-en" style="text-align:left">${escAttr(line.en)}</div>
          </div>` : ''}
      </div>

      ${!dictoChecked ? `
        <div class="c2-textbox">
          <textarea id="dicto-input" dir="auto" rows="2" placeholder="write what you heard — your own words count too"></textarea>
          <div class="c2-textbox-row">
            <button class="c2-linklike" onclick="dictoRevealed=!dictoRevealed;renderListen()">${dictoRevealed ? 'hide' : 'peek at'} the line</button>
            <span style="flex:1"></span>
            <button class="c2-compare" onclick="dictoCheck()">Compare →</button>
          </div>
        </div>
      ` : `
        ${prodCompareGridHTML(dictoInput, line.ar, line.ph, 'What was actually said')}
        <div class="f2-p-chips">${prodChipsHTML(m)}</div>
        <div class="d2-inset" style="margin-top:12px"><span class="d2-when-body">${escAttr(line.en)}${line.note ? ' — ' + escAttr(line.note) : ''}</span></div>
        <div class="d2-pill-row" style="margin-top:14px">
          <button class="c2-ghost-pill" onclick="dictoChecked=false;renderListen()">↻ Hear it again</button>
          <button class="d2-pill-gold" onclick="dictoNext()">Next line →</button>
        </div>
      `}
    </div>`;
  const ta = document.getElementById('dicto-input');
  if (ta) {
    ta.value = dictoInput;
    ta.addEventListener('input', () => { dictoInput = ta.value; });
  }
}

function dictoCheck() {
  const ta = document.getElementById('dicto-input');
  dictoInput = (ta ? ta.value : dictoInput).trim();
  if (!dictoInput) { if (ta) ta.focus(); return; }
  dictoChecked = true;
  recordActivity();
  renderListen();
}

function dictoNext() {
  listenIdx++;
  dictoInput = ''; dictoChecked = false; dictoRevealed = false;
  renderListen();
}
