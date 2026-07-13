// Deep cards + synonyms — designed screen: one glass card per word with
// the example inset and teal "Swap in — synonyms" chips.
let deepIdx=0, deepDeck=[];

function renderDeepCards(){
  const ca=document.getElementById('content-area');
  if(deepDeck.length===0) deepDeck=getSrc();
  if(deepIdx>=deepDeck.length){
    ca.innerHTML=`
      <div class="coach-wrap" style="text-align:center">
        <div class="d2-title" style="margin:24px 0 8px">Done!</div>
        <div class="d2-note">You reviewed all ${deepDeck.length} deep cards</div>
        <button class="d2-pill-gold" onclick="deepIdx=0;deepDeck=getSrc();renderDeepCards()">Start over</button>
      </div>`;
    return;
  }
  const it=deepDeck[deepIdx];
  const syns=SYNONYMS[it.a]||[];
  ca.innerHTML=`
    <div class="coach-wrap">
      <button class="d2-back" onclick="setMode('home')">← all modes</button>
      <div class="d2-title" style="margin-bottom:16px">Deep cards + synonyms <span class="sub">· ${deepIdx+1} of ${deepDeck.length}</span></div>
      <div class="d2-card">
        <div style="display:flex;align-items:baseline;gap:12px;flex-wrap:wrap">
          <div class="f2-ar" style="font-size:34px;text-align:left">${escAttr(it.a)}</div>
          <div class="d2-star-ph" style="font-size:13px">${escAttr(it.p)}</div>
          <span class="f2-tag">${escAttr(it.cat)} · ${escAttr(it.type)}</span>
          <span style="margin-left:auto;display:inline-flex;gap:4px;align-items:center">
            <button class="d2-icon-btn" onclick="sayAr('${encodeURIComponent(it.a)}')" title="hear it">${UI_SPK}</button>
            ${starBtnHTML(it.a)}
          </span>
        </div>
        <div style="font-size:15px;color:var(--accent2);font-weight:600;margin-top:10px">${escAttr(it.e)}</div>
        <div class="d2-when-body" style="margin-top:6px">${escAttr(it.ctx)}</div>
        <div class="d2-inset">
          <div class="d2-inset-ar">${escAttr(it.ex)}</div>
          <div class="d2-inset-ph">${getExPh(it)}</div>
          <div class="d2-inset-en">${escAttr(it.exen)}</div>
        </div>
        ${syns.length?`
        <div class="d2-label" style="margin:18px 0 10px">Swap in — synonyms</div>
        <div style="display:flex;flex-wrap:wrap;gap:8px">
          ${syns.map(s=>`<span class="d2-syn-chip">
            <span class="d2-syn-ar">${escAttr(s.a)}</span>
            <span class="d2-syn-ph">${escAttr(s.ph)} · ${escAttr(s.en)}</span>
          </span>`).join('')}
        </div>`:''}
      </div>
      <div class="f2-navround">
        <button onclick="deepNav(-1)" ${deepIdx===0?'disabled':''}>‹</button>
        <button onclick="deepNav(1)">›</button>
      </div>
    </div>
  `;
}

function deepNav(dir){
  const newIdx=deepIdx+dir;
  if(newIdx<0||newIdx>=deepDeck.length)return;
  deepIdx=newIdx;
  renderDeepCards();
}
