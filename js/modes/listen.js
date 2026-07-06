// Tune your ear — comprehension activation, no production required.
// Designed screen: lavender title, glass line card ("Solja said · Wansa
// episode"), predict-before-you-tap option rows.
//   'meaning' — read a line, predict what it means before confirming
//   'next'    — read one side of an exchange, predict the natural reply
// Difficulty is self-adjustable by toggling the Arabic/phonetic layers.

let listenKind = 'meaning';       // 'meaning' | 'next'
let listenPool = [];
let listenIdx = 0;
let listenPicked = null;
let listenOptions = [];
let listenRight = 0;
let listenTotal = 0;
let listenLayers = { ar: true, ph: true };

function buildListenPool() {
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
  const item = listenPool[listenIdx];
  const answer = listenAnswerOf(item);
  if (listenPicked === null && !listenOptions.includes(answer)) listenMakeOptions(item);

  const answered = listenPicked !== null;
  const correctIdx = listenOptions.indexOf(answer);
  const line = listenKind === 'meaning' ? item : item.cue;
  const speakerLabel = (l) => l.speaker === 'host' ? 'Wansa said' : 'Solja said';

  ca.innerHTML = `
    <div class="coach-wrap">
      <button class="d2-back" onclick="setMode('home')">← all modes</button>
      <div class="d2-title lav" style="margin-bottom:4px">Tune your ear</div>
      <div class="d2-note">${listenTotal ? `${listenRight} / ${listenTotal} this session · ` : ''}${listenIdx + 1} of ${listenPool.length}</div>
      <div class="d2-tab-row">
        <button class="d2-tab ${listenKind === 'meaning' ? 'on' : ''}" onclick="listenSetKind('meaning')">Meaning</button>
        <button class="d2-tab ${listenKind === 'next' ? 'on' : ''}" onclick="listenSetKind('next')">What comes next?</button>
        <span style="flex:1"></span>
        <button class="d2-tab ${listenLayers.ar ? 'on' : ''}" onclick="listenToggle('ar')">عربي</button>
        <button class="d2-tab ${listenLayers.ph ? 'on' : ''}" onclick="listenToggle('ph')">phonetic</button>
      </div>

      <div class="d2-card" style="margin-bottom:16px">
        <div class="d2-label lav">${speakerLabel(line)} · Wansa episode</div>
        <div class="d2-acc-ar" style="font-size:20px;color:#f6f1e8;margin-top:0;${listenLayers.ar ? '' : 'display:none'}">${escAttr(line.ar)}</div>
        <div class="d2-acc-ph" style="font-size:12px;${listenLayers.ph ? '' : 'display:none'}">${escAttr(line.ph)}</div>
        ${listenKind === 'next' ? `<div class="d2-when-body" style="margin-top:12px">…and ${line.speaker === 'host' ? 'Solja' : 'Wansa'} replies. <b style="color:var(--text)">What's the natural reply?</b></div>` : ''}
        ${!listenLayers.ar && !listenLayers.ph ? '<div class="d2-note" style="font-style:italic;margin:0">Turn on at least one layer to read the line.</div>' : ''}
      </div>

      <div class="d2-note" style="text-align:center">${listenKind === 'meaning' ? 'What is he saying? Guess before you\'re sure — the guess is the exercise.' : 'Predict the reply before you tap.'}</div>
      <div class="d2-opts-col">
        ${listenOptions.map((o, i) => {
          let cls = 'd2-opt';
          if (answered) {
            if (i === listenPicked && i === correctIdx) cls += ' correct';
            else if (i === listenPicked) cls += ' wrong';
            else if (i === correctIdx) cls += ' correct';
          }
          return `<button class="${cls}" onclick="listenPick(${i})" ${answered ? 'disabled' : ''}>${escAttr(o.en)}</button>`;
        }).join('')}
      </div>

      ${answered ? `
        ${listenKind === 'next' ? `
        <div class="d2-card" style="margin-top:14px;border-color:rgba(201,169,110,.3)">
          <div class="d2-label gold">The actual reply</div>
          <div class="d2-acc-ar" style="margin-top:0;color:#f6f1e8">${escAttr(item.answer.ar)}</div>
          <div class="d2-acc-ph">${escAttr(item.answer.ph)}</div>
        </div>` : ''}
        <div class="d2-inset" style="margin-top:14px">
          <b style="color:var(--text)">${listenPicked === correctIdx ? 'Your ear knows.' : 'Close — hear it again:'}</b>
          <span class="d2-when-body">${escAttr(answer.note || '')}</span>
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
