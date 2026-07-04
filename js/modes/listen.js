// Tune your ear — comprehension activation, no production required.
// Real lines from the podcast transcript; predict the meaning, then confirm.
// Difficulty is self-adjustable by toggling the Arabic/phonetic layers.

let listenPool = [];
let listenIdx = 0;
let listenPicked = null;   // index of chosen option, null = not answered
let listenOptions = [];
let listenRight = 0;
let listenTotal = 0;
let listenLayers = { ar: true, ph: true };

function buildListenPool() {
  const lines = [];
  CONVO_SCENES.forEach(scene => scene.lines.forEach(l => {
    if (l.ar && l.en && l.ph) lines.push(l);
  }));
  listenPool = shuf(lines);
  listenIdx = 0; listenPicked = null; listenRight = 0; listenTotal = 0;
}

function listenMakeOptions(line) {
  const others = shuf(listenPool.filter(l => l.en !== line.en)).slice(0, 2);
  listenOptions = shuf([line, ...others]);
}

function renderListen() {
  const ca = document.getElementById('content-area');
  if (!listenPool.length) buildListenPool();
  if (listenIdx >= listenPool.length) { buildListenPool(); }
  const line = listenPool[listenIdx];
  if (listenPicked === null && !listenOptions.includes(line)) listenMakeOptions(line);

  const answered = listenPicked !== null;
  const correctIdx = listenOptions.indexOf(line);

  ca.innerHTML = `
    <div class="coach-wrap">
      <div class="listen-progress">${listenTotal ? `${listenRight} / ${listenTotal} this session · ` : ''}line ${listenIdx + 1} of ${listenPool.length}</div>

      <div class="listen-line-card">
        <div class="listen-speaker">${line.speaker === 'host' ? 'The host says' : 'The guest says'}</div>
        <div class="coach-layer-row" style="margin-bottom:12px">
          <button class="coach-layer-chip ${listenLayers.ar ? 'on' : ''}" onclick="listenToggle('ar')">عربي</button>
          <button class="coach-layer-chip ${listenLayers.ph ? 'on' : ''}" onclick="listenToggle('ph')">phonetic</button>
        </div>
        <div class="listen-ar" id="listen-ar" style="${listenLayers.ar ? '' : 'display:none'}">${escAttr(line.ar)}</div>
        <div class="listen-ph" id="listen-ph" style="${listenLayers.ph ? '' : 'display:none'}">${escAttr(line.ph)}</div>
        ${!listenLayers.ar && !listenLayers.ph ? '<div class="coach-fb-note" style="font-style:italic">Turn on at least one layer to read the line.</div>' : ''}
      </div>

      <div class="coach-fb-section-label" style="margin:2px 2px 0">What does it mean? Predict before you tap.</div>
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
        <div class="listen-result-note">
          <b>${listenPicked === correctIdx ? 'Your ear knows.' : 'Close — hear it again:'}</b>
          ${escAttr(line.note || '')}
          ${line.vocab && line.vocab.length ? `<div class="coach-chip-row">${line.vocab.map(v => `<span class="coach-chip coach-chip-vocab" dir="auto">${escAttr(v)}</span>`).join('')}</div>` : ''}
        </div>
        <div class="coach-fb-actions" style="margin-top:16px">
          <button class="btn btn-accent" onclick="listenNext()">Next line →</button>
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
  if (listenOptions[i] === listenPool[listenIdx]) listenRight++;
  renderListen();
}

function listenNext() {
  listenIdx++;
  listenPicked = null;
  listenOptions = [];
  renderListen();
}
