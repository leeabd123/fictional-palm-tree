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
  if (lbl) lbl.textContent = starredItems.size > 0 ? `Starred (${starredItems.size})` : 'Starred items';
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
  if(starredItems.size===0){
    ca.innerHTML=`<div class="starred-empty">
      <div class="starred-empty-icon">☆</div>
      <div class="starred-empty-title">No starred items yet</div>
      <div class="starred-empty-body">While using any mode, tap the ☆ star icon on any card to save it here for review.</div>
    </div>`;
    return;
  }
  const all=[...V1,...V2,...P2,...EXTRA];
  const starred=all.filter(x=>starredItems.has(x.a));
  const byCat={};
  starred.forEach(it=>{if(!byCat[it.cat])byCat[it.cat]=[];byCat[it.cat].push(it);});
  let html=`<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
    <div style="font-size:14px;color:var(--text2)">${starred.length} starred item${starred.length!==1?'s':''}</div>
    <button class="starred-clear-btn" onclick="if(confirm('Clear all starred items?')){starredItems.clear();saveStarred();const l=document.getElementById('starred-nav-label');if(l)l.textContent='Starred items';renderStarred();}">Clear all</button>
  </div>`;
  Object.keys(byCat).sort().forEach(cat=>{
    html+=`<div class="starred-section-head">${cat}</div>`;
    byCat[cat].forEach(it=>{
      const srcLbl=it.src==='v1'?'Video 1':it.src==='v2'?'Video 2':'Glossary';
      html+=`<div class="starred-item">
        <div class="starred-item-body">
          <div class="starred-item-ar">${it.a}</div>
          <div class="starred-item-ph">${it.p}</div>
          <div class="starred-item-en">${it.e}</div>
          <div class="ctx-block" style="margin-top:8px;font-size:12px">${it.ctx}</div>
          <div class="deep-ex-block" style="margin-top:8px"><div class="deep-ex-ar">${it.ex}</div><div class="ex-ph-line">${getExPh(it)}</div><div class="deep-ex-en">${it.exen}</div></div>
          <div class="starred-item-src">${srcLbl} · ${it.type}</div>
        </div>
        <button class="star-btn starred" onclick="toggleStar(${JSON.stringify(it.a)});renderStarred()">★</button>
      </div>`;
    });
  });
  ca.innerHTML=html;
}

// Restore sidebar count on load
updateStarredNav();
