// Flow translation — designed screen: numbered accordion rows; say the whole
// paragraph out loud, then check line by line.
let flowSetIdx=0, flowOpen={};
// Speak state (legacy globals kept for setMode resets)
let speakQIdx=0, speakRevealed=false, speakUsedChips=new Set();

function renderFlow(){
  const ca=document.getElementById('content-area');
  const set=FLOW_SETS[flowSetIdx];
  const allSets=FLOW_SETS.length;

  ca.innerHTML=`
    <div class="coach-wrap">
      <button class="d2-back" onclick="setMode('home')">← all modes</button>
      <div class="d2-title">Flow translation</div>
      <div class="d2-note">${escAttr(set.topic)} — ${escAttr(set.title)} · say the whole paragraph, then check line by line</div>
      <div class="d2-tab-row" style="justify-content:space-between;align-items:center">
        <span style="display:inline-flex;gap:6px">
          <button class="d2-tab" onclick="navFlow(-1)" ${flowSetIdx===0?'disabled':''}>← prev set</button>
          <button class="d2-tab" onclick="navFlow(1)" ${flowSetIdx>=allSets-1?'disabled':''}>next set →</button>
        </span>
        <span style="display:inline-flex;gap:6px">
          <button class="d2-tab" onclick="revealAllFlow()">Reveal all</button>
          <button class="d2-tab" onclick="hideAllFlow()">Hide all</button>
        </span>
      </div>
      <div id="flow-sentences">
        ${set.sentences.map((s,i)=>{
          const open=!!flowOpen[flowSetIdx+'-'+i];
          return `
          <div class="d2-acc">
            <button class="d2-acc-head" onclick="toggleFlowSentence(${i})">
              <span class="d2-acc-num">${i+1}</span>
              <span class="d2-acc-en">${escAttr(s.en)}</span>
              <span class="d2-acc-chev ${open?'open':''}" id="ficon-${i}">▾</span>
            </button>
            <div class="d2-acc-body" id="far-${i}" style="${open?'':'display:none'}">
              <div class="d2-acc-ar">${escAttr(s.ar)}</div>
              <div class="d2-acc-ph">${escAttr(s.ph)}</div>
              <div class="d2-acc-note">${escAttr(s.note)}</div>
              <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px">
                ${s.vocab.map(v=>`<span class="d2-weave-chip">${escAttr(v)}</span>`).join('')}
              </div>
            </div>
          </div>`;
        }).join('')}
      </div>
      <div class="d2-pill-row" style="margin-top:20px">
        <button class="d2-pill-gold" onclick="navFlow(1)" ${flowSetIdx>=allSets-1?'disabled':''}>Next set →</button>
      </div>
    </div>
  `;
}

function toggleFlowSentence(i){
  const key=flowSetIdx+'-'+i;
  flowOpen[key]=!flowOpen[key];
  const el=document.getElementById('far-'+i);
  const icon=document.getElementById('ficon-'+i);
  if(el) el.style.display=flowOpen[key]?'':'none';
  if(icon) icon.classList.toggle('open',!!flowOpen[key]);
}

function revealAllFlow(){
  FLOW_SETS[flowSetIdx].sentences.forEach((_,i)=>{
    flowOpen[flowSetIdx+'-'+i]=true;
    const el=document.getElementById('far-'+i);
    if(el) el.style.display='';
    document.getElementById('ficon-'+i)?.classList.add('open');
  });
}

function hideAllFlow(){
  FLOW_SETS[flowSetIdx].sentences.forEach((_,i)=>{
    flowOpen[flowSetIdx+'-'+i]=false;
    const el=document.getElementById('far-'+i);
    if(el) el.style.display='none';
    document.getElementById('ficon-'+i)?.classList.remove('open');
  });
}

function navFlow(dir){
  const newIdx=flowSetIdx+dir;
  if(newIdx<0||newIdx>=FLOW_SETS.length)return;
  flowSetIdx=newIdx;
  renderFlow();
}
