// 4-choice quiz mode
function renderMC(){
  const ca=document.getElementById('content-area');
  if(idx>=deck.length){renderResult();return;}
  const it=deck[idx];
  if(!mcAns){
    let pool=deck.filter(x=>x.e!==it.e);
    mcOpts=shuf([it,...shuf(pool).slice(0,3)]);
  }
  ca.innerHTML=`
    ${tipHTML()}
    ${streakHTML()}
    <div class="mode-card">
      <div class="mode-card-body">
        ${tagH(it)}
        <div style="font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--text3);margin-bottom:12px">${idx+1} / ${deck.length} · What does this mean?</div>
        <div class="ar-text">${it.a}</div>
        <div class="phonetic">${it.p}</div>
        <div class="mc-grid">
          ${mcOpts.map((o,i)=>`<button class="mc-opt" id="mc${i}" onclick="chkMC(${i},${o.e===it.e})">${o.e}</button>`).join('')}
        </div>
        ${mcAns?`<div class="ctx-block" style="margin-top:16px">${it.ctx}</div>`:''}
      </div>
      ${mcAns?`<div class="mode-card-footer"><button class="btn btn-accent" onclick="nxtMC()">Next →</button></div>`:''}
    </div>
  `;
}

// ── Sentence Builder ──
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

