// Shadowing — re-skinned to the practice-modes handoff: glass card with an
// audio row (gold play + animated waveform + meta), a transcript strip where
// the CURRENT line sits highlighted between its dimmed neighbours, speed
// chips that really change playback rate, and a record mic. The exercise is
// unchanged: echo the line out loud FIRST, then reveal and self-mark.
let shadowArHidden = true; // legacy flag still reset by setMode()
let shadowRate = 0.88;

function shadowSetRate(r){ shadowRate = r; window._sayArRate = r; renderShadow(); }
function shadowPlay(ar){ window._sayArRate = shadowRate; sayAr(encodeURIComponent(ar)); }

function renderShadow(){
  const ca=document.getElementById('content-area');
  if(idx>=deck.length){renderResult();return;}
  const it=deck[idx];
  const prev = idx > 0 ? deck[idx-1] : null;
  const next = idx < deck.length-1 ? deck[idx+1] : null;
  const srcName = (typeof SRC_LABELS !== 'undefined' && SRC_LABELS[src]) ? SRC_LABELS[src][0] : 'deck';
  const WAVE = [60,95,40,80,55,100,35,70,90,45,75,50,85,38].map((h,i)=>
    `<div class="wave-bar" style="height:${h}%;animation-delay:${(i%8)*0.05}s"></div>`).join('');
  ca.innerHTML=`
    <div class="coach-wrap mode-anim">
      <button class="d2-back" onclick="setMode('home')">← all modes</button>
      <div class="mode-intro">
        <div class="mode-badge"><svg viewBox="0 0 20 20" fill="currentColor"><path d="M10 3.5a1.5 1.5 0 013 0V15a1.5 1.5 0 01-3 0V3.5zM6 6a1.5 1.5 0 013 0v6a1.5 1.5 0 01-3 0V6zM2 9a1.5 1.5 0 013 0v2a1.5 1.5 0 01-3 0V9zM14 6a1.5 1.5 0 013 0v6a1.5 1.5 0 01-3 0V6z"/></svg></div>
        <div>
          <div class="mode-kicker">Speak it · shadowing · ${idx+1} of ${deck.length}</div>
          <div class="mode-lede">Play a line, then echo it back in the same rhythm — out loud, before you reveal. Match the melody before the meaning.</div>
        </div>
      </div>

      <div class="ts-card" style="padding:30px 36px">
        <div style="display:flex;align-items:center;gap:20px">
          <button class="mic-btn2" style="width:66px;height:66px;background:var(--gold);color:var(--bg)" onclick="shadowPlay('${escAttr(it.a).replace(/'/g,"\\'")}')" title="play the line">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
          </button>
          <div style="flex:1;min-width:0">
            <div class="wave">${WAVE}</div>
            <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text-muted);margin-top:8px">
              <span>${escAttr(srcName)} · ${escAttr(it.cat)}</span><span>${shadowRate}× speed · browser voice</span>
            </div>
          </div>
        </div>

        <div style="height:1px;background:var(--surface-border);margin:24px 0"></div>

        <div style="display:flex;flex-direction:column;gap:12px">
          ${prev?`<div style="opacity:.4"><div style="font-family:'Instrument Serif','Noto Naskh Arabic',serif;font-size:24px;direction:rtl;text-align:right;color:var(--text-primary)">${escAttr(prev.a)}</div></div>`:''}
          ${!revShown?`
            <button class="d2-reveal-dashed" onclick="showRev()" style="text-align:right">
              <span class="blur-ar">${escAttr(it.a)}</span>
              say it out loud first — tap to reveal الجواب
            </button>
            <div style="font-size:16px;color:var(--text-secondary);text-align:center">“${escAttr(it.e)}”</div>
          `:`
            <div style="padding:14px 18px;border-radius:12px;background:var(--gold-ghost-bg);border:1px solid var(--gold-border)">
              <div style="font-family:'Instrument Serif','Noto Naskh Arabic',serif;font-size:38px;direction:rtl;text-align:right;color:var(--text-primary);line-height:1.6">${escAttr(it.a)}</div>
              <div style="font-size:15px;color:var(--text-secondary);margin-top:6px">${escAttr(it.e)} — <span style="color:var(--purple);font-style:italic">${escAttr(it.p)}</span></div>
            </div>
            <div style="padding:12px 16px;border-radius:12px;background:var(--surface-hover);border:1px solid var(--surface-border)">
              <div style="font-family:'Instrument Serif','Noto Naskh Arabic',serif;font-size:25px;direction:rtl;text-align:right;color:var(--text-primary);line-height:1.7">${escAttr(it.ex)}</div>
              <div style="font-size:13.5px;color:var(--purple);font-style:italic;margin-top:4px">${getExPh(it)}</div>
              <div style="font-size:14px;color:var(--text-secondary);margin-top:3px">${escAttr(it.exen)}</div>
            </div>
          `}
          ${next?`<div style="opacity:.4"><div style="font-family:'Instrument Serif','Noto Naskh Arabic',serif;font-size:24px;direction:rtl;text-align:right;color:var(--text-primary)">${escAttr(next.a)}</div></div>`:''}
        </div>

        <div style="display:flex;gap:8px;justify-content:center;align-items:center;margin-top:24px;flex-wrap:wrap">
          ${[0.5,0.75,1].map(r=>`<button class="m-chip ${Math.abs(shadowRate-r)<0.01?'gold':''}" onclick="shadowSetRate(${r})">${r}×</button>`).join('')}
          ${coachMicSupported()?`<button class="mic-btn2" id="shadow-mic" style="width:52px;height:52px;margin-left:8px" onclick="prodMic('shadow-mic',function(){})" title="record yourself echoing"><svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 14a3 3 0 003-3V5a3 3 0 00-6 0v6a3 3 0 003 3z"/><path d="M19 11a7 7 0 01-14 0H3a9 9 0 008 8.94V23h2v-3.06A9 9 0 0021 11h-2z"/></svg></button>`:''}
        </div>

        ${revShown?`
        <div class="d2-pill-row" style="margin-top:20px">
          <button class="d2-pill-red" onclick="mark(false)">Try again</button>
          <button class="d2-pill-green" onclick="mark(true)">Nailed it ✓</button>
        </div>`:''}
      </div>
    </div>
  `;
}
