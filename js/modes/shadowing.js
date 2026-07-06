// Shadowing — say it out loud first, then reveal. Designed screen:
// English prompt, blurred Arabic behind a dashed reveal, gold answer box,
// Try again / Nailed it pills.
let shadowArHidden = true; // legacy flag still reset by setMode()

function renderShadow(){
  const ca=document.getElementById('content-area');
  if(idx>=deck.length){renderResult();return;}
  const it=deck[idx];
  ca.innerHTML=`
    <div class="coach-wrap">
      <button class="d2-back" onclick="setMode('home')">← all modes</button>
      <div class="d2-title" style="margin-bottom:16px">Shadowing <span class="sub">· ${idx+1} of ${deck.length}</span></div>
      <div class="d2-card">
        <div class="d2-label">Say it out loud first</div>
        <div class="d2-prompt">${escAttr(it.e)}</div>
        <div style="font-size:12px;color:var(--text3);margin-top:6px">Try the whole sentence before revealing — struggle first, that's the exercise.</div>
        ${!revShown?`
          <button class="d2-reveal-dashed" onclick="showRev()">
            <span class="blur-ar">${escAttr(it.a)}</span>
            tap to reveal الجواب
          </button>
        `:`
          <div class="d2-gold-box">
            <div class="d2-inset-ar" style="font-size:21px">${escAttr(it.a)}</div>
            <div class="d2-inset-ph" style="font-size:12px">${escAttr(it.p)}</div>
            <div class="d2-inset" style="margin-top:12px">
              <div class="d2-inset-ar">${escAttr(it.ex)}</div>
              <div class="d2-inset-ph">${getExPh(it)}</div>
              <div class="d2-inset-en">${escAttr(it.exen)}</div>
            </div>
          </div>
          <div class="d2-pill-row">
            <button class="d2-pill-red" onclick="mark(false)">Try again</button>
            <button class="d2-pill-green" onclick="mark(true)">Nailed it ✓</button>
          </div>
        `}
      </div>
    </div>
  `;
}
