// Conversation mode (scenario dialogues)
let convoSceneIdx = 0;
let convoMode = 'full'; // 'full' = read whole scene | 'respond' = line-by-line respond mode
let convoRevealedLines = new Set();
let convoUsedChips = new Set();

function renderConvo() {
  const ca = document.getElementById('content-area');
  ca.innerHTML = `
    <div class="convo-intro">
      <div class="convo-intro-title">Conversation mode — Wansa × Solja</div>
      <div class="convo-intro-body">Read, shadow, and respond like the real speakers. Every scene is pulled directly from the transcript. Choose your practice mode then work through each scene until you can say every line naturally at speed.</div>
    </div>
    <div class="convo-mode-selector">
      <div class="convo-mode-card ${convoMode==='full'?'active':''}" onclick="setConvoMode('full')">
        <div class="convo-mode-title">Full scene read</div>
        <div class="convo-mode-desc">See the full conversation. Blur lines until you tap to reveal. Practice shadowing at speed.</div>
      </div>
      <div class="convo-mode-card ${convoMode==='respond'?'active':''}" onclick="setConvoMode('respond')">
        <div class="convo-mode-title">Respond mode</div>
        <div class="convo-mode-desc">Host line shown. You try to say what comes next. Tap to reveal the response with vocab chips.</div>
      </div>
    </div>
    <div class="convo-scene-tabs">
      ${CONVO_SCENES.map((sc,i) => `<button class="convo-tab ${convoSceneIdx===i?'on':''}" onclick="goConvoScene(${i})">${i+1}. ${sc.scene.split('—')[0].trim()}</button>`).join('')}
    </div>
    ${renderConvoScene()}
  `;
}

function setConvoMode(m) { convoMode = m; convoRevealedLines = new Set(); convoUsedChips = new Set(); renderConvo(); }
function goConvoScene(i) { convoSceneIdx = i; convoRevealedLines = new Set(); convoUsedChips = new Set(); renderConvo(); }

function renderConvoScene() {
  const scene = CONVO_SCENES[convoSceneIdx];
  const total = CONVO_SCENES.length;
  return `
    <div class="convo-scene-meta">
      <div class="convo-scene-label">Scene ${convoSceneIdx+1} of ${total}</div>
      <div class="convo-scene-title">${scene.scene}</div>
      <div class="convo-scene-desc">${scene.desc}</div>
    </div>
    <div class="convo-controls">
      <button class="convo-ctrl-btn" onclick="revealAllConvo()">Reveal all lines</button>
      <button class="convo-ctrl-btn" onclick="hideAllConvo()">Hide all</button>
      <span style="font-size:12px;color:var(--text3);margin-left:auto">Tap any line to reveal · tap again to hide</span>
    </div>
    <div class="convo-thread">
      ${convoMode === 'full' ? renderFullScene(scene) : renderRespondScene(scene)}
    </div>
    <div class="convo-nav">
      <button class="arrow-btn" onclick="navConvo(-1)" ${convoSceneIdx===0?'disabled':''}>← prev scene</button>
      <span class="convo-progress-label">${convoSceneIdx+1} / ${total}</span>
      <button class="arrow-btn" onclick="navConvo(1)" ${convoSceneIdx>=total-1?'disabled':''}>next scene →</button>
    </div>
  `;
}

function renderFullScene(scene) {
  return scene.lines.map((line, i) => {
    const revealed = convoRevealedLines.has(i);
    const isHost = line.speaker === 'host';
    const vocabChips = line.vocab.map((v,vi) => `<span class="convo-vc" onclick="event.stopPropagation()">${v}</span>`).join('');
    return `
      <div class="convo-line ${isHost?'host':'guest'}" id="cl-${i}" onclick="toggleConvoLine(${i})">
        <div class="convo-speaker-label">${isHost?'Wansa (host)':'Solja (guest)'}</div>
        <div class="convo-bubble">
          <div class="convo-ar ${revealed?'':'convo-hidden'}">${line.ar}</div>
          <div class="convo-ph ${revealed?'':'convo-hidden'}">${line.ph}</div>
          <div class="convo-en ${revealed?'':'convo-hidden'}">${line.en}</div>
          ${revealed ? `<div class="convo-note">${line.note}</div><div class="convo-vocab-chips">${vocabChips}</div>` : '<div class="convo-reveal-btn">tap to reveal</div>'}
        </div>
      </div>`;
  }).join('');
}

