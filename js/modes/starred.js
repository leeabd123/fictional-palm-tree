// Starred items — original implementation, restored from the author's prototype.
// One addition over the original: the set persists in localStorage so stars
// survive a page refresh, and the sidebar count restores on load.
let starredItems = new Set(); // stores item.a keys
try { starredItems = new Set(JSON.parse(localStorage.getItem('tariga_starred_v1') || '[]')); } catch (e) {}

function saveStarred(){
  try { localStorage.setItem('tariga_starred_v1', JSON.stringify([...starredItems])); } catch (e) {}
}

function escAttr(s){
  return String(s == null ? '' : s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function updateStarredNav(){
  const lbl = document.getElementById('starred-nav-label');
  const n = starredItems.size
    + (typeof _wsWords === 'function' ? _wsWords().length : 0)
    + (typeof _wsSents === 'function' ? _wsSents().length : 0);
  if (lbl) lbl.textContent = n > 0 ? `Starred (${n})` : 'Starred items';
}

function starBtnHTML(itemA){
  const isStarred=starredItems.has(itemA);
  const enc=encodeURIComponent(itemA);
  return `<button class="star-btn ${isStarred?'starred':''}" id="star-btn-current" onclick="toggleStarEnc('${enc}');event.stopPropagation()" title="${isStarred?'Unstar':'Star for later'}">${isStarred?'\u2605':'\u2606'}</button>`;
}

function toggleStarEnc(enc){
  const itemA=decodeURIComponent(enc);
  toggleStar(itemA);
}

function toggleStar(itemA){
  if(starredItems.has(itemA)) starredItems.delete(itemA);
  else starredItems.add(itemA);
  saveStarred();
  const lbl=document.getElementById('starred-nav-label');
  if(lbl) lbl.textContent=starredItems.size>0?`Starred (${starredItems.size})`:'Starred items';
  const btn=document.getElementById('star-btn-current');
  if(btn){
    const now=starredItems.has(itemA);
    btn.textContent=now?'\u2605':'\u2606';
    btn.classList.toggle('starred',now);
    btn.title=now?'Unstar':'Star for later';
  }
}

const STAR_SVG = '<svg style="position:absolute;top:16px;right:16px;width:16px;height:16px;color:var(--gold)" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>';

// re-skinned to the practice-modes handoff: intro header + a 2-column grid
// of glass star-cards. Same stores, unstar, drill and speak behavior.
function renderStarred(){
  const ca=document.getElementById('content-area');
  const wsWords = (typeof _wsWords === 'function') ? _wsWords() : [];
  const wsSents = (typeof _wsSents === 'function') ? _wsSents() : [];
  const header = `
      <div class="mode-intro">
        <div class="mode-badge"><svg viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg></div>
        <div>
          <div class="mode-kicker">Build vocab \u00b7 saved</div>
          <div class="mode-lede">The words you flagged to revisit \u2014 pulled from every deck into one place.</div>
        </div>
      </div>`;
  if(starredItems.size===0 && !wsWords.length && !wsSents.length){
    ca.innerHTML=`
      <div class="coach-wrap mode-anim">
        <button class="d2-back" onclick="setMode('home')">\u2190 all modes</button>
        ${header}
        <div class="ts-card" style="text-align:center;padding:44px 40px">
          <div style="font-size:34px;color:var(--gold)">\u2606</div>
          <div style="font-size:16px;color:var(--text-primary);font-weight:600;margin-top:10px">No starred items yet</div>
          <div style="font-size:13.5px;color:var(--text-secondary);margin-top:6px;line-height:1.6">Tap the \u2606 star on any card \u2014 or <b style="color:var(--text-primary)">press and hold any Arabic word anywhere</b> to look it up and star it.</div>
        </div>
      </div>`;
    return;
  }
  const all=[...V1,...V2,...P2,...EXTRA];
  const starred=all.filter(x=>starredItems.has(x.a));
  const totalN = starred.length + wsWords.length + wsSents.length;
  ca.innerHTML=`
    <div class="coach-wrap mode-anim">
      <button class="d2-back" onclick="setMode('home')">\u2190 all modes</button>
      ${header}
      <div style="display:flex;gap:10px;align-items:center;margin-bottom:20px;flex-wrap:wrap">
        <button class="start-cta" style="padding:10px 24px;font-size:14px" onclick="setSrc('starred');setMode('flash')">Drill my starred (${(typeof starredDeckCount==='function'?starredDeckCount():totalN)}) \u2192</button>
        <span style="flex:1"></span>
        <button class="m-chip" onclick="if(confirm('Clear all starred items?')){starredItems.clear();saveStarred();_wsSaveWords([]);_wsSaveSents([]);updateStarredNav();renderStarred();}">Clear all</button>
      </div>

      ${starred.length ? `
      <div class="star-grid">
        ${starred.map(it=>`
        <div class="star-card">
          <button style="position:absolute;top:10px;right:10px;background:none;border:none;cursor:pointer;padding:6px" title="Unstar"
            onclick="toggleStar(${JSON.stringify(it.a).replace(/"/g,'&quot;')});renderStarred()">${STAR_SVG.replace('position:absolute;top:16px;right:16px;','')}</button>
          <div style="font-family:'Instrument Serif','Noto Naskh Arabic',serif;font-size:34px;direction:rtl;text-align:right;color:var(--text-primary);line-height:1.3;padding-right:26px">${escAttr(it.a)}</div>
          <div style="font-size:13px;color:var(--purple);font-style:italic;margin-top:6px">${escAttr(it.p)}</div>
          <div style="font-size:14px;color:var(--text-secondary);margin-top:2px">${escAttr(it.e)}</div>
          <div style="display:flex;align-items:center;gap:8px;margin-top:10px">
            <span style="font-size:11px;color:var(--text-muted);flex:1">${it.src==='v1'?'Video 1':it.src==='v2'?'Video 2':'Glossary'} \u00b7 ${escAttr(it.type)}</span>
            <button class="d2-icon-btn" onclick="sayAr('${encodeURIComponent(it.a)}')" title="hear it">${typeof UI_SPK!=='undefined'?UI_SPK:'\u25b8'}</button>
          </div>
        </div>`).join('')}
      </div>` : ''}

      ${wsWords.length ? `
      <div class="ts-label" style="margin:${starred.length?'26px':'0'} 0 12px">Starred words \u2014 pressed &amp; held anywhere in the app</div>
      <div class="star-grid">
        ${wsWords.slice().reverse().map((w,ri)=>{
          const i = wsWords.length-1-ri;
          return `
        <div class="star-card">
          <button style="position:absolute;top:10px;right:10px;background:none;border:none;cursor:pointer;padding:6px" title="Unstar"
            onclick="(function(){const v=_wsWords();v.splice(${i},1);_wsSaveWords(v);updateStarredNav();renderStarred();})()">${STAR_SVG.replace('position:absolute;top:16px;right:16px;','')}</button>
          <div style="font-family:'Instrument Serif','Noto Naskh Arabic',serif;font-size:30px;direction:rtl;text-align:right;color:var(--text-primary);line-height:1.3;padding-right:26px">${escAttr(w.w)}</div>
          <div style="font-size:13px;color:var(--purple);font-style:italic;margin-top:6px">${escAttr(w.ph||'')}</div>
          <div style="font-size:14px;color:var(--text-secondary);margin-top:2px">${escAttr(w.en||'')}${w.discovered?' <span style="color:var(--gold)">\u00b7 discovered \u2014 not yet verified</span>':''}</div>
          ${w.sent?`<div style="font-size:11.5px;color:var(--text-muted);margin-top:6px" dir="auto">seen in: ${escAttr(w.sent)}</div>`:''}
        </div>`;}).join('')}
      </div>` : ''}

      ${wsSents.length ? `
      <div class="ts-label" style="margin:26px 0 12px">Starred sentences \u2014 the whole construction</div>
      <div style="display:flex;flex-direction:column;gap:10px">
        ${wsSents.slice().reverse().map((s,ri)=>{
          const i = wsSents.length-1-ri;
          return `
        <div style="display:flex;align-items:center;gap:12px;padding:14px 18px;border-radius:12px;background:var(--surface-hover);border:1px solid var(--surface-border)">
          <button style="background:none;border:none;cursor:pointer;color:var(--gold);font-size:15px" title="Unstar"
            onclick="(function(){const v=_wsSents();v.splice(${i},1);_wsSaveSents(v);updateStarredNav();renderStarred();})()">\u2605</button>
          <div style="flex:1;font-family:'Instrument Serif','Noto Naskh Arabic',serif;font-size:19px;direction:rtl;text-align:right;color:var(--text-primary);line-height:1.7" dir="auto">${escAttr(s.ar)}</div>
          <button class="d2-icon-btn" onclick="sayAr('${encodeURIComponent(s.ar)}')" title="hear it">${typeof UI_SPK!=='undefined'?UI_SPK:'\u25b8'}</button>
        </div>`;}).join('')}
      </div>` : ''}
    </div>`;
}

// Restore sidebar count on load
updateStarredNav();
