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
    ca.innerHTML=`
      <div class="coach-wrap">
        <button class="d2-back" onclick="setMode('home')">\u2190 all modes</button>
        <div class="d2-title" style="margin-bottom:16px">Starred items</div>
        <div class="d2-card" style="text-align:center">
          <div style="font-size:34px;color:var(--accent2);text-shadow:0 0 18px rgba(232,201,154,.5)">\u2606</div>
          <div class="d2-prompt" style="margin-top:10px">No starred items yet</div>
          <div class="d2-note" style="margin-top:6px">While using any mode, tap the \u2606 star on a card to save it here for review.</div>
        </div>
      </div>`;
    return;
  }
  const all=[...V1,...V2,...P2,...EXTRA];
  const starred=all.filter(x=>starredItems.has(x.a));
  ca.innerHTML=`
    <div class="coach-wrap">
      <button class="d2-back" onclick="setMode('home')">\u2190 all modes</button>
      <div style="display:flex;justify-content:space-between;align-items:baseline;gap:10px">
        <div class="d2-title" style="margin-bottom:16px">Starred items <span class="sub">\u00b7 ${starred.length} saved</span></div>
        <button class="d2-tab" onclick="if(confirm('Clear all starred items?')){starredItems.clear();saveStarred();updateStarredNav();renderStarred();}">Clear all</button>
      </div>
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