function renderRespondScene(scene) {
  let html = '';
  for (let i = 0; i < scene.lines.length; i++) {
    const line = scene.lines[i];
    const isHost = line.speaker === 'host';
    const revealed = convoRevealedLines.has(i);
    if (isHost) {
      html += `
        <div class="convo-line host">
          <div class="convo-speaker-label">Wansa (host)</div>
          <div class="convo-bubble">
            <div class="convo-ar">${line.ar}</div>
            <div class="convo-ph">${line.ph}</div>
            <div class="convo-en">${line.en}</div>
          </div>
        </div>`;
      // Show the "your turn" prompt for the next guest line if it exists
      if (i+1 < scene.lines.length && scene.lines[i+1].speaker === 'guest') {
        const guestLine = scene.lines[i+1];
        const guestRevealed = convoRevealedLines.has(i+1);
        const vocabChips = guestLine.vocab.map(v => `<span class="convo-vc" id="rvc-${i+1}-${v}" onclick="toggleRVC('${i+1}-${v}')">${v}</span>`).join('');
        html += `
          <div class="convo-your-turn">
            <div class="convo-your-label">Your turn — respond as Solja</div>
            <div class="convo-your-prompt">Try to say the response in Sudanese Arabic using these words:</div>
            <div class="convo-vocab-chips">${vocabChips}</div>
            <div class="convo-answer-reveal ${guestRevealed?'show':''}" id="car-${i+1}">
              <div class="convo-ar">${guestLine.ar}</div>
              <div class="convo-ph">${guestLine.ph}</div>
              <div class="convo-en">${guestLine.en}</div>
              <div class="convo-note">${guestLine.note}</div>
            </div>
            ${!guestRevealed ? `<button class="convo-reveal-btn" onclick="revealConvoLine(${i+1})">Reveal Solja-s response</button>` : ''}
          </div>`;
        i++; // skip the guest line since we rendered it
      }
    } else if (!convoRevealedLines.has(i-1)) {
      // standalone guest line (no preceding host line in current iteration)
      const vocabChips = line.vocab.map(v => `<span class="convo-vc">${v}</span>`).join('');
      html += `
        <div class="convo-your-turn">
          <div class="convo-your-label">Your turn — respond as Solja</div>
          <div class="convo-vocab-chips">${vocabChips}</div>
          <div class="convo-answer-reveal ${revealed?'show':''}" id="car-${i}">
            <div class="convo-ar">${line.ar}</div><div class="convo-ph">${line.ph}</div><div class="convo-en">${line.en}</div>
            <div class="convo-note">${line.note}</div>
          </div>
          ${!revealed ? `<button class="convo-reveal-btn" onclick="revealConvoLine(${i})">Reveal response</button>` : ''}
        </div>`;
    }
  }
  return html;
}

function toggleConvoLine(i) {
  if (convoRevealedLines.has(i)) convoRevealedLines.delete(i);
  else convoRevealedLines.add(i);
  renderConvo();
}

function revealConvoLine(i) {
  convoRevealedLines.add(i);
  renderConvo();
}

function revealAllConvo() {
  CONVO_SCENES[convoSceneIdx].lines.forEach((_,i) => convoRevealedLines.add(i));
  renderConvo();
}

function hideAllConvo() {
  convoRevealedLines.clear();
  renderConvo();
}

function navConvo(dir) {
  const newIdx = convoSceneIdx + dir;
  if (newIdx < 0 || newIdx >= CONVO_SCENES.length) return;
  convoSceneIdx = newIdx;
  convoRevealedLines = new Set();
  convoUsedChips = new Set();
  renderConvo();
}

function toggleRVC(key) {
  const el = document.getElementById('rvc-' + key);
  if (!el) return;
  if (convoUsedChips.has(key)) { convoUsedChips.delete(key); el.classList.remove('used'); }
  else { convoUsedChips.add(key); el.classList.add('used'); }
}


// ══════════════════════════════════════
// STARRED SYSTEM
// ══════════════════════════════════════
