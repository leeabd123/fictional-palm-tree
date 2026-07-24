// Deep cards + synonyms — re-skinned to the practice-modes handoff:
// mode-intro header, one big glass card with the 58px headword, the
// translit/gloss/tag row, description, "Near-words & synonyms" chips,
// and "In the wild" example panels. Same deck, nav, star and speak logic.
let deepIdx=0, deepDeck=[];

function renderDeepCards(){
  const ca=document.getElementById('content-area');
  if(deepDeck.length===0) deepDeck=getSrc();
  if(deepIdx>=deepDeck.length){
    ca.innerHTML=`
      <div class="coach-wrap" style="text-align:center">
        <div class="d2-title" style="margin:24px 0 8px">Done!</div>
        <div class="d2-note">You reviewed all ${deepDeck.length} deep cards</div>
        <button class="d2-pill-gold" onclick="deepIdx=0;deepDeck=getSrc();renderDeepCards()">Start over</button>
      </div>`;
    return;
  }
  const it=deepDeck[deepIdx];
  const syns=SYNONYMS[it.a]||[];
  ca.innerHTML=`
    <div class="coach-wrap mode-anim">
      <button class="d2-back" onclick="setMode('home')">← all modes</button>
      <div class="mode-intro">
        <div class="mode-badge"><svg viewBox="0 0 20 20" fill="currentColor"><path d="M9 2a1 1 0 012 0v1.07A7.002 7.002 0 0117 10a1 1 0 11-2 0 5 5 0 10-5 5 1 1 0 110 2 7 7 0 01-1-13.93V2z"/></svg></div>
        <div style="flex:1">
          <div class="mode-kicker">Build vocab · deep · ${deepIdx+1} of ${deepDeck.length}</div>
          <div class="mode-lede">One word, fully unpacked — its near-synonyms, register, and how it actually lands in a sentence. Say the example out loud.</div>
        </div>
        <span style="display:inline-flex;gap:6px;align-items:center">
          <button class="d2-icon-btn" onclick="sayAr('${encodeURIComponent(it.a)}')" title="hear it">${UI_SPK}</button>
          ${starBtnHTML(it.a)}
        </span>
      </div>

      <div class="ts-card" style="padding:36px 40px">
        <div style="font-family:'Instrument Serif','Noto Naskh Arabic',serif;font-size:clamp(40px,9vw,58px);direction:rtl;text-align:right;color:var(--text-primary);line-height:1.3">${escAttr(it.a)}</div>
        <div style="display:flex;align-items:baseline;gap:14px;margin-top:4px;flex-wrap:wrap">
          <span style="font-size:16px;color:var(--purple);font-style:italic">${escAttr(it.p)}</span>
          <span style="font-size:16px;color:var(--text-primary)">${escAttr(it.e)}</span>
          <span style="font-size:11px;color:var(--text-muted);border:1px solid var(--surface-border);border-radius:20px;padding:2px 9px">${escAttr(it.cat)} · ${escAttr(it.type)}</span>
        </div>
        <div style="font-size:14px;color:var(--text-secondary);line-height:1.8;margin-top:18px">${escAttr(it.ctx)}</div>

        ${syns.length?`
        <div style="height:1px;background:var(--surface-border);margin:26px 0"></div>
        <div class="ts-label" style="margin:0 0 12px">Near-words &amp; synonyms — same slot, different flavor</div>
        <div style="display:flex;gap:10px;flex-wrap:wrap">
          ${syns.map((s,i)=>`<span class="m-chip ${i===0?'gold':''}" style="font-family:'Instrument Serif','Noto Naskh Arabic',serif;font-size:18px;direction:rtl" onclick="sayAr('${encodeURIComponent(s.a)}')" title="${escAttr(s.en)}">${escAttr(s.a)} · ${escAttr(s.ph)}</span>`).join('')}
        </div>`:''}

        <div class="ts-label" style="margin:26px 0 12px">In the wild — say it out loud</div>
        <div style="display:flex;flex-direction:column;gap:10px">
          <div style="padding:14px 18px;border-radius:12px;background:var(--surface-hover);border:1px solid var(--surface-border)">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:10px">
              <span style="flex:1;font-family:'Instrument Serif','Noto Naskh Arabic',serif;font-size:24px;direction:rtl;text-align:right;color:var(--text-primary);line-height:1.6">${escAttr(it.ex)}</span>
              ${typeof speakerSVG==='function'?speakerSVG('var(--gold)',encodeURIComponent(it.ex)):''}
            </div>
            <div style="font-size:12px;color:var(--purple);font-style:italic;margin-top:4px">${getExPh(it)}</div>
            <div style="font-size:13px;color:var(--text-secondary);margin-top:4px">${escAttr(it.exen)}</div>
          </div>
        </div>
      </div>

      <div class="f2-navround" style="margin-top:18px">
        <button onclick="deepNav(-1)" ${deepIdx===0?'disabled':''}>‹</button>
        <button onclick="deepNav(1)">›</button>
      </div>
    </div>
  `;
}

function deepNav(dir){
  const newIdx=deepIdx+dir;
  if(newIdx<0||newIdx>=deepDeck.length)return;
  deepIdx=newIdx;
  renderDeepCards();
}
