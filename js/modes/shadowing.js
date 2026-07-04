// Shadowing mode — original implementation, restored from the author's prototype
let shadowArHidden = true; // Arabic + phonetic hidden by default until revealed

function renderShadow(){
  const ca=document.getElementById('content-area');
  if(idx>=deck.length){renderResult();return;}
  const it=deck[idx];
  currentVocabChips=getVocabChips(6);
  ca.innerHTML=`
    ${tipHTML()}
    ${streakHTML()}
    ${vocabPanelHTML(currentVocabChips)}
    <div class="mode-card">
      <div class="mode-card-body">
        ${tagH(it)}
        <div style="font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--text3);margin-bottom:10px">${idx+1} / ${deck.length} · Shadowing drill</div>
        <div class="step-label">Context</div>
        <div class="context-text"><strong>${it.ctx}</strong></div>
        <div class="step-label" style="margin-top:14px">Say the phrase in Sudanese Arabic, then check yourself:</div>

        <div class="shadow-ar-wrap">
          <button class="shadow-ar-toggle" onclick="toggleShadowAr()" id="shadow-ar-toggle-btn">
            <span id="shadow-toggle-label">${shadowArHidden?'Show Arabic + phonetic':'Hide Arabic + phonetic'}</span>
            <span id="shadow-toggle-icon" style="font-size:16px;line-height:1">${shadowArHidden?'▾':'▴'}</span>
          </button>
          <div class="shadow-ar-body ${shadowArHidden?'':'show'}" id="shadow-ar-body">
            <div class="ar-text" style="margin-top:4px">${it.a}</div>
            <div class="phonetic">${it.p}</div>
          </div>
        </div>

        <div class="reveal-area ${revShown?'show':''}" id="rev">
          <div class="meaning" style="margin-top:12px">${it.e}</div>
          <div class="ex-block">${it.ex}<div class="ex-ph-line">${getExPh(it)}</div><div class="ex-en">${it.exen}</div></div>
          <div class="shadow-note">Now say it again — with natural speed and emotion. Use the vocab chips above.</div>
        </div>
      </div>
      <div class="mode-card-footer">
        ${!revShown
          ?`<button class="btn btn-accent" onclick="showRev()">Reveal full answer</button>`
          :`<button class="btn btn-learn" onclick="mark(false)">Struggled</button>
            <button class="btn btn-got" onclick="mark(true)">Nailed it</button>`
        }
      </div>
    </div>
  `;
}

function toggleShadowAr(){
  shadowArHidden=!shadowArHidden;
  const body=document.getElementById('shadow-ar-body');
  const label=document.getElementById('shadow-toggle-label');
  const icon=document.getElementById('shadow-toggle-icon');
  if(body) body.classList.toggle('show',!shadowArHidden);
  if(label) label.textContent=shadowArHidden?'Show Arabic + phonetic':'Hide Arabic + phonetic';
  if(icon) icon.textContent=shadowArHidden?'▾':'▴';
}
