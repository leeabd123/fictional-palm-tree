// Deep quiz (mixed/mc4/produce/context/arrange)
// Note: DQ_TYPES lives in js/data/misc.js (loaded earlier) — not redeclared here
let dqType='mixed', dqIdx=0, dqScore=0, dqTotal=0, dqAns=false, dqQuestions=[], dqAssembly=[];

function buildDQQuestions(){
  const all=[...V1,...V2,...P2,...EXTRA].filter(x=>x.a&&x.e&&x.ex);
  const shuffled=shuf(all);
  const types=['mc4','produce','context','arrange'];
  return shuffled.slice(0,20).map((item,i)=>{
    const type = dqType==='mixed' ? types[i%types.length] : dqType;
    return {item, type};
  });
}

function renderDeepQuiz(){
  const ca=document.getElementById('content-area');
  if(dqQuestions.length===0){
    ca.innerHTML=`
      <div class="coach-wrap">
        <button class="d2-back" onclick="setMode('home')">← all modes</button>
        <div class="d2-title" style="margin-bottom:14px">Deep quiz</div>
        <div class="d2-tab-row">
          ${DQ_TYPES.map(t=>`<button class="d2-tab ${dqType===t.id?'on':''}" onclick="setDQType('${t.id}')" title="${escAttr(t.desc)}">${escAttr(t.label)}</button>`).join('')}
        </div>
        <div class="d2-note">${escAttr((DQ_TYPES.find(t=>t.id===dqType)||{}).desc||'')} · Retrieval practice, interleaving, production-first — the fastest evidence-backed drills.</div>
        <div class="d2-pill-row" style="justify-content:flex-start">
          <button class="c2-compare" onclick="startDQ()">Start drill →</button>
        </div>
      </div>`;
    return;
  }
  if(dqIdx>=dqQuestions.length){
    renderDQResult(); return;
  }
  const {item,type}=dqQuestions[dqIdx];
  let html='';
  if(type==='mc4') html=renderDQMC4(item);
  else if(type==='produce') html=renderDQProduce(item);
  else if(type==='context') html=renderDQContext(item);
  else if(type==='arrange') html=renderDQArrange(item);
  ca.innerHTML=`
    <div class="coach-wrap">
      <button class="d2-back" onclick="setMode('home')">← all modes</button>
      <div class="d2-title" style="margin-bottom:14px">Deep quiz</div>
      <div class="d2-card dq-question-card" style="padding:24px">
        <div class="dq-q-body">${html}</div>
        <div class="dq-footer">
          <span class="dq-score">${dqIdx+1} / ${dqQuestions.length} · Score: ${dqScore}</span>
          <div class="dq-streak-dots">${dqQuestions.slice(0,dqIdx).map((_,i)=>`<div class="dot ${i<dqScore?'ok':'no'}"></div>`).join('')}</div>
        </div>
      </div>
    </div>`;
}

function renderDQMC4(item){
  const pool=shuf([...V1,...V2,...P2,...EXTRA].filter(x=>x.e!==item.e)).slice(0,3);
  const opts=shuf([item,...pool]);
  return `<div class="dq-q-type">4-choice recognition</div>
    <div class="dq-q-arabic">${item.a}</div>
    <div class="dq-q-hint">${item.p}</div>
    <div class="dq-opts">
      ${opts.map((o,i)=>`<button class="dq-opt dq-opt-en" id="dqo${i}" onclick="checkDQMC(${i},${o.e===item.e},'${encodeURIComponent(item.e)}','${encodeURIComponent(item.ctx)}')">${o.e}</button>`).join('')}
    </div>`;
}

function renderDQProduce(item){
  return `<div class="dq-q-type">English → Arabic production</div>
    <div class="dq-q-text">${item.e}</div>
    <div class="dq-q-hint">Say or write the Arabic phrase. Then check yourself.</div>
    <div class="reveal-area ${dqAns?'show':''}" id="dq-rev">
      <div class="dq-q-arabic" style="margin-top:12px">${item.a}</div>
      <div style="font-size:12px;color:var(--purple);font-style:italic;margin-bottom:8px">${item.p}</div>
      <div class="dq-feedback-exp">${item.ctx}</div>
      <div class="ex-block" style="margin-top:10px;font-size:13px">${item.ex}<div class="ex-en">${item.exen}</div></div>
    </div>
    <div style="display:flex;gap:10px;justify-content:center;margin-top:14px">
      ${!dqAns
        ?`<button class="btn btn-accent" onclick="revealDQProduce()">Check answer</button>`
        :`<button class="btn btn-learn" onclick="scoreDQ(false)">Got it wrong</button>
          <button class="btn btn-got" onclick="scoreDQ(true)">Got it right</button>`
      }
    </div>`;
}

