// Conversation mode — the real podcast, scene by scene, in the designed
// chat-bubble layout: host bubbles left, gold guest bubbles right, blur
// reveal on unread lines, and the dashed "Your turn — you're Solja" box.
let convoSceneIdx = 0;
let convoMode = 'full'; // 'full' = read whole scene | 'respond' = line-by-line respond mode
let convoRevealedLines = new Set();
let convoUsedChips = new Set();

function renderConvo() {
  const ca = document.getElementById('content-area');
  const scene = CONVO_SCENES[convoSceneIdx];
  const total = CONVO_SCENES.length;
  ca.innerHTML = `
    <div class="coach-wrap">
      <button class="d2-back" onclick="setMode('home')">← all modes</button>
      <div class="d2-title">Conversation mode</div>
      <div class="d2-note">Scene ${convoSceneIdx + 1} of ${total} · ${escAttr(scene.scene)}</div>
      <div class="d2-tab-row">
        <button class="d2-tab ${convoMode === 'full' ? 'on' : ''}" onclick="setConvoMode('full')">Full scene read</button>
        <button class="d2-tab ${convoMode === 'respond' ? 'on' : ''}" onclick="setConvoMode('respond')">Respond mode</button>
        <span style="flex:1"></span>
        <button class="d2-tab" onclick="revealAllConvo()">Reveal all</button>
        <button class="d2-tab" onclick="hideAllConvo()">Hide all</button>
      </div>
      <div class="d2-tab-row" style="margin-bottom:10px">
        ${CONVO_SCENES.map((sc, i) => `<button class="d2-tab ${convoSceneIdx === i ? 'on' : ''}" onclick="goConvoScene(${i})">${i + 1}</button>`).join('')}
      </div>
      <div class="d2-note" style="margin-bottom:12px">${escAttr(scene.desc)}</div>
      <div class="d2-thread">
        ${convoMode === 'full' ? renderFullScene(scene) : renderRespondScene(scene)}
      </div>
      <div class="d2-pill-row" style="margin-top:18px">
        <button class="d2-tab" onclick="navConvo(-1)" ${convoSceneIdx === 0 ? 'disabled' : ''}>← prev scene</button>
        <button class="d2-pill-gold" onclick="navConvo(1)" ${convoSceneIdx >= total - 1 ? 'disabled' : ''}>next scene →</button>
      </div>
    </div>
  `;
}

function setConvoMode(m) { convoMode = m; convoRevealedLines = new Set(); convoUsedChips = new Set(); renderConvo(); }
function goConvoScene(i) { convoSceneIdx = i; convoRevealedLines = new Set(); convoUsedChips = new Set(); renderConvo(); }

function convoBubbleHTML(line, i, revealed) {
  const isHost = line.speaker === 'host';
  return `
    <div class="d2-msg ${isHost ? 'host' : 'guest'}">
      <div class="d2-msg-who">${isHost ? 'Wansa · host' : 'Solja · guest'}</div>
      <div class="d2-bubble" onclick="toggleConvoLine(${i})">
        ${revealed ? `
          <div class="d2-bubble-ar">${escAttr(line.ar)}</div>
          <div class="d2-bubble-ph">${escAttr(line.ph)}</div>
          <div class="d2-bubble-en">${escAttr(line.en)}</div>
          ${line.note ? `<div class="d2-bubble-note">${escAttr(line.note)}</div>` : ''}
          ${line.vocab && line.vocab.length ? `<div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px">${line.vocab.map(v => `<span class="d2-weave-chip">${escAttr(v)}</span>`).join('')}</div>` : ''}
        ` : `
          <div class="d2-bubble-ar blur">${escAttr(line.ar)}</div>
          <button class="d2-bubble-reveal" onclick="toggleConvoLine(${i});event.stopPropagation()">shadow it first, then reveal</button>
        `}
      </div>
    </div>`;
}

function renderFullScene(scene) {
  return scene.lines.map((line, i) => convoBubbleHTML(line, i, convoRevealedLines.has(i))).join('');
}

function renderRespondScene(scene) {
  let html = '';
  for (let i = 0; i < scene.lines.length; i++) {
    const line = scene.lines[i];
    if (line.speaker === 'host') {
      html += convoBubbleHTML(line, i, true);
      if (i + 1 < scene.lines.length && scene.lines[i + 1].speaker === 'guest') {
        const guestLine = scene.lines[i + 1];
        const guestRevealed = convoRevealedLines.has(i + 1);
        html += `
          <div class="d2-yourturn">
            <div class="d2-yourturn-label">Your turn — you're Solja</div>
            <div class="d2-yourturn-body">Say the response out loud in Sudanese Arabic. Try weaving in:</div>
            <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px;justify-content:flex-end">
              ${guestLine.vocab.map(v => `<span class="d2-weave-chip">${escAttr(v)}</span>`).join('')}
            </div>
            ${guestRevealed ? `
              <div class="d2-gold-box" style="margin-top:12px;text-align:right">
                <div class="d2-bubble-ar">${escAttr(guestLine.ar)}</div>
                <div class="d2-bubble-ph">${escAttr(guestLine.ph)}</div>
                <div class="d2-bubble-en">${escAttr(guestLine.en)}</div>
                ${guestLine.note ? `<div class="d2-bubble-note">${escAttr(guestLine.note)}</div>` : ''}
              </div>` : `
              <div style="text-align:right;margin-top:10px">
                <button class="d2-bubble-reveal" onclick="revealConvoLine(${i + 1})">reveal Solja's response</button>
              </div>`}
          </div>`;
        i++;
      }
    } else {
      html += convoBubbleHTML(line, i, convoRevealedLines.has(i));
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
  CONVO_SCENES[convoSceneIdx].lines.forEach((_, i) => convoRevealedLines.add(i));
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
