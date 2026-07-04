// Transitions guide — reference for connector phrases, grouped by function
let transCatIdx=-1; // -1 = all categories
let transOpenCards=new Set();

function renderTrans(){
  const ca=document.getElementById('content-area');
  const cats=transCatIdx===-1?TRANS_DATA:[TRANS_DATA[transCatIdx]];
  let cardNum=0;

  ca.innerHTML=`
    <div class="trans-intro">
      <div class="trans-intro-title">The connective tissue of Sudanese speech</div>
      <div class="trans-intro-body">Fluent speakers don't just know words — they glide between thoughts using these transition phrases. Each one below is a natural way many Sudanese speakers connect ideas (never the only way). Click any phrase to see when and how to use it.</div>
    </div>
    <div class="trans-cat-tabs">
      <button class="trans-tab ${transCatIdx===-1?'on':''}" onclick="setTransCat(-1)">All</button>
      ${TRANS_DATA.map((c,i)=>`<button class="trans-tab ${transCatIdx===i?'on':''}" onclick="setTransCat(${i})">${c.cat}</button>`).join('')}
    </div>
    ${cats.map(c=>c.items.map(item=>{
      const id=cardNum++;
      const open=transOpenCards.has(item.ar);
      return `
      <div class="trans-card">
        <div class="trans-card-head" onclick="toggleTransCard('${id}')" data-ar="${item.ar.replace(/"/g,'&quot;')}" id="trans-head-${id}">
          <div style="flex:1;min-width:0">
            <div class="trans-phrase-ar">${item.ar}</div>
            <div class="trans-phrase-ph">${item.ph}</div>
            <div class="trans-phrase-en">${item.en}</div>
          </div>
          <span class="trans-badge ${c.badge}">${c.cat}</span>
          <span class="trans-toggle-icon ${open?'open':''}" id="trans-icon-${id}">▾</span>
        </div>
        <div class="trans-body ${open?'show':''}" id="trans-body-${id}">
          <div style="padding-top:14px">
            <div class="trans-when">WHEN TO USE IT</div>
            <div class="trans-rule">${item.when}</div>
            <div class="trans-when">HOW IT WORKS</div>
            <div class="trans-rule">${item.rule}</div>
            <div class="trans-examples">
              ${(item.examples||[]).map(ex=>`
                <div class="trans-ex">
                  <div class="trans-ex-ar">${ex.ar}</div>
                  <div class="trans-ex-en">${ex.en}</div>
                  <div class="trans-ex-note">${ex.note}</div>
                </div>`).join('')}
            </div>
          </div>
        </div>
      </div>`;
    }).join('')).join('')}
  `;
}

function setTransCat(i){
  transCatIdx=i;
  renderTrans();
}

function toggleTransCard(id){
  const head=document.getElementById('trans-head-'+id);
  const body=document.getElementById('trans-body-'+id);
  const icon=document.getElementById('trans-icon-'+id);
  if(!body)return;
  const nowOpen=!body.classList.contains('show');
  body.classList.toggle('show',nowOpen);
  if(icon)icon.classList.toggle('open',nowOpen);
  const ar=head?head.dataset.ar:null;
  if(ar){ nowOpen?transOpenCards.add(ar):transOpenCards.delete(ar); }
}
