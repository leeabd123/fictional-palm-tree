// First-time intro screens per mode
let introShown = {flash:false,deep:false,shadow:false,mc:false,build:false,flow:false,speak:false,ref:true,trans:true,vocab:true,deepquiz:false,convo:false,starred:true};

function renderIntro(m){
  _currentIntroMode=m;
  const intro=MODE_INTROS[m];
  if(!intro){introShown[m]=true;render();return;}
  const ca=document.getElementById('content-area');
  ca.innerHTML=`
    <div style="max-width:540px;margin:32px auto">
      <div style="text-align:center;margin-bottom:28px">
        <div style="font-size:48px;margin-bottom:12px">${intro.icon}</div>
        <div style="font-family:var(--serif);font-size:24px;color:var(--accent);font-style:italic;margin-bottom:10px">${intro.title}</div>
        <div style="font-size:14px;color:var(--text2);line-height:1.75">${intro.body}</div>
      </div>
      <div style="background:var(--surface);border:1px solid var(--border);border-left:3px solid var(--accent);border-radius:0 var(--radius) var(--radius) 0;padding:14px 18px;margin-bottom:24px">
        <div style="font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--accent);margin-bottom:5px">Research tip</div>
        <div style="font-size:13px;color:var(--text2);line-height:1.65">${intro.tip}</div>
      </div>
      <div style="display:flex;gap:10px;justify-content:center">
        <button class="btn btn-accent" style="padding:12px 32px;font-size:14px" onclick="dismissIntro()">Start \u2192</button>
      </div>
      <div style="text-align:center;margin-top:12px">
        <button style="background:transparent;border:none;color:var(--text3);font-size:12px;cursor:pointer;font-family:var(--sans)" onclick="skipAllIntros()">Skip all intros</button>
      </div>
    </div>
  `;
}
let _currentIntroMode='';
function dismissIntro(){introShown[_currentIntroMode]=true;render();}
function skipAllIntros(){Object.keys(introShown).forEach(k=>introShown[k]=true);render();}
// ══════════════════════════════════════
// SYNONYMS DATA (key words with alternatives)
// ══════════════════════════════════════
