// Global state variables
let mode='flash', src='v1', deck=[], idx=0, flipped=false;
let flashDir='ar'; // 'ar' = Arabic first (recognition), 'en' = English first (production)
let knowSet=new Set(), learnSet=new Set();
let mcAns=false, mcOpts=[], revShown=false, refFilt='All', streak=[];
let usedVocabChips=new Set();

// ── Extra cards — deep cuts from both transcripts + expanded glossary ──
function shuf(a){let b=[...a];for(let i=b.length-1;i>0;i--){let j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];}return b;}

function getSrc(){
  if(src==='v1') return shuf([...V1,...EXTRA.filter(x=>x.src==='v1')]);
  if(src==='v2') return shuf([...V2,...EXTRA.filter(x=>x.src==='v2')]);
  if(src==='p2') return shuf([...P2,...EXTRA.filter(x=>x.src==='p2')]);
  if(src==='extra') return shuf(EXTRA);
  return shuf([...V1,...V2,...EXTRA]);
}

function getVocabChips(count=6){
  const pool=getSrc();
  const shuffled=shuf(pool).slice(0,count);
  return shuffled;
}

function updStats(){
  const tot=deck.length;
  document.getElementById('s-k').textContent=knowSet.size;
  document.getElementById('s-l').textContent=learnSet.size;
  document.getElementById('s-t').textContent=tot;
  const p=tot?Math.round(((knowSet.size+learnSet.size)/tot)*100):0;
  document.getElementById('s-p').textContent=p+'%';
  document.getElementById('prog').style.width=p+'%';
  document.getElementById('top-counter').textContent=`${idx+1} / ${tot}`;
}

function tagH(it){
  const srcCls=it.src==='v1'?'tag-v1':it.src==='v2'?'tag-v2':'tag-p2';
  const srcLbl=it.src==='v1'?'Video 1':it.src==='v2'?'Video 2':'Glossary';
  return `<div class="tags"><span class="tag ${srcCls}">${srcLbl}</span><span class="tag tag-cat">${it.cat}</span><span class="tag tag-type">${it.type}</span></div>`;
}

function vocabPanelHTML(chips){
  usedVocabChips=new Set();
  return `<div class="vocab-panel">
    <div class="vocab-panel-title">
      <span>Vocab toolkit — click to mark used</span>
      <button class="vocab-refresh" onclick="refreshVocabPanel()">Shuffle</button>
    </div>
    <div class="vocab-chips" id="vocab-chips">
      ${chips.map((c,i)=>`<div class="vocab-chip" id="vc-${i}" onclick="toggleChip(${i})">
        <span class="chip-ar">${c.a}</span>
        <span class="chip-en">${c.e.split('/')[0].trim()}</span>
      </div>`).join('')}
    </div>
  </div>`;
}

let currentVocabChips=[];

function refreshVocabPanel(){
  currentVocabChips=getVocabChips(6);
  const el=document.getElementById('vocab-chips');
  if(el){
    el.innerHTML=currentVocabChips.map((c,i)=>`<div class="vocab-chip" id="vc-${i}" onclick="toggleChip(${i})">
      <span class="chip-ar">${c.a}</span>
      <span class="chip-en">${c.e.split('/')[0].trim()}</span>
    </div>`).join('');
  }
}

function toggleChip(i){
  const el=document.getElementById('vc-'+i);
  if(!el)return;
  if(usedVocabChips.has(i)){usedVocabChips.delete(i);el.classList.remove('used');}
  else{usedVocabChips.add(i);el.classList.add('used');}
}

function streakHTML(){
  if(!streak.length||mode==='ref') return '';
  return `<div class="streak-row">${streak.slice(-20).map(s=>`<div class="dot ${s?'ok':'no'}"></div>`).join('')}</div>`;
}

function tipHTML(){
  if(mode==='ref') return '';
  return `<div class="tip-bar"><span class="tip-label">Tip</span><span>${tips[tipIdx%tips.length]}</span></div>`;
}
