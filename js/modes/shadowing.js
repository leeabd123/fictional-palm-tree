// Shadowing mode — speak before you reveal
let shadowArHidden=true;

function renderShadow(){
  const ca=document.getElementById('content-area');
  if(idx>=deck.length){renderResult();return;}
  const it=deck[idx];
  currentVocabChips=getVocabChips(6);

  ca.innerHTML=`
    ${tipHTML()}
    ${streakHTML()}
    <div class="card-static">
      <div style="display:flex;justify-content:space-between;align-items:flex-start">${tagH(it)}${starBtnHTML(it.a)}</div>
      <div class="flash-dir-label">Say it in Sudanese Arabic</div>
      <div class="meaning" style="font-size:18px;line-height:1.7">${it.e}</div>
      <div class="ctx-block">${it.ctx}</div>
      <div class="context-text" style="margin-top:10px">Example situation: <strong>${it.exen}</strong></div>
      <div class="shadow-note">🎙️ Say the phrase — and the whole example sentence — OUT LOUD before revealing. Struggling first is the point.</div>
      <div class="shadow-ar-wrap">
        <button class="shadow-ar-toggle" onclick="toggleShadowAr()">
          <span>${shadowArHidden?'Reveal the Arabic':'Hide the Arabic'}</span>
          <span id="shadow-toggle-icon">${shadowArHidden?'▾':'▴'}</span>
        </button>
        <div class="shadow-ar-body ${shadowArHidden?'':'show'}" id="shadow-ar-body">
          <div class="ar-text" style="font-size:26px">${it.a}</div>
          <div class="phonetic">${it.p}</div>
          <div class="ex-block" style="margin-top:10px">${it.ex}<div class="ex-ph-line">${getExPh(it)}</div><div class="ex-en">${it.exen}</div></div>
        </div>
      </div>
    </div>
    ${vocabPanelHTML(currentVocabChips)}
    <div class="flash-mark-row">
      <button class="btn btn-learn" onclick="mark(false)">Struggled</button>
      <button class="btn btn-almost" onclick="mark(true)">Close enough</button>
      <button class="btn btn-got" onclick="mark(true)">Nailed it</button>
    </div>
    <div class="flash-counter" style="text-align:center;margin-top:10px">${idx+1} / ${deck.length}</div>
  `;
}

function toggleShadowAr(){
  shadowArHidden=!shadowArHidden;
  const body=document.getElementById('shadow-ar-body');
  const icon=document.getElementById('shadow-toggle-icon');
  if(body) body.classList.toggle('show',!shadowArHidden);
  if(icon) icon.textContent=shadowArHidden?'▾':'▴';
  const btn=document.querySelector('.shadow-ar-toggle span');
  if(btn) btn.textContent=shadowArHidden?'Reveal the Arabic':'Hide the Arabic';
}
