// Transitions guide — original implementation, restored from the author's prototype
let transFilter='all', transOpenCards={};

function renderTrans(){
  const ca=document.getElementById('content-area');
  const allCats=TRANS_DATA.map(c=>c.cat);
  const filtered=transFilter==='all'?TRANS_DATA:TRANS_DATA.filter(c=>c.cat===transFilter);
  ca.innerHTML=`
    <div class="trans-intro">
      <div class="trans-intro-title">Sound like a native Sudanese speaker</div>
      <div class="trans-intro-body">The fastest path to fluency isn't more vocabulary — it's mastering the connective tissue of the language. These transitions, fillers, and pivots are what make someone sound natural. Learn when to use each one, not just what it means.</div>
    </div>
    <div class="trans-cat-tabs">
      <button class="trans-tab ${transFilter==='all'?'on':''}" onclick="setTransFilter('all')">All</button>
      ${allCats.map(c=>`<button class="trans-tab ${transFilter===c?'on':''}" onclick="setTransFilter('${c}')">${c}</button>`).join('')}
    </div>
    ${filtered.map(cat=>`
      <div class="vl-section-head">${cat.cat}</div>
      ${cat.items.map((item,i)=>{
        const key=cat.cat+i;
        const open=!!transOpenCards[key];
        return `<div class="trans-card">
          <div class="trans-card-head" onclick="toggleTransCard('${key}')">
            <div>
              <div class="trans-phrase-ar">${item.ar}</div>
              <div class="trans-phrase-ph">${item.ph}</div>
              <div class="trans-phrase-en">${item.en}</div>
            </div>
            <div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px">
              <span class="trans-badge ${cat.badge}">${cat.cat}</span>
              <span class="trans-toggle-icon ${open?'open':''}">▾</span>
            </div>
          </div>
          <div class="trans-body ${open?'show':''}" id="tc-${key}">
            <div class="trans-when">When to use it</div>
            <div class="trans-rule">${item.when}</div>
            <div class="trans-when" style="margin-top:10px">The rule</div>
            <div class="trans-rule">${item.rule}</div>
            <div class="trans-when" style="margin-top:10px">Examples in context</div>
            <div class="trans-examples">
              ${item.examples.map(ex=>`<div class="trans-ex">
                <div class="trans-ex-ar">${ex.ar}</div>
                <div class="trans-ex-en">${ex.en}</div>
                ${ex.note?`<div class="trans-ex-note">${ex.note}</div>`:''}
              </div>`).join('')}
            </div>
          </div>
        </div>`;
      }).join('')}
    `).join('')}
  `;
}

function setTransFilter(f){transFilter=f;renderTrans();}

function toggleTransCard(key){
  transOpenCards[key]=!transOpenCards[key];
  const body=document.getElementById('tc-'+key);
  if(body) body.classList.toggle('show',!!transOpenCards[key]);
  const icon=body?.previousElementSibling?.querySelector('.trans-toggle-icon');
  if(icon) icon.classList.toggle('open',!!transOpenCards[key]);
}
