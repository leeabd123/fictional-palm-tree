// Sentence builder mode — produce your own sentences from a phrase stem
let buildArHidden=true;

function renderBuild(){
  const ca=document.getElementById('content-area');
  if(idx>=deck.length){renderResult();return;}
  const it=deck[idx];
  currentVocabChips=getVocabChips(6);

  ca.innerHTML=`
    ${tipHTML()}
    ${streakHTML()}
    <div class="card-static">
      <div style="display:flex;justify-content:space-between;align-items:flex-start">${tagH(it)}${starBtnHTML(it.a)}</div>
      <div class="flash-dir-label">Build your own sentence with this phrase</div>
      <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin:10px 0 4px">
        <span class="build-kw">${it.a}</span>
        <span class="phonetic" style="margin:0">${it.p}</span>
      </div>
      <div class="meaning" style="margin-top:6px">${it.e}</div>
      <div class="ctx-block">${it.ctx}</div>
      <div class="shadow-note">✍️ Make a NEW sentence out loud (or in your head) using this phrase — about your own life, not the example. Then reveal the model to compare.</div>
      <div class="shadow-ar-wrap">
        <button class="shadow-ar-toggle" onclick="toggleBuildAr()">
          <span>${buildArHidden?'Reveal a model sentence':'Hide the model'}</span>
          <span id="build-toggle-icon">${buildArHidden?'▾':'▴'}</span>
        </button>
        <div class="shadow-ar-body ${buildArHidden?'':'show'}" id="build-ar-body">
          <div class="ex-block">${it.ex}<div class="ex-ph-line">${getExPh(it)}</div><div class="ex-en">${it.exen}</div></div>
          <div class="context-text" style="margin-top:8px">This is <em>one natural way</em> to use it — yours doesn't need to match. What matters is that you produced something.</div>
        </div>
      </div>
    </div>
    ${vocabPanelHTML(currentVocabChips)}
    <div class="flash-mark-row">
      <button class="btn btn-learn" onclick="mark(false)">Couldn't build one</button>
      <button class="btn btn-almost" onclick="mark(true)">Built something</button>
      <button class="btn btn-got" onclick="mark(true)">Built it easily</button>
    </div>
    <div class="flash-counter" style="text-align:center;margin-top:10px">${idx+1} / ${deck.length}</div>
  `;
}

function toggleBuildAr(){
  buildArHidden=!buildArHidden;
  const body=document.getElementById('build-ar-body');
  const icon=document.getElementById('build-toggle-icon');
  if(body) body.classList.toggle('show',!buildArHidden);
  if(icon) icon.textContent=buildArHidden?'▾':'▴';
  const lbl=document.querySelector('.shadow-ar-toggle span');
  if(lbl) lbl.textContent=buildArHidden?'Reveal a model sentence':'Hide the model';
}