function renderDQContext(item){
  const sentence=item.ex;
  const blank='______';
  const blankSentence=sentence.replace(item.a.split(' ').slice(0,2).join(' '),blank);
  const pool=shuf([...V1,...V2,...P2,...EXTRA].filter(x=>x.a!==item.a)).slice(0,3);
  const opts=shuf([item,...pool]);
  return `<div class="dq-q-type">Context cloze — fill the blank</div>
    <div class="dq-q-arabic">${blankSentence}</div>
    <div class="dq-q-hint">${item.exen}</div>
    <div class="dq-opts">
      ${opts.map((o,i)=>`<button class="dq-opt" id="dqo${i}" onclick="checkDQMC(${i},${o.a===item.a},'${encodeURIComponent(item.a)}','${encodeURIComponent(item.ctx)}')">${o.a.split(' ').slice(0,3).join(' ')}</button>`).join('')}
    </div>`;
}

function renderDQArrange(item){
  const words=item.a.split(' ');
  if(words.length<3) return renderDQMC4(item);
  const scrambled=shuf(words);
  dqAssembly=[];
  const chipsHTML=scrambled.map((w,i)=>`<div class="dq-word-chip" id="wc${i}" onclick="addWord('${encodeURIComponent(w)}',${i},'${encodeURIComponent(item.a)}')">${w}</div>`).join('');
  return `<div class="dq-q-type">Word order — arrange the sentence</div>
    <div class="dq-q-hint" style="margin-bottom:8px">${item.e}</div>
    <div class="dq-q-hint">${item.exen}</div>
    <div class="dq-arrange">${chipsHTML}</div>
    <div style="font-size:11px;color:var(--text3);margin:8px 0 4px">Your sentence (click words above, click below to remove):</div>
    <div class="dq-assembly" id="dq-assembly"><span class="dq-assembly-hint">tap words above</span></div>
    <div style="display:flex;gap:10px;justify-content:center;margin-top:12px">
      <button class="btn" onclick="clearAssembly()">Clear</button>
      <button class="btn btn-accent" onclick="checkArrange('${encodeURIComponent(item.a)}','${encodeURIComponent(item.ctx)}')">Check</button>
    </div>`;
}

function setDQType(t){dqType=t;dqQuestions=[];dqIdx=0;dqScore=0;dqAns=false;renderDeepQuiz();}
function startDQ(){dqQuestions=buildDQQuestions();dqIdx=0;dqScore=0;dqAns=false;dqAssembly=[];renderDeepQuiz();}

function checkDQMC(i,correct,ansEnc,ctxEnc){
  if(dqAns) return;
  dqAns=true;
  const ans=decodeURIComponent(ansEnc);
  const ctx=decodeURIComponent(ctxEnc);
  document.querySelectorAll('[id^="dqo"]').forEach((btn,j)=>{
    if(j===i) btn.classList.add(correct?'correct':'wrong');
    const btnText=btn.textContent.trim();
    if(btnText===ans||btn.textContent===ans) btn.classList.add('correct');
  });
  if(correct) dqScore++;
  const fb=document.createElement('div');
  fb.className='dq-feedback';
  fb.innerHTML=`<div class="${correct?'dq-feedback-correct':'dq-feedback-wrong'}">${correct?'Correct!':'Not quite.'}</div><div class="dq-feedback-exp">${ctx}</div>`;
  document.querySelector('.dq-q-body').appendChild(fb);
  const footer=document.querySelector('.dq-footer');
  if(footer){
    const nextBtn=document.createElement('button');
    nextBtn.className='btn btn-accent';nextBtn.textContent='Next →';
    nextBtn.onclick=()=>{dqIdx++;dqAns=false;dqAssembly=[];renderDeepQuiz();};
    footer.appendChild(nextBtn);
  }
}

