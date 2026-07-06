// Quiz — designed screen: centered Arabic card, glass option rows,
// go fast, trust your first instinct.
function renderMC(){
  const ca=document.getElementById('content-area');
  if(idx>=deck.length){renderResult();return;}
  const it=deck[idx];
  if(!mcAns){
    let pool=deck.filter(x=>x.e!==it.e);
    mcOpts=shuf([it,...shuf(pool).slice(0,3)]);
  }
  ca.innerHTML=`
    <div class="coach-wrap">
      <button class="d2-back" onclick="setMode('home')">← all modes</button>
      <div class="d2-title" style="margin-bottom:16px">Quiz <span class="sub">· go fast, trust your first instinct · ${idx+1} of ${deck.length}</span></div>
      ${streakHTML()}
      <div class="d2-card" style="text-align:center;padding:30px 24px;margin-bottom:14px">
        <div class="f2-ar" style="font-size:38px">${escAttr(it.a)}</div>
        <div class="d2-inset-ph" style="font-size:13px;margin-top:4px">${escAttr(it.p)}</div>
      </div>
      <div class="d2-opts-col">
        ${mcOpts.map((o,i)=>`<button class="d2-opt" id="mc${i}" onclick="chkMC(${i},${o.e===it.e})">${escAttr(o.e)}</button>`).join('')}
      </div>
      ${mcAns?`
        <div class="d2-inset" style="margin-top:16px">${escAttr(it.ctx)}</div>
        <div class="d2-pill-row"><button class="d2-pill-gold" onclick="nxtMC()">Next →</button></div>
      `:''}
    </div>
  `;
}

function chkMC(i,correct){
  if(mcAns)return;
  mcAns=true;
  const it=deck[idx];
  mcOpts.forEach((o,j)=>{
    const btn=document.getElementById('mc'+j);
    if(o.e===it.e)btn.classList.add('correct');
    else if(j===i&&!correct)btn.classList.add('wrong');
  });
  streak.push(correct);
  if(correct)knowSet.add(it.a);else learnSet.add(it.a);
  updStats();render();
}

function nxtMC(){idx++;mcAns=false;render();}
