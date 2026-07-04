// Flashcard mode (Arabic<->English recognition/production)
function renderFlash(){
  const ca=document.getElementById('content-area');
  if(idx>=deck.length){renderResult();return;}
  const it=deck[idx];
  const isAR = flashDir==='ar';

  const frontContent = isAR
    ? `<div style="display:flex;justify-content:space-between;align-items:flex-start">${tagH(it)}${starBtnHTML(it.a)}</div><div class="ar-text">${it.a}</div><div class="phonetic">${it.p}</div><div class="hint">Click to reveal meaning</div>`
    : `<div style="display:flex;justify-content:space-between;align-items:flex-start">${tagH(it)}${starBtnHTML(it.a)}</div><div class="flash-dir-label">Translate to Arabic</div><div class="meaning" style="font-size:18px;line-height:1.7">${it.e}</div><div class="hint">Click to reveal Arabic</div>`;

  const backContent = isAR
    ? `<div style="display:flex;justify-content:space-between;align-items:flex-start">${tagH(it)}${starBtnHTML(it.a)}</div><div class="ar-text">${it.a}</div><div class="phonetic">${it.p}</div><div class="meaning">${it.e}</div><div class="ctx-block">${it.ctx}</div><div class="ex-block">${it.ex}<div class="ex-ph-line">${getExPh(it)}</div><div class="ex-en">${it.exen}</div></div>`
    : `<div style="display:flex;justify-content:space-between;align-items:flex-start">${tagH(it)}${starBtnHTML(it.a)}</div><div class="flash-dir-label">Arabic</div><div class="ar-text">${it.a}</div><div class="phonetic">${it.p}</div><div class="ctx-block">${it.ctx}</div><div class="ex-block">${it.ex}<div class="ex-ph-line">${getExPh(it)}</div><div class="ex-en">${it.exen}</div></div>`;

  ca.innerHTML=`
    ${tipHTML()}
    ${streakHTML()}
    <div class="flash-dir-row">
      <button class="flash-dir-btn ${flashDir==='ar'?'active':''}" onclick="setFlashDir('ar')">Arabic → English</button>
      <button class="flash-dir-btn ${flashDir==='en'?'active':''}" onclick="setFlashDir('en')">English → Arabic</button>
    </div>
    <div class="flash-card-wrap">
      <button class="flash-nav-side" onclick="navCard(-1)" ${idx===0?'disabled':''}>‹</button>
      <div class="flash-card-col">
        <div class="card-scene">
          <div style="position:relative;width:100%">
            <div class="card-ghost">${flipped?backContent:frontContent}</div>
            <div class="card-face card-front ${flipped?'card-face-hidden':''}" onclick="${flipped?'':'flip()'}">
              ${frontContent}
              ${!flipped?'<div class="card-tap-hint">tap to flip</div>':''}
            </div>
            <div class="card-face card-back ${flipped?'':'card-face-hidden'}" onclick="flip()">
              ${backContent}
            </div>
          </div>
        </div>
        <div class="flash-counter">${idx+1} / ${deck.length}</div>
      </div>
      <button class="flash-nav-side" onclick="navCard(1)" ${idx>=deck.length-1?'disabled':''}>›</button>
    </div>
    ${flipped?`<div class="flash-mark-row">
      <button class="btn btn-learn" onclick="mark(false)">Still learning</button>
      <button class="btn btn-almost" onclick="mark(true)">Almost got it</button>
      <button class="btn btn-got" onclick="mark(true)">Got it</button>
    </div>`:'<div style="height:8px"></div>'}
  `;
}

// ── Example-sentence phonetic lookup ──
function navCard(dir){
  const newIdx=idx+dir;
  if(newIdx<0||newIdx>=deck.length)return;
  idx=newIdx;
  flipped=false;
  updStats();renderFlash();
}

function flip(){
  flipped=!flipped;
  renderFlash();
}

// ── Shadowing ──

function setFlashDir(dir){
  flashDir=dir;
  flipped=false;
  renderFlash();
}

