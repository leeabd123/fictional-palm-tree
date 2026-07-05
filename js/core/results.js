// Result screens, restart logic
function renderResult(){
  const t=knowSet.size+learnSet.size;
  const p=t?Math.round((knowSet.size/t)*100):0;
  document.getElementById('content-area').innerHTML=`
    <div class="result-area">
      <div class="result-pct">${p}%</div>
      <div class="result-sub">Got ${knowSet.size} right out of ${t} attempted · ${deck.length-t} not yet tried</div>
      <div class="result-bar"><div class="result-bar-fill" style="width:${p}%"></div></div>
      <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
        <button class="btn" onclick="restart(false)">Restart full deck</button>
        <button class="btn btn-almost" onclick="restart(true)">Review missed only</button>
        <button class="btn btn-got" onclick="setSrc('${src}')">New shuffle</button>
      </div>
    </div>
  `;
}

// ── Actions ──
function showRev(){revShown=true;render();}

function mark(know){
  streak.push(know);
  recordActivity();
  const it=deck[idx];
  if(know)knowSet.add(it.a);else learnSet.add(it.a);
  idx++;flipped=false;revShown=false;mcAns=false;usedVocabChips=new Set();shadowArHidden=true;buildArHidden=true;
  updStats();
  if(idx>0&&idx%8===0)tipIdx++;
  render();
}

function showRev(){revShown=true;render();}

function restart(missedOnly){
  let pool=getSrc();
  if(missedOnly){pool=pool.filter(x=>learnSet.has(x.a));if(!pool.length)pool=getSrc();}
  deck=pool;idx=0;flipped=false;revShown=false;mcAns=false;
  knowSet.clear();learnSet.clear();streak=[];usedVocabChips=new Set();
  updStats();render();
}

// ══════════════════════════════════════
// FLOW SETS — multi-sentence translation
// ══════════════════════════════════════