function revealDQProduce(){dqAns=true;renderDeepQuiz();}
function scoreDQ(correct){if(correct)dqScore++;dqIdx++;dqAns=false;dqAssembly=[];renderDeepQuiz();}

function addWord(wordEnc,chipIdx,targetEnc){
  const w=decodeURIComponent(wordEnc);
  const chip=document.getElementById('wc'+chipIdx);
  if(chip&&chip.classList.contains('selected'))return;
  if(chip)chip.classList.add('selected');
  dqAssembly.push({w,chipIdx});
  const assembly=document.getElementById('dq-assembly');
  if(assembly){
    assembly.innerHTML='';
    dqAssembly.forEach((entry,i)=>{
      const el=document.createElement('div');
      el.className='dq-assembled-word';el.textContent=entry.w;
      el.onclick=()=>removeWord(i,entry.chipIdx);
      assembly.appendChild(el);
    });
  }
}

function removeWord(assemblyIdx,chipIdx){
  dqAssembly.splice(assemblyIdx,1);
  const chip=document.getElementById('wc'+chipIdx);
  if(chip)chip.classList.remove('selected');
  const assembly=document.getElementById('dq-assembly');
  if(assembly){
    assembly.innerHTML='';
    if(dqAssembly.length===0){assembly.innerHTML='<span class="dq-assembly-hint">tap words above</span>';return;}
    dqAssembly.forEach((entry,i)=>{
      const el=document.createElement('div');
      el.className='dq-assembled-word';el.textContent=entry.w;
      el.onclick=()=>removeWord(i,entry.chipIdx);
      assembly.appendChild(el);
    });
  }
}

function clearAssembly(){
  dqAssembly=[];
  document.querySelectorAll('.dq-word-chip').forEach(c=>c.classList.remove('selected'));
  const assembly=document.getElementById('dq-assembly');
  if(assembly)assembly.innerHTML='<span class="dq-assembly-hint">tap words above</span>';
}

function checkArrange(targetEnc,ctxEnc){
  const target=decodeURIComponent(targetEnc);
  const ctx=decodeURIComponent(ctxEnc);
  const attempt=dqAssembly.map(e=>e.w).join(' ');
  const correct=attempt.trim()===target.trim();
  if(correct)dqScore++;
  const ca=document.getElementById('content-area');
  const body=ca.querySelector('.dq-q-body');
  const fb=document.createElement('div');
  fb.className='dq-feedback';
  fb.innerHTML=`<div class="${correct?'dq-feedback-correct':'dq-feedback-wrong'}">${correct?'Perfect order!':'Not quite — the correct sentence:'}</div>
    ${!correct?`<div class="dq-q-arabic" style="font-size:17px;margin:6px 0">${target}</div>`:''}
    <div class="dq-feedback-exp">${ctx}</div>`;
  body.appendChild(fb);
  const footer=ca.querySelector('.dq-footer');
  if(footer){
    const nextBtn=document.createElement('button');
    nextBtn.className='btn btn-accent';nextBtn.textContent='Next →';
    nextBtn.onclick=()=>{dqIdx++;dqAns=false;dqAssembly=[];renderDeepQuiz();};
    footer.appendChild(nextBtn);
  }
}

function renderDQResult(){
  const pct=Math.round((dqScore/dqQuestions.length)*100);
  const msgs={90:'Native-level recall. You\'re internalizing this.',70:'Strong — a few gaps, hit those in the next round.',50:'Good foundation. Repeat the drill to cement it.',0:'Keep going. Retrieval practice works best over multiple sessions.'};
  const msgKey=Object.keys(msgs).reverse().find(k=>pct>=parseInt(k));
  document.getElementById('content-area').innerHTML=`
    <div class="dq-result">
      <div class="dq-result-pct">${pct}%</div>
      <div class="dq-result-label">${dqScore} / ${dqQuestions.length} correct</div>
      <div class="dq-result-msg">${msgs[msgKey]}</div>
      <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
        <button class="btn" onclick="dqQuestions=[];dqIdx=0;dqScore=0;dqAns=false;renderDeepQuiz()">Change type</button>
        <button class="btn btn-almost" onclick="startDQ()">New drill</button>
        <button class="btn btn-got" onclick="startDQ()">Drill again</button>
      </div>
    </div>`;
}

// ══════════════════════════════════════
// TRANSITIONS GUIDE RENDER
// ══════════════════════════════════════
