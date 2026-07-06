// Sentence builder — designed screen: situation, the phrase to build with
// (gold keyword box), and one natural model behind a reveal pill.
let buildArHidden = true; // legacy flag still reset by setMode()

function renderBuild(){
  const ca=document.getElementById('content-area');
  if(idx>=deck.length){renderResult();return;}
  const it=deck[idx];
  ca.innerHTML=`
    <div class="coach-wrap">
      <button class="d2-back" onclick="setMode('home')">← all modes</button>
      <div class="d2-title" style="margin-bottom:16px">Sentence builder <span class="sub">· ${idx+1} of ${deck.length}</span></div>
      <div class="d2-card">
        <div class="d2-label">Build your own sentence</div>
        <div class="d2-prompt">${escAttr(it.ctx)} Answer using:</div>
        <div class="d2-kw-box">
          <span class="ar">${escAttr(it.a)}</span>
          <span class="ph">${escAttr(it.p)} · ${escAttr(it.e)}</span>
        </div>
        ${!revShown?`
          <div><button class="d2-reveal-pill" onclick="showRev()">show one natural way →</button></div>
        `:`
          <div class="d2-gold-box">
            <div class="d2-inset-ar" style="font-size:20px">${escAttr(it.ex)}</div>
            <div class="d2-inset-ph" style="font-size:12px">${getExPh(it)}</div>
            <div class="d2-inset-en" style="font-size:12px">${escAttr(it.exen)}</div>
          </div>
          <div style="font-size:12px;color:var(--text3);margin-top:10px">Now make your own <em>different</em> sentence with the same phrase — out loud.</div>
          <div class="d2-pill-row">
            <button class="d2-pill-red" onclick="mark(false)">Need more practice</button>
            <button class="d2-pill-green" onclick="mark(true)">Built one ✓</button>
          </div>
        `}
      </div>
    </div>
  `;
}
