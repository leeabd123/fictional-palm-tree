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

function renderStarred(){
  const ca=document.getElementById('content-area');
  const wsWords = (typeof _wsWords === 'function') ? _wsWords() : [];
  const wsSents = (typeof _wsSents === 'function') ? _wsSents() : [];
  if(starredItems.size===0 && !wsWords.length && !wsSents.length){
    ca.innerHTML=`
      <div class="coach-wrap">
        <button class="d2-back" onclick="setMode('home')">\u2190 all modes</button>
        <div class="d2-title" style="margin-bottom:16px">Starred items</div>
        <div class="d2-card" style="text-align:center">
          <div style="font-size:34px;color:var(--accent2);text-shadow:0 0 18px rgba(232,201,154,.5)">\u2606</div>
          <div class="d2-prompt" style="margin-top:10px">No starred items yet</div>
          <div class="d2-note" style="margin-top:6px">Tap the \u2606 star on any card \u2014 or <b style="color:var(--text)">press and hold any Arabic word anywhere</b> to look it up and star it.</div>
        </div>
      </div>`;
    return;
  }
  const all=[...V1,...V2,...P2,...EXTRA];
  const starred=all.filter(x=>starredItems.has(x.a));
  const totalN = starred.length + wsWords.length + wsSents.length;
  ca.innerHTML=`
    <div class="coach-wrap">
      <button class="d2-back" onclick="setMode('home')">\u2190 all modes</button>
      <div style="display:flex;justify-content:space-between;align-items:baseline;gap:10px">
        <div class="d2-title" style="margin-bottom:16px">Starred items <span class="sub">\u00b7 ${totalN} saved</span></div>
        <button class="d2-tab" onclick="if(confirm('Clear all starred items?')){starredItems.clear();saveStarred();_wsSaveWords([]);_wsSaveSents([]);updateStarredNav();renderStarred();}">Clear all</button>
      </div>
      <div class="d2-pill-row" style="margin-bottom:16px">
        <button class="d2-pill-gold" onclick="setSrc('starred');setMode('flash')">\ud83c\udccf Drill my starred (${(typeof starredDeckCount==='function'?starredDeckCount():totalN)}) \u2192</button>
      </div>
      ${wsWords.length ? `
      <div class="j2-sec-label">Starred words \u2014 pressed & held anywhere in the app</div>
      ${wsWords.slice().reverse().map((w,ri)=>{
        const i = wsWords.length-1-ri;
        return `
      <div class="d2-star-row" style="align-items:center">
        <button class="d2-star-ico" onclick="(function(){const v=_wsWords();v.splice(${i},1);_wsSaveWords(v);updateStarredNav();renderStarred();})()" title="Unstar">\u2605</button>
        <div style="flex:1">
          <div class="d2-star-ar" style="font-size:18px">${escAttr(w.w)}</div>
          <div class="d2-star-ph">${escAttr(w.ph||'')}</div>
          <div class="d2-star-en">${escAttr(w.en||'')} ${w.discovered?'<span style="color:var(--accent2)">\u00b7 \u2728 discovered \u2014 not yet community-verified</span>':''}</div>
          ${w.sent?`<div class="d2-item-note" style="margin-top:4px" dir="auto">seen in: ${escAttr(w.sent)}</div>`:''}
        </div>
        <button class="d2-icon-btn" onclick="sayAr('${encodeURIComponent(w.w)}')" title="hear it">\ud83d\udd0a</button>
      </div>`;}).join('')}` : ''}
      ${wsSents.length ? `
      <div class="j2-sec-label" style="margin-top:${wsWords.length?'20px':'0'}">Starred sentences \u2014 the whole construction</div>
      ${wsSents.slice().reverse().map((s,ri)=>{
        const i = wsSents.length-1-ri;
        return `
      <div class="d2-star-row" style="align-items:center">
        <button class="d2-star-ico" onclick="(function(){const v=_wsSents();v.splice(${i},1);_wsSaveSents(v);updateStarredNav();renderStarred();})()" title="Unstar">\u2605</button>
        <div style="flex:1"><div class="d2-star-ar" style="font-size:15.5px" dir="auto">${escAttr(s.ar)}</div></div>
        <button class="d2-icon-btn" onclick="sayAr('${encodeURIComponent(s.ar)}')" title="hear it">\ud83d\udd0a</button>
      </div>`;}).join('')}` : ''}
      ${starred.length ? `<div class="j2-sec-label" style="margin-top:${(wsWords.length||wsSents.length)?'20px':'0'}">Starred cards</div>` : ''}
      ${starred.map(it=>`
      <div class="d2-star-row">
        <button class="d2-star-ico" onclick="toggleStar(${JSON.stringify(it.a).replace(/"/g,'&quot;')});renderStarred()" title="Unstar">\u2605</button>
        <div style="flex:1">
          <div class="d2-star-ar">${escAttr(it.a)}</div>
          <div class="d2-star-ph">${escAttr(it.p)}</div>
          <div class="d2-star-en">${escAttr(it.e)}</div>
          <div class="d2-inset" style="margin-top:8px">
            <div class="d2-inset-ar" style="font-size:14px">${escAttr(it.ex)}</div>
            <div class="d2-inset-en">${escAttr(it.exen)}</div>
          </div>
          <div class="d2-item-note" style="margin-top:6px">${it.src==='v1'?'Video 1':it.src==='v2'?'Video 2':'Glossary'} \u00b7 ${escAttr(it.type)}</div>
        </div>
        <button class="d2-icon-btn" onclick="sayAr('${encodeURIComponent(it.a)}')" title="hear it">\ud83d\udd0a</button>
      </div>`).join('')}
    </div>`;
}

// Restore sidebar count on load
updateStarredNav();
