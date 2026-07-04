// Flow translation mode
let flowSetIdx=0, flowAllRevealed=false;
// ── Speak state ──
let speakQIdx=0, speakRevealed=false, speakUsedChips=new Set();

// ── Render: Flow Translation ──
function renderFlow(){
  const ca=document.getElementById('content-area');
  const set=FLOW_SETS[flowSetIdx];
  const allSets=FLOW_SETS.length;

  ca.innerHTML=`
    ${tipHTML()}
    <div class="flow-set-nav">
      <button class="arrow-btn" onclick="navFlow(-1)" ${flowSetIdx===0?'disabled':''}>←</button>
      <span class="flow-set-counter">Set ${flowSetIdx+1} of ${allSets}</span>
      <button class="arrow-btn" onclick="navFlow(1)" ${flowSetIdx>=allSets-1?'disabled':''}>→</button>
    </div>
    <div class="flow-set-meta">
      <div class="flow-set-topic">${set.topic}</div>
      <div class="flow-set-title">${set.title}</div>
    </div>
    <div style="display:flex;gap:10px;justify-content:flex-end;margin-bottom:16px">
      <button class="flow-reveal-all-btn" onclick="revealAllFlow()">Reveal all</button>
      <button class="flow-reveal-all-btn" onclick="hideAllFlow()">Hide all</button>
    </div>
    <div id="flow-sentences">
      ${set.sentences.map((s,i)=>`
        <div class="flow-sentence-block" id="fsb-${i}">
          <div class="flow-sentence-header" onclick="toggleFlowSentence(${i})">
            <span class="flow-sentence-num">${i+1}</span>
            <span class="flow-en-text">${s.en}</span>
            <span class="flow-reveal-icon" id="ficon-${i}">▾</span>
          </div>
          <div class="flow-arabic-reveal" id="far-${i}">
            <div class="flow-ar-text">${s.ar}</div>
            <div class="flow-ph-text">${s.ph}</div>
            <div class="flow-note">${s.note}</div>
            <div class="flow-vocab-required">
              ${s.vocab.map(v=>`<span class="flow-vocab-tag">${v}</span>`).join('')}
            </div>
          </div>
        </div>
      `).join('')}
    </div>
    <div style="display:flex;gap:10px;justify-content:center;margin-top:20px">
      <button class="btn btn-accent" onclick="navFlow(1)" ${flowSetIdx>=allSets-1?'disabled':''}>Next set →</button>
    </div>
  `;
}

function toggleFlowSentence(i){
  const el=document.getElementById('far-'+i);
  const icon=document.getElementById('ficon-'+i);
  const isOpen=el.classList.contains('show');
  el.classList.toggle('show',!isOpen);
  icon.classList.toggle('open',!isOpen);
}

function revealAllFlow(){
  FLOW_SETS[flowSetIdx].sentences.forEach((_,i)=>{
    document.getElementById('far-'+i)?.classList.add('show');
    document.getElementById('ficon-'+i)?.classList.add('open');
  });
}

function hideAllFlow(){
  FLOW_SETS[flowSetIdx].sentences.forEach((_,i)=>{
    document.getElementById('far-'+i)?.classList.remove('show');
    document.getElementById('ficon-'+i)?.classList.remove('open');
  });
}

function navFlow(dir){
  const newIdx=flowSetIdx+dir;
  if(newIdx<0||newIdx>=FLOW_SETS.length)return;
  flowSetIdx=newIdx;
  renderFlow();
}

// ── Render: Speak & Respond ──
