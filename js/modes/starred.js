// Starred items — star infrastructure (persisted) + review list
let starredSet=new Set();
try{ starredSet=new Set(JSON.parse(localStorage.getItem('tariga_starred_v1')||'[]')); }catch(e){}

function saveStarred(){
  try{ localStorage.setItem('tariga_starred_v1',JSON.stringify([...starredSet])); }catch(e){}
}

function escAttr(s){
  return String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function starBtnHTML(a){
  const on=starredSet.has(a);
  return `<button class="star-btn ${on?'starred':''}" data-star="${escAttr(a)}" onclick="event.stopPropagation();toggleStar(this.dataset.star)" title="${on?'Remove from starred':'Star to review later'}">${on?'★':'☆'}</button>`;
}

function toggleStar(a){
  if(starredSet.has(a)) starredSet.delete(a); else starredSet.add(a);
  saveStarred();
  const on=starredSet.has(a);
  document.querySelectorAll('.star-btn').forEach(btn=>{
    if(btn.dataset.star===a){
      btn.classList.toggle('starred',on);
      btn.textContent=on?'★':'☆';
      btn.title=on?'Remove from starred':'Star to review later';
    }
  });
  updateStarredNav();
  if(mode==='starred') renderStarred();
}

function updateStarredNav(){
  const el=document.getElementById('starred-nav-label');
  if(!el)return;
  const n=starredSet.size;
  el.innerHTML=`Starred items${n?` <span class="star-count">${n}</span>`:''}`;
}

function clearStarred(){
  starredSet.clear();
  saveStarred();
  updateStarredNav();
  renderStarred();
}

function renderStarred(){
  const ca=document.getElementById('content-area');
  const all=[...V1,...V2,...P2,...EXTRA];
  const seen=new Set();
  const items=all.filter(x=>{
    if(!starredSet.has(x.a)||seen.has(x.a))return false;
    seen.add(x.a);return true;
  });

  if(!items.length){
    ca.innerHTML=`
      <div class="starred-empty">
        <div class="starred-empty-icon">☆</div>
        <div class="starred-empty-title">Nothing starred yet</div>
        <div class="starred-empty-body">Tap the ☆ on any flashcard or deep card to collect the words you want to come back to.<br>They'll wait for you here — saved even after you close the page.</div>
      </div>
    `;
    return;
  }

  const groups=[
    {label:'From Video 1 — Solja',src:'v1'},
    {label:'From Video 2 — Ala',src:'v2'},
    {label:'From the glossary',src:'p2'},
  ];

  ca.innerHTML=`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
      <div style="font-size:13px;color:var(--text2)">${items.length} starred ${items.length===1?'item':'items'} — your personal review deck</div>
      <button class="starred-clear-btn" onclick="clearStarred()">Clear all</button>
    </div>
    ${groups.map(g=>{
      const gi=items.filter(x=>x.src===g.src);
      if(!gi.length)return '';
      return `
        <div class="starred-section-head">${g.label}</div>
        ${gi.map(it=>`
          <div class="starred-item">
            <div class="starred-item-body">
              <div class="starred-item-ar">${it.a}</div>
              <div class="starred-item-ph">${it.p}</div>
              <div class="starred-item-en">${it.e}</div>
              <div class="starred-item-src">${it.cat} · ${it.type}</div>
            </div>
            ${starBtnHTML(it.a)}
          </div>`).join('')}
      `;
    }).join('')}
  `;
}

// Reflect any previously-saved stars in the sidebar on load
updateStarredNav();
