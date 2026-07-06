// Transitions guide — designed screen: accordion cards with a category badge,
// When / The rule / Examples inside.
let transFilter='all', transOpenCards={};

function renderTrans(){
  const ca=document.getElementById('content-area');
  const allCats=TRANS_DATA.map(c=>c.cat);
  const filtered=transFilter==='all'?TRANS_DATA:TRANS_DATA.filter(c=>c.cat===transFilter);
  ca.innerHTML=`
    <div class="coach-wrap">
      <button class="d2-back" onclick="setMode('home')">← all modes</button>
      <div class="d2-title">Transitions guide</div>
      <div class="d2-note">The connectors that make you sound fluent — master these first</div>
      <div class="d2-tab-row">
        <button class="d2-tab ${transFilter==='all'?'on':''}" onclick="setTransFilter('all')">All</button>
        ${allCats.map(c=>`<button class="d2-tab ${transFilter===c?'on':''}" onclick="setTransFilter('${escAttr(c)}')">${escAttr(c)}</button>`).join('')}
      </div>
      ${filtered.map((cat,ci)=>cat.items.map((item,i)=>{
        const key=ci+'-'+i;
        const open=!!transOpenCards[key];
        return `<div class="d2-acc" style="margin-bottom:10px">
          <button class="d2-acc-head" style="align-items:flex-start;justify-content:space-between;padding:16px 18px" onclick="toggleTransCard('${key}')">
            <span>
              <span style="display:block" class="d2-star-ar">${escAttr(item.ar)}</span>
              <span style="display:block" class="d2-acc-ph">${escAttr(item.ph)} · ${escAttr(item.en)}</span>
            </span>
            <span style="display:flex;flex-direction:column;align-items:flex-end;gap:6px">
              <span class="d2-badge">${escAttr(cat.cat)}</span>
              <span class="d2-acc-chev ${open?'open':''}">▾</span>
            </span>
          </button>
          <div class="d2-acc-body" id="tc-${key}" style="${open?'':'display:none'}">
            <div class="d2-when">When</div>
            <div class="d2-when-body">${escAttr(item.when)}</div>
            <div class="d2-when">The rule</div>
            <div class="d2-when-body">${escAttr(item.rule)}</div>
            <div class="d2-when">Examples in context</div>
            ${item.examples.map(ex=>`<div class="d2-inset" style="margin-top:10px">
              <div class="d2-inset-ar" style="font-size:15px">${escAttr(ex.ar)}</div>
              <div class="d2-inset-en">${escAttr(ex.en)}</div>
              ${ex.note?`<div class="d2-item-note">${escAttr(ex.note)}</div>`:''}
            </div>`).join('')}
          </div>
        </div>`;
      }).join('')).join('')}
    </div>
  `;
}

function setTransFilter(f){transFilter=f;renderTrans();}

function toggleTransCard(key){
  transOpenCards[key]=!transOpenCards[key];
  const body=document.getElementById('tc-'+key);
  if(body) body.style.display=transOpenCards[key]?'':'none';
  const icon=body?.previousElementSibling?.querySelector('.d2-acc-chev');
  if(icon) icon.classList.toggle('open',!!transOpenCards[key]);
}
