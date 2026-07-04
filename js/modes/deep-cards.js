// Deep cards with synonyms mode
let deepIdx=0, deepDeck=[], deepFlipped=false;

function renderDeepCards(){
  const ca=document.getElementById('content-area');
  if(deepDeck.length===0) deepDeck=getSrc();
  if(deepIdx>=deepDeck.length){
    ca.innerHTML=`<div class="result-area"><div class="result-pct" style="font-size:48px">Done!</div><div class="result-sub">You reviewed all ${deepDeck.length} deep cards</div><button class="btn btn-accent" style="margin-top:16px" onclick="deepIdx=0;deepDeck=getSrc();renderDeepCards()">Start over</button></div>`;
    return;
  }
  const it=deepDeck[deepIdx];
  const syns=SYNONYMS[it.a]||[];
  const srcCls=it.src==='v1'?'tag-v1':it.src==='v2'?'tag-v2':'tag-p2';
  const srcLbl=it.src==='v1'?'Video 1':it.src==='v2'?'Video 2':'Glossary';
  ca.innerHTML=`
    ${tipHTML()}
    <div class="card-static">
      <div class="card-body">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px">
          <div class="tags"><span class="tag ${srcCls}">${srcLbl}</span><span class="tag tag-cat">${it.cat}</span><span class="tag tag-type">${it.type}</span></div>
          ${starBtnHTML(it.a)}
        </div>
        <div class="deep-word-row">
          <div class="deep-ar-word">${it.a}</div>
        </div>
        <div class="deep-ph">${it.p}</div>
        <div class="deep-meaning">${it.e}</div>
        <div class="ctx-block">${it.ctx}</div>

        <div class="deep-section-label">Example sentence + transliteration</div>
        <div class="deep-ex-block">
          <div class="deep-ex-ar">${it.ex}</div>
          <div class="deep-ex-ph">${it.p.split(' ').length>3?it.p:'see phonetic above'}</div>
          <div class="ex-ph-line" style="margin-top:2px">${it.ex.split('').map(()=>'').join('')}${generateExPh(it)}</div>
          <div class="deep-ex-en">${it.exen}</div>
        </div>

        ${syns.length>0?`
        <div class="deep-section-label">Synonyms & alternatives — swap these in</div>
        <div class="deep-syn-grid">
          ${syns.map(s=>`<div class="deep-syn-chip">
            <div class="deep-syn-ar">${s.a}</div>
            <div class="deep-syn-ph">${s.ph}</div>
            <div class="deep-syn-en">${s.en}</div>
          </div>`).join('')}
        </div>`:''}

        ${syns.length>0?`
        <div class="deep-section-label" style="margin-top:14px">Synonym sentences</div>
        ${syns.slice(0,2).map(s=>`<div class="deep-usage-note">Try using <span style="color:var(--accent);font-family:var(--serif)">${s.a}</span> instead: ${buildSynSentence(it,s)}</div>`).join('')}`:''}
      </div>
      <div class="card-footer">
        <div class="nav-arrows" style="justify-content:space-between;width:100%">
          <button class="arrow-btn" onclick="deepNav(-1)" ${deepIdx===0?'disabled':''}>←</button>
          <span style="font-size:12px;color:var(--text3)">${deepIdx+1} / ${deepDeck.length}</span>
          <button class="arrow-btn" onclick="deepNav(1)">→</button>
        </div>
      </div>
    </div>
  `;
}

function generateExPh(it){
  // Show phonetic under example - use item phonetic as pronunciation guide
  return `<em style="color:var(--purple);font-size:11px;font-style:italic">${it.p}</em>`;
}

function buildSynSentence(it,syn){
  return `Try this: <span style="font-family:var(--serif);color:var(--accent2)">${syn.a}</span> (${syn.ph}) — ${syn.en}. Same meaning as <span style="font-family:var(--serif)">${it.a}</span> but with a different nuance.`;
}

function deepNav(dir){
  const newIdx=deepIdx+dir;
  if(newIdx<0||newIdx>=deepDeck.length)return;
  deepIdx=newIdx;
  renderDeepCards();
}

// ══════════════════════════════════════
// UPDATE FLASHCARD TO INCLUDE STARS + TRANSLITERATION
// ══════════════════════════════════════
