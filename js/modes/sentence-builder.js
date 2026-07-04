// Sentence builder mode — original implementation, restored from the author's prototype
let buildArHidden = true;

function renderBuild(){
  const ca=document.getElementById('content-area');
  if(idx>=deck.length){renderResult();return;}
  const it=deck[idx];
  currentVocabChips=getVocabChips(6);
  const stem=it.a.split(' ').slice(0,3).join(' ');
  ca.innerHTML=`
    ${tipHTML()}
    ${streakHTML()}
    ${vocabPanelHTML(currentVocabChips)}
    <div class="mode-card">
      <div class="mode-card-body">
        ${tagH(it)}
        <div style="font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--text3);margin-bottom:10px">${idx+1} / ${deck.length} · Sentence builder</div>
        <div class="step-label">Situation</div>
        <div class="context-text"><strong>${it.ctx}</strong></div>
        <div class="step-label" style="margin-top:14px">Build your own sentence using this phrase. Start with:</div>
        <div style="margin:.4rem 0"><span class="build-kw">${stem}...</span></div>
        <div style="font-size:12px;color:var(--text3);margin-top:8px">Use any vocab chips above to enrich your sentence. Click chips to mark them used.</div>
        <div class="reveal-area ${revShown?'show':''}" id="rev">
          <div class="step-label" style="margin-top:20px">Model sentence:</div>
          <div class="shadow-ar-wrap">
            <button class="shadow-ar-toggle" onclick="toggleBuildAr()" id="build-ar-toggle-btn">
              <span id="build-toggle-label">${buildArHidden?'Show Arabic model':'Hide Arabic model'}</span>
              <span id="build-toggle-icon" style="font-size:16px;line-height:1">${buildArHidden?'▾':'▴'}</span>
            </button>
            <div class="shadow-ar-body ${buildArHidden?'':'show'}" id="build-ar-body">
              <div class="ar-text" style="margin-top:4px">${it.ex}</div>
              <div class="ex-en" style="margin-top:6px">${it.exen}</div>
            </div>
          </div>
          <div class="shadow-note" style="margin-top:10px">Now make your own different sentence using the same phrase + some of those vocab chips.</div>
        </div>
      </div>
      <div class="mode-card-footer">
        ${!revShown
          ?`<button class="btn btn-accent" onclick="showRev()">Show model</button>`
          :`<button class="btn btn-learn" onclick="mark(false)">Need more practice</button>
            <button class="btn btn-got" onclick="mark(true)">Built one!</button>`
        }
      </div>
    </div>
  `;
}

function toggleBuildAr(){
  buildArHidden=!buildArHidden;
  const body=document.getElementById('build-ar-body');
  const label=document.getElementById('build-toggle-label');
  const icon=document.getElementById('build-toggle-icon');
  if(body) body.classList.toggle('show',!buildArHidden);
  if(label) label.textContent=buildArHidden?'Show Arabic model':'Hide Arabic model';
  if(icon) icon.textContent=buildArHidden?'▾':'▴';
}
