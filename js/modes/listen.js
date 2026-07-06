// Tune your ear — comprehension activation, no production required.
// Two exercises built from real podcast transcript lines (§13 of the research doc):
//   'meaning' — read a line, predict what it means before confirming
//   'next'    — read one side of an exchange, predict the natural reply
//               (conversational-flow comprehension, not word recognition)
// Difficulty is self-adjustable by toggling the Arabic/phonetic layers.

let listenKind = 'meaning';       // 'meaning' | 'next'
let listenPool = [];              // meaning: lines · next: {cue, answer} pairs
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
  const speakerLabel = (l) => l.speaker === 'host' ? 'The host' : 'The guest';

  ca.innerHTML = `
    <div class="coach-wrap">
      <div class="listen-kind-row">
        <button class="listen-kind ${listenKind === 'meaning' ? 'on' : ''}" onclick="listenSetKind('meaning')">Meaning</button>
        <button class="listen-kind ${listenKind === 'next' ? 'on' : ''}" onclick="listenSetKind('next')">What comes next?</button>
      </div>
      <div class="listen-progress">${listenTotal ? `${listenRight} / ${listenTotal} this session · ` : ''}${listenIdx + 1} of ${listenPool.length}</div>

      <div class="listen-line-card">
        <div class="listen-speaker">${speakerLabel(line)} says${listenKind === 'next' ? ' —' : ''}</div>
        <div class="coach-layer-row" style="margin-bottom:12px">
          <button class="coach-layer-chip ${listenLayers.ar ? 'on' : ''}" onclick="listenToggle('ar')">عربي</button>
          <button class="coach-layer-chip ${listenLayers.ph ? 'on' : ''}" onclick="listenToggle('ph')">phonetic</button>
        </div>
        <div class="listen-ar" style="${listenLayers.ar ? '' : 'display:none'}">${escAttr(line.ar)}</div>
        <div class="listen-ph" style="${listenLayers.ph ? '' : 'display:none'}">${escAttr(line.ph)}</div>
        ${listenKind === 'next' ? `<div class="listen-context-line" style="margin-top:12px;margin-bottom:0">…and ${speakerLabel(item.answer).toLowerCase()} replies. <b>What's the natural reply?</b></div>` : ''}
        ${!listenLayers.ar && !listenLayers.ph ? '<div class="coach-fb-note" style="font-style:italic">Turn on at least one layer to read the line.</div>' : ''}
      </div>

      <div class="coach-fb-section-label" style="margin:2px 2px 0">${listenKind === 'meaning' ? 'What does it mean? Predict before you tap.' : 'Predict the reply before you tap.'}</div>
      <div class="listen-choices">
        ${listenOptions.map((o, i) => {
          let cls = 'listen-choice';
          if (answered) {
            if (i === listenPicked && i === correctIdx) cls += ' picked-right';
            else if (i === listenPicked) cls += ' picked-wrong';
            else if (i === correctIdx) cls += ' reveal-right';
          }
          return `<button class="${cls}" onclick="listenPick(${i})" ${answered ? 'disabled' : ''}>${escAttr(o.en)}</button>`;
        }).join('')}
      </div>

      ${answered ? `
        ${listenKind === 'next' ? `
        <div class="listen-line-card" style="margin-top:14px;border-color:rgba(201,169,110,.3)">
          <div class="listen-speaker">The actual reply</div>
          <div class="listen-ar">${escAttr(item.answer.ar)}</div>
          <div class="listen-ph">${escAttr(item.answer.ph)}</div>
        </div>` : ''}
        <div class="listen-result-note">
          <b>${listenPicked === correctIdx ? 'Your ear knows.' : 'Close — hear it again:'}</b>
          ${escAttr(answer.note || '')}
          ${answer.vocab && answer.vocab.length ? `<div class="coach-chip-row">${answer.vocab.map(v => `<span class="coach-chip coach-chip-vocab" dir="auto">${escAttr(v)}</span>`).join('')}</div>` : ''}
        </div>
        <div class="coach-fb-actions" style="margin-top:16px">
          <button class="btn btn-accent" onclick="listenNext()">Next →</button>
        </div>` : ''}
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
